import { CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import useVendorState from "../../../hooks/Vendor-Onboarding/useVendorState";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";

const Page3 = ({ prevStep }) => {
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const creatorId = user._id;
  const { handleAlert } = useContext(TestContext);
  const authToken = useAuthToken();
  const { organisationId } = useParams();

  const {
    first_name,
    last_name,
    email,
    phone_number,
    mgrempid,
    address,
    citizenship,
    adhar_card_number,
    pan_card_number,
    gender,
    password,
    bank_account_no,
    date_of_birth,
    vendorId,
    payment_info,
    companyemail,
    companyname,
    selectedFrequency,
    data,
    emptyState,
    pwd,
    document,
    uanNo,
    latitude,
    longitude,

    esicNo,
  } = useVendorState();

  console.log("documentpage3==", document);

  const uploadVendorDocument = async (file) => {
    const {
      data: { url },
    } = await axios.get(
      `${process.env.REACT_APP_API}/route/s3createFile/VendorDocument`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      }
    );

    await axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    return {
      name: file.name, // Return the file name
      url: url.split("?")[0], // Return the URL without query parameters
    };
  };

  const handleSubmit = useMutation(
    async () => {
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => value !== null)
      );

      const userData = {
        first_name,
        last_name,
        email,
        password,
        phone_number,
        address,
        citizenship,
        adhar_card_number,
        mgrempid: mgrempid?.value,
        pan_card_number,
        gender,
        bank_account_no,
        date_of_birth,
        vendorId,
        companyname,
        selectedFrequency,
        companyemail,
        payment_info,
        pwd,
        uanNo,
        esicNo,
        ...filteredData,
        organizationId: organisationId,
        creatorId,
        latitude,
        longitude,
      };

      const documentArray = Array.isArray(document.documents)
        ? document.documents
        : [];

      const documentUrls = Array.isArray(documentArray)
        ? await Promise.allSettled(
            documentArray.map((file) =>
              uploadVendorDocument(file?.uploadedFile)
            )
          )
        : [];

      // Filter successful uploads and map them to an array of objects
      const successfulUploads = documentUrls
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

      // Combine the URLs with userData
      const updatedData = {
        ...userData,
        documents: successfulUploads, // Store the URLs along with their names
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/vendor/addvendor`,
        updatedData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      return response;
    },
    {
      onSuccess: (response) => {
        toast.success("Vendor updated successfully");
        emptyState();
        // You can navigate to another page if necessary
      },
      onError: (error) => {
        handleAlert(
          "true",
          "error",
          error.response?.data.message ?? "Something went wrong"
        );
      },
    }
  );

  return (
    <>
      {handleSubmit.isLoading && (
        <div className="flex items-center justify-center fixed top-0 bottom-0 right-0 left-0  bg-black/20">
          <CircularProgress />
        </div>
      )}

      <div className="w-full mt-4">
        <h1 className="text-2xl mb-2 font-bold">Confirm Details</h1>
        <>
          <div className="md:p-3 py-1 ">
            <h1 className=" text-lg bg-gray-200 px-4 py-2 w-full  my-2">
              Personal Details
            </h1>
            <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ">
              <div className=" p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 w-full text-sm">Full Name</h1>
                <p className="w-full">
                  {first_name} {last_name}
                </p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">Personal Email</h1>
                <p className="">{email}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">Contact</h1>
                <p className="">{phone_number}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              <div className=" p-2 w-[30%] rounded-sm w">
                <h1 className="text-gray-500 text-sm">Gender</h1>
                <p className="">{gender}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">Date Of Birth</h1>
                <p className="">{date_of_birth}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">
                  Current Address
                </h1>
                <p className="">{address}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:!grid-cols-2 md:!grid-cols-3 justify-between">
              <div className=" p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">Aadhar No</h1>
                <p className="">{adhar_card_number}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">PAN card</h1>
                <p className="">{pan_card_number}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm">
                <h1 className="text-gray-500 text-sm">Citizenship Status</h1>
                <p className="">{citizenship}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:!grid-cols-2 md:!grid-cols-3 justify-between">
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">Bank Account</h1>
                <p className="">{bank_account_no}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">UAN Number</h1>
                <p className="">{uanNo}</p>
              </div>
              <div className="p-2 w-[30%] rounded-sm ">
                <h1 className="text-gray-500 text-sm">ESIC Number</h1>
                <p className="">{esicNo}</p>
              </div>
            </div>

            <h1 className=" text-lg bg-gray-200 px-4 py-2 w-full  my-2">
              Company Details
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-between">
              <div className=" p-2 rounded-sm w-full">
                <h1 className="text-gray-500 text-sm">Vendor No</h1>
                <p className="">{vendorId}</p>
              </div>

              <div className="p-2 rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">
                  Selected Frequency For Uploading Menu
                </h1>
                {/* <p className="">{selectedFrequency.value}</p> */}
                {selectedFrequency && selectedFrequency.value
                  ? selectedFrequency.value
                  : "No frequency selected"}
              </div>
              <div className="p-2 rounded-sm w-full">
                <h1 className="text-gray-500 text-sm">Company Name</h1>
                <p className="">{companyname}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-between">
              <div className="p-2 rounded-sm">
                <h1 className="text-gray-500 text-sm w-full">
                  Selected Documents
                </h1>
                {document &&
                document.documents &&
                document.documents.length > 0 ? (
                  document.documents.map((doc, index) => (
                    <p key={index}>{doc.selectedValue}</p>
                  ))
                ) : (
                  <p>No documents selected</p>
                )}
              </div>

              <div className=" p-2 rounded-sm ">
                <h1 className="text-gray-500 text-sm w-full">
                  Pyement Information (UPI ID)
                </h1>
                <p className="">{payment_info}</p>
              </div>
            </div>

            {data &&
              typeof data === "object" &&
              Object.entries(data).length > 0 && (
                <>
                  <h1 className="text-lg bg-gray-200 px-4 py-2 w-full my-2">
                    Additional Details
                  </h1>
                  <div className="grid grid-cols-3 justify-between">
                    {Object.entries(data)
                      .filter(([key]) => key !== "organizationId")
                      .map(([key, value]) => (
                        <div className="p-2 rounded-sm" key={key}>
                          <h1 className="text-gray-500 text-sm">{key}</h1>
                          <p className="">{value ? value : "-"}</p>
                        </div>
                      ))}
                  </div>
                </>
              )}
          </div>
          <div className="flex items-end w-full justify-between">
            <button
              type="button"
              onClick={() => {
                prevStep();
              }}
              className="!w-max flex group justify-center px-6  gap-2 items-center rounded-md py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
            >
              Prev
            </button>
            <button
              onClick={() => handleSubmit.mutate()}
              className="!w-max flex group justify-center px-6  gap-2 items-center rounded-md py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
            >
              Submit
            </button>
          </div>
        </>
      </div>
    </>
  );
};

export default Page3;
