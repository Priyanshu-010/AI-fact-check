from fastapi import FastAPI

app = FastAPI(title="FactCheck AI")


@app.get("/")
def root():
  return {"message": "FactCheck AI API is running"}