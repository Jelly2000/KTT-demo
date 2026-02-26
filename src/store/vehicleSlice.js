import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  vehicles: [],
  loading: false,
};

const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  pagination: {
    currentPage: 1,
    pageSize: 10,
    total: 0,
    hasMore: false,
  },
  filters: {
    brand: '',
    seats: '',
  },
  reducers: {

  }
});

export const {

} = vehicleSlice.actions;

export const selectVehicleDetail = (state) => state.vehicles.detail;
export const selectVehicleBySlug = (state, slug, language) => {
  const vehicles = state.vehicles.vehicles || [];
  return vehicles.find((vehicle) => vehicle.slug === slug) || null;
};

export default vehicleSlice.reducer;
