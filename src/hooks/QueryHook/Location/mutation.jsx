import axios from "axios";
import { useContext } from "react";
import { useMutation } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import useGetUser from "../../Token/useUser";
import useSelfieStore from "./zustand-store";

const useLocationMutation = () => {
  const { handleAlert } = useContext(TestContext);
  const { authToken } = useGetUser();
  const {
    setOpen,
    setMedia,
    setPunchObjectId,
    media,
    setStart,
    locationArray,
  } = useSelfieStore();
  console.log(`🚀 ~ file: mutation.jsx:20 ~ locationArray:`, locationArray);

  const fetchLocationData = async () => {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });
    });
    const { latitude, longitude, speed, accuracy } = position.coords;
    return {
      latitude,
      longitude,
      speed,
      accuracy,
    };
  };

  const getUserLocation = useMutation({
    mutationFn: fetchLocationData,
    onSuccess: (data) => {
      handleAlert(true, "success", "Geolocation decoded");
      // if (window.google.maps) {
      //   // Initialize the map
      //   const mapOptions = {
      //     center: { lat: data?.latitude, lng: data?.longitude },
      //     zoom: 18,
      //     mapTypeControl: false,
      //   };

      //   // Create the map
      //   // if (map !== null) {
      //   map = new window.google.maps.Map(
      //     document.getElementById("map"),
      //     mapOptions
      //   );
      //   // }

      //   // Add a marker
      //   new window.google.maps.Marker({
      //     position: { lat: data?.latitude, lng: data?.longitude },
      //     map: map,
      //     title: "Your Location!",
      //   });
      //   const polyline = new window.google.maps.Polyline({
      //     path: locationArray,
      //     geodesic: true,
      //     strokeColor: "#FF0000", // Color of the polyline
      //     strokeOpacity: 1.0,
      //     strokeWeight: 4,
      //   });
      //   console.log(`🚀 ~ file: mutation.jsx:71 ~ polyline:`, polyline);
      //   polyline.setMap(map);
      // }
    },
    onError: (data) => {
      console.error(data);
      handleAlert(true, "error", data.message);
    },
  });

  const fetchUserImage = async () => {
    const stream = await new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then(resolve)
        .catch(reject);
    });

    return stream;
  };

  const getUserImage = useMutation({
    mutationFn: fetchUserImage,
    onSuccess: async (data) => {
      setOpen(true);
      setMedia(data);
    },
    onError: (data) => {
      console.error(data);
      setOpen(false);
      handleAlert(true, "error", data.message);
    },
  });
  const fetchUrl = async () => {
    const data = await axios.get(
      `${process.env.REACT_APP_API}/route/punch/create-image-url`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      }
    );
    return data.data;
  };

  const getImageUrl = useMutation({
    mutationFn: fetchUrl,
    onSuccess: async (data) => {
      try {
        let photo = document.getElementById("client-photo");
        const blob = await new Promise((resolve) => photo.toBlob(resolve));
        const file = new File([blob], "captured_image.png", {
          type: blob.type,
        });
        await axios.put(data.url, file, {
          headers: {
            "Content-Type": file.type,
          },
        });

        getPunchObject.mutate(data?.url?.split("?")[0]);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    },
    onError: (data) => {
      console.error(data);
      handleAlert(true, "error", data.message);
    },
  });
  const fetchPunchObject = async (image) => {
    const data = await axios.post(
      `${process.env.REACT_APP_API}/route/punch`,
      { image },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      }
    );
    return data.data;
  };

  const getPunchObject = useMutation({
    mutationFn: fetchPunchObject,
    onSuccess: async (data) => {
      setPunchObjectId(data?.punchObjectId);
      const tracks = media.getTracks();
      tracks.forEach((track) => {
        track.stop(); // Stop each track in the media stream
      });
      setMedia(null);
      setOpen(false);
      setStart(true);
    },
    onError: (data) => {
      console.error(data);
      handleAlert(true, "error", data.message);
    },
  });

  return {
    getUserLocation,
    getUserImage,
    getImageUrl,
  };
};

export default useLocationMutation;
// const fetchLocationId = async () => {
//   const response = await axios.post(
//     `${process.env.REACT_APP_API}/route`,
//     // data,
//     {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: authToken,
//       },
//     }
//   );

//   return response.data;
// };

// const getLocationId = useMutation({
//   mutationFn: fetchLocationId,
//   onSuccess: (data) => {
//     handleAlert(true, "success", "Geolocation decoded");
//     if (window.google.maps) {
//       // Initialize the map
//       const mapOptions = {
//         center: { lat: data?.latitude, lng: data?.longitude },
//         zoom: 8,
//         mapTypeControl: false,
//       };

//       // Create the map
//       const map = new window.google.maps.Map(
//         document.getElementById("map"),
//         mapOptions
//       );

//       // Add a marker
//       new window.google.maps.Marker({
//         position: { lat: data?.latitude, lng: data?.longitude },
//         map: map,
//         title: "Your Location!",
//       });
//     }
//   },
//   onError: (data) => {
//     console.error(data);
//     handleAlert(true, "error", data.message);
//   },
// });
