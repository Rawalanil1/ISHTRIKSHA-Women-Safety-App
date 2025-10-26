// RAKSHA - Women's Safety App
class RakshaApp {
    constructor() {
        this.currentScreen = 'homeScreen';
        this.sosTimeout = 5;
        this.isEmergencyActive = false;
        this.countdownTimer = null;
        this.emergencySession = null;
        this.initialized = false;
        
        // Sample data from the provided JSON
        this.appData = {
            user: {
                name: "Priya Sharma",
                phone: "+919876543200",
                email: "priya.sharma@example.com",
                pin_code: "110001",
                verified: true
            },
            contacts: [
                {
                    id: "1",
                    name: "Mom",
                    phone: "+919876543210",
                    relationship: "Mother",
                    priority: 1,
                    verified: true,
                    notification_method: "call_and_sms"
                },
                {
                    id: "2",
                    name: "Brother",
                    phone: "+919876543211",
                    relationship: "Brother",
                    priority: 2,
                    verified: true,
                    notification_method: "call_only"
                },
                {
                    id: "3",
                    name: "Best Friend",
                    phone: "+919876543212",
                    relationship: "Friend",
                    priority: 3,
                    verified: false,
                    notification_method: "call_and_sms"
                }
            ],
            sessions: [
                {
                    id: "sess001",
                    timestamp: "2025-09-06T22:30:00+05:30",
                    location: {
                        latitude: 28.6315,
                        longitude: 77.2167,
                        address: "Connaught Place, New Delhi"
                    },
                    status: "completed",
                    contacts_alerted: 3,
                    police_called: "011-23341520",
                    session_duration: "00:05:23",
                    pinned: false
                },
                {
                    id: "sess002",
                    timestamp: "2025-09-05T18:45:00+05:30",
                    location: {
                        latitude: 12.9716,
                        longitude: 77.5946,
                        address: "Bangalore, Karnataka"
                    },
                    status: "cancelled",
                    contacts_alerted: 2,
                    police_called: null,
                    session_duration: "00:01:12",
                    pinned: true
                }
            ],
            policeStations: [
                {
                    id: "dl001",
                    name: "Connaught Place Police Station",
                    address: "Parliament Street, Connaught Place, New Delhi",
                    pin_code: "110001",
                    phone: "011-23341520",
                    district: "New Delhi",
                    state: "Delhi"
                },
                {
                    id: "mh001",
                    name: "Colaba Police Station",
                    address: "Colaba Causeway, Mumbai",
                    pin_code: "400001",
                    phone: "022-22820444",
                    district: "Mumbai City",
                    state: "Maharashtra"
                },
                {
                    id: "ka001",
                    name: "Cubbon Park Police Station",
                    address: "Kasturba Road, Bangalore",
                    pin_code: "560001",
                    phone: "080-22942429",
                    district: "Bangalore Urban",
                    state: "Karnataka"
                },
                {
                    id: "tn001",
                    name: "Egmore Police Station",
                    address: "Egmore, Chennai",
                    pin_code: "600008",
                    phone: "044-28190460",
                    district: "Chennai",
                    state: "Tamil Nadu"
                },
                {
                    id: "wb001",
                    name: "Park Street Police Station",
                    address: "Park Street, Kolkata",
                    pin_code: "700016",
                    phone: "033-22497651",
                    district: "Kolkata",
                    state: "West Bengal"
                }
            ],
            settings: {
                audio_recording_enabled: false,
                sos_confirmation_timeout: 5,
                location_sharing_enabled: true,
                data_retention_days: 30
            }
        };
    }

    init() {
        if (this.initialized) return;
        
        try {
            this.loadStoredData();
            this.hideAllModals(); // Ensure all modals are hidden at startup
            this.showSplashScreen();
            this.setupEventListeners();
            this.updateUI();
            this.initialized = true;
        } catch (error) {
            console.error('Error initializing app:', error);
            this.hideSplashScreen();
        }
    }

    hideAllModals() {
        // Hide all modals at startup
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.add('hidden');
        });
    }

    loadStoredData() {
        try {
            const stored = localStorage.getItem('rakshaData');
            if (stored) {
                const parsedData = JSON.parse(stored);
                this.appData = Object.assign({}, this.appData, parsedData);
            }
        } catch (error) {
            console.error('Error loading stored data:', error);
        }
    }

    saveData() {
        try {
            localStorage.setItem('rakshaData', JSON.stringify(this.appData));
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    showSplashScreen() {
        const splashElement = document.getElementById('splash');
        theApp: {
            const appElement = document.getElementById('app');
            if (splashElement && appElement) {
                setTimeout(() => this.hideSplashScreen(), 2000);
            } else {
                this.hideSplashScreen();
            }
        }
    }

    hideSplashScreen() {
        const splashElement = document.getElementById('splash');
        const appElement = document.getElementById('app');
        
        if (splashElement) splashElement.style.display = 'none';
        if (appElement) {
            appElement.classList.remove('hidden');
            appElement.style.display = 'flex';
        }
    }

    setupEventListeners() {
        // Navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const screen = e.currentTarget.dataset.screen;
                if (screen) this.navigateToScreen(screen);
            });
        });

        // SOS Button
        const sosButton = document.getElementById('sosButton');
        if (sosButton) {
            sosButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.triggerSOS();
            });
        }

        // Quick Actions
        const actionCards = document.querySelectorAll('.action-card');
        actionCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const action = e.currentTarget.dataset.action;
                if (action) this.handleQuickAction(action);
            });
        });

        // Contact Management
        const addContactBtn = document.getElementById('addContactBtn');
        if (addContactBtn) {
            addContactBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openContactModal();
            });
        }

        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveContact();
            });
        }

        const closeContactModal = document.getElementById('closeContactModal');
        if (closeContactModal) {
            closeContactModal.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeContactModal();
            });
        }

        const cancelContact = document.getElementById('cancelContact');
        if (cancelContact) {
            cancelContact.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeContactModal();
            });
        }

        // SOS Modal
        const cancelSos = document.getElementById('cancelSos');
        if (cancelSos) {
            cancelSos.addEventListener('click', (e) => {
                e.preventDefault();
                this.cancelSOS();
            });
        }

        // Settings
        const sosTimeout = document.getElementById('sosTimeout');
        if (sosTimeout) {
            sosTimeout.addEventListener('change', (e) => {
                this.appData.settings.sos_confirmation_timeout = parseInt(e.target.value);
                this.sosTimeout = parseInt(e.target.value);
                this.saveData();
            });
        }

        const audioRecording = document.getElementById('audioRecording');
        if (audioRecording) {
            audioRecording.addEventListener('change', (e) => {
                this.appData.settings.audio_recording_enabled = e.target.checked;
                this.saveData();
            });
        }

        const locationSharing = document.getElementById('locationSharing');
        if (locationSharing) {
            locationSharing.addEventListener('change', (e) => {
                this.appData.settings.location_sharing_enabled = e.target.checked;
                this.saveData();
                this.updateLocationStatus();
            });
        }

        const dataRetention = document.getElementById('dataRetention');
        if (dataRetention) {
            dataRetention.addEventListener('change', (e) => {
                this.appData.settings.data_retention_days = parseInt(e.target.value);
                this.saveData();
            });
        }

        // Police Station Lookup
        const lookupBtn = document.getElementById('lookupBtn');
        if (lookupBtn) {
            lookupBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.lookupPoliceStations();
            });
        }

        const pinCode = document.getElementById('pinCode');
        if (pinCode) {
            pinCode.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.lookupPoliceStations();
                }
            });
        }

        // Emergency Banner
        const stopEmergency = document.getElementById('stopEmergency');
        if (stopEmergency) {
            stopEmergency.addEventListener('click', (e) => {
                e.preventDefault();
                this.stopEmergency();
            });
        }

        // Success Modal
        const closeSuccess = document.getElementById('closeSuccess');
        if (closeSuccess) {
            closeSuccess.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeSuccessModal();
            });
        }

        // Modal overlays
        const modalOverlays = document.querySelectorAll('.modal-overlay');
        modalOverlays.forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) overlay.parentElement.classList.add('hidden');
            });
        });
    }

    navigateToScreen(screenId) {
        if (!screenId) return;
        
        // Update navigation state
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        const activeNavItem = document.querySelector('[data-screen="' + screenId + '"]');
        if (activeNavItem) activeNavItem.classList.add('active');

        // Show screen
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) targetScreen.classList.add('active');

        this.currentScreen = screenId;

        // Update screen-specific content
        if (screenId === 'contactsScreen') {
            this.renderContacts();
        } else if (screenId === 'historyScreen') {
            this.renderHistory();
        }
    }

    handleQuickAction(action) {
        switch (action) {
            case 'location': this.shareLocation(); break;
            case 'contacts': this.navigateToScreen('contactsScreen'); break;
            case 'history': this.navigateToScreen('historyScreen'); break;
            case 'test': this.testAlert(); break;
        }
    }

    triggerSOS() {
        if (this.isEmergencyActive) return;
        if (this.sosTimeout > 0) this.showSOSCountdown();
        else this.executeEmergency();
    }

    showSOSCountdown() {
        const modal = document.getElementById('sosModal');
        const countdownEl = document.getElementById('countdownNumber');
        
        if (modal && countdownEl) {
            modal.classList.remove('hidden');
            let timeLeft = this.sosTimeout;
            countdownEl.textContent = timeLeft;

            this.countdownTimer = setInterval(() => {
                timeLeft--;
                countdownEl.textContent = timeLeft;
                if (timeLeft <= 0) {
                    clearInterval(this.countdownTimer);
                    modal.classList.add('hidden');
                    this.executeEmergency();
                }
            }, 1000);
        }
    }

    cancelSOS() {
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
            this.countdownTimer = null;
        }
        const modal = document.getElementById('sosModal');
        if (modal) modal.classList.add('hidden');
    }

    executeEmergency() {
        this.isEmergencyActive = true;
        
        const sessionId = 'sess' + Date.now();
        const timestamp = new Date().toISOString();
        
        // Simulate location detection
        const location = {
            latitude: 28.6315 + (Math.random() - 0.5) * 0.01,
            longitude: 77.2167 + (Math.random() - 0.5) * 0.01,
            address: "Current Location, New Delhi"
        };

        this.emergencySession = {
            id: sessionId,
            timestamp,
            location,
            status: 'active',
            contacts_alerted: this.appData.contacts.length,
            police_called: "100",
            session_duration: "00:00:00"
        };

        this.showEmergencyBanner();
        this.simulateEmergencyActions();

        setTimeout(() => {
            this.showSuccessModal(
                'Emergency Alert Sent!',
                'Emergency contacts notified. Session ID: ' + sessionId + '. Location shared with authorities.'
            );
        }, 2500);
    }

    simulateEmergencyActions() {
        setTimeout(() => {
            setTimeout(() => {
                setTimeout(() => {
                    if (this.emergencySession) {
                        this.emergencySession.status = 'completed';
                        this.emergencySession.session_duration = '00:02:15';
                        this.appData.sessions.unshift(this.emergencySession);
                        this.saveData();
                    }
                }, 800);
            }, 1000);
        }, 500);
    }

    showEmergencyBanner() {
        const banner = document.getElementById('emergencyBanner');
        const sessionIdEl = document.getElementById('sessionId');
        const sessionTimeEl = document.getElementById('sessionTime');
        
        if (banner && sessionIdEl && sessionTimeEl && this.emergencySession) {
            sessionIdEl.textContent = this.emergencySession.id;
            sessionTimeEl.textContent = new Date().toLocaleTimeString();
            banner.classList.remove('hidden');
        }
    }

    stopEmergency() {
        this.isEmergencyActive = false;
        const banner = document.getElementById('emergencyBanner');
        if (banner) banner.classList.add('hidden');
        if (this.emergencySession) {
            this.emergencySession.status = 'stopped';
            this.emergencySession = null;
        }
    }

    openContactModal(contact) {
        const modal = document.getElementById('contactModal');
        const title = document.getElementById('contactModalTitle');
        const form = document.getElementById('contactForm');
        
        if (modal && title && form) {
            if (contact) {
                title.textContent = 'Edit Emergency Contact';
                this.populateContactForm(contact);
            } else {
                title.textContent = 'Add Emergency Contact';
                form.reset();
                const contactId = document.getElementById('contactId');
                if (contactId) contactId.value = '';
            }
            modal.classList.remove('hidden');
        }
    }

    closeContactModal() {
        const modal = document.getElementById('contactModal');
        if (modal) modal.classList.add('hidden');
    }

    populateContactForm(contact) {
        const elements = {
            contactId: document.getElementById('contactId'),
            contactName: document.getElementById('contactName'),
            contactPhone: document.getElementById('contactPhone'),
            contactRelationship: document.getElementById('contactRelationship'),
            contactPriority: document.getElementById('contactPriority'),
            notificationMethod: document.getElementById('notificationMethod')
        };
        if (elements.contactId) elements.contactId.value = contact.id;
        if (elements.contactName) elements.contactName.value = contact.name;
        if (elements.contactPhone) elements.contactPhone.value = contact.phone;
        if (elements.contactRelationship) elements.contactRelationship.value = contact.relationship;
        if (elements.contactPriority) elements.contactPriority.value = contact.priority;
        if (elements.notificationMethod) elements.notificationMethod.value = contact.notification_method;
    }

    saveContact() {
        const contactIdEl = document.getElementById('contactId');
        const contactNameEl = document.getElementById('contactName');
        const contactPhoneEl = document.getElementById('contactPhone');
        const contactRelationshipEl = document.getElementById('contactRelationship');
        const contactPriorityEl = document.getElementById('contactPriority');
        const notificationMethodEl = document.getElementById('notificationMethod');

        if (!contactNameEl || !contactPhoneEl || !contactRelationshipEl || !contactPriorityEl || !notificationMethodEl) {
            alert('Form elements not found');
            return;
        }

        const contactId = contactIdEl ? contactIdEl.value : '';
        
        const contactData = {
            id: contactId || Date.now().toString(),
            name: contactNameEl.value.trim(),
            phone: contactPhoneEl.value.trim(),
            relationship: contactRelationshipEl.value,
            priority: parseInt(contactPriorityEl.value),
            notification_method: notificationMethodEl.value,
            verified: Math.random() > 0.3
        };

        if (!contactData.name || !contactData.phone || !contactData.relationship) {
            alert('Please fill in all required fields.');
            return;
        }

        if (!/^\+?[\d\s\-()]{10,15}$/.test(contactData.phone)) {
            alert('Please enter a valid phone number.');
            return;
        }

        if (contactId) {
            const index = this.appData.contacts.findIndex(c => c.id === contactId);
            if (index !== -1) this.appData.contacts[index] = contactData;
        } else {
            if (this.appData.contacts.length >= 10) {
                alert('Maximum 10 contacts allowed.');
                return;
            }
            this.appData.contacts.push(contactData);
        }

        this.saveData();
        this.updateUI();
        this.renderContacts();
        this.closeContactModal();
        
        this.showSuccessModal(
            'Contact Saved!',
            contactData.name + ' has been ' + (contactId ? 'updated' : 'added') + ' to your emergency contacts.'
        );
    }

    deleteContact(contactId) {
        if (confirm('Are you sure you want to delete this contact?')) {
            this.appData.contacts = this.appData.contacts.filter(c => c.id !== contactId);
            this.saveData();
            this.updateUI();
            this.renderContacts();
            this.showSuccessModal('Contact Deleted', 'The contact has been removed from your emergency list.');
        }
    }

    renderContacts() {
        const container = document.getElementById('contactsList');
        const countEl = document.getElementById('contactsCount');
        
        if (!container || !countEl) return;
        
        countEl.textContent = this.appData.contacts.length;
        
        if (this.appData.contacts.length === 0) {
            container.innerHTML = '<p style="color: var(--color-text-secondary); padding: var(--space-32); text-align: center;">No emergency contacts added yet. Click "Add Contact" to get started.</p>';
            return;
        }

        const sortedContacts = this.appData.contacts.slice().sort((a, b) => a.priority - b.priority);
        
        container.innerHTML = sortedContacts.map(contact => {
            return '<div class="contact-item">' +
                '<div class="contact-priority">' + contact.priority + '</div>' +
                '<div class="contact-info">' +
                '<h4 class="contact-name">' + contact.name +
                (contact.verified ? ' <span class="contact-verified">✓ Verified</span>' : '') +
                '</h4>' +
                '<p class="contact-details">' +
                contact.phone + ' • ' + contact.relationship + ' • ' + contact.notification_method.replace('_', ' + ').toUpperCase() +
                '</p>' +
                '</div>' +
                '<div class="contact-actions">' +
                '<button class="btn btn--sm btn--outline" onclick="app.editContact(\'' + contact.id + '\')">Edit</button>' +
                '<button class="btn btn--sm btn--outline" onclick="app.deleteContact(\'' + contact.id + '\')" style="color: var(--color-error); border-color: var(--color-error);">Delete</button>' +
                '</div>' +
                '</div>';
        }).join('');
    }

    editContact(contactId) {
        const contact = this.appData.contacts.find(c => c.id === contactId);
        if (contact) this.openContactModal(contact);
    }

    renderHistory() {
        const container = document.getElementById('historyList');
        if (!container) return;
        
        if (this.appData.sessions.length === 0) {
            container.innerHTML = '<p style="color: var(--color-text-secondary); padding: var(--space-32); text-align: center;">No emergency history found.</p>';
            return;
        }

        container.innerHTML = this.appData.sessions.map(session => {
            const date = new Date(session.timestamp);
            const formattedDate = date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
            
            return '<div class="history-item ' + (session.pinned ? 'pinned' : '') + '">' +
                '<div class="history-header">' +
                '<div class="history-session">Session: ' + session.id + '</div>' +
                '<span class="history-status ' + session.status + '">' + session.status.toUpperCase() + '</span>' +
                '</div>' +
                '<div class="history-details">' +
                '<span><strong>Date:</strong> ' + formattedDate + '</span>' +
                '<span><strong>Duration:</strong> ' + session.session_duration + '</span>' +
                '<span><strong>Location:</strong> ' + session.location.address + '</span>' +
                '<span><strong>Contacts Alerted:</strong> ' + session.contacts_alerted + '</span>' +
                '<span><strong>Coordinates:</strong> ' + session.location.latitude.toFixed(4) + ', ' + session.location.longitude.toFixed(4) + '</span>' +
                '<span><strong>Police Called:</strong> ' + (session.police_called || 'No') + '</span>' +
                '</div>' +
                '<div class="history-actions">' +
                '<button class="btn btn--sm btn--outline" onclick="app.togglePin(\'' + session.id + '\')">' +
                (session.pinned ? 'Unpin' : 'Pin') +
                '</button>' +
                '<a href="https://maps.google.com/?q=' + session.location.latitude + ',' + session.location.longitude + '" target="_blank" class="btn btn--sm btn--outline">View Location</a>' +
                '</div>' +
                '</div>';
        }).join('');
    }

    togglePin(sessionId) {
        const session = this.appData.sessions.find(s => s.id === sessionId);
        if (session) {
            session.pinned = !session.pinned;
            this.saveData();
            this.renderHistory();
        }
    }

    lookupPoliceStations() {
        const pinCodeEl = document.getElementById('pinCode');
        if (!pinCodeEl) return;
        
        const pinCode = pinCodeEl.value.trim();
        if (!/^\d{6}$/.test(pinCode)) {
            alert('Please enter a valid 6-digit PIN code.');
            return;
        }

        const stations = this.appData.policeStations.filter(station => station.pin_code === pinCode);
        const container = document.getElementById('stationsList');
        if (!container) return;
        
        if (stations.length === 0) {
            container.innerHTML = '<p style="color: var(--color-text-secondary); text-align: center; padding: var(--space-16);">No police stations found for this PIN code.</p>';
        } else {
            container.innerHTML = stations.map(station => {
                return '<div class="station-item">' +
                    '<h4 class="station-name">' + station.name + '</h4>' +
                    '<p class="station-details">' + station.address + '<br>' + station.district + ', ' + station.state + '</p>' +
                    '<a href="tel:' + station.phone + '" class="station-phone">' + station.phone + '</a>' +
                    '</div>';
            }).join('');
        }
        container.classList.remove('hidden');
    }

    shareLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const message = 'My current location: https://maps.google.com/?q=' + lat + ',' + lng;
                    
                    if (navigator.share) {
                        navigator.share({ title: 'My Location - RAKSHA', text: message });
                    } else if (navigator.clipboard) {
                        navigator.clipboard.writeText(message).then(() => {
                            this.showSuccessModal('Location Copied!', 'Your location has been copied to clipboard.');
                        });
                    } else {
                        this.showSuccessModal('Location Shared!', 'Location: ' + lat + ', ' + lng);
                    }
                },
                () => {
                    const lat = 28.6315 + (Math.random() - 0.5) * 0.01;
                    const lng = 77.2167 + (Math.random() - 0.5) * 0.01;
                    const message = 'My current location: https://maps.google.com/?q=' + lat + ',' + lng;
                    
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(message).then(() => {
                            this.showSuccessModal('Location Shared!', 'Your approximate location has been copied to clipboard.');
                        });
                    } else {
                        this.showSuccessModal('Location Shared!', 'Location: ' + lat + ', ' + lng);
                    }
                }
            );
        } else {
            const lat = 28.6315 + (Math.random() - 0.5) * 0.01;
            const lng = 77.2167 + (Math.random() - 0.5) * 0.01;
            const message = 'My current location: https://maps.google.com/?q=' + lat + ',' + lng;
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(message).then(() => {
                    this.showSuccessModal('Location Shared!', 'Your approximate location has been copied to clipboard.');
                });
            } else {
                this.showSuccessModal('Location Shared!', 'Location: ' + lat + ', ' + lng);
            }
        }
    }

    testAlert() {
        this.showSuccessModal(
            'Test Alert Sent!',
            'A test message has been sent to your emergency contacts to verify the system is working.'
        );
    }

    showSuccessModal(title, message) {
        const titleEl = document.getElementById('successTitle');
        const messageEl = document.getElementById('successMessage');
        const modal = document.getElementById('successModal');
        
        if (titleEl && messageEl && modal) {
            titleEl.textContent = title;
            messageEl.textContent = message;
            modal.classList.remove('hidden');
        }
    }

    closeSuccessModal() {
        const modal = document.getElementById('successModal');
        if (modal) modal.classList.add('hidden');
    }

    updateLocationStatus() {
        const locationStatus = document.getElementById('locationStatus');
        if (locationStatus) {
            locationStatus.textContent = this.appData.settings.location_sharing_enabled ? 'Enabled' : 'Disabled';
        }
    }

    updateUI() {
        const userWelcome = document.getElementById('userWelcome');
        if (userWelcome) userWelcome.textContent = 'Hi, ' + this.appData.user.name.split(' ')[0];
        
        const contactCount = document.getElementById('contactCount');
        if (contactCount) contactCount.textContent = this.appData.contacts.length + ' Added';
        
        this.updateLocationStatus();
        
        const sosTimeoutEl = document.getElementById('sosTimeout');
        if (sosTimeoutEl) sosTimeoutEl.value = this.appData.settings.sos_confirmation_timeout;
        
        const audioRecordingEl = document.getElementById('audioRecording');
        if (audioRecordingEl) audioRecordingEl.checked = this.appData.settings.audio_recording_enabled;
        
        const locationSharingEl = document.getElementById('locationSharing');
        if (locationSharingEl) locationSharingEl.checked = this.appData.settings.location_sharing_enabled;
        
        const dataRetentionEl = document.getElementById('dataRetention');
        if (dataRetentionEl) dataRetentionEl.value = this.appData.settings.data_retention_days;
        
        this.sosTimeout = this.appData.settings.sos_confirmation_timeout;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    try {
        window.app = new RakshaApp();
        window.app.init();
    } catch (error) {
        console.error('Error starting RAKSHA app:', error);
        const splash = document.getElementById('splash');
        const app = document.getElementById('app');
        if (splash) splash.style.display = 'none';
        if (app) {
            app.classList.remove('hidden');
            app.style.display = 'flex';
        }
    }
});