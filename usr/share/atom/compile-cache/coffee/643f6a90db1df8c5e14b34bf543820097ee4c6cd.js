(function() {
  module.exports = {
    config: {
      applications: {
        type: 'string',
        "default": 'gimp,inkscape,svgTester'
      }
    },
    openInAppView: null,
    activate: function(state) {
      return atom.commands.add('atom-workspace', {
        'open-in:toggle': (function(_this) {
          return function() {
            return _this.createOpenInAppView().toggle();
          };
        })(this)
      });
    },
    createOpenInAppView: function() {
      var OpenInAppView;
      if (!this.openInAappView) {
        OpenInAppView = require('./open-in-app-view');
        this.openInAppView = new OpenInAppView();
      }
      return this.openInAppView;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2xpYnJhcnkvRW1iZXIgc2F0ZWxsaXRlIHByb2plY3RzL3dyZWF0aGUvdXNyL3NoYXJlL2F0b20vcGFja2FnZXMvb3Blbi1maWxlLWluL2xpYi9vcGVuLWZpbGUtaW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE1BQUEsRUFDRTtNQUFBLFlBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyx5QkFEVDtPQURGO0tBREY7SUFLQSxhQUFBLEVBQWUsSUFMZjtJQU9BLFFBQUEsRUFBVSxTQUFDLEtBQUQ7YUFDUixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ0U7UUFBQSxnQkFBQSxFQUFrQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUNoQixLQUFDLENBQUEsbUJBQUQsQ0FBQSxDQUFzQixDQUFDLE1BQXZCLENBQUE7VUFEZ0I7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxCO09BREY7SUFEUSxDQVBWO0lBWUEsbUJBQUEsRUFBcUIsU0FBQTtBQUNuQixVQUFBO01BQUEsSUFBQSxDQUFPLElBQUMsQ0FBQSxjQUFSO1FBQ0UsYUFBQSxHQUFnQixPQUFBLENBQVEsb0JBQVI7UUFDaEIsSUFBQyxDQUFBLGFBQUQsR0FBcUIsSUFBQSxhQUFBLENBQUEsRUFGdkI7O2FBR0EsSUFBQyxDQUFBO0lBSmtCLENBWnJCOztBQURGIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuICBjb25maWc6XG4gICAgYXBwbGljYXRpb25zOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICdnaW1wLGlua3NjYXBlLHN2Z1Rlc3RlcidcblxuICBvcGVuSW5BcHBWaWV3OiBudWxsXG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLFxuICAgICAgJ29wZW4taW46dG9nZ2xlJzogPT5cbiAgICAgICAgQGNyZWF0ZU9wZW5JbkFwcFZpZXcoKS50b2dnbGUoKVxuXG4gIGNyZWF0ZU9wZW5JbkFwcFZpZXc6IC0+XG4gICAgdW5sZXNzIEBvcGVuSW5BYXBwVmlld1xuICAgICAgT3BlbkluQXBwVmlldyA9IHJlcXVpcmUgJy4vb3Blbi1pbi1hcHAtdmlldydcbiAgICAgIEBvcGVuSW5BcHBWaWV3ID0gbmV3IE9wZW5JbkFwcFZpZXcoKVxuICAgIEBvcGVuSW5BcHBWaWV3XG4iXX0=
