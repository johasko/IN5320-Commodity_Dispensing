import React, { useState } from "react";
import "../styles.css";
import { CommodityForm } from "../Tools/CommodityForm";
import { useDataQuery, useDataMutation } from "@dhis2/app-runtime";
import { mergeDataStoreData } from "../Tools/HandleDataStoreData";
import { getDateAndTime } from "../Tools/getDateAndTime";
import {
    fetchCommodityDataQuery,
    fetchCommodityMutationQuery,
    fetchRestockDataStoreMutationQuery,
} from "./API/dataQueries";
import {
    ReactFinalForm,
    Button,
    CircularLoader,
    IconAdd24,
    AlertBar,
} from "@dhis2/ui";

/**
* a helper function for mergeing data retrived from API calls,
   to retrive the lifesaving commodity categories and commodities
* props/args: data (object) - Data from a useDataQuery() call
* Returns: categories (js array) - The commodities sorted by category
*/
function mergeData(data) {
    /* */
    let categories = [];
    data.dataSets.dataSetElements.map((d) => {
        let mergeInnerData =
            d.dataElement.categoryCombo.categoryOptionCombos.map((c) => {
                let matchedValue = {};
                try {
                    matchedValue = data.dataValueSets.dataValues.find(
                        (dataValues) => {
                            if (dataValues.dataElement == d.dataElement.id) {
                                if (dataValues.categoryOptionCombo == c.id) {
                                    return true;
                                }
                            }
                        }
                    );
                } catch (error) {
                    matchedValue.value = 0;
                }

                return {
                    name: c.name,
                    id: c.id,
                    value: matchedValue.value,
                };
            });
        d.dataElement.dataElementGroups.map((c) => {
            if (c.id !== "Svac1cNQhRS") {
                const category = categories.filter((e) => e.name === c.name);
                if (category.length === 0) {
                    categories.push({
                        name: c.name,
                        id: c.id,
                        commodities: [
                            {
                                name: d.dataElement.name,
                                id: d.dataElement.id,
                                values: mergeInnerData,
                            },
                        ],
                    });
                } else {
                    category[0].commodities.push({
                        name: d.dataElement.name,
                        id: d.dataElement.id,
                        values: mergeInnerData,
                    });
                }
            }
        });
    });
    return categories;
}

//helper function for comparing elements of mergedData
function compare(a, b) {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
}

/**
 * Creates a RestockCommodities component which functions as a form-container to restock incoming commodities.
 * props/args: props.me (object) - Data from the merged data from the maindataquery,
 *       passed through RestockTabs
 * Returns: a finshed RestockCommodities component
*/
export function RestockCommodities(props) {
    const { Form, Field } = ReactFinalForm;
    const [mutate, { mutateLoading, mutateError }] = useDataMutation(
        fetchCommodityMutationQuery()
    );
    const { loading, error, data, refetch } = useDataQuery(
        fetchCommodityDataQuery(props.me.orgUnit, props.me.currentPeriod)
    );
    const [dataStoreMutate, { mutateDSLoading, mutateDSError }] =
        useDataMutation(fetchRestockDataStoreMutationQuery());

    const [alertInfomration, setAlertInformation] = useState({
        hidden: true,
        success: false,
        warning: false,
        permanent: false,
        message: "",
    });

    // Called when the form is submited
    const formHandler = async (values) => {
        let success = true;

        values.dispensed = values.dispensed.filter(function (obj) {
            return obj.value !== null;
        });
        if (values.dispensed.length === 0) {
            return;
        }

        //Refetching data to get the newest consumption and end balance
        let refetchingData;
        try {
            refetchingData = await refetch();
        } catch {
            return new Promise(function (reject) {
                reject("Could not refetch data");
            });
        }
        const dataValues = refetchingData.dataValueSets.dataValues;

        const lifeCommodityMutation = [];

        values.dispensed.forEach((value) => {
            const endBalance = dataValues.find(function (obj) {
                return (
                    obj.dataElement === value.commodity &&
                    obj.categoryOptionCombo == "rQLFnNXXIL0"
                );
            }).value;
            
            /* End-Balance */
            lifeCommodityMutation.push({
                categoryOptionCombo: "rQLFnNXXIL0",
                dataElement: value.commodity,
                period: props.me.currentPeriod,
                orgUnit: props.me.orgUnit,
                value: parseInt(endBalance) + parseInt(value.value),
            });
    
        });
        //Queries for mutation and fetching of data
        mutate({
            lifeCommodityMutation: lifeCommodityMutation,
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (response) {
                console.log(response);
                success = false;
            });

        if (success) {
            //saves the restocked commodities to Datastore at Restock-log
             let newHistoryElement = {
                date: getDateAndTime(),
                commodities: values.dispensed,
                dispensedBy: props.me.name,
                dispensedTo: values.dispensedTo,
                dept: values.department,
                external: values.external,
            };

            let combindedDataStoreData = mergeDataStoreData(
                refetchingData.restockDataStoreData,
                newHistoryElement,
                refetchingData.dataSets.dataSetElements
            );

            dataStoreMutate({
                history: combindedDataStoreData.history,
            }).then(function (response) {
                if (response.status !== "SUCCESS") {
                    console.log(response);
                }
            });
            
            return new Promise(function(resolve) {
                resolve("Success!");
            });

        } else {
            return new Promise(function (reject) {
                reject("Could not refetch data");
            });
        }
    };
   

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
        mergedData.sort(compare);
        return (
            <section>
                <div className="alert-container">
                    <AlertBar
                        hidden={alertInfomration.hidden}
                        success={alertInfomration.success}
                        warning={alertInfomration.warning}
                        permanent={alertInfomration.permanent}
                        children={alertInfomration.message}
                        onHidden={() =>
                            setAlertInformation({
                                hidden: true,
                                success: false,
                                warning: false,
                                permanent: false,
                                message: "",
                            })
                        }
                    />
                </div>
                <h2> Restock Commodities </h2>
                <Form
                    onSubmit={formHandler}
                    render={({ handleSubmit, form, values }) => {
                        return (
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    try {
                                        handleSubmit()
                                            .then(function (response) {
                                                setAlertInformation({
                                                    hidden: false,
                                                    success: true,
                                                    warning: false,
                                                    permanent: false,
                                                    message:
                                                        "Successfuly restocked the commodity/ies",
                                                });
                                                refetch();
                                                form.restart();
                                            })
                                            .catch(function (response) {
                                                setAlertInformation({
                                                    hidden: false,
                                                    success: false,
                                                    warning: true,
                                                    permanent: false,
                                                    message:
                                                        "Something went wrong: " +
                                                        response,
                                                });
                                            });
                                    } catch {
                                        console.log(
                                            "Not filled out every form"
                                        );
                                    }
                                }}
                            >
                                {values.dispensed
                                    ? values.dispensed.map((c, index) => {
                                          return (
                                              <div
                                                  key={index}
                                                  className="commodity-form"
                                              >
                                                  <CommodityForm
                                                      data={mergedData}
                                                      values={values}
                                                      form={form}
                                                      deleteAble={
                                                          values.dispensed
                                                              .length > 1
                                                      }
                                                      index={index}
                                                      warningValidation={false}
                                                  />
                                              </div>
                                          );
                                      })
                                    : form.change("dispensed[0]", {
                                          category: null,
                                          commodity: null,
                                          value: null,
                                      })}
                                <div className="rc-button-container">
                                    <Button
                                        icon={<IconAdd24 />}
                                        name="Toggled button"
                                        onClick={() => {
                                            form.change(
                                                "dispensed[" +
                                                    values.dispensed.length +
                                                    "]",
                                                {
                                                    category: null,
                                                    commodity: null,
                                                    value: null,
                                                }
                                            );
                                        }}
                                    >
                                        Add Commodity
                                    </Button>
                                    <Button
                                        type="submit"
                                        primary
                                        loading={mutateLoading}
                                    >
                                        Submit form
                                    </Button>
                                </div>
                            </form>
                        );
                    }}
                />
            </section>
        );
    }
}
