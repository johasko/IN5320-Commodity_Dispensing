import React, { useState } from "react";
import "../styles.css";
import {
    TabBar,
    Tab,
    IconImportItems24,
    IconVisualizationLine16,
} from "@dhis2/ui";
import { RestockCommodities } from "./RestockCommodities";
import { RestockLog } from "./RestockLog";

/* 
* Creates a restockTabs component whics displays tabs for the Restock part of the solution
* props/args: props.me (object) Data from the merged data from the maindataquery
* Returns: a finshed restockTabs component containing  RestockCommodities and RestockLog components
*/
export function RestockTabs(props){
    const [tab, selectTab] = useState("commodities");

    return(
    <>
        <div className="restock-history">
            <TabBar>
                <Tab icon={<IconImportItems24/>} selected={tab === "commodities"} onClick={() => selectTab("commodities")} >
                    Restock Commodities
                </Tab>
                <Tab icon={<IconVisualizationLine16/>} selected={tab === "log"} onClick={() => selectTab("log")} >
                    Restock Log
                </Tab>
            </TabBar>
        </div>
        {(tab === "commodities")?(
            <RestockCommodities me={props.me}></RestockCommodities> 
        ):(
            <div>
                <RestockLog> </RestockLog>
            </div>
        )}
    </>
);

}