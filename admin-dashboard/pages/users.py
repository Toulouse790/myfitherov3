# pages/users.py
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
from auth import get_supabase_client, login_required
from utils import generate_sample_user_data, filter_dataframe, get_color_from_status

@login_required
def render_users_page():
    """Render the users management page"""
    
    st.markdown("## User Management")
    
    # Create tabs for different user views
    tab1, tab2, tab3 = st.tabs(["User Overview", "User Details", "User Segments"])
    
    with tab1:
        render_user_overview()
    
    with tab2:
        render_user_details()
        
    with tab3:
        render_user_segments()

def render_user_overview():
    """Display user overview statistics and charts"""
    
    # Metrics row
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Total Users", "1,245", "+3.2%")
    with col2:
        st.metric("Active Today", "287", "+5.1%")
    with col3:
        st.metric("Premium Users", "218", "+1.4%")
    with col4:
        st.metric("Avg Retention", "45 days", "+2.3%")
    
    # User growth chart
    st.markdown("### User Growth")
    
    # Generate sample data for monthly user growth
    months = pd.date_range(start='2023-01-01', periods=12, freq='M')
    
    # Create sample cumulative growth data with some realistic variation
    base = np.array([100, 150, 220, 300, 450, 600, 680, 750, 900, 1050, 1150, 1245])
    
    # Calculate monthly new users from the difference
    new_users = np.diff(base, prepend=0)
    
    # Create the DataFrame
    data = pd.DataFrame({
        'date': months,
        'total_users': base,
        'new_users': new_users
    })
    
    # Create a dual-axis chart
    fig = px.line(
        data,
        x='date',
        y='total_users',
        labels={'date': 'Month', 'total_users': 'Total Users'},
        height=400
    )
    
    # Add bar chart for new users
    fig.add_bar(
        x=data['date'],
        y=data['new_users'],
        name='New Users',
        yaxis='y2',
        marker_color='rgba(73, 156, 84, 0.7)'
    )
    
    # Update layout for dual y-axes
    fig.update_layout(
        yaxis=dict(title='Total Users'),
        yaxis2=dict(
            title='New Users',
            overlaying='y',
            side='right'
        ),
        legend=dict(orientation='h', yanchor='bottom', y=1.02, xanchor='right', x=1),
        hovermode='x unified',
        margin=dict(l=20, r=50, t=20, b=20)
    )
    
    st.plotly_chart(fig, use_container_width=True)
    
    # Platform distribution
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("### Users by Platform")
        
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
            }
        )
        
        fig.update_layout(
            height=300,
            margin=dict(l=10, r=10, t=10, b=10),
            legend=dict(orientation='h', yanchor='bottom', y=-0.2, xanchor='center', x=0.5)
        )
        
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.markdown("### User Status")
        
        status_data = pd.DataFrame({
            'status': ['Active', 'Inactive', 'Churned'],
            'users': [986, 147, 112]
        })
        
        fig = px.bar(
            status_data,
            x='status',
            y='users',
            color='status',
            color_discrete_map={
                'Active': 'rgb(73, 156, 84)',
                'Inactive': 'rgb(245, 166, 35)',
                'Churned': 'rgb(235, 64, 52)'
            },
            text='users'
        )
        
        fig.update_layout(
            height=300,
            margin=dict(l=10, r=10, t=10, b=10),
            showlegend=False
        )
        
        fig.update_traces(texttemplate='%{text}', textposition='outside')
        
        st.plotly_chart(fig, use_container_width=True)

def render_user_details():
    """Display detailed user information and search"""
    
    # Search/filter inputs
    col1, col2, col3 = st.columns(3)
    
    with col1:
        search_query = st.text_input("Search by email or name", "")
    
    with col2:
        status_filter = st.multiselect(
            "Filter by status",
            ["active", "inactive"],
            default=None
        )
    
    with col3:
        platform_filter = st.multiselect(
            "Filter by platform",
            ["iOS", "Android", "Web"],
            default=None
        )
        
    # Try to fetch real user data
    try:
        supabase = get_supabase_client()
        query = """
        SELECT 
            id, email, created_at, last_sign_in_at as last_active, raw_app_meta_data->'provider' as platform, 
            CASE WHEN last_sign_in_at > NOW() - INTERVAL '30 days' THEN 'active' ELSE 'inactive' END as status
        FROM auth.users
        ORDER BY created_at DESC
        LIMIT 100
        """
        result = supabase.rpc("execute_sql", {"sql": query}).execute()
        
        if result.data and len(result.data) > 0:
            # Convert to pandas DataFrame
            users_df = pd.DataFrame(result.data)
        else:
            # Generate sample data
            users_df = generate_sample_user_data(100)
    except Exception as e:
        # Fallback to sample data
        users_df = generate_sample_user_data(100)
    
    # Apply filters
    filtered_df = users_df.copy()
    
    if search_query:
        filtered_df = filtered_df[filtered_df['email'].str.contains(search_query, case=False)]
    
    if status_filter:
        filtered_df = filtered_df[filtered_df['status'].isin(status_filter)]
        
    if platform_filter:
        filtered_df = filtered_df[filtered_df['platform'].isin(platform_filter)]
    
    # Format the dataframe for display
    if not filtered_df.empty:
        display_df = filtered_df.copy()
        
        # Format dates
        if 'created_at' in display_df.columns:
            display_df['created_at'] = pd.to_datetime(display_df['created_at']).dt.strftime('%Y-%m-%d')
        
        if 'last_active' in display_df.columns:
            display_df['last_active'] = pd.to_datetime(display_df['last_active']).dt.strftime('%Y-%m-%d')
        
        # Display user count
        st.write(f"Showing {len(display_df)} users")
        
        # Display the dataframe with formatting
        st.dataframe(
            display_df,
            column_config={
                "id": st.column_config.TextColumn("ID"),
                "email": st.column_config.TextColumn("Email"),
                "created_at": st.column_config.TextColumn("Created At"),
                "last_active": st.column_config.TextColumn("Last Active"),
                "country": st.column_config.TextColumn("Country"),
                "platform": st.column_config.TextColumn("Platform"),
                "status": st.column_config.TextColumn(
                    "Status",
                    help="User activity status",
                    width="small"
                ),
                "subscription": st.column_config.TextColumn("Subscription"),
                "sessions": st.column_config.NumberColumn("Sessions"),
                "retention_days": st.column_config.NumberColumn("Retention Days")
            },
            hide_index=True,
            use_container_width=True
        )
    else:
        st.info("No users found matching the filters")

def render_user_segments():
    """Display user segments and cohorts"""
    
    st.markdown("### User Segments")
    
    # Sample segments data
    segments = [
        {"name": "Active Users", "count": 986, "description": "Users active in the last 30 days"},
        {"name": "Premium Subscribers", "count": 218, "description": "Users with active premium subscription"},
        {"name": "High Engagement", "count": 342, "description": "Users with 20+ sessions per month"},
        {"name": "New Users", "count": 156, "description": "Users who joined in the last 7 days"},
        {"name": "Churned", "count": 112, "description": "Previously active users who haven't logged in for 60+ days"},
        {"name": "AI Power Users", "count": 267, "description": "Users who frequently interact with AI assistants"}
    ]
    
    # Create columns for segments
    cols = st.columns(3)
    
    for i, segment in enumerate(segments):
        with cols[i % 3]:
            st.markdown(f"""
            <div style="padding: 15px; border-radius: 5px; border: 1px solid #ddd; margin-bottom: 15px;">
                <h3 style="margin-top: 0;">{segment['name']}</h3>
                <h2 style="color: #1E88E5; margin: 10px 0;">{segment['count']}</h2>
                <p>{segment['description']}</p>
                <button style="background-color: #f0f2f6; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">View Users</button>
            </div>
            """, unsafe_allow_html=True)
    
    # Cohort analysis
    st.markdown("### Retention Cohort Analysis")
    
    from components.charts import display_user_retention_chart
    fig = display_user_retention_chart()
    st.plotly_chart(fig, use_container_width=True)
    
    st.markdown("""
    **Understanding the cohort chart:**
    - Each row represents users who joined in a specific month
    - Each column shows the retention percentage after N months
    - The first column is always 100% (initial users)
    - Data shows a typical retention curve with drop-off over time
    """)