Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _reactForAtom = require('react-for-atom');

var _componentsStatusBarTileComponent = require('./components/StatusBarTileComponent');

var _componentsStatusBarTileComponent2 = _interopRequireDefault(_componentsStatusBarTileComponent);

'use babel';

var StatusBarTile = (function () {
  function StatusBarTile(store) {
    var _this = this;

    _classCallCheck(this, StatusBarTile);

    this.store = store;
    this.unsubscribe = this.store.subscribe(function () {
      _this.render();
    });
  }

  _createClass(StatusBarTile, [{
    key: 'dispose',
    value: function dispose() {
      this.unsubscribe();

      if (this.tile) {
        this.tile.destroy();
        this.tile = null;
      }

      if (this.node) {
        _reactForAtom.ReactDOM.unmountComponentAtNode(this.node);
        this.node = null;
      }
    }
  }, {
    key: 'consumeStatusBar',
    value: function consumeStatusBar(statusBar) {
      var item = document.createElement('div');
      item.className = 'inline-block';
      this.node = item;

      this.tile = statusBar.addRightTile({
        item: item,
        priority: 1000
      });

      this.render();
    }
  }, {
    key: 'render',
    value: function render() {
      var props = {
        refactorInProgress: this.store.getState().refactorInProgress
      };

      _reactForAtom.ReactDOM.render(_reactForAtom.React.createElement(_componentsStatusBarTileComponent2['default'], props), this.node);
    }
  }]);

  return StatusBarTile;
})();

exports['default'] = StatusBarTile;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9saWJyYXJ5L0VtYmVyIHNhdGVsbGl0ZSBwcm9qZWN0cy93cmVhdGhlLWJhc2UvdXNyL3NoYXJlL2F0b20vcGFja2FnZXMvamF2YXNjcmlwdC1yZWZhY3Rvci9saWIvU3RhdHVzQmFyVGlsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OzRCQUdnQyxnQkFBZ0I7O2dEQUNiLHFDQUFxQzs7OztBQUp4RSxXQUFXLENBQUM7O0lBT1MsYUFBYTtBQU1yQixXQU5RLGFBQWEsQ0FNcEIsS0FBWSxFQUFFOzs7MEJBTlAsYUFBYTs7QUFPOUIsUUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbkIsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxZQUFNO0FBQzVDLFlBQUssTUFBTSxFQUFFLENBQUM7S0FDZixDQUFDLENBQUM7R0FDSjs7ZUFYa0IsYUFBYTs7V0FhekIsbUJBQUc7QUFDUixVQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7O0FBRW5CLFVBQUksSUFBSSxDQUFDLElBQUksRUFBRTtBQUNiLFlBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDcEIsWUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7T0FDbEI7O0FBRUQsVUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ2IsK0JBQVMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNDLFlBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO09BQ2xCO0tBQ0Y7OztXQUVlLDBCQUFDLFNBQXlCLEVBQUU7QUFDMUMsVUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzQyxVQUFJLENBQUMsU0FBUyxHQUFHLGNBQWMsQ0FBQztBQUNoQyxVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFakIsVUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsWUFBWSxDQUFDO0FBQ2pDLFlBQUksRUFBSixJQUFJO0FBQ0osZ0JBQVEsRUFBRSxJQUFJO09BQ2YsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNmOzs7V0FFSyxrQkFBRztBQUNQLFVBQU0sS0FBSyxHQUFHO0FBQ1osMEJBQWtCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxrQkFBa0I7T0FDN0QsQ0FBQzs7QUFFRiw2QkFBUyxNQUFNLENBQUMsaUZBQTRCLEtBQUssQ0FBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNuRTs7O1NBOUNrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiIvbGlicmFyeS9FbWJlciBzYXRlbGxpdGUgcHJvamVjdHMvd3JlYXRoZS1iYXNlL3Vzci9zaGFyZS9hdG9tL3BhY2thZ2VzL2phdmFzY3JpcHQtcmVmYWN0b3IvbGliL1N0YXR1c0JhclRpbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLy8gQGZsb3dcbmltcG9ydCB7IFJlYWN0LCBSZWFjdERPTSB9IGZyb20gJ3JlYWN0LWZvci1hdG9tJztcbmltcG9ydCBTdGF0dXNCYXJUaWxlQ29tcG9uZW50IGZyb20gJy4vY29tcG9uZW50cy9TdGF0dXNCYXJUaWxlQ29tcG9uZW50JztcbmltcG9ydCB0eXBlIHsgU3RvcmUgfSBmcm9tICcuL3R5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RhdHVzQmFyVGlsZSB7XG4gIHN0b3JlOiBhbnk7XG4gIHVuc3Vic2NyaWJlOiBhbnk7XG4gIG5vZGU6ID9IVE1MRGl2RWxlbWVudDtcbiAgdGlsZTogP2F0b20kU3RhdHVzQmFyVGlsZTtcblxuICBjb25zdHJ1Y3RvcihzdG9yZTogU3RvcmUpIHtcbiAgICB0aGlzLnN0b3JlID0gc3RvcmU7XG4gICAgdGhpcy51bnN1YnNjcmliZSA9IHRoaXMuc3RvcmUuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfSk7XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcblxuICAgIGlmICh0aGlzLnRpbGUpIHtcbiAgICAgIHRoaXMudGlsZS5kZXN0cm95KCk7XG4gICAgICB0aGlzLnRpbGUgPSBudWxsO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm5vZGUpIHtcbiAgICAgIFJlYWN0RE9NLnVubW91bnRDb21wb25lbnRBdE5vZGUodGhpcy5ub2RlKTtcbiAgICAgIHRoaXMubm9kZSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgY29uc3VtZVN0YXR1c0JhcihzdGF0dXNCYXI6IGF0b20kU3RhdHVzQmFyKSB7XG4gICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGl0ZW0uY2xhc3NOYW1lID0gJ2lubGluZS1ibG9jayc7XG4gICAgdGhpcy5ub2RlID0gaXRlbTtcblxuICAgIHRoaXMudGlsZSA9IHN0YXR1c0Jhci5hZGRSaWdodFRpbGUoe1xuICAgICAgaXRlbSxcbiAgICAgIHByaW9yaXR5OiAxMDAwLFxuICAgIH0pO1xuXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgIHJlZmFjdG9ySW5Qcm9ncmVzczogdGhpcy5zdG9yZS5nZXRTdGF0ZSgpLnJlZmFjdG9ySW5Qcm9ncmVzcyxcbiAgICB9O1xuXG4gICAgUmVhY3RET00ucmVuZGVyKDxTdGF0dXNCYXJUaWxlQ29tcG9uZW50IHsuLi5wcm9wc30gLz4sIHRoaXMubm9kZSk7XG4gIH1cbn1cbiJdfQ==