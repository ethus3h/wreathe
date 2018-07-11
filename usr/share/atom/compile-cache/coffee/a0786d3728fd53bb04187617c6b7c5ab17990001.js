(function() {
  var FailureTree, _, coffeestack, path, sourceMaps,
    slice = [].slice;

  path = require('path');

  _ = require('underscore');

  coffeestack = require('coffeestack');

  sourceMaps = {};

  module.exports = FailureTree = (function() {
    FailureTree.prototype.suites = null;

    function FailureTree() {
      this.suites = [];
    }

    FailureTree.prototype.isEmpty = function() {
      return this.suites.length === 0;
    };

    FailureTree.prototype.add = function(spec) {
      var base, base1, failure, failurePath, i, item, j, len, len1, name, name1, parent, parentSuite, ref, results;
      ref = spec.results().items_;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
        if (!(item.passed_ === false)) {
          continue;
        }
        failurePath = [];
        parent = spec.suite;
        while (parent) {
          failurePath.unshift(parent);
          parent = parent.parentSuite;
        }
        parentSuite = this;
        for (j = 0, len1 = failurePath.length; j < len1; j++) {
          failure = failurePath[j];
          if ((base = parentSuite.suites)[name = failure.id] == null) {
            base[name] = {
              spec: failure,
              suites: [],
              specs: []
            };
          }
          parentSuite = parentSuite.suites[failure.id];
        }
        if ((base1 = parentSuite.specs)[name1 = spec.id] == null) {
          base1[name1] = {
            spec: spec,
            failures: []
          };
        }
        parentSuite.specs[spec.id].failures.push(item);
        results.push(this.filterStackTrace(item));
      }
      return results;
    };

    FailureTree.prototype.filterJasmineLines = function(stackTraceLines) {
      var index, jasminePattern, results;
      jasminePattern = /^\s*at\s+.*\(?.*[\\\/]jasmine(-[^\\\/]*)?\.js:\d+:\d+\)?\s*$/;
      index = 0;
      results = [];
      while (index < stackTraceLines.length) {
        if (jasminePattern.test(stackTraceLines[index])) {
          results.push(stackTraceLines.splice(index, 1));
        } else {
          results.push(index++);
        }
      }
      return results;
    };

    FailureTree.prototype.filterTrailingTimersLine = function(stackTraceLines) {
      if (/^(\s*at .* )\(timers\.js:\d+:\d+\)/.test(_.last(stackTraceLines))) {
        return stackTraceLines.pop();
      }
    };

    FailureTree.prototype.filterSetupLines = function(stackTraceLines) {
      var index, removeLine, results;
      removeLine = false;
      index = 0;
      results = [];
      while (index < stackTraceLines.length) {
        removeLine || (removeLine = /^\s*at Object\.jasmine\.executeSpecsInFolder/.test(stackTraceLines[index]));
        if (removeLine) {
          results.push(stackTraceLines.splice(index, 1));
        } else {
          results.push(index++);
        }
      }
      return results;
    };

    FailureTree.prototype.filterFailureMessageLine = function(failure, stackTraceLines) {
      var errorLines, message, stackTraceErrorMessage;
      errorLines = [];
      while (stackTraceLines.length > 0) {
        if (/^\s+at\s+.*\((.*):(\d+):(\d+)\)\s*$/.test(stackTraceLines[0])) {
          break;
        } else {
          errorLines.push(stackTraceLines.shift());
        }
      }
      stackTraceErrorMessage = errorLines.join('\n');
      message = failure.message;
      if (stackTraceErrorMessage !== message && stackTraceErrorMessage !== ("Error: " + message)) {
        return stackTraceLines.splice.apply(stackTraceLines, [0, 0].concat(slice.call(errorLines)));
      }
    };

    FailureTree.prototype.filterOriginLine = function(failure, stackTraceLines) {
      var column, filePath, line, match;
      if (stackTraceLines.length !== 1) {
        return stackTraceLines;
      }
      if (match = /^\s*at\s+((\[object Object\])|(null))\.<anonymous>\s+\((.*):(\d+):(\d+)\)\s*$/.exec(stackTraceLines[0])) {
        stackTraceLines.shift();
        filePath = path.relative(process.cwd(), match[4]);
        line = match[5];
        column = match[6];
        return failure.messageLine = filePath + ":" + line + ":" + column;
      }
    };

    FailureTree.prototype.filterStackTrace = function(failure) {
      var stackTrace, stackTraceLines;
      stackTrace = failure.trace.stack;
      if (!stackTrace) {
        return;
      }
      stackTraceLines = stackTrace.split('\n').filter(function(line) {
        return line;
      });
      this.filterJasmineLines(stackTraceLines);
      this.filterTrailingTimersLine(stackTraceLines);
      this.filterSetupLines(stackTraceLines);
      stackTrace = coffeestack.convertStackTrace(stackTraceLines.join('\n'), sourceMaps);
      if (!stackTrace) {
        return;
      }
      stackTraceLines = stackTrace.split('\n').filter(function(line) {
        return line;
      });
      this.filterFailureMessageLine(failure, stackTraceLines);
      this.filterOriginLine(failure, stackTraceLines);
      return failure.filteredStackTrace = stackTraceLines.join('\n');
    };

    FailureTree.prototype.forEachSpec = function(arg, callback, depth) {
      var child, failure, failures, i, j, k, len, len1, len2, ref, ref1, ref2, results, results1, spec, specs, suites;
      ref = arg != null ? arg : {}, spec = ref.spec, suites = ref.suites, specs = ref.specs, failures = ref.failures;
      if (depth == null) {
        depth = 0;
      }
      if (failures != null) {
        callback(spec, null, depth);
        results = [];
        for (i = 0, len = failures.length; i < len; i++) {
          failure = failures[i];
          results.push(callback(spec, failure, depth));
        }
        return results;
      } else {
        callback(spec, null, depth);
        depth++;
        ref1 = _.compact(suites);
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          child = ref1[j];
          this.forEachSpec(child, callback, depth);
        }
        ref2 = _.compact(specs);
        results1 = [];
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          child = ref2[k];
          results1.push(this.forEachSpec(child, callback, depth));
        }
        return results1;
      }
    };

    FailureTree.prototype.forEach = function(callback) {
      var i, len, ref, results, suite;
      ref = _.compact(this.suites);
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        suite = ref[i];
        results.push(this.forEachSpec(suite, callback));
      }
      return results;
    };

    return FailureTree;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL3Vzci9saWI2NC9hdG9tL2FwcC5hc2FyL25vZGVfbW9kdWxlcy9qYXNtaW5lLW5vZGUvbGliL2phc21pbmUtbm9kZS9mYWlsdXJlLXRyZWUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSw2Q0FBQTtJQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCxDQUFBLEdBQUksT0FBQSxDQUFRLFlBQVI7O0VBQ0osV0FBQSxHQUFjLE9BQUEsQ0FBUSxhQUFSOztFQUVkLFVBQUEsR0FBYTs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUNNOzBCQUNKLE1BQUEsR0FBUTs7SUFFSyxxQkFBQTtNQUNYLElBQUMsQ0FBQSxNQUFELEdBQVU7SUFEQzs7MEJBR2IsT0FBQSxHQUFTLFNBQUE7YUFBRyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsS0FBa0I7SUFBckI7OzBCQUVULEdBQUEsR0FBSyxTQUFDLElBQUQ7QUFDSCxVQUFBO0FBQUE7QUFBQTtXQUFBLHFDQUFBOztjQUF1QyxJQUFJLENBQUMsT0FBTCxLQUFnQjs7O1FBQ3JELFdBQUEsR0FBYztRQUNkLE1BQUEsR0FBUyxJQUFJLENBQUM7QUFDZCxlQUFNLE1BQU47VUFDRSxXQUFXLENBQUMsT0FBWixDQUFvQixNQUFwQjtVQUNBLE1BQUEsR0FBUyxNQUFNLENBQUM7UUFGbEI7UUFJQSxXQUFBLEdBQWM7QUFDZCxhQUFBLCtDQUFBOzs7eUJBQ29DO2NBQUMsSUFBQSxFQUFNLE9BQVA7Y0FBZ0IsTUFBQSxFQUFRLEVBQXhCO2NBQTRCLEtBQUEsRUFBTyxFQUFuQzs7O1VBQ2xDLFdBQUEsR0FBYyxXQUFXLENBQUMsTUFBTyxDQUFBLE9BQU8sQ0FBQyxFQUFSO0FBRm5DOzt5QkFJOEI7WUFBQyxNQUFBLElBQUQ7WUFBTyxRQUFBLEVBQVMsRUFBaEI7OztRQUM5QixXQUFXLENBQUMsS0FBTSxDQUFBLElBQUksQ0FBQyxF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QUFBO0FBQ0E7QUFBQTthQUFBLHdDQUFBOzt3QkFBQSxJQUFDLENBQUEsV0FBRCxDQUFhLEtBQWIsRUFBb0IsUUFBcEIsRUFBOEIsS0FBOUI7QUFBQTt3QkFQRjs7SUFEVzs7MEJBVWIsT0FBQSxHQUFTLFNBQUMsUUFBRDtBQUNQLFVBQUE7QUFBQTtBQUFBO1dBQUEscUNBQUE7O3FCQUFBLElBQUMsQ0FBQSxXQUFELENBQWEsS0FBYixFQUFvQixRQUFwQjtBQUFBOztJQURPOzs7OztBQTdHWCIsInNvdXJjZXNDb250ZW50IjpbInBhdGggPSByZXF1aXJlICdwYXRoJ1xuXG5fID0gcmVxdWlyZSAndW5kZXJzY29yZSdcbmNvZmZlZXN0YWNrID0gcmVxdWlyZSAnY29mZmVlc3RhY2snXG5cbnNvdXJjZU1hcHMgPSB7fVxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBGYWlsdXJlVHJlZVxuICBzdWl0ZXM6IG51bGxcblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAc3VpdGVzID0gW11cblxuICBpc0VtcHR5OiAtPiBAc3VpdGVzLmxlbmd0aCBpcyAwXG5cbiAgYWRkOiAoc3BlYykgLT5cbiAgICBmb3IgaXRlbSBpbiBzcGVjLnJlc3VsdHMoKS5pdGVtc18gd2hlbiBpdGVtLnBhc3NlZF8gaXMgZmFsc2VcbiAgICAgIGZhaWx1cmVQYXRoID0gW11cbiAgICAgIHBhcmVudCA9IHNwZWMuc3VpdGVcbiAgICAgIHdoaWxlIHBhcmVudFxuICAgICAgICBmYWlsdXJlUGF0aC51bnNoaWZ0KHBhcmVudClcbiAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudFN1aXRlXG5cbiAgICAgIHBhcmVudFN1aXRlID0gdGhpc1xuICAgICAgZm9yIGZhaWx1cmUgaW4gZmFpbHVyZVBhdGhcbiAgICAgICAgcGFyZW50U3VpdGUuc3VpdGVzW2ZhaWx1cmUuaWRdID89IHtzcGVjOiBmYWlsdXJlLCBzdWl0ZXM6IFtdLCBzcGVjczogW119XG4gICAgICAgIHBhcmVudFN1aXRlID0gcGFyZW50U3VpdGUuc3VpdGVzW2ZhaWx1cmUuaWRdXG5cbiAgICAgIHBhcmVudFN1aXRlLnNwZWNzW3NwZWMuaWRdID89IHtzcGVjLCBmYWlsdXJlczpbXX1cbiAgICAgIHBhcmVudFN1aXRlLnNwZWNzW3NwZWMuaWRdLmZhaWx1cmVzLnB1c2goaXRlbSlcbiAgICAgIEBmaWx0ZXJTdGFja1RyYWNlKGl0ZW0pXG5cbiAgZmlsdGVySmFzbWluZUxpbmVzOiAoc3RhY2tUcmFjZUxpbmVzKSAtPlxuICAgIGphc21pbmVQYXR0ZXJuID0gL15cXHMqYXRcXHMrLipcXCg/LipbXFxcXC9damFzbWluZSgtW15cXFxcL10qKT9cXC5qczpcXGQrOlxcZCtcXCk/XFxzKiQvXG5cbiAgICBpbmRleCA9IDBcbiAgICB3aGlsZSBpbmRleCA8IHN0YWNrVHJhY2VMaW5lcy5sZW5ndGhcbiAgICAgIGlmIGphc21pbmVQYXR0ZXJuLnRlc3Qoc3RhY2tUcmFjZUxpbmVzW2luZGV4XSlcbiAgICAgICAgc3RhY2tUcmFjZUxpbmVzLnNwbGljZShpbmRleCwgMSlcbiAgICAgIGVsc2VcbiAgICAgICAgaW5kZXgrK1xuXG4gIGZpbHRlclRyYWlsaW5nVGltZXJzTGluZTogKHN0YWNrVHJhY2VMaW5lcykgLT5cbiAgICBpZiAoL14oXFxzKmF0IC4qIClcXCh0aW1lcnNcXC5qczpcXGQrOlxcZCtcXCkvLnRlc3QoXy5sYXN0KHN0YWNrVHJhY2VMaW5lcykpKVxuICAgICAgc3RhY2tUcmFjZUxpbmVzLnBvcCgpXG5cbiAgZmlsdGVyU2V0dXBMaW5lczogKHN0YWNrVHJhY2VMaW5lcykgLT5cbiAgICAjIElnbm9yZSBhbGwgbGluZXMgc3RhcnRpbmcgYXQgdGhlIGZpcnN0IGNhbGwgdG8gT2JqZWN0Lmphc21pbmUuZXhlY3V0ZVNwZWNzSW5Gb2xkZXIoKVxuICAgIHJlbW92ZUxpbmUgPSBmYWxzZVxuICAgIGluZGV4ID0gMFxuICAgIHdoaWxlIGluZGV4IDwgc3RhY2tUcmFjZUxpbmVzLmxlbmd0aFxuICAgICAgcmVtb3ZlTGluZSBvcj0gL15cXHMqYXQgT2JqZWN0XFwuamFzbWluZVxcLmV4ZWN1dGVTcGVjc0luRm9sZGVyLy50ZXN0KHN0YWNrVHJhY2VMaW5lc1tpbmRleF0pXG4gICAgICBpZiByZW1vdmVMaW5lXG4gICAgICAgIHN0YWNrVHJhY2VMaW5lcy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICBlbHNlXG4gICAgICAgIGluZGV4KytcblxuICBmaWx0ZXJGYWlsdXJlTWVzc2FnZUxpbmU6IChmYWlsdXJlLCBzdGFja1RyYWNlTGluZXMpIC0+XG4gICAgIyBSZW1vdmUgaW5pdGlhbCBsaW5lKHMpIHdoZW4gdGhleSBtYXRjaCB0aGUgZmFpbHVyZSBtZXNzYWdlXG4gICAgZXJyb3JMaW5lcyA9IFtdXG4gICAgd2hpbGUgc3RhY2tUcmFjZUxpbmVzLmxlbmd0aCA+IDBcbiAgICAgIGlmIC9eXFxzK2F0XFxzKy4qXFwoKC4qKTooXFxkKyk6KFxcZCspXFwpXFxzKiQvLnRlc3Qoc3RhY2tUcmFjZUxpbmVzWzBdKVxuICAgICAgICBicmVha1xuICAgICAgZWxzZVxuICAgICAgICBlcnJvckxpbmVzLnB1c2goc3RhY2tUcmFjZUxpbmVzLnNoaWZ0KCkpXG5cbiAgICBzdGFja1RyYWNlRXJyb3JNZXNzYWdlID0gZXJyb3JMaW5lcy5qb2luKCdcXG4nKVxuICAgIHttZXNzYWdlfSA9IGZhaWx1cmVcbiAgICBpZiBzdGFja1RyYWNlRXJyb3JNZXNzYWdlIGlzbnQgbWVzc2FnZSBhbmQgc3RhY2tUcmFjZUVycm9yTWVzc2FnZSBpc250IFwiRXJyb3I6ICN7bWVzc2FnZX1cIlxuICAgICAgc3RhY2tUcmFjZUxpbmVzLnNwbGljZSgwLCAwLCBlcnJvckxpbmVzLi4uKVxuXG4gIGZpbHRlck9yaWdpbkxpbmU6IChmYWlsdXJlLCBzdGFja1RyYWNlTGluZXMpIC0+XG4gICAgcmV0dXJuIHN0YWNrVHJhY2VMaW5lcyB1bmxlc3Mgc3RhY2tUcmFjZUxpbmVzLmxlbmd0aCBpcyAxXG5cbiAgICAjIFJlbW92ZSByZW1haW5pbmcgbGluZSBpZiBpdCBpcyBmcm9tIGFuIGFub255bW91cyBmdW5jdGlvblxuICAgIGlmIG1hdGNoID0gL15cXHMqYXRcXHMrKChcXFtvYmplY3QgT2JqZWN0XFxdKXwobnVsbCkpXFwuPGFub255bW91cz5cXHMrXFwoKC4qKTooXFxkKyk6KFxcZCspXFwpXFxzKiQvLmV4ZWMoc3RhY2tUcmFjZUxpbmVzWzBdKVxuICAgICAgc3RhY2tUcmFjZUxpbmVzLnNoaWZ0KClcbiAgICAgIGZpbGVQYXRoID0gcGF0aC5yZWxhdGl2ZShwcm9jZXNzLmN3ZCgpLCBtYXRjaFs0XSlcbiAgICAgIGxpbmUgPSBtYXRjaFs1XVxuICAgICAgY29sdW1uID0gbWF0Y2hbNl1cbiAgICAgIGZhaWx1cmUubWVzc2FnZUxpbmUgPSBcIiN7ZmlsZVBhdGh9OiN7bGluZX06I3tjb2x1bW59XCJcblxuICBmaWx0ZXJTdGFja1RyYWNlOiAoZmFpbHVyZSkgLT5cbiAgICBzdGFja1RyYWNlID0gZmFpbHVyZS50cmFjZS5zdGFja1xuICAgIHJldHVybiB1bmxlc3Mgc3RhY2tUcmFjZVxuXG4gICAgc3RhY2tUcmFjZUxpbmVzID0gc3RhY2tUcmFjZS5zcGxpdCgnXFxuJykuZmlsdGVyIChsaW5lKSAtPiBsaW5lXG4gICAgQGZpbHRlckphc21pbmVMaW5lcyhzdGFja1RyYWNlTGluZXMpXG4gICAgQGZpbHRlclRyYWlsaW5nVGltZXJzTGluZShzdGFja1RyYWNlTGluZXMpXG4gICAgQGZpbHRlclNldHVwTGluZXMoc3RhY2tUcmFjZUxpbmVzKVxuICAgIHN0YWNrVHJhY2UgPSBjb2ZmZWVzdGFjay5jb252ZXJ0U3RhY2tUcmFjZShzdGFja1RyYWNlTGluZXMuam9pbignXFxuJyksIHNvdXJjZU1hcHMpXG4gICAgcmV0dXJuIHVubGVzcyBzdGFja1RyYWNlXG5cbiAgICBzdGFja1RyYWNlTGluZXMgPSBzdGFja1RyYWNlLnNwbGl0KCdcXG4nKS5maWx0ZXIgKGxpbmUpIC0+IGxpbmVcbiAgICBAZmlsdGVyRmFpbHVyZU1lc3NhZ2VMaW5lKGZhaWx1cmUsIHN0YWNrVHJhY2VMaW5lcylcbiAgICBAZmlsdGVyT3JpZ2luTGluZShmYWlsdXJlLCBzdGFja1RyYWNlTGluZXMpXG4gICAgZmFpbHVyZS5maWx0ZXJlZFN0YWNrVHJhY2UgPSBzdGFja1RyYWNlTGluZXMuam9pbignXFxuJylcblxuICBmb3JFYWNoU3BlYzogKHtzcGVjLCBzdWl0ZXMsIHNwZWNzLCBmYWlsdXJlc309e30sIGNhbGxiYWNrLCBkZXB0aD0wKSAtPlxuICAgIGlmIGZhaWx1cmVzP1xuICAgICAgY2FsbGJhY2soc3BlYywgbnVsbCwgZGVwdGgpXG4gICAgICBjYWxsYmFjayhzcGVjLCBmYWlsdXJlLCBkZXB0aCkgZm9yIGZhaWx1cmUgaW4gZmFpbHVyZXNcbiAgICBlbHNlXG4gICAgICBjYWxsYmFjayhzcGVjLCBudWxsLCBkZXB0aClcbiAgICAgIGRlcHRoKytcbiAgICAgIEBmb3JFYWNoU3BlYyhjaGlsZCwgY2FsbGJhY2ssIGRlcHRoKSBmb3IgY2hpbGQgaW4gXy5jb21wYWN0KHN1aXRlcylcbiAgICAgIEBmb3JFYWNoU3BlYyhjaGlsZCwgY2FsbGJhY2ssIGRlcHRoKSBmb3IgY2hpbGQgaW4gXy5jb21wYWN0KHNwZWNzKVxuXG4gIGZvckVhY2g6IChjYWxsYmFjaykgLT5cbiAgICBAZm9yRWFjaFNwZWMoc3VpdGUsIGNhbGxiYWNrKSBmb3Igc3VpdGUgaW4gXy5jb21wYWN0KEBzdWl0ZXMpXG4iXX0=
