/** @jest-environment jsdom */
/* eslint-env browser */

const React = require("react");
const ReactDOM = require("react-dom");
const {act} = require("react-dom/test-utils");
const {attach, register} = require("@adobe/uix-guest");
const SelectField = require("../src/aem-cf-editor-1/web-src/src/components/SelectField").default;
const ExtensionRegistration = require("../src/aem-cf-editor-1/web-src/src/components/ExtensionRegistration").default;
const App = require("../src/aem-cf-editor-1/web-src/src/components/App").default;

let mockPickerProps;

jest.mock("@adobe/uix-guest", () => ({
  attach: jest.fn(),
  register: jest.fn(),
}));

jest.mock("@adobe/react-spectrum", () => {
  const React = require("react");
  return {
    Provider: ({children}) => React.createElement("div", null, children),
    View: ({children, minHeight}) => React.createElement("div", {"data-field-container": true, style: {minHeight}}, children),
    defaultTheme: {},
    Item: () => null,
    Picker: (props) => {
      mockPickerProps = props;
      return React.createElement("div", {
        "data-selected-key": props.selectedKey,
        "aria-disabled": props.isDisabled,
      }, props.label);
    },
  };
});

jest.mock("../src/aem-cf-editor-1/web-src/src/components/HiddenField", () => () => null);
jest.mock("../src/aem-cf-editor-1/web-src/src/components/CustomModal", () => () => null);

const repository = "author-p127204-e1900935.adobeaemcloud.com";
const modelPath = "/conf/global/settings/dam/cfm/models/cf-model-select";
let container;
let connection;
let api;
let values;
let styles;
let consoleError;
const originalParent = Object.getOwnPropertyDescriptor(window, "parent");

beforeEach(() => {
  jest.clearAllMocks();
  mockPickerProps = undefined;
  container = document.createElement("div");
  document.body.appendChild(container);
  Object.defineProperty(window, "parent", {configurable: true, value: {}});
  window.history.replaceState(null, "", `/?repo=${repository}`);
  consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
  values = {field0: "1", field1: "first text", field2: "second text"};
  styles = {};
  api = {
    setStyles: jest.fn(async (name, style) => { styles[name] = style; }),
    setValue: jest.fn(async (name, value) => { values[name] = value; }),
  };
  connection = {
    host: {
      dataApi: {get: jest.fn(async () => api)},
      field: {
        getModel: jest.fn(async () => ({
          name: "field0",
          fieldLabel: "Choose a field",
          required: false,
          options: [{name: "Field1", value: "1"}, {name: "Field2", value: "2"}],
        })),
        getDefaultValue: jest.fn(async () => values.field0),
        onChange: jest.fn(async (value) => { values.field0 = value; }),
      },
    },
  };
  attach.mockResolvedValue(connection);
  register.mockResolvedValue(connection);
});

afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  container.remove();
  Object.defineProperty(window, "parent", originalParent);
  consoleError.mockRestore();
});

async function render(element = React.createElement(SelectField)) {
  await act(async () => { ReactDOM.render(element, container); });
}

async function select(value) {
  await act(async () => { await mockPickerProps.onSelectionChange(value); });
}

describe("conditional field values", () => {
  it.each([
    ["1", "", "none"],
    ["2", "none", ""],
    ["", "none", "none"],
    ["unexpected", "none", "none"],
  ])("initializes %p without modifying any values", async (value, firstDisplay, secondDisplay) => {
    values.field0 = value;
    await render();
    expect(styles).toEqual({field1: {display: firstDisplay}, field2: {display: secondDisplay}});
    expect(mockPickerProps.selectedKey).toBe(value === "1" || value === "2" ? value : null);
    expect(mockPickerProps.label).toBe("Choose a field");
    expect(connection.host.field.onChange).not.toHaveBeenCalled();
    expect(api.setValue).not.toHaveBeenCalled();
    expect(values).toEqual({field0: value, field1: "first text", field2: "second text"});
  });

  it.each([
    ["1", "2", "field1", "field2", "second text"],
    ["2", "1", "field2", "field1", "first text"],
  ])("changes %s to %s and clears only %s", async (initial, next, hidden, visible, retainedText) => {
    values.field0 = initial;
    await render();
    const initialSnapshots = connection.host.dataApi.get.mock.calls.length;
    await select(next);
    expect(connection.host.field.onChange).toHaveBeenCalledWith(next);
    expect(api.setValue).toHaveBeenCalledTimes(1);
    expect(api.setValue).toHaveBeenCalledWith(hidden, "");
    expect(values[visible]).toBe(retainedText);
    expect(values[hidden]).toBe("");
    expect(styles[hidden]).toEqual({display: "none"});
    expect(styles[visible]).toEqual({display: ""});
    expect(mockPickerProps.selectedKey).toBe(next);
    expect(connection.host.dataApi.get.mock.calls.length).toBeGreaterThan(initialSnapshots);
  });

  it.each([null, "unexpected"])("hides and clears both fields after changing to %p", async (next) => {
    await render();
    await select(next);
    expect(connection.host.field.onChange).toHaveBeenCalledWith(next == null ? "" : next);
    expect(api.setValue.mock.calls).toEqual([["field1", ""], ["field2", ""]]);
    expect(styles).toEqual({field1: {display: "none"}, field2: {display: "none"}});
  });

  it("does not clear fields when the same selection is reported again", async () => {
    await render();
    await select("1");
    expect(connection.host.field.onChange).not.toHaveBeenCalled();
    expect(api.setValue).not.toHaveBeenCalled();
  });

  it("reserves body space for the guest SDK to resize the open dropdown", async () => {
    await render();
    const fieldContainer = container.querySelector("[data-field-container]");
    const closedHeight = fieldContainer.style.minHeight;
    await act(async () => { await mockPickerProps.onOpenChange(true); });
    expect(parseFloat(fieldContainer.style.minHeight)).toBeGreaterThan(parseFloat(closedHeight));
    await act(async () => { await mockPickerProps.onOpenChange(false); });
    expect(fieldContainer.style.minHeight).toBe(closedHeight);
  });

  it("prevents overlapping selection changes while host writes are pending", async () => {
    await render();
    let release;
    connection.host.field.onChange.mockImplementationOnce(() => new Promise((resolve) => { release = resolve; }));
    let change;
    await act(async () => { change = mockPickerProps.onSelectionChange("2"); });
    expect(mockPickerProps.isDisabled).toBe(true);
    await select("1");
    expect(connection.host.field.onChange).toHaveBeenCalledTimes(1);
    await act(async () => {
      release();
      await change;
    });
    expect(api.setValue.mock.calls).toEqual([["field1", ""]]);
    expect(mockPickerProps.isDisabled).toBeFalsy();
  });

  it("shows an attachment error instead of silently rendering an unbound picker", async () => {
    attach.mockRejectedValueOnce(new Error("Host unavailable"));
    await render();
    expect(container.querySelector("[role=alert]").textContent).toContain("Host unavailable");
    expect(consoleError).toHaveBeenCalled();
    expect(api.setValue).not.toHaveBeenCalled();
  });

  it("surfaces a host styling failure without clearing values", async () => {
    api.setStyles.mockRejectedValueOnce(new Error("Field unavailable"));
    await render();
    expect(container.querySelector("[role=alert]").textContent).toContain("Field unavailable");
    expect(api.setValue).not.toHaveBeenCalled();
  });

  it("reports a partial write failure without allowing further changes", async () => {
    await render();
    api.setValue.mockRejectedValueOnce(new Error("Clearing failed"));
    await select("2");
    expect(container.querySelector("[role=alert]").textContent).toContain("Clearing failed");
    expect(container.textContent).toContain("some changes may already have been saved");
    expect(container.querySelector("[data-selected-key]")).toBeNull();
  });

  it("does not attach outside the AEM host", async () => {
    Object.defineProperty(window, "parent", {configurable: true, value: window});
    await render();
    expect(container.textContent).toContain("inside the AEM");
    expect(attach).not.toHaveBeenCalled();
  });

  it("does not update component state after an attachment resolves following unmount", async () => {
    let finishAttach;
    attach.mockImplementationOnce(() => new Promise((resolve) => { finishAttach = resolve; }));
    await render();
    act(() => { ReactDOM.unmountComponentAtNode(container); });
    await act(async () => { finishAttach(connection); });
    expect(connection.host.field.getModel).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
  });
});

describe("routing and extension registration", () => {
  it("renders the root route and registers the exact field and model only once", async () => {
    await render(React.createElement(App));
    expect(register).toHaveBeenCalledTimes(1);
    const definitions = register.mock.calls[0][0].methods.field.getDefinitions();
    const definition = definitions.find((rule) => new RegExp(rule.fieldNameExp).test("field0"));
    expect(new RegExp(definition.fieldNameExp).test("field00")).toBe(false);
    expect(new RegExp(definition.modelPathExp).test(modelPath)).toBe(true);
    expect(new RegExp(definition.modelPathExp).test(`${modelPath}-other`)).toBe(false);
    expect(definition.url).toBe("/#/select-field");
    expect(definitions.some((rule) => new RegExp(rule.fieldNameExp).test("isDisabled"))).toBe(true);
    await render(React.createElement(App));
    expect(register).toHaveBeenCalledTimes(1);
  });

  it("renders the custom field route without a missing component reference", async () => {
    window.history.replaceState(null, "", "/#/select-field");
    await render(React.createElement(App));
    expect(attach).toHaveBeenCalledTimes(1);
    expect(mockPickerProps.selectedKey).toBe("1");
    expect(register).not.toHaveBeenCalled();
  });

  it("renders standalone instructions without registering or crashing", async () => {
    Object.defineProperty(window, "parent", {configurable: true, value: window});
    window.history.replaceState(null, "", "/");
    await render(React.createElement(App));
    expect(container.textContent).toContain("dev-mode URL");
    expect(register).not.toHaveBeenCalled();
  });

  it("skips registration for another repository", async () => {
    window.history.replaceState(null, "", "/?repo=another-author");
    await render(React.createElement(ExtensionRegistration));
    expect(register).not.toHaveBeenCalled();
    expect(container.textContent).toContain("supported repository");
  });

  it("surfaces registration failures", async () => {
    register.mockRejectedValueOnce(new Error("Registration failed"));
    await render(React.createElement(ExtensionRegistration));
    expect(container.querySelector("[role=alert]").textContent).toContain("Registration failed");
    expect(consoleError).toHaveBeenCalled();
  });
});
