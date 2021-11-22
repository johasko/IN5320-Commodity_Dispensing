import React, { useState } from "react";
import {
  DataTable,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableCell,
  DataTableColumnHeader,
  Input,
} from "@dhis2/ui";

/**
* a helper function to make sorting posible on all columns in the table
  -------------------------------------------------------------------
* props/args: data (object) - Data from the table
      sortQuery (object) - passed from props.default or the table when a column is selected to sort by

*Returns: Data(object) - The data sorted by the sortquery 
*/

function sortData(data, sortQuery) {
  const columnIndex = Object.keys(sortQuery)[0];
  const direction = sortQuery[columnIndex];
  if (direction === "asc") {
    data.sort((a, b) => {
      if (a[columnIndex].value > b[columnIndex].value) {
        return 1;
      } else if (a[columnIndex].value < b[columnIndex].value) {
        return -1;
      }
      return 0;
    });
  } else {
    data.sort((a, b) => {
      if (a[columnIndex].value > b[columnIndex].value) {
        return -1;
      } else if (a[columnIndex].value < b[columnIndex].value) {
        return 1;
      }
      return 0;
    });
  }
  return data;
}

function filterData(data, searchQuery, searchColumn) {
  let searchedData = [];
  if (searchQuery !== "") {
    searchedData = data.filter((row) =>
      row[searchColumn].display.toLowerCase().includes(searchQuery.toLowerCase())
    );
  } else {
    searchedData = [...data];
  }
  return searchedData;
}
/**
 * A reuseable table used to displaying information about commodites, 
 *    in overviews, restocklog, and dispensingLog.
 * args/props : headerData (array) - array of the tableheader names
 *        tableData (object) - the data the table is s
 *        defaultSortQuery (object) - the defualt sortstate of the table
          searchableColumns (array) -  an array of the indexes for searchable columns of the table,
              for where to add in-column search.
 * returns:
 */
export function Table(props) {
  const [sortQuery, setSortQuery] = useState(props.defaultSortQuery);
  const [searchColumn, setSearchColumn] = useState(-1);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredData = filterData(props.tableData, searchQuery, searchColumn)
  const tableData = sortData(filteredData, sortQuery)

  //called when the table is sorted by column
  const sortHandler = (columnIndex, direction) => {
    const defaultColumn = parseInt(Object.keys(props.defaultSortQuery)[0]);
    const defaultDirection = props.defaultSortQuery[defaultColumn];
    if (direction === "default") {
      if (columnIndex !== defaultColumn && defaultDirection === "desc") {
        direction = defaultDirection;
      }else{
        direction = "asc";
      }
      columnIndex = defaultColumn;
    }
    const sq = {};
    sq[columnIndex] = direction;
    setSortQuery(sq);
  };
  return (
    <div className="table-wrapper">
      <div className="table-container">
      <DataTable className="table">
        <DataTableHead>
          <DataTableRow>
            {props.headerData.map((header, index) => {
              return props.searchableColumns.length !== 0 && props.searchableColumns.includes(index) ? (
                <DataTableColumnHeader
                  name={header}
                  sortDirection={
                    Object.keys(sortQuery).includes(index.toString())
                      ? sortQuery[index.toString()]
                      : "default"
                  }
                  onSortIconClick={(value) => sortHandler(index, value.direction)}
                  filter={
                    <Input
                      dense
                      placeholder="Search"
                      name="firstName"
                      onChange={(event) => setSearchQuery(event.value)}
                      value={searchQuery}
                    />
                  }
                  onFilterIconClick={(event) => {
                    if (event.show) {
                      setSearchColumn(index)
                      setSearchQuery("")
                    }else{
                      setSearchColumn(-1)
                      setSearchQuery("")
                    }
                  }}
                  showFilter={searchColumn === index}
                  fixed
                  top="0px"
                  key={index}
                >
                  {header}
                </DataTableColumnHeader>
              ) : (
                <DataTableColumnHeader
                  name={header}
                  sortDirection={
                    Object.keys(sortQuery).includes(index.toString())
                      ? sortQuery[index.toString()]
                      : "default"
                  }
                  onSortIconClick={(value) => sortHandler(index, value.direction)}
                  fixed
                  top="0"
                  key={index}
                >
                  {header}
                </DataTableColumnHeader>
              );
            })}
          </DataTableRow>
        </DataTableHead>
        <DataTableBody>
          {tableData.map((dataRow, index) => {
            return (
              <DataTableRow key={index}>
                {dataRow.map((data, index) => {
                  return (
                    <DataTableCell staticStyle key={index}>
                      {data.display}
                    </DataTableCell>
                  );
                })}
              </DataTableRow>
            );
          })}
        </DataTableBody>
      </DataTable>
      </div>
    </div>
  );
}
Table.defaultProps = {
  placeholder: "",
  defaultSortQuery: { 0: "asc" },
  searchableColumns: [],
};
