import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .config import STATIC_DIR, PORT, HOST
from .routers import (
    safety_router,
    crack_router,
    planning_router,
    valuation_router,
    advisory_router,
    assistant_router,
    projects_router
)

app = FastAPI(
    title="Multimodal Construction Intelligence Platform API",
    description="Full-stack decision-support system integrating multimodal AI for construction site safety monitoring, structural crack detection, project planning, real estate valuation, daily site advisory, and knowledge assistance.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware to allow React frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# Include Routers
app.include_router(safety_router)
app.include_router(crack_router)
app.include_router(planning_router)
app.include_router(valuation_router)
app.include_router(advisory_router)
app.include_router(assistant_router)
app.include_router(projects_router)

@app.get("/")
def root():
    return {
        "message": "Welcome to the Multimodal Construction Intelligence Platform API",
        "docs": "/docs",
        "health": "/api/health",
        "status": "Operational"
    }

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host=HOST, port=PORT, reload=True)
