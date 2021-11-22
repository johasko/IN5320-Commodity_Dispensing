import React, { useState } from "react";
import "../styles.css";
import { useDataQuery } from "@dhis2/app-runtime";
import { CircularLoader } from "@dhis2/ui";
import { Table } from "../Tools/Table";
import {
  Input,
  Field,
  MultiSelectField,
  MultiSelectOption,
  SingleSelectField,
  SingleSelectOption,
  DataTableToolbar
} from "@dhis2/ui";
import { fetchDataQuery } from "./API/dataQueries";

/**
* a helper function for mergeing data retrived from API calls,
   to retrive info on end balance, stock and quantitiy to be orderer 
  -------------------------------------------------------------------
* props/args: data (object) - Data from a useDataQuery() call
* Returns: tableData (js array) - The data to be parsed into a Tools/table.js Component 
*/
function mergeData(data) {
  const tableData = data.dataSets.dataSetElements.map((dataElement) => {
    const commodity = dataElement.dataElement;
    const commodityId = commodity.id;
    const commodityName = commodity.name.split(" - ")[1];
    const tableRow = [{ display: commodityName, value: commodityName }];
    commodity.dataElementGroups.map((category) => {
      if (category.id !== "Svac1cNQhRS") {
        const categoryName = category.name.split("Commodities ")[1];
        tableRow.push({ display: categoryName, value: categoryName });
      }
    });
    const values = commodity.categoryCombo.categoryOptionCombos.map(
      (values) => {
        const matchedValue = data.dataValueSets.dataValues.find((dataValue) => {
          if (dataValue.dataElement == commodityId) {
            if (dataValue.categoryOptionCombo == values.id) {
              return true;
            }
          }
        });
        return {
          name: values.name,
          value: matchedValue.value,
        };
      }
    );
    const endBalance = values.find((e) => e.name === "End Balance").value;
    tableRow.push({ display: endBalance, value: parseInt(endBalance) });
    return tableRow;
  });
  return tableData;
}
/**
* a helper function to filter data in the external overview table
  -------------------------------------------------------------------
* props/args: data (object) - Data from the table
      filterQuery(string) the desired column to filter the table by
      searchQuery (string) the search in the search bar

*Returns: filteredData(js array) - The filtered data  
*/
function filterData(mergedData, filterQuery, searchQuery) {
  let filteredData = [];
  if (filterQuery.length !== 0) {
    filteredData = mergedData.filter((row) =>
      filterQuery.includes(row[1].display)
    );
  } else {
    filteredData = [...mergedData];
  }
  let searchedData = [];
  if (searchQuery !== "") {
    searchedData = mergedData.filter((row) =>
      row[0].display.toLowerCase().includes(searchQuery.toLowerCase())
    );
  } else {
    searchedData = [...filteredData];
  }
  return searchedData;
}
/**
 * Creates a OverviewExternal component to display external stock balances of commodites at nearby hospitals.
 * props/args: props.me (object) - Data from the merged data from the mainDataquery,
 *       passed through OverviewTabs
 * Returns: a finshed OverviewExternal Commodities component
*/
export function OverviewExternal(props) {
  const [orgUnit, setOrgUnit] = useState(props.hospitals[0].id);
  const { loading, error, data, refetch } = useDataQuery(fetchDataQuery(), {
    variables: {
      orgUnit: orgUnit,
      period: props.me.currentPeriod,
    },
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState([]);
  if (error) {
    return (
      <>
        <h1>Oh no!! Something went wrong here. -
                    Please ensure that your connection is stable.</h1>
        <span>ERROR: {error.message}</span>
      </>
    );
  }

  if (loading) {
    return (
      <div className="loader-container">
        <CircularLoader large />
      </div>
    );
  }
  if (data) {
    let mergedData = mergeData(data);
    let categories = Array.from(
      new Set(
        mergedData.map((value) => {
          return value[1].display;
        })
      )
    ).sort();
    const filteredData = filterData(mergedData, filterQuery, searchQuery);
    return (
      <>
        <DataTableToolbar style={{ background: "white" }}>
          <div
            className="overview-filter-container"
            style={{ gridTemplateColumns: "1fr 1fr 2fr" }}
          >
            <SingleSelectField
              label="Select Hospital"
              selected={orgUnit}
              onChange={(value) => {
                setOrgUnit(value.selected);
                refetch({ orgUnit: value.selected });
              }}
            >
              {props.hospitals.map((h, index) => (
                <SingleSelectOption key={index} label={h.name} value={h.id} />
              ))}
            </SingleSelectField>
            <Field label="Search Commodity">
              <Input
                name="defaultName"
                onChange={(event) => setSearchQuery(event.value)}
              />
            </Field>
            <MultiSelectField
              label="Commodity Categories"
              onChange={(event) => {
                console.log(event.selected);
                setFilterQuery(event.selected);
              }}
              selected={filterQuery}
            >
              {categories.map((category, index) => (
                <MultiSelectOption
                  key={index}
                  label={category}
                  value={category}
                />
              ))}
            </MultiSelectField>
          </div>
        </DataTableToolbar>
        <Table
          headerData={["Commodity", "Category", "In Stock"]}
          tableData={filteredData}
          defaultSortQuery={{ 0: "asc" }}
        />
      </>
    );
  }
}
