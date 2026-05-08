function initializeBackground() {
    try {
        import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.16/build/backgrounds/grid1.cdn.min.js')
            .then((module) => {
                const Grid1Background = module.default;
                const canvas = document.getElementById('webgl-canvas');
                if (!canvas) return;
                canvas.style.display = 'block';
                canvas.style.width = '100vw';
                canvas.style.height = '100vh';
                canvas.style.zIndex = '-1';

                const bg = Grid1Background(canvas);
                // Darker colors: black, gray, dark brown
                bg.grid.setColors([0x2A2A2A, 0x111111, 0x3A3A3A]);
                bg.grid.light1.color.set(0x333333);
                bg.grid.light1.intensity = 300;
                bg.grid.light2.color.set(0x222222);
                bg.grid.light2.intensity = 150;

                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
                bg.grid.light1.position.set(centerX, centerY, -100);
                bg.grid.light2.position.set(centerX, centerY, -100);

                bg.camera.zoom = 1;
                bg.camera.updateProjectionMatrix();

                canvas.removeEventListener('mousemove', bg.grid.onMouseMove);
                canvas.removeEventListener('wheel', bg.grid.onMouseWheel);
                canvas.removeEventListener('touchmove', bg.grid.onTouchMove);

                function animate() {
                    bg.grid.light1.position.set(centerX, centerY, -100);
                    bg.grid.light2.position.set(centerX, centerY, -100);
                    requestAnimationFrame(animate);
                }
                animate();

                window.addEventListener('resize', () => {
                    const width = window.innerWidth;
                    const height = window.innerHeight;
                    bg.renderer.setSize(width, height);
                    bg.camera.aspect = width / height;
                    bg.camera.updateProjectionMatrix();
                    bg.grid.light1.position.set(width / 2, height / 2, -100);
                    bg.grid.light2.position.set(width / 2, height / 2, -100);
                });
            })
            .catch(() => console.log("Background module failed"));
    } catch {}
}

document.addEventListener('DOMContentLoaded', () => {
    initializeBackground();

    // UI Elements
    const heroSection = document.getElementById('hero-section');
    const formSection = document.getElementById('form-section');
    const chatSection = document.getElementById('chat-section');
    const letsBeginBtn = document.getElementById('letsBeginBtn');
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    const backBtn = document.getElementById('backBtn');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const prevStepBtn = document.getElementById('prevStepBtn');
    const nextStepBtn = document.getElementById('nextStepBtn');
    const submitBtn = document.getElementById('submitForm');
    const indicators = document.querySelectorAll('.indicator');
    const steps = document.querySelectorAll('.step');
    
    let currentStep = 0;
    let chatId = null;

    function generateChatId() {
        return 'chat-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    // Validation functions
    function validateStep1() {
        const name = document.getElementById('name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let isValid = true;
        if (!name) { document.getElementById('name-error').textContent = 'Name required'; isValid = false; }
        else { document.getElementById('name-error').textContent = ''; }
        if (!email) { document.getElementById('email-error').textContent = 'Email required'; isValid = false; }
        else if (!emailRegex.test(email)) { document.getElementById('email-error').textContent = 'Valid email required'; isValid = false; }
        else { document.getElementById('email-error').textContent = ''; }
        return isValid;
    }
    function validateStep2() {
        const checked = document.querySelector('input[name="companySize"]:checked');
        const err = document.getElementById('companySize-error');
        if (!checked) { err.textContent = 'Select company size'; return false; }
        err.textContent = ''; return true;
    }
    function validateStep3() {
        const occ = document.getElementById('occupation')?.value.trim();
        const err = document.getElementById('occupation-error');
        if (!occ) { err.textContent = 'Describe your activities'; return false; }
        err.textContent = ''; return true;
    }
    function validateStep4() {
        const checked = document.querySelector('input[name="experience"]:checked');
        const err = document.getElementById('experience-error');
        if (!checked) { err.textContent = 'Select experience level'; return false; }
        err.textContent = ''; return true;
    }
    function validateStep5() {
        const checked = document.querySelector('input[name="receiveEmails"]:checked');
        const err = document.getElementById('receiveEmails-error');
        if (!checked) { err.textContent = 'Select an option'; return false; }
        err.textContent = ''; return true;
    }
    function validateCurrentStep(step) {
        if (step === 0) return validateStep1();
        if (step === 1) return validateStep2();
        if (step === 2) return validateStep3();
        if (step === 3) return validateStep4();
        if (step === 4) return validateStep5();
        return true;
    }
    function validateAllSteps() {
        return validateStep1() && validateStep2() && validateStep3() && validateStep4() && validateStep5();
    }
    function updateSubmitButton() {
        if (submitBtn) submitBtn.disabled = !validateAllSteps();
    }

    function switchStep(newStep) {
        if (newStep >= 0 && newStep < steps.length) {
            if (newStep > currentStep && !validateCurrentStep(currentStep)) return;
            steps[currentStep].classList.remove('active');
            indicators[currentStep].classList.remove('active');
            currentStep = newStep;
            steps[currentStep].classList.add('active');
            indicators[currentStep].classList.add('active');
        }
    }

    // Event listeners for form inputs
    document.getElementById('name')?.addEventListener('input', updateSubmitButton);
    document.getElementById('email')?.addEventListener('input', updateSubmitButton);
    document.querySelectorAll('input[name="companySize"]').forEach(r => r.addEventListener('change', updateSubmitButton));
    document.getElementById('occupation')?.addEventListener('input', updateSubmitButton);
    document.querySelectorAll('input[name="experience"]').forEach(r => r.addEventListener('change', updateSubmitButton));
    document.querySelectorAll('input[name="receiveEmails"]').forEach(r => r.addEventListener('change', updateSubmitButton));

    prevStepBtn?.addEventListener('click', () => switchStep(currentStep - 1));
    nextStepBtn?.addEventListener('click', () => switchStep(currentStep + 1));
    indicators.forEach((ind, idx) => ind.addEventListener('click', () => {
        if (idx <= currentStep || validateCurrentStep(currentStep)) switchStep(idx);
    }));

    function resetSections() {
        heroSection.style.display = 'none';
        formSection.style.display = 'none';
        chatSection.style.display = 'none';
        heroSection.classList.remove('active');
        formSection.classList.remove('active');
        chatSection.classList.remove('active');
    }

    function resetFormFields() {
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.querySelectorAll('input[name="companySize"]').forEach(r => r.checked = false);
        document.getElementById('occupation').value = '';
        document.querySelectorAll('input[name="experience"]').forEach(r => r.checked = false);
        document.querySelectorAll('input[name="receiveEmails"]').forEach(r => r.checked = false);
        document.querySelectorAll('.error-message').forEach(e => e.textContent = '');
        currentStep = 0;
        steps.forEach((s, i) => {
            s.classList.toggle('active', i === 0);
            indicators[i].classList.toggle('active', i === 0);
        });
        updateSubmitButton();
    }

    letsBeginBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        resetSections();
        heroSection.style.animation = 'fadeOut 1s forwards';
        setTimeout(() => {
            heroSection.style.display = 'none';
            formSection.style.display = 'flex';
            formSection.style.animation = 'fadeInUp 1s forwards';
            formSection.classList.add('active');
            resetFormFields();
        }, 500);
    });

    learnMoreBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'https://kamilkaczmarekkmz.github.io/MojaStrona/Why';
    });

    backBtn?.addEventListener('click', () => {
        resetSections();
        formSection.style.animation = 'fadeOut 1s forwards';
        setTimeout(() => {
            formSection.style.display = 'none';
            heroSection.style.display = 'flex';
            heroSection.style.animation = 'fadeInUp 1s forwards';
            heroSection.classList.add('active');
            resetFormFields();
        }, 500);
    });

    // Chat functions
    function addMessage(sender, text) {
        const container = document.getElementById('chatMessages');
        if (!container) return;
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);
        msgDiv.textContent = text;
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    }

    submitBtn?.addEventListener('click', async () => {
        if (validateAllSteps()) {
            chatId = generateChatId();
            const formData = {
                chatId,
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                companySize: document.querySelector('input[name="companySize"]:checked')?.value,
                occupation: document.getElementById('occupation').value,
                experience: document.querySelector('input[name="experience"]:checked')?.value,
                receiveEmails: document.querySelector('input[name="receiveEmails"]:checked')?.value
            };
            try {
                const response = await fetch('http://localhost:5678/webhook/487a128f-9cef-47d3-9709-93ca4b7824e3', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
                });
                if (response.ok) {
                    formSection.style.animation = 'fadeOut 1s forwards';
                    setTimeout(() => {
                        formSection.style.display = 'none';
                        chatSection.style.display = 'flex';
                        chatSection.style.animation = 'fadeInUp 1s forwards';
                        addMessage('bot', 'Hello! How can I assist you today?');
                    }, 500);
                } else { alert('Error submitting form'); chatId = null; }
            } catch { alert('Connection error'); chatId = null; }
        } else { alert('Please fill all steps correctly'); }
    });

    const sendBtn = document.getElementById('sendMessageBtn');
    const chatInput = document.getElementById('chatInput');
    sendBtn?.addEventListener('click', async () => {
        const msg = chatInput.value.trim();
        if (msg && chatId) {
            addMessage('user', msg);
            try {
                const res = await fetch('http://localhost:5678/webhook/487a128f-9cef-47d3-9709-93ca4b7824e3', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chatId, message: msg })
                });
                if (res.ok) {
                    const data = await res.json();
                    addMessage('bot', data.response || 'Thanks for your message!');
                } else { addMessage('bot', 'Error sending message'); }
            } catch { addMessage('bot', 'Connection error'); }
            chatInput.value = '';
        } else if (!chatId) addMessage('bot', 'Please submit the form first');
    });
    chatInput?.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendBtn?.click(); });

    closeChatBtn?.addEventListener('click', () => {
        resetSections();
        chatSection.style.animation = 'fadeOut 1s forwards';
        setTimeout(() => {
            chatSection.style.display = 'none';
            heroSection.style.display = 'flex';
            heroSection.style.animation = 'fadeInUp 1s forwards';
            document.getElementById('chatMessages').innerHTML = '';
            chatId = null;
        }, 500);
    });
});
