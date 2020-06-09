import React from "react";
import ReactDOM from "react-dom";

const Global = () => <span>WORKS (global var)</span>;

class App extends React.Component {
  First = () => <this.Second />; // <- problem
  // First = () => <Global />; // <- no problem

  Second = () => <span>WORKS (JSX)</span>;

  render() {
    return <this.First />;
  }
}

class App2 extends React.Component {
  // First = () => this.Second();
  // Second = () => "WORKS (non JSX version)";

  First = () => React.createElement(this.Second, null); // this.Second();
  Second = () => React.createElement('span', null, "WORKS (non JSX version)");

  render() {
    // return this.First();
    return React.createElement(this.First, null);
  }
}

// const t = new Test();
// console.log(t.render());

ReactDOM.render(<App2 />, document.getElementById("root2"));

ReactDOM.render(<App />, document.getElementById("root"));
