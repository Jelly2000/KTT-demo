import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchVehicleBySlug, fetchVehicles } from '../utils/vehicleUtils';

const normalizeLanguage = (language) => {
  if (typeof language !== 'string') return 'en';
  if (language.startsWith('vi')) return 'vi';
  if (language.startsWith('en')) return 'en';
  return 'en';
};

export const fetchVehiclesList = createAsyncThunk(
  'vehicles/fetchList',
  async ({ language, page = 1, limit = 100 } = {}, { rejectWithValue }) => {
    const normalizedLanguage = normalizeLanguage(language);

    try {
      const vehicles = await fetchVehicles(normalizedLanguage, { page, limit, forceRefresh: true });
      return { language: normalizedLanguage, vehicles };
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch vehicle list');
    }
  }
);

export const fetchVehicleDetailBySlug = createAsyncThunk(
  'vehicles/fetchDetailBySlug',
  async ({ slug, language } = {}, { rejectWithValue }) => {
    const normalizedLanguage = normalizeLanguage(language);

    try {
      const vehicle = await fetchVehicleBySlug(slug, normalizedLanguage);
      return { slug, language: normalizedLanguage, vehicle };
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch vehicle detail');
    }
  }
);

const initialState = {
  byLanguage: {
    en: [],
    vi: []
  },
  listStatusByLanguage: {
    en: 'idle',
    vi: 'idle'
  },
  listErrorByLanguage: {
    en: null,
    vi: null
  },
  detail: null,
  detailStatus: 'idle',
  detailError: null,
  detailSlug: null,
  detailLanguage: 'en'
};

const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    clearVehicleDetail(state) {
      state.detail = null;
      state.detailStatus = 'idle';
      state.detailError = null;
      state.detailSlug = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehiclesList.pending, (state, action) => {
        const language = normalizeLanguage(action.meta.arg?.language);
        state.listStatusByLanguage[language] = 'loading';
        state.listErrorByLanguage[language] = null;
      })
      .addCase(fetchVehiclesList.fulfilled, (state, action) => {
        const { language, vehicles } = action.payload;
        state.byLanguage[language] = vehicles;
        state.listStatusByLanguage[language] = 'succeeded';
      })
      .addCase(fetchVehiclesList.rejected, (state, action) => {
        const language = normalizeLanguage(action.meta.arg?.language);
        state.listStatusByLanguage[language] = 'failed';
        state.listErrorByLanguage[language] = action.payload || action.error.message;
      })
      .addCase(fetchVehicleDetailBySlug.pending, (state, action) => {
        state.detailStatus = 'loading';
        state.detailError = null;
        state.detailSlug = action.meta.arg?.slug || null;
        state.detailLanguage = normalizeLanguage(action.meta.arg?.language);
      })
      .addCase(fetchVehicleDetailBySlug.fulfilled, (state, action) => {
        const { language, vehicle, slug } = action.payload;
        state.detail = vehicle;
        state.detailStatus = 'succeeded';
        state.detailSlug = slug;
        state.detailLanguage = language;
      })
      .addCase(fetchVehicleDetailBySlug.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.detailError = action.payload || action.error.message;
      });
  }
});

export const { clearVehicleDetail } = vehicleSlice.actions;

export const selectVehiclesByLanguage = (state, language) => {
  const normalizedLanguage = normalizeLanguage(language);
  return state.vehicles.byLanguage[normalizedLanguage] || [];
};

export const selectVehicleListStatus = (state, language) => {
  const normalizedLanguage = normalizeLanguage(language);
  return state.vehicles.listStatusByLanguage[normalizedLanguage] || 'idle';
};

export const selectVehicleDetail = (state) => state.vehicles.detail;
export const selectVehicleDetailStatus = (state) => state.vehicles.detailStatus;

export default vehicleSlice.reducer;
