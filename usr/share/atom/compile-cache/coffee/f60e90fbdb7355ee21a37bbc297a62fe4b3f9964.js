(function() {
  var GzOpenerView, View, archive, fs, path, temp,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  View = require('atom-space-pen-views').View;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp');

  archive = require('ls-archive');

  module.exports = GzOpenerView = (function(superClass) {
    extend(GzOpenerView, superClass);

    function GzOpenerView() {
      return GzOpenerView.__super__.constructor.apply(this, arguments);
    }

    GzOpenerView.content = function(editor) {
      var fn;
      fn = path.basename(editor.getPath());
      return this.div({
        "class": 'gz-opener'
      }, (function(_this) {
        return function() {
          _this.h3(fn);
          return _this.button({
            outlet: "btn",
            "class": "btn"
          }, "open");
        };
      })(this));
    };

    GzOpenerView.prototype.initialize = function(editor) {
      this.file = editor.getPath();
      return this.btn.on('click', (function(_this) {
        return function() {
          return _this.openFile();
        };
      })(this));
    };

    GzOpenerView.prototype.openFile = function() {
      return archive.readGzip(this.file, (function(_this) {
        return function(error, contents) {
          if (error != null) {
            return _this.logError("Error reading " + _this.file, error);
          } else {
            return temp.mkdir('atom-', function(error, tempDirPath) {
              var tempFilePath;
              if (error != null) {
                return _this.logError("Error creating temp directory: " + tempDirPath, error);
              } else {
                tempFilePath = path.join(tempDirPath, path.basename(_this.file).slice(0, -3));
                return fs.writeFile(tempFilePath, contents, function(error) {
                  if (error != null) {
                    return _this.logError("Error writing to " + tempFilePath, error);
                  } else {
                    return atom.workspace.open(tempFilePath);
                  }
                });
              }
            });
          }
        };
      })(this));
    };

    GzOpenerView.prototype.logError = function(message, error) {
      var ref;
      return console.error(message, (ref = error.stack) != null ? ref : error);
    };

    return GzOpenerView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9nei1vcGVuZXIvbGliL3ZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSwyQ0FBQTtJQUFBOzs7RUFBQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUjs7RUFDVCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxPQUFBLEdBQVUsT0FBQSxDQUFRLFlBQVI7O0VBRVYsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7SUFDckIsWUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLE1BQUQ7QUFDUixVQUFBO01BQUEsRUFBQSxHQUFLLElBQUksQ0FBQyxRQUFMLENBQWMsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFkO2FBQ0wsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sV0FBUDtPQUFMLEVBQXlCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUN2QixLQUFDLENBQUEsRUFBRCxDQUFJLEVBQUo7aUJBQ0EsS0FBQyxDQUFBLE1BQUQsQ0FBUTtZQUFBLE1BQUEsRUFBUSxLQUFSO1lBQWUsQ0FBQSxLQUFBLENBQUEsRUFBTyxLQUF0QjtXQUFSLEVBQXFDLE1BQXJDO1FBRnVCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QjtJQUZROzsyQkFNVixVQUFBLEdBQVksU0FBQyxNQUFEO01BQ1YsSUFBQyxDQUFBLElBQUQsR0FBUSxNQUFNLENBQUMsT0FBUCxDQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUcsQ0FBQyxFQUFMLENBQVEsT0FBUixFQUFpQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ2YsS0FBQyxDQUFBLFFBQUQsQ0FBQTtRQURlO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQjtJQUZVOzsyQkFLWixRQUFBLEdBQVUsU0FBQTthQUNSLE9BQU8sQ0FBQyxRQUFSLENBQWlCLElBQUMsQ0FBQSxJQUFsQixFQUF3QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRCxFQUFRLFFBQVI7VUFDdEIsSUFBRyxhQUFIO21CQUNFLEtBQUMsQ0FBQSxRQUFELENBQVUsZ0JBQUEsR0FBaUIsS0FBQyxDQUFBLElBQTVCLEVBQW9DLEtBQXBDLEVBREY7V0FBQSxNQUFBO21CQUdFLElBQUksQ0FBQyxLQUFMLENBQVcsT0FBWCxFQUFvQixTQUFDLEtBQUQsRUFBUSxXQUFSO0FBQ2xCLGtCQUFBO2NBQUEsSUFBRyxhQUFIO3VCQUNFLEtBQUMsQ0FBQSxRQUFELENBQVUsaUNBQUEsR0FBa0MsV0FBNUMsRUFBMkQsS0FBM0QsRUFERjtlQUFBLE1BQUE7Z0JBR0UsWUFBQSxHQUFlLElBQUksQ0FBQyxJQUFMLENBQVUsV0FBVixFQUF1QixJQUFJLENBQUMsUUFBTCxDQUFjLEtBQUMsQ0FBQSxJQUFmLENBQW9CLENBQUMsS0FBckIsQ0FBMkIsQ0FBM0IsRUFBOEIsQ0FBQyxDQUEvQixDQUF2Qjt1QkFFZixFQUFFLENBQUMsU0FBSCxDQUFhLFlBQWIsRUFBMkIsUUFBM0IsRUFBcUMsU0FBQyxLQUFEO2tCQUNuQyxJQUFHLGFBQUg7MkJBQ0UsS0FBQyxDQUFBLFFBQUQsQ0FBVSxtQkFBQSxHQUFvQixZQUE5QixFQUE4QyxLQUE5QyxFQURGO21CQUFBLE1BQUE7MkJBR0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFlBQXBCLEVBSEY7O2dCQURtQyxDQUFyQyxFQUxGOztZQURrQixDQUFwQixFQUhGOztRQURzQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEI7SUFEUTs7MkJBaUJWLFFBQUEsR0FBVSxTQUFDLE9BQUQsRUFBVSxLQUFWO0FBQ1IsVUFBQTthQUFBLE9BQU8sQ0FBQyxLQUFSLENBQWMsT0FBZCxzQ0FBcUMsS0FBckM7SUFEUTs7OztLQTdCZ0M7QUFONUMiLCJzb3VyY2VzQ29udGVudCI6WyJ7Vmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuZnMgPSByZXF1aXJlICdmcy1wbHVzJ1xudGVtcCA9IHJlcXVpcmUgJ3RlbXAnXG5hcmNoaXZlID0gcmVxdWlyZSAnbHMtYXJjaGl2ZSdcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBHek9wZW5lclZpZXcgZXh0ZW5kcyBWaWV3XG4gIEBjb250ZW50OiAoZWRpdG9yKSAtPlxuICAgIGZuID0gcGF0aC5iYXNlbmFtZShlZGl0b3IuZ2V0UGF0aCgpKVxuICAgIEBkaXYgY2xhc3M6ICdnei1vcGVuZXInLCA9PlxuICAgICAgQGgzIGZuXG4gICAgICBAYnV0dG9uIG91dGxldDogXCJidG5cIiwgY2xhc3M6IFwiYnRuXCIsIFwib3BlblwiXG5cbiAgaW5pdGlhbGl6ZTogKGVkaXRvcikgLT5cbiAgICBAZmlsZSA9IGVkaXRvci5nZXRQYXRoKClcbiAgICBAYnRuLm9uICdjbGljaycsID0+XG4gICAgICBAb3BlbkZpbGUoKVxuXG4gIG9wZW5GaWxlOiAtPlxuICAgIGFyY2hpdmUucmVhZEd6aXAgQGZpbGUsIChlcnJvciwgY29udGVudHMpID0+XG4gICAgICBpZiBlcnJvcj9cbiAgICAgICAgQGxvZ0Vycm9yKFwiRXJyb3IgcmVhZGluZyAje0BmaWxlfVwiLCBlcnJvcilcbiAgICAgIGVsc2VcbiAgICAgICAgdGVtcC5ta2RpciAnYXRvbS0nLCAoZXJyb3IsIHRlbXBEaXJQYXRoKSA9PlxuICAgICAgICAgIGlmIGVycm9yP1xuICAgICAgICAgICAgQGxvZ0Vycm9yKFwiRXJyb3IgY3JlYXRpbmcgdGVtcCBkaXJlY3Rvcnk6ICN7dGVtcERpclBhdGh9XCIsIGVycm9yKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRlbXBGaWxlUGF0aCA9IHBhdGguam9pbih0ZW1wRGlyUGF0aCwgcGF0aC5iYXNlbmFtZShAZmlsZSkuc2xpY2UoMCwgLTMpKVxuICAgICAgICAgICAgIyBjb25zb2xlLmxvZygndGVtcCBmaWxlOiAnLCB0ZW1wRmlsZVBhdGgpXG4gICAgICAgICAgICBmcy53cml0ZUZpbGUgdGVtcEZpbGVQYXRoLCBjb250ZW50cywgKGVycm9yKSA9PlxuICAgICAgICAgICAgICBpZiBlcnJvcj9cbiAgICAgICAgICAgICAgICBAbG9nRXJyb3IoXCJFcnJvciB3cml0aW5nIHRvICN7dGVtcEZpbGVQYXRofVwiLCBlcnJvcilcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4odGVtcEZpbGVQYXRoKVxuXG4gIGxvZ0Vycm9yOiAobWVzc2FnZSwgZXJyb3IpIC0+XG4gICAgY29uc29sZS5lcnJvcihtZXNzYWdlLCBlcnJvci5zdGFjayA/IGVycm9yKVxuIl19
