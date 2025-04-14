// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchRequests, updateRequest, assignRequest } from '../../redux/actions/requestActions';
// import api from '../../services/api';
// import LoadingSpinner from '../../components/common/LoadingSpinner';
// import '../../assets/css/requestManager.css';

// const RequestManager = () => {
//     const dispatch = useDispatch();
//     const { requests, isLoading, error } = useSelector((state) => state.requests);
//     const [transporteurs, setTransporteurs] = useState([]);
//     const [fetchError, setFetchError] = useState(null);


//     useEffect(() => {
//         console.log('RequestManager: Dispatching fetchRequests');
//         dispatch(fetchRequests());

//         const fetchTransporteurs = async () => {
//             try {
//                 console.log('RequestManager: Fetching transporteurs');
//                 const response = await api.get('/users/transporteurs');
//                 setTransporteurs(response.data);
//                 console.log('RequestManager: Transporteurs fetched:', response.data);
//                 if (response.data.length === 0) {
//                     setFetchError('Aucun transporteur disponible');
//                 }
//             } catch (err) {
//                 console.error('RequestManager: Error fetching transporteurs:', err);
//                 setFetchError(err.response?.data?.message );
//             }
//         };
//         fetchTransporteurs();
//     }, [dispatch]);

//     const handleStatusChange = async (id, status) => {
//         try {
//             console.log('RequestManager: Updating request:', { id, status });
//             await dispatch(updateRequest({ id, status })).unwrap();
//             dispatch(fetchRequests()); // Refresh requests after update
//         } catch (err) {
//             console.error('RequestManager: Error updating request:', err);
//         }
//     };

//     const handleAssign = async (id, transportId) => {
//         try {
//             console.log('RequestManager: Assigning request:', { id, transportId });
//             await dispatch(assignRequest({ id, transportId })).unwrap();
//             dispatch(fetchRequests()); // Refresh requests after assignment
//         } catch (err) {
//             console.error('RequestManager: Error assigning request:', err);
//         }
//     };

//     if (isLoading) {
//         return (
//             <div className="request-manager-container">
//                 <LoadingSpinner />
//                 <p>Chargement des requêtes...</p>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="request-manager-container">
//                 <p className="error-message">Erreur des requêtes : {error}</p>
//             </div>
//         );
//     }

//     return (
//         <div className="request-manager-container">
//             <h2>Gestion des requêtes</h2>
//             {fetchError && <p className="warning-message">{fetchError}</p>}
//             {requests.length === 0 ? (
//                 <p>Aucune requête disponible.</p>
//             ) : (
//                 <table className="request-table">
//                     <thead>
//                         <tr>
//                             <th>Utilisateur</th>
//                             <th>Départ</th>
//                             <th>Destination</th>
//                             <th>Statut</th>
//                             {/* <th>Transporteur</th> */}
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {requests.map((request) => (
//                             <tr key={request._id}>
//                                 <td>{request.user?.name || 'Inconnu'}</td>
//                                 <td>{request.pickupAddress}</td>
//                                 <td>{request.dropoffAddress}</td>
//                                 <td>{request.status}</td>
//                                 {/* <td>{request.transport?.name || 'Non assigné'}</td> */}
//                                 <td>
//                                     <select
//                                         value={request.status}
//                                         onChange={(e) => handleStatusChange(request._id, e.target.value)}
//                                         disabled={request.status === 'completed'}
//                                     >
//                                         <option value="pending">En attente</option>
//                                         <option value="approved">Approuvé</option>
//                                         <option value="completed">Terminé</option>
//                                     </select>
//                                     {/* <select
//                                         onChange={(e) => handleAssign(request._id, e.target.value)}
//                                         disabled={request.transport || transporteurs.length === 0}
//                                         value={request.transport?._id || ''}
//                                     >
//                                         <option value="">Sélectionner un transporteur</option>
//                                         {transporteurs.map((transport) => (
//                                             <option key={transport._id} value={transport._id}>
//                                                 {transport.name}
//                                             </option>
//                                         ))}
//                                     </select> */}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}
//         </div>
//     );
// };

// export default RequestManager;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../assets/css/requestManager.css';

const RequestManager = ({ onSelectRequest }) => {
    const [requests, setRequests] = useState([]);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/requests', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRequests(response.data);
                setFetchError(null);
            } catch (error) {
                console.error('Erreur lors de la récupération des requêtes :', error);
                setFetchError('Erreur lors du chargement des requêtes.');
            }
        };

        fetchRequests();
    }, []);

    const handleStatusChange = async (requestId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:5000/api/requests/${requestId}`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            setRequests((prevRequests) =>
                prevRequests.map((req) =>
                    req._id === requestId ? { ...req, status: response.data.status } : req
                )
            );
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut :", error);
        }
    };

    const handleSelectRequest = (request) => {
        if (onSelectRequest) {
            onSelectRequest({
                pickupAddress: request.pickupAddress,
                dropoffAddress: request.dropoffAddress,
            });
        }
    };

    return (
        <div className="request-manager-container">
            <h2>Gestion des requêtes</h2>
            {fetchError && <p className="warning-message">{fetchError}</p>}
            {requests.length === 0 ? (
                <p>Aucune requête disponible.</p>
            ) : (
                <table className="request-table">
                    <thead>
                        <tr>
                            <th>Utilisateur</th>
                            <th>Départ</th>
                            <th>Destination</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => (
                            <tr
                                key={request._id}
                                onClick={() => handleSelectRequest(request)}
                                style={{ cursor: 'pointer' }}
                            >
                                <td>{request.user?.name || 'Inconnu'}</td>
                                <td>{request.pickupAddress}</td>
                                <td>{request.dropoffAddress}</td>
                                <td>{request.status}</td>
                                <td>
                                    <select
                                        value={request.status}
                                        onChange={(e) => handleStatusChange(request._id, e.target.value)}
                                        disabled={request.status === 'completed'}
                                    >
                                        <option value="pending">En attente</option>
                                        <option value="approved">Approuvé</option>
                                        <option value="completed">Terminé</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default RequestManager;
