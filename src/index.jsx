import React from "react";
import ReactDOM from "react-dom";

const Global = () => <span>GLOBAL</span>;

class App extends React.Component {
  First = () => <this.Second />; // <- problem
  // First = () => <Global />; // <- no problem

  Second = () => <span>SECOND</span>;

  render() {
    return <this.First />;
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
