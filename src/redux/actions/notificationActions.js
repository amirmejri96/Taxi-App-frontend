import {
    addNotificationStart,
    addNotificationSuccess,
    addNotificationFailure,
} from '../slices/notificationSlice';
import api from '../../services/api';

export const addNotification = (data) => async (dispatch) => {
    try {
        dispatch(addNotificationStart());
        const response = await api.post('/notifications', data);
        dispatch(addNotificationSuccess(response.data));
    } catch (error) {
        dispatch(
            addNotificationFailure(
                error.response?.data?.message || 'Erreur lors de l’ajout de la notification'
            )
        );
    }
};