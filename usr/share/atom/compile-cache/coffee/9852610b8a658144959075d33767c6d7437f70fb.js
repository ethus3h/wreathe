(function() {
  var CommitListView, CommitView, CompositeDisposable, View, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  View = require('atom-space-pen-views').View;

  CompositeDisposable = require('atom').CompositeDisposable;

  CommitView = require('./commit-view');

  CommitListView = (function(_super) {
    __extends(CommitListView, _super);

    function CommitListView() {
      this.repaint = __bind(this.repaint, this);
      this.detached = __bind(this.detached, this);
      this.attached = __bind(this.attached, this);
      return CommitListView.__super__.constructor.apply(this, arguments);
    }

    CommitListView.content = function() {
      return this.div({
        "class": 'commit-list-view list-view',
        tabindex: -1
      });
    };

    CommitListView.prototype.initialize = function(model) {
      this.model = model;
    };

    CommitListView.prototype.attached = function() {
      this.model.on('repaint', this.repaint);
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.commands.add(this.element, {
        'atomatigit:showCommit': (function(_this) {
          return function() {
            var _ref;
            return (_ref = _this.model.selection()) != null ? typeof _ref.showCommit === "function" ? _ref.showCommit() : void 0 : void 0;
          };
        })(this),
        'atomatigit:hard-reset-to-commit': (function(_this) {
          return function() {
            var _ref;
            return (_ref = _this.model.selection()) != null ? _ref.confirmHardReset() : void 0;
          };
        })(this)
      }));
    };

    CommitListView.prototype.detached = function() {
      this.model.off('repaint', this.repaint);
      return this.subscriptions.dispose();
    };

    CommitListView.prototype.repaint = function() {
      this.empty();
      return _.each(this.model.models, (function(_this) {
        return function(commit) {
          return _this.append(new CommitView(commit));
        };
      })(this));
    };

    return CommitListView;

  })(View);

  module.exports = CommitListView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9hdG9tYXRpZ2l0L2xpYi92aWV3cy9jb21taXRzL2NvbW1pdC1saXN0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdEQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUNDLE9BQVEsT0FBQSxDQUFRLHNCQUFSLEVBQVIsSUFERCxDQUFBOztBQUFBLEVBRUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUZELENBQUE7O0FBQUEsRUFJQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FKYixDQUFBOztBQUFBLEVBT007QUFDSixxQ0FBQSxDQUFBOzs7Ozs7O0tBQUE7O0FBQUEsSUFBQSxjQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyw0QkFBUDtBQUFBLFFBQXFDLFFBQUEsRUFBVSxDQUFBLENBQS9DO09BQUwsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSw2QkFJQSxVQUFBLEdBQVksU0FBRSxLQUFGLEdBQUE7QUFBVSxNQUFULElBQUMsQ0FBQSxRQUFBLEtBQVEsQ0FBVjtJQUFBLENBSlosQ0FBQTs7QUFBQSw2QkFPQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsS0FBSyxDQUFDLEVBQVAsQ0FBVSxTQUFWLEVBQXFCLElBQUMsQ0FBQSxPQUF0QixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFEakIsQ0FBQTthQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsSUFBQyxDQUFBLE9BQW5CLEVBQ2pCO0FBQUEsUUFBQSx1QkFBQSxFQUF5QixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUFHLGdCQUFBLElBQUE7MEdBQWtCLENBQUUsK0JBQXZCO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekI7QUFBQSxRQUNBLGlDQUFBLEVBQW1DLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO0FBQ2pDLGdCQUFBLElBQUE7a0VBQWtCLENBQUUsZ0JBQXBCLENBQUEsV0FEaUM7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURuQztPQURpQixDQUFuQixFQUhRO0lBQUEsQ0FQVixDQUFBOztBQUFBLDZCQWdCQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsS0FBSyxDQUFDLEdBQVAsQ0FBVyxTQUFYLEVBQXNCLElBQUMsQ0FBQSxPQUF2QixDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQSxFQUZRO0lBQUEsQ0FoQlYsQ0FBQTs7QUFBQSw2QkFxQkEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLE1BQUEsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUFBLENBQUE7YUFDQSxDQUFDLENBQUMsSUFBRixDQUFPLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBZCxFQUFzQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxNQUFELEdBQUE7aUJBQVksS0FBQyxDQUFBLE1BQUQsQ0FBWSxJQUFBLFVBQUEsQ0FBVyxNQUFYLENBQVosRUFBWjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRCLEVBRk87SUFBQSxDQXJCVCxDQUFBOzswQkFBQTs7S0FEMkIsS0FQN0IsQ0FBQTs7QUFBQSxFQWlDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixjQWpDakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/kyan/.atom/packages/atomatigit/lib/views/commits/commit-list-view.coffee
