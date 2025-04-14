import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLoadScript } from '@react-google-maps/api';
import { fetchTransportRequests, validateRequest } from '../redux/actions/requestActions';
import TrackingMap from '../components/admin/TrackingMap';
import LoadingSpinner from '../components/common/LoadingSpinner';
import '../assets/css/TransportDashboard.css';

const libraries = ['places'];

const TransportDashboard = () => {
    const dispatch = useDispatch();
    const { requests, isLoading, error } = useSelector((state) => state.requests);
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    useEffect(() => {
        console.log('TransportDashboard: Dispatching fetchTransportRequests');
        dispatch(fetchTransportRequests());
    }, [dispatch]);

    const handleValidate = async (id) => {
        try {
            console.log('Validating request:', id);
            await dispatch(validateRequest(id)).unwrap();
        } catch (err) {
            console.error('Erreur lors de la validation:', err);
        }
    };

    console.log('TransportDashboard state:', { isLoading, error, requests, isLoaded, loadError });

    if (loadError) {
        return (
            <div className="dashboard-container">
                <h1>Tableau de bord transporteur</h1>
                <p className="error-message">Erreur de chargement de Google Maps : {loadError.message}</p>
            </div>
        );
    }

    if (!isLoaded || isLoading) {
        return (
            <div className="dashboard-container">
                <LoadingSpinner />
                <p>Chargement des requêtes et de la carte...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <h1>Tableau de bord transporteur</h1>
                <p className="error-message">Erreur : {error}</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <h1>Tableau de bord transporteur</h1>
            <div className="dashboard-section">
                <h2>Requêtes approuvées</h2>
                {requests.length === 0 ? (
                    <p>Aucune requête disponible pour le moment.</p>
                ) : (
                    <table className="request-table">
                        <thead>
                            <tr>
                                <th>Utilisateur</th>
                                <th>Départ</th>
                                <th>Destination</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((request) => (
                                <tr key={request._id}>
                                    <td>{request.user?.name || 'Inconnu'}</td>
                                    <td>{request.pickupAddress}</td>
                                    <td>{request.dropoffAddress}</td>
                                    <td>
                                        <button
                                            onClick={() => handleValidate(request._id)}
                                            disabled={request.status === 'completed'}
                                        >
                                            Valider
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <div className="dashboard-section">
                <TrackingMap
                    pickupAddress={requests[0]?.pickupAddress || ''}
                    dropoffAddress={requests[0]?.dropoffAddress || ''}
                />
            </div>
        </div>
    );
};

export default TransportDashboard;