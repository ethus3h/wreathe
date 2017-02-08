Object.defineProperty(exports, '__esModule', {
  value: true
});

var _atom = require('atom');

'use babel';

exports['default'] = {
  subscriptions: null,

  activate: function activate() {
    this.subscriptions = new _atom.CompositeDisposable();
  },

  deactivate: function deactivate() {
    if (this.subscriptions) {
      this.subscriptions.dispose();
    }
    this.subscriptions = null;
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2t5YW4vLmF0b20vcGFja2FnZXMvbGludC9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O29CQUVrQyxNQUFNOztBQUZ4QyxXQUFXLENBQUE7O3FCQUlJO0FBQ2IsZUFBYSxFQUFFLElBQUk7O0FBRW5CLFVBQVEsRUFBQyxvQkFBRztBQUNWLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7R0FDL0M7O0FBRUQsWUFBVSxFQUFDLHNCQUFHO0FBQ1osUUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ3RCLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDN0I7QUFDRCxRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQTtHQUMxQjtDQUNGIiwiZmlsZSI6Ii9ob21lL2t5YW4vLmF0b20vcGFja2FnZXMvbGludC9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcblxuZXhwb3J0IGRlZmF1bHQge1xuICBzdWJzY3JpcHRpb25zOiBudWxsLFxuXG4gIGFjdGl2YXRlICgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSAoKSB7XG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9ucykge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBudWxsXG4gIH1cbn1cbiJdfQ==
//# sourceURL=/home/kyan/.atom/packages/lint/lib/main.js
