import React, { useEffect, useState } from "react";
import PlacesAutocomplete, {
  geocodeByPlaceId,
} from "react-places-autocomplete";
import Select from "react-select";

const Auto = () => {
  const [address, setAddress] = useState("");
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [newSuggestions, setNewSuggestions] = useState([]);
  console.log(`🚀 ~ file: Auto.jsx:12 ~ newSuggestions:`, newSuggestions);

  useEffect(() => {
    let script;
    // Check if script is already loaded
    if (!window.google) {
      script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDaA2q3L--j40-GgojdeFSJ4RywKGtFQ2k&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
    } else {
      setScriptLoaded(true);
    }

    // Cleanup function
    return () => {
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleChange = (address) => {
    setAddress(address);
  };

  const handleSelect = async (option) => {
    console.log(`🚀 ~ file: Auto.jsx:39 ~ option:`, option);
    const response = await geocodeByPlaceId(option.placeId);
    console.log(
      `🚀 ~ file: Auto.jsx:43 ~ response:`,
      response[0]?.geometry?.location?.toJSON()
    );
  };
  if (!scriptLoaded) {
    return null; // or return a loading spinner
  }

  return (
    <div className="mt-40">
      <PlacesAutocomplete
        value={address}
        onChange={handleChange}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <SmallAuto
            {...{
              loading,
              suggestions,
              getInputProps,
              handleSelect,
              setAddress,
              setNewSuggestions,
              newSuggestions,
              address,
            }}
          />
        )}
      </PlacesAutocomplete>
    </div>
  );
};

export default Auto;

const SmallAuto = ({
  loading,
  suggestions,
  getInputProps,
  handleSelect,
  setAddress,
  setNewSuggestions,
  newSuggestions,
  address,
}) => {
  console.log(`🚀 ~ file: Auto.jsx:93 ~ suggestions:`, suggestions);

  return (
    <>
      <Select
        className=""
        classNamePrefix="select"
        defaultValue={{ label: "Select...", value: address }}
        isClearable={true}
        isSearchable={true}
        name="color"
        options={suggestions}
        getOptionLabel={(option) => option.description}
        getOptionValue={(option) => option.placeId}
        autoFocus
        onInputChange={(value) => {
          getInputProps().onChange({ target: { value: value } });
        }}
        filterOption={false}
        onChange={(value) => {
          console.log(`🚀 ~ file: Auto.jsx:111 ~ value:`, value);
          handleSelect(value);
          setAddress(value);
        }}
      />
    </>
  );
};
