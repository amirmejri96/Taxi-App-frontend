// import React from 'react';
// import { LoadScript } from '@react-google-maps/api';
// import RequestManager from '../components/admin/RequestManager';
// import UserManager from '../components/admin/UserManager';
// import TrackingMap from '../components/admin/TrackingMap';
// import '../assets/css/AdminDashboard.css';

// const libraries = ['places'];

// const AdminDashboard = () => {
//     // Exemple : utiliser une requête dynamique plus tard
//     const pickupAddress = '12 rue de Rivoli, Paris';
//     const dropoffAddress = '1 avenue des Champs-Élysées, Paris';

//     return (
//         <LoadScript
//             googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
//             libraries={libraries}
//         >
//             <div className="dashboard-container">
//                 <h1>Tableau de bord admin</h1>
//                 <div className="dashboard-section">
//                     <RequestManager />
//                 </div>
//                 <div className="dashboard-section">
//                     <UserManager />
//                 </div>
//                 <div className="dashboard-section">
//                     <TrackingMap
//                         pickupAddress={pickupAddress}
//                         dropoffAddress={dropoffAddress}
//                     />
//                 </div>
//             </div>
//         </LoadScript>
//     );
// };

// export default AdminDashboard;


import React, { useState } from 'react';
import { LoadScript } from '@react-google-maps/api';
import RequestManager from '../components/admin/RequestManager';
import UserManager from '../components/admin/UserManager';
import TrackingMap from '../components/admin/TrackingMap';
import '../assets/css/AdminDashboard.css';

const libraries = ['places'];

const AdminDashboard = () => {
    const [selectedRequest, setSelectedRequest] = useState({
        pickupAddress: '',
        dropoffAddress: ''
    });

    const handleSelectRequest = (request) => {
        setSelectedRequest(request);
    };

    return (
        <LoadScript
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            libraries={libraries}
        >
            <div className="dashboard-container">
                <h1>Tableau de bord admin</h1>
                <div className="dashboard-section">
                    <RequestManager onSelectRequest={handleSelectRequest} />
                </div>
                <div className="dashboard-section">
                    <UserManager />
                </div>
                <div className="dashboard-section">
                    <TrackingMap
                        pickupAddress={selectedRequest.pickupAddress}
                        dropoffAddress={selectedRequest.dropoffAddress}
                    />
                </div>
            </div>
        </LoadScript>
    );
};

export default AdminDashboard;
