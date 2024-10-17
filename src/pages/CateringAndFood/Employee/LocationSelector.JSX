import React, { useEffect, useState } from 'react';

const LocationSelector = () => {
    const [location, setLocation] = useState(null);

    const getLocation = () => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
        });
    };

    useEffect(() => {
        getLocation();
    }, []);

    return (
        <div className="absolute top-0 left-0 m-4">
            <button onClick={getLocation} className="bg-blue-500 text-white p-2 rounded">Get Location</button>
            {location && <p>{`Location: ${location.latitude}, ${location.longitude}`}</p>}
        </div>
    );
};
