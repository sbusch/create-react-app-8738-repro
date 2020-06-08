import React from "react";
import ReactDOM from "react-dom";

// eslint-disable-next-line no-unused-vars
const Global = () => <span>GLOBAL</span>;

class App extends React.Component {
  First = () => <this.Second />; // <- problem
  // First = () => <Global />; // <- no problem

  Second = () => <span>SECOND</span>;

  render() {
    return <this.First />;
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
