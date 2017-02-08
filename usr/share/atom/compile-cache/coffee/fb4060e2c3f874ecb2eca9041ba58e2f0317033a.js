(function() {
  var BranchBriefView, BranchListView, CompositeDisposable, View, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  View = require('atom-space-pen-views').View;

  CompositeDisposable = require('atom').CompositeDisposable;

  BranchBriefView = require('./branch-brief-view');

  BranchListView = (function(_super) {
    __extends(BranchListView, _super);

    function BranchListView() {
      this.repaint = __bind(this.repaint, this);
      this.emptyLists = __bind(this.emptyLists, this);
      this.detached = __bind(this.detached, this);
      this.attached = __bind(this.attached, this);
      return BranchListView.__super__.constructor.apply(this, arguments);
    }

    BranchListView.content = function() {
      return this.div({
        "class": 'branch-list-view list-view',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.h2('local:');
          _this.div({
            outlet: 'localDom'
          });
          _this.h2('remote:');
          return _this.div({
            outlet: 'remoteDom'
          });
        };
      })(this));
    };

    BranchListView.prototype.initialize = function(model) {
      this.model = model;
    };

    BranchListView.prototype.attached = function() {
      return this.model.on('repaint', this.repaint);
    };

    BranchListView.prototype.detached = function() {
      return this.model.off('repaint', this.repaint);
    };

    BranchListView.prototype.emptyLists = function() {
      this.localDom.empty();
      return this.remoteDom.empty();
    };

    BranchListView.prototype.repaint = function() {
      this.emptyLists();
      _.each(this.model.local(), (function(_this) {
        return function(branch) {
          return _this.localDom.append(new BranchBriefView(branch));
        };
      })(this));
      return _.each(this.model.remote(), (function(_this) {
        return function(branch) {
          return _this.remoteDom.append(new BranchBriefView(branch));
        };
      })(this));
    };

    return BranchListView;

  })(View);

  module.exports = BranchListView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9hdG9tYXRpZ2l0L2xpYi92aWV3cy9icmFuY2hlcy9icmFuY2gtbGlzdC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw2REFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLENBQUEsR0FBUyxPQUFBLENBQVEsUUFBUixDQUFULENBQUE7O0FBQUEsRUFDQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUixFQUFSLElBREQsQ0FBQTs7QUFBQSxFQUVDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFGRCxDQUFBOztBQUFBLEVBSUEsZUFBQSxHQUFrQixPQUFBLENBQVEscUJBQVIsQ0FKbEIsQ0FBQTs7QUFBQSxFQU9NO0FBQ0oscUNBQUEsQ0FBQTs7Ozs7Ozs7S0FBQTs7QUFBQSxJQUFBLGNBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLDRCQUFQO0FBQUEsUUFBcUMsUUFBQSxFQUFVLENBQUEsQ0FBL0M7T0FBTCxFQUF3RCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3RELFVBQUEsS0FBQyxDQUFBLEVBQUQsQ0FBSSxRQUFKLENBQUEsQ0FBQTtBQUFBLFVBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsTUFBQSxFQUFRLFVBQVI7V0FBTCxDQURBLENBQUE7QUFBQSxVQUVBLEtBQUMsQ0FBQSxFQUFELENBQUksU0FBSixDQUZBLENBQUE7aUJBR0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsTUFBQSxFQUFRLFdBQVI7V0FBTCxFQUpzRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhELEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsNkJBUUEsVUFBQSxHQUFZLFNBQUUsS0FBRixHQUFBO0FBQVUsTUFBVCxJQUFDLENBQUEsUUFBQSxLQUFRLENBQVY7SUFBQSxDQVJaLENBQUE7O0FBQUEsNkJBV0EsUUFBQSxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxLQUFLLENBQUMsRUFBUCxDQUFVLFNBQVYsRUFBcUIsSUFBQyxDQUFBLE9BQXRCLEVBRFE7SUFBQSxDQVhWLENBQUE7O0FBQUEsNkJBZUEsUUFBQSxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxLQUFLLENBQUMsR0FBUCxDQUFXLFNBQVgsRUFBc0IsSUFBQyxDQUFBLE9BQXZCLEVBRFE7SUFBQSxDQWZWLENBQUE7O0FBQUEsNkJBbUJBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixNQUFBLElBQUMsQ0FBQSxRQUFRLENBQUMsS0FBVixDQUFBLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxTQUFTLENBQUMsS0FBWCxDQUFBLEVBRlU7SUFBQSxDQW5CWixDQUFBOztBQUFBLDZCQXdCQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFDLENBQUEsVUFBRCxDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsQ0FBQyxDQUFDLElBQUYsQ0FBTyxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQVAsQ0FBQSxDQUFQLEVBQXVCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE1BQUQsR0FBQTtpQkFBWSxLQUFDLENBQUEsUUFBUSxDQUFDLE1BQVYsQ0FBcUIsSUFBQSxlQUFBLENBQWdCLE1BQWhCLENBQXJCLEVBQVo7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF2QixDQURBLENBQUE7YUFFQSxDQUFDLENBQUMsSUFBRixDQUFPLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxDQUFBLENBQVAsRUFBd0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsTUFBRCxHQUFBO2lCQUFZLEtBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxDQUFzQixJQUFBLGVBQUEsQ0FBZ0IsTUFBaEIsQ0FBdEIsRUFBWjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhCLEVBSE87SUFBQSxDQXhCVCxDQUFBOzswQkFBQTs7S0FEMkIsS0FQN0IsQ0FBQTs7QUFBQSxFQXFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixjQXJDakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/kyan/.atom/packages/atomatigit/lib/views/branches/branch-list-view.coffee
