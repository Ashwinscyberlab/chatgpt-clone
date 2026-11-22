AI Chat Application

A full-stack AI chat application built using React, TypeScript, Python, and FastAPI. This project focuses on understanding how frontend and backend systems work together to deliver a real-time, interactive chat experience.

One of the core components of this application is WebSocket integration, enabling real-time communication between the frontend and backend. It also supports streaming AI responses, creating a smoother and more interactive conversational experience.

Tech Stack

Frontend: React, TypeScript

Backend: Python, FastAPI

Communication: WebSocket

API: REST APIs

Features

Real-Time Communication: Enables instant communication between the frontend and backend using WebSockets.

Streaming AI Responses: Delivers AI-generated responses progressively for a more interactive chat experience.

REST API Integration: Connects frontend and backend services through REST APIs.

TypeScript Integration: Uses TypeScript with React components for structured and maintainable frontend development.

Separate Frontend and Backend: Maintains a clean separation between frontend and backend codebases.

Modular Backend Architecture: Organizes backend functionality into separate modules for better code management and maintainability.

Project Structure

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
│   │   └── app/
│   │       ├── chat/
│   │       ├── globals.css
│   │       ├── layout.tsx
│   │       └── page.tsx
│   │
│   ├── Dockerfile
│   ├── package.json
│   └── next.config.ts
│
├── docker-compose.yaml
├── .gitignore
└── README.md

Running the Project Locally

Backend Setup

Navigate to the backend directory:

cd BE

Create a Python virtual environment:

python -m venv venv

Activate the virtual environment:

Windows:

venv\Scripts\activate

Install the required dependencies:

pip install -r requirements.txt

Start the backend server:

uvicorn src.main:app --reload

Frontend Setup

Open another terminal and navigate to the frontend directory:

cd FE

Install the required dependencies:

npm install

Start the development server:

npm run dev

What I Learned

Building this project provided practical experience in:

Connecting a React frontend with a FastAPI backend.

Implementing WebSockets for real-time communication.

Handling asynchronous operations in Python.

Developing and integrating REST APIs.

Using TypeScript to build structured frontend components.

Understanding response streaming in AI-powered chat applications.

Organizing frontend and backend code using a modular project structure.

Future Improvements

I plan to extend the application with the following improvements:

Chat History: Store and retrieve previous conversations.

User Authentication: Implement secure user registration and login.

Conversation Management: Add features to organize, manage, and navigate conversations.

Built as a hands-on project to explore full-stack development, real-time communication, and AI-powered application architecture.
