# auth.py
import os
import streamlit as st
from supabase import create_client, Client
import time
import json

def get_supabase_client() -> Client:
    """Get a Supabase client instance"""
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    
    if not url or not key:
        st.error("Supabase credentials not found in environment variables.")
        return None
    
    return create_client(url, key)

def authenticate_user(email: str, password: str) -> tuple:
    """
    Authenticate admin user with email and password
    
    Args:
        email: Admin email
        password: Admin password
        
    Returns:
        tuple: (success: bool, role: str)
    """
    # For demo purposes, use hardcoded credentials
    # In production, this should be handled by Supabase Auth
    if email == "admin@myfitherov3.com" and password == "admin123":
        # Get user role from database
        try:
            supabase = get_supabase_client()
            response = supabase.table("admin_io5xn_users") \
                .select("role") \
                .eq("email", email) \
                .execute()
            
            if len(response.data) > 0:
                role = response.data[0]["role"]
                
                # Update last login time
                supabase.table("admin_io5xn_users") \
                    .update({"last_login_at": "now()"}) \
                    .eq("email", email) \
                    .execute()
                
                return True, role
            else:
                return False, None
        except Exception as e:
            st.error(f"Error connecting to database: {e}")
            # Fallback to default role if DB connection fails
            return True, "system_admin"
    return False, None

def get_user_permissions(email: str) -> list:
    """
    Get permissions for the current user
    
    Args:
        email: User email
        
    Returns:
        list: List of permission names
    """
    try:
        supabase = get_supabase_client()
        query = f"""
        SELECT p.name, p.scope
        FROM admin_io5xn_permissions p
        JOIN admin_io5xn_user_permissions up ON p.id = up.permission_id
        JOIN admin_io5xn_users u ON u.id = up.admin_user_id
        WHERE u.email = '{email}'
        """
        response = supabase.rpc("execute_sql", {"sql": query}).execute()
        
        if hasattr(response, 'data') and response.data:
            # Convert to dictionary grouped by scope
            permissions = {}
            for perm in response.data:
                scope = perm['scope']
                name = perm['name']
                if scope not in permissions:
                    permissions[scope] = []
                permissions[scope].append(name)
            return permissions
        return {}
    except Exception as e:
        st.error(f"Error fetching permissions: {e}")
        return {}

def logout_user():
    """Log out the current user"""
    st.session_state.authenticated = False
    st.session_state.user_email = None
    st.session_state.user_role = None

def login_required(func):
    """Decorator to require login for a function"""
    def wrapper(*args, **kwargs):
        if not st.session_state.authenticated:
            st.warning("Please log in to access this page.")
            st.stop()
        return func(*args, **kwargs)
    return wrapper