import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import useLocationMutation from "../../../../hooks/QueryHook/Location/mutation";
import useSelfieStore from "../../../../hooks/QueryHook/Location/zustand-store";
import useSelfieFaceDetect from "../useSelfieFaceDetect";
import Loader from "./Loader";

const MiniForm = () => {
  const { media } = useSelfieStore();
  const photoRef = useRef();
  const videoRef = useRef();
  const [imageCaptured, setImageCaptured] = useState(false);
  const { getImageUrl } = useLocationMutation();
  const { faceDetectedData, detectFaceOnlyMutation, matchFacesMutation } =
    useSelfieFaceDetect();

  useEffect(() => {
    let video = videoRef.current;
    video.srcObject = media;
  }, [media]);

  const takePicture = async () => {
    let width = 640;
    let height = 480;
    let photo = photoRef.current;
    let video = videoRef.current;
    photo.width = width;
    photo.height = height;
    let ctx = photo.getContext("2d");

    await ctx.drawImage(video, 0, 0, photo.width, photo.height);
    setImageCaptured(true);

    const dataUrl = photo.toDataURL("image/png");

    // Create a new Image object and set its src to the data URL
    const img = new Image();
    img.src = dataUrl;

    const faces = await detectFaceOnlyMutation({
      img,
    });

    const descriptor = new Float32Array(faceDetectedData?.data?.descriptor);
    if (faces?.length !== 1) {
      return setImageCaptured(false);
    }
    const response = await matchFacesMutation({
      currentDescriptor: faces[0]?.descriptor,
      descriptor,
    });
    if (response?._label === "unknown") {
      return setImageCaptured(false);
    }
    console.log(`🚀 ~ file: mini-form.jsx:62 ~ response:`, response);
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
      <div className="relative backdrop-filter backdrop-blur-sm bg-opacity-30 z-50">
        <video
          ref={videoRef}
          autoPlay={true}
          className={`container rounded-lg ${imageCaptured && "!hidden"}`}
          id="client-video"
        ></video>
        <Loader isLoading={true} />

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
          type="submit"
          disabled={!imageCaptured}
        >
          Clear
        </Button>
        <Button
          onClick={() => getImageUrl.mutate()}
          variant="contained"
          type="submit"
          disabled={!imageCaptured}
        >
          Upload
        </Button>
        <Button
          onClick={takePicture}
          variant="contained"
          type="submit"
          disabled={imageCaptured}
        >
          Capture
        </Button>
      </div>
    </form>
  );
};

export default MiniForm;
