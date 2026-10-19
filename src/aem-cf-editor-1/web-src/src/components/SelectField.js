import React, {useEffect, useRef, useState} from "react";
import {attach} from "@adobe/uix-guest";
import {Provider, View, Picker, Item, defaultTheme} from "@adobe/react-spectrum";
import {extensionId} from "./Constants";

async function clearHiddenFields(connection, value) {
  const api = await connection.host.dataApi.get();
  for (const [name, selection] of [["field1", "1"], ["field2", "2"]]) {
    if (value !== selection) {
      await api.setValue(name, "");
    }
  }
}

function SelectField() {
  const [connection, setConnection] = useState(null);
  const [model, setModel] = useState(null);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const active = useRef(false);
  const busy = useRef(false);
  const hosted = window.parent !== window;

  function reportError(error) {
    console.error("Conditional field failed:", error);
    if (active.current) {
      setError(error.message || String(error));
    }
  }

  useEffect(() => {
    if (!hosted) {
      return;
    }
    active.current = true;
    const init = async () => {
      const conn = await attach({id: extensionId});
      if (!active.current) {
        return;
      }
      const [fieldModel, defaultValue] = await Promise.all([
        conn.host.field.getModel(),
        conn.host.field.getDefaultValue(),
      ]);
      if (!active.current) {
        return;
      }
      setConnection(conn);
      setModel(fieldModel);
      setValue(defaultValue == null ? "" : defaultValue);
    };
    init().catch(reportError);
    return () => {
      active.current = false;
    };
  }, [hosted]);

  const onSelectionChange = async (key) => {
    const nextValue = key == null ? "" : String(key);
    if (!active.current || busy.current || nextValue === value) {
      return;
    }
    busy.current = true;
    setSaving(true);
    try {
      await connection.host.field.onChange(nextValue);
      if (!active.current) {
        return;
      }
      await clearHiddenFields(connection, nextValue);
      if (active.current) {
        setValue(nextValue);
      }
    } catch (error) {
      reportError(error);
    } finally {
      busy.current = false;
      if (active.current) {
        setSaving(false);
      }
    }
  };

  return (
    <Provider theme={defaultTheme}>
      {/* Reserve menu space for the guest SDK's automatic iframe sizing. */}
      <View padding="size-50" minHeight={open ? 200 : 100}>
        {!hosted ? (
          <div>Open this field inside the AEM Content Fragment Editor.</div>
        ) : error ? (
          <div role="alert">{error} Reload the editor; some changes may already have been saved.</div>
        ) : !connection || !model ? (
          <div role="status">Loading field0...</div>
        ) : (
          <Picker
            label={model.fieldLabel}
            isRequired={model.required}
            isDisabled={saving || model.disabled || model.readOnly}
            selectedKey={model.options.some((option) => option.value === value) ? value : null}
            onSelectionChange={onSelectionChange}
            onOpenChange={setOpen}
            shouldFlip={false}
            width="calc(100% - 16px)"
            items={model.options}
          >
            {(option) => <Item key={option.value}>{option.name}</Item>}
          </Picker>
        )}
      </View>
    </Provider>
  );
}

export default SelectField;
