(function() {
  var $$, DiffView, FileView, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, View = _ref.View;

  DiffView = require('../diffs/diff-view');

  FileView = (function(_super) {
    __extends(FileView, _super);

    function FileView() {
      this.showDiff = __bind(this.showDiff, this);
      this.showSelection = __bind(this.showSelection, this);
      this.clicked = __bind(this.clicked, this);
      this.detached = __bind(this.detached, this);
      this.attached = __bind(this.attached, this);
      return FileView.__super__.constructor.apply(this, arguments);
    }

    FileView.content = function(file) {
      return this.div({
        "class": 'file',
        mousedown: 'clicked'
      }, (function(_this) {
        return function() {
          _this.span({
            "class": 'mode'
          }, file.getMode());
          return _this.span({
            "class": 'path'
          }, file.path());
        };
      })(this));
    };

    FileView.prototype.initialize = function(model) {
      this.model = model;
      this.showSelection();
      return this.showDiff();
    };

    FileView.prototype.attached = function() {
      this.model.on('change:selected', this.showSelection);
      return this.model.on('change:diff', this.showDiff);
    };

    FileView.prototype.detached = function() {
      this.model.off('change:selected', this.showSelection);
      return this.model.off('change:diff', this.showDiff);
    };

    FileView.prototype.clicked = function() {
      return this.model.selfSelect();
    };

    FileView.prototype.showSelection = function() {
      return this.toggleClass('selected', this.model.isSelected());
    };

    FileView.prototype.showDiff = function() {
      this.find('.diff').remove();
      if (this.model.showDiffP()) {
        return this.append(new DiffView(this.model.diff()));
      }
    };

    return FileView;

  })(View);

  module.exports = FileView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9hdG9tYXRpZ2l0L2xpYi92aWV3cy9maWxlcy9maWxlLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtDQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBYSxPQUFBLENBQVEsc0JBQVIsQ0FBYixFQUFDLFVBQUEsRUFBRCxFQUFLLFlBQUEsSUFBTCxDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxvQkFBUixDQURYLENBQUE7O0FBQUEsRUFJTTtBQUNKLCtCQUFBLENBQUE7Ozs7Ozs7OztLQUFBOztBQUFBLElBQUEsUUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLElBQUQsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxNQUFQO0FBQUEsUUFBZSxTQUFBLEVBQVcsU0FBMUI7T0FBTCxFQUEwQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3hDLFVBQUEsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLFlBQUEsT0FBQSxFQUFPLE1BQVA7V0FBTixFQUFxQixJQUFJLENBQUMsT0FBTCxDQUFBLENBQXJCLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsWUFBQSxPQUFBLEVBQU8sTUFBUDtXQUFOLEVBQXFCLElBQUksQ0FBQyxJQUFMLENBQUEsQ0FBckIsRUFGd0M7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExQyxFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLHVCQU1BLFVBQUEsR0FBWSxTQUFFLEtBQUYsR0FBQTtBQUNWLE1BRFcsSUFBQyxDQUFBLFFBQUEsS0FDWixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsYUFBRCxDQUFBLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxRQUFELENBQUEsRUFGVTtJQUFBLENBTlosQ0FBQTs7QUFBQSx1QkFXQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsS0FBSyxDQUFDLEVBQVAsQ0FBVSxpQkFBVixFQUE2QixJQUFDLENBQUEsYUFBOUIsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxFQUFQLENBQVUsYUFBVixFQUF5QixJQUFDLENBQUEsUUFBMUIsRUFGUTtJQUFBLENBWFYsQ0FBQTs7QUFBQSx1QkFnQkEsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxHQUFQLENBQVcsaUJBQVgsRUFBOEIsSUFBQyxDQUFBLGFBQS9CLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxLQUFLLENBQUMsR0FBUCxDQUFXLGFBQVgsRUFBMEIsSUFBQyxDQUFBLFFBQTNCLEVBRlE7SUFBQSxDQWhCVixDQUFBOztBQUFBLHVCQXFCQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQ1AsSUFBQyxDQUFBLEtBQUssQ0FBQyxVQUFQLENBQUEsRUFETztJQUFBLENBckJULENBQUE7O0FBQUEsdUJBeUJBLGFBQUEsR0FBZSxTQUFBLEdBQUE7YUFDYixJQUFDLENBQUEsV0FBRCxDQUFhLFVBQWIsRUFBeUIsSUFBQyxDQUFBLEtBQUssQ0FBQyxVQUFQLENBQUEsQ0FBekIsRUFEYTtJQUFBLENBekJmLENBQUE7O0FBQUEsdUJBNkJBLFFBQUEsR0FBVSxTQUFBLEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxJQUFELENBQU0sT0FBTixDQUFjLENBQUMsTUFBZixDQUFBLENBQUEsQ0FBQTtBQUNBLE1BQUEsSUFBdUMsSUFBQyxDQUFBLEtBQUssQ0FBQyxTQUFQLENBQUEsQ0FBdkM7ZUFBQSxJQUFDLENBQUEsTUFBRCxDQUFZLElBQUEsUUFBQSxDQUFTLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBLENBQVQsQ0FBWixFQUFBO09BRlE7SUFBQSxDQTdCVixDQUFBOztvQkFBQTs7S0FEcUIsS0FKdkIsQ0FBQTs7QUFBQSxFQXNDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixRQXRDakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/kyan/.atom/packages/atomatigit/lib/views/files/file-view.coffee
