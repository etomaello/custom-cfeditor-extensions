import React, {useEffect, useRef, useState} from "react";
import {attach} from "@adobe/uix-guest";
import {Provider, View, Picker, Item, defaultTheme} from "@adobe/react-spectrum";
import {extensionId} from "./Constants";

async function getDataApi(connection) {
  const api = await connection.host.dataApi.get();
  if (!api || ["getFields", "setStyles", "setValue"].some((method) => typeof api[method] !== "function")) {
    throw new Error("The AEM editor does not expose the required Canvas Data API.");
  }
  const fields = await api.getFields();
  if (!Array.isArray(fields) || !["field0", "field1", "field2"].every(
    (name) => fields.some((field) => field.name === name)
  )) {
    throw new Error("The fragment must contain field0, field1, and field2.");
  }
  return api;
}

async function updateDependentFields(api, value, clearHidden) {
  for (const [name, selection] of [["field1", "1"], ["field2", "2"]]) {
    const visible = value === selection;
    await api.setStyles(name, {display: visible ? "" : "none"});
    if (clearHidden && !visible) {
      await api.setValue(name, "");
    }
  }
}

function SelectField() {
  const [connection, setConnection] = useState(null);
  const [model, setModel] = useState(null);
  const [value, setValue] = useState("");
  const [validationState, setValidationState] = useState(null);
  const [pending, setPending] = useState(true);
  const [error, setError] = useState(null);
  const [height, setHeight] = useState(100);
  const active = useRef(false);
  const busy = useRef(true);
  const currentValue = useRef("");
  const hosted = window.parent !== window;

  function reportError(context, error) {
    console.error(context, error);
    if (active.current) {
      setError(`${context} ${error.message || String(error)} Reload the editor before continuing; some changes may already have been saved.`);
    }
  }

  useEffect(() => {
    active.current = true;
    if (!hosted) {
      setPending(false);
      return () => {
        active.current = false;
      };
    }
    const init = async () => {
      const conn = await attach({id: extensionId});
      if (!active.current) {
        return;
      }
      const [fieldModel, defaultValue, validation] = await Promise.all([
        conn.host.field.getModel(),
        conn.host.field.getDefaultValue(),
        conn.host.field.getValidationState(),
      ]);
      if (!Array.isArray(fieldModel.options) || fieldModel.options.some(
        (option) => typeof option.value !== "string" || typeof option.name !== "string"
      )) {
        throw new Error("field0 must provide single-value enumeration options with string values.");
      }
      if (defaultValue != null && typeof defaultValue !== "string") {
        throw new Error("field0 must contain a single string value.");
      }
      if (!active.current) {
        return;
      }
      const initialValue = defaultValue == null ? "" : defaultValue;
      const api = await getDataApi(conn);
      if (!active.current) {
        return;
      }
      await updateDependentFields(api, initialValue, false);
      if (active.current) {
        setValidationState(validation);
      }
      await conn.host.field.onValidationStateChange((state) => {
        if (active.current) {
          setValidationState(state);
        }
      });
      await conn.host.field.setHeight(100);
      if (active.current) {
        currentValue.current = initialValue;
        setConnection(conn);
        setModel(fieldModel);
        setValue(initialValue);
      }
    };
    init().catch((error) => reportError("Unable to initialize field0.", error)).finally(() => {
      busy.current = false;
      if (active.current) {
        setPending(false);
      }
    });
    return () => {
      active.current = false;
    };
  }, [hosted]);

  const onSelectionChange = async (key) => {
    const nextValue = key == null ? "" : String(key);
    if (busy.current || !connection || error || nextValue === currentValue.current) {
      return;
    }
    busy.current = true;
    setPending(true);
    try {
      // Validate the dependent fields before allowing any destructive writes.
      await getDataApi(connection);
      if (!active.current) {
        return;
      }
      await connection.host.field.onChange(nextValue);
      if (!active.current) {
        return;
      }
      currentValue.current = nextValue;
      setValue(nextValue);
      const api = await getDataApi(connection);
      if (active.current) {
        await updateDependentFields(api, nextValue, true);
      }
    } catch (error) {
      reportError("Unable to update conditional fields.", error);
    } finally {
      busy.current = false;
      if (active.current) {
        setPending(false);
      }
    }
  };

  const onOpenChange = async (isOpen) => {
    const nextHeight = isOpen ? Math.min(400, 116 + model.options.length * 40) : 100;
    // The guest SDK also observes body size; reserve space so it cannot shrink an open menu.
    setHeight(nextHeight);
    try {
      await connection.host.field.setHeight(nextHeight);
    } catch (error) {
      reportError("Unable to resize the field dropdown.", error);
    }
  };

  return (
    <Provider theme={defaultTheme}>
      <View padding="size-50" minHeight={height}>
        {!hosted ? (
          <div>Open this field inside the AEM Content Fragment Editor.</div>
        ) : error ? (
          <div role="alert">{error}</div>
        ) : !connection || !model ? (
          <div role="status">Loading field0...</div>
        ) : (
          <Picker
            label={model.fieldLabel}
            isRequired={model.required}
            isDisabled={pending || model.disabled || model.readOnly}
            validationState={validationState === "invalid" ? "invalid" : undefined}
            errorMessage={model.customErrorMsg}
            selectedKey={model.options.some((option) => option.value === value) ? value : null}
            onSelectionChange={onSelectionChange}
            onOpenChange={onOpenChange}
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
