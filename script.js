import * as THREE from "three";

// === TWOJE UTWORY MP3 ===
const twojUtwor = "https://raw.githubusercontent.com/KamilKaczmarekKMZ/MojaStrona/main/Umbrela.mp3";

// === DANE PŁYT Z TWOIMI OKŁADKAMI ===
const albumsData = [
    {
        cover: 'https://raw.githubusercontent.com/KamilKaczmarekKMZ/MojaStrona/main/Afro%20House%20Cover.png',
        print: 'http://assets.teamrock.com/image/14d29742-c6f7-43f6-bbe1-6bf7b3b34c6f?w=800',
        neonColor: { r: 0, g: 150, b: 255 },
        vizColor: { r: 0.2, g: 0.5, b: 0.9 },
        audioUrl: twojUtwor,
        title: "Afro House",
        artist: "Twoja Muzyka"
    },
    {
        cover: 'https://raw.githubusercontent.com/KamilKaczmarekKMZ/MojaStrona/main/Hip%20Hop%20Cover.png',
        print: 'http://assets.teamrock.com/image/14d29742-c6f7-43f6-bbe1-6bf7b3b34c6f?w=800',
        neonColor: { r: 156, g: 0, b: 255 },
        vizColor: { r: 0.6, g: 0.2, b: 0.9 },
        audioUrl: twojUtwor,
        title: "Hip Hop",
        artist: "Twoja Muzyka"
    },
    {
        cover: 'https://raw.githubusercontent.com/KamilKaczmarekKMZ/MojaStrona/main/Pop%20cover.png',
        print: 'http://assets.teamrock.com/image/14d29742-c6f7-43f6-bbe1-6bf7b3b34c6f?w=800',
        neonColor: { r: 0, g: 200, b: 100 },
        vizColor: { r: 0.2, g: 0.8, b: 0.4 },
        audioUrl: twojUtwor,
        title: "Pop",
        artist: "Twoja Muzyka"
    }
];

// === KARUZELA 3D ===
const carousel = document.getElementById('carousel3d');
const quantity = albumsData.length;
carousel.style.setProperty('--quantity', quantity);

let currentRotation = 0;
let currentCardIndex = 1;
let cards = [];
let isTransitioning = false;

// Audio context dla wizualizatora
let audioCtx = null;
let analyser = null;
let dataArray = null;
let currentAudio = null;
let currentAlbumCard = null;
let isSeeking = false;

// Zmienne do sterowania animacją obrotu
let isVinylSpinning = false;
let rotationAnimation = null;
let currentRotationDeg = 0;
let lastTimestamp = 0;

// Elementy odtwarzacza
const player = document.getElementById('player');
const playerPlayBtn = document.getElementById('playerPlayBtn');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const progressFill = document.getElementById('progressFill');
const progressWrapper = document.getElementById('progressWrapper');
const currentTimeSpan = document.getElementById('currentTime');
const durationTimeSpan = document.getElementById('durationTime');

let updateInterval = null;

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updateProgressBar() {
    if (!currentAudio || !currentAlbumCard) return;
    if (currentAudio.duration && !isNaN(currentAudio.duration)) {
        const percent = (currentAudio.currentTime / currentAudio.duration) * 100;
        progressFill.style.width = `${percent}%`;
        currentTimeSpan.textContent = formatTime(currentAudio.currentTime);
        durationTimeSpan.textContent = formatTime(currentAudio.duration);
    }
}

function startProgressUpdates() {
    if (updateInterval) clearInterval(updateInterval);
    updateInterval = setInterval(() => {
        if (currentAudio && currentAlbumCard) {
            updateProgressBar();
        }
    }, 100);
}

function stopProgressUpdates() {
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
}

function showPlayer(title, artist) {
    playerTitle.textContent = title;
    playerArtist.textContent = artist;
    progressFill.style.width = '0%';
    currentTimeSpan.textContent = '0:00';
    durationTimeSpan.textContent = '0:00';
    player.classList.add('visible');
    startProgressUpdates();
}

function hidePlayer() {
    player.classList.remove('visible');
    stopProgressUpdates();
}

// Funkcje do sterowania obrotem winyla
function startVinylSpinning(vinylElement) {
    if (rotationAnimation) cancelAnimationFrame(rotationAnimation);
    lastTimestamp = 0;
    
    function animateSpin(timestamp) {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const delta = Math.min(0.033, (timestamp - lastTimestamp) / 1000);
        lastTimestamp = timestamp;
        
        if (isVinylSpinning && vinylElement) {
            currentRotationDeg += 72 * delta;
            currentRotationDeg = currentRotationDeg % 360;
            vinylElement.style.transform = `translate(-50%, -50%) rotate(${currentRotationDeg}deg)`;
        }
        rotationAnimation = requestAnimationFrame(animateSpin);
    }
    rotationAnimation = requestAnimationFrame(animateSpin);
}

function stopVinylSpinning() {
    if (rotationAnimation) {
        cancelAnimationFrame(rotationAnimation);
        rotationAnimation = null;
    }
}

function resetVinylRotation(vinylElement) {
    currentRotationDeg = 0;
    if (vinylElement) {
        vinylElement.style.transform = `translate(-50%, -50%) rotate(0deg)`;
    }
}

function stopAllAudioAndReset() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    if (currentAlbumCard) {
        currentAlbumCard.isPlaying = false;
        currentAlbumCard.updateVisualState();
        currentAlbumCard = null;
    }
    isVinylSpinning = false;
    stopVinylSpinning();
    hidePlayer();
    playerPlayBtn.textContent = '▶';
}

// Pauza / Resume z poziomu odtwarzacza
function togglePlayPause() {
    if (!currentAudio || !currentAlbumCard) return;
    
    if (currentAudio.paused) {
        currentAudio.play();
        playerPlayBtn.textContent = '⏸';
        isVinylSpinning = true;
    } else {
        currentAudio.pause();
        playerPlayBtn.textContent = '▶';
        isVinylSpinning = false;
    }
}

playerPlayBtn.addEventListener('click', togglePlayPause);

function generateCarousel() {
    carousel.innerHTML = '';
    cards = [];
    
    albumsData.forEach((data, idx) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.setProperty('--index', idx);
        
        card.innerHTML = `
            <div class="album-card" data-index="${idx}">
                <div class="neon-glow" style="box-shadow: 
                    0 0 20px 5px rgba(${data.neonColor.r}, ${data.neonColor.g}, ${data.neonColor.b}, 0.6),
                    0 0 40px 15px rgba(${data.neonColor.r}, ${data.neonColor.g}, ${data.neonColor.b}, 0.4),
                    0 0 80px 25px rgba(${data.neonColor.r}, ${data.neonColor.g}, ${data.neonColor.b}, 0.2),
                    inset 0 0 15px 3px rgba(${data.neonColor.r}, ${data.neonColor.g}, ${data.neonColor.b}, 0.5);"></div>
                <div class="cover" style="background-image: url('${data.cover}');"></div>
                <div class="vinyl">
                    <div class="print" style="background-image: url('${data.print}');"></div>
                    <div class="vinyl-label"><span>${data.title.substring(0, 10)}</span></div>
                </div>
                <button class="playBtn">▶</button>
            </div>
        `;
        
        carousel.appendChild(card);
        cards.push(card);
    });
    
    updateCarouselRotation();
    updateActiveCard();
    initRotation();
}

const anglePerCard = 360 / quantity;

// NASTĘPNA PŁYTA (→) - idzie w prawo
function nextCard() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentRotation += anglePerCard;
    carousel.style.transform = `perspective(1000px) rotateX(0deg) rotateY(${currentRotation}deg)`;
    setTimeout(() => {
        updateActiveCard();
        updateVisualizerColor();
        isTransitioning = false;
    }, 600);
}

// POPRZEDNIA PŁYTA (←) - idzie w lewo
function prevCard() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentRotation -= anglePerCard;
    carousel.style.transform = `perspective(1000px) rotateX(0deg) rotateY(${currentRotation}deg)`;
    setTimeout(() => {
        updateActiveCard();
        updateVisualizerColor();
        isTransitioning = false;
    }, 600);
}

function updateCarouselRotation() {
    carousel.style.transform = `perspective(1000px) rotateX(0deg) rotateY(${currentRotation}deg)`;
}

function updateActiveCard() {
    const rawAngle = (-currentRotation) % 360;
    let angle = rawAngle < 0 ? rawAngle + 360 : rawAngle;
    
    let bestIdx = 0;
    let bestDiff = 360;
    
    for (let i = 0; i < quantity; i++) {
        const cardAngle = (i * anglePerCard) % 360;
        let diff = Math.abs(cardAngle - angle);
        if (diff > 180) diff = 360 - diff;
        if (diff < bestDiff) {
            bestDiff = diff;
            bestIdx = i;
        }
    }
    
    currentCardIndex = bestIdx;
    
    cards.forEach((card, idx) => {
        card.classList.remove('active');
        if (idx === bestIdx) {
            card.classList.add('active');
        }
    });
}

function updateVisualizerColor() {
    if (!visualizerMaterial) return;
    const color = albumsData[currentCardIndex].vizColor;
    visualizerMaterial.uniforms.activeColor.value = new THREE.Vector3(color.r, color.g, color.b);
}

function initRotation() {
    cards.forEach((card, idx) => {
        const albumCard = card.querySelector('.album-card');
        const playBtn = card.querySelector('.playBtn');
        const cover = card.querySelector('.cover');
        const vinyl = card.querySelector('.vinyl');
        const trackData = albumsData[idx];
        
        albumCard.isPlaying = false;
        albumCard.updateVisualState = function() {
            if (albumCard.isPlaying) {
                cover.classList.add('hidden');
                vinyl.classList.add('visible');
                playBtn.classList.add('playing');
                playBtn.textContent = '⏹';
                isVinylSpinning = true;
                startVinylSpinning(vinyl);
            } else {
                cover.classList.remove('hidden');
                vinyl.classList.remove('visible');
                playBtn.classList.remove('playing');
                playBtn.textContent = '▶';
                isVinylSpinning = false;
                stopVinylSpinning();
                resetVinylRotation(vinyl);
            }
        };
        
        playBtn.addEventListener('click', async function(e) {
            e.stopPropagation();
            
            if (!albumCard.isPlaying) {
                // STOP wszystkie inne
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio = null;
                }
                if (currentAlbumCard) {
                    currentAlbumCard.isPlaying = false;
                    currentAlbumCard.updateVisualState();
                    currentAlbumCard = null;
                }
                isVinylSpinning = false;
                stopVinylSpinning();
                hidePlayer();
                
                if (!audioCtx) {
                    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    analyser = audioCtx.createAnalyser();
                    analyser.fftSize = 256;
                    dataArray = new Uint8Array(analyser.frequencyBinCount);
                }
                
                try {
                    if (audioCtx.state === 'suspended') {
                        await audioCtx.resume();
                    }
                    
                    const audio = new Audio();
                    audio.crossOrigin = "anonymous";
                    audio.preload = "auto";
                    audio.src = trackData.audioUrl;
                    audio.loop = false;
                    
                    const source = audioCtx.createMediaElementSource(audio);
                    source.connect(analyser);
                    analyser.connect(audioCtx.destination);
                    
                    await audio.play();
                    
                    currentAudio = audio;
                    currentAlbumCard = albumCard;
                    albumCard.isPlaying = true;
                    albumCard.updateVisualState();
                    albumCard.audio = audio;
                    
                    showPlayer(trackData.title, trackData.artist);
                    playerPlayBtn.textContent = '⏸';
                    
                    audio.addEventListener('ended', () => {
                        if (currentAlbumCard === albumCard) {
                            stopAllAudioAndReset();
                        }
                    });
                    
                    audio.addEventListener('loadedmetadata', () => {
                        durationTimeSpan.textContent = formatTime(audio.duration);
                    });
                    
                    audio.addEventListener('timeupdate', () => {
                        if (currentAlbumCard === albumCard && !isSeeking) {
                            const percent = (audio.currentTime / audio.duration) * 100;
                            progressFill.style.width = `${percent}%`;
                            currentTimeSpan.textContent = formatTime(audio.currentTime);
                        }
                    });
                    
                } catch(err) {
                    console.error("Playback error:", err);
                    alert("Nie można odtworzyć utworu. Błąd: " + err.message);
                }
            } else {
                // STOP - zatrzymaj i zresetuj
                if (albumCard.audio) {
                    albumCard.audio.pause();
                    albumCard.audio.currentTime = 0;
                    albumCard.audio = null;
                }
                albumCard.isPlaying = false;
                albumCard.updateVisualState();
                if (currentAlbumCard === albumCard) {
                    currentAlbumCard = null;
                    currentAudio = null;
                    hidePlayer();
                    playerPlayBtn.textContent = '▶';
                }
                isVinylSpinning = false;
                stopVinylSpinning();
            }
        });
        
        albumCard.updateVisualState();
    });
}

// === Obsługa przeciągania paska postępu ===
let isDragging = false;

progressWrapper.addEventListener('mousedown', (e) => {
    if (!currentAudio || !currentAlbumCard) return;
    isDragging = true;
    isSeeking = true;
    const rect = progressWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.min(100, Math.max(0, (x / rect.width) * 100));
    progressFill.style.width = `${percent}%`;
    const newTime = (percent / 100) * currentAudio.duration;
    currentAudio.currentTime = newTime;
    currentTimeSpan.textContent = formatTime(newTime);
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging || !currentAudio) return;
    const rect = progressWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.min(100, Math.max(0, (x / rect.width) * 100));
    progressFill.style.width = `${percent}%`;
    const newTime = (percent / 100) * currentAudio.duration;
    currentAudio.currentTime = newTime;
    currentTimeSpan.textContent = formatTime(newTime);
});

window.addEventListener('mouseup', () => {
    isDragging = false;
    isSeeking = false;
});

// === WIZUALIZATOR ===
let visualizerMaterial;
let bassEnergy = 0;
let transitionVal = 0;
let timeVal = 0;

const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform vec2 iResolution;
uniform float iTime;
uniform float bassEnergy;
uniform float transitionFactor;
uniform vec3 activeColor;

varying vec2 vUv;

float smootherstep(float edge0, float edge1, float x) {
    float t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void main() {
    vec2 p = vUv;
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(p, center);
    
    float pulse = 0.5 + bassEnergy * 0.8 * transitionFactor;
    float glowSize = 0.3 + bassEnergy * 0.25 * transitionFactor;
    
    float glow = 1.0 - smootherstep(glowSize - 0.15, glowSize + 0.15, dist);
    glow = pow(glow, 1.5) * pulse;
    
    float wave1 = sin(dist * 20.0 - iTime * 2.0) * 0.1;
    float wave2 = sin(dist * 35.0 + iTime * 1.5) * 0.07;
    float wave = (wave1 + wave2) * bassEnergy * transitionFactor;
    
    vec3 bgColor = vec3(0.03, 0.03, 0.08);
    vec3 glowColor = activeColor;
    
    float noise = fract(sin(p.x * 200.0 + p.y * 100.0 + iTime * 10.0) * 43758.5453);
    noise = noise * 0.05;
    
    vec3 finalColor = bgColor + glowColor * glow * 0.6 + glowColor * wave * 0.3 + noise;
    float vignette = 1.0 - dist * 0.5;
    finalColor *= vignette;
    
    gl_FragColor = vec4(finalColor, 0.9);
}
`;

function initVisualizer() {
    const canvas = document.getElementById('visualizer-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    camera.position.z = 1;
    
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    visualizerMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
            iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            iTime: { value: 0 },
            bassEnergy: { value: 0 },
            transitionFactor: { value: 0 },
            activeColor: { value: new THREE.Vector3(0.2, 0.5, 0.9) }
        },
        transparent: true
    });
    
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, visualizerMaterial);
    scene.add(mesh);
    
    function animateVisualizer() {
        requestAnimationFrame(animateVisualizer);
        timeVal += 0.016;
        visualizerMaterial.uniforms.iTime.value = timeVal;
        
        let anyPlaying = false;
        let energy = 0;
        cards.forEach(card => {
            const albumCard = card.querySelector('.album-card');
            if (albumCard.isPlaying) {
                anyPlaying = true;
                energy = 0.5 + Math.sin(timeVal * 10) * 0.3;
            }
        });
        
        if (anyPlaying && transitionVal < 1.0) {
            transitionVal = Math.min(transitionVal + 0.02, 1.0);
            visualizerMaterial.uniforms.transitionFactor.value = transitionVal;
        } else if (!anyPlaying && transitionVal > 0.0) {
            transitionVal = Math.max(transitionVal - 0.02, 0.0);
            visualizerMaterial.uniforms.transitionFactor.value = transitionVal;
        }
        
        if (anyPlaying && analyser && dataArray && currentAudio && !currentAudio.paused) {
            try {
                analyser.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < 20; i++) {
                    sum += dataArray[i];
                }
                energy = sum / (20 * 255);
                bassEnergy = bassEnergy * 0.7 + energy * 0.3;
            } catch(e) {}
        } else if (anyPlaying) {
            bassEnergy = bassEnergy * 0.8 + 0.3 * 0.2;
        } else {
            bassEnergy = bassEnergy * 0.95;
        }
        
        visualizerMaterial.uniforms.bassEnergy.value = bassEnergy;
        renderer.render(scene, camera);
    }
    
    animateVisualizer();
    
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        visualizerMaterial.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
    });
}

// === START ===
document.getElementById('prevBtn').addEventListener('click', () => prevCard());
document.getElementById('nextBtn').addEventListener('click', () => nextCard());

generateCarousel();
initVisualizer();

setTimeout(() => updateVisualizerColor(), 100);
