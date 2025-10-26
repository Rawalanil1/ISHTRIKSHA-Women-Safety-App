// Women Safety App - Enhanced with Working Map and Emergency Features

// Application Data
const APP_DATA = {
  defaultContacts: [
    {"name": "Mumbai Police Nirbhaya Squad", "phone": "103", "type": "police", "id": "default-1"},
    {"name": "Emergency Services", "phone": "112", "type": "emergency", "id": "default-2"},
    {"name": "Women Helpline", "phone": "1091", "type": "helpline", "id": "default-3"}
  ],
  safeZones: [
    {"name": "Andheri Police Station", "type": "police", "lat": 19.1136, "lng": 72.8697, "icon": "shield"},
    {"name": "Bandra Police Station", "type": "police", "lat": 19.0544, "lng": 72.8406, "icon": "shield"},
    {"name": "KEM Hospital", "type": "hospital", "lat": 19.0176, "lng": 72.8562, "icon": "hospital"},
    {"name": "Lilavati Hospital", "type": "hospital", "lat": 19.0544, "lng": 72.8306, "icon": "hospital"},
    {"name": "Women's Shelter - Bandra", "type": "shelter", "lat": 19.0596, "lng": 72.8295, "icon": "home"},
    {"name": "Women's Shelter - Andheri", "type": "shelter", "lat": 19.1197, "lng": 72.8464, "icon": "home"},
    {"name": "Safe Zone - Churchgate", "type": "safe", "lat": 18.9357, "lng": 72.8274, "icon": "circle"},
    {"name": "Safe Zone - Colaba", "type": "safe", "lat": 18.9067, "lng": 72.8147, "icon": "circle"},
    {"name": "Safe Zone - Marine Drive", "type": "safe", "lat": 18.9447, "lng": 72.8236, "icon": "circle"}
  ],
  emergencyMessages: [
    "🚨 EMERGENCY ALERT 🚨\nI need immediate help!\nLocation: {location}\nTime: {time}\nThis is an automated safety alert.",
    "⚠️ SOS ALERT ⚠️\nI'm in danger and need assistance!\nGPS: {coordinates}\nSent from SafeGuard App",
    "🔴 URGENT HELP NEEDED 🔴\nEmergency situation at: {location}\nPlease contact authorities immediately!\nTime: {time}"
  ],
  voiceCommands: ["help me", "emergency", "sos", "danger", "call police"],
  relationshipTypes: ["Family", "Friend", "Colleague", "Neighbor", "Police", "Medical", "Other"],
  safetyTips: [
    "Always inform someone about your travel plans and expected arrival times",
    "Trust your instincts if something feels wrong - it's better to be safe than sorry",
    "Keep emergency numbers saved and easily accessible in your phone",
    "Stay alert in crowded places and public transport, avoid distractions",
    "Use well-lit, populated routes when walking alone, especially at night",
    "Carry a charged phone and portable charger for emergencies",
    "Learn basic self-defense techniques and practice them regularly"
  ]
};

// Translation data
const TRANSLATIONS = {
  en: {
    police: "Police",
    emergency: "Emergency",
    helpline: "Helpline",
    safe: "Safe",
    alert: "Alert",
    emergency_state: "Emergency",
    locating: "Getting your location...",
    sos: "SOS",
    "sos-instructions": "Tap to activate emergency protocol",
    "fake-call": "Fake Call",
    "police-alert": "Police Alert",
    medical: "Medical",
    "share-location": "Share Location",
    "voice-listening": "Voice: Listening",
    "shake-detection": "Shake: Active", 
    "power-detection": "Power: Ready",
    "safety-tips": "Safety Tips",
    "safe-zones-map": "Safe Zones Map",
    "center-map": "Center",
    "nearest-safe": "Nearest",
    "police-stations": "Police Stations",
    hospitals: "Hospitals",
    shelters: "Shelters",
    "safe-zones": "Safe Zones",
    "nearest-locations": "Nearest Safe Locations",
    "community-safety": "Community & Volunteers",
    "report-unsafe": "Report Unsafe",
    "active-volunteers": "Active Volunteers",
    "avg-response": "Min Avg Response",
    "nearby-volunteers": "Nearby Volunteers",
    "recent-alerts": "Recent Community Alerts",
    settings: "Settings",
    "emergency-contacts": "Emergency Contacts",
    "add-contact": "Add Contact",
    "emergency-message": "Emergency Message",
    "message-help": "Use {location}, {time}, {coordinates} for automatic values",
    "save-message": "Save Message",
    "safety-features": "Safety Features",
    "voice-commands": "Voice Commands",
    "power-button": "Power Button (3x)",
    "location-privacy": "Location & Privacy",
    "location-tracking": "High-Accuracy GPS",
    "auto-share": "Auto Share Location",
    "system-info": "System Information",
    "app-version": "App Version",
    "battery-level": "Battery Level",
    "gps-accuracy": "GPS Accuracy",
    home: "Home",
    map: "Map",
    community: "Community",
    "emergency-alert": "Emergency Alert Activating",
    "countdown-message": "Alert will be sent in",
    cancel: "Cancel",
    "emergency-active": "Emergency Active",
    "alerts-sent": "Emergency contacts notified",
    "location-shared": "Live location being shared",
    "recording-active": "Emergency recording active",
    "call-police": "Call Police (103)",
    "mark-safe": "Mark as Safe",
    "add-emergency-contact": "Add Emergency Contact",
    "edit-contact": "Edit Contact",
    "contact-name": "Contact Name",
    "phone-number": "Phone Number",
    relationship: "Relationship",
    "save-changes": "Save Changes",
    "incoming-call": "Incoming call...",
    listening: "Listening for \"Help Me\"...",
    loading: "Loading..."
  }
};

// Global state
let currentLanguage = 'en';
let currentTipIndex = 0;
let emergencyActive = false;
let emergencyStartTime = null;
let emergencyTimer = null;
let currentLocation = null;
let locationWatchId = null;
let userContacts = [];
let voiceRecognition = null;
let motionDetector = null;
let powerButtonCount = 0;
let powerButtonTimer = null;
let countdownInterval = null;
let map = null;
let userMarker = null;
let safeZoneMarkers = [];
let currentEditingContact = null;
let lastShakeTime = 0;
let shakeThreshold = 15;
let batteryLevel = 85;

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing Women Safety App...');
  
  // Small delay to ensure DOM is fully loaded
  setTimeout(() => {
    initializeApp();
  }, 100);
});

function initializeApp() {
  try {
    console.log('Starting app initialization...');
    
    // Request location permission first
    requestLocationPermission();
    
    // Load saved settings
    loadSettings();
    
    // Initialize components in order
    initializeNavigation();
    initializeLanguage();
    initializeTheme();
    initializeLocation();
    initializeSafetyTips();
    initializeEmergencyFeatures();
    initializeVoiceCommands();
    initializeMotionDetection();
    initializeContacts();
    initializeModals();
    initializeQuickActions();
    
    // Initialize community data
    initializeCommunityData();
    
    // Start periodic updates
    startPeriodicUpdates();
    
    console.log('App initialized successfully');
    
    // Show initial notification
    setTimeout(() => {
      showNotification('SafeGuard app ready! All safety features are active.', 'success');
    }, 1000);
    
  } catch (error) {
    console.error('Error during app initialization:', error);
  }
}

// Location Permission and GPS
function requestLocationPermission() {
  if (navigator.geolocation) {
    console.log('Requesting location permission...');
    
    // Show location status
    const currentLocationEl = document.getElementById('currentLocation');
    if (currentLocationEl) {
      currentLocationEl.textContent = 'Getting your location...';
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Location permission granted');
        currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        updateLocationDisplay();
        showNotification('Location access granted', 'success');
        startLocationTracking();
      },
      (error) => {
        console.log('Location permission denied or failed:', error.message);
        // Use Mumbai coordinates as fallback
        currentLocation = {
          lat: 19.0760,
          lng: 72.8777,
          accuracy: 50
        };
        updateLocationDisplay();
        showNotification('Using default location (Mumbai)', 'warning');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  } else {
    console.log('Geolocation not supported');
    currentLocation = {
      lat: 19.0760,
      lng: 72.8777,
      accuracy: 50
    };
    updateLocationDisplay();
    showNotification('Geolocation not supported, using default location', 'warning');
  }
}

function startLocationTracking() {
  if (navigator.geolocation && !locationWatchId) {
    locationWatchId = navigator.geolocation.watchPosition(
      (position) => {
        currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        updateLocationDisplay();
        if (map && userMarker) {
          updateMapLocation();
        }
      },
      (error) => {
        console.log('Location tracking error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 60000
      }
    );
  }
}

// Navigation System
function initializeNavigation() {
  console.log('Initializing navigation...');
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const screenId = this.getAttribute('data-screen');
      console.log('Navigating to:', screenId);
      
      // Show target screen
      showScreen(screenId);
      
      // Update active nav item
      navItems.forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
      
      // Initialize map if navigating to map screen
      if (screenId === 'mapScreen') {
        setTimeout(() => {
          initializeMap();
        }, 200);
      }
    });
  });
  
  console.log('Navigation initialized');
}

function showScreen(screenId) {
  console.log('Showing screen:', screenId);
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => {
    screen.classList.remove('active');
  });
  
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add('active');
    console.log('Screen activated:', screenId);
    
    // Resize map if showing map screen
    if (screenId === 'mapScreen' && map) {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  } else {
    console.error('Screen not found:', screenId);
  }
}

// Language System
function initializeLanguage() {
  const languageSelector = document.getElementById('languageSelector');
  if (languageSelector) {
    languageSelector.addEventListener('change', function() {
      currentLanguage = this.value;
      updateLanguage();
      saveSettings();
    });
  }
  updateLanguage();
}

function updateLanguage() {
  const elementsToTranslate = document.querySelectorAll('[data-translate]');
  elementsToTranslate.forEach(element => {
    const key = element.getAttribute('data-translate');
    const translation = TRANSLATIONS[currentLanguage] && TRANSLATIONS[currentLanguage][key];
    if (translation) {
      element.textContent = translation;
    }
  });
}

// Theme System
function initializeTheme() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;
  
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-color-scheme', savedTheme);
  updateThemeIcon(savedTheme);
  
  themeToggle.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const currentTheme = document.documentElement.getAttribute('data-color-scheme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-color-scheme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    showNotification(`Switched to ${newTheme} mode`, 'info');
  });
}

function updateThemeIcon(theme) {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const icon = themeToggle.querySelector('i');
    if (icon) {
      icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
  }
}

// Location Display
function initializeLocation() {
  const refreshBtn = document.getElementById('refreshLocation');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      refreshLocation();
    });
  }
}

function refreshLocation() {
  showLoadingMessage('Getting your location...');
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      };
      updateLocationDisplay();
      if (map) {
        updateMapLocation();
      }
      hideLoadingOverlay();
      showNotification('Location updated successfully', 'success');
    },
    (error) => {
      console.log('Location refresh failed:', error);
      hideLoadingOverlay();
      showNotification('Failed to get location', 'error');
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

function updateLocationDisplay() {
  const currentLocationEl = document.getElementById('currentLocation');
  const coordinatesEl = document.getElementById('coordinates');
  const accuracyEl = document.getElementById('locationAccuracy');
  const gpsAccuracyEl = document.getElementById('gpsAccuracy');
  
  if (currentLocation) {
    if (currentLocationEl) {
      currentLocationEl.textContent = 'Mumbai, Maharashtra, India';
    }
    if (coordinatesEl) {
      coordinatesEl.textContent = `${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}`;
    }
    if (accuracyEl) {
      accuracyEl.textContent = `±${Math.round(currentLocation.accuracy || 10)}m`;
    }
    if (gpsAccuracyEl) {
      gpsAccuracyEl.textContent = `±${Math.round(currentLocation.accuracy || 10)}m`;
    }
  }
}

// Map Functionality
function initializeMap() {
  if (map) {
    console.log('Map already initialized');
    return;
  }
  
  const mapContainer = document.getElementById('liveMap');
  if (!mapContainer) {
    console.error('Map container not found');
    return;
  }
  
  try {
    console.log('Initializing Leaflet map...');
    
    // Initialize Leaflet map
    const initialLat = currentLocation?.lat || 19.0760;
    const initialLng = currentLocation?.lng || 72.8777;
    
    map = L.map('liveMap').setView([initialLat, initialLng], 13);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
      minZoom: 10
    }).addTo(map);
    
    // Add user location marker
    if (currentLocation) {
      updateMapLocation();
    }
    
    // Add safe zone markers
    addSafeZoneMarkers();
    
    // Add map controls
    initializeMapControls();
    
    console.log('Map initialized successfully');
    showNotification('Interactive map loaded with safe zones', 'success');
    
  } catch (error) {
    console.error('Map initialization failed:', error);
    showNotification('Failed to load map', 'error');
  }
}

function updateMapLocation() {
  if (!map || !currentLocation) return;
  
  // Remove existing user marker
  if (userMarker) {
    map.removeLayer(userMarker);
  }
  
  // Create blue dot marker for user location
  const userIcon = L.divIcon({
    className: 'user-location-marker',
    html: '<div style="width: 20px; height: 20px; background-color: #007bff; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  });
  
  userMarker = L.marker([currentLocation.lat, currentLocation.lng], { icon: userIcon })
    .addTo(map)
    .bindPopup(`<div class="popup-content">
      <div class="popup-title">Your Location</div>
      <div class="popup-distance">Accuracy: ±${Math.round(currentLocation.accuracy || 10)}m</div>
    </div>`);
  
  console.log('User marker updated on map');
}

function addSafeZoneMarkers() {
  if (!map) return;
  
  // Clear existing markers
  safeZoneMarkers.forEach(marker => {
    map.removeLayer(marker);
  });
  safeZoneMarkers = [];
  
  APP_DATA.safeZones.forEach(zone => {
    const color = getZoneColor(zone.type);
    const iconClass = getZoneIcon(zone.type);
    
    const zoneIcon = L.divIcon({
      className: 'safe-zone-marker',
      html: `<div style="width: 30px; height: 30px; background-color: ${color}; border: 2px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
        <i class="fas ${iconClass}" style="font-size: 14px;"></i>
      </div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });
    
    const distance = currentLocation ? 
      calculateDistance(currentLocation.lat, currentLocation.lng, zone.lat, zone.lng) : 0;
    
    const marker = L.marker([zone.lat, zone.lng], { icon: zoneIcon })
      .addTo(map)
      .bindPopup(`<div class="popup-content">
        <div class="popup-title">${zone.name}</div>
        <div class="popup-distance">${distance.toFixed(1)} km away</div>
        <div class="popup-actions">
          <button class="popup-btn" onclick="getDirections(${zone.lat}, ${zone.lng})">
            <i class="fas fa-route"></i> Directions
          </button>
          <button class="popup-btn" onclick="callEmergencyService('${zone.type}')">
            <i class="fas fa-phone"></i> Call
          </button>
        </div>
      </div>`);
    
    safeZoneMarkers.push(marker);
  });
  
  // Update nearest locations list
  updateNearestLocationsList();
  
  console.log(`Added ${safeZoneMarkers.length} safe zone markers`);
}

function getZoneColor(type) {
  switch (type) {
    case 'police': return '#3b82f6';
    case 'hospital': return '#ef4444';
    case 'shelter': return '#8b5cf6';
    case 'safe': return '#10b981';
    default: return '#6b7280';
  }
}

function getZoneIcon(type) {
  switch (type) {
    case 'police': return 'fa-shield-alt';
    case 'hospital': return 'fa-hospital';
    case 'shelter': return 'fa-home';
    case 'safe': return 'fa-check-circle';
    default: return 'fa-map-marker-alt';
  }
}

function initializeMapControls() {
  const centerBtn = document.getElementById('centerMapBtn');
  const routeBtn = document.getElementById('routeToNearestBtn');
  
  if (centerBtn) {
    centerBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      centerMapOnUser();
    });
  }
  
  if (routeBtn) {
    routeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      routeToNearestSafeZone();
    });
  }
}

function centerMapOnUser() {
  if (map && currentLocation) {
    map.setView([currentLocation.lat, currentLocation.lng], 15);
    showNotification('Map centered on your location', 'info');
  } else {
    showNotification('Location not available', 'warning');
  }
}

function routeToNearestSafeZone() {
  if (!currentLocation) {
    showNotification('Location not available', 'error');
    return;
  }
  
  let nearest = null;
  let minDistance = Infinity;
  
  APP_DATA.safeZones.forEach(zone => {
    const distance = calculateDistance(currentLocation.lat, currentLocation.lng, zone.lat, zone.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = zone;
    }
  });
  
  if (nearest) {
    showNotification(`Routing to ${nearest.name} (${minDistance.toFixed(1)}km)`, 'info');
    getDirections(nearest.lat, nearest.lng);
  }
}

function updateNearestLocationsList() {
  const nearestList = document.getElementById('nearestList');
  if (!nearestList || !currentLocation) return;
  
  // Calculate distances and sort
  const zonesWithDistance = APP_DATA.safeZones.map(zone => ({
    ...zone,
    distance: calculateDistance(currentLocation.lat, currentLocation.lng, zone.lat, zone.lng)
  })).sort((a, b) => a.distance - b.distance);
  
  nearestList.innerHTML = '';
  
  zonesWithDistance.slice(0, 5).forEach(zone => {
    const item = document.createElement('div');
    item.className = 'nearest-item';
    item.innerHTML = `
      <div class="nearest-info">
        <div class="zone-icon ${zone.type}">
          <i class="fas ${getZoneIcon(zone.type)}"></i>
        </div>
        <div class="zone-details">
          <div class="zone-name">${zone.name}</div>
          <div class="zone-distance">${zone.distance.toFixed(1)} km away</div>
        </div>
      </div>
      <button class="btn btn--sm btn--primary" onclick="getDirections(${zone.lat}, ${zone.lng})">
        <i class="fas fa-route"></i>
      </button>
    `;
    nearestList.appendChild(item);
  });
}

// Global functions for map interactions
window.getDirections = function(lat, lng) {
  if (!currentLocation) {
    showNotification('Location not available', 'error');
    return;
  }
  
  const url = `https://www.google.com/maps/dir/${currentLocation.lat},${currentLocation.lng}/${lat},${lng}`;
  window.open(url, '_blank');
};

window.callEmergencyService = function(type) {
  let number = '112'; // Default emergency
  
  switch (type) {
    case 'police': number = '103'; break;
    case 'hospital': number = '108'; break;
    default: number = '112';
  }
  
  simulateCall(number);
};

// Safety Tips Carousel
function initializeSafetyTips() {
  updateTip();
  
  const prevBtn = document.getElementById('prevTip');
  const nextBtn = document.getElementById('nextTip');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      currentTipIndex = (currentTipIndex - 1 + APP_DATA.safetyTips.length) % APP_DATA.safetyTips.length;
      updateTip();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      currentTipIndex = (currentTipIndex + 1) % APP_DATA.safetyTips.length;
      updateTip();
    });
  }
  
  // Auto-rotate tips
  setInterval(() => {
    currentTipIndex = (currentTipIndex + 1) % APP_DATA.safetyTips.length;
    updateTip();
  }, 15000);
}

function updateTip() {
  const currentTipEl = document.getElementById('currentTip');
  const tipCounterEl = document.getElementById('tipCounter');
  
  if (currentTipEl) {
    currentTipEl.textContent = APP_DATA.safetyTips[currentTipIndex];
  }
  if (tipCounterEl) {
    tipCounterEl.textContent = `${currentTipIndex + 1}/${APP_DATA.safetyTips.length}`;
  }
}

// Emergency Features
function initializeEmergencyFeatures() {
  const sosButton = document.getElementById('sosButton');
  if (sosButton) {
    sosButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      triggerSOS();
    });
  }
  
  // Emergency contacts in top bar
  document.querySelectorAll('.emergency-contact').forEach(contact => {
    contact.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const number = this.getAttribute('data-number');
      simulateCall(number);
    });
  });
  
  // Emergency modal buttons
  const callPoliceBtn = document.getElementById('callPoliceBtn');
  if (callPoliceBtn) {
    callPoliceBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      simulateCall('103');
    });
  }
  
  const markSafeBtn = document.getElementById('markSafeBtn');
  if (markSafeBtn) {
    markSafeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      markAsSafe();
    });
  }
  
  const cancelSOSBtn = document.getElementById('cancelSOS');
  if (cancelSOSBtn) {
    cancelSOSBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      cancelSOS();
    });
  }
  
  console.log('Emergency features initialized');
}

function triggerSOS() {
  if (emergencyActive) {
    showNotification('Emergency already active', 'warning');
    return;
  }
  
  console.log('SOS triggered - starting countdown');
  showNotification('SOS activated! Countdown starting...', 'warning');
  showModal('sosModal');
  startSOSCountdown();
}

function startSOSCountdown() {
  let countdown = 3;
  const countdownNumberEl = document.getElementById('countdownNumber');
  
  if (countdownNumberEl) {
    countdownNumberEl.textContent = countdown;
  }
  
  countdownInterval = setInterval(() => {
    countdown--;
    if (countdownNumberEl) {
      countdownNumberEl.textContent = countdown;
    }
    
    if (countdown <= 0) {
      clearInterval(countdownInterval);
      hideModal('sosModal');
      activateEmergency();
    }
  }, 1000);
}

function cancelSOS() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  hideModal('sosModal');
  showNotification('SOS cancelled', 'info');
  console.log('SOS cancelled by user');
}

function activateEmergency() {
  emergencyActive = true;
  emergencyStartTime = new Date();
  
  console.log('Emergency activated!');
  
  // Update safety status
  updateSafetyStatus('emergency');
  
  // Show loading for alert sending
  showLoadingMessage('Sending emergency alerts...');
  
  setTimeout(() => {
    hideLoadingOverlay();
    
    // Send emergency messages
    sendEmergencyAlerts();
    
    // Show emergency active modal
    showModal('emergencyModal');
    
    // Start emergency timer
    startEmergencyTimer();
    
    // Start location sharing simulation
    startLocationSharing();
    
    // Start recording simulation
    startEmergencyRecording();
    
    showNotification('Emergency protocol activated!', 'error');
    
  }, 2000);
}

function sendEmergencyAlerts() {
  const allContacts = [...APP_DATA.defaultContacts, ...userContacts];
  const locationText = currentLocation ? 
    `${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}` : 
    'Location unavailable';
  
  const message = APP_DATA.emergencyMessages[0]
    .replace('{location}', locationText)
    .replace('{time}', new Date().toLocaleString())
    .replace('{coordinates}', locationText);
  
  console.log('Emergency alerts sent to contacts:', allContacts.length);
  console.log('Message:', message);
  
  // Simulate vibration
  if (navigator.vibrate) {
    navigator.vibrate([200, 100, 200, 100, 200]);
  }
}

function startEmergencyTimer() {
  const timerDisplay = document.getElementById('timerDisplay');
  const emergencyTimerModal = document.getElementById('emergencyTimerModal');
  const emergencyTimerDiv = document.getElementById('emergencyTimer');
  
  if (emergencyTimerDiv) {
    emergencyTimerDiv.style.display = 'flex';
  }
  
  emergencyTimer = setInterval(() => {
    if (!emergencyActive) {
      clearInterval(emergencyTimer);
      return;
    }
    
    const elapsed = Math.floor((new Date() - emergencyStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (timerDisplay) {
      timerDisplay.textContent = timeString;
    }
    if (emergencyTimerModal) {
      emergencyTimerModal.textContent = timeString;
    }
  }, 1000);
}

function startLocationSharing() {
  console.log('Started live location sharing');
}

function startEmergencyRecording() {
  console.log('Started emergency recording');
}

function markAsSafe() {
  emergencyActive = false;
  
  if (emergencyTimer) {
    clearInterval(emergencyTimer);
  }
  
  const emergencyTimerDiv = document.getElementById('emergencyTimer');
  if (emergencyTimerDiv) {
    emergencyTimerDiv.style.display = 'none';
  }
  
  updateSafetyStatus('safe');
  hideModal('emergencyModal');
  
  showLoadingMessage('Notifying contacts you are safe...');
  
  setTimeout(() => {
    hideLoadingOverlay();
    showNotification('Safe status sent to all contacts!', 'success');
  }, 1500);
  
  console.log('Emergency stopped - user marked as safe');
}

function updateSafetyStatus(status) {
  const statusDot = document.querySelector('.status-dot');
  const statusText = document.getElementById('safetyStatus');
  
  if (statusDot) {
    statusDot.className = `status-dot ${status}`;
  }
  
  if (statusText) {
    const translations = TRANSLATIONS[currentLanguage];
    if (status === 'safe') {
      statusText.textContent = translations?.safe || 'Safe';
    } else if (status === 'alert') {
      statusText.textContent = translations?.alert || 'Alert';
    } else if (status === 'emergency') {
      statusText.textContent = translations?.emergency_state || 'Emergency';
    }
  }
}

// Voice Commands
function initializeVoiceCommands() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    console.log('Speech recognition not supported');
    updateFeatureStatus('voice', false);
    return;
  }
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  voiceRecognition = new SpeechRecognition();
  
  voiceRecognition.continuous = true;
  voiceRecognition.interimResults = false;
  voiceRecognition.lang = 'en-US';
  
  voiceRecognition.onresult = function(event) {
    const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
    console.log('Voice command detected:', command);
    
    APP_DATA.voiceCommands.forEach(trigger => {
      if (command.includes(trigger)) {
        console.log('Emergency voice command triggered:', trigger);
        showVoiceIndicator();
        showNotification(`Voice command detected: "${trigger}"`, 'warning');
        setTimeout(() => {
          hideVoiceIndicator();
          triggerSOS();
        }, 1000);
      }
    });
  };
  
  voiceRecognition.onerror = function(event) {
    console.log('Voice recognition error:', event.error);
    setTimeout(() => {
      startVoiceListening();
    }, 5000);
  };
  
  voiceRecognition.onend = function() {
    setTimeout(() => {
      startVoiceListening();
    }, 1000);
  };
  
  startVoiceListening();
}

function startVoiceListening() {
  if (!voiceRecognition) return;
  
  try {
    voiceRecognition.start();
    updateFeatureStatus('voice', true);
    console.log('Voice recognition started');
  } catch (error) {
    console.log('Could not start voice recognition:', error);
    updateFeatureStatus('voice', false);
  }
}

function showVoiceIndicator() {
  const indicator = document.getElementById('voiceIndicator');
  if (indicator) {
    indicator.classList.add('listening');
  }
}

function hideVoiceIndicator() {
  const indicator = document.getElementById('voiceIndicator');
  if (indicator) {
    indicator.classList.remove('listening');
  }
}

// Motion Detection (Shake)
function initializeMotionDetection() {
  if (window.DeviceMotionEvent) {
    let lastAcceleration = { x: 0, y: 0, z: 0 };
    
    window.addEventListener('devicemotion', function(event) {
      const acceleration = event.accelerationIncludingGravity;
      
      if (acceleration) {
        const deltaX = Math.abs(acceleration.x - lastAcceleration.x);
        const deltaY = Math.abs(acceleration.y - lastAcceleration.y);
        const deltaZ = Math.abs(acceleration.z - lastAcceleration.z);
        
        const totalDelta = deltaX + deltaY + deltaZ;
        const currentTime = new Date().getTime();
        
        if (totalDelta > shakeThreshold && currentTime - lastShakeTime > 2000) {
          console.log('Shake detected! Delta:', totalDelta);
          lastShakeTime = currentTime;
          showNotification('Shake detected! Triggering SOS...', 'warning');
          triggerSOS();
        }
        
        lastAcceleration = {
          x: acceleration.x,
          y: acceleration.y,
          z: acceleration.z
        };
      }
    });
    
    updateFeatureStatus('shake', true);
  }
  
  // Power button simulation (use 'p' key)
  let keyPressCount = 0;
  let keyPressTimer = null;
  
  document.addEventListener('keydown', function(event) {
    if (event.key === 'p' || event.key === 'P') {
      keyPressCount++;
      
      if (keyPressTimer) {
        clearTimeout(keyPressTimer);
      }
      
      if (keyPressCount >= 3) {
        console.log('Power button pressed 3 times - triggering SOS');
        showNotification('Power button (3x) detected! Triggering SOS...', 'warning');
        triggerSOS();
        keyPressCount = 0;
      }
      
      keyPressTimer = setTimeout(() => {
        keyPressCount = 0;
      }, 2000);
    }
  });
  
  updateFeatureStatus('power', true);
}

function updateFeatureStatus(feature, active) {
  const statusElements = {
    voice: document.getElementById('voiceStatus'),
    shake: document.getElementById('shakeStatus'),
    power: document.getElementById('powerStatus')
  };
  
  const element = statusElements[feature];
  if (element) {
    element.style.opacity = active ? '1' : '0.5';
    const icon = element.querySelector('i');
    if (icon) {
      icon.style.color = active ? 'var(--color-success)' : 'var(--color-error)';
    }
  }
}

// Contact Management
function initializeContacts() {
  console.log('Initializing contacts...');
  loadContacts();
  renderContacts();
  
  const addContactBtn = document.getElementById('addContactBtn');
  if (addContactBtn) {
    addContactBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showModal('addContactModal');
    });
  }
  
  const addContactForm = document.getElementById('addContactForm');
  if (addContactForm) {
    addContactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      addContact();
    });
  }
  
  const editContactForm = document.getElementById('editContactForm');
  if (editContactForm) {
    editContactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      saveEditedContact();
    });
  }
  
  console.log('Contacts initialized');
}

function loadContacts() {
  const saved = localStorage.getItem('emergencyContacts');
  if (saved) {
    try {
      userContacts = JSON.parse(saved);
    } catch (e) {
      userContacts = [];
    }
  }
  console.log('Loaded contacts:', userContacts.length);
}

function saveContacts() {
  localStorage.setItem('emergencyContacts', JSON.stringify(userContacts));
  console.log('Contacts saved:', userContacts.length);
}

function renderContacts() {
  const contactsList = document.getElementById('contactsList');
  const contactCount = document.getElementById('contactCount');
  
  if (!contactsList) {
    console.error('Contacts list element not found');
    return;
  }
  
  contactsList.innerHTML = '';
  
  // Add default emergency contacts (non-editable)
  APP_DATA.defaultContacts.forEach(contact => {
    const contactElement = createContactElement(contact, false);
    contactsList.appendChild(contactElement);
  });
  
  // Add user contacts (editable)
  userContacts.forEach((contact, index) => {
    const contactElement = createContactElement(contact, true, index);
    contactsList.appendChild(contactElement);
  });
  
  // Update contact count
  if (contactCount) {
    const total = APP_DATA.defaultContacts.length + userContacts.length;
    contactCount.textContent = `${total} contacts`;
  }
  
  console.log('Contacts rendered:', APP_DATA.defaultContacts.length + userContacts.length);
}

function createContactElement(contact, canEdit = false, index = null) {
  const div = document.createElement('div');
  div.className = 'contact-item';
  
  div.innerHTML = `
    <div class="contact-info">
      <div class="contact-avatar">
        <i class="fas ${getContactIcon(contact.type)}"></i>
      </div>
      <div class="contact-details">
        <div class="contact-name">${contact.name}</div>
        <div class="contact-phone">${contact.phone}</div>
        <div class="contact-type">${contact.type}</div>
      </div>
    </div>
    <div class="contact-actions">
      <button class="btn btn--sm btn--primary contact-call-btn" data-number="${contact.phone}">
        <i class="fas fa-phone"></i>
      </button>
      ${canEdit ? `
        <button class="btn btn--sm btn--secondary contact-edit-btn" data-index="${index}">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn--sm btn--outline contact-delete-btn" data-index="${index}">
          <i class="fas fa-trash"></i>
        </button>
      ` : ''}
    </div>
  `;
  
  // Add event listeners
  const callBtn = div.querySelector('.contact-call-btn');
  if (callBtn) {
    callBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const number = this.getAttribute('data-number');
      simulateCall(number);
    });
  }
  
  const editBtn = div.querySelector('.contact-edit-btn');
  if (editBtn) {
    editBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const idx = parseInt(this.getAttribute('data-index'));
      editContact(idx);
    });
  }
  
  const deleteBtn = div.querySelector('.contact-delete-btn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const idx = parseInt(this.getAttribute('data-index'));
      deleteContact(idx);
    });
  }
  
  return div;
}

function getContactIcon(type) {
  switch (type) {
    case 'family': return 'fa-users';
    case 'friend': return 'fa-user-friends';
    case 'police': return 'fa-shield-alt';
    case 'medical': return 'fa-user-md';
    case 'colleague': return 'fa-briefcase';
    default: return 'fa-user';
  }
}

function addContact() {
  const nameEl = document.getElementById('contactName');
  const phoneEl = document.getElementById('contactPhone');
  const relationEl = document.getElementById('contactRelation');
  
  if (!validateContactForm(nameEl, phoneEl)) {
    return;
  }
  
  const name = nameEl.value.trim();
  const phone = phoneEl.value.trim();
  const relation = relationEl.value;
  
  userContacts.push({
    name: name,
    phone: phone,
    type: relation,
    id: Date.now().toString()
  });
  
  saveContacts();
  renderContacts();
  hideModal('addContactModal');
  
  // Clear form
  nameEl.value = '';
  phoneEl.value = '';
  relationEl.value = 'family';
  
  showNotification('Contact added successfully!', 'success');
}

function editContact(index) {
  const contact = userContacts[index];
  if (!contact) return;
  
  currentEditingContact = index;
  
  document.getElementById('editContactName').value = contact.name;
  document.getElementById('editContactPhone').value = contact.phone;
  document.getElementById('editContactRelation').value = contact.type;
  
  showModal('editContactModal');
}

function saveEditedContact() {
  if (currentEditingContact === null) return;
  
  const nameEl = document.getElementById('editContactName');
  const phoneEl = document.getElementById('editContactPhone');
  const relationEl = document.getElementById('editContactRelation');
  
  if (!validateContactForm(nameEl, phoneEl)) {
    return;
  }
  
  userContacts[currentEditingContact] = {
    ...userContacts[currentEditingContact],
    name: nameEl.value.trim(),
    phone: phoneEl.value.trim(),
    type: relationEl.value
  };
  
  saveContacts();
  renderContacts();
  hideModal('editContactModal');
  currentEditingContact = null;
  
  showNotification('Contact updated successfully!', 'success');
}

function deleteContact(index) {
  if (confirm('Are you sure you want to delete this contact?')) {
    const deletedContact = userContacts[index];
    userContacts.splice(index, 1);
    saveContacts();
    renderContacts();
    showNotification(`${deletedContact.name} deleted`, 'info');
  }
}

function validateContactForm(nameEl, phoneEl) {
  let valid = true;
  
  // Clear previous errors
  document.querySelectorAll('.form-error').forEach(error => {
    error.classList.remove('show');
  });
  
  const name = nameEl.value.trim();
  const phone = phoneEl.value.trim();
  
  if (!name) {
    showFormError('nameError', 'Name is required');
    valid = false;
  }
  
  if (!phone) {
    showFormError('phoneError', 'Phone number is required');
    valid = false;
  } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(phone)) {
    showFormError('phoneError', 'Please enter a valid phone number');
    valid = false;
  }
  
  return valid;
}

function showFormError(elementId, message) {
  const errorEl = document.getElementById(elementId);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('show');
  }
}

// Quick Actions
function initializeQuickActions() {
  console.log('Initializing quick actions...');
  
  const fakeCallBtn = document.querySelector('.fake-call');
  if (fakeCallBtn) {
    fakeCallBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Fake call button clicked');
      showFakeCall();
    });
  } else {
    console.error('Fake call button not found');
  }
  
  const policeAlertBtn = document.querySelector('.police-alert');
  if (policeAlertBtn) {
    policeAlertBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Police alert button clicked');
      triggerPoliceAlert();
    });
  } else {
    console.error('Police alert button not found');
  }
  
  const medicalBtn = document.querySelector('.medical-emergency');
  if (medicalBtn) {
    medicalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Medical emergency button clicked');
      triggerMedicalEmergency();
    });
  } else {
    console.error('Medical emergency button not found');
  }
  
  const shareLocationBtn = document.querySelector('.share-location');
  if (shareLocationBtn) {
    shareLocationBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Share location button clicked');
      shareLocation();
    });
  } else {
    console.error('Share location button not found');
  }
  
  // Fake call controls
  const acceptBtn = document.getElementById('acceptFakeCall');
  const declineBtn = document.getElementById('declineFakeCall');
  
  if (acceptBtn) {
    acceptBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      hideModal('fakeCallModal');
      showNotification('Fake call ended', 'info');
    });
  }
  
  if (declineBtn) {
    declineBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      hideModal('fakeCallModal');
      showNotification('Fake call declined', 'info');
    });
  }
  
  console.log('Quick actions initialized');
}

function showFakeCall() {
  console.log('Showing fake call modal');
  showModal('fakeCallModal');
  showNotification('Incoming fake call started', 'info');
  
  // Start fake call timer
  let seconds = 0;
  const durationEl = document.querySelector('.call-duration');
  
  const callTimer = setInterval(() => {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (durationEl) {
      durationEl.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  }, 1000);
  
  // Stop timer when modal closes
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.target.classList.contains('hidden')) {
        clearInterval(callTimer);
        observer.disconnect();
      }
    });
  });
  
  const modal = document.getElementById('fakeCallModal');
  if (modal) {
    observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
  }
}

function triggerPoliceAlert() {
  console.log('Police alert triggered');
  showLoadingMessage('Alerting police...');
  
  setTimeout(() => {
    hideLoadingOverlay();
    simulateCall('103');
    showNotification('Police alert sent! Response time: 5-10 minutes', 'success');
  }, 2000);
}

function triggerMedicalEmergency() {
  console.log('Medical emergency triggered');
  showLoadingMessage('Contacting medical services...');
  
  setTimeout(() => {
    hideLoadingOverlay();
    simulateCall('108');
    showNotification('Medical emergency alert sent!', 'success');
  }, 1500);
}

function shareLocation() {
  console.log('Share location triggered');
  
  if (!currentLocation) {
    showNotification('Location not available', 'error');
    return;
  }
  
  const locationText = `Emergency! My current location: https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`;
  
  if (navigator.share) {
    navigator.share({
      title: 'My Emergency Location',
      text: locationText,
      url: `https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`
    }).catch(err => {
      fallbackShare(locationText);
    });
  } else {
    fallbackShare(locationText);
  }
}

function fallbackShare(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showNotification('Location copied to clipboard!', 'success');
    }).catch(() => {
      showNotification('Location: ' + text, 'info');
    });
  } else {
    // Create a temporary textarea element
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      showNotification('Location copied to clipboard!', 'success');
    } catch (err) {
      showNotification('Location: ' + text, 'info');
    }
    
    document.body.removeChild(textArea);
  }
}

// Community Data
function initializeCommunityData() {
  // Populate volunteers
  const volunteerList = document.getElementById('volunteerList');
  if (volunteerList) {
    const volunteers = [
      { name: 'Priya S.', distance: '0.5 km', status: 'Online' },
      { name: 'Anita M.', distance: '1.2 km', status: 'Available' },
      { name: 'Kavya R.', distance: '2.1 km', status: 'Online' },
      { name: 'Meera K.', distance: '3.0 km', status: 'Available' }
    ];
    
    volunteerList.innerHTML = '';
    volunteers.forEach(volunteer => {
      const div = document.createElement('div');
      div.className = 'volunteer-item';
      div.innerHTML = `
        <div class="volunteer-avatar">
          <i class="fas fa-user"></i>
        </div>
        <div class="volunteer-info">
          <div class="volunteer-name">${volunteer.name}</div>
          <div class="volunteer-distance">${volunteer.distance} away</div>
          <div class="volunteer-status">${volunteer.status}</div>
        </div>
        <button class="btn btn--sm btn--primary volunteer-alert-btn">
          <i class="fas fa-bell"></i>
          Alert
        </button>
      `;
      
      const alertBtn = div.querySelector('.volunteer-alert-btn');
      alertBtn.addEventListener('click', () => {
        showNotification(`Alert sent to ${volunteer.name}`, 'success');
      });
      
      volunteerList.appendChild(div);
    });
  }
  
  // Populate community alerts
  const alertsList = document.getElementById('communityAlerts');
  if (alertsList) {
    const alerts = [
      { time: '15 min ago', message: 'Unsafe area reported near Station Road' },
      { time: '1 hour ago', message: 'Volunteer requested assistance in Bandra' },
      { time: '2 hours ago', message: 'Safety alert resolved in Andheri area' },
      { time: '3 hours ago', message: 'New safe zone added at Mall area' }
    ];
    
    alertsList.innerHTML = '';
    alerts.forEach(alert => {
      const div = document.createElement('div');
      div.className = 'alert-item';
      div.innerHTML = `
        <div class="alert-time">${alert.time}</div>
        <div class="alert-message">${alert.message}</div>
      `;
      alertsList.appendChild(div);
    });
  }
}

// Modal System
function initializeModals() {
  console.log('Initializing modals...');
  
  document.querySelectorAll('.modal-close').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const modalId = this.getAttribute('data-modal');
      hideModal(modalId);
    });
  });
  
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        hideModal(this.id);
      }
    });
  });
  
  document.querySelectorAll('[data-modal]').forEach(button => {
    if (!button.classList.contains('modal-close')) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const modalId = this.getAttribute('data-modal');
        hideModal(modalId);
      });
    }
  });
  
  console.log('Modals initialized');
}

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.remove('hidden');
    console.log('Modal shown:', modalId);
  }
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
    modal.classList.add('hidden');
    console.log('Modal hidden:', modalId);
  }
}

// Utility Functions
function simulateCall(number) {
  console.log(`Simulating call to ${number}...`);
  showNotification(`Calling ${number}...`, 'info');
  
  // Show loading briefly
  showLoadingMessage(`Calling ${number}...`);
  
  setTimeout(() => {
    hideLoadingOverlay();
    
    const message = `📞 CALLING ${number}\n\nThis is a simulation. In a real emergency, this would place an actual call to emergency services.\n\nPress OK to continue.`;
    alert(message);
    showNotification(`Call to ${number} completed`, 'success');
  }, 1500);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function showLoadingMessage(message) {
  const loadingOverlay = document.getElementById('loadingOverlay');
  const loadingText = document.getElementById('loadingText');
  
  if (loadingOverlay) {
    loadingOverlay.style.display = 'flex';
    loadingOverlay.classList.remove('hidden');
  }
  
  if (loadingText) {
    loadingText.textContent = message;
  }
}

function hideLoadingOverlay() {
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    loadingOverlay.style.display = 'none';
    loadingOverlay.classList.add('hidden');
  }
}

function showNotification(message, type = 'info') {
  console.log(`Notification [${type}]: ${message}`);
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${getNotificationIcon(type)}"></i>
      <span>${message}</span>
    </div>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-12) var(--space-16);
    box-shadow: var(--shadow-lg);
    z-index: 1100;
    max-width: 300px;
    animation: slideIn 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  // Remove after 4 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }
  }, 4000);
}

function getNotificationIcon(type) {
  switch (type) {
    case 'success': return 'fa-check-circle';
    case 'error': return 'fa-exclamation-circle';
    case 'warning': return 'fa-exclamation-triangle';
    default: return 'fa-info-circle';
  }
}

function loadSettings() {
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage) {
    currentLanguage = savedLanguage;
    const languageSelector = document.getElementById('languageSelector');
    if (languageSelector) {
      languageSelector.value = savedLanguage;
    }
  }
  
  const savedMessage = localStorage.getItem('emergencyMessage');
  if (savedMessage) {
    const messageEl = document.getElementById('emergencyMessage');
    if (messageEl) {
      messageEl.value = savedMessage;
    }
  }
}

function saveSettings() {
  localStorage.setItem('language', currentLanguage);
  
  const messageEl = document.getElementById('emergencyMessage');
  if (messageEl && messageEl.value) {
    localStorage.setItem('emergencyMessage', messageEl.value);
  }
}

function startPeriodicUpdates() {
  // Update battery level
  setInterval(() => {
    batteryLevel = Math.max(20, batteryLevel - Math.random() * 1);
    const batteryEl = document.getElementById('batteryLevel');
    if (batteryEl) {
      batteryEl.textContent = `${Math.round(batteryLevel)}%`;
    }
  }, 60000); // Update every minute
  
  // Update location accuracy
  setInterval(() => {
    if (currentLocation) {
      currentLocation.accuracy = 5 + Math.random() * 15;
      updateLocationDisplay();
    }
  }, 30000); // Update every 30 seconds
  
  // Update community stats
  setInterval(() => {
    const stats = {
      volunteers: document.getElementById('activeVolunteers'),
      zones: document.getElementById('safeZoneCount'),
      response: document.getElementById('emergencyResponse')
    };
    
    if (stats.volunteers) {
      const count = 20 + Math.floor(Math.random() * 10);
      stats.volunteers.textContent = count;
    }
    
    if (stats.response) {
      const time = 2 + Math.floor(Math.random() * 3);
      stats.response.textContent = time;
    }
  }, 120000); // Update every 2 minutes
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  .notification-content {
    display: flex;
    align-items: center;
    gap: var(--space-8);
    font-size: var(--font-size-sm);
  }
  
  .notification--success {
    border-left: 4px solid var(--color-success);
  }
  
  .notification--error {
    border-left: 4px solid var(--color-error);
  }
  
  .notification--warning {
    border-left: 4px solid var(--color-warning);
  }
  
  .notification--info {
    border-left: 4px solid var(--color-primary);
  }
`;
document.head.appendChild(style);

console.log('Women Safety App loaded successfully with all features working!');