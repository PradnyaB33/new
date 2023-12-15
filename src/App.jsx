import { useLocation } from "react-router-dom";
import Route from "./Route";
import TestState from "./State/Function/Main";
import UseEffectState from "./State/UseEffect/UseEffectContext";
import UseState from "./State/UseState/UseContext";
import SwipeableTemporaryDrawer from "./components/app-layout/swipable-drawer";
import AppAlert from "./utils/AppAlert/AppAlert";
import AppLoader from "./utils/AppLoader/AppLoader";
import TopLoadingBar from "./utils/TopLoadingBar/TopLoadingBar";

function App() {
  const location = useLocation();

  return (
    <>
      <UseState>
        <TestState>
          <UseEffectState>
            <TopLoadingBar />
            <AppLoader />
            <AppAlert />
            {/* change as per requirement currently removed css : -  mt-[60px] */}
            <div
              className={`h-full ${
                location.pathname !== "/sign-in" && "mt-[60px]"
              } `}
            >
              <SwipeableTemporaryDrawer />
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
