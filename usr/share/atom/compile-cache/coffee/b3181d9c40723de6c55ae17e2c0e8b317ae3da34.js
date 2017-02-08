(function() {
  var CompositeDisposable, Console, ConsoleManager, ConsoleView;

  ConsoleView = require('./console-view');

  ConsoleManager = require('./console-manager');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = Console = {
    consoleView: null,
    subscriptions: null,
    activate: function() {
      this.consoleView = new ConsoleView();
      this.consoleManager = new ConsoleManager(this.consoleView);
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'console:toggle': (function(_this) {
          return function() {
            return _this.consoleManager.toggle();
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.subscriptions.dispose();
      return this.consoleView.destroy();
    },
    provideConsolePanel: function() {
      return this.consoleManager;
    },
    consumeToolBar: function(toolBar) {
      this.toolBar = toolBar('console-tool-bar');
      return this.toolBar.addButton({
        icon: 'align-left',
        iconset: 'fi',
        tooltip: 'Toggle Console',
        callback: 'console:toggle'
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9jb25zb2xlLXBhbmVsL2xpYi9jb25zb2xlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUjs7RUFDZCxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxtQkFBUjs7RUFDaEIsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUFpQixPQUFBLEdBQ2Y7SUFBQSxXQUFBLEVBQWEsSUFBYjtJQUNBLGFBQUEsRUFBZSxJQURmO0lBR0EsUUFBQSxFQUFVLFNBQUE7TUFDUixJQUFDLENBQUEsV0FBRCxHQUFtQixJQUFBLFdBQUEsQ0FBQTtNQUNuQixJQUFDLENBQUEsY0FBRCxHQUFzQixJQUFBLGNBQUEsQ0FBZSxJQUFDLENBQUEsV0FBaEI7TUFHdEIsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTthQUdyQixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztRQUFBLGdCQUFBLEVBQWtCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQ3ZFLEtBQUMsQ0FBQSxjQUFjLENBQUMsTUFBaEIsQ0FBQTtVQUR1RTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEI7T0FBcEMsQ0FBbkI7SUFSUSxDQUhWO0lBY0EsVUFBQSxFQUFZLFNBQUE7TUFDVixJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQTthQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBO0lBRlUsQ0FkWjtJQWtCQSxtQkFBQSxFQUFxQixTQUFBO2FBQ25CLElBQUMsQ0FBQTtJQURrQixDQWxCckI7SUFxQkEsY0FBQSxFQUFnQixTQUFDLE9BQUQ7TUFDZCxJQUFDLENBQUEsT0FBRCxHQUFXLE9BQUEsQ0FBUSxrQkFBUjthQUVYLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBVCxDQUNFO1FBQUEsSUFBQSxFQUFNLFlBQU47UUFDQSxPQUFBLEVBQVMsSUFEVDtRQUVBLE9BQUEsRUFBUyxnQkFGVDtRQUdBLFFBQUEsRUFBVSxnQkFIVjtPQURGO0lBSGMsQ0FyQmhCOztBQUxGIiwic291cmNlc0NvbnRlbnQiOlsiQ29uc29sZVZpZXcgPSByZXF1aXJlICcuL2NvbnNvbGUtdmlldydcbkNvbnNvbGVNYW5hZ2VyID0gcmVxdWlyZSAnLi9jb25zb2xlLW1hbmFnZXInXG57Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnNvbGUgPVxuICBjb25zb2xlVmlldzogbnVsbFxuICBzdWJzY3JpcHRpb25zOiBudWxsXG5cbiAgYWN0aXZhdGU6ICgpIC0+XG4gICAgQGNvbnNvbGVWaWV3ID0gbmV3IENvbnNvbGVWaWV3KClcbiAgICBAY29uc29sZU1hbmFnZXIgPSBuZXcgQ29uc29sZU1hbmFnZXIoQGNvbnNvbGVWaWV3KVxuXG4gICAgIyBFdmVudHMgc3Vic2NyaWJlZCB0byBpbiBhdG9tJ3Mgc3lzdGVtIGNhbiBiZSBlYXNpbHkgY2xlYW5lZCB1cCB3aXRoIGEgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgICMgUmVnaXN0ZXIgY29tbWFuZCB0aGF0IHRvZ2dsZXMgdGhpcyB2aWV3XG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdjb25zb2xlOnRvZ2dsZSc6ID0+XG4gICAgICBAY29uc29sZU1hbmFnZXIudG9nZ2xlKClcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIEBjb25zb2xlVmlldy5kZXN0cm95KClcblxuICBwcm92aWRlQ29uc29sZVBhbmVsOiAtPlxuICAgIEBjb25zb2xlTWFuYWdlclxuXG4gIGNvbnN1bWVUb29sQmFyOiAodG9vbEJhcikgLT5cbiAgICBAdG9vbEJhciA9IHRvb2xCYXIgJ2NvbnNvbGUtdG9vbC1iYXInXG5cbiAgICBAdG9vbEJhci5hZGRCdXR0b25cbiAgICAgIGljb246ICdhbGlnbi1sZWZ0J1xuICAgICAgaWNvbnNldDogJ2ZpJ1xuICAgICAgdG9vbHRpcDogJ1RvZ2dsZSBDb25zb2xlJ1xuICAgICAgY2FsbGJhY2s6ICdjb25zb2xlOnRvZ2dsZSdcbiJdfQ==
