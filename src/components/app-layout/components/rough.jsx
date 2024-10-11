
<div>
    <Paper
        sx={{
            width: "100%",
            maxWidth: "800px",
            margin: "6% auto",
            padding: "20px",
        }}
    >
        <div style={{ textAlign: "center" }}>
            <h1 className="text-lg font-semibold md:text-xl">Account Setting</h1>
        </div>
        <div className=" mb-8">
            <p className="text-xs text-gray-600  text-center">
                Manage your account here.
            </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-around items-center w-full h-[25vh]">
                <div className="w-[50%]">
                    <div>
                        <input
                            style={{ display: "none" }}
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <div className="w-full h-full flex flex-col justify-center items-center">
                            {url || UserInformation?.user_logo_url ? (
                                <img
                                    src={url || UserInformation?.user_logo_url}
                                    alt="Selected"
                                    style={{
                                        width: "150px",
                                        height: "150px",
                                        borderRadius: "50%",
                                    }}
                                />
                            ) : (
                                <Skeleton variant="circular" width="150px" height="150px" sx={{ bgcolor: 'pink' }} />
                            )}
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="flex justify-center h-full bg-[#1976d2] shadow-md pt-1 pb-1 pr-4 pl-4 rounded-md font-semibold mt-2 text-white"
                            >
                                {UserInformation?.user_logo_url
                                    ? "Update Profile Picture"
                                    : "Select Profile Picture"}
                            </button>
                            <button
                                type="button"
                                // variant="contained"
                                color="error" // Red color for delete action
                                className="flex justify-center h-full bg-[#d21919] shadow-md pt-1 pb-1 pr-4 pl-4 rounded-md font-semibold mt-2 text-white"
                                onClick={handleDeleteProfilePhoto}
                            >
                                Delete Profile Photo
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-[50%] ml-20">
                    <div className="w-full h-full flex flex-col items-start">
                        <h1
                            style={{
                                fontSize: "24px",
                                fontWeight: "bold",
                                color: "#333",
                                textAlign: "center",
                            }}
                            className="text-left"
                        >
                            {`${user?.first_name} ${user?.last_name}`}
                        </h1>
                        <h1 className="text-lg font-semibold text-left">
                            {user?.profile.join(", ")}
                        </h1>

                        <div className="w-full">
                            <h1 className="text-lg text-left" style={{ color: "#000" }}>
                                {!UserInformation?.status_message ? (
                                    <div className="w-full">
                                        <Skeleton
                                            variant="text"
                                            width="200px"
                                            className="flex m-auto"
                                            sx={{ fontSize: "1rem" }}
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <span>
                                            <strong>Status:</strong>{" "}
                                            {UserInformation?.status_message || ""}
                                        </span>
                                    </>
                                )}
                            </h1>
                            <h1 className="text-lg text-left" style={{ color: "#000" }}>
                                {!UserInformation?.chat_id ? (
                                    <div className="w-full">
                                        <Skeleton
                                            variant="text"
                                            width="200px"
                                            className="flex m-auto"
                                            sx={{ fontSize: "1rem" }}
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <span>
                                            <strong>Chat ID:</strong>{" "}
                                            {UserInformation?.chat_id || ""}
                                        </span>
                                    </>
                                )}
                            </h1>
                            <h1 className="text-lg text-left" style={{ color: "#000" }}>
                                {!UserInformation?.additional_phone_number ? (
                                    <div className="w-full">
                                        <Skeleton
                                            variant="text"
                                            width="200px"
                                            className="flex m-auto"
                                            sx={{ fontSize: "1rem" }}
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <span>
                                            <strong>Contact:</strong>{" "}
                                            {UserInformation?.additional_phone_number || ""}
                                        </span>
                                    </>
                                )}
                            </h1>
                            <button
                                type="button"
                                onClick={() => setOpen(true)}
                                className="flex justify-center h-full bg-[#1976d2] shadow-md pt-1 pb-1 pr-4 pl-4 rounded-md font-semibold mt-2 text-white"
                            >
                                Reset Password
                            </button>

                            <button
                                type="button"
                                // onClick={handelchangeUserid}
                                onClick={() => setOpen1(true)}
                                className="flex justify-center h-full bg-[#1976d2] shadow-md pt-1 pb-1 pr-4 pl-4  rounded-md font-semibold mt-2 text-white"
                            >
                                Create User Id
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full py-6 mt-6">
                <Divider variant="fullWidth" orientation="horizontal" />
            </div>

            <div className="px-5 space-y-4 mt-4">
                <div className="space-y-2 ">
                    <AuthInputFiled
                        name="additional_phone_number"
                        icon={ContactEmergency}
                        control={control}
                        type="text"
                        placeholder="Contact"
                        label="Contact"
                        errors={errors}
                        error={errors.additional_phone_number}
                    />
                </div>
                <div className="space-y-2 ">
                    <AuthInputFiled
                        name="chat_id"
                        icon={ChatIcon}
                        control={control}
                        type="text"
                        placeholder="Chat Id"
                        label="Chat Id"
                        errors={errors}
                        error={errors.chat_id}
                    />
                </div>
                <div className="space-y-2 ">
                    <AuthInputFiled
                        name="status_message"
                        icon={InfoIcon}
                        control={control}
                        type="text"
                        placeholder="status"
                        label="status"
                        errors={errors}
                        error={errors.status_message}
                    />
                </div>

                <div className="flex gap-4 mt-4 justify-center">
                    <Button type="submit" variant="contained" color="primary">
                        Submit
                    </Button>
                </div>
            </div>
        </form>
    </Paper>
    <ResetNewPassword open={open} handleClose={handleClose} />
    <AddNewUserId open1={open1} handleClose1={handleClose1} />
</div >









