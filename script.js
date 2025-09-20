// Theme Management
let currentTheme = localStorage.getItem('theme') || 'light';
let currentLanguage = localStorage.getItem('language') || 'vi';

// Sample car data
const carsData = {
    vi: [
        {
            id: 1,
            name: "Honda City",
            price: "800,000 VNĐ/ngày",
            image: "sample-car.webp",
            features: ["4 chỗ ngồi", "Tự động", "Điều hòa", "GPS"],
            description: "Xe sedan hạng B, tiết kiệm nhiên liệu, phù hợp cho gia đình nhỏ và đi công tác.",
            specs: {
                "Động cơ": "1.5L",
                "Nhiên liệu": "Xăng",
                "Hộp số": "CVT",
                "Màu xe": "Trắng, Đen, Bạc"
            }
        },
        {
            id: 2,
            name: "Toyota Fortuner",
            price: "1,500,000 VNĐ/ngày",
            image: "sample-car.webp",
            features: ["7 chỗ ngồi", "4WD", "Điều hòa", "Camera lùi"],
            description: "SUV 7 chỗ cao cấp, phù hợp cho du lịch gia đình và đi địa hình.",
            specs: {
                "Động cơ": "2.4L Diesel",
                "Nhiên liệu": "Dầu",
                "Hộp số": "Tự động 6 cấp",
                "Màu xe": "Đen, Trắng, Bạc"
            }
        },
        {
            id: 3,
            name: "Mercedes-Benz E-Class",
            price: "3,000,000 VNĐ/ngày",
            image: "sample-car.webp",
            features: ["5 chỗ ngồi", "Sang trọng", "Da cao cấp", "Âm thanh Burmester"],
            description: "Xe sedan hạng sang, phù hợp cho sự kiện quan trọng và tiếp khách VIP.",
            specs: {
                "Động cơ": "2.0L Turbo",
                "Nhiên liệu": "Xăng",
                "Hộp số": "9G-TRONIC",
                "Màu xe": "Đen, Trắng, Xanh"
            }
        }
    ],
    en: [
        {
            id: 1,
            name: "Honda City",
            price: "800,000 VND/day",
            image: "sample-car.webp",
            features: ["4 seats", "Automatic", "A/C", "GPS"],
            description: "Compact sedan, fuel efficient, suitable for small families and business trips.",
            specs: {
                "Engine": "1.5L",
                "Fuel": "Gasoline",
                "Transmission": "CVT",
                "Colors": "White, Black, Silver"
            }
        },
        {
            id: 2,
            name: "Toyota Fortuner",
            price: "1,500,000 VND/day",
            image: "sample-car.webp",
            features: ["7 seats", "4WD", "A/C", "Backup camera"],
            description: "Premium 7-seater SUV, perfect for family trips and off-road adventures.",
            specs: {
                "Engine": "2.4L Diesel",
                "Fuel": "Diesel",
                "Transmission": "6-speed Automatic",
                "Colors": "Black, White, Silver"
            }
        },
        {
            id: 3,
            name: "Mercedes-Benz E-Class",
            price: "3,000,000 VND/day",
            image: "sample-car.webp",
            features: ["5 seats", "Luxury", "Premium leather", "Burmester audio"],
            description: "Luxury sedan, perfect for important events and VIP guests.",
            specs: {
                "Engine": "2.0L Turbo",
                "Fuel": "Gasoline",
                "Transmission": "9G-TRONIC",
                "Colors": "Black, White, Blue"
            }
        }
    ]
};

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeLanguage();
    renderCars();
    setupEventListeners();
    setupIntersectionObserver();
    setupConsultationForm();
    setupFormReset();
    
    // Performance: Preload critical resources
    preloadImages();
});

// Theme functions
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const themeIcon = document.querySelector('.theme-icon');
    themeIcon.textContent = currentTheme === 'light' ? '🌙' : '☀️';
}

// Language functions
function initializeLanguage() {
    updateLanguageDisplay();
    updateContent();
}

function toggleLanguage() {
    const languageSelect = document.getElementById('language');
    if (languageSelect) {
        currentLanguage = languageSelect.value;
        localStorage.setItem('language', currentLanguage);
        updateLanguageDisplay();
        updateContent();
        renderCars(); // Re-render cars with new language
    }
}

function updateLanguageDisplay() {
    // Update the select dropdown to show current language
    const languageSelect = document.getElementById('language');
    if (languageSelect) {
        languageSelect.value = currentLanguage;
    }
    
    // Update the old current-lang element if it still exists
    const currentLangElement = document.getElementById('current-lang');
    if (currentLangElement) {
        currentLangElement.textContent = currentLanguage.toUpperCase();
    }
    
    document.documentElement.lang = currentLanguage;
}

// Comprehensive language update function
function updateLanguage() {
    updateLanguageDisplay();
    updateContent();
}

function updateContent() {
    const elements = document.querySelectorAll('[data-vi][data-en]');
    elements.forEach(element => {
        const content = element.getAttribute(`data-${currentLanguage}`);
        if (content) {
            element.textContent = content;
        }
    });
    
    // Update placeholders
    updatePlaceholders();
}

function updatePlaceholders() {
    // Update consultation form placeholders
    const consultationPlaceholders = {
        vi: {
            'fullName': "Họ và tên",
            'phoneNumber': "Số điện thoại"
        },
        en: {
            'fullName': "Full Name", 
            'phoneNumber': "Phone Number"
        }
    };
    
    Object.keys(consultationPlaceholders[currentLanguage]).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.placeholder = consultationPlaceholders[currentLanguage][id];
        }
    });

    // Update booking form placeholders (if exists)
    const bookingPlaceholders = {
        vi: {
            'customer-name': "Họ và tên",
            'customer-phone': "Số điện thoại"
        },
        en: {
            'customer-name': "Full Name",
            'customer-phone': "Phone Number"
        }
    };
    
    Object.keys(bookingPlaceholders[currentLanguage]).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.placeholder = bookingPlaceholders[currentLanguage][id];
        }
    });

    // Update consultation form select options
    updateCarTypeOptions();
    
    // Update car type dropdown options
    const carTypeSelect = document.getElementById('car-type');
    if (carTypeSelect) {
        const options = carTypeSelect.querySelectorAll('option');
        const carTypeTexts = {
            vi: ["Dòng xe quan tâm", "Sedan", "SUV", "Xe sang", "Xe 16 chỗ"],
            en: ["Car type of interest", "Sedan", "SUV", "Luxury", "16-seater"]
        };
        
        options.forEach((option, index) => {
            if (carTypeTexts[currentLanguage][index]) {
                option.textContent = carTypeTexts[currentLanguage][index];
            }
        });
    }
}

// Car rendering functions
function renderCars() {
    const carsGrid = document.getElementById('cars-grid');
    const cars = carsData[currentLanguage];
    
    carsGrid.innerHTML = cars.map(car => createCarCard(car)).join('');
    
    // Add click listeners to car cards
    addCarCardListeners();
}

function createCarCard(car) {
    const featuresText = currentLanguage === 'vi' ? 'Tính năng:' : 'Features:';
    const rentButtonText = currentLanguage === 'vi' ? 'Thuê xe này' : 'Rent this car';
    
    return `
        <div class="car-card" onclick="showCarDetail(${car.id})" role="button" tabindex="0" aria-label="View details for ${car.name}">
            <div class="car-image" aria-hidden="true">
                <img src="${car.image}" alt="${car.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px 8px 0 0;">
            </div>
            <div class="car-info">
                <h3 class="car-name">${car.name}</h3>
                <div class="car-price">${car.price}</div>
                <p><strong>${featuresText}</strong></p>
                <ul class="car-features">
                    ${car.features.map(feature => `<li>• ${feature}</li>`).join('')}
                </ul>
                <button class="rent-button" onclick="event.stopPropagation(); rentCar(${car.id})" aria-label="Rent ${car.name}">
                    ${rentButtonText}
                </button>
            </div>
        </div>
    `;
}

function addCarCardListeners() {
    const carCards = document.querySelectorAll('.car-card');
    carCards.forEach(card => {
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
}

// Car detail modal functions
function showCarDetail(carId) {
    const car = carsData[currentLanguage].find(c => c.id === carId);
    if (!car) return;
    
    const modal = document.getElementById('car-modal');
    const content = document.getElementById('car-detail-content');
    
    const specsText = currentLanguage === 'vi' ? 'Thông số kỹ thuật:' : 'Specifications:';
    const rentButtonText = currentLanguage === 'vi' ? 'Thuê xe này ngay' : 'Rent this car now';
    
    content.innerHTML = `
        <div class="car-detail">
            <div class="car-detail-image">${car.image}</div>
            <h2>${car.name}</h2>
            <div class="car-detail-price">${car.price}</div>
            <p class="car-description">${car.description}</p>
            
            <h3>${specsText}</h3>
            <div class="car-specs">
                ${Object.entries(car.specs).map(([key, value]) => 
                    `<div class="spec-item"><strong>${key}:</strong> ${value}</div>`
                ).join('')}
            </div>
            
            <button class="rent-button" onclick="rentCar(${car.id})" style="margin-top: 20px;">
                ${rentButtonText}
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Focus management for accessibility
    content.querySelector('h2').focus();
}

function rentCar(carId) {
    const car = carsData[currentLanguage].find(c => c.id === carId);
    const message = currentLanguage === 'vi' 
        ? `Cảm ơn bạn đã quan tâm đến ${car.name}. Chúng tôi sẽ liên hệ với bạn sớm nhất!`
        : `Thank you for your interest in ${car.name}. We will contact you soon!`;
    
    alert(message);
    closeModal();
}

function closeModal() {
    const modal = document.getElementById('car-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Event listeners setup
function setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Modal close functionality
    const modal = document.getElementById('car-modal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Keyboard navigation for modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Booking form submission
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('customer-name').value,
                phone: document.getElementById('customer-phone').value,
                carType: document.getElementById('car-type').value,
                pickupDate: document.getElementById('pickup-date').value,
                returnDate: document.getElementById('return-date').value
            };
            
            // Validate dates
            const pickup = new Date(formData.pickupDate);
            const returnDate = new Date(formData.returnDate);
            const today = new Date();
            
            if (pickup < today) {
                const errorMsg = currentLanguage === 'vi' 
                    ? 'Ngày đi không thể là ngày trong quá khứ!'
                    : 'Pickup date cannot be in the past!';
                alert(errorMsg);
                return;
            }
            
            if (returnDate <= pickup) {
                const errorMsg = currentLanguage === 'vi' 
                    ? 'Ngày về phải sau ngày đi!'
                    : 'Return date must be after pickup date!';
                alert(errorMsg);
                return;
            }
            
            const successMessage = currentLanguage === 'vi' 
                ? `Cảm ơn ${formData.name}! Chúng tôi đã nhận được thông tin đặt xe ${formData.carType} từ ${formData.pickupDate} đến ${formData.returnDate}. Nhân viên sẽ liên hệ với bạn qua số ${formData.phone} trong thời gian sớm nhất.`
                : `Thank you ${formData.name}! We have received your booking for ${formData.carType} from ${formData.pickupDate} to ${formData.returnDate}. Our staff will contact you at ${formData.phone} as soon as possible.`;
            
            alert(successMessage);
            bookingForm.reset();
        });
        
        // Set minimum date to today for date inputs
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('pickup-date').min = today;
        document.getElementById('return-date').min = today;
        
        // Auto-update return date minimum when pickup date changes
        document.getElementById('pickup-date').addEventListener('change', function() {
            const pickupDate = this.value;
            const returnDateInput = document.getElementById('return-date');
            returnDateInput.min = pickupDate;
            
            // Clear return date if it's before the new pickup date
            if (returnDateInput.value && returnDateInput.value <= pickupDate) {
                returnDateInput.value = '';
            }
        });
    }
}

// Intersection Observer for animations
function setupIntersectionObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.car-card, .section-title');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Performance optimization: Preload images
function preloadImages() {
    // In a real application, you would preload actual car images
    const imagePaths = [
        // Add your actual image paths here
    ];
    
    imagePaths.forEach(path => {
        const img = new Image();
        img.src = path;
    });
}

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Consultation Form Functions
function setupConsultationForm() {
    const consultationForm = document.getElementById('consultation-form');
    if (!consultationForm) return;

    consultationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            fullName: document.getElementById('fullName').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            carType: document.getElementById('carType').value,
            departureDate: document.getElementById('departureDate').value,
            returnDate: document.getElementById('returnDate').value
        };

        // Validation
        if (!validateConsultationForm(formData)) {
            return;
        }

        // Success message
        const successMessage = currentLanguage === 'vi'
            ? `Cảm ơn ${formData.fullName}! Chúng tôi đã nhận được thông tin tư vấn của bạn cho ${getCarTypeText(formData.carType)} từ ngày ${formatDate(formData.departureDate)} đến ${formatDate(formData.returnDate)}. Nhân viên sẽ liên hệ với bạn qua số ${formData.phoneNumber} trong thời gian sớm nhất.`
            : `Thank you ${formData.fullName}! We have received your consultation request for ${getCarTypeText(formData.carType)} from ${formatDate(formData.departureDate)} to ${formatDate(formData.returnDate)}. Our staff will contact you at ${formData.phoneNumber} as soon as possible.`;
        
        alert(successMessage);
        consultationForm.reset();
        clearFormErrors();
    });

    // Set minimum date to today for date inputs
    const today = new Date().toISOString().split('T')[0];
    const departureInput = document.getElementById('departureDate');
    const returnInput = document.getElementById('returnDate');
    
    if (departureInput) departureInput.min = today;
    if (returnInput) returnInput.min = today;

    // Auto-update return date minimum when departure date changes
    if (departureInput && returnInput) {
        departureInput.addEventListener('change', function() {
            const departureDate = this.value;
            returnInput.min = departureDate;
            
            // Clear return date if it's before the new departure date
            if (returnInput.value && returnInput.value <= departureDate) {
                returnInput.value = '';
            }
        });
    }
}

function validateConsultationForm(formData) {
    // Clear previous errors
    clearFormErrors();
    
    let isValid = true;
    const requiredFields = {
        fullName: {
            vi: 'Vui lòng nhập họ và tên',
            en: 'Please enter your full name'
        },
        phoneNumber: {
            vi: 'Vui lòng nhập số điện thoại',
            en: 'Please enter your phone number'
        },
        carType: {
            vi: 'Vui lòng chọn loại xe',
            en: 'Please select car type'
        },
        departureDate: {
            vi: 'Vui lòng chọn ngày đi',
            en: 'Please select departure date'
        },
        returnDate: {
            vi: 'Vui lòng chọn ngày về',
            en: 'Please select return date'
        }
    };
    
    // Check required fields
    for (let [field, messages] of Object.entries(requiredFields)) {
        if (!formData[field] || formData[field].trim() === '') {
            showFieldError(field, messages[currentLanguage]);
            isValid = false;
        }
    }

    // Name validation (at least 2 characters)
    if (formData.fullName && formData.fullName.trim().length < 2) {
        const errorMsg = currentLanguage === 'vi'
            ? 'Họ và tên phải có ít nhất 2 ký tự'
            : 'Full name must be at least 2 characters';
        showFieldError('fullName', errorMsg);
        isValid = false;
    }

    // Phone validation
    if (formData.phoneNumber) {
        const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
        if (!phoneRegex.test(formData.phoneNumber)) {
            const errorMsg = currentLanguage === 'vi'
                ? 'Số điện thoại không hợp lệ (10-15 chữ số)'
                : 'Invalid phone number (10-15 digits)';
            showFieldError('phoneNumber', errorMsg);
            isValid = false;
        }
    }

    // Date validation
    if (formData.departureDate && formData.returnDate) {
        const departure = new Date(formData.departureDate);
        const returnDate = new Date(formData.returnDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (departure < today) {
            const errorMsg = currentLanguage === 'vi'
                ? 'Ngày đi phải từ hôm nay trở đi'
                : 'Departure date must be from today onwards';
            showFieldError('departureDate', errorMsg);
            isValid = false;
        }

        if (returnDate <= departure) {
            const errorMsg = currentLanguage === 'vi'
                ? 'Ngày về phải sau ngày đi'
                : 'Return date must be after departure date';
            showFieldError('returnDate', errorMsg);
            isValid = false;
        }
    }

    return isValid;
}

function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(fieldId);
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    if (inputElement) {
        inputElement.style.borderColor = '#e74c3c';
    }
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    const inputElements = document.querySelectorAll('.field-input, .field-select');
    
    errorElements.forEach(element => {
        element.textContent = '';
        element.classList.remove('show');
    });
    
    inputElements.forEach(element => {
        element.style.borderColor = '';
    });
}

function updateCarTypeOptions() {
    const carTypeSelect = document.getElementById('carType');
    if (!carTypeSelect) return;

    const options = carTypeSelect.querySelectorAll('option');
    const carTypeTexts = {
        vi: {
            '': 'Chọn loại xe',
            'sedan': 'Sedan (4 chỗ)',
            'suv-5': 'SUV (5 chỗ)', 
            'suv-7': 'SUV (7 chỗ)',
            'minivan': 'Minivan (16 chỗ)',
            'luxury': 'Xe sang'
        },
        en: {
            '': 'Select car type',
            'sedan': 'Sedan (4 seats)',
            'suv-5': 'SUV (5 seats)',
            'suv-7': 'SUV (7 seats)', 
            'minivan': 'Minivan (16 seats)',
            'luxury': 'Luxury car'
        }
    };

    options.forEach(option => {
        const value = option.value;
        if (carTypeTexts[currentLanguage][value]) {
            option.textContent = carTypeTexts[currentLanguage][value];
        }
    });
}

function getCarTypeText(value) {
    const carTypeTexts = {
        vi: {
            'sedan': 'Sedan (4 chỗ)',
            'suv-5': 'SUV (5 chỗ)',
            'suv-7': 'SUV (7 chỗ)', 
            'minivan': 'Minivan (16 chỗ)',
            'luxury': 'Xe sang'
        },
        en: {
            'sedan': 'Sedan (4 seats)',
            'suv-5': 'SUV (5 seats)',
            'suv-7': 'SUV (7 seats)',
            'minivan': 'Minivan (16 seats)', 
            'luxury': 'Luxury car'
        }
    };
    
    return carTypeTexts[currentLanguage][value] || value;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return currentLanguage === 'vi'
        ? date.toLocaleDateString('vi-VN')
        : date.toLocaleDateString('en-US');
}

function setupFormReset() {
    const resetBtn = document.querySelector('.reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const form = document.getElementById('consultation-form');
            if (form) {
                form.reset();
                clearFormErrors();
            }
        });
    }
}

// Analytics and performance monitoring
function trackPageView(page) {
    // Integrate with your analytics service
    console.log(`Page view: ${page}`);
}

function trackEvent(category, action, label) {
    // Integrate with your analytics service
    console.log(`Event: ${category} - ${action} - ${label}`);
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // Send error to monitoring service
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart);
        }, 0);
    });
}