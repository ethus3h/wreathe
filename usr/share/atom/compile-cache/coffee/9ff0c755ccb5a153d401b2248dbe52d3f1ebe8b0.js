(function() {
  var Branch, Commit, ErrorView, ListItem, git,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  git = require('../../git');

  ListItem = require('../list-item');

  Commit = require('../commits/commit');

  ErrorView = require('../../views/error-view');

  Branch = (function(_super) {
    __extends(Branch, _super);

    function Branch() {
      this.checkout = __bind(this.checkout, this);
      this.open = __bind(this.open, this);
      this.kill = __bind(this.kill, this);
      return Branch.__super__.constructor.apply(this, arguments);
    }

    Branch.prototype.getName = function() {
      return decodeURIComponent(escape(this.get('name') || this.name));
    };

    Branch.prototype.localName = function() {
      return this.getName();
    };

    Branch.prototype.head = function() {
      return this.get('commit').ref;
    };

    Branch.prototype.commit = function() {
      return new Commit(this.get('commit'));
    };

    Branch.prototype.remoteName = function() {
      return '';
    };

    Branch.prototype.unpushed = function() {
      return false;
    };

    Branch.prototype.kill = function() {
      return atom.confirm({
        message: "Delete branch " + (this.getName()) + "?",
        buttons: {
          'Delete': this["delete"],
          'Cancel': null
        }
      });
    };

    Branch.prototype.open = function() {
      return this.checkout();
    };

    Branch.prototype.checkout = function(callback) {
      return git.checkout(this.localName()).then((function(_this) {
        return function() {
          return _this.trigger('update');
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    Branch.prototype.push = function() {};

    Branch.prototype["delete"] = function() {};

    return Branch;

  })(ListItem);

  module.exports = Branch;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9hdG9tYXRpZ2l0L2xpYi9tb2RlbHMvYnJhbmNoZXMvYnJhbmNoLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3Q0FBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLEdBQUEsR0FBWSxPQUFBLENBQVEsV0FBUixDQUFaLENBQUE7O0FBQUEsRUFDQSxRQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FEWixDQUFBOztBQUFBLEVBRUEsTUFBQSxHQUFZLE9BQUEsQ0FBUSxtQkFBUixDQUZaLENBQUE7O0FBQUEsRUFHQSxTQUFBLEdBQVksT0FBQSxDQUFRLHdCQUFSLENBSFosQ0FBQTs7QUFBQSxFQUtNO0FBSUosNkJBQUEsQ0FBQTs7Ozs7OztLQUFBOztBQUFBLHFCQUFBLE9BQUEsR0FBUyxTQUFBLEdBQUE7YUFHUCxrQkFBQSxDQUFtQixNQUFBLENBQU8sSUFBQyxDQUFBLEdBQUQsQ0FBSyxNQUFMLENBQUEsSUFBZ0IsSUFBQyxDQUFBLElBQXhCLENBQW5CLEVBSE87SUFBQSxDQUFULENBQUE7O0FBQUEscUJBUUEsU0FBQSxHQUFXLFNBQUEsR0FBQTthQUNULElBQUMsQ0FBQSxPQUFELENBQUEsRUFEUztJQUFBLENBUlgsQ0FBQTs7QUFBQSxxQkFjQSxJQUFBLEdBQU0sU0FBQSxHQUFBO2FBQ0osSUFBQyxDQUFBLEdBQUQsQ0FBSyxRQUFMLENBQWMsQ0FBQyxJQURYO0lBQUEsQ0FkTixDQUFBOztBQUFBLHFCQW9CQSxNQUFBLEdBQVEsU0FBQSxHQUFBO2FBQ0YsSUFBQSxNQUFBLENBQU8sSUFBQyxDQUFBLEdBQUQsQ0FBSyxRQUFMLENBQVAsRUFERTtJQUFBLENBcEJSLENBQUE7O0FBQUEscUJBMEJBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFBRyxHQUFIO0lBQUEsQ0ExQlosQ0FBQTs7QUFBQSxxQkErQkEsUUFBQSxHQUFVLFNBQUEsR0FBQTthQUFHLE1BQUg7SUFBQSxDQS9CVixDQUFBOztBQUFBLHFCQWtDQSxJQUFBLEdBQU0sU0FBQSxHQUFBO2FBQ0osSUFBSSxDQUFDLE9BQUwsQ0FDRTtBQUFBLFFBQUEsT0FBQSxFQUFVLGdCQUFBLEdBQWUsQ0FBQyxJQUFDLENBQUEsT0FBRCxDQUFBLENBQUQsQ0FBZixHQUEyQixHQUFyQztBQUFBLFFBQ0EsT0FBQSxFQUNFO0FBQUEsVUFBQSxRQUFBLEVBQVUsSUFBQyxDQUFBLFFBQUEsQ0FBWDtBQUFBLFVBQ0EsUUFBQSxFQUFVLElBRFY7U0FGRjtPQURGLEVBREk7SUFBQSxDQWxDTixDQUFBOztBQUFBLHFCQTBDQSxJQUFBLEdBQU0sU0FBQSxHQUFBO2FBQ0osSUFBQyxDQUFBLFFBQUQsQ0FBQSxFQURJO0lBQUEsQ0ExQ04sQ0FBQTs7QUFBQSxxQkFnREEsUUFBQSxHQUFVLFNBQUMsUUFBRCxHQUFBO2FBQ1IsR0FBRyxDQUFDLFFBQUosQ0FBYSxJQUFDLENBQUEsU0FBRCxDQUFBLENBQWIsQ0FDQSxDQUFDLElBREQsQ0FDTSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxPQUFELENBQVMsUUFBVCxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FETixDQUVBLENBQUMsT0FBRCxDQUZBLENBRU8sU0FBQyxLQUFELEdBQUE7ZUFBZSxJQUFBLFNBQUEsQ0FBVSxLQUFWLEVBQWY7TUFBQSxDQUZQLEVBRFE7SUFBQSxDQWhEVixDQUFBOztBQUFBLHFCQXNEQSxJQUFBLEdBQU0sU0FBQSxHQUFBLENBdEROLENBQUE7O0FBQUEscUJBeURBLFNBQUEsR0FBUSxTQUFBLEdBQUEsQ0F6RFIsQ0FBQTs7a0JBQUE7O0tBSm1CLFNBTHJCLENBQUE7O0FBQUEsRUFvRUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsTUFwRWpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/kyan/.atom/packages/atomatigit/lib/models/branches/branch.coffee
