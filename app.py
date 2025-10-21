from flask import Flask, request, render_template, jsonify, send_from_directory
import os
import time
import random
import json
from werkzeug.utils import secure_filename
import uuid

# 🔥 Gemini API import
import google.generativeai as genai

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max

# Create directories
os.makedirs('uploads', exist_ok=True)
os.makedirs('static/audio', exist_ok=True)

# ============ 🔑 GEMINI API CONFIGURATION ============
# 👇 YAHAN APNI API KEY DAALNI HAI:
GEMINI_API_KEY = "AIzaSyAkX4qH0wAF0fNfVeMCGOfyynvHCBGI6EE"  # 🔴 CHANGE THIS!

# Configure Gemini
if GEMINI_API_KEY != "AIzaSyAkX4qH0wAF0fNfVeMCGOfyynvHCBGI6EE":
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        GEMINI_ENABLED = True
        print("✅ Gemini AI enabled!")
    except Exception as e:
        print(f"❌ Gemini API error: {e}")
        GEMINI_ENABLED = False
else:
    GEMINI_ENABLED = False
    print("⚠️ Gemini API key not provided - using fallback solutions")
# ====================================================

# Plant diseases database (Hindi solutions) - Fallback ke liye
DISEASE_SOLUTIONS = {
    "late_blight": {
        "name": "झुलसा रोग (Late Blight)",
        "solution": """
🍅 **झुलसा रोग का इलाज:**

**तुरंत करने वाले काम:**
• प्रभावित पत्तियों को तुरंत तोड़कर जला दें
• खेत से पानी निकासी का प्रबंध करें
• छायादार और नमी वाली जगह से बचें

**घरेलू उपाय:**
• नीम का तेल: 10ml + पानी 1 लीटर में मिलाकर छिड़काव
• लहसुन-प्याज का घोल: 50g लहसुन + 2 प्याज पीसकर 1 लीटर पानी में मिलाएं
• बेकिंग सोडा: 5g प्रति लीटर पानी में मिलाकर स्प्रे करें

**रासायनिक इलाज (जरूरत पड़ने पर):**
• मैंकोजेब 75% WP - 2g प्रति लीटर पानी
• कॉपर ऑक्सीक्लोराइड - 3g प्रति लीटर पानी

**रोकथाम:**
• पौधों के बीच उचित दूरी रखें
• सुबह की धूप लगने दें
• ड्रिप इरिगेशन का उपयोग करें
        """
    },
    "bacterial_spot": {
        "name": "बैक्टीरियल स्पॉट",
        "solution": """
🦠 **बैक्टीरियल स्पॉट का इलाज:**

**पहचान:** पत्तियों पर काले धब्बे, फलों पर छोटे काले निशान

**तुरंत उपाय:**
• संक्रमित भागों को काटकर अलग करें
• तांबे वाली दवा का छिड़काव करें
• पानी सीधे पत्तियों पर न डालें

**जैविक इलाज:**
• नीम की खली: मिट्टी में मिलाएं
• गोमूत्र: 200ml प्रति लीटर पानी में मिलाकर स्प्रे
• हल्दी पाउडर: 10g प्रति लीटर पानी

**सावधानियां:**
• बारिश के बाद तुरंत स्प्रे करें
• खेत में सफाई रखें
• बीज को बोने से पहले उपचारित करें
        """
    },
    "healthy": {
        "name": "स्वस्थ फसल",
        "solution": """
✅ **बधाई हो! आपकी फसल स्वस्थ है**

**स्वस्थ फसल बनाए रखने के तरीके:**
• नियमित रूप से खेत की निगरानी करें
• संतुलित खाद का उपयोग करें
• उचित सिंचाई करें

**पोषण प्रबंधन:**
• NPK खाद: मिट्टी जांच के अनुसार
• जैविक खाद: गोबर की खाद या कंपोस्ट
• माइक्रो न्यूट्रिएंट्स का छिड़काव

**निवारक उपाय:**
• नीम की खली डालते रहें
• हर 15 दिन में नीम का तेल स्प्रे करें
• फसल चक्र अपनाएं
        """
    }
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        # Get form data
        photo = request.files.get('photo')
        question_text = request.form.get('question', '')  # From Web Speech API
        
        if not photo or not question_text:
            return jsonify({
                'success': False, 
                'error': 'फोटो और सवाल दोनों जरूरी हैं'
            })

        print(f"📝 Received question: {question_text}")

        # Save photo temporarily
        photo_filename = secure_filename(photo.filename)
        photo_path = os.path.join(app.config['UPLOAD_FOLDER'], photo_filename)
        photo.save(photo_path)

        # Simulate AI processing delay
        print("🔍 AI analysis starting...")
        time.sleep(2)

        # Mock disease detection (in real app, use computer vision)
        detected_disease = mock_disease_detection(photo_path)
        print(f"🏥 Detected disease: {detected_disease}")
        
        # Generate solution using Gemini AI or fallback
        if GEMINI_ENABLED:
            print("🤖 Generating solution with Gemini AI...")
            customized_solution = generate_gemini_solution(detected_disease, question_text)
        else:
            print("📝 Using fallback solution...")
            solution_data = DISEASE_SOLUTIONS.get(detected_disease, DISEASE_SOLUTIONS["late_blight"])
            customized_solution = customize_solution(solution_data, question_text)

        # Clean up uploaded file
        os.remove(photo_path)

        return jsonify({
            'success': True,
            'solution': customized_solution,
            'detected_disease': DISEASE_SOLUTIONS.get(detected_disease, DISEASE_SOLUTIONS["late_blight"])['name'],
            'confidence': random.randint(85, 95),
            'ai_powered': GEMINI_ENABLED
        })

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)})

def mock_disease_detection(image_path):
    """Mock function to simulate disease detection"""
    diseases = ['late_blight', 'bacterial_spot', 'healthy']
    weights = [0.4, 0.3, 0.3]  # Probability weights
    return random.choices(diseases, weights=weights)[0]

def generate_gemini_solution(detected_disease, question):
    """Generate solution using Gemini AI"""
    try:
        model = genai.GenerativeModel('gemini-pro')
        
        # Disease info for context
        disease_info = DISEASE_SOLUTIONS.get(detected_disease, DISEASE_SOLUTIONS["late_blight"])
        
        prompt = f"""
आप एक expert कृषि सलाहकार और plant pathologist हैं। 

DETECTED DISEASE: {disease_info['name']}
FARMER'S QUESTION: "{question}"

एक भारतीय किसान की फसल में यह समस्या detect हुई है। कृपया Hindi में detailed, practical solution दें जो एक आम किसान समझ सके।

Response format:
**आपका सवाल:** {question}

**पहचानी गई समस्या:** {disease_info['name']}

**तुरंत करने वाले काम:**
• [Immediate actions]

**घरेलू/जैविक उपचार:**
• [Organic solutions with exact quantities]

**रासायनिक दवाई (जरूरत पड़ने पर):**
• [Chemical treatments if needed]

**भविष्य में रोकथाम:**
• [Prevention tips]

**अतिरिक्त सुझाव:**
• [Specific advice based on farmer's question]

Simple Hindi में लिखें। Technical terms के साथ explanation भी दें। Practical और cost-effective solutions पर focus करें।
        """
        
        response = model.generate_content(prompt)
        
        if response.text:
            print("✅ Gemini AI response generated successfully!")
            return response.text
        else:
            print("⚠️ Empty Gemini response, using fallback")
            return customize_solution(disease_info, question)
            
    except Exception as e:
        print(f"❌ Gemini API error: {e}")
        # Fallback to static solution
        disease_info = DISEASE_SOLUTIONS.get(detected_disease, DISEASE_SOLUTIONS["late_blight"])
        return customize_solution(disease_info, question)

def customize_solution(solution_data, question):
    """Customize solution based on user's question (Fallback method)"""
    base_solution = solution_data['solution']
    
    # Add question-specific responses
    question_lower = question.lower()
    
    if 'क्या' in question or 'कौन' in question or 'what' in question_lower:
        prefix = f"**आपका सवाल:** {question}\n\n**जवाब:** यह {solution_data['name']} है।\n\n"
    elif 'कैसे' in question or 'how' in question_lower:
        prefix = f"**आपका सवाल:** {question}\n\n**इलाज का तरीका:**\n\n"
    elif 'दवा' in question or 'medicine' in question_lower:
        prefix = f"**आपका सवाल:** {question}\n\n**दवाई के बारे में जानकारी:**\n\n"
    else:
        prefix = f"**आपका सवाल:** {question}\n\n**पूरी जानकारी:**\n\n"
    
    return prefix + base_solution

# Last line change करो:
if __name__ == '__main__':
    print("🌾 KisanAI Sahayak Starting...")
    if GEMINI_ENABLED:
        print("🤖 With Gemini AI Integration")
    else:
        print("📝 Using Static Solutions (Add API key for AI)")
    print("📱 Browser में जाएं: http://localhost:5000")
    
    # 🔥 यह line change करो:
    app.run(debug=True, host='127.0.0.1', port=5000)  # localhost force करो

