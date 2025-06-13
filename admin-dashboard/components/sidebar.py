# components/sidebar.py
import streamlit as st
from auth import logout_user

def render_sidebar():
    """Render the sidebar navigation"""
    
    with st.sidebar:
        st.markdown("## Navigation")
        
        # User info
        if st.session_state.authenticated and st.session_state.user_email:
            st.markdown(f"### 👤 {st.session_state.user_email}")
            st.markdown(f"**Role:** {st.session_state.user_role}")
            
            # Navigation options
            pages = [
                {"name": "Dashboard", "icon": "📊"},
                {"name": "Users", "icon": "👥"},
                {"name": "System Status", "icon": "🔧"},
                {"name": "AI Agents", "icon": "🤖"},
                {"name": "Analytics", "icon": "📈"},
                {"name": "Settings", "icon": "⚙️"}
            ]
            
            st.markdown("---")
            
            for page in pages:
                if st.button(
                    f"{page['icon']} {page['name']}", 
                    key=f"nav_{page['name']}", 
                    use_container_width=True,
                    type="primary" if st.session_state.current_page == page["name"] else "secondary"
                ):
                    st.session_state.current_page = page["name"]
                    st.experimental_rerun()
            
            # Logout button
            st.markdown("---")
            if st.button("🚪 Logout", key="logout_btn", use_container_width=True):
                logout_user()
                st.experimental_rerun()
            
            # Version info
            st.markdown("---")
            st.markdown("##### MyFitHero Admin v1.0.0")