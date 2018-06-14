(function() {
  var Context, Range, Ripper, d, locator, parse;

  Context = require('./Context');

  parse = require('./parser').parse;

  Range = require('atom').Range;

  locator = require('./util').locator;

  d = (require('./debug'))('js-refactor:ripper');

  module.exports = Ripper = (function() {
    Ripper.locToRange = function(arg) {
      var end, start;
      start = arg.start, end = arg.end;
      return new Range([start.line - 1, start.column], [end.line - 1, end.column]);
    };

    Ripper.scopeNames = ['source.js', 'source.mjs', 'source.js.jsx', 'source.babel'];

    Ripper.prototype.parseOptions = {
      sourceType: 'unambiguous',
      allowImportExportEverywhere: true,
      allowReturnOutsideFunction: true,
      allowSuperOutsideMethod: true,
      plugins: ['*', 'jsx', 'flow', 'flowComments', 'doExpressions', 'objectRestSpread', 'decorators2', 'classProperties', 'classPrivateProperties', 'classPrivateMethods', 'exportDefaultFrom', 'exportNamespaceFrom', 'asyncGenerators', 'functionBind', 'functionSent', 'dynamicImport', 'numericSeparator', 'optionalChaining', 'importMeta', 'bigInt', 'optionalCatchBinding', 'throwExpressions', 'pipelineOperator', 'nullishCoalescingOperator']
    };

    function Ripper() {
      this.context = new Context;
    }

    Ripper.prototype.destruct = function() {
      return delete this.context;
    };

    Ripper.prototype.parse = function(code, callback) {
      var column, err, line, lineNumber, loc, message, rLine, ref;
      try {
        rLine = /.*(?:\r?\n|\n?\r)/g;
        this.locator = locator(code);
        this.parseError = null;
        this.context.setCode(code, this.parseOptions);
        if (callback) {
          return callback();
        }
      } catch (error) {
        err = error;
        ref = this.parseError = err, loc = ref.loc, message = ref.message;
        if ((loc != null) && (message != null)) {
          line = loc.line, column = loc.column;
          lineNumber = line - 1;
          if (callback) {
            return callback([
              {
                range: new Range([lineNumber, column], [lineNumber, column + 1]),
                message: message
              }
            ]);
          }
        } else {
          d('unknown error', err);
          if (callback) {
            return callback();
          }
        }
      }
    };

    Ripper.prototype.find = function(arg) {
      var binding, column, declRange, imported, loc, local, range, ranges, ref, refPaths, row;
      row = arg.row, column = arg.column;
      if (this.parseError != null) {
        return;
      }
      d('find', row, column);
      loc = this.locator(row, column);
      binding = this.context.identify(loc);
      if (!binding) {
        return [];
      }
      declRange = binding.path.isImportSpecifier() ? ((ref = binding.path.node, imported = ref.imported, local = ref.local, ref), range = Ripper.locToRange(local.loc), range.shorthand = local.start === imported.start, !range.shorthand ? range.key = Ripper.locToRange(imported.loc) : void 0, range.delimiter = ' as ', range) : binding.identifier.typeAnnotation ? Ripper.locToRange({
        start: binding.identifier.loc.start,
        end: binding.identifier.typeAnnotation.loc.start
      }) : Ripper.locToRange(binding.identifier.loc);
      declRange.type = 'decl';
      ranges = [declRange];
      refPaths = binding.referencePaths.filter((function(_this) {
        return function(p) {
          return p;
        };
      })(this)).filter((function(_this) {
        return function(p) {
          return !p.isExportDeclaration();
        };
      })(this));
      ranges = ranges.concat(refPaths.map(function(p) {
        var key, ref1, shorthand;
        range = Ripper.locToRange(p.node.loc);
        range.type = 'ref';
        if (p.parentPath.isObjectProperty()) {
          ref1 = p.parentPath.node, key = ref1.key, shorthand = ref1.shorthand;
          range.shorthand = shorthand;
          if (!shorthand) {
            range.key = Ripper.locToRange(key.loc);
          }
          range.delimiter = ': ';
        }
        return range;
      }));
      ranges = ranges.concat(binding.constantViolations.map(function(p) {
        var node;
        node = p.node.left || p.node;
        range = Ripper.locToRange(node.loc);
        range.type = 'mut';
        return range;
      }));
      return ranges;
    };

    return Ripper;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2xpYnJhcnkvRW1iZXIgc2F0ZWxsaXRlIHByb2plY3RzL3dyZWF0aGUtYmFzZS91c3Ivc2hhcmUvYXRvbS9wYWNrYWdlcy9qcy1yZWZhY3Rvci9saWIvcmlwcGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSOztFQUNSLFFBQVUsT0FBQSxDQUFRLFVBQVI7O0VBQ1YsUUFBVSxPQUFBLENBQVEsTUFBUjs7RUFDVixVQUFZLE9BQUEsQ0FBUSxRQUFSOztFQUNkLENBQUEsR0FBSSxDQUFDLE9BQUEsQ0FBUSxTQUFSLENBQUQsQ0FBQSxDQUFvQixvQkFBcEI7O0VBRUosTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUVKLE1BQUMsQ0FBQSxVQUFELEdBQWEsU0FBQyxHQUFEO0FBQ1gsVUFBQTtNQURjLG1CQUFPO2FBQ3JCLElBQUksS0FBSixDQUFVLENBQUUsS0FBSyxDQUFDLElBQU4sR0FBYSxDQUFmLEVBQWtCLEtBQUssQ0FBQyxNQUF4QixDQUFWLEVBQTRDLENBQUUsR0FBRyxDQUFDLElBQUosR0FBVyxDQUFiLEVBQWdCLEdBQUcsQ0FBQyxNQUFwQixDQUE1QztJQURXOztJQUdiLE1BQUMsQ0FBQSxVQUFELEdBQWEsQ0FDWCxXQURXLEVBRVgsWUFGVyxFQUdYLGVBSFcsRUFJWCxjQUpXOztxQkFPYixZQUFBLEdBQ0U7TUFBQSxVQUFBLEVBQVksYUFBWjtNQUNBLDJCQUFBLEVBQTZCLElBRDdCO01BRUEsMEJBQUEsRUFBNEIsSUFGNUI7TUFHQSx1QkFBQSxFQUF5QixJQUh6QjtNQUlBLE9BQUEsRUFBUyxDQUNQLEdBRE8sRUFFUCxLQUZPLEVBSVAsTUFKTyxFQUtQLGNBTE8sRUFNUCxlQU5PLEVBT1Asa0JBUE8sRUFRUCxhQVJPLEVBU1AsaUJBVE8sRUFVUCx3QkFWTyxFQVdQLHFCQVhPLEVBWVAsbUJBWk8sRUFhUCxxQkFi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QjtRQUNSLEtBQUssQ0FBQyxJQUFOLEdBQWE7ZUFDYjtNQUpvRCxDQUEvQixDQUFkO2FBS1Q7SUE3Q0k7Ozs7O0FBL0VSIiwic291cmNlc0NvbnRlbnQiOlsiQ29udGV4dCA9IHJlcXVpcmUgJy4vQ29udGV4dCdcbnsgcGFyc2UgfSA9IHJlcXVpcmUgJy4vcGFyc2VyJ1xueyBSYW5nZSB9ID0gcmVxdWlyZSAnYXRvbSdcbnsgbG9jYXRvciB9ID0gcmVxdWlyZSAnLi91dGlsJ1xuZCA9IChyZXF1aXJlICcuL2RlYnVnJykgJ2pzLXJlZmFjdG9yOnJpcHBlcidcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgUmlwcGVyXG5cbiAgQGxvY1RvUmFuZ2U6ICh7IHN0YXJ0LCBlbmQgfSkgLT5cbiAgICBuZXcgUmFuZ2UgWyBzdGFydC5saW5lIC0gMSwgc3RhcnQuY29sdW1uIF0sIFsgZW5kLmxpbmUgLSAxLCBlbmQuY29sdW1uIF1cblxuICBAc2NvcGVOYW1lczogW1xuICAgICdzb3VyY2UuanMnXG4gICAgJ3NvdXJjZS5tanMnXG4gICAgJ3NvdXJjZS5qcy5qc3gnXG4gICAgJ3NvdXJjZS5iYWJlbCdcbiAgXVxuXG4gIHBhcnNlT3B0aW9uczpcbiAgICBzb3VyY2VUeXBlOiAndW5hbWJpZ3VvdXMnXG4gICAgYWxsb3dJbXBvcnRFeHBvcnRFdmVyeXdoZXJlOiB0cnVlXG4gICAgYWxsb3dSZXR1cm5PdXRzaWRlRnVuY3Rpb246IHRydWVcbiAgICBhbGxvd1N1cGVyT3V0c2lkZU1ldGhvZDogdHJ1ZVxuICAgIHBsdWdpbnM6IFtcbiAgICAgICcqJyAjIHNlZSBodHRwczovL2dpdGh1Yi5jb20vYmFiZWwvYmFiZWwvaXNzdWVzLzc1MDhcbiAgICAgICdqc3gnXG4gICAgICAjICd0eXBlc2NyaXB0J1xuICAgICAgJ2Zsb3cnXG4gICAgICAnZmxvd0NvbW1lbnRzJ1xuICAgICAgJ2RvRXhwcmVzc2lvbnMnXG4gICAgICAnb2JqZWN0UmVzdFNwcmVhZCdcbiAgICAgICdkZWNvcmF0b3JzMidcbiAgICAgICdjbGFzc1Byb3BlcnRpZXMnXG4gICAgICAnY2xhc3NQcml2YXRlUHJvcGVydGllcydcbiAgICAgICdjbGFzc1ByaXZhdGVNZXRob2RzJ1xuICAgICAgJ2V4cG9ydERlZmF1bHRGcm9tJ1xuICAgICAgJ2V4cG9ydE5hbWVzcGFjZUZyb20nXG4gICAgICAnYXN5bmNHZW5lcmF0b3JzJ1xuICAgICAgJ2Z1bmN0aW9uQmluZCdcbiAgICAgICdmdW5jdGlvblNlbnQnXG4gICAgICAnZHluYW1pY0ltcG9ydCdcbiAgICAgICdudW1lcmljU2VwYXJhdG9yJ1xuICAgICAgJ29wdGlvbmFsQ2hhaW5pbmcnXG4gICAgICAnaW1wb3J0TWV0YSdcbiAgICAgICdiaWdJbnQnXG4gICAgICAnb3B0aW9uYWxDYXRjaEJpbmRpbmcnXG4gICAgICAndGhyb3dFeHByZXNzaW9ucydcbiAgICAgICdwaXBlbGluZU9wZXJhdG9yJ1xuICAgICAgJ251bGxpc2hDb2FsZXNjaW5nT3BlcmF0b3InXG4gICAgXVxuXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBjb250ZXh0ID0gbmV3IENvbnRleHRcblxuICBkZXN0cnVjdDogLT5cbiAgICBkZWxldGUgQGNvbnRleHRcblxuICBwYXJzZTogKGNvZGUsIGNhbGxiYWNrKSAtPlxuICAgIHRyeVxuICAgICAgIyBkICdwYXJzZScsIGNvZGVcbiAgICAgIHJMaW5lID0gLy4qKD86XFxyP1xcbnxcXG4/XFxyKS9nXG4gICAgICBAbG9jYXRvciA9IGxvY2F0b3IoY29kZSlcbiAgICAgIEBwYXJzZUVycm9yID0gbnVsbFxuICAgICAgQGNvbnRleHQuc2V0Q29kZSBjb2RlLCBAcGFyc2VPcHRpb25zXG4gICAgICBjYWxsYmFjaygpIGlmIGNhbGxiYWNrXG4gICAgY2F0Y2ggZXJyXG4gICAgICB7IGxvYywgbWVzc2FnZSB9ID0gQHBhcnNlRXJyb3IgPSBlcnJcbiAgICAgIGlmIGxvYz8gYW5kIG1lc3NhZ2U/XG4gICAgICAgIHsgbGluZSwgY29sdW1uIH0gPSBsb2NcbiAgICAgICAgbGluZU51bWJlciA9IGxpbmUgLSAxXG4gICAgICAgIGNhbGxiYWNrIFtcbiAgICAgICAgICByYW5nZSAgOiBuZXcgUmFuZ2UgW2xpbmVOdW1iZXIsIGNvbHVtbl0sIFtsaW5lTnVtYmVyLCBjb2x1bW4gKyAxXVxuICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2VcbiAgICAgICAgXSBpZiBjYWxsYmFja1xuICAgICAgZWxzZVxuICAgICAgICBkICd1bmtub3duIGVycm9yJywgZXJyXG4gICAgICAgIGNhbGxiYWNrKCkgaWYgY2FsbGJhY2tcblxuICBmaW5kOiAoeyByb3csIGNvbHVtbiB9KSAtPlxuICAgIHJldHVybiBpZiBAcGFyc2VFcnJvcj9cbiAgICBkICdmaW5kJywgcm93LCBjb2x1bW5cblxuICAgIGxvYyA9IEBsb2NhdG9yIHJvdywgY29sdW1uXG4gICAgYmluZGluZyA9IEBjb250ZXh0LmlkZW50aWZ5IGxvY1xuICAgIHJldHVybiBbXSB1bmxlc3MgYmluZGluZ1xuXG4gICAgZGVjbFJhbmdlID1cbiAgICAgIGlmIGJpbmRpbmcucGF0aC5pc0ltcG9ydFNwZWNpZmllcigpXG4gICAgICAgIHsgaW1wb3J0ZWQsIGxvY2FsIH0gPSBiaW5kaW5nLnBhdGgubm9kZVxuICAgICAgICByYW5nZSA9IFJpcHBlci5sb2NUb1JhbmdlIGxvY2FsLmxvY1xuICAgICAgICByYW5nZS5zaG9ydGhhbmQgPSBsb2NhbC5zdGFydCA9PSBpbXBvcnRlZC5zdGFydFxuICAgICAgICByYW5nZS5rZXkgPSBSaXBwZXIubG9jVG9SYW5nZSBpbXBvcnRlZC5sb2MgaWYgbm90IHJhbmdlLnNob3J0aGFuZFxuICAgICAgICByYW5nZS5kZWxpbWl0ZXIgPSAnIGFzICdcbiAgICAgICAgcmFuZ2VcbiAgICAgIGVsc2UgaWYgYmluZGluZy5pZGVudGlmaWVyLnR5cGVBbm5vdGF0aW9uXG4gICAgICAgIFJpcHBlci5sb2NUb1JhbmdlXG4gICAgICAgICAgc3RhcnQ6IGJpbmRpbmcuaWRlbnRpZmllci5sb2Muc3RhcnRcbiAgICAgICAgICBlbmQ6ICAgYmluZGluZy5pZGVudGlmaWVyLnR5cGVBbm5vdGF0aW9uLmxvYy5zdGFydFxuICAgICAgZWxzZVxuICAgICAgICBSaXBwZXIubG9jVG9SYW5nZSBiaW5kaW5nLmlkZW50aWZpZXIubG9jXG4gICAgZGVjbFJhbmdlLnR5cGUgPSAnZGVjbCdcblxuICAgIHJhbmdlcyA9IFtkZWNsUmFuZ2VdXG5cbiAgICByZWZQYXRocyA9IGJpbmRpbmcucmVmZXJlbmNlUGF0aHNcbiAgICAgIC5maWx0ZXIgKHApID0+IHAgICMgZmlsdGVyIHVuZGVmaW5lZCBmb3IgSW1wb3J0RGVmYXVsdFxuICAgICAgLmZpbHRlciAocCkgPT4gIXAuaXNFeHBvcnREZWNsYXJhdGlvbigpICAjIGZpbHRlciBleHBvcnRzXG5cbiAgICByYW5nZXMgPSByYW5nZXMuY29uY2F0IHJlZlBhdGhzLm1hcCAocCkgLT5cbiAgICAgIHJhbmdlID0gUmlwcGVyLmxvY1RvUmFuZ2UgcC5ub2RlLmxvY1xuICAgICAgcmFuZ2UudHlwZSA9ICdyZWYnXG4gICAgICBpZiBwLnBhcmVudFBhdGguaXNPYmplY3RQcm9wZXJ0eSgpXG4gICAgICAgIHsga2V5LCBzaG9ydGhhbmQgfSA9IHAucGFyZW50UGF0aC5ub2RlXG4gICAgICAgIHJhbmdlLnNob3J0aGFuZCA9IHNob3J0aGFuZFxuICAgICAgICByYW5nZS5rZXkgPSBSaXBwZXIubG9jVG9SYW5nZSBrZXkubG9jIGlmIG5vdCBzaG9ydGhhbmRcbiAgICAgICAgcmFuZ2UuZGVsaW1pdGVyID0gJzogJ1xuICAgICAgcmFuZ2VcblxuICAgIHJhbmdlcyA9IHJhbmdlcy5jb25jYXQgYmluZGluZy5jb25zdGFudFZpb2xhdGlvbnMubWFwIChwKSAtPlxuICAgICAgbm9kZSA9IHAubm9kZS5sZWZ0IHx8IHAubm9kZVxuICAgICAgcmFuZ2UgPSBSaXBwZXIubG9jVG9SYW5nZSBub2RlLmxvY1xuICAgICAgcmFuZ2UudHlwZSA9ICdtdXQnXG4gICAgICByYW5nZVxuICAgIHJhbmdlc1xuIl19
