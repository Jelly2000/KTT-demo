import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import RentCarModal from './RentCarModal';
import { RentModalProvider, useRentModal } from './RentModalContext';

// Mock DatePicker component
vi.mock('../DatePicker', () => ({
  default: ({ onChange, name, value }) => (
    <input 
      data-testid={`datepicker-${name}`}
      onChange={(e) => onChange && onChange({ target: { value: new Date(e.target.value) } })}
      type="date"
      value={value ? value.toISOString().split('T')[0] : ''}
    />
  )
}));

// Mock telegramUtils and vehicleUtils
vi.mock('../../utils/telegramUtils', () => ({
  sendCarRentalRequest: vi.fn(),
  formatPhoneNumber: vi.fn(phone => phone)
}));

vi.mock('../../utils/vehicleUtils', () => ({
  getVehicleById: vi.fn()
}));

// Test wrapper component
const TestWrapper = ({ children, initialVehicle = null }) => {
  return (
    <I18nextProvider i18n={i18n}>
      <RentModalProvider>
        <TestModalController initialVehicle={initialVehicle}>
          {children}
        </TestModalController>
      </RentModalProvider>
    </I18nextProvider>
  );
};

// Component to control modal state for tests
const TestModalController = ({ children, initialVehicle }) => {
  const { openRentModal } = useRentModal();
  
  React.useEffect(() => {
    if (initialVehicle) {
      openRentModal(initialVehicle);
    }
  }, [initialVehicle, openRentModal]);
  
  return (
    <>
      {children}
      <button onClick={() => {
        openRentModal({ name: 'Test Car', id: 'test-1', price: 800000 });
      }}>
        Open Modal
      </button>
    </>
  );
};

const renderRentCarModal = (props = {}) => {
  return render(
    <TestWrapper {...props}>
      <RentCarModal />
    </TestWrapper>
  );
};

describe('RentCarModal Component', () => {
  beforeEach(() => {
    // Clear any previous body styles
    document.body.style.overflow = 'unset';
  });

  it('does not render when modal is closed', () => {
    renderRentCarModal();
    
    expect(screen.queryByText('rent_car_modal_title')).not.toBeInTheDocument();
  });

  it('renders modal when opened with vehicle', () => {
    const testVehicle = {
      id: 'test-car',
      name: 'Hyundai Accent',
      price: '800000',
      image: '/test-image.jpg'
    };
    
    renderRentCarModal({ initialVehicle: testVehicle });
    
    expect(screen.getByText('Rent Car')).toBeInTheDocument();
    expect(screen.getByText('Hyundai Accent')).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', () => {
    renderRentCarModal();
    
    // Open modal first
    const openButton = screen.getByText('Open Modal');
    fireEvent.click(openButton);
    
    expect(screen.getByText('Rent Car')).toBeInTheDocument();
    
    // Close modal
    const closeButton = screen.getByRole('button', { name: '✕' });
    fireEvent.click(closeButton);
    
    expect(screen.queryByText('Rent Car')).not.toBeInTheDocument();
  });

  it('closes modal when escape key is pressed', () => {
    renderRentCarModal();
    
    // Open modal
    const openButton = screen.getByText('Open Modal');
    fireEvent.click(openButton);
    
    expect(screen.getByText('Rent Car')).toBeInTheDocument();
    
    // Press escape
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    
    expect(screen.queryByText('Rent Car')).not.toBeInTheDocument();
  });

  it('closes modal when clicking backdrop', () => {
    renderRentCarModal();
    
    // Open modal
    const openButton = screen.getByText('Open Modal');
    fireEvent.click(openButton);
    
    expect(screen.getByText('Rent Car')).toBeInTheDocument();
    
    // Click backdrop
    const modal = screen.getByText('Rent Car').closest('.rent-modal');
    fireEvent.click(modal);
    
    expect(screen.queryByText('Rent Car')).not.toBeInTheDocument();
  });

  it('does not close when clicking modal content', () => {
    renderRentCarModal();
    
    // Open modal
    const openButton = screen.getByText('Open Modal');
    fireEvent.click(openButton);
    
    expect(screen.getByText('Rent Car')).toBeInTheDocument();
    
    // Click modal content
    const modalContent = screen.getByText('Rent Car').closest('.rent-modal-content');
    fireEvent.click(modalContent);
    
    // Modal should still be open
    expect(screen.getByText('Rent Car')).toBeInTheDocument();
  });

  it('renders rental form fields', () => {
    renderRentCarModal();
    
    // Open modal
    const openButton = screen.getByText('Open Modal');
    fireEvent.click(openButton);
    
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByTestId('datepicker-pickupDate')).toBeInTheDocument();
    expect(screen.getByTestId('datepicker-returnDate')).toBeInTheDocument();
  });

  it('handles date picker changes', () => {
    renderRentCarModal();
    
    // Open modal
    const openButton = screen.getByText('Open Modal');
    fireEvent.click(openButton);
    
    const pickupDatePicker = screen.getByTestId('datepicker-pickupDate');
    const returnDatePicker = screen.getByTestId('datepicker-returnDate');
    
    fireEvent.change(pickupDatePicker, { target: { value: '2025-04-15' } });
    fireEvent.change(returnDatePicker, { target: { value: '2025-04-18' } });
    
    expect(pickupDatePicker.value).toBe('2025-04-15');
    expect(returnDatePicker.value).toBe('2025-04-18');
  });

  it('validates required dates before submission', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    renderRentCarModal();
    
    // Open modal
    const openButton = screen.getByText('Open Modal');
    fireEvent.click(openButton);
    
    // Fill form without dates
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'John Doe' }
    });
    
    // Submit form directly
    const form = document.getElementById('rent-form');
    expect(form).toBeTruthy();
    
    fireEvent.submit(form);

    expect(alertSpy).toHaveBeenCalledWith('Vui lòng chọn ngày nhận xe và ngày trả xe');
    
    alertSpy.mockRestore();
  });  it('prevents body scroll when modal is open', () => {
    renderRentCarModal();
    
    // Initially body should have default overflow
    expect(document.body.style.overflow).toBe('unset');
    
    // Open modal
    const openButton = screen.getByText('Open Modal');
    fireEvent.click(openButton);
    
    // Body scroll should be prevented
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll when modal is closed', () => {
    renderRentCarModal();
    
    // Open modal
    const openButton = screen.getByText('Open Modal');
    fireEvent.click(openButton);
    
    expect(document.body.style.overflow).toBe('hidden');
    
    // Close modal
    const closeButton = screen.getByRole('button', { name: '✕' });
    fireEvent.click(closeButton);
    
    // Body scroll should be restored
    expect(document.body.style.overflow).toBe('unset');
  });

  it('displays vehicle information', () => {
    const testVehicle = {
      id: 'hyundai-accent',
      name: 'Hyundai Accent 2024',
      price: '800000',
      image: '/hyundai-accent.jpg'
    };
    
    renderRentCarModal({ initialVehicle: testVehicle });
    
    expect(screen.getByText('Hyundai Accent 2024')).toBeInTheDocument();
    
    const vehicleImage = screen.getByRole('img');
    expect(vehicleImage).toHaveAttribute('src', '/hyundai-accent.jpg');
  });

  it('handles vehicle with missing properties', () => {
    const testVehicle = {
      id: 'incomplete-vehicle'
      // Missing name, price, image
    };
    
    renderRentCarModal({ initialVehicle: testVehicle });
    
    // Should render with default values
    expect(screen.getByText('Unknown Vehicle')).toBeInTheDocument();
  });

  it('resets dates when modal is closed and reopened', () => {
    renderRentCarModal();
    
    // Open modal
    const openButton = screen.getByText('Open Modal');
    fireEvent.click(openButton);
    
    // Set dates
    const pickupDatePicker = screen.getByTestId('datepicker-pickupDate');
    fireEvent.change(pickupDatePicker, { target: { value: '2025-04-15' } });
    
    // Close modal
    const closeButton = screen.getByRole('button', { name: '✕' });
    fireEvent.click(closeButton);
    
    // Reopen modal
    fireEvent.click(openButton);
    
    // Dates should be reset
    const newPickupDatePicker = screen.getByTestId('datepicker-pickupDate');
    expect(newPickupDatePicker.value).toBe('');
  });
});