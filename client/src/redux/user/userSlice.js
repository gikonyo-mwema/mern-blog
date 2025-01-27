import { createSlice } from '@reduxjs/toolkit';

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

// Create slice
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Sign-in actions
        signInStart: (state) => {
            console.log('Sign In Started');
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => {
            console.log('Sign In Success Payload:', action.payload);
            if (validateUser(action.payload)) {
                state.currentUser = action.payload;
            } else {
                console.error('Invalid user data received in signInSuccess');
                state.error = 'Invalid user data';
            }
            state.loading = false;
        },
        signInFailure: (state, action) => {
            console.error('Sign In Failure:', action.payload);
            state.loading = false;
            state.error = action.payload;
        },

        // Update user actions
        updateStart: (state) => {
            console.log('Update Started');
            state.loading = true;
            state.error = null;
        },
        updateSuccess: (state, action) => {
            console.log('Update Success Payload:', action.payload);
            if (validateUser(action.payload)) {
                state.currentUser = action.payload;
            } else {
                console.error('Invalid user data received in updateSuccess');
                state.error = 'Invalid user data';
            }
            state.loading = false;
        },
        updateFailure: (state, action) => {
            console.error('Update Failure:', action.payload);
            state.loading = false;
            state.error = action.payload;
        },

        // Delete user actions
        deleteUserStart: (state) => {
            console.log('Delete User Started');
            state.loading = true;
            state.error = null;
        },
        deleteUserSuccess: (state) => {
            console.log('Delete User Success');
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserFailure: (state, action) => {
            console.error('Delete User Failure:', action.payload);
            state.loading = false;
            state.error = action.payload;
        },

        // Sign-out action
        signoutSuccess: (state) => {
            console.log('Sign Out Success');
            state.currentUser = null;
            state.error = null;
            state.loading = false;
        },
    },
});

// Export actions
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

// Export reducer
export default userSlice.reducer;