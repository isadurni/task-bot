from typing import Optional, Type, Any
from langchain.tools import BaseTool
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from datetime import datetime, timedelta
from pydantic import BaseModel, Field
import pytz
import re

class GoogleCalendarTool(BaseTool):
    name: str = "google_calendar"
    description: str = "Tool for interacting with Google Calendar"
    credentials: Optional[Credentials] = None
    service: Optional[Any] = None
    timezone: pytz.timezone = Field(default_factory=lambda: pytz.timezone('America/New_York'))

    def __init__(self, credentials: Credentials):
        super().__init__()
        self.credentials = credentials
        self.service = build('calendar', 'v3', credentials=credentials)

    def _run(self, query: str) -> str:
        """Run the tool."""
        try:
            # Check if this is an add event request
            if "add" in query.lower() or "create" in query.lower() or "schedule" in query.lower():
                # Get current time in local timezone
                now = datetime.now(self.timezone)
                
                # Parse day from query
                day_map = {
                    'monday': 0, 'tuesday': 1, 'wednesday': 2, 'thursday': 3,
                    'friday': 4, 'saturday': 5, 'sunday': 6,
                    'mon': 0, 'tue': 1, 'wed': 2, 'thu': 3,
                    'fri': 4, 'sat': 5, 'sun': 6
                }
                
                target_date = None
                for day_name, day_num in day_map.items():
                    if day_name in query.lower():
                        # Calculate days until target day
                        current_day = now.weekday()
                        days_until = (day_num - current_day) % 7
                        if days_until == 0:  # If today, move to next week
                            days_until = 7
                        target_date = now + timedelta(days=days_until)
                        break
                
                if not target_date:
                    # Default to tomorrow if no day specified
                    target_date = now + timedelta(days=1)
                
                # Parse time from query (e.g., "4pm", "4:00pm", "16:00")
                time_match = re.search(r'(\d{1,2})(?::(\d{2}))?\s*(am|pm)?', query.lower())
                if time_match:
                    hour = int(time_match.group(1))
                    minute = int(time_match.group(2) or 0)
                    ampm = time_match.group(3)
                    
                    # Convert to 24-hour format if needed
                    if ampm == 'pm' and hour < 12:
                        hour += 12
                    elif ampm == 'am' and hour == 12:
                        hour = 0
                else:
                    # Default to current time if no time specified
                    hour = now.hour
                    minute = now.minute
                
                # Set the event time
                start_time = target_date.replace(hour=hour, minute=minute, second=0, microsecond=0)
                end_time = start_time + timedelta(hours=1)
                
                event_details = {
                    'summary': query,
                    'start_time': start_time.isoformat(),
                    'end_time': end_time.isoformat()
                }
                return self._add_event(event_details)
            
            # If not adding an event, list events as before
            events_result = self.service.events().list(
                calendarId='primary',
                timeMin=datetime.now(self.timezone).isoformat(),
                maxResults=10,
                singleEvents=True,
                orderBy='startTime'
            ).execute()
            events = events_result.get('items', [])

            if not events:
                return 'No upcoming events found.'

            # Format the events
            event_list = []
            for event in events:
                start = event['start'].get('dateTime', event['start'].get('date'))
                event_list.append(f"{start} - {event['summary']}")

            return '\n'.join(event_list)
        except Exception as e:
            return f"Error accessing calendar: {str(e)}"

    async def _arun(self, query: str) -> str:
        """Run the tool asynchronously."""
        return self._run(query)

    def _add_event(self, event_details: dict) -> str:
        """Add a new event to the calendar."""
        try:
            event = {
                'summary': event_details.get('summary', 'New Event'),
                'description': event_details.get('description', ''),
                'start': {
                    'dateTime': event_details.get('start_time'),
                    'timeZone': 'America/New_York',
                },
                'end': {
                    'dateTime': event_details.get('end_time'),
                    'timeZone': 'America/New_York',
                },
            }
            
            event = self.service.events().insert(calendarId='primary', body=event).execute()
            return f"Event created: {event.get('htmlLink')}"
        except Exception as e:
            return f"Error creating event: {str(e)}"
    
    def _list_events(self) -> str:
        """List upcoming events."""
        try:
            now = datetime.utcnow().isoformat() + 'Z'
            events_result = self.service.events().list(
                calendarId='primary',
                timeMin=now,
                maxResults=10,
                singleEvents=True,
                orderBy='startTime'
            ).execute()
            events = events_result.get('items', [])
            
            if not events:
                return 'No upcoming events found.'
            
            event_list = []
            for event in events:
                start = event['start'].get('dateTime', event['start'].get('date'))
                event_list.append(f"{event['summary']} ({start})")
            
            return "\n".join(event_list)
        except Exception as e:
            return f"Error listing events: {str(e)}"
    
    def _delete_event(self, event_details: dict) -> str:
        """Delete an event from the calendar."""
        try:
            event_id = event_details.get('event_id')
            if not event_id:
                return "Error: event_id is required"
            
            self.service.events().delete(calendarId='primary', eventId=event_id).execute()
            return f"Event {event_id} deleted successfully"
        except Exception as e:
            return f"Error deleting event: {str(e)}" 