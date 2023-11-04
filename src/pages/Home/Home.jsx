import { Divider } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import TextCycler from "./components/cyclic-text";
import Org from "./components/org";
import Organisation from "./components/Organisation";
import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
const Home = () => {
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const redirect = useNavigate();
  useEffect(() => {
    const authToken = cookies["aeigs"];
    // if (!authToken) {
    //   // Redirect to the login page
    //   redirect("/sign-in");
    //   handleAlert(true, "warning", "Please login first.");
    // }
  }, [redirect, cookies, handleAlert]);
  const handleScroll = (e) => {
    console.log(e);
    // window.scrollLeft = 10;
    console.log("e", (e.target.parentElement.scrollLeft = -10));
  };

  const dotsresponsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1400 },
      items: 4,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1400, min: 1050 },
      items: 3,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 1050, min: 500 },
      items: 2,
      slidesToSlide: 1,
    },
  };

  console.log("Hii");

  const CustomRightArrow = ({ onClick, ...rest }) => {
    const {
      onMove,
      carouselState: { currentSlide, deviceType },
    } = rest;
    // onMove means if dragging or swiping in progress.
    return (
      <button
        className="p-2 rounded-full border-sky-600 font-bold bg-slate-300 text-sky-600 border absolute right-0"
        onClick={() => onClick()}
      >
        <EastIcon />
      </button>
    );
  };

  const CustomLeftArrow = ({ onClick, ...rest }) => {
    const {
      onMove,
      carouselState: { currentSlide, deviceType },
    } = rest;
    // onMove means if dragging or swiping in progress.
    return (
      <button
        className="p-2 rounded-full text-[2px] border-sky-600 font-bold bg-slate-300 text-sky-600 border absolute left-0"
        onClick={() => onClick()}
      >
        <WestIcon className="h-2 w-4 text-[5px]" />
      </button>
    );
  };

  return (
    <div className="p-8">
      <TextCycler />
      <Divider />
      {/* <Org /> */}

      <div className="w-full  mt-6">
        <Carousel
          swipeable={false}
          draggable={false}
          customRightArrow={<CustomRightArrow />}
          customLeftArrow={<CustomLeftArrow />}
          responsive={dotsresponsive}
        >
          {Array.from({ length: 10 }, (_, index) => (
            <div key={index}>
              <Organisation />
            </div>
          ))}
        </Carousel>
      </div>

      {/* <Org /> */}
    </div>
  );
};

export default Home;
