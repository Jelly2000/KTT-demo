/**
 * Test utility for Telegram bot integration
 * Run this in browser console to test if Telegram bot is working
 */

import { 
  sendTelegramNotification, 
  validateTelegramConfig,
  sendCarRentalRequest,
  sendConsultationRequest,
  sendContactFormSubmission
} from './telegramUtils.js';

// Test configuration
export const testTelegramConfig = () => {
  const isValid = validateTelegramConfig();
  // console.log('Telegram Configuration:', isValid ? '✅ Valid' : '❌ Invalid');
  
  if (!isValid) {
    // console.log('Make sure you have set VITE_TELEGRAM_BOT_TOKEN and VITE_TELEGRAM_CHAT_ID in your .env file');
  }
  
  return isValid;
};

// Test simple notification
export const testSimpleNotification = async () => {
  if (!testTelegramConfig()) return;
  
  // console.log('🧪 Testing simple notification...');
  const success = await sendTelegramNotification(
    'Thông Báo Test',
    'Đây là tin nhắn test từ website của bạn. Nếu bạn nhận được tin nhắn này, tích hợp Telegram đang hoạt động tốt! 🎉',
    'success'
  );
  
  // console.log('Test result:', success ? '✅ Success' : '❌ Failed');
  return success;
};

// Test car rental request
export const testCarRentalRequest = async () => {
  if (!testTelegramConfig()) return;
  
  // console.log('🧪 Testing car rental request...');
  const testData = {
    vehicleName: 'Hyundai Accent (Test)',
    vehicleId: 1,
    customerName: 'Nguyễn Văn Test',
    customerPhone: '0901234567',
    customerEmail: 'test@example.com',
    startDate: '28/09/2025',
    endDate: '30/09/2025',
    pickupLocation: 'Hà Nội',
    returnLocation: 'Hà Nội',
    additionalNotes: 'Đây là một yêu cầu test',
    pricePerDay: 850000,
    totalDays: 2,
    estimatedCost: 1700000
  };
  
  const success = await sendCarRentalRequest(testData);
  // console.log('Test result:', success ? '✅ Success' : '❌ Failed');
  return success;
};

// Test consultation request
export const testConsultationRequest = async () => {
  if (!testTelegramConfig()) return;
  
  // console.log('🧪 Testing consultation request...');
  const testData = {
    name: 'Trần Thị Test',
    phone: '0987654321',
    email: 'test.consultation@example.com',
    serviceType: 'Thuê xe dài hạn',
    preferredTime: 'Buổi sáng',
    message: 'Tôi muốn được tư vấn về dịch vụ thuê xe dài hạn. Đây là tin nhắn test.',
    source: 'Bộ Test'
  };
  
  const success = await sendConsultationRequest(testData);
  // console.log('Test result:', success ? '✅ Success' : '❌ Failed');
  return success;
};

// Test contact form submission
export const testContactFormSubmission = async () => {
  if (!testTelegramConfig()) return;
  
  // console.log('🧪 Testing contact form submission...');
  const testData = {
    name: 'Lê Văn Test',
    phone: '0912345678',
    email: 'test.contact@example.com',
    subject: 'Câu hỏi về dịch vụ',
    message: 'Xin chào, tôi có một số câu hỏi về dịch vụ thuê xe của công ty. Đây là tin nhắn test từ contact form.',
    source: 'Form Liên Hệ Test'
  };
  
  const success = await sendContactFormSubmission(testData);
  // console.log('Test result:', success ? '✅ Success' : '❌ Failed');
  return success;
};

// Run all tests
export const runAllTests = async () => {
  // console.log('🚀 Running all Telegram integration tests...\n');
  
  const results = {
    config: testTelegramConfig(),
    notification: await testSimpleNotification(),
    rental: await testCarRentalRequest(),
    consultation: await testConsultationRequest(),
    contact: await testContactFormSubmission()
  };
  
  // console.log('\n📊 Test Results Summary:');
  // console.log('Configuration:', results.config ? '✅' : '❌');
  // console.log('Simple Notification:', results.notification ? '✅' : '❌');
  // console.log('Car Rental Request:', results.rental ? '✅' : '❌');
  // console.log('Consultation Request:', results.consultation ? '✅' : '❌');
  // console.log('Contact Form:', results.contact ? '✅' : '❌');
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  // console.log(`\n🎯 Overall: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    // console.log('🎉 All tests passed! Telegram integration is working perfectly.');
  } else {
    // console.log('⚠️ Some tests failed. Check your configuration and try again.');
  }
  
  return results;
};

// Usage instructions
// Telegram Bot Test Utilities
//
// To test your Telegram integration, run these commands in the browser console:
//
// 1. Test configuration:
//    testTelegramConfig()
//
// 2. Test simple notification:
//    testSimpleNotification()
//
// 3. Test car rental request:
//    testCarRentalRequest()
//
// 4. Test consultation request:
//    testConsultationRequest()
//
// 5. Test contact form:
//    testContactFormSubmission()
//
// 6. Run all tests:
//    runAllTests()
//
// Make sure you have configured your .env file first!

export default {
  testTelegramConfig,
  testSimpleNotification,
  testCarRentalRequest,
  testConsultationRequest,
  testContactFormSubmission,
  runAllTests
};