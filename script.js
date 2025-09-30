function initializeBackground() {
    console.log('Attempting to initialize hexagonal background');
    try {
        import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.16/build/backgrounds/grid1.cdn.min.js')
            .then((module) => {
                console.log('Background module loaded successfully');
                const Grid1Background = module.default;
                const canvas = document.getElementById('webgl-canvas');
                if (!canvas) {
                    console.error('Canvas element not found');
                    return;
                }
                // Ensure canvas is visible
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

                // Set lights to the center of the screen, behind the 3D model (Z=-100)
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
                bg.grid.light1.position.set(centerX, centerY, -100);
                bg.grid.light2.position.set(centerX, centerY, -100);

                bg.camera.zoom = 1;
                bg.camera.updateProjectionMatrix();

                // Disconnect all mouse events
                canvas.removeEventListener('mousemove', bg.grid.onMouseMove);
                canvas.removeEventListener('wheel', bg.grid.onMouseWheel);
                canvas.removeEventListener('touchmove', bg.grid.onTouchMove);

                // Animation loop to ensure static light position
                function animate() {
                    bg.grid.light1.position.set(centerX, centerY, -100);
                    bg.grid.light2.position.set(centerX, centerY, -100);
                    requestAnimationFrame(animate);
                }
                animate();

                window.addEventListener('resize', () => {
                    console.log('Window resized, updating background');
                    const width = window.innerWidth;
                    const height = window.innerHeight;
                    bg.renderer.setSize(width, height);
                    bg.camera.aspect = width / height;
                    bg.camera.updateProjectionMatrix();
                    bg.grid.light1.position.set(width / 2, height / 2, -100);
                    bg.grid.light2.position.set(width / 2, height / 2, -100);
                });

                console.log('Hexagonal background initialized successfully');
            })
            .catch((error) => {
                console.error('Error loading background module:', error);
            });
    } catch (error) {
        console.error('Error importing background module:', error);
    }
}

// Initialize background on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initializeBackground();

    // Hero section animation
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
    } else {
        console.error('Hero elements not found');
    }

    // Validation functions
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

        console.log('Step 1 validation:', isValid);
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

    function validateAllSteps() {
        const isValid = validateStep1() && validateStep2() && validateStep3() && validateStep4() && validateStep5();
        console.log('All steps validation:', isValid);
        return isValid;
    }

    // Function to reset form
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
    }

    // Function to reset all sections
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
        console.log('All sections reset');
    }

    // Function to generate a random link
    function getRandomLink() {
        const randomLinks = [
            'https://example.com/page1',
            'https://example.com/page2',
            'https://example.com/page3',
            'https://example.com/page4',
            'https://example.com/page5'
        ];
        return randomLinks[Math.floor(Math.random() * randomLinks.length)];
    }

    // Button handlers
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

    // Debug: Check if elements are found
    if (!letsBeginBtn) console.error('letsBeginBtn not found');
    if (!heroSection) console.error('heroSection not found');
    if (!formSection) console.error('formSection not found');
    if (!chatSection) console.error('chatSection not found');

    // Ensure chat section is hidden initially
    chatSection.style.display = 'none';
    chatSection.classList.remove('active');

    // Function to switch steps
    function switchStep(newStep) {
        if (newStep >= 0 && newStep < steps.length) {
            steps[currentStep].classList.remove('active');
            indicators[currentStep].classList.remove('active');
            currentStep = newStep;
            steps[currentStep].classList.add('active');
            indicators[currentStep].classList.add('active');
            updateSubmitButton();
            console.log(`Switched to step ${currentStep + 1}`);
        }
    }

    // Function to update Submit button state
    function updateSubmitButton() {
        const isValid = validateAllSteps();
        submitBtn.disabled = !isValid;
        console.log('Submit button state:', isValid ? 'enabled' : 'disabled');
    }

    // Ensure single selection for receiveEmails checkboxes
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

    // Add event listeners for form inputs
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

    // Initial validation
    updateSubmitButton();

    learnMoreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Learn more clicked');
        window.location.href = getRandomLink();
    });

    letsBeginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Let\'s begin clicked');
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
        console.log('Back button clicked');
        resetSections();
        formSection.style.animation = 'fadeOut 1s forwards';
        setTimeout(() => {
            formSection.style.display = 'none';
            heroSection.style.display = 'flex';
            heroSection.style.animation = 'fadeInUp 1s forwards';
            heroSection.classList.add('active');
            chatSection.style.display = 'none';
            chatSection.classList.remove('active');
            // Reset animations for hero elements
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
            // Reset form and step
            resetForm();
            steps[currentStep].classList.remove('active');
            indicators[currentStep].classList.remove('active');
            currentStep = 0;
            steps[currentStep].classList.add('active');
            indicators[currentStep].classList.add('active');
            updateSubmitButton();
        }, 1000);
    });

    // Step navigation (dots)
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            console.log(`Indicator ${index} clicked`);
            switchStep(index);
        });
    });

    // Visual arrow navigation
    prevStepBtn.addEventListener('click', () => {
        console.log('Previous step clicked');
        switchStep(currentStep - 1);
    });

    nextStepBtn.addEventListener('click', () => {
        console.log('Next step clicked');
        switchStep(currentStep + 1);
    });

    // Keyboard navigation (left/right arrows)
    document.addEventListener('keydown', (e) => {
        if (formSection.style.display !== 'none') {
            if (e.key === 'ArrowLeft') {
                console.log('Left arrow pressed');
                switchStep(currentStep - 1);
            } else if (e.key === 'ArrowRight') {
                console.log('Right arrow pressed');
                switchStep(currentStep + 1);
            }
        }
    });

    // Swipe navigation on touch devices
    const formSteps = document.querySelector('.form-steps');
    let touchStartX = 0;
    let touchEndX = 0;

    formSteps.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    formSteps.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
            console.log('Swipe left');
            switchStep(currentStep + 1);
        } else if (touchEndX - touchStartX > 50) {
            console.log('Swipe right');
            switchStep(currentStep - 1);
        }
    });

    // Form submission
    submitBtn.addEventListener('click', () => {
        console.log('Submit button clicked');
        if (validateAllSteps()) {
            console.log('Form validated successfully, showing chat');
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const companySize = document.querySelector('input[name="companySize"]:checked')?.value;
            const occupation = document.getElementById('occupation').value;
            const experience = document.querySelector('input[name="experience"]:checked')?.value;
            const receiveEmails = document.querySelector('input[name="receiveEmails"]:checked')?.value;

            console.log('Form data:', { name, email, companySize, occupation, experience, receiveEmails });
            
            // Hide form section
            formSection.style.animation = 'fadeOut 1s forwards';
            setTimeout(() => {
                formSection.style.display = 'none';
                formSection.classList.remove('active');
                // Show chat section
                chatSection.style.display = 'flex';
                chatSection.style.animation = 'fadeInUp 1s forwards';
                chatSection.classList.add('active');
                // Initialize chat with a welcome message
                addMessage('bot', 'Hello! How can I assist you today?');
                resetForm();
                steps[currentStep].classList.remove('active');
                indicators[currentStep].classList.remove('active');
                currentStep = 0;
                steps[currentStep].classList.add('active');
                indicators[currentStep].classList.add('active');
            }, 1000);
        } else {
            console.log('Form validation failed');
            // Find the first invalid step and switch to it
            if (!validateStep1()) {
                console.log('Invalid step 1');
                switchStep(0);
            } else if (!validateStep2()) {
                console.log('Invalid step 2');
                switchStep(1);
            } else if (!validateStep3()) {
                console.log('Invalid step 3');
                switchStep(2);
            } else if (!validateStep4()) {
                console.log('Invalid step 4');
                switchStep(3);
            } else if (!validateStep5()) {
                console.log('Invalid step 5');
                switchStep(4);
            }
        }
    });

    // Chat functionality
    function addMessage(sender, text) {
        const message = document.createElement('div');
        message.classList.add('message', sender);
        message.textContent = text;
        chatMessages.appendChild(message);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        console.log(`Added ${sender} message: ${text}`);
    }

    sendMessageBtn.addEventListener('click', () => {
        console.log('Send message clicked');
        const messageText = chatInput.value.trim();
        if (messageText) {
            addMessage('user', messageText);
            // Simulate chatbot response (replace with API call if available)
            setTimeout(() => {
                addMessage('bot', 'Thanks for your message! How can I help you further?');
            }, 1000);
            chatInput.value = '';
        }
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            console.log('Enter key pressed in chat');
            sendMessageBtn.click();
        }
    });

    closeChatBtn.addEventListener('click', () => {
        console.log('Close chat clicked');
        resetSections();
        chatSection.style.animation = 'fadeOut 1s forwards';
        setTimeout(() => {
            chatSection.style.display = 'none';
            heroSection.style.display = 'flex';
            heroSection.style.animation = 'fadeInUp 1s forwards';
            heroSection.classList.add('active');
            // Reset animations for hero elements
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
            // Clear chat messages
            chatMessages.innerHTML = '';
        }, 1000);
    });

    // Fallback for 3D model
    setTimeout(() => {
        const modelViewer = document.querySelector('model-viewer');
        const poster = document.querySelector('.model-placeholder');
        if (modelViewer && poster) {
            poster.style.display = 'flex';
        }
    }, 5000);
});
