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
        type: 'color',
        "default": 'rgb(0, 85, 0)',
        order: 5
      },
      goalBgColor: {
        title: 'Color for word goal background',
        type: 'color',
        "default": 'red',
        order: 6
      },
      goalLineHeight: {
        title: 'Percentage height of word goal line',
        type: 'string',
        "default": '20%',
        order: 7
      },
      stripgrammars: {
        title: 'Grammars for ignoring',
        description: 'Defines in which grammars specific parts of text are ignored',
        type: 'array',
        "default": ['source.gfm', 'text.md'],
        order: 8
      },
      ignorecode: {
        title: 'Ignore Markdown code blocks',
        description: 'Do not count words inside of code blocks',
        type: 'boolean',
        "default": false,
        order: 9
      },
      ignorecomments: {
        title: 'Ignore Markdown comments',
        description: 'Do not count words inside of comments',
        type: 'boolean',
        "default": false,
        items: {
          type: 'boolean'
        },
        order: 10
      },
      ignoreblockquotes: {
        title: 'Ignore Markdown block quotes',
        description: 'Do not count words inside of block quotes',
        type: 'boolean',
        "default": false,
        items: {
          type: 'boolean'
        },
        order: 11
      },
      showchars: {
        title: 'Show character count',
        description: 'Shows the character count from the view',
        type: 'boolean',
        "default": true,
        order: 12
      },
      showwords: {
        title: 'Show word count',
        description: 'Shows the word count from the view',
        type: 'boolean',
        "default": true,
        order: 13
      },
      showtime: {
        title: 'Show time estimation',
        description: 'Shows the time estimation from the view',
        type: 'boolean',
        "default": false,
        order: 14
      },
      charactersPerSeconds: {
        title: 'Character per seconds',
        description: 'This helps you estimating the duration of your text for reading.',
        type: 'number',
        "default": 1000,
        order: 15
      },
      showprice: {
        title: 'Show price estimation',
        description: 'Shows the price for the text per word',
        type: 'boolean',
        "default": false,
        order: 16
      },
      wordprice: {
        title: 'How much do you get paid per word?',
        description: 'Allows you to find out how much do you get paid per word',
        type: 'string',
        "default": '0.15',
        order: 17
      },
      currencysymbol: {
        title: 'Set a different currency symbol',
        description: 'Allows you to change the currency you get paid with',
        type: 'string',
        "default": '$',
        order: 18
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2xpYnJhcnkvRW1iZXIgc2F0ZWxsaXRlIHByb2plY3RzL3dyZWF0aGUtYmFzZS91c3Ivc2hhcmUvYXRvbS9wYWNrYWdlcy93b3JkY291bnQvbGliL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSw0QkFBQTtJQUFBOztFQUFBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSOztFQUNoQixDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0VBRUosSUFBQSxHQUFPOztFQUNQLElBQUEsR0FBTzs7RUFFUCxNQUFNLENBQUMsT0FBUCxHQUVFO0lBQUEsTUFBQSxFQUNFO01BQUEsUUFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLFdBQVA7UUFDQSxXQUFBLEVBQWEsd0RBRGI7UUFFQSxJQUFBLEVBQU0sU0FGTjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FIVDtRQUlBLEtBQUEsRUFBTyxDQUpQO09BREY7TUFNQSxVQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sK0JBQVA7UUFDQSxXQUFBLEVBQWEseUVBRGI7UUFFQSxJQUFBLEVBQU0sT0FGTjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FBRSxJQUFGLEVBQVEsVUFBUixFQUFvQixRQUFwQixFQUE4QixLQUE5QixFQUFxQyxLQUFyQyxFQUE0QyxNQUE1QyxFQUFvRCxLQUFwRCxFQUEyRCxLQUEzRCxDQUhUO1FBSUEsS0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFFBQU47U0FMRjtRQU1BLEtBQUEsRUFBTyxDQU5QO09BUEY7TUFjQSxXQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sNkNBQVA7UUFDQSxXQUFBLEVBQWEsNkRBRGI7UUFFQSxJQUFBLEVBQU0sU0FGTjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FIVDtRQUlBLEtBQUEsRUFDRTtVQUFBLElBQUEsRUFBTSxTQUFOO1NBTEY7UUFNQSxLQUFBLEVBQU8sQ0FOUDtP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QSxPQUFELEdBQVc7ZUFDWCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFuQixHQUE2QixPQUwvQjs7SUFYcUIsQ0F4SnZCO0lBMEtBLGdCQUFBLEVBQWtCLFNBQUMsU0FBRDthQUNoQixJQUFBLEdBQU8sU0FBUyxDQUFDLFlBQVYsQ0FBdUI7UUFBQSxJQUFBLEVBQU0sSUFBSSxDQUFDLE9BQVg7UUFBb0IsUUFBQSxFQUFVLEdBQTlCO09BQXZCO0lBRFMsQ0ExS2xCO0lBNktBLFVBQUEsRUFBWSxTQUFBOztRQUNWLElBQUksQ0FBRSxPQUFOLENBQUE7O2FBQ0EsSUFBQSxHQUFPO0lBRkcsQ0E3S1o7O0FBUkYiLCJzb3VyY2VzQ29udGVudCI6WyJXb3JkY291bnRWaWV3ID0gcmVxdWlyZSAnLi93b3JkY291bnQtdmlldydcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5cbnZpZXcgPSBudWxsXG50aWxlID0gbnVsbFxuXG5tb2R1bGUuZXhwb3J0cyA9XG5cbiAgY29uZmlnOlxuICAgIGFsd2F5c09uOlxuICAgICAgdGl0bGU6ICdBbHdheXMgb24nXG4gICAgICBkZXNjcmlwdGlvbjogJ1Nob3cgd29yZCBjb3VudCBmb3IgYWxsIGZpbGVzLCByZWdhcmRsZXNzIG9mIGV4dGVuc2lvbidcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIG9yZGVyOiAxXG4gICAgZXh0ZW5zaW9uczpcbiAgICAgIHRpdGxlOiAnQXV0b2FjdGl2YXRlZCBmaWxlIGV4dGVuc2lvbnMnXG4gICAgICBkZXNjcmlwdGlvbjogJ0xpc3Qgb2YgZmlsZSBleHRlbnN0aW9ucyB3aGljaCBzaG91bGQgaGF2ZSB0aGUgd29yZGNvdW50IHBsdWdpbiBlbmFibGVkJ1xuICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgZGVmYXVsdDogWyAnbWQnLCAnbWFya2Rvd24nLCAncmVhZG1lJywgJ3R4dCcsICdyc3QnLCAnYWRvYycsICdsb2cnLCAnbXNnJyBdXG4gICAgICBpdGVtczpcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIG9yZGVyOiAyXG4gICAgbm9leHRlbnNpb246XG4gICAgICB0aXRsZTogJ0F1dG9hY3RpdmF0ZSBmb3IgZmlsZXMgd2l0aG91dCBhbiBleHRlbnNpb24nXG4gICAgICBkZXNjcmlwdGlvbjogJ1dvcmRjb3VudCBwbHVnaW4gZW5hYmxlZCBmb3IgZmlsZXMgd2l0aG91dCBhIGZpbGUgZXh0ZW5zaW9uJ1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgaXRlbXM6XG4gICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgb3JkZXI6IDNcbiAgICBnb2FsOlxuICAgICAgdGl0bGU6ICdXb3JrIHRvd2FyZCBhIHdvcmQgZ29hbCdcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2hvd3MgYSBiYXIgc2hvd2luZyBwcm9ncmVzcyB0b3dhcmQgYSB3b3JkIGdvYWwnXG4gICAgICB0eXBlOiAnbnVtYmVyJ1xuICAgICAgZGVmYXVsdDogMFxuICAgICAgb3JkZXI6IDRcbiAgICBnb2FsQ29sb3I6XG4gICAgICB0aXRsZTogJ0NvbG9yIGZvciB3b3JkIGdvYWwnXG4gICAgICB0eXBlOiAnY29sb3InXG4gICAgICBkZWZhdWx0OiAncmdiKDAsIDg1LCAwKSdcbiAgICAgIG9yZGVyOiA1XG4gICAgZ29hbEJnQ29sb3I6XG4gICAgICB0aXRsZTogJ0NvbG9yIGZvciB3b3JkIGdvYWwgYmFja2dyb3VuZCdcbiAgICAgIHR5cGU6ICdjb2xvcidcbiAgICAgIGRlZmF1bHQ6ICdyZWQnXG4gICAgICBvcmRlcjogNlxuICAgIGdvYWxMaW5lSGVpZ2h0OlxuICAgICAgdGl0bGU6ICdQZXJjZW50YWdlIGhlaWdodCBvZiB3b3JkIGdvYWwgbGluZSdcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnMjAlJ1xuICAgICAgb3JkZXI6IDdcbiAgICBzdHJpcGdyYW1tYXJzOlxuICAgICAgdGl0bGU6ICdHcmFtbWFycyBmb3IgaWdub3JpbmcnXG4gICAgICBkZXNjcmlwdGlvbjogJ0RlZmluZXMgaW4gd2hpY2ggZ3JhbW1hcnMgc3BlY2lmaWMgcGFydHMgb2YgdGV4dCBhcmUgaWdub3JlZCdcbiAgICAgIHR5cGU6ICdhcnJheSdcbiAgICAgIGRlZmF1bHQ6IFtcbiAgICAgICAgJ3NvdXJjZS5nZm0nXG4gICAgICAgICd0ZXh0Lm1kJ1xuICAgICAgICBdXG4gICAgICBvcmRlcjogOFxuICAgIGlnbm9yZWNvZGU6XG4gICAgICB0aXRsZTogJ0lnbm9yZSBNYXJrZG93biBjb2RlIGJsb2NrcydcbiAgICAgIGRlc2NyaXB0aW9uOiAnRG8gbm90IGNvdW50IHdvcmRzIGluc2lkZSBvZiBjb2RlIGJsb2NrcydcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIG9yZGVyOiA5XG4gICAgaWdub3JlY29tbWVudHM6XG4gICAgICB0aXRsZTogJ0lnbm9yZSBNYXJrZG93biBjb21tZW50cydcbiAgICAgIGRlc2NyaXB0aW9uOiAnRG8gbm90IGNvdW50IHdvcmRzIGluc2lkZSBvZiBjb21tZW50cydcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGl0ZW1zOlxuICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIG9yZGVyOiAxMFxuICAgIGlnbm9yZWJsb2NrcXVvdGVzOlxuICAgICAgdGl0bGU6ICdJZ25vcmUgTWFya2Rvd24gYmxvY2sgcXVvdGVzJ1xuICAgICAgZGVzY3JpcHRpb246ICdEbyBub3QgY291bnQgd29yZHMgaW5zaWRlIG9mIGJsb2NrIHF1b3RlcydcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGl0ZW1zOlxuICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIG9yZGVyOiAxMVxuICAgIHNob3djaGFyczpcbiAgICAgIHRpdGxlOiAnU2hvdyBjaGFyYWN0ZXIgY291bnQnXG4gICAgICBkZXNjcmlwdGlvbjogJ1Nob3dzIHRoZSBjaGFyYWN0ZXIgY291bnQgZnJvbSB0aGUgdmlldydcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgb3JkZXI6IDEyXG4gICAgc2hvd3dvcmRzOlxuICAgICAgdGl0bGU6ICdTaG93IHdvcmQgY291bnQnXG4gICAgICBkZXNjcmlwdGlvbjogJ1Nob3dzIHRoZSB3b3JkIGNvdW50IGZyb20gdGhlIHZpZXcnXG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIG9yZGVyOiAxM1xuICAgIHNob3d0aW1lOlxuICAgICAgdGl0bGU6ICdTaG93IHRpbWUgZXN0aW1hdGlvbidcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2hvd3MgdGhlIHRpbWUgZXN0aW1hdGlvbiBmcm9tIHRoZSB2aWV3J1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgb3JkZXI6IDE0XG4gICAgY2hhcmFjdGVyc1BlclNlY29uZHM6XG4gICAgICB0aXRsZTogJ0NoYXJhY3RlciBwZXIgc2Vjb25kcydcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhpcyBoZWxwcyB5b3UgZXN0aW1hdGluZyB0aGUgZHVyYXRpb24gb2YgeW91ciB0ZXh0IGZvciByZWFkaW5nLidcbiAgICAgIHR5cGU6ICdudW1iZXInXG4gICAgICBkZWZhdWx0OiAxMDAwXG4gICAgICBvcmRlcjogMTVcbiAgICBzaG93cHJpY2U6XG4gICAgICB0aXRsZTogJ1Nob3cgcHJpY2UgZXN0aW1hdGlvbidcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2hvd3MgdGhlIHByaWNlIGZvciB0aGUgdGV4dCBwZXIgd29yZCdcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIG9yZGVyOiAxNlxuICAgIHdvcmRwcmljZTpcbiAgICAgIHRpdGxlOiAnSG93IG11Y2ggZG8geW91IGdldCBwYWlkIHBlciB3b3JkPydcbiAgICAgIGRlc2NyaXB0aW9uOiAnQWxsb3dzIHlvdSB0byBmaW5kIG91dCBob3cgbXVjaCBkbyB5b3UgZ2V0IHBhaWQgcGVyIHdvcmQnXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJzAuMTUnXG4gICAgICBvcmRlcjogMTdcbiAgICBjdXJyZW5jeXN5bWJvbDpcbiAgICAgIHRpdGxlOiAnU2V0IGEgZGlmZmVyZW50IGN1cnJlbmN5IHN5bWJvbCdcbiAgICAgIGRlc2NyaXB0aW9uOiAnQWxsb3dzIHlvdSB0byBjaGFuZ2UgdGhlIGN1cnJlbmN5IHlvdSBnZXQgcGFpZCB3aXRoJ1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICckJ1xuICAgICAgb3JkZXI6IDE4XG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBAdmlzaWJsZSA9IGZhbHNlXG4gICAgdmlldyA9IG5ldyBXb3JkY291bnRWaWV3KClcblxuICAgICMgVXBkYXRlcyBvbmx5IHRoZSBjb3VudCBvZiB0aGUgc1xuICAgIHVwZGF0ZV9jb3VudCA9IF8udGhyb3R0bGUgKGVkaXRvcikgPT5cbiAgICAgIEB2aXNpYmxlICYmIHZpZXcudXBkYXRlX2NvdW50KGVkaXRvcilcbiAgICAsIDMwMFxuXG4gICAgIyBVcGRhdGUgY291bnQgd2hlbiBjb250ZW50IG9mIGJ1ZmZlciBvciBzZWxlY3Rpb25zIGNoYW5nZVxuICAgIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoZWRpdG9yKSAtPlxuICAgICAgZWRpdG9yLm9uRGlkQ2hhbmdlIC0+IHVwZGF0ZV9jb3VudCBlZGl0b3JcblxuICAgICAgIyBOT1RFOiBUaGlzIHRyaWdnZXJzIGJlZm9yZSBhIGRpZENoYW5nZUFjdGl2ZVBhbmUsIHNvIHRoZSBjb3VudHMgbWlnaHQgYmUgY2FsY3VsYXRlZCBvbmNlIG9uIHBhbmUgc3dpdGNoXG4gICAgICBlZGl0b3Iub25EaWRDaGFuZ2VTZWxlY3Rpb25SYW5nZSAtPiB1cGRhdGVfY291bnQgZWRpdG9yXG5cbiAgICAjIFVwZGF0ZXMgdGhlIHZpc2liaWxpdHkgYW5kIGNvdW50IG9mIHRoZSB2aWV3XG4gICAgdXBkYXRlX3ZpZXdfYW5kX2NvdW50ID0gKGl0ZW0pID0+XG4gICAgICBAc2hvd19vcl9oaWRlX2Zvcl9pdGVtIGl0ZW1cbiAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgdXBkYXRlX2NvdW50IGVkaXRvciBpZiBlZGl0b3I/XG5cbiAgICAjIFVwZGF0ZSB3aGVuZXZlciBhY3RpdmUgaXRlbSBjaGFuZ2VzXG4gICAgYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSB1cGRhdGVfdmlld19hbmRfY291bnRcblxuICAgICMgSW5pdGlhbCB1cGRhdGVcbiAgICB1cGRhdGVfdmlld19hbmRfY291bnQgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKVxuXG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnd29yZGNvdW50LmdvYWwnLCBAdXBkYXRlX2dvYWwpXG5cbiAgdXBkYXRlX2dvYWw6IChpdGVtKSAtPlxuICAgIGlmIGl0ZW0gaXMgMFxuICAgICAgdmlldy5lbGVtZW50LnN0eWxlLmJhY2tncm91bmQgPSAndHJhbnNwYXJlbnQnXG5cbiAgc2hvd19vcl9oaWRlX2Zvcl9pdGVtOiAoaXRlbSkgLT5cbiAgICB7YWx3YXlzT24sIGV4dGVuc2lvbnMsIG5vZXh0ZW5zaW9ufSA9IGF0b20uY29uZmlnLmdldCgnd29yZGNvdW50JylcbiAgICBleHRlbnNpb25zID0gKGV4dGVuc2lvbnMgfHwgW10pLm1hcCAoZXh0ZW5zaW9uKSAtPiBleHRlbnNpb24udG9Mb3dlckNhc2UoKVxuICAgIGJ1ZmZlciA9IGl0ZW0/LmJ1ZmZlclxuXG4gICAgbm90X3RleHRfZWRpdG9yID0gbm90IGJ1ZmZlcj9cbiAgICB1bnRpdGxlZF90YWIgPSBidWZmZXI/LmZpbGUgaXMgbnVsbFxuICAgIGN1cnJlbnRfZmlsZV9leHRlbnNpb24gPSBidWZmZXI/LmZpbGU/LnBhdGgubWF0Y2goL1xcLihcXHcrKSQvKT9bMV0udG9Mb3dlckNhc2UoKVxuXG4gICAgbm9fZXh0ZW5zaW9uID0gbm9leHRlbnNpb24gYW5kIChub3QgY3VycmVudF9maWxlX2V4dGVuc2lvbj8gb3IgdW50aXRsZWRfdGFiKVxuXG4gICAgaWYgYWx3YXlzT24gb3Igbm9fZXh0ZW5zaW9uIG9yIGN1cnJlbnRfZmlsZV9leHRlbnNpb24gaW4gZXh0ZW5zaW9uc1xuICAgICAgQHZpc2libGUgPSB0cnVlXG4gICAgICB2aWV3LmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lLWJsb2NrXCIgdW5sZXNzIG5vdF90ZXh0X2VkaXRvclxuICAgIGVsc2VcbiAgICAgIEB2aXNpYmxlID0gZmFsc2VcbiAgICAgIHZpZXcuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCJcblxuICBjb25zdW1lU3RhdHVzQmFyOiAoc3RhdHVzQmFyKSAtPlxuICAgIHRpbGUgPSBzdGF0dXNCYXIuYWRkUmlnaHRUaWxlKGl0ZW06IHZpZXcuZWxlbWVudCwgcHJpb3JpdHk6IDEwMClcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIHRpbGU/LmRlc3Ryb3koKVxuICAgIHRpbGUgPSBudWxsXG4iXX0=
