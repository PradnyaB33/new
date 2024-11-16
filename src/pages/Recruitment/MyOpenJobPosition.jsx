import React, { useContext } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Work, Description, People } from "@mui/icons-material";
import { Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import ApartmentIcon from "@mui/icons-material/Apartment";
import useEmpOption from "../../hooks/Employee-OnBoarding/useEmpOption";
import { useParams } from "react-router-dom";
import axios from "axios";
import useGetUser from "../../hooks/Token/useUser";
import { useMutation } from "react-query";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BasicButton from "../../components/BasicButton";
import { TestContext } from "../../State/Function/Main";

const MyOpenJobPosition = () => {
    const organisationId = useParams("");
    const { handleAlert } = useContext(TestContext);
    const { Departmentoptions, HrOptions } = useEmpOption(organisationId);
    const { authToken } = useGetUser();

    const experienceOptions = [
        { label: "0-2 Years", value: "0-2" },
        { label: "2-4 Years", value: "2-4" },
        { label: "4-6 Years", value: "4-6" },
        { label: "6-8 Years", value: "6-8" },
        { label: "8+ Years", value: "8+" },
    ];

    const JobVacancySchema = z.object({
        positionTitle: z.string().min(1, "Position title is required"),
        department: z.object({ label: z.string(), value: z.string() }).refine(
            (data) => !!data.value,
            "Department selection is required"
        ),
        experience: z.object({
            label: z.string(),
            value: z.string(),
        }),
        description: z.string().min(1, "Description is required"),
        vacancies: z
            .number()
            .min(1, "There should be at least 1 vacancy")
            .max(100, "Vacancies cannot exceed 100")
            .or(z.string().regex(/^\d+$/, "Vacancies must be a number")),
        hr: z.object({ label: z.string(), value: z.string() }).refine(
            (data) => !!data.value,
            "HR selection is required"
        ),
    });

    const mrJobPostion = async (data) => {
        const response = await axios.post(
            `${process.env.REACT_APP_API}/route/organization/${organisationId?.organisationId}/mr-create-job-position`,
            data,
            {
                headers: { Authorization: authToken },
            }
        );
        return response.data;
    };

    const { mutate: mrCreateJobPostion } = useMutation({
        mutationFn: mrJobPostion,
        onSuccess: () => {
            handleAlert(true, "success", "Job position created successfully.");
        },
        onError: (error) => {
            handleAlert(true, "error", error.response?.data?.message || "Something went wrong.");
        },
    });

    const { handleSubmit, control, formState: { errors } } = useForm({
        resolver: zodResolver(JobVacancySchema),
        defaultValues: {
            positionTitle: "",
            department: { label: "", value: "" },
            experience: { label: "", value: "" },
            description: "",
            vacancies: 1,
            hr: { label: "", value: "" },
        },
    });

    const onSubmit = (data) => {
        const formattedData = {
            positionTitle: data.positionTitle,
            department: data.department.value,
            experienceRequired: data.experience.value,
            description: data.description,
            vacancies: Number(data.vacancies),
            hrAssigned: data.hr.value,
        };
        mrCreateJobPostion(formattedData);
    };

    return (
        <BoxComponent>
            <HeadingOneLineInfo
                heading="My Open Job Position"
                info="Here you can add open job position and send to HR."
            />
            <form onSubmit={handleSubmit(onSubmit)} className="overflow-auto">
                <Grid container spacing={2} md={12}>
                    <Grid item md={6}>
                        <AuthInputFiled
                            name="positionTitle"
                            icon={Work}
                            control={control}
                            type="text"
                            placeholder="Enter Position Title"
                            label="Position Title *"
                            readOnly={false}
                            maxLimit={50}
                            errors={errors}
                            error={errors.positionTitle}
                        />
                    </Grid>
                    <Grid item md={6}>
                        <AuthInputFiled
                            name="department"
                            icon={ApartmentIcon}
                            control={control}
                            type="select"
                            placeholder="Select Department"
                            label="Department *"
                            errors={errors}
                            error={errors.department?.message}
                            options={Departmentoptions}
                        />
                    </Grid>
                    <Grid item md={6}>
                        <AuthInputFiled
                            name="experience"
                            icon={Work}
                            control={control}
                            type="select"
                            placeholder="experience"
                            label="experience *"
                            errors={errors}
                            error={errors.experience}
                            options={experienceOptions}
                        />
                    </Grid>
                    <Grid item md={6}>
                        <AuthInputFiled
                            name="vacancies"
                            icon={Work}
                            control={control}
                            type="number"
                            placeholder="Number of Vacancies"
                            label="Vacancies *"
                            readOnly={false}
                            maxLimit={3}
                            errors={errors}
                            error={errors.vacancies?.message}
                        />
                    </Grid>
                    <Grid item md={12}>
                        <AuthInputFiled
                            name="description"
                            icon={Description}
                            control={control}
                            type="textarea"
                            placeholder="Job Description"
                            label="Job Description *"
                            readOnly={false}
                            maxLimit={500}
                            errors={errors}
                            error={errors.description?.message}
                        />
                    </Grid>
                    <Grid item md={6}>
                        <AuthInputFiled
                            name="hr"
                            icon={People}
                            control={control}
                            type="select"
                            placeholder="Select HR"
                            label="Assign to HR *"
                            options={HrOptions}
                            errors={errors}
                            error={errors.hr?.message}
                        />
                    </Grid>
                </Grid>
                <div className="flex justify-end">
                    <BasicButton title="Submit" type="submit" />
                </div>
            </form>
        </BoxComponent>
    );
};

export default MyOpenJobPosition;
