from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes.attendance import router as attendance_router
from routes.marks import router as marks_router

load_dotenv()

app = FastAPI(title="StudentHub API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(attendance_router)
app.include_router(marks_router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
