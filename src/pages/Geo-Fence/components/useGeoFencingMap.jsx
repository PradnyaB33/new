import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";
import { useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
const useGeoFencingMap = ({ watch }) => {
  const mapRef = useRef();
  const circleRef = useRef();
  const [circle, setCircle] = useState(null);
  const { organisationId } = useParams();
  const { handleAlert } = useContext(TestContext);
  console.log(
    `🚀 ~ file: useGeoFencingMap.jsx:8 ~ organisationId:`,
    organisationId
  );

  const drawingRef = useRef();

  const centerLocation = watch("location")?.position || undefined;
  useEffect(() => {
    if (centerLocation !== undefined && mapRef.current !== undefined) {
      mapRef?.current?.setCenter(centerLocation);
      mapRef?.current?.panTo(centerLocation);
    }
  }, [centerLocation]);

  const circleComplete = (circle) => {
    setCircle({
      center: {
        lat: circle.center.lat(),
        lng: circle.center.lng(),
      },
      radius: circle.radius,
    });
    circle.setMap(null);
  };

  const addCircle = async () => {
    const result = await axios.post(
      `${process.env.REACT_APP_API}/route/geo-fence/${organisationId}`,
      { ...circle.center, radius: circle.radius }
    );
    return result.data;
  };

  const { mutate: addCircleMutate } = useMutation(addCircle, {
    onSuccess: (data) => {
      console.log(`🚀 ~ file: useGeoFencingMap.jsx:64 ~ data`, data);
      handleAlert(
        true,
        "success",
        data?.message || "Circle added successfully"
      );
    },
    onError: (error) => {
      console.log(`🚀 ~ file: useGeoFencingMap.jsx:67 ~ error`, error);
      handleAlert(true, "error", error?.response?.data?.message || "Error");
    },
  });

  return {
    mapRef,
    circleRef,
    circleComplete,
    drawingRef,
    circle,
    addCircleMutate,
  };
};

export default useGeoFencingMap;
