(function() {
  var DiffLine, Model, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  Model = require('backbone').Model;

  DiffLine = (function(_super) {
    __extends(DiffLine, _super);

    function DiffLine() {
      this.markup = __bind(this.markup, this);
      this.repo = __bind(this.repo, this);
      this.type = __bind(this.type, this);
      this.line = __bind(this.line, this);
      return DiffLine.__super__.constructor.apply(this, arguments);
    }

    DiffLine.prototype.line = function() {
      return this.get('line');
    };

    DiffLine.prototype.type = function() {
      if (this.line().match(/^\+/)) {
        return 'addition';
      } else if (this.line().match(/^\-/)) {
        return 'subtraction';
      } else {
        return 'context';
      }
    };

    DiffLine.prototype.repo = function() {
      return this.get('repo');
    };

    DiffLine.prototype.markup = function() {
      return this.escapeHTML(this.line());
    };

    DiffLine.prototype.escapeHTML = function(string) {
      var entityMap;
      entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        ' ': '&nbsp;'
      };
      if (_.isString(string)) {
        return string.replace(/[&<>"'\/ ]/g, function(s) {
          return entityMap[s];
        });
      } else {
        return string;
      }
    };

    return DiffLine;

  })(Model);

  module.exports = DiffLine;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9hdG9tYXRpZ2l0L2xpYi9tb2RlbHMvZGlmZnMvZGlmZi1saW5lLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrQkFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLENBQUEsR0FBVSxPQUFBLENBQVEsUUFBUixDQUFWLENBQUE7O0FBQUEsRUFDQyxRQUFTLE9BQUEsQ0FBUSxVQUFSLEVBQVQsS0FERCxDQUFBOztBQUFBLEVBUU07QUFJSiwrQkFBQSxDQUFBOzs7Ozs7OztLQUFBOztBQUFBLHVCQUFBLElBQUEsR0FBTSxTQUFBLEdBQUE7YUFDSixJQUFDLENBQUEsR0FBRCxDQUFLLE1BQUwsRUFESTtJQUFBLENBQU4sQ0FBQTs7QUFBQSx1QkFTQSxJQUFBLEdBQU0sU0FBQSxHQUFBO0FBQ0osTUFBQSxJQUFHLElBQUMsQ0FBQSxJQUFELENBQUEsQ0FBTyxDQUFDLEtBQVIsQ0FBYyxLQUFkLENBQUg7ZUFDRSxXQURGO09BQUEsTUFFSyxJQUFHLElBQUMsQ0FBQSxJQUFELENBQUEsQ0FBTyxDQUFDLEtBQVIsQ0FBYyxLQUFkLENBQUg7ZUFDSCxjQURHO09BQUEsTUFBQTtlQUdILFVBSEc7T0FIRDtJQUFBLENBVE4sQ0FBQTs7QUFBQSx1QkFvQkEsSUFBQSxHQUFNLFNBQUEsR0FBQTthQUNKLElBQUMsQ0FBQSxHQUFELENBQUssTUFBTCxFQURJO0lBQUEsQ0FwQk4sQ0FBQTs7QUFBQSx1QkEwQkEsTUFBQSxHQUFRLFNBQUEsR0FBQTthQUNOLElBQUMsQ0FBQSxVQUFELENBQVksSUFBQyxDQUFBLElBQUQsQ0FBQSxDQUFaLEVBRE07SUFBQSxDQTFCUixDQUFBOztBQUFBLHVCQWtDQSxVQUFBLEdBQVksU0FBQyxNQUFELEdBQUE7QUFDVixVQUFBLFNBQUE7QUFBQSxNQUFBLFNBQUEsR0FDRTtBQUFBLFFBQUEsR0FBQSxFQUFLLE9BQUw7QUFBQSxRQUNBLEdBQUEsRUFBSyxNQURMO0FBQUEsUUFFQSxHQUFBLEVBQUssTUFGTDtBQUFBLFFBR0EsR0FBQSxFQUFLLFFBSEw7QUFBQSxRQUlBLEdBQUEsRUFBSyxPQUpMO0FBQUEsUUFLQSxHQUFBLEVBQUssUUFMTDtBQUFBLFFBTUEsR0FBQSxFQUFLLFFBTkw7T0FERixDQUFBO0FBUUEsTUFBQSxJQUFHLENBQUMsQ0FBQyxRQUFGLENBQVcsTUFBWCxDQUFIO2VBQ0UsTUFBTSxDQUFDLE9BQVAsQ0FBZSxhQUFmLEVBQThCLFNBQUMsQ0FBRCxHQUFBO2lCQUFPLFNBQVUsQ0FBQSxDQUFBLEVBQWpCO1FBQUEsQ0FBOUIsRUFERjtPQUFBLE1BQUE7ZUFHRSxPQUhGO09BVFU7SUFBQSxDQWxDWixDQUFBOztvQkFBQTs7S0FKcUIsTUFSdkIsQ0FBQTs7QUFBQSxFQTREQSxNQUFNLENBQUMsT0FBUCxHQUFpQixRQTVEakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/kyan/.atom/packages/atomatigit/lib/models/diffs/diff-line.coffee
