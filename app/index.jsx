import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import ReactDOM from "react-dom";
import Dashboard from "./components/Dashboard";

const App = () => {
  return <div className="container-fluid"><Dashboard /></div>;
};

ReactDOM.render(<App />, document.getElementById("app"));