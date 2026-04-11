
import {useEffect, useState} from "react";
import {attach} from "@adobe/uix-guest";
import {extensionId} from "./Constants";
import {
  Cell, 
  Column, 
  Row, 
  TableView, 
  TableBody, 
  TableHeader, 
  Flex, 
  Button, 
  ButtonGroup, 
  Text, 
  SearchField, 
  DialogContainer, 
  AlertDialog, 
  IllustratedMessage,
  Heading,
  Content
} from '@adobe/react-spectrum'
import Edit from '@spectrum-icons/workflow/Edit';
import Add from '@spectrum-icons/workflow/Add';
import Delete from '@spectrum-icons/workflow/Delete';
import EditDialog from "./TableFieldEditDialog";
import { useParams} from "react-router-dom";
import {tableDataConfigurations} from './ExtensionConfigurations';

const TableField = (props) => {
    const [guestConnection, setGuestConnection] = useState();
    const [value, setValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const { tableDataConfigurationName } = useParams();
    const headers = tableDataConfigurations[tableDataConfigurationName].headers;
    const rowKey = tableDataConfigurations[tableDataConfigurationName].rowKey;
    const [rows, setRows] = useState([]);
    let [dialog, setDialog] = useState(null);
    const [selectedKeys, setSelectedKeys] = useState(new Set());
    const [selectedItem, setSelectedItem] = useState({});

    useEffect(() => {
        const init = async () => {
            // connect to the host (ie. CF Editor)
            const conn = await attach({ id: extensionId });
            setGuestConnection(conn);
           
            
            
            // get model
            const fieldModel = await conn.host.field.getModel();
            const name = fieldModel.name;

            // get default value
            const defaultValue = await conn.host.field.getDefaultValue();
      
            const parsedValue = defaultValue?JSON.parse(defaultValue):{"rows":[]};
            setValue(parsedValue);
            setRows(parsedValue.rows);
            setIsLoading(false);
        }

        init().catch(console.error);
    }, []);

    
    const searchHandler = async (v) => {
      console.log("Search value: "+v);
      setSearchValue(v)
      if (v) {
        const filteredRows = rows.filter((row) => {
          return Object.values(row).some((cell) => {
            return cell.toString().toLowerCase().includes(v.toLowerCase());
          });
        });
        setRows(filteredRows);
      } else {
        //reset to original rows
        setRows(value.rows);
      }
     
    };

    const selectionHandler = async (v) => {
      setSelectedKeys(v);
    }

    const dismissDialog = async () => {
      setSelectedKeys(new Set());
      setSelectedItem({});
      setDialog(null);
    }

    const openEdit = async () => {

      if (!selectedKeys || selectedKeys.size > 1 || selectedKeys.size === 0) {
        setDialog('alert');
        setAlertTitle('Error');
        setAlertMessage('Please select only one row to edit.');
        return;
      } else {
        setSelectedItem(value.rows.find((row) => row[rowKey]===selectedKeys.currentKey));
        setDialog('edit')
      }
      
    }

    const openAdd = async () => {
        setSelectedKeys(new Set());
        setSelectedItem({});
        setDialog('add')
    }

    const deleteData = async () => {
      if (!selectedKeys || selectedKeys.size === 0) {
        return;
      } else {
        console.log("Deleting selected items");
        console.log(selectedKeys);
        updatedRows = value.rows.filter((row) => !selectedKeys.has(row[rowKey]));
        updateData(updatedRows);
        dismissDialog();
      }
    }

    const updateData = async (updatedRows) => {
      const updatedValue = {
        rows: updatedRows,
      };
      setValue(updatedValue);
      setRows(updatedRows);
      await saveDataToAEM(updatedValue);
    }

    const editCallback = async (newItem, oldItem) => {
      if (newItem) {
        console.log("item to update");
        console.log(newItem);
        const updatedRows = [];
        if (!oldItem) {
          // callback from add dialog
          console.log("Adding new item");
          updatedRows = [...value.rows, newItem];
        } else {
          // callback from edit dialog
          for (let i = 0; i < value.rows.length; i++) {
            if (value.rows[i][rowKey] === oldItem[rowKey]) {
              console.log("putting new item");
              updatedRows.push(newItem);
            } else  {  
              updatedRows.push(value.rows[i]);
            }
          }
        }
      updateData(updatedRows);
      } else {
        console.log("No new item to update");
      }
      dismissDialog();
    }

    const saveDataToAEM = async (newValue) => {
      console.log("Saving data to AEM");
      console.log(newValue);
      const dataApi = await guestConnection.host.dataApi.get();
      dataApi.setValue("content", JSON.stringify(newValue)).then(() => {
        console.log("Data saved");
      }
      ).catch((error) => {
        console.error("Error saving data: ", error);
      });

    }
    const renderEmptyState = () => {
      return (
        <IllustratedMessage>
          <Heading>No results</Heading>
          <Content>No results found</Content>
        </IllustratedMessage>
      );
    }

   return ( <>
      { !isLoading ? ( 
        <Flex height="size-5000" width="100%" direction="column" gap="size-150">
          <Flex gap="size-300">
          <ButtonGroup overflowMode="collapse" marginStart="size-200" marginTop="size-500" marginBottom="size-500" staticColor="white">
            <Button variant="secondary" onPress={openAdd}>
              <Add />
              <Text>Add</Text>
            </Button>
            <Button style="fill" variant="primary" onPress={openEdit} isDisabled={!selectedKeys || selectedKeys.size === 0 || selectedKeys.size > 1}>
              <Edit />
              <Text>Edit</Text>
            </Button>
            <Button variant="negative" isDisabled={!selectedKeys || selectedKeys.size === 0} onPress={() => setDialog('delete')}>
              <Delete />
              <Text>Delete</Text>
            </Button>
          </ButtonGroup>
          <DialogContainer onDismiss={dismissDialog} isDismissable type="modal">
            {dialog === 'edit' &&
              <EditDialog fields={headers} item={selectedItem} callback={editCallback}/>}

            {dialog === 'add' &&
              <EditDialog fields={headers} isAdd={true} callback={editCallback}/>}

            {dialog === 'delete' &&
              <AlertDialog variant="confirmation"
                title="Confirm Delete">
                Are you sure you want to delete selected items?
                <ButtonGroup marginTop="size-500">
                  <Button variant="secondary" onPress={dismissDialog}>Cancel</Button>
                  <Button variant="accent" onPress={deleteData}>Confirm</Button>
                </ButtonGroup>
              </AlertDialog>

        }
          </DialogContainer>
          <SearchField labelPosition="side" labelAlign="end" marginTop="size-500" width="size-2400"
        value={searchValue}
        onChange={searchHandler}
        label="Search" />
          </Flex>
          <TableView height={rows?.length > 0 ?"auto":"size-3000"} selectionMode="multiple" selectedKeys={selectedKeys} onSelectionChange={selectionHandler}  renderEmptyState={renderEmptyState}>
            <TableHeader>
              {headers?.map((header) => (
                <Column
                  key={header?.name}
                  >{header.label}</Column>
              ))}
              
            </TableHeader>
            <TableBody>
              {rows?.map((item) => ( 
                <Row key={item[rowKey]}>
                  {headers?.map((header) => (
                    <Cell key={header?.name + "__" +item[rowKey]}>
                      {item[header.name]}
                    </Cell>
                  ))}
                </Row>
              ))}
            </TableBody>
          </TableView>
        </Flex>
      ): (<></>) }
    </>);
    
    
}
export default TableField;