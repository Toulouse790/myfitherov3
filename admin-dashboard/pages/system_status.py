# pages/system_status.py
import streamlit as st
import pandas as pd
import plotly.express as px
from datetime import datetime, timedelta
import numpy as np
from auth import get_supabase_client, login_required
from utils import generate_sample_incident_data, get_color_from_status

@login_required
def render_system_page():
    """Render the system status page"""
    
    st.markdown("## System Status")
    
    # Create tabs for different system views
    tab1, tab2, tab3, tab4 = st.tabs(["Overview", "Incidents", "Sync Issues", "Service Health"])
    
    with tab1:
        render_system_overview()
    
    with tab2:
        render_incidents()
        
    with tab3:
        render_sync_issues()
        
    with tab4:
        render_service_health()

def render_system_overview():
    """Display system overview"""
    
    # Health status indicators
    st.markdown("### Service Health")
    
    services = [
        {"name": "Authentication", "status": "healthy", "uptime": "99.9%", "response_time": "156ms"},
        {"name": "Database", "status": "healthy", "uptime": "100%", "response_time": "89ms"},
        {"name": "Storage", "status": "healthy", "uptime": "99.8%", "response_time": "210ms"},
        {"name": "API Service", "status": "degraded", "uptime": "98.2%", "response_time": "450ms"},
        {"name": "N8N Integration", "status": "healthy", "uptime": "99.7%", "response_time": "320ms"},
        {"name": "AI Services", "status": "healthy", "uptime": "99.9%", "response_time": "267ms"}
    ]
    
    # Create the status dashboard
    cols = st.columns(3)
    
    for i, service in enumerate(services):
        with cols[i % 3]:
            status_color = "green" if service["status"] == "healthy" else "orange" if service["status"] == "degraded" else "red"
            
            st.markdown(f"""
            <div style="padding: 15px; border-radius: 5px; border: 1px solid #ddd; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0;">{service['name']}</h3>
                    <span style="background-color: {status_color}; color: white; padding: 3px 8px; border-radius: 10px; font-size: 14px;">
                        {service['status']}
                    </span>
                </div>
                <div style="display: flex; margin-top: 10px;">
                    <div style="flex: 1;">
                        <div style="font-size: 12px; color: #666;">Uptime</div>
                        <div style="font-size: 18px; font-weight: bold;">{service['uptime']}</div>
                    </div>
                    <div style="flex: 1;">
                        <div style="font-size: 12px; color: #666;">Response</div>
                        <div style="font-size: 18px; font-weight: bold;">{service['response_time']}</div>
                    </div>
                </div>
            </div>
            """, unsafe_allow_html=True)
    
    # System metrics chart
    st.markdown("### System Performance")
    
    # Generate sample performance data
    end_date = datetime.now()
    start_date = end_date - timedelta(days=1)
    dates = pd.date_range(start=start_date, end=end_date, freq='30min')
    
    # Create slightly correlated metrics with some spikes
    baseline = np.sin(np.linspace(0, 4*np.pi, len(dates))) * 0.3 + 0.5
    
    cpu_usage = baseline + 0.2 + np.random.normal(0, 0.05, len(dates))
    cpu_usage = np.clip(cpu_usage, 0.1, 1.0) * 100
    
    memory_usage = baseline + 0.1 + np.random.normal(0, 0.03, len(dates))
    memory_usage = np.clip(memory_usage, 0.2, 0.9) * 100
    
    api_latency = baseline * 800 + 200 + np.random.normal(0, 50, len(dates))
    api_latency = np.clip(api_latency, 100, 1200)
    
    # Create a spike in API latency
    spike_idx = len(dates) // 3
    api_latency[spike_idx:spike_idx+3] = api_latency[spike_idx:spike_idx+3] * 2.5
    
    # Create dataframe
    perf_data = pd.DataFrame({
        'timestamp': dates,
        'CPU Usage (%)': cpu_usage.round(1),
        'Memory Usage (%)': memory_usage.round(1),
        'API Latency (ms)': api_latency.round(0)
    })
    
    # Create the chart
    fig = px.line(
        perf_data.melt(id_vars=['timestamp'], value_vars=['CPU Usage (%)', 'Memory Usage (%)', 'API Latency (ms)']),
        x='timestamp',
        y='value',
        color='variable',
        labels={'timestamp': 'Time', 'value': '', 'variable': 'Metric'},
        title='System Metrics (Last 24 Hours)'
    )
    
    # Create a secondary y-axis for API latency
    fig.update_layout(
        yaxis=dict(title='Usage (%)'),
        yaxis2=dict(
            title='Latency (ms)',
            overlaying='y',
            side='right',
            range=[0, 1500]
        ),
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
        height=400,
        margin=dict(l=20, r=50, t=40, b=20),
    )
    
    # Update each trace to use the appropriate y-axis
    for trace in fig.data:
        if trace.name == 'API Latency (ms)':
            trace.yaxis = 'y2'
    
    st.plotly_chart(fig, use_container_width=True)
    
    # Recent incidents summary
    st.markdown("### Recent Incidents")
    display_recent_incidents(limit=3)

def render_incidents():
    """Display system incidents"""
    
    st.markdown("### System Incidents")
    
    # Filter controls
    col1, col2, col3 = st.columns(3)
    
    with col1:
        status_filter = st.multiselect(
            "Filter by status",
            ["investigating", "identified", "monitoring", "resolved"],
            default=None
        )
    
    with col2:
        service_filter = st.multiselect(
            "Filter by service",
            ["Authentication", "Database", "API", "Offline Mode", "Push Notifications"],
            default=None
        )
        
    with col3:
        impact_filter = st.multiselect(
            "Filter by impact",
            ["low", "medium", "high", "critical"],
            default=None
        )
    
    # Try to fetch real data from database
    try:
        supabase = get_supabase_client()
        query = """
        SELECT *
        FROM admin_io5xn_system_incidents
        ORDER BY created_at DESC
        """
        result = supabase.rpc("execute_sql", {"sql": query}).execute()
        
        if result.data and len(result.data) > 0:
            incidents_df = pd.DataFrame(result.data)
        else:
            # Generate sample data
            incidents_df = generate_sample_incident_data(20)
    except Exception as e:
        # Fallback to sample data
        incidents_df = generate_sample_incident_data(20)
    
    # Apply filters
    filtered_df = incidents_df.copy()
    
    if status_filter:
        filtered_df = filtered_df[filtered_df['status'].isin(status_filter)]
    
    if service_filter:
        filtered_df = filtered_df[filtered_df['service'].isin(service_filter)]
        
    if impact_filter:
        filtered_df = filtered_df[filtered_df['impact'].isin(impact_filter)]
    
    # Display incidents
    if not filtered_df.empty:
        # Format dataframe
        display_df = filtered_df.copy()
        
        # Convert timestamp columns to datetime and format
        for col in ['created_at', 'updated_at', 'resolved_at']:
            if col in display_df.columns:
                display_df[col] = pd.to_datetime(display_df[col]).dt.strftime('%Y-%m-%d %H:%M')
        
        # Display incident count
        st.write(f"Showing {len(display_df)} incidents")
        
        # Loop through incidents and display them as cards
        for _, incident in display_df.iterrows():
            status_color = get_color_from_status(incident['status'])
            impact_color = get_color_from_status(incident['impact'])
            
            st.markdown(f"""
            <div style="padding: 15px; border-radius: 5px; border: 1px solid #ddd; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0;">{incident['title']}</h3>
                    <div>
                        <span style="background-color: {status_color}; color: white; padding: 3px 8px; border-radius: 10px; font-size: 14px; margin-right: 5px;">
                            {incident['status']}
                        </span>
                        <span style="background-color: {impact_color}; color: white; padding: 3px 8px; border-radius: 10px; font-size: 14px;">
                            {incident['impact']}
                        </span>
                    </div>
                </div>
                <div style="margin-top: 5px; color: #666;">
                    <strong>Service:</strong> {incident['service']} | <strong>Started:</strong> {incident['created_at']}
                </div>
                <div style="margin-top: 10px;">
                    {incident.get('description', 'No description provided.')}
                </div>
                <div style="margin-top: 10px;">
                    <strong>Affected users:</strong> {incident['affected_users']}
                </div>
            </div>
            """, unsafe_allow_html=True)
    else:
        st.info("No incidents found matching the filters")
    
    # Create new incident button
    with st.expander("Create New Incident"):
        with st.form("new_incident_form"):
            service = st.selectbox("Service", ["Authentication", "Database", "API", "Offline Mode", "Push Notifications"])
            title = st.text_input("Title")
            description = st.text_area("Description")
            status = st.selectbox("Status", ["investigating", "identified", "monitoring", "resolved"])
            impact = st.selectbox("Impact", ["low", "medium", "high", "critical"])
            affected_users = st.number_input("Affected Users", min_value=0, value=0)
            
            submit = st.form_submit_button("Create Incident")
            
            if submit:
                try:
                    supabase = get_supabase_client()
                    query = f"""
                    INSERT INTO admin_io5xn_system_incidents 
                    (service, title, description, status, impact, affected_users)
                    VALUES (
                        '{service}', '{title}', '{description}', '{status}', '{impact}', {affected_users}
                    )
                    """
                    result = supabase.rpc("execute_sql", {"sql": query}).execute()
                    st.success("Incident created successfully!")
                    # Reload the page to show the new incident
                    st.experimental_rerun()
                except Exception as e:
                    st.error(f"Error creating incident: {e}")

def render_sync_issues():
    """Display synchronization issues"""
    
    st.markdown("### Data Synchronization Issues")
    
    # Generate sample sync issues
    sync_issues = [
        {"id": "si001", "user_email": "user23@example.com", "operation": "POST", "table_name": "sport_tracking", "error": "Network timeout", "timestamp": "2023-06-09 14:32:45", "resolved": False},
        {"id": "si002", "user_email": "user78@example.com", "operation": "PUT", "table_name": "sleep_data", "error": "Validation error", "timestamp": "2023-06-08 23:15:22", "resolved": True},
        {"id": "si003", "user_email": "user45@example.com", "operation": "DELETE", "table_name": "ai_interactions", "error": "Permission denied", "timestamp": "2023-06-09 08:47:33", "resolved": False},
        {"id": "si004", "user_email": "user12@example.com", "operation": "POST", "table_name": "nutrition_logs", "error": "Duplicated entry", "timestamp": "2023-06-07 19:22:18", "resolved": True},
        {"id": "si005", "user_email": "user67@example.com", "operation": "PUT", "table_name": "exercise_data", "error": "Schema validation error", "timestamp": "2023-06-09 11:05:41", "resolved": False},
    ]
    
    # Filter controls
    col1, col2, col3 = st.columns(3)
    
    with col1:
        operation_filter = st.multiselect(
            "Filter by operation",
            ["POST", "PUT", "DELETE", "GET"],
            default=None
        )
    
    with col2:
        resolved_filter = st.selectbox(
            "Filter by status",
            ["All", "Unresolved", "Resolved"],
            index=0
        )
        
    with col3:
        search_query = st.text_input("Search by user email", "")
    
    # Apply filters
    filtered_issues = sync_issues.copy()
    
    if operation_filter:
        filtered_issues = [issue for issue in filtered_issues if issue['operation'] in operation_filter]
    
    if resolved_filter == "Unresolved":
        filtered_issues = [issue for issue in filtered_issues if not issue['resolved']]
    elif resolved_filter == "Resolved":
        filtered_issues = [issue for issue in filtered_issues if issue['resolved']]
        
    if search_query:
        filtered_issues = [issue for issue in filtered_issues if search_query.lower() in issue['user_email'].lower()]
    
    # Display issues
    if filtered_issues:
        st.write(f"Showing {len(filtered_issues)} sync issues")
        
        for issue in filtered_issues:
            col1, col2 = st.columns([3, 1])
            
            with col1:
                status_color = "green" if issue['resolved'] else "red"
                status_text = "RESOLVED" if issue['resolved'] else "UNRESOLVED"
                
                st.markdown(f"""
                <div style="padding: 15px; border-radius: 5px; border: 1px solid #ddd; margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h3 style="margin: 0;">{issue['table_name']} - {issue['operation']} Operation</h3>
                            <div style="margin-top: 5px; color: #666;">
                                <strong>User:</strong> {issue['user_email']} | <strong>Time:</strong> {issue['timestamp']}
                            </div>
                        </div>
                        <span style="background-color: {status_color}; color: white; padding: 3px 8px; border-radius: 10px; font-size: 14px;">
                            {status_text}
                        </span>
                    </div>
                    <div style="margin-top: 10px;">
                        <strong>Error:</strong> {issue['error']}
                    </div>
                </div>
                """, unsafe_allow_html=True)
            
            with col2:
                if not issue['resolved']:
                    if st.button(f"Mark Resolved", key=f"resolve_{issue['id']}"):
                        # In a real app, we would update the database here
                        st.success(f"Issue {issue['id']} marked as resolved!")
                        # In a real application, we would update the database and reload
                else:
                    if st.button(f"Reopen Issue", key=f"reopen_{issue['id']}"):
                        # In a real app, we would update the database here
                        st.info(f"Issue {issue['id']} reopened!")
                        # In a real application, we would update the database and reload
    else:
        st.info("No sync issues found matching the filters")

def render_service_health():
    """Display detailed service health metrics"""
    
    st.markdown("### Service Health Metrics")
    
    # Generate sample service health data over the past week
    end_date = datetime.now()
    start_date = end_date - timedelta(days=7)
    dates = pd.date_range(start=start_date, end=end_date, freq='1D')
    
    services = ["Authentication", "Database", "Storage", "API Service", "N8N Integration", "AI Services"]
    
    # Generate sample data
    health_data = []
    
    for service in services:
        # Base uptime percentages (slightly different for each service)
        base_uptime = 99.8 + np.random.uniform(-0.3, 0.2)
        
        for date in dates:
            # Generate uptime with small variations
            daily_variation = np.random.uniform(-0.2, 0.1)
            uptime = min(100, base_uptime + daily_variation)
            
            # Generate response time based on service type
            if service == "Database":
                response_time = 80 + np.random.normal(0, 10)
            elif service == "AI Services":
                response_time = 250 + np.random.normal(0, 30)
            else:
                response_time = 150 + np.random.normal(0, 20)
            
            # Track one service incident
            if service == "API Service" and date == dates[2]:
                uptime = 98.2
                response_time = 450
            
            health_data.append({
                "date": date,
                "service": service,
                "uptime": uptime,
                "response_time": response_time
            })
    
    # Convert to DataFrame
    health_df = pd.DataFrame(health_data)
    
    # Display uptime chart
    st.markdown("#### Service Uptime (%)")
    
    fig_uptime = px.line(
        health_df,
        x="date",
        y="uptime",
        color="service",
        labels={"date": "Date", "uptime": "Uptime (%)", "service": "Service"},
        title="Service Uptime - Last 7 Days"
    )
    
    # Set y-axis range to emphasize small changes
    fig_uptime.update_layout(
        yaxis=dict(range=[98, 100.1]),
        height=350,
        margin=dict(l=20, r=20, t=40, b=20)
    )
    
    st.plotly_chart(fig_uptime, use_container_width=True)
    
    # Display response time chart
    st.markdown("#### Service Response Time (ms)")
    
    fig_response = px.line(
        health_df,
        x="date",
        y="response_time",
        color="service",
        labels={"date": "Date", "response_time": "Response Time (ms)", "service": "Service"},
        title="Service Response Times - Last 7 Days"
    )
    
    fig_response.update_layout(
        height=350,
        margin=dict(l=20, r=20, t=40, b=20)
    )
    
    st.plotly_chart(fig_response, use_container_width=True)
    
    # Service configuration
    st.markdown("### Service Configuration")
    
    # Sample configurations
    configurations = [
        {"service": "N8N Integration", "endpoint": "https://n8n.myfitherov3.com/webhook/", "status": "connected", "last_checked": "2023-06-09 15:32:45"},
        {"service": "OpenAI API", "endpoint": "https://api.openai.com/v1", "status": "connected", "last_checked": "2023-06-09 15:30:12"},
        {"service": "Supabase", "endpoint": "https://otpimqedxtwpuvbvdxhz.supabase.co", "status": "connected", "last_checked": "2023-06-09 15:35:22"},
        {"service": "Weather API", "endpoint": "https://api.weatherapi.com/v1", "status": "error", "last_checked": "2023-06-09 14:45:33"},
    ]
    
    # Display configurations
    for config in configurations:
        status_color = "green" if config["status"] == "connected" else "red"
        
        st.markdown(f"""
        <div style="padding: 15px; border-radius: 5px; border: 1px solid #ddd; margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0;">{config['service']}</h3>
                <span style="background-color: {status_color}; color: white; padding: 3px 8px; border-radius: 10px; font-size: 14px;">
                    {config['status']}
                </span>
            </div>
            <div style="margin-top: 5px; font-family: monospace; font-size: 14px;">
                {config['endpoint']}
            </div>
            <div style="margin-top: 5px; color: #666;">
                Last checked: {config['last_checked']}
            </div>
            <div style="margin-top: 10px;">
                <button style="background-color: #f0f2f6; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-right: 10px;">
                    Test Connection
                </button>
                <button style="background-color: #f0f2f6; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
                    Edit Configuration
                </button>
            </div>
        </div>
        """, unsafe_allow_html=True)

def display_recent_incidents(limit=5):
    """Display recent system incidents"""
    
    # Try to fetch real data from database
    try:
        supabase = get_supabase_client()
        query = f"""
        SELECT *
        FROM admin_io5xn_system_incidents
        ORDER BY created_at DESC
        LIMIT {limit}
        """
        result = supabase.rpc("execute_sql", {"sql": query}).execute()
        
        if result.data and len(result.data) > 0:
            incidents = result.data
        else:
            # Generate sample data
            sample_df = generate_sample_incident_data(limit)
            incidents = sample_df.to_dict('records')
    except Exception as e:
        # Fallback to sample data
        sample_df = generate_sample_incident_data(limit)
        incidents = sample_df.to_dict('records')
    
    # Display incidents
    if incidents:
        for incident in incidents:
            status_color = get_color_from_status(incident['status'])
            impact_color = get_color_from_status(incident['impact'])
            
            # Format timestamps
            created_at = incident['created_at']
            if isinstance(created_at, str):
                # If it's already a string, use it as is
                created_str = created_at
            else:
                # If it's a datetime or timestamp, format it
                created_str = pd.to_datetime(created_at).strftime('%Y-%m-%d %H:%M')
            
            st.markdown(f"""
            <div style="padding: 10px; border-left: 4px solid {status_color}; background-color: #f9f9f9; margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: bold;">{incident['title']}</span>
                    <div>
                        <span style="background-color: {status_color}; color: white; padding: 2px 6px; border-radius: 10px; font-size: 12px; margin-right: 5px;">
                            {incident['status']}
                        </span>
                        <span style="background-color: {impact_color}; color: white; padding: 2px 6px; border-radius: 10px; font-size: 12px;">
                            {incident['impact']}
                        </span>
                    </div>
                </div>
                <div style="color: #666; font-size: 12px; margin-top: 5px;">
                    {incident['service']} | {created_str}
                </div>
            </div>
            """, unsafe_allow_html=True)
    else:
        st.write("No recent incidents.")