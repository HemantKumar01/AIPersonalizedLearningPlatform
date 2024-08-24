from flask import Flask, request
import roadmap
import quiz
import generativeResources
from flask_cors import CORS

api = Flask(__name__)
CORS(api)


@api.route("/api/roadmap", methods=["POST"])
def get_roadmap():
    req = request.get_json()

    response_body = roadmap.create_roadmap(
        topic=req.get("topic", "Machine Learning"),
        time=req.get("time", "4 weeks"),
        knowledge_level=req.get("knowledge_level", "Absoulte Beginner"),
    )

    return response_body


@api.route("/api/quiz", methods=["POST"])
def get_quiz():
    req = request.get_json()

    course = req.get("course")
    topic = req.get("topic")
    subtopic = req.get("subtopic")
    description = req.get("description")

    if not (course and topic and subtopic and description):
        return "Required Fields not provided", 400

    print("getting quiz...")
    response_body = quiz.get_quiz(course, topic, subtopic, description)
    return response_body


@api.route("/api/translate", methods=["POST"])
def get_translations():
    req = request.get_json()

    text = req.get("textArr")
    toLang = req.get("toLang")

    print(f"Translating to {toLang}: { text}")
    translated_text = translate.translate_text_arr(text_arr=text, target=toLang)
    return translated_text


@api.route("/api/generate-resource", methods=["POST"])
def generative_resource():
    req = request.get_json()
    req_data = {
        "course": False,
        "knowledge_level": False,
        "description": False,
        "time": False,
    }
    for key in req_data.keys():
        req_data[key] = req.get(key)
        if not req_data[key]:
            return "Required Fields not provided", 400
    print(f"generative resources for {req_data['course']}")
    resources = generativeResources.generate_resources(**req_data)
    return resources
