# 🧑‍💻 Learn Anything Easily With Personalized Learning Paths Using AI


Imagine a platform that gives you a detailed personalized roadmap along with resources for any topic that you want to learn, based on your individual needs, time constraints, preferable language, and current knowledge level. This is exactly what our AI-driven web based educational platform delivers.

## Installation

```bash
npm install
cd backend
.\humanaize\Scripts\activate #or for linux humanaize/bin/activate
pip install -r requirements.txt
cd ..
```

## Usage 
create `.env` file in `./backend/` directory with the following contents (get your api key from [here](https://ai.google.dev/aistudio) )
```bash
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```
then to start backend
```bash
npm run backend
```
and to start frontend
```bash
npm start
```
![alt text](public/image.png)
![alt text](public/image-1.png)
![alt text](public/image-2.png)
## Demo Video
[https://www.youtube.com/watch?v=v-dP18RBArc](https://www.youtube.com/watch?v=v-dP18RBArc)
[![Demo Video Link](http://img.youtube.com/vi/v-dP18RBArc/0.jpg)](http://www.youtube.com/watch?v=v-dP18RBArc "LearnX : AI based Personalized Learning | Humanaize Hackathon EdTech Edition. Demo Video")

## What Exactly will this Platform do?
We are creating a web based platform, where users can get personalized roadmaps along with resources to learn something new. The platform will also track and visualize progress of the user.

The Users will provide a topic which they want to learn. Along with the topic they can also provide the time they have to learn it, preferable language, and the knowledge level they have.

Generative AI will be incorporated to create roadmaps, schedules and quizzes along with expected time to complete topics. Along with it resources will be recommended using a smart data and API based system. Depending on quizzes and feedback the roadmap will be dynamically personalized. The progress will be tracked and visualized in the platform.

## How will it Work?
The flow of the solution can be understood by the following simplified user flow diagram

![alt text](public/process_flow.png)