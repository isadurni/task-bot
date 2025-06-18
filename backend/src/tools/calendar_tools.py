from typing import Optional, Type, Any
from langchain.tools import BaseTool
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from datetime import datetime, timedelta
from pydantic import BaseModel, Field
import pytz
import re
from langchain.chat_models import ChatOpenAI

class GoogleCalendarTool(BaseTool):
    name: str = "google_calendar"
    description: str = '''
        Use this tool to manage the user's Google Calendar effectively. Invoke this tool whenever the user mentions any activity, event, meeting, or task they want to schedule, view, or delete. The tool is designed to handle natural language inputs related to calendar management, such as:

        - Creating events with natural language like "schedule lunch with Sarah on Friday at 2pm," "play tennis tomorrow," or "meeting next Tuesday at 11am."
        - Listing upcoming events when asked "what are my next events?" or "show me my calendar."
        - Deleting events when provided with an event identifier or description, but only after confirming with the user.

        Capabilities:

        1. Add Events:  
        - Parse natural language input to extract event title, date, time, and duration.  
        - If any critical details (title, date, or time) are missing, prompt the user for clarification before scheduling.  
        - Use default values carefully: assume 1-hour duration if unspecified, and default to tomorrow if no date is given.  
        - Confirm all event details with the user before creating the event.

        2. List Events:  
        - Provide a list of the next 10 upcoming events from the current time.  
        - Format event details clearly, showing date, start time, and title.  
        - Offer to provide more details or additional events if requested.

        3. Delete Events:  
        - Require explicit event identification before deletion.  
        - Always ask the user to confirm the deletion by repeating the event title and scheduled time.  
        - Confirm after deletion that the event has been removed.

        Inputs:  
        - A single string containing the user's request, e.g., "add a call with John next Tuesday at 11am," "show me my upcoming events," or "delete meeting with Sarah on Friday."

        Outputs:  
        - A natural language confirmation of actions taken, such as successful event creation with a link, a list of upcoming events, or confirmation of deletion.  
        - Requests for more information if the input lacks necessary details.

        Notes:  
        - This tool operates using the user's timezone (America/New_York).  
        - It handles common date/time formats and weekday names naturally.  
        - Always prioritize confirming details with the user to avoid incorrect scheduling or deletion.  
        - Be proactive in asking for missing event details rather than making assumptions.

        Example usage scenarios:  
        - User: "Schedule a dentist appointment next Monday at 3pm."  
        - Tool: Parses and confirms details before creating the event.  
        - User: "What's on my calendar this week?"  
        - Tool: Lists upcoming events.  
        - User: "Delete my lunch with Mike on Thursday."  
        - Tool: Finds matching event, asks for confirmation, then deletes it upon approval.

        Use this tool carefully and thoughtfully to ensure the user's calendar remains accurate and up-to-date.
        The agent should use the information returned by this tool to formulate its natural language response to the user.
        Do NOT try to parse natural language or formulate user-facing responses within this tool. That is the agent's job.
        This tool is purely for interacting with the Google Calendar API.
        '''
    credentials: Optional[Credentials] = None
    service: Optional[Any] = None
    timezone: pytz.timezone = Field(default_factory=lambda: pytz.timezone('America/New_York'))
    llm: ChatOpenAI = Field(default_factory=lambda: ChatOpenAI(temperature=0.7))

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

    def _clean_event_title(self, title: str) -> str:
        """Clean up the event title to be more concise."""
        # Remove common scheduling words and time references
        title = title.lower()
        remove_words = [
            'schedule', 'add', 'create', 'set up', 'book',
            'from', 'to', 'at', 'on', 'for',
            'tomorrow', 'today', 'next', 'this', 'that',
            'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
            'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun',
            'am', 'pm', 'morning', 'afternoon', 'evening', 'night'
        ]
        
        # Remove time patterns (e.g., "4pm", "4:00pm", "16:00")
        title = re.sub(r'\d{1,2}(?::\d{2})?\s*(?:am|pm)?', '', title)
        
        # Remove the words
        words = title.split()
        cleaned_words = [word for word in words if word not in remove_words]
        
        # Join the remaining words and capitalize
        cleaned_title = ' '.join(cleaned_words).strip()
        if cleaned_title:
            return cleaned_title.title()
        return "New Event"

    def _add_event(self, event_details: dict) -> str:
        """Add a new event to the calendar."""
        try:
            # Clean up the event title
            original_title = event_details.get('summary', 'New Event')
            cleaned_title = self._clean_event_title(original_title)
            
            event = {
                'summary': cleaned_title,
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
            
            # Parse the event details for the LLM
            start_time = datetime.fromisoformat(event_details['start_time'].replace('Z', '+00:00'))
            time_str = start_time.strftime('%I:%M %p').lstrip('0')
            day_str = start_time.strftime('%A')
            
            # Create a prompt for the LLM to generate a natural response
            prompt = f"""Generate a natural, conversational response confirming that an event has been scheduled.
            Event details:
            - Title: {cleaned_title}
            - Time: {time_str}
            - Day: {day_str}
            
            The response should be friendly and natural, like how a human assistant would confirm scheduling an event.
            Keep it concise and clear. Do not include any technical details or links."""
            
            # Use the LLM to generate the response
            response = self.llm.predict(prompt)
            return response.strip()
            
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
            
            # Format events for the LLM
            formatted_events = []
            for event in events:
                start = event['start'].get('dateTime', event['start'].get('date'))
                start_time = datetime.fromisoformat(start.replace('Z', '+00:00'))
                time_str = start_time.strftime('%I:%M %p').lstrip('0')
                day_str = start_time.strftime('%A')
                formatted_events.append(f"- {event['summary']} on {day_str} at {time_str}")
            
            events_text = "\n".join(formatted_events)
            
            # Create a prompt for the LLM to generate a natural response
            prompt = f"""Generate a natural, conversational response listing upcoming events.
            Here are the events:
            {events_text}
            
            The response should be friendly and natural, like how a human assistant would tell someone about their upcoming schedule.
            Keep it concise and clear. Do not include any technical details."""
            
            # Use the LLM to generate the response
            response = self.llm.predict(prompt)
            return response.strip()
            
        except Exception as e:
            return f"Error listing events: {str(e)}"
    
    def _delete_event(self, event_details: dict) -> str:
        """Delete an event from the calendar."""
        try:
            event_id = event_details.get('event_id')
            if not event_id:
                return "Error: event_id is required"
            
            # Get event details before deleting
            event = self.service.events().get(calendarId='primary', eventId=event_id).execute()
            event_title = event.get('summary', 'the event')
            start = event['start'].get('dateTime', event['start'].get('date'))
            start_time = datetime.fromisoformat(start.replace('Z', '+00:00'))
            time_str = start_time.strftime('%I:%M %p').lstrip('0')
            day_str = start_time.strftime('%A')
            
            # Delete the event
            self.service.events().delete(calendarId='primary', eventId=event_id).execute()
            
            # Create a prompt for the LLM to generate a natural response
            prompt = f"""Generate a natural, conversational response confirming that an event has been deleted.
            Event details:
            - Title: {event_title}
            - Time: {time_str}
            - Day: {day_str}
            
            The response should be friendly and natural, like how a human assistant would confirm deleting an event.
            Keep it concise and clear. Do not include any technical details."""
            
            # Use the LLM to generate the response
            response = self.llm.predict(prompt)
            return response.strip()
            
        except Exception as e:
            return f"Error deleting event: {str(e)}" 