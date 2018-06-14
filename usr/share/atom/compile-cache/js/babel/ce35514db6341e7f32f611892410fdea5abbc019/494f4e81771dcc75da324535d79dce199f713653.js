Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atom = require('atom');

// eslint-disable-line import/no-extraneous-dependencies

var _reactForAtom = require('react-for-atom');

var _reactForAtom2 = _interopRequireDefault(_reactForAtom);

var _AtomInput = require('./AtomInput');

var _AtomInput2 = _interopRequireDefault(_AtomInput);

'use babel';

var PathRenameForm = (function (_React$Component) {
  _inherits(PathRenameForm, _React$Component);

  function PathRenameForm(props) {
    var _this = this;

    _classCallCheck(this, PathRenameForm);

    _get(Object.getPrototypeOf(PathRenameForm.prototype), 'constructor', this).call(this, props);

    this.onChange = function (path) {
      _this.setState({ path: path });
    };

    this.disposables = new _atom.CompositeDisposable();
    this.state = {
      path: props.previousPath
    };
  }

  _createClass(PathRenameForm, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.disposables.add(atom.commands.add(this.root, {
        'core:confirm': function coreConfirm() {
          return _this2.props.onRename({
            previousPath: _this2.props.previousPath,
            nextPath: _this2.state.path
          });
        },
        'core:cancel': function coreCancel() {
          return _this2.props.onClose();
        }
      }));
      this.atomInput.focus();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _reactForAtom2['default'].createElement(
        'div',
        { ref: function (ref) {
            _this3.root = ref;
          }, className: 'atom-javascript-refactor' },
        _reactForAtom2['default'].createElement(
          'label',
          {
            className: 'icon icon-arrow-right',
            htmlFor: 'atom-javascript-refactor-path-rename-input'
          },
          'Enter the new path for the file.'
        ),
        _reactForAtom2['default'].createElement(_AtomInput2['default'], {
          id: 'atom-javascript-refactor-path-rename-input',
          ref: function (ref) {
            _this3.atomInput = ref;
          },
          initialValue: this.state.path,
          onClose: this.props.onClose,
          onBlur: this.props.onClose,
          onDidChange: this.onChange
        })
      );
    }
  }]);

  return PathRenameForm;
})(_reactForAtom2['default'].Component);

exports['default'] = PathRenameForm;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9saWJyYXJ5L0VtYmVyIHNhdGVsbGl0ZSBwcm9qZWN0cy93cmVhdGhlLWJhc2UvdXNyL3NoYXJlL2F0b20vcGFja2FnZXMvamF2YXNjcmlwdC1yZWZhY3Rvci9saWIvY29tcG9uZW50cy9QYXRoUmVuYW1lRm9ybS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztvQkFHb0MsTUFBTTs7Ozs0QkFDeEIsZ0JBQWdCOzs7O3lCQUNaLGFBQWE7Ozs7QUFMbkMsV0FBVyxDQUFDOztJQWFTLGNBQWM7WUFBZCxjQUFjOztBQVN0QixXQVRRLGNBQWMsQ0FTckIsS0FBWSxFQUFFOzs7MEJBVFAsY0FBYzs7QUFVL0IsK0JBVmlCLGNBQWMsNkNBVXpCLEtBQUssRUFBRTs7U0FzQmYsUUFBUSxHQUFHLFVBQUMsSUFBSSxFQUFhO0FBQzNCLFlBQUssUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxDQUFDLENBQUM7S0FDekI7O0FBdkJDLFFBQUksQ0FBQyxXQUFXLEdBQUcsK0JBQXlCLENBQUM7QUFDN0MsUUFBSSxDQUFDLEtBQUssR0FBRztBQUNYLFVBQUksRUFBRSxLQUFLLENBQUMsWUFBWTtLQUN6QixDQUFDO0dBQ0g7O2VBZmtCLGNBQWM7O1dBaUJoQiw2QkFBRzs7O0FBQ2xCLFVBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUNsQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FDZixJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ1Qsc0JBQWMsRUFBRTtpQkFBTSxPQUFLLEtBQUssQ0FBQyxRQUFRLENBQUM7QUFDeEMsd0JBQVksRUFBRSxPQUFLLEtBQUssQ0FBQyxZQUFZO0FBQ3JDLG9CQUFRLEVBQUUsT0FBSyxLQUFLLENBQUMsSUFBSTtXQUMxQixDQUFDO1NBQUE7QUFDRixxQkFBYSxFQUFFO2lCQUFNLE9BQUssS0FBSyxDQUFDLE9BQU8sRUFBRTtTQUFBO09BQzFDLENBQ0YsQ0FDRixDQUFDO0FBQ0YsVUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUN4Qjs7O1dBTUssa0JBQUc7OztBQUNQLGFBQ0U7O1VBQUssR0FBRyxFQUFFLFVBQUMsR0FBRyxFQUFLO0FBQUUsbUJBQUssSUFBSSxHQUFHLEdBQUcsQ0FBQztXQUFFLEFBQUMsRUFBQyxTQUFTLEVBQUMsMEJBQTBCO1FBQzNFOzs7QUFDRSxxQkFBUyxFQUFDLHVCQUF1QjtBQUNqQyxtQkFBTyxFQUFDLDRDQUE0Qzs7O1NBRzlDO1FBQ1I7QUFDRSxZQUFFLEVBQUMsNENBQTRDO0FBQy9DLGFBQUcsRUFBRSxVQUFDLEdBQUcsRUFBSztBQUFFLG1CQUFLLFNBQVMsR0FBRyxHQUFHLENBQUM7V0FBRSxBQUFDO0FBQ3hDLHNCQUFZLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEFBQUM7QUFDOUIsaUJBQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQUFBQztBQUM1QixnQkFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxBQUFDO0FBQzNCLHFCQUFXLEVBQUUsSUFBSSxDQUFDLFFBQVEsQUFBQztVQUMzQjtPQUNFLENBQ047S0FDSDs7O1NBdkRrQixjQUFjO0dBQVMsMEJBQU0sU0FBUzs7cUJBQXRDLGNBQWMiLCJmaWxlIjoiL2xpYnJhcnkvRW1iZXIgc2F0ZWxsaXRlIHByb2plY3RzL3dyZWF0aGUtYmFzZS91c3Ivc2hhcmUvYXRvbS9wYWNrYWdlcy9qYXZhc2NyaXB0LXJlZmFjdG9yL2xpYi9jb21wb25lbnRzL1BhdGhSZW5hbWVGb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8vIEBmbG93XG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QtZm9yLWF0b20nO1xuaW1wb3J0IEF0b21JbnB1dCBmcm9tICcuL0F0b21JbnB1dCc7XG5cbnR5cGUgUHJvcHMgPSB7XG4gIHByZXZpb3VzUGF0aDogc3RyaW5nLFxuICBvbkNsb3NlOiBGdW5jdGlvbixcbiAgb25SZW5hbWU6IEZ1bmN0aW9uLFxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXRoUmVuYW1lRm9ybSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGF0b21JbnB1dDogQXRvbUlucHV0O1xuICBkaXNwb3NhYmxlczogQ29tcG9zaXRlRGlzcG9zYWJsZTtcbiAgcHJvcHM6IFByb3BzO1xuICByb290OiBIVE1MRGl2RWxlbWVudDtcbiAgc3RhdGU6IHtcbiAgICBwYXRoOiBzdHJpbmcsXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wczogUHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHBhdGg6IHByb3BzLnByZXZpb3VzUGF0aCxcbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZChcbiAgICAgICAgdGhpcy5yb290LCB7XG4gICAgICAgICAgJ2NvcmU6Y29uZmlybSc6ICgpID0+IHRoaXMucHJvcHMub25SZW5hbWUoe1xuICAgICAgICAgICAgcHJldmlvdXNQYXRoOiB0aGlzLnByb3BzLnByZXZpb3VzUGF0aCxcbiAgICAgICAgICAgIG5leHRQYXRoOiB0aGlzLnN0YXRlLnBhdGgsXG4gICAgICAgICAgfSksXG4gICAgICAgICAgJ2NvcmU6Y2FuY2VsJzogKCkgPT4gdGhpcy5wcm9wcy5vbkNsb3NlKCksXG4gICAgICAgIH0sXG4gICAgICApLFxuICAgICk7XG4gICAgdGhpcy5hdG9tSW5wdXQuZm9jdXMoKTtcbiAgfVxuXG4gIG9uQ2hhbmdlID0gKHBhdGg6IHN0cmluZykgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBwYXRoIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHJlZj17KHJlZikgPT4geyB0aGlzLnJvb3QgPSByZWY7IH19IGNsYXNzTmFtZT1cImF0b20tamF2YXNjcmlwdC1yZWZhY3RvclwiPlxuICAgICAgICA8bGFiZWxcbiAgICAgICAgICBjbGFzc05hbWU9XCJpY29uIGljb24tYXJyb3ctcmlnaHRcIlxuICAgICAgICAgIGh0bWxGb3I9XCJhdG9tLWphdmFzY3JpcHQtcmVmYWN0b3ItcGF0aC1yZW5hbWUtaW5wdXRcIlxuICAgICAgICA+XG4gICAgICAgICAgRW50ZXIgdGhlIG5ldyBwYXRoIGZvciB0aGUgZmlsZS5cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPEF0b21JbnB1dFxuICAgICAgICAgIGlkPVwiYXRvbS1qYXZhc2NyaXB0LXJlZmFjdG9yLXBhdGgtcmVuYW1lLWlucHV0XCJcbiAgICAgICAgICByZWY9eyhyZWYpID0+IHsgdGhpcy5hdG9tSW5wdXQgPSByZWY7IH19XG4gICAgICAgICAgaW5pdGlhbFZhbHVlPXt0aGlzLnN0YXRlLnBhdGh9XG4gICAgICAgICAgb25DbG9zZT17dGhpcy5wcm9wcy5vbkNsb3NlfVxuICAgICAgICAgIG9uQmx1cj17dGhpcy5wcm9wcy5vbkNsb3NlfVxuICAgICAgICAgIG9uRGlkQ2hhbmdlPXt0aGlzLm9uQ2hhbmdlfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuIl19