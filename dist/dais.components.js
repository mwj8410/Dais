/* global React */
var InputContainer = React.createClass({
  render: function() {
    return (
      <input-container>

        <icon>T</icon>
        <input type="text"></input>
        <hint>hint text</hint>
        <label>Label</label>

        <error-container>
          <error-message>Error message</error-message>
        </error-container>

      </input-container>
    );
  }
});

/* global React */
var CollapsibleContainer = React.createClass({
  render: function() {
    return (
      <collapsible-container>
        <div class="title-wrapper" onclick="this.classList.toggle('open')">Test Title</div>
        <div class="content-wrapper" onclick="debugger">Test Content</div>
      </collapsible-container>
    );
  }
});

/* global React */
var Overlay = React.createClass({
  render: function() {
    return (
      <overlay></overlay>
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
