import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BackComponent = () => {
    const navigate = useNavigate();
  
    const goBack = () => {
      navigate(-1);
    };
  
    return (
      <div className='mb-5 relative top-5 w-full cursor-pointer'>
        <div style={{border:"1px solid black", borderRadius:"50%"}} onClick={goBack}  className='mx-5 w-[50px] h-[50px] flex items-center justify-center bg-white'>
        <ArrowBackIcon />
        </div>
      </div>
    );
  };

export default BackComponent;