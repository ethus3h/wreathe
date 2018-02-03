(function() {
  var WordcountView, _, tile, view,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  WordcountView = require('./wordcount-view');

  _ = require('lodash');

  view = null;

  tile = null;

  module.exports = {
    config: {
      alwaysOn: {
        title: 'Always on',
        description: 'Show word count for all files, regardless of extension',
        type: 'boolean',
        "default": false,
        order: 1
      },
      extensions: {
        title: 'Autoactivated file extensions',
        description: 'List of file extenstions which should have the wordcount plugin enabled',
        type: 'array',
        "default": ['md', 'markdown', 'readme', 'txt', 'rst', 'adoc', 'log', 'msg'],
        items: {
          type: 'string'
        },
        order: 2
      },
      noextension: {
        title: 'Autoactivate for files without an extension',
        description: 'Wordcount plugin enabled for files without a file extension',
        type: 'boolean',
        "default": false,
        items: {
          type: 'boolean'
        },
        order: 3
      },
      goal: {
        title: 'Work toward a word goal',
        description: 'Shows a bar showing progress toward a word goal',
        type: 'number',
        "default": 0,
        order: 4
      },
      goalColor: {
        title: 'Color for word goal',
        description: 'Use a CSS color value, such as rgb(0, 85, 255) or green',
        type: 'string',
        "default": 'rgb(0, 85, 0)',
        order: 5
      },
      goalLineHeight: {
        title: 'Percentage height of word goal line',
        type: 'string',
        "default": '20%',
        order: 6
      },
      ignorecode: {
        title: 'Ignore Markdown code blocks',
        description: 'Do not count words inside of code blocks',
        type: 'boolean',
        "default": false,
        items: {
          type: 'boolean'
        },
        order: 7
      },
      hidechars: {
        title: 'Hide character count',
        description: 'Hides the character count from the view',
        type: 'boolean',
        "default": false,
        order: 8
      },
      showprice: {
        title: 'Do you get paid per word?',
        description: 'Shows the price for the text per word',
        type: 'boolean',
        "default": false,
        order: 9
      },
      wordprice: {
        title: 'How much do you get paid per word?',
        description: 'Allows you to find out how much do you get paid per word',
        type: 'string',
        "default": '0.15',
        order: 10
      },
      currencysymbol: {
        title: 'Set a different currency symbol',
        description: 'Allows you to change the currency you get paid with',
        type: 'string',
        "default": '$',
        order: 11
      }
    },
    activate: function(state) {
      var update_count, update_view_and_count;
      this.visible = false;
      view = new WordcountView();
      update_count = _.throttle((function(_this) {
        return function(editor) {
          return _this.visible && view.update_count(editor);
        };
      })(this), 300);
      atom.workspace.observeTextEditors(function(editor) {
        editor.onDidChange(function() {
          return update_count(editor);
        });
        return editor.onDidChangeSelectionRange(function() {
          return update_count(editor);
        });
      });
      update_view_and_count = (function(_this) {
        return function(item) {
          var editor;
          _this.show_or_hide_for_item(item);
          editor = atom.workspace.getActiveTextEditor();
          if (editor != null) {
            return update_count(editor);
          }
        };
      })(this);
      atom.workspace.onDidChangeActivePaneItem(update_view_and_count);
      update_view_and_count(atom.workspace.getActivePaneItem());
      return atom.config.observe('wordcount.goal', this.update_goal);
    },
    update_goal: function(item) {
      if (item === 0) {
        return view.element.style.background = 'transparent';
      }
    },
    show_or_hide_for_item: function(item) {
      var alwaysOn, buffer, current_file_extension, extensions, no_extension, noextension, not_text_editor, ref, ref1, ref2, untitled_tab;
      ref = atom.config.get('wordcount'), alwaysOn = ref.alwaysOn, extensions = ref.extensions, noextension = ref.noextension;
      extensions = (extensions || []).map(function(extension) {
        return extension.toLowerCase();
      });
      buffer = item != null ? item.buffer : void 0;
      not_text_editor = buffer == null;
      untitled_tab = (buffer != null ? buffer.file : void 0) === null;
      current_file_extension = buffer != null ? (ref1 = buffer.file) != null ? (ref2 = ref1.path.match(/\.(\w+)$/)) != null ? ref2[1].toLowerCase() : void 0 : void 0 : void 0;
      no_extension = noextension && ((current_file_extension == null) || untitled_tab);
      if (alwaysOn || no_extension || indexOf.call(extensions, current_file_extension) >= 0) {
        this.visible = true;
        if (!not_text_editor) {
          return view.element.style.display = "inline-block";
        }
      } else {
        this.visible = false;
        return view.element.style.display = "none";
      }
    },
    consumeStatusBar: function(statusBar) {
      return tile = statusBar.addRightTile({
        item: view.element,
        priority: 100
      });
    },
    deactivate: function() {
      if (tile != null) {
        tile.destroy();
      }
      return tile = null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2xpYnJhcnkvRW1iZXIgc2F0ZWxsaXRlIHByb2plY3RzL3dyZWF0aGUtYmFzZS91c3Ivc2hhcmUvYXRvbS9wYWNrYWdlcy93b3JkY291bnQvbGliL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSw0QkFBQTtJQUFBOztFQUFBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSOztFQUNoQixDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0VBRUosSUFBQSxHQUFPOztFQUNQLElBQUEsR0FBTzs7RUFFUCxNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsTUFBQSxFQUNFO01BQUEsUUFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLFdBQVA7UUFDQSxXQUFBLEVBQWEsd0RBRGI7UUFFQSxJQUFBLEVBQU0sU0FGTjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FIVDtRQUlBLEtBQUEsRUFBTyxDQUpQO09BREY7TUFNQSxVQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sK0JBQVA7UUFDQSxXQUFBLEVBQWEseUVBRGI7UUFFQSxJQUFBLEVBQU0sT0FGTjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FBRSxJQUFGLEVBQVEsVUFBUixFQUFvQixRQUFwQixFQUE4QixLQUE5QixFQUFxQyxLQUFyQyxFQUE0QyxNQUE1QyxFQUFvRCxLQUFwRCxFQUEyRCxLQUEzRCxDQUhUO1FBSUEsS0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFFBQU47U0FMRjtRQU1BLEtBQUEsRUFBTyxDQU5QO09BUEY7TUFjQSxXQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sNkNBQVA7UUFDQSxXQUFBLEVBQWEsNkRBRGI7UUFFQSxJQUFBLEVBQU0sU0FGTjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FIVDtRQUlBLEtBQUEsRUFDRTtVQUFBLElBQUEsRUFBTSxTQUFOO1NBTEY7UUFNQSxLQUFBLEVBQU8sQ0FOUDtP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LE9BTC9COztJQVhxQixDQTNHdkI7SUE2SEEsZ0JBQUEsRUFBa0IsU0FBQyxTQUFEO2FBQ2hCLElBQUEsR0FBTyxTQUFTLENBQUMsWUFBVixDQUF1QjtRQUFBLElBQUEsRUFBTSxJQUFJLENBQUMsT0FBWDtRQUFvQixRQUFBLEVBQVUsR0FBOUI7T0FBdkI7SUFEUyxDQTdIbEI7SUFnSUEsVUFBQSxFQUFZLFNBQUE7O1FBQ1YsSUFBSSxDQUFFLE9BQU4sQ0FBQTs7YUFDQSxJQUFBLEdBQU87SUFGRyxDQWhJWjs7QUFSRiIsInNvdXJjZXNDb250ZW50IjpbIldvcmRjb3VudFZpZXcgPSByZXF1aXJlICcuL3dvcmRjb3VudC12aWV3J1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcblxudmlldyA9IG51bGxcbnRpbGUgPSBudWxsXG5cbm1vZHVsZS5leHBvcnRzID1cblxuICBjb25maWc6XG4gICAgYWx3YXlzT246XG4gICAgICB0aXRsZTogJ0Fsd2F5cyBvbidcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2hvdyB3b3JkIGNvdW50IGZvciBhbGwgZmlsZXMsIHJlZ2FyZGxlc3Mgb2YgZXh0ZW5zaW9uJ1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgb3JkZXI6IDFcbiAgICBleHRlbnNpb25zOlxuICAgICAgdGl0bGU6ICdBdXRvYWN0aXZhdGVkIGZpbGUgZXh0ZW5zaW9ucydcbiAgICAgIGRlc2NyaXB0aW9uOiAnTGlzdCBvZiBmaWxlIGV4dGVuc3Rpb25zIHdoaWNoIHNob3VsZCBoYXZlIHRoZSB3b3JkY291bnQgcGx1Z2luIGVuYWJsZWQnXG4gICAgICB0eXBlOiAnYXJyYXknXG4gICAgICBkZWZhdWx0OiBbICdtZCcsICdtYXJrZG93bicsICdyZWFkbWUnLCAndHh0JywgJ3JzdCcsICdhZG9jJywgJ2xvZycsICdtc2cnIF1cbiAgICAgIGl0ZW1zOlxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgb3JkZXI6IDJcbiAgICBub2V4dGVuc2lvbjpcbiAgICAgIHRpdGxlOiAnQXV0b2FjdGl2YXRlIGZvciBmaWxlcyB3aXRob3V0IGFuIGV4dGVuc2lvbidcbiAgICAgIGRlc2NyaXB0aW9uOiAnV29yZGNvdW50IHBsdWdpbiBlbmFibGVkIGZvciBmaWxlcyB3aXRob3V0IGEgZmlsZSBleHRlbnNpb24nXG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBpdGVtczpcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBvcmRlcjogM1xuICAgIGdvYWw6XG4gICAgICB0aXRsZTogJ1dvcmsgdG93YXJkIGEgd29yZCBnb2FsJ1xuICAgICAgZGVzY3JpcHRpb246ICdTaG93cyBhIGJhciBzaG93aW5nIHByb2dyZXNzIHRvd2FyZCBhIHdvcmQgZ29hbCdcbiAgICAgIHR5cGU6ICdudW1iZXInXG4gICAgICBkZWZhdWx0OiAwXG4gICAgICBvcmRlcjogNFxuICAgIGdvYWxDb2xvcjpcbiAgICAgIHRpdGxlOiAnQ29sb3IgZm9yIHdvcmQgZ29hbCdcbiAgICAgIGRlc2NyaXB0aW9uOiAnVXNlIGEgQ1NTIGNvbG9yIHZhbHVlLCBzdWNoIGFzIHJnYigwLCA4NSwgMjU1KSBvciBncmVlbidcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAncmdiKDAsIDg1LCAwKSdcbiAgICAgIG9yZGVyOiA1XG4gICAgZ29hbExpbmVIZWlnaHQ6XG4gICAgICB0aXRsZTogJ1BlcmNlbnRhZ2UgaGVpZ2h0IG9mIHdvcmQgZ29hbCBsaW5lJ1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICcyMCUnXG4gICAgICBvcmRlcjogNlxuICAgIGlnbm9yZWNvZGU6XG4gICAgICB0aXRsZTogJ0lnbm9yZSBNYXJrZG93biBjb2RlIGJsb2NrcydcbiAgICAgIGRlc2NyaXB0aW9uOiAnRG8gbm90IGNvdW50IHdvcmRzIGluc2lkZSBvZiBjb2RlIGJsb2NrcydcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGl0ZW1zOlxuICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIG9yZGVyOiA3XG4gICAgaGlkZWNoYXJzOlxuICAgICAgdGl0bGU6ICdIaWRlIGNoYXJhY3RlciBjb3VudCdcbiAgICAgIGRlc2NyaXB0aW9uOiAnSGlkZXMgdGhlIGNoYXJhY3RlciBjb3VudCBmcm9tIHRoZSB2aWV3J1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgb3JkZXI6IDhcbiAgICBzaG93cHJpY2U6XG4gICAgICB0aXRsZTogJ0RvIHlvdSBnZXQgcGFpZCBwZXIgd29yZD8nXG4gICAgICBkZXNjcmlwdGlvbjogJ1Nob3dzIHRoZSBwcmljZSBmb3IgdGhlIHRleHQgcGVyIHdvcmQnXG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBvcmRlcjogOVxuICAgIHdvcmRwcmljZTpcbiAgICAgIHRpdGxlOiAnSG93IG11Y2ggZG8geW91IGdldCBwYWlkIHBlciB3b3JkPydcbiAgICAgIGRlc2NyaXB0aW9uOiAnQWxsb3dzIHlvdSB0byBmaW5kIG91dCBob3cgbXVjaCBkbyB5b3UgZ2V0IHBhaWQgcGVyIHdvcmQnXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJzAuMTUnXG4gICAgICBvcmRlcjogMTBcbiAgICBjdXJyZW5jeXN5bWJvbDpcbiAgICAgIHRpdGxlOiAnU2V0IGEgZGlmZmVyZW50IGN1cnJlbmN5IHN5bWJvbCdcbiAgICAgIGRlc2NyaXB0aW9uOiAnQWxsb3dzIHlvdSB0byBjaGFuZ2UgdGhlIGN1cnJlbmN5IHlvdSBnZXQgcGFpZCB3aXRoJ1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICckJ1xuICAgICAgb3JkZXI6IDExXG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBAdmlzaWJsZSA9IGZhbHNlXG4gICAgdmlldyA9IG5ldyBXb3JkY291bnRWaWV3KClcblxuICAgICMgVXBkYXRlcyBvbmx5IHRoZSBjb3VudCBvZiB0aGUgc1xuICAgIHVwZGF0ZV9jb3VudCA9IF8udGhyb3R0bGUgKGVkaXRvcikgPT5cbiAgICAgIEB2aXNpYmxlICYmIHZpZXcudXBkYXRlX2NvdW50KGVkaXRvcilcbiAgICAsIDMwMFxuXG4gICAgIyBVcGRhdGUgY291bnQgd2hlbiBjb250ZW50IG9mIGJ1ZmZlciBvciBzZWxlY3Rpb25zIGNoYW5nZVxuICAgIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoZWRpdG9yKSAtPlxuICAgICAgZWRpdG9yLm9uRGlkQ2hhbmdlIC0+IHVwZGF0ZV9jb3VudCBlZGl0b3JcblxuICAgICAgIyBOT1RFOiBUaGlzIHRyaWdnZXJzIGJlZm9yZSBhIGRpZENoYW5nZUFjdGl2ZVBhbmUsIHNvIHRoZSBjb3VudHMgbWlnaHQgYmUgY2FsY3VsYXRlZCBvbmNlIG9uIHBhbmUgc3dpdGNoXG4gICAgICBlZGl0b3Iub25EaWRDaGFuZ2VTZWxlY3Rpb25SYW5nZSAtPiB1cGRhdGVfY291bnQgZWRpdG9yXG5cbiAgICAjIFVwZGF0ZXMgdGhlIHZpc2liaWxpdHkgYW5kIGNvdW50IG9mIHRoZSB2aWV3XG4gICAgdXBkYXRlX3ZpZXdfYW5kX2NvdW50ID0gKGl0ZW0pID0+XG4gICAgICBAc2hvd19vcl9oaWRlX2Zvcl9pdGVtIGl0ZW1cbiAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgdXBkYXRlX2NvdW50IGVkaXRvciBpZiBlZGl0b3I/XG5cbiAgICAjIFVwZGF0ZSB3aGVuZXZlciBhY3RpdmUgaXRlbSBjaGFuZ2VzXG4gICAgYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSB1cGRhdGVfdmlld19hbmRfY291bnRcblxuICAgICMgSW5pdGlhbCB1cGRhdGVcbiAgICB1cGRhdGVfdmlld19hbmRfY291bnQgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKVxuXG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnd29yZGNvdW50LmdvYWwnLCBAdXBkYXRlX2dvYWwpXG5cbiAgdXBkYXRlX2dvYWw6IChpdGVtKSAtPlxuICAgIGlmIGl0ZW0gaXMgMFxuICAgICAgdmlldy5lbGVtZW50LnN0eWxlLmJhY2tncm91bmQgPSAndHJhbnNwYXJlbnQnXG5cbiAgc2hvd19vcl9oaWRlX2Zvcl9pdGVtOiAoaXRlbSkgLT5cbiAgICB7YWx3YXlzT24sIGV4dGVuc2lvbnMsIG5vZXh0ZW5zaW9ufSA9IGF0b20uY29uZmlnLmdldCgnd29yZGNvdW50JylcbiAgICBleHRlbnNpb25zID0gKGV4dGVuc2lvbnMgfHwgW10pLm1hcCAoZXh0ZW5zaW9uKSAtPiBleHRlbnNpb24udG9Mb3dlckNhc2UoKVxuICAgIGJ1ZmZlciA9IGl0ZW0/LmJ1ZmZlclxuXG4gICAgbm90X3RleHRfZWRpdG9yID0gbm90IGJ1ZmZlcj9cbiAgICB1bnRpdGxlZF90YWIgPSBidWZmZXI/LmZpbGUgaXMgbnVsbFxuICAgIGN1cnJlbnRfZmlsZV9leHRlbnNpb24gPSBidWZmZXI/LmZpbGU/LnBhdGgubWF0Y2goL1xcLihcXHcrKSQvKT9bMV0udG9Mb3dlckNhc2UoKVxuXG4gICAgbm9fZXh0ZW5zaW9uID0gbm9leHRlbnNpb24gYW5kIChub3QgY3VycmVudF9maWxlX2V4dGVuc2lvbj8gb3IgdW50aXRsZWRfdGFiKVxuXG4gICAgaWYgYWx3YXlzT24gb3Igbm9fZXh0ZW5zaW9uIG9yIGN1cnJlbnRfZmlsZV9leHRlbnNpb24gaW4gZXh0ZW5zaW9uc1xuICAgICAgQHZpc2libGUgPSB0cnVlXG4gICAgICB2aWV3LmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lLWJsb2NrXCIgdW5sZXNzIG5vdF90ZXh0X2VkaXRvclxuICAgIGVsc2VcbiAgICAgIEB2aXNpYmxlID0gZmFsc2VcbiAgICAgIHZpZXcuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCJcblxuICBjb25zdW1lU3RhdHVzQmFyOiAoc3RhdHVzQmFyKSAtPlxuICAgIHRpbGUgPSBzdGF0dXNCYXIuYWRkUmlnaHRUaWxlKGl0ZW06IHZpZXcuZWxlbWVudCwgcHJpb3JpdHk6IDEwMClcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIHRpbGU/LmRlc3Ryb3koKVxuICAgIHRpbGUgPSBudWxsXG4iXX0=
