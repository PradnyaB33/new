import { CheckCircle, CorporateFare, West } from "@mui/icons-material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import useOrgList from "../../hooks/QueryHook/Orglist/hook";
import useAuthToken from "../../hooks/Token/useAuth";
const AssignOrg = () => {
  const [selected, setSelected] = useState(null);
  const [organizationId, setOrganizationId] = useState();
  const handleRadioChange = (index, item) => {
    setSelected(index);
    setOrganizationId(item);
  };

  const { handleAlert } = useContext(TestContext);

  const { data, isLoading } = useOrgList();
  console.log(`🚀 ~ data:`, data);
  const authToken = useAuthToken();
  const orgList = data?.organizations;
  const handleSubmit = async () => {
    try {
      const data = await axios.put(
        `${process.env.REACT_APP_API}/route/employee/assignOrgToSelf`,
        { organizationId },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      handleAlert(true, "success", "Organisation assigned successful");
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-50 h-screen">
      <header className="text-xl w-full pt-6 bg-white shadow-md   p-4">
        {/* <BackComponent /> */}
        <Link to={"/organizationList"}>
          <West className="mx-4 !text-xl" />
        </Link>
        Assign organisation to self
      </header>

      <section className="md:px-8 flex space-x-2 md:py-6">
        <article className="w-full rounded-md bg-white border">
          <div className=" w-full md:px-5 px-1 ">
            <div className="w-full mt-4">
              <h1 className="text-2xl tracking-tight">
                Assign organisation to self
              </h1>
              <p>
                This will helps an allows you to perform task related to
                employee fields such as leaves , shifts , payroll related task
              </p>
              <form className="flex-col gap-4 mt-6 flex items-center">
                {orgList?.map((item, index) => (
                  <label
                    key={index}
                    className={`inline-flex items-center space-x-2 cursor-pointer w-full border-[.5px] border-gray-300 p-4 py-3  rounded-lg ${
                      selected === index && "bg-blue-400 "
                    }`}
                  >
                    <input
                      type="radio"
                      className="hidden"
                      checked={selected === index}
                      onChange={() => handleRadioChange(index, item?._id)}
                    />
                    <span
                      className={`text-gray-700 space-x-2 ${
                        selected === index && "text-white"
                      }`}
                    >
                      {selected === index ? <CheckCircle /> : <CorporateFare />}{" "}
                      {item?.orgName}
                    </span>
                  </label>
                ))}
              </form>
              <div className="flex justify-end w-full">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-blue-500 text-end my-4 text-white p-2 px-4 rounded-md"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
};

export default AssignOrg;
