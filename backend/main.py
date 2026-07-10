from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, properties, admin, payments

app = FastAPI(title="PropIt API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to Vercel frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(properties.router)
app.include_router(admin.router)
app.include_router(payments.router)

@app.get("/")
async def root():
    return {"message": "Welcome to PropIt API"}

@app.get("/api/v1/health")
async def health_check():
    return {"status": "ok"}
