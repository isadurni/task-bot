# backend/main.py
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from pydantic import BaseModel
import os
from src.agents.calendar_agent import CalendarAgent
from src.services.google_auth import GoogleAuthService
from dotenv import load_dotenv
from urllib.parse import unquote
from google.oauth2.credentials import Credentials
import json
from googleapiclient.discovery import build
from datetime import datetime

load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
auth_service = GoogleAuthService()
calendar_agent = None  # Will be initialized after OAuth

class ChatRequest(BaseModel):
    content: str

@app.get("/me")
async def me(request: Request):
    """Check if the user is authenticated and return user info."""
    session = request.cookies.get("session")
    if session:
        session_data = json.loads(session)
        print("Session data in /me:", session_data)  # Debug log
        return {
            "authenticated": True,
            "user_info": session_data.get("user_info", {})
        }
    return {"authenticated": False}


@app.get("/auth")
async def auth():
    """Start the OAuth flow."""
    auth_url = auth_service.get_authorization_url()
    return {"auth_url": auth_url}

@app.get("/test-calendar")
async def test_calendar(request: Request):
    try:
        # Get session cookie
        session = request.cookies.get("session")
        if not session:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        # Parse session data
        session_data = json.loads(session)
        credentials = Credentials(
            token=session_data["token"],
            refresh_token=session_data["refresh_token"],
            token_uri=session_data["token_uri"],
            client_id=session_data["client_id"],
            client_secret=session_data["client_secret"],
            scopes=session_data["scopes"]
        )
        
        # Build calendar service
        service = build('calendar', 'v3', credentials=credentials)
        
        # Get the next 5 events
        now = datetime.utcnow().isoformat() + 'Z'
        events_result = service.events().list(
            calendarId='primary',
            timeMin=now,
            maxResults=5,
            singleEvents=True,
            orderBy='startTime'
        ).execute()
        events = events_result.get('items', [])
        
        if not events:
            return {"message": "No upcoming events found"}
            
        # Format events for response
        formatted_events = []
        for event in events:
            start = event['start'].get('dateTime', event['start'].get('date'))
            formatted_events.append({
                'summary': event['summary'],
                'start': start,
                'id': event['id']
            })
            
        return {"events": formatted_events}
        
    except Exception as e:
        print(f"Error in test-calendar: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/callback")
async def callback(code: str, state: str, request: Request, response: Response):
    """Handle the OAuth callback."""
    try:
        credentials = auth_service.get_credentials_from_code(code)
        user_info = auth_service.get_user_info(credentials)
        print("User info in callback:", user_info)  # Debug log
        
        # Store credentials and user info in session
        session_data = {
            "token": credentials.token,
            "refresh_token": credentials.refresh_token,
            "token_uri": credentials.token_uri,
            "client_id": credentials.client_id,
            "client_secret": credentials.client_secret,
            "scopes": credentials.scopes,
            "user_info": user_info
        }
        print("Session data:", session_data)  # Debug log
        
        # Redirect to frontend with the code
        frontend_url = "http://localhost:5173"
        response = RedirectResponse(url=frontend_url)
        response.set_cookie(
            key="session",
            value=json.dumps(session_data),
            httponly=True,
            secure=False,  # Set to True in production with HTTPS
            samesite="lax",
            max_age=3600  # 1 hour
        )
        return response
    except Exception as e:
        print(f"Error in callback: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/chat")
async def chat(request: ChatRequest, req: Request):
    """Handle chat messages."""
    try:
        # Get session cookie
        session = req.cookies.get("session")
        if not session:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        # Parse session data
        session_data = json.loads(session)
        credentials = Credentials(
            token=session_data["token"],
            refresh_token=session_data["refresh_token"],
            token_uri=session_data["token_uri"],
            client_id=session_data["client_id"],
            client_secret=session_data["client_secret"],
            scopes=session_data["scopes"]
        )
        
        # Initialize agent with credentials
        agent = CalendarAgent(
            openai_api_key=os.getenv("OPENAI_API_KEY"),
            credentials=credentials
        )
        response = agent.process_message(request.content)

        # Save messages to chat.json
        try:
            chat_file_path = os.path.join(os.path.dirname(__file__), 'src', 'chat.json')
            
            # Read existing chat history or create new if doesn't exist
            try:
                with open(chat_file_path, 'r') as f:
                    chat_data = json.load(f)
            except (FileNotFoundError, json.JSONDecodeError):
                chat_data = {"messages": []}

            # Add new messages
            chat_data['messages'].append({
                "sender": "You",
                "content": request.content
            })
            chat_data['messages'].append({
                "sender": "Bot",
                "content": response
            })

            # Write updated chat history
            with open(chat_file_path, 'w') as f:
                json.dump(chat_data, f, indent=2)

        except Exception as e:
            print(f"Error saving chat history: {str(e)}")

        return {"response": response}
    except Exception as e:
        import traceback
        print(f"Error in chat: {str(e)}")
        print("Full traceback:")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/chat-history")
async def get_chat_history():
    """Get the chat history."""
    try:
        chat_file_path = os.path.join(os.path.dirname(__file__), 'src', 'chat.json')
        with open(chat_file_path, 'r') as f:
            chat_data = json.load(f)
        return chat_data
    except Exception as e:
        print(f"Error reading chat history: {str(e)}")
        return {"messages": []}
