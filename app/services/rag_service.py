import os
from openai import OpenAI
from dotenv import load_dotenv

# Load the secret key from the .env file
load_dotenv()
api_key = os.getenv("GROQ_API_KEY")

# Groq uses the FastAPI/OpenAI standard format
client = OpenAI(
    api_key=api_key,
    base_url="https://api.groq.com/openai/v1",
)

def get_answer(prompt):
    # Call the Groq model
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content