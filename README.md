# ChatGPT Clone

A full-stack AI chat application built to understand how a modern conversational interface works from the frontend to the backend.

## What I Built

* Created the frontend with **React + TypeScript**.
* Built the backend using **Python and FastAPI**.
* Added **WebSocket communication** for real-time interaction between the client and server.
* Designed a chat interface for sending and displaying conversations.
* Organized the backend into separate routes, helpers, utilities, and configuration files.
* Used environment variables to keep configuration and sensitive credentials outside the source code.
* Added Docker support for running the backend in a consistent environment.

## Tech Stack

**Frontend:** React, TypeScript, Vite
**Backend:** Python, FastAPI
**Communication:** REST API, WebSocket
**Deployment/Environment:** Docker, Environment Variables

## Project Structure

```text
chatgpt-clone/
├── BE/
│   ├── src/
│   │   ├── routes/
│   │   ├── helpers/
│   │   ├── utils/
│   │   ├── main.py
│   │   └── settings.py
│   ├── Dockerfile
│   └── requirements.txt
└── FE/
    └── ...
```

## Why I Built It

The goal was to go beyond a basic chatbot UI and understand the flow of a real-time AI application — from user input in the browser to backend processing and streamed responses.

## Future Improvements

* Persistent conversation history
* User authentication
* Multiple conversation threads
* Markdown/code rendering
* Improved error and connection handling
* Deployment of the complete application
