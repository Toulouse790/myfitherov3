# components/charts.py
import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import numpy as np
from auth import get_supabase_client
from utils import generate_sample_ai_data, generate_sample_user_data

def display_user_activity_chart():
    """Display user activity over time"""
    
    st.markdown("### User Activity")
    
    try:
        # Attempt to fetch real data
        supabase = get_supabase_client()
        query = """
        SELECT 
            DATE_TRUNC('day', created_at) as date, 
            COUNT(*) as user_count 
        FROM profiles 
        WHERE created_at > NOW() - INTERVAL '30 days'
        GROUP BY DATE_TRUNC('day', created_at)
        ORDER BY date
        """
        result = supabase.rpc("execute_sql", {"sql": query}).execute()
        
        if result.data and len(result.data) > 0:
            # Convert to pandas dataframe
            data = pd.DataFrame(result.data, columns=['date', 'user_count'])
        else:
            # Generate sample data
            end_date = datetime.now()
            start_date = end_date - timedelta(days=30)
            dates = pd.date_range(start=start_date, end=end_date, freq='D')
            
            data = pd.DataFrame({
                'date': dates,
                'user_count': np.random.randint(10, 50, size=len(dates))
            })
    except Exception as e:
        # Fallback to sample data
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30)
        dates = pd.date_range(start=start_date, end=end_date, freq='D')
        
        data = pd.DataFrame({
            'date': dates,
            'user_count': np.random.randint(10, 50, size=len(dates))
        })
    
    # Create a rolling 7-day average
    data['7d_avg'] = data['user_count'].rolling(window=7, min_periods=1).mean()
    
    # Create the chart
    fig = go.Figure()
    
    # Add bar chart for daily counts
    fig.add_trace(go.Bar(
        x=data['date'], 
        y=data['user_count'],
        name='Daily Users',
        marker_color='lightblue'
    ))
    
    # Add line chart for rolling average
    fig.add_trace(go.Scatter(
        x=data['date'], 
        y=data['7d_avg'],
        mode='lines',
        name='7-Day Average',
        line=dict(color='royalblue', width=3)
    ))
    
    # Update layout
    fig.update_layout(
        height=350,
        margin=dict(l=20, r=20, t=30, b=20),
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
        xaxis_title="",
        yaxis_title="Users"
    )
    
    # Display the chart
    st.plotly_chart(fig, use_container_width=True)

def display_agent_performance_chart():
    """Display AI agent performance metrics"""
    
    st.markdown("### AI Agent Performance")
    
    try:
        # Attempt to fetch real data
        supabase = get_supabase_client()
        query = """
        SELECT 
            agent_type, 
            COUNT(*) as interactions,
            AVG(processing_time) as avg_processing_time,
            AVG(satisfaction_rating) as avg_satisfaction
        FROM admin_io5xn_ai_interactions
        WHERE timestamp > NOW() - INTERVAL '30 days'
        GROUP BY agent_type
        ORDER BY interactions DESC
        """
        result = supabase.rpc("execute_sql", {"sql": query}).execute()
        
        if result.data and len(result.data) > 0:
            # Convert to pandas dataframe
            data = pd.DataFrame(result.data, columns=['agent_type', 'interactions', 'avg_processing_time', 'avg_satisfaction'])
        else:
            # Generate sample data
            ai_data = generate_sample_ai_data(300)
            data = ai_data.groupby('agent_type').agg({
                'id': 'count',
                'processing_time': 'mean',
                'satisfaction_rating': lambda x: x[x.notnull()].mean() if len(x[x.notnull()]) > 0 else np.nan
            }).reset_index()
            data.columns = ['agent_type', 'interactions', 'avg_processing_time', 'avg_satisfaction']
    except Exception as e:
        # Fallback to sample data
        ai_data = generate_sample_ai_data(300)
        data = ai_data.groupby('agent_type').agg({
            'id': 'count',
            'processing_time': 'mean',
            'satisfaction_rating': lambda x: x[x.notnull()].mean() if len(x[x.notnull()]) > 0 else np.nan
        }).reset_index()
        data.columns = ['agent_type', 'interactions', 'avg_processing_time', 'avg_satisfaction']
    
    # Clean up data
    data['avg_satisfaction'] = data['avg_satisfaction'].fillna(0)
    
    # Create a color scale for satisfaction rating
    colors = ['#ff0d0d', '#ff4e11', '#ff8e15', '#fab733', '#acb334', '#69b34c']
    
    # Create the figure
    fig = px.bar(
        data,
        x='agent_type',
        y='interactions',
        color='avg_satisfaction',
        color_continuous_scale=colors,
        range_color=[1, 5],
        text='avg_processing_time',
        labels={
            'agent_type': 'Agent Type',
            'interactions': 'Total Interactions',
            'avg_satisfaction': 'Avg. Satisfaction (1-5)'
        },
        height=350
    )
    
    # Add average processing time as text on bars
    fig.update_traces(
        texttemplate='%{text:.2f}s',
        textposition='inside'
    )
    
    # Update layout
    fig.update_layout(
        margin=dict(l=20, r=20, t=30, b=20),
        coloraxis_colorbar=dict(
            title='Avg.<br>Rating'
        )
    )
    
    # Display the chart
    st.plotly_chart(fig, use_container_width=True)
    
def display_user_retention_chart():
    """Display user retention cohort analysis chart"""
    
    # Generate sample retention data
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    retention_data = []
    
    for i, month in enumerate(months):
        # Simulate diminishing retention over time
        retention_row = [100]  # First month always 100%
        for j in range(1, len(months) - i):
            # Create a retention curve that drops more steeply at first
            retention_row.append(round(100 * (0.8 ** j) * (1 + 0.1 * np.random.randn())))
        
        # Pad with None for months that don't have data yet
        retention_row.extend([None] * i)
        
        retention_data.append(retention_row)
    
    # Create the heatmap
    fig = go.Figure(data=go.Heatmap(
        z=retention_data,
        x=[f'Month {i+1}' for i in range(len(months))],
        y=months,
        colorscale='Blues',
        text=[[f'{val}%' if val is not None else '' for val in row] for row in retention_data],
        texttemplate="%{text}",
        textfont={"size":12},
        hoverongaps=False,
        showscale=False
    ))
    
    # Update layout
    fig.update_layout(
        title='User Retention by Cohort (%) - Sample Data',
        height=350,
        margin=dict(l=20, r=20, t=50, b=20),
    )
    
    return fig

def display_user_geography_chart():
    """Display user geography distribution on a world map"""
    
    # Generate sample geographical data
    countries = ['United States', 'France', 'Germany', 'United Kingdom', 'Canada', 
                'Spain', 'Italy', 'Australia', 'Japan', 'Brazil', 'India']
    
    data = pd.DataFrame({
        'country': countries,
        'users': np.random.randint(50, 500, size=len(countries))
    })
    
    # Create the map
    fig = px.choropleth(
        data,
        locations='country',
        locationmode='country names',
        color='users',
        hover_name='country',
        color_continuous_scale=px.colors.sequential.Blues,
        title='User Distribution by Country - Sample Data'
    )
    
    # Update layout
    fig.update_layout(
        height=450,
        margin=dict(l=0, r=0, t=50, b=0),
        coloraxis_colorbar_title='Users'
    )
    
    return fig