# ChatGPT Clone

A full-stack chat application built to understand how an AI chat system works from the frontend to the backend.

The project uses **React + TypeScript** for the frontend and **FastAPI + Python** for the backend. I used WebSockets for real-time communication so that responses can be received and displayed without making a new HTTP request for every part of the response.

## Tech Stack

* **Frontend:** React, TypeScript, Vite, Tailwind CSS
* **Backend:** Python, FastAPI
* **Communication:** REST API, WebSocket
* **Other:** Docker, Git

## What the Project Does

* Provides a ChatGPT-style chat interface
* Sends user messages from the React frontend to the FastAPI backend
* Uses WebSockets for real-time communication
* Displays responses as they are received
* Handles loading and connection states
* Keeps messages visible as part of the current conversation
* Uses environment variables for API configuration
* Includes a Docker setup for the backend

## Project Structure

```text
chatgpt-clone/
│
├── BE/
│   ├── src/
│   │   ├── routes/
│   │   ├── helpers/
│   │   ├── utils/
│   │   ├── main.py
│   │   └── settings.py
│   │
│   ├── .env
│   ├── Dockerfile
│   └── requirements.txt
│
├── FE/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
└── README.md
```

## How It Works

The frontend is responsible for the chat UI and user interaction.

When a message is submitted, it is sent to the FastAPI backend. The backend handles the request and communicates with the AI service. WebSockets are used to send the response back to the frontend in real time.

```text
User
  ↓
React Frontend
  ↓
FastAPI Backend
  ↓
AI API
  ↓
WebSocket
  ↓
React Chat UI
```

## Running the Project

### Backend

Go to the backend folder:

```bash
cd BE
```

Create and activate a virtual environment:

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file and add the required API configuration.

Then start the server:

```bash
uvicorn src.main:app --reload
```

### Frontend

Open another terminal:

```bash
cd FE
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL provided by Vite.

## Docker

The backend also contains a `Dockerfile` for running the FastAPI application inside a container.

Example:

```bash
docker build -t chatgpt-clone-backend ./BE
docker run -p 8000:8000 chatgpt-clone-backend
```

## Things I Worked With

While building this project, I got practical experience with:

* React and TypeScript
* FastAPI and Python
* REST API development
* WebSocket communication
* Asynchronous programming
* Connecting frontend and backend
* Environment-based configuration
* Docker
* Git and GitHub

## Future Improvements

* Add user authentication
* Store conversations in a database
* Support multiple conversations
* Add Markdown and code formatting
* Improve WebSocket reconnection
* Deploy the application

## Note

This is a learning project created to get practical experience with **full-stack development, AI API integration, and real-time communication**.
