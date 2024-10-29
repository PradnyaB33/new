


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { useParams } from 'react-router-dom';

// function Menulist() {
//   const [list, setList] = useState([]);
//   const { empId } = useParams(); // Extract empId from URL parameters
// const userid= empId
//     const fetchList = async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API}/route/menu/items/${userid}`);
//       if (response.data.success) {
//         setList(response.data.data);
//       } else {
//         toast.error(response.data.error);
//       }
//     } catch (error) {
//       toast.error('Failed to fetch the menu list');
//       console.error(error);
//     }
//   };

//   const handleDelete = async (itemid) => {
//     try{
// console.log(itemid);
// alert("buttonpressed", itemid);
//     }
//      catch (error) {
//       toast.error('Failed to delete item');
//       console.error(error);
//     }
//   }

//   useEffect(() => {
//     fetchList();
//   }, []);

//   return (
//     <div className="flex flex-col p-6 bg-gray-50 min-h-screen ">
//       <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">All Food Items</h2>
//       <div className="overflow-x-auto rounded-lg shadow-md">
//         <table className="min-w-full bg-white border border-gray-300 rounded-lg">
//           <thead>
//             <tr className="bg-gray-600 text-white ">
//               <th className="py-3 px-4 border-b border-gray-200 ">Image</th>
//               <th className="py-3 px-4 border-b border-gray-200">Name</th>
//               <th className="py-3 px-4 border-b border-gray-200">Category</th>
//               <th className="py-3 px-4 border-b border-gray-200">Price</th>
//               <th className="py-3 px-4 border-b border-gray-200">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {list.length > 0 ? (
//               list.map((item) => (
//                 <tr key={item.id} className="hover:bg-gray-100 transition duration-200">
//                   <td className="py-4 px-4 border-b border-gray-200">
//                     <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg shadow-sm" />
//                   </td>
//                   <td className="py-4 px-4 border-b border-gray-200 font-semibold text-gray-700">{item.name}</td>
//                   <td className="py-4 px-4 border-b border-gray-200 text-gray-600">{item.category}</td>
//                   <td className="py-4 px-4 border-b border-gray-200 text-gray-800 font-bold">${item.price.toFixed(2)}</td>
//                   <td className="py-4 px-4 border-b border-gray-200">
//                     <button onClick={()=>handleDelete(item.id)} className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition duration-200">
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="text-center py-4 text-gray-500">No items found.</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default Menulist;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { useParams } from 'react-router-dom';
// import useAuthToken from '../../../hooks/Token/useAuth';

// function Menulist() {
//   const [list, setList] = useState([]);
//   const { empId } = useParams(); // Extract empId from URL parameters

//   const fetchList = async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API}/route/menu/items/${empId}`);
//       if (response.data.success) {
//         setList(response.data.data);
//       } else {
//         toast.error(response.data.error);
//       }
//     } catch (error) {
//       toast.error('Failed to fetch the menu list');
//       console.error(error);
//     }
//   };
  
//   const authToken = useAuthToken();
//   const handleDelete = async (menuItemId) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this item?");
//     if (confirmDelete) {
//       try {
//         alert(menuItemId )
//         const response = await axios.delete(`${process.env.REACT_APP_API}/route/menu/delete/${menuItemId}`, {
//           headers: {
//             Authorization: authToken,
//           },
//         });
//         if (response.data.success) {
//           toast.success('Item deleted successfully');
             
//           // Update the list after deletion
//           setList(list.filter(item => item.id !== menuItemId));
//         } else {
//           toast.error(response.data.error);
//         }
//       } catch (error) {
//         toast.error('Failed to delete item');
//         console.error(error);
//       }
//     }
//   }

//   useEffect(() => {
//     fetchList();
//   }, [fetchList]);

//   return (
//     <div className="flex flex-col p-6 bg-gray-50 min-h-screen">
//       <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">All Food Items</h2>
//       <div className="overflow-x-auto rounded-lg shadow-md">
//         <table className="min-w-full bg-white border border-gray-300 rounded-lg">
//           <thead>
//             <tr className="bg-gray-600 text-white">
//               <th className="py-3 px-4 border-b border-gray-200">Image</th>
//               <th className="py-3 px-4 border-b border-gray-200">Name</th>
//               <th className="py-3 px-4 border-b border-gray-200">Category</th>
//               <th className="py-3 px-4 border-b border-gray-200">Price</th>
//               <th className="py-3 px-4 border-b border-gray-200">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {list.length > 0 ? (
//               list.map((item) => (
//                 <tr key={item.id} className="hover:bg-gray-100 transition duration-200">
//                   <td className="py-4 px-4 border-b border-gray-200">
//                     <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg shadow-sm" />
//                   </td>
//                   <td className="py-4 px-4 border-b border-gray-200 font-semibold text-gray-700">{item.name}</td>
//                   <td className="py-4 px-4 border-b border-gray-200 text-gray-600">{item.category}</td>
//                   <td className="py-4 px-4 border-b border-gray-200 text-gray-800 font-bold">${item.price.toFixed(2)}</td>
//                   <td className="py-4 px-4 border-b border-gray-200">
//                     <button onClick={() => handleDelete(item._id)} className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition duration-200">
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="text-center py-4 text-gray-500">No items found.</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default Menulist;


// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { useParams } from 'react-router-dom';
// import useAuthToken from '../../../hooks/Token/useAuth';

// function Menulist() {
//   const [list, setList] = useState([]);
//   const { empId } = useParams(); // Extract empId from URL parameters
//   const authToken = useAuthToken();

//   const fetchList = useCallback(async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API}/route/menu/items/${empId}`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: authToken,
//         },
//       });
      
//       if (response.data.success) {
//         setList(response.data.data);
//         console.log("Menudata", response.data.data);
//       } else {
//         toast.error(response.data.error);
//       }
//     } catch (error) {
//       toast.error('Failed to fetch the menu list');
//       console.error(error);
//     }
//   }, [empId, authToken]); // Include authToken in the dependency array

//   const handleDelete = async (menuItemId) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this item?");
//     if (confirmDelete) {
//       try {
//         const response = await axios.delete(`${process.env.REACT_APP_API}/route/menu/delete/${menuItemId}`, {
//           headers: {
//             Authorization: authToken,
//           },
//         });
//         if (response.data.success) {
//           toast.success('Item deleted successfully');
//           setList(list.filter(item => item._id !== menuItemId)); // Assuming _id is the identifier
//         } else {
//           toast.error(response.data.error);
//         }
//       } catch (error) {
//         toast.error('Failed to delete item');
//         console.error(error);
//       }
//     }
//   }

//   useEffect(() => {
//     fetchList();
//   }, [fetchList]); // Include fetchList in the dependency array

//   return (
//     <div className="flex flex-col p-6 bg-gray-50 min-h-screen">
//       <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">All Food Items</h2>
//       <div className="overflow-x-auto rounded-lg shadow-md">
//         <table className="min-w-full bg-white border border-gray-300 rounded-lg">
//           <thead>
//             <tr className="bg-gray-600 text-white">
//               <th className="py-3 px-4 border-b border-gray-200">Image</th>
//               <th className="py-3 px-4 border-b border-gray-200">Name</th>
//               <th className="py-3 px-4 border-b border-gray-200">Category</th>
//               <th className="py-3 px-4 border-b border-gray-200">Price</th>
//               <th className="py-3 px-4 border-b border-gray-200">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {list.length > 0 ? (
//               list.map((item) => (
//                 <tr key={item._id} className="hover:bg-gray-100 transition duration-200">
//                   <td className="py-4 px-4 border-b border-gray-200">
//                     <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg shadow-sm" />
//                   </td>
//                   <td className="py-4 px-4 border-b border-gray-200 font-semibold text-gray-700">{item.name}</td>
//                   <td className="py-4 px-4 border-b border-gray-200 text-gray-600">{item.category}</td>
//                   <td className="py-4 px-4 border-b border-gray-200 text-gray-800 font-bold">₹{item.price.toFixed(2)}</td>
//                   <td className="py-4 px-4 border-b border-gray-200">
//                     <button onClick={() => handleDelete(item._id)} className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition duration-200">
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="text-center py-4 text-gray-500">No items found.</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default Menulist;




// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { useParams } from 'react-router-dom';
// import useAuthToken from '../../../hooks/Token/useAuth';

// function Menulist() {
//   const [list, setList] = useState([]);
//   const { empId } = useParams(); 
//   const authToken = useAuthToken();

//   const fetchList = useCallback(async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API}/route/menu/items/${empId}`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: authToken,
//         },
//       });
      
//       if (response.data.success) {
//         setList(response.data.data);
//       } else {
//         toast.error(response.data.error);
//       }
//     } catch (error) {
//       toast.error('Failed to fetch the menu list');
//       console.error(error);
//     }
//   }, [empId, authToken]);

//   const handleDelete = async (menuItemId) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this item?");
//     if (confirmDelete) {
//       try {
//         const response = await axios.delete(`${process.env.REACT_APP_API}/route/menu/delete/${menuItemId}`, {
//           headers: {
//             Authorization: authToken,
//           },
//         });
//         if (response.data.success) {
//           toast.success('Item deleted successfully');
//           setList(list.filter(item => item._id !== menuItemId));
//         } else {
//           toast.error(response.data.error);
//         }
//       } catch (error) {
//         toast.error('Failed to delete item');
//         console.error(error);
//       }
//     }
//   }

//   useEffect(() => {
//     fetchList();
//   }, [fetchList]);

//   return (
//     <div className="flex flex-col p-6 bg-gray-50 min-h-screen">
//       <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">All Food Items</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//         {list.length > 0 ? (
//           list.map((item) => (
//             <div key={item._id} className="bg-white rounded-lg shadow-md p-4 flex flex-col">
//               <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-lg mb-2" />
//               <h3 className="text-lg font-semibold text-gray-700">{item.name}</h3>
//               <p className="text-gray-600">{item.category}</p>
//               <p className="text-gray-800 font-bold">₹{item.price.toFixed(2)}</p>
//               <button onClick={() => handleDelete(item._id)} className="mt-auto bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition duration-200">
//                 Delete
//               </button>
//             </div>
//           ))
//         ) : (
//           <div className="col-span-1 text-center py-4 text-gray-500">No items found.</div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Menulist;


import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import useAuthToken from '../../../hooks/Token/useAuth';

function Menulist() {
  const [list, setList] = useState([]);
  const { empId } = useParams();
  const authToken = useAuthToken();

  const fetchList = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/route/menu/items/${empId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      });

      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error('Failed to fetch the menu list');
      console.error(error);
    }
  }, [empId, authToken]);

  const handleDelete = async (menuItemId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (confirmDelete) {
      try {
        const response = await axios.delete(`${process.env.REACT_APP_API}/route/menu/delete/${menuItemId}`, {
          headers: {
            Authorization: authToken,
          },
        });
        if (response.data.success) {
          toast.success('Item deleted successfully');
          setList(list.filter(item => item._id !== menuItemId));
        } else {
          toast.error(response.data.error);
        }
      } catch (error) {
        toast.error('Failed to delete item');
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return (
    <div className="flex flex-col p-8 bg-gradient-to-r from-green-50 to-blue-50 min-h-screen">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-800">Menu Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {list.length > 0 ? (
          list.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 flex flex-col relative overflow-hidden group">
              <div className="relative">
                <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded-lg mb-4 transition-transform duration-300 transform group-hover:scale-105" />
                <div className="absolute top-0 left-0 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-br-lg">
                  <span className="font-semibold">₹{item.price.toFixed(2)}</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
              <p className="text-gray-600 mb-2">{item.category}</p>
              <button
                onClick={() => handleDelete(item._id)}
                className="mt-auto bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-1 text-center py-4 text-gray-500">No items found.</div>
        )}
      </div>
    </div>
  );
}

export default Menulist;
