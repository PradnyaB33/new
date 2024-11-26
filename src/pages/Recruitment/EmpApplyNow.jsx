import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams } from "react-router-dom";
import { Grid, Button } from "@mui/material";
import { Work, Description, People, Phone, Mail, School, Verified } from "@mui/icons-material";
import { useMutation } from "react-query";
import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import useApplyJobPositionState from "../../hooks/RecruitmentHook/useApplyJobPositionState";
import UserProfile from "../../hooks/UserData/useUser";
import axios from "axios";
import { UseContext } from "../../State/UseState/UseContext";

// Validation Schema
const applicationSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    phone: z.string().min(1, "Phone number is required"),
    resume: z.string().min(1, "Resume is required"),
    jobPosition: z.string().min(1, "Job Position is required"),
    coverLetter: z.string().min(1, "Cover Letter is required"),
    experience: z.string().min(1, "Experience is required"),
    education: z.string().min(1, "Education is required"),
    certifications: z.string().min(1, "Certifications are required"),
});

const EmpApplyNow = () => {
    const { vacancyId, organisationId } = useParams();
    const { getCurrentUser } = UserProfile();
    const user = getCurrentUser();
    const applicantId = user?._id;
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];

    const { setJobId, setResume } = useApplyJobPositionState();

    const { control, handleSubmit, formState, setValue } = useForm({
        resolver: zodResolver(applicationSchema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
            jobPosition: "Software Engineer",
        },
    });

    const { errors } = formState;

    // useMutation for API call
    const mutation = useMutation(
        (data) => {
            return axios.post(`${process.env.REACT_APP_API}/route/organization/${organisationId}/job-open/${vacancyId}/apply`, data,
                {
                    headers: { Authorization: authToken },
                }
            )
        },
        {
            onSuccess: (response) => {
                alert("Job application submitted successfully!");
                console.log("Response:", response.data);
            },
            onError: (error) => {
                console.error("Error submitting application:", error.response?.data);
                alert(error.response?.data?.message || "An error occurred while applying.");
            },
        }
    );

    const onSubmit = (data) => {
        const formData = {
            ...data,
            applicantId,
            jobId: vacancyId,
            applicationStatus: "Applied",
        };

        // Trigger the mutation
        mutation.mutate(formData);
    };

    useEffect(() => {
        if (vacancyId) {
            setJobId(vacancyId);
            setValue("jobPosition", "Software Engineer");
        }
    }, [vacancyId, setValue, setJobId]);

    return (
        <BoxComponent>
            <HeadingOneLineInfo heading="Job Apply" info="Here you can apply for the job" />
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col space-y-4">
                <Grid container spacing={2}>
                    {/* Name Field */}
                    <Grid item md={6}>
                        <AuthInputFiled
                            name="name"
                            label="Full Name*"
                            control={control}
                            type="text"
                            placeholder="Enter your full name"
                            icon={People}
                            errors={errors}
                            error={errors.name?.message}
                        />
                    </Grid>

                    {/* Email Field */}
                    <Grid item md={6}>
                        <AuthInputFiled
                            name="email"
                            label="Email*"
                            control={control}
                            type="email"
                            placeholder="Enter your email address"
                            icon={Mail}
                            errors={errors}
                            error={errors.email?.message}
                        />
                    </Grid>

                    {/* Phone Field */}
                    <Grid item md={6}>
                        <AuthInputFiled
                            name="phone"
                            label="Phone Number*"
                            control={control}
                            type="text"
                            placeholder="Enter your phone number"
                            icon={Phone}
                            errors={errors}
                            error={errors.phone?.message}
                        />
                    </Grid>

                    {/* Experience Field */}
                    <Grid item md={12}>
                        <AuthInputFiled
                            name="experience"
                            label="Experience*"
                            control={control}
                            type="text"
                            placeholder="Enter your professional experience"
                            icon={Work}
                            errors={errors}
                            error={errors.experience?.message}
                        />
                    </Grid>

                    {/* Education Field */}
                    <Grid item md={12}>
                        <AuthInputFiled
                            name="education"
                            label="Education*"
                            control={control}
                            type="text"
                            placeholder="Enter your education details"
                            icon={School}
                            errors={errors}
                            error={errors.education?.message}
                        />
                    </Grid>

                    {/* Certifications Field */}
                    <Grid item md={12}>
                        <AuthInputFiled
                            name="certifications"
                            label="Certifications*"
                            control={control}
                            type="file"
                            placeholder="Enter certifications (if any)"
                            icon={Verified}
                            errors={errors}
                            error={errors.certifications?.message}
                        />
                    </Grid>

                    {/* Cover Letter Field */}
                    <Grid item md={12}>
                        <AuthInputFiled
                            name="coverLetter"
                            label="Cover Letter*"
                            control={control}
                            type="textarea"
                            placeholder="Write your cover letter"
                            icon={Description}
                            errors={errors}
                            error={errors.coverLetter?.message}
                        />
                    </Grid>

                    {/* Resume Upload Field */}
                    <Grid item md={12}>
                        <AuthInputFiled
                            name="resume"
                            label="Resume (URL or Upload)*"
                            control={control}
                            type="file"
                            placeholder="Provide a link to your resume or upload"
                            icon={Description}
                            errors={errors}
                            error={errors.resume?.message}
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setResume(file.name, file.path);
                                }
                            }}
                        />
                    </Grid>
                </Grid>

                {/* Submit Button */}
                <div className="flex justify-end mt-4">
                    <Button variant="contained" color="primary" type="submit" disabled={mutation.isLoading}>
                        {mutation.isLoading ? "Submitting..." : "Submit Application"}
                    </Button>
                </div>
            </form>
        </BoxComponent>
    );
};

export default EmpApplyNow;
