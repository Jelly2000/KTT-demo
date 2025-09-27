import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RentModalProvider, useRentModal } from './RentModalContext';

// Mock telegramUtils and vehicleUtils
vi.mock('../../utils/telegramUtils', () => ({
  sendCarRentalRequest: vi.fn(),
  formatPhoneNumber: vi.fn(phone => phone)
}));

vi.mock('../../utils/vehicleUtils', () => ({
  getVehicleById: vi.fn()
}));

// Test component to use the context
const TestComponent = () => {
  const { 
    isRentModalOpen, 
    selectedVehicle, 
    openRentModal, 
    closeRentModal,
    isSubmitting 
  } = useRentModal();
  
  return (
    <div>
      <div data-testid="modal-status">{isRentModalOpen ? 'open' : 'closed'}</div>
      <div data-testid="vehicle-name">{selectedVehicle?.name || 'none'}</div>
      <div data-testid="submitting">{isSubmitting ? 'true' : 'false'}</div>
      <button onClick={() => openRentModal({ name: 'Test Car', id: 'test-1' })}>
        Open Modal
      </button>
      <button onClick={closeRentModal}>Close Modal</button>
    </div>
  );
};

const renderWithProvider = () => {
  return render(
    <RentModalProvider>
      <TestComponent />
    </RentModalProvider>
  );
};

describe('RentModalContext', () => {
  it('provides initial state', () => {
    renderWithProvider();
    
    expect(screen.getByTestId('modal-status')).toHaveTextContent('closed');
    expect(screen.getByTestId('vehicle-name')).toHaveTextContent('none');
    expect(screen.getByTestId('submitting')).toHaveTextContent('false');
  });

  it('opens modal with vehicle data', () => {
    renderWithProvider();
    
    const openButton = screen.getByText('Open Modal');
    
    act(() => {
      fireEvent.click(openButton);
    });
    
    expect(screen.getByTestId('modal-status')).toHaveTextContent('open');
    expect(screen.getByTestId('vehicle-name')).toHaveTextContent('Test Car');
  });

  it('closes modal and resets state', () => {
    renderWithProvider();
    
    // Open modal first
    const openButton = screen.getByText('Open Modal');
    
    act(() => {
      fireEvent.click(openButton);
    });
    
    expect(screen.getByTestId('modal-status')).toHaveTextContent('open');
    expect(screen.getByTestId('vehicle-name')).toHaveTextContent('Test Car');
    
    // Close modal
    const closeButton = screen.getByText('Close Modal');
    
    act(() => {
      fireEvent.click(closeButton);
    });
    
    expect(screen.getByTestId('modal-status')).toHaveTextContent('closed');
    expect(screen.getByTestId('vehicle-name')).toHaveTextContent('none');
  });

  it('throws error when used outside provider', () => {
    // Mock console.error to avoid error output in test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const TestComponentWithoutProvider = () => {
      const context = useRentModal();
      return <div>{context ? 'has context' : 'no context'}</div>;
    };
    
    expect(() => render(<TestComponentWithoutProvider />)).toThrow(
      'useRentModal must be used within a RentModalProvider'
    );
    
    consoleSpy.mockRestore();
  });
});