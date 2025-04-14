import React from 'react';
import '../assets/css/Home.css';
import image from '../assets/images/home_image.jpg'

const Home = () => {
    return (
        <div className="home-container">
            <h1>Bienvenue sur DXC Transport-Tracking</h1>
            <p>Gérez et suivez vos requêtes de taxi en temps réel.</p>
            <img src={image} alt='image_1' />
        </div>
    );
};

export default Home;