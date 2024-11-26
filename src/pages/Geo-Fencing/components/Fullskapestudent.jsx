import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, Button, CircularProgress } from "@mui/material";
import axios from "axios";
import useAuthToken from "../../../hooks/Token/useAuth";

export default function StudentVerification({ student, onClose }) {
    const [isLoading, setIsLoading] = useState(false);
    const [verificationResult, setVerificationResult] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [profileImageBlob, setProfileImageBlob] = useState(null); // Store profile image blob
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const authToken = useAuthToken();

    useEffect(() => {
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

        const fetchProfileImage = async () => {
            if (student?.imageUrl) {
                try {
                    const response = await fetch(student.imageUrl, { mode: 'no-cors' });
                    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
                    const blob = await response.blob();
                    setProfileImageBlob(blob);
                } catch (error) {
                    console.error("Error downloading image:", error);
                }
            }
        };

        const videoElement = videoRef.current;

        startCamera();
        fetchProfileImage();

        return () => {
            if (videoElement?.srcObject) {
                const tracks = videoElement.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
            }
        };
    }, [student]);

    const handleCapture = () => {
    const canvas = canvasRef.current;
    if (!canvas || !videoRef.current) return;

    // Draw the current frame from the video onto the canvas
    const context = canvas.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Convert the canvas image to a data URL and set it
    setCapturedImage(canvas.toDataURL("image/png"));

    // Stop the video stream to close the camera
    if (videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null; // Clear the video source
    }
};


    const handleRetake = () => {
        setCapturedImage(null);
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
        startCamera();
    };

    const compareFaces = async () => {
        try {
            setIsUploading(true);
            if (!capturedImage || !profileImageBlob) {
                throw new Error("Captured image or profile image not available.");
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
            formData.append("profileImage", profileImageBlob, "profile-image.png");

            const response = await axios.post(
                `${process.env.REACT_APP_API}/route/face-model/compare`,
                formData,
                {
                    headers: {
                        Authorization: authToken,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error("Face comparison error:", error);
            throw error;
        } finally {
            setIsUploading(false);
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

    return (
        <Dialog open={!!student} onClose={onClose} fullWidth maxWidth="sm">
            <DialogContent>
                <h2 className="text-center font-bold text-2xl">Verify Student</h2>
                <div className="relative">
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
                    <Button variant="contained" color="primary" onClick={handleCapture}>
                        Capture Selfie
                    </Button>
                ) : (
                    <div className="flex justify-center gap-4 mt-4">
                        <Button variant="outlined" color="primary" onClick={handleRetake}>
                            Retake
                        </Button>
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
