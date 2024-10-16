

// import axios from "axios";
// import { useContext, useEffect, useRef, useState } from "react";
// import { useMutation, useQueryClient } from "react-query";
// import { useParams } from "react-router-dom";
// import { TestContext } from "../../../State/Function/Main";
// import useVendorState from "../../../hooks/Vendor-Onboarding/useVendorState";

// const useGeoFencingmapp = ({ watch, onClose }) => {
//   const mapRef = useRef();
//   const { setLatitude, setLongitude } = useVendorState.getState();
//   const circleRef = useRef();
//   const [circle, setCircle] = useState(null);
//   const { organisationId } = useParams();
//   const { handleAlert } = useContext(TestContext);
//   const queryClient = useQueryClient();

//   const drawingRef = useRef();

//   const centerLocation = watch("location")?.position || undefined;
//   useEffect(() => {
//     if (centerLocation !== undefined && mapRef.current !== undefined) {
//       mapRef.current.setCenter(centerLocation);
//       mapRef.current.panTo(centerLocation);
//     }
//   }, [centerLocation]);

//   const circleComplete = (circle) => {
//     const lat = circle.center.lat();
//     const lng = circle.center.lng();

//     setCircle({
//       center: { lat, lng },
//       radius: circle.radius,
//     });
//     setLatitude(lat);
//     setLongitude(lng);
    
//     circle.setMap(null);
//   };

//   const addCircle = async () => {
//     if (!circle) {
//       throw new Error("Circle is not defined");
//     }
    
//     const result = await axios.post(
//       `${process.env.REACT_APP_API}/route/geo-fenc/${organisationId}`,
//       { ...circle.center, radius: circle.radius }
//     );
//     return result.data;
//   };

//   const { mutate: addCircleMutate } = useMutation(addCircle, {
//     onSuccess: (data) => {
//       queryClient.invalidateQueries(["geo-fenced-areas", organisationId]);
//       handleAlert(
//         true,
//         "success",
//         data?.message || "Circle added successfully"
//       );
//       onClose();
//     },
//     onError: (error) => {
//       console.error(`🚀 ~ file: useGeoFencingMap.jsx:67 ~ error`, error);
//       // Optionally handle alert for error
//     },
//   });

//   return {
//     mapRef,
//     circleRef,
//     circleComplete,
//     drawingRef,
//     circle,
//     addCircleMutate,
//   };
// };

// export default useGeoFencingmapp;



// import axios from "axios";
// import { useContext, useEffect, useRef, useState } from "react";
// // import { useParams } from "react-router-dom";
// import { TestContext } from "../../../State/Function/Main";
// import useVendorState from "../../../hooks/Vendor-Onboarding/useVendorState";

// const useGeoFencingmapp = ({ watch, onClose }) => {
//   const mapRef = useRef();
//   const { setLatitude, setLongitude } = useVendorState.getState();
//   const circleRef = useRef();
//   const [circle, setCircle] = useState(null);
// //   const { organisationId } = useParams();
//   const { handleAlert } = useContext(TestContext);

//   const centerLocation = watch("location")?.position || undefined;
  
//   useEffect(() => {
//     if (centerLocation !== undefined && mapRef.current !== undefined) {
//       mapRef.current.setCenter(centerLocation);
//       mapRef.current.panTo(centerLocation);
//     }
//   }, [centerLocation]);

//   const circleComplete = (circle) => {
//     const lat = circle.center.lat();
//     const lng = circle.center.lng();

//     setCircle({
//       center: { lat, lng },
//       radius: circle.radius,
//     });
//     setLatitude(lat);
//     setLongitude(lng);
    
//     circle.setMap(null);

//     // Close modal after setting the circle data
//     onClose();
    
//     // Optionally show an alert
//     handleAlert(true, "success", "Circle added locally");
//   };

//   return {
//     mapRef,
//     circleRef,
//     circleComplete,
//     drawingRef: useRef(), // If needed later
//     circle,
//   };
// };

// export default useGeoFencingmapp;


import { useContext, useEffect, useRef, useState } from "react";
// import { useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import useVendorState from "../../../hooks/Vendor-Onboarding/useVendorState";

const useGeoFencingmapp = ({ watch, onClose }) => {
  const mapRef = useRef();
  const { setLatitude, setLongitude } = useVendorState.getState();
  const circleRef = useRef();
  const [circle, setCircle] = useState(null);
//   const { organisationId } = useParams();
  const { handleAlert } = useContext(TestContext);

  const centerLocation = watch("location")?.position || undefined;

  useEffect(() => {
    if (centerLocation !== undefined && mapRef.current !== undefined) {
      mapRef.current.setCenter(centerLocation);
      mapRef.current.panTo(centerLocation);
    }
  }, [centerLocation]);

  const circleComplete = (circle) => {
    const lat = circle.center.lat();
    const lng = circle.center.lng();

    setCircle({
      center: { lat, lng },
      radius: circle.radius,
    });
    setLatitude(lat);
    setLongitude(lng);
    
    circle.setMap(null);
    
    // Optionally show an alert that the circle is added
    handleAlert(true, "success", "location added successfully");

    // Close the modal immediately
    onClose();
  };

  return {
    mapRef,
    circleRef,
    circleComplete,
    drawingRef: useRef(), // If needed later
    circle,
  };
};

export default useGeoFencingmapp;
