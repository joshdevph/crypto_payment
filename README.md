# Crypto Checkout Simulator

A simulation of a crypto checkout backend with webhook support, built with FastAPI and Next.js.

## Features

- POST `/api/checkout` - Creates a new payment session
- POST `/api/webhook` - Handles payment status updates
- SQLite database for transaction storage
- Simple Next.js frontend for demonstration
- ChatGPT integration with an interactive `/chat` page

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (for frontend development)

### Running with Docker

1. Download the folder and unzip
2. Navigate inside the folder `crypto_payment`
3. Run `docker-compose build` and `docker-compose up`
4. Access the frontend at `http://localhost:3000`
5. Access the backend API at `http://localhost:8000` swagger is also added here `http://localhost:8000/docs`

### Running Locally

#### Backend

1. Navigate to `backend/`
2. Create a virtual environment: `python -m venv venv`
3. Activate it: `venv\Scripts\activate` (Windows)
4. Install dependencies: `pip install -r requirements.txt`
5. Run the server: `uvicorn app.main:app --reload`

#### Frontend

1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Set the `OPENAI_API_KEY` environment variable to enable the chat page


#### Things to Improve

- Better handling pages so that it will not be available to visit
- User Authentication for Checkout Security like token based authentication
- Improve the database structure
- Adjust some UI to make it more appealing and modern
- Integrate wallet API's for better testing like a sandbox at least
- Improve the containerization with SQL Database such as Postgresql or MySql
- Better to add a unit test for this
- Build a compact and complte health check API including database
- Build this project with Terraform so that we can provision everything in one run only
- Improve error handling especially with the webhook flow like including edge cases such as slow internet
- Improve folder structure especially with the backend, like segregate them by function 