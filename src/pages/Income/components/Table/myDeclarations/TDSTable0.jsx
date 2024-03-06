import { CircularProgress } from "@mui/material";
import axios from "axios";
import { default as React, useState } from "react";
import { useQuery } from "react-query";
import useTDS from "../../../../../hooks/IncomeTax/useTDS";
import useAuthToken from "../../../../../hooks/Token/useAuth";
import UserProfile from "../../../../../hooks/UserData/useUser";
const TDSTable0 = () => {
  const authToken = useAuthToken();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const {
    setGrossTotal,
    grossTotal,
    setSalaryTax,
    setSalaryDeclaration,
    setSelfPropertyDeclaration,
    setPropertyTax,
    setSectionTax,
    setTaxableIncome,
    setOtherIncomeTax,
    taxableIncome,
    setTax,
    tax,
  } = useTDS();
  const {
    isFetched: salaryFetch,
    isFetching: salaryFetching,
    isLoading,
  } = useQuery({
    queryKey: ["financialYearGross"],
    queryFn: async () => {
      try {
        const salaryData = await axios.get(
          `${process.env.REACT_APP_API}/route/employeeSalary/getEmployeeSalaryPerFinancialYear?fromDate=5-2023&toDate=3-2024`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return salaryData.data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: (res) => {
      let data = res.reduce((total, item) => {
        return total + parseFloat(item.totalGrossSalary);
      }, 0);

      setGrossTotal(data);
    },
  });

  const [tableData, setTableData] = useState([
    {
      name: "Income From Salary",
      amount: 0,
      headTotalTax: 0,
    },
    {
      name: "Income From House Property",
      amount: 0,
      headTotalTax: 0,
    },
    {
      name: "Income from other sources",
      amount: 0,
      headTotalTax: 0,
    },
    {
      name: "Deduction under chapter VI A",
      amount: 0,
      headTotalTax: 0,
    },
  ]);

  useQuery({
    queryKey: ["getTDS"],
    queryFn: async () => {
      try {
        const empId = user._id;
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/route/tds/getTDSDetails/${empId}/2023-2024`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        return data.tds;
      } catch (error) {
        console.log(error);
      }
    },

    onSuccess: (tds) => {
      const tdsSalary = tds?.incomeFromSalarySource?.investmentType.reduce(
        (accumulator, investmentType) => {
          return accumulator + Number(investmentType.declaration);
        },
        0
      );
      const salaryDeduction = grossTotal - tdsSalary;
      setSalaryTax(salaryDeduction);

      const isSelfProperty = tds.incomeFromHouseProperty?.section.find(
        (section) =>
          section?.sectionName === "(A) Self Occupied Property (Loss)"
      );

      let SelfProperty = 0;

      if (isSelfProperty) {
        let data = isSelfProperty?.investmentType.reduce(
          (accumulator, investmentType) => {
            return accumulator + investmentType.declaration;
          },
          0
        );

        if (data > 200000) {
          data = 200000;
        }
        setSelfPropertyDeclaration(data);
        SelfProperty = data;
      }

      const section2 = tds.incomeFromHouseProperty?.section?.find(
        (section) =>
          section?.sectionName ===
          "(B) Let out property (Enter name of Property)"
      );
      const section3 = tds.incomeFromHouseProperty?.section?.find(
        (section) =>
          section?.sectionName ===
          "(C) Let out property (Enter name of Property)"
      );

      let property1 = getPropertyValues(section2);
      let property2 = getPropertyValues(section3);

      setSalaryDeclaration(tdsSalary);

      const totalHeads =
        SelfProperty -
        property1.ActualDeductedValue -
        property2.ActualDeductedValue;
      setPropertyTax(totalHeads);

      const otherDeduction = getTotalIncome(tds.incomeFromOtherSources);
      setOtherIncomeTax(otherDeduction);

      const section80C = tds.sectionDeduction?.section.find(
        (section) => section?.sectionName === "Section80"
      );

      const section50 = tds.sectionDeduction?.section.find(
        (section) => section?.sectionName === "Section 80CCD NPS"
      );

      const others = tds.sectionDeduction?.section.find(
        (section) => section?.sectionName === "Section80 50000"
      );

      let Section80c = 0;
      let Section50 = 0;
      let Others = 0;

      if (section80C) {
        let data = section80C?.investmentType.reduce(
          (accumulator, investmentType) => {
            return accumulator + investmentType.declaration;
          },
          0
        );

        if (data > 150000) {
          data = 150000;
        }
        Section80c = data;
      }

      if (section50) {
        let data = section50?.investmentType.reduce(
          (accumulator, investmentType) => {
            return accumulator + investmentType.declaration;
          },
          0
        );

        if (!isNaN(data)) {
          Section50 = data;
        }
      }

      if (others) {
        let data = others?.investmentType.reduce(
          (accumulator, investmentType) => {
            return accumulator + investmentType.declaration;
          },
          0
        );

        if (!isNaN(data)) {
          Others = data;
        }
      }

      const SectionDeclarations = Section80c + Section50 + Others;
      setSectionTax(SectionDeclarations);

      const totalTaxableIncome =
        salaryDeduction - (totalHeads + otherDeduction) - SectionDeclarations;

      const taxAmount = getTaxbleAmount(totalTaxableIncome);
      setTax(taxAmount);
      setTaxableIncome(totalTaxableIncome);

      let updatedTableData = tableData.map((item) => {
        if (item.name === "Income From Salary") {
          return {
            ...item,
            amount: tdsSalary,
            headTotalTax: salaryDeduction,
          };
        } else if (item.name === "Income From House Property") {
          return {
            ...item,
            amount: 0,
            headTotalTax: totalHeads,
          };
        } else if (item.name === "Income from other sources") {
          return {
            ...item,
            amount: 0,
            headTotalTax: otherDeduction,
          };
        } else if (item.name === "Deduction under chapter VI A") {
          return {
            ...item,
            amount: 0,
            headTotalTax: SectionDeclarations,
          };
        } else {
          return item;
        }
      });
      setTableData(updatedTableData);
    },
  });

  function getPropertyValues(sec) {
    const netValue =
      sec.investmentType[0].declaration - sec.investmentType[1].declaration;

    const deductedAmount = (netValue * 30) / 100;

    const ActualDeductedValue = sec.investmentType[2].declaration
      ? netValue - deductedAmount - sec.investmentType[2].declaration
      : netValue - deductedAmount;

    return {
      ActualDeductedValue,
      deductedAmount,
      netValue,
    };
  }

  function getTotalIncome(incomeFromOther) {
    let data = 0;
    let deduction = 0;

    incomeFromOther.investmentType.forEach((investmentType) => {
      if (
        investmentType.name !== "Income taxable under the head Other Sources"
      ) {
        if (investmentType) {
          if (
            investmentType.name ===
            "Less : Deduction on Family Pension Income Sec. 57(IIA)"
          ) {
            deduction = investmentType.declaration;
          } else {
            data += investmentType.declaration;
          }
        }
      }
    });

    return data - deduction;
  }

  const getTaxbleAmount = (amount) => {
    let taxableAmount = 0;
    if (amount < 300001) {
      taxableAmount = 0;
    } else if (amount >= 300001 && amount <= 500000) {
      taxableAmount = (amount - 250000) * 0.05;
    } else if (amount >= 500001 && amount <= 1000000) {
      taxableAmount = (amount - 500000 + 10000) * 0.2;
    } else if (amount > 1000000) {
      taxableAmount = (amount - 1000000 + 110000) * 0.3;
    }

    return taxableAmount.toFixed(2);
  };

  return (
    <>
      {isLoading || salaryFetching || !salaryFetch ? (
        <CircularProgress />
      ) : (
        <>
          <div className="grid bg-white border-[.5px] border-gray-200 grid-cols-6 gap-4 p-4">
            <div>
              <h1 className="text-gray-600">Total Taxable Income</h1>
              <p className="text-xl">INR {taxableIncome.toFixed(2)}</p>
            </div>

            <div>
              <h1 className="text-gray-600">Total Tax</h1>
              <p className="text-xl">INR {tax}</p>
            </div>
          </div>

          <div className="bg-white ">
            <table className="table-auto border border-collapse min-w-full bg-white  text-left  !text-sm font-light">
              <thead className="border-b bg-gray-100 font-bold">
                <tr className="!font-semibold ">
                  <th scope="col" className="!text-left pl-8 w-max py-3 border">
                    SR NO
                  </th>
                  <th scope="col" className="py-3 px-2 border">
                    Deduction Name
                  </th>

                  <th scope="col" className="py-3 px-2 border">
                    Declaration
                  </th>
                  <th scope="col" className="py-3 px-2 border">
                    Taxble Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, itemIndex) => (
                  <tr
                    className={`!font-medium h-14 border-b 
                
                `}
                    key={itemIndex}
                  >
                    <td className="!text-left pl-8 leading-7 text-[16px] w-[100px] border ">
                      {itemIndex + 1}
                    </td>
                    <td className="leading-7 text-[16px] truncate text-left w-[500px] border px-2">
                      <p>{item.name}</p>
                    </td>

                    <td className=" text-left !p-0 w-[200px] border ">
                      <p
                        className={`
                     
                        px-2 leading-7 text-[16px]`}
                      >
                        INR {parseFloat(item.amount).toFixed(2)}
                      </p>
                    </td>
                    <td className=" text-left !p-0 w-[200px] border ">
                      <p
                        className={`
                     
                        px-2 leading-7 text-[16px]`}
                      >
                        INR {parseFloat(item.headTotalTax).toFixed(2)}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* <div className="!font-medium h-14 border flex items-center justify-between px-8 ">
              <h1>Total Taxable Income</h1>
              <p></p>
            </div>
            <div className="!font-medium border h-10  flex items-center justify-between px-8 ">
              <h1>Total Tax</h1>
              <p>{tax}</p>
            </div> */}
          </div>

          {/* <SalaryDetails /> */}
        </>
      )}
    </>
  );
};

export default TDSTable0;
