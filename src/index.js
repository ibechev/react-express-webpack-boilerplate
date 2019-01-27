import "babel-polyfill";
import React from "react";
import { render } from "react-dom";
import App from "./app/App";
import "./app/index.scss";

render(<App />, document.getElementById("root"));
