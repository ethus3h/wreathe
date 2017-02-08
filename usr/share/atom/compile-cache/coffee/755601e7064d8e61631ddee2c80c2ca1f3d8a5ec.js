(function() {
  var CommitView, View,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  CommitView = (function(_super) {
    __extends(CommitView, _super);

    function CommitView() {
      this.showSelection = __bind(this.showSelection, this);
      this.clicked = __bind(this.clicked, this);
      this.detached = __bind(this.detached, this);
      this.attached = __bind(this.attached, this);
      return CommitView.__super__.constructor.apply(this, arguments);
    }

    CommitView.content = function(commit) {
      return this.div({
        "class": 'commit',
        click: 'clicked'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'id'
          }, "" + (commit.shortID()));
          _this.div({
            "class": 'author-name'
          }, "(" + (commit.authorName()) + ")");
          return _this.div({
            "class": 'message text-subtle'
          }, "" + (commit.shortMessage()));
        };
      })(this));
    };

    CommitView.prototype.initialize = function(model) {
      this.model = model;
    };

    CommitView.prototype.attached = function() {
      return this.model.on('change:selected', this.showSelection);
    };

    CommitView.prototype.detached = function() {
      return this.model.off('change:selected', this.showSelection);
    };

    CommitView.prototype.clicked = function() {
      return this.model.selfSelect();
    };

    CommitView.prototype.showSelection = function() {
      this.removeClass('selected');
      if (this.model.isSelected()) {
        return this.addClass('selected');
      }
    };

    return CommitView;

  })(View);

  module.exports = CommitView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9hdG9tYXRpZ2l0L2xpYi92aWV3cy9jb21taXRzL2NvbW1pdC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnQkFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFDLE9BQVEsT0FBQSxDQUFRLHNCQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBR007QUFDSixpQ0FBQSxDQUFBOzs7Ozs7OztLQUFBOztBQUFBLElBQUEsVUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLE1BQUQsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxRQUFQO0FBQUEsUUFBaUIsS0FBQSxFQUFPLFNBQXhCO09BQUwsRUFBd0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUN0QyxVQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxJQUFQO1dBQUwsRUFBa0IsRUFBQSxHQUFFLENBQUMsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFELENBQXBCLENBQUEsQ0FBQTtBQUFBLFVBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLGFBQVA7V0FBTCxFQUE0QixHQUFBLEdBQUUsQ0FBQyxNQUFNLENBQUMsVUFBUCxDQUFBLENBQUQsQ0FBRixHQUF1QixHQUFuRCxDQURBLENBQUE7aUJBRUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLHFCQUFQO1dBQUwsRUFBbUMsRUFBQSxHQUFFLENBQUMsTUFBTSxDQUFDLFlBQVAsQ0FBQSxDQUFELENBQXJDLEVBSHNDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEMsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSx5QkFPQSxVQUFBLEdBQVksU0FBRSxLQUFGLEdBQUE7QUFBVSxNQUFULElBQUMsQ0FBQSxRQUFBLEtBQVEsQ0FBVjtJQUFBLENBUFosQ0FBQTs7QUFBQSx5QkFVQSxRQUFBLEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEtBQUssQ0FBQyxFQUFQLENBQVUsaUJBQVYsRUFBNkIsSUFBQyxDQUFBLGFBQTlCLEVBRFE7SUFBQSxDQVZWLENBQUE7O0FBQUEseUJBY0EsUUFBQSxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxLQUFLLENBQUMsR0FBUCxDQUFXLGlCQUFYLEVBQThCLElBQUMsQ0FBQSxhQUEvQixFQURRO0lBQUEsQ0FkVixDQUFBOztBQUFBLHlCQWtCQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQ1AsSUFBQyxDQUFBLEtBQUssQ0FBQyxVQUFQLENBQUEsRUFETztJQUFBLENBbEJULENBQUE7O0FBQUEseUJBc0JBLGFBQUEsR0FBZSxTQUFBLEdBQUE7QUFDYixNQUFBLElBQUMsQ0FBQSxXQUFELENBQWEsVUFBYixDQUFBLENBQUE7QUFDQSxNQUFBLElBQXlCLElBQUMsQ0FBQSxLQUFLLENBQUMsVUFBUCxDQUFBLENBQXpCO2VBQUEsSUFBQyxDQUFBLFFBQUQsQ0FBVSxVQUFWLEVBQUE7T0FGYTtJQUFBLENBdEJmLENBQUE7O3NCQUFBOztLQUR1QixLQUh6QixDQUFBOztBQUFBLEVBOEJBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBOUJqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/kyan/.atom/packages/atomatigit/lib/views/commits/commit-view.coffee
