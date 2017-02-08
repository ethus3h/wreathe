(function() {
  var $$, OpenInAppView, SelectListView, exec, ref, spawn,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  exec = require('child_process').exec;

  spawn = require('child_process').spawn;

  module.exports = OpenInAppView = (function(superClass) {
    extend(OpenInAppView, superClass);

    function OpenInAppView() {
      this.confirmed = bind(this.confirmed, this);
      return OpenInAppView.__super__.constructor.apply(this, arguments);
    }

    OpenInAppView.prototype.path = null;

    OpenInAppView.prototype.open = null;

    OpenInAppView.prototype.activate = function() {
      return new OpenInAppView;
    };

    OpenInAppView.prototype.initialize = function(serializeState) {
      OpenInAppView.__super__.initialize.apply(this, arguments);
      return this.addClass('open-in');
    };

    OpenInAppView.prototype.cancelled = function() {
      return this.hide();
    };

    OpenInAppView.prototype.serialize = function() {};

    OpenInAppView.prototype.destroy = function() {
      return this.detach();
    };

    OpenInAppView.prototype.show = function() {
      var apps;
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.storeFocusedElement();
      apps = atom.config.get('open-file-in.applications').split(',');
      this.setItems(apps);
      return this.focusFilterEditor();
    };

    OpenInAppView.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.hide() : void 0;
    };

    OpenInAppView.prototype.toggle = function() {
      var ref1;
      if ((ref1 = this.panel) != null ? ref1.isVisible() : void 0) {
        return this.cancel();
      } else {
        return this.show();
      }
    };

    OpenInAppView.prototype.viewForItem = function(app) {
      return $$(function() {
        return this.li({
          "class": 'open-in-item'
        }, app);
      });
    };

    OpenInAppView.prototype.confirmed = function(app) {
      var open;
      this.cancel();
      atom.workspace.observeTextEditors(function(editor) {
        return this.path = atom.workspace.getActiveTextEditor().getPath();
      });
      switch (process.platform) {
        case 'darwin':
          open = spawn('/usr/bin/open', ['-a', app, path]);
          break;
        case 'win32':
          if (typeof path !== "undefined" && path !== null) {
            open = exec(app + " " + path);
          }
          break;
        case 'linux':
          if (typeof path !== "undefined" && path !== null) {
            open = exec(app + " " + path);
          }
      }
      return open.stderr.on('data', function(data) {
        return console.warn("Unable to find application " + app);
      });
    };

    return OpenInAppView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2xpYnJhcnkvRW1iZXIgc2F0ZWxsaXRlIHByb2plY3RzL3dyZWF0aGUvdXNyL3NoYXJlL2F0b20vcGFja2FnZXMvb3Blbi1maWxlLWluL2xpYi9vcGVuLWluLWFwcC12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsbURBQUE7SUFBQTs7OztFQUFBLE1BQXVCLE9BQUEsQ0FBUSxzQkFBUixDQUF2QixFQUFDLFdBQUQsRUFBSzs7RUFFSixPQUFRLE9BQUEsQ0FBUSxlQUFSOztFQUNSLFFBQVMsT0FBQSxDQUFRLGVBQVI7O0VBRVYsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7Ozs7NEJBQ0osSUFBQSxHQUFNOzs0QkFDTixJQUFBLEdBQU07OzRCQUVOLFFBQUEsR0FBVSxTQUFBO2FBQ1IsSUFBSTtJQURJOzs0QkFHVixVQUFBLEdBQVksU0FBQyxjQUFEO01BQ1YsK0NBQUEsU0FBQTthQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsU0FBVjtJQUZVOzs0QkFJWixTQUFBLEdBQVcsU0FBQTthQUNULElBQUMsQ0FBQSxJQUFELENBQUE7SUFEUzs7NEJBR1gsU0FBQSxHQUFXLFNBQUEsR0FBQTs7NEJBRVgsT0FBQSxHQUFTLFNBQUE7YUFBRyxJQUFDLENBQUEsTUFBRCxDQUFBO0lBQUg7OzRCQUVULElBQUEsR0FBTSxTQUFBO0FBQ0osVUFBQTs7UUFBQSxJQUFDLENBQUEsUUFBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7VUFBQSxJQUFBLEVBQU0sSUFBTjtTQUE3Qjs7TUFDVixJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQTtNQUVBLElBQUMsQ0FBQSxtQkFBRCxDQUFBO01BRUEsSUFBQSxHQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwyQkFBaEIsQ0FBNEMsQ0FBQyxLQUE3QyxDQUFtRCxHQUFuRDtNQUNQLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBVjthQUVBLElBQUMsQ0FBQSxpQkFBRCxDQUFBO0lBVEk7OzRCQVdOLElBQUEsR0FBTSxTQUFBO0FBQ0osVUFBQTsrQ0FBTSxDQUFFLElBQVIsQ0FBQTtJQURJOzs0QkFHTixNQUFBLEdBQVEsU0FBQTtBQUNOLFVBQUE7TUFBQSxzQ0FBUyxDQUFFLFNBQVIsQ0FBQSxVQUFIO2VBQ0UsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQURGO09BQUEsTUFBQTtlQUdFLElBQUMsQ0FBQSxJQUFELENBQUEsRUFIRjs7SUFETTs7NEJBTVIsV0FBQSxHQUFhLFNBQUMsR0FBRDthQUNYLEVBQUEsQ0FBRyxTQUFBO2VBQ0QsSUFBQyxDQUFBLEVBQUQsQ0FBSTtVQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sY0FBUDtTQUFKLEVBQTJCLEdBQTNCO01BREMsQ0FBSDtJQURXOzs0QkFJYixTQUFBLEdBQVcsU0FBQyxHQUFEO0FBQ1QsVUFBQTtNQUFBLElBQUMsQ0FBQSxNQUFELENBQUE7TUFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLFNBQUMsTUFBRDtlQUNoQyxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFvQyxDQUFDLE9BQXJDLENBQUE7TUFEd0IsQ0FBbEM7QUFHQSxjQUFPLE9BQU8sQ0FBQyxRQUFmO0FBQUEsYUFDTyxRQURQO1VBQ3FCLElBQUEsR0FBTyxLQUFBLENBQU0sZUFBTixFQUF1QixDQUFDLElBQUQsRUFBTyxHQUFQLEVBQVksSUFBWixDQUF2QjtBQUFyQjtBQURQLGFBRU8sT0FGUDtVQUVxQixJQUFnQyw0Q0FBaEM7WUFBQSxJQUFBLEdBQU8sSUFBQSxDQUFRLEdBQUQsR0FBSyxHQUFMLEdBQVEsSUFBZixFQUFQOztBQUFkO0FBRlAsYUFHTyxPQUhQO1VBR3FCLElBQWdDLDRDQUFoQztZQUFBLElBQUEsR0FBTyxJQUFBLENBQVEsR0FBRCxHQUFLLEdBQUwsR0FBUSxJQUFmLEVBQVA7O0FBSHJCO2FBS0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFaLENBQWUsTUFBZixFQUF1QixTQUFDLElBQUQ7ZUFDckIsT0FBTyxDQUFDLElBQVIsQ0FBYSw2QkFBQSxHQUE4QixHQUEzQztNQURxQixDQUF2QjtJQVZTOzs7O0tBMUNlO0FBTjVCIiwic291cmNlc0NvbnRlbnQiOlsieyQkLCBTZWxlY3RMaXN0Vmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxue2V4ZWN9ID0gcmVxdWlyZSAnY2hpbGRfcHJvY2VzcydcbntzcGF3bn0gPSByZXF1aXJlICdjaGlsZF9wcm9jZXNzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBPcGVuSW5BcHBWaWV3IGV4dGVuZHMgU2VsZWN0TGlzdFZpZXdcbiAgcGF0aDogbnVsbFxuICBvcGVuOiBudWxsXG5cbiAgYWN0aXZhdGU6IC0+XG4gICAgbmV3IE9wZW5JbkFwcFZpZXdcblxuICBpbml0aWFsaXplOiAoc2VyaWFsaXplU3RhdGUpIC0+XG4gICAgc3VwZXJcbiAgICBAYWRkQ2xhc3MgJ29wZW4taW4nXG5cbiAgY2FuY2VsbGVkOiAtPlxuICAgIEBoaWRlKClcblxuICBzZXJpYWxpemU6IC0+XG5cbiAgZGVzdHJveTogLT4gQGRldGFjaCgpXG5cbiAgc2hvdzogLT5cbiAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzKVxuICAgIEBwYW5lbC5zaG93KClcblxuICAgIEBzdG9yZUZvY3VzZWRFbGVtZW50KClcblxuICAgIGFwcHMgPSBhdG9tLmNvbmZpZy5nZXQoJ29wZW4tZmlsZS1pbi5hcHBsaWNhdGlvbnMnKS5zcGxpdCgnLCcpXG4gICAgQHNldEl0ZW1zIGFwcHNcblxuICAgIEBmb2N1c0ZpbHRlckVkaXRvcigpXG5cbiAgaGlkZTogLT5cbiAgICBAcGFuZWw/LmhpZGUoKVxuXG4gIHRvZ2dsZTogKCkgLT5cbiAgICBpZiBAcGFuZWw/LmlzVmlzaWJsZSgpXG4gICAgICBAY2FuY2VsKClcbiAgICBlbHNlXG4gICAgICBAc2hvdygpXG5cbiAgdmlld0Zvckl0ZW06IChhcHApIC0+XG4gICAgJCQgLT5cbiAgICAgIEBsaSBjbGFzczogJ29wZW4taW4taXRlbScsIGFwcFxuXG4gIGNvbmZpcm1lZDogKGFwcCkgPT5cbiAgICBAY2FuY2VsKClcbiAgICBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMgKGVkaXRvcikgLT5cbiAgICAgIEBwYXRoID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLmdldFBhdGgoKVxuXG4gICAgc3dpdGNoIHByb2Nlc3MucGxhdGZvcm1cbiAgICAgIHdoZW4gJ2RhcndpbicgdGhlbiBvcGVuID0gc3Bhd24gJy91c3IvYmluL29wZW4nLCBbJy1hJywgYXBwLCBwYXRoXVxuICAgICAgd2hlbiAnd2luMzInICB0aGVuIG9wZW4gPSBleGVjIFwiI3thcHB9ICN7cGF0aH1cIiBpZiBwYXRoP1xuICAgICAgd2hlbiAnbGludXgnICB0aGVuIG9wZW4gPSBleGVjIFwiI3thcHB9ICN7cGF0aH1cIiBpZiBwYXRoP1xuXG4gICAgb3Blbi5zdGRlcnIub24gJ2RhdGEnLCAoZGF0YSkgLT5cbiAgICAgIGNvbnNvbGUud2FybiBcIlVuYWJsZSB0byBmaW5kIGFwcGxpY2F0aW9uICN7YXBwfVwiXG4iXX0=
