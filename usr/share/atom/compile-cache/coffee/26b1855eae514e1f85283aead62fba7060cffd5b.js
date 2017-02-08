(function() {
  var Commit, CurrentBranch, ErrorView, LocalBranch, git,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  git = require('../../git');

  LocalBranch = require('./local-branch');

  Commit = require('../commits').Commit;

  ErrorView = require('../../views/error-view');

  CurrentBranch = (function(_super) {
    __extends(CurrentBranch, _super);

    function CurrentBranch() {
      this.reload = __bind(this.reload, this);
      return CurrentBranch.__super__.constructor.apply(this, arguments);
    }

    CurrentBranch.prototype.initialize = function(branchExisting) {
      if (branchExisting) {
        return this.reload();
      }
    };

    CurrentBranch.prototype.reload = function(_arg) {
      var silent;
      silent = (_arg != null ? _arg : {}).silent;
      return git.revParse('HEAD', {
        'abbrev-ref': true
      }).then((function(_this) {
        return function(name) {
          _this.name = name;
          return git.getCommit('HEAD').then(function(gitCommit) {
            _this.commit = new Commit(gitCommit);
            if (!silent) {
              _this.trigger('repaint');
              if (atom.config.get('atomatigit.display_commit_comparisons')) {
                return _this.compareCommits();
              }
            }
          });
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    CurrentBranch.prototype.head = function() {
      return 'HEAD';
    };

    CurrentBranch.prototype["delete"] = function() {};

    CurrentBranch.prototype.checkout = function() {};

    return CurrentBranch;

  })(LocalBranch);

  module.exports = CurrentBranch;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9hdG9tYXRpZ2l0L2xpYi9tb2RlbHMvYnJhbmNoZXMvY3VycmVudC1icmFuY2guY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtEQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFjLE9BQUEsQ0FBUSxXQUFSLENBQWQsQ0FBQTs7QUFBQSxFQUNBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FEZCxDQUFBOztBQUFBLEVBRUMsU0FBYSxPQUFBLENBQVEsWUFBUixFQUFiLE1BRkQsQ0FBQTs7QUFBQSxFQUdBLFNBQUEsR0FBYyxPQUFBLENBQVEsd0JBQVIsQ0FIZCxDQUFBOztBQUFBLEVBTU07QUFJSixvQ0FBQSxDQUFBOzs7OztLQUFBOztBQUFBLDRCQUFBLFVBQUEsR0FBWSxTQUFDLGNBQUQsR0FBQTtBQUNWLE1BQUEsSUFBYSxjQUFiO2VBQUEsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQUFBO09BRFU7SUFBQSxDQUFaLENBQUE7O0FBQUEsNEJBSUEsTUFBQSxHQUFRLFNBQUMsSUFBRCxHQUFBO0FBQ04sVUFBQSxNQUFBO0FBQUEsTUFEUSx5QkFBRCxPQUFTLElBQVIsTUFDUixDQUFBO2FBQUEsR0FBRyxDQUFDLFFBQUosQ0FBYSxNQUFiLEVBQXFCO0FBQUEsUUFBQSxZQUFBLEVBQWMsSUFBZDtPQUFyQixDQUF3QyxDQUFDLElBQXpDLENBQThDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFFLElBQUYsR0FBQTtBQUM1QyxVQUQ2QyxLQUFDLENBQUEsT0FBQSxJQUM5QyxDQUFBO2lCQUFBLEdBQUcsQ0FBQyxTQUFKLENBQWMsTUFBZCxDQUFxQixDQUFDLElBQXRCLENBQTJCLFNBQUMsU0FBRCxHQUFBO0FBQ3pCLFlBQUEsS0FBQyxDQUFBLE1BQUQsR0FBYyxJQUFBLE1BQUEsQ0FBTyxTQUFQLENBQWQsQ0FBQTtBQUNBLFlBQUEsSUFBRyxDQUFBLE1BQUg7QUFDRSxjQUFBLEtBQUMsQ0FBQSxPQUFELENBQVMsU0FBVCxDQUFBLENBQUE7QUFDQSxjQUFBLElBQXFCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1Q0FBaEIsQ0FBckI7dUJBQUEsS0FBQyxDQUFBLGNBQUQsQ0FBQSxFQUFBO2VBRkY7YUFGeUI7VUFBQSxDQUEzQixFQUQ0QztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTlDLENBTUEsQ0FBQyxPQUFELENBTkEsQ0FNTyxTQUFDLEtBQUQsR0FBQTtlQUFlLElBQUEsU0FBQSxDQUFVLEtBQVYsRUFBZjtNQUFBLENBTlAsRUFETTtJQUFBLENBSlIsQ0FBQTs7QUFBQSw0QkFnQkEsSUFBQSxHQUFNLFNBQUEsR0FBQTthQUNKLE9BREk7SUFBQSxDQWhCTixDQUFBOztBQUFBLDRCQW9CQSxTQUFBLEdBQVEsU0FBQSxHQUFBLENBcEJSLENBQUE7O0FBQUEsNEJBd0JBLFFBQUEsR0FBVSxTQUFBLEdBQUEsQ0F4QlYsQ0FBQTs7eUJBQUE7O0tBSjBCLFlBTjVCLENBQUE7O0FBQUEsRUFvQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsYUFwQ2pCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/kyan/.atom/packages/atomatigit/lib/models/branches/current-branch.coffee
