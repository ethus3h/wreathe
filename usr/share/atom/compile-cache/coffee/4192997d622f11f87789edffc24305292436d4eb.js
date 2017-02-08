(function() {
  var FileListView, FileView, View, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  View = require('atom-space-pen-views').View;

  FileView = require('./file-view');

  FileListView = (function(_super) {
    __extends(FileListView, _super);

    function FileListView() {
      this.repaint = __bind(this.repaint, this);
      this.repopulateStaged = __bind(this.repopulateStaged, this);
      this.repopulateUnstaged = __bind(this.repopulateUnstaged, this);
      this.repopulateUntracked = __bind(this.repopulateUntracked, this);
      this.detached = __bind(this.detached, this);
      this.attached = __bind(this.attached, this);
      return FileListView.__super__.constructor.apply(this, arguments);
    }

    FileListView.content = function() {
      return this.div({
        "class": 'file-list-view list-view',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.h2({
            outlet: 'untrackedHeader'
          }, 'untracked:');
          _this.div({
            "class": 'untracked',
            outlet: 'untracked'
          });
          _this.h2({
            outlet: 'unstagedHeader'
          }, 'unstaged:');
          _this.div({
            "class": 'unstaged',
            outlet: 'unstaged'
          });
          _this.h2({
            outlet: 'stagedHeader'
          }, 'staged:');
          return _this.div({
            "class": 'staged',
            outlet: 'staged'
          });
        };
      })(this));
    };

    FileListView.prototype.initialize = function(model) {
      this.model = model;
    };

    FileListView.prototype.attached = function() {
      return this.model.on('repaint', this.repaint);
    };

    FileListView.prototype.detached = function() {
      return this.model.off('repaint', this.repaint);
    };

    FileListView.prototype.repopulateUntracked = function() {
      this.untracked.empty();
      return _.each(this.model.untracked(), (function(_this) {
        return function(file) {
          return _this.untracked.append(new FileView(file));
        };
      })(this));
    };

    FileListView.prototype.repopulateUnstaged = function() {
      this.unstaged.empty();
      return _.each(this.model.unstaged(), (function(_this) {
        return function(file) {
          return _this.unstaged.append(new FileView(file));
        };
      })(this));
    };

    FileListView.prototype.repopulateStaged = function() {
      this.staged.empty();
      return _.each(this.model.staged(), (function(_this) {
        return function(file) {
          return _this.staged.append(new FileView(file));
        };
      })(this));
    };

    FileListView.prototype.repaint = function() {
      this.repopulateUntracked();
      this.repopulateUnstaged();
      return this.repopulateStaged();
    };

    return FileListView;

  })(View);

  module.exports = FileListView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9hdG9tYXRpZ2l0L2xpYi92aWV3cy9maWxlcy9maWxlLWxpc3Qtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsK0JBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVIsQ0FBVCxDQUFBOztBQUFBLEVBQ0MsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQURELENBQUE7O0FBQUEsRUFHQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FIWCxDQUFBOztBQUFBLEVBT007QUFDSixtQ0FBQSxDQUFBOzs7Ozs7Ozs7O0tBQUE7O0FBQUEsSUFBQSxZQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTywwQkFBUDtBQUFBLFFBQW1DLFFBQUEsRUFBVSxDQUFBLENBQTdDO09BQUwsRUFBc0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNwRCxVQUFBLEtBQUMsQ0FBQSxFQUFELENBQUk7QUFBQSxZQUFBLE1BQUEsRUFBUSxpQkFBUjtXQUFKLEVBQStCLFlBQS9CLENBQUEsQ0FBQTtBQUFBLFVBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLFdBQVA7QUFBQSxZQUFvQixNQUFBLEVBQVEsV0FBNUI7V0FBTCxDQURBLENBQUE7QUFBQSxVQUVBLEtBQUMsQ0FBQSxFQUFELENBQUk7QUFBQSxZQUFBLE1BQUEsRUFBUSxnQkFBUjtXQUFKLEVBQThCLFdBQTlCLENBRkEsQ0FBQTtBQUFBLFVBR0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLFVBQVA7QUFBQSxZQUFtQixNQUFB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

//# sourceURL=/home/kyan/.atom/packages/atomatigit/lib/views/files/file-list-view.coffee
