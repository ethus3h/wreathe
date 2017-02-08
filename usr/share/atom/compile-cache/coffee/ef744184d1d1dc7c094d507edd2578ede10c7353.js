(function() {
  var ErrorView, FileList, List, StagedFile, UnstagedFile, UntrackedFile, git, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  git = require('../../git');

  List = require('../list');

  StagedFile = require('./staged-file');

  UnstagedFile = require('./unstaged-file');

  UntrackedFile = require('./untracked-file');

  ErrorView = require('../../views/error-view');

  FileList = (function(_super) {
    __extends(FileList, _super);

    function FileList() {
      this.populateList = __bind(this.populateList, this);
      this.untracked = __bind(this.untracked, this);
      this.unstaged = __bind(this.unstaged, this);
      this.staged = __bind(this.staged, this);
      this.populate = __bind(this.populate, this);
      this.reload = __bind(this.reload, this);
      return FileList.__super__.constructor.apply(this, arguments);
    }

    FileList.prototype.reload = function(_arg) {
      var silent;
      silent = (_arg != null ? _arg : {}).silent;
      return git.status().then((function(_this) {
        return function(status) {
          return _this.populate(status, silent);
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    FileList.prototype.populate = function(status, silent) {
      var _ref;
      this.reset();
      this.populateList(status.untracked, UntrackedFile);
      this.populateList(status.unstaged, UnstagedFile);
      this.populateList(status.staged, StagedFile);
      this.select((_ref = this.selectedIndex) != null ? _ref : 0);
      if (!silent) {
        return this.trigger('repaint');
      }
    };

    FileList.prototype.staged = function() {
      return this.filter(function(file) {
        return file.isStaged();
      });
    };

    FileList.prototype.unstaged = function() {
      return this.filter(function(file) {
        return file.isUnstaged();
      });
    };

    FileList.prototype.untracked = function() {
      return this.filter(function(file) {
        return file.isUntracked();
      });
    };

    FileList.prototype.populateList = function(files, Klass) {
      return _.each(files, (function(_this) {
        return function(file) {
          return _this.add(new Klass(file));
        };
      })(this));
    };

    return FileList;

  })(List);

  module.exports = FileList;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9hdG9tYXRpZ2l0L2xpYi9tb2RlbHMvZmlsZXMvZmlsZS1saXN0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwRUFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQUFKLENBQUE7O0FBQUEsRUFFQSxHQUFBLEdBQWdCLE9BQUEsQ0FBUSxXQUFSLENBRmhCLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQWdCLE9BQUEsQ0FBUSxTQUFSLENBSGhCLENBQUE7O0FBQUEsRUFJQSxVQUFBLEdBQWdCLE9BQUEsQ0FBUSxlQUFSLENBSmhCLENBQUE7O0FBQUEsRUFLQSxZQUFBLEdBQWdCLE9BQUEsQ0FBUSxpQkFBUixDQUxoQixDQUFBOztBQUFBLEVBTUEsYUFBQSxHQUFnQixPQUFBLENBQVEsa0JBQVIsQ0FOaEIsQ0FBQTs7QUFBQSxFQU9BLFNBQUEsR0FBZ0IsT0FBQSxDQUFRLHdCQUFSLENBUGhCLENBQUE7O0FBQUEsRUFTTTtBQUVKLCtCQUFBLENBQUE7Ozs7Ozs7Ozs7S0FBQTs7QUFBQSx1QkFBQSxNQUFBLEdBQVEsU0FBQyxJQUFELEdBQUE7QUFDTixVQUFBLE1BQUE7QUFBQSxNQURRLHlCQUFELE9BQVMsSUFBUixNQUNSLENBQUE7YUFBQSxHQUFHLENBQUMsTUFBSixDQUFBLENBQ0EsQ0FBQyxJQURELENBQ00sQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsTUFBRCxHQUFBO2lCQUFZLEtBQUMsQ0FBQSxRQUFELENBQVUsTUFBVixFQUFrQixNQUFsQixFQUFaO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FETixDQUVBLENBQUMsT0FBRCxDQUZBLENBRU8sU0FBQyxLQUFELEdBQUE7ZUFBZSxJQUFBLFNBQUEsQ0FBVSxLQUFWLEVBQWY7TUFBQSxDQUZQLEVBRE07SUFBQSxDQUFSLENBQUE7O0FBQUEsdUJBUUEsUUFBQSxHQUFVLFNBQUMsTUFBRCxFQUFTLE1BQVQsR0FBQTtBQUNSLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxZQUFELENBQWMsTUFBTSxDQUFDLFNBQXJCLEVBQWdDLGFBQWhDLENBRkEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFlBQUQsQ0FBYyxNQUFNLENBQUMsUUFBckIsRUFBK0IsWUFBL0IsQ0FIQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsWUFBRCxDQUFjLE1BQU0sQ0FBQyxNQUFyQixFQUE2QixVQUE3QixDQUpBLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxNQUFELDhDQUF5QixDQUF6QixDQU5BLENBQUE7QUFPQSxNQUFBLElBQUEsQ0FBQSxNQUFBO2VBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxTQUFULEVBQUE7T0FSUTtJQUFBLENBUlYsQ0FBQTs7QUFBQSx1QkFtQkEsTUFBQSxHQUFRLFNBQUEsR0FBQTthQUNOLElBQUMsQ0FBQSxNQUFELENBQVEsU0FBQyxJQUFELEdBQUE7ZUFBVSxJQUFJLENBQUMsUUFBTCxDQUFBLEVBQVY7TUFBQSxDQUFSLEVBRE07SUFBQSxDQW5CUixDQUFBOztBQUFBLHVCQXVCQSxRQUFBLEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLE1BQUQsQ0FBUSxTQUFDLElBQUQsR0FBQTtlQUFVLElBQUksQ0FBQyxVQUFMLENBQUEsRUFBVjtNQUFBLENBQVIsRUFEUTtJQUFBLENBdkJWLENBQUE7O0FBQUEsdUJBMkJBLFNBQUEsR0FBVyxTQUFBLEdBQUE7YUFDVCxJQUFDLENBQUEsTUFBRCxDQUFRLFNBQUMsSUFBRCxHQUFBO2VBQVUsSUFBSSxDQUFDLFdBQUwsQ0FBQSxFQUFWO01BQUEsQ0FBUixFQURTO0lBQUEsQ0EzQlgsQ0FBQTs7QUFBQSx1QkFrQ0EsWUFBQSxHQUFjLFNBQUMsS0FBRCxFQUFRLEtBQVIsR0FBQTthQUNaLENBQUMsQ0FBQyxJQUFGLENBQU8sS0FBUCxFQUFjLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtpQkFBVSxLQUFDLENBQUEsR0FBRCxDQUFTLElBQUEsS0FBQSxDQUFNLElBQU4sQ0FBVCxFQUFWO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZCxFQURZO0lBQUEsQ0FsQ2QsQ0FBQTs7b0JBQUE7O0tBRnFCLEtBVHZCLENBQUE7O0FBQUEsRUFnREEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsUUFoRGpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/kyan/.atom/packages/atomatigit/lib/models/files/file-list.coffee
