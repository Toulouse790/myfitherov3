# pages/settings.py
import streamlit as st
import pandas as pd
import json
from auth import get_supabase_client, login_required
import os

@login_required
def render_settings_page():
    """Render the admin settings page"""
    
    st.markdown("## Settings")
    
    # Create tabs for different settings sections
    tab1, tab2, tab3, tab4 = st.tabs(["API Configuration", "User Roles", "Notification Settings", "System Settings"])
    
    with tab1:
        render_api_config()
    
    with tab2:
        render_user_roles()
        
    with tab3:
        render_notification_settings()
        
    with tab4:
        render_system_settings()

def render_api_config():
    """Display API configuration settings"""
    
    st.markdown("### API Configuration")
    st.info("Configure external API connections used by MyFitHero")
    
    # Try to load existing configurations
    try:
        supabase = get_supabase_client()
        
        # N8N Configuration
        st.markdown("#### N8N Integration")
        
        col1, col2 = st.columns(2)
        with col1:
            n8n_url = st.text_input(
                "N8N Webhook URL",
                value="https://n8n.myfitherov3.com/webhook/",
                help="The base URL for N8N integration webhooks"
            )
        
        with col2:
            n8n_status = st.selectbox(
                "N8N Connection Status",
                options=["connected", "error", "unknown"],
                index=0
            )
        
        if st.button("Test N8N Connection"):
            with st.spinner("Testing connection..."):
                # Simulate a connection test
                import time
                time.sleep(1.5)
                st.success("Connection successful!")
        
        # OpenAI Configuration
        st.markdown("#### OpenAI API")
        
        openai_key = st.text_input(
            "OpenAI API Key",
            value="sk-•••••••••••••••••••••••••••••••",
            type="password",
            help="Your OpenAI API key for AI agent functionality"
        )
        
        col1, col2 = st.columns(2)
        with col1:
            openai_model = st.selectbox(
                "Default AI Model",
                options=["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"],
                index=1
            )
        
        with col2:
            temperature = st.slider(
                "Default Temperature",
                min_value=0.0,
                max_value=1.0,
                value=0.7,
                step=0.1,
                help="Controls randomness in AI responses"
            )
        
        # Supabase Configuration
        st.markdown("#### Supabase Configuration")
        
        col1, col2 = st.columns(2)
        with col1:
            supabase_url = st.text_input(
                "Supabase URL",
                value="https://otpimqedxtwpuvbvdxhz.supabase.co",
                disabled=True
            )
        
        with col2:
            supabase_key = st.text_input(
                "Supabase Key",
                value="eyJhbG•••••••••••••••••••••••••••",
                type="password",
                disabled=True
            )
        
        st.info("Supabase configuration can only be changed in environment variables")
        
        # Weather API
        st.markdown("#### Weather API")
        
        col1, col2 = st.columns(2)
        with col1:
            weather_api_key = st.text_input(
                "Weather API Key",
                value="",
                type="password",
                help="API key for weather integrations"
            )
        
        with col2:
            weather_api_url = st.text_input(
                "Weather API URL",
                value="https://api.weatherapi.com/v1",
                help="Base URL for weather API"
            )
        
        # Save button
        if st.button("Save API Configurations", key="save_api_config"):
            try:
                # In a real app, we would save to database
                st.success("API configurations saved successfully!")
            except Exception as e:
                st.error(f"Error saving configurations: {e}")
        
    except Exception as e:
        st.error(f"Error loading configurations: {e}")

def render_user_roles():
    """Display user roles and permissions settings"""
    
    st.markdown("### User Roles & Permissions")
    
    # Try to load existing roles and permissions
    try:
        supabase = get_supabase_client()
        
        # Fetch roles
        roles_query = """
        SELECT DISTINCT role FROM admin_io5xn_users
        """
        roles_result = supabase.rpc("execute_sql", {"sql": roles_query}).execute()
        
        if roles_result.data and len(roles_result.data) > 0:
            roles = [r[0] for r in roles_result.data]
        else:
            # Default roles
            roles = ["system_admin", "content_moderator", "data_analyst"]
        
        # Fetch permissions
        perms_query = """
        SELECT id, name, description, scope FROM admin_io5xn_permissions
        """
        perms_result = supabase.rpc("execute_sql", {"sql": perms_query}).execute()
        
        if perms_result.data and len(perms_result.data) > 0:
            permissions = perms_result.data
        else:
            # Sample permissions
            permissions = [
                {"id": "p1", "name": "manage_users", "description": "Can view, create, and manage user accounts", "scope": "users"},
                {"id": "p2", "name": "view_analytics", "description": "Can view analytics dashboards and reports", "scope": "analytics"},
                {"id": "p3", "name": "manage_ai_agents", "description": "Can create and modify AI agent configurations", "scope": "ai"},
                {"id": "p4", "name": "view_system_status", "description": "Can view system status and monitoring data", "scope": "system"},
                {"id": "p5", "name": "fix_sync_issues", "description": "Can fix synchronization issues", "scope": "system"},
                {"id": "p6", "name": "manage_content", "description": "Can create and manage content like exercise programs", "scope": "content"}
            ]
            
        # Fetch admin users
        users_query = """
        SELECT id, email, role, first_name, last_name, last_login_at
        FROM admin_io5xn_users
        ORDER BY email
        """
        users_result = supabase.rpc("execute_sql", {"sql": users_query}).execute()
        
        if users_result.data and len(users_result.data) > 0:
            admin_users = users_result.data
        else:
            # Sample users
            admin_users = [
                {"id": "u1", "email": "admin@myfitherov3.com", "role": "system_admin", "first_name": "Admin", "last_name": "User", "last_login_at": "2023-06-09 08:15:22"},
                {"id": "u2", "email": "moderator@myfitherov3.com", "role": "content_moderator", "first_name": "Content", "last_name": "Moderator", "last_login_at": "2023-06-08 16:42:35"},
                {"id": "u3", "email": "analyst@myfitherov3.com", "role": "data_analyst", "first_name": "Data", "last_name": "Analyst", "last_login_at": "2023-06-07 11:23:18"}
            ]
        
        # Display roles and their permissions
        st.markdown("#### Manage Roles")
        
        # Role selector
        selected_role = st.selectbox("Select Role", roles)
        
        # Display permissions for the role
        st.markdown(f"**Permissions for {selected_role}**")
        
        # Group permissions by scope for better organization
        permissions_by_scope = {}
        for perm in permissions:
            scope = perm.get("scope", "other")
            if scope not in permissions_by_scope:
                permissions_by_scope[scope] = []
            permissions_by_scope[scope].append(perm)
        
        # Display permissions by scope with checkboxes
        for scope, perms in permissions_by_scope.items():
            st.markdown(f"**{scope.capitalize()}**")
            for perm in perms:
                st.checkbox(
                    f"{perm['name']} - {perm['description']}",
                    value=True if selected_role == "system_admin" else (selected_role == "content_moderator" and perm["scope"] == "content"),
                    key=f"perm_{selected_role}_{perm['id']}"
                )
        
        if st.button("Update Role Permissions", key="update_role_perms"):
            st.success(f"Permissions for role '{selected_role}' updated!")
        
        # Admin user management
        st.markdown("#### Admin Users")
        
        # Convert users to dataframe for display
        if admin_users:
            users_df = pd.DataFrame(admin_users)
            
            # Format the last_login_at column if it exists
            if "last_login_at" in users_df.columns:
                users_df["last_login_at"] = pd.to_datetime(users_df["last_login_at"]).dt.strftime("%Y-%m-%d %H:%M")
            
            # Display the users table
            st.dataframe(
                users_df,
                column_config={
                    "id": st.column_config.TextColumn("ID"),
                    "email": st.column_config.TextColumn("Email"),
                    "role": st.column_config.TextColumn("Role"),
                    "first_name": st.column_config.TextColumn("First Name"),
                    "last_name": st.column_config.TextColumn("Last Name"),
                    "last_login_at": st.column_config.TextColumn("Last Login")
                },
                hide_index=True,
                use_container_width=True
            )
        
        # Add new admin user form
        st.markdown("#### Add Admin User")
        with st.form("add_admin_form"):
            col1, col2 = st.columns(2)
            with col1:
                email = st.text_input("Email")
                role = st.selectbox("Role", roles)
            
            with col2:
                first_name = st.text_input("First Name")
                last_name = st.text_input("Last Name")
            
            submit = st.form_submit_button("Add User")
            
            if submit:
                if not email or not first_name or not last_name:
                    st.error("All fields are required!")
                else:
                    try:
                        # In a real app, we would add the user to the database
                        st.success(f"User '{email}' added successfully with role '{role}'!")
                    except Exception as e:
                        st.error(f"Error adding user: {e}")
        
    except Exception as e:
        st.error(f"Error loading roles and permissions: {e}")

def render_notification_settings():
    """Display notification settings"""
    
    st.markdown("### Notification Settings")
    st.info("Configure system notifications and alerts for administrators")
    
    # Email notifications
    st.markdown("#### Email Notifications")
    
    col1, col2 = st.columns(2)
    with col1:
        st.checkbox("Send critical system alerts", value=True)
        st.checkbox("Send daily summary reports", value=True)
        st.checkbox("Send user registration notifications", value=False)
    
    with col2:
        st.checkbox("Send sync issue alerts", value=True)
        st.checkbox("Send weekly analytics reports", value=True)
        st.checkbox("Send API status changes", value=True)
    
    # Recipients
    st.markdown("#### Notification Recipients")
    recipients = st.text_area("Email Recipients (one per line)", value="admin@myfitherov3.com\ntechnical@myfitherov3.com")
    
    # Alert thresholds
    st.markdown("#### Alert Thresholds")
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.number_input("Error rate threshold (%)", min_value=1, max_value=100, value=5)
    
    with col2:
        st.number_input("Response time threshold (ms)", min_value=100, max_value=10000, value=1000)
    
    with col3:
        st.number_input("API failure threshold", min_value=1, max_value=100, value=3)
    
    # Save settings
    if st.button("Save Notification Settings"):
        st.success("Notification settings saved successfully!")

def render_system_settings():
    """Display general system settings"""
    
    st.markdown("### System Settings")
    
    # Session management
    st.markdown("#### Session Management")
    
    col1, col2 = st.columns(2)
    with col1:
        st.number_input("Session timeout (minutes)", min_value=5, max_value=240, value=60)
    
    with col2:
        st.number_input("Max concurrent sessions per user", min_value=1, max_value=10, value=3)
    
    # Data retention
    st.markdown("#### Data Retention")
    
    col1, col2 = st.columns(2)
    with col1:
        st.number_input("Log retention period (days)", min_value=7, max_value=365, value=90)
    
    with col2:
        st.number_input("Analytics data retention (days)", min_value=30, max_value=730, value=365)
    
    # Cache settings
    st.markdown("#### Cache Settings")
    
    col1, col2 = st.columns(2)
    with col1:
        st.checkbox("Enable data caching", value=True)
    
    with col2:
        st.number_input("Cache expiry (minutes)", min_value=5, max_value=120, value=15)
    
    # Feature flags
    st.markdown("#### Feature Flags")
    
    col1, col2 = st.columns(2)
    with col1:
        st.checkbox("Enable offline mode", value=True)
        st.checkbox("Enable AI assistants", value=True)
    
    with col2:
        st.checkbox("Enable advanced analytics", value=True)
        st.checkbox("Enable beta features", value=False)
    
    # Database tables
    st.markdown("#### Database Tables")
    
    if st.button("Show Database Schema"):
        with st.spinner("Loading schema..."):
            try:
                supabase = get_supabase_client()
                schema_query = """
                SELECT 
                    table_name,
                    COUNT(*) as row_count
                FROM 
                    information_schema.tables 
                WHERE 
                    table_schema = 'public' AND
                    table_name LIKE 'admin_io5xn_%'
                GROUP BY
                    table_name
                ORDER BY 
                    table_name
                """
                result = supabase.rpc("execute_sql", {"sql": schema_query}).execute()
                
                if result.data and len(result.data) > 0:
                    tables = []
                    for row in result.data:
                        tables.append({
                            "table_name": row[0],
                            "row_count": row[1]
                        })
                    
                    tables_df = pd.DataFrame(tables)
                    st.dataframe(tables_df, use_container_width=True)
                else:
                    st.info("No admin tables found")
                    
            except Exception as e:
                st.error(f"Error loading schema: {e}")
    
    # Maintenance mode
    st.markdown("#### Maintenance")
    
    maintenance_mode = st.checkbox("Enable maintenance mode", value=False)
    
    if maintenance_mode:
        maintenance_message = st.text_area(
            "Maintenance message", 
            value="The system is currently undergoing scheduled maintenance. Please try again later."
        )
    
    # Save settings
    if st.button("Save System Settings"):
        st.success("System settings saved successfully!")