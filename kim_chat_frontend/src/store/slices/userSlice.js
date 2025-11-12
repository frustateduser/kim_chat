import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchUser as apiSearchUser } from '@api/chat';

export const searchUsers = createAsyncThunk(
  'user/search',
  async ({ userId, username, signal: payloadSignal }, { rejectWithValue, signal }) => {
    try {
      // prefer a provided AbortController.signal from the caller, otherwise use thunk signal
      const effectiveSignal = payloadSignal || signal;
      const res = await apiSearchUser(userId, username, effectiveSignal);
      const recipient = res?.recipient;
      if (!recipient) {
        return rejectWithValue({ message: 'User not found' });
      }
      return recipient;
    } catch (err) {
      // If the error is an abort, throw the original error so callers can ignore it
      if (err.name === 'CanceledError' || err.name === 'AbortError') {
        return rejectWithValue({ message: 'Search cancelled' });
      }
      const errorMessage = err.response?.data?.message || err.message || 'Search failed';
      return rejectWithValue({ message: errorMessage });
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    searchResults: [],
    searchLoading: false,
    searchError: null,
    recentSearches: [],
  },
  reducers: {
    clearSearchResults(state) {
      state.searchResults = [];
      state.searchError = null;
    },
    addToRecentSearches(state, action) {
      const user = action.payload;
      state.recentSearches = [
        user,
        ...state.recentSearches.filter((u) => u._id !== user._id),
      ].slice(0, 10);
    },
    clearRecentSearches(state) {
      state.recentSearches = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUsers.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.searchLoading = false;
        // action.payload is a single user (recipient) from API; store as an array
        state.searchResults = action.payload ? [action.payload] : [];
        state.searchError = null;
        if (action.payload) {
          state.recentSearches = [
            action.payload,
            ...state.recentSearches.filter((u) => u._id !== action.payload._id),
          ].slice(0, 10);
        }
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload?.message || 'Search failed';
        state.searchResults = [];
      });
  },
});

export const { clearSearchResults, addToRecentSearches, clearRecentSearches } = userSlice.actions;
export default userSlice.reducer;
