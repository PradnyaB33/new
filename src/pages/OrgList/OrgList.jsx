import {
  Avatar,
  Skeleton,
  Grid,
} from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import useOrgList from "../../hooks/QueryHook/Orglist/hook";
import Organisation from "../Home/components/Organisation";
import { useDrawer } from "../../components/app-layout/components/Drawer";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import BasicButton from "../../components/BasicButton";
import { Search } from "@mui/icons-material";

const OrgList = () => {
  const { open } = useDrawer();
  const { data, isLoading, refetch } = useOrgList();
  const [searchQuery, setSearchQuery] = useState("");

  // Handle search query with debouncing to reduce the number of renders
  const handleSearch = debounce((query) => {
    setSearchQuery(query);
  }, 300);

  // Filter organizations based on search query
  const filteredOrganizations = data?.organizations?.filter((org) =>
    org.orgName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Initialize AOS for animations
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  // Refetch organizations when component mounts or when refetch is called
  useEffect(() => {
    refetch(); // Refetch data when component mounts
  }, [refetch]);

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      handleSearch.cancel(); // Cancel debounce on unmount to avoid memory leaks
    };
  }, [handleSearch]);

  // Skeleton loader animation
  const SkeletonLoader = () => (
    <div className="border-b-[3px] block min-w-[21rem] rounded-lg bg-white shadow-md dark:bg-neutral-200">
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
      <BoxComponent>
        <HeadingOneLineInfo
          heading="Organisation List"
          info="Select and Manage Your Organisation"
        />
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Grid item xs={12} sm={6} md={6}>
            <div
              className={` 
                md:w-[60%] mr-2 outline-none border-gray-200 border-[0.5px] flex rounded-md items-center px-2 bg-white py-3 md:py-[6px]
              `}
            >
              <Search className="text-gray-700 md:text-lg !text-[1em]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search Organisation"
                className="border-none bg-white w-full outline-none px-2"
                formNoValidate
              />
            </div>
          </Grid>

          {/* Add Organisation Button */}
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <BasicButton
              title={"Add Organisation"}
              component="link"
              to={"/add-organisation"}
            />
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          {isLoading ? (
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
      </BoxComponent>
    </>
  );
};


export default OrgList;
