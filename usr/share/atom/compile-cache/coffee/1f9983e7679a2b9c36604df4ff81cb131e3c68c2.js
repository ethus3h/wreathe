(function() {
  var DiffLineView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  DiffLineView = (function(_super) {
    __extends(DiffLineView, _super);

    function DiffLineView() {
      return DiffLineView.__super__.constructor.apply(this, arguments);
    }

    DiffLineView.content = function(line) {
      return this.div({
        "class": "diff-line " + (line.type())
      }, (function(_this) {
        return function() {
          return _this.raw(line.markup());
        };
      })(this));
    };

    DiffLineView.prototype.initialize = function(model) {
      this.model = model;
    };

    return DiffLineView;

  })(View);

  module.exports = DiffLineView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9hdG9tYXRpZ2l0L2xpYi92aWV3cy9kaWZmcy9kaWZmLWxpbmUtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0JBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLE9BQVEsT0FBQSxDQUFRLHNCQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBR007QUFDSixtQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxZQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsSUFBRCxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFRLFlBQUEsR0FBVyxDQUFDLElBQUksQ0FBQyxJQUFMLENBQUEsQ0FBRCxDQUFuQjtPQUFMLEVBQXdDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ3RDLEtBQUMsQ0FBQSxHQUFELENBQUssSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUFMLEVBRHNDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEMsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSwyQkFLQSxVQUFBLEdBQVksU0FBRSxLQUFGLEdBQUE7QUFBWSxNQUFYLElBQUMsQ0FBQSxRQUFBLEtBQVUsQ0FBWjtJQUFBLENBTFosQ0FBQTs7d0JBQUE7O0tBRHlCLEtBSDNCLENBQUE7O0FBQUEsRUFXQSxNQUFNLENBQUMsT0FBUCxHQUFpQixZQVhqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/kyan/.atom/packages/atomatigit/lib/views/diffs/diff-line-view.coffee
