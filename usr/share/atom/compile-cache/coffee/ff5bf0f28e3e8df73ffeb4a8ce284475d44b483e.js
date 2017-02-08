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
        if (filePath.endsWith(".svgz") || filePath.endsWith(".gz") && !filePath.endsWith(".tar.gz") && fs.isFileSync(filePath)) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9nei1vcGVuZXIvbGliL2d6LW9wZW5lci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLG9EQUFBO0lBQUE7OztFQUFBLFlBQUEsR0FBZSxPQUFBLENBQVEsY0FBUjs7RUFDZixNQUFrQixPQUFBLENBQVEsTUFBUixDQUFsQixFQUFDLHFCQUFELEVBQVU7O0VBQ1YsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFFTCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7SUFDSixRQUFDLENBQUEsUUFBRCxHQUFXLFNBQUE7YUFDVCxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQWYsQ0FBeUIsU0FBQyxRQUFEOztVQUFDLFdBQVM7O1FBQ2pDLElBQUcsUUFBUSxDQUFDLFFBQVQsQ0FBa0IsT0FBbEIsQ0FBQSxJQUE4QixRQUFRLENBQUMsUUFBVCxDQUFrQixLQUFsQixDQUE5QixJQUEyRCxDQUFDLFFBQVEsQ0FBQyxRQUFULENBQWtCLFNBQWxCLENBQTVELElBQTZGLEVBQUUsQ0FBQyxVQUFILENBQWMsUUFBZCxDQUFoRztpQkFDTSxJQUFBLFFBQUEsQ0FBUztZQUFBLElBQUEsRUFBTSxRQUFOO1dBQVQsRUFETjs7TUFEdUIsQ0FBekI7SUFEUzs7SUFLRSxrQkFBQyxHQUFEO0FBQ1gsVUFBQTtNQURhLE9BQUQ7TUFDWixJQUFDLENBQUEsSUFBRCxHQUFZLElBQUEsSUFBQSxDQUFLLElBQUw7TUFDWixJQUFDLENBQUEsT0FBRCxHQUFlLElBQUEsT0FBQSxDQUFBO0lBRko7O3VCQUliLGVBQUEsR0FBaUIsU0FBQTthQUNmO1FBQUEsSUFBQSxFQUFNLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FBTjs7SUFEZTs7dUJBR2pCLGlCQUFBLEdBQW1CLFNBQUMsTUFBRDs7UUFBQyxTQUFPOztNQUN6QixJQUFHLEVBQUUsQ0FBQyxVQUFILENBQWMsTUFBTSxDQUFDLElBQXJCLENBQUg7ZUFDRSxPQURGO09BQUEsTUFBQTtlQUdFLE9BQU8sQ0FBQyxJQUFSLENBQWEsaUNBQUEsR0FBa0MsTUFBTSxDQUFDLElBQXpDLEdBQThDLHNDQUEzRCxFQUhGOztJQURpQjs7dUJBTW5CLE9BQUEsR0FBUyxTQUFBO2FBQ1AsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQUE7SUFETzs7dUJBR1QsT0FBQSxHQUFTLFNBQUE7YUFDUCxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxhQUFkO0lBRE87O3VCQUdULFlBQUEsR0FBYyxTQUFDLFFBQUQ7YUFDWixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxhQUFaLEVBQTJCLFFBQTNCO0lBRFk7O3VCQUdkLFlBQUEsR0FBYyxTQUFBO2FBQUcsT0FBQSxDQUFRLFFBQVI7SUFBSDs7dUJBRWQsUUFBQSxHQUFVLFNBQUE7TUFDUixJQUFHLHNCQUFIO2VBQ0UsSUFBSSxDQUFDLFFBQUwsQ0FBYyxJQUFDLENBQUEsT0FBRCxDQUFBLENBQWQsRUFERjtPQUFBLE1BQUE7ZUFHRSxXQUhGOztJQURROzt1QkFNVixNQUFBLEdBQVEsU0FBQTthQUFHLElBQUMsQ0FBQSxPQUFELENBQUE7SUFBSDs7dUJBRVIsT0FBQSxHQUFTLFNBQUMsS0FBRDthQUNQLEtBQUEsWUFBaUIsUUFBakIsSUFBOEIsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFBLEtBQWEsS0FBSyxDQUFDLE1BQU4sQ0FBQTtJQURwQzs7OztLQXRDWTtBQU52QiIsInNvdXJjZXNDb250ZW50IjpbIlNlcmlhbGl6YWJsZSA9IHJlcXVpcmUgJ3NlcmlhbGl6YWJsZSdcbntFbWl0dGVyLCBGaWxlfSA9IHJlcXVpcmUgJ2F0b20nXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcbmZzID0gcmVxdWlyZSAnZnMtcGx1cydcblxubW9kdWxlLmV4cG9ydHM9XG5jbGFzcyBHek9wZW5lciBleHRlbmRzIFNlcmlhbGl6YWJsZVxuICBAYWN0aXZhdGU6IC0+XG4gICAgYXRvbS53b3Jrc3BhY2UuYWRkT3BlbmVyIChmaWxlUGF0aD0nJykgLT5cbiAgICAgIGlmIGZpbGVQYXRoLmVuZHNXaXRoKFwiLnN2Z3pcIikgb3IgZmlsZVBhdGguZW5kc1dpdGgoXCIuZ3pcIikgYW5kICFmaWxlUGF0aC5lbmRzV2l0aChcIi50YXIuZ3pcIikgYW5kIGZzLmlzRmlsZVN5bmMoZmlsZVBhdGgpXG4gICAgICAgIG5ldyBHek9wZW5lcihwYXRoOiBmaWxlUGF0aClcblxuICBjb25zdHJ1Y3RvcjogKHtwYXRofSkgLT5cbiAgICBAZmlsZSA9IG5ldyBGaWxlKHBhdGgpXG4gICAgQGVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG5cbiAgc2VyaWFsaXplUGFyYW1zOiAtPlxuICAgIHBhdGg6IEBnZXRQYXRoKClcblxuICBkZXNlcmlhbGl6ZVBhcmFtczogKHBhcmFtcz17fSkgLT5cbiAgICBpZiBmcy5pc0ZpbGVTeW5jKHBhcmFtcy5wYXRoKVxuICAgICAgcGFyYW1zXG4gICAgZWxzZVxuICAgICAgY29uc29sZS53YXJuIFwiQ291bGQgbm90IGJ1aWxkIHZpZXcgZm9yIHBhdGggJyN7cGFyYW1zLnBhdGh9JyBiZWNhdXNlIHRoYXQgZmlsZSBubyBsb25nZXIgZXhpc3RzXCJcblxuICBnZXRQYXRoOiAtPlxuICAgIEBmaWxlLmdldFBhdGgoKVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWRlc3Ryb3knXG5cbiAgb25EaWREZXN0cm95OiAoY2FsbGJhY2spIC0+XG4gICAgQGVtaXR0ZXIub24gJ2RpZC1kZXN0cm95JywgY2FsbGJhY2tcblxuICBnZXRWaWV3Q2xhc3M6IC0+IHJlcXVpcmUgJy4vdmlldydcblxuICBnZXRUaXRsZTogLT5cbiAgICBpZiBAZ2V0UGF0aCgpP1xuICAgICAgcGF0aC5iYXNlbmFtZShAZ2V0UGF0aCgpKVxuICAgIGVsc2VcbiAgICAgICd1bnRpdGxlZCdcblxuICBnZXRVUkk6IC0+IEBnZXRQYXRoKClcblxuICBpc0VxdWFsOiAob3RoZXIpIC0+XG4gICAgb3RoZXIgaW5zdGFuY2VvZiBHek9wZW5lciBhbmQgQGdldFVSSSgpIGlzIG90aGVyLmdldFVSSSgpXG4iXX0=
