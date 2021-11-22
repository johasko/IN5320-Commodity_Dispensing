export function fetchCommodityDataQuery(orgUnit, period){
  return({
    dataSets: {
      resource: "dataSets/ULowA8V3ucd",
      params: {
        fields: [
            "dataSetElements[dataElement[name,id,categoryCombo[categoryOptionCombos[name,id]],dataElementGroups[name, id]]]",
        ],
      },
    },
    dataValueSets: {
      resource: "dataValueSets",
      params: {
        orgUnit: orgUnit,
        dataSet: "ULowA8V3ucd",
        period: period
      },
    },
    dispensingDataStoreData: {
        resource: "dataStore/IN5320-G8/Dispensing-History"
    }
  })
}
export function fetchCommodityMutationQuery() {
  return {
      resource: "dataValueSets",
      type: "create",
      dataSet: "ULowA8V3ucd",
      data: ({ lifeCommodityMutation }) => ({
          dataValues: lifeCommodityMutation,
      }),
  };
}
export function fetchDataStoreDataQuery(){
  return {
    dispensingDataStoreData: {
        resource: "dataStore/IN5320-G8/Dispensing-History"
    }
  }
}

export function fetchDataStoreMutationQuery(){
  return({
   resource: "dataStore/IN5320-G8/Dispensing-History",
    type: "update",
    data : (history) => history
  })
}