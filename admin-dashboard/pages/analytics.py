# pages/analytics.py
import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import numpy as np
from datetime import datetime, timedelta
from auth import get_supabase_client, login_required
from components.charts import display_user_geography_chart
from utils import format_number

@login_required
def render_analytics_page():
    """Render the analytics dashboard page"""
    
    st.markdown("## Analytics Dashboard")
    
    # Create tabs for different analytics views
    tab1, tab2, tab3, tab4 = st.tabs(["Overview", "User Analytics", "AI Insights", "Custom Reports"])
    
    with tab1:
        render_overview_analytics()
    
    with tab2:
        render_user_analytics()
        
    with tab3:
        render_ai_analytics()
        
    with tab4:
        render_custom_reports()

def render_overview_analytics():
    """Display overview analytics"""
    
    # Summary metrics at the top
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric(
            label="Total Users", 
            value=format_number(1245),
            delta=f"{3.2}%"
        )
    
    with col2:
        st.metric(
            label="Premium Users", 
            value=format_number(218),
            delta=f"{5.5}%"
        )
    
    with col3:
        st.metric(
            label="Active Users (30d)", 
            value=format_number(743),
            delta=f"{2.1}%"
        )
    
    with col4:
        st.metric(
            label="Avg. Satisfaction", 
            value=f"4.2/5",
            delta=f"{0.3}"
        )
    
    # Main KPIs chart
    st.markdown("### Key Performance Indicators")
    
    # Generate sample KPI data
    months = pd.date_range(start='2023-01-01', periods=6, freq='M')
    
    kpi_data = pd.DataFrame({
        'date': months.repeat(3),
        'metric': np.tile(['User Growth', 'Premium Conversion', 'Engagement Score'], 6),
        'value': [
            # User Growth
            10, 15, 25, 45, 70, 100,
            # Premium Conversion
            5.2, 5.7, 6.5, 8.3, 12.5, 17.5,
            # Engagement Score 
            45, 47, 52, 61, 72, 78
        ]
    })
    
    # Create multi-line chart
    fig = px.line(
        kpi_data,
        x='date',
        y='value',
        color='metric',
        markers=True,
        labels={'date': 'Month', 'value': 'Value', 'metric': 'KPI'},
        title='Key Performance Indicators - 6 Month Trend'
    )
    
    # Add percentage for Premium Conversion
    for i, trace in enumerate(fig.data):
        if trace.name == "Premium Conversion":
            fig.data[i].update(
                mode='lines+markers+text',
                text=[f"{val}%" for val in trace.y],
                textposition='top center'
            )
    
    fig.update_layout(
        height=400,
        margin=dict(l=20, r=20, t=40, b=20),
        legend=dict(orientation='h', yanchor='bottom', y=1.02, xanchor='right', x=1)
    )
    
    st.plotly_chart(fig, use_container_width=True)
    
    # User geography chart
    st.markdown("### User Geography")
    fig = display_user_geography_chart()
    st.plotly_chart(fig, use_container_width=True)
    
    # Key insights row
    st.markdown("### Key Insights")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        <div style="border-left: 4px solid #1E88E5; padding-left: 15px; margin-bottom: 20px;">
            <h4 style="margin-top: 0;">Growth Analysis</h4>
            <p>User growth is accelerating with a 43% increase in the last month compared to the previous quarter's average of 28%. Premium conversion rates have also improved by 5.0 percentage points.</p>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("""
        <div style="border-left: 4px solid #42A5F5; padding-left: 15px; margin-bottom: 20px;">
            <h4 style="margin-top: 0;">Retention Trends</h4>
            <p>30-day retention has improved to 64%, up from 52% in the previous quarter. Users who interact with AI assistants show 78% higher retention rates than non-AI users.</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div style="border-left: 4px solid #26C6DA; padding-left: 15px; margin-bottom: 20px;">
            <h4 style="margin-top: 0;">Feature Adoption</h4>
            <p>Sleep tracking is the most popular feature with 82% of active users utilizing it at least weekly. AI nutrition assistance has seen the fastest growth, with 54% month-over-month increase in usage.</p>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("""
        <div style="border-left: 4px solid #66BB6A; padding-left: 15px; margin-bottom: 20px;">
            <h4 style="margin-top: 0;">Regional Insights</h4>
            <p>France and Germany show the highest premium conversion rates at 22% and 19% respectively. North American users engage with AI features 35% more frequently than European users.</p>
        </div>
        """, unsafe_allow_html=True)

def render_user_analytics():
    """Display user analytics"""
    
    st.markdown("### User Analytics")
    
    # User growth and churn
    st.markdown("#### User Growth & Churn")
    
    # Generate sample growth and churn data
    months = pd.date_range(start='2023-01-01', periods=6, freq='M')
    
    data = pd.DataFrame({
        'date': months,
        'new_users': [75, 92, 128, 175, 210, 265],
        'churned_users': [12, 15, 22, 28, 32, 37]
    })
    
    # Calculate net growth
    data['net_growth'] = data['new_users'] - data['churned_users']
    
    # Create dual-axis chart
    fig = go.Figure()
    
    # Add new users bars
    fig.add_trace(go.Bar(
        x=data['date'],
        y=data['new_users'],
        name='New Users',
        marker_color='rgb(26, 118, 255)'
    ))
    
    # Add churned users bars
    fig.add_trace(go.Bar(
        x=data['date'],
        y=data['churned_users'],
        name='Churned Users',
        marker_color='rgb(235, 64, 52)'
    ))
    
    # Add net growth line
    fig.add_trace(go.Scatter(
        x=data['date'],
        y=data['net_growth'],
        mode='lines+markers',
        name='Net Growth',
        line=dict(color='rgb(73, 156, 84)', width=3),
        marker=dict(size=8)
    ))
    
    # Update layout
    fig.update_layout(
        barmode='group',
        height=400,
        margin=dict(l=20, r=20, t=30, b=20),
        legend=dict(orientation='h', yanchor='bottom', y=1.02, xanchor='right', x=1),
        yaxis=dict(title='Users')
    )
    
    st.plotly_chart(fig, use_container_width=True)
    
    # User retention cohort analysis
    st.markdown("#### Retention Cohort Analysis")
    
    from components.charts import display_user_retention_chart
    fig = display_user_retention_chart()
    st.plotly_chart(fig, use_container_width=True)
    
    # User segmentation
    st.markdown("#### User Segmentation")
    
    col1, col2 = st.columns(2)
    
    with col1:
        # User platform distribution
        platform_data = pd.DataFrame({
            'platform': ['iOS', 'Android', 'Web'],
            'users': [631, 529, 85]
        })
        
        fig = px.pie(
            platform_data,
            values='users',
            names='platform',
            hole=0.4,
            color='platform',
            color_discrete_map={
                'iOS': 'rgb(0, 122, 255)',
                'Android': 'rgb(104, 159, 56)',
                'Web': 'rgb(255, 149, 0)'
            },
            title='Users by Platform'
        )
        
        fig.update_layout(
            height=300,
            margin=dict(l=10, r=10, t=40, b=10),
            legend=dict(orientation='h', yanchor='bottom', y=-0.2, xanchor='center', x=0.5)
        )
        
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        # User subscription distribution
        subscription_data = pd.DataFrame({
            'type': ['Free', 'Premium Monthly', 'Premium Annual'],
            'users': [1027, 143, 75]
        })
        
        fig = px.pie(
            subscription_data,
            values='users',
            names='type',
            hole=0.4,
            color='type',
            color_discrete_map={
                'Free': 'rgb(158, 158, 158)',
                'Premium Monthly': 'rgb(241, 196, 15)',
                'Premium Annual': 'rgb(243, 156, 18)'
            },
            title='Users by Subscription'
        )
        
        fig.update_layout(
            height=300,
            margin=dict(l=10, r=10, t=40, b=10),
            legend=dict(orientation='h', yanchor='bottom', y=-0.2, xanchor='center', x=0.5)
        )
        
        st.plotly_chart(fig, use_container_width=True)
    
    # Feature usage
    st.markdown("#### Feature Usage")
    
    feature_data = pd.DataFrame({
        'feature': ['Sleep Tracking', 'Nutrition Log', 'Exercise Plans', 'AI Coach', 'Goal Setting', 'Water Tracking'],
        'usage_percentage': [82, 65, 58, 47, 43, 38]
    })
    
    fig = px.bar(
        feature_data,
        x='usage_percentage',
        y='feature',
        orientation='h',
        labels={'usage_percentage': 'Usage (%)', 'feature': 'Feature'},
        title='Feature Usage (% of Active Users)',
        color='usage_percentage',
        color_continuous_scale='Blues'
    )
    
    fig.update_layout(
        height=350,
        margin=dict(l=20, r=20, t=40, b=20),
        xaxis=dict(range=[0, 100])
    )
    
    fig.update_traces(
        texttemplate='%{x}%',
        textposition='outside'
    )
    
    st.plotly_chart(fig, use_container_width=True)

def render_ai_analytics():
    """Display AI analytics"""
    
    st.markdown("### AI Analytics")
    
    # AI response time histogram
    st.markdown("#### AI Response Time Distribution")
    
    # Generate sample response time data
    response_times = np.concatenate([
        np.random.normal(0.8, 0.2, 250),  # Fast responses
        np.random.normal(1.5, 0.3, 450),  # Medium responses
        np.random.normal(2.5, 0.5, 200)   # Slow responses
    ])
    
    # Clip negative values
    response_times = np.clip(response_times, 0.1, 5)
    
    fig = px.histogram(
        response_times,
        nbins=30,
        labels={'value': 'Response Time (seconds)', 'count': 'Frequency'},
        title='AI Response Time Distribution',
        color_discrete_sequence=['rgb(59, 89, 152)']
    )
    
    # Add mean line
    mean_time = np.mean(response_times)
    fig.add_vline(
        x=mean_time,
        line_dash="dash",
        line_color="red",
        annotation_text=f"Mean: {mean_time:.2f}s"
    )
    
    fig.update_layout(
        height=350,
        margin=dict(l=20, r=20, t=40, b=20),
        bargap=0.1
    )
    
    st.plotly_chart(fig, use_container_width=True)
    
    # User satisfaction chart
    st.markdown("#### User Satisfaction Ratings")
    
    # Generate sample satisfaction data for different agent types
    agent_types = ['sommeil', 'nutrition', 'diagnostic_global', 'hydratation', 'mental', 'exercice', 'general']
    
    # Create a baseline of satisfaction levels
    satisfaction_data = {}
    for i, agent in enumerate(agent_types):
        # Different distribution for each agent
        if i % 3 == 0:
            # Mostly 4 and 5 stars
            dist = [0.02, 0.05, 0.13, 0.35, 0.45]
        elif i % 3 == 1:
            # More evenly distributed
            dist = [0.05, 0.10, 0.25, 0.35, 0.25]
        else:
            # Middle heavy
            dist = [0.03, 0.07, 0.30, 0.40, 0.20]
            
        ratings = np.random.choice([1, 2, 3, 4, 5], size=200, p=dist)
        satisfaction_data[agent] = ratings
    
    # Convert to tidy dataframe
    sat_df = pd.DataFrame({
        'agent_type': np.repeat(agent_types, [len(satisfaction_data[agent]) for agent in agent_types]),
        'rating': np.concatenate([satisfaction_data[agent] for agent in agent_types])
    })
    
    # Create grouped histogram
    fig = px.histogram(
        sat_df,
        x='rating',
        color='agent_type',
        barmode='group',
        labels={'rating': 'Satisfaction Rating', 'count': 'Number of Ratings', 'agent_type': 'Agent Type'},
        title='User Satisfaction by Agent Type',
        category_orders={"rating": [1, 2, 3, 4, 5]}
    )
    
    fig.update_layout(
        height=400,
        margin=dict(l=20, r=20, t=40, b=20),
        legend=dict(orientation='h', yanchor='bottom', y=1.02, xanchor='right', x=1),
        xaxis=dict(tickvals=[1, 2, 3, 4, 5])
    )
    
    st.plotly_chart(fig, use_container_width=True)
    
    # Popular AI queries
    st.markdown("#### Top AI Queries")
    
    # Sample data for top queries
    top_queries = [
        {"query": "How can I improve my sleep schedule?", "count": 142, "agent": "sommeil"},
        {"query": "What should I eat before workout?", "count": 117, "agent": "nutrition"},
        {"query": "How much water should I drink daily?", "count": 98, "agent": "hydratation"},
        {"query": "Recommend exercises for lower back pain", "count": 86, "agent": "exercice"},
        {"query": "How to reduce stress before sleep?", "count": 79, "agent": "mental"},
        {"query": "Is my sleep pattern normal?", "count": 72, "agent": "diagnostic_global"},
        {"query": "How to track macronutrients?", "count": 65, "agent": "nutrition"},
        {"query": "Best time for cardio workout", "count": 58, "agent": "exercice"},
        {"query": "Exercises to improve posture", "count": 51, "agent": "exercice"},
        {"query": "How to start meditation?", "count": 47, "agent": "mental"}
    ]
    
    # Convert to DataFrame
    queries_df = pd.DataFrame(top_queries)
    
    # Create colormap for agent types
    agent_colors = {
        'sommeil': '#1E88E5',
        'nutrition': '#43A047',
        'diagnostic_global': '#F44336',
        'hydratation': '#29B6F6',
        'mental': '#AB47BC',
        'exercice': '#FF7043',
        'general': '#78909C'
    }
    
    # Create bar chart
    fig = px.bar(
        queries_df,
        x='count',
        y='query',
        orientation='h',
        color='agent',
        color_discrete_map=agent_colors,
        labels={'count': 'Frequency', 'query': 'Query', 'agent': 'Agent Type'},
        title='Most Frequent AI Queries'
    )
    
    fig.update_layout(
        height=400,
        margin=dict(l=20, r=20, t=40, b=20)
    )
    
    st.plotly_chart(fig, use_container_width=True)

def render_custom_reports():
    """Display and manage custom analytics reports"""
    
    st.markdown("### Custom Reports")
    st.info("Create and schedule custom analytics reports based on specific metrics and segments.")
    
    # Try to fetch real data from database
    try:
        supabase = get_supabase_client()
        query = """
        SELECT 
            id, name, description, created_at, created_by
        FROM admin_io5xn_analytics_reports
        ORDER BY created_at DESC
        """
        result = supabase.rpc("execute_sql", {"sql": query}).execute()
        
        if result.data and len(result.data) > 0:
            reports = result.data
        else:
            # Generate sample data if no data is available
            reports = generate_sample_reports()
    except Exception as e:
        # Fallback to sample data
        reports = generate_sample_reports()
    
    # Create tabs for report management
    report_tab1, report_tab2 = st.tabs(["Saved Reports", "Create New Report"])
    
    with report_tab1:
        # Display existing reports
        if reports:
            for report in reports:
                # Format timestamp
                created_at = report.get('created_at', '')
                if isinstance(created_at, str):
                    created_at_str = created_at
                else:
                    created_at_str = pd.to_datetime(created_at).strftime('%Y-%m-%d')
                
                with st.expander(f"{report['name']}"):
                    st.markdown(f"**Description:** {report['description']}")
                    st.markdown(f"**Created by:** {report['created_by']} | **Created on:** {created_at_str}")
                    
                    col1, col2, col3 = st.columns([2, 1, 1])
                    with col1:
                        st.button("View Report", key=f"view_{report['id']}")
                    with col2:
                        st.button("Edit", key=f"edit_{report['id']}")
                    with col3:
                        st.button("Delete", key=f"delete_{report['id']}")
        else:
            st.info("No saved reports found. Create a new report to get started.")
    
    with report_tab2:
        # Form to create a new report
        with st.form("new_report_form"):
            st.markdown("#### Create New Report")
            
            report_name = st.text_input("Report Name")
            report_description = st.text_area("Description")
            
            st.markdown("#### Select Metrics")
            
            # Metrics selection
            col1, col2 = st.columns(2)
            with col1:
                user_metrics = st.multiselect(
                    "User Metrics",
                    options=["New Users", "Active Users", "Retention Rate", "Churn Rate", "Premium Conversion"]
                )
            
            with col2:
                feature_metrics = st.multiselect(
                    "Feature Metrics",
                    options=["Feature Usage", "Session Duration", "AI Interactions", "Sleep Quality", "Activity Level"]
                )
            
            # Filters
            st.markdown("#### Filters")
            
            col1, col2 = st.columns(2)
            with col1:
                date_range = st.selectbox(
                    "Date Range",
                    options=["Last 7 days", "Last 30 days", "Last 90 days", "Custom"]
                )
            
            with col2:
                user_segments = st.multiselect(
                    "User Segments",
                    options=["All Users", "New Users", "Premium Users", "High Engagement", "At Risk"]
                )
            
            # Chart types
            st.markdown("#### Chart Types")
            
            col1, col2, col3 = st.columns(3)
            with col1:
                st.checkbox("Line Chart", value=True)
            with col2:
                st.checkbox("Bar Chart")
            with col3:
                st.checkbox("Pie Chart")
            
            # Schedule
            st.markdown("#### Schedule (Optional)")
            
            schedule = st.checkbox("Schedule recurring report")
            
            if schedule:
                col1, col2 = st.columns(2)
                with col1:
                    frequency = st.selectbox(
                        "Frequency",
                        options=["Daily", "Weekly", "Monthly"]
                    )
                
                with col2:
                    recipients = st.text_input("Email Recipients (comma separated)")
            
            submit = st.form_submit_button("Create Report")
            
            if submit:
                if not report_name:
                    st.error("Report name is required!")
                else:
                    try:
                        # In a real app, we would save the report to the database here
                        st.success(f"Report '{report_name}' created successfully!")
                    except Exception as e:
                        st.error(f"Error creating report: {e}")

def generate_sample_reports():
    """Generate sample analytics reports for development"""
    return [
        {
            "id": "report_1",
            "name": "Monthly User Growth Report",
            "description": "Tracks new users, active users, and churn rate on a monthly basis.",
            "created_at": "2023-05-15",
            "created_by": "admin@myfitherov3.com"
        },
        {
            "id": "report_2",
            "name": "Feature Adoption Analysis",
            "description": "Analyzes the adoption and engagement with different features across user segments.",
            "created_at": "2023-05-28",
            "created_by": "admin@myfitherov3.com"
        },
        {
            "id": "report_3",
            "name": "Premium Conversion Report",
            "description": "Tracks premium conversion rates and identifies user behaviors correlated with upgrades.",
            "created_at": "2023-06-02",
            "created_by": "analyst@myfitherov3.com"
        }
    ]