import React from "react";
import ReactDOM from "react-dom";

// Plain old JavaScript class -> no problem
class PojoTest {
  First = () => this.Second();
  Second = () => "Success (PojoTest)";
  render() {
    return this.First();
  }
}

// Component without JSX -> no problem
class ComponentWithoutJsx extends React.Component {
  First = () => React.createElement(this.Second, null);
  Second = () =>
    React.createElement("div", null, "SUCCESS (ComponentWithoutJsx)");

  render() {
    // return this.First();
    return React.createElement(this.First, null);
  }
}

// Component with JSX -> problem
// const Global = () => <div>WORKS (global var)</div>;
class ComponentWithJsx extends React.Component {
  First = () => <this.Second />; // <- problem
  // First = () => <Global />; // <- no problem

  Second = () => <div>SUCCESS (ComponentWithJsx)</div>;

  render() {
    return <this.First />;
  }
}

const pojoTest = new PojoTest();
console.log(pojoTest.render());

ReactDOM.render(<ComponentWithoutJsx />, document.getElementById("test1"));

ReactDOM.render(<ComponentWithJsx />, document.getElementById("test2"));
