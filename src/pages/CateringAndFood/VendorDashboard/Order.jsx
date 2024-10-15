// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Order = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchOrders = async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API}/route/orders`);
//       if (response.data.success) {
//         setOrders(response.data.data);
//       } else {
//         console.error(response.data.error);
//       }
//     } catch (error) {
//       console.error('Failed to fetch orders:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateOrderStatus = async (orderId, newStatus) => {
//     try {
//       const response = await axios.put(`${process.env.REACT_APP_API}/route/orders/update/${orderId}`, {
//         status: newStatus,
//       });
//       if (response.data.success) {
//         setOrders((prevOrders) =>
//           prevOrders.map((order) =>
//             order.id === orderId ? { ...order, status: newStatus } : order
//           )
//         );
//       } else {
//         console.error(response.data.error);
//       }
//     } catch (error) {
//       console.error('Failed to update order status:', error);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   if (loading) {
//     return <div className="flex justify-center items-center h-screen"><div className="loader"></div></div>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6 text-center">Orders</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//         {orders.map((order) => (
//           <div key={order.id} className="bg-white rounded-lg shadow-md p-4">
//             <img src={order.image} alt={order.name} className="w-full h-40 object-cover rounded-md mb-4" />
//             <h2 className="text-xl font-semibold">{order.name}</h2>
//             <p className="text-gray-700">Price: ${order.price.toFixed(2)}</p>
//             <p className="text-gray-700">Status: {order.status}</p>
//             <p className="text-gray-700">Address: {order.address}</p>

//             <select
//               value={order.status}
//               onChange={(e) => updateOrderStatus(order.id, e.target.value)}
//               className="mt-4 border border-gray-300 rounded-md p-2"
//             >
//               <option value="Processing">Processing</option>
//               <option value="Out for Delivery">Out for Delivery</option>
//               <option value="Delivered">Delivered</option>
//             </select>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Order;


// import React, { useEffect, useState } from 'react';

// const Order = () => {
//   const [orders, setOrders] = useState([
//     {
//       id: 1,
//       image: 'https://via.placeholder.com/150',
//       name: 'Pizza Margherita',
//       price: 12.99,
//       address: '123 Pizza Lane, New York, NY',
//       status: 'Processing',
//     },
//     {
//       id: 2,
//       image: 'https://via.placeholder.com/150',
//       name: 'Sushi Platter',
//       price: 24.99,
//       address: '456 Sushi St, San Francisco, CA',
//       status: 'Out for Delivery',
//     },
//     {
//       id: 3,
//       image: 'https://via.placeholder.com/150',
//       name: 'Cheeseburger',
//       price: 9.99,
//       address: '789 Burger Blvd, Chicago, IL',
//       status: 'Delivered',
//     },
//   ]);

//   const updateOrderStatus = (orderId, newStatus) => {
//     setOrders((prevOrders) =>
//       prevOrders.map((order) =>
//         order.id === orderId ? { ...order, status: newStatus } : order
//       )
//     );
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6 text-center">Orders</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//         {orders.map((order) => (
//           <div key={order.id} className="bg-white rounded-lg shadow-md p-4">
//             <img src={order.image} alt={order.name} className="w-full h-40 object-cover rounded-md mb-4" />
//             <h2 className="text-xl font-semibold">{order.name}</h2>
//             <p className="text-gray-700">Price: ${order.price.toFixed(2)}</p>
//             <p className="text-gray-700">Status: {order.status}</p>
//             <p className="text-gray-700">Address: {order.address}</p>

//             <select
//               value={order.status}
//               onChange={(e) => updateOrderStatus(order.id, e.target.value)}
//               className="mt-4 border border-gray-300 rounded-md p-2"
//             >
//               <option value="Processing">Processing</option>
//               <option value="Out for Delivery">Out for Delivery</option>
//               <option value="Delivered">Delivered</option>
//             </select>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Order;


// import React, { useState } from 'react';

// const OrderPage = () => {
//   const [orders, setOrders] = useState([
//     {
//       id: 1,
//       image: 'https://via.placeholder.com/150',
//       name: 'Pizza Margherita',
//       price: 12.99,
//       address: '123 Pizza Lane, New York, NY',
//       status: 'Processing',
//     },
//     {
//       id: 2,
//       image: 'https://via.placeholder.com/150',
//       name: 'Sushi Platter',
//       price: 24.99,
//       address: '456 Sushi St, San Francisco, CA',
//       status: 'Out for Delivery',
//     },
//     {
//       id: 3,
//       image: 'https://via.placeholder.com/150',
//       name: 'Cheeseburger',
//       price: 9.99,
//       address: '789 Burger Blvd, Chicago, IL',
//       status: 'Delivered',
//     },

//     {
//       id: 4,
//       image: 'https://via.placeholder.com/150',
//       name: 'Cheeseburger',
//       price: 9.99,
//       address: '789 Burger Blvd, Chicago, IL',
//       status: 'Delivered',
//     },

//     {
//       id: 5,
//       image: 'https://via.placeholder.com/150',
//       name: 'Cheeseburger',
//       price: 9.99,
//       address: '789 Burger Blvd, Chicago, IL',
//       status: 'Delivered',
//     },

//     {
//       id: 6,
//       image: 'https://via.placeholder.com/150',
//       name: 'Cheeseburger',
//       price: 9.99,
//       address: '789 Burger Blvd, Chicago, IL',
//       status: 'Delivered',
//     },

//   ]);

//   const updateOrderStatus = (orderId, newStatus) => {
//     setOrders((prevOrders) =>
//       prevOrders.map((order) =>
//         order.id === orderId ? { ...order, status: newStatus } : order
//       )
//     );
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Orders</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {orders.map((order) => (
//           <div key={order.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
//             <img src={order.image} alt={order.name} className="w-full h-48 object-cover" />
//             <div className="p-6">
//               <h2 className="text-2xl font-semibold text-gray-800">{order.name}</h2>
//               <p className="text-lg text-gray-600">Price: <span className="font-bold">${order.price.toFixed(2)}</span></p>
//               <p className="text-gray-600">Status: <span className={`font-bold ${order.status === 'Delivered' ? 'text-green-600' : order.status === 'Out for Delivery' ? 'text-yellow-600' : 'text-red-600'}`}>{order.status}</span></p>
//               <p className="text-gray-600">Address: {order.address}</p>
//               <select
//                 value={order.status}
//                 onChange={(e) => updateOrderStatus(order.id, e.target.value)}
//                 className="mt-4 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//               >
//                 <option value="Processing">Processing</option>
//                 <option value="Out for Delivery">Out for Delivery</option>
//                 <option value="Delivered">Delivered</option>
//               </select>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default OrderPage;


// import React, { useState } from 'react';

// const OrderPage = () => {
//   const [orders, setOrders] = useState([
//     {
//       id: 1,
//       image: 'https://via.placeholder.com/100',
//       name: 'Pizza Margherita',
//       price: 12.99,
//       address: '123 Pizza Lane, New York, NY',
//       status: 'Processing',
//     },
//     {
//       id: 2,
//       image: 'https://via.placeholder.com/100',
//       name: 'Sushi Platter',
//       price: 24.99,
//       address: '456 Sushi St, San Francisco, CA',
//       status: 'Out for Delivery',
//     },
//     {
//       id: 3,
//       image: 'https://via.placeholder.com/100',
//       name: 'Cheeseburger',
//       price: 9.99,
//       address: '789 Burger Blvd, Chicago, IL',
//       status: 'Delivered',
//     },
//     {
//       id: 4,
//       image: 'https://via.placeholder.com/100',
//       name: 'Caesar Salad',
//       price: 8.99,
//       address: '101 Salad Ave, Los Angeles, CA',
//       status: 'Processing',
//     },
//     {
//       id: 5,
//       image: 'https://via.placeholder.com/100',
//       name: 'Pasta Primavera',
//       price: 14.99,
//       address: '202 Pasta Rd, Miami, FL',
//       status: 'Out for Delivery',
//     },
//   ]);

//   const updateOrderStatus = (orderId, newStatus) => {
//     setOrders((prevOrders) =>
//       prevOrders.map((order) =>
//         order.id === orderId ? { ...order, status: newStatus } : order
//       )
//     );
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Orders</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//         {orders.map((order) => (
//           <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105">
//             <img src={order.image} alt={order.name} className="w-full h-32 object-cover" />
//             <div className="p-4">
//               <h2 className="text-lg font-semibold text-gray-800">{order.name}</h2>
//               <p className="text-sm text-gray-600">Price: <span className="font-bold">${order.price.toFixed(2)}</span></p>
//               <p className="text-sm text-gray-600">Status: <span className={`font-bold ${order.status === 'Delivered' ? 'text-green-600' : order.status === 'Out for Delivery' ? 'text-yellow-600' : 'text-red-600'}`}>{order.status}</span></p>
//               <p className="text-sm text-gray-600">Address: {order.address}</p>
//               <select
//                 value={order.status}
//                 onChange={(e) => updateOrderStatus(order.id, e.target.value)}
//                 className="mt-2 w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-green-500"
//               >
//                 <option value="Processing">Processing</option>
//                 <option value="Out for Delivery">Out for Delivery</option>
//                 <option value="Delivered">Delivered</option>
//               </select>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default OrderPage;


import React, { useState } from 'react';

const OrderPage = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      image: 'https://via.placeholder.com/100',
      name: 'Pizza Margherita',
      price: 12.99,
      address: '123 Pizza Lane, New York, NY',
      status: 'Processing',
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/100',
      name: 'Sushi Platter',
      price: 24.99,
      address: '456 Sushi St, San Francisco, CA',
      status: 'Out for Delivery',
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/100',
      name: 'Cheeseburger',
      price: 9.99,
      address: '789 Burger Blvd, Chicago, IL',
      status: 'Delivered',
    },
    {
      id: 4,
      image: 'https://via.placeholder.com/100',
      name: 'Caesar Salad',
      price: 8.99,
      address: '101 Salad Ave, Los Angeles, CA',
      status: 'Processing',
    },
    {
      id: 5,
      image: 'https://via.placeholder.com/100',
      name: 'Pasta Primavera',
      price: 14.99,
      address: '202 Pasta Rd, Miami, FL',
      status: 'Out for Delivery',
    },
  ]);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Orders</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
            <img src={order.image} alt={order.name} className="w-full h-32 object-cover" />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">{order.name}</h2>
              <p className="text-sm text-gray-600">Price: <span className="font-bold">${order.price.toFixed(2)}</span></p>
              <p className="text-sm text-gray-600">Status: 
                <span className={`font-bold ${order.status === 'Delivered' ? 'text-green-600' : order.status === 'Out for Delivery' ? 'text-yellow-600' : 'text-red-600'}`}>
                  {order.status}
                </span>
              </p>
              <p className="text-sm text-gray-600">Address: {order.address}</p>
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                className="mt-2 w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Processing">Processing</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderPage;
