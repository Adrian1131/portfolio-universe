import React, { useState } from 'react';

const AboutPage = () => {
    const [message, setMessage] = useState('Welcome to the About Page!');

    const handleClick = () => {
        setMessage('Thanks for visiting!');
    };

    return (
        <div>
            <h1>About Us</h1>
            <p>{message}</p>
            <button onClick={handleClick}>Click Me</button>
        </div>
    );
};

export default AboutPage;