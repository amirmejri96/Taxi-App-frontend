import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRequests } from '../../redux/actions/requestActions';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../assets/css/requestList.css';

const RequestList = () => {
    const dispatch = useDispatch();
    const { requests, isLoading, error } = useSelector((state) => state.requests);

    useEffect(() => {
        dispatch(fetchRequests());
    }, [dispatch]);

    return (
        <div className="request-list-container">
            <h2>Mes requêtes</h2>
            {isLoading ? (
                <LoadingSpinner size="medium" />
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : requests.length === 0 ? (
                <p>Aucune requête trouvée.</p>
            ) : (
                <table className="request-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Adresse de départ</th>
                            <th>Adresse de destination</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => (
                            <tr key={request.id}>
                                <td data-label="Date">{new Date(request.createdAt).toLocaleDateString()}</td>
                                <td data-label="Adresse de départ">{request.pickupAddress}</td>
                                <td data-label="Adresse de destination">{request.dropoffAddress}</td>
                                <td data-label="Statut" className={`status-${request.status}`}>
                                    {request.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default RequestList;