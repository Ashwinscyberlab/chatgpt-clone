import json
import logging
import time
import base64
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, UploadFile, File, Form
from openai import OpenAI
import asyncio

from src.settings import Settings

settings = Settings()
router = APIRouter(prefix="/api/v1")

# Configure logging
logger = logging.getLogger(__name__)

openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...), message: str = Form(None)):
    """
    Upload and analyze image using OpenAI Vision with optional user message.
    """
    try:
        image_data = await file.read()        
        image_base64 = base64.b64encode(image_data).decode('utf-8')
                
        content_type = file.content_type
        if content_type == "image/jpeg":
            image_format = "jpeg"
        elif content_type == "image/png":
            image_format = "png"
        elif content_type == "image/gif":
            image_format = "gif"
        elif content_type == "image/webp":
            image_format = "webp"
        else:
            return {"error": "Unsupported image format. Please upload JPEG, PNG, GIF, or WebP."}
        
        if message and message.strip():
            prompt = f"{message.strip()}\n\nPlease analyze this image and respond to the user's request."
        else:
            prompt = "Please describe this image in detail. What do you see? Include any text, objects, people, colors, and overall scene description."
        
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/{image_format};base64,{image_base64}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=300
        )
        
        analysis = response.choices[0].message.content
        
        return {
            "success": True,
            "analysis": analysis,
            "filename": file.filename,
            "content_type": content_type,
            "user_message": message
        }
        
    except Exception as e:
        logger.error(f"Error processing image: {e}")
        return {"error": f"Failed to process image: {str(e)}"}


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for chat functionality with streaming support.
    """
    await websocket.accept()
    logger.info("WebSocket connection established")
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            logger.info(f"Received message: {data}")
            
            try:
                # Parse the incoming message
                message_data = json.loads(data)
                user_message = message_data.get("message", "")
                use_streaming = message_data.get("streaming", True) 
                print(f"use_streaming: {use_streaming}")
                
                if not user_message:
                    await websocket.send_text(json.dumps({
                        "error": "No message provided"
                    }))
                    continue
                                
                start_time = time.time()
                
      
                logger.info("Generating streaming response")
                await generate_streaming_response(user_message, websocket, start_time)
                
            except json.JSONDecodeError:
                await websocket.send_text(json.dumps({
                    "error": "Invalid JSON format"
                }))
            except Exception as e:
                logger.error(f"Error processing message: {e}")
                await websocket.send_text(json.dumps({
                    "error": "Internal server error"
                }))
                
    except WebSocketDisconnect:
        logger.info("WebSocket connection closed")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")


async def generate_streaming_response(user_message: str, websocket: WebSocket, start_time: float):
    """
    Generate streaming response from OpenAI.
    """
    logger.info("Generating streaming response")
    try:
        logger.info(f"Starting streaming response for: {user_message}")
        await websocket.send_text(json.dumps({
            "type": "streaming_start",
            "timestamp": time.time()
        }))
        logger.info("Sent streaming_start message")

        stream = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant. Provide clear, concise responses."},
                {"role": "user", "content": user_message}
            ],
            max_tokens=150,
            temperature=0.7,
            stream=True
        )
        logger.info("OpenAI stream created successfully")

        full_response = ""
        chunk_count = 0

        logger.info("Starting to process stream chunks...")
        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                content = chunk.choices[0].delta.content
                full_response += content
                chunk_count += 1
                chunk_timestamp = time.time()
                logger.info(f"Processing chunk {chunk_count}: '{content}' at {chunk_timestamp}")
                
                chunk_message = json.dumps({
                    "type": "streaming_chunk",
                    "content": content,
                    "timestamp": chunk_timestamp
                })
                
                logger.info(f"Sending chunk {chunk_count} to WebSocket...")
                await websocket.send_text(chunk_message)
                logger.info(f"Chunk {chunk_count} sent successfully")
                
                # Delay to prevent batching, allows streaming on FE
                await asyncio.sleep(0.005) 
        logger.info(f"Streaming complete. {chunk_count} chunks sent.")

        response_time = round((time.time() - start_time) * 1000, 2)
                
        await websocket.send_text(json.dumps({
            "type": "streaming_end",
            "response": full_response,
            "metrics": {
                "response_time_ms": response_time,
                "response_length": len(full_response),
                "word_count": len(full_response.split()),
                "sentiment": await analyze_sentiment_complex(full_response)            }
        }))
        logger.info("Sent streaming_end message")

        
    except Exception as e:
        logger.error(f"Error in streaming response: {e}")
        await websocket.send_text(json.dumps({
            "type": "streaming_error",
            "error": "Failed to generate streaming response"
        }))


def analyze_sentiment_simple(text: str) -> str:
    """
    Simple sentiment analysis.
    
    Args:
        text: The text to analyze
        
    Returns:
        Sentiment classification: 'positive', 'negative', or 'neutral'
    """
    positive_words = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'happy', 'love', 'like', 'helpful', 'thanks', 'thank you']
    negative_words = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'sorry', 'apologize', 'problem', 'error', 'wrong']
    
    text_lower = text.lower()
    
    positive_count = sum(1 for word in positive_words if word in text_lower)
    negative_count = sum(1 for word in negative_words if word in text_lower)
    
    if positive_count > negative_count:
        return 'positive'
    elif negative_count > positive_count:
        return 'negative'
    else:
        return 'neutral'
    
async def analyze_sentiment_complex(text: str) -> str:
    """
    Advanced sentiment analysis using GPT for more nuanced understanding.
    
    Args:
        text: The text to analyze
        
    Returns:
        Sentiment classification: 'positive', 'negative', or 'neutral'
    """
    try:
        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system", 
                    "content": """Analyze the sentiment of the following text. Consider:
                    1. Context and tone
                    2. Sarcasm and irony
                    3. Mixed emotions
                    4. Cultural context
                    5. Politeness vs. actual sentiment
                    
                    Respond with ONLY one word: 'positive', 'negative', or 'neutral'.
                    Be conservative - if unsure, choose 'neutral'."""
                },
                {"role": "user", "content": text}
            ],
            max_tokens=5,
            temperature=0.1  # Low temperature for consistent results
        )
        
        sentiment = response.choices[0].message.content.strip().lower()
                                
        if 'positive' in sentiment:
            return 'positive'
        elif 'negative' in sentiment:
            return 'negative'
        else:
            return 'neutral'
            
    except Exception as e:
        logger.error(f"Error analyzing sentiment with GPT: {e}")
        # Fallback to simple 
        return analyze_sentiment_simple(text)
