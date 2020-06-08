import React from "react";
import ReactDOM from "react-dom";

const Global = () => <span>WORKS (global var)</span>;

class App extends React.Component {
  First = () => <this.Second />; // <- problem
  // First = () => <Global />; // <- no problem

  Second = () => <span>WORKS (class property)</span>;

  render() {
    return <this.First />;
  }
}

class Test {
  First = () => this.Second();

  Second = () => 'WORKS (non JSX version)';

  render() {
    return this.First();
  }
}

const t = new Test();
console.log(t.render());

ReactDOM.render(<App />, document.getElementById("root"));
