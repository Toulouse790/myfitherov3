# pages/ai_agents.py
import streamlit as st
import pandas as pd
import json
from datetime import datetime
from auth import get_supabase_client, login_required

@login_required
def render_ai_agents_page():
    """Render the AI agents management page"""
    
    st.markdown("## AI Agent Management")
    
    # Create tabs for different AI agent views
    tab1, tab2, tab3 = st.tabs(["Agent Overview", "Agent Editor", "Interaction Analytics"])
    
    with tab1:
        render_agent_overview()
    
    with tab2:
        render_agent_editor()
        
    with tab3:
        render_interaction_analytics()

def render_agent_overview():
    """Display AI agent overview"""
    
    # Try to fetch real data from database
    try:
        supabase = get_supabase_client()
        query = """
        SELECT 
            id, name, type, description, status, version,
            created_at, updated_at
        FROM admin_io5xn_ai_agents
        ORDER BY updated_at DESC
        """
        result = supabase.rpc("execute_sql", {"sql": query}).execute()
        
        if result.data and len(result.data) > 0:
            agent_data = result.data
        else:
            # Generate sample data if no data is available
            agent_data = generate_sample_agents()
    except Exception as e:
        # Fallback to sample data
        agent_data = generate_sample_agents()
    
    # Display agents in a grid layout
    st.markdown("### AI Agents")
    
    # Create a dataframe for easier filtering
    if agent_data:
        df = pd.DataFrame(agent_data)
        
        # Format date columns if they exist
        for col in ['created_at', 'updated_at']:
            if col in df.columns:
                df[col] = pd.to_datetime(df[col]).dt.strftime('%Y-%m-%d')
        
        # Add filters
        col1, col2 = st.columns(2)
        
        with col1:
            agent_types = df['type'].unique().tolist()
            selected_types = st.multiselect("Filter by type", agent_types, default=agent_types)
            
        with col2:
            statuses = df['status'].unique().tolist()
            selected_statuses = st.multiselect("Filter by status", statuses, default=statuses)
        
        # Apply filters
        filtered_df = df[(df['type'].isin(selected_types)) & (df['status'].isin(selected_statuses))]
        
        if len(filtered_df) > 0:
            # Display agents in a grid
            st.write(f"Showing {len(filtered_df)} agents")
            
            # Create a 3-column grid for agents
            cols = st.columns(3)
            
            for i, (_, agent) in enumerate(filtered_df.iterrows()):
                with cols[i % 3]:
                    # Determine status color
                    status_color = "green" if agent["status"] == "active" else "gray" if agent["status"] == "draft" else "red"
                    
                    st.markdown(f"""
                    <div style="padding: 15px; border-radius: 5px; border: 1px solid #ddd; margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h3 style="margin: 0;">{agent['name']}</h3>
                            <span style="background-color: {status_color}; color: white; padding: 3px 8px; border-radius: 10px; font-size: 14px;">
                                {agent['status']}
                            </span>
                        </div>
                        <div style="color: #666; margin-top: 5px;">
                            Type: {agent['type']} | Version: {agent['version']}
                        </div>
                        <p style="margin-top: 10px; height: 60px; overflow: hidden;">
                            {agent.get('description', 'No description available.')}
                        </p>
                        <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                            <span style="color: #666; font-size: 12px;">Updated: {agent.get('updated_at', 'Unknown')}</span>
                            <button style="background-color: #f0f2f6; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
                                Edit
                            </button>
                        </div>
                    </div>
                    """, unsafe_allow_html=True)
        else:
            st.info("No agents found matching the filters")
    else:
        st.info("No AI agents found")
    
    # Add a button to create a new agent
    if st.button("➕ Create New Agent"):
        st.session_state.selected_agent_id = "new"
        st.session_state.current_tab = "Agent Editor"
        st.experimental_rerun()

def render_agent_editor():
    """Display AI agent editor"""
    
    # Initialize session state for agent editing
    if "selected_agent_id" not in st.session_state:
        st.session_state.selected_agent_id = None
        
    if "agent_form_data" not in st.session_state:
        st.session_state.agent_form_data = {
            "name": "",
            "type": "general",
            "description": "",
            "system_prompt": "",
            "status": "draft",
            "version": 1
        }
    
    # Try to load agent data if an ID is selected
    if st.session_state.selected_agent_id and st.session_state.selected_agent_id != "new":
        try:
            supabase = get_supabase_client()
            query = f"""
            SELECT *
            FROM admin_io5xn_ai_agents
            WHERE id = '{st.session_state.selected_agent_id}'
            """
            result = supabase.rpc("execute_sql", {"sql": query}).execute()
            
            if result.data and len(result.data) > 0:
                agent = result.data[0]
                st.session_state.agent_form_data = {
                    "name": agent.get("name", ""),
                    "type": agent.get("type", "general"),
                    "description": agent.get("description", ""),
                    "system_prompt": agent.get("system_prompt", ""),
                    "status": agent.get("status", "draft"),
                    "version": agent.get("version", 1)
                }
        except Exception as e:
            st.error(f"Error loading agent data: {e}")
    
    # Agent selection
    st.markdown("### Agent Editor")
    
    # Try to load agent list
    try:
        supabase = get_supabase_client()
        query = """
        SELECT id, name, type, status
        FROM admin_io5xn_ai_agents
        ORDER BY name
        """
        result = supabase.rpc("execute_sql", {"sql": query}).execute()
        
        if result.data and len(result.data) > 0:
            agents = result.data
            agent_options = [f"{a['name']} ({a['type']}) - {a['status']}" for a in agents]
            agent_ids = [a['id'] for a in agents]
            
            # Add "Create New" option
            agent_options.insert(0, "Create New Agent")
            agent_ids.insert(0, "new")
            
            selected_index = 0
            if st.session_state.selected_agent_id in agent_ids:
                selected_index = agent_ids.index(st.session_state.selected_agent_id)
            
            selected_option = st.selectbox(
                "Select an agent to edit or create a new one",
                options=agent_options,
                index=selected_index
            )
            
            if agent_options.index(selected_option) != selected_index:
                # User selected a different agent
                new_index = agent_options.index(selected_option)
                st.session_state.selected_agent_id = agent_ids[new_index]
                
                # Reset form data if creating a new agent
                if st.session_state.selected_agent_id == "new":
                    st.session_state.agent_form_data = {
                        "name": "",
                        "type": "general",
                        "description": "",
                        "system_prompt": "",
                        "status": "draft",
                        "version": 1
                    }
                st.experimental_rerun()
        else:
            # No agents found, show only create new option
            st.selectbox("Select an agent to edit or create a new one", ["Create New Agent"])
            st.session_state.selected_agent_id = "new"
    except Exception as e:
        st.error(f"Error loading agent list: {e}")
        st.session_state.selected_agent_id = "new"
    
    # Agent edit form
    with st.form("agent_edit_form"):
        # Basic information
        st.markdown("#### Basic Information")
        name = st.text_input("Agent Name", value=st.session_state.agent_form_data["name"])
        
        col1, col2 = st.columns(2)
        with col1:
            agent_type = st.selectbox(
                "Agent Type",
                options=["sommeil", "nutrition", "diagnostic_global", "hydratation", "mental", "exercice", "general"],
                index=["sommeil", "nutrition", "diagnostic_global", "hydratation", "mental", "exercice", "general"].index(st.session_state.agent_form_data["type"])
            )
        
        with col2:
            status = st.selectbox(
                "Status",
                options=["draft", "active", "archived"],
                index=["draft", "active", "archived"].index(st.session_state.agent_form_data["status"])
            )
        
        description = st.text_area("Description", value=st.session_state.agent_form_data["description"], height=100)
        
        # System prompt
        st.markdown("#### System Prompt")
        system_prompt = st.text_area(
            "System Prompt", 
            value=st.session_state.agent_form_data["system_prompt"],
            height=250,
            help="The system prompt defines the AI agent's behavior and knowledge. Be specific about its role and limitations."
        )
        
        # Example dialogs
        st.markdown("#### Example Dialogs")
        st.info("Example dialogs help train the AI agent with specific interactions. Add examples of user queries and ideal responses.")
        
        example_dialogs = []
        for i in range(3):  # Allow 3 example dialogs
            st.markdown(f"##### Example Dialog {i+1}")
            col1, col2 = st.columns(2)
            with col1:
                user_prompt = st.text_area(f"User Query {i+1}", value="", height=100, key=f"user_prompt_{i}")
            with col2:
                assistant_response = st.text_area(f"Assistant Response {i+1}", value="", height=100, key=f"assistant_response_{i}")
            
            if user_prompt and assistant_response:
                example_dialogs.append({
                    "user_prompt": user_prompt,
                    "assistant_response": assistant_response,
                    "order_num": i+1
                })
        
        # Submit button
        submit = st.form_submit_button("Save Agent")
        
        if submit:
            # Validate form
            if not name or not system_prompt:
                st.error("Agent name and system prompt are required")
            else:
                try:
                    supabase = get_supabase_client()
                    
                    # Prepare agent data
                    agent_data = {
                        "name": name,
                        "type": agent_type,
                        "description": description,
                        "system_prompt": system_prompt,
                        "status": status,
                        "version": st.session_state.agent_form_data["version"]
                    }
                    
                    if st.session_state.selected_agent_id == "new":
                        # Create new agent
                        query = f"""
                        INSERT INTO admin_io5xn_ai_agents (name, type, description, system_prompt, status, version)
                        VALUES (
                            '{agent_data["name"]}', 
                            '{agent_data["type"]}', 
                            '{agent_data["description"]}', 
                            '{agent_data["system_prompt"]}', 
                            '{agent_data["status"]}', 
                            {agent_data["version"]}
                        )
                        RETURNING id
                        """
                        result = supabase.rpc("execute_sql", {"sql": query}).execute()
                        
                        if result.data and len(result.data) > 0:
                            agent_id = result.data[0]["id"]
                            st.session_state.selected_agent_id = agent_id
                            
                            # Insert example dialogs if any
                            for dialog in example_dialogs:
                                dialog_query = f"""
                                INSERT INTO admin_io5xn_ai_dialogs (agent_id, user_prompt, assistant_response, order_num)
                                VALUES (
                                    '{agent_id}',
                                    '{dialog["user_prompt"]}',
                                    '{dialog["assistant_response"]}',
                                    {dialog["order_num"]}
                                )
                                """
                                supabase.rpc("execute_sql", {"sql": dialog_query}).execute()
                            
                            st.success("Agent created successfully!")
                        else:
                            st.error("Failed to create agent")
                    else:
                        # Update existing agent
                        query = f"""
                        UPDATE admin_io5xn_ai_agents
                        SET 
                            name = '{agent_data["name"]}',
                            type = '{agent_data["type"]}',
                            description = '{agent_data["description"]}',
                            system_prompt = '{agent_data["system_prompt"]}',
                            status = '{agent_data["status"]}',
                            version = {agent_data["version"]},
                            updated_at = NOW()
                        WHERE id = '{st.session_state.selected_agent_id}'
                        """
                        supabase.rpc("execute_sql", {"sql": query}).execute()
                        st.success("Agent updated successfully!")
                        
                except Exception as e:
                    st.error(f"Error saving agent: {e}")

def render_interaction_analytics():
    """Display AI interaction analytics"""
    
    st.markdown("### AI Agent Interaction Analytics")
    
    # Try to fetch real data from database
    try:
        supabase = get_supabase_client()
        query = """
        SELECT 
            agent_type,
            COUNT(*) as interaction_count,
            AVG(processing_time) as avg_processing_time,
            AVG(satisfaction_rating) as avg_satisfaction
        FROM admin_io5xn_ai_interactions
        GROUP BY agent_type
        ORDER BY interaction_count DESC
        """
        result = supabase.rpc("execute_sql", {"sql": query}).execute()
        
        if result.data and len(result.data) > 0:
            interaction_data = pd.DataFrame(result.data)
        else:
            # Generate sample data
            interaction_data = generate_sample_interaction_data()
    except Exception as e:
        # Fallback to sample data
        interaction_data = generate_sample_interaction_data()
    
    # Display overall metrics
    col1, col2, col3 = st.columns(3)
    
    with col1:
        total_interactions = int(interaction_data['interaction_count'].sum())
        st.metric("Total Interactions", f"{total_interactions:,}")
    
    with col2:
        avg_satisfaction = round(interaction_data['avg_satisfaction'].mean(), 2)
        st.metric("Avg. Satisfaction", f"{avg_satisfaction}/5")
    
    with col3:
        avg_time = round(interaction_data['avg_processing_time'].mean(), 2)
        st.metric("Avg. Response Time", f"{avg_time}s")
    
    # Import and display interaction charts
    from components.charts import display_agent_performance_chart
    display_agent_performance_chart()
    
    # Display daily interaction volume
    st.markdown("### Daily Interaction Volume")
    
    # Generate sample daily data
    from datetime import datetime, timedelta
    import numpy as np
    
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)
    dates = pd.date_range(start=start_date, end=end_date, freq='D')
    
    daily_data = pd.DataFrame({
        'date': dates,
        'interactions': np.random.randint(50, 200, size=len(dates))
    })
    
    # Create chart
    import plotly.express as px
    
    fig = px.bar(
        daily_data,
        x='date',
        y='interactions',
        labels={'date': 'Date', 'interactions': 'Interactions'},
        title='Daily AI Interactions - Last 30 Days'
    )
    
    fig.update_layout(
        height=350,
        margin=dict(l=20, r=20, t=40, b=20)
    )
    
    st.plotly_chart(fig, use_container_width=True)
    
    # Display recent interactions
    st.markdown("### Recent Interactions")
    
    # Try to fetch real data
    try:
        supabase = get_supabase_client()
        query = """
        SELECT 
            id, user_email, agent_type, user_query, ai_response, 
            timestamp, satisfaction_rating, processing_time
        FROM admin_io5xn_ai_interactions
        ORDER BY timestamp DESC
        LIMIT 10
        """
        result = supabase.rpc("execute_sql", {"sql": query}).execute()
        
        if result.data and len(result.data) > 0:
            recent_interactions = result.data
        else:
            # Generate sample data
            recent_interactions = generate_sample_recent_interactions()
    except Exception as e:
        # Fallback to sample data
        recent_interactions = generate_sample_recent_interactions()
    
    # Display interactions
    for interaction in recent_interactions:
        # Format timestamp
        timestamp = interaction['timestamp']
        if isinstance(timestamp, str):
            # If it's a string, use as is
            timestamp_str = timestamp
        else:
            # If it's a datetime, format it
            timestamp_str = pd.to_datetime(timestamp).strftime('%Y-%m-%d %H:%M')
        
        # Create an expander for each interaction
        with st.expander(f"{interaction['agent_type']} - {timestamp_str}"):
            st.markdown(f"**User**: {interaction['user_email']}")
            st.markdown(f"**Query**: {interaction['user_query']}")
            st.markdown(f"**Response**: {interaction['ai_response']}")
            
            col1, col2 = st.columns(2)
            with col1:
                rating = interaction.get('satisfaction_rating', None)
                if rating:
                    st.markdown(f"**Rating**: {'⭐' * int(rating)}")
                else:
                    st.markdown("**Rating**: Not rated")
            
            with col2:
                processing_time = interaction.get('processing_time', None)
                if processing_time:
                    st.markdown(f"**Processing Time**: {processing_time:.2f}s")

def generate_sample_agents():
    """Generate sample AI agents for development"""
    return [
        {
            "id": "agent_1",
            "name": "Sleep Coach",
            "type": "sommeil",
            "description": "AI agent that provides sleep advice and analyzes sleep patterns",
            "status": "active",
            "version": 2,
            "created_at": "2023-05-15",
            "updated_at": "2023-06-02"
        },
        {
            "id": "agent_2",
            "name": "Nutrition Assistant",
            "type": "nutrition",
            "description": "Provides personalized nutrition advice and meal planning",
            "status": "active",
            "version": 3,
            "created_at": "2023-04-20",
            "updated_at": "2023-06-05"
        },
        {
            "id": "agent_3",
            "name": "Exercise Coach",
            "type": "exercice",
            "description": "Helps users create and optimize workout routines",
            "status": "active",
            "version": 1,
            "created_at": "2023-05-28",
            "updated_at": "2023-05-28"
        },
        {
            "id": "agent_4",
            "name": "Health Diagnostic",
            "type": "diagnostic_global",
            "description": "Analyzes user data to provide health insights and recommendations",
            "status": "draft",
            "version": 1,
            "created_at": "2023-06-01",
            "updated_at": "2023-06-01"
        },
        {
            "id": "agent_5",
            "name": "Hydration Coach",
            "type": "hydratation",
            "description": "Monitors hydration levels and provides recommendations",
            "status": "active",
            "version": 1,
            "created_at": "2023-05-10",
            "updated_at": "2023-05-10"
        },
        {
            "id": "agent_6",
            "name": "Mental Wellness",
            "type": "mental",
            "description": "Provides mental health support and mindfulness exercises",
            "status": "archived",
            "version": 2,
            "created_at": "2023-03-15",
            "updated_at": "2023-05-20"
        }
    ]

def generate_sample_interaction_data():
    """Generate sample AI interaction data for development"""
    agent_types = ['sommeil', 'nutrition', 'diagnostic_global', 'hydratation', 'mental', 'exercice', 'general']
    
    data = {
        'agent_type': agent_types,
        'interaction_count': [450, 320, 180, 210, 265, 370, 290],
        'avg_processing_time': [1.2, 1.5, 2.3, 0.9, 1.8, 1.3, 1.1],
        'avg_satisfaction': [4.2, 3.8, 3.5, 4.1, 3.9, 4.3, 4.0]
    }
    
    return pd.DataFrame(data)

def generate_sample_recent_interactions():
    """Generate sample recent AI interactions for development"""
    agent_types = ['sommeil', 'nutrition', 'diagnostic_global', 'hydratation', 'mental', 'exercice', 'general']
    
    interactions = []
    for i in range(10):
        agent_type = agent_types[i % len(agent_types)]
        
        if agent_type == 'sommeil':
            query = "What's the ideal amount of sleep I should be getting?"
            response = "For most adults, 7-9 hours of sleep per night is recommended. However, individual needs may vary based on age, activity level, and health conditions. Your recent sleep data shows an average of 6.2 hours, which is slightly below the recommended range."
        elif agent_type == 'nutrition':
            query = "Can you suggest a high-protein breakfast that's quick to prepare?"
            response = "Certainly! Here are some quick high-protein breakfast options: 1) Greek yogurt with nuts and berries (20g protein), 2) Scrambled eggs with spinach and whole grain toast (18g protein), 3) Overnight oats with protein powder and chia seeds (25g protein), 4) Protein smoothie with banana, peanut butter, and milk (22g protein)."
        elif agent_type == 'exercice':
            query = "I have knee pain. What exercises should I avoid?"
            response = "With knee pain, it's best to avoid high-impact exercises like running, jumping, deep squats, and lunges. Instead, focus on low-impact activities such as swimming, cycling, elliptical training, and walking on level surfaces. Strengthen surrounding muscles with straight leg raises and hamstring curls. Always consult with a healthcare professional for personalized advice."
        else:
            query = f"Can you help me with my {agent_type} routine?"
            response = f"I'd be happy to help with your {agent_type} routine! Based on your recent data, I recommend focusing on [personalized advice would appear here]. Would you like more specific recommendations?"
        
        interactions.append({
            "id": f"int_{i+1}",
            "user_email": f"user{i+10}@example.com",
            "agent_type": agent_type,
            "user_query": query,
            "ai_response": response,
            "timestamp": (datetime.now() - timedelta(hours=i*3)).strftime('%Y-%m-%d %H:%M'),
            "satisfaction_rating": 3 + (i % 3),
            "processing_time": 0.8 + (i * 0.2)
        })
    
    return interactions