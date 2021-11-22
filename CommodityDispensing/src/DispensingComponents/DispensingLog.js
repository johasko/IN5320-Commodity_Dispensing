import React, { useState } from "react";
import "../styles.css";
import { useDataQuery } from "@dhis2/app-runtime";
import { fetchDataStoreDataQuery } from "./API/dataQueries";
import {
  CircularLoader,
  IconHome16,
  IconWorld16,
  DataTableToolbar,
  Input,
  Field,
  SingleSelectField,
  SingleSelectOption,
} from "@dhis2/ui";
import { Table } from "../Tools/Table";

/**
* a helper function for mergeing data retrived from API calls to retrive Dispensing history,
  -------------------------------------------------------------------
* props/args: data (object) - Data from a useDataQuery() call to datastore/Dispensing-History
*Returns: tableData (js array) - The data to be parsed into a Tools/table.js Component 
*/

function mergeData(data) {
  const tableData = [];
  data.map((dataRow) => {
    dataRow.commodities.map((commodity) => {
      const tableRow = [];
      const displayTime = dataRow.date.split("T");
      tableRow.push({
        display: displayTime[0] + " " + displayTime[1],
        value: new Date(dataRow.date),
      });
      tableRow.push({
        display: dataRow.external ? (
          <div
            className="chip"
            style={{ background: "#e6efe4", color: "#1f770a" }}
          >
            <IconWorld16 />
            <span>External</span>
          </div>
        ) : (
          <div
            className="chip"
            style={{ background: "#e4ecff", color: "#1f5ce6" }}
          >
            <IconHome16 />
            <span>Internal</span>
          </div>
        ),
        value: dataRow.external,
      });
      tableRow.push({ display: commodity.name, value: commodity.name });
      tableRow.push({
        display: commodity.categoryName,
        value: commodity.categoryName,
      });
      tableRow.push({ display: commodity.value, value: commodity.value });
      tableRow.push({
        display: dataRow.dispensedBy,
        value: dataRow.dispensedBy,
      });
      tableRow.push({
        display: dataRow.dispensedTo,
        value: dataRow.dispensedTo,
      });
      tableRow.push({ display: dataRow.dept, value: dataRow.dept });
      tableData.push(tableRow);
    });
  });
  return tableData;
}
/**
* a helper function to filter data in the DispensingLog table
  -------------------------------------------------------------------
* props/args: data (object) - Data from the table
      periodYear (string) the year in the table cell
      periodmonth (string) th month in the table cell

*Returns: filteredData(js array) - The filtered data  
*/

function filterData(data, periodYear, periodMonth) {
  let filteredData = [];
  filteredData = data.filter((row) => {
    if (row[0].value.getFullYear().toString() === periodYear) {
      console.log(periodMonth)
      if (periodMonth === "-1"){
        return true
      }else if (row[0].value.getMonth().toString() === periodMonth){
        return true;
      }
    }
  });
  return filteredData;
}
/**
 * Creates a DispensingLog component which functions as log of dispensed commodities.
 * props/args: none
 * Returns: a finshed DispenseLog component
*/
export function DispensingLog() {
  const today = new Date();

  const { loading, error, data } = useDataQuery(fetchDataStoreDataQuery());
  const [periodMonth, setPeriodMonth] = useState("-1");
  const [periodYear, setPeriodYear] = useState(today.getFullYear().toString());

  if (loading) {
    return (
      <div className="loader-container">
        <CircularLoader large />
      </div>
    );
  }
  if (error) {
    return (
      <>
        <div>
          <h1>Dispensing History - Something is wrong!:</h1>
          <span>{error.message} </span>
        </div>
      </>
    );
  }
  if (data) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const historyLog = mergeData(data.dispensingDataStoreData.history);
    const filteredData = filterData(historyLog, periodYear, periodMonth);

    //Creating the history table
    return (
      <>
        <DataTableToolbar style={{ background: "white" }}>
          <div
            className="select-period"
            style={{ gridTemplateColumns: "1fr 3fr" }}
          >
            <Field label="Year">
              <Input
                dense
                type="number"
                max={today.getFullYear()}
                min="1996" /* DHIS' oppstandelse */
                name="year"
                value={periodYear}
                onChange={(value) => {
                  setPeriodYear(value.value);
                  setPeriodMonth("-1");
                }}
              />
            </Field>
            <SingleSelectField
              label="Month"
              dense
              onChange={(value) => setPeriodMonth(value.selected)}
              selected={periodMonth}
            >
              <SingleSelectOption
                key={-1}
                label="View all"
                value="-1"
              />
              {months.map((month, index) =>
                periodYear === today.getFullYear().toString() &&
                index > today.getMonth() ? (
                  <></>
                ) : (
                  <SingleSelectOption
                    key={index}
                    label={month}
                    value={index.toString()}
                  />
                )
              )}
            </SingleSelectField>
          </div>
        </DataTableToolbar>
        <Table
          headerData={[
            "Time",
            "Destination",
            "Commodity",
            "Category",
            "Amount",
            "Dispensed By",
            "Dispensed To",
            "Department",
          ]}
          tableData={filteredData}
          defaultSortQuery={{ 0: "desc" }}
          searchableColumns={[2, 5, 6, 7]}
        />
      </>
    );
  }
}
