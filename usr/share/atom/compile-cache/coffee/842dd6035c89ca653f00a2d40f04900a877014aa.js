(function() {
  var $, ErrorView, View, prettyjson, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  prettyjson = require('prettyjson');

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  ErrorView = (function(_super) {
    __extends(ErrorView, _super);

    function ErrorView() {
      return ErrorView.__super__.constructor.apply(this, arguments);
    }

    ErrorView.content = function(raw) {
      var message;
      message = _.isString(raw) ? raw : raw.message;
      return this.div((function(_this) {
        return function() {
          return _this.div({
            "class": 'overlay from-bottom atomatigit-error',
            outlet: 'messagePanel'
          }, function() {
            return _this.div({
              "class": 'panel-body padded error-message'
            }, message);
          });
        };
      })(this));
    };

    ErrorView.prototype.initialize = function(error) {
      if (atom.config.get('atomatigit.debug')) {
        console.trace(prettyjson.render(error, {
          noColor: true
        }));
      }
      this.messagePanel.on('click', this.detach);
      atom.views.getView(atom.workspace).appendChild(this.element);
      return setTimeout(((function(_this) {
        return function() {
          return _this.detach();
        };
      })(this)), 10000);
    };

    return ErrorView;

  })(View);

  module.exports = ErrorView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9hdG9tYXRpZ2l0L2xpYi92aWV3cy9lcnJvci12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1Q0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFhLE9BQUEsQ0FBUSxRQUFSLENBQWIsQ0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsWUFBUixDQURiLENBQUE7O0FBQUEsRUFFQSxPQUFnQixPQUFBLENBQVEsc0JBQVIsQ0FBaEIsRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBRkosQ0FBQTs7QUFBQSxFQUtNO0FBQ0osZ0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsU0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLEdBQUQsR0FBQTtBQUNSLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFhLENBQUMsQ0FBQyxRQUFGLENBQVcsR0FBWCxDQUFILEdBQXdCLEdBQXhCLEdBQWlDLEdBQUcsQ0FBQyxPQUEvQyxDQUFBO2FBQ0EsSUFBQyxDQUFBLEdBQUQsQ0FBSyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNILEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxzQ0FBUDtBQUFBLFlBQStDLE1BQUEsRUFBUSxjQUF2RDtXQUFMLEVBQTRFLFNBQUEsR0FBQTttQkFDMUUsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLGlDQUFQO2FBQUwsRUFBK0MsT0FBL0MsRUFEMEU7VUFBQSxDQUE1RSxFQURHO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBTCxFQUZRO0lBQUEsQ0FBVixDQUFBOztBQUFBLHdCQU9BLFVBQUEsR0FBWSxTQUFDLEtBQUQsR0FBQTtBQUNWLE1BQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isa0JBQWhCLENBQUg7QUFDRSxRQUFBLE9BQU8sQ0FBQyxLQUFSLENBQWMsVUFBVSxDQUFDLE1BQVgsQ0FBa0IsS0FBbEIsRUFBeUI7QUFBQSxVQUFBLE9BQUEsRUFBUyxJQUFUO1NBQXpCLENBQWQsQ0FBQSxDQURGO09BQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxZQUFZLENBQUMsRUFBZCxDQUFpQixPQUFqQixFQUEwQixJQUFDLENBQUEsTUFBM0IsQ0FIQSxDQUFBO0FBQUEsTUFJQSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQWtDLENBQUMsV0FBbkMsQ0FBK0MsSUFBQyxDQUFBLE9BQWhELENBSkEsQ0FBQTthQUtBLFVBQUEsQ0FBVyxDQUFDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBRCxDQUFYLEVBQTJCLEtBQTNCLEVBTlU7SUFBQSxDQVBaLENBQUE7O3FCQUFBOztLQURzQixLQUx4QixDQUFBOztBQUFBLEVBcUJBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBckJqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/kyan/.atom/packages/atomatigit/lib/views/error-view.coffee
