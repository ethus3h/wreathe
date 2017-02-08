(function() {
  var DiffChunkView, DiffView, View, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  View = require('atom-space-pen-views').View;

  DiffChunkView = require('./diff-chunk-view');

  DiffView = (function(_super) {
    __extends(DiffView, _super);

    function DiffView() {
      return DiffView.__super__.constructor.apply(this, arguments);
    }

    DiffView.content = function(diff) {
      return this.div({
        "class": 'diff'
      });
    };

    DiffView.prototype.initialize = function(model) {
      var _ref;
      this.model = model;
      return _.each((_ref = this.model) != null ? _ref.chunks() : void 0, (function(_this) {
        return function(chunk) {
          return _this.append(new DiffChunkView(chunk));
        };
      })(this));
    };

    return DiffView;

  })(View);

  module.exports = DiffView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9hdG9tYXRpZ2l0L2xpYi92aWV3cy9kaWZmcy9kaWZmLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQWdCLE9BQUEsQ0FBUSxRQUFSLENBQWhCLENBQUE7O0FBQUEsRUFDQyxPQUFlLE9BQUEsQ0FBUSxzQkFBUixFQUFmLElBREQsQ0FBQTs7QUFBQSxFQUVBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLG1CQUFSLENBRmhCLENBQUE7O0FBQUEsRUFLTTtBQUNKLCtCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFFBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxJQUFELEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sTUFBUDtPQUFMLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsdUJBSUEsVUFBQSxHQUFZLFNBQUUsS0FBRixHQUFBO0FBQ1YsVUFBQSxJQUFBO0FBQUEsTUFEVyxJQUFDLENBQUEsUUFBQSxLQUNaLENBQUE7YUFBQSxDQUFDLENBQUMsSUFBRixtQ0FBYSxDQUFFLE1BQVIsQ0FBQSxVQUFQLEVBQXlCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEtBQUQsR0FBQTtpQkFBVyxLQUFDLENBQUEsTUFBRCxDQUFZLElBQUEsYUFBQSxDQUFjLEtBQWQsQ0FBWixFQUFYO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekIsRUFEVTtJQUFBLENBSlosQ0FBQTs7b0JBQUE7O0tBRHFCLEtBTHZCLENBQUE7O0FBQUEsRUFhQSxNQUFNLENBQUMsT0FBUCxHQUFpQixRQWJqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/kyan/.atom/packages/atomatigit/lib/views/diffs/diff-view.coffee
