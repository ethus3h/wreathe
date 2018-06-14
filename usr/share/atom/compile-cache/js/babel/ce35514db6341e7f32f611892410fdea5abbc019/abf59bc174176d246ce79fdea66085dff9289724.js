Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var renameAndTransform = _asyncToGenerator(function* (previousPath, nextPath, projectRoot, paths, userOptions) {
  if ((0, _fsPlus.isFileSync)(nextPath)) {
    atom.notifications.addError(nextPath + ' already exists!', {
      dismissable: true
    });
    return;
  }

  if ((0, _utils.renameFile)(previousPath, nextPath)) {
    if ((0, _fsPlus.isDirectorySync)(nextPath) || (0, _path.extname)(previousPath) === '.js' && (0, _path.extname)(nextPath) === '.js') {
      var filesThatMoved = paths.map(function (path) {
        return path.nextFilePath;
      });
      if (filesThatMoved.length > 0) {
        yield (0, _transformsImportRelativeCodemodRunner2['default'])(filesThatMoved, paths, userOptions);
      }

      yield (0, _transformsImportDeclarationCodemodRunner2['default'])([projectRoot], paths, userOptions);
    }
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _path = require('path');

var _fsPlus = require('fs-plus');

var _utils = require('./utils');

var _transformsImportDeclarationCodemodRunner = require('./transforms/importDeclarationCodemodRunner');

var _transformsImportDeclarationCodemodRunner2 = _interopRequireDefault(_transformsImportDeclarationCodemodRunner);

var _transformsImportRelativeCodemodRunner = require('./transforms/importRelativeCodemodRunner');

var _transformsImportRelativeCodemodRunner2 = _interopRequireDefault(_transformsImportRelativeCodemodRunner);

'use babel';

function syncChangesWithGit(projectRoot) {
  var repo = (0, _utils.getRepo)(projectRoot);
  if (repo !== null) {
    repo.refreshIndex();
    repo.refreshStatus();
    atom.workspace.getTextEditors().forEach(function (editor) {
      return repo.getPathStatus(editor.getPath());
    });
  }
}

exports['default'] = _asyncToGenerator(function* (previousPath, nextPath) {
  var _atom$project$relativizePath = atom.project.relativizePath(previousPath);

  var _atom$project$relativizePath2 = _slicedToArray(_atom$project$relativizePath, 1);

  var projectRoot = _atom$project$relativizePath2[0];

  var userOptions = (0, _utils.getUserOptions)(projectRoot);
  var paths = (0, _utils.buildPathsToRename)(previousPath, nextPath);

  yield renameAndTransform(previousPath, nextPath, projectRoot, paths, userOptions);
  syncChangesWithGit(projectRoot);
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9saWJyYXJ5L0VtYmVyIHNhdGVsbGl0ZSBwcm9qZWN0cy93cmVhdGhlLWJhc2UvdXNyL3NoYXJlL2F0b20vcGFja2FnZXMvamF2YXNjcmlwdC1yZWZhY3Rvci9saWIvcmVuYW1lUGF0aHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0lBY2Usa0JBQWtCLHFCQUFqQyxXQUFrQyxZQUFZLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFO0FBQ3pGLE1BQUksd0JBQVcsUUFBUSxDQUFDLEVBQUU7QUFDeEIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUksUUFBUSx1QkFBb0I7QUFDekQsaUJBQVcsRUFBRSxJQUFJO0tBQ2xCLENBQUMsQ0FBQztBQUNILFdBQU87R0FDUjs7QUFFRCxNQUFJLHVCQUFXLFlBQVksRUFBRSxRQUFRLENBQUMsRUFBRTtBQUN0QyxRQUNFLDZCQUFnQixRQUFRLENBQUMsSUFDeEIsbUJBQVEsWUFBWSxDQUFDLEtBQUssS0FBSyxJQUFJLG1CQUFRLFFBQVEsQ0FBQyxLQUFLLEtBQUssQUFBQyxFQUNoRTtBQUNBLFVBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJO2VBQUksSUFBSSxDQUFDLFlBQVk7T0FBQSxDQUFDLENBQUM7QUFDNUQsVUFBSSxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUM3QixjQUFNLHdEQUNKLGNBQWMsRUFDZCxLQUFLLEVBQ0wsV0FBVyxDQUNaLENBQUM7T0FDSDs7QUFFRCxZQUFNLDJEQUNKLENBQUMsV0FBVyxDQUFDLEVBQ2IsS0FBSyxFQUNMLFdBQVcsQ0FDWixDQUFDO0tBQ0g7R0FDRjtDQUNGOzs7Ozs7b0JBeEN1QixNQUFNOztzQkFDYyxTQUFTOztxQkFNOUMsU0FBUzs7d0RBQzJCLDZDQUE2Qzs7OztxREFDaEQsMENBQTBDOzs7O0FBWmxGLFdBQVcsQ0FBQzs7QUE2Q1osU0FBUyxrQkFBa0IsQ0FBQyxXQUFXLEVBQUU7QUFDdkMsTUFBTSxJQUFJLEdBQUcsb0JBQVEsV0FBVyxDQUFDLENBQUM7QUFDbEMsTUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO0FBQ2pCLFFBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUNwQixRQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7QUFDckIsUUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBQSxNQUFNO2FBQzVDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQUEsQ0FDckMsQ0FBQztHQUNIO0NBQ0Y7O3VDQUVjLFdBQTJCLFlBQW9CLEVBQUUsUUFBZ0IsRUFBRTtxQ0FDMUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDOzs7O01BQXhELFdBQVc7O0FBQ2xCLE1BQU0sV0FBVyxHQUFHLDJCQUFlLFdBQVcsQ0FBQyxDQUFDO0FBQ2hELE1BQU0sS0FBSyxHQUFHLCtCQUFtQixZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUM7O0FBRXpELFFBQU0sa0JBQWtCLENBQUMsWUFBWSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ2xGLG9CQUFrQixDQUFDLFdBQVcsQ0FBQyxDQUFDO0NBQ2pDIiwiZmlsZSI6Ii9saWJyYXJ5L0VtYmVyIHNhdGVsbGl0ZSBwcm9qZWN0cy93cmVhdGhlLWJhc2UvdXNyL3NoYXJlL2F0b20vcGFja2FnZXMvamF2YXNjcmlwdC1yZWZhY3Rvci9saWIvcmVuYW1lUGF0aHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLy8gQGZsb3dcbmltcG9ydCB7IGV4dG5hbWUgfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IGlzRGlyZWN0b3J5U3luYywgaXNGaWxlU3luYyB9IGZyb20gJ2ZzLXBsdXMnO1xuaW1wb3J0IHtcbiAgYnVpbGRQYXRoc1RvUmVuYW1lLFxuICBnZXRSZXBvLFxuICBnZXRVc2VyT3B0aW9ucyxcbiAgcmVuYW1lRmlsZSxcbn0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgaW1wb3J0RGVjbGFyYXRpb25Db2RlbW9kUnVubmVyIGZyb20gJy4vdHJhbnNmb3Jtcy9pbXBvcnREZWNsYXJhdGlvbkNvZGVtb2RSdW5uZXInO1xuaW1wb3J0IGltcG9ydFJlbGF0aXZlQ29kZW1vZFJ1bm5lciBmcm9tICcuL3RyYW5zZm9ybXMvaW1wb3J0UmVsYXRpdmVDb2RlbW9kUnVubmVyJztcblxuYXN5bmMgZnVuY3Rpb24gcmVuYW1lQW5kVHJhbnNmb3JtKHByZXZpb3VzUGF0aCwgbmV4dFBhdGgsIHByb2plY3RSb290LCBwYXRocywgdXNlck9wdGlvbnMpIHtcbiAgaWYgKGlzRmlsZVN5bmMobmV4dFBhdGgpKSB7XG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGAke25leHRQYXRofSBhbHJlYWR5IGV4aXN0cyFgLCB7XG4gICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICB9KTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAocmVuYW1lRmlsZShwcmV2aW91c1BhdGgsIG5leHRQYXRoKSkge1xuICAgIGlmIChcbiAgICAgIGlzRGlyZWN0b3J5U3luYyhuZXh0UGF0aCkgfHxcbiAgICAgIChleHRuYW1lKHByZXZpb3VzUGF0aCkgPT09ICcuanMnICYmIGV4dG5hbWUobmV4dFBhdGgpID09PSAnLmpzJylcbiAgICApIHtcbiAgICAgIGNvbnN0IGZpbGVzVGhhdE1vdmVkID0gcGF0aHMubWFwKHBhdGggPT4gcGF0aC5uZXh0RmlsZVBhdGgpO1xuICAgICAgaWYgKGZpbGVzVGhhdE1vdmVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXdhaXQgaW1wb3J0UmVsYXRpdmVDb2RlbW9kUnVubmVyKFxuICAgICAgICAgIGZpbGVzVGhhdE1vdmVkLFxuICAgICAgICAgIHBhdGhzLFxuICAgICAgICAgIHVzZXJPcHRpb25zLFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCBpbXBvcnREZWNsYXJhdGlvbkNvZGVtb2RSdW5uZXIoXG4gICAgICAgIFtwcm9qZWN0Um9vdF0sXG4gICAgICAgIHBhdGhzLFxuICAgICAgICB1c2VyT3B0aW9ucyxcbiAgICAgICk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHN5bmNDaGFuZ2VzV2l0aEdpdChwcm9qZWN0Um9vdCkge1xuICBjb25zdCByZXBvID0gZ2V0UmVwbyhwcm9qZWN0Um9vdCk7XG4gIGlmIChyZXBvICE9PSBudWxsKSB7XG4gICAgcmVwby5yZWZyZXNoSW5kZXgoKTtcbiAgICByZXBvLnJlZnJlc2hTdGF0dXMoKTtcbiAgICBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpLmZvckVhY2goZWRpdG9yID0+XG4gICAgICByZXBvLmdldFBhdGhTdGF0dXMoZWRpdG9yLmdldFBhdGgoKSksXG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiByZW5hbWVQYXRocyhwcmV2aW91c1BhdGg6IHN0cmluZywgbmV4dFBhdGg6IHN0cmluZykge1xuICBjb25zdCBbcHJvamVjdFJvb3RdID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKHByZXZpb3VzUGF0aCk7XG4gIGNvbnN0IHVzZXJPcHRpb25zID0gZ2V0VXNlck9wdGlvbnMocHJvamVjdFJvb3QpO1xuICBjb25zdCBwYXRocyA9IGJ1aWxkUGF0aHNUb1JlbmFtZShwcmV2aW91c1BhdGgsIG5leHRQYXRoKTtcblxuICBhd2FpdCByZW5hbWVBbmRUcmFuc2Zvcm0ocHJldmlvdXNQYXRoLCBuZXh0UGF0aCwgcHJvamVjdFJvb3QsIHBhdGhzLCB1c2VyT3B0aW9ucyk7XG4gIHN5bmNDaGFuZ2VzV2l0aEdpdChwcm9qZWN0Um9vdCk7XG59XG4iXX0=