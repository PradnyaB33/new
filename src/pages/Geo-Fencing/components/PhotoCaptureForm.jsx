// // import { Button, CircularProgress } from "@mui/material";
// // import React, { useEffect, useRef, useState } from "react";
// // // import useLocationMutation from "./useLocationMutation";
// // import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";
// // import FaceDetectionLoader from "./FaceDetectionLoader";
// // import useSelfieFaceDetect from "./useSelfieFaceDetect";
// // import UserProfile from "../../../hooks/UserData/useUser";
// // import useHook from "../../../hooks/UserProfile/useHook";
// // import axios from 'axios';
// // import useGetUser from "../../../hooks/Token/useUser";

// // const PhotoCaptureForm = () => {
// //     // const { start, setStart } = useSelfieStore();
// //     const { media } = useSelfieStore();
// //     const photoRef = useRef();
// //     const videoRef = useRef();
// //     const { getCurrentUser } = UserProfile();
// //     const user = getCurrentUser();
// //     console.log("user", user);
// //     const { UserInformation } = useHook();
// //     const profileImage = UserInformation?.user_logo_url;

// //     const [imageCaptured, setImageCaptured] = useState(false);
// //     const [profileImageBlob, setProfileImageBlob] = useState(null);
// //     const [isUploading, setIsUploading] = useState(false);
// //     const { authToken } = useGetUser();
// //     // Get image URL
// //     // const { getImageUrl } = useLocationMutation();

// //     const downloadImage = async (url) => {
// //         const response = await fetch(url);
// //         const blob = await response.blob();
// //         setProfileImageBlob(blob); // Store the profile image blob for comparison
// //     };

// //     useEffect(() => {
// //         if (profileImage) {
// //             downloadImage(profileImage); // Download profile image when component loads
// //         }
// //     }, [profileImage]);

// //     // Get useSelfieFaceDetect data
// //     const {
// //         // detectFaceOnlyMutation,
// //         // matchFacesMutation,
// //         loading,
// //         setLoading,
// //         isLoading,
// //         isMutationLoading,
// //         isFaceDetectionLoading,
// //         isFetching,
// //         employeeOrgId,
// //         uploadBtnActive
// //     } = useSelfieFaceDetect();

// //     useEffect(() => {
// //         let video = videoRef.current;
// //         video.srcObject = media;
// //     }, [media]);

// //     const takePicture = async () => {
// //         setLoading(true);
// //         setImageCaptured(true);
// //         let width = 640;
// //         let height = 480;
// //         let photo = photoRef.current;
// //         let video = videoRef.current;
// //         photo.width = width;
// //         photo.height = height;
// //         let ctx = photo.getContext("2d");
// //         ctx.drawImage(video, 0, 0, photo.width, photo.height);

// //         const dataUrl = photo.toDataURL("image/png");

// //         const imgBlob = await (await fetch(dataUrl)).blob(); // Convert captured image to Blob

// //         if (employeeOrgId?.employee?.faceRecognition === true) {
// //             await compareFaces(imgBlob, profileImageBlob); // Compare with profile image
// //         }

// //         setLoading(false);
// //     };

// //     // Clear Image
// //     const clearImage = () => {
// //         let photo = photoRef.current;
// //         let ctx = photo.getContext("2d");
// //         ctx.clearRect(0, 0, photo.width, photo.height);
// //         setImageCaptured(false);
// //     };

// //     // Compare Faces API Call
// //     const compareFaces = async (capturedImage, profileImage) => {
// //         try {
// //             setIsUploading(true);
// //             const formData = new FormData();
// //             formData.append('uploadedImage', capturedImage, 'captured-image.png');
// //             formData.append('profileImage', profileImage, 'profile-image.png');

// //             const response = await axios.post(`${process.env.REACT_APP_API}/route/face-model/compare`, formData, {
// //                 headers: {
// //                     Authorization: authToken,
// //                     'Content-Type': 'multipart/form-data'
// //                 }
// //             });

// //             console.log('Face comparison result:', response.data);
// //         } catch (error) {
// //             console.error('Error comparing faces:', error);
// //         } finally {
// //             setIsUploading(false);
// //         }
// //     };

// //     return (
// //         <form
// //             onSubmit={(e) => e.preventDefault()}
// //             className="flex flex-col gap-4 w-full"
// //             noValidate
// //         >
// //             <div className="relative">
// //                 <video
// //                     ref={videoRef}
// //                     autoPlay={true}
// //                     className={`container rounded-lg ${imageCaptured && "!hidden"}`}
// //                     id="client-video"
// //                 ></video>
// //                 <FaceDetectionLoader
// //                     isLoading={
// //                         employeeOrgId?.employee?.faceRecognition === true &&
// //                         (loading || isLoading || isMutationLoading || isFaceDetectionLoading || isFetching)
// //                     }
// //                 />
// //                 <canvas
// //                     ref={photoRef}
// //                     className={`container rounded-lg ${!imageCaptured && "!hidden"}`}
// //                     id="client-photo"
// //                 />
// //             </div>
// //             <div className="flex w-full justify-between">
// //                 <Button
// //                     onClick={clearImage}
// //                     variant="contained"
// //                     color="error"
// //                     disabled={
// //                         !imageCaptured ||
// //                         loading ||
// //                         isLoading ||
// //                         isMutationLoading ||
// //                         isFaceDetectionLoading ||
// //                         isFetching
// //                     }
// //                 >
// //                     Clear
// //                 </Button>
// //                 <Button
// //                     onClick={takePicture}
// //                     variant="contained"
// //                     disabled={imageCaptured}
// //                 >
// //                     Capture
// //                 </Button>
// //                 <Button
// //                     onClick={compareFaces}
// //                     variant="contained"
// //                     disabled={
// //                         !imageCaptured ||
// //                         isUploading ||
// //                         !profileImageBlob ||
// //                         (employeeOrgId?.employee?.faceRecognition === true && uploadBtnActive !== "Face match found")
// //                     }
// //                 >
// //                     {isUploading ? <CircularProgress size={20} /> : "Compare Faces"}
// //                 </Button>
// //             </div>
// //         </form>
// //     );
// // };

// // export default PhotoCaptureForm;
// import { Button, CircularProgress } from "@mui/material";
// import React, { useEffect, useRef, useState } from "react";
// import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";
// import FaceDetectionLoader from "./FaceDetectionLoader";
// import useSelfieFaceDetect from "./useSelfieFaceDetect";
// import UserProfile from "../../../hooks/UserData/useUser";
// import useHook from "../../../hooks/UserProfile/useHook";
// import axios from 'axios';
// import useGetUser from "../../../hooks/Token/useUser";

// const PhotoCaptureForm = ({ setOpen }) => {
//     const { media, setStart } = useSelfieStore(); // Get start and setStart from the store
//     const photoRef = useRef();
//     const videoRef = useRef();
//     const { getCurrentUser } = UserProfile();
//     const user = getCurrentUser();
//     console.log("user", user);
//     const { UserInformation } = useHook();
//     const profileImage = UserInformation?.user_logo_url;

//     const [imageCaptured, setImageCaptured] = useState(false);
//     const [profileImageBlob, setProfileImageBlob] = useState(null);
//     const [isUploading, setIsUploading] = useState(false);
//     const { authToken } = useGetUser();


//     const downloadImage = async (url) => {
//         const response = await fetch(url);
//         const blob = await response.blob();
//         setProfileImageBlob(blob); // Store the profile image blob for comparison
//     };

//     useEffect(() => {
//         if (profileImage) {
//             downloadImage(profileImage); // Download profile image when component loads
//         }
//     }, [profileImage]);

//     const {
//         loading,
//         setLoading,
//         isLoading,
//         isMutationLoading,
//         isFaceDetectionLoading,
//         isFetching,
//         employeeOrgId,
//         uploadBtnActive
//     } = useSelfieFaceDetect();

//     useEffect(() => {
//         let video = videoRef.current;
//         video.srcObject = media;
//     }, [media]);

//     const takePicture = async () => {
//         setLoading(true);
//         setImageCaptured(true);
//         let width = 640;
//         let height = 480;
//         let photo = photoRef.current;
//         let video = videoRef.current;
//         photo.width = width;
//         photo.height = height;
//         let ctx = photo.getContext("2d");
//         ctx.drawImage(video, 0, 0, photo.width, photo.height);

//         const dataUrl = photo.toDataURL("image/png");
//         const imgBlob = await (await fetch(dataUrl)).blob(); // Convert captured image to Blob

//         if (employeeOrgId?.employee?.faceRecognition === true) {
//             await compareFaces(imgBlob, profileImageBlob); // Compare with profile image
//         }

//         setLoading(false);
//         setOpen(false)
//     };

//     const compareFaces = async (capturedImage, profileImage) => {
//         try {
//             setIsUploading(true);
//             const formData = new FormData();
//             formData.append('uploadedImage', capturedImage, 'captured-image.png');
//             formData.append('profileImage', profileImage, 'profile-image.png');

//             const response = await axios.post(`${process.env.REACT_APP_API}/route/face-model/compare`, formData, {
//                 headers: {
//                     Authorization: authToken,
//                     'Content-Type': 'multipart/form-data'
//                 }
//             });

//             console.log('Face comparison result:', response.data);

//             // If face match is successful, set start to true
//             if (response.data.match === true) {
//                 setStart(true); // Enable start button
//             }
//         } catch (error) {
//             console.error('Error comparing faces:', error);
//         } finally {
//             setIsUploading(false);
//         }
//     };

//     const clearImage = () => {
//         let photo = photoRef.current;
//         let ctx = photo.getContext("2d");
//         ctx.clearRect(0, 0, photo.width, photo.height);
//         setImageCaptured(false);
//     };

//     return (
//         <form
//             onSubmit={(e) => e.preventDefault()}
//             className="flex flex-col gap-4 w-full"
//             noValidate
//         >
//             <div className="relative">
//                 <video
//                     ref={videoRef}
//                     autoPlay={true}
//                     className={`container rounded-lg ${imageCaptured && "!hidden"}`}
//                     id="client-video"
//                 ></video>
//                 <FaceDetectionLoader
//                     isLoading={
//                         employeeOrgId?.employee?.faceRecognition === true &&
//                         (loading || isLoading || isMutationLoading || isFaceDetectionLoading || isFetching)
//                     }
//                 />
//                 <canvas
//                     ref={photoRef}
//                     className={`container rounded-lg ${!imageCaptured && "!hidden"}`}
//                     id="client-photo"
//                 />
//             </div>
//             <div className="flex w-full justify-between">
//                 <Button
//                     onClick={clearImage}
//                     variant="contained"
//                     color="error"
//                     disabled={
//                         !imageCaptured ||
//                         loading ||
//                         isLoading ||
//                         isMutationLoading ||
//                         isFaceDetectionLoading ||
//                         isFetching
//                     }
//                 >
//                     Clear
//                 </Button>
//                 <Button
//                     onClick={takePicture}
//                     variant="contained"
//                     disabled={imageCaptured}
//                 >
//                     Capture
//                 </Button>
//                 <Button
//                     onClick={compareFaces}
//                     variant="contained"
//                     disabled={
//                         !imageCaptured ||
//                         isUploading ||
//                         !profileImageBlob ||
//                         (employeeOrgId?.employee?.faceRecognition === true && uploadBtnActive !== "Face match found")
//                     }
//                 >
//                     {isUploading ? <CircularProgress size={20} /> : "Compare Faces"}
//                 </Button>
//             </div>
//         </form>
//     );
// };

// export default PhotoCaptureForm;
import { Button, CircularProgress } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";
import FaceDetectionLoader from "./FaceDetectionLoader";
import useSelfieFaceDetect from "./useSelfieFaceDetect";
import UserProfile from "../../../hooks/UserData/useUser";
import useHook from "../../../hooks/UserProfile/useHook";
import axios from 'axios';
import useGetUser from "../../../hooks/Token/useUser";

const PhotoCaptureForm = ({ setOpen }) => {
    const { media, setStart, geoFencingArea, setPunchObjectId } = useSelfieStore(); // Get geoFencingArea from the store
    const photoRef = useRef();
    const videoRef = useRef();
    const { getCurrentUser } = UserProfile();
    const user = getCurrentUser();
    console.log("user", user);
    const { UserInformation } = useHook();
    const profileImage = UserInformation?.user_logo_url;

    const [imageCaptured, setImageCaptured] = useState(false);
    const [profileImageBlob, setProfileImageBlob] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const { authToken } = useGetUser();

    const downloadImage = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        setProfileImageBlob(blob); // Store the profile image blob for comparison
    };

    useEffect(() => {
        if (profileImage) {
            downloadImage(profileImage); // Download profile image when component loads
        }
    }, [profileImage]);

    const {
        loading,
        setLoading,
        isLoading,
        isMutationLoading,
        isFaceDetectionLoading,
        isFetching,
        employeeOrgId,
        uploadBtnActive
    } = useSelfieFaceDetect();

    useEffect(() => {
        let video = videoRef.current;
        video.srcObject = media;
    }, [media]);

    const takePicture = async () => {
        setLoading(true);
        setImageCaptured(true);
        let width = 640;
        let height = 480;
        let photo = photoRef.current;
        let video = videoRef.current;
        photo.width = width;
        photo.height = height;
        let ctx = photo.getContext("2d");
        ctx.drawImage(video, 0, 0, photo.width, photo.height);

        const dataUrl = photo.toDataURL("image/png");
        const imgBlob = await (await fetch(dataUrl)).blob(); // Convert captured image to Blob


        // Stop the video stream after capturing
        const tracks = media.getTracks();
        tracks.forEach(track => track.stop());  // Stop each track in the media stream
 
        // Optional: Nullify video stream to stop video preview (if needed)
        video.srcObject = null;
        
        if (employeeOrgId?.employee?.faceRecognition === true) {
            await compareFaces(imgBlob, profileImageBlob); // Compare with profile image
        }

        setLoading(false);
    };

    const compareFaces = async (capturedImage, profileImage) => {
        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('uploadedImage', capturedImage, 'captured-image.png');
            formData.append('profileImage', profileImage, 'profile-image.png');

            const response = await axios.post(`${process.env.REACT_APP_API}/route/face-model/compare`, formData, {
                headers: {
                    Authorization: authToken,
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Face comparison result:', response.data);

            // If face match is successful, set start to true and create punch entry
            if (response.data.match === true) {
                setStart(true); // Enable start button
                await createPunchEntry(); // Call punch API
                setOpen(false); // Close modal after success
            }
        } catch (error) {
            console.error('Error comparing faces:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const createPunchEntry = async () => {
        try {
            const punchResponse = await axios.post(
                `${process.env.REACT_APP_API}/route/punch`,
                { geoFencingArea }, // Pass geoFencingArea if needed by API
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: authToken
                    }
                }
            );
            setPunchObjectId(punchResponse?.data?.punchObjectId)
            console.log("Punch object created:", punchResponse.data?.punchObjectId)
        } catch (error) {
            console.error("Error creating punch object:", error);
        }
    };

    const clearImage = () => {
        let photo = photoRef.current;
        let ctx = photo.getContext("2d");
        ctx.clearRect(0, 0, photo.width, photo.height);
        setImageCaptured(false);
    };

    return (
        <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-4 w-full"
            noValidate
        >
            <div className="relative">
                <video
                    ref={videoRef}
                    autoPlay={true}
                    className={`container rounded-lg ${imageCaptured && "!hidden"}`}
                    id="client-video"
                ></video>
                <FaceDetectionLoader
                    isLoading={
                        employeeOrgId?.employee?.faceRecognition === true &&
                        (loading || isLoading || isMutationLoading || isFaceDetectionLoading || isFetching)
                    }
                />
                <canvas
                    ref={photoRef}
                    className={`container rounded-lg ${!imageCaptured && "!hidden"}`}
                    id="client-photo"
                />
            </div>
            <div className="flex w-full justify-between">
                <Button
                    onClick={clearImage}
                    variant="contained"
                    color="error"
                    disabled={
                        !imageCaptured ||
                        loading ||
                        isLoading ||
                        isMutationLoading ||
                        isFaceDetectionLoading ||
                        isFetching
                    }
                >
                    Clear
                </Button>
                <Button
                    onClick={takePicture}
                    variant="contained"
                    disabled={imageCaptured}
                >
                    Capture
                </Button>
                <Button
                    onClick={compareFaces}
                    variant="contained"
                    disabled={
                        !imageCaptured ||
                        isUploading ||
                        !profileImageBlob ||
                        (employeeOrgId?.employee?.faceRecognition === true && uploadBtnActive !== "Face match found")
                    }
                >
                    {isUploading ? <CircularProgress size={20} /> : "Compare Faces"}
                </Button>
            </div>
        </form>
    );
};

export default PhotoCaptureForm;
