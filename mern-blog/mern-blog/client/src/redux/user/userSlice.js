import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
    currentUser: null,
    error: null,
    loading: false,
};

// Helper function to validate user object
const validateUser = (user) => {
    if (!user || typeof user !== 'object') {
        console.error('Invalid user object:', user);
        return false;
    }
    if (!user._id || !user.username || !user.email) {
        console.error('User object is missing required fields:', user);
        return false;
    }
    return true;
};

// Async thunk for regular sign-in
export const signIn = createAsyncThunk(
    'user/signin',
    async (userData, { rejectWithValue }) => {
        try {
            const res = await axios.post('/auth/signin', userData, {
                withCredentials: true
            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const googleSignIn = createAsyncThunk(
    'user/googleSignin',
    async (userData, { rejectWithValue }) => {
      try {
        const res = await axios.post(
          'http://localhost:3000/api/auth/google', // Add full URL
          userData,
          {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
          }
        );
        return res.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );

// Create slice
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => {
            if (validateUser(action.payload)) {
                state.currentUser = action.payload;
            } else {
                state.error = 'Invalid user data';
            }
            state.loading = false;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        updateStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateSuccess: (state, action) => {
            if (validateUser(action.payload)) {
                state.currentUser = action.payload;
            } else {
                state.error = 'Invalid user data';
            }
            state.loading = false;
        },
        updateFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        deleteUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        signoutSuccess: (state) => {
            state.currentUser = null;
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signIn.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signIn.fulfilled, (state, action) => {
                if (validateUser(action.payload)) {
                    state.currentUser = action.payload;
                } else {
                    state.error = 'Invalid user data';
                }
                state.loading = false;
            })
            .addCase(signIn.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Sign in failed';
            })

            .addCase(googleSignIn.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(googleSignIn.fulfilled, (state, action) => {
                if (validateUser(action.payload)) {
                    state.currentUser = action.payload;
                } else {
                    state.error = 'Invalid user data';
                }
                state.loading = false;
            })
            .addCase(googleSignIn.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Google sign in failed';
            });
    }
});

// Export actions and reducer
export const {
    signInStart,
    signInSuccess,
    signInFailure,
    updateStart,
    updateSuccess,
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signoutSuccess,
} = userSlice.actions;

export default userSlice.reducer;
