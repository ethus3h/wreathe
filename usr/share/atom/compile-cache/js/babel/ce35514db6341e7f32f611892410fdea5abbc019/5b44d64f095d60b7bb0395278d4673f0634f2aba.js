Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _babylon = require('babylon');

var _babelTraverse = require('babel-traverse');

var _babelTraverse2 = _interopRequireDefault(_babelTraverse);

var _debug = require('./debug');

var _debug2 = _interopRequireDefault(_debug);

'use babel';

var d = (0, _debug2['default'])('js-refactor:context');

var Context = (function () {
	function Context() {
		_classCallCheck(this, Context);
	}

	_createClass(Context, [{
		key: 'setCode',
		value: function setCode(code, options) {
			this._ast = (0, _babylon.parse)(code, options);
		}
	}, {
		key: 'identify',
		value: function identify(loc) {
			d('identify', loc);
			var binding = undefined;
			(0, _babelTraverse2['default'])(this._ast, {
				enter: function enter(path) {
					var _path$node = path.node;
					var start = _path$node.start;
					var end = _path$node.end;

					if (end < loc) return void path.skip();
					if (start > loc) return void path.stop();
					if (test(path)) {
						var _path$node2 = path.node;
						var _name = _path$node2.name;
						var typeAnnotation = _path$node2.typeAnnotation;

						if (!typeAnnotation || loc < typeAnnotation.start) {
							// ignore typeAnnotation
							binding = path.scope.getBinding(_name);
						}
						return void path.stop();
					}
				}
			});
			if (!binding) d('global?');
			return binding;
		}
	}]);

	return Context;
})();

exports['default'] = Context;

function test(path) {
	if (path.isReferencedIdentifier()) return true;
	if (path.isBindingIdentifier()) return true;

	// for import, do not need now
	// const p = path.parentPath
	// if (p.isImportSpecifier()) return path.node === p.node.local

	// for Method/ArrowFunction, seems babel's bug
	if (path.isIdentifier()) {
		var binding = path.scope.getBinding(path.node.name);
		if (binding && binding.identifier === path.node) {
			d('babel bug', path);
			return true;
		}
	}

	// d('WTF', path,
	// 	path.isIdentifier(),
	// 	path.isReferencedIdentifier(),
	// 	path.isBindingIdentifier(),
	// 	path.isImportSpecifier(),
	// 	path.isFunction(),
	// 	path.scope.getBinding(path.node.name)
	// )
	return false;
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9saWJyYXJ5L0VtYmVyIHNhdGVsbGl0ZSBwcm9qZWN0cy93cmVhdGhlLWJhc2UvdXNyL3NoYXJlL2F0b20vcGFja2FnZXMvanMtcmVmYWN0b3IvbGliL0NvbnRleHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozt1QkFFb0IsU0FBUzs7NkJBQ1IsZ0JBQWdCOzs7O3FCQUNuQixTQUFTOzs7O0FBSjNCLFdBQVcsQ0FBQTs7QUFLWCxJQUFNLENBQUMsR0FBRyx3QkFBTSxxQkFBcUIsQ0FBQyxDQUFBOztJQUVqQixPQUFPO1VBQVAsT0FBTzt3QkFBUCxPQUFPOzs7Y0FBUCxPQUFPOztTQUNwQixpQkFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO0FBQ3RCLE9BQUksQ0FBQyxJQUFJLEdBQUcsb0JBQU0sSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0dBQ2hDOzs7U0FDTyxrQkFBQyxHQUFHLEVBQUU7QUFDYixJQUFDLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFBO0FBQ2xCLE9BQUksT0FBTyxZQUFBLENBQUE7QUFDWCxtQ0FBUyxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ25CLFNBQUssRUFBQSxlQUFDLElBQUksRUFBRTtzQkFDVSxJQUFJLENBQUMsSUFBSTtTQUF2QixLQUFLLGNBQUwsS0FBSztTQUFFLEdBQUcsY0FBSCxHQUFHOztBQUNqQixTQUFJLEdBQUcsR0FBRyxHQUFHLEVBQUUsT0FBTyxLQUFLLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtBQUN0QyxTQUFJLEtBQUssR0FBRyxHQUFHLEVBQUUsT0FBTyxLQUFLLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtBQUN4QyxTQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTt3QkFDZ0IsSUFBSSxDQUFDLElBQUk7VUFBakMsS0FBSSxlQUFKLElBQUk7VUFBRSxjQUFjLGVBQWQsY0FBYzs7QUFDM0IsVUFBSSxDQUFDLGNBQWMsSUFBSSxHQUFHLEdBQUcsY0FBYyxDQUFDLEtBQUssRUFBRTs7QUFDbEQsY0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEtBQUksQ0FBQyxDQUFBO09BQ3JDO0FBQ0QsYUFBTyxLQUFLLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtNQUN2QjtLQUNEO0lBQ0QsQ0FBQyxDQUFBO0FBQ0YsT0FBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDMUIsVUFBTyxPQUFPLENBQUE7R0FDZDs7O1FBdkJtQixPQUFPOzs7cUJBQVAsT0FBTzs7QUEwQjVCLFNBQVMsSUFBSSxDQUFDLElBQUksRUFBRTtBQUNuQixLQUFJLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFBO0FBQzlDLEtBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUE7Ozs7Ozs7QUFPM0MsS0FBSSxJQUFJLENBQUMsWUFBWSxFQUFFLEVBQUU7QUFDeEIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNyRCxNQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBVSxLQUFLLElBQUksQ0FBQyxJQUFJLEVBQUU7QUFDaEQsSUFBQyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQTtBQUNwQixVQUFPLElBQUksQ0FBQTtHQUNYO0VBQ0Q7Ozs7Ozs7Ozs7QUFVRCxRQUFPLEtBQUssQ0FBQTtDQUNaIiwiZmlsZSI6Ii9saWJyYXJ5L0VtYmVyIHNhdGVsbGl0ZSBwcm9qZWN0cy93cmVhdGhlLWJhc2UvdXNyL3NoYXJlL2F0b20vcGFja2FnZXMvanMtcmVmYWN0b3IvbGliL0NvbnRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge3BhcnNlfVx0ZnJvbSAnYmFieWxvbidcbmltcG9ydCB0cmF2ZXJzZVx0ZnJvbSAnYmFiZWwtdHJhdmVyc2UnXG5pbXBvcnQgZGVidWdcdGZyb20gJy4vZGVidWcnXG5jb25zdCBkID0gZGVidWcoJ2pzLXJlZmFjdG9yOmNvbnRleHQnKVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZXh0IHtcblx0c2V0Q29kZShjb2RlLCBvcHRpb25zKSB7XG5cdFx0dGhpcy5fYXN0ID0gcGFyc2UoY29kZSwgb3B0aW9ucylcblx0fVxuXHRpZGVudGlmeShsb2MpIHtcblx0XHRkKCdpZGVudGlmeScsIGxvYylcblx0XHRsZXQgYmluZGluZ1xuXHRcdHRyYXZlcnNlKHRoaXMuX2FzdCwge1xuXHRcdFx0ZW50ZXIocGF0aCkge1xuXHRcdFx0XHRjb25zdCB7c3RhcnQsIGVuZH0gPSBwYXRoLm5vZGVcblx0XHRcdFx0aWYgKGVuZCA8IGxvYylcdHJldHVybiB2b2lkIHBhdGguc2tpcCgpXG5cdFx0XHRcdGlmIChzdGFydCA+IGxvYylcdHJldHVybiB2b2lkIHBhdGguc3RvcCgpXG5cdFx0XHRcdGlmICh0ZXN0KHBhdGgpKSB7XG5cdFx0XHRcdFx0Y29uc3Qge25hbWUsIHR5cGVBbm5vdGF0aW9ufSA9IHBhdGgubm9kZVxuXHRcdFx0XHRcdGlmICghdHlwZUFubm90YXRpb24gfHwgbG9jIDwgdHlwZUFubm90YXRpb24uc3RhcnQpIHsgLy8gaWdub3JlIHR5cGVBbm5vdGF0aW9uXG5cdFx0XHRcdFx0XHRiaW5kaW5nID0gcGF0aC5zY29wZS5nZXRCaW5kaW5nKG5hbWUpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiB2b2lkIHBhdGguc3RvcCgpXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0fSlcblx0XHRpZiAoIWJpbmRpbmcpIGQoJ2dsb2JhbD8nKVxuXHRcdHJldHVybiBiaW5kaW5nXG5cdH1cbn1cblxuZnVuY3Rpb24gdGVzdChwYXRoKSB7XG5cdGlmIChwYXRoLmlzUmVmZXJlbmNlZElkZW50aWZpZXIoKSkgcmV0dXJuIHRydWVcblx0aWYgKHBhdGguaXNCaW5kaW5nSWRlbnRpZmllcigpKSByZXR1cm4gdHJ1ZVxuXG5cdC8vIGZvciBpbXBvcnQsIGRvIG5vdCBuZWVkIG5vd1xuXHQvLyBjb25zdCBwID0gcGF0aC5wYXJlbnRQYXRoXG5cdC8vIGlmIChwLmlzSW1wb3J0U3BlY2lmaWVyKCkpIHJldHVybiBwYXRoLm5vZGUgPT09IHAubm9kZS5sb2NhbFxuXG5cdC8vIGZvciBNZXRob2QvQXJyb3dGdW5jdGlvbiwgc2VlbXMgYmFiZWwncyBidWdcblx0aWYgKHBhdGguaXNJZGVudGlmaWVyKCkpIHtcblx0XHRjb25zdCBiaW5kaW5nID0gcGF0aC5zY29wZS5nZXRCaW5kaW5nKHBhdGgubm9kZS5uYW1lKVxuXHRcdGlmIChiaW5kaW5nICYmIGJpbmRpbmcuaWRlbnRpZmllciA9PT0gcGF0aC5ub2RlKSB7XG5cdFx0XHRkKCdiYWJlbCBidWcnLCBwYXRoKVxuXHRcdFx0cmV0dXJuIHRydWVcblx0XHR9XG5cdH1cblxuXHQvLyBkKCdXVEYnLCBwYXRoLFxuXHQvLyBcdHBhdGguaXNJZGVudGlmaWVyKCksXG5cdC8vIFx0cGF0aC5pc1JlZmVyZW5jZWRJZGVudGlmaWVyKCksXG5cdC8vIFx0cGF0aC5pc0JpbmRpbmdJZGVudGlmaWVyKCksXG5cdC8vIFx0cGF0aC5pc0ltcG9ydFNwZWNpZmllcigpLFxuXHQvLyBcdHBhdGguaXNGdW5jdGlvbigpLFxuXHQvLyBcdHBhdGguc2NvcGUuZ2V0QmluZGluZyhwYXRoLm5vZGUubmFtZSlcblx0Ly8gKVxuXHRyZXR1cm4gZmFsc2Vcbn1cbiJdfQ==