(function() {
  var Collection, List,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Collection = require('backbone').Collection;

  List = (function(_super) {
    __extends(List, _super);

    function List() {
      this.previous = __bind(this.previous, this);
      this.next = __bind(this.next, this);
      this.select = __bind(this.select, this);
      this.selection = __bind(this.selection, this);
      this.leaf = __bind(this.leaf, this);
      return List.__super__.constructor.apply(this, arguments);
    }

    List.prototype.selectedIndex = 0;

    List.prototype.isSublist = false;

    List.prototype.initialize = function() {
      return this.on('update', this.reload);
    };

    List.prototype.leaf = function() {
      var _ref;
      return (_ref = this.selection()) != null ? _ref.leaf() : void 0;
    };

    List.prototype.selection = function() {
      return this.at(this.selectedIndex);
    };

    List.prototype.select = function(i) {
      var oldSelection, _ref;
      oldSelection = this.selectedIndex;
      if (this.selection()) {
        this.selection().deselect();
      }
      if (this.isSublist && i < 0) {
        this.selectedIndex = -1;
        return false;
      }
      this.selectedIndex = Math.max(Math.min(i, this.length - 1), 0);
      if ((_ref = this.selection()) != null) {
        _ref.select();
      }
      return this.selectedIndex !== oldSelection;
    };

    List.prototype.next = function() {
      if (this.selection() && !this.selection().allowNext()) {
        return false;
      }
      return this.select(this.selectedIndex + 1);
    };

    List.prototype.previous = function() {
      if (this.selection() && !this.selection().allowPrevious()) {
        return false;
      }
      return this.select(this.selectedIndex - 1);
    };

    List.prototype.reload = function() {};

    return List;

  })(Collection);

  module.exports = List;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9hdG9tYXRpZ2l0L2xpYi9tb2RlbHMvbGlzdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0JBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxVQUFSLEVBQWQsVUFBRCxDQUFBOztBQUFBLEVBS007QUFDSiwyQkFBQSxDQUFBOzs7Ozs7Ozs7S0FBQTs7QUFBQSxtQkFBQSxhQUFBLEdBQWUsQ0FBZixDQUFBOztBQUFBLG1CQUNBLFNBQUEsR0FBVyxLQURYLENBQUE7O0FBQUEsbUJBSUEsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUNWLElBQUMsQ0FBQSxFQUFELENBQUksUUFBSixFQUFjLElBQUMsQ0FBQSxNQUFmLEVBRFU7SUFBQSxDQUpaLENBQUE7O0FBQUEsbUJBVUEsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLFVBQUEsSUFBQTtxREFBWSxDQUFFLElBQWQsQ0FBQSxXQURJO0lBQUEsQ0FWTixDQUFBOztBQUFBLG1CQWdCQSxTQUFBLEdBQVcsU0FBQSxHQUFBO2FBQ1QsSUFBQyxDQUFBLEVBQUQsQ0FBSSxJQUFDLENBQUEsYUFBTCxFQURTO0lBQUEsQ0FoQlgsQ0FBQTs7QUFBQSxtQkFzQkEsTUFBQSxHQUFRLFNBQUMsQ0FBRCxHQUFBO0FBQ04sVUFBQSxrQkFBQTtBQUFBLE1BQUEsWUFBQSxHQUFlLElBQUMsQ0FBQSxhQUFoQixDQUFBO0FBQ0EsTUFBQSxJQUEyQixJQUFDLENBQUEsU0FBRCxDQUFBLENBQTNCO0FBQUEsUUFBQSxJQUFDLENBQUEsU0FBRCxDQUFBLENBQVksQ0FBQyxRQUFiLENBQUEsQ0FBQSxDQUFBO09BREE7QUFHQSxNQUFBLElBQUcsSUFBQyxDQUFBLFNBQUQsSUFBZSxDQUFBLEdBQUksQ0FBdEI7QUFDRSxRQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLENBQUEsQ0FBakIsQ0FBQTtBQUNBLGVBQU8sS0FBUCxDQUZGO09BSEE7QUFBQSxNQU9BLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksSUFBQyxDQUFBLE1BQUQsR0FBVSxDQUF0QixDQUFULEVBQW1DLENBQW5DLENBUGpCLENBQUE7O1lBUVksQ0FBRSxNQUFkLENBQUE7T0FSQTthQVVBLElBQUMsQ0FBQSxhQUFELEtBQW9CLGFBWGQ7SUFBQSxDQXRCUixDQUFBOztBQUFBLG1CQW9DQSxJQUFBLEdBQU0sU0FBQSxHQUFBO0FBQ0osTUFBQSxJQUFnQixJQUFDLENBQUEsU0FBRCxDQUFBLENBQUEsSUFBaUIsQ0FBQSxJQUFLLENBQUEsU0FBRCxDQUFBLENBQVksQ0FBQyxTQUFiLENBQUEsQ0FBckM7QUFBQSxlQUFPLEtBQVAsQ0FBQTtPQUFBO2FBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBUyxJQUFDLENBQUEsYUFBRCxHQUFpQixDQUExQixFQUZJO0lBQUEsQ0FwQ04sQ0FBQTs7QUFBQSxtQkF5Q0EsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBZ0IsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUFBLElBQWlCLENBQUEsSUFBSyxDQUFBLFNBQUQsQ0FBQSxDQUFZLENBQUMsYUFBYixDQUFBLENBQXJDO0FBQUEsZUFBTyxLQUFQLENBQUE7T0FBQTthQUNBLElBQUMsQ0FBQSxNQUFELENBQVEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsQ0FBekIsRUFGUTtJQUFBLENBekNWLENBQUE7O0FBQUEsbUJBOENBLE1BQUEsR0FBUSxTQUFBLEdBQUEsQ0E5Q1IsQ0FBQTs7Z0JBQUE7O0tBRGlCLFdBTG5CLENBQUE7O0FBQUEsRUFzREEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsSUF0RGpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/kyan/.atom/packages/atomatigit/lib/models/list.coffee
