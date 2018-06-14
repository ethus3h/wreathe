(function() {
  var CompositeDisposable, Disposable, Main, ModuleManager, Watcher, d, packageManager, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ref = require('atom'), Disposable = ref.Disposable, CompositeDisposable = ref.CompositeDisposable;

  Watcher = require('./watcher');

  ModuleManager = require('./module_manager');

  packageManager = atom.packages;

  d = (require('./debug'))('refactor');

  module.exports = new (Main = (function() {
    function Main() {
      this.onDone = bind(this.onDone, this);
      this.onRename = bind(this.onRename, this);
    }

    Main.prototype.config = {
      highlightError: {
        type: 'boolean',
        "default": true
      },
      highlightReference: {
        type: 'boolean',
        "default": true
      }
    };

    Main.prototype.activate = function(state) {
      var disposeWatchers;
      console.time('activate refactor');
      d('activate');
      console.time('init module manager');
      this.moduleManager = new ModuleManager;
      console.timeEnd('init module manager');
      this.watchers = new Set;
      disposeWatchers = function() {
        var results, w;
        results = [];
        for (w in this.watchers) {
          results.push(w.dispose());
        }
        return results;
      };
      this.disposables = new CompositeDisposable;
      this.disposables.add(this.moduleManager);
      this.disposables.add(new Disposable(disposeWatchers));
      this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var watcher;
          watcher = new Watcher(_this.moduleManager, editor);
          _this.watchers.add(watcher);
          return editor.onDidDestroy(function() {
            _this.watchers["delete"](watcher);
            return watcher.dispose();
          });
        };
      })(this)));
      this.disposables.add(atom.commands.add('atom-text-editor', 'refactor:rename', this.onRename));
      this.disposables.add(atom.commands.add('atom-text-editor', 'refactor:done', this.onDone));
      return console.timeEnd('activate refactor');
    };

    Main.prototype.deactivate = function() {
      d('deactivate');
      this.disposables.dispose();
      this.moduleManager = null;
      return this.watchers = null;
    };

    Main.prototype.serialize = function() {};

    Main.prototype.onRename = function(e) {
      var isExecuted;
      isExecuted = false;
      this.watchers.forEach(function(watcher) {
        return isExecuted || (isExecuted = watcher.rename());
      });
      d('rename', isExecuted);
      if (isExecuted) {
        return;
      }
      return e.abortKeyBinding();
    };

    Main.prototype.onDone = function(e) {
      var isExecuted;
      isExecuted = false;
      this.watchers.forEach(function(watcher) {
        return isExecuted || (isExecuted = watcher.done());
      });
      if (isExecuted) {
        return;
      }
      return e.abortKeyBinding();
    };

    return Main;

  })());

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2xpYnJhcnkvRW1iZXIgc2F0ZWxsaXRlIHByb2plY3RzL3dyZWF0aGUtYmFzZS91c3Ivc2hhcmUvYXRvbS9wYWNrYWdlcy9yZWZhY3Rvci9saWIvcmVmYWN0b3IuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxxRkFBQTtJQUFBOztFQUFBLE1BQXNDLE9BQUEsQ0FBUSxNQUFSLENBQXRDLEVBQUUsMkJBQUYsRUFBYzs7RUFDZCxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVI7O0VBQ1YsYUFBQSxHQUFnQixPQUFBLENBQVEsa0JBQVI7O0VBQ0osaUJBQW1CLEtBQTdCOztFQUNGLENBQUEsR0FBSSxDQUFDLE9BQUEsQ0FBUSxTQUFSLENBQUQsQ0FBQSxDQUFvQixVQUFwQjs7RUFFSixNQUFNLENBQUMsT0FBUCxHQUNBLEtBQVU7Ozs7OzttQkFFUixNQUFBLEdBQ0U7TUFBQSxjQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtPQURGO01BR0Esa0JBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO09BSkY7OzttQkFRRixRQUFBLEdBQVUsU0FBQyxLQUFEO0FBQ1IsVUFBQTtNQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsbUJBQWI7TUFDQSxDQUFBLENBQUUsVUFBRjtNQUVBLE9BQU8sQ0FBQyxJQUFSLENBQWEscUJBQWI7TUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO01BQ3JCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLHFCQUFoQjtNQUNBLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBSTtNQUNoQixlQUFBLEdBQWtCLFNBQUE7QUFBTSxZQUFBO0FBQUE7YUFBQSxrQkFBQTt1QkFBQSxDQUFDLENBQUMsT0FBRixDQUFBO0FBQUE7O01BQU47TUFFbEIsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJO01BQ25CLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFDLENBQUEsYUFBbEI7TUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxVQUFKLENBQWUsZUFBZixDQUFqQjtNQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxNQUFEO0FBQ2pELGNBQUE7VUFBQSxPQUFBLEdBQVUsSUFBSSxPQUFKLENBQVksS0FBQyxDQUFBLGFBQWIsRUFBNEIsTUFBNUI7VUFDVixLQUFDLENBQUEsUUFBUSxDQUFDLEdBQVYsQ0FBYyxPQUFkO2lCQUNBLE1BQU0sQ0FBQyxZQUFQLENBQW9CLFNBQUE7WUFDbEIsS0FBQyxDQUFBLFFBQVEsRUFBQyxNQUFELEVBQVQsQ0FBaUIsT0FBakI7bUJBQ0EsT0FBTyxDQUFDLE9BQVIsQ0FBQTtVQUZrQixDQUFwQjtRQUhpRDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEMsQ0FBakI7TUFNQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUFzQyxpQkFBdEMsRUFBeUQsSUFBQyxDQUFBLFFBQTFELENBQWpCO01BQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0MsZUFBdEMsRUFBdUQsSUFBQyxDQUFBLE1BQXhELENBQWpCO2FBQ0EsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsbUJBQWhCO0lBckJROzttQkF1QlYsVUFBQSxHQUFZLFNBQUE7TUFDVixDQUFBLENBQUUsWUFBRjtNQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBO01BQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUI7YUFDakIsSUFBQyxDQUFBLFFBQUQsR0FBWTtJQUpGOzttQkFNWixTQUFBLEdBQVcsU0FBQSxHQUFBOzttQkFHWCxRQUFBLEdBQVUsU0FBQyxDQUFEO0FBQ1IsVUFBQTtNQUFBLFVBQUEsR0FBYTtNQUNiLElBQUMsQ0FBQSxRQUFRLENBQUMsT0FBVixDQUFrQixTQUFDLE9BQUQ7ZUFDaEIsZUFBQSxhQUFlLE9BQU8sQ0FBQyxNQUFSLENBQUE7TUFEQyxDQUFsQjtNQUVBLENBQUEsQ0FBRSxRQUFGLEVBQVksVUFBWjtNQUNBLElBQVUsVUFBVjtBQUFBLGVBQUE7O2FBQ0EsQ0FBQyxDQUFDLGVBQUYsQ0FBQTtJQU5ROzttQkFRVixNQUFBLEdBQVEsU0FBQyxDQUFEO0FBQ04sVUFBQTtNQUFBLFVBQUEsR0FBYTtNQUNiLElBQUMsQ0FBQSxRQUFRLENBQUMsT0FBVixDQUFrQixTQUFDLE9BQUQ7ZUFDaEIsZUFBQSxhQUFlLE9BQU8sQ0FBQyxJQUFSLENBQUE7TUFEQyxDQUFsQjtNQUVBLElBQVUsVUFBVjtBQUFBLGVBQUE7O2FBQ0EsQ0FBQyxDQUFDLGVBQUYsQ0FBQTtJQUxNOzs7OztBQTFEViIsInNvdXJjZXNDb250ZW50IjpbInsgRGlzcG9zYWJsZSwgQ29tcG9zaXRlRGlzcG9zYWJsZSB9ID0gcmVxdWlyZSAnYXRvbSdcbldhdGNoZXIgPSByZXF1aXJlICcuL3dhdGNoZXInXG5Nb2R1bGVNYW5hZ2VyID0gcmVxdWlyZSAnLi9tb2R1bGVfbWFuYWdlcidcbnsgcGFja2FnZXM6IHBhY2thZ2VNYW5hZ2VyIH0gPSBhdG9tXG5kID0gKHJlcXVpcmUgJy4vZGVidWcnKSAncmVmYWN0b3InXG5cbm1vZHVsZS5leHBvcnRzID1cbm5ldyBjbGFzcyBNYWluXG5cbiAgY29uZmlnOlxuICAgIGhpZ2hsaWdodEVycm9yOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgaGlnaGxpZ2h0UmVmZXJlbmNlOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG5cblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIGNvbnNvbGUudGltZSgnYWN0aXZhdGUgcmVmYWN0b3InKVxuICAgIGQgJ2FjdGl2YXRlJ1xuXG4gICAgY29uc29sZS50aW1lKCdpbml0IG1vZHVsZSBtYW5hZ2VyJylcbiAgICBAbW9kdWxlTWFuYWdlciA9IG5ldyBNb2R1bGVNYW5hZ2VyXG4gICAgY29uc29sZS50aW1lRW5kKCdpbml0IG1vZHVsZSBtYW5hZ2VyJylcbiAgICBAd2F0Y2hlcnMgPSBuZXcgU2V0XG4gICAgZGlzcG9zZVdhdGNoZXJzID0gKCkgLT4gdy5kaXNwb3NlKCkgZm9yIHcgb2YgQHdhdGNoZXJzXG5cbiAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBkaXNwb3NhYmxlcy5hZGQgQG1vZHVsZU1hbmFnZXJcbiAgICBAZGlzcG9zYWJsZXMuYWRkIG5ldyBEaXNwb3NhYmxlIGRpc3Bvc2VXYXRjaGVyc1xuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+XG4gICAgICB3YXRjaGVyID0gbmV3IFdhdGNoZXIgQG1vZHVsZU1hbmFnZXIsIGVkaXRvclxuICAgICAgQHdhdGNoZXJzLmFkZCB3YXRjaGVyXG4gICAgICBlZGl0b3Iub25EaWREZXN0cm95ID0+XG4gICAgICAgIEB3YXRjaGVycy5kZWxldGUgd2F0Y2hlclxuICAgICAgICB3YXRjaGVyLmRpc3Bvc2UoKVxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAncmVmYWN0b3I6cmVuYW1lJywgQG9uUmVuYW1lXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdyZWZhY3Rvcjpkb25lJywgQG9uRG9uZVxuICAgIGNvbnNvbGUudGltZUVuZCgnYWN0aXZhdGUgcmVmYWN0b3InKVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgZCAnZGVhY3RpdmF0ZSdcbiAgICBAZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gICAgQG1vZHVsZU1hbmFnZXIgPSBudWxsXG4gICAgQHdhdGNoZXJzID0gbnVsbFxuXG4gIHNlcmlhbGl6ZTogLT5cblxuXG4gIG9uUmVuYW1lOiAoZSkgPT5cbiAgICBpc0V4ZWN1dGVkID0gZmFsc2VcbiAgICBAd2F0Y2hlcnMuZm9yRWFjaCAod2F0Y2hlcikgLT5cbiAgICAgIGlzRXhlY3V0ZWQgb3I9IHdhdGNoZXIucmVuYW1lKClcbiAgICBkICdyZW5hbWUnLCBpc0V4ZWN1dGVkXG4gICAgcmV0dXJuIGlmIGlzRXhlY3V0ZWRcbiAgICBlLmFib3J0S2V5QmluZGluZygpXG5cbiAgb25Eb25lOiAoZSkgPT5cbiAgICBpc0V4ZWN1dGVkID0gZmFsc2VcbiAgICBAd2F0Y2hlcnMuZm9yRWFjaCAod2F0Y2hlcikgLT5cbiAgICAgIGlzRXhlY3V0ZWQgb3I9IHdhdGNoZXIuZG9uZSgpXG4gICAgcmV0dXJuIGlmIGlzRXhlY3V0ZWRcbiAgICBlLmFib3J0S2V5QmluZGluZygpXG4iXX0=
