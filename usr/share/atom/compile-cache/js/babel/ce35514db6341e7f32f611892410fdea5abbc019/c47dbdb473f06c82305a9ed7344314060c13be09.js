Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = StatusBarIndicator;

var _reactForAtom = require('react-for-atom');

'use babel';

function StatusBarIndicator(_ref) {
  var refactorInProgress = _ref.refactorInProgress;

  if (refactorInProgress) {
    var iconStyle = {
      display: 'inline-block',
      marginRight: 4,
      verticalAlign: 'text-bottom'
    };

    return _reactForAtom.React.createElement(
      'div',
      null,
      _reactForAtom.React.createElement('span', {
        className: 'loading loading-spinner-tiny',
        style: iconStyle
      }),
      _reactForAtom.React.createElement(
        'span',
        null,
        'Refactor in progress…'
      )
    );
  }

  return null;
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9saWJyYXJ5L0VtYmVyIHNhdGVsbGl0ZSBwcm9qZWN0cy93cmVhdGhlLWJhc2UvdXNyL3NoYXJlL2F0b20vcGFja2FnZXMvamF2YXNjcmlwdC1yZWZhY3Rvci9saWIvY29tcG9uZW50cy9TdGF0dXNCYXJUaWxlQ29tcG9uZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztxQkFTd0Isa0JBQWtCOzs0QkFOcEIsZ0JBQWdCOztBQUh0QyxXQUFXLENBQUM7O0FBU0csU0FBUyxrQkFBa0IsQ0FBQyxJQUE2QixFQUFFO01BQTdCLGtCQUFrQixHQUFwQixJQUE2QixDQUEzQixrQkFBa0I7O0FBQzdELE1BQUksa0JBQWtCLEVBQUU7QUFDdEIsUUFBTSxTQUFTLEdBQUc7QUFDaEIsYUFBTyxFQUFFLGNBQWM7QUFDdkIsaUJBQVcsRUFBRSxDQUFDO0FBQ2QsbUJBQWEsRUFBRSxhQUFhO0tBQzdCLENBQUM7O0FBRUYsV0FDRTs7O01BQ0U7QUFDRSxpQkFBUyxFQUFDLDhCQUE4QjtBQUN4QyxhQUFLLEVBQUUsU0FBUyxBQUFDO1FBQ2pCO01BQ0Y7Ozs7T0FBeUM7S0FDckMsQ0FDTjtHQUNIOztBQUVELFNBQU8sSUFBSSxDQUFDO0NBQ2IiLCJmaWxlIjoiL2xpYnJhcnkvRW1iZXIgc2F0ZWxsaXRlIHByb2plY3RzL3dyZWF0aGUtYmFzZS91c3Ivc2hhcmUvYXRvbS9wYWNrYWdlcy9qYXZhc2NyaXB0LXJlZmFjdG9yL2xpYi9jb21wb25lbnRzL1N0YXR1c0JhclRpbGVDb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLy8gQGZsb3dcbmltcG9ydCB7IFJlYWN0IH0gZnJvbSAncmVhY3QtZm9yLWF0b20nO1xuXG50eXBlIFByb3BzID0ge1xuICByZWZhY3RvckluUHJvZ3Jlc3M6IGJvb2xlYW5cbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU3RhdHVzQmFySW5kaWNhdG9yKHsgcmVmYWN0b3JJblByb2dyZXNzIH06IFByb3BzKSB7XG4gIGlmIChyZWZhY3RvckluUHJvZ3Jlc3MpIHtcbiAgICBjb25zdCBpY29uU3R5bGUgPSB7XG4gICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICAgIG1hcmdpblJpZ2h0OiA0LFxuICAgICAgdmVydGljYWxBbGlnbjogJ3RleHQtYm90dG9tJyxcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxzcGFuXG4gICAgICAgICAgY2xhc3NOYW1lPVwibG9hZGluZyBsb2FkaW5nLXNwaW5uZXItdGlueVwiXG4gICAgICAgICAgc3R5bGU9e2ljb25TdHlsZX1cbiAgICAgICAgLz5cbiAgICAgICAgPHNwYW4+UmVmYWN0b3IgaW4gcHJvZ3Jlc3MmaGVsbGlwOzwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cbiJdfQ==