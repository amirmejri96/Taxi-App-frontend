import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransportRequests, validateRequest } from '../../redux/actions/requestActions';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../assets/css/transportRequestList.css';

const TransportRequestList = () => {
    const dispatch = useDispatch();
    const { requests, isLoading, error } = useSelector((state) => state.requests);

    useEffect(() => {
        dispatch(fetchTransportRequests());
    }, [dispatch]);

    const handleValidate = (id) => {
        dispatch(validateRequest(id));
    };

    return (
        <div className="transport-request-container">
            <h2>Requêtes assignées</h2>
            {isLoading ? (
                <LoadingSpinner size="medium" />
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : requests.length === 0 ? (
                <p>Aucune requête assignée.</p>
            ) : (
                <table className="request-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Adresse de départ</th>
                            <th>Adresse de destination</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => (
                            <tr key={request.id}>
                                <td data-label="Date">{new Date(request.createdAt).toLocaleDateString()}</td>
                                <td data-label="Adresse de départ">{request.pickupAddress}</td>
                                <td data-label="Adresse de destination">{request.dropoffAddress}</td>
                                <td data-label="Actions">
                                    {request.status === 'approved' && (
                                        <button
                                            className="action-button"
                                            onClick={() => handleValidate(request.id)}
                                        >
                                            Valider
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TransportRequestList;