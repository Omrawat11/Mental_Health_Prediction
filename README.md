<div align="center">

# 🧠 MindPulse AI

### Understand your mind, not just your grades.

A full-stack ML web app that predicts a student's mental health score from their sleep, stress, study, and social-media habits — powered by a tuned Random Forest Regressor and served through a FastAPI backend with a cinematic, 3D-brain frontend.

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.6-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white)](https://scikit-learn.org)
[![License](https://img.shields.io/badge/License-MIT-brightgreen?style=for-the-badge)](#-license)

[Features](#-features) • [Live Demo](#-live-demo) • [Tech Stack](#-tech-stack) • [Model](#-model--performance) • [Setup](#-getting-started) • [API](#-api-reference)

</div>

---

## 📖 Overview

**MindPulse AI** analyzes a student's digital and lifestyle habits — screen time, sleep, stress, study load, and physical activity — and estimates a **Mental Health Score (0–10)** in under a minute. It's built as an end-to-end ML product: data analysis and model training in a notebook, a trained `scikit-learn` pipeline served via `FastAPI`, and a polished vanilla HTML/CSS/JS frontend with an interactive 3D brain hero section, animated sliders, and a personalized results view with actionable recommendations.

> ⚠️ **Disclaimer:** This is a lifestyle-based research estimate, not a medical diagnosis. If you or someone you know is struggling, please reach out to a qualified counselor or mental health professional.

## ✨ Features

- 🧠 **Interactive 3D hero** — Spline-powered 3D brain visualization with cursor-reactive glow and parallax orbs
- 📊 **12-parameter assessment form** — age, gender, country, academic level, platform usage, purpose of use, screen time, unlocks, study hours, physical activity, sleep, and stress level
- 🎚️ **Live animated sliders** with real-time readouts and a highlighted "healthy sleep zone" (7–9h)
- 💫 **Pulse-ring result visualization** — an animated circular progress ring reveals the predicted score
- 📝 **Personalized recommendations** generated from the user's own inputs
- 🔒 **Privacy-first** — nothing is stored; every prediction happens in a single stateless API call
- ⚡ **FastAPI backend** serving both the ML model and the static frontend from a single process
- 📱 **Fully responsive** — mobile hamburger nav, fluid grid form, adaptive layouts

## 🎥 Live Demo

> Add a deployed link here once hosted (e.g. Render / Railway / HuggingFace Spaces) — e.g. `https://mindpulse-ai.onrender.com`

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Vanilla HTML5, CSS3 (custom properties, animations), JavaScript (ES6+) |
| **3D/Visuals** | Spline (embedded iframe brain model), custom SVG assets |
| **Backend** | FastAPI, Uvicorn, Pydantic v2 |
| **ML/Data** | scikit-learn (Random Forest Regressor), pandas, NumPy, joblib |
| **Notebook/EDA** | Jupyter, seaborn, matplotlib |

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

## 🤖 Model & Performance

The dataset contains **5,000 student records** across 12 lifestyle/demographic features. Three approaches were benchmarked inside a `ColumnTransformer` + `Pipeline` preprocessing setup (log-transform for skewed features, standard scaling, ordinal encoding for stress level, one-hot encoding for categoricals):

| Model | Test R² | Test MAE | Test RMSE |
|---|---|---|---|
| Linear Regression | 0.740 | 0.536 | 0.676 |
| **Random Forest (default)** ✅ | **0.878** | **0.347** | **0.464** |
| Random Forest (tuned, `RandomizedSearchCV`) | 0.865 | 0.369 | 0.487 |

**The default Random Forest Regressor was selected as the final model** — it generalized best on held-out test data. It's serialized with `joblib` as `Mental_Health_Model.pkl` and loaded directly by the FastAPI backend at startup.

**Key EDA insights:**
- 📉 Higher average daily social media usage correlates with a **lower** mental health score
- 😴 Sleep in the 7–9h range is associated with noticeably better scores
- 📚 Study hours and physical activity show a mild positive relationship with wellbeing
- 😰 Self-reported stress level is one of the strongest predictors of the target score

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- pip

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

Then open **http://127.0.0.1:8000** in your browser — the FastAPI backend serves the frontend directly.

> ⚠️ **Note on scikit-learn versions:** `Mental_Health_Model.pkl` was serialized with `scikit-learn==1.6.1`. To avoid `AttributeError`/unpickling issues on load, make sure your environment uses a matching or compatible version — pin it exactly if you hit errors:
> ```bash
> pip install scikit-learn==1.6.1
> ```

## 📡 API Reference

### `POST /predict`

Predicts a mental health score from student lifestyle inputs.

**Request body:**
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

**Response:**
```json
{
  "predicted_mental_health_score": 6.42
}
```

### `GET /`
Serves the frontend (`index.html`).

## 🧭 Roadmap

- [ ] Deploy live demo (Render/Railway/HF Spaces)
- [ ] Add SHAP-based explainability to show *why* a score was predicted
- [ ] Historical trend tracking (optional local storage, opt-in)
- [ ] Dockerize backend for one-command deployment
- [ ] Add automated tests for the `/predict` endpoint

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Omrawat11/Mental_Health_Prediction/issues).

## 📄 License

This project is licensed under the **MIT License**.

## 👤 Author

**Om Rawat**
B.Tech AI & ML, Lakshmi Narain College of Technology, Bhopal

- GitHub: [@Omrawat11](https://github.com/Omrawat11)
- LinkedIn: [Om Rawat](https://www.linkedin.com/in/om-rawat-530499399/)

---

<div align="center">

Built as a student research project · ⭐ Star this repo if you found it useful!

</div>
