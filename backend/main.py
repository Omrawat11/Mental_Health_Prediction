import joblib
from fastapi import FastAPI 
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel,Field
import pandas as pd
from typing import Literal
from fastapi.middleware.cors import CORSMiddleware

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

model = joblib.load(BASE_DIR / 'Mental_Health_Model.pkl')
top_countries = ['Other','India','USA','Canada','UK','Australia','Germany','Mexico','Turkey','France']

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static assets (CSS, JS, SVGs)
app.mount('/assets', StaticFiles(directory=BASE_DIR / 'frontend' / 'assets'), name='assets')

# first pydantic model
class StudentData(BaseModel):
    Age                         :int = Field(...,ge=10, le=100)
    Gender                      :Literal['Male','Female','Other']
    Country                     :str
    Academic_Level              :Literal['Undergraduate','Graduate','High School']
    Most_Used_Platform          :Literal['Facebook','Linkedin','Instagram','Snapchat','Twitter','Youtube','TikTok','LINE','KakaoTalk','VKontakte','Whatsapp','WeChat']
    Purpose_Of_Use              :Literal['Networking','Education','Entertainment','News']
    Avg_Daily_Usage_Hours       :float = Field(..., ge=0, le=24)
    Daily_Unlocks               :int = Field(..., ge=0)
    Study_Hours                 :float = Field(..., ge=0, le = 24)
    Physical_Activity_Hours     :float = Field(..., ge=0, le=24)
    Sleep_Hours_Per_Night       :float = Field(..., ge=0, le=24)
    Stress_Level                :Literal['Medium','Low','High','Very High']


# Descibe what we sent back 
class predictionResponse(BaseModel):
    predicted_mental_health_score:float

@app.get('/')
def serve_frontend():
    return FileResponse(BASE_DIR / 'frontend' / 'index.html')

@app.get('/style.css')
def serve_css():
    return FileResponse(BASE_DIR / 'frontend' / 'style.css', media_type='text/css')

@app.get('/script.js')
def serve_js():
    return FileResponse(BASE_DIR / 'frontend' / 'script.js', media_type='application/javascript')


@app.post('/predict',response_model=predictionResponse)
def predict(data:StudentData):
    country_group = data.Country if data.Country in top_countries else 'Other'
    input_rows = pd.DataFrame([{
        'Age'                       :data.Age,
        'Gender'                    :data.Gender,
        'Country'                   :data.Country,
        'Academic_Level'            :data.Academic_Level,
        'Most_Used_Platform'        :data.Most_Used_Platform,
        'Purpose_Of_Use'            :data.Purpose_Of_Use,
        'Avg_Daily_Usage_Hours'     :data.Avg_Daily_Usage_Hours,
        'Daily_Unlocks'             :data.Daily_Unlocks,
        'Study_Hours'               :data.Study_Hours,
        'Physical_Activity_Hours'   :data.Physical_Activity_Hours,
        'Sleep_Hours_Per_Night'     :data.Sleep_Hours_Per_Night,
        'Stress_Level'              :data.Stress_Level,       
        'Grouped_country'           : country_group
    }])

    prediction = model.predict(input_rows)[0]
    return predictionResponse(predicted_mental_health_score=round(float(prediction),2)) 


 