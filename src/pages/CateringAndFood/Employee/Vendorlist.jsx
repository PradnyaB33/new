
// import axios from 'axios';
// import React, { useState, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import useAuthToken from '../../../hooks/Token/useAuth';
// import hrmsImg from '../../../assets/hrmsImg.png';
// import useCartStore from './useCartStore';
// import { FaMapMarkerAlt } from 'react-icons/fa'; // Import a GPS icon

// const Vendorlist = () => {
//   const [vendors, setVendors] = useState([]);
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [filteredVendors, setFilteredVendors] = useState([]);
//   const authToken = useAuthToken();
  
//   const { clearCart } = useCartStore();

//   const fetchVendors = useCallback(async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API}/route/vendor/fetchvendor`, {
//         headers: {
//           Authorization: authToken,
//         },
//       });
//       setVendors(response.data.vendors || []);
//       console.log("All Vendor Data", response.data.vendors);
//     } catch (error) {
//       console.error('Error fetching vendors:', error);
//     }
//   }, [authToken]);

//   useEffect(() => {
//     fetchVendors();
//   }, [fetchVendors]);

//   useEffect(() => {
//     clearCart();
//   }, [clearCart]);

//   const getCurrentLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         position => {
//           const { latitude, longitude } = position.coords;
//           setCurrentLocation({ latitude, longitude });
//           filterVendorsByLocation(latitude, longitude);
//         },
//         error => {
//           console.error("Error getting location: ", error);
//         }
//       );
//     } else {
//       alert("Geolocation is not supported by this browser.");
//     }
//   };

//   const haversineDistance = (lat1, lon1, lat2, lon2) => {
//     const toRad = (value) => (value * Math.PI) / 180;

//     const R = 6371; // Radius of the Earth in km
//     const dLat = toRad(lat2 - lat1);
//     const dLon = toRad(lon2 - lon1);

//     const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//               Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
//               Math.sin(dLon / 2) * Math.sin(dLon / 2);

//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     return R * c; // Distance in km
//   };

//   const filterVendorsByLocation = (latitude, longitude) => {
//     alert("hi")
//     const filtered = vendors.filter(vendor => {
//       const vendorLat = parseFloat(vendor.latitude);
//       const vendorLon = parseFloat(vendor.longitude);

//       console.log("Vendor Coordinates:", vendorLat, vendorLon);
//       console.log("Current Location:", latitude, longitude);
      
//       const distance = haversineDistance(latitude, longitude, vendorLat, vendorLon);
//       return distance < 11; // Filter vendors within 11 km
//     });

//     setFilteredVendors(filtered);
//     console.log("Filtered Vendors", filtered);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-4xl font-bold text-center mb-8">Available Vendors</h1>
//         <button 
//           onClick={getCurrentLocation} 
//           className="p-2 bg-blue-500 text-white rounded-full"
//           title="Use GPS to find nearest vendors"
//         >
//           <FaMapMarkerAlt />
//         </button>
//       </div>
//       <div className="flex flex-wrap justify-center">
//         {(filteredVendors.length > 0 ? filteredVendors : vendors).map(vendor => (
//           <Link
//             key={vendor._id}
//             to={`/vendors/restaurantmenu/${vendor._id}`}
//             className="max-w-xs rounded-lg overflow-hidden shadow-lg m-4 transform transition-transform hover:scale-105 hover:shadow-2xl"
//           >
//             <img className="w-full h-32 object-cover" src={hrmsImg} alt="Vendor" />
//             <div className="px-4 py-3 bg-white">
//               <h2 className="font-bold text-lg mb-1 text-gray-800">{vendor.companyname}</h2>
//               <p className="text-gray-600 text-sm">{vendor.address}</p>
//             </div>
//             <div className="px-4 pt-2 pb-2 bg-gray-50">
//               <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">#vendor</span>
//               <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">#services</span>
//               <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">#contact</span>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Vendorlist;


// import axios from 'axios';
// import React, { useState, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import useAuthToken from '../../../hooks/Token/useAuth';
// import hrmsImg from '../../../assets/hrmsImg.png';
// import useCartStore from './useCartStore';
// import { FaMapMarkerAlt } from 'react-icons/fa';

// const Vendorlist = () => {
//   const [vendors, setVendors] = useState([]);
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [locationName, setLocationName] = useState('');
//   const [filteredVendors, setFilteredVendors] = useState([]);
//   const authToken = useAuthToken();
//   const { clearCart } = useCartStore();

//   const fetchVendors = useCallback(async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API}/route/vendor/fetchvendor`, {
//         headers: {
//           Authorization: authToken,
//         },
//       });
//       setVendors(response.data.vendors || []);
//       console.log("All Vendor Data", response.data.vendors);
//     } catch (error) {
//       console.error('Error fetching vendors:', error);
//     }
//   }, [authToken]);

//   useEffect(() => {
//     fetchVendors();
//   }, [fetchVendors]);

//   useEffect(() => {
//     clearCart();
//   }, [clearCart]);

//   const getCurrentLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async position => {
//           const { latitude, longitude } = position.coords;
//           setCurrentLocation({ latitude, longitude });
//           await getLocationName(latitude, longitude);
//           filterVendorsByLocation(latitude, longitude);
//         },
//         error => {
//           console.error("Error getting location: ", error);
//         }
//       );
//     } else {
//       alert("Geolocation is not supported by this browser.");
//     }
//   };

//   const getLocationName = async (latitude, longitude) => {
//     try {
//       const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
//       setLocationName(response.data.display_name);
//     } catch (error) {
//       console.error("Error fetching location name:", error);
//     }
//   };

//   const haversineDistance = (lat1, lon1, lat2, lon2) => {
//     const toRad = (value) => (value * Math.PI) / 180;

//     const R = 6371; // Radius of the Earth in km
//     const dLat = toRad(lat2 - lat1);
//     const dLon = toRad(lon2 - lon1);

//     const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//               Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
//               Math.sin(dLon / 2) * Math.sin(dLon / 2);

//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     return R * c; // Distance in km
//   };

//   const filterVendorsByLocation = (latitude, longitude) => {
//     const filtered = vendors.filter(vendor => {
//       const vendorLat = parseFloat(vendor.latitude);
//       const vendorLon = parseFloat(vendor.longitude);

//       const distance = haversineDistance(latitude, longitude, vendorLat, vendorLon);
//       return distance < 11; // Filter vendors within 11 km
//     });

//     setFilteredVendors(filtered);
//     console.log("Filtered Vendors", filtered);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-4xl font-bold text-center mb-8">Available Vendors {locationName && `at ${locationName}`}</h1>
//         <button 
//           onClick={getCurrentLocation} 
//           className="p-2 bg-blue-500 text-white rounded-full"
//           title="Use GPS to find nearest vendors"
//         >
//           <FaMapMarkerAlt />
//         </button>
//       </div>
//       {currentLocation && (
//         <div className="text-center mb-4">
//           <p>Current Location: {locationName}</p>
//         </div>
//       )}
//       <div className="flex flex-wrap justify-center">
//         {(filteredVendors.length > 0 ? filteredVendors : vendors).map(vendor => (
//           <Link
//             key={vendor._id}
//             to={`/vendors/restaurantmenu/${vendor._id}`}
//             className="max-w-xs rounded-lg overflow-hidden shadow-lg m-4 transform transition-transform hover:scale-105 hover:shadow-2xl"
//           >
//             <img className="w-full h-32 object-cover" src={hrmsImg} alt="Vendor" />
//             <div className="px-4 py-3 bg-white">
//               <h2 className="font-bold text-lg mb-1 text-gray-800">{vendor.companyname}</h2>
//               <p className="text-gray-600 text-sm">{vendor.address}</p>
//             </div>
//             <div className="px-4 pt-2 pb-2 bg-gray-50">
//               <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">#vendor</span>
//               <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">#services</span>
//               <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">#contact</span>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Vendorlist;


//add image and search bar

// import axios from 'axios';
// import React, { useState, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import useAuthToken from '../../../hooks/Token/useAuth';
// import hrmsImg from '../../../assets/hrmsImg.png';
// import useCartStore from './useCartStore';
// import { FaMapMarkerAlt } from 'react-icons/fa';

// const Vendorlist = () => {
//   const [vendors, setVendors] = useState([]);
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [locationName, setLocationName] = useState('');
//   const [filteredVendors, setFilteredVendors] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const authToken = useAuthToken();
//   const { clearCart } = useCartStore();

//   const fetchVendors = useCallback(async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API}/route/vendor/fetchvendor`, {
//         headers: {
//           Authorization: authToken,
//         },
//       });
//       setVendors(response.data.vendors || []);
//     } catch (error) {
//       console.error('Error fetching vendors:', error);
//     }
//   }, [authToken]);

//   useEffect(() => {
//     fetchVendors();
//   }, [fetchVendors]);

//   useEffect(() => {
//     clearCart();
//   }, [clearCart]);

//   const getCurrentLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async position => {
//           const { latitude, longitude } = position.coords;
//           setCurrentLocation({ latitude, longitude });
//           await getLocationName(latitude, longitude);
//           filterVendorsByLocation(latitude, longitude);
//         },
//         error => {
//           console.error("Error getting location: ", error);
//         }
//       );
//     } else {
//       alert("Geolocation is not supported by this browser.");
//     }
//   };

//   const getLocationName = async (latitude, longitude) => {
//     try {
//       const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
//       setLocationName(response.data.display_name);
//     } catch (error) {
//       console.error("Error fetching location name:", error);
//     }
//   };

//   const filterVendorsByLocation = (latitude, longitude) => {
//     const filtered = vendors.filter(vendor => {
//       const vendorLat = parseFloat(vendor.latitude);
//       const vendorLon = parseFloat(vendor.longitude);
//       const distance = haversineDistance(latitude, longitude, vendorLat, vendorLon);
//       return distance < 11; // Filter vendors within 11 km
//     });
//     setFilteredVendors(filtered);
//   };

//   const haversineDistance = (lat1, lon1, lat2, lon2) => {
//     const toRad = (value) => (value * Math.PI) / 180;
//     const R = 6371; // Radius of the Earth in km
//     const dLat = toRad(lat2 - lat1);
//     const dLon = toRad(lon2 - lon1);
//     const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//               Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
//               Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c; // Distance in km
//   };

//   const handleSearch = () => {
//     const lowercasedSearchTerm = searchTerm.toLowerCase();
//     const filtered = vendors.filter(vendor => vendor.companyname.toLowerCase().includes(lowercasedSearchTerm));
//     setFilteredVendors(filtered);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="relative h-[30vh] mb-4">
//         <img src={hrmsImg} alt="Background" className="w-full h-full object-cover" />
//         <div className="absolute top-0 left-0 right-0 p-4 flex items-center bg-white bg-opacity-75 rounded-md shadow-md">
//           <button 
//             onClick={getCurrentLocation} 
//             className="mr-2 p-2 bg-blue-500 text-white rounded-full"
//             title="Use GPS to find nearest vendors"
//           >
//             <FaMapMarkerAlt />
//           </button>
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder="Search vendors..."
//             className="flex-1 p-2 border border-gray-300 rounded-l-md"
//           />
//           <button onClick={handleSearch} className="p-2 bg-blue-500 text-white rounded-r-md">Search</button>
//         </div>
//       </div>

//       <div className="text-center mb-4">
//         {currentLocation && <p>Current Location: {locationName}</p>}
//       </div>

//       <h1 className="text-4xl font-bold text-center mb-8">Available Vendors {locationName && `at ${locationName}`}</h1>
//       <div className="flex flex-wrap justify-center">
//         {(filteredVendors.length > 0 ? filteredVendors : vendors).map(vendor => (
//           <Link
//             key={vendor._id}
//             to={`/vendors/restaurantmenu/${vendor._id}`}
//             className="max-w-xs rounded-lg overflow-hidden shadow-lg m-4 transform transition-transform hover:scale-105 hover:shadow-2xl"
//           >
//             <img className="w-full h-32 object-cover" src={hrmsImg} alt="Vendor" />
//             <div className="px-4 py-3 bg-white">
//               <h2 className="font-bold text-lg mb-1 text-gray-800">{vendor.companyname}</h2>
//               <p className="text-gray-600 text-sm">{vendor.address}</p>
//             </div>
//             <div className="px-4 pt-2 pb-2 bg-gray-50">
//               <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">#vendor</span>
//               <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">#services</span>
//               <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">#contact</span>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Vendorlist;



// import axios from 'axios';
// import React, { useState, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import useAuthToken from '../../../hooks/Token/useAuth';
// import hrmsImg from '../../../assets/hrmsImg.png';
// import foodbagroundimage from'../../../assets/foodbagroundimage.webp';
// import useCartStore from './useCartStore';
// import { FaMapMarkerAlt } from 'react-icons/fa';

// const Vendorlist = () => {
//   const [vendors, setVendors] = useState([]);
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [locationName, setLocationName] = useState('');
//   const [filteredVendors, setFilteredVendors] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const authToken = useAuthToken();
//   const { clearCart } = useCartStore();

//   const fetchVendors = useCallback(async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API}/route/vendor/fetchvendor`, {
//         headers: {
//           Authorization: authToken,
//         },
//       });
//       setVendors(response.data.vendors || []);
//     } catch (error) {
//       console.error('Error fetching vendors:', error);
//     }
//   }, [authToken]);

//   useEffect(() => {
//     fetchVendors();
//   }, [fetchVendors]);

//   useEffect(() => {
//     clearCart();
//   }, [clearCart]);

//   const getCurrentLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async position => {
//           const { latitude, longitude } = position.coords;
//           setCurrentLocation({ latitude, longitude });
//           await getLocationName(latitude, longitude);
//           filterVendorsByLocation(latitude, longitude);
//         },
//         error => {
//           console.error("Error getting location: ", error);
//         }
//       );
//     } else {
//       alert("Geolocation is not supported by this browser.");
//     }
//   };

//   const getLocationName = async (latitude, longitude) => {
//     try {
//       const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
//       setLocationName(response.data.display_name);
//     } catch (error) {
//       console.error("Error fetching location name:", error);
//     }
//   };

//   const filterVendorsByLocation = (latitude, longitude) => {
//     const filtered = vendors.filter(vendor => {
//       const vendorLat = parseFloat(vendor.latitude);
//       const vendorLon = parseFloat(vendor.longitude);
//       const distance = haversineDistance(latitude, longitude, vendorLat, vendorLon);
//       return distance < 11; // Filter vendors within 11 km
//     });
//     setFilteredVendors(filtered);
//   };

//   const haversineDistance = (lat1, lon1, lat2, lon2) => {
//     const toRad = (value) => (value * Math.PI) / 180;
//     const R = 6371; // Radius of the Earth in km
//     const dLat = toRad(lat2 - lat1);
//     const dLon = toRad(lon2 - lon1);
//     const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//               Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
//               Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c; // Distance in km
//   };

//   const handleSearch = () => {
//     const lowercasedSearchTerm = searchTerm.toLowerCase();
//     const filtered = vendors.filter(vendor => vendor.companyname.toLowerCase().includes(lowercasedSearchTerm));
//     setFilteredVendors(filtered);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="relative h-[50vh] mb-4">
//         <img src={foodbagroundimage} alt="Background" className="w-full h-full object-cover" />
//         <div className="absolute top-20 left-0 right-0 p-4  flex items-center bg-white bg-opacity-75 rounded-md shadow-md">
//           <button 
//             onClick={getCurrentLocation} 
//             className="mr-2 p-2 bg-blue-500 text-white rounded-full"
//             title="Use GPS to find nearest vendors"
//           >
//             <FaMapMarkerAlt />
//           </button>
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder="Search vendors..."
//             className="flex-1 p-2 border border-gray-300 rounded-l-md"
//           />
//           <button onClick={handleSearch} className="p-2 bg-blue-500 text-white rounded-r-md">Search</button>
//         </div>
//       </div>

//       <div className="text-center mb-4">
//         {currentLocation && <p>Current Location: {locationName}</p>}
//       </div>

//       <h1 className="text-4xl font-bold text-center mb-8">Available Vendors {locationName && `at ${locationName}`}</h1>
//       <div className="flex flex-wrap justify-center">
//         {(filteredVendors.length > 0 ? filteredVendors : vendors).map(vendor => (
//           <Link
//             key={vendor._id}
//             to={`/vendors/restaurantmenu/${vendor._id}`}
//             className="max-w-xs rounded-lg overflow-hidden shadow-lg m-4 transform transition-transform hover:scale-105 hover:shadow-2xl"
//           >
//             <img className="w-full h-32 object-cover" src={hrmsImg} alt="Vendor" />
//             <div className="px-4 py-3 bg-white">
//               <h2 className="font-bold text-lg mb-1 text-gray-800">{vendor.companyname}</h2>
//               <p className="text-gray-600 text-sm">{vendor.address}</p>
//             </div>
//             <div className="px-4 pt-2 pb-2 bg-gray-50">
//               <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">#vendor</span>
//               <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">#services</span>
//               <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">#contact</span>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Vendorlist;



// import axios from 'axios';
// import React, { useState, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import useAuthToken from '../../../hooks/Token/useAuth';
// import hrmsImg from '../../../assets/hrmsImg.png';
// import foodbagroundimage from '../../../assets/foodbagroundimage.webp';
// import useCartStore from './useCartStore';
// import { FaMapMarkerAlt } from 'react-icons/fa';

// const Vendorlist = () => {
//   const [vendors, setVendors] = useState([]);
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [locationName, setLocationName] = useState('');
//   const [filteredVendors, setFilteredVendors] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const authToken = useAuthToken();
//   const { clearCart } = useCartStore();

//   const fetchVendors = useCallback(async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API}/route/vendor/fetchvendor`, {
//         headers: {
//           Authorization: authToken,
//         },
//       });
//       setVendors(response.data.vendors || []);
//     } catch (error) {
//       console.error('Error fetching vendors:', error);
//     }
//   }, [authToken]);

//   useEffect(() => {
//     fetchVendors();
//   }, [fetchVendors]);

//   useEffect(() => {
//     clearCart();
//   }, [clearCart]);

//   const getCurrentLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async position => {
//           const { latitude, longitude } = position.coords;
//           setCurrentLocation({ latitude, longitude });
//           await getLocationName(latitude, longitude);
//           filterVendorsByLocation(latitude, longitude);
//         },
//         error => {
//           console.error("Error getting location: ", error);
//         }
//       );
//     } else {
//       alert("Geolocation is not supported by this browser.");
//     }
//   };

//   const getLocationName = async (latitude, longitude) => {
//     try {
//       const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
//       console.log("location Name ",response);
//       const displayName = response.data.address.state_district;
//       alert(displayName);
      
//       setLocationName(displayName);
//     } catch (error) {
//       console.error("Error fetching location name:", error);
//     }
//   };

//   const filterVendorsByLocation = (latitude, longitude) => {
//     const filtered = vendors.filter(vendor => {
//       const vendorLat = parseFloat(vendor.latitude);
//       const vendorLon = parseFloat(vendor.longitude);
//       const distance = haversineDistance(latitude, longitude, vendorLat, vendorLon);
//       return distance < 11; // Filter vendors within 11 km
//     });
//     setFilteredVendors(filtered);
//   };

//   const haversineDistance = (lat1, lon1, lat2, lon2) => {
//     const toRad = (value) => (value * Math.PI) / 180;
//     const R = 6371; // Radius of the Earth in km
//     const dLat = toRad(lat2 - lat1);
//     const dLon = toRad(lon2 - lon1);
//     const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//               Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
//               Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c; // Distance in km
//   };

//   const handleSearch = () => {
//     const lowercasedSearchTerm = searchTerm.toLowerCase();
//     const filtered = vendors.filter(vendor => vendor.companyname.toLowerCase().includes(lowercasedSearchTerm));
//     setFilteredVendors(filtered);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="relative h-[50vh] mb-4">
//         <img src={foodbagroundimage} alt="Background" className="w-full h-full object-cover" />
//         <div className="absolute top-24 left-44 right-44 p-4 flex items-center bg-white bg-opacity-75 rounded-md shadow-md">
//           <button 
//             onClick={getCurrentLocation} 
//             className="mr-2 p-2 bg-blue-500 text-white rounded-full"
//             title="Use GPS to find nearest vendors"
//           >
//             <FaMapMarkerAlt />
//           </button>
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder="Search vendors..."
//             className="flex-1 p-2 border border-gray-300 rounded-l-md"
//           />
//           <button onClick={handleSearch} className="p-2 bg-blue-500 text-white rounded-r-md">Search</button>
//         </div>
//       </div>

//       <div className="text-center mb-4">
//         {currentLocation && <p>Current Location: {locationName}</p>}
//       </div>

//       <h1 className="text-4xl font-bold text-center mb-8">
//         {filteredVendors.length > 0 
//           ? `All Vendors Available in ${locationName}` 
//           : 'All Vendors in India'}
//       </h1>
//       <div className="flex flex-wrap justify-center">
//         {(filteredVendors.length > 0 ? filteredVendors : vendors).map(vendor => (
//           <Link
//             key={vendor._id}
//             to={`/vendors/restaurantmenu/${vendor._id}`}
//             className="max-w-xs rounded-lg overflow-hidden shadow-lg m-4 transform transition-transform hover:scale-105 hover:shadow-2xl"
//           >
//             <img className="w-full h-32 object-cover" src={hrmsImg} alt="Vendor" />
//             <div className="px-4 py-3 bg-white">
//               <h2 className="font-bold text-lg mb-1 text-gray-800">{vendor.companyname}</h2>
//               <p className="text-gray-600 text-sm">{vendor.address}</p>
//             </div>
//             <div className="px-4 pt-2 pb-2 bg-gray-50">
//               <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">#vendor</span>
//               <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">#services</span>
//               <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">#contact</span>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Vendorlist;




import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useAuthToken from '../../../hooks/Token/useAuth';
import hrmsImg from '../../../assets/hrmsImg.png';
import foodbagroundimage from '../../../assets/foodbagroundimage.webp';
import useCartStore from './useCartStore';
import { FaMapMarkerAlt } from 'react-icons/fa';

const Vendorlist = () => {
  const [vendors, setVendors] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const authToken = useAuthToken();
  const { clearCart } = useCartStore();

  const fetchVendors = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/route/vendor/fetchvendor`, {
        headers: {
          Authorization: authToken,
        },
      });
      setVendors(response.data.vendors || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  }, [authToken]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
          await getLocationName(latitude, longitude);
          filterVendorsByLocation(latitude, longitude);
        },
        error => {
          console.error("Error getting location: ", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const getLocationName = async (latitude, longitude) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
      console.log("location Name ",response);
      const displayName = response.data.address.state_district;
      // alert(displayName);
      
      setLocationName(displayName);
    } catch (error) {
      console.error("Error fetching location name:", error);
    }
  };

  const filterVendorsByLocation = (latitude, longitude) => {
    const filtered = vendors.filter(vendor => {
      const vendorLat = parseFloat(vendor.latitude);
      const vendorLon = parseFloat(vendor.longitude);
      const distance = haversineDistance(latitude, longitude, vendorLat, vendorLon);
      return distance < 11; // Filter vendors within 11 km
    });
    setFilteredVendors(filtered);
  };

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const handleSearch = () => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filtered = vendors.filter(vendor => vendor.companyname.toLowerCase().includes(lowercasedSearchTerm));
    setFilteredVendors(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="relative h-[50vh] mb-4">
        <img src={foodbagroundimage} alt="Background" className="w-full h-full object-cover " />
        <div className="absolute top-24 left-44 right-44 p-4 flex  flex-col sm:flex-row items-center bg-white bg-opacity-75 rounded-md shadow-md">
          <button 
            onClick={getCurrentLocation} 
            className="mr-2  sm:mb-0 p-2 bg-blue-500 text-white rounded-full"
            title="Use GPS to find nearest vendors"
          >
            <FaMapMarkerAlt />
          </button>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search vendors..."
            className="p-2 border w-full border-gray-300 rounded-l-md"
          />
          <button onClick={handleSearch} className="p-2 bg-blue-500 text-white rounded-r-md">
            Search</button>
        </div>
      </div>

      <div className="text-center mb-4">
        {currentLocation && <p>Current Location: {locationName}</p>}
      </div>

      <h1 className="text-4xl font-bold text-center mb-8">
        {filteredVendors.length > 0 
          ? `All Vendors Available in ${locationName}` 
          : 'All Vendors in India'}
      </h1>
      <div className="flex flex-wrap justify-center">
        {(filteredVendors.length > 0 ? filteredVendors : vendors).map(vendor => (
          <Link
            key={vendor._id}
            to={`/vendors/restaurantmenu/${vendor._id}`}
            className="max-w-xs rounded-lg overflow-hidden shadow-lg m-4 transform transition-transform hover:scale-105 hover:shadow-2xl"
          >
            <img className="w-full h-32 object-cover" src={hrmsImg} alt="Vendor" />
            <div className="px-4 py-3 bg-white">
              <h2 className="font-bold text-lg mb-1 text-gray-800">{vendor.companyname}</h2>
              <p className="text-gray-600 text-sm">{vendor.address}</p>
            </div>
            <div className="px-4 pt-2 pb-2 bg-gray-50">
              <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">#vendor</span>
              <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">#services</span>
              <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">#contact</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Vendorlist;




// import axios from 'axios';
// import React, { useState, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import useAuthToken from '../../../hooks/Token/useAuth';
// import hrmsImg from '../../../assets/hrmsImg.png';
// import foodbagroundimage from '../../../assets/foodbagroundimage.webp';
// import useCartStore from './useCartStore';
// import { FaMapMarkerAlt } from 'react-icons/fa';

// const Vendorlist = () => {
//   const [vendors, setVendors] = useState([]);
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [locationName, setLocationName] = useState('');
//   const [filteredVendors, setFilteredVendors] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [locationType, setLocationType] = useState('manual'); // 'manual' or 'gps'
//   const [showMap, setShowMap] = useState(false); // Toggle for showing map
//   const authToken = useAuthToken();
//   const { clearCart } = useCartStore();

//   const fetchVendors = useCallback(async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API}/route/vendor/fetchvendor`, {
//         headers: {
//           Authorization: authToken,
//         },
//       });
//       setVendors(response.data.vendors || []);
//     } catch (error) {
//       console.error('Error fetching vendors:', error);
//     }
//   }, [authToken]);

//   useEffect(() => {
//     fetchVendors();
//   }, [fetchVendors]);

//   useEffect(() => {
//     clearCart();
//   }, [clearCart]);

//   const getCurrentLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async position => {
//           const { latitude, longitude } = position.coords;
//           setCurrentLocation({ latitude, longitude });
//           setLocationName('Current Location');
//           filterVendorsByLocation(latitude, longitude);
//         },
//         error => {
//           console.error("Error getting location: ", error);
//         }
//       );
//     } else {
//       alert("Geolocation is not supported by this browser.");
//     }
//   };

//   const filterVendorsByLocation = (latitude, longitude) => {
//     const filtered = vendors.filter(vendor => {
//       const vendorLat = parseFloat(vendor.latitude);
//       const vendorLon = parseFloat(vendor.longitude);
//       const distance = haversineDistance(latitude, longitude, vendorLat, vendorLon);
//       return distance < 11; // within 11 km
//     });
//     setFilteredVendors(filtered);
//   };

//   const haversineDistance = (lat1, lon1, lat2, lon2) => {
//     const toRad = (value) => (value * Math.PI) / 180;
//     const R = 6371; // Radius of the Earth in km
//     const dLat = toRad(lat2 - lat1);
//     const dLon = toRad(lon2 - lon1);
//     const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//               Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
//               Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c; // Distance in km
//   };

//   const handleSearch = () => {
//     const lowercasedSearchTerm = searchTerm.toLowerCase();
//     const filtered = vendors.filter(vendor => vendor.companyname.toLowerCase().includes(lowercasedSearchTerm));
//     setFilteredVendors(filtered);
//   };

//   const handleManualLocation = (event) => {
//     setSearchTerm(event.target.value);
//     setLocationType('manual');
//   };

//   const handleMapLocationSelect = (lat, lon, name) => {
//     setCurrentLocation({ latitude: lat, longitude: lon });
//     setLocationName(name);
//     filterVendorsByLocation(lat, lon);
//     setShowMap(false); // Close map after selecting
//   };

//   const handleGpsClick = () => {
//     setLocationType('gps');
//     getCurrentLocation();
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="relative h-[50vh] mb-4">
//         <img src={foodbagroundimage} alt="Background" className="w-full h-full object-cover" />
//         <div className="absolute top-24 left-44 right-44 p-4 flex flex-col sm:flex-row items-center bg-white bg-opacity-75 rounded-md shadow-md">
//           <button 
//             onClick={handleGpsClick} 
//             className="mr-2 sm:mb-0 p-2 bg-blue-500 text-white rounded-full"
//             title="Use GPS to find nearest vendors"
//           >
//             <FaMapMarkerAlt />
//           </button>
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={handleManualLocation}
//             placeholder="Search vendors or enter location..."
//             className="p-2 border w-full border-gray-300 rounded-l-md"
//           />
//           <button onClick={handleSearch} className="p-2 bg-blue-500 text-white rounded-r-md">
//             Search
//           </button>
//           <button 
//             onClick={() => setShowMap(true)} 
//             className="ml-2 p-2 bg-green-500 text-white rounded-md"
//           >
//             Select on Map
//           </button>
//         </div>
//       </div>

//       {showMap && (
//         <div className="fixed inset-0 bg-white z-50">
//           <div className="relative h-full">
//             <div className="absolute top-4 right-4">
//               <button onClick={() => setShowMap(false)} className="p-2 bg-red-500 text-white rounded-full">Close</button>
//             </div>
//             <div id="map" style={{ height: '100%' }} />
//           </div>
//         </div>
//       )}

//       <div className="text-center mb-4">
//         {currentLocation && <p>Current Location: {locationName}</p>}
//       </div>

//       <h1 className="text-4xl font-bold text-center mb-8">
//         {filteredVendors.length > 0 
//           ? `All Vendors Available in ${locationName}` 
//           : 'All Vendors in India'}
//       </h1>
//       <div className="flex flex-wrap justify-center">
//         {(filteredVendors.length > 0 ? filteredVendors : vendors).map(vendor => (
//           <Link
//             key={vendor._id}
//             to={`/vendors/restaurantmenu/${vendor._id}`}
//             className="max-w-xs rounded-lg overflow-hidden shadow-lg m-4 transform transition-transform hover:scale-105 hover:shadow-2xl"
//           >
//             <img className="w-full h-32 object-cover" src={hrmsImg} alt="Vendor" />
//             <div className="px-4 py-3 bg-white">
//               <h2 className="font-bold text-lg mb-1 text-gray-800">{vendor.companyname}</h2>
//               <p className="text-gray-600 text-sm">{vendor.address}</p>
//             </div>
//             <div className="px-4 pt-2 pb-2 bg-gray-50">
//               <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">#vendor</span>
//               <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">#services</span>
//               <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">#contact</span>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Vendorlist;
