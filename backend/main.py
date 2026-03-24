from fastapi import FastAPI
from database import engine, Base
from routes.todo_route import router

app = FastAPI(title="Todo API")


Base.metadata.create_all(bind=engine)

app.include_router(router)

@app.get("/")
def home():
    return {"message": "FastAPI Todo Server Running"}

##Middleware

from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)