import ollama
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

psych_protocol = [
    "How has your sleep quality been over the last two cycles?",
    "Are you experiencing any difficulty focusing on mission objectives?",
    "Do you feel a sense of disconnection from the crew or mission control?",
    "I am processing your responses. Based on our data, I recommend a 15-minute Earth-audio session. Do you agree?"
]

@router.post("/chat")
async def chat(req: ChatRequest):
    try:
        user_msgs = [m for m in req.messages if m.role == 'user']

        if 0 < len(user_msgs) <= 4:
            response_text = psych_protocol[len(user_msgs) - 1]
        else:
            system_prompt = {
                "role": "system",
                "content": "You are ARES, a Space Psychiatrist. Be clinical yet empathetic. Keep responses under 3 sentences."
            }
            history = [system_prompt] + [m.dict() for m in req.messages]
            response = ollama.chat(model='llama3', messages=history)
            response_text = response['message']['content']

        return {"message": response_text}

    except Exception as e:
        print(f"CRASH IN /CHAT: {e}")
        return {"message": "Psych-link unstable. Please stand by."}