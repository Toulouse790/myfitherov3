# utils.py
import pandas as pd
import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import numpy as np
from supabase import Client
import os
import json

def format_number(number):
    """Format number with K, M, B suffixes"""
    if number is None:
        return "0"
    
    if number >= 1_000_000_000:
        return f"{number / 1_000_000_000:.1f}B"
    elif number >= 1_000_000:
        return f"{number / 1_000_000:.1f}M"
    elif number >= 1_000:
        return f"{number / 1_000:.1f}K"
    else:
        return str(number)

def get_color_from_status(status):
    """Return color based on status"""
    status_colors = {
        'active': 'green',
        'inactive': 'gray',
        'investigating': 'orange',
        'identified': 'orange',
        'monitoring': 'blue',
        'resolved': 'green',
        'draft': 'gray',
        'archived': 'gray',
        'error': 'red',
        'critical': 'red',
        'high': 'orange',
        'medium': 'yellow',
        'low': 'blue',
        'connected': 'green',
        'unknown': 'gray'
    }
    return status_colors.get(status.lower(), 'gray')

def execute_query(client: Client, query: str, params=None):
    """Execute a SQL query on Supabase"""
    try:
        if params:
            result = client.rpc("execute_sql", {"sql": query, "params": params}).execute()
        else:
            result = client.rpc("execute_sql", {"sql": query}).execute()
        return result.data if hasattr(result, 'data') else []
    except Exception as e:
        st.error(f"Error executing query: {e}")
        return []

def generate_sample_user_data(num_users=100):
    """Generate sample user data for development"""
    np.random.seed(42)  # For reproducible results
    
    countries = ['France', 'United States', 'Canada', 'Germany', 'United Kingdom', 'Spain']
    platforms = ['iOS', 'Android', 'Web']
    status = ['active', 'inactive']
    
    data = {
        'id': [f"user_{i}" for i in range(1, num_users+1)],
        'email': [f"user{i}@example.com" for i in range(1, num_users+1)],
        'created_at': pd.date_range(end=datetime.now(), periods=num_users).tolist(),
        'last_active': pd.date_range(end=datetime.now(), periods=num_users).tolist(),
        'country': np.random.choice(countries, num_users),
        'platform': np.random.choice(platforms, num_users),
        'status': np.random.choice(status, num_users, p=[0.8, 0.2]),  # 80% active
        'subscription': np.random.choice(['free', 'premium'], num_users, p=[0.7, 0.3]),
        'sessions': np.random.randint(1, 100, num_users),
        'retention_days': np.random.randint(1, 365, num_users)
    }
    
    return pd.DataFrame(data)

def generate_sample_incident_data(num_incidents=20):
    """Generate sample system incident data"""
    services = ['Authentication', 'Database', 'API', 'Offline Mode', 'Push Notifications']
    statuses = ['investigating', 'identified', 'monitoring', 'resolved']
    impacts = ['low', 'medium', 'high', 'critical']
    
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)
    
    data = {
        'id': [f"inc_{i}" for i in range(1, num_incidents+1)],
        'service': np.random.choice(services, num_incidents),
        'title': [f"Issue with {np.random.choice(services)} service #{i}" for i in range(1, num_incidents+1)],
        'status': np.random.choice(statuses, num_incidents),
        'created_at': pd.date_range(start=start_date, end=end_date, periods=num_incidents).tolist(),
        'impact': np.random.choice(impacts, num_incidents),
        'affected_users': np.random.randint(0, 1000, num_incidents)
    }
    
    return pd.DataFrame(data)

def generate_sample_ai_data(num_interactions=200):
    """Generate sample AI interaction data"""
    agent_types = ['sommeil', 'nutrition', 'diagnostic_global', 'hydratation', 'mental', 'exercice', 'general']
    
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)
    
    data = {
        'id': [f"int_{i}" for i in range(1, num_interactions+1)],
        'user_id': np.random.randint(1, 100, num_interactions),
        'agent_type': np.random.choice(agent_types, num_interactions),
        'timestamp': pd.date_range(start=start_date, end=end_date, periods=num_interactions).tolist(),
        'processing_time': np.random.uniform(0.1, 3.0, num_interactions),
        'satisfaction_rating': np.random.choice([None] + list(range(1, 6)), num_interactions, p=[0.4, 0.05, 0.1, 0.15, 0.15, 0.15])
    }
    
    return pd.DataFrame(data)

def filter_dataframe(df, filters):
    """Apply filters to a dataframe"""
    filtered_df = df.copy()
    
    for column, value in filters.items():
        if value:
            if isinstance(value, list):
                filtered_df = filtered_df[filtered_df[column].isin(value)]
            else:
                filtered_df = filtered_df[filtered_df[column] == value]
    
    return filtered_df