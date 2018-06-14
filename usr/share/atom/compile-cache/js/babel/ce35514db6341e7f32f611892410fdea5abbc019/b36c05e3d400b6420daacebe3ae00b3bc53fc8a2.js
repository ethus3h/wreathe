Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint-disable */

// pulled from https://raw.githubusercontent.com/facebook/nuclide/master/pkg/nuclide-ui/lib/AtomInput.js
// current npm version is not compatable with React 15
/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _atom = require('atom');

// eslint-disable-line import/no-extraneous-dependencies

var _reactForAtom = require('react-for-atom');

'use babel';var PropTypes = _reactForAtom.React.PropTypes;

/**
 * An input field rendered as an <atom-text-editor mini />.
 */

var AtomInput = (function (_React$Component) {
  _inherits(AtomInput, _React$Component);

  _createClass(AtomInput, null, [{
    key: 'defaultProps',
    value: {
      disabled: false,
      initialValue: '',
      tabIndex: '0', // Default to all <AtomInput /> components being in tab order
      onClick: function onClick() {},
      onDidChange: function onDidChange() {},
      onFocus: function onFocus() {},
      onBlur: function onBlur() {},
      unstyled: false
    },
    enumerable: true
  }, {
    key: 'propTypes',
    value: {
      className: PropTypes.string,
      disabled: PropTypes.bool,
      initialValue: PropTypes.string,
      onBlur: PropTypes.func,
      onCancel: PropTypes.func,
      onClick: PropTypes.func,
      onConfirm: PropTypes.func,
      onDidChange: PropTypes.func,
      onFocus: PropTypes.func,
      placeholderText: PropTypes.string,
      size: PropTypes.number,
      tabIndex: PropTypes.string,
      unstyled: PropTypes.bool,
      width: PropTypes.number
    },
    enumerable: true
  }]);

  function AtomInput(props) {
    var _this = this;

    _classCallCheck(this, AtomInput);

    _get(Object.getPrototypeOf(AtomInput.prototype), 'constructor', this).call(this, props);

    this._onBlur = function (event) {
      if (event.relatedTarget === _this.root || event.target === _this.root) {
        return;
      }

      _this.props.onBlur(event);
    };

    this.state = {
      value: props.initialValue
    };
  }

  _createClass(AtomInput, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var disposables = this.disposables = new _atom.CompositeDisposable();

      // There does not appear to be any sort of infinite loop where calling
      // setState({value}) in response to onDidChange() causes another change
      // event.
      var textEditor = this.getTextEditor();
      var textEditorElement = this.getTextEditorElement();
      disposables.add(atom.commands.add(textEditorElement, {
        'core:confirm': function coreConfirm() {
          if (_this2.props.onConfirm != null) {
            _this2.props.onConfirm();
          }
        },
        'core:cancel': function coreCancel() {
          if (_this2.props.onCancel != null) {
            _this2.props.onCancel();
          }
        }
      }));
      var placeholderText = this.props.placeholderText;
      if (placeholderText != null) {
        textEditor.setPlaceholderText(placeholderText);
      }
      this.getTextEditorElement().setAttribute('tabindex', this.props.tabIndex);
      if (this.props.disabled) {
        this.updateDisabledState(true);
      }

      // Set the text editor's initial value and keep the cursor at the beginning of the line. Cursor
      // position was documented in a test and is retained here after changes to how text is set in
      // the text editor. (see focus-related spec in AtomInput-spec.js)
      this.setText(this.state.value);
      this.getTextEditor().moveToBeginningOfLine();

      // Begin listening for changes only after initial value is set.
      disposables.add(textEditor.onDidChange(function () {
        _this2.setState({ value: textEditor.getText() });
        _this2.props.onDidChange.call(null, textEditor.getText());
      }));

      this.updateWidth();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.disabled !== this.props.disabled) {
        this.updateDisabledState(nextProps.disabled);
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      this.updateWidth(prevProps.width);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      // Note that destroy() is not part of TextEditor's public API.
      this.getTextEditor().destroy();

      if (this.disposables) {
        this.disposables.dispose();
        this.disposables = null;
      }
    }
  }, {
    key: 'onDidChange',
    value: function onDidChange(callback) {
      return this.getTextEditor().onDidChange(callback);
    }
  }, {
    key: 'getTextEditor',
    value: function getTextEditor() {
      return this.getTextEditorElement().getModel();
    }
  }, {
    key: 'getText',
    value: function getText() {
      return this.state.value;
    }
  }, {
    key: 'getTextEditorElement',
    value: function getTextEditorElement() {
      return this.root;
    }
  }, {
    key: 'setText',
    value: function setText(text) {
      this.getTextEditor().setText(text);
    }
  }, {
    key: 'updateDisabledState',
    value: function updateDisabledState(isDisabled) {
      // Hack to set TextEditor to read-only mode, per https://github.com/atom/atom/issues/6880
      if (isDisabled) {
        this.getTextEditorElement().removeAttribute('tabindex');
      } else {
        this.getTextEditorElement().setAttribute('tabindex', this.props.tabIndex);
      }
    }
  }, {
    key: 'updateWidth',
    value: function updateWidth(prevWidth) {
      if (this.props.width !== prevWidth) {
        var width = this.props.width == null ? undefined : this.props.width;
        this.getTextEditorElement().setWidth(width);
      }
    }
  }, {
    key: 'focus',
    value: function focus() {
      this.getTextEditor().moveToEndOfLine();
      this.getTextEditorElement().focus();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var className = (0, _classnames2['default'])(this.props.className, _defineProperty({
        'atom-text-editor-unstyled': this.props.unstyled
      }, 'atom-text-editor-' + this.props.size, this.props.size != null));

      return(
        // Because the contents of `<atom-text-editor>` elements are managed by its custom web
        // component class when "Use Shadow DOM" is disabled, this element should never have children.
        // If an element has no children, React guarantees it will never re-render the element (which
        // would wipe out the web component's work in this case).
        _reactForAtom.React.createElement('atom-text-editor', {
          ref: function (ref) {
            _this3.root = ref;
          },
          'class': className,
          mini: true,
          onClick: this.props.onClick,
          onFocus: this.props.onFocus,
          onBlur: this._onBlur
        })
      );
    }
  }]);

  return AtomInput;
})(_reactForAtom.React.Component);

exports['default'] = AtomInput;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9saWJyYXJ5L0VtYmVyIHNhdGVsbGl0ZSBwcm9qZWN0cy93cmVhdGhlLWJhc2UvdXNyL3NoYXJlL2F0b20vcGFja2FnZXMvamF2YXNjcmlwdC1yZWZhY3Rvci9saWIvY29tcG9uZW50cy9BdG9tSW5wdXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzswQkFjdUIsWUFBWTs7OztvQkFDQyxNQUFNOzs7OzRCQUNwQixnQkFBZ0I7O0FBaEJ0QyxXQUFXLENBQUMsSUFrQkosU0FBUyx1QkFBVCxTQUFTOzs7Ozs7SUFLSSxTQUFTO1lBQVQsU0FBUzs7ZUFBVCxTQUFTOztXQUVOO0FBQ3BCLGNBQVEsRUFBRSxLQUFLO0FBQ2Ysa0JBQVksRUFBRSxFQUFFO0FBQ2hCLGNBQVEsRUFBRSxHQUFHO0FBQ2IsYUFBTyxFQUFFLG1CQUFNLEVBQUU7QUFDakIsaUJBQVcsRUFBRSx1QkFBTSxFQUFFO0FBQ3JCLGFBQU8sRUFBRSxtQkFBTSxFQUFFO0FBQ2pCLFlBQU0sRUFBRSxrQkFBTSxFQUFFO0FBQ2hCLGNBQVEsRUFBRSxLQUFLO0tBQ2hCOzs7O1dBRWtCO0FBQ2pCLGVBQVMsRUFBRSxTQUFTLENBQUMsTUFBTTtBQUMzQixjQUFRLEVBQUUsU0FBUyxDQUFDLElBQUk7QUFDeEIsa0JBQVksRUFBRSxTQUFTLENBQUMsTUFBTTtBQUM5QixZQUFNLEVBQUUsU0FBUyxDQUFDLElBQUk7QUFDdEIsY0FBUSxFQUFFLFNBQVMsQ0FBQyxJQUFJO0FBQ3hCLGFBQU8sRUFBRSxTQUFTLENBQUMsSUFBSTtBQUN2QixlQUFTLEVBQUUsU0FBUyxDQUFDLElBQUk7QUFDekIsaUJBQVcsRUFBRSxTQUFTLENBQUMsSUFBSTtBQUMzQixhQUFPLEVBQUUsU0FBUyxDQUFDLElBQUk7QUFDdkIscUJBQWUsRUFBRSxTQUFTLENBQUMsTUFBTTtBQUNqQyxVQUFJLEVBQUUsU0FBUyxDQUFDLE1BQU07QUFDdEIsY0FBUSxFQUFFLFNBQVMsQ0FBQyxN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SUFBSSxJQUFJLEdBQUcsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO0FBQ3RFLFlBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUM3QztLQUNGOzs7V0FFSSxpQkFBRztBQUNOLFVBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUN2QyxVQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUNyQzs7O1dBRUssa0JBQUc7OztBQUNQLFVBQU0sU0FBUyxHQUFHLDZCQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUztBQUMvQyxtQ0FBMkIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVE7K0JBQzNCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLElBQUksRUFDakUsQ0FBQzs7QUFFSDs7Ozs7QUFLRTtBQUNFLGFBQUcsRUFBRSxVQUFDLEdBQUcsRUFBSztBQUFFLG1CQUFLLElBQUksR0FBRyxHQUFHLENBQUM7V0FBRSxBQUFDO0FBQ25DLG1CQUFPLFNBQVMsQUFBQztBQUNqQixjQUFJLE1BQUE7QUFDSixpQkFBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxBQUFDO0FBQzVCLGlCQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEFBQUM7QUFDNUIsZ0JBQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxBQUFDO1VBQ3JCO1FBQ0Y7S0FDSDs7O1NBcEtrQixTQUFTO0dBQVMsb0JBQU0sU0FBUzs7cUJBQWpDLFNBQVMiLCJmaWxlIjoiL2xpYnJhcnkvRW1iZXIgc2F0ZWxsaXRlIHByb2plY3RzL3dyZWF0aGUtYmFzZS91c3Ivc2hhcmUvYXRvbS9wYWNrYWdlcy9qYXZhc2NyaXB0LXJlZmFjdG9yL2xpYi9jb21wb25lbnRzL0F0b21JbnB1dC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4vLyBwdWxsZWQgZnJvbSBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vZmFjZWJvb2svbnVjbGlkZS9tYXN0ZXIvcGtnL251Y2xpZGUtdWkvbGliL0F0b21JbnB1dC5qc1xuLy8gY3VycmVudCBucG0gdmVyc2lvbiBpcyBub3QgY29tcGF0YWJsZSB3aXRoIFJlYWN0IDE1XG4vKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyBSZWFjdCB9IGZyb20gJ3JlYWN0LWZvci1hdG9tJztcblxuY29uc3QgeyBQcm9wVHlwZXMgfSA9IFJlYWN0O1xuXG4vKipcbiAqIEFuIGlucHV0IGZpZWxkIHJlbmRlcmVkIGFzIGFuIDxhdG9tLXRleHQtZWRpdG9yIG1pbmkgLz4uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF0b21JbnB1dCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBkaXNhYmxlZDogZmFsc2UsXG4gICAgaW5pdGlhbFZhbHVlOiAnJyxcbiAgICB0YWJJbmRleDogJzAnLCAvLyBEZWZhdWx0IHRvIGFsbCA8QXRvbUlucHV0IC8+IGNvbXBvbmVudHMgYmVpbmcgaW4gdGFiIG9yZGVyXG4gICAgb25DbGljazogKCkgPT4ge30sXG4gICAgb25EaWRDaGFuZ2U6ICgpID0+IHt9LFxuICAgIG9uRm9jdXM6ICgpID0+IHt9LFxuICAgIG9uQmx1cjogKCkgPT4ge30sXG4gICAgdW5zdHlsZWQ6IGZhbHNlLFxuICB9O1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGRpc2FibGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBpbml0aWFsVmFsdWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgb25CbHVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvbkNhbmNlbDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25DbGljazogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25Db25maXJtOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvbkRpZENoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25Gb2N1czogUHJvcFR5cGVzLmZ1bmMsXG4gICAgcGxhY2Vob2xkZXJUZXh0OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHNpemU6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgdGFiSW5kZXg6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgdW5zdHlsZWQ6IFByb3BUeXBlcy5ib29sLFxuICAgIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLFxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICB2YWx1ZTogcHJvcHMuaW5pdGlhbFZhbHVlLFxuICAgIH07XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBjb25zdCBkaXNwb3NhYmxlcyA9IHRoaXMuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gICAgLy8gVGhlcmUgZG9lcyBub3QgYXBwZWFyIHRvIGJlIGFueSBzb3J0IG9mIGluZmluaXRlIGxvb3Agd2hlcmUgY2FsbGluZ1xuICAgIC8vIHNldFN0YXRlKHt2YWx1ZX0pIGluIHJlc3BvbnNlIHRvIG9uRGlkQ2hhbmdlKCkgY2F1c2VzIGFub3RoZXIgY2hhbmdlXG4gICAgLy8gZXZlbnQuXG4gICAgY29uc3QgdGV4dEVkaXRvciA9IHRoaXMuZ2V0VGV4dEVkaXRvcigpO1xuICAgIGNvbnN0IHRleHRFZGl0b3JFbGVtZW50ID0gdGhpcy5nZXRUZXh0RWRpdG9yRWxlbWVudCgpO1xuICAgIGRpc3Bvc2FibGVzLmFkZChcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkKHRleHRFZGl0b3JFbGVtZW50LCB7XG4gICAgICAgICdjb3JlOmNvbmZpcm0nOiAoKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMucHJvcHMub25Db25maXJtICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25Db25maXJtKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAnY29yZTpjYW5jZWwnOiAoKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMucHJvcHMub25DYW5jZWwgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkNhbmNlbCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICk7XG4gICAgY29uc3QgcGxhY2Vob2xkZXJUZXh0ID0gdGhpcy5wcm9wcy5wbGFjZWhvbGRlclRleHQ7XG4gICAgaWYgKHBsYWNlaG9sZGVyVGV4dCAhPSBudWxsKSB7XG4gICAgICB0ZXh0RWRpdG9yLnNldFBsYWNlaG9sZGVyVGV4dChwbGFjZWhvbGRlclRleHQpO1xuICAgIH1cbiAgICB0aGlzLmdldFRleHRFZGl0b3JFbGVtZW50KCkuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIHRoaXMucHJvcHMudGFiSW5kZXgpO1xuICAgIGlmICh0aGlzLnByb3BzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLnVwZGF0ZURpc2FibGVkU3RhdGUodHJ1ZSk7XG4gICAgfVxuXG4gICAgLy8gU2V0IHRoZSB0ZXh0IGVkaXRvcidzIGluaXRpYWwgdmFsdWUgYW5kIGtlZXAgdGhlIGN1cnNvciBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBsaW5lLiBDdXJzb3JcbiAgICAvLyBwb3NpdGlvbiB3YXMgZG9jdW1lbnRlZCBpbiBhIHRlc3QgYW5kIGlzIHJldGFpbmVkIGhlcmUgYWZ0ZXIgY2hhbmdlcyB0byBob3cgdGV4dCBpcyBzZXQgaW5cbiAgICAvLyB0aGUgdGV4dCBlZGl0b3IuIChzZWUgZm9jdXMtcmVsYXRlZCBzcGVjIGluIEF0b21JbnB1dC1zcGVjLmpzKVxuICAgIHRoaXMuc2V0VGV4dCh0aGlzLnN0YXRlLnZhbHVlKTtcbiAgICB0aGlzLmdldFRleHRFZGl0b3IoKS5tb3ZlVG9CZWdpbm5pbmdPZkxpbmUoKTtcblxuICAgIC8vIEJlZ2luIGxpc3RlbmluZyBmb3IgY2hhbmdlcyBvbmx5IGFmdGVyIGluaXRpYWwgdmFsdWUgaXMgc2V0LlxuICAgIGRpc3Bvc2FibGVzLmFkZCh0ZXh0RWRpdG9yLm9uRGlkQ2hhbmdlKCgpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB2YWx1ZTogdGV4dEVkaXRvci5nZXRUZXh0KCkgfSk7XG4gICAgICB0aGlzLnByb3BzLm9uRGlkQ2hhbmdlLmNhbGwobnVsbCwgdGV4dEVkaXRvci5nZXRUZXh0KCkpO1xuICAgIH0pKTtcblxuICAgIHRoaXMudXBkYXRlV2lkdGgoKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgaWYgKG5leHRQcm9wcy5kaXNhYmxlZCAhPT0gdGhpcy5wcm9wcy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy51cGRhdGVEaXNhYmxlZFN0YXRlKG5leHRQcm9wcy5kaXNhYmxlZCk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgIHRoaXMudXBkYXRlV2lkdGgocHJldlByb3BzLndpZHRoKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIC8vIE5vdGUgdGhhdCBkZXN0cm95KCkgaXMgbm90IHBhcnQgb2YgVGV4dEVkaXRvcidzIHB1YmxpYyBBUEkuXG4gICAgdGhpcy5nZXRUZXh0RWRpdG9yKCkuZGVzdHJveSgpO1xuXG4gICAgaWYgKHRoaXMuZGlzcG9zYWJsZXMpIHtcbiAgICAgIHRoaXMuZGlzcG9zYWJsZXMuZGlzcG9zZSgpO1xuICAgICAgdGhpcy5kaXNwb3NhYmxlcyA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgb25EaWRDaGFuZ2UoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUZXh0RWRpdG9yKCkub25EaWRDaGFuZ2UoY2FsbGJhY2spO1xuICB9XG5cbiAgZ2V0VGV4dEVkaXRvcigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUZXh0RWRpdG9yRWxlbWVudCgpLmdldE1vZGVsKCk7XG4gIH1cblxuICBnZXRUZXh0KCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLnZhbHVlO1xuICB9XG5cbiAgZ2V0VGV4dEVkaXRvckVsZW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMucm9vdDtcbiAgfVxuXG4gIHNldFRleHQodGV4dCkge1xuICAgIHRoaXMuZ2V0VGV4dEVkaXRvcigpLnNldFRleHQodGV4dCk7XG4gIH1cblxuICB1cGRhdGVEaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQpIHtcbiAgICAvLyBIYWNrIHRvIHNldCBUZXh0RWRpdG9yIHRvIHJlYWQtb25seSBtb2RlLCBwZXIgaHR0cHM6Ly9naXRodWIuY29tL2F0b20vYXRvbS9pc3N1ZXMvNjg4MFxuICAgIGlmIChpc0Rpc2FibGVkKSB7XG4gICAgICB0aGlzLmdldFRleHRFZGl0b3JFbGVtZW50KCkucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmdldFRleHRFZGl0b3JFbGVtZW50KCkuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIHRoaXMucHJvcHMudGFiSW5kZXgpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZVdpZHRoKHByZXZXaWR0aCkge1xuICAgIGlmICh0aGlzLnByb3BzLndpZHRoICE9PSBwcmV2V2lkdGgpIHtcbiAgICAgIGNvbnN0IHdpZHRoID0gdGhpcy5wcm9wcy53aWR0aCA9PSBudWxsID8gdW5kZWZpbmVkIDogdGhpcy5wcm9wcy53aWR0aDtcbiAgICAgIHRoaXMuZ2V0VGV4dEVkaXRvckVsZW1lbnQoKS5zZXRXaWR0aCh3aWR0aCk7XG4gICAgfVxuICB9XG5cbiAgZm9jdXMoKSB7XG4gICAgdGhpcy5nZXRUZXh0RWRpdG9yKCkubW92ZVRvRW5kT2ZMaW5lKCk7XG4gICAgdGhpcy5nZXRUZXh0RWRpdG9yRWxlbWVudCgpLmZvY3VzKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgY2xhc3NOYW1lID0gY2xhc3NOYW1lcyh0aGlzLnByb3BzLmNsYXNzTmFtZSwge1xuICAgICAgJ2F0b20tdGV4dC1lZGl0b3ItdW5zdHlsZWQnOiB0aGlzLnByb3BzLnVuc3R5bGVkLFxuICAgICAgW2BhdG9tLXRleHQtZWRpdG9yLSR7dGhpcy5wcm9wcy5zaXplfWBdOiAodGhpcy5wcm9wcy5zaXplICE9IG51bGwpLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIC8vIEJlY2F1c2UgdGhlIGNvbnRlbnRzIG9mIGA8YXRvbS10ZXh0LWVkaXRvcj5gIGVsZW1lbnRzIGFyZSBtYW5hZ2VkIGJ5IGl0cyBjdXN0b20gd2ViXG4gICAgICAvLyBjb21wb25lbnQgY2xhc3Mgd2hlbiBcIlVzZSBTaGFkb3cgRE9NXCIgaXMgZGlzYWJsZWQsIHRoaXMgZWxlbWVudCBzaG91bGQgbmV2ZXIgaGF2ZSBjaGlsZHJlbi5cbiAgICAgIC8vIElmIGFuIGVsZW1lbnQgaGFzIG5vIGNoaWxkcmVuLCBSZWFjdCBndWFyYW50ZWVzIGl0IHdpbGwgbmV2ZXIgcmUtcmVuZGVyIHRoZSBlbGVtZW50ICh3aGljaFxuICAgICAgLy8gd291bGQgd2lwZSBvdXQgdGhlIHdlYiBjb21wb25lbnQncyB3b3JrIGluIHRoaXMgY2FzZSkuXG4gICAgICA8YXRvbS10ZXh0LWVkaXRvclxuICAgICAgICByZWY9eyhyZWYpID0+IHsgdGhpcy5yb290ID0gcmVmOyB9fVxuICAgICAgICBjbGFzcz17Y2xhc3NOYW1lfVxuICAgICAgICBtaW5pXG4gICAgICAgIG9uQ2xpY2s9e3RoaXMucHJvcHMub25DbGlja31cbiAgICAgICAgb25Gb2N1cz17dGhpcy5wcm9wcy5vbkZvY3VzfVxuICAgICAgICBvbkJsdXI9e3RoaXMuX29uQmx1cn1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIF9vbkJsdXIgPSAoZXZlbnQpID0+IHtcbiAgICBpZiAoZXZlbnQucmVsYXRlZFRhcmdldCA9PT0gdGhpcy5yb290IHx8wqBldmVudC50YXJnZXQgPT09IHRoaXMucm9vdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucHJvcHMub25CbHVyKGV2ZW50KTtcbiAgfVxufVxuIl19