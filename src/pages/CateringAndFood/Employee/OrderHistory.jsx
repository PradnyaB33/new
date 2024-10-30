// import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import ReusableModal from '../../../components/Modal/component';
// import useAuthToken from '../../../hooks/Token/useAuth';

// const OrderHistory = () => {
//   const { empId } = useParams();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const invoiceRef = useRef();
//   const authToken = useAuthToken();

//   useEffect(() => {
//     const fetchOrders = async () => {
//       setLoading(true); // Start loading before fetching
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API}/route/orders/user/${empId}`, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: authToken,
//           },
//         });
//         setOrders(response.data.data);
//         console.log("OrderHistory", response.data.data);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to fetch orders');
//       } finally {
//         setLoading(false); // Ensure loading state is reset
//       }
//     };

//     fetchOrders();
//   }, [empId, authToken]); // Include authToken in the dependency array

//   const handleOpenModal = (order) => {
//     setSelectedOrder(order);
//     setModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setModalOpen(false);
//     setSelectedOrder(null);
//   };

//   const downloadPDF = async () => {
//     const element = invoiceRef.current;
//     const canvas = await html2canvas(element, { scale: 2 });
//     const data = canvas.toDataURL('image/png');

//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const imgWidth = 210;
//     const pageHeight = pdf.internal.pageSize.height;
//     const imgHeight = (canvas.height * imgWidth) / canvas.width;
//     let heightLeft = imgHeight;

//     let position = 0;

//     pdf.addImage(data, 'PNG', 0, position, imgWidth, imgHeight);
//     heightLeft -= pageHeight;

//     while (heightLeft >= 0) {
//       position = heightLeft - imgHeight;
//       pdf.addPage();
//       pdf.addImage(data, 'PNG', 0, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;
//     }

//     pdf.save(`invoice_${selectedOrder?._id}.pdf`);
//   };

//   if (loading) {
//     return <div className="text-center text-lg">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-red-500 text-center">{error}</div>;
//   }

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold text-center mb-6">Order History</h1>
//       {orders.length === 0 ? (
//         <div className="text-center text-lg">No orders found.</div>
//       ) : (
//         <div className="space-y-6">
//           {orders.map((order) => (
//             <div key={order._id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
//               <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
//               <p className="text-gray-700">Status:
//                 <span className={`font-bold ${order.status === 'Delivered' ? 'text-green-500' : 'text-yellow-500'}`}>
//                   {order.status}
//                 </span>
//               </p>
//               <p className="text-gray-700">Total Price: <span className="font-bold">${order.grandTotal.toFixed(2)}</span></p>
//               <h3 className="text-lg font-semibold mt-4">Items:</h3>
//               <ul className="list-disc list-inside pl-5">
//                 {order.items.map((item) => (
//                   <li key={item._id} className="text-gray-600">
//                     {item.name} (x{item.quantity}) - <span className="font-bold">${item.price.toFixed(2)}</span>
//                   </li>
//                 ))}
//               </ul>
//               <p className="text-gray-500 mt-2">Order placed on: {new Date(order.placedAt).toLocaleString()}</p>
//               <button onClick={() => handleOpenModal(order)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">View Invoice</button>
//             </div>
//           ))}
//         </div>
//       )}
// <ReusableModal
//   open={modalOpen}
//   onClose={handleCloseModal}
//   heading="Order Details"
//   subHeading={`Order ID: ${selectedOrder?._id || 'N/A'}`}
// >
//   {selectedOrder && (
//     <div ref={invoiceRef} className="p-6 bg-white rounded-lg shadow-md">
//       <h1 className="text-2xl font-bold text-center mb-4">Invoice</h1>

//       <div className="mb-4">
//         <p className="font-semibold">Vendor Company Name: {selectedOrder.vendorId?.companyname || 'N/A'}</p>
//         <p className="font-semibold">Vendor Address: {selectedOrder.vendorId?.address || 'N/A'}</p>
//       </div>

//       <div className="mb-4 border-t border-gray-300 pt-4">
//         <h3 className="text-lg font-semibold mb-2">Items:</h3>
//         <div className="grid grid-cols-2 gap-2">
//           {selectedOrder.items.map((item) => (
//             <div key={item._id} className="flex justify-between p-2 border-b border-gray-200">
//               <span>{item.name} (x{item.quantity})</span>
//               <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Government Taxes Section */}
//       <div className="mb-4">
//         <h3 className="text-lg font-semibold">Government Taxes:</h3>
//         <p className="text-gray-600">SGST: <span className="font-bold">${selectedOrder.sgst.toFixed(2) || 'N/A'}</span></p>
//         <p className="text-gray-600">CGST: <span className="font-bold">${selectedOrder.cgst.toFixed(2) || 'N/A'}</span></p>
//         <p className="text-gray-600">Total Taxes: <span className="font-bold">${(selectedOrder.sgst + selectedOrder.cgst).toFixed(2) || 'N/A'}</span></p>
//       </div>

//       <p className="font-bold">Total Amount (including taxes): <span className="text-green-600">${selectedOrder.grandTotal.toFixed(2)}</span></p>
//       <p>Date: {new Date(selectedOrder.placedAt).toLocaleString()}</p>

//       <button onClick={downloadPDF} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
//         Download PDF
//       </button>
//     </div>
//   )}
// </ReusableModal>

//     </div>
//   );
// };

// export default OrderHistory;

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ReusableModal from "../../../components/Modal/component";
import useAuthToken from "../../../hooks/Token/useAuth";

const OrderHistory = () => {
  const { empId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const invoiceRef = useRef();
  const authToken = useAuthToken();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/orders/user/${empId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: authToken,
            },
          }
        );
        setOrders(response.data.data);
        console.log("OrderHistory", response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [empId, authToken]);

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  const handleOpenRatingModal = (order) => {
    setSelectedOrder(order);
    setRatingModalOpen(true);
  };

  const handleCloseRatingModal = () => {
    setRatingModalOpen(false);
    setSelectedOrder(null);
    setRating(0);
    setReview("");
  };

  const handleSubmitRating = async () => {
    if (!rating || rating < 1 || rating > 5) {
      alert("Rating must be between 1 and 5");
      return;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_API}/route/orders/${selectedOrder._id}/rate`,
        { rating, review },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
        }
      );
      alert("Order rated successfully!");
      handleCloseRatingModal();
    } catch (error) {
      alert(
        "Failed to rate order: " + error.response?.data?.message ||
          error.message
      );
    }
  };

  const downloadPDF = async () => {
    const element = invoiceRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const pageHeight = pdf.internal.pageSize.height;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(data, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(data, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`invoice_${selectedOrder?._id}.pdf`);
  };

  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Order History</h1>
      {orders.length === 0 ? (
        <div className="text-center text-lg">No orders found.</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
              <p className="text-gray-700">
                Status:{" "}
                <span
                  className={`font-bold ${
                    order.status === "Delivered"
                      ? "text-green-500"
                      : "text-yellow-500"
                  }`}
                >
                  {order.status}
                </span>
              </p>
              <p className="text-gray-700">
                Total Price:{" "}
                <span className="font-bold">
                  ${order.grandTotal.toFixed(2)}
                </span>
              </p>
              <h3 className="text-lg font-semibold mt-4">Items:</h3>
              <ul className="list-disc list-inside pl-5">
                {order.items.map((item) => (
                  <li key={item._id} className="text-gray-600">
                    {item.name} (x{item.quantity}) -{" "}
                    <span className="font-bold">${item.price.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <p className="text-gray-500 mt-2">
                Order placed on: {new Date(order.placedAt).toLocaleString()}
              </p>

              <p className="text-gray-500 mt-2">
                Order Status Updated on: {new Date(order.updatedAt).toLocaleString()}
              </p>
              <button
                onClick={() => handleOpenModal(order)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              >
                View Invoice
              </button>
              <button
                onClick={() => handleOpenRatingModal(order)}
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded ml-4"
              >
                Rate Order
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Invoice Modal */}
      <ReusableModal
        open={modalOpen}
        onClose={handleCloseModal}
        heading="Order Details"
        subHeading={`Order ID: ${selectedOrder?._id || "N/A"}`}
      >
        {selectedOrder && (
          <div ref={invoiceRef} className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center mb-4">Invoice</h1>

            <div className="mb-4">
              <p className="font-semibold">
                Vendor Company Name:{" "}
                {selectedOrder.vendorId?.companyname || "N/A"}
              </p>
              <p className="font-semibold">
                Vendor Address: {selectedOrder.vendorId?.address || "N/A"}
              </p>
            </div>

            <div className="mb-4 border-t border-gray-300 pt-4">
              <h3 className="text-lg font-semibold mb-2">Items:</h3>
              <div className="grid grid-cols-2 gap-2">
                {selectedOrder.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between p-2 border-b border-gray-200"
                  >
                    <span>
                      {item.name} (x{item.quantity})
                    </span>
                    <span className="font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold">Government Taxes:</h3>
              <p className="text-gray-600">
                SGST:{" "}
                <span className="font-bold">
                  ${selectedOrder.sgst.toFixed(2) || "N/A"}
                </span>
              </p>
              <p className="text-gray-600">
                CGST:{" "}
                <span className="font-bold">
                  ${selectedOrder.cgst.toFixed(2) || "N/A"}
                </span>
              </p>
              <p className="text-gray-600">
                Total Taxes:{" "}
                <span className="font-bold">
                  $
                  {(selectedOrder.sgst + selectedOrder.cgst).toFixed(2) ||
                    "N/A"}
                </span>
              </p>
            </div>

            <p className="font-bold">
              Total Amount (including taxes):{" "}
              <span className="text-green-600">
                ${selectedOrder.grandTotal.toFixed(2)}
              </span>
            </p>
            <p>Order Placed on: {new Date(selectedOrder.placedAt).toLocaleString()}</p>

            <button
              onClick={downloadPDF}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
            >
              Download PDF
            </button>
          </div>
        )}
      </ReusableModal>

      {/* Rating Modal */}
      <ReusableModal
        open={ratingModalOpen}
        onClose={handleCloseRatingModal}
        heading="Rate Your Order"
        subHeading={`Order ID: ${selectedOrder?._id || "N/A"}`}
      >
        <div className="p-4">
          <label className="block mb-2">Rating (1-5):</label>
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="border p-2 w-full"
          />
          <div className="mt-4">
            <label className="block mb-2">Review:</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="border p-2 w-full"
              rows="4"
            />
          </div>
          <button
            onClick={handleSubmitRating}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Submit Rating
          </button>
        </div>
      </ReusableModal>
    </div>
  );
};

export default OrderHistory;
