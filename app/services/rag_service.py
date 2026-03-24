import os
from openai import OpenAI, RateLimitError
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
    models_to_try = [
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant",
        
    ]
    
    last_exception = None
    
    for model in models_to_try:
        try:
            # Call the Groq model
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            last_exception = e
            # Check if the error is related to rate limiting (429)
            if "429" in str(e) or "rate_limit" in str(e).lower() or isinstance(e, RateLimitError):
                print(f"Rate limit exceeded or error with model {model}. Trying next...")
                continue
            else:
                raise e

    # If all models fail due to rate limits
    return "Sorry, I am currently experiencing high traffic and have hit my rate limits across all models. Please wait a few minutes and try again."