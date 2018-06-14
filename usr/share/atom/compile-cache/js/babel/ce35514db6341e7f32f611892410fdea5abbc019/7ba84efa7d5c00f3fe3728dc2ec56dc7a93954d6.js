'use babel';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Emitter = null;

var ConsoleManager = (function () {
	function ConsoleManager(view) {
		_classCallCheck(this, ConsoleManager);

		this.view = view;

		var _require = require('event-kit');

		Emitter = _require.Emitter;

		this.emitter = new Emitter();
	}

	_createClass(ConsoleManager, [{
		key: 'destroy',
		value: function destroy() {
			return this.emitter.dispose();
		}

		// Toggle console panel
	}, {
		key: 'toggle',
		value: function toggle() {
			return this.view.toggle();
		}

		// Log message with default level
	}, {
		key: 'log',
		value: function log(message, level) {
			if (level == null) {
				level = 'info';
			}
			return this.view.log(message, level);
		}

		// Log error
	}, {
		key: 'error',
		value: function error(message) {
			return this.log(message, 'error');
		}

		// Log warning
	}, {
		key: 'warn',
		value: function warn(message) {
			return this.log(message, 'warn');
		}

		// Log notice
	}, {
		key: 'notice',
		value: function notice(message) {
			return this.log(message, 'notice');
		}

		// Log debug message
	}, {
		key: 'debug',
		value: function debug(message) {
			return this.log(message, 'debug');
		}

		// Log raw text
	}, {
		key: 'raw',
		value: function raw(rawText, level, lineEnding) {
			var _this = this;

			if (level == null) {
				level = 'info';
			}
			if (lineEnding == null) {
				lineEnding = "\n";
			}
			rawText.split(lineEnding).forEach(function (line) {
				_this.log(line, level);
			});
		}

		// Clear console panel
	}, {
		key: 'clear',
		value: function clear() {
			return this.view.clear();
		}
	}]);

	return ConsoleManager;
})();

exports['default'] = ConsoleManager;
;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9saWJyYXJ5L0VtYmVyIHNhdGVsbGl0ZSBwcm9qZWN0cy93cmVhdGhlLWJhc2UvdXNyL3NoYXJlL2F0b20vcGFja2FnZXMvY29uc29sZS1wYW5lbC9saWIvY29uc29sZS1tYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7OztBQUVaLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQzs7SUFFRSxjQUFjO0FBQ3ZCLFVBRFMsY0FBYyxDQUN0QixJQUFJLEVBQUU7d0JBREUsY0FBYzs7QUFFakMsTUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7O2lCQUNKLE9BQU8sQ0FBQyxXQUFXLENBQUM7O0FBQS9CLFNBQU8sWUFBUCxPQUFPOztBQUVULE1BQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPLEVBQUEsQ0FBQztFQUMzQjs7Y0FObUIsY0FBYzs7U0FRM0IsbUJBQUc7QUFDVCxVQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7R0FDOUI7Ozs7O1NBR0ssa0JBQUc7QUFDUixVQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7R0FDMUI7Ozs7O1NBR0UsYUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFO0FBQ25CLE9BQUksS0FBSyxJQUFJLElBQUksRUFBRTtBQUFFLFNBQUssR0FBRyxNQUFNLENBQUM7SUFBRTtBQUN0QyxVQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztHQUNyQzs7Ozs7U0FHSSxlQUFDLE9BQU8sRUFBRTtBQUNkLFVBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7R0FDbEM7Ozs7O1NBR0csY0FBQyxPQUFPLEVBQUU7QUFDYixVQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0dBQ2pDOzs7OztTQUdLLGdCQUFDLE9BQU8sRUFBRTtBQUNmLFVBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7R0FDbkM7Ozs7O1NBR0ksZUFBQyxPQUFPLEVBQUU7QUFDZCxVQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0dBQ2xDOzs7OztTQUdFLGFBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUU7OztBQUMvQixPQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7QUFDbEIsU0FBSyxHQUFHLE1BQU0sQ0FBQztJQUNmO0FBQ0QsT0FBSSxVQUFVLElBQUksSUFBSSxFQUFFO0FBQ3ZCLGNBQVUsR0FBRyxJQUFJLENBQUM7SUFDbEI7QUFDRCxVQUFPLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUMzQyxVQUFLLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdEIsQ0FBQyxDQUFDO0dBQ0g7Ozs7O1NBR0ksaUJBQUc7QUFDUCxVQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7R0FDekI7OztRQTNEbUIsY0FBYzs7O3FCQUFkLGNBQWM7QUE0RGxDLENBQUMiLCJmaWxlIjoiL2xpYnJhcnkvRW1iZXIgc2F0ZWxsaXRlIHByb2plY3RzL3dyZWF0aGUtYmFzZS91c3Ivc2hhcmUvYXRvbS9wYWNrYWdlcy9jb25zb2xlLXBhbmVsL2xpYi9jb25zb2xlLW1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxubGV0IEVtaXR0ZXIgPSBudWxsO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25zb2xlTWFuYWdlciB7XG5cdGNvbnN0cnVjdG9yKHZpZXcpIHtcblx0XHR0aGlzLnZpZXcgPSB2aWV3O1xuXHRcdCh7RW1pdHRlcn0gPSByZXF1aXJlKCdldmVudC1raXQnKSk7XG5cblx0XHR0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcjtcblx0fVxuXG5cdGRlc3Ryb3koKSB7XG5cdFx0cmV0dXJuIHRoaXMuZW1pdHRlci5kaXNwb3NlKCk7XG5cdH1cblxuXHQvLyBUb2dnbGUgY29uc29sZSBwYW5lbFxuXHR0b2dnbGUoKSB7XG5cdFx0cmV0dXJuIHRoaXMudmlldy50b2dnbGUoKTtcblx0fVxuXG5cdC8vIExvZyBtZXNzYWdlIHdpdGggZGVmYXVsdCBsZXZlbFxuXHRsb2cobWVzc2FnZSwgbGV2ZWwpIHtcblx0XHRpZiAobGV2ZWwgPT0gbnVsbCkgeyBsZXZlbCA9ICdpbmZvJzsgfVxuXHRcdHJldHVybiB0aGlzLnZpZXcubG9nKG1lc3NhZ2UsIGxldmVsKTtcblx0fVxuXG5cdC8vIExvZyBlcnJvclxuXHRlcnJvcihtZXNzYWdlKSB7XG5cdFx0cmV0dXJuIHRoaXMubG9nKG1lc3NhZ2UsICdlcnJvcicpO1xuXHR9XG5cblx0Ly8gTG9nIHdhcm5pbmdcblx0d2FybihtZXNzYWdlKSB7XG5cdFx0cmV0dXJuIHRoaXMubG9nKG1lc3NhZ2UsICd3YXJuJyk7XG5cdH1cblxuXHQvLyBMb2cgbm90aWNlXG5cdG5vdGljZShtZXNzYWdlKSB7XG5cdFx0cmV0dXJuIHRoaXMubG9nKG1lc3NhZ2UsICdub3RpY2UnKTtcblx0fVxuXG5cdC8vIExvZyBkZWJ1ZyBtZXNzYWdlXG5cdGRlYnVnKG1lc3NhZ2UpIHtcblx0XHRyZXR1cm4gdGhpcy5sb2cobWVzc2FnZSwgJ2RlYnVnJyk7XG5cdH1cblxuXHQvLyBMb2cgcmF3IHRleHRcblx0cmF3KHJhd1RleHQsIGxldmVsLCBsaW5lRW5kaW5nKSB7XG5cdFx0aWYgKGxldmVsID09IG51bGwpIHtcblx0XHRcdGxldmVsID0gJ2luZm8nO1xuXHRcdH1cblx0XHRpZiAobGluZUVuZGluZyA9PSBudWxsKSB7XG5cdFx0XHRsaW5lRW5kaW5nID0gXCJcXG5cIjtcblx0XHR9XG5cdFx0cmF3VGV4dC5zcGxpdChsaW5lRW5kaW5nKS5mb3JFYWNoKChsaW5lKSA9PiB7XG5cdFx0XHR0aGlzLmxvZyhsaW5lLCBsZXZlbCk7XG5cdFx0fSk7XG5cdH1cblxuXHQvLyBDbGVhciBjb25zb2xlIHBhbmVsXG5cdGNsZWFyKCkge1xuXHRcdHJldHVybiB0aGlzLnZpZXcuY2xlYXIoKTtcblx0fVxufTtcbiJdfQ==