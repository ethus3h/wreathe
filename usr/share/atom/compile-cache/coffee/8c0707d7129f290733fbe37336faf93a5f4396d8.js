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
        if (filePath.endsWith(".gz") && !filePath.endsWith(".tar.gz") && fs.isFileSync(filePath)) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9nei1vcGVuZXIvbGliL2d6LW9wZW5lci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLG9EQUFBO0lBQUE7OztFQUFBLFlBQUEsR0FBZSxPQUFBLENBQVEsY0FBUjs7RUFDZixNQUFrQixPQUFBLENBQVEsTUFBUixDQUFsQixFQUFDLHFCQUFELEVBQVU7O0VBQ1YsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFFTCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7SUFDSixRQUFDLENBQUEsUUFBRCxHQUFXLFNBQUE7YUFDVCxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQWYsQ0FBeUIsU0FBQyxRQUFEOztVQUFDLFdBQVM7O1FBQ2pDLElBQUcsUUFBUSxDQUFDLFFBQVQsQ0FBa0IsS0FBbEIsQ0FBQSxJQUE2QixDQUFDLFFBQVEsQ0FBQyxRQUFULENBQWtCLFNBQWxCLENBQTlCLElBQStELEVBQUUsQ0FBQyxVQUFILENBQWMsUUFBZCxDQUFsRTtpQkFDTSxJQUFBLFFBQUEsQ0FBUztZQUFBLElBQUEsRUFBTSxRQUFOO1dBQVQsRUFETjs7TUFEdUIsQ0FBekI7SUFEUzs7SUFLRSxrQkFBQyxHQUFEO0FBQ1gsVUFBQTtNQURhLE9BQUQ7TUFDWixJQUFDLENBQUEsSUFBRCxHQUFZLElBQUEsSUFBQSxDQUFLLElBQUw7TUFDWixJQUFDLENBQUEsT0FBRCxHQUFlLElBQUEsT0FBQSxDQUFBO0lBRko7O3VCQUliLGVBQUEsR0FBaUIsU0FBQTthQUNmO1FBQUEsSUFBQSxFQUFNLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FBTjs7SUFEZTs7dUJBR2pCLGlCQUFBLEdBQW1CLFNBQUMsTUFBRDs7UUFBQyxTQUFPOztNQUN6QixJQUFHLEVBQUUsQ0FBQyxVQUFILENBQWMsTUFBTSxDQUFDLElBQXJCLENBQUg7ZUFDRSxPQURGO09BQUEsTUFBQTtlQUdFLE9BQU8sQ0FBQyxJQUFSLENBQWEsaUNBQUEsR0FBa0MsTUFBTSxDQUFDLElBQXpDLEdBQThDLHNDQUEzRCxFQUhGOztJQURpQjs7dUJBTW5CLE9BQUEsR0FBUyxTQUFBO2FBQ1AsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQUE7SUFETzs7dUJBR1QsT0FBQSxHQUFTLFNBQUE7YUFDUCxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxhQUFkO0lBRE87O3VCQUdULFlBQUEsR0FBYyxTQUFDLFFBQUQ7YUFDWixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxhQUFaLEVBQTJCLFFBQTNCO0lBRFk7O3VCQUdkLFlBQUEsR0FBYyxTQUFBO2FBQUcsT0FBQSxDQUFRLFFBQVI7SUFBSDs7dUJBRWQsUUFBQSxHQUFVLFNBQUE7TUFDUixJQUFHLHNCQUFIO2VBQ0UsSUFBSSxDQUFDLFFBQUwsQ0FBYyxJQUFDLENBQUEsT0FBRCxDQUFBLENBQWQsRUFERjtPQUFBLE1BQUE7ZUFHRSxXQUhGOztJQURROzt1QkFNVixNQUFBLEdBQVEsU0FBQTthQUFHLElBQUMsQ0FBQSxPQUFELENBQUE7SUFBSDs7dUJBRVIsT0FBQSxHQUFTLFNBQUMsS0FBRDthQUNQLEtBQUEsWUFBaUIsUUFBakIsSUFBOEIsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFBLEtBQWEsS0FBSyxDQUFDLE1BQU4sQ0FBQTtJQURwQzs7OztLQXRDWTtBQU52QiIsInNvdXJjZXNDb250ZW50IjpbIlNlcmlhbGl6YWJsZSA9IHJlcXVpcmUgJ3NlcmlhbGl6YWJsZSdcbntFbWl0dGVyLCBGaWxlfSA9IHJlcXVpcmUgJ2F0b20nXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcbmZzID0gcmVxdWlyZSAnZnMtcGx1cydcblxubW9kdWxlLmV4cG9ydHM9XG5jbGFzcyBHek9wZW5lciBleHRlbmRzIFNlcmlhbGl6YWJsZVxuICBAYWN0aXZhdGU6IC0+XG4gICAgYXRvbS53b3Jrc3BhY2UuYWRkT3BlbmVyIChmaWxlUGF0aD0nJykgLT5cbiAgICAgIGlmIGZpbGVQYXRoLmVuZHNXaXRoKFwiLmd6XCIpIGFuZCAhZmlsZVBhdGguZW5kc1dpdGgoXCIudGFyLmd6XCIpIGFuZCBmcy5pc0ZpbGVTeW5jKGZpbGVQYXRoKVxuICAgICAgICBuZXcgR3pPcGVuZXIocGF0aDogZmlsZVBhdGgpXG5cbiAgY29uc3RydWN0b3I6ICh7cGF0aH0pIC0+XG4gICAgQGZpbGUgPSBuZXcgRmlsZShwYXRoKVxuICAgIEBlbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuXG4gIHNlcmlhbGl6ZVBhcmFtczogLT5cbiAgICBwYXRoOiBAZ2V0UGF0aCgpXG5cbiAgZGVzZXJpYWxpemVQYXJhbXM6IChwYXJhbXM9e30pIC0+XG4gICAgaWYgZnMuaXNGaWxlU3luYyhwYXJhbXMucGF0aClcbiAgICAgIHBhcmFtc1xuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUud2FybiBcIkNvdWxkIG5vdCBidWlsZCB2aWV3IGZvciBwYXRoICcje3BhcmFtcy5wYXRofScgYmVjYXVzZSB0aGF0IGZpbGUgbm8gbG9uZ2VyIGV4aXN0c1wiXG5cbiAgZ2V0UGF0aDogLT5cbiAgICBAZmlsZS5nZXRQYXRoKClcblxuICBkZXN0cm95OiAtPlxuICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1kZXN0cm95J1xuXG4gIG9uRGlkRGVzdHJveTogKGNhbGxiYWNrKSAtPlxuICAgIEBlbWl0dGVyLm9uICdkaWQtZGVzdHJveScsIGNhbGxiYWNrXG5cbiAgZ2V0Vmlld0NsYXNzOiAtPiByZXF1aXJlICcuL3ZpZXcnXG5cbiAgZ2V0VGl0bGU6IC0+XG4gICAgaWYgQGdldFBhdGgoKT9cbiAgICAgIHBhdGguYmFzZW5hbWUoQGdldFBhdGgoKSlcbiAgICBlbHNlXG4gICAgICAndW50aXRsZWQnXG5cbiAgZ2V0VVJJOiAtPiBAZ2V0UGF0aCgpXG5cbiAgaXNFcXVhbDogKG90aGVyKSAtPlxuICAgIG90aGVyIGluc3RhbmNlb2YgR3pPcGVuZXIgYW5kIEBnZXRVUkkoKSBpcyBvdGhlci5nZXRVUkkoKVxuIl19
