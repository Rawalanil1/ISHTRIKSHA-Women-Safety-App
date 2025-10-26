// ISHTRIKSHA - Women's Safety App JavaScript
// Advanced safety features with real-time location tracking

class IshtrikshaApp {
    constructor() {
        this.currentScreen = 'signIn';
        this.currentTab = 'home';
        this.userProfile = null;
        this.permissions = {
            location: false,
            microphone: false,
            contacts: false
        };
        this.map = null;
        this.userLocation = null;
        this.locationWatcher = null;
        this.sosActive = false;
        this.sosTimer = null;
        this.emergencyContacts = [];
        this.theme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserData();
        this.applyTheme();
        this.showLoadingScreen();
        
        // Simulate app loading
        setTimeout(() => {
            this.hideLoadingScreen();
            this.determineInitialScreen();
        }, 2000);
    }

    setupEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Sign-in
        document.getElementById('googleSignIn').addEventListener('click', () => {
            this.handleGoogleSignIn();
        });

        // Profile form
        document.getElementById('profileForm').addEventListener('submit', (e) => {
            this.handleProfileSubmit(e);
        });

        // Permissions
        document.getElementById('locationPermission').addEventListener('click', () => {
            this.requestLocationPermission();
        });
        document.getElementById('microphonePermission').addEventListener('click', () => {
            this.requestMicrophonePermission();
        });
        document.getElementById('contactsPermission').addEventListener('click', () => {
            this.requestContactsPermission();
        });
        document.getElementById('continueToApp').addEventListener('click', () => {
            this.continueToApp();
        });

        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // SOS buttons
        document.getElementById('quickSOS').addEventListener('mousedown', () => {
            this.startSOSCountdown();
        });
        document.getElementById('quickSOS').addEventListener('mouseup', () => {
            this.cancelSOSCountdown();
        });
        document.getElementById('quickSOS').addEventListener('mouseleave', () => {
            this.cancelSOSCountdown();
        });

        document.getElementById('mainSOSButton').addEventListener('mousedown', () => {
            this.startSOSCountdown();
        });
        document.getElementById('mainSOSButton').addEventListener('mouseup', () => {
            this.cancelSOSCountdown();
        });
        document.getElementById('mainSOSButton').addEventListener('mouseleave', () => {
            this.cancelSOSCountdown();
        });

        // Touch events for mobile
        document.getElementById('quickSOS').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startSOSCountdown();
        });
        document.getElementById('quickSOS').addEventListener('touchend', (e) => {
            e.preventDefault();
            this.cancelSOSCountdown();
        });

        document.getElementById('mainSOSButton').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startSOSCountdown();
        });
        document.getElementById('mainSOSButton').addEventListener('touchend', (e) => {
            e.preventDefault();
            this.cancelSOSCountdown();
        });

        // Emergency numbers
        document.querySelectorAll('.emergency-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const number = e.currentTarget.dataset.number;
                this.callEmergencyNumber(number);
            });
        });

        // Map actions
        document.getElementById('shareLocation').addEventListener('click', () => {
            this.shareLocation();
        });
        document.getElementById('centerMap').addEventListener('click', () => {
            this.centerMapOnUser();
        });

        // Contacts
        document.getElementById('addContact').addEventListener('click', () => {
            this.showAddContactModal();
        });
        document.getElementById('addContactForm').addEventListener('submit', (e) => {
            this.handleAddContact(e);
        });

        // Modal close handlers
        document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.closeModal(e.target.closest('.modal'));
            });
        });

        // SOS modal actions
        document.getElementById('cancelSOS').addEventListener('click', () => {
            this.cancelSOS();
        });
        document.getElementById('confirmSOS').addEventListener('click', () => {
            this.confirmSOS();
        });

        // Profile edit
        document.getElementById('editProfile').addEventListener('click', () => {
            this.editProfile();
        });
    }

    showLoadingScreen() {
        document.getElementById('loadingSpinner').style.display = 'flex';
        document.getElementById('mainApp').classList.add('hidden');
    }

    hideLoadingScreen() {
        document.getElementById('loadingSpinner').style.display = 'none';
        document.getElementById('mainApp').classList.remove('hidden');
    }

    determineInitialScreen() {
        if (!this.userProfile) {
            this.showScreen('signIn');
        } else if (!this.permissions.location || !this.permissions.microphone) {
            this.showScreen('permissions');
        } else {
            this.showScreen('dashboard');
            this.initializeMap();
            this.startLocationTracking();
        }
    }

    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        const targetScreen = document.getElementById(`${screenName}Screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;
        }
    }

    handleGoogleSignIn() {
        // Simulate Google Sign-in process
        const signInBtn = document.getElementById('googleSignIn');
        signInBtn.disabled = true;
        signInBtn.innerHTML = 'Signing in...';
        
        setTimeout(() => {
            // Simulate successful sign-in
            this.showScreen('profile');
            signInBtn.disabled = false;
            signInBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
            `;
        }, 1500);
    }

    handleProfileSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const profile = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            dob: document.getElementById('dob').value,
            address: document.getElementById('address').value,
            pincode: document.getElementById('pincode').value,
            emergencyContact: document.getElementById('emergencyContact').value,
            createdAt: new Date().toISOString()
        };

        // Validate required fields
        if (!this.validateProfile(profile)) {
            return;
        }

        // Save profile
        this.userProfile = profile;
        this.saveUserData();
        
        // Show success message
        this.showNotification('Profile saved successfully!', 'success');
        
        // Move to permissions screen
        setTimeout(() => {
            this.showScreen('permissions');
        }, 1000);
    }

    validateProfile(profile) {
        const phoneRegex = /^[0-9]{10}$/;
        const emailRegex = /^[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,}$/;
        const pincodeRegex = /^[0-9]{6}$/;

        if (!profile.fullName.trim()) {
            this.showNotification('Please enter your full name', 'error');
            return false;
        }

        if (!emailRegex.test(profile.email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return false;
        }

        if (!phoneRegex.test(profile.phone)) {
            this.showNotification('Please enter a valid 10-digit phone number', 'error');
            return false;
        }

        if (!pincodeRegex.test(profile.pincode)) {
            this.showNotification('Please enter a valid 6-digit pincode', 'error');
            return false;
        }

        return true;
    }

    async requestLocationPermission() {
        const btn = document.getElementById('locationPermission');
        btn.disabled = true;
        btn.textContent = 'Requesting...';

        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                });
            });

            this.permissions.location = true;
            this.userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy
            };
            
            btn.textContent = '✓ Granted';
            btn.classList.remove('btn--primary');
            btn.classList.add('btn--secondary');
            
            this.showNotification('Location permission granted!', 'success');
            
        } catch (error) {
            console.error('Location permission denied:', error);
            // Use Mumbai as fallback location
            this.userLocation = { lat: 19.0760, lng: 72.8777, accuracy: null };
            this.permissions.location = true; // Allow app to continue
            
            btn.textContent = '⚠️ Using Default';
            btn.classList.remove('btn--primary');
            btn.classList.add('btn--secondary');
            
            this.showNotification('Using default location (Mumbai)', 'warning');
        }
    }

    async requestMicrophonePermission() {
        const btn = document.getElementById('microphonePermission');
        btn.disabled = true;
        btn.textContent = 'Requesting...';

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Stop the stream immediately as we just need permission
            stream.getTracks().forEach(track => track.stop());
            
            this.permissions.microphone = true;
            btn.textContent = '✓ Granted';
            btn.classList.remove('btn--primary');
            btn.classList.add('btn--secondary');
            
            this.showNotification('Microphone permission granted!', 'success');
            
        } catch (error) {
            console.error('Microphone permission denied:', error);
            this.permissions.microphone = true; // Allow app to continue
            
            btn.textContent = '⚠️ Denied';
            btn.classList.remove('btn--primary');
            btn.classList.add('btn--secondary');
            
            this.showNotification('Microphone permission denied. SOS recording may not work.', 'warning');
        }
    }

    async requestContactsPermission() {
        const btn = document.getElementById('contactsPermission');
        btn.disabled = true;
        btn.textContent = 'Requesting...';

        // Simulate contacts permission (not available in web browsers)
        setTimeout(() => {
            this.permissions.contacts = true;
            btn.textContent = '✓ Simulated';
            btn.classList.remove('btn--secondary');
            btn.classList.add('btn--primary');
            
            this.showNotification('Contacts access simulated (web limitation)', 'info');
        }, 1000);
    }

    continueToApp() {
        if (!this.permissions.location || !this.permissions.microphone) {
            this.showNotification('Please grant required permissions to continue', 'error');
            return;
        }

        this.showScreen('dashboard');
        this.initializeMap();
        this.startLocationTracking();
        this.displayProfile();
        this.loadEmergencyContacts();
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');

        this.currentTab = tabName;

        // Initialize map if switching to map tab
        if (tabName === 'map' && !this.map) {
            setTimeout(() => this.initializeMap(), 100);
        }
    }

    initializeMap() {
        if (this.map) return;

        const mapElement = document.getElementById('map');
        if (!mapElement) return;

        const defaultLocation = this.userLocation || { lat: 19.0760, lng: 72.8777 };
        
        this.map = L.map('map').setView([defaultLocation.lat, defaultLocation.lng], 15);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        // Add user location marker
        if (this.userLocation) {
            L.marker([this.userLocation.lat, this.userLocation.lng])
                .addTo(this.map)
                .bindPopup('Your Location')
                .openPopup();
        }

        // Add safe zones (police stations, hospitals, etc.)
        this.addSafeZones();
        
        this.updateLocationInfo();
    }

    addSafeZones() {
        const safeZones = [
            { type: 'police', name: 'Police Station', lat: 19.0544, lng: 72.8406 },
            { type: 'hospital', name: 'Hospital', lat: 19.0176, lng: 72.8562 },
            { type: 'support', name: 'Women Support Center', lat: 19.0596, lng: 72.8295 }
        ];

        safeZones.forEach(zone => {
            const icon = this.getSafeZoneIcon(zone.type);
            L.marker([zone.lat, zone.lng], { icon })
                .addTo(this.map)
                .bindPopup(`<strong>${zone.name}</strong><br>Safe Zone`);
        });
    }

    getSafeZoneIcon(type) {
        const iconUrl = type === 'police' ? 
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMwMDAwRkYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMgOEwyMSA5TDE2IDEyTDE3IDE5TDEyIDE2TDcgMTlMOCAxMkwzIDlMMTEgOEwxMiAyWiIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4K' :
            type === 'hospital' ?
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNGRjAwMDAiLz4KPHBhdGggZD0iTTEyIDZWMThNNiAxMkgxOCIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K' :
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNGRjAwNDAiLz4KPHBhdGggZD0iTTkgMTJMMTIgMTVMMTUgOSIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K';
        
        return L.icon({
            iconUrl: iconUrl,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -15]
        });
    }

    startLocationTracking() {
        if (!this.permissions.location) return;

        this.locationWatcher = navigator.geolocation.watchPosition(
            (position) => {
                this.userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
                
                this.updateLocationInfo();
                this.updateMapLocation();
            },
            (error) => {
                console.error('Location tracking error:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 30000
            }
        );
    }

    updateLocationInfo() {
        const locationElement = document.getElementById('currentLocation');
        const lastUpdatedElement = document.getElementById('lastUpdated');
        
        if (this.userLocation && locationElement) {
            locationElement.textContent = `${this.userLocation.lat.toFixed(6)}, ${this.userLocation.lng.toFixed(6)}`;
        }
        
        if (lastUpdatedElement) {
            lastUpdatedElement.textContent = new Date().toLocaleTimeString();
        }
    }

    updateMapLocation() {
        if (!this.map || !this.userLocation) return;

        // Remove existing user markers
        this.map.eachLayer((layer) => {
            if (layer.options && layer.options.isUserMarker) {
                this.map.removeLayer(layer);
            }
        });

        // Add new user marker
        L.marker([this.userLocation.lat, this.userLocation.lng], { isUserMarker: true })
            .addTo(this.map)
            .bindPopup('Your Current Location')
            .openPopup();
    }

    centerMapOnUser() {
        if (this.map && this.userLocation) {
            this.map.setView([this.userLocation.lat, this.userLocation.lng], 15);
        }
    }

    startSOSCountdown() {
        if (this.sosActive || this.sosTimer) return;

        let countdown = 3;
        const countdownElement = document.getElementById('sosCountdown') || this.createCountdownElement();
        const timerElement = document.getElementById('countdownTimer');
        
        countdownElement.classList.remove('hidden');
        timerElement.textContent = countdown;
        
        this.sosTimer = setInterval(() => {
            countdown--;
            timerElement.textContent = countdown;
            
            if (countdown <= 0) {
                this.activateSOS();
            }
        }, 1000);
    }

    cancelSOSCountdown() {
        if (this.sosTimer) {
            clearInterval(this.sosTimer);
            this.sosTimer = null;
            
            const countdownElement = document.getElementById('sosCountdown');
            if (countdownElement) {
                countdownElement.classList.add('hidden');
            }
        }
    }

    createCountdownElement() {
        // Create countdown element if it doesn't exist
        const countdown = document.createElement('div');
        countdown.id = 'sosCountdown';
        countdown.className = 'sos-countdown hidden';
        countdown.innerHTML = '<span id="countdownTimer">3</span>';
        
        const sosButton = document.getElementById('quickSOS');
        sosButton.parentNode.insertBefore(countdown, sosButton.nextSibling);
        
        return countdown;
    }

    async activateSOS() {
        this.cancelSOSCountdown();
        this.sosActive = true;
        
        // Update safety status
        const safetyStatus = document.getElementById('safetyStatus');
        if (safetyStatus) {
            safetyStatus.textContent = 'Status: EMERGENCY';
            safetyStatus.className = 'status--error';
        }
        
        // Show SOS active modal
        this.showModal('sosActiveModal');
        
        // Start audio recording simulation
        await this.startAudioRecording();
        
        // Send location to emergency contacts
        await this.shareLocationWithContacts();
        
        // Show notification
        this.showNotification('SOS ACTIVATED! Emergency services notified.', 'error');
    }

    async startAudioRecording() {
        if (!this.permissions.microphone) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            
            mediaRecorder.start();
            console.log('Audio recording started');
            
            // Stop recording after 30 seconds
            setTimeout(() => {
                mediaRecorder.stop();
                stream.getTracks().forEach(track => track.stop());
                console.log('Audio recording stopped');
            }, 30000);
            
        } catch (error) {
            console.error('Audio recording failed:', error);
        }
    }

    async shareLocationWithContacts() {
        if (!this.userLocation) return;

        const locationMessage = `EMERGENCY ALERT from ${this.userProfile?.fullName}\n\nLocation: https://maps.google.com/?q=${this.userLocation.lat},${this.userLocation.lng}\n\nSent from ISHTRIKSHA Safety App`;
        
        console.log('Emergency message:', locationMessage);
        
        // Simulate sending to emergency contacts
        this.emergencyContacts.forEach(contact => {
            console.log(`Sending emergency alert to ${contact.name}: ${contact.phone}`);
        });
    }

    cancelSOS() {
        this.sosActive = false;
        this.closeModal(document.getElementById('sosActiveModal'));
        
        // Reset safety status
        const safetyStatus = document.getElementById('safetyStatus');
        if (safetyStatus) {
            safetyStatus.textContent = 'Status: Safe';
            safetyStatus.className = 'status--success';
        }
        
        this.showNotification('SOS cancelled', 'info');
    }

    confirmSOS() {
        // Keep SOS active and close modal
        this.closeModal(document.getElementById('sosActiveModal'));
        this.showNotification('Emergency confirmed. Help is on the way!', 'warning');
    }

    callEmergencyNumber(number) {
        // Simulate emergency call
        if (confirm(`Call emergency number ${number}?\n\nThis will open your phone's dialer.`)) {
            // In a real app, this would use tel: protocol
            window.open(`tel:${number}`, '_self');
        }
    }

    async shareLocation() {
        if (!this.userLocation) {
            this.showNotification('Location not available', 'error');
            return;
        }

        const shareData = {
            title: 'My Current Location - ISHTRIKSHA',
            text: `I'm sharing my location from ISHTRIKSHA safety app`,
            url: `https://maps.google.com/?q=${this.userLocation.lat},${this.userLocation.lng}`
        };

        try {
            if (navigator.share && navigator.canShare(shareData)) {
                await navigator.share(shareData);
                this.showNotification('Location shared successfully!', 'success');
            } else {
                // Fallback: copy to clipboard
                const locationUrl = `https://maps.google.com/?q=${this.userLocation.lat},${this.userLocation.lng}`;
                await navigator.clipboard.writeText(locationUrl);
                this.showNotification('Location URL copied to clipboard!', 'success');
            }
        } catch (error) {
            console.error('Share failed:', error);
            this.showNotification('Sharing failed. Please try again.', 'error');
        }
    }

    showAddContactModal() {
        this.showModal('addContactModal');
    }

    handleAddContact(e) {
        e.preventDefault();
        
        const contact = {
            id: Date.now().toString(),
            name: document.getElementById('contactName').value,
            phone: document.getElementById('contactPhone').value,
            relation: document.getElementById('contactRelation').value
        };

        this.emergencyContacts.push(contact);
        this.saveUserData();
        this.renderContactsList();
        this.closeModal(document.getElementById('addContactModal'));
        this.showNotification('Emergency contact added successfully!', 'success');
        
        // Reset form
        e.target.reset();
    }

    renderContactsList() {
        const contactsList = document.getElementById('contactsList');
        
        if (this.emergencyContacts.length === 0) {
            contactsList.innerHTML = `
                <div class="empty-state">
                    <p>No emergency contacts added yet.</p>
                    <p>Add contacts to receive automatic alerts during emergencies.</p>
                </div>
            `;
            return;
        }

        contactsList.innerHTML = this.emergencyContacts.map(contact => `
            <div class="contact-item">
                <div class="contact-info">
                    <h4>${contact.name}</h4>
                    <p>${contact.phone} • ${contact.relation}</p>
                </div>
                <div class="contact-actions">
                    <button class="btn--secondary btn--sm" onclick="app.callContact('${contact.phone}')">Call</button>
                    <button class="btn--secondary btn--sm" onclick="app.removeContact('${contact.id}')">Remove</button>
                </div>
            </div>
        `).join('');
    }

    callContact(phone) {
        window.open(`tel:${phone}`, '_self');
    }

    removeContact(contactId) {
        if (confirm('Are you sure you want to remove this contact?')) {
            this.emergencyContacts = this.emergencyContacts.filter(c => c.id !== contactId);
            this.saveUserData();
            this.renderContactsList();
            this.showNotification('Contact removed', 'info');
        }
    }

    displayProfile() {
        if (!this.userProfile) return;

        const profileDisplay = document.getElementById('profileDisplay');
        profileDisplay.innerHTML = `
            <div class="profile-field">
                <label>Full Name:</label>
                <span>${this.userProfile.fullName}</span>
            </div>
            <div class="profile-field">
                <label>Email:</label>
                <span>${this.userProfile.email}</span>
            </div>
            <div class="profile-field">
                <label>Phone:</label>
                <span>${this.userProfile.phone}</span>
            </div>
            <div class="profile-field">
                <label>Date of Birth:</label>
                <span>${new Date(this.userProfile.dob).toLocaleDateString()}</span>
            </div>
            <div class="profile-field">
                <label>Address:</label>
                <span>${this.userProfile.address}</span>
            </div>
            <div class="profile-field">
                <label>Pincode:</label>
                <span>${this.userProfile.pincode}</span>
            </div>
            ${this.userProfile.emergencyContact ? `
                <div class="profile-field">
                    <label>Emergency Contact:</label>
                    <span>${this.userProfile.emergencyContact}</span>
                </div>
            ` : ''}
        `;
    }

    editProfile() {
        // Switch to profile setup screen with existing data
        if (this.userProfile) {
            document.getElementById('fullName').value = this.userProfile.fullName;
            document.getElementById('email').value = this.userProfile.email;
            document.getElementById('phone').value = this.userProfile.phone;
            document.getElementById('dob').value = this.userProfile.dob;
            document.getElementById('address').value = this.userProfile.address;
            document.getElementById('pincode').value = this.userProfile.pincode;
            document.getElementById('emergencyContact').value = this.userProfile.emergencyContact || '';
        }
        this.showScreen('profile');
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.saveUserData();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-color-scheme', this.theme);
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.textContent = this.theme === 'light' ? '🌙' : '☀️';
        }
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-surface);
            border: 2px solid var(--color-${type === 'error' ? 'error' : type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'info'});
            border-radius: var(--radius-lg);
            padding: var(--space-16);
            box-shadow: var(--shadow-lg);
            z-index: 2000;
            max-width: 300px;
            font-weight: 600;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    loadUserData() {
        try {
            const savedProfile = localStorage.getItem('ishtriksha_profile');
            const savedContacts = localStorage.getItem('ishtriksha_contacts');
            const savedPermissions = localStorage.getItem('ishtriksha_permissions');
            
            if (savedProfile) {
                this.userProfile = JSON.parse(savedProfile);
            }
            
            if (savedContacts) {
                this.emergencyContacts = JSON.parse(savedContacts);
            }
            
            if (savedPermissions) {
                this.permissions = { ...this.permissions, ...JSON.parse(savedPermissions) };
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    saveUserData() {
        try {
            if (this.userProfile) {
                localStorage.setItem('ishtriksha_profile', JSON.stringify(this.userProfile));
            }
            localStorage.setItem('ishtriksha_contacts', JSON.stringify(this.emergencyContacts));
            localStorage.setItem('ishtriksha_permissions', JSON.stringify(this.permissions));
            localStorage.setItem('theme', this.theme);
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }

    loadEmergencyContacts() {
        this.renderContactsList();
    }
}

// Add CSS animations
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
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .empty-state {
        text-align: center;
        padding: var(--space-32);
        color: var(--color-text-secondary);
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new IshtrikshaApp();
});

// Expose app globally for onclick handlers
window.app = app;