import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthInputField from "../../../components/InputFileds/AuthInputFiled";
import axios from "axios";
import { toast } from "react-toastify";
import { IconButton } from "@mui/material";
import { West } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import UserProfile from "../../../hooks/UserData/useUser";
import useAuthToken from "../../../hooks/Token/useAuth";

const AddCoupon = () => {
  const navigate = useNavigate();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const authToken = useAuthToken();
  const vendorId = user._id;

  const initialValues = {
    name: "",
    code: "",
    discountType: "percentage", // Default value
    discountValue: "",
    expirationDate: "",
    termsAndConditions: "",
    description: "",
  };

  const CouponSchema = z.object({
    name: z.string().min(1, { message: "Coupon name is required" }),
    code: z.string().min(1, { message: "Coupon code is required" }),
    discountType:z.object(
        {
          label: z.string(),
          value: z.string(),
        },
        "selected value"
      ),
    discountValue: z.string().min(1, { message: "Discount value is required" }),
    expirationDate: z.string().min(1, { message: "Expiration date is required" }),
    termsAndConditions: z.string().optional(),
    description: z.string().optional(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
    resolver: zodResolver(CouponSchema),
  });

  const onSubmit = async (data) => {
    console.log("data",data?.discountType?.value);
    
    const couponData = {
      ...data,
      vendorId,
      // Ensure discountType is a string
      discountType: data?.discountType?.value, 
      
    };

    console.log(couponData); // Log to verify the data before submission
    try {
      await axios.post(`${process.env.REACT_APP_API}/route/coupon/add`, couponData, {
        headers: { Authorization: authToken },
      });
      toast.success("Coupon code added successfully");
      navigate(-1); // Navigate back after success
    } catch (error) {
      console.error("Error adding coupon:", error);
      toast.error("Failed to add coupon. Please try again.");
    }
  };

  return (
    <div className="w-full mt-1">
      <header className="text-xl w-full pt-6 flex flex-col md:flex-row items-start md:items-center gap-2 bg-white shadow-md p-4">
        <div className="flex-shrink-0">
          <IconButton onClick={() => navigate(-1)}>
            <West className="text-xl" />
          </IconButton>
        </div>
        <div className="flex flex-col md:flex-row justify-between w-full md:ml-4">
          <div className="mb-2 md:mb-0 md:mr-4">
            <h1 className="text-xl font-bold">Add Coupon</h1>
            <p className="text-sm text-gray-600">Create a coupon for your vendors here.</p>
          </div>
        </div>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md mt-6 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AuthInputField
            name="name"
            control={control}
            type="text"
            placeholder="Coupon Name"
            label="Coupon Name *"
            errors={errors}
          />
          <AuthInputField
            name="code"
            control={control}
            type="text"
            placeholder="Coupon Code"
            label="Coupon Code *"
            errors={errors}
          />
        </div>

        <AuthInputField
          name="discountType"
          control={control}
          type="select"
          options={[
            { label: "Percentage", value: "percentage" },
            { label: "Fixed Amount", value: "fixed" },
            { label: "Free Shipping", value: "free_shipping" },
          ]}
          label="Discount Type *"
          errors={errors}
        />

        <AuthInputField
          name="discountValue"
          control={control}
          type="number"
          placeholder="Discount Value"
          label="Discount Value *"
          errors={errors}
        />

        <AuthInputField
          name="expirationDate"
          control={control}
          type="date"
          label="Expiration Date *"
          errors={errors}
        />

        <AuthInputField
          name="termsAndConditions"
          control={control}
          type="textarea"
          placeholder="Terms and Conditions"
          label="Terms and Conditions"
          errors={errors}
        />

        <AuthInputField
          name="description"
          control={control}
          type="textarea"
          placeholder="Description"
          label="Description"
          errors={errors}
        />

        <div className="w-full">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCoupon;
