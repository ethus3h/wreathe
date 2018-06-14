Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = importDeclarationCodemodRunner;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jscodeshiftDistRunner = require('jscodeshift/dist/Runner');

var _jscodeshiftDistRunner2 = _interopRequireDefault(_jscodeshiftDistRunner);

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

'use babel';

var transform = require.resolve('refactoring-codemods/lib/transformers/import-declaration-transform');

function importDeclarationCodemodRunner(roots, paths, userOptions) {
  var options = _extends({
    paths: paths
  }, _constants2['default'], userOptions);
  var result = _jscodeshiftDistRunner2['default'].run(transform, roots, options);
  return Promise.resolve(result);
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9saWJyYXJ5L0VtYmVyIHNhdGVsbGl0ZSBwcm9qZWN0cy93cmVhdGhlLWJhc2UvdXNyL3NoYXJlL2F0b20vcGFja2FnZXMvamF2YXNjcmlwdC1yZWZhY3Rvci9saWIvdHJhbnNmb3Jtcy9pbXBvcnREZWNsYXJhdGlvbkNvZGVtb2RSdW5uZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O3FCQVN3Qiw4QkFBOEI7Ozs7cUNBUG5DLHlCQUF5Qjs7Ozt5QkFDaEIsYUFBYTs7OztBQUh6QyxXQUFXLENBQUM7O0FBS1osSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FDL0Isb0VBQW9FLENBQ3JFLENBQUM7O0FBRWEsU0FBUyw4QkFBOEIsQ0FDcEQsS0FBSyxFQUNMLEtBQUssRUFDTCxXQUFXLEVBQ1g7QUFDQSxNQUFNLE9BQU87QUFDWCxTQUFLLEVBQUwsS0FBSzs2QkFFRixXQUFXLENBQ2YsQ0FBQztBQUNGLE1BQU0sTUFBTSxHQUFHLG1DQUFPLEdBQUcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3JELFNBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztDQUNoQyIsImZpbGUiOiIvbGlicmFyeS9FbWJlciBzYXRlbGxpdGUgcHJvamVjdHMvd3JlYXRoZS1iYXNlL3Vzci9zaGFyZS9hdG9tL3BhY2thZ2VzL2phdmFzY3JpcHQtcmVmYWN0b3IvbGliL3RyYW5zZm9ybXMvaW1wb3J0RGVjbGFyYXRpb25Db2RlbW9kUnVubmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBSdW5uZXIgZnJvbSAnanNjb2Rlc2hpZnQvZGlzdC9SdW5uZXInO1xuaW1wb3J0IERFRkFVTFRfT1BUSU9OUyBmcm9tICcuL2NvbnN0YW50cyc7XG5cbmNvbnN0IHRyYW5zZm9ybSA9IHJlcXVpcmUucmVzb2x2ZShcbiAgJ3JlZmFjdG9yaW5nLWNvZGVtb2RzL2xpYi90cmFuc2Zvcm1lcnMvaW1wb3J0LWRlY2xhcmF0aW9uLXRyYW5zZm9ybScsXG4pO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpbXBvcnREZWNsYXJhdGlvbkNvZGVtb2RSdW5uZXIoXG4gIHJvb3RzLFxuICBwYXRocyxcbiAgdXNlck9wdGlvbnMsXG4pIHtcbiAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBwYXRocyxcbiAgICAuLi5ERUZBVUxUX09QVElPTlMsXG4gICAgLi4udXNlck9wdGlvbnMsXG4gIH07XG4gIGNvbnN0IHJlc3VsdCA9IFJ1bm5lci5ydW4odHJhbnNmb3JtLCByb290cywgb3B0aW9ucyk7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzdWx0KTtcbn1cbiJdfQ==