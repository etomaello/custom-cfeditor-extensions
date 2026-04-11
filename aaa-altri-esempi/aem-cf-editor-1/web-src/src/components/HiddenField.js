
import {useEffect, useState} from "react";
import {attach} from "@adobe/uix-guest";
import {extensionId} from "./Constants";
import {TextField} from "@adobe/react-spectrum";
import { useParams} from "react-router-dom";


const HiddenField = (props) => {
    const [guestConnection, setGuestConnection] = useState(null);
    const [value, setValue] = useState("");
    const [name, setName] = useState("");
    const [label, setLabel] = useState("");
    const { hiddenValue } = useParams();

    useEffect(() => {
        const init = async () => {
            // connect to the host (ie. CF Editor)
            const connection = await attach({ id: extensionId });
            setGuestConnection(connection);
            

            const defaultValue = await connection.host.field.getDefaultValue();
            const fieldModel = await connection.host.field.getModel();

            setName(fieldModel.name);
            setLabel(fieldModel.fieldLabel);
            setValue(defaultValue?defaultValue:hiddenValue);

            if (!defaultValue || defaultValue === "") {
                // ensure to set the default hidden value
                console.log("Ensure saving with the default hidden value "+fieldModel.name+"="+hiddenValue);
                const dataApi = await connection.host.dataApi.get();
                dataApi.setValue(fieldModel.name,hiddenValue).then(() => {
                    console.log("Data saved");
                }
                ).catch((error) => {
                    console.error("Error saving data: ", error);
                });
            }
        }

        init().catch(console.error);
    }, []);


    // Custom fileld will be display instead of original one
    return <TextField
    label={label}
    value={value}
    name={name}
    isDisabled={true}
    UNSAFE_style={{ display: "none" }}
  />;
}

export default HiddenField;