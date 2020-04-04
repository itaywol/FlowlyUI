import React from "react";
import ReactDOM from "react-dom";

const App = () => <p>Hello, World!</p>;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("./serviceWorker.js").then(
      function (registration) {
        console.log("Service worker registration scope:" + registration.scope);
      },
      function (err) {
        console.log(err);
      }
    );
  });
}

if (module.hot) {
  module.hot.accept();
}

ReactDOM.render(<App />, document.getElementById("root"));
