import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import ConsultationForm from './ConsultationForm';

// Mock zaloUtils
vi.mock('../../utils/zaloUtils', () => ({
  sendConsultationRequest: vi.fn(),
  formatPhoneNumber: vi.fn(phone => phone)
}));

// Get mocked functions
import { sendConsultationRequest, formatPhoneNumber } from '../../utils/zaloUtils';
const mockSendConsultationRequest = vi.mocked(sendConsultationRequest);
const mockFormatPhoneNumber = vi.mocked(formatPhoneNumber);

// Helper function to render ConsultationForm with i18n provider
const renderConsultationForm = (props = {}) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <ConsultationForm {...props} />
    </I18nextProvider>
  );
};

describe('ConsultationForm Component', () => {
  beforeEach(() => {
    mockSendConsultationRequest.mockClear();
    mockFormatPhoneNumber.mockClear();
  });

  it('renders form with default headings', () => {
    renderConsultationForm();

    expect(screen.getByText('CONTACT US')).toBeInTheDocument();
    expect(screen.getByText(/Leave your information to book as soon as possible/)).toBeInTheDocument();
  });  it('renders form with custom headings', () => {
    renderConsultationForm({
      heading: 'Custom Title',
      subHeading: 'Custom Subtitle'
    });
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    renderConsultationForm();
    
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /subject/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Message')).toBeInTheDocument();
  });

  it('updates form data when inputs change', () => {
    renderConsultationForm();
    
    const nameInput = screen.getByPlaceholderText('Full Name');
    const phoneInput = screen.getByPlaceholderText('Phone Number');
    const emailInput = screen.getByPlaceholderText('Email');
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(phoneInput, { target: { value: '0901234567' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    
    expect(nameInput.value).toBe('John Doe');
    expect(phoneInput.value).toBe('0901234567');
    expect(emailInput.value).toBe('john@example.com');
  });

  it('handles subject select dropdown', () => {
    renderConsultationForm();
    
    const subjectSelect = screen.getByLabelText(/subject|Chủ đề/i);
    
    fireEvent.change(subjectSelect, { target: { value: 'car_rental' } });
    expect(subjectSelect.value).toBe('car_rental');
  });

  it('handles message textarea', () => {
    renderConsultationForm();
    
    const messageTextarea = screen.getByPlaceholderText('Message');
    
    fireEvent.change(messageTextarea, { target: { value: 'I need a car rental' } });
    expect(messageTextarea.value).toBe('I need a car rental');
  });

  it('submits form successfully', async () => {
    mockSendConsultationRequest.mockResolvedValue({ success: true });
    
    renderConsultationForm();
    
    // Fill out form
    fireEvent.change(screen.getByLabelText(/Full Name/i), { 
      target: { name: 'fullName', value: 'John Doe' } 
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { 
      target: { name: 'phoneNumber', value: '0901234567' } 
    });
    fireEvent.change(screen.getByLabelText(/Email/i), { 
      target: { name: 'email', value: 'john@example.com' } 
    });
    fireEvent.change(screen.getByLabelText(/Subject/i), { 
      target: { name: 'subject', value: 'car_rental' } 
    });
    fireEvent.change(screen.getByLabelText(/Message/i), { 
      target: { name: 'message', value: 'Need car rental info' } 
    });
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /Send Message/i });
    fireEvent.click(submitButton);
    
    // Check loading state
    expect(screen.getByText('Submitting request...')).toBeInTheDocument();
    
    // Wait for submission
    await waitFor(() => {
      expect(mockSendConsultationRequest).toHaveBeenCalledWith({
        name: 'John Doe',
        phone: '0901234567',
        email: 'john@example.com',
        serviceType: 'car_rental',
        message: 'Need car rental info',
        source: 'Form Tư Vấn Trang Chủ'
      });
    });
    
    // Check success notification
    await waitFor(() => {
      expect(screen.getByText(/success|thành công/i)).toBeInTheDocument();
    });
  });

  it('handles form submission failure', async () => {
    mockSendConsultationRequest.mockRejectedValue(new Error('Network error'));
    
    renderConsultationForm();
    
    // Fill all required fields
    fireEvent.change(screen.getByLabelText(/Full Name/i), { 
      target: { name: 'fullName', value: 'John Doe' } 
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { 
      target: { name: 'phoneNumber', value: '0901234567' } 
    });
    fireEvent.change(screen.getByLabelText(/Subject/i), { 
      target: { name: 'subject', value: 'car_rental' } 
    });
    fireEvent.change(screen.getByLabelText(/Message/i), { 
      target: { name: 'message', value: 'Test message' } 
    });
    
    const submitButton = screen.getByRole('button', { name: /Send Message/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSendConsultationRequest).toHaveBeenCalled();
    });
    
    // Form should not be in loading state after error
    expect(screen.queryByText('Submitting request...')).not.toBeInTheDocument();
  });

  it('resets form when reset button is clicked', () => {
    renderConsultationForm();
    
    const nameInput = screen.getByPlaceholderText('Full Name');
    const phoneInput = screen.getByPlaceholderText('Phone Number');
    
    // Fill form
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(phoneInput, { target: { value: '0901234567' } });
    
    // Reset form
    const resetButton = screen.getByRole('button', { name: /reset|xóa/i });
    fireEvent.click(resetButton);
    
    expect(nameInput.value).toBe('');
    expect(phoneInput.value).toBe('');
  });

  it('disables submit button when form is submitting', async () => {
    mockSendConsultationRequest.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(true), 1000))
    );
    
    renderConsultationForm();
    
    // Fill all required fields
    fireEvent.change(screen.getByPlaceholderText('Full Name'), { 
      target: { value: 'John Doe' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Phone Number'), { 
      target: { value: '0901234567' } 
    });
    fireEvent.change(screen.getByRole('combobox'), { 
      target: { value: 'car_rental' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Message'), { 
      target: { value: 'Test message' } 
    });
    
    const submitButton = screen.getByRole('button', { name: /Send Message/i });
    fireEvent.click(submitButton);
    
    // Button should be disabled during submission
    expect(submitButton).toBeDisabled();
  });

  it('formats phone number before submission', async () => {
    mockSendConsultationRequest.mockResolvedValue({ success: true });
    mockFormatPhoneNumber.mockReturnValue('+84901234567');
    
    renderConsultationForm();
    
    // Fill all required fields
    fireEvent.change(screen.getByLabelText(/Full Name/i), { 
      target: { name: 'fullName', value: 'John Doe' } 
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { 
      target: { name: 'phoneNumber', value: '0901234567' } 
    });
    fireEvent.change(screen.getByLabelText(/Subject/i), { 
      target: { name: 'subject', value: 'car_rental' } 
    });
    fireEvent.change(screen.getByLabelText(/Message/i), { 
      target: { name: 'message', value: 'Test message' } 
    });
    
    const submitButton = screen.getByRole('button', { name: /Send Message/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockFormatPhoneNumber).toHaveBeenCalledWith('0901234567');
      expect(mockSendConsultationRequest).toHaveBeenCalledWith({
        name: 'John Doe',
        phone: '+84901234567',
        email: '',
        serviceType: 'car_rental',
        message: 'Test message',
        source: 'Form Tư Vấn Trang Chủ'
      });
    });
  });

  it('shows success notification after form submission', async () => {
    mockSendConsultationRequest.mockResolvedValue({ success: true });
    
    renderConsultationForm();
    
    // Fill all required fields
    fireEvent.change(screen.getByLabelText(/Full Name/i), { 
      target: { name: 'fullName', value: 'John Doe' } 
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { 
      target: { name: 'phoneNumber', value: '0901234567' } 
    });
    fireEvent.change(screen.getByLabelText(/Subject/i), { 
      target: { name: 'subject', value: 'car_rental' } 
    });
    fireEvent.change(screen.getByLabelText(/Message/i), { 
      target: { name: 'message', value: 'Test message' } 
    });
    
    const submitButton = screen.getByRole('button', { name: /Send Message/i });
    fireEvent.click(submitButton);
    
    // Wait for success notification
    await waitFor(() => {
      expect(screen.getByText(/Request Submitted Successfully!/i)).toBeInTheDocument();
    });
  });

  it('has proper form validation attributes', () => {
    renderConsultationForm();
    
    const nameInput = screen.getByPlaceholderText('Full Name');
    const phoneInput = screen.getByPlaceholderText('Phone Number');
    const emailInput = screen.getByPlaceholderText('Email');
    
    expect(nameInput).toHaveAttribute('required');
    expect(phoneInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('type', 'email');
  });
});