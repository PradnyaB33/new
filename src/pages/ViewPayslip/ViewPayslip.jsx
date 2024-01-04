import React from "react";

const ViewPayslip = () => {
  return (
    <>
      <section className="min-h-screen flex w-full">
        <div className="!w-[30%]  lg:flex hidden text-white flex-col items-center justify-center h-screen relative">
          <div className="bg__gradient  absolute inset-0 "></div>
          <ul class="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>

        <div style={{ marginTop: "20%", marginLeft: "20%" }}>
          <button
            style={{
              padding: "10px 20px",
              borderRadius: "5px",
              backgroundColor: "#008CBA",
              color: "#fff",
              border: "none",
              fontSize: "1em",
              cursor: "pointer",
            }}
          >
            Generate PDF
          </button>
        </div>
      </section>
    </>
  );
};

export default ViewPayslip;
