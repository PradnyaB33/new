// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@mui/material";
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import ReusableModal from "../../../components/Modal/component";
// import AuthInputField from "../../../components/InputFileds/AuthInputFiled";
// import axios from "axios";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import UserProfile from "../../../hooks/UserData/useUser";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { useParams } from 'react-router-dom';
// // Define Zod schema for form validation
// const formSchema = z.object({
//   name: z.string().min(1, "Item name is required."),
//   cuisineType: z.string().min(1, "Cuisine type is required."),
//   description: z.string().optional(),
//   price: z.string().min(1, "Price must be a positive number."),
//   ingredients: z.string().optional(),
//   category: z.string().optional(),
//   isVeg:z.string().optional(),
//   available:z.string().optional(),

//   preparationTime: z.string().optional(),
//   customizations: z.string().optional(),
//   maxQuantity: z
//     .string()
//     .regex(/^\d+$/, "Maximum quantity must be a non-negative integer."),
//   // available: z.boolean().optional(),
//   image: z.instanceof(File).optional(),
// });

// const Addmenu = () => {
//   const [showModal, setShowModal] = useState(true);
//   const { getCurrentUser } = UserProfile();
//   const user = getCurrentUser();
//   const authToken = useAuthToken();
//   const navigate = useNavigate();
//   const { empId,orgId } = useParams();


//   const { control, formState, handleSubmit, reset, setValue } = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       cuisineType: "",
//       description: "",
//       isVeg: true, // Default to true for Veg
//       price: "",
//       ingredients: "",
//       category: "",
//       preparationTime: "",
//       customizations: "",
//       maxQuantity: "",
      
//       available: false, // Default to false
//       image: null,
//     },
//   });

//   const { errors, isDirty } = formState;

//   console.log("errors",errors);
//   const uploadVendorDocument = async (file) => {
   
//     const {
//       data: { url },
//     } = await axios.get(
//       `${process.env.REACT_APP_API}/route/s3createFile/${user.vendorId}`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: authToken,
//         },
//       }
//     );

//     await axios.put(url, file, {
//       headers: {
//         "Content-Type": file.type,
//       },
//     });

//     return url.split("?")[0]; // Return URL without query parameters
//   };

//   const onSubmit = async (data) => {
//      setValue("isVeg" , Boolean(data?.isVeg))   
//      console.log("user",user._id)
    
//     if (data.image && data.image.size > 1 * 1024 * 1024) {
//       alert("Image size must not exceed 1MB.");
//       return;
//     }

//     let imageUrl = null;
//     if (data.image) {
//       try {
//         imageUrl = await uploadVendorDocument(data.image);
//         console.log("Image uploaded, URL:", imageUrl); // Debugging line
//       } catch (error) {
//         console.error("Error uploading image:", error);
//         alert("Failed to upload image. Please try again.");
//         return;
//       }
//     }

//     const updatedData = {
//       ...data,
//       image: imageUrl,
//       userid:user._id
//     };

//     try {
//       await axios.post(
//         `${process.env.REACT_APP_API}/route/menu/add`,
//         updatedData,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       toast.success("Menu item added successfully");
//       reset();
//       setShowModal(false);
//       navigate(`/vendor/${orgId}/${empId}/list-menu`);
      
//     } catch (error) {
//       console.error("Error adding menu item:", error);
//       alert("Failed to add menu item. Please try again.");
//     }
//   };

//   const handleClose = () => {
//     setShowModal(false);
//   };

//   return (
//     <div className="p-4">
//       <ReusableModal
//         heading="Upload Menu Item"
//         open={showModal}
//         onClose={handleClose}
//       >
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="flex flex-col space-y-6 bg-white p-6 rounded-lg shadow-lg"
//           noValidate
//           autoComplete="off"
//         >
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">
//             Add New Menu Item
//           </h2>

//           <AuthInputField
//             name="name"
//             control={control}
//             label="Item Name *"
//             errors={errors}
//             placeholder="e.g. Pizza"
//           />

//           <AuthInputField
//             name="cuisineType"
//             control={control}
//             label="Cuisine Type *"
//             errors={errors}
//             placeholder="e.g. Italian"
//           />

//           <AuthInputField
//             name="description"
//             control={control}
//             label="Description"
//             errors={errors}
//             placeholder="Describe the item..."
//           />

//           <AuthInputField
//             name="price"
//             control={control}
//             label="Price *"
//             type="number"
//             errors={errors}
//             placeholder="e.g. 10.99"
//           />

//           <AuthInputField
//             name="ingredients"
//             control={control}
//             label="Ingredients"
//             as="textarea"
//             errors={errors}
//             placeholder="List ingredients here..."
//             rows={3}
//           />

//           <AuthInputField
//             name="category"
//             control={control}
//             label="Course Type"
//             errors={errors}
//             placeholder="e.g. Main Course"
//           />

//           <AuthInputField
//             name="preparationTime"
//             control={control}
//             label="Preparation Time"
//             errors={errors}
//             placeholder="e.g. 30 minutes"
//           />

//           <AuthInputField
//             name="customizations"
//             control={control}
//             label="Customizations"
//             errors={errors}
//             placeholder="e.g. Extra toppings"
//           />

//           <AuthInputField
//             name="maxQuantity"
//             control={control}
//             label="Maximum Quantity"
//             type="number"
//             errors={errors}
//             placeholder="e.g. 100"
//           />

//           <div>
//             <label className="block text-gray-700">Veg/Non-Veg *</label>
//             <div className="flex space-x-4 mt-2">
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   value={true}
//                   {...control.register("isVeg")}
//                   className="mr-2"
//                 />
//                 Veg
//               </label>
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   value={false}
//                   {...control.register("isVeg")}
//                   className="mr-2"
//                 />
//                 Non-Veg
//               </label>
//               {errors.isVeg && (
//                 <p className="text-red-500 text-sm">{errors.isVeg.message}</p>
//               )}
//             </div>
//           </div>

//           <div>
//             <label className="block text-gray-700">Available *</label>
//             <div className="flex space-x-4 mt-2">
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   value={true}
//                   {...control.register("available")}
//                   className="mr-2"
//                 />
//                 Yes
//               </label>
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   value={false}
//                   {...control.register("available")}
//                   className="mr-2"
//                 />
//                 No
//               </label>
//             </div>
//           </div>

//           <div>
//             <label className="block text-gray-700">
//               Upload Image (thumbnail size)
//             </label>
//             <input
//               type="file"
//               accept="image/jpeg, image/png"
//               onChange={(e) => {
//                 if (e.target.files.length > 0) {
//                   const file = e.target.files[0];
//                   setValue("image", file);
//                 }
//               }}
//               className="mt-1 border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-green-500"
//             />
//             {errors.image && (
//               <p className="text-red-500 text-sm">{errors.image.message}</p>
//             )}
//           </div>

//           <div className="flex justify-end mt-6">
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               disabled={!isDirty}
//             >
//               Submit
//             </Button>
//           </div>
//         </form>
//       </ReusableModal>
//     </div>
//   );
// };

// export default Addmenu;

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mui/material";
import React, {  useState  } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ReusableModal from "../../../components/Modal/component";
import AuthInputField from "../../../components/InputFileds/AuthInputFiled";
import axios from "axios";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';

// Define Zod schema for form validation
const formSchema = z.object({
  name: z.string().min(1, "Item name is required."),
  cuisineType: z.string().min(1, "Cuisine type is required."),
  description: z.string().optional(),
  price: z.string().min(1, "Price must be a positive number."),
  ingredients: z.string().optional(),
  category: z.string().min(1, "category is required."),
  isVeg: z.string().optional(),
  available: z.string().optional(),
  preparationTime: z.string().optional(),
  customizations: z.string().optional(),
  maxQuantity: z
    .string()
    .regex(/^\d+$/, "Maximum quantity must be a non-negative integer."),
  image: z.instanceof(File).optional(),
});

const Addmenu = () => {
  const [showModal, setShowModal] = useState(true);
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const authToken = useAuthToken();
  const navigate = useNavigate();
  const { empId, orgId } = useParams();


  // useEffect(() => {
  //   setShowModal(true); // Call to show the modal when the component mounts
  // }, []); // Empty dependency array means this runs once when the component mounts

  const { control, formState, handleSubmit, reset, setValue } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      cuisineType: "",
      description: "",
      isVeg: true, // Default to true for Veg
      price: "",
      ingredients: "",
      category: "",
      preparationTime: "",
      customizations: "",
      maxQuantity: "",
      available: false, // Default to false
      image: null,
    },
  });

  const { errors, isDirty } = formState;

  const uploadVendorDocument = async (file) => {
    const {
      data: { url },
    } = await axios.get(
      `${process.env.REACT_APP_API}/route/s3createFile/${user.vendorId}`,
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

    return url.split("?")[0]; // Return URL without query parameters
  };

  const onSubmit = async (data) => {
    setValue("isVeg", Boolean(data?.isVeg));

    if (data.image && data.image.size > 1 * 1024 * 1024) {
      alert("Image size must not exceed 1MB.");
      return;
    }

    let imageUrl = null;
    if (data.image) {
      try {
        imageUrl = await uploadVendorDocument(data.image);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
        return;
      }
    }

    const updatedData = {
      ...data,
      image: imageUrl,
      userid: user._id,
    };

    try {
      await axios.post(
        `${process.env.REACT_APP_API}/route/menu/add`,
        updatedData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      toast.success("Menu item added successfully");
      reset();
      setShowModal(false);
      navigate(`/vendor/${orgId}/${empId}/list-menu`);
    } catch (error) {
      console.error("Error adding menu item:", error);
      alert("Failed to add menu item. Please try again.");
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };



  return (
    <div className="p-4">
      <ReusableModal heading="Upload Menu Item" open={showModal} onClose={handleClose}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4 bg-white p-6 rounded-lg shadow-lg"
          noValidate
          autoComplete="off"
        >
          <AuthInputField
            name="name"
            control={control}
            label="Item Name *"
            errors={errors}
            placeholder="e.g. Pizza"
          />

          <AuthInputField
            name="cuisineType"
            control={control}
            label="Cuisine Type *"
            errors={errors}
            placeholder="e.g. Italian"
          />

          <AuthInputField
            name="description"
            control={control}
            label="Description"
            errors={errors}
            placeholder="Describe the item..."
          />

          <AuthInputField
            name="price"
            control={control}
            label="Price *"
            type="number"
            errors={errors}
            placeholder="e.g. 10.99"
          />

          <AuthInputField
            name="ingredients"
            control={control}
            label="Ingredients"
            as="textarea"
            errors={errors}
            placeholder="List ingredients here..."
            rows={3}
          />

          <AuthInputField
            name="category"
            control={control}
            label="Course Type *"
            errors={errors}
            placeholder="e.g. Main Course"
          />

          <AuthInputField
            name="preparationTime"
            control={control}
            label="Preparation Time"
            errors={errors}
            placeholder="e.g. 30 minutes"
          />

          <AuthInputField
            name="customizations"
            control={control}
            label="Customizations"
            errors={errors}
            placeholder="e.g. Extra toppings"
          />

          <AuthInputField
            name="maxQuantity"
            control={control}
            label="Maximum Quantity *"
            type="number"
            errors={errors}
            placeholder="e.g. 100"
          />

          <div>
            <label className="block text-gray-700">Veg/Non-Veg *</label>
            <div className="flex space-x-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value={true}
                  {...control.register("isVeg")}
                  className="mr-2"
                />
                Veg
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value={false}
                  {...control.register("isVeg")}
                  className="mr-2"
                />
                Non-Veg
              </label>
              {errors.isVeg && (
                <p className="text-red-500 text-sm">{errors.isVeg.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-gray-700">Available *</label>
            <div className="flex space-x-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value={true}
                  {...control.register("available")}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value={false}
                  {...control.register("available")}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>

          <div>
            <label className="block text-gray-700">
              Upload Image (thumbnail size) *
            </label>
            <input
              type="file"
              accept="image/jpeg, image/png"
              onChange={(e) => {
                if (e.target.files.length > 0) {
                  const file = e.target.files[0];
                  setValue("image", file);
                }
              }}
              className="mt-1 border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-green-500"
            />
            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image.message}</p>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isDirty}
            >
              Submit
            </Button>
          </div>
        </form>
      </ReusableModal>
    </div>
  );
};

export default Addmenu;
