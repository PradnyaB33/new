import { ManageAccountsOutlined } from "@mui/icons-material";
import React from "react";
import Setup from "../Setup";

const Subscription = () => {
  // const { cookies } = useContext(UseContext);
  // const authToken = cookies["aegis"];
  // const queryClient = useQueryClient();

  // const handleClickOpen = (scrollType) => () => {
  //   setOpen(true);
  //   setScroll(scrollType);
  // };

  // Get Query
  // const { data: empList, isLoading } = useQuery(
  //   ["empTypes", organisationId],
  //   async () => {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_API}/route/employment-types-organisation/${organisationId}`,
  //       {
  //         headers: {
  //           Authorization: authToken,
  //         },
  //       }
  //     );
  //     return response.data;
  //   }
  // );

  // const deleteMutation = useMutation(
  //   (id) =>
  //     axios.delete(
  //       `${process.env.REACT_APP_API}/route/employment-types/${id}`,
  //       {
  //         headers: {
  //           Authorization: authToken,
  //         },
  //       }
  //     ),
  //   {
  //     onSuccess: () => {
  //       // Invalidate and refetch the data after successful deletion
  //       queryClient.invalidateQueries("empTypes");
  //       handleAlert(true, "success", "Employeement types deleted succesfully");
  //     },
  //   }
  // );

  return (
    <>
      <section className="bg-gray-50 min-h-screen w-full">
        <Setup>
          <article className="SetupSection bg-white w-full md:w-[80%]  h-max shadow-md rounded-sm border  items-center">
            <div className="p-4  border-b-[.5px] flex items-center justify-between  gap-3 w-full border-gray-300">
              <div className="flex items-center  gap-3 ">
                <div className="rounded-full bg-sky-500 h-[30px] w-[30px] flex items-center justify-center">
                  <ManageAccountsOutlined className="!text-lg text-white" />
                </div>
                <h1 className="!text-lg tracking-wide">
                  Create Employment Types
                </h1>
              </div>
            </div>
            <div>subscription</div>
          </article>
        </Setup>
      </section>
    </>
  );
};

export default Subscription;
