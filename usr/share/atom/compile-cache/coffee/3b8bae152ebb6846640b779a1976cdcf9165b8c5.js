(function() {
  var ErrorView, File, UnstagedFile, git,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  File = require('./file');

  git = require('../../git');

  ErrorView = require('../../views/error-view');

  module.exports = UnstagedFile = (function(_super) {
    __extends(UnstagedFile, _super);

    function UnstagedFile() {
      this.getMode = __bind(this.getMode, this);
      this.loadDiff = __bind(this.loadDiff, this);
      this.kill = __bind(this.kill, this);
      this.unstage = __bind(this.unstage, this);
      return UnstagedFile.__super__.constructor.apply(this, arguments);
    }

    UnstagedFile.prototype.sortValue = 1;

    UnstagedFile.prototype.unstage = function() {
      return git.unstage(this.path()).then((function(_this) {
        return function() {
          return _this.trigger('update');
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    UnstagedFile.prototype.kill = function() {
      return atom.confirm({
        message: "Discard unstaged changes to \"" + (this.path()) + "\"?",
        buttons: {
          'Discard': this.checkout,
          'Cancel': function() {}
        }
      });
    };

    UnstagedFile.prototype.loadDiff = function() {
      if (this.getMode() === 'D') {
        return;
      }
      return git.getDiff(this.path()).then((function(_this) {
        return function(diff) {
          return _this.setDiff(diff);
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    UnstagedFile.prototype.getMode = function() {
      return this.get('modeWorkingTree');
    };

    UnstagedFile.prototype.isUnstaged = function() {
      return true;
    };

    return UnstagedFile;

  })(File);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9hdG9tYXRpZ2l0L2xpYi9tb2RlbHMvZmlsZXMvdW5zdGFnZWQtZmlsZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0NBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQVksT0FBQSxDQUFRLFFBQVIsQ0FBWixDQUFBOztBQUFBLEVBQ0EsR0FBQSxHQUFZLE9BQUEsQ0FBUSxXQUFSLENBRFosQ0FBQTs7QUFBQSxFQUVBLFNBQUEsR0FBWSxPQUFBLENBQVEsd0JBQVIsQ0FGWixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUdKLG1DQUFBLENBQUE7Ozs7Ozs7O0tBQUE7O0FBQUEsMkJBQUEsU0FBQSxHQUFXLENBQVgsQ0FBQTs7QUFBQSwyQkFFQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQ1AsR0FBRyxDQUFDLE9BQUosQ0FBWSxJQUFDLENBQUEsSUFBRCxDQUFBLENBQVosQ0FDQSxDQUFDLElBREQsQ0FDTSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxPQUFELENBQVMsUUFBVCxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FETixDQUVBLENBQUMsT0FBRCxDQUZBLENBRU8sU0FBQyxLQUFELEdBQUE7ZUFBZSxJQUFBLFNBQUEsQ0FBVSxLQUFWLEVBQWY7TUFBQSxDQUZQLEVBRE87SUFBQSxDQUZULENBQUE7O0FBQUEsMkJBT0EsSUFBQSxHQUFNLFNBQUEsR0FBQTthQUNKLElBQUksQ0FBQyxPQUFMLENBQ0U7QUFBQSxRQUFBLE9BQUEsRUFBVSxnQ0FBQSxHQUErQixDQUFDLElBQUMsQ0FBQSxJQUFELENBQUEsQ0FBRCxDQUEvQixHQUF3QyxLQUFsRDtBQUFBLFFBQ0EsT0FBQSxFQUNFO0FBQUEsVUFBQSxTQUFBLEVBQVcsSUFBQyxDQUFBLFFBQVo7QUFBQSxVQUNBLFFBQUEsRUFBVSxTQUFBLEdBQUEsQ0FEVjtTQUZGO09BREYsRUFESTtJQUFBLENBUE4sQ0FBQTs7QUFBQSwyQkFjQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUFVLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FBQSxLQUFjLEdBQXhCO0FBQUEsY0FBQSxDQUFBO09BQUE7YUFDQSxHQUFHLENBQUMsT0FBSixDQUFZLElBQUMsQ0FBQSxJQUFELENBQUEsQ0FBWixDQUNBLENBQUMsSUFERCxDQUNNLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtpQkFBVSxLQUFDLENBQUEsT0FBRCxDQUFTLElBQVQsRUFBVjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRE4sQ0FFQSxDQUFDLE9BQUQsQ0FGQSxDQUVPLFNBQUMsS0FBRCxHQUFBO2VBQWUsSUFBQSxTQUFBLENBQVUsS0FBVixFQUFmO01BQUEsQ0FGUCxFQUZRO0lBQUEsQ0FkVixDQUFBOztBQUFBLDJCQW9CQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQ1AsSUFBQyxDQUFBLEdBQUQsQ0FBSyxpQkFBTCxFQURPO0lBQUEsQ0FwQlQsQ0FBQTs7QUFBQSwyQkF1QkEsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUFHLEtBQUg7SUFBQSxDQXZCWixDQUFBOzt3QkFBQTs7S0FIeUIsS0FMM0IsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/kyan/.atom/packages/atomatigit/lib/models/files/unstaged-file.coffee
