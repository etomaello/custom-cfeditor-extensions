
import {useEffect, useState} from "react";
import {attach} from "@adobe/uix-guest";
import {extensionId} from "./Constants";
import { useParams} from "react-router-dom";
import {Button, Provider, defaultTheme, InlineAlert, Heading, Content} from "@adobe/react-spectrum";
import { getInfoFromExternalAPI } from '../utils';
import {youtubeMappingConfiguration} from './ExtensionConfigurations';

export default function () {
    const [guestConnection, setGuestConnection] = useState();
    const [sharedContext, setSharedContext] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [cfPath, setCfPath] = useState("");
    const [paramId, setParamId] = useState("");
    const { apiSelector } = useParams();

    useEffect(() => {
        const init = async () => {
            // connect to the host (ie. CF Editor)
            const conn = await attach({ id: extensionId });
            setGuestConnection(conn);
            setSharedContext(conn.sharedContext);
            console.log("setSharedContext");
            console.log(conn.sharedContext);

            const contentFragment = await conn.host.contentFragment.getContentFragment();
            console.log("contentFragment");
            console.log(contentFragment);
            setParamId(contentFragment.main.youtubeId);
            setCfPath(contentFragment.path);
        }

        init().catch(console.error);
    }, []);

    const handlePress = async (v) => {
        await updateInfoWithAPICall(v);
        console.log("Button pressed");
    };

    async function updateInfoWithAPICall(v) {
        setIsLoading(true);
        const apiEndpoint = `${cfPath}.${apiSelector}?id=${paramId}`;
        console.log("Calling  external API with endpoint: " + apiEndpoint);
        const response = await getInfoFromExternalAPI(sharedContext.get('auth'), sharedContext.get('aemHost'), apiEndpoint);
        console.log("UpdateInfoWithAPICall and data from response:");
        console.log(response);
        const mapping = youtubeMappingConfiguration.split(",");
        const data = response?.data;
        console.log(data);
        const updates = [];
        const dataApi = await guestConnection.host.dataApi.get();
        const fields = await dataApi.getFields();
        console.log("fields");
        console.log(fields);
        for (let i = 0; i < mapping.length; i++) {
            const map = mapping[i].split("|");
            const fieldName = map[0].trim();
            const apiKey = map[1].trim();
            const value =data? data[apiKey]:null;
            console.log("Reading type of field " + fieldName);
            fieldToUpdate = fields.find(field => field.name === fieldName);
            if (fieldToUpdate) {
                const type = fieldToUpdate.type;
                const isMultiField = fieldToUpdate.isMultiField;
                if (isMultiField) {
                    console.log("Setting value for field as multifield first element: " + fieldName + " with value: " + value);
                    await dataApi.setValue(fieldName, value, 0);
                } else {
                    if (type === "text-multi") {
                        const contentType = fields.find(field => field.name === fieldName).value?.contentType;
                        contentType = contentType ? contentType : "text/plain";
                        console.log("Setting value for field: " + fieldName + " with value: " + value);
                        await dataApi.setValue(fieldName, {"contentType": contentType, "value": value});
                    } else {
                        console.log("Setting value for field: " + fieldName + " with value: " + value);
                        await dataApi.setValue(fieldName, value);
                    }
                }
            }
            
            
        }
        setIsLoading(false);
    }

    // Custom fileld will be display instead of original one
    return(
    <Provider theme={defaultTheme} colorScheme="light">
        {isLoading ? (
        <InlineAlert>
            <Heading>Loading ...</Heading>
            <Content>
                <p>Loading data from external API...</p>
            </Content>
        </InlineAlert> 
        ):  (<></>) }
        <Button variant="secondary" onPress={handlePress} isDisabled={isLoading}>Get YouTube Info</Button>
    </Provider>
);
}