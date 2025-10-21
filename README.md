# KisanAI Sahayak 🌾

**Ek AI-powered krishi sahayak jo Bhartiya kisanon ko photo aur sthaniya bhasha mein voice command ka upyog karke fasal ki bimariyon ka pata lagane mein madad karta hai.**

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

## crisis The Problem

Bharat mein, **70% aabadi krishi par nirbhar hai**, lekin **80% kisan fasal ki bimariyon ko sahi dhang se pehchan nahi paate**, jiske kaaran saalana **30-40% tak upaj ka nuksan** hota hai. Gramin kisanon ko kai badhaon ka samna karna padta hai, jaise krishi visheshagyon ki kami, bhasha ki samasya (kyunki adhikansh jaankari Angrezi mein hai), aur samay par salah na milna.

Iske parinaamswarup, kisan galat keetnashakon ka istemal karte hain, jisse unhein arthik nuksan hota hai aur paryavaran ko bhi hani pahunchti hai. Ek AI-aadhaarit, sthaniya bhasha mein samadhan ki sakht zaroorat hai jo photo se turant bimari pehchan sake aur kisanon ko unki bhasha mein aasan aur prabhavi salah de sake.

---

## 💡 Our Solution

**KisanAI Sahayak** ek smart web application hai jo is kami ko pura karne ke liye banaya gaya hai. Yeh kisanon ko ek saral tool pradan karta hai jisse ve:
1.  Prabhavit fasal ki **photo upload** kar sakte hain.
2.  Apni aawaz mein **Hindi mein sawal** puch sakte hain.
3.  AI dwara turant **bimari ka pata** laga sakte hain aur vistaar se samadhan **text aur audio** dono mein prapt kar sakte hain.

Hamara lakshya har kisan tak aadhunik krishi takneek ko pahunchana hai, chahe unki takneeki samajh kitni bhi ho.

---

## ✨ Key Features

-   **📸 Photo-Based Diagnosis:** TensorFlow-trained CNN model ka upyog karke 38 alag-alag paudhon ki bimariyon ki pehchan.
-   **🎤 Vernacular Voice Interface:** Hindi bhasha mein sawal puchne ke liye Web Speech API ka integration.
-   **🧠 Intelligent AI Solutions:** Google Gemini API ka upyog karke Hindi mein practical aur dynamic samadhan generate karna.
-   **🔊 Text-to-Speech Output:** Samadhan ko Hindi mein padhkar sunana, jisse kam sakshar kisanon ko bhi fayda ho.
-   **📱 Responsive & Modern UI:** HTML, CSS, aur JavaScript se bana ek saaf, saral aur mobile-friendly interface.
-   **🆓 Free & Accessible:** Poori tarah se free-tier services aur open-source technologies par nirmit.

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

Apne local system par is project ko set up karne ke liye in instructions ko follow karein.

### Prerequisites

-   Python 3.8 ya usse naya version
-   `pip` (Python package installer)
-   Ek modern web browser jo microphone ko support karta ho (Chrome ya Edge recommended)

### Installation and Setup

1.  **Repository ko clone karein:**
    ```bash
    git clone https://github.com/your-username/kisanai-sahayak.git
    cd kisanai-sahayak
    ```

2.  **Ek virtual environment banayein aur activate karein:**
    ```bash
    # macOS/Linux
    python3 -m venv venv && source venv/bin/activate

    # Windows
    python -m venv venv && .\venv\Scripts\activate
    ```

3.  **Zaroori packages install karein:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **AI Model download karein:**
    -   `models` naam ka ek folder banayein.
    -   Pre-trained model (`plant_disease_model.h5`) ko download karke `models` folder ke andar rakhein.
        ```bash
        # Windows PowerShell
        Invoke-WebRequest -Uri "https://huggingface.co/spaces/nateraw/plant-disease-classification/resolve/main/model.h5" -OutFile "models/plant_disease_model.h5"
        ```

5.  **Apni Gemini API Key set up karein:**
    -   [Google AI Studio](https://makersuite.google.com/) se apni free API key prapt karein.
    -   `app.py` file kholein aur `"YOUR_ACTUAL_GEMINI_API_KEY_HERE"` ko apni asli key se replace karein.

6.  **Application run karein:**
    ```bash
    python app.py
    ```

7.  Apne browser mein `http://127.0.0.1:5000` par jayein.

---

## 🔧 How to Use

1.  **Step 1: Photo Upload Karein** - Photo upload area par click karein aur prabhavit paudhe ki saaf tasveer chunein.
2.  **Step 2: Sawal Record Karein** - "Record" button par click karein aur Hindi mein apna sawal puchein.
3.  **Step 3: Samadhan Prapt Karein** - "AI se Samadhan Payein" button par click karein.
4.  **Results Dekhein** - AI aapko bimari ka naam, vishvasniyata score, aur text mein vistaar se samadhan dega. Aap "Sunein" button par click karke samadhan sun bhi sakte hain.

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
