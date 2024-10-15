import {
  Avatar,
  Button,
  Skeleton,
  Box,
  Grid
} from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css";
// import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useOrgList from "../../hooks/QueryHook/Orglist/hook";
import Organisation from "../Home/components/Organisation";
import { useDrawer } from "../../components/app-layout/components/Drawer";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BoxComponent from "../../components/BoxComponent/BoxComponent";

const OrgList = () => {
  const { open } = useDrawer();
  const { data, isLoading, refetch } = useOrgList();
  const [searchQuery, setSearchQuery] = useState("");
  console.log("setSearchQuery", setSearchQuery);

  // Handle search query with debouncing to reduce the number of renders
  // const handleSearch = useCallback(
  //   debounce((query) => {
  //     setSearchQuery(query);
  //   }, 300),
  //   []
  // );

  // Filter organizations based on search query
  const filteredOrganizations = data?.organizations?.filter((org) =>
    org.orgName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Clear search input field
  // const clearSearch = () => {
  //   setSearchQuery("");
  // };

  // Initialize AOS for animations
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  // Refetch organizations when component mounts or when refetch is called
  useEffect(() => {
    refetch(); // Refetch data when component mounts
  }, [refetch]);

  // Skeleton loader animation
  const SkeletonLoader = () => (
    <div
      data-aos="fade-up"
      className="border-b-[3px] block min-w-[21rem] rounded-lg bg-white shadow-md dark:bg-neutral-200"
    >
      <div className="border-b-2 flex items-center justify-between border-[#0000002d] px-6 py-3 text-black">
        <Avatar variant="rounded" sx={{ height: 35, width: 35 }} />
      </div>
      <div className="p-6 pt-6 pb-4">
        <Skeleton
          animation="wave"
          height={35}
          width="60%"
          style={{ marginBottom: 6 }}
        />
        <Skeleton animation="wave" height={30} width="80%" />
      </div>
      <div className="p-6 py-4 flex gap-4">
        <Skeleton variant="rounded" height={30} width="30%" />
        <Skeleton variant="rounded" height={30} width="50%" />
      </div>
    </div>
  );

  return (
    <>
      <BoxComponent className="w-full">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", mb: "2%" }}>
          <HeadingOneLineInfo heading="Organisations" info="Select and Manage Your Organisation" />
          <Box>
            <Button
              component={Link}
              to="/add-organisation"
              variant="contained"
              className="m-2 md:w-auto w-full text-sm md:text-base bg-[#1514FE]"
              data-aos="fade-up"
            >
              Add Organisation
            </Button>
          </Box>
        </Box>
        <Grid container spacing={4}>
          {isLoading ? (
            // Render skeletons while loading
            Array.from(new Array(6)).map((_, index) => (
              <Grid item lg={4} md={4} sm={4} xs={12} key={index}>
                <SkeletonLoader />
              </Grid>
            ))
          ) : (
            filteredOrganizations?.map((item, index) => (
              <Grid
                item
                lg={open ? 4 : 3}
                sm={open ? 12 : 6}
                md={open ? 6 : 4}
                xs={12}
                key={index}
              >
                <Organisation item={item} />
              </Grid>
            ))
          )}
        </Grid>

      </BoxComponent >
    </>
  );
};

export default OrgList;
