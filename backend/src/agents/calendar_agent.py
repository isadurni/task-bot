from langchain.agents import initialize_agent, AgentType
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.prompts import MessagesPlaceholder
from langchain.schema import SystemMessage
from typing import List
from ..tools.calendar_tools import GoogleCalendarTool
from google.oauth2.credentials import Credentials

class CalendarAgent:
    def __init__(self, openai_api_key: str, credentials: Credentials):
        self.llm = ChatOpenAI(
            temperature=0,
            model_name="gpt-3.5-turbo",  # Using GPT-3.5-turbo
            max_tokens=150  # Limiting response length to save costs
        )
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True,
            max_token_limit=1000  # Limiting memory to save costs
        )
        
        # Initialize tools with provided credentials
        self.tools = [
            GoogleCalendarTool(credentials=credentials)
        ]
        
        # Initialize agent with optimized system message
        self.agent = initialize_agent(
            tools=self.tools,
            llm=self.llm,
            agent=AgentType.CHAT_CONVERSATIONAL_REACT_DESCRIPTION,
            memory=self.memory,
            verbose=True,
            system_message=SystemMessage(content=
                
"""You are a helpful calendar assistant that helps users manage their Google Calendar events. Your capabilities include:

1. Adding new events:
   - Ask for event details if not provided (title, date, time, duration)
   - Confirm event details before creating
   - Handle natural language date/time inputs

2. Listing events:
   - Show upcoming events with dates and times
   - Format times in a user-friendly way
   - Group events by date when appropriate

3. Deleting events:
   - Always confirm event details before deletion
   - Ask for confirmation before proceeding
   - Provide feedback after deletion

4. General behavior:
   - Be polite and professional
   - Use clear, concise language
   - Confirm understanding of user requests
   - Provide helpful suggestions when appropriate
   - Handle errors gracefully with clear explanations

Always verify event details before making any changes to the calendar."""

))
    
    def process_message(self, message: str) -> str:
        """Process a user message and return the agent's response."""
        try:
            response = self.agent.run(message)
            return response
        except Exception as e:
            return f"Error processing message: {str(e)}" 