import { Info } from "@mui/icons-material";
import { Skeleton } from "@mui/material";
import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import Setup from "../../SetUpOrganization/Setup";
import AddShiftModal from "./components/shift-add-model";
import ShiftRow from "./components/shift-row";
import useShiftQuery from "./hook/useShiftQuery";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BasicButton from "../../../components/BasicButton";
const Shifts = () => {
  const [open, setOpen] = React.useState(false);
  const { data, isLoading, deleteMutation, addMutate, editMutate } =
    useShiftQuery();

  return (
    <>
      <BoxComponent sx={{ p: 0 }}>
        <section className="bg-gray-50 w-full">
          <Setup>
            <BoxComponent>
              <div className="flex justify-between items-center">
                <HeadingOneLineInfo
                  heading="Shifts"
                  info=" Create multiple types of shifts applicable to all employees.
                        Ex: morning, afternoon."
                />
                <BasicButton className="h-[30px]" title={"Add Shift"} onClick={() => setOpen(true)} />
                {/* <Button
                  className="!font-semibold !bg-sky-500 flex items-center gap-2"
                  onClick={() => setOpen(true)}
                  variant="contained"
                >
                  <Add className="!text-md" />
                  Add Shift
                </Button> */}
              </div>
              <article className=" bg-white  w-full  h-max shadow-md rounded-sm border  items-center">


                <article className="h-max">
                  <div className="flex h-full flex-col">
                    <div className=" h-full">
                      <div className="min-w-full">
                        {isLoading ? (
                          <div className="space-y-2">
                            <Skeleton
                              variant="rounded"
                              className="!w-full !h-[5vh]"
                            />
                            <Skeleton
                              variant="rounded"
                              className="!w-full !h-[5vh]"
                            />
                          </div>
                        ) : data?.shifts?.length > 0 ? (
                          <div className="overflow-auto !p-0  border-[.5px] border-gray-200">
                            <table className="min-w-full bg-white  text-left text-sm font-light">
                              <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                                <tr className="!font-medium shadow-lg">
                                  <th scope="col" className="px-6 py-3 ">
                                    Sr. No
                                  </th>
                                  <th scope="col" className="px-6 py-3 ">
                                    Shift Name
                                  </th>
                                  <th scope="col" className="px-6 py-3 ">
                                    Working From
                                  </th>
                                  <th scope="col" className="px-6 py-3 ">
                                    Shift Start Time
                                  </th>
                                  <th scope="col" className="px-6 py-3 ">
                                    Shift End Time
                                  </th>
                                  <th scope="col" className="px-6 py-3 ">
                                    Allowance
                                  </th>
                                  <th scope="col" className="px-6 py-3 ">
                                    Week Days
                                  </th>
                                  <th scope="col" className="px-6 py-3 ">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {data?.shifts &&
                                  data?.shifts?.map((items, index) => (
                                    <ShiftRow
                                      key={index}
                                      index={index}
                                      items={items}
                                      editMutate={editMutate}
                                      deleteMutation={deleteMutation}
                                    />
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
                            <article className="flex items-center mb-1 text-red-500 gap-2">
                              <Info className="text-2xl" />
                              <h1 className="text-lg font-semibold">Add Shift</h1>
                            </article>
                            <p>No shifts found. Please add type of shift.</p>
                          </section>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              </article>
            </BoxComponent>
          </Setup>
        </section>

        <AddShiftModal
          addMutate={addMutate}
          open={open}
          handleClose={() => setOpen(false)}
        />
      </BoxComponent>
    </>
  );
};

export default Shifts;
