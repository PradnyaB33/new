import { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import Route from "./Route";
import TestState from "./State/Function/Main";
import UseEffectState from "./State/UseEffect/UseEffectContext";
import UseState from "./State/UseState/UseContext";
import BackComponent from "./components/BackComponent/BackComponent";
import SwipeableTemporaryDrawer from "./components/app-layout/swipable-drawer";
import AppAlert from "./utils/AppAlert/AppAlert";
import AppLoader from "./utils/AppLoader/AppLoader";
import TopLoadingBar from "./utils/TopLoadingBar/TopLoadingBar";

function App() {
  const location = useLocation();
  const isNavEnabled = ["/sign-in", "/sign-up", "/terms-and-conditions"];

  return (
    <>
      <UseState>
        <TestState>
          <UseEffectState>
            <TopLoadingBar />
            <AppLoader />
            <AppAlert />

            <div
              className={`h-full ${
                !isNavEnabled.some((value) => {
                  return location.pathname.includes(value);
                }) && "mt-[60px]"
              } `}
            >
              <SwipeableTemporaryDrawer />
              <BackComponent />
              <Toaster />

              <div style={{ height: "100%", width: "100%" }}>
                <Route />
              </div>
            </div>
          </UseEffectState>
        </TestState>
      </UseState>
    </>
  );
}

export default App;
