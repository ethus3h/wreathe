(function() {
  var Branch, ErrorView, RemoteBranch, git,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  git = require('../../git');

  Branch = require('./branch');

  ErrorView = require('../../views/error-view');

  RemoteBranch = (function(_super) {
    __extends(RemoteBranch, _super);

    function RemoteBranch() {
      this["delete"] = __bind(this["delete"], this);
      return RemoteBranch.__super__.constructor.apply(this, arguments);
    }

    RemoteBranch.prototype.remote = true;

    RemoteBranch.prototype.local = false;

    RemoteBranch.prototype["delete"] = function() {
      return git.cmd("push -f " + (this.remoteName()) + " :" + (this.localName())).then((function(_this) {
        return function() {
          return _this.trigger('update');
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    RemoteBranch.prototype.localName = function() {
      return this.getName().replace(/.*?\//, '');
    };

    RemoteBranch.prototype.remoteName = function() {
      return this.getName().replace(/\/.*/, '');
    };

    return RemoteBranch;

  })(Branch);

  module.exports = RemoteBranch;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9hdG9tYXRpZ2l0L2xpYi9tb2RlbHMvYnJhbmNoZXMvcmVtb3RlLWJyYW5jaC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsb0NBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQVksT0FBQSxDQUFRLFdBQVIsQ0FBWixDQUFBOztBQUFBLEVBQ0EsTUFBQSxHQUFZLE9BQUEsQ0FBUSxVQUFSLENBRFosQ0FBQTs7QUFBQSxFQUVBLFNBQUEsR0FBWSxPQUFBLENBQVEsd0JBQVIsQ0FGWixDQUFBOztBQUFBLEVBSU07QUFFSixtQ0FBQSxDQUFBOzs7OztLQUFBOztBQUFBLDJCQUFBLE1BQUEsR0FBUSxJQUFSLENBQUE7O0FBQUEsMkJBQ0EsS0FBQSxHQUFPLEtBRFAsQ0FBQTs7QUFBQSwyQkFNQSxTQUFBLEdBQVEsU0FBQSxHQUFBO2FBQ04sR0FBRyxDQUFDLEdBQUosQ0FBUyxVQUFBLEdBQVMsQ0FBQyxJQUFDLENBQUEsVUFBRCxDQUFBLENBQUQsQ0FBVCxHQUF3QixJQUF4QixHQUEyQixDQUFDLElBQUMsQ0FBQSxTQUFELENBQUEsQ0FBRCxDQUFwQyxDQUNBLENBQUMsSUFERCxDQUNNLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLE9BQUQsQ0FBUyxRQUFULEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUROLENBRUEsQ0FBQyxPQUFELENBRkEsQ0FFTyxTQUFDLEtBQUQsR0FBQTtlQUFlLElBQUEsU0FBQSxDQUFVLEtBQVYsRUFBZjtNQUFBLENBRlAsRUFETTtJQUFBLENBTlIsQ0FBQTs7QUFBQSwyQkFjQSxTQUFBLEdBQVcsU0FBQSxHQUFBO2FBQ1QsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUFVLENBQUMsT0FBWCxDQUFtQixPQUFuQixFQUE0QixFQUE1QixFQURTO0lBQUEsQ0FkWCxDQUFBOztBQUFBLDJCQW9CQSxVQUFBLEdBQVksU0FBQSxHQUFBO2FBQ1YsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUFVLENBQUMsT0FBWCxDQUFtQixNQUFuQixFQUEyQixFQUEzQixFQURVO0lBQUEsQ0FwQlosQ0FBQTs7d0JBQUE7O0tBRnlCLE9BSjNCLENBQUE7O0FBQUEsRUE2QkEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsWUE3QmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/kyan/.atom/packages/atomatigit/lib/models/branches/remote-branch.coffee
