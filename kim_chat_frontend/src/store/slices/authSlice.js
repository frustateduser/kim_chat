// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from '@api/auth';

// helper to extract common payload formats
const extract = (res) => {
  if (!res) return {};
  if (res.data && typeof res.data === 'object') return res.data;
  if (res.success && res.data) return res.data;
  return res;
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const res = await authApi.login(username, password);
      const payload = extract(res);
      const user = payload.user || payload.data?.user || payload.data || payload;
      const accessToken =
        payload.accessToken || payload.data?.accessToken || payload.token || payload?.token;
      return { user, accessToken, raw: payload };
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const signupThunk = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await authApi.signup(userData);
      return extract(res);
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const verifyOtpThunk = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const res = await authApi.verifyOtp(email, otp);
      return extract(res);
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const refreshTokenThunk = createAsyncThunk(
  'auth/refresh',
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.refreshToken();
      const payload = extract(res);
      const accessToken = payload.accessToken || payload.data?.accessToken || payload.token;
      return { accessToken, raw: payload };
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('token'),
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      if (action.payload) localStorage.setItem('user', JSON.stringify(action.payload));
      else localStorage.removeItem('user');
    },
    setToken(state, action) {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) localStorage.setItem('token', action.payload);
      else localStorage.removeItem('token');
    },
    logoutAction(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { user, accessToken } = action.payload;
        state.user = user || state.user;
        state.token = accessToken || state.token;
        state.isAuthenticated = !!state.token;
        if (state.token) localStorage.setItem('token', state.token);
        if (state.user) localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message;
      })
      .addCase(signupThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message;
      })
      .addCase(verifyOtpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtpThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message;
      })
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        const { accessToken } = action.payload;
        if (accessToken) {
          state.token = accessToken;
          localStorage.setItem('token', accessToken);
          state.isAuthenticated = true;
        }
      })
      .addCase(refreshTokenThunk.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
  },
});

export const { setUser, setToken, logoutAction } = slice.actions;
export default slice.reducer;
