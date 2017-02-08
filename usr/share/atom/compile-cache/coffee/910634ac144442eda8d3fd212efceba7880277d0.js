(function() {
  var Commit, CommitList, ErrorView, List, git, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  git = require('../../git');

  List = require('../list');

  Commit = require('./commit');

  ErrorView = require('../../views/error-view');

  CommitList = (function(_super) {
    __extends(CommitList, _super);

    function CommitList() {
      this.reload = __bind(this.reload, this);
      return CommitList.__super__.constructor.apply(this, arguments);
    }

    CommitList.prototype.model = Commit;

    CommitList.prototype.reload = function(branch, options) {
      var _ref, _ref1, _ref2;
      this.branch = branch;
      if (options == null) {
        options = {};
      }
      if (_.isPlainObject(this.branch)) {
        _ref = [null, this.branch], this.branch = _ref[0], options = _ref[1];
      }
      return git.log((_ref1 = (_ref2 = this.branch) != null ? _ref2.head() : void 0) != null ? _ref1 : 'HEAD').then((function(_this) {
        return function(commits) {
          _this.reset(_.map(commits, function(commit) {
            return new Commit(commit);
          }));
          if (!options.silent) {
            _this.trigger('repaint');
          }
          return _this.select(_this.selectedIndex);
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    return CommitList;

  })(List);

  module.exports = CommitList;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9hdG9tYXRpZ2l0L2xpYi9tb2RlbHMvY29tbWl0cy9jb21taXQtbGlzdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMkNBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsR0FBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSLENBRFQsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBUyxPQUFBLENBQVEsU0FBUixDQUZULENBQUE7O0FBQUEsRUFHQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FIVCxDQUFBOztBQUFBLEVBSUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSx3QkFBUixDQUpaLENBQUE7O0FBQUEsRUFNTTtBQUNKLGlDQUFBLENBQUE7Ozs7O0tBQUE7O0FBQUEseUJBQUEsS0FBQSxHQUFPLE1BQVAsQ0FBQTs7QUFBQSx5QkFLQSxNQUFBLEdBQVEsU0FBRSxNQUFGLEVBQVUsT0FBVixHQUFBO0FBQ04sVUFBQSxrQkFBQTtBQUFBLE1BRE8sSUFBQyxDQUFBLFNBQUEsTUFDUixDQUFBOztRQURnQixVQUFRO09BQ3hCO0FBQUEsTUFBQSxJQUF3QyxDQUFDLENBQUMsYUFBRixDQUFnQixJQUFDLENBQUEsTUFBakIsQ0FBeEM7QUFBQSxRQUFBLE9BQXFCLENBQUMsSUFBRCxFQUFPLElBQUMsQ0FBQSxNQUFSLENBQXJCLEVBQUMsSUFBQyxDQUFBLGdCQUFGLEVBQVUsaUJBQVYsQ0FBQTtPQUFBO2FBQ0EsR0FBRyxDQUFDLEdBQUosbUZBQTBCLE1BQTFCLENBQ0EsQ0FBQyxJQURELENBQ00sQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsT0FBRCxHQUFBO0FBQ0osVUFBQSxLQUFDLENBQUEsS0FBRCxDQUFPLENBQUMsQ0FBQyxHQUFGLENBQU0sT0FBTixFQUFlLFNBQUMsTUFBRCxHQUFBO21CQUFnQixJQUFBLE1BQUEsQ0FBTyxNQUFQLEVBQWhCO1VBQUEsQ0FBZixDQUFQLENBQUEsQ0FBQTtBQUNBLFVBQUEsSUFBQSxDQUFBLE9BQWtDLENBQUMsTUFBbkM7QUFBQSxZQUFBLEtBQUMsQ0FBQSxPQUFELENBQVMsU0FBVCxDQUFBLENBQUE7V0FEQTtpQkFFQSxLQUFDLENBQUEsTUFBRCxDQUFRLEtBQUMsQ0FBQSxhQUFULEVBSEk7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUROLENBS0EsQ0FBQyxPQUFELENBTEEsQ0FLTyxTQUFDLEtBQUQsR0FBQTtlQUFlLElBQUEsU0FBQSxDQUFVLEtBQVYsRUFBZjtNQUFBLENBTFAsRUFGTTtJQUFBLENBTFIsQ0FBQTs7c0JBQUE7O0tBRHVCLEtBTnpCLENBQUE7O0FBQUEsRUFxQkEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFyQmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/kyan/.atom/packages/atomatigit/lib/models/commits/commit-list.coffee
