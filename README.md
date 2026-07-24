 <div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0F172A,50:1E3A8A,100:3B82F6&height=220&section=header&text=MindPulse%20AI&fontSize=60&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Understand%20your%20mind,%20not%20just%20your%20grades.&descAlignY=58&descSize=20" width="100%"/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&duration=3000&pause=800&color=3B82F6&center=true&vCenter=true&width=700&lines=Predicting+student+mental+wellbeing+with+ML;Random+Forest+%2B+FastAPI+%2B+Interactive+3D+UI;5%2C000+students+%E2%80%A2+12+features+%E2%80%A2+1+score;Not+a+diagnosis+%E2%80%94+a+lifestyle+mirror." alt="Typing SVG" />

<br/>

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.6-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white)](https://scikit-learn.org)
[![Spline](https://img.shields.io/badge/3D-Spline-FF3366?style=for-the-badge&logo=threedotjs&logoColor=white)](https://spline.design)
[![License](https://img.shields.io/badge/License-MIT-brightgreen?style=for-the-badge)](#-license)

<a href="#-live-demo"><img src="https://img.shields.io/badge/▶_Live_Demo-Click_Here-3B82F6?style=for-the-badge" /></a>
<a href="#-getting-started"><img src="https://img.shields.io/badge/⚡_Quick_Start-2_min_setup-22C55E?style=for-the-badge" /></a>
<a href="#-api-reference"><img src="https://img.shields.io/badge/📡_API-REST_%2F_JSON-8B5CF6?style=for-the-badge" /></a>

</div>

<br/>

<div align="center">
<img src="https://raw.githubusercontent.com/Omrawat11/Mental_Health_Prediction/main/frontend/assets/brain-network.svg" width="90" />
</div>

## 📖 Overview

**MindPulse AI** turns a student's everyday habits — screen time, sleep, stress, study load, physical activity — into a **Mental Health Score (0–10)**, delivered in under a minute through a cinematic, interactive interface.

It's a genuine end-to-end ML product, not just a notebook:

```mermaid
flowchart LR
    A[📊 5,000-row dataset] -->|EDA + Cleaning| B[🧪 Feature Engineering]
    B -->|ColumnTransformer| C[⚙️ Preprocessing Pipeline]
    C --> D{Model Bake-off}
    D -->|R² 0.740| E[Linear Regression]
    D -->|R² 0.878 ✅| F[Random Forest]
    D -->|R² 0.865| G[Tuned Random Forest]
    F -->|joblib.dump| H[📦 Mental_Health_Model.pkl]
    H --> I[🚀 FastAPI /predict]
    I --> J[✨ 3D Interactive Frontend]

    style F fill:#22C55E,stroke:#15803D,color:#fff
    style H fill:#3B82F6,stroke:#1E3A8A,color:#fff
    style J fill:#8B5CF6,stroke:#5B21B6,color:#fff
```

> ⚠️ **Disclaimer:** This is a lifestyle-based research estimate, not a medical diagnosis. If you or someone you know is struggling, please reach out to a qualified counselor or mental health professional.

---

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 🎨 Frontend Experience
- 🧠 **Interactive 3D brain hero** (Spline) with cursor-reactive glow
- 🌌 Floating parallax orbs that follow the mouse
- 🎚️ Live-animated sliders with instant readouts
- 😴 Highlighted "healthy sleep zone" (7–9h) on the sleep slider
- 💫 Circular **pulse-ring** score reveal animation
- 📝 Auto-generated, personalized recommendations
- 📱 Fully responsive, hamburger nav on mobile

</td>
<td width="50%" valign="top">

### ⚙️ Engineering
- 🔬 Full EDA notebook (distributions, correlation heatmap, outlier handling)
- 🧵 `ColumnTransformer` pipeline: log-transform, scaling, ordinal + one-hot encoding
- 🌲 Random Forest Regressor chosen after a 3-model bake-off
- 🎯 `RandomizedSearchCV` hyperparameter tuning explored
- ⚡ FastAPI serves **both** the model and the static frontend
- 🔒 Stateless — nothing is stored server-side
- 📦 Single `joblib` artifact, version-pinned for reproducibility

</td>
</tr>
</table>

---

## 🎥 Live Demo

<div align="center">

> 🔗 Add your deployed link here once hosted (Render / Railway / HuggingFace Spaces)
>
> `https://mindpulse-ai.onrender.com`

<img src="https://img.shields.io/badge/status-not_yet_deployed-lightgrey?style=flat-square" />

</div>

<details>
<summary>🖼️ <b>Click to preview the interface</b></summary>
<br/>

| Hero (3D Brain) | Assessment Form | Result (Pulse Ring) |
|:---:|:---:|:---:|
| *add screenshot* | *add screenshot* | *add screenshot* |

> Drop your own screenshots/GIFs into a `docs/` folder and swap the paths above — a screen recording of the pulse-ring animation looks great here.

</details>

---

## 🛠️ Tech Stack

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![Pydantic](https://img.shields.io/badge/Pydantic-E92063?style=flat-square&logo=pydantic&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=flat-square&logo=scikitlearn&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?style=flat-square&logo=pandas&logoColor=white)
![NumPy](https://img.shields.io/badge/NumPy-013243?style=flat-square&logo=numpy&logoColor=white)
![Jupyter](https://img.shields.io/badge/Jupyter-F37626?style=flat-square&logo=jupyter&logoColor=white)
![Spline](https://img.shields.io/badge/Spline_3D-FF3366?style=flat-square&logo=threedotjs&logoColor=white)

</div>

## 🗂️ Project Structure

```
Mental_Health_Prediction/
├── backend/
│   └── main.py                  # FastAPI app — serves model + static frontend
├── frontend/
│   ├── index.html                # Landing page, form, result UI
│   ├── style.css                 # Full styling & animations
│   ├── script.js                 # Form logic, API calls, animated results
│   └── assets/
│       ├── brain-network.svg
│       └── pulse-ripple.svg
├── student_mental_health_ipynb.ipynb   # EDA + model training notebook
├── Student Social Media And Mental Health Impact.csv   # Dataset (5,000 students)
├── Mental_Health_Model.pkl       # Trained Random Forest pipeline
├── requirements.txt
└── README.md
```

---

## 🤖 Model & Performance

5,000 student records × 12 features were preprocessed through a `ColumnTransformer` (log-transform for skewed features → `StandardScaler`, `OrdinalEncoder` for stress level, `OneHotEncoder` for categoricals) and benchmarked across three approaches:

<div align="center">

| Model | Test R² | Test MAE | Test RMSE | |
|---|:---:|:---:|:---:|---|
| Linear Regression | 0.740 | 0.536 | 0.676 | 🟡 baseline |
| **Random Forest (default)** | **0.878** | **0.347** | **0.464** | ✅ **selected** |
| Random Forest (tuned) | 0.865 | 0.369 | 0.487 | 🟠 slightly less generalizable |

**R² comparison**

`Linear Regression`  ██████████████░░░░░░ 74.0%
`Random Forest`      ████████████████████ 87.8% 🏆
`RF (tuned)`         ███████████████████░ 86.5%

</div>

**The default Random Forest Regressor generalized best** on held-out test data and was serialized with `joblib` as `Mental_Health_Model.pkl`, loaded directly by FastAPI at startup.

<details>
<summary>📊 <b>Key EDA insights (click to expand)</b></summary>
<br/>

- 📉 Higher average daily social media usage correlates with a **lower** mental health score
- 😴 Sleep in the **7–9h** range is associated with noticeably better scores
- 📚 Study hours and physical activity show a mild **positive** relationship with wellbeing
- 😰 Self-reported **stress level** is one of the strongest predictors of the target score
- 🌍 Country was grouped into top-10 + "Other" to reduce cardinality before encoding

</details>

---

## 🚀 Getting Started

### Prerequisites
![Python](https://img.shields.io/badge/Python-3.10+-blue?style=flat-square) ![pip](https://img.shields.io/badge/pip-latest-blue?style=flat-square)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Omrawat11/Mental_Health_Prediction.git
cd Mental_Health_Prediction

# 2. Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the app
uvicorn backend.main:app --reload --app-dir backend
```

Then open **http://127.0.0.1:8000** — FastAPI serves the frontend directly, no separate dev server needed.

> ⚠️ **scikit-learn version note:** `Mental_Health_Model.pkl` was serialized with `scikit-learn==1.6.1`. If you hit an `AttributeError` on load, pin the exact version:
> ```bash
> pip install scikit-learn==1.6.1
> ```

---

## 📡 API Reference

### `POST /predict`

<table>
<tr><td>

**Request**
```json
{
  "Age": 21,
  "Gender": "Male",
  "Country": "India",
  "Academic_Level": "Undergraduate",
  "Most_Used_Platform": "Instagram",
  "Purpose_Of_Use": "Entertainment",
  "Avg_Daily_Usage_Hours": 4.5,
  "Daily_Unlocks": 85,
  "Study_Hours": 3,
  "Physical_Activity_Hours": 1,
  "Sleep_Hours_Per_Night": 7,
  "Stress_Level": "Medium"
}
```

</td><td>

**Response**
```json
{
  "predicted_mental_health_score": 6.42
}
```

</td></tr>
</table>

```mermaid
sequenceDiagram
    participant U as 🧑 User
    participant F as 🖥️ Frontend
    participant A as ⚡ FastAPI
    participant M as 🌲 RF Model

    U->>F: Fills 12-field assessment
    F->>A: POST /predict (JSON)
    A->>M: model.predict(input_row)
    M-->>A: raw score
    A-->>F: { predicted_mental_health_score }
    F-->>U: Animated pulse-ring + recommendations
```

### `GET /`
Serves the frontend (`index.html`).

---

## 🧭 Roadmap

- [ ] 🚢 Deploy live demo (Render/Railway/HF Spaces)
- [ ] 🔍 SHAP-based explainability — show *why* a score was predicted
- [ ] 📈 Historical trend tracking (opt-in, local only)
- [ ] 🐳 Dockerize backend for one-command deployment
- [ ] ✅ Automated tests for the `/predict` endpoint
- [ ] 🌐 i18n support for the frontend

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

```bash
# Fork it, then:
git checkout -b feature/your-idea
git commit -m "Add: your idea"
git push origin feature/your-idea
# Open a Pull Request 🎉
```

## 📄 License

Licensed under the **MIT License** — free to use, modify, and distribute.

## 👤 Author

<div align="center">

**Om Rawat**
B.Tech AI & ML, Lakshmi Narain College of Technology, Bhopal

[![GitHub](https://img.shields.io/badge/GitHub-Omrawat11-181717?style=for-the-badge&logo=github)](https://github.com/Omrawat11)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Om_Rawat-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/om-rawat-530499399/)

</div>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:3B82F6,100:0F172A&height=100&section=footer"/>
