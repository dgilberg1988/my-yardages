// Golf Club Distance Calculator App
class GolfApp {
    constructor() {
        this.clubs = this.getDefaultClubs();
        this.savedClubs = this.loadSavedClubs();
        this.currentWeather = null;
        
        this.init();
    }

    getDefaultClubs() {
        return [
            { name: 'Driver', emoji: '🏌️', distance: 250, id: 'driver' },
            { name: '3 Wood', emoji: '🪵', distance: 220, id: '3wood' },
            { name: '5 Wood', emoji: '🪵', distance: 200, id: '5wood' },
            { name: '3 Hybrid', emoji: '⚡', distance: 190, id: '3hybrid' },
            { name: '4 Iron', emoji: '⚔️', distance: 180, id: '4iron' },
            { name: '5 Iron', emoji: '⚔️', distance: 170, id: '5iron' },
            { name: '6 Iron', emoji: '⚔️', distance: 160, id: '6iron' },
            { name: '7 Iron', emoji: '⚔️', distance: 150, id: '7iron' },
            { name: '8 Iron', emoji: '⚔️', distance: 140, id: '8iron' },
            { name: '9 Iron', emoji: '⚔️', distance: 130, id: '9iron' },
            { name: 'Pitching Wedge', emoji: '📐', distance: 120, id: 'pw' },
            { name: 'Sand Wedge', emoji: '🏖️', distance: 100, id: 'sw' },
            { name: 'Lob Wedge', emoji: '🎯', distance: 80, id: 'lw' }
        ];
    }

    init() {
        this.renderClubInputs();
        this.setupEventListeners();
        this.initializeWeather();
        
        // Load saved distances if they exist
        if (this.savedClubs) {
            this.loadClubDistances();
            this.updateCalculatorTab();
        }
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // Save clubs button
        document.getElementById('saveClubs').addEventListener('click', () => this.saveClubDistances());

        // Calculate club button
        document.getElementById('calculateClub').addEventListener('click', () => this.calculateRecommendation());

        // Target distance input
        document.getElementById('targetDistance').addEventListener('input', () => this.clearRecommendation());
    }

    renderClubInputs() {
        const container = document.getElementById('clubInputs');
        container.innerHTML = '';

        this.clubs.forEach(club => {
            const clubDiv = document.createElement('div');
            clubDiv.className = 'club-input';
            clubDiv.innerHTML = `
                <div class="club-name">
                    <span class="club-emoji">${club.emoji}</span>
                    ${club.name}
                </div>
                <div class="distance-field">
                    <input type="number" id="${club.id}" value="${club.distance}" min="1" max="400">
                    <span>yds</span>
                </div>
            `;
            container.appendChild(clubDiv);
        });
    }

    switchTab(tabId) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.add('hidden');
        });

        // Remove active class from all tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab
        document.getElementById(tabId).classList.remove('hidden');
        
        // Add active class to clicked button
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // If switching to calculator tab, ensure we have weather data
        if (tabId === 'calculatorTab') {
            this.initializeWeather();
        }
    }

    saveClubDistances() {
        const updatedClubs = this.clubs.map(club => {
            const input = document.getElementById(club.id);
            const distance = parseInt(input.value) || club.distance;
            return { ...club, distance };
        });

        // Update clubs array
        this.clubs = updatedClubs;

        // Save to localStorage
        localStorage.setItem('golfClubDistances', JSON.stringify(updatedClubs));

        // Show success message
        this.showMessage('Club distances saved successfully!', 'success');

        // Enable calculator tab
        this.updateCalculatorTab();
    }

    loadSavedClubs() {
        const saved = localStorage.getItem('golfClubDistances');
        return saved ? JSON.parse(saved) : null;
    }

    loadClubDistances() {
        this.savedClubs.forEach(savedClub => {
            const clubIndex = this.clubs.findIndex(club => club.id === savedClub.id);
            if (clubIndex !== -1) {
                this.clubs[clubIndex].distance = savedClub.distance;
                const input = document.getElementById(savedClub.id);
                if (input) {
                    input.value = savedClub.distance;
                }
            }
        });
    }

    initializeWeather() {
        this.setDefaultWeather();
    }

    async fetchWeatherData(lat, lon) {
        try {
            // Using a free weather API (OpenWeatherMap requires API key)
            // For demo purposes, we'll simulate weather data
            setTimeout(() => {
                this.currentWeather = {
                    windSpeed: Math.floor(Math.random() * 15) + 2, // 2-17 mph
                    windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
                    temperature: Math.floor(Math.random() * 40) + 50 // 50-90°F
                };
                this.updateWeatherDisplay();
            }, 1500);
        } catch (error) {
            console.error('Weather fetch failed:', error);
            this.setDefaultWeather();
        }
    }

    handleLocationError(error) {
        console.warn('Location access denied:', error);
        this.setDefaultWeather();
    }

    setDefaultWeather() {
        this.currentWeather = {
            windSpeed: 7,
            windDirection: 'W',
            temperature: 68
        };
        this.updateWeatherDisplay();
    }

    updateWeatherDisplay() {
        const windInfo = document.getElementById('windInfo');
        const tempInfo = document.getElementById('tempInfo');

        if (this.currentWeather) {
            windInfo.innerHTML = `
                <div class="wind-display">
                    <span class="wind-speed">${this.currentWeather.windSpeed} mph</span>
                    <span class="wind-direction">${this.currentWeather.windDirection}</span>
                </div>
            `;
            tempInfo.textContent = `${this.currentWeather.temperature}°F`;
        }
    }

    calculateRecommendation() {
        const targetDistance = parseInt(document.getElementById('targetDistance').value);
        
        if (!targetDistance || targetDistance < 1) {
            this.showMessage('Please enter a valid target distance', 'error');
            return;
        }

        // Find the best club match
        const recommendation = this.findBestClub(targetDistance);
        this.displayRecommendation(recommendation, targetDistance);
    }

    findBestClub(targetDistance) {
        // Adjust for weather conditions
        const adjustedTarget = this.adjustForWeather(targetDistance);
        
        // Find closest club distance
        let bestClub = this.clubs[0];
        let smallestDiff = Math.abs(bestClub.distance - adjustedTarget);

        this.clubs.forEach(club => {
            const diff = Math.abs(club.distance - adjustedTarget);
            if (diff < smallestDiff) {
                smallestDiff = diff;
                bestClub = club;
            }
        });

        return {
            club: bestClub,
            adjustedTarget,
            originalTarget: targetDistance,
            difference: smallestDiff,
            adjustment: adjustedTarget - targetDistance
        };
    }

    adjustForWeather(distance) {
        if (!this.currentWeather) return distance;

        let adjusted = distance;

        // Temperature adjustment (rule of thumb: 2 yards per 10°F above/below 70°F)
        const tempDiff = this.currentWeather.temperature - 70;
        const tempAdjustment = (tempDiff / 10) * 2;
        adjusted += tempAdjustment;

        // Wind adjustment (headwind adds distance, tailwind reduces needed distance)
        // Simplified: assume headwind for now
        const windAdjustment = this.currentWeather.windSpeed * 0.5;
        adjusted += windAdjustment;

        return Math.round(adjusted);
    }

    displayRecommendation(recommendation, targetDistance) {
        const recommendationCard = document.getElementById('recommendation');
        
        // Create wind adjustment note
        let adjustmentNote = '';
        if (recommendation.adjustment !== 0) {
            const adjustmentType = recommendation.adjustment > 0 ? 'longer' : 'shorter';
            const adjustmentAmount = Math.abs(recommendation.adjustment);
            adjustmentNote = `
                <div class="adjustment-note">
                    📊 Adjusted for conditions: ${adjustmentAmount} yards ${adjustmentType}
                    <br>Wind: ${this.currentWeather.windSpeed}mph ${this.currentWeather.windDirection} • Temp: ${this.currentWeather.temperature}°F
                </div>
            `;
        }

        // Determine swing adjustment
        let swingNote = '';
        const clubDistance = recommendation.club.distance;
        const distanceDiff = targetDistance - clubDistance;
        
        if (Math.abs(distanceDiff) > 5) {
            if (distanceDiff > 0) {
                swingNote = `<div class="club-details">💪 Swing ${Math.abs(distanceDiff)} yards harder than normal</div>`;
            } else {
                swingNote = `<div class="club-details">🎯 Take ${Math.abs(distanceDiff)} yards off your swing</div>`;
            }
        } else {
            swingNote = `<div class="club-details">✅ Normal swing should be perfect</div>`;
        }

        recommendationCard.innerHTML = `
            <h3>Recommended Club</h3>
            <div class="recommended-club">
                <span class="club-emoji">${recommendation.club.emoji}</span>
                ${recommendation.club.name}
            </div>
            ${swingNote}
            ${adjustmentNote}
        `;

        recommendationCard.classList.remove('hidden');
    }

    clearRecommendation() {
        document.getElementById('recommendation').classList.add('hidden');
    }

    updateCalculatorTab() {
        // Enable calculator functionality once clubs are saved
        const calculateButton = document.getElementById('calculateClub');
        calculateButton.disabled = false;
    }

    showMessage(text, type = 'success') {
        // Remove existing messages
        const existingMessage = document.querySelector('.success-message, .error-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const message = document.createElement('div');
        message.className = type === 'success' ? 'success-message' : 'error-message';
        message.textContent = text;

        // Insert after save button
        const saveButton = document.getElementById('saveClubs');
        saveButton.parentNode.insertBefore(message, saveButton.nextSibling);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GolfApp();
});

// Add some CSS for the wind display via JavaScript
const style = document.createElement('style');
style.textContent = `
    .wind-display {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        font-weight: 600;
    }

    .wind-speed {
        color: var(--text-primary);
    }

    .wind-direction {
        color: var(--airbnb-red);
        font-weight: 700;
    }
`;
document.head.appendChild(style);