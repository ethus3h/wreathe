(function() {
  var CurrentBranchView, View, branch_comparisons,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  branch_comparisons = {};

  CurrentBranchView = (function(_super) {
    __extends(CurrentBranchView, _super);

    function CurrentBranchView() {
      this.repaint = __bind(this.repaint, this);
      this.refresh = __bind(this.refresh, this);
      this.updateComparison = __bind(this.updateComparison, this);
      this.detached = __bind(this.detached, this);
      this.attached = __bind(this.attached, this);
      return CurrentBranchView.__super__.constructor.apply(this, arguments);
    }

    CurrentBranchView.content = function() {
      return this.div({
        "class": 'current-branch-view'
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

    CurrentBranchView.prototype.initialize = function(repo) {
      this.repo = repo;
      this.model = this.repo.currentBranch;
      return this.repaint();
    };

    CurrentBranchView.prototype.attached = function() {
      this.model.on('repaint', this.repaint);
      return this.model.on('comparison-loaded', this.updateComparison);
    };

    CurrentBranchView.prototype.detached = function() {
      this.model.off('repaint', this.repaint);
      return this.model.off('comparison-loaded', this.updateComparison);
    };

    CurrentBranchView.prototype.updateComparison = function() {
      var comparison, name;
      if (!atom.config.get('atomatigit.display_commit_comparisons')) {
        return this.comparison.html('');
      }
      name = this.model.getName();
      comparison = this.model.comparison || branch_comparisons[name];
      if (comparison !== '') {
        branch_comparisons[name] = comparison;
      }
      return this.comparison.html(comparison || 'Calculating...');
    };

    CurrentBranchView.prototype.refresh = function() {
      return this.repaint();
    };

    CurrentBranchView.prototype.repaint = function() {
      var _base, _base1;
      this.name.html("" + this.model.name);
      this.commit.html("(" + (typeof (_base = this.model.commit).shortID === "function" ? _base.shortID() : void 0) + ": " + (typeof (_base1 = this.model.commit).shortMessage === "function" ? _base1.shortMessage() : void 0) + ")");
      this.updateComparison();
      this.commit.removeClass('unpushed');
      if (this.model.unpushed()) {
        return this.commit.addClass('unpushed');
      }
    };

    return CurrentBranchView;

  })(View);

  module.exports = CurrentBranchView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9hdG9tYXRpZ2l0L2xpYi92aWV3cy9icmFuY2hlcy9jdXJyZW50LWJyYW5jaC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwyQ0FBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFDLE9BQVEsT0FBQSxDQUFRLHNCQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBR0Esa0JBQUEsR0FBcUIsRUFIckIsQ0FBQTs7QUFBQSxFQU1NO0FBQ0osd0NBQUEsQ0FBQTs7Ozs7Ozs7O0tBQUE7O0FBQUEsSUFBQSxpQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8scUJBQVA7T0FBTCxFQUFtQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ2pDLFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLE1BQVA7QUFBQSxZQUFlLE1BQUEsRUFBUSxNQUF2QjtXQUFMLENBQUEsQ0FBQTtBQUFBLFVBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLFFBQVA7QUFBQSxZQUFpQixNQUFBLEVBQVEsUUFBekI7V0FBTCxDQURBLENBQUE7aUJBRUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLFlBQVA7QUFBQSxZQUFxQixNQUFBLEVBQVEsWUFBN0I7V0FBTCxFQUhpQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5DLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsZ0NBT0EsVUFBQSxHQUFZLFNBQUUsSUFBRixHQUFBO0FBQ1YsTUFEVyxJQUFDLENBQUEsT0FBQSxJQUNaLENBQUE7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

//# sourceURL=/home/kyan/.atom/packages/atomatigit/lib/views/branches/current-branch-view.coffee
