/*
 * <license header>
 */

import React from "react";
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import ErrorBoundary from "react-error-boundary";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ExtensionRegistration from "./ExtensionRegistration";
import HiddenField from "./HiddenField";
import ExternalInfoButtonField from "./ExternalInfoButtonField";
import IndexingField from "./IndexingField";
import TableField from "./TableField";
import LocalizedField from "./LocalizedField";
import RailContent from "./RailContent";

function App() {

  return (
    <Provider theme={defaultTheme} colorScheme="light">
    <Router>
      <ErrorBoundary onError={onError} FallbackComponent={fallbackComponent}>
        <Routes>
          <Route index element={<ExtensionRegistration />} />
          <Route
            exact path="index.html"
            element={<ExtensionRegistration />}
          />
          <Route
             path="hidden-field/:hiddenValue"
                        element={<HiddenField/>}
                    />
          <Route
            exact path="externalinfobutton-field/:apiSelector"
                        element={<ExternalInfoButtonField/>}
                    />
          <Route
            exact path="indexing-field"
                        element={<IndexingField/>}
                    />
          <Route
            exact path="table-field/:tableDataConfigurationName"
                        element={<TableField/>}
                    />
           <Route
            exact path="localized-field"
                        element={<LocalizedField/>}
                    />

           <Route
                        exact path="rail/prova"
                        element={<RailContent />}
                    />

          {/* @todo YOUR CUSTOM ROUTES SHOULD BE HERE */}
        </Routes>
      </ErrorBoundary>
    </Router>
    </Provider>
  )

  // Methods

  // error handler on UI rendering failure
  function onError(e, componentStack) {}

  // component to show if UI fails rendering
  function fallbackComponent({ componentStack, error }) {
    return (
      <React.Fragment>
        <h1 style={{ textAlign: "center", marginTop: "20px" }}>
          Phly, phly... Something went wrong :(
        </h1>
        <pre>{componentStack + "\n" + error.message}</pre>
      </React.Fragment>
    );
  }
}

export default App;
