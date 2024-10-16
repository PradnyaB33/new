import React, { useEffect, useState } from 'react';

const Vendorlist = ({ location }) => {
  const [cafeterias, setCafeterias] = useState([]);

  useEffect(() => {
    const fetchCafeterias = async () => {
      // Mock fetch request
      const response = await fetch(`/api/cafeterias?lat=${location.latitude}&lon=${location.longitude}`);
      const data = await response.json();
      setCafeterias(data);
    };

    if (location) {
      fetchCafeterias();
    }
  }, [location]);

  return (
    <div className="m-4">
      {cafeterias.map(cafeteria => (
        <div key={cafeteria.id} className="border p-2 my-2">
          <h2>name</h2>
          <p>{cafeteria.address}</p>
          <button className="bg-green-500 text-white p-2 rounded">Select</button>
        </div>
      ))}
    </div>
  );
};

export default Vendorlist; // Make sure to export the component
