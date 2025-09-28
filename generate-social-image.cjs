const fs = require('fs');

// Create a simple HTML that generates a proper social image
const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>KTT Car Social Image</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            width: 1200px;
            height: 630px;
            background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-family: Arial, sans-serif;
            color: white;
            overflow: hidden;
        }
        .main-title {
            font-size: 72px;
            font-weight: bold;
            margin: 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .subtitle {
            font-size: 48px;
            font-weight: bold;
            margin: 10px 0;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }
        .features {
            font-size: 32px;
            margin: 20px 0;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }
        .cars {
            font-size: 60px;
            margin: 20px 0;
        }
        .pricing {
            font-size: 36px;
            font-weight: bold;
            color: #FFD700;
            margin: 20px 0;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }
        .brands {
            font-size: 24px;
            margin: 10px 0;
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="main-title">KTT CAR</div>
    <div class="subtitle">THUÊ XE TỰ LÁI TP.HCM</div>
    <div class="features">Giá rẻ • Uy tín • Giao tận nơi</div>
    <div class="cars">🚗 🚙 🚕</div>
    <div class="pricing">Từ 800k/ngày - Đặt ngay!</div>
    <div class="brands">Hyundai • Kia • Mercedes • MG • Mitsubishi</div>
</body>
</html>`;

fs.writeFileSync('social-image-template.html', html);
// console.log('Created social-image-template.html');
// console.log('Open this file in browser and take a 1200x630 screenshot, or use a headless browser to generate PNG');