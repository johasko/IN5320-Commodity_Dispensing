export function fetchDataQuery(){
  return {
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
      params: ({ orgUnit, period }) => ({
        dataSet: "ULowA8V3ucd",
        orgUnit: orgUnit,
        period: period,
      }),
    }
  }
}

export function fetchHospitalDataQuery(){
  return {
    dataQueryData: {
        resource: "organisationUnits/fwH9ipvXde9?fields=children[displayName,id]",
    },
  };
}
