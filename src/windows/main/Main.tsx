import React from "react";
import ReactDOM from "react-dom/client";
import MainApp from "./MainApp";
import "../../styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);
