# app.py
import streamlit as st
import os
import time
from config import initialize_config
from auth import login_required, authenticate_user, logout_user
from components.sidebar import render_sidebar

# Initialize config
initialize_config()

# Set page configuration
st.set_page_config(
    page_title="MyFitHero Admin Dashboard",
    page_icon="🏆",
    layout="wide"
)

# Initialize session state variables
if "authenticated" not in st.session_state:
    st.session_state.authenticated = False
if "user_role" not in st.session_state:
    st.session_state.user_role = None
if "user_email" not in st.session_state:
    st.session_state.user_email = None
if "current_page" not in st.session_state:
    st.session_state.current_page = "Dashboard"

def main():
    """Main function to render the app"""
    
    # Display header
    st.markdown(
        """
        <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <h1 style="margin: 0;">MyFitHero Admin Dashboard 🏆</h1>
        </div>
        """, 
        unsafe_allow_html=True
    )

    # Check if user is authenticated
    if not st.session_state.authenticated:
        render_login_page()
    else:
        # Render sidebar and main content
        render_sidebar()
        
        # Render selected page
        if st.session_state.current_page == "Dashboard":
            render_dashboard()
        elif st.session_state.current_page == "Users":
            from pages.users import render_users_page
            render_users_page()
        elif st.session_state.current_page == "System Status":
            from pages.system_status import render_system_page
            render_system_page()
        elif st.session_state.current_page == "AI Agents":
            from pages.ai_agents import render_ai_agents_page
            render_ai_agents_page()
        elif st.session_state.current_page == "Analytics":
            from pages.analytics import render_analytics_page
            render_analytics_page()
        elif st.session_state.current_page == "Settings":
            from pages.settings import render_settings_page
            render_settings_page()

def render_login_page():
    """Render login page"""
    
    col1, col2, col3 = st.columns([1, 2, 1])
    
    with col2:
        st.markdown("<h2 style='text-align: center;'>Admin Login</h2>", unsafe_allow_html=True)
        
        # Create a form for login
        with st.form("login_form"):
            email = st.text_input("Email", key="email_input")
            password = st.text_input("Password", type="password", key="password_input")
            submit = st.form_submit_button("Login")
            
            if submit:
                with st.spinner("Authenticating..."):
                    success, role = authenticate_user(email, password)
                    
                    if success:
                        st.session_state.authenticated = True
                        st.session_state.user_email = email
                        st.session_state.user_role = role
                        st.success("Login successful!")
                        time.sleep(1)
                        st.experimental_rerun()
                    else:
                        st.error("Invalid credentials. Please try again.")
        
        st.markdown("""
        <div style="text-align: center; margin-top: 30px;">
            <p>Default admin credentials (for demo only):</p>
            <p><strong>Email:</strong> admin@myfitherov3.com</p>
            <p><strong>Password:</strong> admin123</p>
        </div>
        """, unsafe_allow_html=True)

def render_dashboard():
    """Render dashboard overview"""
    
    st.markdown("## Dashboard Overview")
    
    # Import and display dashboard metrics
    from components.metrics import display_key_metrics
    display_key_metrics()
    
    # Display some charts
    from components.charts import display_user_activity_chart, display_agent_performance_chart
    
    col1, col2 = st.columns(2)
    
    with col1:
        display_user_activity_chart()
        
    with col2:
        display_agent_performance_chart()
    
    # Recent incidents
    st.markdown("### Recent Incidents")
    from pages.system_status import display_recent_incidents
    display_recent_incidents(limit=5)

if __name__ == "__main__":
    main()