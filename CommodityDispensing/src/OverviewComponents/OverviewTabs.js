import React, { useState } from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import "../styles.css";
import {
    TabBar,
    Tab,
    IconHome16,
    IconWorld16,
    CircularLoader
} from "@dhis2/ui";
import { OverviewInternal } from "./OverviewInternal";
import { OverviewExternal } from "./OverviewExternal"
import { fetchHospitalDataQuery } from "./API/dataQueries";


/* 
* Creates a overviewTabs component whics displays tabs for the overview part of the solution
* props/args: props.me (object) Data from the merged data from the maindataquery
* Returns: a finshed overviewTabs component
*/
export function OverviewTabs(props){
    const [tab, selectTab] = useState("overview");
    const { loading, error, data } = useDataQuery(fetchHospitalDataQuery());
    if (error){
      return (
        <>
          <h1>Oh no!! Something went wrong here. -
                    Please ensure that your connection is stable.</h1>
          <span>ERROR: {error.message}</span>
        </>
      );
    }
    if (loading){
      return (
        <div className="loader-container">
          <CircularLoader large />
        </div>
      );
    }
    if (data){
      const hospitals = []
      data.dataQueryData.children.map((hospital) => {
        if (hospital.id !== props.me.orgUnit) hospitals.push({name: hospital.displayName, id: hospital.id})
      })
      hospitals.sort((a,b) => {
        if (a.name > b.name){
          return 1
        }if (a.name < b.name){
          return -1
        }
        return 0
      })
      return(
      <>
          <TabBar>
              <Tab icon={<IconHome16/>} selected={tab === "overview"} onClick={() => selectTab("overview")} >
                Bumban MCHP
              </Tab>
              <Tab icon={<IconWorld16/>} selected={tab === "external"} onClick={() => selectTab("external")} >
                Check external stock
              </Tab>
          </TabBar>
          {(tab === "overview")?(
            <OverviewInternal me={props.me}/>
          ):(
            <OverviewExternal me={props.me} hospitals={hospitals}/>
          )}
      </>
      );

    }

}