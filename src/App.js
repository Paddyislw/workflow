import React from "react";
import { Provider } from "react-redux";
import { store } from "./Redux/Store";
import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import WorkFlowPage from "./Pages/WorkFlowPage";
import './index.css'

const App = () => {
  return (
    <Provider store={store}>
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<WorkFlowPage />} path="/workflow/:id" />
      </Routes>
    </Provider>
  );
};

export default App;
