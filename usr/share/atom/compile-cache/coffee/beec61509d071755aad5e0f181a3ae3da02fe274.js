(function() {
  var CompositeDisposable, RenameDialog, StatusIcon,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  RenameDialog = null;

  module.exports = StatusIcon = (function(_super) {
    __extends(StatusIcon, _super);

    function StatusIcon() {
      return StatusIcon.__super__.constructor.apply(this, arguments);
    }

    StatusIcon.prototype.active = false;

    StatusIcon.prototype.initialize = function(terminalView) {
      var _ref;
      this.terminalView = terminalView;
      this.classList.add('pio-terminal-status-icon');
      this.icon = document.createElement('i');
      this.icon.classList.add('icon', 'icon-terminal');
      this.appendChild(this.icon);
      this.name = document.createElement('span');
      this.name.classList.add('name');
      this.appendChild(this.name);
      this.dataset.type = (_ref = this.terminalView.constructor) != null ? _ref.name : void 0;
      this.addEventListener('click', (function(_this) {
        return function(_arg) {
          var ctrlKey, which;
          which = _arg.which, ctrlKey = _arg.ctrlKey;
          if (which === 1) {
            _this.terminalView.toggle();
            return true;
          } else if (which === 2) {
            _this.terminalView.destroy();
            return false;
          }
        };
      })(this));
      return this.setupTooltip();
    };

    StatusIcon.prototype.setupTooltip = function() {
      var onMouseEnter;
      onMouseEnter = (function(_this) {
        return function(event) {
          if (event.detail === 'platformio-ide-terminal') {
            return;
          }
          return _this.updateTooltip();
        };
      })(this);
      this.mouseEnterSubscription = {
        dispose: (function(_this) {
          return function() {
            _this.removeEventListener('mouseenter', onMouseEnter);
            return _this.mouseEnterSubscription = null;
          };
        })(this)
      };
      return this.addEventListener('mouseenter', onMouseEnter);
    };

    StatusIcon.prototype.updateTooltip = function() {
      var process;
      this.removeTooltip();
      if (process = this.terminalView.getTerminalTitle()) {
        this.tooltip = atom.tooltips.add(this, {
          title: process,
          html: false,
          delay: {
            show: 1000,
            hide: 100
          }
        });
      }
      return this.dispatchEvent(new CustomEvent('mouseenter', {
        bubbles: true,
        detail: 'platformio-ide-terminal'
      }));
    };

    StatusIcon.prototype.removeTooltip = function() {
      if (this.tooltip) {
        this.tooltip.dispose();
      }
      return this.tooltip = null;
    };

    StatusIcon.prototype.destroy = function() {
      this.removeTooltip();
      if (this.mouseEnterSubscription) {
        this.mouseEnterSubscription.dispose();
      }
      return this.remove();
    };

    StatusIcon.prototype.activate = function() {
      this.classList.add('active');
      return this.active = true;
    };

    StatusIcon.prototype.isActive = function() {
      return this.classList.contains('active');
    };

    StatusIcon.prototype.deactivate = function() {
      this.classList.remove('active');
      return this.active = false;
    };

    StatusIcon.prototype.toggle = function() {
      if (this.active) {
        this.classList.remove('active');
      } else {
        this.classList.add('active');
      }
      return this.active = !this.active;
    };

    StatusIcon.prototype.isActive = function() {
      return this.active;
    };

    StatusIcon.prototype.rename = function() {
      var dialog;
      if (RenameDialog == null) {
        RenameDialog = require('./rename-dialog');
      }
      dialog = new RenameDialog(this);
      return dialog.attach();
    };

    StatusIcon.prototype.getName = function() {
      return this.name.textContent.substring(1);
    };

    StatusIcon.prototype.updateName = function(name) {
      if (name !== this.getName()) {
        if (name) {
          name = "&nbsp;" + name;
        }
        this.name.innerHTML = name;
        return this.terminalView.emit('did-change-title');
      }
    };

    return StatusIcon;

  })(HTMLElement);

  module.exports = document.registerElement('pio-terminal-status-icon', {
    prototype: StatusIcon.prototype,
    "extends": 'li'
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9wbGF0Zm9ybWlvLWlkZS10ZXJtaW5hbC9saWIvc3RhdHVzLWljb24uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUVBLFlBQUEsR0FBZSxJQUZmLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHlCQUFBLE1BQUEsR0FBUSxLQUFSLENBQUE7O0FBQUEseUJBRUEsVUFBQSxHQUFZLFNBQUUsWUFBRixHQUFBO0FBQ1YsVUFBQSxJQUFBO0FBQUEsTUFEVyxJQUFDLENBQUEsZUFBQSxZQUNaLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLDBCQUFmLENBQUEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLElBQUQsR0FBUSxRQUFRLENBQUMsYUFBVCxDQUF1QixHQUF2QixDQUZSLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQWhCLENBQW9CLE1BQXBCLEVBQTRCLGVBQTVCLENBSEEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsSUFBZCxDQUpBLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxJQUFELEdBQVEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsTUFBdkIsQ0FOUixDQUFBO0FBQUEsTUFPQSxJQUFDLENBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFoQixDQUFvQixNQUFwQixDQVBBLENBQUE7QUFBQSxNQVFBLElBQUMsQ0FBQSxXQUFELENBQWEsSUFBQyxDQUFB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

//# sourceURL=/home/kyan/.atom/packages/platformio-ide-terminal/lib/status-icon.coffee
