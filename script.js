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
                bg.grid.setColors([0xC9AD92, 0x473523, 0xD8C4B0]);
                bg.grid.light1.color.set(0xF5F5DC);
                bg.grid.light1.intensity = 400;
                bg.grid.light2.color.set(0x8B4513);
                bg.grid.light2.intensity = 200;

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
            .catch(() => {});
    } catch {}
}

document.addEventListener('DOMContentLoaded', () => {
    initializeBackground();

    const heroH1 = document.querySelector('.hero h1');
    const heroH2 = document.querySelector('.hero h2');
    const heroP = document.querySelector('.hero p');
    const heroButtons = document.querySelector('.hero-buttons');
    if (heroH1 && heroH2 && heroP && heroButtons) {
        heroH1.classList.add('animated-text');
        heroH2.classList.add('animated-text');
        heroH1.style.animation = 'fadeInUp 1s forwards 0.3s, glowText 1.5s ease-in-out forwards 0.3s';
        heroH2.style.animation = 'fadeInUp 1s forwards 0.4s, glowText 1.5s ease-in-out forwards 0.4s';
        heroP.style.animation = 'fadeInUp 1s forwards 0.6s';
        heroButtons.style.animation = 'fadeInUp 1s forwards 0.9s';
    }

    // Generate unique Chat ID
    function generateChatId() {
        return 'chat-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    let chatId = null;

    function validateStep1() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const nameError = document.getElementById('name-error');
        const emailError = document.getElementById('email-error');

        let isValid = true;

        if (!name) {
            nameError.textContent = 'Name is required';
            isValid = false;
        } else {
            nameError.textContent = '';
        }

        if (!email) {
            emailError.textContent = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(email)) {
            emailError.textContent = 'Please enter a valid email';
            isValid = false;
        } else {
            emailError.textContent = '';
        }

        return isValid;
    }

    function validateStep2() {
        const companySize = document.querySelector('input[name="companySize"]:checked');
        const companySizeError = document.getElementById('companySize-error');

        if (!companySize) {
            companySizeError.textContent = 'Please select a company size';
            return false;
        } else {
            companySizeError.textContent = '';
            return true;
        }
    }

    function validateStep3() {
        const occupation = document.getElementById('occupation').value.trim();
        const occupationError = document.getElementById('occupation-error');

        if (!occupation) {
            occupationError.textContent = 'Please describe your activities';
            return false;
        } else {
            occupationError.textContent = '';
            return true;
        }
    }

    function validateStep4() {
        const experience = document.querySelector('input[name="experience"]:checked');
        const experienceError = document.getElementById('experience-error');

        if (!experience) {
            experienceError.textContent = 'Please select your automation experience';
            return false;
        } else {
            experienceError.textContent = '';
            return true;
        }
    }

    function validateStep5() {
        const receiveEmails = document.querySelector('input[name="receiveEmails"]:checked');
        const receiveEmailsError = document.getElementById('receiveEmails-error');

        if (!receiveEmails) {
            receiveEmailsError.textContent = 'Please select an option';
            return false;
        } else {
            receiveEmailsError.textContent = '';
            return true;
        }
    }

    function validateCurrentStep(stepIndex) {
        switch (stepIndex) {
            case 0: return validateStep1();
            case 1: return validateStep2();
            case 2: return validateStep3();
            case 3: return validateStep4();
            case 4: return validateStep5();
            default: return true;
        }
    }

    function validateAllSteps() {
        return validateStep1() && validateStep2() && validateStep3() && validateStep4() && validateStep5();
    }

    function resetForm() {
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.querySelectorAll('input[name="companySize"]').forEach(radio => radio.checked = false);
        document.getElementById('occupation').value = '';
        document.querySelectorAll('input[name="experience"]').forEach(radio => radio.checked = false);
        document.querySelectorAll('input[name="receiveEmails"]').forEach(checkbox => checkbox.checked = false);
        document.getElementById('name-error').textContent = '';
        document.getElementById('email-error').textContent = '';
        document.getElementById('companySize-error').textContent = '';
        document.getElementById('occupation-error').textContent = '';
        document.getElementById('experience-error').textContent = '';
        document.getElementById('receiveEmails-error').textContent = '';
        chatId = null; // Reset Chat ID
    }

    function resetSections() {
        heroSection.style.display = 'none';
        heroSection.style.animation = 'none';
        heroSection.classList.remove('active');
        formSection.style.display = 'none';
        formSection.style.animation = 'none';
        formSection.classList.remove('active');
        chatSection.style.display = 'none';
        chatSection.style.animation = 'none';
        chatSection.classList.remove('active');
    }

    const letsBeginBtn = document.getElementById('letsBeginBtn');
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    const backBtn = document.getElementById('backBtn');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const heroSection = document.getElementById('hero-section');
    const formSection = document.getElementById('form-section');
    const chatSection = document.getElementById('chat-section');
    const indicators = document.querySelectorAll('.indicator');
    const steps = document.querySelectorAll('.step');
    const prevStepBtn = document.getElementById('prevStepBtn');
    const nextStepBtn = document.getElementById('nextStepBtn');
    const submitBtn = document.getElementById('submitForm');
    const chatInput = document.getElementById('chatInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const chatMessages = document.getElementById('chatMessages');
    let currentStep = 0;

    chatSection.style.display = 'none';
    chatSection.classList.remove('active');

    function switchStep(newStep) {
        if (newStep >= 0 && newStep < steps.length) {
            if (newStep > currentStep && !validateCurrentStep(currentStep)) {
                return;
            }
            steps[currentStep].classList.remove('active');
            indicators[currentStep].classList.remove('active');
            currentStep = newStep;
            steps[currentStep].classList.add('active');
            indicators[currentStep].classList.add('active');
            updateSubmitButton();
        }
    }

    function updateSubmitButton() {
        submitBtn.disabled = !validateAllSteps();
    }

    const receiveEmailsCheckboxes = document.querySelectorAll('input[name="receiveEmails"]');
    receiveEmailsCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                receiveEmailsCheckboxes.forEach(cb => {
                    if (cb !== checkbox) cb.checked = false;
                });
            }
            updateSubmitButton();
        });
    });

    document.getElementById('name').addEventListener('input', () => {
        validateStep1();
        updateSubmitButton();
    });

    document.getElementById('email').addEventListener('input', () => {
        validateStep1();
        updateSubmitButton();
    });

    document.querySelectorAll('input[name="companySize"]').forEach(radio => {
        radio.addEventListener('change', () => {
            validateStep2();
            updateSubmitButton();
        });
    });

    document.getElementById('occupation').addEventListener('input', () => {
        validateStep3();
        updateSubmitButton();
    });

    document.querySelectorAll('input[name="experience"]').forEach(radio => {
        radio.addEventListener('change', () => {
            validateStep4();
            updateSubmitButton();
        });
    });

    updateSubmitButton();

    learnMoreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'https://kamilkaczmarekkmz.github.io/MojaStrona/Why';
    });

    letsBeginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        resetSections();
        heroSection.style.animation = 'fadeOut 1s forwards';
        setTimeout(() => {
            heroSection.style.display = 'none';
            formSection.style.display = 'flex';
            formSection.style.animation = 'fadeInUp 1s forwards';
            formSection.classList.add('active');
            chatSection.style.display = 'none';
            chatSection.classList.remove('active');
            updateSubmitButton();
        }, 1000);
    });

    backBtn.addEventListener('click', () => {
        resetSections();
        formSection.style.animation = 'fadeOut 1s forwards';
        setTimeout(() => {
            formSection.style.display = 'none';
            heroSection.style.display = 'flex';
            heroSection.style.animation = 'fadeInUp 1s forwards';
            heroSection.classList.add('active');
            chatSection.style.display = 'none';
            chatSection.classList.remove('active');
            heroH1.style.animation = 'none';
            heroH2.style.animation = 'none';
            heroP.style.animation = 'none';
            heroButtons.style.animation = 'none';
            setTimeout(() => {
                heroH1.style.animation = 'fadeInUp 1s forwards 0.3s, glowText 1.5s ease-in-out forwards 0.3s';
                heroH2.style.animation = 'fadeInUp 1s forwards 0.4s, glowText 1.5s ease-in-out forwards 0.4s';
                heroP.style.animation = 'fadeInUp 1s forwards 0.6s';
                heroButtons.style.animation = 'fadeInUp 1s forwards 0.9s';
            }, 10);
            resetForm();
            steps[currentStep].classList.remove('active');
            indicators[currentStep].classList.remove('active');
            currentStep = 0;
            steps[currentStep].classList.add('active');
            indicators[currentStep].classList.add('active');
            updateSubmitButton();
        }, 1000);
    });

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            if (index <= currentStep || validateCurrentStep(currentStep)) {
                switchStep(index);
            }
        });
    });

    prevStepBtn.addEventListener('click', () => {
        switchStep(currentStep - 1);
    });

    nextStepBtn.addEventListener('click', () => {
        switchStep(currentStep + 1);
    });

    document.addEventListener('keydown', (e) => {
        if (formSection.style.display !== 'none') {
            if (e.key === 'ArrowLeft') {
                switchStep(currentStep - 1);
            } else if (e.key === 'ArrowRight' && validateCurrentStep(currentStep)) {
                switchStep(currentStep + 1);
            }
        }
    });

    const formSteps = document.querySelector('.form-steps');
    let touchStartX = 0;
    let touchEndX = 0;

    formSteps.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    formSteps.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50 && validateCurrentStep(currentStep)) {
            switchStep(currentStep + 1);
        } else if (touchEndX - touchStartX > 50) {
            switchStep(currentStep - 1);
        }
    });

    submitBtn.addEventListener('click', async () => {
        if (validateAllSteps()) {
            chatId = generateChatId();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const companySize = document.querySelector('input[name="companySize"]:checked')?.value;
            const occupation = document.getElementById('occupation').value;
            const experience = document.querySelector('input[name="experience"]:checked')?.value;
            const receiveEmails = document.querySelector('input[name="receiveEmails"]:checked')?.value;

            const formData = {
                chatId,
                name,
                email,
                companySize,
                occupation,
                experience,
                receiveEmails
            };

            try {
                const response = await fetch('http://localhost:5678/webhook/487a128f-9cef-47d3-9709-93ca4b7824e3', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('Form submitted successfully!');
                    formSection.style.animation = 'fadeOut 1s forwards';
                    setTimeout(() => {
                        formSection.style.display = 'none';
                        formSection.classList.remove('active');
                        chatSection.style.display = 'flex';
                        chatSection.style.animation = 'fadeInUp 1s forwards';
                        chatSection.classList.add('active');
                        addMessage('bot', 'Hello! How can I assist you today?');
                        resetForm();
                        steps[currentStep].classList.remove('active');
                        indicators[currentStep].classList.remove('active');
                        currentStep = 0;
                        steps[currentStep].classList.add('active');
                        indicators[currentStep].classList.add('active');
                    }, 1000);
                } else {
                    alert('Error submitting form. Please try again.');
                    chatId = null;
                }
            } catch {
                alert('Error submitting form. Please check your connection.');
                chatId = null;
            }
        } else {
            if (!validateStep1()) {
                switchStep(0);
            } else if (!validateStep2()) {
                switchStep(1);
            } else if (!validateStep3()) {
                switchStep(2);
            } else if (!validateStep4()) {
                switchStep(3);
            } else if (!validateStep5()) {
                switchStep(4);
            }
        }
    });

    function addMessage(sender, text) {
        const message = document.createElement('div');
        message.classList.add('message', sender);
        message.textContent = text;
        chatMessages.appendChild(message);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    sendMessageBtn.addEventListener('click', async () => {
        const messageText = chatInput.value.trim();
        if (messageText && chatId) {
            addMessage('user', messageText);
            try {
                const response = await fetch('http://localhost:5678/webhook/487a128f-9cef-47d3-9709-93ca4b7824e3', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ chatId, message: messageText })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.response) {
                        addMessage('bot', data.response);
                    } else {
                        addMessage('bot', 'Thanks for your message! How can I help you further?');
                    }
                } else {
                    addMessage('bot', 'Error sending message. Please try again.');
                }
            } catch {
                addMessage('bot', 'Error sending message. Please check your connection.');
            }
            chatInput.value = '';
        } else if (!chatId) {
            addMessage('bot', 'Please submit the form first to start a chat.');
            chatInput.value = '';
        }
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessageBtn.click();
        }
    });

    closeChatBtn.addEventListener('click', () => {
        resetSections();
        chatSection.style.animation = 'fadeOut 1s forwards';
        setTimeout(() => {
            chatSection.style.display = 'none';
            heroSection.style.display = 'flex';
            heroSection.style.animation = 'fadeInUp 1s forwards';
            heroSection.classList.add('active');
            heroH1.style.animation = 'none';
            heroH2.style.animation = 'none';
            heroP.style.animation = 'none';
            heroButtons.style.animation = 'none';
            setTimeout(() => {
                heroH1.style.animation = 'fadeInUp 1s forwards 0.3s, glowText 1.5s ease-in-out forwards 0.3s';
                heroH2.style.animation = 'fadeInUp 1s forwards 0.4s, glowText 1.5s ease-in-out forwards 0.4s';
                heroP.style.animation = 'fadeInUp 1s forwards 0.6s';
                heroButtons.style.animation = 'fadeInUp 1s forwards 0.9s';
            }, 10);
            chatMessages.innerHTML = '';
            chatId = null;
        }, 1000);
    });

    setTimeout(() => {
        const modelViewer = document.querySelector('model-viewer');
        const poster = document.querySelector('.model-placeholder');
        if (modelViewer && poster) {
            poster.style.display = 'flex';
        }
    }, 5000);
});
