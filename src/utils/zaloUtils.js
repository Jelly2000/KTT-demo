/**
 * Zalo messaging utilities for sending user requests and notifications
 * Migrated from Telegram to use server-side Zalo integration
 */

import axios from "axios";

// Server Configuration
const ZALO_SERVER_URL = import.meta.env.VITE_SERVER_URL;

/**
 * Get Vietnamese translation for Zalo messages
 * Always returns Vietnamese text regardless of current language setting
 * @param {string} key - Translation key
 * @returns {string} - Vietnamese translation
 */
// const getVietnameseText = (key) => {
//   return viTranslations[key] || key;
// };

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
const sendZaloMessage = async (message, url) => {
  try {
    const response = await axios.post(
      `${ZALO_SERVER_URL}/${url}`,
      message,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const result = response.data;

    if (result.success) {
      return {
        success: true,
        message: result.message,
        messageId: result.messageId,
      };
    } else {
      return {
        success: false,
        error: result.error || 'Unknown error occurred',
      };
    }
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.error ||
        'Network error or server unavailable',
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
    return `${cleanPhone}`;
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
  console.log('Original car rental request data:', requestData);

  const formattedData = {
    vehicleName,
    customerName,
    customerPhone,
    customerEmail: customerEmail || 'Chưa cung cấp',
    pricePerDay: pricePerDay,
    startDate,
    endDate,
    totalDays,
    estimatedCost,
    additionalNotes: translateToVietnamese(additionalNotes) || 'Khách hàng muốn được tư vấn thêm',
    source: getVietnameseSource(source)

  }
  return await sendZaloMessage(formattedData, 'api/zalo/car-rental-request');
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
  console.log('Original consultation request data:', formData);
  const formattedData = {
    name,
    phone,
    email: email || 'Chưa cung cấp',
    subject: translateToVietnamese(subject) || 'Tư vấn chung',
    message: translateToVietnamese(message) || 'Khách hàng muốn được tư vấn',
    source: getVietnameseSource(source)
  }
  return await sendZaloMessage(formattedData, 'api/zalo/consultation-request');
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

  return await sendZaloMessage(notificationMessage, 'api/zalo/send-message');
};

/**
 * Send health check ping to server
 * @returns {Promise<boolean>} - Returns true if health check successful
 */
const sendHealthCheck = async () => {
  try {
    const response = await fetch(`${ZALO_SERVER_URL}/api/zalo/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log('✅ Health check successful:', new Date().toISOString());
      return true;
    } else {
      console.warn('⚠️ Health check failed with status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Health check error:', error.message);
    return false;
  }
};

export default {
  sendCarRentalRequest,
  sendConsultationRequest,
  sendNotification,
  formatPhoneNumber,
  sendHealthCheck
};