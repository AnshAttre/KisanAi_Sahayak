// =====================================================
// KisanAI Sahayak - Complete JavaScript
// Web Speech API + Modern UI + Form Handling
// =====================================================

class KisanAISahayak {
    constructor() {
        // State variables
        this.photoFile = null;
        this.isRecording = false;
        this.isListening = false;
        this.recognizedText = '';
        this.speechRecognition = null;
        this.recordingTimer = null;
        this.recordingStartTime = null;
        
        // DOM elements
        this.elements = {};
        
        // Initialize
        this.init();
    }

    // ==================== INITIALIZATION ====================
    init() {
        console.log('🚀 Initializing KisanAI Sahayak...');
        this.cacheDOMElements();
        this.setupEventListeners();
        this.initializeSpeechRecognition();
        this.initializeTextToSpeech();
        this.checkBrowserCompatibility();
        this.updateStepsIndicator(1);
        console.log('✅ Application initialized successfully!');
    }

    cacheDOMElements() {
        this.elements = {
            // Photo upload elements
            photoUploadArea: document.getElementById('photoUploadArea'),
            photoInput: document.getElementById('photoInput'),
            uploadPlaceholder: document.getElementById('uploadPlaceholder'),
            imagePreview: document.getElementById('imagePreview'),
            previewImage: document.getElementById('previewImage'),
            removeImage: document.getElementById('removeImage'),
            imageInfo: document.getElementById('imageInfo'),

            // Audio recording elements
            recordBtn: document.getElementById('recordBtn'),
            stopBtn: document.getElementById('stopBtn'),
            reRecordBtn: document.getElementById('reRecordBtn'),
            recordingVisualizer: document.getElementById('recordingVisualizer'),
            recordingTime: document.getElementById('recordingTime'),
            audioPreview: document.getElementById('audioPreview'),
            audioPlayer: document.getElementById('audioPlayer'),

            // Submit elements
            submitBtn: document.getElementById('submitBtn'),

            // Loading elements
            loadingSection: document.getElementById('loadingSection'),
            progressFill: document.getElementById('progressFill'),
            loadingSteps: document.querySelectorAll('.loading-step'),

            // Results elements
            resultSection: document.getElementById('resultSection'),
            diseaseName: document.getElementById('diseaseName'),
            confidenceFill: document.getElementById('confidenceFill'),
            confidenceText: document.getElementById('confidenceText'),
            solutionText: document.getElementById('solutionText'),
            solutionAudio: document.getElementById('solutionAudio'),

            // Tab elements
            tabBtns: document.querySelectorAll('.tab-btn'),
            textTab: document.getElementById('textTab'),
            audioTab: document.getElementById('audioTab'),

            // Action buttons
            newAnalysisBtn: document.getElementById('newAnalysisBtn'),
            shareBtn: document.getElementById('shareBtn'),
            downloadBtn: document.getElementById('downloadBtn'),

            // Steps indicator
            steps: document.querySelectorAll('.step')
        };
    }

    setupEventListeners() {
        // Photo upload events
        this.elements.photoUploadArea?.addEventListener('click', () => {
            this.elements.photoInput?.click();
        });

        this.elements.photoUploadArea?.addEventListener('dragover', this.handleDragOver.bind(this));
        this.elements.photoUploadArea?.addEventListener('drop', this.handleDrop.bind(this));
        this.elements.photoInput?.addEventListener('change', this.handlePhotoUpload.bind(this));
        this.elements.removeImage?.addEventListener('click', this.removePhoto.bind(this));

        // Recording events
        this.elements.recordBtn?.addEventListener('click', this.toggleRecording.bind(this));
        this.elements.stopBtn?.addEventListener('click', this.stopRecording.bind(this));
        this.elements.reRecordBtn?.addEventListener('click', this.resetRecording.bind(this));

        // Submit event
        this.elements.submitBtn?.addEventListener('click', this.submitAnalysis.bind(this));

        // Result actions
        this.elements.newAnalysisBtn?.addEventListener('click', this.resetForm.bind(this));
        this.elements.shareBtn?.addEventListener('click', this.shareResults.bind(this));
        this.elements.downloadBtn?.addEventListener('click', this.downloadResults.bind(this));

        // Tab switching
        this.elements.tabBtns?.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });
    }

    // ==================== BROWSER COMPATIBILITY ====================
    checkBrowserCompatibility() {
        const features = {
            speechRecognition: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
            speechSynthesis: !!window.speechSynthesis,
            fileAPI: !!(window.File && window.FileReader)
        };

        console.log('🔍 Browser Features:', features);

        if (!features.speechRecognition) {
            this.showNotification('Speech recognition के लिए Chrome browser का उपयोग करें', 'warning');
        }

        if (!features.speechSynthesis) {
            this.showNotification('Text-to-speech support नहीं मिला', 'info');
        }

        return features;
    }

    // ==================== SPEECH RECOGNITION ====================
    initializeSpeechRecognition() {
        if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
            console.warn('❌ Speech Recognition not supported');
            return false;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.speechRecognition = new SpeechRecognition();

        // Configuration
        this.speechRecognition.continuous = false;
        this.speechRecognition.interimResults = false;
        this.speechRecognition.lang = 'hi-IN';
        this.speechRecognition.maxAlternatives = 1;

        // Event handlers
        this.speechRecognition.onstart = () => {
            console.log('🎤 Speech recognition started');
            this.isListening = true;
            this.showRecordingVisualizer(true);
            this.startRecordingTimer();
        };

        this.speechRecognition.onresult = (event) => {
            const result = event.results[0][0];
            this.recognizedText = result.transcript;
            console.log('✅ Recognized:', this.recognizedText);
            console.log('🎯 Confidence:', (result.confidence * 100).toFixed(1) + '%');
            
            this.displayRecognizedText(this.recognizedText);
            this.updateStepsIndicator(3);
            this.checkSubmitButton();
        };

        this.speechRecognition.onerror = (event) => {
            console.error('❌ Speech recognition error:', event.error);
            this.handleSpeechError(event.error);
            this.isListening = false;
            this.showRecordingVisualizer(false);
            this.stopRecordingTimer();
        };

        this.speechRecognition.onend = () => {
            console.log('🔇 Speech recognition ended');
            this.isListening = false;
            this.showRecordingVisualizer(false);
            this.stopRecordingTimer();
            this.updateRecordingUI(false);
        };

        return true;
    }

    // ==================== TEXT-TO-SPEECH ====================
    initializeTextToSpeech() {
        if ('speechSynthesis' in window) {
            // Load voices
            speechSynthesis.onvoiceschanged = () => {
                const voices = speechSynthesis.getVoices();
                console.log('🔊 Available voices:', voices.length);
            };
            return true;
        }
        return false;
    }

    speakText(text) {
        if (!window.speechSynthesis) {
            console.warn('❌ Speech synthesis not supported');
            return;
        }

        // Stop any ongoing speech
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'hi-IN';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;

        // Find Hindi voice
        const voices = speechSynthesis.getVoices();
        const hindiVoice = voices.find(voice => 
            voice.lang.includes('hi') || voice.name.includes('Hindi')
        );

        if (hindiVoice) {
            utterance.voice = hindiVoice;
        }

        utterance.onstart = () => console.log('🔊 Speech started');
        utterance.onend = () => console.log('🔇 Speech ended');
        utterance.onerror = (e) => console.error('❌ Speech error:', e);

        speechSynthesis.speak(utterance);
    }

    // ==================== PHOTO UPLOAD ====================
    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        this.elements.photoUploadArea.classList.add('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        this.elements.photoUploadArea.classList.remove('drag-over');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processPhotoFile(files[0]);
        }
    }

    handlePhotoUpload(e) {
        const file = e.target.files[0];
        if (file) {
            this.processPhotoFile(file);
        }
    }

    processPhotoFile(file) {
        // Validation
        if (!file.type.startsWith('image/')) {
            this.showNotification('कृपया एक valid image file चुनें', 'error');
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB
            this.showNotification('Image size 10MB से कम होनी चाहिए', 'error');
            return;
        }

        this.photoFile = file;
        this.displayPhotoPreview(file);
        this.updateStepsIndicator(2);
        this.checkSubmitButton();

        console.log('📸 Photo uploaded:', {
            name: file.name,
            size: this.formatFileSize(file.size),
            type: file.type
        });
    }

    displayPhotoPreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.elements.uploadPlaceholder.style.display = 'none';
            this.elements.imagePreview.style.display = 'block';
            this.elements.previewImage.src = e.target.result;

            // Update image info
            if (this.elements.imageInfo) {
                this.elements.imageInfo.innerHTML = `
                    <div style="display: flex; gap: 15px; align-items: center; font-size: 0.9rem; color: #666;">
                        <span><i class="fas fa-file-image"></i> ${file.name}</span>
                        <span><i class="fas fa-weight"></i> ${this.formatFileSize(file.size)}</span>
                    </div>
                `;
            }

            // Update card styling
            const photoCard = document.querySelector('.photo-card');
            if (photoCard) {
                photoCard.style.borderColor = '#4CAF50';
                photoCard.style.backgroundColor = 'rgba(76, 175, 80, 0.02)';
            }
        };
        reader.readAsDataURL(file);
    }

    removePhoto() {
        this.photoFile = null;
        this.elements.uploadPlaceholder.style.display = 'block';
        this.elements.imagePreview.style.display = 'none';
        this.elements.photoInput.value = '';
        
        // Reset styling
        const photoCard = document.querySelector('.photo-card');
        if (photoCard) {
            photoCard.style.borderColor = '';
            photoCard.style.backgroundColor = '';
        }

        this.updateStepsIndicator(1);
        this.checkSubmitButton();
    }

    // ==================== AUDIO RECORDING ====================
    toggleRecording() {
        if (this.isListening) {
            this.stopRecording();
        } else {
            this.startRecording();
        }
    }

    startRecording() {
        if (!this.speechRecognition) {
            this.showNotification('Speech recognition उपलब्ध नहीं है', 'error');
            return;
        }

        try {
            this.speechRecognition.start();
            this.updateRecordingUI(true);
            console.log('🎤 Recording started...');
        } catch (error) {
            console.error('❌ Recording start error:', error);
            this.showNotification('Recording start नहीं हो सका: ' + error.message, 'error');
        }
    }

    stopRecording() {
        if (this.speechRecognition && this.isListening) {
            this.speechRecognition.stop();
            console.log('⏹️ Recording stopped...');
        }
    }

    resetRecording() {
        this.recognizedText = '';
        this.elements.audioPreview.style.display = 'none';
        this.updateStepsIndicator(2);
        this.checkSubmitButton();
        
        // Clear recognized text display
        const recognizedTextEl = document.getElementById('recognizedText');
        if (recognizedTextEl) {
            recognizedTextEl.remove();
        }
    }

    updateRecordingUI(recording) {
        if (!this.elements.recordBtn || !this.elements.stopBtn) return;

        if (recording) {
            this.elements.recordBtn.innerHTML = '<i class="fas fa-stop"></i><span>रिकॉर्डिंग बंद करें</span>';
            this.elements.recordBtn.style.backgroundColor = '#f44336';
            this.elements.stopBtn.disabled = false;
        } else {
            this.elements.recordBtn.innerHTML = '<i class="fas fa-microphone"></i><span>रिकॉर्डिंग शुरू करें</span>';
            this.elements.recordBtn.style.backgroundColor = '#4CAF50';
            this.elements.stopBtn.disabled = true;
        }
    }

    showRecordingVisualizer(show) {
        if (!this.elements.recordingVisualizer) return;

        if (show) {
            this.elements.recordingVisualizer.style.display = 'block';
        } else {
            this.elements.recordingVisualizer.style.display = 'none';
        }
    }

    startRecordingTimer() {
        this.recordingStartTime = Date.now();
        this.recordingTimer = setInterval(() => {
            const elapsed = Date.now() - this.recordingStartTime;
            const seconds = Math.floor(elapsed / 1000);
            const minutes = Math.floor(seconds / 60);
            const displayTime = `${minutes.toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
            
            if (this.elements.recordingTime) {
                this.elements.recordingTime.textContent = displayTime;
            }
        }, 100);
    }

    stopRecordingTimer() {
        if (this.recordingTimer) {
            clearInterval(this.recordingTimer);
            this.recordingTimer = null;
        }
    }

    displayRecognizedText(text) {
        // Create or update display
        let textDisplay = document.getElementById('recognizedText');
        if (!textDisplay) {
            textDisplay = document.createElement('div');
            textDisplay.id = 'recognizedText';
            textDisplay.style.cssText = `
                margin-top: 15px;
                padding: 15px;
                background: rgba(76, 175, 80, 0.1);
                border-radius: 10px;
                border-left: 4px solid #4CAF50;
                font-size: 0.95rem;
                line-height: 1.6;
            `;
            this.elements.audioPreview.appendChild(textDisplay);
        }

        textDisplay.innerHTML = `
            <strong style="color: #2E7D32;"><i class="fas fa-quote-left"></i> आपका सवाल:</strong>
            <p style="margin: 8px 0 0 0; font-style: italic;">"${text}"</p>
        `;

        this.elements.audioPreview.style.display = 'block';

        // Update card styling
        const audioCard = document.querySelector('.audio-card');
        if (audioCard) {
            audioCard.style.borderColor = '#4CAF50';
            audioCard.style.backgroundColor = 'rgba(76, 175, 80, 0.02)';
        }
    }

    // ==================== FORM SUBMISSION ====================
    checkSubmitButton() {
        const hasPhoto = !!this.photoFile;
        const hasQuestion = !!this.recognizedText.trim();

        if (hasPhoto && hasQuestion) {
            this.elements.submitBtn.disabled = false;
            this.elements.submitBtn.style.opacity = '1';
            this.elements.submitBtn.style.transform = 'scale(1)';
        } else {
            this.elements.submitBtn.disabled = true;
            this.elements.submitBtn.style.opacity = '0.6';
            this.elements.submitBtn.style.transform = 'scale(0.98)';
        }
    }

    async submitAnalysis() {
        if (!this.photoFile) {
            this.showNotification('कृपया फसल की फोटो अपलोड करें', 'error');
            return;
        }

        if (!this.recognizedText.trim()) {
            this.showNotification('कृपया अपना सवाल रिकॉर्ड करें', 'error');
            return;
        }

        this.showLoadingState(true);

        try {
            const formData = new FormData();
            formData.append('photo', this.photoFile);
            formData.append('question', this.recognizedText);

            console.log('📤 Submitting analysis...', {
                photo: this.photoFile.name,
                question: this.recognizedText
            });

            const response = await fetch('/analyze', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const result = await response.json();
            console.log('📥 Server response:', result);

            if (result.success) {
                this.displayResults(result);
            } else {
                throw new Error(result.error || 'Unknown server error');
            }

        } catch (error) {
            console.error('❌ Submission error:', error);
            this.showNotification('समस्या हुई: ' + error.message, 'error');
        } finally {
            this.showLoadingState(false);
        }
    }

    // ==================== LOADING STATE ====================
    showLoadingState(loading) {
        if (loading) {
            this.elements.loadingSection.style.display = 'block';
            this.elements.resultSection.style.display = 'none';
            this.elements.submitBtn.disabled = true;
            
            this.animateLoadingSteps();
            this.animateProgressBar();
        } else {
            this.elements.loadingSection.style.display = 'none';
            this.checkSubmitButton();
        }
    }

    animateLoadingSteps() {
        const steps = this.elements.loadingSteps;
        let currentStep = 0;

        const stepInterval = setInterval(() => {
            if (currentStep < steps.length) {
                steps[currentStep].classList.add('active');
                currentStep++;
            } else {
                clearInterval(stepInterval);
            }
        }, 800);

        // Store interval to clear later
        this.loadingStepInterval = stepInterval;
    }

    animateProgressBar() {
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 90) progress = 90;
            
            if (this.elements.progressFill) {
                this.elements.progressFill.style.width = progress + '%';
            }
            
            if (progress >= 90) {
                clearInterval(progressInterval);
            }
        }, 200);

        this.progressInterval = progressInterval;
    }

    // ==================== RESULTS DISPLAY ====================
    displayResults(result) {
        // Clear loading intervals
        if (this.loadingStepInterval) clearInterval(this.loadingStepInterval);
        if (this.progressInterval) clearInterval(this.progressInterval);

        // Complete progress bar
        if (this.elements.progressFill) {
            this.elements.progressFill.style.width = '100%';
        }

        // Display disease info
        if (this.elements.diseaseName) {
            this.elements.diseaseName.textContent = result.detected_disease;
        }

        // Display confidence
        const confidence = result.confidence || 85;
        if (this.elements.confidenceFill) {
            setTimeout(() => {
                this.elements.confidenceFill.style.width = confidence + '%';
            }, 500);
        }
        if (this.elements.confidenceText) {
            this.elements.confidenceText.textContent = confidence + '%';
        }

        // Display solution
        this.displaySolution(result.solution);

        // Show results section
        this.elements.resultSection.style.display = 'block';
        this.elements.resultSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });

        console.log('✅ Results displayed successfully');
    }

    displaySolution(solution) {
        if (!this.elements.solutionText) return;

        // Format solution text
        let formattedSolution = solution
            .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #2E7D32;">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/•/g, '→')
            .replace(/\n/g, '<br>');

        this.elements.solutionText.innerHTML = formattedSolution;

        // Add speak button
        this.addSpeakButton(solution);
    }

    addSpeakButton(solution) {
        // Remove existing speak button
        const existingBtn = document.querySelector('#speakSolutionBtn');
        if (existingBtn) existingBtn.remove();

        // Create new speak button
        const speakBtn = document.createElement('button');
        speakBtn.id = 'speakSolutionBtn';
        speakBtn.className = 'btn-secondary';
        speakBtn.innerHTML = '<i class="fas fa-volume-up"></i> समाधान सुनें';
        speakBtn.style.cssText = `
            margin-top: 20px;
            padding: 12px 20px;
            background: transparent;
            border: 2px solid #4CAF50;
            color: #4CAF50;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
        `;

        speakBtn.onmouseover = () => {
            speakBtn.style.background = '#4CAF50';
            speakBtn.style.color = 'white';
        };

        speakBtn.onmouseout = () => {
            speakBtn.style.background = 'transparent';
            speakBtn.style.color = '#4CAF50';
        };

        speakBtn.onclick = () => {
            const plainText = solution.replace(/\*\*(.*?)\*\*/g, '$1');
            this.speakText(plainText);
        };

        this.elements.solutionText.appendChild(speakBtn);
    }

    // ==================== TAB SWITCHING ====================
    switchTab(tabName) {
        // Update tab buttons
        this.elements.tabBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

        // Update tab content
        this.elements.textTab.classList.remove('active');
        this.elements.audioTab.classList.remove('active');

        if (tabName === 'text') {
            this.elements.textTab.classList.add('active');
        } else if (tabName === 'audio') {
            this.elements.audioTab.classList.add('active');
        }
    }

    // ==================== UTILITY FUNCTIONS ====================
    updateStepsIndicator(activeStep) {
        this.elements.steps.forEach((step, index) => {
            if (index + 1 <= activeStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 9999;
            animation: slideInRight 0.3s ease;
        `;

        // Set color based on type
        const colors = {
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FF9800',
            error: '#f44336'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        notification.textContent = message;
        document.body.appendChild(notification);

        // Auto remove
        setTimeout(() => {
            notification.remove();
        }, 4000);

        console.log(`${type.toUpperCase()}: ${message}`);
    }

    handleSpeechError(error) {
        const errorMessages = {
            'no-speech': 'कोई आवाज नहीं सुनाई दी। कृपया दोबारा कोशिश करें।',
            'audio-capture': 'माइक्रोफोन की समस्या। Device check करें।',
            'not-allowed': 'माइक्रोफोन की permission नहीं मिली।',
            'network': 'इंटरनेट कनेक्शन की समस्या।',
            'service-not-allowed': 'Speech service उपलब्ध नहीं है।'
        };

        const message = errorMessages[error] || `Speech recognition error: ${error}`;
        this.showNotification(message, 'error');
    }

    // ==================== ACTION HANDLERS ====================
    resetForm() {
        // Reset all states
        this.photoFile = null;
        this.recognizedText = '';
        this.isRecording = false;
        this.isListening = false;

        // Reset UI elements
        this.removePhoto();
        this.resetRecording();
        
        // Hide sections
        this.elements.resultSection.style.display = 'none';
        this.elements.loadingSection.style.display = 'none';

        // Reset steps
        this.updateStepsIndicator(1);
        this.checkSubmitButton();

        console.log('🔄 Form reset completed');
    }

    shareResults() {
        if (navigator.share) {
            navigator.share({
                title: 'KisanAI Sahayak - फसल विश्लेषण',
                text: 'मैंने अपनी फसल का AI विश्लेषण कराया है।',
                url: window.location.href
            });
        } else {
            // Fallback
            const url = window.location.href;
            navigator.clipboard.writeText(url);
            this.showNotification('Link copied to clipboard!', 'success');
        }
    }

    downloadResults() {
        const resultContent = this.elements.solutionText?.textContent || '';
        const blob = new Blob([resultContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'किसान-AI-समाधान.txt';
        a.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('समाधान download हो गया!', 'success');
    }
}

// ==================== ADD ANIMATION STYLES ====================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .drag-over {
        border-color: #4CAF50 !important;
        background-color: rgba(76, 175, 80, 0.1) !important;
    }

    .step.active .step-number {
        animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
        }
        70% {
            box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
        }
    }
`;
document.head.appendChild(style);

// ==================== INITIALIZE APP ====================
document.addEventListener('DOMContentLoaded', () => {
    window.kisanAI = new KisanAISahayak();
    console.log('🌾 KisanAI Sahayak loaded successfully!');
});

// ==================== ERROR HANDLER ====================
window.addEventListener('error', (event) => {
    console.error('❌ Global Error:', event.error);
});

// ==================== EXPORT ====================
window.KisanAISahayak = KisanAISahayak;
