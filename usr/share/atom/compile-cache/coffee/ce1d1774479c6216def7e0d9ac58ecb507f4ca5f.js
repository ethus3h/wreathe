(function() {
  var $, ResizableWidthView,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $ = require('jquery');

  module.exports = ResizableWidthView = (function() {
    ResizableWidthView.prototype.viewContainer = null;

    ResizableWidthView.prototype.mainView = null;

    ResizableWidthView.prototype.handle = null;

    ResizableWidthView.prototype.resizerPos = null;

    function ResizableWidthView(resizerPos) {
      var fragment, html;
      if (resizerPos == null) {
        resizerPos = 'left';
      }
      this.resizeView = bind(this.resizeView, this);
      this.resizeStopped = bind(this.resizeStopped, this);
      this.resizeStarted = bind(this.resizeStarted, this);
      this.resizerPos = resizerPos;
      fragment = "<div class=\"zi-width-resizer right\"></div>\n<div class=\"zi-mainview\"></div>";
      html = "<div class=\"zi-resizable\">\n" + fragment + "\n</div>";
      this.viewContainer = $(html);
      this.mainView = this.viewContainer.find('.zi-mainview');
      this.handle = this.viewContainer.find('.zi-width-resizer');
      this.handleEvents();
    }

    ResizableWidthView.prototype.handleEvents = function() {
      this.handle.on('dblclick', (function(_this) {
        return function() {
          return _this.resizeToFitContent();
        };
      })(this));
      return this.handle.on('mousedown', (function(_this) {
        return function(e) {
          return _this.resizeStarted(e);
        };
      })(this));
    };

    ResizableWidthView.prototype.resizeStarted = function() {
      $(document).on('mousemove', this.resizeView);
      return $(document).on('mouseup', this.resizeStopped);
    };

    ResizableWidthView.prototype.resizeStopped = function() {
      $(document).off('mousemove', this.resizeView);
      return $(document).off('mouseup', this.resizeStopped);
    };

    ResizableWidthView.prototype.resizeView = function(arg) {
      var deltaX, pageX, which, width;
      pageX = arg.pageX, which = arg.which;
      if (which !== 1) {
        return this.resizeStopped();
      }
      if (this.resizerPos === 'left') {
        deltaX = this.handle.offset().left - pageX;
        width = this.viewContainer.width() + deltaX;
      } else {
        deltaX = pageX - this.handle.offset().left;
        width = this.viewContainer.width() + deltaX;
      }
      return this.viewContainer.width(width);
    };

    ResizableWidthView.prototype.resizeToFitContent = function() {
      return this.viewContainer.width(this.mainView.width() + 20);
    };

    ResizableWidthView.prototype.moveHandleLeft = function() {
      this.handle.addClass('left');
      this.handle.removeClass('right');
      return this.resizerPos = 'left';
    };

    ResizableWidthView.prototype.moveHandleRight = function() {
      this.handle.addClass('right');
      this.handle.removeClass('left');
      return this.resizerPos = 'right';
    };

    return ResizableWidthView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2xpYnJhcnkvRW1iZXIgc2F0ZWxsaXRlIHByb2plY3RzL3dyZWF0aGUtYmFzZS91c3Ivc2hhcmUvYXRvbS9wYWNrYWdlcy9uYXYtcGFuZWwtcGx1cy9saWIvcmVzaXphYmxlLXdpZHRoLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxxQkFBQTtJQUFBOztFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjs7RUFFSixNQUFNLENBQUMsT0FBUCxHQUNNO2lDQUNKLGFBQUEsR0FBZTs7aUNBQ2YsUUFBQSxHQUFVOztpQ0FDVixNQUFBLEdBQVE7O2lDQUNSLFVBQUEsR0FBWTs7SUFHQyw0QkFBQyxVQUFEO0FBQ1gsVUFBQTs7UUFEWSxhQUFhOzs7OztNQUN6QixJQUFDLENBQUEsVUFBRCxHQUFjO01BRWQsUUFBQSxHQUFXO01BS1gsSUFBQSxHQUFPLGdDQUFBLEdBRUwsUUFGSyxHQUVJO01BR1gsSUFBQyxDQUFBLGFBQUQsR0FBaUIsQ0FBQSxDQUFFLElBQUY7TUFDakIsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFDLENBQUEsYUFBYSxDQUFDLElBQWYsQ0FBb0IsY0FBcEI7TUFDWixJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxhQUFhLENBQUMsSUFBZixDQUFvQixtQkFBcEI7TUFDVixJQUFDLENBQUEsWUFBRCxDQUFBO0lBaEJXOztpQ0FtQmIsWUFBQSxHQUFjLFNBQUE7TUFDWixJQUFDLENBQUEsTUFBTSxDQUFDLEVBQVIsQ0FBVyxVQUFYLEVBQXVCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDckIsS0FBQyxDQUFBLGtCQUFELENBQUE7UUFEcUI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZCO2FBR0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxFQUFSLENBQVksV0FBWixFQUF5QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtpQkFBTyxLQUFDLENBQUEsYUFBRCxDQUFlLENBQWY7UUFBUDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekI7SUFKWTs7aUNBT2QsYUFBQSxHQUFlLFNBQUE7TUFDYixDQUFBLENBQUUsUUFBRixDQUFXLENBQUMsRUFBWixDQUFlLFdBQWYsRUFBNEIsSUFBQyxDQUFBLFVBQTdCO2FBQ0EsQ0FBQSxDQUFFLFFBQUYsQ0FBVyxDQUFDLEVBQVosQ0FBZSxTQUFmLEVBQTBCLElBQUMsQ0FBQSxhQUEzQjtJQUZhOztpQ0FLZixhQUFBLEdBQWUsU0FBQTtNQUNiLENBQUEsQ0FBRSxRQUFGLENBQVcsQ0FBQyxHQUFaLENBQWdCLFdBQWhCLEVBQTZCLElBQUMsQ0FBQSxVQUE5QjthQUNBLENBQUEsQ0FBRSxRQUFGLENBQVcsQ0FBQyxHQUFaLENBQWdCLFNBQWhCLEVBQTJCLElBQUMsQ0FBQSxhQUE1QjtJQUZhOztpQ0FLZixVQUFBLEdBQVksU0FBQyxHQUFEO0FBQ1YsVUFBQTtNQURZLG1CQUFPO01BQ25CLElBQStCLEtBQUEsS0FBUyxDQUF4QztBQUFBLGVBQU8sSUFBQyxDQUFBLGFBQUQsQ0FBQSxFQUFQOztNQUVBLElBQUcsSUFBQyxDQUFBLFVBQUQsS0FBZSxNQUFsQjtRQUNFLE1BQUEsR0FBUyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsQ0FBQSxDQUFnQixDQUFDLElBQWpCLEdBQXdCO1FBQ2pDLEtBQUEsR0FBUSxJQUFDLENBQUEsYUFBYSxDQUFDLEtBQWYsQ0FBQSxDQUFBLEdBQXlCLE9BRm5DO09BQUEsTUFBQTtRQUlFLE1BQUEsR0FBVSxLQUFBLEdBQVEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLENBQUEsQ0FBZ0IsQ0FBQztRQUNuQyxLQUFBLEdBQVEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxLQUFmLENBQUEsQ0FBQSxHQUF5QixPQUxuQzs7YUFNQSxJQUFDLENBQUEsYUFBYSxDQUFDLEtBQWYsQ0FBcUIsS0FBckI7SUFUVTs7aUNBV1osa0JBQUEsR0FBb0IsU0FBQTthQUNsQixJQUFDLENBQUEsYUFBYSxDQUFDLEtBQWYsQ0FBcUIsSUFBQyxDQUFBLFFBQVEsQ0FBQyxLQUFWLENBQUEsQ0FBQSxHQUFvQixFQUF6QztJQURrQjs7aUNBR3BCLGNBQUEsR0FBZ0IsU0FBQTtNQUNkLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixDQUFpQixNQUFqQjtNQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBUixDQUFvQixPQUFwQjthQUNBLElBQUMsQ0FBQSxVQUFELEdBQWM7SUFIQTs7aUNBS2hCLGVBQUEsR0FBaUIsU0FBQTtNQUNmLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixDQUFpQixPQUFqQjtNQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBUixDQUFvQixNQUFwQjthQUNBLElBQUMsQ0FBQSxVQUFELEdBQWM7SUFIQzs7Ozs7QUFqRW5CIiwic291cmNlc0NvbnRlbnQiOlsiJCA9IHJlcXVpcmUgJ2pxdWVyeSdcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgUmVzaXphYmxlV2lkdGhWaWV3XG4gIHZpZXdDb250YWluZXI6IG51bGxcbiAgbWFpblZpZXc6IG51bGxcbiAgaGFuZGxlOiBudWxsXG4gIHJlc2l6ZXJQb3M6IG51bGxcblxuXG4gIGNvbnN0cnVjdG9yOiAocmVzaXplclBvcyA9ICdsZWZ0JyktPlxuICAgIEByZXNpemVyUG9zID0gcmVzaXplclBvc1xuXG4gICAgZnJhZ21lbnQgPSBcIlwiXCJcbiAgICA8ZGl2IGNsYXNzPVwiemktd2lkdGgtcmVzaXplciByaWdodFwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJ6aS1tYWludmlld1wiPjwvZGl2PlxuICAgIFwiXCJcIlxuXG4gICAgaHRtbCA9IFwiXCJcIlxuICAgIDxkaXYgY2xhc3M9XCJ6aS1yZXNpemFibGVcIj5cbiAgICAje2ZyYWdtZW50fVxuICAgIDwvZGl2PlxuICAgIFwiXCJcIlxuICAgIEB2aWV3Q29udGFpbmVyID0gJChodG1sKVxuICAgIEBtYWluVmlldyA9IEB2aWV3Q29udGFpbmVyLmZpbmQoJy56aS1tYWludmlldycpXG4gICAgQGhhbmRsZSA9IEB2aWV3Q29udGFpbmVyLmZpbmQoJy56aS13aWR0aC1yZXNpemVyJylcbiAgICBAaGFuZGxlRXZlbnRzKClcblxuXG4gIGhhbmRsZUV2ZW50czogLT5cbiAgICBAaGFuZGxlLm9uICdkYmxjbGljaycsID0+XG4gICAgICBAcmVzaXplVG9GaXRDb250ZW50KClcblxuICAgIEBoYW5kbGUub24gICdtb3VzZWRvd24nLCAoZSkgPT4gQHJlc2l6ZVN0YXJ0ZWQoZSlcblxuXG4gIHJlc2l6ZVN0YXJ0ZWQ6ID0+XG4gICAgJChkb2N1bWVudCkub24oJ21vdXNlbW92ZScsIEByZXNpemVWaWV3KVxuICAgICQoZG9jdW1lbnQpLm9uKCdtb3VzZXVwJywgQHJlc2l6ZVN0b3BwZWQpXG5cblxuICByZXNpemVTdG9wcGVkOiA9PlxuICAgICQoZG9jdW1lbnQpLm9mZignbW91c2Vtb3ZlJywgQHJlc2l6ZVZpZXcpXG4gICAgJChkb2N1bWVudCkub2ZmKCdtb3VzZXVwJywgQHJlc2l6ZVN0b3BwZWQpXG5cblxuICByZXNpemVWaWV3OiAoe3BhZ2VYLCB3aGljaH0pID0+XG4gICAgcmV0dXJuIEByZXNpemVTdG9wcGVkKCkgdW5sZXNzIHdoaWNoIGlzIDFcblxuICAgIGlmIEByZXNpemVyUG9zID09ICdsZWZ0J1xuICAgICAgZGVsdGFYID0gQGhhbmRsZS5vZmZzZXQoKS5sZWZ0IC0gcGFnZVhcbiAgICAgIHdpZHRoID0gQHZpZXdDb250YWluZXIud2lkdGgoKSArIGRlbHRhWFxuICAgIGVsc2VcbiAgICAgIGRlbHRhWCA9ICBwYWdlWCAtIEBoYW5kbGUub2Zmc2V0KCkubGVmdFxuICAgICAgd2lkdGggPSBAdmlld0NvbnRhaW5lci53aWR0aCgpICsgZGVsdGFYXG4gICAgQHZpZXdDb250YWluZXIud2lkdGgod2lkdGgpXG5cbiAgcmVzaXplVG9GaXRDb250ZW50OiAtPlxuICAgIEB2aWV3Q29udGFpbmVyLndpZHRoKEBtYWluVmlldy53aWR0aCgpICsgMjApXG5cbiAgbW92ZUhhbmRsZUxlZnQ6IC0+XG4gICAgQGhhbmRsZS5hZGRDbGFzcygnbGVmdCcpXG4gICAgQGhhbmRsZS5yZW1vdmVDbGFzcygncmlnaHQnKVxuICAgIEByZXNpemVyUG9zID0gJ2xlZnQnXG5cbiAgbW92ZUhhbmRsZVJpZ2h0OiAtPlxuICAgIEBoYW5kbGUuYWRkQ2xhc3MoJ3JpZ2h0JylcbiAgICBAaGFuZGxlLnJlbW92ZUNsYXNzKCdsZWZ0JylcbiAgICBAcmVzaXplclBvcyA9ICdyaWdodCdcbiJdfQ==
