
export function mergeDataStoreData(existingData, newElement, commodityInfo) {
/*
Merges existing data from the datastore with new data being added.
------------------------------------------------------------------
props/args: existingData (object) : The existing data from the datastore
            newElement (object) : a New element to be added to the log in datastore
            commodityInfo (object) : the Commmodity info currently available to parse the dispensed commodities.

Returns: existingData (Object) : the existing data from the data store, with the new historyelement appended.
*/

    Object.values(newElement.commodities).forEach((commodity) => {
        commodityInfo.forEach((info) => {
            if (info.dataElement.id === commodity.commodity) {
                info.dataElement.dataElementGroups.forEach((group) => {
                    if (/Commodities\s.+/.test(group.name)) {
                        commodity["name"] =
                            info.dataElement.name.split(" - ")[1];
                        commodity["categoryName"] =
                            group.name.split("Commodities ")[1];
                    }
                });
            }
        });
        commodity.increasedStock = (parseInt(commodity.value) > 0)
        console.log("Increased stock",commodity.value, commodity.increasedStock)
    });

    existingData.history.unshift(newElement);

    return existingData;
}

export function parseDataStoreData(dataStoreData) {
/*
Parses data from the datastore into an array for display purposes 
------------------------------------------------------------------
props/args: dataStoreData (object) : The data from the datastore to parse

Returns: history (array) : an array of histroyElements representing the DispensingHistroy
*/
    let history = [];
    dataStoreData.history.forEach((order) => {
        let historyElement = {
            date: null,
            commodities: [],
            dispensedBy: null,
            dispensedTo: null,
            dept: null,
            external: null,
            increasedStock: null,
        };

        Object.entries(order).forEach(([key, value]) => {
            historyElement[key] = value;
        });

        history.push(historyElement);
    });

    return history;
}
