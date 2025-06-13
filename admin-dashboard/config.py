# config.py
import os
import streamlit as st
from dotenv import load_dotenv

def initialize_config():
    """Initialize configuration from environment variables and .env file"""
    # Load environment variables from .env file if present
    load_dotenv()
    
    # Set default values if not present in environment
    if "SUPABASE_URL" not in os.environ:
        os.environ["SUPABASE_URL"] = "https://otpimqedxtwpuvbvdxhz.supabase.co"
    
    if "SUPABASE_KEY" not in os.environ:
        # This is the anon key and can be committed safely
        os.environ["SUPABASE_KEY"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90cGltcWVkeHR3cHV2YnZkeGh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNzk2NzEsImV4cCI6MjA2Mjk1NTY3MX0.mJ-rhSsKJc9ySQnqFq12v4A_Mc05ktdoBWyvGqtifxQ"
    
    if "SESSION_ID" not in os.environ:
        os.environ["SESSION_ID"] = "io5xn"