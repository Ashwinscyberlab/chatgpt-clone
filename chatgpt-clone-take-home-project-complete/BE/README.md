# ChatApp Backend

## Quick Start

### 1. Build the Docker image

```bash
make build
```

### 2. Start container and enter shell

```bash
make start
```

### 3. Start the app (inside container)

```bash
make app
```

## Commands

```bash
make build    # Build Docker image
make start    # Start container and enter bash shell
make stop     # Stop container
make restart  # Restart container
make app      # Start FastAPI server (inside container)
make help     # Show all commands
```

## Access Points

- **API**: http://localhost:8081
- **WebSocket**: ws://localhost:8081/api/v1/ws
- **Docs**: http://localhost:8081/docs

## Setup

Create `.env` file with:
OPENAI_API_KEY=your_api_key

## Implementation Steps

### 1. WebSocket Chat Endpoint

- First, created WebSocket endpoint at `/api/v1/ws` and added message handling for text chat with OpenAI api for responses
- generate_gpt_response fn pretty self explanatory takes user message and sends to api, returns response

### 2. Add Response Metrics

- Added response metrics for time, length, sentiment
- For sentiment, first created basic analysis that looks for positive or negative list of words, then after that I created another complex analysis which sends another request to gpt api to analyse the response itself

### 2. Streaming Responses

- Modified WebSocket to support streaming from OpenAI, created generate_streaming_response, sends 3 types of message back: streaming_start, streaming_chunk and streaming_end.
- Had some trouble integrating with FE until I added the delay to prevent the messages batching, also added plenty of logs while trying to debug

### 3. Image Upload & Analysis

- Created POST endpoint at `/api/v1/upload-image` which allows the user to send an image with an optional message.
- Had to add python-multipart package for image upload, also switched from python slim buster to slim because I was getting build errors with docker after that.
