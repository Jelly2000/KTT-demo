import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  vehicles: [],
  loading: false,
  error: null,
  total: 0,
  filters: {
    brand: '',
    seats: '',
  },
  pagination: {
    page: 1,
    pageSize: 10,
    hasNextPage: false,
  },
  detail: null,
  detailLoading: false,
  detailError: null,
};

const VEHICLE_API_BASE_URL = import.meta.env.VITE_SERVER_URL || '';

const normalizeVehicle = (vehicle) => {
  const fallbackImage = vehicle.cover_image || vehicle.display_image || null;
  const rawDescription = vehicle.description;

  return {
    ...vehicle,
    image: fallbackImage,
    coverImage: vehicle.cover_image,
    displayImage: vehicle.display_image,
    pricePerDay: vehicle.price_per_day ?? 0,
    pricePerWeek: vehicle.price_per_week ?? 0,
    pricePerMonth: vehicle.price_per_month ?? 0,
    availability: vehicle.rent_status === 'available',
    rating: vehicle.rank_point,
    seats: vehicle.seat_number,
    plateNumber: vehicle.plate_number,
    videoLink: vehicle.video_link,
    description: rawDescription,
    features: Array.isArray(vehicle.features) ? vehicle.features : [],
    transmission: vehicle.transmission || 'automatic',
    gallery: [fallbackImage].filter(Boolean),
  };
};

const normalizeVehicleDetail = (vehicle, images = [], specification = null) => {
  const normalizedVehicle = normalizeVehicle(vehicle);
  const imageUrls = Array.isArray(images)
    ? images.map((image) => image?.url).filter(Boolean)
    : [];
  const coverImage = Array.isArray(images)
    ? images.find((image) => image?.is_cover)?.url
    : null;

  const gallery = Array.from(
    new Set([
      coverImage,
      normalizedVehicle.image,
      ...imageUrls,
    ].filter(Boolean))
  );

  return {
    ...normalizedVehicle,
    image: coverImage || normalizedVehicle.image,
    gallery,
    specifications: specification || normalizedVehicle.specifications,
  };
};

export const fetchVehicles = createAsyncThunk(
  'vehicles/fetchVehicles',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      if (filters?.search_text) {
        params.set('search_text', String(filters.search_text));
      }

      if (filters?.seat_number) {
        params.set('seat_number', String(filters.seat_number));
      }

      if (filters?.make) {
        params.set('make', String(filters.make));
      }

      const query = params.toString();
      const endpoint = `${VEHICLE_API_BASE_URL}/api/vehicles/search${query ? `?${query}` : ''}`;
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Failed to fetch vehicles: ${response.status}`);
      }

      const payload = await response.json();
      return {
        vehicles: Array.isArray(payload?.data?.vehicles) ? payload.data.vehicles : [],
        total: payload?.data?.total ?? 0,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch vehicles');
    }
  }
);

export const fetchVehicleBySlug = createAsyncThunk(
  'vehicles/fetchVehicleBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const endpoint = `${VEHICLE_API_BASE_URL}/api/vehicles/${slug}`;
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Failed to fetch vehicle detail: ${response.status}`);
      }

      const payload = await response.json();
      const detailData = payload?.data || {};

      if (!detailData?.vehicle) {
        throw new Error('Vehicle detail not found');
      }

      return {
        vehicle: detailData.vehicle,
        images: Array.isArray(detailData.images) ? detailData.images : [],
        specification: detailData.specification || null,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch vehicle detail');
    }
  }
);

const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    clearFilters: (state) => {
      state.filters = {
        brand: '',
        seats: '',
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = action.payload.vehicles.map(normalizeVehicle);
        state.total = action.payload.total;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || 'Failed to fetch vehicles';
      })
      .addCase(fetchVehicleBySlug.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchVehicleBySlug.fulfilled, (state, action) => {
        state.detailLoading = false;

        const normalizedDetail = normalizeVehicleDetail(
          action.payload.vehicle,
          action.payload.images,
          action.payload.specification
        );

        state.detail = normalizedDetail;

        const targetIndex = state.vehicles.findIndex(
          (vehicle) => vehicle.slug === normalizedDetail.slug
        );

        if (targetIndex >= 0) {
          state.vehicles[targetIndex] = {
            ...state.vehicles[targetIndex],
            ...normalizedDetail,
          };
        } else {
          state.vehicles.push(normalizedDetail);
        }
      })
      .addCase(fetchVehicleBySlug.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload || action.error?.message || 'Failed to fetch vehicle detail';
      });
  },
});

export const {
  setFilters,
  clearFilters,
} = vehicleSlice.actions;

export const selectVehicles = (state) => state.vehicles.vehicles;
export const selectVehicleTotal = (state) => state.vehicles.total;
export const selectVehicleLoading = (state) => state.vehicles.loading;
export const selectVehicleError = (state) => state.vehicles.error;
export const selectVehicleDetailLoading = (state) => state.vehicles.detailLoading;
export const selectVehicleDetailError = (state) => state.vehicles.detailError;
export const selectVehicleFilters = (state) => state.vehicles.filters;
export const selectVehicleDetail = (state) => state.vehicles.detail;
export const selectVehicleBySlug = (state, slug) => {
  const vehicles = state.vehicles.vehicles || [];
  return vehicles.find((vehicle) => vehicle.slug === slug) || null;
};

export default vehicleSlice.reducer;
