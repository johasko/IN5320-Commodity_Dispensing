import "../styles.css";
import {
    SingleSelectField,
    SingleSelectOption,
    ReactFinalForm,
    createMinNumber,
    InputFieldFF,
    composeValidators,
    hasValue,
    number,
    Button,
    IconDelete16,
    colors,
} from "@dhis2/ui";
/**
 * A form to submit and select commodities for dispensing and restocking
 * args/props:
 *          data (object) merged data from the dispensing or restock Commodities component
            values (object) values from the api and form components
            form (object) handler for the form components, deletebutton and addcommodity button
            deleteAble (boolean) if there is more than one commodity,
                 you should be able to remove it, therefor add delete button if true.
            index () the index of the commodity accesed
            warningValidation (boolean) checks if the user has entered a valid input
* returns:
 */
export function CommodityForm(props) {
    const { Field } = ReactFinalForm;
    const categories = props.data.map((category) => {
        return (
            <SingleSelectOption
                label={category.name.split("Commodities ")[1]}
                value={category.id}
            />
        );
    });
    let commodities;
    let commodityEndBalance;
    if (props.values.dispensed[props.index].category !== null) {
        const categoryIndex = props.data
            .map(function (e) {
                return e.id;
            })
            .indexOf(props.values.dispensed[props.index].category);
        commodities = props.data[categoryIndex].commodities.map((commodity) => {
            if (
                props.values.dispensed.filter(function (e) {
                    if (
                        e.commodity ===
                        props.values.dispensed[props.index].commodity
                    ) {
                        return false;
                    } else return e.commodity === commodity.id;
                }).length === 0
            ) {
                return (
                    <SingleSelectOption
                        label={commodity.name.split("Commodities - ")[1]}
                        value={commodity.id}
                    />
                );
            }
        });
        if (props.values.dispensed[props.index].commodity !== null) {
            const commodityIndex = props.data[categoryIndex].commodities
                .map(function (e) {
                    return e.id;
                })
                .indexOf(props.values.dispensed[props.index].commodity);
            commodityEndBalance =
                props.data[categoryIndex].commodities[commodityIndex].values[2]
                    .value;
        }
    }
    const today = new Date();
    const deliveryDate = new Date(today.getFullYear(), today.getMonth(), 14);

    if (today.getDate() >= 14) {
        if (today.getMonth() == 11) {
            deliveryDate.setFullYear(deliveryDate.getFullYear() + 1);
            deliveryDate.setMonth(1);
        } else {
            deliveryDate.setMonth(deliveryDate.getMonth() + 1);
        }
    }
    const daysUntilDelivery = Math.ceil(
        (deliveryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    /* if (props.values.dispensed[props.index].value > ) */

    return (
        <>
            <Field required name={"dispensed[" + props.index + "].category"}>
                {(field) => (
                    <SingleSelectField
                        required
                        dense
                        label="Category"
                        name={field.input.name}
                        selected={field.input.value}
                        onChange={(category) => {
                            field.input.onChange(category.selected);
                            props.form.change(
                                "dispensed[" + props.index + "].commodity",
                                null
                            );
                            props.form.change(
                                "dispensed[" + props.index + "].value",
                                null
                            );
                        }}
                    >
                        {categories}
                    </SingleSelectField>
                )}
            </Field>
            {props.values.dispensed[props.index].category !== null ? (
                <Field
                    required
                    name={"dispensed[" + props.index + "].commodity"}
                >
                    {(field) => (
                        <SingleSelectField
                            required
                            dense
                            label="Commodity"
                            name={field.input.name}
                            selected={field.input.value}
                            onChange={(commodity) => {
                                field.input.onChange(commodity.selected);
                            }}
                        >
                            {commodities}
                        </SingleSelectField>
                    )}
                </Field>
            ) : (
                <></>
            )}
            {props.values.dispensed[props.index].commodity !== null ? (
                props.warningValidation ? (
                    <>
                        <Field
                            required
                            name={"dispensed[" + props.index + "].value"}
                            label="Amount"
                            type="number"
                            max={commodityEndBalance}
                            min="1"
                            dense
                            helpText={"In stock: " + commodityEndBalance}
                            placeholder={"In stock: " + commodityEndBalance}
                            warning={
                                commodityEndBalance / daysUntilDelivery <
                                props.values.dispensed[props.index].value
                            }
                            validationText={
                                commodityEndBalance / daysUntilDelivery <
                                props.values.dispensed[props.index].value
                                    ? "May overexceed stock depletion rate"
                                    : ""
                            }
                            component={InputFieldFF}
                            validate={composeValidators(
                                hasValue,
                                number,
                                createMinNumber(1)
                            )}
                        />
                    </>
                ) : (
                    <>
                        <Field
                            required
                            name={"dispensed[" + props.index + "].value"}
                            label="Amount"
                            type="number"
                            dense
                            helpText={"In stock: " + commodityEndBalance}
                            placeholder={"In stock: " + commodityEndBalance}
                            component={InputFieldFF}
                            validate={composeValidators(
                                hasValue,
                                number,
                                createMinNumber(1)
                            )}
                        />
                    </>
                )
            ) : (
                <></>
            )}
            {props.deleteAble ? (
                <Button
                    small
                    icon={<IconDelete16 color={colors.red700} />}
                    className="delete-commodity-field-button"
                    onClick={() => {
                        let newValues = [...props.values.dispensed];
                        newValues.splice(props.index, 1);
                        props.form.change("dispensed", newValues);
                    }}
                />
            ) : (
                <></>
            )}
        </>
    );
}
