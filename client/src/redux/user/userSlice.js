import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
  currentUser: null,
  error: null,
  loading: false, 
  token: null,
};

// Helper functions
const validateUser = (user) => {
  if (!user || typeof user !== 'object') return false;
  if (!user._id || !user.username || !user.email) return false;
  return true;
};

const handleApiError = (error) => {
  console.error('API Error:', error);
  return error.response?.data?.message || error.message || 'Something went wrong';
};

// API configuration
const apiConfig = {
  baseURL: '/api',
  withCredentials: true,
  jsonHeaders: {
    'Content-Type': 'application/json',
  },
  formDataHeaders: {
    'Content-Type': 'multipart/form-data',
  },
};

// Async thunks
export const signUp = createAsyncThunk(
  'user/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${apiConfig.baseURL}/auth/signup`,
        userData,
        {
          headers: apiConfig.jsonHeaders,
          withCredentials: apiConfig.withCredentials,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const signIn = createAsyncThunk(
  'user/signin',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${apiConfig.baseURL}/auth/signin`,
        userData,
        {
          headers: apiConfig.jsonHeaders,
          withCredentials: apiConfig.withCredentials,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const googleSignIn = createAsyncThunk(
  'user/googleSignin',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${apiConfig.baseURL}/auth/google`,
        userData,
        {
          headers: apiConfig.jsonHeaders,
          withCredentials: apiConfig.withCredentials,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async ({ userId, formData, onUploadProgress }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiConfig.baseURL}/user/update/${userId}`,
        formData,
        {
          headers: apiConfig.formDataHeaders,
          withCredentials: apiConfig.withCredentials,
          onUploadProgress,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteUser = createAsyncThunk(
  'user/delete',
  async (userId, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${apiConfig.baseURL}/user/delete/${userId}`,
        {
          withCredentials: apiConfig.withCredentials,
        }
      );
      return userId;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const signOut = createAsyncThunk(
  'user/signout',
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(
        `${apiConfig.baseURL}/auth/signout`,
        {},
        {
          withCredentials: apiConfig.withCredentials,
        }
      );
      return true;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Slice creation
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentUser: (state, action) => {
      if (validateUser(action.payload)) {
        state.currentUser = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // Common state handlers
    const pendingState = (state) => {
      state.loading = true;
      state.error = null;
    };

    const rejectedState = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    const authFulfilledState = (state, action) => {
      if (validateUser(action.payload)) {
        state.currentUser = action.payload;
        state.token = action.payload.token;
      } else {
        state.error = 'Invalid user data';
      }
      state.loading = false;
    };

    const clearUserState = (state) => {
      state.currentUser = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    };

    builder
      .addCase(signUp.pending, pendingState)
      .addCase(signUp.fulfilled, authFulfilledState)
      .addCase(signUp.rejected, rejectedState)

      .addCase(signIn.pending, pendingState)
      .addCase(signIn.fulfilled, authFulfilledState)
      .addCase(signIn.rejected, rejectedState)

      .addCase(googleSignIn.pending, pendingState)
      .addCase(googleSignIn.fulfilled, authFulfilledState)
      .addCase(googleSignIn.rejected, rejectedState)

      .addCase(updateUser.pending, pendingState)
      .addCase(updateUser.fulfilled, (state, action) => {
        if (validateUser(action.payload)) {
          state.currentUser = action.payload;
        } else {
          state.error = 'Invalid user data';
        }
        state.loading = false;
      })
      .addCase(updateUser.rejected, rejectedState)

      .addCase(deleteUser.pending, pendingState)
      .addCase(deleteUser.fulfilled, clearUserState)
      .addCase(deleteUser.rejected, rejectedState)

      .addCase(signOut.pending, pendingState)
      .addCase(signOut.fulfilled, clearUserState)
      .addCase(signOut.rejected, rejectedState);
  },
});

// Export actions and reducer
export const { clearError, setCurrentUser } = userSlice.actions;
export default userSlice.reducer;