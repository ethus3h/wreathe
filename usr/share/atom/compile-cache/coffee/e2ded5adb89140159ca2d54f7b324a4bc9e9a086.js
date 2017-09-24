(function() {
  var $, CompositeDisposable, NavView, Parser, path;

  $ = require('jquery');

  NavView = require('./nav-view');

  Parser = require('./nav-parser');

  path = require('path');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    navView: null,
    parser: null,
    subscriptions: null,
    config: {
      collapsedGroups: {
        title: 'Groups that are initially collapsed',
        description: 'List groups separated by comma (e.g. Variable) ',
        type: 'string',
        "default": 'Variable'
      },
      ignoredGroups: {
        title: 'Groups that are ignored',
        description: 'These groups will not be displayed at all',
        type: 'string',
        "default": ''
      },
      topGroups: {
        title: 'Groups at top',
        description: 'Groups that are displayed at the top, irrespective of sorting',
        type: 'string',
        "default": 'Bookmarks, Todo'
      },
      noDups: {
        title: 'No Duplicates',
        type: 'boolean',
        "default": true
      },
      leftPanel: {
        title: 'Should panel be on the left',
        type: 'boolean',
        "default": false
      }
    },
    activate: function(state) {
      var settings;
      this.enabled = !(state.enabled === false);
      this.subscriptions = new CompositeDisposable;
      settings = atom.config.getAll('nav-panel-plus')[0].value;
      settings.leftPanel = settings.leftPanel ? 'left' : 'right';
      this.parser = new Parser();
      this.navView = new NavView(state, settings, this.parser);
      this.subscriptions.add(atom.config.onDidChange('nav-panel-plus', (function(_this) {
        return function(event) {
          var i, key, len, value;
          settings = event.newValue;
          for (value = i = 0, len = settings.length; i < len; value = ++i) {
            key = settings[value];
            if (key.indexOf('Groups') > 0) {
              settings[key] = value.split(',');
            }
          }
          settings.leftPanel = settings.leftPanel ? 'left' : 'right';
          return _this.navView.changeSettings(settings);
        };
      })(this)));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'nav-panel-plus:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'nav-panel-plus:changeSide': (function(_this) {
          return function() {
            return _this.changePanelSide();
          };
        })(this)
      }));
      this.subscriptions.add(atom.workspace.onDidStopChangingActivePaneItem((function(_this) {
        return function(paneItem) {
          var editor, editorFile;
          editor = atom.workspace.getActiveTextEditor();
          if (!editor) {
            return _this.navView.hide();
          }
          if (editor !== paneItem) {
            return;
          }
          editorFile = editor.getPath();
          _this.navView.setFile(editorFile);
          if (!(editor && editor.onDidSave)) {
            return;
          }
          if (!editor.ziOnEditorSave) {
            editor.ziOnEditorSave = editor.onDidSave(function(event) {
              if (!_this.enabled) {
                return;
              }
              return setTimeout(function() {
                editorFile = editor.getPath();
                if (editorFile) {
                  return _this.navView.updateFile(editorFile);
                }
              }, 200);
            });
            _this.subscriptions.add(editor.ziOnEditorSave);
            return _this.subscriptions.add(editor.onDidDestroy(function() {
              return _this.navView.closeFile(editorFile);
            }));
          }
        };
      })(this)));
      return this.subscriptions.add(atom.workspace.onWillDestroyPaneItem((function(_this) {
        return function(event) {
          if (event.item.ziOnEditorSave) {
            return _this.navView.saveFileState(event.item.getPath());
          }
        };
      })(this)));
    },
    deactivate: function() {
      this.navView.destroy();
      this.parser.destroy();
      this.subscriptions.dispose();
      return this.navView = null;
    },
    serialize: function() {
      return {
        enabled: this.enabled,
        fileStates: this.navView.getState()
      };
    },
    toggle: function() {
      this.enabled = !this.enabled;
      return this.navView.enable(this.enabled);
    },
    changePanelSide: function() {
      return this.navView.movePanel();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2xpYnJhcnkvRW1iZXIgc2F0ZWxsaXRlIHByb2plY3RzL3dyZWF0aGUtYmFzZS91c3Ivc2hhcmUvYXRvbS9wYWNrYWdlcy9uYXYtcGFuZWwtcGx1cy9saWIvbmF2LXBhbmVsLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztFQUNKLE9BQUEsR0FBVSxPQUFBLENBQVEsWUFBUjs7RUFDVixNQUFBLEdBQVMsT0FBQSxDQUFRLGNBQVI7O0VBRVQsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVOLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFHeEIsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE9BQUEsRUFBUyxJQUFUO0lBQ0EsTUFBQSxFQUFRLElBRFI7SUFFQSxhQUFBLEVBQWUsSUFGZjtJQUlBLE1BQUEsRUFDRTtNQUFBLGVBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxxQ0FBUDtRQUNBLFdBQUEsRUFBYSxpREFEYjtRQUVBLElBQUEsRUFBTSxRQUZOO1FBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxVQUhUO09BREY7TUFLQSxhQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8seUJBQVA7UUFDQSxXQUFBLEVBQWEsMkNBRGI7UUFFQSxJQUFBLEVBQU0sUUFGTjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFIVDtPQU5GO01BVUEsU0FBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLGVBQVA7UUFDQSxXQUFBLEVBQWEsK0RBRGI7UUFFQSxJQUFBLEVBQU0sUUFGTjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsaUJBSFQ7T0FYRjtNQWVBLE1BQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxlQUFQO1FBQ0EsSUFBQSxFQUFNLFNBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRlQ7T0FoQkY7TUFtQkEsU0FBQSxFQUNFO1FBQUEs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LElBQUMsQ0FBQSxPQUFPLENBQUMsUUFBVCxDQUFBLENBRFo7O0lBRFMsQ0F6Rlg7SUE4RkEsTUFBQSxFQUFRLFNBQUE7TUFDTixJQUFDLENBQUEsT0FBRCxHQUFXLENBQUksSUFBQyxDQUFBO2FBQ2hCLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxDQUFnQixJQUFDLENBQUEsT0FBakI7SUFGTSxDQTlGUjtJQWtHQSxlQUFBLEVBQWlCLFNBQUE7YUFDZixJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVQsQ0FBQTtJQURlLENBbEdqQjs7QUFWRiIsInNvdXJjZXNDb250ZW50IjpbIiQgPSByZXF1aXJlICdqcXVlcnknXG5OYXZWaWV3ID0gcmVxdWlyZSAnLi9uYXYtdmlldydcblBhcnNlciA9IHJlcXVpcmUgJy4vbmF2LXBhcnNlcidcblxucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5cbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cblxubW9kdWxlLmV4cG9ydHMgPVxuICBuYXZWaWV3OiBudWxsXG4gIHBhcnNlcjogbnVsbFxuICBzdWJzY3JpcHRpb25zOiBudWxsXG5cbiAgY29uZmlnOlxuICAgIGNvbGxhcHNlZEdyb3VwczpcbiAgICAgIHRpdGxlOiAnR3JvdXBzIHRoYXQgYXJlIGluaXRpYWxseSBjb2xsYXBzZWQnXG4gICAgICBkZXNjcmlwdGlvbjogJ0xpc3QgZ3JvdXBzIHNlcGFyYXRlZCBieSBjb21tYSAoZS5nLiBWYXJpYWJsZSkgJ1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICdWYXJpYWJsZSdcbiAgICBpZ25vcmVkR3JvdXBzOlxuICAgICAgdGl0bGU6ICdHcm91cHMgdGhhdCBhcmUgaWdub3JlZCdcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlc2UgZ3JvdXBzIHdpbGwgbm90IGJlIGRpc3BsYXllZCBhdCBhbGwnXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJydcbiAgICB0b3BHcm91cHM6XG4gICAgICB0aXRsZTogJ0dyb3VwcyBhdCB0b3AnXG4gICAgICBkZXNjcmlwdGlvbjogJ0dyb3VwcyB0aGF0IGFyZSBkaXNwbGF5ZWQgYXQgdGhlIHRvcCwgaXJyZXNwZWN0aXZlIG9mIHNvcnRpbmcnXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJ0Jvb2ttYXJrcywgVG9kbydcbiAgICBub0R1cHM6XG4gICAgICB0aXRsZTogJ05vIER1cGxpY2F0ZXMnXG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICBsZWZ0UGFuZWw6XG4gICAgICB0aXRsZTogJ1Nob3VsZCBwYW5lbCBiZSBvbiB0aGUgbGVmdCdcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcblxuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgQGVuYWJsZWQgPSAhKHN0YXRlLmVuYWJsZWQgPT0gZmFsc2UpXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgc2V0dGluZ3MgPSBhdG9tLmNvbmZpZy5nZXRBbGwoJ25hdi1wYW5lbC1wbHVzJylbMF0udmFsdWVcbiAgICBzZXR0aW5ncy5sZWZ0UGFuZWwgPSBpZiBzZXR0aW5ncy5sZWZ0UGFuZWwgdGhlbiAnbGVmdCcgZWxzZSAncmlnaHQnXG5cbiAgICBAcGFyc2VyID0gbmV3IFBhcnNlcigpXG4gICAgQG5hdlZpZXcgPSBuZXcgTmF2VmlldyhzdGF0ZSwgc2V0dGluZ3MsIEBwYXJzZXIpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ25hdi1wYW5lbC1wbHVzJywgKGV2ZW50KSA9PlxuICAgICAgc2V0dGluZ3MgPSBldmVudC5uZXdWYWx1ZVxuICAgICAgZm9yIGtleSwgdmFsdWUgaW4gc2V0dGluZ3NcbiAgICAgICAgaWYga2V5LmluZGV4T2YoJ0dyb3VwcycpID4gMFxuICAgICAgICAgIHNldHRpbmdzW2tleV0gPSB2YWx1ZS5zcGxpdCgnLCcpXG4gICAgICBzZXR0aW5ncy5sZWZ0UGFuZWwgPSBpZiBzZXR0aW5ncy5sZWZ0UGFuZWwgdGhlbiAnbGVmdCcgZWxzZSAncmlnaHQnXG4gICAgICBAbmF2Vmlldy5jaGFuZ2VTZXR0aW5ncyhzZXR0aW5ncylcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnXG4gICAgICAsICduYXYtcGFuZWwtcGx1czp0b2dnbGUnOiA9PiBAdG9nZ2xlKClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnXG4gICAgICAsICduYXYtcGFuZWwtcGx1czpjaGFuZ2VTaWRlJzogPT4gQGNoYW5nZVBhbmVsU2lkZSgpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS53b3Jrc3BhY2Uub25EaWRTdG9wQ2hhbmdpbmdBY3RpdmVQYW5lSXRlbSAocGFuZUl0ZW0pPT5cbiAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgcmV0dXJuIEBuYXZWaWV3LmhpZGUoKSB1bmxlc3MgZWRpdG9yXG4gICAgICByZXR1cm4gaWYgZWRpdG9yICE9IHBhbmVJdGVtXG4gICAgICBlZGl0b3JGaWxlID0gZWRpdG9yLmdldFBhdGgoKSAjIHVuZGVmaW5lZCBmb3IgbmV3IGZpbGVcbiAgICAgIEBuYXZWaWV3LnNldEZpbGUoZWRpdG9yRmlsZSlcbiAgICAgICMgUGFuZWwgYWxzbyBuZWVkcyB0byBiZSB1cGRhdGVkIHdoZW4gdGV4dCBzYXZlZFxuICAgICAgcmV0dXJuIHVubGVzcyBlZGl0b3IgYW5kIGVkaXRvci5vbkRpZFNhdmVcbiAgICAgIGlmICFlZGl0b3IuemlPbkVkaXRvclNhdmVcbiAgICAgICAgZWRpdG9yLnppT25FZGl0b3JTYXZlID0gZWRpdG9yLm9uRGlkU2F2ZSAoZXZlbnQpID0+XG4gICAgICAgICAgcmV0dXJuIHVubGVzcyBAZW5hYmxlZFxuICAgICAgICAgICMgV2l0aCBhdXRvc2F2ZSwgdGhpcyBnZXRzIGNhbGxlZCBiZWZvcmUgb25DbGljay5cbiAgICAgICAgICAjIFdlIHdhbnQgY2xpY2sgdG8gYmUgaGFuZGxlZCBmaXJzdFxuICAgICAgICAgICMgc2V0SW1tZWRpYXRlIGRpZG4ndCB3b3JrLlxuICAgICAgICAgIHNldFRpbWVvdXQgPT5cbiAgICAgICAgICAgIGVkaXRvckZpbGUgPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICAgICAgICBAbmF2Vmlldy51cGRhdGVGaWxlKGVkaXRvckZpbGUpIGlmIGVkaXRvckZpbGVcbiAgICAgICAgICAsIDIwMFxuICAgICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgZWRpdG9yLnppT25FZGl0b3JTYXZlXG5cbiAgICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGVkaXRvci5vbkRpZERlc3Ryb3kgPT5cbiAgICAgICAgICBAbmF2Vmlldy5jbG9zZUZpbGUoZWRpdG9yRmlsZSlcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLndvcmtzcGFjZS5vbldpbGxEZXN0cm95UGFuZUl0ZW0gKGV2ZW50KT0+XG4gICAgICBpZiBldmVudC5pdGVtLnppT25FZGl0b3JTYXZlXG4gICAgICAgIEBuYXZWaWV3LnNhdmVGaWxlU3RhdGUoZXZlbnQuaXRlbS5nZXRQYXRoKCkpXG5cblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBuYXZWaWV3LmRlc3Ryb3koKVxuICAgIEBwYXJzZXIuZGVzdHJveSgpXG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgQG5hdlZpZXcgPSBudWxsXG5cblxuICBzZXJpYWxpemU6IC0+XG4gICAgZW5hYmxlZDogQGVuYWJsZWRcbiAgICBmaWxlU3RhdGVzOiBAbmF2Vmlldy5nZXRTdGF0ZSgpXG5cblxuICB0b2dnbGU6IC0+XG4gICAgQGVuYWJsZWQgPSBub3QgQGVuYWJsZWRcbiAgICBAbmF2Vmlldy5lbmFibGUoQGVuYWJsZWQpXG5cbiAgY2hhbmdlUGFuZWxTaWRlOiAtPlxuICAgIEBuYXZWaWV3Lm1vdmVQYW5lbCgpXG4iXX0=
