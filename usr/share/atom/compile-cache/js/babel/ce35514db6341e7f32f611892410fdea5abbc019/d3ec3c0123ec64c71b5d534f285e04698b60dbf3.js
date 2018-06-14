Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _atom = require('atom');

var _redux = require('redux');

var _reactForAtom = require('react-for-atom');

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _componentsPathRenameForm = require('./components/PathRenameForm');

var _componentsPathRenameForm2 = _interopRequireDefault(_componentsPathRenameForm);

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _renamePaths = require('./renamePaths');

var _renamePaths2 = _interopRequireDefault(_renamePaths);

var _StatusBarTile = require('./StatusBarTile');

var _StatusBarTile2 = _interopRequireDefault(_StatusBarTile);

var _utilsGetPathFromContextMenuTarget = require('./utils/getPathFromContextMenuTarget');

var _utilsGetPathFromContextMenuTarget2 = _interopRequireDefault(_utilsGetPathFromContextMenuTarget);

'use babel';

var AVAILABLE_CPUS = _os2['default'].cpus().length - 1;

exports['default'] = {

  store: null,
  modalPanel: null,
  subscriptions: null,

  config: {
    cpus: {
      title: 'CPUS',
      description: '(all by default) Determines the number of processes started.',
      type: 'integer',
      'default': AVAILABLE_CPUS
    },
    extensions: {
      title: 'Extensions',
      description: 'File extensions the transform file should be applied to ' + '[js] (no leading dots...)',
      type: 'array',
      'default': ['js'],
      items: {
        type: 'string'
      }
    },
    ignoreConfig: {
      title: 'Ignore Config',
      description: 'Ignore files if they match patterns sourced from a ' + 'configuration file (e.g., a .gitignore) (must be relative to package root)',
      type: 'array',
      'default': ['.gitignore'],
      items: {
        type: 'string'
      }
    },
    ignorePattern: {
      title: 'Ignore Pattern',
      description: 'Ignore files that match a provided glob expression',
      type: 'array',
      'default': ['.git', 'node_modules'],
      items: {
        type: 'string'
      }
    },
    runInBand: {
      title: 'Run in band',
      description: 'Run serially in the current process  [false]',
      type: 'boolean',
      'default': 'false'
    }
  },

  activate: function activate() {
    var _this = this;

    this.store = (0, _redux.createStore)(_reducer2['default']);
    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-javascript-refactor:refactor': function atomJavascriptRefactorRefactor(e) {
        return _this.refactor(e);
      }
    }));

    return this.subscriptions;
  },

  deactivate: function deactivate() {
    if (this.subscriptions) this.subscriptions.dispose();
    if (this.modalPanel) this.modalPanel.destroy();
    this.subscriptions = null;
    this.modalPanel = null;
    this.store = null;
    this.el = null;
  },

  consumeStatusBar: function consumeStatusBar(statusBar) {
    var _this2 = this;

    this.statusBarTile = new _StatusBarTile2['default'](this.store);
    var disposable = new _atom.Disposable(function () {
      if (_this2.statusBarTile) {
        _this2.statusBarTile.dispose();
        _this2.statusBarTile = null;
      }
    });
    this.statusBarTile.consumeStatusBar(statusBar);
    this.subscriptions.add(disposable);
    return disposable;
  },

  refactor: function refactor(e) {
    var _this3 = this;

    var onRename = _asyncToGenerator(function* (_ref) {
      var previousPath = _ref.previousPath;
      var nextPath = _ref.nextPath;

      onClose();
      showLoader();
      try {
        yield (0, _renamePaths2['default'])(previousPath, nextPath);
      } catch (runtimeError) {
        hideLoader();
        throw runtimeError;
      }
      hideLoader();
    });

    if (!(e.target instanceof HTMLElement)) {
      throw new Error('EventTarget must be an HTMLElement');
    }

    var onClose = function onClose() {
      if (_this3.modalPanel) _this3.modalPanel.destroy();
    };

    var showLoader = function showLoader() {
      return _this3.store.dispatch({ type: 'refactor-start' });
    };
    var hideLoader = function hideLoader() {
      return _this3.store.dispatch({ type: 'refactor-end' });
    };

    var previousPath = (0, _utilsGetPathFromContextMenuTarget2['default'])(e.target);
    if (!previousPath) return;

    this.el = document.createElement('div');
    this.modalPanel = atom.workspace.addModalPanel({ item: this.el });
    _reactForAtom.ReactDOM.render(_reactForAtom.React.createElement(_componentsPathRenameForm2['default'], {
      previousPath: previousPath,
      onClose: onClose,
      onRename: onRename
    }), this.el);
  }
};
module.exports = exports['default'];
// eslint-disable-line import/no-extraneous-dependencies
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9saWJyYXJ5L0VtYmVyIHNhdGVsbGl0ZSBwcm9qZWN0cy93cmVhdGhlLWJhc2UvdXNyL3NoYXJlL2F0b20vcGFja2FnZXMvamF2YXNjcmlwdC1yZWZhY3Rvci9saWIvYXRvbS1qYXZhc2NyaXB0LXJlZmFjdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQU1PLE1BQU07O3FCQUNlLE9BQU87OzRCQUNILGdCQUFnQjs7a0JBQ2pDLElBQUk7Ozs7d0NBQ1EsNkJBQTZCOzs7O3VCQUNwQyxXQUFXOzs7OzJCQUNQLGVBQWU7Ozs7NkJBQ2IsaUJBQWlCOzs7O2lEQUNGLHNDQUFzQzs7OztBQWQvRSxXQUFXLENBQUM7O0FBZ0JaLElBQU0sY0FBYyxHQUFHLGdCQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7O3FCQUU3Qjs7QUFFYixPQUFLLEVBQUUsSUFBSTtBQUNYLFlBQVUsRUFBRSxJQUFJO0FBQ2hCLGVBQWEsRUFBRSxJQUFJOztBQUVuQixRQUFNLEVBQUU7QUFDTixRQUFJLEVBQUU7QUFDSixXQUFLLEVBQUUsTUFBTTtBQUNiLGlCQUFXLEVBQUUsOERBQThEO0FBQzNFLFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsY0FBYztLQUN4QjtBQUNELGNBQVUsRUFBRTtBQUNWLFdBQUssRUFBRSxZQUFZO0FBQ25CLGlCQUFXLEVBQUUsMERBQTBELEdBQ3JFLDJCQUEyQjtBQUM3QixVQUFJLEVBQUUsT0FBTztBQUNiLGlCQUFTLENBQUMsSUFBSSxDQUFDO0FBQ2YsV0FBSyxFQUFFO0FBQ0wsWUFBSSxFQUFFLFFBQVE7T0FDZjtLQUNGO0FBQ0QsZ0JBQVksRUFBRTtBQUNaLFdBQUssRUFBRSxlQUFlO0FBQ3RCLGlCQUFXLEVBQUUscURBQXFELEdBQ2hFLDRFQUE0RTtBQUM5RSxVQUFJLEVBQUUsT0FBTztBQUNiLGlCQUFTLENBQUMsWUFBWSxDQUFDO0FBQ3ZCLFdBQUssRUFBRTtBQUNMLFlBQUksRUFBRSxRQUFRO09B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LFVBQVUsR0FBRyxTQUFiLFVBQVU7YUFBUyxPQUFLLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQztLQUFBLENBQUM7QUFDekUsUUFBTSxVQUFVLEdBQUcsU0FBYixVQUFVO2FBQVMsT0FBSyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxDQUFDO0tBQUEsQ0FBQzs7QUFjdkUsUUFBTSxZQUFZLEdBQUcsb0RBQTZCLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM1RCxRQUFJLENBQUMsWUFBWSxFQUFFLE9BQU87O0FBRTFCLFFBQUksQ0FBQyxFQUFFLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QyxRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2xFLDJCQUFTLE1BQU0sQ0FDYjtBQUNFLGtCQUFZLEVBQUUsWUFBWSxBQUFDO0FBQzNCLGFBQU8sRUFBRSxPQUFPLEFBQUM7QUFDakIsY0FBUSxFQUFFLFFBQVEsQUFBQztNQUNuQixFQUNGLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztHQUNaO0NBQ0YiLCJmaWxlIjoiL2xpYnJhcnkvRW1iZXIgc2F0ZWxsaXRlIHByb2plY3RzL3dyZWF0aGUtYmFzZS91c3Ivc2hhcmUvYXRvbS9wYWNrYWdlcy9qYXZhc2NyaXB0LXJlZmFjdG9yL2xpYi9hdG9tLWphdmFzY3JpcHQtcmVmYWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLy8gQGZsb3dcbmltcG9ydCB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG4gIENvbXBvc2l0ZURpc3Bvc2FibGUsXG4gIERpc3Bvc2FibGUsXG59IGZyb20gJ2F0b20nO1xuaW1wb3J0IHsgY3JlYXRlU3RvcmUgfSBmcm9tICdyZWR1eCc7XG5pbXBvcnQgeyBSZWFjdCwgUmVhY3RET00gfSBmcm9tICdyZWFjdC1mb3ItYXRvbSc7XG5pbXBvcnQgb3MgZnJvbSAnb3MnO1xuaW1wb3J0IFBhdGhSZW5hbWVGb3JtIGZyb20gJy4vY29tcG9uZW50cy9QYXRoUmVuYW1lRm9ybSc7XG5pbXBvcnQgcmVkdWNlciBmcm9tICcuL3JlZHVjZXInO1xuaW1wb3J0IHJlbmFtZVBhdGhzIGZyb20gJy4vcmVuYW1lUGF0aHMnO1xuaW1wb3J0IFN0YXR1c0JhclRpbGUgZnJvbSAnLi9TdGF0dXNCYXJUaWxlJztcbmltcG9ydCBnZXRQYXRoRnJvbUNvbnRleHRNZW51VGFyZ2V0IGZyb20gJy4vdXRpbHMvZ2V0UGF0aEZyb21Db250ZXh0TWVudVRhcmdldCc7XG5cbmNvbnN0IEFWQUlMQUJMRV9DUFVTID0gb3MuY3B1cygpLmxlbmd0aCAtIDE7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblxuICBzdG9yZTogbnVsbCxcbiAgbW9kYWxQYW5lbDogbnVsbCxcbiAgc3Vic2NyaXB0aW9uczogbnVsbCxcblxuICBjb25maWc6IHtcbiAgICBjcHVzOiB7XG4gICAgICB0aXRsZTogJ0NQVVMnLFxuICAgICAgZGVzY3JpcHRpb246ICcoYWxsIGJ5IGRlZmF1bHQpIERldGVybWluZXMgdGhlIG51bWJlciBvZiBwcm9jZXNzZXMgc3RhcnRlZC4nLFxuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogQVZBSUxBQkxFX0NQVVMsXG4gICAgfSxcbiAgICBleHRlbnNpb25zOiB7XG4gICAgICB0aXRsZTogJ0V4dGVuc2lvbnMnLFxuICAgICAgZGVzY3JpcHRpb246ICdGaWxlIGV4dGVuc2lvbnMgdGhlIHRyYW5zZm9ybSBmaWxlIHNob3VsZCBiZSBhcHBsaWVkIHRvICcgK1xuICAgICAgICAnW2pzXSAobm8gbGVhZGluZyBkb3RzLi4uKScsXG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgZGVmYXVsdDogWydqcyddLFxuICAgICAgaXRlbXM6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICB9LFxuICAgIH0sXG4gICAgaWdub3JlQ29uZmlnOiB7XG4gICAgICB0aXRsZTogJ0lnbm9yZSBDb25maWcnLFxuICAgICAgZGVzY3JpcHRpb246ICdJZ25vcmUgZmlsZXMgaWYgdGhleSBtYXRjaCBwYXR0ZXJucyBzb3VyY2VkIGZyb20gYSAnICtcbiAgICAgICAgJ2NvbmZpZ3VyYXRpb24gZmlsZSAoZS5nLiwgYSAuZ2l0aWdub3JlKSAobXVzdCBiZSByZWxhdGl2ZSB0byBwYWNrYWdlIHJvb3QpJyxcbiAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICBkZWZhdWx0OiBbJy5naXRpZ25vcmUnXSxcbiAgICAgIGl0ZW1zOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGlnbm9yZVBhdHRlcm46IHtcbiAgICAgIHRpdGxlOiAnSWdub3JlIFBhdHRlcm4nLFxuICAgICAgZGVzY3JpcHRpb246ICdJZ25vcmUgZmlsZXMgdGhhdCBtYXRjaCBhIHByb3ZpZGVkIGdsb2IgZXhwcmVzc2lvbicsXG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgZGVmYXVsdDogWycuZ2l0JywgJ25vZGVfbW9kdWxlcyddLFxuICAgICAgaXRlbXM6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICB9LFxuICAgIH0sXG4gICAgcnVuSW5CYW5kOiB7XG4gICAgICB0aXRsZTogJ1J1biBpbiBiYW5kJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnUnVuIHNlcmlhbGx5IGluIHRoZSBjdXJyZW50IHByb2Nlc3MgIFtmYWxzZV0nLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogJ2ZhbHNlJyxcbiAgICB9LFxuICB9LFxuXG4gIGFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3RvcmUgPSBjcmVhdGVTdG9yZShyZWR1Y2VyKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgICAgICdhdG9tLWphdmFzY3JpcHQtcmVmYWN0b3I6cmVmYWN0b3InOiBlID0+IHRoaXMucmVmYWN0b3IoZSksXG4gICAgICB9KSxcbiAgICApO1xuXG4gICAgcmV0dXJuIHRoaXMuc3Vic2NyaXB0aW9ucztcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbnMpIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgaWYgKHRoaXMubW9kYWxQYW5lbCkgdGhpcy5tb2RhbFBhbmVsLmRlc3Ryb3koKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBudWxsO1xuICAgIHRoaXMubW9kYWxQYW5lbCA9IG51bGw7XG4gICAgdGhpcy5zdG9yZSA9IG51bGw7XG4gICAgdGhpcy5lbCA9IG51bGw7XG4gIH0sXG5cbiAgY29uc3VtZVN0YXR1c0JhcihzdGF0dXNCYXI6IGF0b20kU3RhdHVzQmFyKSB7XG4gICAgdGhpcy5zdGF0dXNCYXJUaWxlID0gbmV3IFN0YXR1c0JhclRpbGUodGhpcy5zdG9yZSk7XG4gICAgY29uc3QgZGlzcG9zYWJsZSA9IG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLnN0YXR1c0JhclRpbGUpIHtcbiAgICAgICAgdGhpcy5zdGF0dXNCYXJUaWxlLmRpc3Bvc2UoKTtcbiAgICAgICAgdGhpcy5zdGF0dXNCYXJUaWxlID0gbnVsbDtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLnN0YXR1c0JhclRpbGUuY29uc3VtZVN0YXR1c0JhcihzdGF0dXNCYXIpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoZGlzcG9zYWJsZSk7XG4gICAgcmV0dXJuIGRpc3Bvc2FibGU7XG4gIH0sXG5cbiAgcmVmYWN0b3IoZTogRXZlbnQpIHtcbiAgICBpZiAoIShlLnRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFdmVudFRhcmdldCBtdXN0IGJlIGFuIEhUTUxFbGVtZW50Jyk7XG4gICAgfVxuXG4gICAgY29uc3Qgb25DbG9zZSA9ICgpID0+IHtcbiAgICAgIGlmICh0aGlzLm1vZGFsUGFuZWwpIHRoaXMubW9kYWxQYW5lbC5kZXN0cm95KCk7XG4gICAgfTtcblxuICAgIGNvbnN0IHNob3dMb2FkZXIgPSAoKSA9PiB0aGlzLnN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ3JlZmFjdG9yLXN0YXJ0JyB9KTtcbiAgICBjb25zdCBoaWRlTG9hZGVyID0gKCkgPT4gdGhpcy5zdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdyZWZhY3Rvci1lbmQnIH0pO1xuXG4gICAgYXN5bmMgZnVuY3Rpb24gb25SZW5hbWUoeyBwcmV2aW91c1BhdGgsIG5leHRQYXRoIH0pIHtcbiAgICAgIG9uQ2xvc2UoKTtcbiAgICAgIHNob3dMb2FkZXIoKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHJlbmFtZVBhdGhzKHByZXZpb3VzUGF0aCwgbmV4dFBhdGgpO1xuICAgICAgfSBjYXRjaCAocnVudGltZUVycm9yKSB7XG4gICAgICAgIGhpZGVMb2FkZXIoKTtcbiAgICAgICAgdGhyb3cgcnVudGltZUVycm9yO1xuICAgICAgfVxuICAgICAgaGlkZUxvYWRlcigpO1xuICAgIH1cblxuICAgIGNvbnN0IHByZXZpb3VzUGF0aCA9IGdldFBhdGhGcm9tQ29udGV4dE1lbnVUYXJnZXQoZS50YXJnZXQpO1xuICAgIGlmICghcHJldmlvdXNQYXRoKSByZXR1cm47XG5cbiAgICB0aGlzLmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5tb2RhbFBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCh7IGl0ZW06IHRoaXMuZWwgfSk7XG4gICAgUmVhY3RET00ucmVuZGVyKFxuICAgICAgPFBhdGhSZW5hbWVGb3JtXG4gICAgICAgIHByZXZpb3VzUGF0aD17cHJldmlvdXNQYXRofVxuICAgICAgICBvbkNsb3NlPXtvbkNsb3NlfVxuICAgICAgICBvblJlbmFtZT17b25SZW5hbWV9XG4gICAgICAvPlxuICAgICwgdGhpcy5lbCk7XG4gIH0sXG59O1xuIl19