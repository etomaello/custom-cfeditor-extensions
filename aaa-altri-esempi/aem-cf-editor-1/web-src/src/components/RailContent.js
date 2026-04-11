// RailContent.js

import {useEffect, useState} from "react";
import {attach} from "@adobe/uix-guest";
import {extensionId} from "./Constants";
import {Provider, Button, Text, defaultTheme} from "@adobe/react-spectrum";
import { useParams} from "react-router-dom";

// ...

export default () => {
    const [guestConnection, setGuestConnection] = useState(null);

    useEffect(() => {
        const init = async () => {
            // connect to the host (ie. CF Editor)
            const conn = await attach({ id: extensionId });
            setGuestConnection(conn);
        }

        init().catch(console.error);
    }, []);

    const handlePress = async (v) => {
       const api = await guestConnection.host.dataApi.get();
        const fields = await api.getFields();
        let currentValue = fields[17].value[0];  // 17 is the products field
        console.log("Current value:",fields[17]);
        if (v === 'add') {
            console.log("Calling add");
        let res = await api.setValue('products',
            {contentType:'fragment-reference', 
             model: currentValue.model, 
             status: currentValue.status,
             title:"Vivo Chip", 
             path:'/content/dam/telefonica-vivo-unicom/catalog/product/product-GSC244'
            },0);

        } else if (v === 'change') {
             console.log("Calling change");
             let res= await api.setValue('products',
            {contentType:'fragment-reference', 
             model: currentValue.model, 
             status: currentValue.status,
             title:"Ilimitado Smart Empresas 60GB", 
             path:'/content/dam/telefonica-vivo-unicom/catalog/product/product-SMCRPTE60GB'
            },0);
        }
           
       

        
    };

    return (
         <Provider theme={defaultTheme} colorScheme="light">
            <Text>Click the button to change the product</Text>
            <Button variant="primary" onPress={() => handlePress('change')}>Change Product </Button>
           
         </Provider>
            
    );
};

