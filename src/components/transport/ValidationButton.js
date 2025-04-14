import React from 'react';
import { useDispatch } from 'react-redux';
import { validateRequest } from '../../redux/actions/requestActions';
import '../../assets/css/ValidationButton.css';

const ValidationButton = ({ requestId }) => {
    const dispatch = useDispatch();

    const handleValidate = () => {
        dispatch(validateRequest(requestId));
    };

    return (
        <button className="validation-button" onClick={handleValidate}>
            Valider la requête
        </button>
    );
};

export default ValidationButton;