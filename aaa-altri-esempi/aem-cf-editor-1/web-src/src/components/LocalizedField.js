
import {useEffect, useState} from "react";
import {attach} from "@adobe/uix-guest";
import {extensionId} from "./Constants";
import {TextField, Flex, Picker, Item, ActionButton} from "@adobe/react-spectrum";
import Delete from '@spectrum-icons/workflow/Delete';
import {localesConfigurations} from './ExtensionConfigurations';


const LocalizedField = () => {
    const [guestConnection, setGuestConnection] = useState(null);
    const [value, setValue] = useState([]);
    const [name, setName] = useState("");
    const [currentTextInput, setCurrentTextInput] = useState("");
    const [localeOptions, setLocaleOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    let [open, setOpen] = useState(false);
    const localesMap = new Map(localesConfigurations.values.map(i => [i.name, i.label]));

    useEffect(() => {
        const init = async () => {
            // connect to the host (ie. CF Editor)
            const conn = await attach({ id: extensionId });
            setGuestConnection(conn);
        
            // get model
            const fieldModel = await conn.host.field.getModel();
            setName(fieldModel.name);
            console.log("LocalizedField");
           
            // get default value
            const defaultValue = await conn.host.field.getDefaultValue();
            const parsedValue = defaultValue?JSON.parse(defaultValue):[];
           
            setValue([...parsedValue]);
            updatesAvailableLocaleOptions(parsedValue);

            setIsLoading(false);

        }

        init().catch(console.error);
    }, []);

    const updatesAvailableLocaleOptions = async (currentValue) => {
        const filteredLocaleOptions = localesConfigurations.values.filter((locale) => !currentValue.map((item) => item.lang).includes(locale.name));
        setLocaleOptions(filteredLocaleOptions);
    }

    const deleteItem = (lang) => async () => {
        console.log("Delete item: "+lang);
        const newValue = value.filter((item) => item.lang !== lang);
        setValue(newValue);
        const dataApi = await guestConnection.host.dataApi.get();
        dataApi.setValue(name, JSON.stringify(newValue)).then(() => {
            console.log("Data saved");
        }
        ).catch((error) => {
            console.error("Error saving data: ", error);
        });
        updatesAvailableLocaleOptions(newValue);
    }

    const addNewOption = async (selected) => {
        const newValue = [...value, {lang: selected, value: ""}];
        setValue(newValue);
        updatesAvailableLocaleOptions(newValue);

    }

    const updateText = async (newText) => {
        const lang = currentTextInput;
        if (lang) {
            const newValue = value.map((item) => {
                if(item.lang === lang) {
                    return {lang: item.lang, value: newText};
                }
                return item;
            });
            setValue(newValue);
        }
       
    }

    const onInput = async (item) => {
        const lang=item.currentTarget.name;
        setCurrentTextInput(lang);
        
    }

    const saveData = async (item) => {
        const dataApi = await guestConnection.host.dataApi.get();
        dataApi.setValue(name, JSON.stringify(value)).then(() => {
            console.log("Data saved");
        }
        ).catch((error) => {
            console.error("Error saving data: ", error);
        });
        setCurrentTextInput(null);
    }
    // Custom fileld will be display instead of original one
    return (
        <Flex direction="column" gap="size-150" width="100%" height="size-5000" >
            { !isLoading ? (
            <Flex gap="size-300" direction="column">
                <Picker label={name}  align="end" menuWidth="size-3000" height={open ? "size-5000": "auto"} isOpen={open}
                onOpenChange={setOpen} onSelectionChange={(selected) => addNewOption(selected)}>
                    {localeOptions?.map((item) => <Item key={item.name}>{item.label}</Item>)}
                </Picker>
                {value.map((item) => {
                    return (
                        <Flex key={"wrapper"+item.lang} wrap gap="size-300">
                            <TextField onInput={onInput} onBlur={saveData} onChange={updateText} label={localesMap.get(item.lang)} value={item.value} name={item.lang} key={item.lang}></TextField>
                            <ActionButton alignSelf="self-end" onPress={deleteItem(item.lang)}><Delete /></ActionButton>
                        </Flex>
                    );
                })}
            </Flex>
            ): (<></>) 
        }
        </Flex>
    );
}


export default LocalizedField;