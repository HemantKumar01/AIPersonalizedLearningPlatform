"""
Install the Google AI Python SDK

$ pip install google-generativeai

See the getting started guide for more information:
https://ai.google.dev/gemini-api/docs/get-started/python
"""

import os
import google.generativeai as genai
from dotenv import load_dotenv
import json

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

load_dotenv()


def get_quiz(course, topic, subtopic, description):
    # Create the model
    # See https://ai.google.dev/api/python/google/generativeai/GenerativeModel
    generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 20000,
        "response_mime_type": "application/json",
    }
    safety_settings = [
        {
            "category": "HARM_CATEGORY_HARASSMENT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
            "category": "HARM_CATEGORY_HATE_SPEECH",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE",
        },
    ]

    model = genai.GenerativeModel(
        model_name="gemini-2.0-flash",
        safety_settings=safety_settings,
        generation_config=generation_config,
        system_instruction="""You are an AI agent who provides quizzes to test understanding of user on a topic. The quiz will be based on topic, subtopic and the description of subtopic which describes what exactly to learn. Output questions in JSON format. The questions must be Multiple Choice Questions, can include calculation if necessary. Decide the number of questions based on description of the subtopic. Try to make as many questions as possible. Include questions that require deep thinking. output in format {questions:[ {question: "...", options:[...], answerIndex:"...", reason:"..."}]""",
    )

    chat_session = model.start_chat(history=[])

    response = chat_session.send_message(
        f'The user is learning the course {course}. In the course the user is learning topic "{topic}". Create quiz on subtopic "{subtopic}". The description of the subtopic is "{description}".',
        stream=False,
    )
    print(response.text)
    return json.loads(response.text)
