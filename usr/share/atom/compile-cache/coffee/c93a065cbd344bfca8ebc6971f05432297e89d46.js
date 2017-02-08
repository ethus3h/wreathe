(function() {
  var Branch, ErrorView, LocalBranch, OutputView, git,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  git = require('../../git');

  Branch = require('./branch');

  ErrorView = require('../../views/error-view');

  OutputView = require('../../views/output-view');

  LocalBranch = (function(_super) {
    __extends(LocalBranch, _super);

    function LocalBranch() {
      this.push = __bind(this.push, this);
      this.checkout = __bind(this.checkout, this);
      this["delete"] = __bind(this["delete"], this);
      this.unpushed = __bind(this.unpushed, this);
      this.getTrackingBranch = __bind(this.getTrackingBranch, this);
      this.compareCommits = __bind(this.compareCommits, this);
      return LocalBranch.__super__.constructor.apply(this, arguments);
    }

    LocalBranch.prototype.remote = false;

    LocalBranch.prototype.local = true;

    LocalBranch.prototype.initialize = function() {
      if (atom.config.get('atomatigit.display_commit_comparisons')) {
        return this.compareCommits();
      }
    };

    LocalBranch.prototype.compareCommits = function() {
      var comparison, name;
      this.comparison = comparison = '';
      name = this.localName().trim();
      return this.getTrackingBranch(name).then((function(_this) {
        return function() {
          var tracking_branch;
          if (_this.tracking_branch === '') {
            _this.comparison = 'No upstream configured';
            return _this.trigger('comparison-loaded');
          }
          tracking_branch = _this.tracking_branch;
          return git.cmd("rev-list --count " + name + "@{u}.." + name).then(function(output) {
            var number;
            number = +output.trim();
            if (number !== 0) {
              comparison = _this.getComparisonString(number, 'ahead of', tracking_branch);
            }
            return git.cmd("rev-list --count " + name + ".." + name + "@{u}").then(function(output) {
              number = +output.trim();
              if (number !== 0) {
                if (comparison !== '') {
                  comparison += '<br>';
                }
                comparison += _this.getComparisonString(number, 'behind', tracking_branch);
              } else if (comparison === '') {
                comparison = "Up-to-date with " + tracking_branch;
              }
              _this.comparison = comparison;
              return _this.trigger('comparison-loaded');
            });
          });
        };
      })(this));
    };

    LocalBranch.prototype.getTrackingBranch = function(name) {
      this.tracking_branch = '';
      return git.cmd("config branch." + name + ".remote").then((function(_this) {
        return function(output) {
          var remote;
          output = output.trim();
          remote = "" + output + "/";
          return git.cmd("config branch." + name + ".merge").then(function(output) {
            return _this.tracking_branch = remote + output.trim().replace('refs/heads/', '');
          });
        };
      })(this))["catch"](function() {
        return '';
      });
    };

    LocalBranch.prototype.getComparisonString = function(number, ahead_of_or_behind, tracking_branch) {
      var str;
      str = "" + number + " commit";
      if (number !== 1) {
        str += "s";
      }
      str += " " + ahead_of_or_behind + " ";
      return str += tracking_branch;
    };

    LocalBranch.prototype.unpushed = function() {
      return this.get('unpushed');
    };

    LocalBranch.prototype["delete"] = function() {
      return git.cmd('branch', {
        D: true
      }, this.getName()).then((function(_this) {
        return function() {
          return _this.trigger('update');
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    LocalBranch.prototype.remoteName = function() {
      return '';
    };

    LocalBranch.prototype.checkout = function(callback) {
      return git.checkout(this.localName()).then((function(_this) {
        return function() {
          return _this.trigger('update');
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    LocalBranch.prototype.push = function(remote) {
      if (remote == null) {
        remote = 'origin';
      }
      return git.cmd('push', [remote, this.getName()]).then((function(_this) {
        return function() {
          _this.trigger('update');
          return new OutputView('Pushing to remote repository successful');
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    return LocalBranch;

  })(Branch);

  module.exports = LocalBranch;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9hdG9tYXRpZ2l0L2xpYi9tb2RlbHMvYnJhbmNoZXMvbG9jYWwtYnJhbmNoLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrQ0FBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLEdBQUEsR0FBYSxPQUFBLENBQVEsV0FBUixDQUFiLENBQUE7O0FBQUEsRUFDQSxNQUFBLEdBQWEsT0FBQSxDQUFRLFVBQVIsQ0FEYixDQUFBOztBQUFBLEVBRUEsU0FBQSxHQUFhLE9BQUEsQ0FBUSx3QkFBUixDQUZiLENBQUE7O0FBQUEsRUFHQSxVQUFBLEdBQWEsT0FBQSxDQUFRLHlCQUFSLENBSGIsQ0FBQTs7QUFBQSxFQU1NO0FBRUosa0NBQUEsQ0FBQTs7Ozs7Ozs7OztLQUFBOztBQUFBLDBCQUFBLE1BQUEsR0FBUSxLQUFSLENBQUE7O0FBQUEsMEJBQ0EsS0FBQSxHQUFPLElBRFAsQ0FBQTs7QUFBQSwwQkFJQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxJQUFxQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUNBQWhCLENBQXJCO2VBQUEsSUFBQyxDQUFBLGNBQUQsQ0FBQSxFQUFBO09BRFU7SUFBQSxDQUpaLENBQUE7O0FBQUEsMEJBVUEsY0FBQSxHQUFnQixTQUFBLEdBQUE7QUFDZCxVQUFBLGdCQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsVUFBRCxHQUFjLFVBQUEsR0FBYSxFQUEzQixDQUFBO0FBQUEsTUFDQSxJQUFBLEdBQU8sSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUFZLENBQUMsSUFBYixDQUFBLENBRFAsQ0FBQTthQUVBLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixJQUFuQixDQUF3QixDQUFDLElBQXpCLENBQThCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFB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

//# sourceURL=/home/kyan/.atom/packages/atomatigit/lib/models/branches/local-branch.coffee
