(function() {
  var $, $$, ConsoleView, View,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  $ = null;

  $$ = null;

  module.exports = ConsoleView = (function(_super) {
    __extends(ConsoleView, _super);

    function ConsoleView() {
      this.resizeView = __bind(this.resizeView, this);
      this.resizeStopped = __bind(this.resizeStopped, this);
      this.resizeStarted = __bind(this.resizeStarted, this);
      return ConsoleView.__super__.constructor.apply(this, arguments);
    }

    ConsoleView.content = function() {
      return this.div({
        id: 'atom-console',
        "class": 'view-resizer panel'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'view-resize-handle',
            outlet: 'resizeHandle'
          });
          _this.div({
            "class": 'panel-heading',
            dblclick: 'toggle',
            outlet: 'heading'
          }, 'Console', function() {
            return _this.button({
              "class": 'btn pull-right',
              click: 'clear'
            }, 'Clear');
          });
          return _this.div({
            "class": 'panel-body closed view-scroller',
            outlet: 'body'
          }, function() {
            return _this.pre({
              "class": 'native-key-bindings',
              outlet: 'output',
              tabindex: -1
            });
          });
        };
      })(this));
    };

    ConsoleView.prototype.initialize = function(serializeState) {
      var _ref;
      _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$;
      this.body.height(serializeState != null ? serializeState.height : void 0);
      atom.workspace.addBottomPanel({
        item: this.element,
        priority: 100
      });
      return this.handleEvents();
    };

    ConsoleView.prototype.serialize = function() {
      return {
        height: this.body.height
      };
    };

    ConsoleView.prototype.destroy = function() {
      var _ref;
      return (_ref = this.disposables) != null ? _ref.dispose() : void 0;
    };

    ConsoleView.prototype.show = function() {
      return this.body.removeClass('closed');
    };

    ConsoleView.prototype.hide = function() {
      return this.body.addClass('closed');
    };

    ConsoleView.prototype.toggle = function() {
      if (this.body.hasClass('closed')) {
        return this.show();
      } else {
        return this.hide();
      }
    };

    ConsoleView.prototype.log = function(message, level) {
      var at_bottom;
      at_bottom = this.body.scrollTop() + this.body.innerHeight() + 10 > this.body[0].scrollHeight;
      if (typeof message === 'string') {
        this.output.append($$(function() {
          return this.p({
            "class": 'level-' + level
          }, message);
        }));
      } else {
        this.output.append(message);
      }
      if (at_bottom) {
        this.body.scrollTop(this.body[0].scrollHeight);
      }
      return this.show();
    };

    ConsoleView.prototype.clear = function() {
      this.output.empty();
      return this.hide();
    };

    ConsoleView.prototype.handleEvents = function() {
      this.on('dblclick', '.view-resize-handle', (function(_this) {
        return function() {
          return _this.resizeToFitContent();
        };
      })(this));
      return this.on('mousedown', '.view-resize-handle', (function(_this) {
        return function(e) {
          return _this.resizeStarted(e);
        };
      })(this));
    };

    ConsoleView.prototype.resizeStarted = function() {
      $(document).on('mousemove', this.resizeView);
      return $(document).on('mouseup', this.resizeStopped);
    };

    ConsoleView.prototype.resizeStopped = function() {
      $(document).off('mousemove', this.resizeView);
      return $(document).off('mouseup', this.resizeStopped);
    };

    ConsoleView.prototype.resizeView = function(_arg) {
      var pageY, which;
      which = _arg.which, pageY = _arg.pageY;
      if (which !== 1) {
        return this.resizeStopped();
      }
      return this.body.height($(document.body).height() - pageY - this.heading.outerHeight());
    };

    ConsoleView.prototype.resizeToFitContent = function() {
      this.body.height(1);
      return this.body.height(this.body.find('>').outerHeight());
    };

    return ConsoleView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9jb25zb2xlLXBhbmVsL2xpYi9jb25zb2xlLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdCQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksSUFESixDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFLLElBRkwsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixrQ0FBQSxDQUFBOzs7Ozs7O0tBQUE7O0FBQUEsSUFBQSxXQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLEVBQUEsRUFBSSxjQUFKO0FBQUEsUUFBb0IsT0FBQSxFQUFPLG9CQUEzQjtPQUFMLEVBQXNELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDcEQsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sb0JBQVA7QUFBQSxZQUE2QixNQUFBLEVBQVEsY0FBckM7V0FBTCxDQUFBLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxlQUFQO0FBQUEsWUFBd0IsUUFBQSxFQUFVLFFBQWxDO0FBQUEsWUFBNEMsTUFBQSxFQUFRLFNBQXBEO1dBQUwsRUFBb0UsU0FBcEUsRUFBK0UsU0FBQSxHQUFBO21CQUM3RSxLQUFDLENBQUEsTUFBRCxDQUFRO0FBQUEsY0FBQSxPQUFBLEVBQU8sZ0JBQVA7QUFBQSxjQUF5QixLQUFBLEVBQU8sT0FBaEM7YUFBUixFQUFpRCxPQUFqRCxFQUQ2RTtVQUFBLENBQS9FLENBREEsQ0FBQTtpQkFHQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8saUNBQVA7QUFBQSxZQUEwQyxNQUFBLEVBQVEsTUFBbEQ7V0FBTCxFQUErRCxTQUFBLEdBQUE7bUJBQzdELEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxxQkFBUDtBQUFBLGNBQThCLE1BQUEsRUFBUSxRQUF0QztBQUFBLGNBQWdELFFBQUEsRUFBVSxDQUFBLENBQTFEO2FBQUwsRUFENkQ7VUFBQSxDQUEvRCxFQUpvRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRELEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsMEJBUUEsVUFBQSxHQUFZLFNBQUMsY0FBRCxHQUFBO0FBQ1YsVUFBQSxJQUFBO0FBQUEsTUFBQSxPQUFVLE9BQUEsQ0FBUSxzQkFBUixDQUFWLEVBQUMsU0FBQSxDQUFELEVBQUksVUFBQSxFQUFKLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTiwwQkFBYSxjQUFjLENBQUUsZUFBN0IsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWYsQ0FBOEI7QUFBQSxRQUFBLElBQUEsRUFBTSxJQUFDLENBQUEsT0FBUDtBQUFBLFFBQWdCLFFBQUEsRUFBVSxHQUExQjtPQUE5QixDQUhBLENBQUE7YUFJQSxJQUFDLENBQUEsWUFBRCxDQUFBLEVBTFU7SUFBQSxDQVJaLENBQUE7O0FBQUEsMEJBZ0JBLFNBQUEsR0FBVyxTQUFBLEdBQUE7YUFDVDtBQUFBLFFBQUEsTUFBQSxFQUFRLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBZDtRQURTO0lBQUEsQ0FoQlgsQ0FBQTs7QUFBQSwwQkFvQkEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLFVBQUEsSUFBQTtxREFBWSxDQUFFLE9BQWQsQ0FBQSxXQURPO0lBQUEsQ0FwQlQsQ0FBQTs7QUFBQSwwQkF1QkEsSUFBQSxHQUFNLFNBQUEsR0FBQTthQUNKLElBQUMsQ0FBQSxJQUFJLENBQUMsV0FBTixDQUFrQixRQUFsQixFQURJO0lBQUEsQ0F2Qk4sQ0FBQTs7QUFBQSwwQkEwQkEsSUFBQSxHQUFNLFNBQUEsR0FBQTthQUNKLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBTixDQUFlLFFBQWYsRUFESTtJQUFBLENBMUJOLENBQUE7O0FBQUEsMEJBNkJBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixNQUFBLElBQUcsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFOLENBQWUsUUFBZixDQUFIO2VBQ0UsSUFBQyxDQUFBLElBQUQsQ0FBQSxFQURGO09BQUEsTUFBQTtlQUdFLElBQUMsQ0FBQSxJQUFELENBQUEsRUFIRjtPQURNO0lBQUEsQ0E3QlIsQ0FBQTs7QUFBQSwwQkFtQ0EsR0FBQSxHQUFLLFNBQUMsT0FBRCxFQUFVLEtBQVYsR0FBQTtBQUNILFVBQUEsU0FBQTtBQUFBLE1BQUEsU0FBQSxHQUFhLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBTixDQUFBLENBQUEsR0FBb0IsSUFBQyxDQUFBLElBQUksQ0FBQyxXQUFOLENBQUEsQ0FBcEIsR0FBMEMsRUFBMUMsR0FBK0MsSUFBQyxDQUFBLElBQUssQ0FBQSxDQUFBLENBQUUsQ0FBQyxZQUFyRSxDQUFBO0FBRUEsTUFBQSxJQUFHLE1BQUEsQ0FBQSxPQUFBLEtBQWtCLFFBQXJCO0FBQ0UsUUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsQ0FBZSxFQUFBLENBQUcsU0FBQSxHQUFBO2lCQUNoQixJQUFDLENBQUEsQ0FBRCxDQUFHO0FBQUEsWUFBQSxPQUFBLEVBQU8sUUFBQSxHQUFXLEtBQWxCO1dBQUgsRUFBNEIsT0FBNUIsRUFEZ0I7UUFBQSxDQUFILENBQWYsQ0FBQSxDQURGO09BQUEsTUFBQTtBQUlFLFFBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLENBQWUsT0FBZixDQUFBLENBSkY7T0FGQTtBQVFBLE1BQUEsSUFBRyxTQUFIO0FBQ0UsUUFBQSxJQUFDLENBQUEsSUFBSSxDQUFDLFNBQU4sQ0FBZ0IsSUFBQyxDQUFBLElBQUssQ0FBQSxDQUFBLENBQUUsQ0FBQyxZQUF6QixDQUFBLENBREY7T0FSQTthQVdBLElBQUMsQ0FBQSxJQUFELENBQUEsRUFaRztJQUFBLENBbkNMLENBQUE7O0FBQUEsMEJBaURBLEtBQUEsR0FBTyxTQUFBLEdBQUE7QUFDTCxNQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixDQUFBLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxJQUFELENBQUEsRUFGSztJQUFBLENBakRQLENBQUE7O0FBQUEsMEJBcURBLFlBQUEsR0FBYyxTQUFBLEdBQUE7QUFDWixNQUFBLElBQUMsQ0FBQSxFQUFELENBQUksVUFBSixFQUFnQixxQkFBaEIsRUFBdUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDckMsS0FBQyxDQUFBLGtCQUFELENBQUEsRUFEcUM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF2QyxDQUFBLENBQUE7YUFHQSxJQUFDLENBQUEsRUFBRCxDQUFJLFdBQUosRUFBaUIscUJBQWpCLEVBQXdDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLENBQUQsR0FBQTtpQkFBTyxLQUFDLENBQUEsYUFBRCxDQUFlLENBQWYsRUFBUDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhDLEVBSlk7SUFBQSxDQXJEZCxDQUFBOztBQUFBLDBCQTJEQSxhQUFBLEdBQWUsU0FBQSxHQUFBO0FBQ2IsTUFBQSxDQUFBLENBQUUsUUFBRixDQUFXLENBQUMsRUFBWixDQUFlLFdBQWYsRUFBNEIsSUFBQyxDQUFBLFVBQTdCLENBQUEsQ0FBQTthQUNBLENBQUEsQ0FBRSxRQUFGLENBQVcsQ0FBQyxFQUFaLENBQWUsU0FBZixFQUEwQixJQUFDLENBQUEsYUFBM0IsRUFGYTtJQUFBLENBM0RmLENBQUE7O0FBQUEsMEJBK0RBLGFBQUEsR0FBZSxTQUFBLEdBQUE7QUFDYixNQUFBLENBQUEsQ0FBRSxRQUFGLENBQVcsQ0FBQyxHQUFaLENBQWdCLFdBQWhCLEVBQTZCLElBQUMsQ0FBQSxVQUE5QixDQUFBLENBQUE7YUFDQSxDQUFBLENBQUUsUUFBRixDQUFXLENBQUMsR0FBWixDQUFnQixTQUFoQixFQUEyQixJQUFDLENBQUEsYUFBNUIsRUFGYTtJQUFBLENBL0RmLENBQUE7O0FBQUEsMEJBbUVBLFVBQUEsR0FBWSxTQUFDLElBQUQsR0FBQTtBQUNWLFVBQUEsWUFBQTtBQUFBLE1BRFksYUFBQSxPQUFPLGFBQUEsS0FDbkIsQ0FBQTtBQUFBLE1BQUEsSUFBK0IsS0FBQSxLQUFTLENBQXhDO0FBQUEsZUFBTyxJQUFDLENBQUEsYUFBRCxDQUFBLENBQVAsQ0FBQTtPQUFBO2FBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxNQUFOLENBQWEsQ0FBQSxDQUFFLFFBQVEsQ0FBQyxJQUFYLENBQWdCLENBQUMsTUFBakIsQ0FBQSxDQUFBLEdBQTRCLEtBQTVCLEdBQW9DLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxDQUFBLENBQWpELEVBRlU7SUFBQSxDQW5FWixDQUFBOztBQUFBLDBCQXVFQSxrQkFBQSxHQUFvQixTQUFBLEdBQUE7QUFDbEIsTUFBQSxJQUFDLENBQUEsSUFBSSxDQUFDLE1BQU4sQ0FBYSxDQUFiLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTixDQUFhLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFXLEdBQVgsQ0FBZSxDQUFDLFdBQWhCLENBQUEsQ0FBYixFQUZrQjtJQUFBLENBdkVwQixDQUFBOzt1QkFBQTs7S0FEd0IsS0FMMUIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/kyan/.atom/packages/console-panel/lib/console-view.coffee
