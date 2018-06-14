(function() {
  var CompositeDisposable, Watcher, d,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CompositeDisposable = require('atom').CompositeDisposable;

  d = (require('./debug'))('refactor:watcher');

  module.exports = Watcher = (function() {
    function Watcher(moduleManager, editor) {
      this.moduleManager = moduleManager;
      this.editor = editor;
      this.onCursorMovedAfter = bind(this.onCursorMovedAfter, this);
      this.onCursorMoved = bind(this.onCursorMoved, this);
      this.onBufferChanged = bind(this.onBufferChanged, this);
      this.abort = bind(this.abort, this);
      this.createErrors = bind(this.createErrors, this);
      this.onParseEnd = bind(this.onParseEnd, this);
      this.update = bind(this.update, this);
      this.parse = bind(this.parse, this);
      this.verifyGrammar = bind(this.verifyGrammar, this);
      this.dispose = bind(this.dispose, this);
      this.disposables = new CompositeDisposable;
      this.disposables.add(this.editor.onDidStopChanging(this.onBufferChanged));
      this.disposables.add(this.editor.onDidChangeCursorPosition(this.onCursorMoved));
      this.disposables.add(this.moduleManager.onActivated(this.verifyGrammar));
      this.verifyGrammar();
    }

    Watcher.prototype.dispose = function() {
      this.deactivate();
      this.disposables.dispose();
      this.moduleManager = null;
      this.editor = null;
      return this.module = null;
    };


    /*
    Grammar valification process
    1. Detect grammar changed.
    2. Destroy instances and listeners.
    3. Exit process when the language plugin of the grammar can't be found.
    4. Create instances and listeners.
     */

    Watcher.prototype.verifyGrammar = function() {
      var module, scopeName;
      scopeName = this.editor.getGrammar().scopeName;
      module = this.moduleManager.getModule(scopeName);
      d('verify grammar', scopeName, module);
      if (module === this.module) {
        return;
      }
      this.deactivate();
      if (module == null) {
        return;
      }
      this.module = module;
      return this.activate();
    };

    Watcher.prototype.activate = function() {
      this.ripper = new this.module.Ripper();
      this.eventCursorMoved = true;
      this.eventBufferChanged = true;
      d('activate and parse');
      return this.parse();
    };

    Watcher.prototype.deactivate = function() {
      var base;
      d('deactivate');
      if (this.ripper != null) {
        if (typeof (base = this.ripper).dispose === "function") {
          base.dispose();
        }
        this.ripper = null;
      }
      this.cursorMoved = false;
      this.eventCursorMoved = false;
      this.eventBufferChanged = false;
      clearTimeout(this.cursorMovedTimeoutId);
      this.cursorMovedTimeoutId = null;
      this.module = null;
      this.renamingCursor = null;
      return this.renamingMarkers = null;
    };


    /*
    Reference finder process
    1. Stop listening cursor move event and reset views.
    2. Parse.
    3. Show errors and exit process when compile error is thrown.
    4. Show references.
    5. Start listening cursor move event.
     */

    Watcher.prototype.parse = function() {
      var text;
      d('parse');
      this.eventCursorMoved = false;
      text = this.editor.buffer.getText();
      if (text !== this.cachedText) {
        this.destroyReferences();
        this.destroyErrors();
        this.cachedText = text;
        this.ripper.parse(text, this.onParseEnd);
      }
      return this.eventCursorMoved = true;
    };

    Watcher.prototype.update = function(changes) {
      var change, i, len, results;
      if (changes.length === 0) {
        return;
      }
      if (typeof this.ripper.update !== 'function') {
        return this.parse();
      } else {
        results = [];
        for (i = 0, len = changes.length; i < len; i++) {
          change = changes[i];
          results.push(this.ripper.update(change));
        }
        return results;
      }
    };

    Watcher.prototype.onParseEnd = function(errors) {
      d('onParseEnd');
      if (errors != null) {
        return this.createErrors(errors);
      } else {
        return this.createReferences();
      }
    };

    Watcher.prototype.destroyErrors = function() {
      var i, len, marker, ref;
      d('destroy errors');
      if (this.errorMarkers == null) {
        return;
      }
      ref = this.errorMarkers;
      for (i = 0, len = ref.length; i < len; i++) {
        marker = ref[i];
        marker.destroy();
      }
      return this.errorMarkers = null;
    };

    Watcher.prototype.createErrors = function(errors) {
      var marker, message, range;
      d('create errors');
      return this.errorMarkers = (function() {
        var i, len, ref, results;
        results = [];
        for (i = 0, len = errors.length; i < len; i++) {
          ref = errors[i], range = ref.range, message = ref.message;
          marker = this.editor.markBufferRange(range);
          d('marker', range, marker);
          this.editor.decorateMarker(marker, {
            type: 'highlight',
            "class": 'refactor-error'
          });
          this.editor.decorateMarker(marker, {
            type: 'line-number',
            "class": 'refactor-error'
          });
          results.push(marker);
        }
        return results;
      }).call(this);
    };

    Watcher.prototype.destroyReferences = function() {
      var i, len, marker, ref;
      d('destroyReferences');
      if (this.referenceMarkers == null) {
        return;
      }
      ref = this.referenceMarkers;
      for (i = 0, len = ref.length; i < len; i++) {
        marker = ref[i];
        marker.destroy();
      }
      return delete this.referenceMarkers;
    };

    Watcher.prototype.createReferences = function() {
      var cls, marker, range, ranges;
      d('createReferences');
      ranges = this.ripper.find(this.editor.getSelectedBufferRange().start);
      if (!((ranges != null) && ranges.length > 0)) {
        return;
      }
      return this.referenceMarkers = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = ranges.length; i < len; i++) {
          range = ranges[i];
          marker = this.editor.markBufferRange(range);
          cls = range.type ? 'refactor-' + range.type : 'refactor-reference';
          this.editor.decorateMarker(marker, {
            type: 'highlight',
            "class": cls
          });
          results.push(marker);
        }
        return results;
      }).call(this);
    };


    /*
    Renaming life cycle.
    1. When detected rename command, start renaming process.
    2. When the cursors move out from the symbols, abort and exit renaming process.
    3. When detected done command, exit renaming process.
     */

    Watcher.prototype.rename = function() {
      var cursor, i, j, key, len, len1, marker, origin, range, ranges, ref, ref1, start, text;
      if (!this.isActive()) {
        return false;
      }
      cursor = this.editor.getLastCursor();
      ranges = this.ripper.find(cursor.getBufferPosition());
      if (!((ranges != null) && ranges.length > 0)) {
        return false;
      }
      this.destroyReferences();
      this.eventBufferChanged = false;
      this.eventCursorMoved = false;
      this.renamingCursor = cursor.getBufferPosition();
      this.renamingMarkers = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = ranges.length; i < len; i++) {
          range = ranges[i];
          marker = this.editor.markBufferRange(range);
          marker.shorthand = range.shorthand;
          marker.delimiter = range.delimiter;
          if (range.key) {
            marker.key = this.editor.markBufferRange(range.key);
          }
          this.editor.decorateMarker(marker, {
            type: 'highlight',
            "class": 'refactor-reference'
          });
          results.push(marker);
        }
        return results;
      }).call(this);
      ref = this.renamingMarkers;
      for (i = 0, len = ref.length; i < len; i++) {
        marker = ref[i];
        if (marker.shorthand) {
          range = marker.getBufferRange();
          origin = this.editor.markBufferRange(range, {
            invalidate: 'inside'
          });
          text = this.editor.getTextInBufferRange(range);
          start = range.start;
          this.editor.setTextInBufferRange([start, start], marker.delimiter, {
            undo: 'skip'
          });
          key = this.editor.setTextInBufferRange([start, start], text);
          marker.key = this.editor.markBufferRange(key);
          marker.setBufferRange(origin.getBufferRange());
        }
      }
      ref1 = this.renamingMarkers;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        marker = ref1[j];
        this.editor.addSelectionForBufferRange(marker.getBufferRange());
      }
      this.eventCursorMoved = 'abort';
      return true;
    };

    Watcher.prototype.abort = function(event) {
      var i, isMarkerContainsCursor, isMarkersContainsCursors, j, k, len, len1, len2, marker, markerRange, ref, ref1, selectedRange, selectedRanges;
      if (!(this.isActive() && (this.renamingCursor != null) && (this.renamingMarkers != null))) {
        return;
      }
      d('move cursor from', event.oldBufferPosition, 'to', event.newBufferPosition);
      ref = this.renamingMarkers;
      for (i = 0, len = ref.length; i < len; i++) {
        marker = ref[i];
        if (marker.getBufferRange().containsPoint(event.newBufferPosition)) {
          return;
        }
      }
      this.done();
      return;
      selectedRanges = this.editor.getSelectedBufferRanges();
      isMarkersContainsCursors = true;
      ref1 = this.renamingMarkers;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        marker = ref1[j];
        markerRange = marker.getBufferRange();
        isMarkerContainsCursor = false;
        for (k = 0, len2 = selectedRanges.length; k < len2; k++) {
          selectedRange = selectedRanges[k];
          isMarkerContainsCursor || (isMarkerContainsCursor = markerRange.containsRange(selectedRange));
          if (isMarkerContainsCursor) {
            break;
          }
        }
        isMarkersContainsCursors && (isMarkersContainsCursors = isMarkerContainsCursor);
        if (!isMarkersContainsCursors) {
          break;
        }
      }
      if (isMarkersContainsCursors) {
        return;
      }
      return this.done();
    };

    Watcher.prototype.done = function() {
      var i, key, len, marker, ref, value;
      d('done');
      if (!(this.isActive() && (this.renamingCursor != null) && (this.renamingMarkers != null))) {
        return false;
      }
      this.eventCursorMoved = false;
      this.editor.setCursorBufferPosition(this.renamingCursor);
      delete this.renamingCursor;
      ref = this.renamingMarkers;
      for (i = 0, len = ref.length; i < len; i++) {
        marker = ref[i];
        if (marker.key) {
          key = this.editor.getTextInBufferRange(marker.key.getBufferRange());
          value = this.editor.getTextInBufferRange(marker.getBufferRange());
          if (key === value) {
            this.editor.setTextInBufferRange([marker.key.getStartBufferPosition(), marker.getStartBufferPosition()], '');
          }
        }
        marker.destroy();
      }
      delete this.renamingMarkers;
      d('done and reparse');
      this.parse();
      this.eventBufferChanged = true;
      this.eventCursorMoved = true;
      return true;
    };


    /*
    User events
     */

    Watcher.prototype.onBufferChanged = function(event) {
      if (!this.eventBufferChanged) {
        return;
      }
      d('buffer changed', event);
      return this.update(event.changes);
    };

    Watcher.prototype.onCursorMoved = function(event) {
      if (!this.eventCursorMoved) {
        return;
      }
      if (this.eventCursorMoved === 'abort') {
        return this.abort(event);
      } else {
        clearTimeout(this.cursorMovedTimeoutId);
        return this.cursorMovedTimeoutId = setTimeout(this.onCursorMovedAfter, 100);
      }
    };

    Watcher.prototype.onCursorMovedAfter = function() {
      this.destroyReferences();
      return this.createReferences();
    };


    /*
    Utility
     */

    Watcher.prototype.isActive = function() {
      return (this.module != null) && atom.workspace.getActivePaneItem() === this.editor;
    };

    return Watcher;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2xpYnJhcnkvRW1iZXIgc2F0ZWxsaXRlIHByb2plY3RzL3dyZWF0aGUtYmFzZS91c3Ivc2hhcmUvYXRvbS9wYWNrYWdlcy9yZWZhY3Rvci9saWIvd2F0Y2hlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLCtCQUFBO0lBQUE7O0VBQUUsc0JBQXdCLE9BQUEsQ0FBUSxNQUFSOztFQUMxQixDQUFBLEdBQUksQ0FBQyxPQUFBLENBQVEsU0FBUixDQUFELENBQUEsQ0FBb0Isa0JBQXBCOztFQUVKLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFFUyxpQkFBQyxhQUFELEVBQWlCLE1BQWpCO01BQUMsSUFBQyxDQUFBLGdCQUFEO01BQWdCLElBQUMsQ0FBQSxTQUFEOzs7Ozs7Ozs7OztNQUM1QixJQUFDLENBQUEsV0FBRCxHQUFlLElBQUk7TUFDbkIsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUMsQ0FBQSxNQUFNLENBQUMsaUJBQVIsQ0FBMEIsSUFBQyxDQUFBLGVBQTNCLENBQWpCO01BQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUMsQ0FBQSxNQUFNLENBQUMseUJBQVIsQ0FBa0MsSUFBQyxDQUFBLGFBQW5DLENBQWpCO01BQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUMsQ0FBQSxhQUFhLENBQUMsV0FBZixDQUEyQixJQUFDLENBQUEsYUFBNUIsQ0FBakI7TUFDQSxJQUFDLENBQUEsYUFBRCxDQUFBO0lBTFc7O3NCQU9iLE9BQUEsR0FBUyxTQUFBO01BQ1AsSUFBQyxDQUFBLFVBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBO01BQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUI7TUFDakIsSUFBQyxDQUFBLE1BQUQsR0FBVTthQUNWLElBQUMsQ0FBQSxNQUFELEdBQVU7SUFMSDs7O0FBT1Q7Ozs7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OztJQUZhOztzQkFRZixrQkFBQSxHQUFvQixTQUFBO01BQ2xCLElBQUMsQ0FBQSxpQkFBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLGdCQUFELENBQUE7SUFGa0I7OztBQUtwQjs7OztzQkFJQSxRQUFBLEdBQVUsU0FBQTthQUNSLHFCQUFBLElBQWEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBZixDQUFBLENBQUEsS0FBc0MsSUFBQyxDQUFBO0lBRDVDOzs7OztBQXhSWiIsInNvdXJjZXNDb250ZW50IjpbInsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9ID0gcmVxdWlyZSAnYXRvbSdcbmQgPSAocmVxdWlyZSAnLi9kZWJ1ZycpICdyZWZhY3Rvcjp3YXRjaGVyJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBXYXRjaGVyXG5cbiAgY29uc3RydWN0b3I6IChAbW9kdWxlTWFuYWdlciwgQGVkaXRvcikgLT5cbiAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBkaXNwb3NhYmxlcy5hZGQgQGVkaXRvci5vbkRpZFN0b3BDaGFuZ2luZyBAb25CdWZmZXJDaGFuZ2VkXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBAZWRpdG9yLm9uRGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24gQG9uQ3Vyc29yTW92ZWRcbiAgICBAZGlzcG9zYWJsZXMuYWRkIEBtb2R1bGVNYW5hZ2VyLm9uQWN0aXZhdGVkIEB2ZXJpZnlHcmFtbWFyXG4gICAgQHZlcmlmeUdyYW1tYXIoKVxuXG4gIGRpc3Bvc2U6ID0+XG4gICAgQGRlYWN0aXZhdGUoKVxuICAgIEBkaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgICBAbW9kdWxlTWFuYWdlciA9IG51bGxcbiAgICBAZWRpdG9yID0gbnVsbFxuICAgIEBtb2R1bGUgPSBudWxsXG5cbiAgIyMjXG4gIEdyYW1tYXIgdmFsaWZpY2F0aW9uIHByb2Nlc3NcbiAgMS4gRGV0ZWN0IGdyYW1tYXIgY2hhbmdlZC5cbiAgMi4gRGVzdHJveSBpbnN0YW5jZXMgYW5kIGxpc3RlbmVycy5cbiAgMy4gRXhpdCBwcm9jZXNzIHdoZW4gdGhlIGxhbmd1YWdlIHBsdWdpbiBvZiB0aGUgZ3JhbW1hciBjYW4ndCBiZSBmb3VuZC5cbiAgNC4gQ3JlYXRlIGluc3RhbmNlcyBhbmQgbGlzdGVuZXJzLlxuICAjIyNcblxuICB2ZXJpZnlHcmFtbWFyOiA9PlxuICAgIHNjb3BlTmFtZSA9IEBlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZVxuICAgIG1vZHVsZSA9IEBtb2R1bGVNYW5hZ2VyLmdldE1vZHVsZSBzY29wZU5hbWVcbiAgICBkICd2ZXJpZnkgZ3JhbW1hcicsIHNjb3BlTmFtZSwgbW9kdWxlXG4gICAgcmV0dXJuIGlmIG1vZHVsZSBpcyBAbW9kdWxlXG4gICAgQGRlYWN0aXZhdGUoKVxuICAgIHJldHVybiB1bmxlc3MgbW9kdWxlP1xuICAgIEBtb2R1bGUgPSBtb2R1bGVcbiAgICBAYWN0aXZhdGUoKVxuXG4gIGFjdGl2YXRlOiAtPlxuICAgICMgU2V0dXAgbW9kZWxcbiAgICBAcmlwcGVyID0gbmV3IEBtb2R1bGUuUmlwcGVyKClcblxuICAgICMgU3RhcnQgbGlzdGVuaW5nXG4gICAgQGV2ZW50Q3Vyc29yTW92ZWQgPSBvblxuICAgIEBldmVudEJ1ZmZlckNoYW5nZWQgPSBvblxuXG4gICAgZCAnYWN0aXZhdGUgYW5kIHBhcnNlJ1xuICAgIEBwYXJzZSgpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBkICdkZWFjdGl2YXRlJ1xuXG4gICAgaWYgQHJpcHBlcj9cbiAgICAgIEByaXBwZXIuZGlzcG9zZT8oKVxuICAgICAgQHJpcHBlciA9IG51bGxcblxuICAgICMgU3RvcCBsaXN0ZW5pbmdcbiAgICBAY3Vyc29yTW92ZWQgPSBmYWxzZVxuXG4gICAgQGV2ZW50Q3Vyc29yTW92ZWQgPSBvZmZcbiAgICBAZXZlbnRCdWZmZXJDaGFuZ2VkID0gb2ZmXG4gICAgY2xlYXJUaW1lb3V0IEBjdXJzb3JNb3ZlZFRpbWVvdXRJZFxuXG4gICAgIyBSZW1vdmUgcmVmZXJlbmNlc1xuICAgIEBjdXJzb3JNb3ZlZFRpbWVvdXRJZCA9IG51bGxcbiAgICBAbW9kdWxlID0gbnVsbFxuICAgIEByZW5hbWluZ0N1cnNvciA9IG51bGxcbiAgICBAcmVuYW1pbmdNYXJrZXJzID0gbnVsbFxuXG5cbiAgIyMjXG4gIFJlZmVyZW5jZSBmaW5kZXIgcHJvY2Vzc1xuICAxLiBTdG9wIGxpc3RlbmluZyBjdXJzb3IgbW92ZSBldmVudCBhbmQgcmVzZXQgdmlld3MuXG4gIDIuIFBhcnNlLlxuICAzLiBTaG93IGVycm9ycyBhbmQgZXhpdCBwcm9jZXNzIHdoZW4gY29tcGlsZSBlcnJvciBpcyB0aHJvd24uXG4gIDQuIFNob3cgcmVmZXJlbmNlcy5cbiAgNS4gU3RhcnQgbGlzdGVuaW5nIGN1cnNvciBtb3ZlIGV2ZW50LlxuICAjIyNcblxuICBwYXJzZTogPT5cbiAgICBkICdwYXJzZSdcbiAgICBAZXZlbnRDdXJzb3JNb3ZlZCA9IG9mZlxuICAgIHRleHQgPSBAZWRpdG9yLmJ1ZmZlci5nZXRUZXh0KClcbiAgICBpZiB0ZXh0IGlzbnQgQGNhY2hlZFRleHRcbiAgICAgIEBkZXN0cm95UmVmZXJlbmNlcygpXG4gICAgICBAZGVzdHJveUVycm9ycygpXG4gICAgICBAY2FjaGVkVGV4dCA9IHRleHRcbiAgICAgIEByaXBwZXIucGFyc2UgdGV4dCwgQG9uUGFyc2VFbmRcbiAgICBAZXZlbnRDdXJzb3JNb3ZlZCA9IG9uXG5cbiAgdXBkYXRlOiAoY2hhbmdlcykgPT5cbiAgICByZXR1cm4gaWYgY2hhbmdlcy5sZW5ndGggaXMgMFxuICAgIGlmIHR5cGVvZiBAcmlwcGVyLnVwZGF0ZSBpc250ICdmdW5jdGlvbidcbiAgICAgIEBwYXJzZSgpXG4gICAgZWxzZSBAcmlwcGVyLnVwZGF0ZSBjaGFuZ2UgZm9yIGNoYW5nZSBpbiBjaGFuZ2VzXG5cbiAgb25QYXJzZUVuZDogKGVycm9ycykgPT5cbiAgICBkICdvblBhcnNlRW5kJ1xuICAgIGlmIGVycm9ycz9cbiAgICAgIEBjcmVhdGVFcnJvcnMgZXJyb3JzXG4gICAgZWxzZVxuICAgICAgQGNyZWF0ZVJlZmVyZW5jZXMoKVxuXG4gIGRlc3Ryb3lFcnJvcnM6IC0+XG4gICAgZCAnZGVzdHJveSBlcnJvcnMnXG4gICAgcmV0dXJuIHVubGVzcyBAZXJyb3JNYXJrZXJzP1xuICAgIGZvciBtYXJrZXIgaW4gQGVycm9yTWFya2Vyc1xuICAgICAgbWFya2VyLmRlc3Ryb3koKVxuICAgIEBlcnJvck1hcmtlcnMgPSBudWxsXG5cbiAgY3JlYXRlRXJyb3JzOiAoZXJyb3JzKSA9PlxuICAgIGQgJ2NyZWF0ZSBlcnJvcnMnXG4gICAgQGVycm9yTWFya2VycyA9IGZvciB7IHJhbmdlLCBtZXNzYWdlIH0gaW4gZXJyb3JzXG4gICAgICBtYXJrZXIgPSBAZWRpdG9yLm1hcmtCdWZmZXJSYW5nZSByYW5nZVxuICAgICAgZCAnbWFya2VyJywgcmFuZ2UsIG1hcmtlclxuICAgICAgQGVkaXRvci5kZWNvcmF0ZU1hcmtlciBtYXJrZXIsIHR5cGU6ICdoaWdobGlnaHQnLCBjbGFzczogJ3JlZmFjdG9yLWVycm9yJ1xuICAgICAgQGVkaXRvci5kZWNvcmF0ZU1hcmtlciBtYXJrZXIsIHR5cGU6ICdsaW5lLW51bWJlcicsIGNsYXNzOiAncmVmYWN0b3ItZXJyb3InXG4gICAgICAjIFRPRE86IHNob3cgZXJyb3IgbWVzc2FnZVxuICAgICAgbWFya2VyXG5cbiAgZGVzdHJveVJlZmVyZW5jZXM6IC0+XG4gICAgZCAnZGVzdHJveVJlZmVyZW5jZXMnXG4gICAgcmV0dXJuIHVubGVzcyBAcmVmZXJlbmNlTWFya2Vycz9cbiAgICBmb3IgbWFya2VyIGluIEByZWZlcmVuY2VNYXJrZXJzXG4gICAgICBtYXJrZXIuZGVzdHJveSgpXG4gICAgZGVsZXRlIEByZWZlcmVuY2VNYXJrZXJzXG5cbiAgY3JlYXRlUmVmZXJlbmNlczogLT5cbiAgICBkICdjcmVhdGVSZWZlcmVuY2VzJ1xuICAgIHJhbmdlcyA9IEByaXBwZXIuZmluZCBAZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2UoKS5zdGFydFxuICAgIHJldHVybiB1bmxlc3MgcmFuZ2VzPyBhbmQgcmFuZ2VzLmxlbmd0aCA+IDBcbiAgICBAcmVmZXJlbmNlTWFya2VycyA9IGZvciByYW5nZSBpbiByYW5nZXNcbiAgICAgIG1hcmtlciA9IEBlZGl0b3IubWFya0J1ZmZlclJhbmdlIHJhbmdlXG4gICAgICBjbHMgPVxuICAgICAgICBpZiByYW5nZS50eXBlXG4gICAgICAgICAgJ3JlZmFjdG9yLScgKyByYW5nZS50eXBlXG4gICAgICAgIGVsc2UgJ3JlZmFjdG9yLXJlZmVyZW5jZSdcbiAgICAgIEBlZGl0b3IuZGVjb3JhdGVNYXJrZXIgbWFya2VyLCB0eXBlOiAnaGlnaGxpZ2h0JywgY2xhc3M6IGNsc1xuICAgICAgbWFya2VyXG5cblxuICAjIyNcbiAgUmVuYW1pbmcgbGlmZSBjeWNsZS5cbiAgMS4gV2hlbiBkZXRlY3RlZCByZW5hbWUgY29tbWFuZCwgc3RhcnQgcmVuYW1pbmcgcHJvY2Vzcy5cbiAgMi4gV2hlbiB0aGUgY3Vyc29ycyBtb3ZlIG91dCBmcm9tIHRoZSBzeW1ib2xzLCBhYm9ydCBhbmQgZXhpdCByZW5hbWluZyBwcm9jZXNzLlxuICAzLiBXaGVuIGRldGVjdGVkIGRvbmUgY29tbWFuZCwgZXhpdCByZW5hbWluZyBwcm9jZXNzLlxuICAjIyNcblxuICByZW5hbWU6IC0+XG4gICAgIyBXaGVuIHRoaXMgZWRpdG9yIGlzbid0IGFjdGl2ZSwgcmV0dXJucyBmYWxzZSB0byBhYm9ydCBrZXlib2FyZCBiaW5kaW5nLlxuICAgIHJldHVybiBmYWxzZSB1bmxlc3MgQGlzQWN0aXZlKClcblxuICAgICMgRmluZCByZWZlcmVuY2VzLlxuICAgICMgV2hlbiBubyByZWZlcmVuY2UgZXhpc3RzLCBkbyBub3RoaW5nLlxuICAgIGN1cnNvciA9IEBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpXG4gICAgcmFuZ2VzID0gQHJpcHBlci5maW5kIGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgcmV0dXJuIGZhbHNlIHVubGVzcyByYW5nZXM/IGFuZCByYW5nZXMubGVuZ3RoID4gMFxuXG4gICAgIyBQYXVzZSBoaWdobGlnaHRpbmcgbGlmZSBjeWNsZS5cbiAgICBAZGVzdHJveVJlZmVyZW5jZXMoKVxuICAgIEBldmVudEJ1ZmZlckNoYW5nZWQgPSBvZmZcbiAgICBAZXZlbnRDdXJzb3JNb3ZlZCA9IG9mZlxuXG4gICAgI1RPRE8gQ3Vyc29yOjpjbGVhckF1dG9TY3JvbGwoKVxuXG4gICAgIyBSZWdpc3RlciB0aGUgdHJpZ2dlcmVkIGN1cnNvci5cbiAgICBAcmVuYW1pbmdDdXJzb3IgPSBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgICMgU2VsZWN0IHJlZmVyZW5jZXMuXG4gICAgIyBSZWdpc3RlciB0aGUgbWFya2VycyBvZiB0aGUgcmVmZXJlbmNlcycgcmFuZ2VzLlxuICAgICMgSGlnaGxpZ2h0IHRoZXNlIG1hcmtlcnMuXG4gICAgQHJlbmFtaW5nTWFya2VycyA9IGZvciByYW5nZSBpbiByYW5nZXNcbiAgICAgIG1hcmtlciA9IEBlZGl0b3IubWFya0J1ZmZlclJhbmdlIHJhbmdlXG4gICAgICBtYXJrZXIuc2hvcnRoYW5kID0gcmFuZ2Uuc2hvcnRoYW5kXG4gICAgICBtYXJrZXIuZGVsaW1pdGVyID0gcmFuZ2UuZGVsaW1pdGVyXG4gICAgICBtYXJrZXIua2V5ID0gQGVkaXRvci5tYXJrQnVmZmVyUmFuZ2UgcmFuZ2Uua2V5IGlmIHJhbmdlLmtleVxuICAgICAgQGVkaXRvci5kZWNvcmF0ZU1hcmtlciBtYXJrZXIsIHR5cGU6ICdoaWdobGlnaHQnLCBjbGFzczogJ3JlZmFjdG9yLXJlZmVyZW5jZSdcbiAgICAgIG1hcmtlclxuXG4gICAgZm9yIG1hcmtlciBpbiBAcmVuYW1pbmdNYXJrZXJzXG4gICAgICBpZiBtYXJrZXIuc2hvcnRoYW5kXG4gICAgICAgIHJhbmdlID0gbWFya2VyLmdldEJ1ZmZlclJhbmdlKClcbiAgICAgICAgb3JpZ2luID0gQGVkaXRvci5tYXJrQnVmZmVyUmFuZ2UgcmFuZ2UsIGludmFsaWRhdGU6ICdpbnNpZGUnXG4gICAgICAgIHRleHQgPSBAZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlIHJhbmdlXG4gICAgICAgIHN0YXJ0ID0gcmFuZ2Uuc3RhcnRcbiAgICAgICAgQGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZSBbc3RhcnQsIHN0YXJ0XSwgbWFya2VyLmRlbGltaXRlciwgdW5kbzogJ3NraXAnXG4gICAgICAgIGtleSA9IEBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UgW3N0YXJ0LCBzdGFydF0sIHRleHRcbiAgICAgICAgbWFya2VyLmtleSA9IEBlZGl0b3IubWFya0J1ZmZlclJhbmdlIGtleVxuICAgICAgICBtYXJrZXIuc2V0QnVmZmVyUmFuZ2Ugb3JpZ2luLmdldEJ1ZmZlclJhbmdlKClcblxuICAgIGZvciBtYXJrZXIgaW4gQHJlbmFtaW5nTWFya2Vyc1xuICAgICAgQGVkaXRvci5hZGRTZWxlY3Rpb25Gb3JCdWZmZXJSYW5nZSBtYXJrZXIuZ2V0QnVmZmVyUmFuZ2UoKVxuXG4gICAgIyBTdGFydCByZW5hbWluZyBsaWZlIGN5Y2xlLlxuICAgIEBldmVudEN1cnNvck1vdmVkID0gJ2Fib3J0J1xuXG4gICAgIyBSZXR1cm5zIHRydWUgbm90IHRvIGFib3J0IGtleWJvYXJkIGJpbmRpbmcuXG4gICAgdHJ1ZVxuXG4gIGFib3J0OiAoZXZlbnQpID0+XG4gICAgIyBXaGVuIHRoaXMgZWRpdG9yIGlzbid0IGFjdGl2ZSwgZG8gbm90aGluZy5cbiAgICByZXR1cm4gdW5sZXNzIEBpc0FjdGl2ZSgpIGFuZCBAcmVuYW1pbmdDdXJzb3I/IGFuZCBAcmVuYW1pbmdNYXJrZXJzP1xuXG4gICAgZCAnbW92ZSBjdXJzb3IgZnJvbScsIGV2ZW50Lm9sZEJ1ZmZlclBvc2l0aW9uLCAndG8nLCBldmVudC5uZXdCdWZmZXJQb3NpdGlvblxuICAgIGZvciBtYXJrZXIgaW4gQHJlbmFtaW5nTWFya2Vyc1xuICAgICAgcmV0dXJuIGlmIG1hcmtlci5nZXRCdWZmZXJSYW5nZSgpLmNvbnRhaW5zUG9pbnQgZXZlbnQubmV3QnVmZmVyUG9zaXRpb25cbiAgICBAZG9uZSgpXG4gICAgcmV0dXJuXG5cbiAgICAjIFZlcmlmeSBhbGwgY3Vyc29ycyBhcmUgaW4gcmVuYW1pbmcgbWFya2Vycy5cbiAgICAjIFdoZW4gdGhlIGN1cnNvciBpcyBvdXQgb2YgbWFya2VyIGF0IGxlYXN0IG9uZSwgYWJvcnQgcmVuYW1pbmcuXG4gICAgc2VsZWN0ZWRSYW5nZXMgPSBAZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKClcbiAgICBpc01hcmtlcnNDb250YWluc0N1cnNvcnMgPSB0cnVlXG4gICAgZm9yIG1hcmtlciBpbiBAcmVuYW1pbmdNYXJrZXJzXG4gICAgICBtYXJrZXJSYW5nZSA9IG1hcmtlci5nZXRCdWZmZXJSYW5nZSgpXG4gICAgICBpc01hcmtlckNvbnRhaW5zQ3Vyc29yID0gZmFsc2VcbiAgICAgIGZvciBzZWxlY3RlZFJhbmdlIGluIHNlbGVjdGVkUmFuZ2VzXG4gICAgICAgIGlzTWFya2VyQ29udGFpbnNDdXJzb3Igb3I9IG1hcmtlclJhbmdlLmNvbnRhaW5zUmFuZ2Ugc2VsZWN0ZWRSYW5nZVxuICAgICAgICBicmVhayBpZiBpc01hcmtlckNvbnRhaW5zQ3Vyc29yXG4gICAgICBpc01hcmtlcnNDb250YWluc0N1cnNvcnMgYW5kPSBpc01hcmtlckNvbnRhaW5zQ3Vyc29yXG4gICAgICBicmVhayB1bmxlc3MgaXNNYXJrZXJzQ29udGFpbnNDdXJzb3JzXG4gICAgcmV0dXJuIGlmIGlzTWFya2Vyc0NvbnRhaW5zQ3Vyc29yc1xuICAgIEBkb25lKClcblxuICBkb25lOiAtPlxuICAgIGQgJ2RvbmUnXG4gICAgIyBXaGVuIHRoaXMgZWRpdG9yIGlzbid0IGFjdGl2ZSwgcmV0dXJucyBmYWxzZSBmb3IgYWJvcnRpbmcga2V5Ym9hcmQgYmluZGluZy5cbiAgICByZXR1cm4gZmFsc2UgdW5sZXNzIEBpc0FjdGl2ZSgpIGFuZCBAcmVuYW1pbmdDdXJzb3I/IGFuZCBAcmVuYW1pbmdNYXJrZXJzP1xuXG4gICAgIyBTdG9wIHJlbmFtaW5nIGxpZmUgY3ljbGUuXG4gICAgQGV2ZW50Q3Vyc29yTW92ZWQgPSBvZmZcblxuICAgICMgUmVzZXQgY3Vyc29yJ3MgcG9zaXRpb24gdG8gdGhlIHRyaWdnZXJkIGN1cnNvcidzIHBvc2l0aW9uLlxuICAgIEBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24gQHJlbmFtaW5nQ3Vyc29yXG4gICAgZGVsZXRlIEByZW5hbWluZ0N1cnNvclxuICAgICMgUmVtb3ZlIGFsbCBtYXJrZXJzIGZvciByZW5hbWluZy5cbiAgICBmb3IgbWFya2VyIGluIEByZW5hbWluZ01hcmtlcnNcbiAgICAgIGlmIG1hcmtlci5rZXlcbiAgICAgICAga2V5ID0gQGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZSBtYXJrZXIua2V5LmdldEJ1ZmZlclJhbmdlKClcbiAgICAgICAgdmFsdWUgPSBAZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlIG1hcmtlci5nZXRCdWZmZXJSYW5nZSgpXG4gICAgICAgIGlmIGtleSA9PSB2YWx1ZVxuICAgICAgICAgIEBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UgW21hcmtlci5rZXkuZ2V0U3RhcnRCdWZmZXJQb3NpdGlvbigpLCBtYXJrZXIuZ2V0U3RhcnRCdWZmZXJQb3NpdGlvbigpXSwgJydcbiAgICAgIG1hcmtlci5kZXN0cm95KClcbiAgICBkZWxldGUgQHJlbmFtaW5nTWFya2Vyc1xuXG4gICAgIyBTdGFydCBoaWdobGlnaHRpbmcgbGlmZSBjeWNsZS5cbiAgICBkICdkb25lIGFuZCByZXBhcnNlJ1xuICAgIEBwYXJzZSgpXG4gICAgQGV2ZW50QnVmZmVyQ2hhbmdlZCA9IG9uXG4gICAgQGV2ZW50Q3Vyc29yTW92ZWQgPSBvblxuXG4gICAgIyBSZXR1cm5zIHRydWUgbm90IHRvIGFib3J0IGtleWJvYXJkIGJpbmRpbmcuXG4gICAgdHJ1ZVxuXG5cbiAgIyMjXG4gIFVzZXIgZXZlbnRzXG4gICMjI1xuXG4gIG9uQnVmZmVyQ2hhbmdlZDogKGV2ZW50KSA9PlxuICAgIHJldHVybiB1bmxlc3MgQGV2ZW50QnVmZmVyQ2hhbmdlZFxuICAgIGQgJ2J1ZmZlciBjaGFuZ2VkJywgZXZlbnRcbiAgICBAdXBkYXRlKGV2ZW50LmNoYW5nZXMpXG5cbiAgb25DdXJzb3JNb3ZlZDogKGV2ZW50KSA9PlxuICAgIHJldHVybiB1bmxlc3MgQGV2ZW50Q3Vyc29yTW92ZWRcbiAgICBpZiBAZXZlbnRDdXJzb3JNb3ZlZCA9PSAnYWJvcnQnXG4gICAgICBAYWJvcnQgZXZlbnRcbiAgICBlbHNlXG4gICAgICBjbGVhclRpbWVvdXQgQGN1cnNvck1vdmVkVGltZW91dElkXG4gICAgICBAY3Vyc29yTW92ZWRUaW1lb3V0SWQgPSBzZXRUaW1lb3V0IEBvbkN1cnNvck1vdmVkQWZ0ZXIsIDEwMFxuXG4gIG9uQ3Vyc29yTW92ZWRBZnRlcjogPT5cbiAgICBAZGVzdHJveVJlZmVyZW5jZXMoKVxuICAgIEBjcmVhdGVSZWZlcmVuY2VzKClcblxuXG4gICMjI1xuICBVdGlsaXR5XG4gICMjI1xuXG4gIGlzQWN0aXZlOiAtPlxuICAgIEBtb2R1bGU/IGFuZCBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpIGlzIEBlZGl0b3JcbiJdfQ==
