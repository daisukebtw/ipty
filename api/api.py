from fastapi import FastAPI, Request
from fastapi.responses import PlainTextResponse
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_client_ip(request: Request) -> str:
    """Extract the real client IP address from the request."""
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        return forwarded_for.split(',')[0].strip()
    
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip
    
    return request.client.host

@app.get("/", response_class=PlainTextResponse)
async def get_ip_get(request: Request):
    return get_client_ip(request) + "\n"

@app.post("/", response_class=PlainTextResponse)
async def get_ip_post(request: Request):
    return get_client_ip(request) + "\n"

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="critical")
