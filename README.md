# KisanAI Sahayak 🌾

**An AI-powered agricultural assistant that helps Indian farmers diagnose crop diseases using photos and vernacular voice commands.**

![Python](https://img.shields.io/badge/Python-3.8%2B-blue.svg)
![Flask](https://img.shields.io/badge/Flask-2.3-green.svg)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.13-orange.svg)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-Google-brightgreen.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## 📖 Table of Contents

- [The Problem](#-the-problem)
- [Our Solution](#-our-solution)
- [✨ Key Features](#-key-features)
- [⚙️ Technology Stack](#️-technology-stack)
- [🚀 Getting Started](#-getting-started)
- [🔧 How to Use](#-how-to-use)
- [📂 Project Structure](#-project-structure)
- [📈 Future Scope](#-future-scope)
- [🤝 Our Team](#-our-team)
- [📄 License](#-license)

---

## crisi The Problem

In India, **70% of the population depends on agriculture**, yet **80% of farmers struggle to accurately identify crop diseases**, leading to annual **yield losses of 30-40%**. Rural farmers face multiple barriers, including a lack of agricultural experts, language barriers (as most information is in English), and the absence of timely advice.

As a result, farmers often use incorrect pesticides, leading to financial losses and environmental damage. There is an urgent need for an AI-based, vernacular language solution that can instantly identify diseases from photos and provide farmers with simple and effective advice in their native language.

---

## 💡 Our Solution

**KisanAI Sahayak** is a smart web application designed to fill this gap. It provides farmers with a simple tool to:
1.  **Upload a photo** of the affected crop.
2.  **Ask a question in Hindi** using their voice.
3.  Instantly **diagnose the disease** using AI and receive a detailed solution in both **text and audio** formats.

Our goal is to make modern agricultural technology accessible to every farmer, regardless of their technical literacy.

---

## ✨ Key Features

-   **📸 Photo-Based Diagnosis:** Utilizes a TensorFlow-trained CNN model to identify 38 different plant diseases.
-   **🎤 Vernacular Voice Interface:** Integrates with the Web Speech API for asking questions in Hindi.
-   **🧠 Intelligent AI Solutions:** Leverages the Google Gemini API to generate practical and dynamic solutions in Hindi.
-   **🔊 Text-to-Speech Output:** Reads the solution aloud in Hindi, benefiting farmers with lower literacy.
-   **📱 Responsive & Modern UI:** A clean, simple, and mobile-friendly interface built with HTML, CSS, and JavaScript.
-   **🆓 Free & Accessible:** Built entirely on free-tier services and open-source technologies.

---

## ⚙️ Technology Stack

| Component         | Technology                                                                                                |
| ----------------- | --------------------------------------------------------------------------------------------------------- |
| **Frontend**      | `HTML5`, `CSS3`, `JavaScript (ES6+)`                                                                      |
| **Backend**       | `Python 3.8+`, `Flask`                                                                                    |
| **AI/ML Model**   | `TensorFlow`, `Keras`, `Pillow`, `NumPy`                                                                  |
| **Solution AI**   | `Google Gemini API`                                                                                       |
| **Voice Tech**    | `Web Speech API` (Speech Recognition & Synthesis)                                                         |

---

## 🚀 Getting Started

Follow these instructions to set up this project on your local system.

### Prerequisites

-   Python 3.8 or newer
-   `pip` (Python package installer)
-   A modern web browser that supports the microphone (Chrome or Edge recommended)

### Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/kisanai-sahayak.git
    cd kisanai-sahayak
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    # macOS/Linux
    python3 -m venv venv && source venv/bin/activate

    # Windows
    python -m venv venv && .\venv\Scripts\activate
    ```

3.  **Install the required packages:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Download the AI Model:**
    -   Create a folder named `models`.
    -   Download the pre-trained model (`plant_disease_model.h5`) and place it inside the `models` folder.
        ```bash
        # Windows PowerShell
        Invoke-WebRequest -Uri "https://huggingface.co/spaces/nateraw/plant-disease-classification/resolve/main/model.h5" -OutFile "models/plant_disease_model.h5"
        ```

5.  **Set up your Gemini API Key:**
    -   Get your free API key from [Google AI Studio](https://makersuite.google.com/).
    -   Open the `app.py` file and replace `"YOUR_ACTUAL_GEMINI_API_KEY_HERE"` with your real key.

6.  **Run the application:**
    ```bash
    python app.py
    ```

7.  Navigate to `http://127.0.0.1:5000` in your browser.

---

## 🔧 How to Use

1.  **Step 1: Upload Photo** - Click on the photo upload area and select a clear picture of the affected plant.
2.  **Step 2: Record Question** - Click the "Record" button and ask your question in Hindi.
3.  **Step 3: Get Solution** - Click the "Get AI Solution" button.
4.  **View Results** - The AI will provide the disease name, confidence score, and a detailed solution in text. You can also click the "Listen" button to hear the solution.

---

## 📂 Project Structure

```bash
KisanAI-Sahayak/
├── app.py                     # Main Flask application
├── models/
│   └── plant_disease_model.h5 # Pre-trained TensorFlow model
├── static/
│   ├── script.js            # Frontend JavaScript logic
│   └── style.css            # CSS styles
├── templates/
│   └── index.html           # Main HTML page
├── README.md                  # This file
└── requirements.txt           # Python dependencies
