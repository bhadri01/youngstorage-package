#! /home/labs/projects/youngstorage-v.2.1/backend-updated/.venv/bin/python3

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from app.routers import root, userAuth, labs, network, services
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import uvicorn
import os

os.umask(0o077)
load_dotenv()
tags_metadata = [
    {
        "name": "Root",
        "description": "**Root** of the project",
    },
    {
        "name": "Auth",
        "description": "**User Authentication** all other stuff maintained here",
    },
    {
        "name": "Labs",
        "description": "**Labs** build and container details",
    }, 
    {
        "name": "Network",
        "description": "**Network** all the network and domain details and logics",
    },
    {
        "name": "Services",
        "description": "**Services** like database and catching system is here",
    },
]
app = FastAPI(
              # production
              docs_url=None,
              # development
            #   docs_url="/docs",
              redoc_url=None,
              title="youngstorage API service",
              summary="This is the cloud servide that we can able to code and host your activity",
              description="We can create an account and explore all the labs and services like linux and database services with all programming \
              language support event we can able to install want you need and then all the process where run in the private VPN network \
              then even we can able to host the that that we are done for the public world",
              version="2.1.1",
              openapi_tags=tags_metadata
              )

# this is for to add 
async def custom_auth_exception_handler(request, exc):
    content = {"message": exc.detail}
    content["status"] = False
    return JSONResponse(
        status_code=exc.status_code,
        content=content
    )

app.add_exception_handler(HTTPException, custom_auth_exception_handler)
app.add_middleware(
    CORSMiddleware,
    # production
    allow_origins=["https://labs.youngstorage.in"],
    # development
    # allow_origins=["*"],
    # Set this to True if your frontend sends credentials like cookies or authorization headers.
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, PUT, etc.).
    allow_headers=["*"],  # Allows all headers in the requests.
)

app.include_router(root.router, tags=["Root"])
app.include_router(userAuth.router, prefix="/auth", tags=["Auth"])
app.include_router(labs.router, tags=["Labs"])
app.include_router(network.router, tags=["Network"])
app.include_router(services.router, tags=["Services"])

if __name__ == "__main__":
    # production
    uvicorn.run("run:app", host="0.0.0.0", port=8000,log_config="log.ini",access_log=True,workers=2)
    # development
    # uvicorn.run("run:app", host="0.0.0.0", port=8000, reload=True)
