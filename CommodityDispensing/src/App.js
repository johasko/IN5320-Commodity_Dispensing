import React from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import { CircularLoader } from "@dhis2/ui";
import classes from "./App.module.css";
import { useState } from "react";
import { DispenseTabs } from "./DispensingComponents/DispenseTabs";
import { Navigation } from "./Navigation";
import { RestockTabs } from "./RestockComponents/RestockTabs";
import { OverviewTabs } from "./OverviewComponents/OverviewTabs";
import { fetchMainDataQuery } from "./API/mainDataQuery";


function mergeData(data) {
  const today = new Date();
  let mergedData = {};
  mergedData.currentPeriod = today.getFullYear() + "" + today.getMonth();
  mergedData.orgUnit = "OI0BQUurVFS";
  mergedData.name = data.me.name;
  mergedData.id = data.me.id;
  mergedData.organisationUnit = data.me.organisationUnits[0].id;
  return mergedData;
}

function MyApp() {
  const { loading, error, data } = useDataQuery(fetchMainDataQuery());
  const [activePage, setActivePage] = useState("Overview");

  function activePageHandler(page) {
    setActivePage(page);
  }
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
    const mergedData = mergeData(data);
    console.log(mergedData.currentPeriod);
    return (
      <div className={classes.container}>
        <div className={classes.navcontainer}>
          <Navigation
            activePage={activePage}
            activePageHandler={activePageHandler}
          />
        </div>
        <div className={classes.sectioncontainer}>
          {activePage === "Overview" && <OverviewTabs me={mergedData} />}
          {activePage === "Dispensing" && <DispenseTabs me={mergedData} />}
          {activePage === "Restock" && <RestockTabs me={mergedData} />}
        </div>
      </div>
    );
  }
}

export default MyApp;
