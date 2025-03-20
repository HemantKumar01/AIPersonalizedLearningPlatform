"""
Install the Google AI Python SDK

$ pip install google-generativeai

See the getting started guide for more information:
https://ai.google.dev/gemini-api/docs/get-started/python
"""

import os

import google.generativeai as genai

genai.configure(api_key=os.environ["GEMINI_API_KEY"])


def generate_resources(course, knowledge_level, description, time):
    # Create the model
    # See https://ai.google.dev/api/python/google/generativeai/GenerativeModel
    generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 8192,
        "response_mime_type": "text/plain",
    }

    model = genai.GenerativeModel(
        model_name="gemini-2.0-flash",
        generation_config=generation_config,
        # safety_settings = Adjust safety settings
        # See https://ai.google.dev/gemini-api/docs/safety-settings
        system_instruction="You are an AI tutor. Maintain a modest and calm language suitable for learning. You need to provide content to user to learn in given time.",
    )

    chat_session = model.start_chat(history=[])

    response = chat_session.send_message(
        f"I am learning {course}. My knowledge level in this topic is {knowledge_level}. i want to {description}. I want to learn it in {time}. Teach me.",
        stream=False,
    )

    print(response.text)
    return response.text
