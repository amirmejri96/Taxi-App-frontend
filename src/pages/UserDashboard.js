import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadScript } from '@react-google-maps/api';
import RequestForm from '../components/user/RequestForm';
import RequestList from '../components/user/RequestList';
import TrackingMap from '../components/admin/TrackingMap';
import { fetchRequests } from '../redux/actions/requestActions';
import '../assets/css/UserDashboard.css';

const libraries = ['places']; // Charger Places pour RequestForm et TrackingMap

const UserDashboard = () => {
    const dispatch = useDispatch();
    const { requests } = useSelector((state) => state.requests);
    const [addresses, setAddresses] = useState({
        pickupAddress: '',
        dropoffAddress: '',
    });

    useEffect(() => {
        dispatch(fetchRequests());
    }, [dispatch]);

    const handleRequestSubmit = (pickup, dropoff) => {
        setAddresses({ pickupAddress: pickup, dropoffAddress: dropoff });
    };

    return (
        <LoadScript
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            libraries={libraries}
        >
            <div className="dashboard-container">
                <h1>Tableau de bord utilisateur</h1>
                <div className="dashboard-section">
                    <RequestForm onSubmit={handleRequestSubmit} />
                </div>
                <div className="dashboard-section">
                    <RequestList requests={requests} />
                </div>
                <div className="dashboard-section">
                    <TrackingMap
                        pickupAddress={addresses.pickupAddress}
                        dropoffAddress={addresses.dropoffAddress}
                    />
                </div>
            </div>
        </LoadScript>
    );
};

export default UserDashboard;