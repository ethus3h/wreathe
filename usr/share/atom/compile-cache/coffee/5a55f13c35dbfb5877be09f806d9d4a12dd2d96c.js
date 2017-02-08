(function() {
  var $, BranchListView, CommitListView, CompositeDisposable, CurrentBranchView, ErrorView, FileListView, InputView, RepoView, View, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  CompositeDisposable = require('atom').CompositeDisposable;

  FileListView = require('./files').FileListView;

  _ref1 = require('./branches'), CurrentBranchView = _ref1.CurrentBranchView, BranchListView = _ref1.BranchListView;

  CommitListView = require('./commits').CommitListView;

  ErrorView = require('./error-view');

  InputView = require('./input-view');

  RepoView = (function(_super) {
    __extends(RepoView, _super);

    function RepoView() {
      this.destroy = __bind(this.destroy, this);
      this.hide = __bind(this.hide, this);
      this.show = __bind(this.show, this);
      this.toggle = __bind(this.toggle, this);
      this.toggleFocus = __bind(this.toggleFocus, this);
      this.unfocus = __bind(this.unfocus, this);
      this.focus = __bind(this.focus, this);
      this.unfocusIfNotActive = __bind(this.unfocusIfNotActive, this);
      this.hasFocus = __bind(this.hasFocus, this);
      this.resize = __bind(this.resize, this);
      this.resizeStopped = __bind(this.resizeStopped, this);
      this.resizeStarted = __bind(this.resizeStarted, this);
      this.activateView = __bind(this.activateView, this);
      this.showCommits = __bind(this.showCommits, this);
      this.showFiles = __bind(this.showFiles, this);
      this.showBranches = __bind(this.showBranches, this);
      this.refresh = __bind(this.refresh, this);
      this.insertCommands = __bind(this.insertCommands, this);
      this.detached = __bind(this.detached, this);
      this.attached = __bind(this.attached, this);
      return RepoView.__super__.constructor.apply(this, arguments);
    }

    RepoView.content = function(model) {
      return this.div({
        "class": 'atomatigit'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'resize-handle',
            outlet: 'resizeHandle'
          });
          _this.subview('currentBranchView', new CurrentBranchView(model));
          _this.ul({
            "class": 'list-inline tab-bar inset-panel'
          }, function() {
            _this.li({
              outlet: 'fileTab',
              "class": 'tab active',
              click: 'showFiles'
            }, function() {
              return _this.div({
                "class": 'title'
              }, 'Files');
            });
            _this.li({
              outlet: 'branchTab',
              "class": 'tab',
              click: 'showBranches'
            }, function() {
              return _this.div({
                "class": 'title'
              }, 'Branches');
            });
            return _this.li({
              outlet: 'commitTab',
              "class": 'tab',
              click: 'showCommits'
            }, function() {
              return _this.div({
                "class": 'title'
              }, 'Log');
            });
          });
          return _this.div({
            "class": 'lists'
          }, function() {
            _this.subview('fileListView', new FileListView(model.fileList));
            _this.subview('branchListView', new BranchListView(model.branchList));
            return _this.subview('commitListView', new CommitListView(model.commitList));
          });
        };
      })(this));
    };

    RepoView.prototype.initialize = function(model) {
      this.model = model;
      return this.InitPromise = this.model.reload().then(this.showFiles);
    };

    RepoView.prototype.attached = function() {
      this.model.on('needInput', this.getInput);
      this.model.on('complete', this.focus);
      this.model.on('update', this.refresh);
      this.on('click', this.focus);
      this.resizeHandle.on('mousedown', this.resizeStarted);
      this.fileListView.on('blur', this.unfocusIfNotActive);
      this.branchListView.on('blur', this.unfocusIfNotActive);
      this.commitListView.on('blur', this.unfocusIfNotActive);
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(this.insertCommands());
    };

    RepoView.prototype.detached = function() {
      this.model.off('needInput', this.getInput);
      this.model.off('complete', this.focus);
      this.model.off('update', this.refresh);
      this.off('click', this.focus);
      this.resizeHandle.off('mousedown', this.resizeStarted);
      this.fileListView.off('blur', this.unfocusIfNotActive);
      this.branchListView.off('blur', this.unfocusIfNotActive);
      this.commitListView.off('blur', this.unfocusIfNotActive);
      return this.subscriptions.dispose();
    };

    RepoView.prototype.insertCommands = function() {
      return atom.commands.add(this.element, {
        'core:move-down': (function(_this) {
          return function() {
            return _this.model.activeList.next();
          };
        })(this),
        'core:move-up': (function(_this) {
          return function() {
            return _this.model.activeList.previous();
          };
        })(this),
        'core:cancel': this.hide,
        'atomatigit:files': this.showFiles,
        'atomatigit:branches': this.showBranches,
        'atomatigit:commit-log': this.showCommits,
        'atomatigit:commit': (function(_this) {
          return function() {
            _this.model.initiateCommit();
            return _this.unfocus();
          };
        })(this),
        'atomatigit:git-command': (function(_this) {
          return function() {
            _this.model.initiateGitCommand();
            return _this.unfocus();
          };
        })(this),
        'atomatigit:stage': (function(_this) {
          return function() {
            var _ref2;
            return (_ref2 = _this.model.leaf()) != null ? _ref2.stage() : void 0;
          };
        })(this),
        'atomatigit:stash': this.model.stash,
        'atomatigit:stash-pop': this.model.stashPop,
        'atomatigit:toggle-diff': (function(_this) {
          return function() {
            var _ref2;
            return (_ref2 = _this.model.selection()) != null ? _ref2.toggleDiff() : void 0;
          };
        })(this),
        'atomatigit:unstage': (function(_this) {
          return function() {
            var _ref2;
            return (_ref2 = _this.model.leaf()) != null ? _ref2.unstage() : void 0;
          };
        })(this),
        'atomatigit:fetch': this.model.fetch,
        'atomatigit:kill': (function(_this) {
          return function() {
            var _ref2;
            return (_ref2 = _this.model.leaf()) != null ? _ref2.kill() : void 0;
          };
        })(this),
        'atomatigit:open': (function(_this) {
          return function() {
            var _ref2;
            return (_ref2 = _this.model.selection()) != null ? _ref2.open() : void 0;
          };
        })(this),
        'atomatigit:push': this.model.push,
        'atomatigit:refresh': this.refresh,
        'atomatigit:toggle-focus': this.toggleFocus
      });
    };

    RepoView.prototype.refresh = function() {
      return this.model.reload().then((function(_this) {
        return function() {
          return _this.activeView.repaint();
        };
      })(this));
    };

    RepoView.prototype.showBranches = function() {
      this.model.activeList = this.model.branchList;
      this.activeView = this.branchListView;
      return this.activateView();
    };

    RepoView.prototype.showFiles = function() {
      this.model.activeList = this.model.fileList;
      this.activeView = this.fileListView;
      return this.activateView();
    };

    RepoView.prototype.showCommits = function() {
      this.model.activeList = this.model.commitList;
      this.activeView = this.commitListView;
      return this.activateView();
    };

    RepoView.prototype.activateView = function() {
      this.fileListView.toggleClass('hidden', this.activeView !== this.fileListView);
      this.fileTab.toggleClass('active', this.activeView === this.fileListView);
      this.branchListView.toggleClass('hidden', this.activeView !== this.branchListView);
      this.branchTab.toggleClass('active', this.activeView === this.branchListView);
      this.commitListView.toggleClass('hidden', this.activeView !== this.commitListView);
      this.commitTab.toggleClass('active', this.activeView === this.commitListView);
      return this.focus();
    };

    RepoView.prototype.resizeStarted = function() {
      $(document.body).on('mousemove', this.resize);
      return $(document.body).on('mouseup', this.resizeStopped);
    };

    RepoView.prototype.resizeStopped = function() {
      $(document.body).off('mousemove', this.resize);
      return $(document.body).off('mouseup', this.resizeStopped);
    };

    RepoView.prototype.resize = function(_arg) {
      var pageX, width;
      pageX = _arg.pageX;
      width = $(document.body).width() - pageX;
      return this.width(width);
    };

    RepoView.prototype.getInput = function(options) {
      return new InputView(options);
    };

    RepoView.prototype.hasFocus = function() {
      var _ref2;
      return ((_ref2 = this.activeView) != null ? _ref2.is(':focus') : void 0) || document.activeElement === this.activeView;
    };

    RepoView.prototype.unfocusIfNotActive = function() {
      return this.unfocusTimeoutId = setTimeout((function(_this) {
        return function() {
          if (!_this.hasFocus()) {
            return _this.unfocus();
          }
        };
      })(this), 300);
    };

    RepoView.prototype.focus = function() {
      var _ref2;
      if (this.unfocusTimeoutId != null) {
        clearTimeout(this.unfocusTimeoutId);
        this.unfocusTimeoutId = null;
      }
      return ((_ref2 = this.activeView) != null ? typeof _ref2.focus === "function" ? _ref2.focus() : void 0 : void 0) && (this.hasClass('focused') || this.refresh()) && this.addClass('focused');
    };

    RepoView.prototype.unfocus = function() {
      return this.removeClass('focused');
    };

    RepoView.prototype.toggleFocus = function() {
      if (!this.hasFocus()) {
        return this.focus();
      }
      this.unfocus();
      return atom.workspace.getActivePane().activate();
    };

    RepoView.prototype.toggle = function() {
      if (this.hasParent() && this.hasFocus()) {
        return this.hide();
      } else {
        return this.show();
      }
    };

    RepoView.prototype.show = function() {
      if (!this.hasParent()) {
        atom.workspace.addRightPanel({
          item: this
        });
      }
      return this.focus();
    };

    RepoView.prototype.hide = function() {
      if (this.hasParent()) {
        this.detach();
      }
      return atom.workspace.getActivePane().activate();
    };

    RepoView.prototype.destroy = function() {
      var _ref2;
      if ((_ref2 = this.subscriptions) != null) {
        _ref2.dispose();
      }
      return this.detach();
    };

    return RepoView;

  })(View);

  module.exports = RepoView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9hdG9tYXRpZ2l0L2xpYi92aWV3cy9yZXBvLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBJQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBWSxPQUFBLENBQVEsc0JBQVIsQ0FBWixFQUFDLFNBQUEsQ0FBRCxFQUFJLFlBQUEsSUFBSixDQUFBOztBQUFBLEVBQ0Msc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQURELENBQUE7O0FBQUEsRUFHQyxlQUFzQyxPQUFBLENBQVEsU0FBUixFQUF0QyxZQUhELENBQUE7O0FBQUEsRUFJQSxRQUF1QyxPQUFBLENBQVEsWUFBUixDQUF2QyxFQUFDLDBCQUFBLGlCQUFELEVBQW9CLHVCQUFBLGNBSnBCLENBQUE7O0FBQUEsRUFLQyxpQkFBc0MsT0FBQSxDQUFRLFdBQVIsRUFBdEMsY0FMRCxDQUFBOztBQUFBLEVBTUEsU0FBQSxHQUF1QyxPQUFBLENBQVEsY0FBUixDQU52QyxDQUFBOztBQUFBLEVBT0EsU0FBQSxHQUF1QyxPQUFBLENBQVEsY0FBUixDQVB2QyxDQUFBOztBQUFBLEVBVU07QUFDSiwrQkFBQSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0FBQTs7QUFBQSxJQUFBLFFBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxLQUFELEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sWUFBUDtPQUFMLEVBQTBCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDeEIsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sZUFBUDtBQUFBLFlBQXdCLE1BQUEsRUFBUSxjQUFoQztXQUFMLENBQUEsQ0FBQTtBQUFBLFVB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

//# sourceURL=/home/kyan/.atom/packages/atomatigit/lib/views/repo-view.coffee
