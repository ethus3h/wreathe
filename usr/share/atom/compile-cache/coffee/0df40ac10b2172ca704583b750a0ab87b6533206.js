(function() {
  var Commit, ErrorView, ListItem, fs, git, path, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  fs = require('fs-plus');

  path = require('path');

  git = require('../../git');

  ListItem = require('../list-item');

  ErrorView = require('../../views/error-view');

  Commit = (function(_super) {
    __extends(Commit, _super);

    function Commit() {
      this.showCommit = __bind(this.showCommit, this);
      this.hardReset = __bind(this.hardReset, this);
      this.reset = __bind(this.reset, this);
      this.confirmHardReset = __bind(this.confirmHardReset, this);
      this.confirmReset = __bind(this.confirmReset, this);
      this.open = __bind(this.open, this);
      this.shortMessage = __bind(this.shortMessage, this);
      this.message = __bind(this.message, this);
      this.authorName = __bind(this.authorName, this);
      this.shortID = __bind(this.shortID, this);
      this.commitID = __bind(this.commitID, this);
      return Commit.__super__.constructor.apply(this, arguments);
    }

    Commit.prototype.defaults = {
      showMessage: null,
      author: null,
      id: null,
      message: null
    };

    Commit.prototype.initialize = function(gitCommit) {
      Commit.__super__.initialize.call(this);
      if (!_.isString(gitCommit) && _.isObject(gitCommit)) {
        this.set('author', gitCommit.author);
        this.set('id', gitCommit.ref);
        return this.set('message', gitCommit.message);
      }
    };

    Commit.prototype.unicodify = function(str) {
      try {
        str = decodeURIComponent(escape(str));
      } catch (_error) {}
      return str;
    };

    Commit.prototype.commitID = function() {
      return this.get('id');
    };

    Commit.prototype.shortID = function() {
      var _ref;
      return (_ref = this.commitID()) != null ? _ref.substr(0, 6) : void 0;
    };

    Commit.prototype.authorName = function() {
      var _ref;
      return this.unicodify((_ref = this.get('author')) != null ? _ref.name : void 0);
    };

    Commit.prototype.message = function() {
      return this.unicodify(this.get('message') || '\n');
    };

    Commit.prototype.shortMessage = function() {
      return this.message().split('\n')[0];
    };

    Commit.prototype.open = function() {
      return this.confirmReset();
    };

    Commit.prototype.confirmReset = function() {
      return atom.confirm({
        message: "Soft-reset head to " + (this.shortID()) + "?",
        detailedMessage: this.message(),
        buttons: {
          'Reset': this.reset,
          'Cancel': null
        }
      });
    };

    Commit.prototype.confirmHardReset = function() {
      return atom.confirm({
        message: "Do you REALLY want to HARD-reset head to " + (this.shortID()) + "?",
        detailedMessage: this.message(),
        buttons: {
          'Cancel': null,
          'Reset': this.hardReset
        }
      });
    };

    Commit.prototype.reset = function() {
      return git.reset(this.commitID()).then((function(_this) {
        return function() {
          return _this.trigger('update');
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    Commit.prototype.hardReset = function() {
      return git.reset(this.commitID(), {
        hard: true
      }).then((function(_this) {
        return function() {
          return _this.trigger('update');
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    Commit.prototype.showCommit = function() {
      var diffPath, gitPath, _ref, _ref1, _ref2;
      if (!this.has('showMessage')) {
        return git.show(this.commitID(), {
          format: 'full'
        }).then((function(_this) {
          return function(data) {
            _this.set('showMessage', _this.unicodify(data));
            return _this.showCommit();
          };
        })(this))["catch"](function(error) {
          return new ErrorView(error);
        });
      } else {
        gitPath = ((_ref = atom.project) != null ? (_ref1 = _ref.getRepositories()[0]) != null ? _ref1.getPath() : void 0 : void 0) || ((_ref2 = atom.project) != null ? _ref2.getPath() : void 0);
        diffPath = path.join(gitPath, ".git/" + (this.commitID()));
        fs.writeFileSync(diffPath, this.get('showMessage'));
        return atom.workspace.open(diffPath).then(function(editor) {
          var grammar;
          grammar = atom.grammars.grammarForScopeName('source.diff');
          if (grammar) {
            editor.setGrammar(grammar);
          }
          return editor.buffer.onDidDestroy(function() {
            return fs.removeSync(diffPath);
          });
        });
      }
    };

    return Commit;

  })(ListItem);

  module.exports = Commit;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9hdG9tYXRpZ2l0L2xpYi9tb2RlbHMvY29tbWl0cy9jb21taXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZDQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBTyxPQUFBLENBQVEsU0FBUixDQURQLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBSUEsR0FBQSxHQUFZLE9BQUEsQ0FBUSxXQUFSLENBSlosQ0FBQTs7QUFBQSxFQUtBLFFBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQUxaLENBQUE7O0FBQUEsRUFNQSxTQUFBLEdBQVksT0FBQSxDQUFRLHdCQUFSLENBTlosQ0FBQTs7QUFBQSxFQVFNO0FBQ0osNkJBQUEsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7O0tBQUE7O0FBQUEscUJBQUEsUUFBQSxHQUNFO0FBQUEsTUFBQSxXQUFBLEVBQWEsSUFBYjtBQUFBLE1BQ0EsTUFBQSxFQUFRLElBRFI7QUFBQSxNQUVBLEVBQUEsRUFBSSxJQUZKO0FBQUEsTUFHQSxPQUFBLEVBQVMsSUFIVDtLQURGLENBQUE7O0FBQUEscUJBU0EsVUFBQSxHQUFZLFNBQUMsU0FBRCxHQUFBO0FBQ1YsTUFBQSxxQ0FBQSxDQUFBLENBQUE7QUFDQSxNQUFBLElBQUcsQ0FBQSxDQUFLLENBQUMsUUFBRixDQUFXLFNBQVgsQ0FBSixJQUE4QixDQUFDLENBQUMsUUFBRixDQUFXLFNBQVgsQ0FBakM7QUFDRSxRQUFBLElBQUMsQ0FBQSxHQUFELENBQUssUUFBTCxFQUFlLFNBQVMsQ0FBQyxNQUF6QixDQUFBLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FB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

//# sourceURL=/home/kyan/.atom/packages/atomatigit/lib/models/commits/commit.coffee
