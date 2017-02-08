(function() {
  var ZipFolderView;

  module.exports = ZipFolderView = (function() {
    function ZipFolderView(serializedState) {
      var message;
      this.element = document.createElement('div');
      this.element.classList.add('zip-folder');
      message = document.createElement('div');
      message.textContent = "Initializing";
      message.classList.add('message');
      this.element.appendChild(message);
    }

    ZipFolderView.prototype.serialize = function() {};

    ZipFolderView.prototype.destroy = function() {
      return this.element.remove();
    };

    ZipFolderView.prototype.getElement = function() {
      return this.element;
    };

    return ZipFolderView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2xpYnJhcnkvRW1iZXIgc2F0ZWxsaXRlIHByb2plY3RzL3dyZWF0aGUvdXNyL3NoYXJlL2F0b20vcGFja2FnZXMvemlwLWZvbGRlci9saWIvemlwLWZvbGRlci12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNTLHVCQUFDLGVBQUQ7QUFFWCxVQUFBO01BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QjtNQUNYLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLFlBQXZCO01BR0EsT0FBQSxHQUFVLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCO01BQ1YsT0FBTyxDQUFDLFdBQVIsR0FBc0I7TUFDdEIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFsQixDQUFzQixTQUF0QjtNQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxDQUFxQixPQUFyQjtJQVRXOzs0QkFZYixTQUFBLEdBQVcsU0FBQSxHQUFBOzs0QkFHWCxPQUFBLEdBQVMsU0FBQTthQUNQLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxDQUFBO0lBRE87OzRCQUdULFVBQUEsR0FBWSxTQUFBO2FBQ1YsSUFBQyxDQUFBO0lBRFM7Ozs7O0FBcEJkIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgWmlwRm9sZGVyVmlld1xuICBjb25zdHJ1Y3RvcjogKHNlcmlhbGl6ZWRTdGF0ZSkgLT5cbiAgICAjIENyZWF0ZSByb290IGVsZW1lbnRcbiAgICBAZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgQGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnemlwLWZvbGRlcicpXG5cbiAgICAjIENyZWF0ZSBtZXNzYWdlIGVsZW1lbnRcbiAgICBtZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gXCJJbml0aWFsaXppbmdcIlxuICAgIG1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnbWVzc2FnZScpXG4gICAgQGVsZW1lbnQuYXBwZW5kQ2hpbGQobWVzc2FnZSlcblxuICAjIFJldHVybnMgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHJldHJpZXZlZCB3aGVuIHBhY2thZ2UgaXMgYWN0aXZhdGVkXG4gIHNlcmlhbGl6ZTogLT5cblxuICAjIFRlYXIgZG93biBhbnkgc3RhdGUgYW5kIGRldGFjaFxuICBkZXN0cm95OiAtPlxuICAgIEBlbGVtZW50LnJlbW92ZSgpXG5cbiAgZ2V0RWxlbWVudDogLT5cbiAgICBAZWxlbWVudFxuIl19
