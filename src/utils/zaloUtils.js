/**
 * Zalo messaging utilities for sending user requests and notifications
 * Migrated from Telegram to use server-side Zalo integration
 */
import i18n from '../i18n.js';
import viTranslations from '../locales/vi.json';

// Server Configuration
const ZALO_SERVER_URL = import.meta.env.VITE_ZALO_SERVER_URL || 'https://ktt-server.onrender.com';

/**
 * Get Vietnamese translation for Zalo messages
 * Always returns Vietnamese text regardless of current language setting
 * @param {string} key - Translation key
 * @returns {string} - Vietnamese translation
 */
const getVietnameseText = (key) => {
  return viTranslations[key] || key;
};

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
 * Send message to Zalo via server endpoint
 * @param {string} message - Message to send
 * @returns {Promise<{success: boolean, message?: string, error?: string}>} - Response object
 */
const sendZaloMessage = async (message) => {
  try {
    const response = await fetch(`${ZALO_SERVER_URL}/send-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message.substring(0, 2000) // Ensure message doesn't exceed Zalo limit
      }),
    });

    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('Message sent successfully:', result.message);
      return {
        success: true,
        message: result.message,
        messageId: result.messageId
      };
    } else {
      console.error('Failed to send message:', result.error);
      return {
        success: false,
        error: result.error || 'Unknown error occurred'
      };
    }
  } catch (error) {
    console.error('Error sending Zalo message:', error);
    return {
      success: false,
      error: 'Network error or server unavailable'
    };
  }
};

/**
 * Format phone number for display
 * @param {string} phone - Phone number
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Format Vietnamese phone numbers
  if (cleanPhone.startsWith('84')) {
    return `+${cleanPhone}`;
  } else if (cleanPhone.startsWith('0')) {
    return cleanPhone.replace(/(\d{4})(\d{3})(\d{3})/, '$1.$2.$3');
  }
  
  return phone;
};

/**
 * Format and send car rental request to Zalo
 * @param {Object} requestData - Rental request data
 * @returns {Promise<{success: boolean, message?: string, error?: string}>} - Response object
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

  const message = `🚗 YÊU CẦU THUÊ XE

👤 THÔNG TIN KHÁCH HÀNG
• Tên: ${customerName}
• Điện thoại: ${formatPhoneNumber(customerPhone)}
• Email: ${customerEmail || 'Chưa cung cấp'}

🚙 THÔNG TIN XE
• Loại xe: ${vehicleName}
• Giá thuê: ${pricePerDay?.toLocaleString('vi-VN') || 'Chưa xác định'}đ/ngày

📅 THỜI GIAN THUÊ
• Ngày nhận xe: ${startDate}
• Ngày trả xe: ${endDate}
• Số ngày: ${totalDays} ngày
• Tổng chi phí dự kiến: ${estimatedCost?.toLocaleString('vi-VN') || 'Chưa xác định'}đ

📝 GHI CHÚ THÊM
${translateToVietnamese(additionalNotes) || 'Khách hàng muốn được tư vấn thêm'}

📍 Nguồn: ${getVietnameseSource(source)}
⏰ Thời gian: ${new Date().toLocaleString('vi-VN')}`;

  return await sendZaloMessage(message);
};

/**
 * Send consultation form submission to Zalo
 * @param {Object} formData - Form submission data
 * @returns {Promise<{success: boolean, message?: string, error?: string}>} - Response object
 */
export const sendConsultationRequest = async (formData) => {
  const {
    name,
    phone,
    email,
    subject,
    message,
    source = 'Website Contact Form'
  } = formData;

  const consultationMessage = `📞 YÊU CẦU TƯ VẤN

👤 THÔNG TIN KHÁCH HÀNG
• Tên: ${name}
• Điện thoại: ${formatPhoneNumber(phone)}
• Email: ${email || 'Chưa cung cấp'}

📋 CHỦ ĐỀ
${translateToVietnamese(subject) || 'Tư vấn chung'}

💬 NỘI DUNG
${translateToVietnamese(message) || 'Khách hàng muốn được tư vấn'}

📍 Nguồn: ${getVietnameseSource(source)}
⏰ Thời gian: ${new Date().toLocaleString('vi-VN')}`;

  return await sendZaloMessage(consultationMessage);
};

/**
 * Send simple notification to Zalo
 * @param {string} title - Notification title
 * @param {string} content - Notification content
 * @param {string} source - Source of notification
 * @returns {Promise<{success: boolean, message?: string, error?: string}>} - Response object
 */
export const sendNotification = async (title, content, source = 'Website') => {
  const notificationMessage = `🔔 ${title}

${content}

📍 Nguồn: ${getVietnameseSource(source)}
⏰ Thời gian: ${new Date().toLocaleString('vi-VN')}`;

  return await sendZaloMessage(notificationMessage);
};

export default {
  sendCarRentalRequest,
  sendConsultationRequest,
  sendNotification,
  formatPhoneNumber
};