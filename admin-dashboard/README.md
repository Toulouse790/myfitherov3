# MyFitHero Admin Dashboard

## Overview
The MyFitHero Admin Dashboard is a comprehensive administrative interface for the MyFitHero application. It provides tools for user management, system monitoring, analytics, AI agent management, and application settings.

## Features
- **User Management**: View, search, and manage user accounts
- **System Status Monitoring**: Real-time performance metrics and service health
- **Analytics Dashboard**: Visual representation of key application metrics
- **AI Agent Management**: Configure and monitor AI training agents
- **Settings Configuration**: Application-wide configuration interface

## Technology Stack
- **Frontend**: Streamlit
- **Backend**: Python
- **Database**: Supabase
- **Integration**: APIs for main MyFitHero application

## Installation

1. Clone the repository
```
git clone https://github.com/Toulouse790/myfitherov3.git
cd myfitherov3/admin-dashboard
```

2. Install dependencies
```
pip install -r requirements.txt
```

3. Set up environment variables
Create a .env file in the root directory with the following variables:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
ADMIN_USERNAME=admin_username
ADMIN_PASSWORD=admin_password
```

4. Run the application
```
streamlit run app.py
```

## Deployment
The dashboard is currently deployed and accessible at:
[https://myfitherov3-admin-dashboard-bc0tkq-iv9i8-io5xn-5a920b.mgx.dev](https://myfitherov3-admin-dashboard-bc0tkq-iv9i8-io5xn-5a920b.mgx.dev)

## Contributing
Contributions to the admin dashboard are welcome. Please create a pull request or issue for any proposed changes.
