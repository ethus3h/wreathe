Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = getUserOptions;

var _path = require('path');

var _fsPlus = require('fs-plus');

'use babel';

var PACKAGE_NAME = 'javascript-refactor';

function getUserOptions(projectRoot) {
  var _atom$config$getAll = atom.config.getAll(PACKAGE_NAME);

  var _atom$config$getAll2 = _slicedToArray(_atom$config$getAll, 1);

  var userOptions = _atom$config$getAll2[0].value;

  var ignoreConfig = userOptions.ignoreConfig.reduce(function (ignorePaths, config) {
    var filePath = (0, _path.resolve)(projectRoot, config);
    if ((0, _fsPlus.isFileSync)(filePath)) {
      ignorePaths.push(filePath);
    }
    return ignorePaths;
  }, []);
  var extensions = userOptions.extensions.join(',');
  return _extends({}, userOptions, {
    ignoreConfig: ignoreConfig,
    extensions: extensions
  });
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9saWJyYXJ5L0VtYmVyIHNhdGVsbGl0ZSBwcm9qZWN0cy93cmVhdGhlLWJhc2UvdXNyL3NoYXJlL2F0b20vcGFja2FnZXMvamF2YXNjcmlwdC1yZWZhY3Rvci9saWIvdXRpbHMvZ2V0VXNlck9wdGlvbnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7cUJBT3dCLGNBQWM7O29CQUxkLE1BQU07O3NCQUNILFNBQVM7O0FBSHBDLFdBQVcsQ0FBQzs7QUFLWixJQUFNLFlBQVksR0FBRyxxQkFBcUIsQ0FBQzs7QUFFNUIsU0FBUyxjQUFjLENBQUMsV0FBVyxFQUFFOzRCQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7Ozs7TUFBakQsV0FBVywyQkFBbEIsS0FBSzs7QUFDZCxNQUFNLFlBQVksR0FBRyxXQUFXLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxVQUFDLFdBQVcsRUFBRSxNQUFNLEVBQUs7QUFDNUUsUUFBTSxRQUFRLEdBQUcsbUJBQVEsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzlDLFFBQUksd0JBQVcsUUFBUSxDQUFDLEVBQUU7QUFDeEIsaUJBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDNUI7QUFDRCxXQUFPLFdBQVcsQ0FBQztHQUNwQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ1AsTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEQsc0JBQ0ssV0FBVztBQUNkLGdCQUFZLEVBQVosWUFBWTtBQUNaLGNBQVUsRUFBVixVQUFVO0tBQ1Y7Q0FDSCIsImZpbGUiOiIvbGlicmFyeS9FbWJlciBzYXRlbGxpdGUgcHJvamVjdHMvd3JlYXRoZS1iYXNlL3Vzci9zaGFyZS9hdG9tL3BhY2thZ2VzL2phdmFzY3JpcHQtcmVmYWN0b3IvbGliL3V0aWxzL2dldFVzZXJPcHRpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IGlzRmlsZVN5bmMgfSBmcm9tICdmcy1wbHVzJztcblxuY29uc3QgUEFDS0FHRV9OQU1FID0gJ2phdmFzY3JpcHQtcmVmYWN0b3InO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRVc2VyT3B0aW9ucyhwcm9qZWN0Um9vdCkge1xuICBjb25zdCBbeyB2YWx1ZTogdXNlck9wdGlvbnMgfV0gPSBhdG9tLmNvbmZpZy5nZXRBbGwoUEFDS0FHRV9OQU1FKTtcbiAgY29uc3QgaWdub3JlQ29uZmlnID0gdXNlck9wdGlvbnMuaWdub3JlQ29uZmlnLnJlZHVjZSgoaWdub3JlUGF0aHMsIGNvbmZpZykgPT4ge1xuICAgIGNvbnN0IGZpbGVQYXRoID0gcmVzb2x2ZShwcm9qZWN0Um9vdCwgY29uZmlnKTtcbiAgICBpZiAoaXNGaWxlU3luYyhmaWxlUGF0aCkpIHtcbiAgICAgIGlnbm9yZVBhdGhzLnB1c2goZmlsZVBhdGgpO1xuICAgIH1cbiAgICByZXR1cm4gaWdub3JlUGF0aHM7XG4gIH0sIFtdKTtcbiAgY29uc3QgZXh0ZW5zaW9ucyA9IHVzZXJPcHRpb25zLmV4dGVuc2lvbnMuam9pbignLCcpO1xuICByZXR1cm4ge1xuICAgIC4uLnVzZXJPcHRpb25zLFxuICAgIGlnbm9yZUNvbmZpZyxcbiAgICBleHRlbnNpb25zLFxuICB9O1xufVxuIl19