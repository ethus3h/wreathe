(function() {
  var ConsoleManager, Emitter;

  Emitter = null;

  module.exports = ConsoleManager = (function() {
    function ConsoleManager(view) {
      this.view = view;
      Emitter = require('event-kit').Emitter;
      this.emitter = new Emitter;
    }

    ConsoleManager.prototype.destroy = function() {
      return this.emitter.dispose();
    };

    ConsoleManager.prototype.toggle = function() {
      return this.view.toggle();
    };

    ConsoleManager.prototype.log = function(message, level) {
      if (level == null) {
        level = 'info';
      }
      return this.view.log(message, level);
    };

    ConsoleManager.prototype.error = function(message) {
      return this.log(message, 'error');
    };

    ConsoleManager.prototype.warn = function(message) {
      return this.log(message, 'warn');
    };

    ConsoleManager.prototype.notice = function(message) {
      return this.log(message, 'notice');
    };

    ConsoleManager.prototype.debug = function(message) {
      return this.log(message, 'debug');
    };

    ConsoleManager.prototype.raw = function(rawText, level, lineEnding) {
      var line, _i, _len, _ref, _results;
      if (level == null) {
        level = 'info';
      }
      if (lineEnding == null) {
        lineEnding = "\n";
      }
      _ref = rawText.split(lineEnding);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        _results.push(this.log(line, level));
      }
      return _results;
    };

    ConsoleManager.prototype.clear = function() {
      return this.view.clear();
    };

    return ConsoleManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9jb25zb2xlLXBhbmVsL2xpYi9jb25zb2xlLW1hbmFnZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVCQUFBOztBQUFBLEVBQUEsT0FBQSxHQUFVLElBQVYsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ087QUFDUSxJQUFBLHdCQUFFLElBQUYsR0FBQTtBQUNaLE1BRGEsSUFBQyxDQUFBLE9BQUEsSUFDZCxDQUFBO0FBQUEsTUFBQyxVQUFXLE9BQUEsQ0FBUSxXQUFSLEVBQVgsT0FBRCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQUZYLENBRFk7SUFBQSxDQUFiOztBQUFBLDZCQUtBLE9BQUEsR0FBUyxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsT0FBTyxDQUFDLE9BQVQsQ0FBQSxFQURRO0lBQUEsQ0FMVCxDQUFBOztBQUFBLDZCQVNBLE1BQUEsR0FBUSxTQUFBLEdBQUE7YUFDUCxJQUFDLENBQUEsSUFBSSxDQUFDLE1BQU4sQ0FBQSxFQURPO0lBQUEsQ0FUUixDQUFBOztBQUFBLDZCQWFBLEdBQUEsR0FBSyxTQUFDLE9BQUQsRUFBVSxLQUFWLEdBQUE7O1FBQVUsUUFBTTtPQUNwQjthQUFBLElBQUMsQ0FBQSxJQUFJLENBQUMsR0FBTixDQUFVLE9BQVYsRUFBbUIsS0FBbkIsRUFESTtJQUFBLENBYkwsQ0FBQTs7QUFBQSw2QkFpQkEsS0FBQSxHQUFPLFNBQUMsT0FBRCxHQUFBO2FBQ04sSUFBQyxDQUFBLEdBQUQsQ0FBSyxPQUFMLEVBQWMsT0FBZCxFQURNO0lBQUEsQ0FqQlAsQ0FBQTs7QUFBQSw2QkFxQkEsSUFBQSxHQUFNLFNBQUMsT0FBRCxHQUFBO2FBQ0wsSUFBQyxDQUFBLEdBQUQsQ0FBSyxPQUFMLEVBQWMsTUFBZCxFQURLO0lBQUEsQ0FyQk4sQ0FBQTs7QUFBQSw2QkF5QkEsTUFBQSxHQUFRLFNBQUMsT0FBRCxHQUFBO2FBQ1AsSUFBQyxDQUFBLEdBQUQsQ0FBSyxPQUFMLEVBQWMsUUFBZCxFQURPO0lBQUEsQ0F6QlIsQ0FBQTs7QUFBQSw2QkE2QkEsS0FBQSxHQUFPLFNBQUMsT0FBRCxHQUFBO2FBQ04sSUFBQyxDQUFBLEdBQUQsQ0FBSyxPQUFMLEVBQWMsT0FBZCxFQURNO0lBQUEsQ0E3QlAsQ0FBQTs7QUFBQSw2QkFpQ0EsR0FBQSxHQUFLLFNBQUMsT0FBRCxFQUFVLEtBQVYsRUFBd0IsVUFBeEIsR0FBQTtBQUNKLFVBQUEsOEJBQUE7O1FBRGMsUUFBTTtPQUNwQjs7UUFENEIsYUFBVztPQUN2QztBQUFBO0FBQUE7V0FBQSwyQ0FBQTt3QkFBQTtBQUNDLHNCQUFBLElBQUMsQ0FBQSxHQUFELENBQUssSUFBTCxFQUFXLEtBQVgsRUFBQSxDQUREO0FBQUE7c0JBREk7SUFBQSxDQWpDTCxDQUFBOztBQUFBLDZCQXNDQSxLQUFBLEdBQU8sU0FBQSxHQUFBO2FBQ04sSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQUEsRUFETTtJQUFBLENBdENQLENBQUE7OzBCQUFBOztNQUpGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/kyan/.atom/packages/console-panel/lib/console-manager.coffee
