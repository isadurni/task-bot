from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
import os
from dotenv import load_dotenv
import json
from typing import Optional, Dict, Any
from fastapi import HTTPException
from googleapiclient.discovery import build

load_dotenv()

class GoogleAuthService:
    def __init__(self):
        self.redirect_uri = "http://localhost:8000/callback"
        self.scopes = [
            "openid",
            "https://www.googleapis.com/auth/calendar",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email"
        ]
        self.client_config = self._load_client_config()

    def _load_client_config(self):
        """Load the OAuth 2.0 client configuration."""
        return {
            "web": {
                "client_id": os.getenv("GOOGLE_CLIENT_ID"),
                "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": [self.redirect_uri]
            }
        }

    def get_authorization_url(self):
        """Get the authorization URL for the OAuth flow."""
        flow = Flow.from_client_config(
            self.client_config,
            scopes=self.scopes,
            redirect_uri=self.redirect_uri
        )
        return flow.authorization_url(
            access_type="offline",
            include_granted_scopes="true",
            prompt="consent"
        )[0]

    def get_credentials_from_code(self, code: str) -> Credentials:
        """Exchange the authorization code for credentials."""
        flow = Flow.from_client_config(
            self.client_config,
            scopes=self.scopes,
            redirect_uri=self.redirect_uri
        )
        try:
            flow.fetch_token(code=code)
            return flow.credentials
        except Exception as e:
            # If there's a scope mismatch, try with the new scopes
            if "Scope has changed" in str(e):
                flow = Flow.from_client_config(
                    self.client_config,
                    scopes=flow.oauth2session.scope,
                    redirect_uri=self.redirect_uri
                )
                flow.fetch_token(code=code)
                return flow.credentials
            raise e

    def refresh_credentials(self, credentials: Credentials) -> Credentials:
        """Refresh expired credentials."""
        if credentials and credentials.expired and credentials.refresh_token:
            credentials.refresh(Request())
        return credentials

    def get_user_info(self, credentials: Credentials) -> Dict[str, Any]:
        """Get user information from Google."""
        try:
            service = build('oauth2', 'v2', credentials=credentials)
            user_info = service.userinfo().get().execute()
            print("User info response:", user_info)  # Debug log
            return {
                'name': user_info.get('name'),
                'email': user_info.get('email'),
                'picture': user_info.get('picture')
            }
        except Exception as e:
            print("Error in get_user_info:", str(e))  # Debug log
            raise HTTPException(status_code=500, detail=f"Error fetching user info: {str(e)}") 