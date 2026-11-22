# AI Chat Application

This is a full-stack AI chat application that I built using React, TypeScript, Python, and FastAPI. The main goal of this project was to understand how a frontend and backend work together to build a real-time chat experience.

One of the key parts of the project is WebSocket integration, which allows the frontend and backend to communicate in real time. It also supports streaming responses, making conversations feel more interactive.

## Tech Stack

- **Frontend:** React, TypeScript
- **Backend:** Python, FastAPI
- **Communication:** WebSocket
- **API:** REST APIs

## Features

- Real-time communication using WebSockets.
- Streaming AI responses.
- REST API integration between frontend and backend.
- React components written with TypeScript.
- Separate frontend and backend structure.
- Modular backend architecture.

## Project Structure

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

## Running the Project Locally

### Backend Setup


cd BE
python -m venv venv

Activate the virtual environment:


# Windows
venv\Scripts\activate


Install dependencies:


pip install -r requirements.txt

Start the backend:


uvicorn src.main:app --reload

### Frontend Setup

Open another terminal:


cd FE
npm install
npm run dev



## What I Learned

While building this project, I got practical experience with:

- Connecting a React frontend with a FastAPI backend.
- Working with WebSockets for real-time communication.
- Handling asynchronous operations in Python.
- Building and integrating REST APIs.
- Using TypeScript to write structured frontend code.
- Understanding how streaming works in an AI chat application.

## Future Improvements

I plan to improve the application by adding chat history, user authentication, and better conversation management.

