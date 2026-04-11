
import {useEffect, useState} from "react";

import {Button, ButtonGroup,Form, useDialogContainer, Dialog, Heading, Divider, TextField, Content } from '@adobe/react-spectrum'



const EditDialog = (props) => {

  // This hook allows us to dismiss the dialog when the user
  // presses one of the buttons (below).
  let dialog = useDialogContainer();

  let fields = props.fields;
  let selectedItem = props.item;
  let callBack = props.callback;
  const isAdd = props.isAdd;

  const [item, setItem] = useState({...selectedItem});


  const updateValue = async (value, fieldName) => {
    if (isAdd && !item) {
      item = {};
    }
    item[fieldName] = value;
    setItem(item);
  }

  const submitFormAndClose = async (e) => {

    await callBack(item , selectedItem);
  }

  const resetHandler = async (e) => {

    setItem(selectedItem);
    await callBack(null, selectedItem);
  }

  return (
    <Dialog>
      <Heading>Edit</Heading>
      <Divider />
      <Content>
        <Form  validationBehavior="native" labelPosition="side" width="100%" onSubmit={ (e) => {
        e.preventDefault();
        submitFormAndClose(e);
      }}
      onReset={(e) => resetHandler(e)}>
            {
            fields.map((field) => {
              return (
                <TextField
                  key={field.name}
                  label={field.label}
                  defaultValue={!isAdd && selectedItem[field.name]}
                  name={field.name}
                  onChange={(value) => updateValue(value, field.name)}
                />
              )
            })}

            <ButtonGroup>
                <Button variant="secondary" type="reset">Cancel</Button>
                <Button variant="accent" type="submit">Save</Button>
            </ButtonGroup>
        </Form>
      </Content>
      
    </Dialog>
  );
}

export default EditDialog;