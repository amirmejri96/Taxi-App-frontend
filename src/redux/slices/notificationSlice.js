import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        addNotificationStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        addNotificationSuccess(state, action) {
            state.isLoading = false;
            state.notifications.push(action.payload);
        },
        addNotificationFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },
    },
});

export const {
    addNotificationStart,
    addNotificationSuccess,
    addNotificationFailure,
} = notificationSlice.actions;

export default notificationSlice.reducer;