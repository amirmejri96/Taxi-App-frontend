import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Autocomplete } from '@react-google-maps/api';
import { createRequest } from '../../redux/actions/requestActions';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../assets/css/requestForm.css';

const RequestForm = ({ onSubmit }) => {
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state) => state.requests);

    const [formData, setFormData] = useState({
        pickupAddress: '',
        dropoffAddress: '',
    });

    const pickupRef = useRef(null);
    const dropoffRef = useRef(null);

    const handlePlaceChanged = (field, autocomplete) => {
        const place = autocomplete.getPlace();
        if (place && place.formatted_address) {
            setFormData((prev) => ({
                ...prev,
                [field]: place.formatted_address,
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.pickupAddress || !formData.dropoffAddress) {
            alert('Veuillez sélectionner des adresses valides.');
            return;
        }
        try {
            await dispatch(createRequest(formData)).unwrap();
            onSubmit?.(formData.pickupAddress, formData.dropoffAddress);
            setFormData({ pickupAddress: '', dropoffAddress: '' });
            if (pickupRef.current) pickupRef.current.value = '';
            if (dropoffRef.current) dropoffRef.current.value = '';
        } catch (err) {
            console.error('Erreur lors de la création:', err);
        }
    };

    return (
        <div className="request-form-container">
            <h2>Demander un taxi</h2>
            <form onSubmit={handleSubmit} className="request-form">
                <div className="form-group">
                    <label htmlFor="pickupAddress">Adresse de départ</label>
                    <Autocomplete
                        options={{ componentRestrictions: { country: 'tn' } }}
                        onLoad={(autocomplete) => {
                            pickupRef.current = autocomplete;
                            autocomplete.addListener('place_changed', () =>
                                handlePlaceChanged('pickupAddress', autocomplete)
                            );
                        }}
                        onPlaceChanged={() => {
                            if (pickupRef.current) {
                                handlePlaceChanged('pickupAddress', pickupRef.current);
                            }
                        }}
                    >
                        <input
                            type="text"
                            id="pickupAddress"
                            name="pickupAddress"
                            value={formData.pickupAddress}
                            onChange={handleChange}
                            placeholder="Entrez l'adresse de départ"
                            required
                        />
                    </Autocomplete>
                </div>
                <div className="form-group">
                    <label htmlFor="dropoffAddress">Adresse de destination</label>
                    <Autocomplete
                        options={{ componentRestrictions: { country: 'tn' } }}
                        onLoad={(autocomplete) => {
                            dropoffRef.current = autocomplete;
                            autocomplete.addListener('place_changed', () =>
                                handlePlaceChanged('dropoffAddress', autocomplete)
                            );
                        }}
                        onPlaceChanged={() => {
                            if (dropoffRef.current) {
                                handlePlaceChanged('dropoffAddress', dropoffRef.current);
                            }
                        }}
                    >
                        <input
                            type="text"
                            id="dropoffAddress"
                            name="dropoffAddress"
                            value={formData.dropoffAddress}
                            onChange={handleChange}
                            placeholder="Entrez l'adresse de destination"
                            required
                        />
                    </Autocomplete>
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? <LoadingSpinner size="small" color="#fff" /> : 'Soumettre la requête'}
                </button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default RequestForm;
