/**
 * Telegram Bot utilities for sending user requests and notifications
 */

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID || '';

/**
 * Send message to Telegram bot
 * @param {string} message - Message to send
 * @returns {Promise<boolean>} - Success status
 */
const sendTelegramMessage = async (message) => {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram bot credentials not configured');
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const result = await response.json();
    return result.ok;
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
    estimatedCost
  } = requestData;

  const message = `
🚗 <b>YÊU CẦU THUÊ XE MỚI</b>

👤 <b>Thông tin khách hàng:</b>
• Tên: ${customerName}
• Số điện thoại: ${customerPhone}
• Email: ${customerEmail || 'Không cung cấp'}

🚙 <b>Thông tin xe:</b>
• Xe: ${vehicleName}
• Giá thuê: ${pricePerDay?.toLocaleString('vi-VN')}đ/ngày

📅 <b>Thời gian thuê:</b>
• Ngày nhận: ${startDate}
• Ngày trả: ${endDate}
• Số ngày: ${totalDays} ngày
• Tổng chi phí dự kiến: ${estimatedCost?.toLocaleString('vi-VN')}đ

📝 <b>Ghi chú:</b>
${additionalNotes || 'Không có ghi chú thêm'}

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
📞 <b>LIÊN HỆ MỚI TỪ WEBSITE</b>

👤 <b>Thông tin khách hàng:</b>
• Tên: ${name}
• Số điện thoại: ${phone}
• Email: ${email || 'Không cung cấp'}

📋 <b>Nội dung liên hệ:</b>
• Chủ đề: ${subject || 'Không có chủ đề'}
• Tin nhắn: ${message}

📍 <b>Nguồn:</b> ${source}

⏰ Thời gian: ${new Date().toLocaleString('vi-VN')}
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

  const telegramMessage = `
💼 <b>YÊU CẦU TU VẤN MỚI</b>

👤 <b>Thông tin khách hàng:</b>
• Tên: ${name}
• Số điện thoại: ${phone}
• Email: ${email || 'Không cung cấp'}

🔧 <b>Dịch vụ quan tâm:</b>
• Loại dịch vụ: ${serviceType || 'Thuê xe'}

📝 <b>Nội dung:</b>
${message || 'Khách hàng muốn được tư vấn thêm'}

📍 <b>Nguồn:</b> ${source}

⏰ Thời gian yêu cầu: ${new Date().toLocaleString('vi-VN')}
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
${icons[type]} <b>${title}</b>

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
  // Remove all non-digit characters
  const cleaned = phone?.replace(/\D/g, '');
  
  // Format Vietnamese phone numbers
//   if (cleaned.startsWith('84')) {
//     return `+${cleaned}`;
//   } else if (cleaned.startsWith('0')) {
//     return `+84${cleaned.slice(1)}`;
//   }
  
  return phone;
};

/**
 * Validate Telegram bot configuration
 * @returns {boolean} - Configuration status
 */
export const validateTelegramConfig = () => {
  return !!(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID);
};

export default {
  sendCarRentalRequest,
  sendContactFormSubmission,
  sendConsultationRequest,
  sendTelegramNotification,
  validateTelegramConfig,
  formatPhoneNumber
};