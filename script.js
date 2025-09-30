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
    let currentStep = 0;

    // Function to switch steps
    function switchStep(newStep) {
        if (newStep >= 0 && newStep < steps.length) {
            steps[currentStep].classList.remove('active');
            indicators[currentStep].classList.remove('active');
            currentStep = newStep;
            steps[currentStep].classList.add('active');
            indicators[currentStep].classList.add('active');
        }
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
        });
    });

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
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const companySize = document.querySelector('input[name="companySize"]:checked')?.value;
        const occupation = document.getElementById('occupation').value;
        const experience = document.querySelector('input[name="experience"]:checked')?.value;
        const receiveEmails = document.querySelector('input[name="receiveEmails"]:checked')?.value;

        console.log({ name, email, companySize, occupation, experience, receiveEmails });
        alert('Form submitted!'); // Can be customized for server-side submission
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
