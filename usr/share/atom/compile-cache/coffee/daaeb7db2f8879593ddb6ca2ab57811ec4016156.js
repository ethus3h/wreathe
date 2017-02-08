(function() {
  var BranchList, CommitList, CompositeDisposable, CurrentBranch, ErrorView, FileList, Model, OutputView, Promise, Repo, fs, git, path, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  fs = require('fs');

  path = require('path');

  Model = require('backbone').Model;

  CompositeDisposable = require('atom').CompositeDisposable;

  ErrorView = require('../views/error-view');

  OutputView = require('../views/output-view');

  Promise = (git = require('../git')).Promise;

  FileList = require('./files').FileList;

  _ref = require('./branches'), CurrentBranch = _ref.CurrentBranch, BranchList = _ref.BranchList;

  CommitList = require('./commits').CommitList;

  Repo = (function(_super) {
    __extends(Repo, _super);

    function Repo() {
      this.push = __bind(this.push, this);
      this.initiateGitCommand = __bind(this.initiateGitCommand, this);
      this.initiateCreateBranch = __bind(this.initiateCreateBranch, this);
      this.completeCommit = __bind(this.completeCommit, this);
      this.cleanupCommitMessageFile = __bind(this.cleanupCommitMessageFile, this);
      this.commitMessage = __bind(this.commitMessage, this);
      this.initiateCommit = __bind(this.initiateCommit, this);
      this.leaf = __bind(this.leaf, this);
      this.selection = __bind(this.selection, this);
      this.reload = __bind(this.reload, this);
      this.destroy = __bind(this.destroy, this);
      return Repo.__super__.constructor.apply(this, arguments);
    }

    Repo.prototype.initialize = function() {
      var atomGit;
      this.fileList = new FileList([]);
      this.branchList = new BranchList([]);
      this.commitList = new CommitList([]);
      this.currentBranch = new CurrentBranch(this.headRefsCount() > 0);
      this.subscriptions = new CompositeDisposable;
      this.listenTo(this.branchList, 'repaint', (function(_this) {
        return function() {
          _this.commitList.reload();
          return _this.currentBranch.reload();
        };
      })(this));
      atomGit = atom.project.getRepositories()[0];
      if (atomGit != null) {
        return this.subscriptions.add(atomGit.onDidChangeStatus(this.reload));
      }
    };

    Repo.prototype.destroy = function() {
      this.stopListening();
      return this.subscriptions.dispose();
    };

    Repo.prototype.reload = function() {
      var promises;
      promises = [this.fileList.reload()];
      if (this.headRefsCount() > 0) {
        promises.push(this.branchList.reload());
        promises.push(this.commitList.reload());
        promises.push(this.currentBranch.reload());
      }
      return Promise.all(promises);
    };

    Repo.prototype.selection = function() {
      return this.activeList.selection();
    };

    Repo.prototype.leaf = function() {
      return this.activeList.leaf();
    };

    Repo.prototype.commitMessagePath = function() {
      var _ref1;
      return path.join((_ref1 = atom.project.getRepositories()[0]) != null ? _ref1.getWorkingDirectory() : void 0, '/.git/COMMIT_EDITMSG_ATOMATIGIT');
    };

    Repo.prototype.headRefsCount = function() {
      var _ref1, _ref2, _ref3, _ref4;
      return (_ref1 = (_ref2 = atom.project.getRepositories()[0]) != null ? (_ref3 = _ref2.getReferences()) != null ? (_ref4 = _ref3.heads) != null ? _ref4.length : void 0 : void 0 : void 0) != null ? _ref1 : 0;
    };

    Repo.prototype.fetch = function() {
      return git.cmd('fetch')["catch"](function(error) {
        return new ErrorView(error);
      }).done((function(_this) {
        return function() {
          return _this.trigger('update');
        };
      })(this));
    };

    Repo.prototype.stash = function() {
      return git.cmd('stash')["catch"](function(error) {
        return new ErrorView(error);
      }).done((function(_this) {
        return function() {
          return _this.trigger('update');
        };
      })(this));
    };

    Repo.prototype.stashPop = function() {
      return git.cmd('stash pop')["catch"](function(error) {
        return new ErrorView(error);
      }).done((function(_this) {
        return function() {
          return _this.trigger('update');
        };
      })(this));
    };

    Repo.prototype.initiateCommit = function() {
      var editorPromise, preCommitHook;
      preCommitHook = atom.config.get('atomatigit.pre_commit_hook');
      if ((preCommitHook != null ? preCommitHook.length : void 0) > 0) {
        atom.commands.dispatch(atom.views.getView(atom.workspace), preCommitHook);
      }
      fs.writeFileSync(this.commitMessagePath(), this.commitMessage());
      editorPromise = atom.workspace.open(this.commitMessagePath(), {
        activatePane: true
      });
      return editorPromise.then((function(_this) {
        return function(editor) {
          editor.setGrammar(atom.grammars.grammarForScopeName('text.git-commit'));
          editor.setCursorBufferPosition([0, 0]);
          return editor.onDidSave(_this.completeCommit);
        };
      })(this));
    };

    Repo.prototype.commitMessage = function() {
      var filesStaged, filesUnstaged, filesUntracked, message;
      message = '\n' + ("# Please enter the commit message for your changes. Lines starting\n# with '#' will be ignored, and an empty message aborts the commit.\n# On branch " + (this.currentBranch.localName()) + "\n");
      filesStaged = this.fileList.staged();
      filesUnstaged = this.fileList.unstaged();
      filesUntracked = this.fileList.untracked();
      if (filesStaged.length >= 1) {
        message += '#\n# Changes to be committed:\n';
      }
      _.each(filesStaged, function(file) {
        return message += file.commitMessage();
      });
      if (filesUnstaged.length >= 1) {
        message += '#\n# Changes not staged for commit:\n';
      }
      _.each(filesUnstaged, function(file) {
        return message += file.commitMessage();
      });
      if (filesUntracked.length >= 1) {
        message += '#\n# Untracked files:\n';
      }
      _.each(filesUntracked, function(file) {
        return message += file.commitMessage();
      });
      return message;
    };

    Repo.prototype.cleanupCommitMessageFile = function() {
      var _ref1;
      if (atom.workspace.getActivePane().getItems().length > 1) {
        atom.workspace.destroyActivePaneItem();
      } else {
        atom.workspace.destroyActivePane();
      }
      try {
        fs.unlinkSync(this.commitMessagePath());
      } catch (_error) {}
      return (_ref1 = atom.project.getRepositories()[0]) != null ? typeof _ref1.refreshStatus === "function" ? _ref1.refreshStatus() : void 0 : void 0;
    };

    Repo.prototype.completeCommit = function() {
      return git.commit(this.commitMessagePath()).then(this.reload).then((function(_this) {
        return function() {
          return _this.trigger('complete');
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      })["finally"](this.cleanupCommitMessageFile);
    };

    Repo.prototype.initiateCreateBranch = function() {
      return this.trigger('needInput', {
        message: 'Branch name',
        callback: function(name) {
          return git.cmd("checkout -b " + name)["catch"](function(error) {
            return new ErrorView(error);
          }).done((function(_this) {
            return function() {
              return _this.trigger('complete');
            };
          })(this));
        }
      });
    };

    Repo.prototype.initiateGitCommand = function() {
      return this.trigger('needInput', {
        message: 'Git command',
        callback: (function(_this) {
          return function(command) {
            return git.cmd(command).then(function(output) {
              return new OutputView(output);
            })["catch"](function(error) {
              return new ErrorView(error);
            }).done(function() {
              return _this.trigger('complete');
            });
          };
        })(this)
      });
    };

    Repo.prototype.push = function() {
      return this.currentBranch.push();
    };

    return Repo;

  })(Model);

  module.exports = Repo;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9hdG9tYXRpZ2l0L2xpYi9tb2RlbHMvcmVwby5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUlBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQVUsT0FBQSxDQUFRLFFBQVIsQ0FBVixDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFVLE9BQUEsQ0FBUSxJQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBVSxPQUFBLENBQVEsTUFBUixDQUZWLENBQUE7O0FBQUEsRUFHQyxRQUFTLE9BQUEsQ0FBUSxVQUFSLEVBQVQsS0FIRCxDQUFBOztBQUFBLEVBSUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUpELENBQUE7O0FBQUEsRUFNQSxTQUFBLEdBQThCLE9BQUEsQ0FBUSxxQkFBUixDQU45QixDQUFBOztBQUFBLEVBT0EsVUFBQSxHQUE4QixPQUFBLENBQVEsc0JBQVIsQ0FQOUIsQ0FBQTs7QUFBQSxFQVFDLFVBQVcsQ0FBQSxHQUFBLEdBQWtCLE9BQUEsQ0FBUSxRQUFSLENBQWxCLEVBQVgsT0FSRCxDQUFBOztBQUFBLEVBU0MsV0FBNkIsT0FBQSxDQUFRLFNBQVIsRUFBN0IsUUFURCxDQUFBOztBQUFBLEVBVUEsT0FBOEIsT0FBQSxDQUFRLFlBQVIsQ0FBOUIsRUFBQyxxQkFBQSxhQUFELEVBQWdCLGtCQUFBLFVBVmhCLENBQUE7O0FBQUEsRUFXQyxhQUE2QixPQUFBLENBQVEsV0FBUixFQUE3QixVQVhELENBQUE7O0FBQUEsRUFjTTtBQUVKLDJCQUFBLENBQUE7Ozs7Ozs7Ozs7Ozs7OztLQUFBOztBQUFBLG1CQUFBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixVQUFBLE9BQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxRQUFELEdBQXFCLElB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

//# sourceURL=/home/kyan/.atom/packages/atomatigit/lib/models/repo.coffee
