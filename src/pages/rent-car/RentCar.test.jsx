import { fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '../../i18n';
import RentCar, {
  filterVehiclesBySeatSelection,
  getSeatNumberForRequest,
  groupVehiclesBySeat,
} from './RentCar';

const mockDispatch = vi.fn();
const mockFetchVehicles = vi.fn((payload) => ({ type: 'vehicles/fetchVehicles', payload }));

const mockState = {
  vehicles: {
    vehicles: [
      { id: 1, name: 'Accent', seats: 4, image: '/accent.jpg', pricePerDay: 1000000, features: [], rating: 5, availability: true },
      { id: 2, name: 'Venue', seats: 5, image: '/venue.jpg', pricePerDay: 1100000, features: [], rating: 5, availability: true },
      { id: 3, name: 'Santa Fe', seats: 7, image: '/santafe.jpg', pricePerDay: 1300000, features: [], rating: 5, availability: true },
    ],
    loading: false,
    error: null,
  },
};

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) => selector(mockState),
}));

vi.mock('../../store/vehicleSlice', () => ({
  fetchVehicles: (payload) => mockFetchVehicles(payload),
  selectVehicleError: (state) => state.vehicles.error,
  selectVehicleLoading: (state) => state.vehicles.loading,
  selectVehicles: (state) => state.vehicles.vehicles,
}));

vi.mock('../../components', () => ({
  VehicleCard: ({ vehicleName }) => <div>{vehicleName}</div>,
  VehicleGrid: ({ vehicles, renderVehicle }) => (
    <div>{vehicles.map((vehicle, index) => <div key={vehicle.id}>{renderVehicle(vehicle, index)}</div>)}</div>
  ),
  LoadingSpinner: () => <div>Loading</div>,
}));

vi.mock('../../components/SEO/SEO', () => ({
  default: () => null,
}));

const renderRentCar = async ({ initialEntries = ['/thue-xe'] } = {}) => {
  await i18n.changeLanguage('en');

  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <I18nextProvider i18n={i18n}>
        <RentCar />
      </I18nextProvider>
    </MemoryRouter>
  );
};

describe('RentCar seat filters', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    mockFetchVehicles.mockClear();
  });

  it('maps the combined seat filter to local 4 and 5 seat results', async () => {
    await renderRentCar();

    const seatSelect = screen.getAllByRole('combobox')[1];
    expect(screen.getByRole('option', { name: '4-5 seater car' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: '4 Seater Cars' })).not.toBeInTheDocument();
    expect(screen.queryByRole('option', { name: '5 Seater Cars' })).not.toBeInTheDocument();

    const sectionHeadings = screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent);
    expect(sectionHeadings).toEqual([
      '4-seat vehicles',
      '5-seat vehicles',
      '7-seat vehicles',
    ]);

    fireEvent.change(seatSelect, { target: { value: '4-5' } });

    expect(screen.getByText('Accent')).toBeInTheDocument();
    expect(screen.getByText('Venue')).toBeInTheDocument();
    expect(screen.queryByText('Santa Fe')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: '4-seat vehicles' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: '5-seat vehicles' })).toBeInTheDocument();
    expect(screen.getByText(/2 vehicles found/i)).toBeInTheDocument();
    expect(mockFetchVehicles).toHaveBeenLastCalledWith({
      search_text: undefined,
      make: undefined,
      seat_number: undefined,
    });
  });

  it('keeps request filtering for non-combined seat selections', () => {
    expect(getSeatNumberForRequest('7')).toBe('7');
    expect(getSeatNumberForRequest('4-5')).toBeUndefined();
    expect(filterVehiclesBySeatSelection(mockState.vehicles.vehicles, '4-5')).toHaveLength(2);
    expect(filterVehiclesBySeatSelection(mockState.vehicles.vehicles, '7')).toEqual([
      mockState.vehicles.vehicles[2],
    ]);
  });

  it('groups vehicles by seat count in ascending order before rendering', () => {
    expect(groupVehiclesBySeat([
      mockState.vehicles.vehicles[2],
      mockState.vehicles.vehicles[0],
      mockState.vehicles.vehicles[1],
    ])).toEqual([
      { seatCount: 4, vehicles: [mockState.vehicles.vehicles[0]] },
      { seatCount: 5, vehicles: [mockState.vehicles.vehicles[1]] },
      { seatCount: 7, vehicles: [mockState.vehicles.vehicles[2]] },
    ]);
  });

  it('restores search and filter selections from the URL', async () => {
    await renderRentCar({
      initialEntries: ['/thue-xe?search_text=ven&make=Hyundai&seats=4-5&page=2'],
    });

    const [brandSelect, seatSelect] = screen.getAllByRole('combobox');

    expect(screen.getByPlaceholderText('Search for cars...')).toHaveValue('ven');
    expect(brandSelect).toHaveValue('Hyundai');
    expect(seatSelect).toHaveValue('4-5');
    expect(mockFetchVehicles).toHaveBeenLastCalledWith({
      search_text: 'ven',
      make: 'Hyundai',
      seat_number: undefined,
    });
  });
});