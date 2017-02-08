(function() {
  var ListItem, Model,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('backbone').Model;

  ListItem = (function(_super) {
    __extends(ListItem, _super);

    function ListItem() {
      this.leaf = __bind(this.leaf, this);
      this.allowNext = __bind(this.allowNext, this);
      this.allowPrevious = __bind(this.allowPrevious, this);
      this.isSelected = __bind(this.isSelected, this);
      this.deselect = __bind(this.deselect, this);
      this.select = __bind(this.select, this);
      this.selfSelect = __bind(this.selfSelect, this);
      return ListItem.__super__.constructor.apply(this, arguments);
    }

    ListItem.prototype.selfSelect = function() {
      if (this.collection) {
        return this.collection.select(this.collection.indexOf(this));
      } else {
        return this.select();
      }
    };

    ListItem.prototype.select = function() {
      return this.set({
        selected: true
      });
    };

    ListItem.prototype.deselect = function() {
      return this.set({
        selected: false
      });
    };

    ListItem.prototype.isSelected = function() {
      return this.get('selected');
    };

    ListItem.prototype.allowPrevious = function() {
      var _ref;
      if (this.useSublist()) {
        return !((_ref = this.sublist) != null ? _ref.previous() : void 0);
      } else {
        return true;
      }
    };

    ListItem.prototype.allowNext = function() {
      var _ref;
      if (this.useSublist()) {
        return !((_ref = this.sublist) != null ? _ref.next() : void 0);
      } else {
        return true;
      }
    };

    ListItem.prototype.leaf = function() {
      if (this.useSublist()) {
        return this.sublist.leaf() || this;
      } else {
        return this;
      }
    };

    ListItem.prototype.useSublist = function() {
      return false;
    };

    return ListItem;

  })(Model);

  module.exports = ListItem;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9hdG9tYXRpZ2l0L2xpYi9tb2RlbHMvbGlzdC1pdGVtLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxlQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsUUFBUyxPQUFBLENBQVEsVUFBUixFQUFULEtBQUQsQ0FBQTs7QUFBQSxFQU1NO0FBS0osK0JBQUEsQ0FBQTs7Ozs7Ozs7Ozs7S0FBQTs7QUFBQSx1QkFBQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxJQUFHLElBQUMsQ0FBQSxVQUFKO2VBQ0UsSUFBQyxDQUFBLFVBQVUsQ0FBQyxNQUFaLENBQW1CLElBQUMsQ0FBQSxVQUFVLENBQUMsT0FBWixDQUFvQixJQUFwQixDQUFuQixFQURGO09BQUEsTUFBQTtlQUdFLElBQUMsQ0FBQSxNQUFELENBQUEsRUFIRjtPQURVO0lBQUEsQ0FBWixDQUFBOztBQUFBLHVCQU9BLE1BQUEsR0FBUSxTQUFBLEdBQUE7YUFDTixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxRQUFBLEVBQVUsSUFBVjtPQUFMLEVBRE07SUFBQSxDQVBSLENBQUE7O0FBQUEsdUJBV0EsUUFBQSxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLFFBQUEsRUFBVSxLQUFWO09BQUwsRUFEUTtJQUFBLENBWFYsQ0FBQTs7QUFBQSx1QkFpQkEsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUNWLElBQUMsQ0FBQSxHQUFELENBQUssVUFBTCxFQURVO0lBQUEsQ0FqQlosQ0FBQTs7QUFBQSx1QkF1QkEsYUFBQSxHQUFlLFNBQUEsR0FBQTtBQUNiLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBRyxJQUFDLENBQUEsVUFBRCxDQUFBLENBQUg7ZUFDRSxDQUFBLHFDQUFZLENBQUUsUUFBVixDQUFBLFlBRE47T0FBQSxNQUFBO2VBR0UsS0FIRjtPQURhO0lBQUEsQ0F2QmYsQ0FBQTs7QUFBQSx1QkFnQ0EsU0FBQSxHQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBRyxJQUFDLENBQUEsVUFBRCxDQUFBLENBQUg7ZUFDRSxDQUFBLHFDQUFZLENBQUUsSUFBVixDQUFBLFlBRE47T0FBQSxNQUFBO2VBR0UsS0FIRjtPQURTO0lBQUEsQ0FoQ1gsQ0FBQTs7QUFBQSx1QkF5Q0EsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLE1BQUEsSUFBRyxJQUFDLENBQUEsVUFBRCxDQUFBLENBQUg7ZUFDRSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBQSxDQUFBLElBQW1CLEtBRHJCO09BQUEsTUFBQTtlQUdFLEtBSEY7T0FESTtJQUFBLENBekNOLENBQUE7O0FBQUEsdUJBK0NBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFBRyxNQUFIO0lBQUEsQ0EvQ1osQ0FBQTs7b0JBQUE7O0tBTHFCLE1BTnZCLENBQUE7O0FBQUEsRUE0REEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsUUE1RGpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/kyan/.atom/packages/atomatigit/lib/models/list-item.coffee
