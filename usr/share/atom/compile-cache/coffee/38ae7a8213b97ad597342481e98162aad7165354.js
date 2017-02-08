(function() {
  var $, ErrorView, InputView, OutputView, TextEditorView, View, git, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View, TextEditorView = _ref.TextEditorView;

  ErrorView = require('./error-view');

  OutputView = require('./output-view');

  git = require('../git');

  InputView = (function(_super) {
    __extends(InputView, _super);

    function InputView() {
      return InputView.__super__.constructor.apply(this, arguments);
    }

    InputView.content = function(_arg) {
      var message;
      message = (_arg != null ? _arg : {}).message;
      return this.div({
        "class": 'overlay from-top'
      }, (function(_this) {
        return function() {
          return _this.subview('inputEditor', new TextEditorView({
            mini: true,
            placeholderText: message
          }));
        };
      })(this));
    };

    InputView.prototype.initialize = function(_arg) {
      var callback;
      callback = (_arg != null ? _arg : {}).callback;
      this.currentPane = atom.workspace.getActivePane();
      atom.views.getView(atom.workspace).appendChild(this.element);
      this.inputEditor.focus();
      this.on('focusout', this.detach);
      atom.commands.add(this.element, 'core:cancel', function() {
        return atom.commands.dispatch(atom.views.getView(atom.workspace), 'atomatigit:toggle');
      });
      return atom.commands.add(this.inputEditor.element, 'core:confirm', (function(_this) {
        return function() {
          return typeof callback === "function" ? callback(_this.inputEditor.getText()) : void 0;
        };
      })(this));
    };

    return InputView;

  })(View);

  module.exports = InputView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9hdG9tYXRpZ2l0L2xpYi92aWV3cy9pbnB1dC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxvRUFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBNEIsT0FBQSxDQUFRLHNCQUFSLENBQTVCLEVBQUMsU0FBQSxDQUFELEVBQUksWUFBQSxJQUFKLEVBQVUsc0JBQUEsY0FBVixDQUFBOztBQUFBLEVBQ0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSLENBRFosQ0FBQTs7QUFBQSxFQUVBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUZiLENBQUE7O0FBQUEsRUFHQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FITixDQUFBOztBQUFBLEVBS007QUFDSixnQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxTQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsSUFBRCxHQUFBO0FBQ1IsVUFBQSxPQUFBO0FBQUEsTUFEVSwwQkFBRCxPQUFVLElBQVQsT0FDVixDQUFBO2FBQUEsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLGtCQUFQO09BQUwsRUFBZ0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDOUIsS0FBQyxDQUFBLE9BQUQsQ0FBUyxhQUFULEVBQTRCLElBQUEsY0FBQSxDQUFlO0FBQUEsWUFBQSxJQUFBLEVBQU0sSUFBTjtBQUFBLFlBQVksZUFBQSxFQUFpQixPQUE3QjtXQUFmLENBQTVCLEVBRDhCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEMsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSx3QkFJQSxVQUFBLEdBQVksU0FBQyxJQUFELEdBQUE7QUFDVixVQUFBLFFBQUE7QUFBQSxNQURZLDJCQUFELE9BQVcsSUFBVixRQUNaLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBZixDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQWtDLENBQUMsV0FBbkMsQ0FBK0MsSUFBQyxDQUFBLE9BQWhELENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxLQUFiLENBQUEsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsRUFBRCxDQUFJLFVBQUosRUFBZ0IsSUFBQyxDQUFBLE1BQWpCLENBSEEsQ0FBQTtBQUFBLE1BSUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQUMsQ0FBQSxPQUFuQixFQUE0QixhQUE1QixFQUEyQyxTQUFBLEdBQUE7ZUFDekMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBdkIsRUFBMkQsbUJBQTNELEVBRHlDO01BQUEsQ0FBM0MsQ0FKQSxDQUFBO2FBTUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBL0IsRUFBd0MsY0FBeEMsRUFBd0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtrREFDdEQsU0FBVSxLQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQSxZQUQ0QztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhELEVBUFU7SUFBQSxDQUpaLENBQUE7O3FCQUFBOztLQURzQixLQUx4QixDQUFBOztBQUFBLEVBb0JBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBcEJqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/kyan/.atom/packages/atomatigit/lib/views/input-view.coffee
