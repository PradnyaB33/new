import React, { useContext, useEffect } from "react";
import { Chip } from "@mui/material";
import { useJsApiLoader } from "@react-google-maps/api";
import moment from "moment";
import MapComponent from "./components/MapComponent";
import useSelfieStore from "../../hooks/QueryHook/Location/zustand-store";
import { useMutation } from "react-query";
import { TestContext } from "../../State/Function/Main";
import StartRemotePunch from "./components/StartRemotePunch";
import AddVisitDetails from "../Remote-Punching-Employee/components/AddVisitDetails";
import TaskListEmployee from "../Remote-Punching-Employee/components/TaskListEmployee";
import useSubscriptionGet from "../../hooks/QueryHook/Subscription/hook";
import { useParams } from "react-router-dom";
import PhotoCaptureCamera from "./components/PhotoCaptureCamera";

const EmployeeSideRemotePunching = () => {
    const { handleAlert } = useContext(TestContext);
    const { organisationId } = useParams();
    const { data: subscription } = useSubscriptionGet({
        organisationId: organisationId,
    });

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
            console.info(`🚀 ~ file: mutation.jsx:34 ~ data:`, data);
        },
        onError: (data) => {
            console.error(data);
            handleAlert(true, "error", data.message);
        },
    });

    // const { getUserLocation } = useLocationMutation();
    const { data, mutate } = getUserLocation;
    console.log("wwwwdata", data);

    useEffect(() => {
        mutate();
    }, [mutate]);

    //get exact location and start and end time data
    const { locationArray, startTime, endTime } = useSelfieStore();

    //google map loaded
    const { isLoaded } = useJsApiLoader({
        id: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,

        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    });

    return (
        <div className="w-full h-full bg-slate-200">
            <div className="flex  items-center justify-center h-[92vh]">
                {data ? (
                    <MapComponent {...{ isLoaded, data, locationArray }} />
                ) : (
                    "Loading"
                )}
                <div className="top-7  sm:right-12 absolute px-10 pt-20 flex flex-col items-end justify-center">
                    <Chip
                        label={`Please do not connect to any wi-fi till you location is fetching`}
                        variant="filled"
                        color="error"
                        sx={{ width: { sm: "auto", xs: "350px" }, mb: "10px" }}
                    />
                    <Chip
                        label={`Latitude is ${data?.latitude}`}
                        className="!bg-white"
                        variant="filled"
                        sx={{ mb: "10px" }}
                    />
                    {startTime && (
                        <>
                            <Chip
                                label={`Started at ${moment(startTime).format("hh:mm:ss")}`}
                                className="!bg-white"
                                variant="filled"
                            />
                            <Chip
                                label={`Ended at ${endTime
                                    ? moment(endTime).format("hh:mm:ss")
                                    : moment().format("hh:mm:ss")
                                    }`}
                                className="!bg-white"
                                variant="filled"
                            />
                        </>
                    )}
                    <Chip
                        label={`Longitude is ${data?.longitude}`}
                        className="!bg-white"
                        variant="filled"
                    />
                </div>
                {subscription?.organisation?.packageInfo === "Enterprise Plan" ? <> <TaskListEmployee />
                    <AddVisitDetails /></> : null}
                <StartRemotePunch />
                <PhotoCaptureCamera />
            </div>
        </div>
    )
}

export default EmployeeSideRemotePunching


