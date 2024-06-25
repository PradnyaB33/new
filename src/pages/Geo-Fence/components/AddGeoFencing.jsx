import { zodResolver } from "@hookform/resolvers/zod";
import { FactoryOutlined, LocationOn } from "@mui/icons-material";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useLocationMutation from "../../../hooks/QueryHook/Location/mutation";

const AddGeoFencing = () => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const { getUserLocation } = useLocationMutation();
  const { data } = getUserLocation;
  const mapRef = useRef();
  const formSchema = z.object({
    geoFencingType: z.enum(["PointPicker", "DrawCircle"]),
    location: z
      .any({
        address: z.string(),
        position: z.object({
          lat: z.number(),
          lng: z.number(),
        }),
      })
      .refine(
        (val) => {
          return (
            val.address !== ("" || undefined) &&
            val.position.lat !== 0 &&
            val.position.lng !== 0
          );
        },
        { message: "Location is required" }
      ),
    radius: z.number().min(1, { message: "Radius must be greater than 0" }),
  });

  const { control, formState, handleSubmit, watch } = useForm({
    resolver: zodResolver(formSchema),
  });
  const { errors } = formState;
  const onSubmit = (data) => {
    console.log(data);
  };
  console.log(watch("location"));
  const centerLocation = watch("location")?.position;
  useEffect(() => {
    console.log(
      `🚀 ~ file: AddGeoFencing.jsx:50 ~ centerLocation:`,
      centerLocation
    );
    mapRef.current.setCenter(centerLocation);
  }, [centerLocation]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
      <AuthInputFiled
        className="w-full"
        name="location"
        icon={LocationOn}
        control={control}
        placeholder="eg. Kathmandu, Nepal"
        type="location-picker"
        label="Location *"
        errors={errors}
        error={errors.location}
        value={watch("location")}
      />
      <AuthInputFiled
        name="geoFencingType"
        icon={FactoryOutlined}
        control={control}
        type="naresh-select"
        placeholder="Type of Industry "
        label="Type of Industry  *"
        errors={errors}
        error={errors.geoFencingType}
        options={[
          { value: "PointPicker", label: "Point Picker" },
          { value: "DrawCircle", label: "Draw Circle" },
        ]}
      />
      {watch("geoFencingType") === "PointPicker" && (
        <AuthInputFiled
          name="radius"
          icon={LocationOn}
          control={control}
          type="number"
          placeholder="Radius"
          label="Radius *"
          errors={errors}
          error={errors.radius}
        />
      )}
      {/* <LoadScript
        googleMapsApiKey={apiKey}
        libraries={["drawing"]}
        language="en"
        region="us"
        loadingElement={<div style={{ height: `100%` }}>I am loading</div>}
      > */}
      <GoogleMap
        mapContainerClassName="cols-span-4 h-20"
        center={{
          lat: 18.5248706,
          lng: 73.6981502,
        }}
        onLoad={(map) => {
          mapRef.current = map;
        }}
        zoom={12}
      >
        {watch("location") !== undefined &&
          watch("location")?.position !== undefined && (
            <MarkerF position={watch("location")?.position} />
          )}
      </GoogleMap>
      {/* </LoadScript> */}
    </form>
  );
};

export default AddGeoFencing;
