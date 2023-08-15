#! /home/labs/projects/youngstorage-v.2.1/backend-updated/.venv/bin/python3

from fastapi import FastAPI
import uvicorn

from app.routers import root, userAuth, labs, network, services
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

os.umask(0o077)
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,  # Set this to True if your frontend sends credentials like cookies or authorization headers.
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, PUT, etc.).
    allow_headers=["*"],  # Allows all headers in the requests.
)

app.include_router(root.router)
app.include_router(userAuth.router,prefix="/auth")
app.include_router(labs.router)
app.include_router(network.router)
app.include_router(services.router)

if __name__ == "__main__":
    # production
    # uvicorn.run("run:app", host="0.0.0.0", port=8000,log_config="log.ini",access_log=True,workers=2)
    # development
    uvicorn.run("run:app", host="0.0.0.0", port=8000, reload=True)
