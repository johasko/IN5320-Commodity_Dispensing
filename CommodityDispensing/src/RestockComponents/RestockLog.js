import React, { useState } from "react";
import "../styles.css";
import { useDataQuery } from "@dhis2/app-runtime";
import { fetchRestockDataStoreDataQuery } from "./API/dataQueries";
import { Table } from "../Tools/Table";
import {
  CircularLoader,
  IconAddCircle16,
  DataTableToolbar,
  Input,
  Field,
  SingleSelectField,
  SingleSelectOption,
} from "@dhis2/ui";

/**
 * Creates a restockLog component which functions as log of restocked commodities.
 * props/args: none
 * Returns: a finshed restockLog component
*/

export function RestockLog() {
  const today = new Date();
  const { loading, error, data } = useDataQuery(
    fetchRestockDataStoreDataQuery()
  );
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
          <h1>Oh no!! Something went wrong here. -
                    Please ensure that your connection is stable.</h1>
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
    const historyLog = mergeData(data.restockDataStoreData.history);
    const filteredData = filterData(historyLog, periodYear, periodMonth);
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
                onChange={(value) => {setPeriodYear(value.value); setPeriodMonth("-1");}}
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
                periodYear === today.getFullYear().toString() && index > today.getMonth() ? (
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
            "Stock Adjustment",
            "Commodity",
            "Category",
            "Amount",
          ]}
          tableData={filteredData}
          defaultSortQuery={{ 0: "desc" }}
          searchableColumns={[2]}
        />
      </>
    );
  }
}

/**
* a helper function for mergeing data retrived from API calls
   to retrive restockhistory from the dataStore.
  -------------------------------------------------------------------
* props/args: data (object) - Data from a useDataQuery() call to datastore/Dispensing-History
* Returns: tableData (js array) - The data to be parsed into a Tools/table.js Component 
*/

function mergeData(dataStoreData) {
  const tableData = [];
  dataStoreData.map((dataRow) => {
    dataRow.commodities.map((commodity) => {
      const tableRow = [];
      const displayTime = dataRow.date.split("T");
      tableRow.push({
        display: displayTime[0] + " " + displayTime[1],
        value: new Date(dataRow.date),
      });
      tableRow.push({
        display: commodity.increasedStock ? (
          <div
            class="restock-chip"
            style={{ background: "#e6efe4", color: "#00332b" }}
          >
            <IconAddCircle16 />
            <span>Restock</span>
          </div>
        ) : (/* unused: Check README for why :)
          <div
            class="restock-chip"
            style={{ background: "#ffcdd2", color: "#330202" }}
          >
            <IconReorder16 />
            <span>Adjusted</span>
          </div>
        */<></>),value: commodity.increasedStock
      });
      tableRow.push({ display: commodity.name, value: commodity.name });
      tableRow.push({
        display: commodity.categoryName,
        value: commodity.categoryName,
      });
      tableRow.push({ display: commodity.value, value: commodity.value });
      tableData.push(tableRow);
    });
  });
  return tableData;
}

/**
* a helper function to filter data in the RestockLog table
  -------------------------------------------------------------------
* props/args: data (object) - Data from the table
      periodYear (string) the year in the table cell
      periodmonth (string) th month in the table cell

*Returns: filteredData(js array) - The filtered data  
*/

function filterData(data, periodYear, periodMonth){
    let filteredData = []
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
    return filteredData
}
