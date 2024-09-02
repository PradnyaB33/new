
import React, { useState, useCallback, useEffect } from 'react';
import { West } from '@mui/icons-material';
import { Avatar, Skeleton, TextField, Tooltip, IconButton, Button } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { Link } from 'react-router-dom';
import useOrgList from '../../hooks/QueryHook/Orglist/hook';
import Organisation from '../Home/components/Organisation';
import { debounce } from 'lodash';
import { motion } from 'framer-motion';
import 'aos/dist/aos.css'; // Import AOS styles
import AOS from 'aos';

const OrgList = () => {
  const { data, isLoading } = useOrgList();
  const [searchQuery, setSearchQuery] = useState('');

  
  const handleSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
    }, 300),
    []
  );
  console.log(useCallback);
  
  // Filter organizations based on search query
  const filteredOrganizations = data?.organizations?.filter((org) =>
    org.orgName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Clear search input field
  const clearSearch = () => {
    setSearchQuery('');
  };

  // Initialize AOS
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

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
        <Skeleton animation="wave" height={35} width="60%" style={{ marginBottom: 6 }} />
        <Skeleton animation="wave" height={30} width="80%" />
      </div>
      <div className="p-6 py-4 flex gap-4">
        <Skeleton variant="rounded" height={30} width="30%" />
        <Skeleton variant="rounded" height={30} width="50%" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
    {/* Header Section */}
    <header className="text-xl w-full pt-6 bg-white border-b p-4 flex items-center">
      <Link to="/">
        <West className="mx-4 !text-xl cursor-pointer hover:text-blue-500 transition-colors duration-300" />
      </Link>
      {/* <span>Organisation List</span> */}
    </header>

    {/* Search and Button Section */}
    <div className="px-8 mt-6 mb-4 w-full">
      <div className="flex md:justify-between items-start gap-4 flex-col md:flex-row">
        <div>
          <h1 className="md:text-2xl text-xl font-semibold">Organisations List</h1>
          <p className="text-gray-600">Select and Manage Your Organisation</p>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <TextField
            id="search-organizations"
            label="Search Organizations"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="bg-white"
              data-aos="fade-up"
            InputProps={{
              endAdornment: (
                <IconButton onClick={clearSearch} edge="end" color="inherit" aria-label="clear">
                  <ClearIcon />
                </IconButton>
              ),
            }}
            sx={{
              width: { xs: '80%', sm: '250px', md: '200px' },
              height: '40px', // Fixed height for all devices
              '& .MuiInputBase-root': {
                height: '90%', //
                },
              '& .MuiFormControl-root': {
                height: '90%',
              },
            }}
          />

          <Tooltip title="Assign Organisation">
            <Button
              component={Link}
              to="/assingOrganizationToSelf"
              variant="outlined"
              color="primary"
              className="ml-2"
              data-aos="fade-up"
            >
              Assign Organisation
            </Button>
          </Tooltip>

          <Tooltip title="Add New Organisation">
            <Button
              component={Link}
              to="/add-organisation"
              variant="outlined"
              color="primary"
              className="ml-2"
              data-aos="fade-up"
            >
              Add Organisation
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>

      {/* Content Section */} 
      <div className="flex flex-wrap lg:justify-start md:justify-center  xs:justify-center gap-x-6 gap-y-4 px-4 md:px-8">
        {isLoading ? (
          // Display skeleton loaders while data is loading
          Array.from({ length: 3 }).map((_, index) => (
            <motion.div
              key={index}
              className="flex-grow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              data-aos="fade-up"
            >
              <SkeletonLoader />
            </motion.div>
          ))
        ) : (
        
          filteredOrganizations?.length === 0 ? (
            <p className="text-gray-600 text-lg" data-aos="fade-up">
              No Organisations Found
            </p>
          ) : (
            filteredOrganizations.map((item) => (
              <motion.div
                key={item._id}
                className="h-max max-w-xs sm:max-w-sm md:max-w-md py-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                data-aos="fade-up"
              >
           <div>
           <Organisation item={item} />
           </div>
     
              </motion.div>
            ))
          )
        )}
      </div>
      <br /> <br />
    </div>
  );
};

export default OrgList;
