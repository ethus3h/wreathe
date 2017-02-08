(function() {
  var DiffChunkView, DiffLineView, View, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  View = require('atom-space-pen-views').View;

  DiffLineView = require('./diff-line-view');

  DiffChunkView = (function(_super) {
    __extends(DiffChunkView, _super);

    function DiffChunkView() {
      this.showSelection = __bind(this.showSelection, this);
      this.clicked = __bind(this.clicked, this);
      this.detached = __bind(this.detached, this);
      this.attached = __bind(this.attached, this);
      return DiffChunkView.__super__.constructor.apply(this, arguments);
    }

    DiffChunkView.content = function() {
      return this.div({
        "class": 'diff-chunk',
        click: 'clicked'
      });
    };

    DiffChunkView.prototype.initialize = function(model) {
      this.model = model;
      return _.each(this.model.lines, (function(_this) {
        return function(line) {
          return _this.append(new DiffLineView(line));
        };
      })(this));
    };

    DiffChunkView.prototype.attached = function() {
      return this.model.on('change:selected', this.showSelection);
    };

    DiffChunkView.prototype.detached = function() {
      return this.model.off('change:selected', this.showSelection);
    };

    DiffChunkView.prototype.clicked = function() {
      return this.model.selfSelect();
    };

    DiffChunkView.prototype.showSelection = function() {
      this.removeClass('selected');
      if (this.model.isSelected()) {
        return this.addClass('selected');
      }
    };

    return DiffChunkView;

  })(View);

  module.exports = DiffChunkView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9hdG9tYXRpZ2l0L2xpYi92aWV3cy9kaWZmcy9kaWZmLWNodW5rLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9DQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFlLE9BQUEsQ0FBUSxRQUFSLENBQWYsQ0FBQTs7QUFBQSxFQUNDLE9BQWMsT0FBQSxDQUFRLHNCQUFSLEVBQWQsSUFERCxDQUFBOztBQUFBLEVBRUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxrQkFBUixDQUZmLENBQUE7O0FBQUEsRUFLTTtBQUNKLG9DQUFBLENBQUE7Ozs7Ozs7O0tBQUE7O0FBQUEsSUFBQSxhQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxZQUFQO0FBQUEsUUFBcUIsS0FBQSxFQUFPLFNBQTVCO09BQUwsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSw0QkFJQSxVQUFBLEdBQVksU0FBRSxLQUFGLEdBQUE7QUFDVixNQURXLElBQUMsQ0FBQSxRQUFBLEtBQ1osQ0FBQTthQUFBLENBQUMsQ0FBQyxJQUFGLENBQU8sSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFkLEVBQXFCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtpQkFBVSxLQUFDLENBQUEsTUFBRCxDQUFZLElBQUEsWUFBQSxDQUFhLElBQWIsQ0FBWixFQUFWO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckIsRUFEVTtJQUFBLENBSlosQ0FBQTs7QUFBQSw0QkFRQSxRQUFBLEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEtBQUssQ0FBQyxFQUFQLENBQVUsaUJBQVYsRUFBNkIsSUFBQyxDQUFBLGFBQTlCLEVBRFE7SUFBQSxDQVJWLENBQUE7O0FBQUEsNEJBWUEsUUFBQSxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxLQUFLLENBQUMsR0FBUCxDQUFXLGlCQUFYLEVBQThCLElBQUMsQ0FBQSxhQUEvQixFQURRO0lBQUEsQ0FaVixDQUFBOztBQUFBLDRCQWdCQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQ1AsSUFBQyxDQUFBLEtBQUssQ0FBQyxVQUFQLENBQUEsRUFETztJQUFBLENBaEJULENBQUE7O0FBQUEsNEJBb0JBLGFBQUEsR0FBZSxTQUFBLEdBQUE7QUFDYixNQUFBLElBQUMsQ0FBQSxXQUFELENBQWEsVUFBYixDQUFBLENBQUE7QUFDQSxNQUFBLElBQXlCLElBQUMsQ0FBQSxLQUFLLENBQUMsVUFBUCxDQUFBLENBQXpCO2VBQUEsSUFBQyxDQUFBLFFBQUQsQ0FBVSxVQUFWLEVBQUE7T0FGYTtJQUFBLENBcEJmLENBQUE7O3lCQUFBOztLQUQwQixLQUw1QixDQUFBOztBQUFBLEVBOEJBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGFBOUJqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/kyan/.atom/packages/atomatigit/lib/views/diffs/diff-chunk-view.coffee
