import { Info } from "@mui/icons-material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import BasicButton from "../../../components/BasicButton";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import CreteLeaveTypeModal from "../../../components/Modal/LeaveTypeModal/create-leve-type-modal";
import ReusableModal from "../../../components/Modal/component";
import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";
import Setup from "../Setup";
import LeaveTypeEditBox from "./components/leave-type-layoutbox";
import SkeletonForLeaveTypes from "./components/skeleton-for-leavetype";
const LeaveTypes = ({ open, handleClose, id }) => {
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];
  const [confirmOpen, setConfirmOpen] = useState(false);
  const queryClient = useQueryClient();
  const params = useParams();
  const [openModal, setOpenModal] = useState(false);
  const onClose = () => {
    setOpenModal(false);
  };

  const { data: org } = useSubscriptionGet({
    organisationId: params.organisationId,
  });
  const { data, isLoading } = useQuery(
    "leaveTypes",
    async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/leave-types-details/get`,
        { organisationId: params.organisationId },
        config
      );
      return response.data.data;
    },
    {
      onSuccess: (newData) => {
        // Update the query cache with the new data
        queryClient.setQueryData("leaveTypes", newData);
      },
    }
  );

  const handleCreateLeave = () => {
    setConfirmOpen(true);
  };

  const handleCompOff = async () => {
    try {
      console.log("orgone", org?.organisation?.isCompOff);
      await axios.patch(
        `${process.env.REACT_APP_API}/route/organization/changeCompOff/${params.organisationId}`,
        {
          isCompOff: org?.organisation?.isCompOff ? false : true,
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      await queryClient.invalidateQueries("subscription");
      onClose();
      handleAlert(
        true,
        "success",
        "Comp off leave setting chnaged successfully"
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <BoxComponent sx={{ p: 0 }}>
      <section className="w-full">
        <Setup>
          <div className=" lg:w-[100%] w-full h-full    shadow-xl  rounded-sm">
            <BoxComponent>
              <div className="flex gap-2 items-center justify-between">
                <HeadingOneLineInfo
                  heading="Leaves"
                  info="Create multiple types of leaves which will applicable to all
              employees."
                />
                <div className="flex justify-end  gap-4 w-1/2">
                  <div
                    onClick={() => setOpenModal(true)}
                    className="flex items-center gap-2 border p-1 px-2  rounded-md cursor-pointer"
                  >
                    <h1
                      className="text-gray-500  font-bold tracking-tight "
                      htmlFor="input"
                    >
                      Enable Comp off leave
                    </h1>
                    <input
                      type="Checkbox"
                      className="checked:text-[#1414fe]"
                      checked={org?.organisation?.isCompOff}
                    />
                  </div>
                  <BasicButton title="Add Leave" onClick={handleCreateLeave} />
                </div>
              </div>
              {/* <div className="p-4  border-b-[.5px] flex   gap-3 w-full border-gray-300 justify-between">
              <div className="flex gap-3">
                <div className="mt-1">
                  <WorkOffOutlinedIcon />
                </div>
                <div>
                  <h1 className="!text-lg">Leaves</h1>
                  <p className="text-xs text-gray-600">
                    Create multiple types of leaves which will applicable to all
                    employees. Ex: Casual leaves, Sick leaves.
                  </p>
                </div>
              </div>
           
            </div> */}
              {data && data.length > 0 ? (
                <div className="overflow-y-scroll">
                  <table className="min-w-full bg-white text-left text-sm font-light">
                    <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                      <tr className="!font-medium shadow-lg">
                        <th scope="col" className="px-6 py-3 ">
                          Sr. No
                        </th>
                        <th scope="col" className="px-6 py-3 ">
                          Leave Name
                        </th>
                        <th scope="col" className="px-6 py-3 ">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 ">
                          Color
                        </th>
                        <th scope="col" className="px-6 py-3 ">
                          Count
                        </th>
                        <th scope="col" className="px-6 py-3 ">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <SkeletonForLeaveTypes />
                      ) : (
                        <>
                          {data &&
                            data.map((leaveType, index) => (
                              <LeaveTypeEditBox
                                key={index}
                                leaveType={leaveType}
                                index={index}
                              />
                            ))}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
                  <article className="flex items-center mb-1 text-red-500 gap-2">
                    <Info className="!text-2xl" />
                    <h1 className="text-lg font-semibold">Add Leave </h1>
                  </article>
                  <p>No leave found. Please add types of leave</p>
                </section>
              )}
            </BoxComponent>
          </div>
        </Setup>
        <CreteLeaveTypeModal
          open={confirmOpen}
          handleClose={() => {
            setConfirmOpen(false);
          }}
        />
        <ReusableModal
          heading={"Enable comp off leave"}
          open={openModal}
          onClose={onClose}
        >
          <div className="flex justify-end w-full gap-4">
            <BasicButton
              title="Cancle"
              onClick={onClose}
              variant="outlined"
              color={"danger"}
            />
            <BasicButton title="Submit" onClick={handleCompOff} />
          </div>
        </ReusableModal>
      </section>
    </BoxComponent>
  );
};

export default LeaveTypes;
