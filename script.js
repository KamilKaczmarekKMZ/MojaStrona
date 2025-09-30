// Import and initialize Hexagonal Grid Background
try {
    import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.16/build/backgrounds/grid1.cdn.min.js')
        .then((module) => {
            const Grid1Background = module.default;
            const canvas = document.getElementById('webgl-canvas');
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
                const width = window.innerWidth;
                const height = window.innerHeight;
                bg.renderer.setSize(width, height);
                bg.camera.aspect = width / height;
                bg.camera.updateProjectionMatrix();
                // Update light positions on window resize
                bg.grid.light1.position.set(width / 2, height / 2, -100);
                bg.grid.light2.position.set(width / 2, height / 2, -100);
            });
        })
        .catch((error) => console.error('Error loading background:', error));
} catch (error) {
    console.error('Error importing module:', error);
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

// Hero section animation on page load
window.addEventListener('load', () => {
    document.querySelector('.hero h1').classList.add('animated-text');
    document.querySelector('.hero h2').classList.add('animated-text');
    document.querySelector('.hero h1').style.animation = 'fadeInUp 1s forwards 0.3s, glowText 1.5s ease-in-out forwards 0.3s';
    document.querySelector('.hero h2').style.animation = 'fadeInUp 1s forwards 0.4s, glowText 1.5s ease-in-out forwards 0.4s';
    document.querySelector('.hero p').style.animation = 'fadeInUp 1s forwards 0.6s';
    document.querySelector('.hero-buttons').style.animation = 'fadeInUp 1s forwards 0.9s';
});

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
    return validateStep1() && validateStep2() && validateStep3() && validateStep4() && validateStep5();
}

// Button handlers
document.addEventListener('DOMContentLoaded', () => {
    const letsBeginBtn = document.getElementById('letsBeginBtn');
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    const backBtn = document.getElementById('backBtn');
    const heroSection = document.getElementById('hero-section');
    const formSection = document.getElementById('form-section');
    const indicators = document.querySelectorAll('.indicator');
    const steps = document.querySelectorAll('.step');
    const prevStepBtn = document.getElementById('prevStepBtn');
    const nextStepBtn = document.getElementById('nextStepBtn');
    const submitBtn = document.getElementById('submitForm');
    let currentStep = 0;

    // Function to switch steps
    function switchStep(newStep) {
        if (newStep >= 0 && newStep < steps.length) {
            steps[currentStep].classList.remove('active');
            indicators[currentStep].classList.remove('active');
            currentStep = newStep;
            steps[currentStep].classList.add('active');
            indicators[currentStep].classList.add('active');
            updateSubmitButton();
        }
    }

    // Function to update Submit button state
    function updateSubmitButton() {
        submitBtn.disabled = !validateAllSteps();
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
        window.location.href = getRandomLink();
    });

    letsBeginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        heroSection.style.animation = 'fadeOut 1s forwards';
        setTimeout(() => {
            heroSection.style.display = 'none';
            formSection.style.display = 'flex';
            formSection.style.animation = 'fadeInUp 1s forwards';
            updateSubmitButton();
        }, 1000);
    });

    backBtn.addEventListener('click', () => {
        formSection.style.animation = 'fadeOut 1s forwards';
        setTimeout(() => {
            formSection.style.display = 'none';
            heroSection.style.display = 'flex';
            heroSection.style.animation = 'fadeInUp 1s forwards';
            // Reset animations for hero elements
            document.querySelector('.hero h1').style.animation = 'none';
            document.querySelector('.hero h2').style.animation = 'none';
            document.querySelector('.hero p').style.animation = 'none';
            document.querySelector('.hero-buttons').style.animation = 'none';
            setTimeout(() => {
                document.querySelector('.hero h1').style.animation = 'fadeInUp 1s forwards 0.3s, glowText 1.5s ease-in-out forwards 0.3s';
                document.querySelector('.hero h2').style.animation = 'fadeInUp 1s forwards 0.4s, glowText 1.5s ease-in-out forwards 0.4s';
                document.querySelector('.hero p').style.animation = 'fadeInUp 1s forwards 0.6s';
                document.querySelector('.hero-buttons').style.animation = 'fadeInUp 1s forwards 0.9s';
            }, 10);
            // Reset form and step
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
            switchStep(index);
        });
    });

    // Visual arrow navigation
    prevStepBtn.addEventListener('click', () => {
        switchStep(currentStep - 1);
    });

    nextStepBtn.addEventListener('click', () => {
        switchStep(currentStep + 1);
    });

    // Keyboard navigation (left/right arrows)
    document.addEventListener('keydown', (e) => {
        if (formSection.style.display !== 'none') {
            if (e.key === 'ArrowLeft') {
                switchStep(currentStep - 1);
            } else if (e.key === 'ArrowRight') {
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
            switchStep(currentStep + 1); // Swipe left -> next step
        } else if (touchEndX - touchStartX > 50) {
            switchStep(currentStep - 1); // Swipe right -> previous step
        }
    });

    // Form submission
    document.getElementById('submitForm').addEventListener('click', () => {
        if (validateAllSteps()) {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const companySize = document.querySelector('input[name="companySize"]:checked')?.value;
            const occupation = document.getElementById('occupation').value;
            const experience = document.querySelector('input[name="experience"]:checked')?.value;
            const receiveEmails = document.querySelector('input[name="receiveEmails"]:checked')?.value;

            console.log({ name, email, companySize, occupation, experience, receiveEmails });
            alert('Form submitted!'); // Can be customized for server-side submission
        } else {
            // Find the first invalid step and switch to it
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
});

// Fallback for 3D model
setTimeout(() => {
    const modelViewer = document.querySelector('model-viewer');
    const poster = document.querySelector('.model-placeholder');
    if (modelViewer && poster) {
        poster.style.display = 'flex';
    }
}, 5000);
