// Car Rental Page JavaScript
console.log('thue-xe.js loaded successfully');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing car rental page...');
    // Wait a bit to ensure script.js is fully loaded
    setTimeout(() => {
        initializeCarRentalPage();
    }, 100);
});

function initializeCarRentalPage() {
    console.log('Initializing car rental page...');
    console.log('currentTheme:', typeof currentTheme, currentTheme);
    console.log('currentLanguage:', typeof currentLanguage, currentLanguage);
    
    // Check if required variables exist
    if (typeof currentTheme === 'undefined' || typeof currentLanguage === 'undefined') {
        console.error('Required variables not loaded. Retrying...');
        setTimeout(initializeCarRentalPage, 200);
        return;
    }
    
    // Load all cars
    console.log('About to call loadAllCars...');
    loadAllCars();
    console.log('Called loadAllCars');
    
    // Set up event listeners
    setupFilterListeners();
    setupViewToggle();
    
    // Initialize filters
    resetFilters();
    
    // Apply current theme and language
    if (typeof applyTheme === 'function') {
        applyTheme(currentTheme);
    }
    if (typeof updateLanguage === 'function') {
        updateLanguage();
    }
}

// Extended car data for the rental page
const extendedCarsData = {
    vi: [
        // Original cars with added properties
        {
            id: 1,
            name: "Honda City",
            price: "800,000 VNĐ/ngày",
            image: "sample-car.webp",
            type: "sedan",
            seats: 4,
            priceValue: 800000,
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
            type: "suv",
            seats: 7,
            priceValue: 1500000,
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
            type: "luxury",
            seats: 5,
            priceValue: 3000000,
            features: ["5 chỗ ngồi", "Sang trọng", "Da cao cấp", "Âm thanh Burmester"],
            description: "Xe sedan hạng sang, phù hợp cho sự kiện quan trọng và tiếp khách VIP.",
            specs: {
                "Động cơ": "2.0L Turbo",
                "Nhiên liệu": "Xăng",
                "Hộp số": "9G-TRONIC",
                "Màu xe": "Đen, Trắng, Xanh"
            }
        },
        {
            id: 4,
            name: "Hyundai Tucson",
            price: "1,200,000 VNĐ/ngày",
            image: "sample-car.webp",
            type: "suv",
            seats: 5,
            priceValue: 1200000,
            features: ["5 chỗ ngồi", "AWD", "Điều hòa", "Cruise Control"],
            description: "SUV 5 chỗ hiện đại, tiết kiệm nhiên liệu, phù hợp cho cả gia đình và công việc.",
            specs: {
                "Động cơ": "2.0L",
                "Nhiên liệu": "Xăng",
                "Hộp số": "Tự động 8 cấp",
                "Màu xe": "Trắng, Đỏ, Xanh"
            }
        },
        {
            id: 5,
            name: "Toyota Hiace",
            price: "1,800,000 VNĐ/ngày",
            image: "sample-car.webp",
            type: "minivan",
            seats: 16,
            priceValue: 1800000,
            features: ["16 chỗ ngồi", "Điều hòa", "Âm thanh", "USB Charging"],
            description: "Xe 16 chỗ rộng rãi, phù hợp cho du lịch nhóm và đưa đón nhân viên.",
            specs: {
                "Động cơ": "2.7L",
                "Nhiên liệu": "Xăng",
                "Hộp số": "Tự động 6 cấp",
                "Màu xe": "Trắng, Bạc"
            }
        },
        {
            id: 6,
            name: "BMW 5 Series",
            price: "4,000,000 VNĐ/ngày",
            image: "sample-car.webp",
            type: "luxury",
            seats: 5,
            priceValue: 4000000,
            features: ["5 chỗ ngồi", "Da cao cấp", "Âm thanh Harman Kardon", "Massage Seats"],
            description: "Xe sedan hạng sang BMW, mang lại trải nghiệm lái xe đẳng cấp và sang trọng.",
            specs: {
                "Động cơ": "2.0L Twin Turbo",
                "Nhiên liệu": "Xăng",
                "Hộp số": "8-Speed Automatic",
                "Màu xe": "Đen, Trắng, Xanh Dương"
            }
        },
        {
            id: 7,
            name: "Mazda CX-5",
            price: "1,100,000 VNĐ/ngày",
            image: "sample-car.webp",
            type: "suv",
            seats: 5,
            priceValue: 1100000,
            features: ["5 chỗ ngồi", "AWD", "Skyactiv Technology", "Bose Audio"],
            description: "SUV 5 chỗ với thiết kế thể thao, công nghệ tiết kiệm nhiên liệu vượt trội.",
            specs: {
                "Động cơ": "2.5L Skyactiv",
                "Nhiên liệu": "Xăng",
                "Hộp số": "6AT",
                "Màu xe": "Đỏ, Trắng, Xám"
            }
        },
        {
            id: 8,
            name: "Ford Transit",
            price: "2,200,000 VNĐ/ngày",
            image: "sample-car.webp",
            type: "minivan",
            seats: 16,
            priceValue: 2200000,
            features: ["16 chỗ ngồi", "Điều hòa kép", "Camera 360", "Cửa trượt điện"],
            description: "Xe 16 chỗ cao cấp với trang bị hiện đại, êm ái và an toàn.",
            specs: {
                "Động cơ": "2.0L EcoBlue",
                "Nhiên liệu": "Dầu",
                "Hộp số": "Tự động 10 cấp",
                "Màu xe": "Trắng, Bạc, Đen"
            }
        }
    ],
    en: [
        {
            id: 1,
            name: "Honda City",
            price: "800,000 VND/day",
            image: "sample-car.webp",
            type: "sedan",
            seats: 4,
            priceValue: 800000,
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
            type: "suv",
            seats: 7,
            priceValue: 1500000,
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
            type: "luxury",
            seats: 5,
            priceValue: 3000000,
            features: ["5 seats", "Luxury", "Premium leather", "Burmester audio"],
            description: "Luxury sedan, perfect for important events and VIP guests.",
            specs: {
                "Engine": "2.0L Turbo",
                "Fuel": "Gasoline",
                "Transmission": "9G-TRONIC",
                "Colors": "Black, White, Blue"
            }
        },
        {
            id: 4,
            name: "Hyundai Tucson",
            price: "1,200,000 VND/day",
            image: "sample-car.webp",
            type: "suv",
            seats: 5,
            priceValue: 1200000,
            features: ["5 seats", "AWD", "A/C", "Cruise Control"],
            description: "Modern 5-seater SUV, fuel efficient, suitable for family and business use.",
            specs: {
                "Engine": "2.0L",
                "Fuel": "Gasoline",
                "Transmission": "8-speed Automatic",
                "Colors": "White, Red, Blue"
            }
        },
        {
            id: 5,
            name: "Toyota Hiace",
            price: "1,800,000 VND/day",
            image: "sample-car.webp",
            type: "minivan",
            seats: 16,
            priceValue: 1800000,
            features: ["16 seats", "A/C", "Audio system", "USB Charging"],
            description: "Spacious 16-seater van, perfect for group travel and employee transport.",
            specs: {
                "Engine": "2.7L",
                "Fuel": "Gasoline",
                "Transmission": "6-speed Automatic",
                "Colors": "White, Silver"
            }
        },
        {
            id: 6,
            name: "BMW 5 Series",
            price: "4,000,000 VND/day",
            image: "sample-car.webp",
            type: "luxury",
            seats: 5,
            priceValue: 4000000,
            features: ["5 seats", "Premium leather", "Harman Kardon audio", "Massage Seats"],
            description: "Luxury BMW sedan providing premium driving experience and sophistication.",
            specs: {
                "Engine": "2.0L Twin Turbo",
                "Fuel": "Gasoline",
                "Transmission": "8-Speed Automatic",
                "Colors": "Black, White, Blue"
            }
        },
        {
            id: 7,
            name: "Mazda CX-5",
            price: "1,100,000 VND/day",
            image: "sample-car.webp",
            type: "suv",
            seats: 5,
            priceValue: 1100000,
            features: ["5 seats", "AWD", "Skyactiv Technology", "Bose Audio"],
            description: "Sporty 5-seater SUV with superior fuel-saving technology design.",
            specs: {
                "Engine": "2.5L Skyactiv",
                "Fuel": "Gasoline",
                "Transmission": "6AT",
                "Colors": "Red, White, Gray"
            }
        },
        {
            id: 8,
            name: "Ford Transit",
            price: "2,200,000 VND/day",
            image: "sample-car.webp",
            type: "minivan",
            seats: 16,
            priceValue: 2200000,
            features: ["16 seats", "Dual A/C", "360 Camera", "Power sliding door"],
            description: "Premium 16-seater van with modern equipment, smooth and safe ride.",
            specs: {
                "Engine": "2.0L EcoBlue",
                "Fuel": "Diesel",
                "Transmission": "10-speed Automatic",
                "Colors": "White, Silver, Black"
            }
        }
    ]
};

function loadAllCars() {
    console.log('Loading all cars...');
    
    // First, test if containers exist
    const gridContainer = document.getElementById('all-cars-grid');
    const listContainer = document.getElementById('all-cars-list');
    
    console.log('Testing containers:');
    console.log('Grid container:', gridContainer);
    console.log('List container:', listContainer);
    
    if (!gridContainer) {
        console.error('Grid container not found!');
        return;
    }
    
    // Simple test - add basic content
    gridContainer.innerHTML = '<div style="padding: 20px; background: #f0f0f0; margin: 10px; border-radius: 8px;">TEST: Cars should appear here</div>';
    
    // Use currentLanguage if available, otherwise default to 'vi'
    const lang = (typeof currentLanguage !== 'undefined') ? currentLanguage : 'vi';
    const currentData = extendedCarsData[lang] || extendedCarsData.vi;
    
    console.log(`Using language: ${lang}, Cars data:`, currentData);
    console.log('Extended cars data object:', extendedCarsData);
    
    if (currentData && currentData.length > 0) {
        displayCars(currentData);
        console.log(`Loaded ${currentData.length} cars`);
    } else {
        console.error('No car data available');
        console.error('currentData:', currentData);
        console.error('lang:', lang);
    }
}

function displayCars(cars) {
    console.log('Displaying cars:', cars);
    
    const gridContainer = document.getElementById('all-cars-grid');
    const listContainer = document.getElementById('all-cars-list');
    
    console.log('Grid container:', gridContainer);
    console.log('List container:', listContainer);
    
    if (!gridContainer || !listContainer) {
        console.error('Car containers not found');
        return;
    }
    
    // Clear existing content
    gridContainer.innerHTML = '';
    listContainer.innerHTML = '';
    
    if (!cars || cars.length === 0) {
        gridContainer.innerHTML = '<p>No cars available</p>';
        listContainer.innerHTML = '<p>No cars available</p>';
        return;
    }
    
    cars.forEach((car, index) => {
        try {
            console.log(`Creating card for car ${index + 1}:`, car);
            
            // Create grid card
            const gridCardElement = createCarCardElement(car);
            gridContainer.appendChild(gridCardElement);
            
            // Create list item
            const listItem = createCarListItem(car);
            listContainer.appendChild(listItem);
        } catch (error) {
            console.error(`Error creating card for car ${car.name}:`, error);
        }
    });
    
    console.log(`Successfully displayed ${cars.length} cars`);
}

// Create car card element for grid view
function createCarCardElement(car) {
    const lang = (typeof currentLanguage !== 'undefined') ? currentLanguage : 'vi';
    const featuresText = lang === 'vi' ? 'Tính năng:' : 'Features:';
    const rentButtonText = lang === 'vi' ? 'Thuê xe này' : 'Rent this car';
    
    const cardDiv = document.createElement('div');
    cardDiv.className = 'car-card';
    cardDiv.setAttribute('role', 'button');
    cardDiv.setAttribute('tabindex', '0');
    cardDiv.setAttribute('aria-label', `View details for ${car.name}`);
    cardDiv.onclick = () => showCarDetails(car.id);
    
    cardDiv.innerHTML = `
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
    `;
    
    return cardDiv;
}

function createCarListItem(car) {
    const listItem = document.createElement('div');
    listItem.className = 'car-list-item';
    listItem.innerHTML = `
        <div class="car-list-icon">${car.image}</div>
        <div class="car-list-info">
            <h3 class="car-list-name">${car.name}</h3>
            <div class="car-list-features">
                ${car.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
            </div>
            <p class="car-description">${car.description}</p>
        </div>
        <div class="car-list-actions">
            <div class="car-list-price">${car.price}</div>
            <button class="btn-rent" onclick="rentCar(${car.id})">
                <span data-vi="Thuê ngay" data-en="Rent Now">Thuê ngay</span>
            </button>
            <button class="btn-details" onclick="showCarDetails(${car.id})">
                <span data-vi="Chi tiết" data-en="Details">Chi tiết</span>
            </button>
        </div>
    `;
    return listItem;
}

function setupFilterListeners() {
    const typeFilter = document.getElementById('car-type-filter');
    const seatsFilter = document.getElementById('seats-filter');
    const priceFilter = document.getElementById('price-filter');
    
    if (typeFilter) typeFilter.addEventListener('change', applyFilters);
    if (seatsFilter) seatsFilter.addEventListener('change', applyFilters);
    if (priceFilter) priceFilter.addEventListener('change', applyFilters);
}

function setupViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const gridContainer = document.getElementById('all-cars-grid');
    const listContainer = document.getElementById('all-cars-list');
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.dataset.view;
            
            // Update button states
            viewButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Toggle views
            if (view === 'grid') {
                gridContainer.style.display = 'grid';
                listContainer.style.display = 'none';
            } else {
                gridContainer.style.display = 'none';
                listContainer.style.display = 'flex';
            }
        });
    });
}

function applyFilters() {
    const typeFilter = document.getElementById('car-type-filter')?.value || '';
    const seatsFilter = document.getElementById('seats-filter')?.value || '';
    const priceFilter = document.getElementById('price-filter')?.value || '';
    
    const lang = (typeof currentLanguage !== 'undefined') ? currentLanguage : 'vi';
    const currentData = extendedCarsData[lang] || extendedCarsData.vi;
    
    let filteredCars = currentData.filter(car => {
        // Type filter
        if (typeFilter && car.type !== typeFilter) return false;
        
        // Seats filter
        if (seatsFilter) {
            if (seatsFilter === '9' && car.seats < 9) return false;
            if (seatsFilter !== '9' && car.seats != seatsFilter) return false;
        }
        
        // Price filter
        if (priceFilter && car.priceValue) {
            const [min, max] = priceFilter.split('-').map(p => parseInt(p) || 0);
            if (priceFilter.includes('+')) {
                if (car.priceValue <= min) return false;
            } else if (max > 0) {
                if (car.priceValue < min || car.priceValue > max) return false;
            } else if (min > 0) {
                if (car.priceValue > min) return false;
            }
        }
        
        return true;
    });
    
    displayCars(filteredCars);
}

function resetFilters() {
    const typeFilter = document.getElementById('car-type-filter');
    const seatsFilter = document.getElementById('seats-filter');
    const priceFilter = document.getElementById('price-filter');
    
    if (typeFilter) typeFilter.value = '';
    if (seatsFilter) seatsFilter.value = '';
    if (priceFilter) priceFilter.value = '';
    
    loadAllCars();
}

function rentCar(carId) {
    // This would typically open a booking form or redirect to booking page
    const lang = (typeof currentLanguage !== 'undefined') ? currentLanguage : 'vi';
    const car = (extendedCarsData[lang] || extendedCarsData.vi).find(c => c.id === carId);
    if (car) {
        alert(`Bạn đã chọn thuê xe ${car.name}. Chức năng đặt xe sẽ được triển khai sớm!`);
    }
}

// Extend the existing showCarDetails function to work with extended data
function showCarDetails(carId) {
    // Redirect to vehicle detail page instead of showing modal
    window.location.href = `vehicle-detail.html?id=${carId}`;
}