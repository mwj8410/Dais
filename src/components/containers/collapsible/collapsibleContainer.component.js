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
