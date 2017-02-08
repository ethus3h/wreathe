(function() {
  var Diff, ErrorView, File, ListItem, git, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  git = require('../../git');

  Diff = require('../diffs/diff');

  ListItem = require('../list-item');

  ErrorView = require('../../views/error-view');

  File = (function(_super) {
    __extends(File, _super);

    function File() {
      this.checkout = __bind(this.checkout, this);
      this.commitMessage = __bind(this.commitMessage, this);
      this.open = __bind(this.open, this);
      this.useSublist = __bind(this.useSublist, this);
      this.toggleDiff = __bind(this.toggleDiff, this);
      this.setDiff = __bind(this.setDiff, this);
      this.stage = __bind(this.stage, this);
      this.diff = __bind(this.diff, this);
      this.showDiffP = __bind(this.showDiffP, this);
      this.path = __bind(this.path, this);
      return File.__super__.constructor.apply(this, arguments);
    }

    File.prototype.initialize = function(file) {
      this.set(file);
      this.set({
        diff: false
      });
      this.loadDiff();
      return this.deselect();
    };

    File.prototype.path = function() {
      return this.get('path');
    };

    File.prototype.showDiffP = function() {
      return this.get('diff');
    };

    File.prototype.diff = function() {
      return this.sublist;
    };

    File.prototype.stage = function() {
      return git.add(this.path()).then((function(_this) {
        return function() {
          return _this.trigger('update');
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    File.prototype.setDiff = function(diff) {
      this.sublist = new Diff(diff);
      return this.trigger('change:diff');
    };

    File.prototype.toggleDiff = function() {
      return this.set({
        diff: !this.get('diff')
      });
    };

    File.prototype.useSublist = function() {
      return this.showDiffP();
    };

    File.prototype.open = function() {
      return atom.workspace.open(this.path());
    };

    File.prototype.commitMessage = function() {
      var switchState;
      switchState = function(type) {
        switch (type) {
          case 'M':
            return 'modified:   ';
          case 'R':
            return 'renamed:    ';
          case 'D':
            return 'deleted:    ';
          case 'A':
            return 'new file:   ';
          default:
            return '';
        }
      };
      return "#\t\t" + (switchState(this.getMode())) + (this.path()) + "\n";
    };

    File.prototype.checkout = function() {
      return git.checkoutFile(this.path()).then((function(_this) {
        return function() {
          return _this.trigger('update');
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    File.prototype.unstage = function() {};

    File.prototype.kill = function() {};

    File.prototype.loadDiff = function() {};

    File.prototype.getMode = function() {};

    File.prototype.isStaged = function() {
      return false;
    };

    File.prototype.isUnstaged = function() {
      return false;
    };

    File.prototype.isUntracked = function() {
      return false;
    };

    return File;

  })(ListItem);

  module.exports = File;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9hdG9tYXRpZ2l0L2xpYi9tb2RlbHMvZmlsZXMvZmlsZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUNBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FBSixDQUFBOztBQUFBLEVBRUEsR0FBQSxHQUFZLE9BQUEsQ0FBUSxXQUFSLENBRlosQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBWSxPQUFBLENBQVEsZUFBUixDQUhaLENBQUE7O0FBQUEsRUFJQSxRQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FKWixDQUFBOztBQUFBLEVBS0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSx3QkFBUixDQUxaLENBQUE7O0FBQUEsRUFPTTtBQUlKLDJCQUFBLENBQUE7Ozs7Ozs7Ozs7Ozs7O0tBQUE7O0FBQUEsbUJBQUEsVUFBQSxHQUFZLFNBQUMsSUFBRCxHQUFBO0FBQ1YsTUFBQSxJQUFDLENBQUEsR0FBRCxDQUFLLElBQUwsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxJQUFBLEVBQU0sS0FBTjtPQUFMLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUZBLENBQUE7YUFHQSxJQUFDLENBQUEsUUFBRCxDQUFBLEVBSlU7SUFBQSxDQUFaLENBQUE7O0FBQUEsbUJBU0EsSUFBQSxHQUFNLFNBQUEsR0FBQTthQUNKLElBQUMsQ0FBQSxHQUFELENBQUssTUFBTCxFQURJO0lBQUEsQ0FUTixDQUFBOztBQUFBLG1CQWVBLFNBQUEsR0FBVyxTQUFBLEdBQUE7YUFDVCxJQUFDLENBQUEsR0FBRCxDQUFLLE1BQUwsRUFEUztJQUFBLENBZlgsQ0FBQTs7QUFBQSxtQkFxQkEsSUFB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

//# sourceURL=/home/kyan/.atom/packages/atomatigit/lib/models/files/file.coffee
