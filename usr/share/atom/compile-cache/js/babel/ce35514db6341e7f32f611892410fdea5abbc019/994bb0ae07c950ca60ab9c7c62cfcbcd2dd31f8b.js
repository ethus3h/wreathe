'use babel';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('atom-space-pen-views');

var View = _require.View;

var $ = null;
var $$ = null;
var packageName = null;

var ConsoleView = (function (_View) {
	_inherits(ConsoleView, _View);

	function ConsoleView() {
		_classCallCheck(this, ConsoleView);

		_get(Object.getPrototypeOf(ConsoleView.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(ConsoleView, [{
		key: 'initialize',
		value: function initialize(serializeState) {
			var _require2 = require('atom-space-pen-views');

			$ = _require2.$;
			$$ = _require2.$$;

			var _require3 = require('./util/package-helper');

			packageName = _require3.packageName;

			this.dockItem = {
				element: this.element,
				getTitle: function getTitle() {
					return 'Console';
				},
				getURI: function getURI() {
					return 'atom://' + packageName() + '/console';
				},
				getDefaultLocation: function getDefaultLocation() {
					return 'bottom';
				}
			};
		}

		// Returns an object that can be retrieved when package is activated
	}, {
		key: 'serialize',
		value: function serialize() {}

		// Tear down any state and detach
	}, {
		key: 'destroy',
		value: function destroy() {
			return this.disposables != null ? this.disposables.dispose() : undefined;
		}
	}, {
		key: 'show',
		value: function show() {
			atom.workspace.open(this.dockItem);
		}
	}, {
		key: 'hide',
		value: function hide() {
			atom.workspace.getBottomDock().hide();
		}
	}, {
		key: 'toggle',
		value: function toggle() {
			atom.workspace.toggle(this.dockItem);
		}
	}, {
		key: 'log',
		value: function log(message, level) {
			var at_bottom = this.body.scrollTop() + this.body.innerHeight() + 10 > this.body[0].scrollHeight;

			if (typeof message === 'string') {
				this.output.append($$(function () {
					return this.p({ 'class': 'level-' + level }, message);
				}));
			} else {
				this.output.append(message);
			}

			if (at_bottom) {
				this.body.scrollTop(this.body[0].scrollHeight);
			}

			return this.show();
		}
	}, {
		key: 'clear',
		value: function clear() {
			this.output.empty();
			return this.hide();
		}
	}], [{
		key: 'content',
		value: function content() {
			var _this = this;

			return this.div({ id: 'atom-console' }, function () {
				return _this.div({ 'class': 'panel-body view-scroller', outlet: 'body' }, function () {
					return _this.pre({ 'class': 'native-key-bindings', outlet: 'output', tabindex: -1 });
				});
			});
		}
	}]);

	return ConsoleView;
})(View);

exports['default'] = ConsoleView;
;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9saWJyYXJ5L0VtYmVyIHNhdGVsbGl0ZSBwcm9qZWN0cy93cmVhdGhlLWJhc2UvdXNyL3NoYXJlL2F0b20vcGFja2FnZXMvY29uc29sZS1wYW5lbC9saWIvY29uc29sZS12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7ZUFFRyxPQUFPLENBQUMsc0JBQXNCLENBQUM7O0lBQXZDLElBQUksWUFBSixJQUFJOztBQUNYLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztBQUNiLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQztBQUNkLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQzs7SUFFRixXQUFXO1dBQVgsV0FBVzs7VUFBWCxXQUFXO3dCQUFYLFdBQVc7OzZCQUFYLFdBQVc7OztjQUFYLFdBQVc7O1NBU3JCLG9CQUFDLGNBQWMsRUFBRTttQkFDZixPQUFPLENBQUMsc0JBQXNCLENBQUM7O0FBQXhDLElBQUMsYUFBRCxDQUFDO0FBQUUsS0FBRSxhQUFGLEVBQUU7O21CQUNVLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQzs7QUFBL0MsY0FBVyxhQUFYLFdBQVc7O0FBRWIsT0FBSSxDQUFDLFFBQVEsR0FBRztBQUNmLFdBQU8sRUFBRSxJQUFJLENBQUMsT0FBTztBQUNyQixZQUFRLEVBQUU7WUFBTSxTQUFTO0tBQUE7QUFDekIsVUFBTSxFQUFFO3dCQUFnQixXQUFXLEVBQUU7S0FBVTtBQUMvQyxzQkFBa0IsRUFBRTtZQUFNLFFBQVE7S0FBQTtJQUNsQyxDQUFDO0dBQ0Y7Ozs7O1NBR1EscUJBQUcsRUFDWDs7Ozs7U0FHTSxtQkFBRztBQUNULFVBQVEsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxTQUFTLENBQUU7R0FDM0U7OztTQUVHLGdCQUFHO0FBQ04sT0FBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0dBQ25DOzs7U0FFRyxnQkFBRztBQUNOLE9BQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7R0FDdEM7OztTQUVLLGtCQUFHO0FBQ1IsT0FBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0dBQ3JDOzs7U0FFRSxhQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUU7QUFDbkIsT0FBTSxTQUFTLEdBQUksQUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxHQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxBQUFDLENBQUM7O0FBRXZHLE9BQUksT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFFO0FBQ2hDLFFBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxZQUFXO0FBQ2hDLFlBQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLG9CQUFnQixLQUFLLEFBQUUsRUFBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ2xELENBQUMsQ0FDRCxDQUFDO0lBQ0YsTUFBTTtBQUNOLFFBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzVCOztBQUVELE9BQUksU0FBUyxFQUFFO0FBQ2QsUUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUMvQzs7QUFFRCxVQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztHQUNuQjs7O1NBRUksaUJBQUc7QUFDUCxPQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3BCLFVBQU8sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0dBQ25COzs7U0EvRGEsbUJBQUc7OztBQUNoQixVQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBQyxFQUFFLEVBQUUsY0FBYyxFQUFDLEVBQUUsWUFBTTtBQUMzQyxXQUFPLE1BQUssR0FBRyxDQUFDLEVBQUMsU0FBTywwQkFBMEIsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFDLEVBQUUsWUFBTTtBQUMxRSxZQUFPLE1BQUssR0FBRyxDQUFDLEVBQUMsU0FBTyxxQkFBcUIsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7S0FDaEYsQ0FBQyxDQUFDO0lBQ0gsQ0FBQyxDQUFDO0dBQ0g7OztRQVBtQixXQUFXO0dBQVMsSUFBSTs7cUJBQXhCLFdBQVc7QUFpRS9CLENBQUMiLCJmaWxlIjoiL2xpYnJhcnkvRW1iZXIgc2F0ZWxsaXRlIHByb2plY3RzL3dyZWF0aGUtYmFzZS91c3Ivc2hhcmUvYXRvbS9wYWNrYWdlcy9jb25zb2xlLXBhbmVsL2xpYi9jb25zb2xlLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuY29uc3Qge1ZpZXd9ID0gcmVxdWlyZSgnYXRvbS1zcGFjZS1wZW4tdmlld3MnKTtcbmxldCAkID0gbnVsbDtcbmxldCAkJCA9IG51bGw7XG5sZXQgcGFja2FnZU5hbWUgPSBudWxsO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25zb2xlVmlldyBleHRlbmRzIFZpZXcge1xuXHRzdGF0aWMgY29udGVudCgpIHtcblx0XHRyZXR1cm4gdGhpcy5kaXYoe2lkOiAnYXRvbS1jb25zb2xlJ30sICgpID0+IHtcblx0XHRcdHJldHVybiB0aGlzLmRpdih7Y2xhc3M6ICdwYW5lbC1ib2R5IHZpZXctc2Nyb2xsZXInLCBvdXRsZXQ6ICdib2R5J30sICgpID0+IHtcblx0XHRcdFx0cmV0dXJuIHRoaXMucHJlKHtjbGFzczogJ25hdGl2ZS1rZXktYmluZGluZ3MnLCBvdXRsZXQ6ICdvdXRwdXQnLCB0YWJpbmRleDogLTF9KTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0aW5pdGlhbGl6ZShzZXJpYWxpemVTdGF0ZSkge1xuXHRcdCh7JCwgJCR9ID0gcmVxdWlyZSgnYXRvbS1zcGFjZS1wZW4tdmlld3MnKSk7XG5cdFx0KHtwYWNrYWdlTmFtZX0gPSByZXF1aXJlKCcuL3V0aWwvcGFja2FnZS1oZWxwZXInKSk7XG5cblx0XHR0aGlzLmRvY2tJdGVtID0ge1xuXHRcdFx0ZWxlbWVudDogdGhpcy5lbGVtZW50LFxuXHRcdFx0Z2V0VGl0bGU6ICgpID0+ICdDb25zb2xlJyxcblx0XHRcdGdldFVSSTogKCkgPT4gYGF0b206Ly8ke3BhY2thZ2VOYW1lKCl9L2NvbnNvbGVgLFxuXHRcdFx0Z2V0RGVmYXVsdExvY2F0aW9uOiAoKSA9PiAnYm90dG9tJ1xuXHRcdH07XG5cdH1cblxuXHQvLyBSZXR1cm5zIGFuIG9iamVjdCB0aGF0IGNhbiBiZSByZXRyaWV2ZWQgd2hlbiBwYWNrYWdlIGlzIGFjdGl2YXRlZFxuXHRzZXJpYWxpemUoKSB7XG5cdH1cblxuXHQvLyBUZWFyIGRvd24gYW55IHN0YXRlIGFuZCBkZXRhY2hcblx0ZGVzdHJveSgpIHtcblx0XHRyZXR1cm4gKHRoaXMuZGlzcG9zYWJsZXMgIT0gbnVsbCA/IHRoaXMuZGlzcG9zYWJsZXMuZGlzcG9zZSgpIDogdW5kZWZpbmVkKTtcblx0fVxuXG5cdHNob3coKSB7XG5cdFx0YXRvbS53b3Jrc3BhY2Uub3Blbih0aGlzLmRvY2tJdGVtKTtcblx0fVxuXG5cdGhpZGUoKSB7XG5cdFx0YXRvbS53b3Jrc3BhY2UuZ2V0Qm90dG9tRG9jaygpLmhpZGUoKTtcblx0fVxuXG5cdHRvZ2dsZSgpIHtcblx0XHRhdG9tLndvcmtzcGFjZS50b2dnbGUodGhpcy5kb2NrSXRlbSk7XG5cdH1cblxuXHRsb2cobWVzc2FnZSwgbGV2ZWwpIHtcblx0XHRjb25zdCBhdF9ib3R0b20gPSAoKHRoaXMuYm9keS5zY3JvbGxUb3AoKSArIHRoaXMuYm9keS5pbm5lckhlaWdodCgpICsgMTApID4gdGhpcy5ib2R5WzBdLnNjcm9sbEhlaWdodCk7XG5cblx0XHRpZiAodHlwZW9mIG1lc3NhZ2UgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHR0aGlzLm91dHB1dC5hcHBlbmQoJCQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnAoe2NsYXNzOiBgbGV2ZWwtJHtsZXZlbH1gfSwgbWVzc2FnZSk7XG5cdFx0XHR9KVxuXHRcdFx0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5vdXRwdXQuYXBwZW5kKG1lc3NhZ2UpO1xuXHRcdH1cblxuXHRcdGlmIChhdF9ib3R0b20pIHtcblx0XHRcdHRoaXMuYm9keS5zY3JvbGxUb3AodGhpcy5ib2R5WzBdLnNjcm9sbEhlaWdodCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuc2hvdygpO1xuXHR9XG5cblx0Y2xlYXIoKSB7XG5cdFx0dGhpcy5vdXRwdXQuZW1wdHkoKTtcblx0XHRyZXR1cm4gdGhpcy5oaWRlKCk7XG5cdH1cbn07XG4iXX0=