(function() {
  var DiffChunk, DiffLine, ErrorView, ListItem, fs, git, path, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  fs = require('fs');

  path = require('path');

  git = require('../../git');

  DiffLine = require('./diff-line');

  ListItem = require('../list-item');

  ErrorView = require('../../views/error-view');

  DiffChunk = (function(_super) {
    __extends(DiffChunk, _super);

    function DiffChunk() {
      this.unstage = __bind(this.unstage, this);
      this.stage = __bind(this.stage, this);
      this.kill = __bind(this.kill, this);
      this.patch = __bind(this.patch, this);
      return DiffChunk.__super__.constructor.apply(this, arguments);
    }

    DiffChunk.prototype.initialize = function(_arg) {
      var chunk, _ref;
      _ref = _arg != null ? _arg : {}, this.header = _ref.header, chunk = _ref.chunk;
      return this.lines = _.map(this.splitIntoLines(chunk.trim()), function(line) {
        return new DiffLine({
          line: line
        });
      });
    };

    DiffChunk.prototype.splitIntoLines = function(chunk) {
      return chunk.split(/\n/g);
    };

    DiffChunk.prototype.patch = function() {
      return this.get('header') + this.get('chunk') + '\n';
    };

    DiffChunk.prototype.kill = function() {
      fs.writeFileSync(this.patchPath(), this.patch());
      return git.cmd("apply --reverse '" + (this.patchPath()) + "'").then((function(_this) {
        return function() {
          return _this.trigger('update');
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    DiffChunk.prototype.stage = function() {
      fs.writeFileSync(this.patchPath(), this.patch());
      return git.cmd("apply --cached '" + (this.patchPath()) + "'").then((function(_this) {
        return function() {
          return _this.trigger('update');
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    DiffChunk.prototype.unstage = function() {
      fs.writeFileSync(this.patchPath(), this.patch());
      return git.cmd("apply --cached --reverse '" + (this.patchPath()) + "'").then((function(_this) {
        return function() {
          return _this.trigger('update');
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    DiffChunk.prototype.patchPath = function() {
      var _ref;
      return path.join((_ref = atom.project.getRepositories()[0]) != null ? _ref.getWorkingDirectory() : void 0, '.git/atomatigit_diff_patch');
    };

    return DiffChunk;

  })(ListItem);

  module.exports = DiffChunk;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9hdG9tYXRpZ2l0L2xpYi9tb2RlbHMvZGlmZnMvZGlmZi1jaHVuay5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMERBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFPLE9BQUEsQ0FBUSxJQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFJQSxHQUFBLEdBQVksT0FBQSxDQUFRLFdBQVIsQ0FKWixDQUFBOztBQUFBLEVBS0EsUUFBQSxHQUFZLE9BQUEsQ0FBUSxhQUFSLENBTFosQ0FBQTs7QUFBQSxFQU1BLFFBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQU5aLENBQUE7O0FBQUEsRUFPQSxTQUFBLEdBQVksT0FBQSxDQUFRLHdCQUFSLENBUFosQ0FBQTs7QUFBQSxFQWFNO0FBTUosZ0NBQUEsQ0FBQTs7Ozs7Ozs7S0FBQTs7QUFBQSx3QkFBQSxVQUFBLEdBQVksU0FBQyxJQUFELEdBQUE7QUFDVixVQUFBLFdBQUE7QUFBQSw0QkFEVyxPQUFpQixJQUFoQixJQUFDLENBQUEsY0FBQSxRQUFRLGFBQUEsS0FDckIsQ0FBQTthQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsQ0FBQyxDQUFDLEdBQUYsQ0FBTSxJQUFDLENBQUEsY0FBRCxDQUFnQixLQUFLLENBQUMsSUFBTixDQUFBLENBQWhCLENBQU4sRUFBcUMsU0FBQyxJQUFELEdBQUE7ZUFDeEMsSUFBQSxRQUFBLENBQVM7QUFBQSxVQUFBLElBQUEsRUFBTSxJQUFOO1NBQVQsRUFEd0M7TUFBQSxDQUFyQyxFQURDO0lBQUEsQ0FBWixDQUFBOztBQUFBLHdC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

//# sourceURL=/home/kyan/.atom/packages/atomatigit/lib/models/diffs/diff-chunk.coffee
