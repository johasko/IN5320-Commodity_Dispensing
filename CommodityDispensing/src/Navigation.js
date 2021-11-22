import React from "react";
import {
    Menu,
    MenuItem,
    IconTable24,
    IconImportItems24,
    IconExportItems24
} from "@dhis2/ui";
import "./styles.css";
import classes from "./App.module.css";

/**
 * A navigation module used to display the top navigagtion panels
 * args/props: activePage(useState) The current use-state.
 *             activePageHandler(function) Updates the active page with curently being used. 
 * returns: Menu / MenuItems with tabs for navigation 
 */
export function Navigation(props) {
    return (
        <Menu className={classes.menu + " menu"}>
            <MenuItem
                className={classes.menuitem}
                label="Overview"
                active={props.activePage == "Overview"}
                onClick={() => props.activePageHandler("Overview")}
                icon={<IconTable24/>}
            />
            <MenuItem
                className={classes.menuitem}
                label="Dispensing"
                active={props.activePage == "Dispensing"}
                onClick={() => props.activePageHandler("Dispensing")}
                icon={<IconExportItems24/>}
            />
            <MenuItem
                className={classes.menuitem}
                label="Restock"
                active={props.activePage == "Restock"}
                onClick={() => props.activePageHandler("Restock")}
                icon={<IconImportItems24/>}
            />
        </Menu>
    );
}
