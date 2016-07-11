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
