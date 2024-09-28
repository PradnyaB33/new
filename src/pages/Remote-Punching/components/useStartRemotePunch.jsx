import axios from "axios";
import { useContext } from "react";
import { useQuery, useMutation } from "react-query";
import useGetUser from "../../../hooks/Token/useUser";
import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";
import { TestContext } from "../../../State/Function/Main";

const useStartRemotePunch = () => {
    //get auth token
    const { authToken } = useGetUser();
    const { handleAlert } = useContext(TestContext);

    //get state from useSelfieStore
    const {
        punchObjectId,
        start,
        setLocation,
        setTemporaryArray,
        temporaryArray,
        setId,
        clearTemporaryArray,
    } = useSelfieStore();

    //get location data
    const fetchLocationData = async () => {
        startGeoLocationWatch.mutate();

        const payload = {
            temporaryArray,
            punchObjectId,
        };

        const response = await axios.patch(
            `${process.env.REACT_APP_API}/route/punch`,
            payload,
            {
                headers: { Authorization: authToken },
            }
        );

        return response.data;
    };

    const { data, refetch } = useQuery("location-push", fetchLocationData, {
        refetchInterval: 60000,
        enabled: start,
        refetchIntervalInBackground: true,
        onSuccess: (data) => {
            clearTemporaryArray();
        },
        onError: (error) => {
            console.error(error);
            handleAlert(
                true,
                "error",
                error?.data || "Error in fetching location data"
            );
        },
    });

    const getNavigatorData = async () => {
        const id = navigator.geolocation.watchPosition(
            (positionCallback) => {
                const { latitude, longitude } = positionCallback.coords;
                setTemporaryArray({ latitude, longitude });
                setLocation({ lat: latitude, lng: longitude });
            },
        );
        return id;
    };

    const startGeoLocationWatch = useMutation({
        mutationFn: getNavigatorData,
        onSuccess: (data) => {
            setId(data);
        },
        onError: (data) => {
            console.error(data);
        },
    });
    return { data, refetch };
};

export default useStartRemotePunch;






