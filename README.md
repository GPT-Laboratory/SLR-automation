# Flask and React Project

This project combines a Flask backend with a React frontend to create a web application for generating and summarizing research-related content.

## Getting Started

### Prerequisites

- Python (>=3.6)
- Node.js (18.18.2) and npm (9.8.1)
- Git (optional, but recommended)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository_url>

1. Install Python dependencies for the Flask backend:
cd slr_automation
pip install -r requirements.txt
2. Install Node.js dependencies for the React frontend:
cd slr_automation
npm install

# Running the Application

1. Start the Flask backend:
 run command python server.py
 server will be listening on localhost:5000
2. Production mode of react app,
 run "npm run build"
 access localhost:5000 in browser to access react build
3. for Development mode:
run "npm run dev"
access localhost:5173 in browser

# Additional Information
Make sure to set up any necessary environment variables in a .env file (not included in the repository for security reasons). Refer to the Flask app code for specific environment variables.
