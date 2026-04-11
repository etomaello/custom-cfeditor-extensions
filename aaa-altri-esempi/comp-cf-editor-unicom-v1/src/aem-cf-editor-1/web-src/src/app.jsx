/*
 * <license header>
 */

import React from 'react';
import ErrorBoundary from 'react-error-boundary';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ExtensionRegistration from './extension-registration';
import StartDateEcommerce from './components/start-date-ecommerce';
import StatusAemField from './components/status-aem';
import TextFieldExtended from './components/text-field';
import EndDateEcommerce from './components/end-date-ecommerce';
import NumberFieldExtended from './components/number-field';
import DateFieldExtended from './components/date-field';
import JsonViewerField from './components/json-field';

function App() {
  return (
    <Router>
      <ErrorBoundary onError={onError} FallbackComponent={fallbackComponent}>
        <Routes>
          <Route index element={<ExtensionRegistration />} />
          <Route exact path="index.html" element={<ExtensionRegistration />} />
          <Route exact path="/statusAem-field" element={<StatusAemField />} />
          <Route
            exact
            path="/start-date-ecommerce"
            element={<StartDateEcommerce />}
          />
          <Route exact path="/text-field" element={<TextFieldExtended />} />
          <Route exact path="/date-field" element={<DateFieldExtended />} />
          <Route
            exact
            path="/numberField-field"
            element={<NumberFieldExtended />}
          />
          <Route
            exact
            path="/end-date-ecommerce"
            element={<EndDateEcommerce />}
          />
          <Route exact path="/json-field" element={<JsonViewerField />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );

  function onError() {}

  function fallbackComponent({ componentStack, error }) {
    return (
      <React.Fragment>
        <h1 style={{ textAlign: 'center', marginTop: '20px' }}>
          Phly, phly... Something went wrong :(
        </h1>
        <pre>{componentStack + '\n' + error.message}</pre>
      </React.Fragment>
    );
  }
}

export default App;
