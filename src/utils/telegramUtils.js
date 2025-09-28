/**
 * Telegram Bot utilities for sending user requests and notifications
 */
import i18n from '../i18n.js';

// Server Configuration
const TELEGRAM_SERVER_URL = 'https://kttnotifyserver.netlify.aps';

/**
 * Convert English source text to Vietnamese
 * @param {string} sourceText - Source text in English
 * @returns {string} - Vietnamese translation
 */
const getVietnameseSource = (sourceText) => {
  const sourceMap = {
    'Homepage Consultation Form': 'Form Tư Vấn Trang Chủ',
    'Homepage Consultation': 'Tư Vấn Trang Chủ',
    'Contact Form': 'Form Liên Hệ',
    'Website Contact Form': 'Form Liên Hệ Website',
    'Contact Page': 'Trang Liên Hệ',
    'Rent Car Modal': 'Modal Thuê Xe',
    'Car Rental Request': 'Yêu Cầu Thuê Xe',
    'Website': 'Website',
    'Test Suite': 'Bộ Test'
  };
  return sourceMap[sourceText] || sourceText;
};

/**
 * Translate common English phrases to Vietnamese
 * @param {string} text - Text that might contain English phrases
 * @returns {string} - Text with Vietnamese translations
 */
const translateToVietnamese = (text) => {
  if (!text) return text;

  const translations = {
    // Common form subjects
    'car_rental': 'Hỏi về thuê xe',
    'technical_support': 'Tư Vấn Kỹ Thuật',
    'complaint': 'Phàn nàn',
    'suggestion': 'Góp ý',
    'other': 'Khác',
    
    // Common phrases
    'No subject': 'Không có chủ đề',
    'No message': 'Không có tin nhắn',
    'Unknown Vehicle': 'Xe không xác định',
    'Not specified': 'Chưa chỉ định',
    'No additional notes': 'Không có ghi chú thêm'
  };
  
  let translatedText = text;
  Object.keys(translations).forEach(englishPhrase => {
    const regex = new RegExp(englishPhrase, 'gi');
    translatedText = translatedText.replace(regex, translations[englishPhrase]);
  });
  
  return translatedText;
};

/**
 * Send message to Telegram bot via server endpoint
 * @param {string} message - Message to send
 * @returns {Promise<boolean>} - Success status
 */
const sendTelegramMessage = async (message) => {
  try {
    const response = await fetch(`${TELEGRAM_SERVER_URL}/send-telegram-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message
      }),
    });

    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('Message sent successfully:', result.message);
      return true;
    } else {
      console.error('Failed to send message:', result.error);
      return false;
    }
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return false;
  }
};

/**
 * Format and send car rental request to Telegram
 * @param {Object} requestData - Rental request data
 * @returns {Promise<boolean>} - Success status
 */
export const sendCarRentalRequest = async (requestData) => {
  const {
    vehicleName,
    customerName,
    customerPhone,
    customerEmail,
    startDate,
    endDate,
    additionalNotes,
    pricePerDay,
    totalDays,
    estimatedCost,
    source = 'Website'
  } = requestData;



  const message = `
🚗 **${i18n.t('telegram_rental_title')}**

👤 **${i18n.t('telegram_customer_info')}**
• ${i18n.t('telegram_name')} ${customerName}
• ${i18n.t('telegram_phone')} ${customerPhone}
• ${i18n.t('telegram_email')} ${customerEmail || i18n.t('telegram_no_email')}

🚙 **${i18n.t('telegram_vehicle_info')}**
• ${i18n.t('telegram_vehicle')} ${vehicleName}
• ${i18n.t('telegram_price')} ${pricePerDay?.toLocaleString('vi-VN')}đ/ngày

📅 **${i18n.t('telegram_rental_period')}**
• ${i18n.t('telegram_pickup_date')} ${startDate}
• ${i18n.t('telegram_return_date')} ${endDate}
• Số ngày: ${totalDays} ngày
• Tổng chi phí dự kiến: ${estimatedCost?.toLocaleString('vi-VN')}đ

📝 **${i18n.t('telegram_additional_notes')}**
${translateToVietnamese(additionalNotes) || i18n.t('telegram_default_consultation')}

📍 **${i18n.t('telegram_source')}** ${getVietnameseSource(source)}

⏰ Thời gian yêu cầu: ${new Date().toLocaleString('vi-VN')}
  `;

  return await sendTelegramMessage(message.trim());
};

/**
 * Format and send contact form submission to Telegram
 * @param {Object} contactData - Contact form data
 * @returns {Promise<boolean>} - Success status
 */
export const sendContactFormSubmission = async (contactData) => {
  const {
    name,
    phone,
    email,
    subject,
    message,
    source = 'Website Contact Form'
  } = contactData;



  const telegramMessage = `
📞 **${i18n.t('telegram_contact_title')}**

👤 **${i18n.t('telegram_customer_info')}**
• ${i18n.t('telegram_name')} ${name}
• ${i18n.t('telegram_phone')} ${phone}
• ${i18n.t('telegram_email')} ${email || i18n.t('telegram_no_email')}

📋 **${i18n.t('telegram_contact_content')}**
• ${i18n.t('telegram_subject')} ${translateToVietnamese(subject) || i18n.t('telegram_no_subject')}
• ${i18n.t('telegram_message')} ${translateToVietnamese(message)}

📍 **${i18n.t('telegram_source')}** ${getVietnameseSource(source)}

⏰ ${i18n.t('telegram_request_time')} ${new Date().toLocaleString('vi-VN')}
  `;

  return await sendTelegramMessage(telegramMessage.trim());
};

/**
 * Format and send consultation request to Telegram
 * @param {Object} consultationData - Consultation request data
 * @returns {Promise<boolean>} - Success status
 */
export const sendConsultationRequest = async (consultationData) => {
  const {
    name,
    phone,
    email,
    serviceType,
    message,
    source = 'Homepage Consultation'
  } = consultationData;

  // Convert source to Vietnamese
  const getVietnameseSource = (sourceText) => {
    const sourceMap = {
      'Homepage Consultation Form': 'Form Tư Vấn Trang Chủ',
      'Homepage Consultation': 'Tư Vấn Trang Chủ', 
      'Contact Form': 'Form Liên Hệ',
      'Website Contact Form': 'Form Liên Hệ Website',
      'Contact Page': 'Trang Liên Hệ',
      'Rent Car Modal': 'Modal Thuê Xe',
      'Car Rental Request': 'Yêu Cầu Thuê Xe'
    };
    return sourceMap[sourceText] || sourceText;
  };

  const telegramMessage = `
💼 **${i18n.t('telegram_consultation_title')}**

👤 **${i18n.t('telegram_customer_info')}**
• ${i18n.t('telegram_name')} ${name}
• ${i18n.t('telegram_phone')} ${phone}
• ${i18n.t('telegram_email')} ${email || i18n.t('telegram_no_email')}

🔧 **${i18n.t('telegram_service_interest')}**
• ${i18n.t('telegram_service_type')} ${translateToVietnamese(serviceType) || i18n.t('telegram_rental_service')}

📝 **${i18n.t('telegram_content')}**
${translateToVietnamese(message) || i18n.t('telegram_default_consultation')}

📍 **${i18n.t('telegram_source')}** ${getVietnameseSource(source)}

⏰ ${i18n.t('telegram_request_time')} ${new Date().toLocaleString('vi-VN')}
  `;

  return await sendTelegramMessage(telegramMessage.trim());
};

/**
 * Send general notification to Telegram
 * @param {string} title - Notification title
 * @param {string} content - Notification content
 * @param {string} type - Notification type (info, warning, error, success)
 * @returns {Promise<boolean>} - Success status
 */
export const sendTelegramNotification = async (title, content, type = 'info') => {
  const icons = {
    info: 'ℹ️',
    warning: '⚠️',
    error: '❌',
    success: '✅'
  };

  const message = `
${icons[type]} **${title}**

${content}

⏰ ${new Date().toLocaleString('vi-VN')}
  `;

  return await sendTelegramMessage(message.trim());
};

/**
 * Format phone number for better display
 * @param {string} phone - Phone number
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  // Simply return the phone as-is since server handles formatting
  return phone;
};

/**
 * Validate Telegram server configuration
 * @returns {boolean} - Configuration status
 */
export const validateTelegramConfig = () => {
  return !!TELEGRAM_SERVER_URL;
};

export default {
  sendCarRentalRequest,
  sendContactFormSubmission,
  sendConsultationRequest,
  sendTelegramNotification,
  validateTelegramConfig,
  formatPhoneNumber
};