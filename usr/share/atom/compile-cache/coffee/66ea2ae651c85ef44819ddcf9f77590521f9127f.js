(function() {
  var Emitter, File, GzOpener, Serializable, fs, path, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Serializable = require('serializable');

  ref = require('atom'), Emitter = ref.Emitter, File = ref.File;

  path = require('path');

  fs = require('fs-plus');

  module.exports = GzOpener = (function(superClass) {
    extend(GzOpener, superClass);

    GzOpener.activate = function() {
      return atom.workspace.addOpener(function(filePath) {
        if (filePath == null) {
          filePath = '';
        }
        if (filePath.endsWith(".svgz") || (filePath.endsWith(".gz") && !filePath.endsWith(".tar.gz")) && fs.isFileSync(filePath)) {
          return new GzOpener({
            path: filePath
          });
        }
      });
    };

    function GzOpener(arg) {
      var path;
      path = arg.path;
      this.file = new File(path);
      this.emitter = new Emitter();
    }

    GzOpener.prototype.serializeParams = function() {
      return {
        path: this.getPath()
      };
    };

    GzOpener.prototype.deserializeParams = function(params) {
      if (params == null) {
        params = {};
      }
      if (fs.isFileSync(params.path)) {
        return params;
      } else {
        return console.warn("Could not build view for path '" + params.path + "' because that file no longer exists");
      }
    };

    GzOpener.prototype.getPath = function() {
      return this.file.getPath();
    };

    GzOpener.prototype.destroy = function() {
      return this.emitter.emit('did-destroy');
    };

    GzOpener.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };

    GzOpener.prototype.getViewClass = function() {
      return require('./view');
    };

    GzOpener.prototype.getTitle = function() {
      if (this.getPath() != null) {
        return path.basename(this.getPath());
      } else {
        return 'untitled';
      }
    };

    GzOpener.prototype.getURI = function() {
      return this.getPath();
    };

    GzOpener.prototype.isEqual = function(other) {
      return other instanceof GzOpener && this.getURI() === other.getURI();
    };

    return GzOpener;

  })(Serializable);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9nei1vcGVuZXIvbGliL2d6LW9wZW5lci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLG9EQUFBO0lBQUE7OztFQUFBLFlBQUEsR0FBZSxPQUFBLENBQVEsY0FBUjs7RUFDZixNQUFrQixPQUFBLENBQVEsTUFBUixDQUFsQixFQUFDLHFCQUFELEVBQVU7O0VBQ1YsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFFTCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7SUFDSixRQUFDLENBQUEsUUFBRCxHQUFXLFNBQUE7YUFDVCxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQWYsQ0FBeUIsU0FBQyxRQUFEOztVQUFDLFdBQVM7O1FBQ2pDLElBQUcsUUFBUSxDQUFDLFFBQVQsQ0FBa0IsT0FBbEIsQ0FBQSxJQUE4QixDQUFDLFFBQVEsQ0FBQyxRQUFULENBQWtCLEtBQWxCLENBQUEsSUFBNkIsQ0FBQyxRQUFRLENBQUMsUUFBVCxDQUFrQixTQUFsQixDQUEvQixDQUE5QixJQUErRixFQUFFLENBQUMsVUFBSCxDQUFjLFFBQWQsQ0FBbEc7aUJBQ00sSUFBQSxRQUFBLENBQVM7WUFBQSxJQUFBLEVBQU0sUUFBTjtXQUFULEVBRE47O01BRHVCLENBQXpCO0lBRFM7O0lBS0Usa0JBQUMsR0FBRDtBQUNYLFVBQUE7TUFEYSxPQUFEO01BQ1osSUFBQyxDQUFBLElBQUQsR0FBWSxJQUFBLElBQUEsQ0FBSyxJQUFMO01BQ1osSUFBQyxDQUFBLE9BQUQsR0FBZSxJQUFBLE9BQUEsQ0FBQTtJQUZKOzt1QkFJYixlQUFBLEdBQWlCLFNBQUE7YUFDZjtRQUFBLElBQUEsRUFBTSxJQUFDLENBQUEsT0FBRCxDQUFBLENBQU47O0lBRGU7O3VCQUdqQixpQkFBQSxHQUFtQixTQUFDLE1BQUQ7O1FBQUMsU0FBTzs7TUFDekIsSUFBRyxFQUFFLENBQUMsVUFBSCxDQUFjLE1BQU0sQ0FBQyxJQUFyQixDQUFIO2VBQ0UsT0FERjtPQUFBLE1BQUE7ZUFHRSxPQUFPLENBQUMsSUFBUixDQUFhLGlDQUFBLEdBQWtDLE1BQU0sQ0FBQyxJQUF6QyxHQUE4QyxzQ0FBM0QsRUFIRjs7SUFEaUI7O3VCQU1uQixPQUFBLEdBQVMsU0FBQTthQUNQLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFBO0lBRE87O3VCQUdULE9BQUEsR0FBUyxTQUFBO2FBQ1AsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsYUFBZDtJQURPOzt1QkFHVCxZQUFBLEdBQWMsU0FBQyxRQUFEO2FBQ1osSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksYUFBWixFQUEyQixRQUEzQjtJQURZOzt1QkFHZCxZQUFBLEdBQWMsU0FBQTthQUFHLE9BQUEsQ0FBUSxRQUFSO0lBQUg7O3VCQUVkLFFBQUEsR0FBVSxTQUFBO01BQ1IsSUFBRyxzQkFBSDtlQUNFLElBQUksQ0FBQyxRQUFMLENBQWMsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUFkLEVBREY7T0FBQSxNQUFBO2VBR0UsV0FIRjs7SUFEUTs7dUJBTVYsTUFBQSxHQUFRLFNBQUE7YUFBRyxJQUFDLENBQUEsT0FBRCxDQUFBO0lBQUg7O3VCQUVSLE9BQUEsR0FBUyxTQUFDLEtBQUQ7YUFDUCxLQUFBLFlBQWlCLFFBQWpCLElBQThCLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBQSxLQUFhLEtBQUssQ0FBQyxNQUFOLENBQUE7SUFEcEM7Ozs7S0F0Q1k7QUFOdkIiLCJzb3VyY2VzQ29udGVudCI6WyJTZXJpYWxpemFibGUgPSByZXF1aXJlICdzZXJpYWxpemFibGUnXG57RW1pdHRlciwgRmlsZX0gPSByZXF1aXJlICdhdG9tJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5mcyA9IHJlcXVpcmUgJ2ZzLXBsdXMnXG5cbm1vZHVsZS5leHBvcnRzPVxuY2xhc3MgR3pPcGVuZXIgZXh0ZW5kcyBTZXJpYWxpemFibGVcbiAgQGFjdGl2YXRlOiAtPlxuICAgIGF0b20ud29ya3NwYWNlLmFkZE9wZW5lciAoZmlsZVBhdGg9JycpIC0+XG4gICAgICBpZiBmaWxlUGF0aC5lbmRzV2l0aChcIi5zdmd6XCIpIG9yIChmaWxlUGF0aC5lbmRzV2l0aChcIi5nelwiKSBhbmQgIWZpbGVQYXRoLmVuZHNXaXRoKFwiLnRhci5nelwiKSkgYW5kIGZzLmlzRmlsZVN5bmMoZmlsZVBhdGgpXG4gICAgICAgIG5ldyBHek9wZW5lcihwYXRoOiBmaWxlUGF0aClcblxuICBjb25zdHJ1Y3RvcjogKHtwYXRofSkgLT5cbiAgICBAZmlsZSA9IG5ldyBGaWxlKHBhdGgpXG4gICAgQGVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG5cbiAgc2VyaWFsaXplUGFyYW1zOiAtPlxuICAgIHBhdGg6IEBnZXRQYXRoKClcblxuICBkZXNlcmlhbGl6ZVBhcmFtczogKHBhcmFtcz17fSkgLT5cbiAgICBpZiBmcy5pc0ZpbGVTeW5jKHBhcmFtcy5wYXRoKVxuICAgICAgcGFyYW1zXG4gICAgZWxzZVxuICAgICAgY29uc29sZS53YXJuIFwiQ291bGQgbm90IGJ1aWxkIHZpZXcgZm9yIHBhdGggJyN7cGFyYW1zLnBhdGh9JyBiZWNhdXNlIHRoYXQgZmlsZSBubyBsb25nZXIgZXhpc3RzXCJcblxuICBnZXRQYXRoOiAtPlxuICAgIEBmaWxlLmdldFBhdGgoKVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWRlc3Ryb3knXG5cbiAgb25EaWREZXN0cm95OiAoY2FsbGJhY2spIC0+XG4gICAgQGVtaXR0ZXIub24gJ2RpZC1kZXN0cm95JywgY2FsbGJhY2tcblxuICBnZXRWaWV3Q2xhc3M6IC0+IHJlcXVpcmUgJy4vdmlldydcblxuICBnZXRUaXRsZTogLT5cbiAgICBpZiBAZ2V0UGF0aCgpP1xuICAgICAgcGF0aC5iYXNlbmFtZShAZ2V0UGF0aCgpKVxuICAgIGVsc2VcbiAgICAgICd1bnRpdGxlZCdcblxuICBnZXRVUkk6IC0+IEBnZXRQYXRoKClcblxuICBpc0VxdWFsOiAob3RoZXIpIC0+XG4gICAgb3RoZXIgaW5zdGFuY2VvZiBHek9wZW5lciBhbmQgQGdldFVSSSgpIGlzIG90aGVyLmdldFVSSSgpXG4iXX0=
