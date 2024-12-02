// import React, { useState, useRef, useEffect } from "react";
// import { Dialog, DialogContent, Button, CircularProgress } from "@mui/material";
// import axios from "axios";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import useSetupRemotePunching from "../../../hooks/QueryHook/Setup/remote-punching";
// import { useParams } from "react-router-dom";
// import { IconButton } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close"

// export default function StudentVerification({ student, onClose, zoneId }) {
//     const [isLoading, setIsLoading] = useState(false);
//     const [verificationResult, setVerificationResult] = useState(null);
//     const [capturedImage, setCapturedImage] = useState(null);
//     const [isUploading, setIsUploading] = useState(false);
//     // const [profileImageBlob, setProfileImageBlob] = useState(null); // Store profile image blob
//     const { organisationId } = useParams();
//     const { data } = useSetupRemotePunching(organisationId);
//     console.log("Data useSetupRemotePunching:", data?.remotePunchingObject?.notifyWhatsApp);
//     const isnotifywhatsapp = data?.remotePunchingObject?.notifyWhatsApp;
//     const videoRef = useRef(null);
//     const canvasRef = useRef(null);
//     const authToken = useAuthToken();

//     useEffect(() => {
//         const startCamera = async () => {
//             try {
//                 const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//                 if (videoRef.current) {
//                     videoRef.current.srcObject = stream;
//                     videoRef.current.onloadedmetadata = () => videoRef.current.play();
//                 }
//             } catch (error) {
//                 console.error("Error accessing camera:", error);
//             }
//         };

//         // const fetchProfileImage = async () => {
//         //     try {
//         //         const imageUrl = `${process.env.REACT_APP_API}/route/getImageFile?imageUrl=${student.imageUrl}`;
//         //         const response = await axios.get(imageUrl, {
//         //             headers: {
//         //                 Authorization: authToken,
//         //             },
//         //             responseType: "blob", // Ensure the response is a Blob
//         //         });
//         //         console.log("Image fetched successfully:", response);

//         //         const blob = response.data; // response.data is already a Blob
//         //         setProfileImageBlob(blob);

            
//         //     } catch (error) {
//         //         console.error("Error downloading image:", error);
//         //     }
//         // };

       
        
//         const videoElement = videoRef.current;

//         startCamera();
//         // fetchProfileImage();

//         return () => {
//             if (videoElement?.srcObject) {
//                 const tracks = videoElement.srcObject.getTracks();
//                 tracks.forEach((track) => track.stop());
//             }
//         };
//     }, [student, authToken]);

//     const handleCapture = () => {
//     const canvas = canvasRef.current;
//     if (!canvas || !videoRef.current) return;

//     // Draw the current frame from the video onto the canvas
//     const context = canvas.getContext("2d");
//     context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

//     // Convert the canvas image to a data URL and set it
//     setCapturedImage(canvas.toDataURL("image/png"));

//     // Stop the video stream to close the camera
//     if (videoRef.current.srcObject) {
//         const tracks = videoRef.current.srcObject.getTracks();
//         tracks.forEach((track) => track.stop());
//         videoRef.current.srcObject = null; // Clear the video source
//     }
// };


//     const handleRetake = () => {
//         setCapturedImage(null);
//         const startCamera = async () => {
//             try {
//                 const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//                 if (videoRef.current) {
//                     videoRef.current.srcObject = stream;
//                     videoRef.current.play();
//                 }
//             } catch (error) {
//                 console.error("Error accessing camera:", error);
//             }
//         };
//         startCamera();
//     };

//     // const compareFaces = async () => {
//     //     try {
//     //         setIsUploading(true);
//     //         if (!capturedImage || !profileImageBlob) {
//     //             throw new Error("Captured image or profile image not available.");
//     //         }

//     //         const base64ToBlob = (base64) => {
//     //             const byteString = atob(base64.split(",")[1]);
//     //             const byteArray = new Uint8Array(byteString.length);
//     //             for (let i = 0; i < byteString.length; i++) {
//     //                 byteArray[i] = byteString.charCodeAt(i);
//     //             }
//     //             return new Blob([byteArray], { type: "image/png" });
//     //         };

//     //         const capturedBlob = base64ToBlob(capturedImage);

//     //         const formData = new FormData();
//     //         formData.append("uploadedImage", capturedBlob, "captured-image.png");
//     //         formData.append("profileImage", profileImageBlob, "profile-image.png");

//     //         const response = await axios.post(
//     //             `${process.env.REACT_APP_API}/route/face-model/compare`,
//     //             formData,
//     //             {
//     //                 headers: {
//     //                     Authorization: authToken,
//     //                     "Content-Type": "multipart/form-data",
//     //                 },
//     //             }
//     //         );
//     //         if (response.data?.match) {
//     //             console.log("Face comparison successful. Sending verification email...");
//     //             await sendVerificationEmail(student.parentEmail);
//     //             if(isnotifywhatsapp){await sendWhatsAppMessage();}
//     //             await handleMarkAttendance(); 
//     //         }

//     //         return response.data;
//     //     } catch (error) {
//     //         console.error("Face comparison error:", error);
//     //         throw error;
//     //     } finally {
//     //         setIsUploading(false);
//     //     }

        
//     // };

//     const compareFaces = async () => {
//         try {
//             setIsUploading(true);
//             if (!capturedImage) {
//                 throw new Error("Captured image is not available.");
//             }
    
//             const base64ToBlob = (base64) => {
//                 const byteString = atob(base64.split(",")[1]);
//                 const byteArray = new Uint8Array(byteString.length);
//                 for (let i = 0; i < byteString.length; i++) {
//                     byteArray[i] = byteString.charCodeAt(i);
//                 }
//                 return new Blob([byteArray], { type: "image/png" });
//             };
    
//             const capturedBlob = base64ToBlob(capturedImage);
    
//             const formData = new FormData();
//             formData.append("uploadedImage", capturedBlob, "captured-image.png");
    
//             const response = await axios.post(
//                 `${process.env.REACT_APP_API}/route/face-model/Fullskape/compare`,
//                 formData,
//                 {
//                     headers: {
//                         Authorization: authToken,
//                         "Content-Type": "multipart/form-data",
//                     },
//                 }
//             );
    
//             if (response.data?.match) {
//                 const student = response.data.student;
//                 console.log("Face comparison successful. Matched student:", student);
    
//                 // Optional: Send verification email and other actions if a match is found
//                 // await sendVerificationEmail(student.parentEmail);
//                 if (isnotifywhatsapp) {
//                     await sendWhatsAppMessage();
//                 }
//                 await handleMarkAttendance();
    
//                 return response.data;
//             } else {
//                 console.log("No match found:", response.data.message);
//                 return response.data;
//             }
//         } catch (error) {
//             console.error("Face comparison error:", error);
//             throw error;
//         } finally {
//             setIsUploading(false);
//         }
//     };
    
//     const handleMarkAttendance = async () => {
//         try {
//             const response = await axios.post(
//                 `${process.env.REACT_APP_API}/route/fullskape-attendance/${zoneId}/${student._id}`,
//                 { 
//                     studentId: student._id,
//                     status: "Present" // or "Absent" depending on the scenario
//                 },
//                 {
//                     headers: {
//                         Authorization: authToken,
//                     },
//                 }
//             );
//             console.log("Attendance marked successfully:", response.data);
//             setVerificationResult("Attendance marked successfully!");
//         } catch (error) {
//             console.error("Error marking attendance:", error.response?.data || error.message);
//             setVerificationResult(error.response?.data?.error || "An error occurred");
//         }
//     };
    

//     // const sendVerificationEmail = async (parentEmail) => {
//     //     try {
//     //         const response = await axios.post(
//     //             `${process.env.REACT_APP_API}/route/fullskapeemail`,
//     //             {
//     //                 organizationName: "Organization Name",
//     //                 studentName: student.name,
//     //                 standard: student.class ?? "", // Provide a default empty string if standard is undefined
//     //                 activity: "start",
//     //                 formattedDate: new Date().toLocaleString(),
//     //                 toEmail: parentEmail,
//     //             },
//     //             {
//     //                 headers: {
//     //                     Authorization: authToken,
//     //                 },
//     //             }
//     //         );
//     //         console.log("Verification email sent:", response.data.message);
//     //     } catch (error) {
//     //         console.error("Error sending email:", error.response?.data || error.message);
//     //     }
//     // };

//     const sendWhatsAppMessage = async () => {
//         try {
//           const response = await axios.post(
//             `${process.env.REACT_APP_API}/route/whatsapp/send-message`,
//             {
//               parentPhoneNumber: "+918605132405", // Replace with actual number
//               studentName: student.name,
//               standard: student.class ?? "", // Provide a default empty string if standard is undefined
//               activity: "start",
              
//             },
//             {
//               headers: {
//                 Authorization: `Bearer ${authToken}`,
//               },
//             }
//           );
//           console.log("Response:", response.data);
//         } catch (error) {
//           console.error("Error:", error.response?.data || error.message);
//         }
//       };
      
    

//     const handleSubmit = async () => {
//         setIsLoading(true);
//         try {
//             const result = await compareFaces();
//             setVerificationResult(result.match ? "Verification successful!" : "Verification failed.");
//         } catch {
//             setVerificationResult("An error occurred during verification.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <Dialog open={!!student} onClose={onClose} fullWidth maxWidth="sm">
//     <DialogContent>
//         <div className="flex justify-between items-center">
//             <h2 className="text-center font-bold text-2xl">Verify Student</h2>
//             <IconButton onClick={onClose} size="small">
//                 <CloseIcon />
//             </IconButton>
//         </div>
//         <div className="flex justify-center">
//             {!capturedImage ? (
//                 <video
//                     ref={videoRef}
//                     width="640"
//                     height="480"
//                     style={{ borderRadius: "8px" }}
//                 />
//             ) : (
//                 <img
//                     src={capturedImage}
//                     alt="Captured"
//                     className="rounded-md my-4"
//                     width="640"
//                     height="480"
//                 />
//             )}
//             <canvas ref={canvasRef} width="640" height="480" style={{ display: "none" }} />
//         </div>
//         {!capturedImage ? (
//             <div className="flex justify-center mt-4">
//                 <Button variant="contained" color="primary" onClick={handleCapture}>
//                     Capture Selfie
//                 </Button>
//             </div>
//          ) : (
//             <div className="flex justify-center gap-4 mt-4">
//                 <Button variant="outlined" color="primary" onClick={handleRetake}>
//                     Retake
//                 </Button>
//                 <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={handleSubmit}
//                     disabled={isUploading}
//                 >
//                     Submit
//                 </Button>
//             </div>
//         )}

//         {isLoading && (
//             <div className="flex justify-center items-center py-4">
//                 <CircularProgress />
//             </div>
//         )}
//         {verificationResult && <p className="text-center mt-4 text-lg">{verificationResult}</p>}
//     </DialogContent>
// </Dialog>
//     );
// }


import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, Button, CircularProgress } from "@mui/material";
import axios from "axios";
import * as faceapi from "face-api.js";
import useAuthToken from "../../../hooks/Token/useAuth";
import useSetupRemotePunching from "../../../hooks/QueryHook/Setup/remote-punching";
import { useParams } from "react-router-dom";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function StudentVerification({ student, onClose, zoneId, activity }) {
    const [isLoading, setIsLoading] = useState(false);
    const [verificationResult, setVerificationResult] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const { organisationId } = useParams();
    const { data } = useSetupRemotePunching(organisationId);
    const isnotifywhatsapp = data?.remotePunchingObject?.notifyWhatsApp;
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const authToken = useAuthToken();
    const [isFaceDetected, setIsFaceDetected] = useState(false);

    useEffect(() => {
        const loadModels = async () => {
            try {
                await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
            } catch (error) {
                console.error("Error loading face-api.js models:", error);
            }
        };

        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => videoRef.current.play();
                }
            } catch (error) {
                console.error("Error accessing camera:", error);
            }
        };

        loadModels();
        startCamera();

        return () => {
            if (videoRef.current?.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        const detectFace = async () => {
            if (videoRef.current) {
                const detections = await faceapi.detectAllFaces(
                    videoRef.current,
                    new faceapi.TinyFaceDetectorOptions()
                );
    
                if (detections.length > 0 && !isFaceDetected) {
                    setIsFaceDetected(true);
                    handleCapture();
                }
            }
        };
    
        let intervalId;
        if (!isFaceDetected) {
            intervalId = setInterval(detectFace, 500); // Check every 500ms
        }
    
        return () => {
            clearInterval(intervalId);
        };
    }, [isFaceDetected]);
    
    useEffect(() => {
        const autoSubmit = async () => {
            if (capturedImage) {
                try {
                    await compareFaces(); // Call compareFaces automatically
                } catch (error) {
                    console.error("Automated submission failed:", error);
                }
            }
        };
    
        autoSubmit();
    }, [capturedImage]); // Trigger autoSubmit whenever capturedImage changes
    

    const handleCapture = () => {
        const canvas = canvasRef.current;
        if (!canvas || !videoRef.current) return;

        const context = canvas.getContext("2d");
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        setCapturedImage(canvas.toDataURL("image/png"));

        if (videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const handleVerificationReset = () => {
        // Reset state and prepare for new detection
        setCapturedImage(null);
        setVerificationResult(null);
        setIsFaceDetected(false);
        startCamera(); // Reopen the camera
    };
    
    const handleSuccessfulVerification = () => {
        setVerificationResult("Verification successful!");
        setTimeout(() => {
            handleVerificationReset(); // Prepare for the next face detection after 10 seconds
        }, 10000); // Wait for 10 seconds
    };
    
    const compareFaces = async () => {
        try {
            setIsUploading(true);
            if (!capturedImage) {
                throw new Error("Captured image is not available.");
            }
    
            const base64ToBlob = (base64) => {
                const byteString = atob(base64.split(",")[1]);
                const byteArray = new Uint8Array(byteString.length);
                for (let i = 0; i < byteString.length; i++) {
                    byteArray[i] = byteString.charCodeAt(i);
                }
                return new Blob([byteArray], { type: "image/png" });
            };
    
            const capturedBlob = base64ToBlob(capturedImage);
    
            const formData = new FormData();
            formData.append("uploadedImage", capturedBlob, "captured-image.png");
            formData.append("activity", activity);
    
            const response = await axios.post(
                `${process.env.REACT_APP_API}/route/face-model/Fullskape/compare`,
                formData,
                {
                    headers: {
                        Authorization: authToken,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
    
            if (response.data?.match) {
                const studentresponse = response.data.student;
                if (isnotifywhatsapp) {
                    await sendWhatsAppMessage(studentresponse);
                }
                await handleMarkAttendance(studentresponse);
                handleSuccessfulVerification(); // Trigger success handling
            } else {
                setVerificationResult("Verification failed. Please try again.");
                setTimeout(() => {
                    handleVerificationReset(); // Retry detection immediately after failure
                }, 3000); // Optional: Add a brief delay before retrying
            }
        } catch (error) {
            console.error("Face comparison error:", error);
            setVerificationResult("An error occurred during verification.");
            setTimeout(() => {
                handleVerificationReset(); // Retry detection in case of error
            }, 3000); // Optional: Add a brief delay before retrying
        } finally {
            setIsUploading(false);
        }
    };
    
    // Add startCamera as a standalone function for reuse
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        } catch (error) {
            console.error("Error accessing camera:", error);
        }
    };
    
    const handleMarkAttendance = async (studentResponse) => {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API}/route/fullskape-attendance/${zoneId}/${studentResponse._id}`,
            {
              type: activity, // Send `type` instead of `activity`
            },
            {
              headers: {
                Authorization: authToken,
              },
            }
          );
          console.log(`Attendance ${activity.toLowerCase()} recorded successfully:`, response.data);
        } catch (error) {
          console.error("Error marking attendance:", error.response?.data || error.message);
        }
      };
      
      

    const sendWhatsAppMessage = async (studentresponse) => {
        try {
            await axios.post(
                `${process.env.REACT_APP_API}/route/whatsapp/send-message`,
                {
                    parentPhoneNumber: `+91${studentresponse.parentPhoneNumber}`,
                    studentName: studentresponse.name,
                    standard: studentresponse.class ?? "",
                    activity: activity,
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );
        } catch (error) {
            console.error("Error sending WhatsApp message:", error.response?.data || error.message);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const result = await compareFaces();
            setVerificationResult(result.match ? "Verification successful!" : "Verification failed.");
        } catch {
            setVerificationResult("An error occurred during verification.");
        } finally {
            setIsLoading(false);
        }
    };

    // const handleRetake = () => {
    //     setCapturedImage(null);
    //     const startCamera = async () => {
    //         try {
    //             const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    //             if (videoRef.current) {
    //                 videoRef.current.srcObject = stream;
    //                 videoRef.current.play();
    //             }
    //         } catch (error) {
    //             console.error("Error accessing camera:", error);
    //         }
    //     };
    //     startCamera();
    // };

    return (
        <Dialog open={!!student} onClose={onClose} fullWidth maxWidth="sm">
        <DialogContent>
            <div className="flex justify-between items-center">
                <h2 className="text-center font-bold text-2xl">Verify Student</h2>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </div>
            <div className="flex justify-center">
                {!capturedImage ? (
                    <video
                        ref={videoRef}
                        width="640"
                        height="480"
                        style={{ borderRadius: "8px" }}
                    />
                ) : (
                    <img
                        src={capturedImage}
                        alt="Captured"
                        className="rounded-md my-4"
                        width="640"
                        height="480"
                    />
                )}
                <canvas ref={canvasRef} width="640" height="480" style={{ display: "none" }} />
            </div>
            {!capturedImage ? (
                <div className="flex justify-center mt-4">
                    <Button variant="contained" color="primary" onClick={handleCapture}>
                        Capture Selfie
                    </Button>
                </div>
            ) : (
                <div className="flex justify-center gap-4 mt-4">
                    
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={isUploading}
                    >
                        Submit
                    </Button>
                </div>
            )}

            {isLoading && (
                <div className="flex justify-center items-center py-4">
                    <CircularProgress />
                </div>
            )}
            {verificationResult && <p className="text-center mt-4 text-lg">{verificationResult}</p>}
        </DialogContent>
    </Dialog>
    );
}
