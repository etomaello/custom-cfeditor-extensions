import {useEffect, useState} from "react";
import {attach} from "@adobe/uix-guest";
import {extensionId} from "./Constants";
import {TextField} from "@adobe/react-spectrum";
import {useParams} from "react-router-dom";


const HiddenField = (props) => {
  const [guestConnection, setGuestConnection] = useState(null);
  const [value, setValue] = useState("");
  const [name, setName] = useState("");
  const [label, setLabel] = useState("");

  useEffect(() => {
    const init = async () => {
      const connection = await attach({id: extensionId});
      setGuestConnection(connection);
      let disableFields = false;
      // recupero dati autenticazione e path del CF per chiamata servlet di verifica grants
      const auth = connection.sharedContext.get('auth');
      const imsToken = auth?.imsToken;   // bearer token
      const imsOrg = auth?.imsOrg;      // org id
      const aemHost = connection.sharedContext.get('aemHost');
      const contentFragment = await connection.host.contentFragment.getContentFragment();
      const contentFragmentPath = contentFragment.path;
      // sezione per chiamata recupero email utente
      const profileHeaders = {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        "Authorization": `Bearer ${imsToken}`
      };
      let userID;
      try {
        const profileResponse = await fetch("https://ims-na1.adobelogin.com/ims/profile/v1", {
          method: "POST",
          headers: profileHeaders,
          body: `type=access_token&client_id=exc_app&token=${imsToken}`,
          redirect: "follow"
        });
        const profileResult = await profileResponse.json();
        userID = profileResult.email;
      } catch (error) {
        console.error(error);
      }

      // sezione per chiamata alla servlet di controllo permessi modifica
      const aemRequestHeaders = new Headers();
      aemRequestHeaders.append("Authorization", `Bearer ${imsToken}`);
      const requestOptionsAEM = {
        method: "GET",
        headers: profileHeaders
      };
      //const servletPath = 'https://' + aemHost + '/bin/inps/checkCFGrants.json';
      const servletPath = 'https://' + '5171-37-179-25-30.ngrok-free.app' + '/bin/inps/checkCFGrants.json'; // TEST
      const grantResponse = await fetch(`${servletPath}?cfPath=${contentFragmentPath}&user=${userID}`, requestOptionsAEM);
      if (grantResponse.status !== 200) {
        disableFields = true;
      }

      // settaggio valori e proprietà del campo hidden
      const fieldModel = await connection.host.field.getModel();
      setName(fieldModel.name);
      setLabel(fieldModel.fieldLabel);
      setValue(disableFields);
      console.log(`Ensure saving with the default hidden value ${fieldModel.name}=${disableFields}`);
      const dataApi = await connection.host.dataApi.get();
      try {
        await dataApi.setValue(fieldModel.name, disableFields);
        console.log("Data saved");
      } catch (error) {
        console.error("Error saving data: ", error);
      }
    }
    init().catch(console.error);
  }, []);


  // Customizzazione del campo textfield per mostrare campo hidden
  return <TextField
    label={label}
    value={value}
    name={name}
    isDisabled={true}
    UNSAFE_style={{display: "none"}}
  />;
}

export default HiddenField;
