
import {useEffect, useState} from "react";
import {attach} from "@adobe/uix-guest";
import {extensionId} from "./Constants";
import {InlineAlert, Heading, Content, Flex} from "@adobe/react-spectrum";

export default function () {
    const [guestConnection, setGuestConnection] = useState();

    useEffect(() => {
        const init = async () => {
            // connect to the host (ie. CF Editor)
            const conn = await attach({ id: extensionId });
            setGuestConnection(conn);

            // get model
            const model = await conn.host.field.getModel();

            // configure validation state subscriber
            //await conn.host.field.onValidationStateChange((state) => setValidationState(state));

            // get default value
            const defaultValue = await conn.host.field.getDefaultValue();
        }

        init().catch(console.error);
    }, []);

    // Custom fileld will be display instead of original one
    return (
    <Flex height="size-1500" width="100%" direction="column" gap="size-150">
      <InlineAlert>
      <Heading>Indexing Info</Heading>
      <Content>
        TO BE IMPLEMENTED
      </Content>
    </InlineAlert>
      </Flex>
    );
}