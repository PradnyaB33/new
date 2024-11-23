import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Work, Description, People } from "@mui/icons-material";
import { Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import ApartmentIcon from "@mui/icons-material/Apartment";
import useEmpOption from "../../hooks/Employee-OnBoarding/useEmpOption";
import axios from "axios";
import useGetUser from "../../hooks/Token/useUser";
import { useMutation, useQuery } from "react-query";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BasicButton from "../../components/BasicButton";
import { TestContext } from "../../State/Function/Main";
import UserProfile from "../../hooks/UserData/useUser";

const MyOpenJobPosition = () => {
    const location = useLocation();

    // Check jar route "/view" asel tar input field disable kara ani Save Changes button hide kara
    const isViewRoute = location.pathname.includes('/view');
    const organisationId = useParams();
    console.log("aaaorganisationId", organisationId);
    const { getCurrentUser } = UserProfile();
    const user = getCurrentUser();
    const managerId = user?._id;
    const { vacancyId } = useParams();
    const { handleAlert } = useContext(TestContext);
    const navigate = useNavigate();
    const { Departmentoptions, HrOptions } = useEmpOption(organisationId);
    console.log("Departmentoptions", Departmentoptions);

    const { authToken } = useGetUser();

    const [vacancyData, setVacancyData] = useState(null);

    const experienceOptions = [
        { label: "0-2 Years", value: "0-2 Years" },
        { label: "2-4 Years", value: "2-4 Years" },
        { label: "4-6 Years", value: "4-6 Years" },
        { label: "6-8 Years", value: "6-8 Years" },
        { label: "8+ Years", value: "8+ Years" },
    ];

    const JobVacancySchema = z.object({
        jobPosition: z.string().min(1, "Position title is required"),
        department: z.object({ label: z.string(), value: z.string() }).refine(
            (data) => !!data.value,
            "Department selection is required"
        ),
        experienceRequired: z.object({
            label: z.string(),
            value: z.string(),
        }),
        jobDescription: z.string().min(1, "Description is required"),
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

    const { isLoading } = useQuery(
        ["JobVacancyDetails", vacancyId],
        async () => {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/manager/vacancy/${vacancyId}`,
                {
                    headers: { Authorization: authToken },
                }
            );
            return response.data.data;
        },
        {
            enabled: Boolean(vacancyId),
            onSuccess: (data) => {

                setVacancyData(data);
                console.log("Vacancy Data:", data);
            },
        }
    );

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

    const mrUpdateJobPosition = async (data) => {
        const response = await axios.patch(
            `${process.env.REACT_APP_API}/route/organization/${organisationId}/manager/vacancy/${vacancyId}`,
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
            navigate(`/organisation/${organisationId?.organisationId}/mr-open-job-vacancy-list`);
        },
        onError: (error) => {
            handleAlert(true, "error", error.response?.data?.message || "Something went wrong.");
        },
    });

    const { mutate: mrEditJobPosition } = useMutation({
        mutationFn: mrUpdateJobPosition,
        onSuccess: () => {
            handleAlert(true, "success", "Job position updated successfully.");
            navigate(`/organisation/${organisationId?.organisationId}/mr-open-job-vacancy-list`);
        },
        onError: (error) => {
            handleAlert(true, "error", error.response?.data?.message || "Something went wrong.");
        },
    });

    const { handleSubmit, control, formState: { errors }, setValue } = useForm({
        resolver: zodResolver(JobVacancySchema),
        defaultValues: {
            jobPosition: "",
            department: { label: "", value: "" },
            experienceRequired: { label: "", value: "" },
            jobDescription: "",
            vacancies: 1,
            hr: { label: "", value: "" },
        },
    });

    useEffect(() => {
        if (vacancyData) {
            console.log("Setting form values:", vacancyData);

            setValue("jobPosition", vacancyData.jobPosition);
            setValue("department", {
                label: vacancyData.department?.departmentName,
                value: vacancyData.department?._id,
            });
            setValue("experienceRequired", {
                label: vacancyData.experienceRequired,
                value: vacancyData.experienceRequired,
            });
            setValue("jobDescription", vacancyData.jobDescription);
            setValue("vacancies", vacancyData.vacancies);
            setValue("hr", {
                label: `${vacancyData.hrAssigned?.first_name} ${vacancyData.hrAssigned?.last_name}`, // Combine first_name and last_name
                value: vacancyData.hrAssigned?._id,
            });
        }
    }, [vacancyData, setValue]);


    const onSubmit = (data) => {
        const formattedData = {
            jobPosition: data.jobPosition,
            department: data.department.value,
            experienceRequired: data.experienceRequired.value,
            jobDescription: data.jobDescription,
            vacancies: Number(data.vacancies),
            hrAssigned: data.hr.value,
            createdBy: managerId
        };
        if (vacancyId) {
            mrEditJobPosition(formattedData);
        } else {
            mrCreateJobPostion(formattedData);
        }
    };

    return (
        <BoxComponent>
            <HeadingOneLineInfo
                heading={vacancyId
                    ? (isViewRoute ? "View Job Position" : "Edit Job Position")
                    : "Create Job Position"}
                info={vacancyId
                    ? (isViewRoute ? "View the job position details." : "Edit the job position details.")
                    : "Add a new job position."}

            />
            <form onSubmit={handleSubmit(onSubmit)} className="overflow-auto">
                <Grid container spacing={2} md={12}>
                    <Grid item md={6}>
                        <AuthInputFiled
                            name="jobPosition"
                            icon={Work}
                            control={control}
                            type="text"
                            placeholder="Job Position"
                            label="Job Position*"
                            readOnly={false}
                            maxLimit={50}
                            errors={errors}
                            error={errors.jobPosition}
                            disabled={isViewRoute}
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
                            disabled={isViewRoute}
                        />
                    </Grid>
                    <Grid item md={6}>
                        <AuthInputFiled
                            name="experienceRequired"
                            icon={Work}
                            control={control}
                            type="select"
                            placeholder="Experience"
                            label="Experience *"
                            errors={errors}
                            error={errors.experienceRequired}
                            options={experienceOptions}
                            disabled={isViewRoute}
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
                            errors={errors}
                            error={errors.vacancies}
                            disabled={isViewRoute}
                        />
                    </Grid>
                    <Grid item md={6}>
                        <AuthInputFiled
                            name="hr"
                            icon={People}
                            control={control}
                            type="select"
                            placeholder="Select HR"
                            label="Assigned HR *"
                            errors={errors}
                            error={errors.hr?.message}
                            options={HrOptions}
                            disabled={isViewRoute}
                        />
                    </Grid>
                    <Grid item md={12}>
                        <AuthInputFiled
                            name="jobDescription"
                            icon={Description}
                            control={control}
                            type="textarea"
                            placeholder="Job Description"
                            label="Job Description *"
                            errors={errors}
                            error={errors.jobDescription}
                            maxLimit={250}
                            disabled={isViewRoute}
                        />
                    </Grid>
                    {vacancyId ? (
                        !isViewRoute && (
                            <BasicButton
                                title="Save Changes"
                                type="submit"
                                loading={isLoading}
                            />
                        )
                    ) : (
                        <BasicButton
                            title="Create Job"
                            type="submit"
                            loading={isLoading}
                        />
                    )}


                </Grid>
            </form>

        </BoxComponent>
    );
};

export default MyOpenJobPosition;
