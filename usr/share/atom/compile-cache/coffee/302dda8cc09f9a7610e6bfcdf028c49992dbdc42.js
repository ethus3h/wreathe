(function() {
  var Diff, DiffChunk, List, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  List = require('../list');

  DiffChunk = require('./diff-chunk');

  Diff = (function(_super) {
    __extends(Diff, _super);

    Diff.prototype.model = DiffChunk;

    Diff.prototype.isSublist = true;

    Diff.prototype.selectedIndex = -1;

    Diff.prototype.extractHeader = function() {
      var _ref, _ref1;
      return this.header = (_ref = this.raw) != null ? (_ref1 = _ref.match(/^(.*?\n){2}/)) != null ? _ref1[0] : void 0 : void 0;
    };

    function Diff(_arg) {
      var chunks, _ref;
      _ref = _arg != null ? _arg : {}, this.raw = _ref.raw, chunks = _ref.chunks;
      this.chunks = __bind(this.chunks, this);
      this.extractHeader = __bind(this.extractHeader, this);
      this.extractHeader();
      Diff.__super__.constructor.call(this, _.map(chunks, (function(_this) {
        return function(chunk) {
          return {
            chunk: chunk,
            header: _this.header
          };
        };
      })(this)));
      this.select(-1);
    }

    Diff.prototype.chunks = function() {
      return this.models;
    };

    return Diff;

  })(List);

  module.exports = Diff;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9hdG9tYXRpZ2l0L2xpYi9tb2RlbHMvZGlmZnMvZGlmZi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0JBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQVksT0FBQSxDQUFRLFFBQVIsQ0FBWixDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFZLE9BQUEsQ0FBUSxTQUFSLENBRFosQ0FBQTs7QUFBQSxFQUVBLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQUZaLENBQUE7O0FBQUEsRUFRTTtBQUNKLDJCQUFBLENBQUE7O0FBQUEsbUJBQUEsS0FBQSxHQUFPLFNBQVAsQ0FBQTs7QUFBQSxtQkFDQSxTQUFBLEdBQVcsSUFEWCxDQUFBOztBQUFBLG1CQUVBLGFBQUEsR0FBZSxDQUFBLENBRmYsQ0FBQTs7QUFBQSxtQkFNQSxhQUFBLEdBQWUsU0FBQSxHQUFBO0FBQ2IsVUFBQSxXQUFBO2FBQUEsSUFBQyxDQUFBLE1BQUQsa0ZBQXNDLENBQUEsQ0FBQSxvQkFEekI7SUFBQSxDQU5mLENBQUE7O0FBY2EsSUFBQSxjQUFDLElBQUQsR0FBQTtBQUNYLFVBQUEsWUFBQTtBQUFBLDRCQURZLE9BQWUsSUFBZCxJQUFDLENBQUEsV0FBQSxLQUFLLGNBQUEsTUFDbkIsQ0FBQTtBQUFBLDZDQUFBLENBQUE7QUFBQSwyREFBQSxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsYUFBRCxDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0Esc0NBQU0sQ0FBQyxDQUFDLEdBQUYsQ0FBTSxNQUFOLEVBQWMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxHQUFBO2lCQUFXO0FBQUEsWUFBQyxLQUFBLEVBQU8sS0FBUjtBQUFBLFlBQWUsTUFBQSxFQUFRLEtBQUMsQ0FBQSxNQUF4QjtZQUFYO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZCxDQUFOLENBREEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLE1BQUQsQ0FBUSxDQUFBLENBQVIsQ0FIQSxDQURXO0lBQUEsQ0FkYjs7QUFBQSxtQkF1QkEsTUFBQSxHQUFRLFNBQUEsR0FBQTthQUNOLElBQUMsQ0FBQSxPQURLO0lBQUEsQ0F2QlIsQ0FBQTs7Z0JBQUE7O0tBRGlCLEtBUm5CLENBQUE7O0FBQUEsRUFtQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsSUFuQ2pCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/kyan/.atom/packages/atomatigit/lib/models/diffs/diff.coffee
