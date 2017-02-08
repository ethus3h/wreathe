(function() {
  var CompositeDisposable, Console, ConsoleManager, ConsoleView;

  ConsoleView = require('./console-view');

  ConsoleManager = require('./console-manager');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = Console = {
    consoleView: null,
    subscriptions: null,
    activate: function(state) {
      this.consoleView = new ConsoleView(state.consoleViewState);
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
    serialize: function() {
      return {
        consoleViewState: this.consoleView.serialize()
      };
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9jb25zb2xlLXBhbmVsL2xpYi9jb25zb2xlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5REFBQTs7QUFBQSxFQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FBZCxDQUFBOztBQUFBLEVBQ0EsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVIsQ0FEakIsQ0FBQTs7QUFBQSxFQUVDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFGRCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsT0FBQSxHQUNmO0FBQUEsSUFBQSxXQUFBLEVBQWEsSUFBYjtBQUFBLElBQ0EsYUFBQSxFQUFlLElBRGY7QUFBQSxJQUdBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLFdBQUQsR0FBbUIsSUFBQSxXQUFBLENBQVksS0FBSyxDQUFDLGdCQUFsQixDQUFuQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsY0FBRCxHQUFzQixJQUFBLGNBQUEsQ0FBZSxJQUFDLENBQUEsV0FBaEIsQ0FEdEIsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUpqQixDQUFBO2FBT0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7QUFBQSxRQUFBLGdCQUFBLEVBQWtCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUN2RSxLQUFDLENBQUEsY0FBYyxDQUFDLE1BQWhCLENBQUEsRUFEdUU7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQjtPQUFwQyxDQUFuQixFQVJRO0lBQUEsQ0FIVjtBQUFBLElBY0EsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUEsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUEsRUFGVTtJQUFBLENBZFo7QUFBQSxJQWtCQSxTQUFBLEVBQVcsU0FBQSxHQUFBO2FBQ1Q7QUFBQSxRQUFBLGdCQUFBLEVBQWtCLElBQUMsQ0FBQSxXQUFXLENBQUMsU0FBYixDQUFBLENBQWxCO1FBRFM7SUFBQSxDQWxCWDtBQUFBLElBcUJBLG1CQUFBLEVBQXFCLFNBQUEsR0FBQTthQUNuQixJQUFDLENBQUEsZUFEa0I7SUFBQSxDQXJCckI7QUFBQSxJQXdCQSxjQUFBLEVBQWdCLFNBQUMsT0FBRCxHQUFBO0FBQ2QsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLE9BQUEsQ0FBUSxrQkFBUixDQUFYLENBQUE7YUFFQSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVQsQ0FDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFlBQU47QUFBQSxRQUNBLE9BQUEsRUFBUyxJQURUO0FBQUEsUUFFQSxPQUFBLEVBQVMsZ0JBRlQ7QUFBQSxRQUdBLFFBQUEsRUFBVSxnQkFIVjtPQURGLEVBSGM7SUFBQSxDQXhCaEI7R0FMRixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/kyan/.atom/packages/console-panel/lib/console.coffee
