(function() {
  var BranchBriefView, View, branch_comparisons,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  branch_comparisons = {};

  BranchBriefView = (function(_super) {
    __extends(BranchBriefView, _super);

    function BranchBriefView() {
      this.showSelection = __bind(this.showSelection, this);
      this.repaint = __bind(this.repaint, this);
      this.updateComparison = __bind(this.updateComparison, this);
      this.clicked = __bind(this.clicked, this);
      this.detached = __bind(this.detached, this);
      this.attached = __bind(this.attached, this);
      return BranchBriefView.__super__.constructor.apply(this, arguments);
    }

    BranchBriefView.content = function() {
      return this.div({
        "class": 'branch-brief-view',
        mousedown: 'clicked'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'name',
            outlet: 'name'
          });
          _this.div({
            "class": 'commit',
            outlet: 'commit'
          });
          return _this.div({
            "class": 'comparison',
            outlet: 'comparison'
          });
        };
      })(this));
    };

    BranchBriefView.prototype.initialize = function(model) {
      this.model = model;
      return this.repaint();
    };

    BranchBriefView.prototype.attached = function() {
      this.model.on('change:selected', this.showSelection);
      if (this.model.local) {
        return this.model.on('comparison-loaded', this.updateComparison);
      }
    };

    BranchBriefView.prototype.detached = function() {
      this.model.off('change:selected', this.showSelection);
      if (this.model.local) {
        return this.model.off('comparison-loaded', this.updateComparison);
      }
    };

    BranchBriefView.prototype.clicked = function() {
      return this.model.selfSelect();
    };

    BranchBriefView.prototype.updateComparison = function() {
      var comparison, name;
      if (!atom.config.get('atomatigit.display_commit_comparisons')) {
        return;
      }
      name = this.model.getName();
      comparison = this.model.comparison || branch_comparisons[name];
      if (comparison !== '') {
        branch_comparisons[name] = comparison;
      }
      return this.comparison.html(comparison || 'Calculating...');
    };

    BranchBriefView.prototype.repaint = function() {
      this.name.html("" + (this.model.getName()));
      this.commit.html("(" + (this.model.commit().shortID()) + ": " + (this.model.commit().shortMessage()) + ")");
      if (this.model.local) {
        this.updateComparison();
      }
      this.commit.removeClass('unpushed');
      if (this.model.unpushed()) {
        this.commit.addClass('unpushed');
      }
      return this.showSelection();
    };

    BranchBriefView.prototype.showSelection = function() {
      this.removeClass('selected');
      if (this.model.isSelected()) {
        return this.addClass('selected');
      }
    };

    return BranchBriefView;

  })(View);

  module.exports = BranchBriefView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9hdG9tYXRpZ2l0L2xpYi92aWV3cy9icmFuY2hlcy9icmFuY2gtYnJpZWYtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUNBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUdBLGtCQUFBLEdBQXFCLEVBSHJCLENBQUE7O0FBQUEsRUFNTTtBQUNKLHNDQUFBLENBQUE7Ozs7Ozs7Ozs7S0FBQTs7QUFBQSxJQUFBLGVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLG1CQUFQO0FBQUEsUUFBNEIsU0FBQSxFQUFXLFNBQXZDO09BQUwsRUFBdUQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNyRCxVQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxNQUFQO0FBQUEsWUFBZSxNQUFBLEVBQVEsTUFBdkI7V0FBTCxDQUFBLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxRQUFQO0FBQUEsWUFBaUIsTUFBQSxFQUFRLFFBQXpCO1dBQUwsQ0FEQSxDQUFBO2lCQUVBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxZQUFQO0FBQUEsWUFBcUIsTUFBQSxFQUFRLFlBQTdCO1dBQUwsRUFIcUQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF2RCxFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLDhCQU9BLFVBQUEsR0FBWSxTQUFFLEtBQUYsR0FBQTtBQUNWLE1BRFcsSUFBQyxDQUFBLFFBQUEsS0FDWixDQUFBO2FBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBQSxFQURVO0lBQUEsQ0FQWixDQUFBOztBQUFBLDhCQVdBLFFBQUEsR0FBVSxTQUFBLEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxLQUFLLENBQUMsRUFBUCxDQUFVLGlCQUFWLEVBQTZCLElBQUMsQ0FBQSxhQUE5QixDQUFBLENBQUE7QUFDQSxNQUFBLElBQW9ELElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBM0Q7ZUFBQSxJQUFDLENBQUEsS0FBSyxDQUFDLEVBQVAsQ0FBVSxtQkFBVixFQUErQixJQUFDLENBQUEsZ0JBQWhDLEVBQUE7T0FGUTtJQUFBLENBWFYsQ0FBQTs7QUFBQSw4QkFnQkEsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxHQUFQLENBQVcsaUJBQVgsRUFBOEIsSUFBQyxDQUFBLGFBQS9CLENBQUEsQ0FBQTtBQUNBLE1BQUEsSUFBcUQsSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUE1RDtlQUFBLElBQUMsQ0FBQSxLQUFLLENBQUMsR0FBUCxDQUFXLG1CQUFYLEVBQWdDLElBQUMsQ0FBQSxnQkFBakMsRUFBQTtPQUZRO0lBQUEsQ0FoQlYsQ0FBQTs7QUFBQSw4QkFxQkEsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUNQLElBQUMsQ0FBQSxLQUFLLENBQUMsVUFBUCxDQUFBLEVBRE87SUFBQSxDQXJCVCxDQUFBOztBQUFBLDhCQXlCQSxnQkFBQSxHQUFrQixTQUFBLEdBQUE7QUFDaEIsVUFBQSxnQkFBQTtBQUFBLE1BQUEsSUFBQSxDQUFBLElBQWtCLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUNBQWhCLENBQWQ7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUFPLElBQUMsQ0FBQSxLQUFLLENBQUMsT0FBUCxDQUFBLENBRFAsQ0FBQTtBQUFBLE1BRUEsVUFBQSxHQUFhLElBQUMsQ0FBQSxLQUFLLENBQUMsVUFBUCxJQUFxQixrQkFBbUIsQ0FBQSxJQUFBLENBRnJELENBQUE7QUFHQSxNQUFBLElBQXlDLFVBQUEsS0FBZ0IsRUFBekQ7QUFBQSxRQUFBLGtCQUFtQixDQUFBLElBQUEsQ0FBbkIsR0FBMkIsVUFBM0IsQ0FBQTtPQUhBO2FBSUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxJQUFaLENBQWlCLFVBQUEsSUFBYyxnQkFBL0IsRUFMZ0I7SUFBQSxDQXpCbEIsQ0FBQTs7QUFBQSw4QkFpQ0EsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLE1BQUEsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQVcsRUFBQSxHQUFFLENBQUMsSUFBQyxDQUFBLEtBQUssQ0FBQyxPQUFQLENBQUEsQ0FBRCxDQUFiLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLENBQWMsR0FBQSxHQUFFLENBQUMsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLENBQUEsQ0FBZSxDQUFDLE9BQWhCLENBQUEsQ0FBRCxDQUFGLEdBQTZCLElBQTdCLEdBQWdDLENBQUMsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLENBQUEsQ0FBZSxDQUFDLFlBQWhCLENBQUEsQ0FBRCxDQUFoQyxHQUFnRSxHQUE5RSxDQURBLENBQUE7QUFFQSxNQUFBLElBQXVCLElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBOUI7QUFBQSxRQUFBLElBQUMsQ0FBQSxnQkFBRCxDQUFBLENBQUEsQ0FBQTtPQUZBO0FBQUEsTUFJQSxJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVIsQ0FBb0IsVUFBcEIsQ0FKQSxDQUFBO0FBS0EsTUFBQSxJQUFHLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUCxDQUFBLENBQUg7QUFDRSxRQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixDQUFpQixVQUFqQixDQUFBLENBREY7T0FMQTthQVFBLElBQUMsQ0FBQSxhQUFELENBQUEsRUFUTztJQUFBLENBakNULENBQUE7O0FBQUEsOEJBNkNBLGFBQUEsR0FBZSxTQUFBLEdBQUE7QUFDYixNQUFBLElBQUMsQ0FBQSxXQUFELENBQWEsVUFBYixDQUFBLENBQUE7QUFDQSxNQUFBLElBQXlCLElBQUMsQ0FBQSxLQUFLLENBQUMsVUFBUCxDQUFBLENBQXpCO2VBQUEsSUFBQyxDQUFBLFFBQUQsQ0FBVSxVQUFWLEVBQUE7T0FGYTtJQUFBLENBN0NmLENBQUE7OzJCQUFBOztLQUQ0QixLQU45QixDQUFBOztBQUFBLEVBd0RBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGVBeERqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/kyan/.atom/packages/atomatigit/lib/views/branches/branch-brief-view.coffee
