// import React, { useState } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import useCartStore from './useCartStore';
// import cartImage from '../../../assets/cart-png.png';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import UserProfile from '../../../hooks/UserData/useUser';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const coupons = {
//   "SAVE10": 10, // 10% discount
//   "SAVE20": 20, // 20% discount
//   "FREESHIP": 5, // $5 off on total price
// };

// const Detailcart = () => {
//   const user = UserProfile().getCurrentUser();
//   const { cart, increment, decrement, clearCart, removeFromCart } = useCartStore();
//   const cartItems = Object.keys(cart).filter(item => cart[item].count > 0);
//   const { _id } = useParams();

//   const totalPrice = cartItems.reduce((total, itemName) => {
//     return total + (cart[itemName].price * cart[itemName].count);
//   }, 0);

//   const [couponCode, setCouponCode] = useState('');
//   const [discount, setDiscount] = useState(0);
//   const [error, setError] = useState('');

//   const applyCoupon = (code) => {
//     const coupon = coupons[code];
//     if (coupon) {
//       setDiscount(coupon);
//       setCouponCode(code);
//       setError('');
//     } else {
//       setError('Invalid coupon code');
//     }
//   };

//   const finalPrice = totalPrice - discount;

//   // Calculate CGST and SGST (2.5% each)
//   const cgst = (totalPrice * 0.025).toFixed(2);
//   const sgst = (totalPrice * 0.025).toFixed(2);
//   const grandTotal = (finalPrice + parseFloat(cgst) + parseFloat(sgst)).toFixed(2);

//   const placeOrder = async () => {
//     const itemsToOrder = cartItems.map(itemName => ({
//       menuItemId: cart[itemName].id,
//       name: itemName,
//       quantity: cart[itemName].count,
//       price: cart[itemName].price
//     }));

//     const orderData = {
//       userId: user._id,
//       vendorId: _id,
//       items: itemsToOrder,
//       totalPrice,
//       cgst: parseFloat(cgst),
//       sgst: parseFloat(sgst),
//       discount,
//       grandTotal: parseFloat(grandTotal),
//     };

//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API}/route/orders`, orderData, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       const data = response.data;
//       if (data.success) {
//         clearCart();
//         toast.success("Your order has been placed successfully");
//       } else {
//         setError(data.message || 'Failed to place the order');
//       }
//     } catch (error) {
//       setError('An error occurred while placing the order');
//     }
//   };

//   if (cartItems.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
//         <img
//           src={cartImage}
//           alt="Empty Cart"
//           className="w-48 h-48 mb-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
//         />
//         <div className="text-center text-2xl font-semibold text-blue-600 mb-2">
//           Your cart is empty
//         </div>
//         <p className="text-gray-600 mb-4">
//           It looks like you haven't added anything to your cart yet.
//         </p>
//         <Link
//           to={`/vendors/restaurantmenu/${_id}`}
//           className="bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition duration-200"
//         >
//           Start Shopping
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="flex p-4 space-x-4">
//       {/* Left Side: Cart Items */}
//       <div className="flex-1 bg-gray-100 rounded-lg p-4 shadow-md">
//         <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Your Cart</h2>
//         <table className="w-full bg-white rounded shadow-md mb-4">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="p-2 text-left">Image</th>
//               <th className="p-2 text-left">Name</th>
//               <th className="p-2 text-left">Quantity</th>
//               <th className="p-2 text-left">Price</th>
//               <th className="p-2 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {cartItems.map(itemName => {
//               const { count, price, image } = cart[itemName];
//               return (
//                 <tr key={itemName} className="border-b hover:bg-gray-100">
//                   <td className="p-2">
//                     <img src={image} alt={itemName} className="w-16 h-16 object-cover rounded" />
//                   </td>
//                   <td className="p-2">{itemName}</td>
//                   <td className="p-2">
//                     <div className="flex items-center justify-center">
//                       <button
//                         onClick={() => decrement(itemName)}
//                         className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition duration-200"
//                       >
//                         -
//                       </button>
//                       <span className="mx-2">{count}</span>
//                       <button
//                         onClick={() => increment(itemName)}
//                         className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-700 transition duration-200"
//                       >
//                         +
//                       </button>
//                     </div>
//                   </td>
//                   <td className="p-2 text-lg font-bold text-blue-500">${(price * count).toFixed(2)}</td>
//                   <td className="p-2 text-center">
//                     <button className="text-red-500 hover:text-red-700" onClick={() => removeFromCart(itemName)}>
//                       <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>

//         {/* Separate Empty Cart Button */}
//         <div className="flex justify-center mb-4">
//           <button
//             onClick={clearCart}
//             className="bg-red-600 text-white rounded-lg py-2 px-6 hover:bg-red-700 transition duration-200"
//           >
//             Empty Cart
//           </button>
//         </div>
//       </div>

//       {/* Right Side: Cart Totals */}
//       <div className="bg-white shadow-lg rounded-lg p-6 w-1/3">
//         <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Cart Totals</h2>

//         <div className="flex justify-between mb-4">
//           <span className="text-gray-700">Subtotal:</span>
//           <span className="font-bold text-blue-500">${totalPrice.toFixed(2)}</span>
//         </div>

//         <div className="flex justify-between mb-4">
//           <span className="text-gray-700">CGST (2.5%):</span>
//           <span className="font-bold text-blue-500">${cgst}</span>
//         </div>

//         <div className="flex justify-between mb-4">
//           <span className="text-gray-700">SGST (2.5%):</span>
//           <span className="font-bold text-blue-500">${sgst}</span>
//         </div>

//         {/* Coupon Code Input */}
//         <div className="mb-4">
//           <label htmlFor="coupon" className="block mb-2 font-medium text-gray-700">Coupon Code:</label>
//           <div className="flex">
//             <input
//               type="text"
//               id="coupon"
//               value={couponCode}
//               onChange={(e) => setCouponCode(e.target.value)}
//               placeholder="Enter coupon code"
//               className="border border-gray-300 rounded-lg w-full px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200 transition duration-150"
//             />
//             <button
//               onClick={() => applyCoupon(couponCode)}
//               className="bg-green-600 text-white rounded-lg py-2 px-4 ml-2 hover:bg-green-700 transition duration-200"
//             >
//               Apply
//             </button>
//           </div>
//         </div>

//         {/* Available Coupons Section */}
//         <div className="mb-4">
//           <h3 className="font-bold text-gray-700">Available Coupons:</h3>
//           <ul className="list-disc pl-5 text-gray-600">
//             {Object.entries(coupons).map(([code, discount]) => (
//               <li key={code} className="cursor-pointer hover:text-blue-600 hover:underline" onClick={() => applyCoupon(code)}>
//                 <span>{code}: </span>
//                 <span className="font-bold">{discount}% off</span>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Error Message */}
//         {error && <div className="text-red-500 mb-2">{error}</div>}

//         <div className="flex justify-between mb-4">
//           <span className="text-gray-700">Discount:</span>
//           <span className="font-bold text-red-500">-${discount.toFixed(2)}</span>
//         </div>

//         <div className="flex justify-between mb-4">
//           <span className="text-gray-700">Total:</span>
//           <span className="font-bold text-blue-500">${finalPrice.toFixed(2)}</span>
//         </div>

//         <div className="flex justify-between mb-4">
//           <span className="text-gray-700">Grand Total:</span>
//           <span className="font-bold text-blue-500">${grandTotal}</span>
//         </div>

//         <button
//           onClick={placeOrder}
//           className="bg-green-600 text-white rounded-lg py-3 hover:bg-green-700 transition duration-200 w-full text-center"
//         >
//           Place Order
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Detailcart;

// import React, { useState } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import useCartStore from './useCartStore';
// import cartImage from '../../../assets/cart-png.png';
// import { useNavigate } from 'react-router-dom';
// import UserProfile from '../../../hooks/UserData/useUser';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// // Import the Rezzer Pay SDK (example, adjust based on actual SDK)
// import RezzerPay from 'rezzer-pay-sdk';

// const coupons = {
//   "SAVE10": 10,
//   "SAVE20": 20,
//   "FREESHIP": 5,
// };

// const Detailcart = () => {
//   const user = UserProfile().getCurrentUser();
//   const { cart, increment, decrement, clearCart, removeFromCart } = useCartStore();
//   const cartItems = Object.keys(cart).filter(item => cart[item].count > 0);
//   const { _id } = useParams();

//   const totalPrice = cartItems.reduce((total, itemName) => {
//     return total + (cart[itemName].price * cart[itemName].count);
//   }, 0);

//   const [couponCode, setCouponCode] = useState('');
//   const [discount, setDiscount] = useState(0);
//   const [error, setError] = useState('');

//   const applyCoupon = (code) => {
//     const coupon = coupons[code];
//     if (coupon) {
//       setDiscount(coupon);
//       setCouponCode(code);
//       setError('');
//     } else {
//       setError('Invalid coupon code');
//     }
//   };

//   const finalPrice = totalPrice - discount;
//   const cgst = (totalPrice * 0.025).toFixed(2);
//   const sgst = (totalPrice * 0.025).toFixed(2);
//   const grandTotal = (finalPrice + parseFloat(cgst) + parseFloat(sgst)).toFixed(2);

//   const placeOrder = async () => {
//     // Initialize Rezzer Pay payment
//     const paymentResponse = await RezzerPay.initPayment({
//       amount: grandTotal,
//       currency: 'USD',
//       // additional payment parameters
//     });

//     if (paymentResponse.success) {
//       const itemsToOrder = cartItems.map(itemName => ({
//         menuItemId: cart[itemName].id,
//         name: itemName,
//         quantity: cart[itemName].count,
//         price: cart[itemName].price
//       }));

//       const orderData = {
//         userId: user._id,
//         vendorId: _id,
//         items: itemsToOrder,
//         totalPrice,
//         cgst: parseFloat(cgst),
//         sgst: parseFloat(sgst),
//         discount,
//         grandTotal: parseFloat(grandTotal),
//       };

//       try {
//         const response = await axios.post(`${process.env.REACT_APP_API}/route/orders`, orderData, {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });

//         const data = response.data;
//         if (data.success) {
//           clearCart();
//           toast.success("Your order has been placed successfully");
//         } else {
//           setError(data.message || 'Failed to place the order');
//         }
//       } catch (error) {
//         setError('An error occurred while placing the order');
//       }
//     } else {
//       setError('Payment failed. Please try again.');
//     }
//   };

//   if (cartItems.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
//         <img src={cartImage} alt="Empty Cart" className="w-48 h-48 mb-4 rounded-lg shadow-lg transition-transform transform hover:scale-105" />
//         <div className="text-center text-2xl font-semibold text-blue-600 mb-2">
//           Your cart is empty
//         </div>
//         <p className="text-gray-600 mb-4">
//           It looks like you haven't added anything to your cart yet.
//         </p>
//         <Link to={`/vendors/restaurantmenu/${_id}`} className="bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition duration-200">
//           Start Shopping
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="flex p-4 space-x-4">
//       {/* Left Side: Cart Items */}
//       <div className="flex-1 bg-gray-100 rounded-lg p-4 shadow-md">
//         <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Your Cart</h2>
//         <table className="w-full bg-white rounded shadow-md mb-4">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="p-2 text-left">Image</th>
//               <th className="p-2 text-left">Name</th>
//               <th className="p-2 text-left">Quantity</th>
//               <th className="p-2 text-left">Price</th>
//               <th className="p-2 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {cartItems.map(itemName => {
//               const { count, price, image } = cart[itemName];
//               return (
//                 <tr key={itemName} className="border-b hover:bg-gray-100">
//                   <td className="p-2">
//                     <img src={image} alt={itemName} className="w-16 h-16 object-cover rounded" />
//                   </td>
//                   <td className="p-2">{itemName}</td>
//                   <td className="p-2">
//                     <div className="flex items-center justify-center">
//                       <button onClick={() => decrement(itemName)} className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition duration-200">-</button>
//                       <span className="mx-2">{count}</span>
//                       <button onClick={() => increment(itemName)} className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-700 transition duration-200">+</button>
//                     </div>
//                   </td>
//                   <td className="p-2 text-lg font-bold text-blue-500">${(price * count).toFixed(2)}</td>
//                   <td className="p-2 text-center">
//                     <button className="text-red-500 hover:text-red-700" onClick={() => removeFromCart(itemName)}>
//                       <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>

//         <div className="flex justify-center mb-4">
//           <button onClick={clearCart} className="bg-red-600 text-white rounded-lg py-2 px-6 hover:bg-red-700 transition duration-200">Empty Cart</button>
//         </div>
//       </div>

//       {/* Right Side: Cart Totals */}
//       <div className="bg-white shadow-lg rounded-lg p-6 w-1/3">
//         <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Cart Totals</h2>

//         <div className="flex justify-between mb-4">
//           <span className="text-gray-700">Subtotal:</span>
//           <span className="font-bold text-blue-500">${totalPrice.toFixed(2)}</span>
//         </div>

//         <div className="flex justify-between mb-4">
//           <span className="text-gray-700">CGST (2.5%):</span>
//           <span className="font-bold text-blue-500">${cgst}</span>
//         </div>

//         <div className="flex justify-between mb-4">
//           <span className="text-gray-700">SGST (2.5%):</span>
//           <span className="font-bold text-blue-500">${sgst}</span>
//         </div>

//         {/* Coupon Code Input */}
//         <div className="mb-4">
//           <label htmlFor="coupon" className="block mb-2 font-medium text-gray-700">Coupon Code:</label>
//           <div className="flex">
//             <input
//               type="text"
//               id="coupon"
//               value={couponCode}
//               onChange={(e) => setCouponCode(e.target.value)}
//               placeholder="Enter coupon code"
//               className="border border-gray-300 rounded-lg w-full px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200 transition duration-150"
//             />
//             <button onClick={() => applyCoupon(couponCode)} className="bg-green-600 text-white rounded-lg py-2 px-4 ml-2 hover:bg-green-700 transition duration-200">Apply</button>
//           </div>
//         </div>

//         {/* Available Coupons Section */}
//         <div className="mb-4">
//           <h3 className="font-bold text-gray-700">Available Coupons:</h3>
//           <ul className="list-disc pl-5 text-gray-600">
//             {Object.entries(coupons).map(([code, discount]) => (
//               <li key={code} className="cursor-pointer hover:text-blue-600 hover:underline" onClick={() => applyCoupon(code)}>
//                 <span>{code}: </span>
//                 <span className="font-bold">{discount}% off</span>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Error Message */}
//         {error && <div className="text-red-500 mb-2">{error}</div>}

//         <div className="flex justify-between mb-4">
//           <span className="text-gray-700">Discount:</span>
//           <span className="font-bold text-red-500">-${discount.toFixed(2)}</span>
//         </div>

//         <div className="flex justify-between mb-4">
//           <span className="text-gray-700">Total:</span>
//           <span className="font-bold text-blue-500">${finalPrice.toFixed(2)}</span>
//         </div>

//         <div className="flex justify-between mb-4">
//           <span className="text-gray-700">Grand Total:</span>
//           <span className="font-bold text-blue-500">${grandTotal}</span>
//         </div>

//         <button
//           onClick={placeOrder}
//           className="bg-green-600 text-white rounded-lg py-3 hover:bg-green-700 transition duration-200 w-full text-center"
//         >
//           Place Order
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Detailcart;

// import React, { useState } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import useCartStore from './useCartStore';
// import cartImage from '../../../assets/cart-png.png';
// import UserProfile from '../../../hooks/UserData/useUser';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const coupons = {
//   "SAVE10": 10, // 10% discount
//   "SAVE20": 20, // 20% discount
//   "FREESHIP": 5, // $5 off on total price
// };

// const Detailcart = () => {
//   const user = UserProfile().getCurrentUser();
//   const { cart, increment, decrement, clearCart, removeFromCart } = useCartStore();
//   const cartItems = Object.keys(cart).filter(item => cart[item].count > 0);
//   const { _id } = useParams();

//   const totalPrice = cartItems.reduce((total, itemName) => {
//     return total + (cart[itemName].price * cart[itemName].count);
//   }, 0);

//   const [couponCode, setCouponCode] = useState('');
//   const [discount, setDiscount] = useState(0);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const applyCoupon = (code) => {
//     const coupon = coupons[code];
//     if (coupon) {
//       setDiscount(coupon);
//       setCouponCode(code);
//       setError('');
//     } else {
//       setError('Invalid coupon code');
//     }
//   };

//   const finalPrice = totalPrice - discount;
//   const cgst = (totalPrice * 0.025).toFixed(2);
//   const sgst = (totalPrice * 0.025).toFixed(2);
//   const grandTotal = (finalPrice + parseFloat(cgst) + parseFloat(sgst)).toFixed(2);

//   const placeOrder = async () => {
//     const itemsToOrder = cartItems.map(itemName => ({
//       menuItemId: cart[itemName].id,
//       name: itemName,
//       quantity: cart[itemName].count,
//       price: cart[itemName].price
//     }));

//     const orderData = {
//       userId: user._id,
//       vendorId: _id,
//       items: itemsToOrder,
//       totalPrice,
//       cgst: parseFloat(cgst),
//       sgst: parseFloat(sgst),
//       discount,
//       grandTotal: parseFloat(grandTotal),
//     };

//     const orderData1 = {
//       amount: grandTotal * 100, // Amount in paise
//       currency: 'INR',
//       receipt: `receipt#${Date.now()}`, // Optional
//     };

//     try {
//       setLoading(true); // Set loading state
//       const response = await axios.post(`${process.env.REACT_APP_API}/route/payment`, orderData1, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       const data = response.data;
//       console.log(data);

//       if (data.status === 'created') {
//         const options = {
//           key: 'rzp_test_iutxIgoA1jAkJy', // Enter your Razorpay key id here
//           amount: grandTotal * 100, // Convert to paise
//           currency: 'INR',
//           name: 'AEGIS HRMS',
//           description: 'Order Payment',
//           image: 'https://yourlogo.com/logo.png', // Your logo
//           order_id: data.id, // Use the order ID you received from the server
//           handler: async function (response) {
//             const paymentResponse = {
//               ...response,

//             };
//             console.log(paymentResponse);

//             const orderData2 = {
//               userId: orderData.userId,
//               vendorId: orderData.vendorId,
//               items: orderData.items,
//               totalPrice: orderData.totalPrice,
//               cgst: orderData.cgst,
//               sgst: orderData.sgst,
//               discount: orderData.discount,
//               grandTotal: orderData.grandTotal,
//               razorpay_payment_id: response.razorpay_payment_id, // Include the updated payment ID
//             };

//             console.log(orderData2);

//             try {
//               // Save the payment response to your server
//               const verifyResponse = await axios.post(`${process.env.REACT_APP_API}/route/payment/verify`, paymentResponse);
//               const verifyData = verifyResponse.data;
//                console.log("verifyData",verifyData);

//               if (verifyData.success) {
//                 // Save order data to the database
//                 const response1 = await axios.post(`${process.env.REACT_APP_API}/route/orders`, orderData2, {
//                   headers: {
//                     'Content-Type': 'application/json',
//                   },
//                 });
//                 const data1 = response1.data;
//                 console.log(data1);

//                 // Clear the cart and show success toast
//                 clearCart();
//                 toast.success("Your payment was done successfully");
//               } else {
//                 toast.error("Payment verification failed");
//               }
//             } catch (error) {
//               console.error("Error verifying payment:", error);
//               toast.error("An error occurred while verifying payment");
//             }
//           },
//           prefill: {
//             name: user.name,
//             email: user.email,
//             contact: user.contact,
//           },
//           notes: {
//             address: 'note value',
//           },
//           theme: {
//             color: '#F37254',
//           },
//         };

//         const razor = new window.Razorpay(options);
//         razor.open();
//       } else {
//         setError(data.message || 'Failed to place the order');
//       }
//     } catch (error) {
//       setError('An error occurred while placing the order');
//     } finally {
//       setLoading(false); // Reset loading state
//     }
//   };

//   if (cartItems.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
//         <img
//           src={cartImage}
//           alt="Empty Cart"
//           className="w-48 h-48 mb-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
//         />
//         <div className="text-center text-2xl font-semibold text-blue-600 mb-2">
//           Your cart is empty
//         </div>
//         <p className="text-gray-600 mb-4">
//           It looks like you haven't added anything to your cart yet.
//         </p>
//         <Link
//           to={`/vendors/restaurantmenu/${_id}`}
//           className="bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition duration-200"
//         >
//           Start Shopping
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="flex p-4 space-x-4">
//       <div className="flex-1 bg-gray-100 rounded-lg p-4 shadow-md">
//         <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Your Cart</h2>
//         <table className="w-full bg-white rounded shadow-md mb-4">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="p-2 text-left">Image</th>
//               <th className="p-2 text-left">Name</th>
//               <th className="p-2 text-left">Quantity</th>
//               <th className="p-2 text-left">Price</th>
//               <th className="p-2 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {cartItems.map(itemName => {
//               const { count, price, image } = cart[itemName];
//               return (
//                 <tr key={itemName} className="border-b hover:bg-gray-100">
//                   <td className="p-2">
//                     <img src={image} alt={itemName} className="w-16 h-16 object-cover rounded" />
//                   </td>
//                   <td className="p-2">{itemName}</td>
//                   <td className="p-2">
//                     <div className="flex items-center justify-center">
//                       <button
//                         onClick={() => decrement(itemName)}
//                         className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition duration-200"
//                       >
//                         -
//                       </button>
//                       <span className="mx-2">{count}</span>
//                       <button
//                         onClick={() => increment(itemName)}
//                         className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-700 transition duration-200"
//                       >
//                         +
//                       </button>
//                     </div>
//                   </td>
//                   <td className="p-2 text-lg font-bold text-blue-500">${(price * count).toFixed(2)}</td>
//                   <td className="p-2 text-center">
//                     <button className="text-red-500 hover:text-red-700" onClick={() => removeFromCart(itemName)}>
//                       <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>

//         <div className="flex justify-center mb-4">
//           <button
//             onClick={clearCart}
//             className="bg-red-600 text-white rounded-lg py-2 px-6 hover:bg-red-700 transition duration-200"
//           >
//             Empty Cart
//           </button>
//         </div>
//       </div>

//       <div className="bg-white shadow-lg rounded-lg p-6 w-1/3">
//         <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Cart Totals</h2>

//         <div className="flex justify-between mb-4">
//           <span className="text-gray-700">Subtotal:</span>
//           <span className="font-bold text-blue-500">${totalPrice.toFixed(2)}</span>
//         </div>

//         <div className="flex justify-between mb-4">
//           <span className="text-gray-700">CGST (2.5%):</span>
//           <span className="font-bold text-blue-500">${cgst}</span>
//         </div>

//         <div className="flex justify-between mb-4">
//           <span className="text-gray-700">SGST (2.5%):</span>
//           <span className="font-bold text-blue-500">${sgst}</span>
//         </div>

//         {/* Available Coupons Section */}
//         <div className="mb-4">
//           <h3 className="font-bold text-gray-700">Available Coupons:</h3>
//           <ul className="flex justify-evenly mb-4">
//             {Object.entries(coupons).map(([code, discount]) => (
//               <li key={code} className="cursor-pointer hover:text-blue-600 hover:underline" onClick={() => applyCoupon(code)}>
//                 <span>{code}: </span>
//                 <span className="font-bold">{discount}% off</span>
//               </li>
//             ))}
//           </ul>
//         </div>

//          {/* Error Message */}
//         {error && <div className="text-red-500 mb-2">{error}</div>}

//         <div className="flex justify-between mb-4">
//           <span className="text-gray-700">Discount:</span>
//           <span className="font-bold text-blue-500">-${discount}</span>
//         </div>

//         <div className="flex justify-between mb-4">
//           <span className="text-gray-700">Grand Total:</span>
//           <span className="font-bold text-blue-500">${grandTotal}</span>
//         </div>

//         <div className="flex justify-center">
//           <button
//             onClick={placeOrder}
//             className={`bg-green-600 text-white rounded-lg py-2 px-6 hover:bg-green-700 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//             disabled={loading} // Disable button while loading
//           >
//             {loading ? 'Placing Order...' : 'Place Order'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Detailcart;

import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useCartStore from "./useCartStore";
import cartImage from "../../../assets/cart-png.png";
import UserProfile from "../../../hooks/UserData/useUser";
import axios from "axios";
import toast from "react-hot-toast";
import useAuthToken from "../../../hooks/Token/useAuth";

const Detailcart = () => {
  const authToken = useAuthToken();
  const user = UserProfile().getCurrentUser();
  const { cart, increment, decrement, clearCart, removeFromCart } =
    useCartStore();
  const cartItems = Object.keys(cart).filter((item) => cart[item].count > 0);
  const { _id } = useParams();

  const totalPrice = cartItems.reduce((total, itemName) => {
    return total + cart[itemName].price * cart[itemName].count;
  }, 0);

  const [coupons, setCoupons] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

   // Define fetchCoupons using useCallback
   const fetchCoupons = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/coupon/vendor/${_id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setCoupons(response.data.data);
      console.log("cupendata", response.data.data);
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
      toast.error("Could not fetch coupons");
    }
  }, [_id, authToken]); // Include dependencies

  // Fetch coupons when the component mounts or when dependencies change
  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]); 

  const applyCoupon = (code) => {
    const coupon = coupons.find((c) => c.code === code);

    if (coupon) {
      if (coupon.discountType === "percentage") {
        // Calculate the discount based on the percentage
        const discountAmount = (totalPrice * coupon.discountValue) / 100;
        setDiscount(discountAmount);
      } else if (coupon.discountType === "fixed") {
        // Set the discount value directly for fixed discounts
        setDiscount(coupon.discountValue);
      }
      console.log(couponCode);
      setCouponCode(code);
      setError("");
    } else {
      setError("Invalid coupon code");
    }
  };

  const finalPrice = totalPrice - discount;
  const cgst = (finalPrice * 0.025).toFixed(2);
  const sgst = (finalPrice * 0.025).toFixed(2);

  // Calculate grand total
  const grandTotal = (
    parseFloat(finalPrice) +
    parseFloat(cgst) +
    parseFloat(sgst)
  ).toFixed(2);

  const placeOrder = async () => {
    const itemsToOrder = cartItems.map((itemName) => ({
      menuItemId: cart[itemName].id,
      name:cart[itemName].name,
      quantity: cart[itemName].count,
      price: cart[itemName].price,
    }));

    console.log("itemsToOrder",itemsToOrder );

    const orderData = {
      userId: user._id,
      vendorId: _id,
      items: itemsToOrder,
      totalPrice,
      cgst: parseFloat(cgst),
      sgst: parseFloat(sgst),
      discount,
      grandTotal: parseFloat(grandTotal),
    };
    console.log("orderData",orderData);
 

    const orderData1 = {
      amount: grandTotal * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt#${Date.now()}`, // Optional
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/payment`,
        orderData1,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
        }
      );
      const data = response.data;

      if (data.status === "created") {
        const options = {
          key: "rzp_test_iutxIgoA1jAkJy", // Your Razorpay key id
          amount: grandTotal * 100, // Convert to paise
          currency: "INR",
          name: "AEGIS HRMS",
          description: "Order Payment",
          image: "https://yourlogo.com/logo.png",
          order_id: data.id,
          handler: async function (response) {
            const paymentResponse = { ...response };

            const orderData2 = {
              userId: orderData.userId,
              vendorId: orderData.vendorId,
              items: orderData.items,
              totalPrice: orderData.totalPrice,
              cgst: orderData.cgst,
              sgst: orderData.sgst,
              discount: orderData.discount,
              grandTotal: orderData.grandTotal,
              razorpay_payment_id: response.razorpay_payment_id,
            };

            // try {
            //   const verifyResponse = await axios.post(
            //     `${process.env.REACT_APP_API}/route/payment/verify`,
            //     paymentResponse,
            //     {
            //       headers: {
            //         "Content-Type": "application/json",
            //         Authorization: authToken,
            //       },
            //     }
            //   );
              
            //   const verifyData = verifyResponse.data;
           
            //   if (verifyData.success) {
            //     toast.success("Your payment was done successfully");
               
            //     await axios.post(
            //       `${process.env.REACT_APP_API}/route/orders`,
            //       orderData2,
            //       {
            //         headers: {
            //           "Content-Type": "application/json",
            //           Authorization: authToken,
            //         },
            //       }
            //     );
            //     clearCart();
            //     toast.success("Your Order Placed  successfully");
            //   } else {
            //     toast.error("Payment verification failed");
            //   }
              
            // } catch (error) {
            //   console.error("Error verifying payment:", error);
            //   toast.error("An error occurred while verifying payment");
            // }


            try {
              const verifyResponse = await axios.post(
                `${process.env.REACT_APP_API}/route/payment/verify`,
                paymentResponse,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken,
                  },
                }
              );
            
              const verifyData = verifyResponse.data;
            
              if (verifyData.success) {
                toast.success("Your payment was done successfully");
            
                try {
                  await axios.post(
                    `${process.env.REACT_APP_API}/route/orders`,
                    orderData2,
                    {
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: authToken,
                      },
                    }
                  );
                  clearCart();
                  toast.success("Your Order Placed successfully");
                } catch (error) {
                  console.error("Error placing order:", error);
                  toast.error("An error occurred while placing the order");
                }
            
              } else {
                console.log("Payment verification failed or order placed failed");
              }
            
            } catch (error) {
              console.error("Error verifying payment:", error);
              toast.error("An error occurred while verifying payment");
            }
            
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.contact,
          },
          notes: {
            address: "note value",
          },
          theme: {
            color: "#F37254",
          },
        };

        const razor = new window.Razorpay(options);
        razor.open();
      } else {
        setError(data.message || "Failed to place the order");
      }
    } catch (error) {
      setError("An error occurred while placing the order");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
        <img
          src={cartImage}
          alt="Empty Cart"
          className="w-48 h-48 mb-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        />
        <div className="text-center text-2xl font-semibold text-blue-600 mb-2">
          Your cart is empty
        </div>
        <p className="text-gray-600 mb-4">
          It looks like you haven't added anything to your cart yet.
        </p>
        <Link
          to={`/vendors/restaurantmenu/${_id}`}
          className="bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition duration-200"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex p-4 space-x-4 ">
      <div className="flex-1 bg-gray-100 rounded-lg p-4 shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Your Cart
        </h2>
        <div className="flex flex-col space-y-4 fle ">
          {cartItems.map((itemName) => {
            const { count, price, image,name } = cart[itemName];
            return (
              <div
                key={itemName}
                className="flex items-center bg-white p-4 rounded-lg shadow-md "
              >
                <img
                  src={image}
                  alt={itemName}
                  className="w-16 h-16 object-cover rounded mr-4"
                />

                <div className="flex w-full justify-between ">
                  <span className="text-lg font-semibold ">{name}</span>

                  <div className="flex items-center mx-4 ">
                    <button
                      onClick={() => decrement(itemName)}
                      className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition duration-200"
                    >
                      -
                    </button>
                    <span className="mx-2">{count}</span>
                    <button
                      onClick={() => increment(itemName)}
                      className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-700 transition duration-200"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-lg font-bold text-blue-500 ">
                    ₹{(price * count).toFixed(2)}
                  </span>

                  <button
                    className="text-red-500 hover:text-red-700 ml-4"
                    onClick={() => removeFromCart(itemName)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={clearCart}
            className="bg-red-600 text-white rounded-lg py-2 px-6 hover:bg-red-700 transition duration-200"
          >
            Empty Cart
          </button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 w-1/3">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Cart Totals
        </h2>

        <div className="flex justify-between mb-4">
          <span className="text-gray-700">Subtotal:</span>
          <span className="font-bold text-blue-500">
            ₹{totalPrice.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between mb-4">
          <span className="text-gray-700">CGST (2.5%):</span>
          <span className="font-bold text-blue-500">₹{cgst}</span>
        </div>

        <div className="flex justify-between mb-4">
          <span className="text-gray-700">SGST (2.5%):</span>
          <span className="font-bold text-blue-500">₹{sgst}</span>
        </div>

        {/* Available Coupons Section */}
        <div className="mb-4">
          <h3 className="font-bold text-gray-700">Available Coupons:</h3>
          <ul className="flex flex-wrap justify-evenly mb-4">
            {coupons.map((coupon) => (
              <li
                key={coupon.code}
                className="cursor-pointer hover:text-blue-600 hover:underline"
                onClick={() => applyCoupon(coupon.code)}
              >
                <span>{coupon.code}: </span>
                <span className="font-bold">
                  {coupon.discountValue}
                  {coupon.discountType === "percentage" ? "%" : "₹"} off
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Error Message */}
        {error && <div className="text-red-500 mb-2">{error}</div>}

        <div className="flex justify-between mb-4">
          <span className="text-gray-700">Discount:</span>
          <span className="font-bold text-blue-500">-{discount}</span>
        </div>

        <div className="flex justify-between mb-4">
          <span className="text-gray-700">Grand Total:</span>
          <span className="font-bold text-blue-500">₹{grandTotal}</span>
        </div>

        <div className="flex justify-center">
          <button
            onClick={placeOrder}
            className={`bg-green-600 text-white rounded-lg py-2 px-6 hover:bg-green-700 transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Detailcart;
