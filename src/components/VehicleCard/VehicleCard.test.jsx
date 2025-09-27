import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import VehicleCard from './VehicleCard';

// Mock the RentModal hook
const mockOpenRentModal = vi.fn();
vi.mock('../RentCarModal', () => ({
  useRentModal: () => ({
    openRentModal: mockOpenRentModal
  })
}));

// Mock vehicleUtils
vi.mock('../../utils/vehicleUtils', () => ({
  getVehicleName: vi.fn((vehicle, lang) => vehicle?.name || 'Test Vehicle'),
  getVehicleDescription: vi.fn((vehicle, lang) => 'Test Description'),
  getVehicleFeatures: vi.fn((vehicle, lang) => vehicle?.features || ['Air Conditioning', 'GPS', 'Bluetooth'])
}));

// Helper function to render VehicleCard with providers
const renderVehicleCard = (props = {}) => {
  const defaultProps = {
    id: 'test-vehicle-1',
    image: '/test-image.jpg',
    vehicleName: 'Hyundai Accent',
    price: '800,000đ/ngày',
    features: ['Điều hòa', 'GPS', 'Bluetooth'],
    rating: 4.5,
    availability: true,
    viewMode: 'grid',
    ...props
  };

  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <VehicleCard {...defaultProps} />
      </I18nextProvider>
    </BrowserRouter>
  );
};

describe('VehicleCard Component', () => {
  beforeEach(() => {
    mockOpenRentModal.mockClear();
  });

  it('renders vehicle card with all basic information', () => {
    renderVehicleCard();
    
    expect(screen.getByText('Hyundai Accent')).toBeInTheDocument();
    expect(screen.getByText('800,000đ/ngày')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    // Image is in aria-hidden container, so get by alt text instead
    expect(screen.getByAltText(/Thuê xe.*Hyundai Accent/)).toBeInTheDocument();
  });

  it('renders vehicle features list', () => {
    renderVehicleCard();
    
    expect(screen.getByText('• Điều hòa')).toBeInTheDocument();
    expect(screen.getByText('• GPS')).toBeInTheDocument();
    expect(screen.getByText('• Bluetooth')).toBeInTheDocument();
  });

  it('applies grid view mode class', () => {
    const { container } = renderVehicleCard({ viewMode: 'grid' });
    
    expect(container.querySelector('.car-card.grid')).toBeInTheDocument();
  });

  it('applies list view mode class', () => {
    const { container } = renderVehicleCard({ viewMode: 'list' });
    
    expect(container.querySelector('.car-card.list')).toBeInTheDocument();
  });

  it('shows more features for list view mode', () => {
    const longFeaturesList = [
      'Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 
      'Feature 5', 'Feature 6', 'Feature 7', 'Feature 8'
    ];
    
    renderVehicleCard({ 
      viewMode: 'list', 
      features: longFeaturesList 
    });
    
    // Should show 6 features in list mode
    expect(screen.getByText('• Feature 6')).toBeInTheDocument();
    // The text is split by translation, so search for the number part
    expect(screen.getByText(/\+2/)).toBeInTheDocument();
  });

  it('limits features for grid view mode', () => {
    const longFeaturesList = [
      'Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 
      'Feature 5', 'Feature 6'
    ];
    
    renderVehicleCard({ 
      viewMode: 'grid', 
      features: longFeaturesList 
    });
    
    // Should show 4 features in grid mode
    expect(screen.getByText('• Feature 4')).toBeInTheDocument();
    // The text is split by translation, so search for the number part
    expect(screen.getByText(/\+2/)).toBeInTheDocument();
  });

  it('handles unavailable vehicle', () => {
    const { container } = renderVehicleCard({ availability: false });
    
    expect(container.querySelector('.car-card.unavailable')).toBeInTheDocument();
    // Get by class selector to be more specific
    expect(container.querySelector('.availability-status.unavailable')).toHaveTextContent('Unavailable');
    
    const rentButton = screen.getByRole('button', { name: /rent/i });
    expect(rentButton).toBeDisabled();
    expect(rentButton).toHaveClass('disabled');
  });

  it('shows available status for available vehicle', () => {
    renderVehicleCard({ availability: true });
    
    expect(screen.getByText('Available')).toBeInTheDocument();
    
    const rentButton = screen.getByRole('button', { name: /rent/i });
    expect(rentButton).not.toBeDisabled();
  });

  it('opens rent modal when rent button is clicked', () => {
    renderVehicleCard();
    
    const rentButton = screen.getByRole('button', { name: /rent/i });
    fireEvent.click(rentButton);
    
    expect(mockOpenRentModal).toHaveBeenCalledWith({
      id: 'test-vehicle-1',
      image: '/test-image.jpg',
      name: 'Hyundai Accent',
      price: '800,000đ/ngày'
    });
  });

  it('does not open rent modal when vehicle is unavailable', () => {
    renderVehicleCard({ availability: false });
    
    const rentButton = screen.getByRole('button', { name: /rent/i });
    fireEvent.click(rentButton);
    
    expect(mockOpenRentModal).not.toHaveBeenCalled();
  });

  it('renders details link with correct href', () => {
    renderVehicleCard({ id: 'hyundai-accent-2023' });
    
    const detailsLink = screen.getByRole('link', { name: /view details/i });
    expect(detailsLink).toHaveAttribute('href', '/thue-xe/hyundai-accent-2023');
  });

  it('renders fallback placeholder when no image provided', () => {
    renderVehicleCard({ image: null });
    
    // Should render car emoji placeholder
    expect(screen.getByText('🚗')).toBeInTheDocument();
  });

  it('renders with vehicle object prop', () => {
    const vehicleObj = {
      id: 'test-1',
      name: 'Test Vehicle',
      features: ['Feature A', 'Feature B']
    };
    
    renderVehicleCard({ vehicle: vehicleObj });
    
    // Should use mocked getVehicleName and getVehicleFeatures
    expect(screen.getByText('Test Vehicle')).toBeInTheDocument();
  });

  it('handles rating display', () => {
    renderVehicleCard({ rating: 4.8 });
    
    expect(screen.getByText('⭐')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
  });

  it('renders without rating when not provided', () => {
    renderVehicleCard({ rating: null });
    
    expect(screen.queryByText('⭐')).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    const { container } = renderVehicleCard();
    
    const cardContainer = container.querySelector('[role="button"]');
    expect(cardContainer).toHaveAttribute('tabIndex', '0');
    expect(cardContainer).toHaveAttribute('aria-label', 'View details for Hyundai Accent');
    
    const rentButton = screen.getByRole('button', { name: /rent/i });
    expect(rentButton).toHaveAttribute('aria-label', 'Rent Hyundai Accent');
    
    const detailsLink = screen.getByRole('link');
    expect(detailsLink).toHaveAttribute('aria-label', 'View details for Hyundai Accent');
  });

  it('renders image with proper alt text', () => {
    renderVehicleCard();
    
    // Image is inside aria-hidden container so we need to get it by alt text
    const image = screen.getByAltText('Thuê xe Hyundai Accent tự lái TP.HCM - giao tận nơi, giá rẻ - KTT Car');
    expect(image).toBeInTheDocument();
  });
});