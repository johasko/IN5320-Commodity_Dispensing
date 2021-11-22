import React, { useState } from "react";
import "../styles.css";
import {
    TabBar,
    Tab,
    IconExportItems24,
    IconVisualizationLine16,
} from "@dhis2/ui";
import { DispensingCommodities } from "./DispensingCommodities";
import { DispensingLog } from "./DispensingLog";

/* 
Creates a DispenseTabs component whics displays tabs for the dispensing part of the solution
props/args: props.me (object) Data from the merged data from the maindataquery
Returns: a finshed DispenseTabs component
*/
export function DispenseTabs(props){
    const [tab, selectTab] = useState("commodities");

    return(
    <>
        <div className="Dispense-history">
            <TabBar>
                <Tab icon={<IconExportItems24/>} selected={tab === "commodities"} onClick={() => selectTab("commodities")} >
                    Dispense Commodities
                </Tab>
                <Tab icon={<IconVisualizationLine16/>} selected={tab === "log"} onClick={() => selectTab("log")} >
                    Dispensing Log
                </Tab>
            </TabBar>
        </div>
        {(tab === "commodities")?(
        <DispensingCommodities me={props.me}></DispensingCommodities> 
        ):(
            <DispensingLog> </DispensingLog>
        )}
    </>
);

}