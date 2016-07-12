/* global React */
var CollapsibleContainer = React.createClass({
  render: function() {
    return (
      React.createClass('collapsible-container', null, [
        React.createClass('div', {class: "title-wrapper", onclick: "this.classList.toggle('open')"}, ["Test Title"]),
        React.createClass('div', {class: "content-wrapper", onclick: "debugger"}, ["Test Content"])
      ])
    );
  }
});

/* global React */
var InputContainer = React.createClass({
  render: function() {
    return (
      React.createClass('input-container', null, [

        React.createClass('icon', null, ["T"]),
        React.createClass('input', {type: "text"}),
        React.createClass('hint', null, ["hint text"]),
        React.createClass('label', null, ["Label"]),

        React.createClass('error-container', null, [
          React.createClass('error-message', null, ["Error message"])
        ])

      ])
    );
  }
});

/* global React */
var Overlay = React.createClass({
  render: function() {
    return (
      React.createClass('overlay')
    );
  }
});

/* global React ReactDOM */

// define( function (require) {
  // var React = require('react');

  ReactDOM.render(
    React.createElement(InputContainer, null),
    document.getElementById('application-viewport')
  );

// });
