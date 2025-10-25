/**
 * Test utility for Zalo integration
 * Run this in browser console to test if Zalo messaging is working
 */
import { sendNotification, sendCarRentalRequest, sendConsultationRequest } from './zaloUtils';

// Test configuration
export const testZaloConfig = () => {
  const serverUrl = import.meta.env.VITE_ZALO_SERVER_URL || 'https://ktt-server.onrender.com';
  console.log('🔧 Testing Zalo configuration...');
  console.log('Server URL:', serverUrl);
  
  if (!serverUrl) {
    console.error('❌ Zalo server URL not configured');
    return false;
  }
  
  console.log('✅ Zalo configuration looks good');
  return true;
};

// Test simple notification
export const testSimpleNotification = async () => {
  if (!testZaloConfig()) return;
  
  console.log('🧪 Testing simple notification...');
  const result = await sendNotification(
    'Thông Báo Test',
    'Đây là tin nhắn test từ website của bạn. Nếu bạn nhận được tin nhắn này, tích hợp Zalo đang hoạt động tốt! 🎉',
    'Test Suite'
  );
  
  console.log('Test result:', result.success ? '✅ Success' : '❌ Failed', result);
  return result.success;
};

// Test car rental request
export const testCarRentalRequest = async () => {
  if (!testZaloConfig()) return;
  
  console.log('🧪 Testing car rental request...');
  const testData = {
    vehicleName: 'Toyota Vios 2023',
    customerName: 'Nguyễn Văn Test',
    customerPhone: '0901234567',
    customerEmail: 'test@example.com',
    startDate: '25/10/2025',
    endDate: '27/10/2025',
    additionalNotes: 'Đây là yêu cầu thuê xe test',
    pricePerDay: 800000,
    totalDays: 2,
    estimatedCost: 1600000,
    source: 'Test Suite'
  };
  
  const result = await sendCarRentalRequest(testData);
  console.log('Test result:', result.success ? '✅ Success' : '❌ Failed', result);
  return result.success;
};

// Test consultation request
export const testConsultationRequest = async () => {
  if (!testZaloConfig()) return;
  
  console.log('🧪 Testing consultation request...');
  const testData = {
    name: 'Nguyễn Văn Test',
    phone: '0901234567',
    email: 'test@example.com',
    subject: 'car_rental',
    message: 'Tôi muốn hỏi về dịch vụ thuê xe của công ty',
    source: 'Test Suite'
  };
  
  const result = await sendConsultationRequest(testData);
  console.log('Test result:', result.success ? '✅ Success' : '❌ Failed', result);
  return result.success;
};

// Run all tests
export const runAllZaloTests = async () => {
  console.log('🚀 Running all Zalo integration tests...\n');

  const results = {
    config: testZaloConfig(),
    notification: await testSimpleNotification(),
    rental: await testCarRentalRequest(),
    consultation: await testConsultationRequest()
  };

  console.log('\n📊 Test Results Summary:');
  console.log('Configuration:', results.config ? '✅' : '❌');
  console.log('Simple Notification:', results.notification ? '✅' : '❌');
  console.log('Car Rental Request:', results.rental ? '✅' : '❌');
  console.log('Consultation Request:', results.consultation ? '✅' : '❌');
  
  const allPassed = Object.values(results).every(result => result === true);
  
  if (allPassed) {
    console.log('\n🎉 All tests passed! Zalo integration is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the server configuration and try again.');
  }
  
  return results;
};

// Export for console usage
window.testZalo = {
  testZaloConfig,
  testSimpleNotification,
  testCarRentalRequest,
  testConsultationRequest,
  runAllZaloTests
};