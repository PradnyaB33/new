import useGetSinglePunchEntry from "../../hooks/QueryHook/Remote-Punch/components/get-sing-entry";
import MainMap from "./main-map";

const MapComponent = ({ punchObjectId, isLoaded }) => {
  const { data } = useGetSinglePunchEntry({ Id: punchObjectId });
  console.log(`🚀 ~ file: Map-Container.jsx:6 ~ data:`, data);
  // console.log(
  //   `🚀 ~ file: Map-Container.jsx:12 ~ data?.punchData:`,
  //   data?.punchData?.data?.length > 0
  // );

  return (
    // isLoaded &&
    data?.punchData?.data?.length > 0 && (
      <MainMap isLoaded={isLoaded} punchData={data?.punchData} />
    )
  );
};

export default MapComponent;
