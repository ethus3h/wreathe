(function() {
  var $, CompositeDisposable, Emitter, InputDialog, PlatformIOTerminalView, Pty, Task, Terminal, View, lastActiveElement, lastOpenedView, os, path, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), Task = _ref.Task, CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  _ref1 = require('atom-space-pen-views'), $ = _ref1.$, View = _ref1.View;

  Pty = require.resolve('./process');

  Terminal = require('term.js');

  InputDialog = null;

  path = require('path');

  os = require('os');

  lastOpenedView = null;

  lastActiveElement = null;

  module.exports = PlatformIOTerminalView = (function(_super) {
    __extends(PlatformIOTerminalView, _super);

    function PlatformIOTerminalView() {
      this.blurTerminal = __bind(this.blurTerminal, this);
      this.focusTerminal = __bind(this.focusTerminal, this);
      this.blur = __bind(this.blur, this);
      this.focus = __bind(this.focus, this);
      this.resizePanel = __bind(this.resizePanel, this);
      this.resizeStopped = __bind(this.resizeStopped, this);
      this.resizeStarted = __bind(this.resizeStarted, this);
      this.onWindowResize = __bind(this.onWindowResize, this);
      this.hide = __bind(this.hide, this);
      this.open = __bind(this.open, this);
      this.recieveItemOrFile = __bind(this.recieveItemOrFile, this);
      this.setAnimationSpeed = __bind(this.setAnimationSpeed, this);
      return PlatformIOTerminalView.__super__.constructor.apply(this, arguments);
    }

    PlatformIOTerminalView.prototype.animating = false;

    PlatformIOTerminalView.prototype.id = '';

    PlatformIOTerminalView.prototype.maximized = false;

    PlatformIOTerminalView.prototype.opened = false;

    PlatformIOTerminalView.prototype.pwd = '';

    PlatformIOTerminalView.prototype.windowHeight = $(window).height();

    PlatformIOTerminalView.prototype.rowHeight = 20;

    PlatformIOTerminalView.prototype.shell = '';

    PlatformIOTerminalView.prototype.tabView = false;

    PlatformIOTerminalView.content = function() {
      return this.div({
        "class": 'platformio-ide-terminal terminal-view',
        outlet: 'platformIOTerminalView'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'panel-divider',
            outlet: 'panelDivider'
          });
          _this.div({
            "class": 'btn-toolbar',
            outlet: 'toolbar'
          }, function() {
            _this.button({
              outlet: 'closeBtn',
              "class": 'btn inline-block-tight right',
              click: 'destroy'
            }, function() {
              return _this.span({
                "class": 'icon icon-x'
              });
            });
            _this.button({
              outlet: 'hideBtn',
              "class": 'btn inline-block-tight right',
              click: 'hide'
            }, function() {
              return _this.span({
                "class": 'icon icon-chevron-down'
              });
            });
            _this.button({
              outlet: 'maximizeBtn',
              "class": 'btn inline-block-tight right',
              click: 'maximize'
            }, function() {
              return _this.span({
                "class": 'icon icon-screen-full'
              });
            });
            return _this.button({
              outlet: 'inputBtn',
              "class": 'btn inline-block-tight left',
              click: 'inputDialog'
            }, function() {
              return _this.span({
                "class": 'icon icon-keyboard'
              });
            });
          });
          return _this.div({
            "class": 'xterm',
            outlet: 'xterm'
          });
        };
      })(this));
    };

    PlatformIOTerminalView.getFocusedTerminal = function() {
      return Terminal.Terminal.focus;
    };

    PlatformIOTerminalView.prototype.initialize = function(id, pwd, statusIcon, statusBar, shell, args, autoRun) {
      var bottomHeight, override, percent;
      this.id = id;
      this.pwd = pwd;
      this.statusIcon = statusIcon;
      this.statusBar = statusBar;
      this.shell = shell;
      this.args = args != null ? args : [];
      this.autoRun = autoRun != null ? autoRun : [];
      this.subscriptions = new CompositeDisposable;
      this.emitter = new Emitter;
      this.subscriptions.add(atom.tooltips.add(this.closeBtn, {
        title: 'Close'
      }));
      this.subscriptions.add(atom.tooltips.add(this.hideBtn, {
        title: 'Hide'
      }));
      this.subscriptions.add(this.maximizeBtn.tooltip = atom.tooltips.add(this.maximizeBtn, {
        title: 'Fullscreen'
      }));
      this.inputBtn.tooltip = atom.tooltips.add(this.inputBtn, {
        title: 'Insert Text'
      });
      this.prevHeight = atom.config.get('platformio-ide-terminal.style.defaultPanelHeight');
      if (this.prevHeight.indexOf('%') > 0) {
        percent = Math.abs(Math.min(parseFloat(this.prevHeight) / 100.0, 1));
        bottomHeight = $('atom-panel.bottom').children(".terminal-view").height() || 0;
        this.prevHeight = percent * ($('.item-views').height() + bottomHeight);
      }
      this.xterm.height(0);
      this.setAnimationSpeed();
      this.subscriptions.add(atom.config.onDidChange('platformio-ide-terminal.style.animationSpeed', this.setAnimationSpeed));
      override = function(event) {
        if (event.originalEvent.dataTransfer.getData('platformio-ide-terminal') === 'true') {
          return;
        }
        event.preventDefault();
        return event.stopPropagation();
      };
      this.xterm.on('mouseup', (function(_this) {
        return function(event) {
          var text;
          if (event.which !== 3) {
            text = window.getSelection().toString();
            if (!text) {
              return _this.focus();
            }
          }
        };
      })(this));
      this.xterm.on('dragenter', override);
      this.xterm.on('dragover', override);
      this.xterm.on('drop', this.recieveItemOrFile);
      this.on('focus', this.focus);
      return this.subscriptions.add({
        dispose: (function(_this) {
          return function() {
            return _this.off('focus', _this.focus);
          };
        })(this)
      });
    };

    PlatformIOTerminalView.prototype.attach = function() {
      if (this.panel != null) {
        return;
      }
      return this.panel = atom.workspace.addBottomPanel({
        item: this,
        visible: false
      });
    };

    PlatformIOTerminalView.prototype.setAnimationSpeed = function() {
      this.animationSpeed = atom.config.get('platformio-ide-terminal.style.animationSpeed');
      if (this.animationSpeed === 0) {
        this.animationSpeed = 100;
      }
      return this.xterm.css('transition', "height " + (0.25 / this.animationSpeed) + "s linear");
    };

    PlatformIOTerminalView.prototype.recieveItemOrFile = function(event) {
      var dataTransfer, file, filePath, _i, _len, _ref2, _results;
      event.preventDefault();
      event.stopPropagation();
      dataTransfer = event.originalEvent.dataTransfer;
      if (dataTransfer.getData('atom-event') === 'true') {
        filePath = dataTransfer.getData('text/plain');
        if (filePath) {
          return this.input("" + filePath + " ");
        }
      } else if (filePath = dataTransfer.getData('initialPath')) {
        return this.input("" + filePath + " ");
      } else if (dataTransfer.files.length > 0) {
        _ref2 = dataTransfer.files;
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          file = _ref2[_i];
          _results.push(this.input("" + file.path + " "));
        }
        return _results;
      }
    };

    PlatformIOTerminalView.prototype.forkPtyProcess = function() {
      return Task.once(Pty, path.resolve(this.pwd), this.shell, this.args, (function(_this) {
        return function() {
          _this.input = function() {};
          return _this.resize = function() {};
        };
      })(this));
    };

    PlatformIOTerminalView.prototype.getId = function() {
      return this.id;
    };

    PlatformIOTerminalView.prototype.displayTerminal = function() {
      var cols, rows, _ref2;
      _ref2 = this.getDimensions(), cols = _ref2.cols, rows = _ref2.rows;
      this.ptyProcess = this.forkPtyProcess();
      this.terminal = new Terminal({
        cursorBlink: false,
        scrollback: atom.config.get('platformio-ide-terminal.core.scrollback'),
        cols: cols,
        rows: rows
      });
      this.attachListeners();
      this.attachResizeEvents();
      this.attachWindowEvents();
      return this.terminal.open(this.xterm.get(0));
    };

    PlatformIOTerminalView.prototype.attachListeners = function() {
      this.ptyProcess.on("platformio-ide-terminal:data", (function(_this) {
        return function(data) {
          return _this.terminal.write(data);
        };
      })(this));
      this.ptyProcess.on("platformio-ide-terminal:exit", (function(_this) {
        return function() {
          if (atom.config.get('platformio-ide-terminal.toggles.autoClose')) {
            return _this.destroy();
          }
        };
      })(this));
      this.terminal.end = (function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this);
      this.terminal.on("data", (function(_this) {
        return function(data) {
          return _this.input(data);
        };
      })(this));
      this.ptyProcess.on("platformio-ide-terminal:title", (function(_this) {
        return function(title) {
          return _this.process = title;
        };
      })(this));
      this.terminal.on("title", (function(_this) {
        return function(title) {
          return _this.title = title;
        };
      })(this));
      return this.terminal.once("open", (function(_this) {
        return function() {
          var autoRunCommand, command, _i, _len, _ref2, _results;
          _this.applyStyle();
          _this.resizeTerminalToView();
          if (_this.ptyProcess.childProcess == null) {
            return;
          }
          autoRunCommand = atom.config.get('platformio-ide-terminal.core.autoRunCommand');
          if (autoRunCommand) {
            _this.input("" + autoRunCommand + os.EOL);
          }
          _ref2 = _this.autoRun;
          _results = [];
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            command = _ref2[_i];
            _results.push(_this.input("" + command + os.EOL));
          }
          return _results;
        };
      })(this));
    };

    PlatformIOTerminalView.prototype.destroy = function() {
      var _ref2, _ref3;
      this.subscriptions.dispose();
      this.statusIcon.destroy();
      this.statusBar.removeTerminalView(this);
      this.detachResizeEvents();
      this.detachWindowEvents();
      if (this.panel.isVisible()) {
        this.hide();
        this.onTransitionEnd((function(_this) {
          return function() {
            return _this.panel.destroy();
          };
        })(this));
      } else {
        this.panel.destroy();
      }
      if (this.statusIcon && this.statusIcon.parentNode) {
        this.statusIcon.parentNode.removeChild(this.statusIcon);
      }
      if ((_ref2 = this.ptyProcess) != null) {
        _ref2.terminate();
      }
      return (_ref3 = this.terminal) != null ? _ref3.destroy() : void 0;
    };

    PlatformIOTerminalView.prototype.maximize = function() {
      var btn;
      this.subscriptions.remove(this.maximizeBtn.tooltip);
      this.maximizeBtn.tooltip.dispose();
      this.maxHeight = this.prevHeight + $('.item-views').height();
      btn = this.maximizeBtn.children('span');
      this.onTransitionEnd((function(_this) {
        return function() {
          return _this.focus();
        };
      })(this));
      if (this.maximized) {
        this.maximizeBtn.tooltip = atom.tooltips.add(this.maximizeBtn, {
          title: 'Fullscreen'
        });
        this.subscriptions.add(this.maximizeBtn.tooltip);
        this.adjustHeight(this.prevHeight);
        btn.removeClass('icon-screen-normal').addClass('icon-screen-full');
        return this.maximized = false;
      } else {
        this.maximizeBtn.tooltip = atom.tooltips.add(this.maximizeBtn, {
          title: 'Normal'
        });
        this.subscriptions.add(this.maximizeBtn.tooltip);
        this.adjustHeight(this.maxHeight);
        btn.removeClass('icon-screen-full').addClass('icon-screen-normal');
        return this.maximized = true;
      }
    };

    PlatformIOTerminalView.prototype.open = function() {
      var icon;
      if (lastActiveElement == null) {
        lastActiveElement = $(document.activeElement);
      }
      if (lastOpenedView && lastOpenedView !== this) {
        if (lastOpenedView.maximized) {
          this.subscriptions.remove(this.maximizeBtn.tooltip);
          this.maximizeBtn.tooltip.dispose();
          icon = this.maximizeBtn.children('span');
          this.maxHeight = lastOpenedView.maxHeight;
          this.maximizeBtn.tooltip = atom.tooltips.add(this.maximizeBtn, {
            title: 'Normal'
          });
          this.subscriptions.add(this.maximizeBtn.tooltip);
          icon.removeClass('icon-screen-full').addClass('icon-screen-normal');
          this.maximized = true;
        }
        lastOpenedView.hide();
      }
      lastOpenedView = this;
      this.statusBar.setActiveTerminalView(this);
      this.statusIcon.activate();
      this.onTransitionEnd((function(_this) {
        return function() {
          if (!_this.opened) {
            _this.opened = true;
            _this.displayTerminal();
            _this.prevHeight = _this.nearestRow(_this.xterm.height());
            return _this.xterm.height(_this.prevHeight);
          } else {
            return _this.focus();
          }
        };
      })(this));
      this.panel.show();
      this.xterm.height(0);
      this.animating = true;
      return this.xterm.height(this.maximized ? this.maxHeight : this.prevHeight);
    };

    PlatformIOTerminalView.prototype.hide = function() {
      var _ref2;
      if ((_ref2 = this.terminal) != null) {
        _ref2.blur();
      }
      lastOpenedView = null;
      this.statusIcon.deactivate();
      this.onTransitionEnd((function(_this) {
        return function() {
          _this.panel.hide();
          if (lastOpenedView == null) {
            if (lastActiveElement != null) {
              lastActiveElement.focus();
              return lastActiveElement = null;
            }
          }
        };
      })(this));
      this.xterm.height(this.maximized ? this.maxHeight : this.prevHeight);
      this.animating = true;
      return this.xterm.height(0);
    };

    PlatformIOTerminalView.prototype.toggle = function() {
      if (this.animating) {
        return;
      }
      if (this.panel.isVisible()) {
        return this.hide();
      } else {
        return this.open();
      }
    };

    PlatformIOTerminalView.prototype.input = function(data) {
      if (this.ptyProcess.childProcess == null) {
        return;
      }
      this.terminal.stopScrolling();
      return this.ptyProcess.send({
        event: 'input',
        text: data
      });
    };

    PlatformIOTerminalView.prototype.resize = function(cols, rows) {
      if (this.ptyProcess.childProcess == null) {
        return;
      }
      return this.ptyProcess.send({
        event: 'resize',
        rows: rows,
        cols: cols
      });
    };

    PlatformIOTerminalView.prototype.applyStyle = function() {
      var config, defaultFont, editorFont, editorFontSize, overrideFont, overrideFontSize, _ref2, _ref3;
      config = atom.config.get('platformio-ide-terminal');
      this.xterm.addClass(config.style.theme);
      if (config.toggles.cursorBlink) {
        this.xterm.addClass('cursor-blink');
      }
      editorFont = atom.config.get('editor.fontFamily');
      defaultFont = "Menlo, Consolas, 'DejaVu Sans Mono', monospace";
      overrideFont = config.style.fontFamily;
      this.terminal.element.style.fontFamily = overrideFont || editorFont || defaultFont;
      this.subscriptions.add(atom.config.onDidChange('editor.fontFamily', (function(_this) {
        return function(event) {
          editorFont = event.newValue;
          return _this.terminal.element.style.fontFamily = overrideFont || editorFont || defaultFont;
        };
      })(this)));
      this.subscriptions.add(atom.config.onDidChange('platformio-ide-terminal.style.fontFamily', (function(_this) {
        return function(event) {
          overrideFont = event.newValue;
          return _this.terminal.element.style.fontFamily = overrideFont || editorFont || defaultFont;
        };
      })(this)));
      editorFontSize = atom.config.get('editor.fontSize');
      overrideFontSize = config.style.fontSize;
      this.terminal.element.style.fontSize = "" + (overrideFontSize || editorFontSize) + "px";
      this.subscriptions.add(atom.config.onDidChange('editor.fontSize', (function(_this) {
        return function(event) {
          editorFontSize = event.newValue;
          _this.terminal.element.style.fontSize = "" + (overrideFontSize || editorFontSize) + "px";
          return _this.resizeTerminalToView();
        };
      })(this)));
      this.subscriptions.add(atom.config.onDidChange('platformio-ide-terminal.style.fontSize', (function(_this) {
        return function(event) {
          overrideFontSize = event.newValue;
          _this.terminal.element.style.fontSize = "" + (overrideFontSize || editorFontSize) + "px";
          return _this.resizeTerminalToView();
        };
      })(this)));
      [].splice.apply(this.terminal.colors, [0, 8].concat(_ref2 = [config.ansiColors.normal.black.toHexString(), config.ansiColors.normal.red.toHexString(), config.ansiColors.normal.green.toHexString(), config.ansiColors.normal.yellow.toHexString(), config.ansiColors.normal.blue.toHexString(), config.ansiColors.normal.magenta.toHexString(), config.ansiColors.normal.cyan.toHexString(), config.ansiColors.normal.white.toHexString()])), _ref2;
      return ([].splice.apply(this.terminal.colors, [8, 8].concat(_ref3 = [config.ansiColors.zBright.brightBlack.toHexString(), config.ansiColors.zBright.brightRed.toHexString(), config.ansiColors.zBright.brightGreen.toHexString(), config.ansiColors.zBright.brightYellow.toHexString(), config.ansiColors.zBright.brightBlue.toHexString(), config.ansiColors.zBright.brightMagenta.toHexString(), config.ansiColors.zBright.brightCyan.toHexString(), config.ansiColors.zBright.brightWhite.toHexString()])), _ref3);
    };

    PlatformIOTerminalView.prototype.attachWindowEvents = function() {
      return $(window).on('resize', this.onWindowResize);
    };

    PlatformIOTerminalView.prototype.detachWindowEvents = function() {
      return $(window).off('resize', this.onWindowResize);
    };

    PlatformIOTerminalView.prototype.attachResizeEvents = function() {
      return this.panelDivider.on('mousedown', this.resizeStarted);
    };

    PlatformIOTerminalView.prototype.detachResizeEvents = function() {
      return this.panelDivider.off('mousedown');
    };

    PlatformIOTerminalView.prototype.onWindowResize = function() {
      var bottomPanel, clamped, delta, newHeight, overflow;
      if (!this.tabView) {
        this.xterm.css('transition', '');
        newHeight = $(window).height();
        bottomPanel = $('atom-panel-container.bottom').first().get(0);
        overflow = bottomPanel.scrollHeight - bottomPanel.offsetHeight;
        delta = newHeight - this.windowHeight;
        this.windowHeight = newHeight;
        if (this.maximized) {
          clamped = Math.max(this.maxHeight + delta, this.rowHeight);
          if (this.panel.isVisible()) {
            this.adjustHeight(clamped);
          }
          this.maxHeight = clamped;
          this.prevHeight = Math.min(this.prevHeight, this.maxHeight);
        } else if (overflow > 0) {
          clamped = Math.max(this.nearestRow(this.prevHeight + delta), this.rowHeight);
          if (this.panel.isVisible()) {
            this.adjustHeight(clamped);
          }
          this.prevHeight = clamped;
        }
        this.xterm.css('transition', "height " + (0.25 / this.animationSpeed) + "s linear");
      }
      return this.resizeTerminalToView();
    };

    PlatformIOTerminalView.prototype.resizeStarted = function() {
      if (this.maximized) {
        return;
      }
      this.maxHeight = this.prevHeight + $('.item-views').height();
      $(document).on('mousemove', this.resizePanel);
      $(document).on('mouseup', this.resizeStopped);
      return this.xterm.css('transition', '');
    };

    PlatformIOTerminalView.prototype.resizeStopped = function() {
      $(document).off('mousemove', this.resizePanel);
      $(document).off('mouseup', this.resizeStopped);
      return this.xterm.css('transition', "height " + (0.25 / this.animationSpeed) + "s linear");
    };

    PlatformIOTerminalView.prototype.nearestRow = function(value) {
      var rows;
      rows = Math.floor(value / this.rowHeight);
      return rows * this.rowHeight;
    };

    PlatformIOTerminalView.prototype.resizePanel = function(event) {
      var clamped, delta, mouseY;
      if (event.which !== 1) {
        return this.resizeStopped();
      }
      mouseY = $(window).height() - event.pageY;
      delta = mouseY - $('atom-panel-container.bottom').height();
      if (!(Math.abs(delta) > (this.rowHeight * 5 / 6))) {
        return;
      }
      clamped = Math.max(this.nearestRow(this.prevHeight + delta), this.rowHeight);
      if (clamped > this.maxHeight) {
        return;
      }
      this.xterm.height(clamped);
      $(this.terminal.element).height(clamped);
      this.prevHeight = clamped;
      return this.resizeTerminalToView();
    };

    PlatformIOTerminalView.prototype.adjustHeight = function(height) {
      this.xterm.height(height);
      return $(this.terminal.element).height(height);
    };

    PlatformIOTerminalView.prototype.copy = function() {
      var lines, rawLines, rawText, text, textarea;
      if (this.terminal._selected) {
        textarea = this.terminal.getCopyTextarea();
        text = this.terminal.grabText(this.terminal._selected.x1, this.terminal._selected.x2, this.terminal._selected.y1, this.terminal._selected.y2);
      } else {
        rawText = this.terminal.context.getSelection().toString();
        rawLines = rawText.split(/\r?\n/g);
        lines = rawLines.map(function(line) {
          return line.replace(/\s/g, " ").trimRight();
        });
        text = lines.join("\n");
      }
      return atom.clipboard.write(text);
    };

    PlatformIOTerminalView.prototype.paste = function() {
      return this.input(atom.clipboard.read());
    };

    PlatformIOTerminalView.prototype.insertSelection = function() {
      var cursor, editor, line, runCommand, selection;
      if (!(editor = atom.workspace.getActiveTextEditor())) {
        return;
      }
      runCommand = atom.config.get('platformio-ide-terminal.toggles.runInsertedText');
      if (selection = editor.getSelectedText()) {
        this.terminal.stopScrolling();
        return this.input("" + selection + (runCommand ? os.EOL : ''));
      } else if (cursor = editor.getCursorBufferPosition()) {
        line = editor.lineTextForBufferRow(cursor.row);
        this.terminal.stopScrolling();
        this.input("" + line + (runCommand ? os.EOL : ''));
        return editor.moveDown(1);
      }
    };

    PlatformIOTerminalView.prototype.insertCustom = function(customText) {
      var runCommand;
      runCommand = atom.config.get('platformio-ide-terminal.toggles.runInsertedText');
      return this.input("" + customText + (runCommand ? os.EOL : ''));
    };

    PlatformIOTerminalView.prototype.focus = function() {
      this.resizeTerminalToView();
      this.focusTerminal();
      this.statusBar.setActiveTerminalView(this);
      return PlatformIOTerminalView.__super__.focus.call(this);
    };

    PlatformIOTerminalView.prototype.blur = function() {
      this.blurTerminal();
      return PlatformIOTerminalView.__super__.blur.call(this);
    };

    PlatformIOTerminalView.prototype.focusTerminal = function() {
      if (!this.terminal) {
        return;
      }
      this.terminal.focus();
      if (this.terminal._textarea) {
        return this.terminal._textarea.focus();
      } else {
        return this.terminal.element.focus();
      }
    };

    PlatformIOTerminalView.prototype.blurTerminal = function() {
      if (!this.terminal) {
        return;
      }
      this.terminal.blur();
      return this.terminal.element.blur();
    };

    PlatformIOTerminalView.prototype.resizeTerminalToView = function() {
      var cols, rows, _ref2;
      if (!(this.panel.isVisible() || this.tabView)) {
        return;
      }
      _ref2 = this.getDimensions(), cols = _ref2.cols, rows = _ref2.rows;
      if (!(cols > 0 && rows > 0)) {
        return;
      }
      if (!this.terminal) {
        return;
      }
      if (this.terminal.rows === rows && this.terminal.cols === cols) {
        return;
      }
      this.resize(cols, rows);
      return this.terminal.resize(cols, rows);
    };

    PlatformIOTerminalView.prototype.getDimensions = function() {
      var cols, fakeCol, fakeRow, rows;
      fakeRow = $("<div><span>&nbsp;</span></div>");
      if (this.terminal) {
        this.find('.terminal').append(fakeRow);
        fakeCol = fakeRow.children().first()[0].getBoundingClientRect();
        cols = Math.floor(this.xterm.width() / (fakeCol.width || 9));
        rows = Math.floor(this.xterm.height() / (fakeCol.height || 20));
        this.rowHeight = fakeCol.height;
        fakeRow.remove();
      } else {
        cols = Math.floor(this.xterm.width() / 9);
        rows = Math.floor(this.xterm.height() / 20);
      }
      return {
        cols: cols,
        rows: rows
      };
    };

    PlatformIOTerminalView.prototype.onTransitionEnd = function(callback) {
      return this.xterm.one('webkitTransitionEnd', (function(_this) {
        return function() {
          callback();
          return _this.animating = false;
        };
      })(this));
    };

    PlatformIOTerminalView.prototype.inputDialog = function() {
      var dialog;
      if (InputDialog == null) {
        InputDialog = require('./input-dialog');
      }
      dialog = new InputDialog(this);
      return dialog.attach();
    };

    PlatformIOTerminalView.prototype.rename = function() {
      return this.statusIcon.rename();
    };

    PlatformIOTerminalView.prototype.toggleTabView = function() {
      if (this.tabView) {
        this.panel = atom.workspace.addBottomPanel({
          item: this,
          visible: false
        });
        this.attachResizeEvents();
        this.closeBtn.show();
        this.hideBtn.show();
        this.maximizeBtn.show();
        return this.tabView = false;
      } else {
        this.panel.destroy();
        this.detachResizeEvents();
        this.closeBtn.hide();
        this.hideBtn.hide();
        this.maximizeBtn.hide();
        this.xterm.css("height", "");
        this.tabView = true;
        if (lastOpenedView === this) {
          return lastOpenedView = null;
        }
      }
    };

    PlatformIOTerminalView.prototype.getTitle = function() {
      return this.statusIcon.getName() || "platformio-ide-terminal";
    };

    PlatformIOTerminalView.prototype.getIconName = function() {
      return "terminal";
    };

    PlatformIOTerminalView.prototype.getShell = function() {
      return path.basename(this.shell);
    };

    PlatformIOTerminalView.prototype.getShellPath = function() {
      return this.shell;
    };

    PlatformIOTerminalView.prototype.emit = function(event, data) {
      return this.emitter.emit(event, data);
    };

    PlatformIOTerminalView.prototype.onDidChangeTitle = function(callback) {
      return this.emitter.on('did-change-title', callback);
    };

    PlatformIOTerminalView.prototype.getPath = function() {
      return this.getTerminalTitle();
    };

    PlatformIOTerminalView.prototype.getTerminalTitle = function() {
      return this.title || this.process;
    };

    PlatformIOTerminalView.prototype.getTerminal = function() {
      return this.terminal;
    };

    PlatformIOTerminalView.prototype.isAnimating = function() {
      return this.animating;
    };

    return PlatformIOTerminalView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9wbGF0Zm9ybWlvLWlkZS10ZXJtaW5hbC9saWIvdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUpBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQSxPQUF1QyxPQUFBLENBQVEsTUFBUixDQUF2QyxFQUFDLFlBQUEsSUFBRCxFQUFPLDJCQUFBLG1CQUFQLEVBQTRCLGVBQUEsT0FBNUIsQ0FBQTs7QUFBQSxFQUNBLFFBQVksT0FBQSxDQUFRLHNCQUFSLENBQVosRUFBQyxVQUFBLENBQUQsRUFBSSxhQUFBLElBREosQ0FBQTs7QUFBQSxFQUdBLEdBQUEsR0FBTSxPQUFPLENBQUMsT0FBUixDQUFnQixXQUFoQixDQUhOLENBQUE7O0FBQUEsRUFJQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFNBQVIsQ0FKWCxDQUFBOztBQUFBLEVBS0EsV0FBQSxHQUFjLElBTGQsQ0FBQTs7QUFBQSxFQU9BLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQVBQLENBQUE7O0FBQUEsRUFRQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FSTCxDQUFBOztBQUFBLEVBVUEsY0FBQSxHQUFpQixJQVZqQixDQUFBOztBQUFBLEVBV0EsaUJBQUEsR0FBb0IsSUFYcEIsQ0FBQTs7QUFBQSxFQWFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiw2Q0FBQSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0tBQUE7O0FBQUEscUNBQUEsU0FBQSxHQUFXLEtBQVgsQ0FBQTs7QUFBQSxxQ0FDQSxFQUFBLEdBQUksRUFESixDQUFBOztBQUFBLHFDQUVBLFNBQUEsR0FBVyxLQUZYLENBQUE7O0FBQUEscUNBR0EsTUFBQSxHQUFRLEtBSFIsQ0FBQTs7QUFBQSxxQ0FJQSxHQUFBLEdBQUssRUFKTCxDQUFBOztBQUFBLHFDQUtBLFlBQUEsR0FBYyxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsTUFBVixDQUFBLENBTGQsQ0FBQTs7QUFBQSxxQ0FNQSxTQUFBLEdBQVcsRUFOWCxDQUFBOztBQUFBLHFDQU9BLEtBQUEsR0FBTyxFQVBQLENBQUE7O0FBQUEscUNBUUEsT0FBQSxHQUFTLEtBUlQsQ0FBQTs7QUFBQSxJQVVBLHNCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyx1Q0FBUDtBQUFBLFFBQWdELE1BQUEsRUFBUSx3QkFBeEQ7T0FBTCxFQUF1RixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3JGLFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLGVBQVA7QUFBQSxZQUF3QixNQUFBLEVBQVEsY0FBaEM7V0FBTCxDQUFBLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxhQUFQO0FBQUEsWUFBc0IsTUFBQSxFQUFPLFNBQTdCO1dBQUwsRUFBNkMsU0FBQSxHQUFBO0FBQzNDLFlBQUEsS0FBQyxDQUFBLE1BQUQsQ0FBUTtBQUFBLGNBQUEsTUFBQSxFQUFRLFVBQVI7QUFBQSxjQUFvQixPQUFBLEVBQU8sOEJBQTNCO0FBQUEsY0FBMkQsS0FBQSxFQUFPLFNBQWxFO2FBQVIsRUFBcUYsU0FBQSxHQUFBO3FCQUNuRixLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsZ0JBQUEsT0FBQSxFQUFPLGFBQVA7ZUFBTixFQURtRjtZQUFBLENBQXJGLENBQUEsQ0FBQTtBQUFBLFlBRUEsS0FBQyxDQUFBLE1BQUQsQ0FBUTtBQUFBLGNBQUEsTUFBQSxFQUFRLFNBQVI7QUFBQSxjQUFtQixPQUFBLEVBQU8sOEJBQTFCO0FBQUEsY0FBMEQsS0FBQSxFQUFPLE1BQWpFO2FBQVIsRUFBaUYsU0FBQSxHQUFBO3FCQUMvRSxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsZ0JBQUEsT0FBQSxFQUFPLHdCQUFQO2VBQU4sRUFEK0U7WUFBQSxDQUFqRixDQUZBLENBQUE7QUFBQSxZQUlBLEtBQUMsQ0FBQSxNQUFELENBQVE7QUFBQSxjQUFBLE1BQUEsRUFBUSxhQUFSO0FBQUEsY0FBdUIsT0FBQSxFQUFPLDhCQUE5QjtBQUFBLGNBQThELEtBQUEsRUFBTyxVQUFyRTthQUFSLEVBQXlGLFNBQUEsR0FBQTtxQkFDdkYsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLGdCQUFBLE9BQUEsRUFBTyx1QkFBUDtlQUFOLEVBRHVGO1lBQUEsQ0FBekYsQ0FKQSxDQUFBO21CQU1BLEtBQUMsQ0FBQSxNQUFELENBQVE7QUFBQSxjQUFBLE1BQUEsRUFBUSxVQUFSO0FBQUEsY0FBb0IsT0FBQSxFQUFPLDZCQUEzQjtBQUFBLGNBQTBELEtBQUEsRUFBTyxhQUFqRTthQUFSLEVBQXdGLFNBQUEsR0FBQTtxQkFDdEYsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLGdCQUFBLE9BQUEsRUFBTyxvQkFBUDtlQUFOLEVBRHNGO1lBQUEsQ0FBeEYsRUFQMkM7VUFBQSxDQUE3QyxDQURBLENBQUE7aUJBVUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLE9BQVA7QUFBQSxZQUFnQixNQUFBLEVBQVEsT0FBeEI7V0FBTCxFQVhxRjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZGLEVBRFE7SUFBQSxDQVZWLENBQUE7O0FBQUEsSUF3QkEsc0JBQUMsQ0FBQSxrQkFBRCxHQUFxQixTQUFBLEdBQUE7QUFDbkIsYUFBTyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQXpCLENBRG1CO0lBQUEsQ0F4QnJCLENBQUE7O0FBQUEscUNBMkJBLFVBQUEsR0FBWSxTQUFFLEVBQUYsRUFBTyxHQUFQLEVBQWEsVUFBYixFQUEwQixTQUExQixFQUFzQyxLQUF0QyxFQUE4QyxJQUE5QyxFQUF3RCxPQUF4RCxHQUFBO0FBQ1YsVUFBQSwrQkFBQTtBQUFBLE1BRFcsSUFBQyxDQUFBLEtBQUEsRUFDWixDQUFBO0FBQUEsTUFEZ0IsSUFBQyxDQUFBLE1BQUEsR0FDakIsQ0FBQTtBQUFBLE1BRHNCLElBQUMsQ0FBQSxhQUFBLFVBQ3ZCLENBQUE7QUFBQSxNQURtQyxJQUFDLENBQUEsWUFBQSxTQUNwQyxDQUFBO0FBQUEsTUFEK0MsSUFBQyxDQUFBLFFBQUEsS0FDaEQsQ0FBQTtBQUFBLE1BRHVELElBQUMsQ0FBQSxzQkFBQSxPQUFLLEVBQzdELENBQUE7QUFBQSxNQURpRSxJQUFDLENBQUEsNEJBQUEsVUFBUSxFQUMxRSxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBQWpCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBQSxDQUFBLE9BRFgsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFDLENBQUEsUUFBbkIsRUFDakI7QUFBQSxRQUFBLEtBQUEsRUFBTyxPQUFQO09BRGlCLENBQW5CLENBSEEsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFDLENBQUEsT0FBbkIsRUFDakI7QUFBQSxRQUFBLEtBQUEsRUFBTyxNQUFQO09BRGlCLENBQW5CLENBTEEsQ0FBQTtBQUFBLE1BT0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixHQUF1QixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsSUFBQyxDQUFBLFdBQW5CLEVBQ3hDO0FBQUEsUUFBQSxLQUFBLEVBQU8sWUFBUDtPQUR3QyxDQUExQyxDQVBBLENBQUE7QUFBQSxNQVNBLElBQUMsQ0FBQSxRQUFRLENBQUMsT0FBVixHQUFvQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsSUFBQyxDQUFBLFFBQW5CLEVBQ2xCO0FBQUEsUUFBQSxLQUFBLEVBQU8sYUFBUDtPQURrQixDQVRwQixDQUFBO0FBQUEsTUFZQSxJQUFDLENBQUEsVUFBRCxHQUFjLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixrREFBaEIsQ0FaZCxDQUFBO0FBYUEsTUFBQSxJQUFHLElBQUMsQ0FBQSxVQUFVLENBQUMsT0FBWixDQUFvQixHQUFwQixDQUFBLEdBQTJCLENBQTlCO0FBQ0UsUUFBQSxPQUFBLEdBQVUsSUFBSSxDQUFDLEdBQUwsQ0FBUyxJQUFJLENBQUMsR0FBTCxDQUFTLFVBQUEsQ0FBVyxJQUFDLENBQUEsVUFBWixDQUFBLEdBQTBCLEtBQW5DLEVBQTBDLENBQTFDLENBQVQsQ0FBVixDQUFBO0FBQUEsUUFDQSxZQUFBLEdBQWUsQ0FBQSxDQUFFLG1CQUFGLENBQXNCLENBQUMsUUFBdkIsQ0FBZ0MsZ0JBQWhDLENBQWlELENBQUMsTUFBbEQsQ0FBQSxDQUFBLElBQThELENBRDdFLENBQUE7QUFBQSxRQUVBLElBQUMsQ0FBQSxVQUFELEdBQWMsT0FBQSxHQUFVLENBQUMsQ0FBQSxDQUFFLGFBQUYsQ0FBZ0IsQ0FBQyxNQUFqQixDQUFBLENBQUEsR0FBNEIsWUFBN0IsQ0FGeEIsQ0FERjtPQWJBO0FBQUEsTUFpQkEsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLENBQWMsQ0FBZCxDQWpCQSxDQUFBO0FBQUEsTUFtQkEsSUFBQyxDQUFBLGlCQUFELENBQUEsQ0FuQkEsQ0FBQTtBQUFBLE1Bb0JBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVosQ0FBd0IsOENBQXhCLEVBQXdFLElBQUMsQ0FBQSxpQkFBekUsQ0FBbkIsQ0FwQkEsQ0FBQTtBQUFBLE1Bc0JBLFFBQUEsR0FBVyxTQUFDLEtBQUQsR0FBQTtBQUNULFFBQUEsSUFBVSxLQUFLLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxPQUFqQyxDQUF5Qyx5QkFBekMsQ0FBQSxLQUF1RSxNQUFqRjtBQUFBLGdCQUFBLENBQUE7U0FBQTtBQUFBLFFBQ0EsS0FBSyxDQUFDLGNBQU4sQ0FBQSxDQURBLENBQUE7ZUFFQSxLQUFLLENBQUMsZUFBTixDQUFBLEVBSFM7TUFBQSxDQXRCWCxDQUFBO0FBQUEsTUEyQkEsSUFBQyxDQUFBLEtBQUssQ0FBQyxFQUFQLENBQVUsU0FBVixFQUFxQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxLQUFELEdBQUE7QUFDbkIsY0FBQSxJQUFBO0FBQUEsVUFBQSxJQUFHLEtBQUssQ0FBQyxLQUFOLEtBQWUsQ0FBbEI7QUFDRSxZQUFBLElBQUEsR0FBTyxNQUFNLENBQUMsWUFBUCxDQUFBLENBQXFCLENBQUMsUUFBdEIsQ0FBQSxDQUFQLENBQUE7QUFDQSxZQUFBLElBQUEsQ0FBQSxJQUFBO3FCQUNFLEtBQUMsQ0FBQSxLQUFELENBQUEsRUFERjthQUZGO1dBRG1CO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckIsQ0EzQkEsQ0FBQTtBQUFBLE1BZ0NBLElBQUMsQ0FBQSxLQUFLLENBQUMsRUFBUCxDQUFVLFdBQVYsRUFBdUIsUUFBdkIsQ0FoQ0EsQ0FBQTtBQUFBLE1BaUNBLElBQUMsQ0FBQSxLQUFLLENBQUMsRUFBUCxDQUFVLFVBQVYsRUFBc0IsUUFBdEIsQ0FqQ0EsQ0FBQTtBQUFBLE1Ba0NBLElBQUMsQ0FBQSxLQUFLLENBQUMsRUFBUCxDQUFVLE1BQVYsRUFBa0IsSUFBQyxDQUFBLGlCQUFuQixDQWxDQSxDQUFBO0FBQUEsTUFvQ0EsSUFBQyxDQUFBLEVBQUQsQ0FBSSxPQUFKLEVBQWEsSUFBQyxDQUFBLEtBQWQsQ0FwQ0EsQ0FBQTthQXFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUI7QUFBQSxRQUFBLE9BQUEsRUFBUyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFDMUIsS0FBQyxDQUFBLEdBQUQsQ0FBSyxPQUFMLEVBQWMsS0FBQyxDQUFBLEtBQWYsRUFEMEI7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFUO09BQW5CLEVBdENVO0lBQUEsQ0EzQlosQ0FBQTs7QUFBQSxxQ0FvRUEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLE1BQUEsSUFBVSxrQkFBVjtBQUFBLGNBQUEsQ0FBQTtPQUFBO2FBQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWYsQ0FBOEI7QUFBQSxRQUFBLElBQUEsRUFBTSxJQUFOO0FBQUEsUUFBWSxPQUFBLEVBQVMsS0FBckI7T0FBOUIsRUFGSDtJQUFBLENBcEVSLENBQUE7O0FBQUEscUNBd0VBLGlCQUFBLEdBQW1CLFNBQUEsR0FBQTtBQUNqQixNQUFBLElBQUMsQ0FBQSxjQUFELEdBQWtCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw4Q0FBaEIsQ0FBbEIsQ0FBQTtBQUNBLE1BQUEsSUFBeUIsSUFBQyxDQUFBLGNBQUQsS0FBbUIsQ0FBNUM7QUFBQSxRQUFBLElBQUMsQ0FBQSxjQUFELEdBQWtCLEdBQWxCLENBQUE7T0FEQTthQUdBLElBQUMsQ0FBQSxLQUFLLENBQUMsR0FBUCxDQUFXLFlBQVgsRUFBMEIsU0FBQSxHQUFRLENBQUMsSUFBQSxHQUFPLElBQUMsQ0FBQSxjQUFULENBQVIsR0FBZ0MsVUFBMUQsRUFKaUI7SUFBQSxDQXhFbkIsQ0FBQTs7QUFBQSxxQ0E4RUEsaUJBQUEsR0FBbUIsU0FBQyxLQUFELEdBQUE7QUFDakIsVUFBQSx1REFBQTtBQUFBLE1BQUEsS0FBSyxDQUFDLGNBQU4sQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLEtBQUssQ0FBQyxlQUFOLENBQUEsQ0FEQSxDQUFBO0FBQUEsTUFFQyxlQUFnQixLQUFLLENBQUMsY0FBdEIsWUFGRCxDQUFBO0FBSUEsTUFBQSxJQUFHLFlBQVksQ0FBQyxPQUFiLENBQXFCLFlBQXJCLENBQUEsS0FBc0MsTUFBekM7QUFDRSxRQUFBLFFBQUEsR0FBVyxZQUFZLENBQUMsT0FBYixDQUFxQixZQUFyQixDQUFYLENBQUE7QUFDQSxRQUFBLElBQXlCLFFBQXpCO2lCQUFBLElBQUMsQ0FBQSxLQUFELENBQU8sRUFBQSxHQUFHLFFBQUgsR0FBWSxHQUFuQixFQUFBO1NBRkY7T0FBQSxNQUdLLElBQUcsUUFBQSxHQUFXLFlBQVksQ0FBQyxPQUFiLENBQXFCLGFBQXJCLENBQWQ7ZUFDSCxJQUFDLENBQUEsS0FBRCxDQUFPLEVBQUEsR0FBRyxRQUFILEdBQVksR0FBbkIsRUFERztPQUFBLE1BRUEsSUFBRyxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQW5CLEdBQTRCLENBQS9CO0FBQ0g7QUFBQTthQUFBLDRDQUFBOzJCQUFBO0FBQ0Usd0JBQUEsSUFBQyxDQUFBLEtBQUQsQ0FBTyxFQUFBLEdBQUcsSUFBSSxDQUFDLElBQVIsR0FBYSxHQUFwQixFQUFBLENBREY7QUFBQTt3QkFERztPQVZZO0lBQUEsQ0E5RW5CLENBQUE7O0FBQUEscUNBNEZBLGNBQUEsR0FBZ0IsU0FBQSxHQUFBO2FBQ2QsSUFBSSxDQUFDLElBQUwsQ0FBVSxHQUFWLEVBQWUsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFDLENBQUEsR0FBZCxDQUFmLEVBQW1DLElBQUMsQ0FBQSxLQUFwQyxFQUEyQyxJQUFDLENBQUEsSUFBNUMsRUFBa0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNoRCxVQUFBLEtBQUMsQ0FBQSxLQUFELEdBQVMsU0FBQSxHQUFBLENBQVQsQ0FBQTtpQkFDQSxLQUFDLENBQUEsTUFBRCxHQUFVLFNBQUEsR0FBQSxFQUZzQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxELEVBRGM7SUFBQSxDQTVGaEIsQ0FBQTs7QUFBQSxxQ0FpR0EsS0FBQSxHQUFPLFNBQUEsR0FBQTtBQUNMLGFBQU8sSUFBQyxDQUFBLEVBQVIsQ0FESztJQUFBLENBakdQLENBQUE7O0FBQUEscUNBb0dBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsVUFBQSxpQkFBQTtBQUFBLE1BQUEsUUFBZSxJQUFDLENBQUEsYUFBRCxDQUFBLENBQWYsRUFBQyxhQUFBLElBQUQsRUFBTyxhQUFBLElBQVAsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFDLENBQUEsY0FBRCxDQUFBLENBRGQsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFFBQUQsR0FBZ0IsSUFBQSxRQUFBLENBQVM7QUFBQSxRQUN2QixXQUFBLEVBQWtCLEtBREs7QUFBQSxRQUV2QixVQUFBLEVBQWtCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix5Q0FBaEIsQ0FGSztBQUFBLFFBR3ZCLE1BQUEsSUFIdUI7QUFBQSxRQUdqQixNQUFBLElBSGlCO09BQVQsQ0FIaEIsQ0FBQTtBQUFBLE1BU0EsSUFBQyxDQUFBLGVBQUQsQ0FBQSxDQVRBLENBQUE7QUFBQSxNQVVBLElBQUMsQ0FBQSxrQkFBRCxDQUFBLENBVkEsQ0FBQTtBQUFBLE1BV0EsSUFBQyxDQUFBLGtCQUFELENBQUEsQ0FYQSxDQUFBO2FBWUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQWUsSUFBQyxDQUFBLEtBQUssQ0FBQyxHQUFQLENBQVcsQ0FBWCxDQUFmLEVBYmU7SUFBQSxDQXBHakIsQ0FBQTs7QUFBQSxxQ0FtSEEsZUFBQSxHQUFpQixTQUFBLEdBQUE7QUFDZixNQUFBLElBQUMsQ0FBQSxVQUFVLENBQUMsRUFBWixDQUFlLDhCQUFmLEVBQStDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtpQkFDN0MsS0FBQyxDQUFBLFFBQVEsQ0FBQyxLQUFWLENBQWdCLElBQWhCLEVBRDZDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBL0MsQ0FBQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsVUFBVSxDQUFDLEVBQVosQ0FBZSw4QkFBZixFQUErQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQzdDLFVBQUEsSUFBYyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMkNBQWhCLENBQWQ7bUJBQUEsS0FBQyxDQUFBLE9BQUQsQ0FBQSxFQUFBO1dBRDZDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBL0MsQ0FIQSxDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsUUFBUSxDQUFDLEdBQVYsR0FBZ0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsT0FBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQU5oQixDQUFBO0FBQUEsTUFRQSxJQUFDLENBQUEsUUFBUSxDQUFDLEVBQVYsQ0FBYSxNQUFiLEVBQXFCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtpQkFDbkIsS0FBQyxDQUFBLEtBQUQsQ0FBTyxJQUFQLEVBRG1CO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckIsQ0FSQSxDQUFBO0FBQUEsTUFXQSxJQUFDLENBQUEsVUFBVSxDQUFDLEVBQVosQ0FBZSwrQkFBZixFQUFnRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxLQUFELEdBQUE7aUJBQzlDLEtBQUMsQ0FBQSxPQUFELEdBQVcsTUFEbUM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoRCxDQVhBLENBQUE7QUFBQSxNQWFBLElBQUMsQ0FBQSxRQUFRLENBQUMsRUFBVixDQUFhLE9BQWIsRUFBc0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxHQUFBO2lCQUNwQixLQUFDLENBQUEsS0FBRCxHQUFTLE1BRFc7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0QixDQWJBLENBQUE7YUFnQkEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQWUsTUFBZixFQUF1QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3JCLGNBQUEsa0RBQUE7QUFBQSxVQUFBLEtBQUMsQ0FBQSxVQUFELENBQUEsQ0FBQSxDQUFBO0FBQUEsVUFDQSxLQUFDLENBQUEsb0JBQUQsQ0FBQSxDQURBLENBQUE7QUFHQSxVQUFBLElBQWMscUNBQWQ7QUFBQSxrQkFBQSxDQUFBO1dBSEE7QUFBQSxVQUlBLGNBQUEsR0FBaUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZDQUFoQixDQUpqQixDQUFBO0FBS0EsVUFBQSxJQUF1QyxjQUF2QztBQUFBLFlBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTyxFQUFBLEdBQUcsY0FBSCxHQUFvQixFQUFFLENBQUMsR0FBOUIsQ0FBQSxDQUFBO1dBTEE7QUFNQTtBQUFBO2VBQUEsNENBQUE7Z0NBQUE7QUFBQSwwQkFBQSxLQUFDLENBQUEsS0FBRCxDQUFPLEVBQUEsR0FBRyxPQUFILEdBQWEsRUFBRSxDQUFDLEdBQXZCLEVBQUEsQ0FBQTtBQUFBOzBCQVBxQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZCLEVBakJlO0lBQUEsQ0FuSGpCLENBQUE7O0FBQUEscUNBNklBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxVQUFBLFlBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQUEsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsU0FBUyxDQUFDLGtCQUFYLENBQThCLElBQTlCLENBRkEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGtCQUFELENBQUEsQ0FIQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsa0JBQUQsQ0FBQSxDQUpBLENBQUE7QUFNQSxNQUFBLElBQUcsSUFBQyxDQUFBLEtBQUssQ0FBQyxTQUFQLENBQUEsQ0FBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLElBQUQsQ0FBQSxDQUFBLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxlQUFELENBQWlCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxLQUFLLENBQUMsT0FBUCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQixDQURBLENBREY7T0FBQSxNQUFBO0FBSUUsUUFBQSxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQVAsQ0FBQSxDQUFBLENBSkY7T0FOQTtBQVlBLE1BQUEsSUFBRyxJQUFDLENBQUEsVUFBRCxJQUFnQixJQUFDLENBQUEsVUFBVSxDQUFDLFVBQS9CO0FBQ0UsUUFBQSxJQUFDLENBQUEsVUFBVSxDQUFDLFVBQVUsQ0FBQyxXQUF2QixDQUFtQyxJQUFDLENBQUEsVUFBcEMsQ0FBQSxDQURGO09BWkE7O2FBZVcsQ0FBRSxTQUFiLENBQUE7T0FmQTtvREFnQlMsQ0FBRSxPQUFYLENBQUEsV0FqQk87SUFBQSxDQTdJVCxDQUFBOztBQUFBLHFDQWdLQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1IsVUFBQSxHQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsYUFBYSxDQUFDLE1BQWYsQ0FBc0IsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFuQyxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBTyxDQUFDLE9BQXJCLENBQUEsQ0FEQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsU0FBRCxHQUFhLElBQUMsQ0FBQSxVQUFELEdBQWMsQ0FBQSxDQUFFLGFBQUYsQ0FBZ0IsQ0FBQyxNQUFqQixDQUFBLENBSDNCLENBQUE7QUFBQSxNQUlBLEdBQUEsR0FBTSxJQUFDLENBQUEsV0FBVyxDQUFDLFFBQWIsQ0FBc0IsTUFBdEIsQ0FKTixDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsZUFBRCxDQUFpQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxLQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpCLENBTEEsQ0FBQTtBQU9BLE1BQUEsSUFBRyxJQUFDLENBQUEsU0FBSjtBQUNFLFFBQUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLEdBQXVCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFDLENBQUEsV0FBbkIsRUFDckI7QUFBQSxVQUFBLEtBQUEsRUFBTyxZQUFQO1NBRHFCLENBQXZCLENBQUE7QUFBQSxRQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWhDLENBRkEsQ0FBQTtBQUFBLFFBR0EsSUFBQyxDQUFBLFlBQUQsQ0FBYyxJQUFDLENBQUEsVUFBZixDQUhBLENBQUE7QUFBQSxRQUlBLEdBQUcsQ0FBQyxXQUFKLENBQWdCLG9CQUFoQixDQUFxQyxDQUFDLFFBQXRDLENBQStDLGtCQUEvQyxDQUpBLENBQUE7ZUFLQSxJQUFDLENBQUEsU0FBRCxHQUFhLE1BTmY7T0FBQSxNQUFBO0FBUUUsUUFBQSxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsR0FBdUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQUMsQ0FBQSxXQUFuQixFQUNyQjtBQUFBLFVBQUEsS0FBQSxFQUFPLFFBQVA7U0FEcUIsQ0FBdkIsQ0FBQTtBQUFBLFFBRUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBaEMsQ0FGQSxDQUFBO0FBQUEsUUFHQSxJQUFDLENBQUEsWUFBRCxDQUFjLElBQUMsQ0FBQSxTQUFmLENBSEEsQ0FBQTtBQUFBLFFBSUEsR0FBRyxDQUFDLFdBQUosQ0FBZ0Isa0JBQWhCLENBQW1DLENBQUMsUUFBcEMsQ0FBNkMsb0JBQTdDLENBSkEsQ0FBQTtlQUtBLElBQUMsQ0FBQSxTQUFELEdBQWEsS0FiZjtPQVJRO0lBQUEsQ0FoS1YsQ0FBQTs7QUFBQSxxQ0F1TEEsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLFVBQUEsSUFBQTs7UUFBQSxvQkFBcUIsQ0FBQSxDQUFFLFFBQVEsQ0FBQyxhQUFYO09BQXJCO0FBRUEsTUFBQSxJQUFHLGNBQUEsSUFBbUIsY0FBQSxLQUFrQixJQUF4QztBQUNFLFFBQUEsSUFBRyxjQUFjLENBQUMsU0FBbEI7QUFDRSxVQUFBLElBQUMsQ0FBQSxhQUFhLENBQUMsTUFBZixDQUFzQixJQUFDLENBQUEsV0FBVyxDQUFDLE9BQW5DLENBQUEsQ0FBQTtBQUFBLFVBQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFPLENBQUMsT0FBckIsQ0FBQSxDQURBLENBQUE7QUFBQSxVQUVBLElBQUEsR0FBTyxJQUFDLENBQUEsV0FBVyxDQUFDLFFBQWIsQ0FBc0IsTUFBdEIsQ0FGUCxDQUFBO0FBQUEsVUFJQSxJQUFDLENBQUEsU0FBRCxHQUFhLGNBQWMsQ0FBQyxTQUo1QixDQUFBO0FBQUEsVUFLQSxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsR0FBdUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQUMsQ0FBQSxXQUFuQixFQUNyQjtBQUFBLFlBQUEsS0FBQSxFQUFPLFFBQVA7V0FEcUIsQ0FMdkIsQ0FBQTtBQUFBLFVBT0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBaEMsQ0FQQSxDQUFBO0FBQUEsVUFRQSxJQUFJLENBQUMsV0FBTCxDQUFpQixrQkFBakIsQ0FBb0MsQ0FBQyxRQUFyQyxDQUE4QyxvQkFBOUMsQ0FSQSxDQUFBO0FBQUEsVUFTQSxJQUFDLENBQUEsU0FBRCxHQUFhLElBVGIsQ0FERjtTQUFBO0FBQUEsUUFXQSxjQUFjLENBQUMsSUFBZixDQUFBLENBWEEsQ0FERjtPQUZBO0FBQUEsTUFnQkEsY0FBQSxHQUFpQixJQWhCakIsQ0FBQTtBQUFBLE1BaUJBLElBQUMsQ0FBQSxTQUFTLENBQUMscUJBQVgsQ0FBaUMsSUFBakMsQ0FqQkEsQ0FBQTtBQUFBLE1Ba0JBLElBQUMsQ0FBQSxVQUFVLENBQUMsUUFBWixDQUFBLENBbEJBLENBQUE7QUFBQSxNQW9CQSxJQUFDLENBQUEsZUFBRCxDQUFpQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ2YsVUFBQSxJQUFHLENBQUEsS0FBSyxDQUFBLE1BQVI7QUFDRSxZQUFBLEtBQUMsQ0FBQSxNQUFELEdBQVUsSUFBVixDQUFBO0FBQUEsWUFDQSxLQUFDLENBQUEsZUFBRCxDQUFBLENBREEsQ0FBQTtBQUFBLFlBRUEsS0FBQyxDQUFBLFVBQUQsR0FBYyxLQUFDLENBQUEsVUFBRCxDQUFZLEtBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxDQUFBLENBQVosQ0FGZCxDQUFBO21CQUdBLEtBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxDQUFjLEtBQUMsQ0FBQSxVQUFmLEVBSkY7V0FBQSxNQUFBO21CQU1FLEtBQUMsQ0FBQSxLQUFELENBQUEsRUFORjtXQURlO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakIsQ0FwQkEsQ0FBQTtBQUFBLE1BNkJBLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBLENBN0JBLENBQUE7QUFBQSxNQThCQSxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBYyxDQUFkLENBOUJBLENBQUE7QUFBQSxNQStCQSxJQUFDLENBQUEsU0FBRCxHQUFhLElBL0JiLENBQUE7YUFnQ0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLENBQWlCLElBQUMsQ0FBQSxTQUFKLEdBQW1CLElBQUMsQ0FBQSxTQUFwQixHQUFtQyxJQUFDLENBQUEsVUFBbEQsRUFqQ0k7SUFBQSxDQXZMTixDQUFBOztBQUFBLHFDQTBOQSxJQUFBLEdBQU0sU0FBQSxHQUFBO0FBQ0osVUFBQSxLQUFBOzthQUFTLENBQUUsSUFBWCxDQUFBO09BQUE7QUFBQSxNQUNBLGNBQUEsR0FBaUIsSUFEakIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxVQUFaLENBQUEsQ0FGQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsZUFBRCxDQUFpQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ2YsVUFBQSxLQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQSxDQUFBLENBQUE7QUFDQSxVQUFBLElBQU8sc0JBQVA7QUFDRSxZQUFBLElBQUcseUJBQUg7QUFDRSxjQUFBLGlCQUFpQixDQUFDLEtBQWxCLENBQUEsQ0FBQSxDQUFBO3FCQUNBLGlCQUFBLEdBQW9CLEtBRnRCO2FBREY7V0FGZTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpCLENBSkEsQ0FBQTtBQUFBLE1BV0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLENBQWlCLElBQUMsQ0FBQSxTQUFKLEdBQW1CLElBQUMsQ0FBQSxTQUFwQixHQUFtQyxJQUFDLENBQUEsVUFBbEQsQ0FYQSxDQUFBO0FBQUEsTUFZQSxJQUFDLENBQUEsU0FBRCxHQUFhLElBWmIsQ0FBQTthQWFBLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxDQUFjLENBQWQsRUFkSTtJQUFBLENBMU5OLENBQUE7O0FBQUEscUNBME9BLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixNQUFBLElBQVUsSUFBQyxDQUFBLFNBQVg7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUVBLE1BQUEsSUFBRyxJQUFDLENBQUEsS0FBSyxDQUFDLFNBQVAsQ0FBQSxDQUFIO2VBQ0UsSUFBQyxDQUFBLElBQUQsQ0FBQSxFQURGO09BQUEsTUFBQTtlQUdFLElBQUMsQ0FBQSxJQUFELENBQUEsRUFIRjtPQUhNO0lBQUEsQ0ExT1IsQ0FBQTs7QUFBQSxxQ0FrUEEsS0FBQSxHQUFPLFNBQUMsSUFBRCxHQUFBO0FBQ0wsTUFBQSxJQUFjLG9DQUFkO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxRQUFRLENBQUMsYUFBVixDQUFBLENBRkEsQ0FBQTthQUdBLElBQUMsQ0FBQSxVQUFVLENBQUMsSUFBWixDQUFpQjtBQUFBLFFBQUEsS0FBQSxFQUFPLE9BQVA7QUFBQSxRQUFnQixJQUFBLEVBQU0sSUFBdEI7T0FBakIsRUFKSztJQUFBLENBbFBQLENBQUE7O0FBQUEscUNBd1BBLE1BQUEsR0FBUSxTQUFDLElBQUQsRUFBTyxJQUFQLEdBQUE7QUFDTixNQUFBLElBQWMsb0NBQWQ7QUFBQSxjQUFBLENBQUE7T0FBQTthQUVBLElBQUMsQ0FBQSxVQUFVLENBQUMsSUFBWixDQUFpQjtBQUFBLFFBQUMsS0FBQSxFQUFPLFFBQVI7QUFBQSxRQUFrQixNQUFBLElBQWxCO0FBQUEsUUFBd0IsTUFBQSxJQUF4QjtPQUFqQixFQUhNO0lBQUEsQ0F4UFIsQ0FBQTs7QUFBQSxxQ0E2UEEsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsNkZBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IseUJBQWhCLENBQVQsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFQLENBQWdCLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBN0IsQ0FGQSxDQUFBO0FBR0EsTUFBQSxJQUFrQyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQWpEO0FBQUEsUUFBQSxJQUFDLENBQUEsS0FBSyxDQUFDLFFBQVAsQ0FBZ0IsY0FBaEIsQ0FBQSxDQUFBO09BSEE7QUFBQSxNQUtBLFVBQUEsR0FBYSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsbUJBQWhCLENBTGIsQ0FBQTtBQUFBLE1BTUEsV0FBQSxHQUFjLGdEQU5kLENBQUE7QUFBQSxNQU9BLFlBQUEsR0FBZSxNQUFNLENBQUMsS0FBSyxDQUFDLFVBUDVCLENBQUE7QUFBQSxNQVFBLElBQUMsQ0FBQSxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxVQUF4QixHQUFxQyxZQUFBLElBQWdCLFVBQWhCLElBQThCLFdBUm5FLENBQUE7QUFBQSxNQVVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVosQ0FBd0IsbUJBQXhCLEVBQTZDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEtBQUQsR0FBQTtBQUM5RCxVQUFBLFVBQUEsR0FBYSxLQUFLLENBQUMsUUFBbkIsQ0FBQTtpQkFDQSxLQUFDLENBQUEsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBeEIsR0FBcUMsWUFBQSxJQUFnQixVQUFoQixJQUE4QixZQUZMO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBN0MsQ0FBbkIsQ0FWQSxDQUFBO0FBQUEsTUFhQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLDBDQUF4QixFQUFvRSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxLQUFELEdBQUE7QUFDckYsVUFBQSxZQUFBLEdBQWUsS0FBSyxDQUFDLFFBQXJCLENBQUE7aUJBQ0EsS0FBQyxDQUFBLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFVBQXhCLEdBQXFDLFlBQUEsSUFBZ0IsVUFBaEIsSUFBOEIsWUFGa0I7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwRSxDQUFuQixDQWJBLENBQUE7QUFBQSxNQWlCQSxjQUFBLEdBQWlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixpQkFBaEIsQ0FqQmpCLENBQUE7QUFBQSxNQWtCQSxnQkFBQSxHQUFtQixNQUFNLENBQUMsS0FBSyxDQUFDLFFBbEJoQyxDQUFBO0FBQUEsTUFtQkEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQXhCLEdBQW1DLEVBQUEsR0FBRSxDQUFDLGdCQUFBLElBQW9CLGNBQXJCLENBQUYsR0FBc0MsSUFuQnpFLENBQUE7QUFBQSxNQXFCQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLGlCQUF4QixFQUEyQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxLQUFELEdBQUE7QUFDNUQsVUFBQSxjQUFBLEdBQWlCLEtBQUssQ0FBQyxRQUF2QixDQUFBO0FBQUEsVUFDQSxLQUFDLENBQUEsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBeEIsR0FBbUMsRUFBQSxHQUFFLENBQUMsZ0JBQUEsSUFBb0IsY0FBckIsQ0FBRixHQUFzQyxJQUR6RSxDQUFBO2lCQUVBLEtBQUMsQ0FBQSxvQkFBRCxDQUFBLEVBSDREO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0MsQ0FBbkIsQ0FyQkEsQ0FBQTtBQUFBLE1BeUJBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVosQ0FBd0Isd0NBQXhCLEVBQWtFLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEtBQUQsR0FBQTtBQUNuRixVQUFBLGdCQUFBLEdBQW1CLEtBQUssQ0FBQyxRQUF6QixDQUFBO0FBQUEsVUFDQSxLQUFDLENBQUEsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBeEIsR0FBbUMsRUFBQSxHQUFFLENBQUMsZ0JBQUEsSUFBb0IsY0FBckIsQ0FBRixHQUFzQyxJQUR6RSxDQUFBO2lCQUVBLEtBQUMsQ0FBQSxvQkFBRCxDQUFBLEVBSG1GO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEUsQ0FBbkIsQ0F6QkEsQ0FBQTtBQUFBLE1BK0JBLDREQUF5QixDQUN2QixNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBL0IsQ0FBQSxDQUR1QixFQUV2QixNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBN0IsQ0FBQSxDQUZ1QixFQUd2QixNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBL0IsQ0FBQSxDQUh1QixFQUl2QixNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBaEMsQ0FBQSxDQUp1QixFQUt2QixNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBOUIsQ0FBQSxDQUx1QixFQU12QixNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBakMsQ0FBQSxDQU51QixFQU92QixNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBOUIsQ0FBQSxDQVB1QixFQVF2QixNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBL0IsQ0FBQSxDQVJ1QixDQUF6QixJQUF5QixLQS9CekIsQ0FBQTthQTBDQSxDQUFBLDREQUEwQixDQUN4QixNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsV0FBdEMsQ0FBQSxDQUR3QixFQUV4QixNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsV0FBcEMsQ0FBQSxDQUZ3QixFQUd4QixNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsV0FBdEMsQ0FBQSxDQUh3QixFQUl4QixNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsV0FBdkMsQ0FBQSxDQUp3QixFQUt4QixNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsV0FBckMsQ0FBQSxDQUx3QixFQU14QixNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsV0FBeEMsQ0FBQSxDQU53QixFQU94QixNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsV0FBckMsQ0FBQSxDQVB3QixFQVF4QixNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsV0FBdEMsQ0FBQSxDQVJ3QixDQUExQixJQUEwQixLQUExQixFQTNDVTtJQUFBLENBN1BaLENBQUE7O0FBQUEscUNBbVRBLGtCQUFBLEdBQW9CLFNBQUEsR0FBQTthQUNsQixDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsRUFBVixDQUFhLFFBQWIsRUFBdUIsSUFBQyxDQUFBLGNBQXhCLEVBRGtCO0lBQUEsQ0FuVHBCLENBQUE7O0FBQUEscUNBc1RBLGtCQUFBLEdBQW9CLFNBQUEsR0FBQTthQUNsQixDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsR0FBVixDQUFjLFFBQWQsRUFBd0IsSUFBQyxDQUFBLGNBQXpCLEVBRGtCO0lBQUEsQ0F0VHBCLENBQUE7O0FBQUEscUNBeVRBLGtCQUFBLEdBQW9CLFNBQUEsR0FBQTthQUNsQixJQUFDLENBQUEsWUFBWSxDQUFDLEVBQWQsQ0FBaUIsV0FBakIsRUFBOEIsSUFBQyxDQUFBLGFBQS9CLEVBRGtCO0lBQUEsQ0F6VHBCLENBQUE7O0FBQUEscUNBNFRBLGtCQUFBLEdBQW9CLFNBQUEsR0FBQTthQUNsQixJQUFDLENBQUEsWUFBWSxDQUFDLEdBQWQsQ0FBa0IsV0FBbEIsRUFEa0I7SUFBQSxDQTVUcEIsQ0FBQTs7QUFBQSxxQ0ErVEEsY0FBQSxHQUFnQixTQUFBLEdBQUE7QUFDZCxVQUFBLGdEQUFBO0FBQUEsTUFBQSxJQUFHLENBQUEsSUFBSyxDQUFBLE9BQVI7QUFDRSxRQUFBLElBQUMsQ0FBQSxLQUFLLENBQUMsR0FBUCxDQUFXLFlBQVgsRUFBeUIsRUFBekIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxTQUFBLEdBQVksQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLE1BQVYsQ0FBQSxDQURaLENBQUE7QUFBQSxRQUVBLFdBQUEsR0FBYyxDQUFBLENBQUUsNkJBQUYsQ0FBZ0MsQ0FBQyxLQUFqQyxDQUFBLENBQXdDLENBQUMsR0FBekMsQ0FBNkMsQ0FBN0MsQ0FGZCxDQUFBO0FBQUEsUUFHQSxRQUFBLEdBQVcsV0FBVyxDQUFDLFlBQVosR0FBMkIsV0FBVyxDQUFDLFlBSGxELENBQUE7QUFBQSxRQUtBLEtBQUEsR0FBUSxTQUFBLEdBQVksSUFBQyxDQUFBLFlBTHJCLENBQUE7QUFBQSxRQU1BLElBQUMsQ0FBQSxZQUFELEdBQWdCLFNBTmhCLENBQUE7QUFRQSxRQUFBLElBQUcsSUFBQyxDQUFBLFNBQUo7QUFDRSxVQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsR0FBTCxDQUFTLElBQUMsQ0FBQSxTQUFELEdBQWEsS0FBdEIsRUFBNkIsSUFBQyxDQUFBLFNBQTlCLENBQVYsQ0FBQTtBQUVBLFVBQUEsSUFBeUIsSUFBQyxDQUFBLEtBQUssQ0FBQyxTQUFQLENBQUEsQ0FBekI7QUFBQSxZQUFBLElBQUMsQ0FBQSxZQUFELENBQWMsT0FBZCxDQUFBLENBQUE7V0FGQTtBQUFBLFVBR0EsSUFBQyxDQUFBLFNBQUQsR0FBYSxPQUhiLENBQUE7QUFBQSxVQUtBLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxJQUFDLENBQUEsVUFBVixFQUFzQixJQUFDLENBQUEsU0FBdkIsQ0FMZCxDQURGO1NBQUEsTUFPSyxJQUFHLFFBQUEsR0FBVyxDQUFkO0FBQ0gsVUFBQSxPQUFBLEdBQVUsSUFBSSxDQUFDLEdBQUwsQ0FBUyxJQUFDLENBQUEsVUFBRCxDQUFZLElBQUMsQ0FBQSxVQUFELEdBQWMsS0FBMUIsQ0FBVCxFQUEyQyxJQUFDLENBQUEsU0FBNUMsQ0FBVixDQUFBO0FBRUEsVUFBQSxJQUF5QixJQUFDLENBQUEsS0FBSyxDQUFDLFNBQVAsQ0FBQSxDQUF6QjtBQUFBLFlBQUEsSUFBQyxDQUFBLFlBQUQsQ0FBYyxPQUFkLENBQUEsQ0FBQTtXQUZBO0FBQUEsVUFHQSxJQUFDLENBQUEsVUFBRCxHQUFjLE9BSGQsQ0FERztTQWZMO0FBQUEsUUFxQkEsSUFBQyxDQUFBLEtBQUssQ0FBQyxHQUFQLENBQVcsWUFBWCxFQUEwQixTQUFBLEdBQVEsQ0FBQyxJQUFBLEdBQU8sSUFBQyxDQUFBLGNBQVQsQ0FBUixHQUFnQyxVQUExRCxDQXJCQSxDQURGO09BQUE7YUF1QkEsSUFBQyxDQUFBLG9CQUFELENBQUEsRUF4QmM7SUFBQSxDQS9UaEIsQ0FBQTs7QUFBQSxxQ0F5VkEsYUFBQSxHQUFlLFNBQUEsR0FBQTtBQUNiLE1BQUEsSUFBVSxJQUFDLENBQUEsU0FBWDtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsU0FBRCxHQUFhLElBQUMsQ0FBQSxVQUFELEdBQWMsQ0FBQSxDQUFFLGFBQUYsQ0FBZ0IsQ0FBQyxNQUFqQixDQUFBLENBRDNCLENBQUE7QUFBQSxNQUVBLENBQUEsQ0FBRSxRQUFGLENBQVcsQ0FBQyxFQUFaLENBQWUsV0FBZixFQUE0QixJQUFDLENBQUEsV0FBN0IsQ0FGQSxDQUFBO0FBQUEsTUFHQSxDQUFBLENBQUUsUUFBRixDQUFXLENBQUMsRUFBWixDQUFlLFNBQWYsRUFBMEIsSUFBQyxDQUFBLGFBQTNCLENBSEEsQ0FBQTthQUlBLElBQUMsQ0FBQSxLQUFLLENBQUMsR0FBUCxDQUFXLFlBQVgsRUFBeUIsRUFBekIsRUFMYTtJQUFBLENBelZmLENBQUE7O0FBQUEscUNBZ1dBLGFBQUEsR0FBZSxTQUFBLEdBQUE7QUFDYixNQUFBLENBQUEsQ0FBRSxRQUFGLENBQVcsQ0FBQyxHQUFaLENBQWdCLFdBQWhCLEVBQTZCLElBQUMsQ0FBQSxXQUE5QixDQUFBLENBQUE7QUFBQSxNQUNBLENBQUEsQ0FBRSxRQUFGLENBQVcsQ0FBQyxHQUFaLENBQWdCLFNBQWhCLEVBQTJCLElBQUMsQ0FBQSxhQUE1QixDQURBLENBQUE7YUFFQSxJQUFDLENBQUEsS0FBSyxDQUFDLEdBQVAsQ0FBVyxZQUFYLEVBQTBCLFNBQUEsR0FBUSxDQUFDLElBQUEsR0FBTyxJQUFDLENBQUEsY0FBVCxDQUFSLEdBQWdDLFVBQTFELEVBSGE7SUFBQSxDQWhXZixDQUFBOztBQUFBLHFDQXFXQSxVQUFBLEdBQVksU0FBQyxLQUFELEdBQUE7QUFDVixVQUFBLElBQUE7QUFBQSxNQUFBLElBQUEsY0FBTyxRQUFTLElBQUMsQ0FBQSxVQUFqQixDQUFBO0FBQ0EsYUFBTyxJQUFBLEdBQU8sSUFBQyxDQUFBLFNBQWYsQ0FGVTtJQUFBLENBcldaLENBQUE7O0FBQUEscUNBeVdBLFdBQUEsR0FBYSxTQUFDLEtBQUQsR0FBQTtBQUNYLFVBQUEsc0JBQUE7QUFBQSxNQUFBLElBQStCLEtBQUssQ0FBQyxLQUFOLEtBQWUsQ0FBOUM7QUFBQSxlQUFPLElBQUMsQ0FBQSxhQUFELENBQUEsQ0FBUCxDQUFBO09BQUE7QUFBQSxNQUVBLE1BQUEsR0FBUyxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsTUFBVixDQUFBLENBQUEsR0FBcUIsS0FBSyxDQUFDLEtBRnBDLENBQUE7QUFBQSxNQUdBLEtBQUEsR0FBUSxNQUFBLEdBQVMsQ0FBQSxDQUFFLDZCQUFGLENBQWdDLENBQUMsTUFBakMsQ0FBQSxDQUhqQixDQUFBO0FBSUEsTUFBQSxJQUFBLENBQUEsQ0FBYyxJQUFJLENBQUMsR0FBTCxDQUFTLEtBQVQsQ0FBQSxHQUFrQixDQUFDLElBQUMsQ0FBQSxTQUFELEdBQWEsQ0FBYixHQUFpQixDQUFsQixDQUFoQyxDQUFBO0FBQUEsY0FBQSxDQUFBO09BSkE7QUFBQSxNQU1BLE9BQUEsR0FBVSxJQUFJLENBQUMsR0FBTCxDQUFTLElBQUMsQ0FBQSxVQUFELENBQVksSUFBQyxDQUFBLFVBQUQsR0FBYyxLQUExQixDQUFULEVBQTJDLElBQUMsQ0FBQSxTQUE1QyxDQU5WLENBQUE7QUFPQSxNQUFBLElBQVUsT0FBQSxHQUFVLElBQUMsQ0FBQSxTQUFyQjtBQUFBLGNBQUEsQ0FBQTtPQVBBO0FBQUEsTUFTQSxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBYyxPQUFkLENBVEEsQ0FBQTtBQUFBLE1BVUEsQ0FBQSxDQUFFLElBQUMsQ0FBQSxRQUFRLENBQUMsT0FBWixDQUFvQixDQUFDLE1BQXJCLENBQTRCLE9BQTVCLENBVkEsQ0FBQTtBQUFBLE1BV0EsSUFBQyxDQUFBLFVBQUQsR0FBYyxPQVhkLENBQUE7YUFhQSxJQUFDLENBQUEsb0JBQUQsQ0FBQSxFQWRXO0lBQUEsQ0F6V2IsQ0FBQTs7QUFBQSxxQ0F5WEEsWUFBQSxHQUFjLFNBQUMsTUFBRCxHQUFBO0FBQ1osTUFBQSxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBYyxNQUFkLENBQUEsQ0FBQTthQUNBLENBQUEsQ0FBRSxJQUFDLENBQUEsUUFBUSxDQUFDLE9BQVosQ0FBb0IsQ0FBQyxNQUFyQixDQUE0QixNQUE1QixFQUZZO0lBQUEsQ0F6WGQsQ0FBQTs7QUFBQSxxQ0E2WEEsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLFVBQUEsd0NBQUE7QUFBQSxNQUFBLElBQUcsSUFBQyxDQUFBLFFBQVEsQ0FBQyxTQUFiO0FBQ0UsUUFBQSxRQUFBLEdBQVcsSUFBQyxDQUFBLFFBQVEsQ0FBQyxlQUFWLENBQUEsQ0FBWCxDQUFBO0FBQUEsUUFDQSxJQUFBLEdBQU8sSUFBQyxDQUFBLFFBQVEsQ0FBQyxRQUFWLENBQ0wsSUFBQyxDQUFBLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFEZixFQUNtQixJQUFDLENBQUEsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUR2QyxFQUVMLElBQUMsQ0FBQSxRQUFRLENBQUMsU0FBUyxDQUFDLEVBRmYsRUFFbUIsSUFBQyxDQUFBLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFGdkMsQ0FEUCxDQURGO09BQUEsTUFBQTtBQU1FLFFBQUEsT0FBQSxHQUFVLElBQUMsQ0FBQSxRQUFRLENBQUMsT0FBTyxDQUFDLFlBQWxCLENBQUEsQ0FBZ0MsQ0FBQyxRQUFqQyxDQUFBLENBQVYsQ0FBQTtBQUFBLFFBQ0EsUUFBQSxHQUFXLE9BQU8sQ0FBQyxLQUFSLENBQWMsUUFBZCxDQURYLENBQUE7QUFBQSxRQUVBLEtBQUEsR0FBUSxRQUFRLENBQUMsR0FBVCxDQUFhLFNBQUMsSUFBRCxHQUFBO2lCQUNuQixJQUFJLENBQUMsT0FBTCxDQUFhLEtBQWIsRUFBb0IsR0FBcEIsQ0FBd0IsQ0FBQyxTQUF6QixDQUFBLEVBRG1CO1FBQUEsQ0FBYixDQUZSLENBQUE7QUFBQSxRQUlBLElBQUEsR0FBTyxLQUFLLENBQUMsSUFBTixDQUFXLElBQVgsQ0FKUCxDQU5GO09BQUE7YUFXQSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQWYsQ0FBcUIsSUFBckIsRUFaSTtJQUFBLENBN1hOLENBQUE7O0FBQUEscUNBMllBLEtBQUEsR0FBTyxTQUFBLEdBQUE7YUFDTCxJQUFDLENBQUEsS0FBRCxDQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFBLENBQVAsRUFESztJQUFBLENBM1lQLENBQUE7O0FBQUEscUNBOFlBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsVUFBQSwyQ0FBQTtBQUFBLE1BQUEsSUFBQSxDQUFBLENBQWMsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQWQ7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsVUFBQSxHQUFhLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixpREFBaEIsQ0FEYixDQUFBO0FBR0EsTUFBQSxJQUFHLFNBQUEsR0FBWSxNQUFNLENBQUMsZUFBUCxDQUFBLENBQWY7QUFDRSxRQUFBLElBQUMsQ0FBQSxRQUFRLENBQUMsYUFBVixDQUFBLENBQUEsQ0FBQTtlQUNBLElBQUMsQ0FBQSxLQUFELENBQU8sRUFBQSxHQUFHLFNBQUgsR0FBYyxDQUFJLFVBQUgsR0FBbUIsRUFBRSxDQUFDLEdBQXRCLEdBQStCLEVBQWhDLENBQXJCLEVBRkY7T0FBQSxNQUdLLElBQUcsTUFBQSxHQUFTLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVo7QUFDSCxRQUFBLElBQUEsR0FBTyxNQUFNLENBQUMsb0JBQVAsQ0FBNEIsTUFBTSxDQUFDLEdBQW5DLENBQVAsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxhQUFWLENBQUEsQ0FEQSxDQUFBO0FBQUEsUUFFQSxJQUFDLENBQUEsS0FBRCxDQUFPLEVBQUEsR0FBRyxJQUFILEdBQVMsQ0FBSSxVQUFILEdBQW1CLEVBQUUsQ0FBQyxHQUF0QixHQUErQixFQUFoQyxDQUFoQixDQUZBLENBQUE7ZUFHQSxNQUFNLENBQUMsUUFBUCxDQUFnQixDQUFoQixFQUpHO09BUFU7SUFBQSxDQTlZakIsQ0FBQTs7QUFBQSxxQ0EyWkEsWUFBQSxHQUFjLFNBQUMsVUFBRCxHQUFBO0FBQ1osVUFBQSxVQUFBO0FBQUEsTUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlEQUFoQixDQUFiLENBQUE7YUFDQSxJQUFDLENBQUEsS0FBRCxDQUFPLEVBQUEsR0FBRyxVQUFILEdBQWUsQ0FBSSxVQUFILEdBQW1CLEVBQUUsQ0FBQyxHQUF0QixHQUErQixFQUFoQyxDQUF0QixFQUZZO0lBQUEsQ0EzWmQsQ0FBQTs7QUFBQSxxQ0ErWkEsS0FBQSxHQUFPLFNBQUEsR0FBQTtBQUNMLE1BQUEsSUFBQyxDQUFBLG9CQUFELENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBRCxDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxxQkFBWCxDQUFpQyxJQUFqQyxDQUZBLENBQUE7YUFHQSxnREFBQSxFQUpLO0lBQUEsQ0EvWlAsQ0FBQTs7QUFBQSxxQ0FxYUEsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLE1BQUEsSUFBQyxDQUFBLFlBQUQsQ0FBQSxDQUFBLENBQUE7YUFDQSwrQ0FBQSxFQUZJO0lBQUEsQ0FyYU4sQ0FBQTs7QUFBQSxxQ0F5YUEsYUFBQSxHQUFlLFNBQUEsR0FBQTtBQUNiLE1BQUEsSUFBQSxDQUFBLElBQWUsQ0FBQSxRQUFmO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxRQUFRLENBQUMsS0FBVixDQUFBLENBRkEsQ0FBQTtBQUdBLE1BQUEsSUFBRyxJQUFDLENBQUEsUUFBUSxDQUFDLFNBQWI7ZUFDRSxJQUFDLENBQUEsUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFwQixDQUFBLEVBREY7T0FBQSxNQUFBO2VBR0UsSUFBQyxDQUFBLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBbEIsQ0FBQSxFQUhGO09BSmE7SUFBQSxDQXphZixDQUFBOztBQUFBLHFDQWtiQSxZQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osTUFBQSxJQUFBLENBQUEsSUFBZSxDQUFBLFFBQWY7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQUEsQ0FGQSxDQUFBO2FBR0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBbEIsQ0FBQSxFQUpZO0lBQUEsQ0FsYmQsQ0FBQTs7QUFBQSxxQ0F3YkEsb0JBQUEsR0FBc0IsU0FBQSxHQUFBO0FBQ3BCLFVBQUEsaUJBQUE7QUFBQSxNQUFBLElBQUEsQ0FBQSxDQUFjLElBQUMsQ0FBQSxLQUFLLENBQUMsU0FBUCxDQUFBLENBQUEsSUFBc0IsSUFBQyxDQUFBLE9BQXJDLENBQUE7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BRUEsUUFBZSxJQUFDLENBQUEsYUFBRCxDQUFBLENBQWYsRUFBQyxhQUFBLElBQUQsRUFBTyxhQUFBLElBRlAsQ0FBQTtBQUdBLE1BQUEsSUFBQSxDQUFBLENBQWMsSUFBQSxHQUFPLENBQVAsSUFBYSxJQUFBLEdBQU8sQ0FBbEMsQ0FBQTtBQUFBLGNBQUEsQ0FBQTtPQUhBO0FBSUEsTUFBQSxJQUFBLENBQUEsSUFBZSxDQUFBLFFBQWY7QUFBQSxjQUFBLENBQUE7T0FKQTtBQUtBLE1BQUEsSUFBVSxJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsS0FBa0IsSUFBbEIsSUFBMkIsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLEtBQWtCLElBQXZEO0FBQUEsY0FBQSxDQUFBO09BTEE7QUFBQSxNQU9BLElBQUMsQ0FBQSxNQUFELENBQVEsSUFBUixFQUFjLElBQWQsQ0FQQSxDQUFBO2FBUUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxNQUFWLENBQWlCLElBQWpCLEVBQXVCLElBQXZCLEVBVG9CO0lBQUEsQ0F4YnRCLENBQUE7O0FBQUEscUNBbWNBLGFBQUEsR0FBZSxTQUFBLEdBQUE7QUFDYixVQUFBLDRCQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsQ0FBQSxDQUFFLGdDQUFGLENBQVYsQ0FBQTtBQUVBLE1BQUEsSUFBRyxJQUFDLENBQUEsUUFBSjtBQUNFLFFBQUEsSUFBQyxDQUFBLElBQUQsQ0FBTSxXQUFOLENBQWtCLENBQUMsTUFBbkIsQ0FBMEIsT0FBMUIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxPQUFBLEdBQVUsT0FBTyxDQUFDLFFBQVIsQ0FBQSxDQUFrQixDQUFDLEtBQW5CLENBQUEsQ0FBMkIsQ0FBQSxDQUFBLENBQUUsQ0FBQyxxQkFBOUIsQ0FBQSxDQURWLENBQUE7QUFBQSxRQUVBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBUCxDQUFBLENBQUEsR0FBaUIsQ0FBQyxPQUFPLENBQUMsS0FBUixJQUFpQixDQUFsQixDQUE1QixDQUZQLENBQUE7QUFBQSxRQUdBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxDQUFBLENBQUEsR0FBa0IsQ0FBQyxPQUFPLENBQUMsTUFBUixJQUFrQixFQUFuQixDQUE3QixDQUhQLENBQUE7QUFBQSxRQUlBLElBQUMsQ0FBQSxTQUFELEdBQWEsT0FBTyxDQUFDLE1BSnJCLENBQUE7QUFBQSxRQUtBLE9BQU8sQ0FBQyxNQUFSLENBQUEsQ0FMQSxDQURGO09BQUEsTUFBQTtBQVFFLFFBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFQLENBQUEsQ0FBQSxHQUFpQixDQUE1QixDQUFQLENBQUE7QUFBQSxRQUNBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxDQUFBLENBQUEsR0FBa0IsRUFBN0IsQ0FEUCxDQVJGO09BRkE7YUFhQTtBQUFBLFFBQUMsTUFBQSxJQUFEO0FBQUEsUUFBTyxNQUFBLElBQVA7UUFkYTtJQUFBLENBbmNmLENBQUE7O0FBQUEscUNBbWRBLGVBQUEsR0FBaUIsU0FBQyxRQUFELEdBQUE7YUFDZixJQUFDLENBQUEsS0FBSyxDQUFDLEdBQVAsQ0FBVyxxQkFBWCxFQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ2hDLFVBQUEsUUFBQSxDQUFBLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsU0FBRCxHQUFhLE1BRm1CO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEMsRUFEZTtJQUFBLENBbmRqQixDQUFBOztBQUFBLHFDQXdkQSxXQUFBLEdBQWEsU0FBQSxHQUFBO0FBQ1gsVUFBQSxNQUFBOztRQUFBLGNBQWUsT0FBQSxDQUFRLGdCQUFSO09BQWY7QUFBQSxNQUNBLE1BQUEsR0FBYSxJQUFBLFdBQUEsQ0FBWSxJQUFaLENBRGIsQ0FBQTthQUVBLE1BQU0sQ0FBQyxNQUFQLENBQUEsRUFIVztJQUFBLENBeGRiLENBQUE7O0FBQUEscUNBNmRBLE1BQUEsR0FBUSxTQUFBLEdBQUE7YUFDTixJQUFDLENBQUEsVUFBVSxDQUFDLE1BQVosQ0FBQSxFQURNO0lBQUEsQ0E3ZFIsQ0FBQTs7QUFBQSxxQ0FnZUEsYUFBQSxHQUFlLFNBQUEsR0FBQTtBQUNiLE1BQUEsSUFBRyxJQUFDLENBQUEsT0FBSjtBQUNFLFFBQUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWYsQ0FBOEI7QUFBQSxVQUFBLElBQUEsRUFBTSxJQUFOO0FBQUEsVUFBWSxPQUFBLEVBQVMsS0FBckI7U0FBOUIsQ0FBVCxDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsa0JBQUQsQ0FBQSxDQURBLENBQUE7QUFBQSxRQUVBLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixDQUFBLENBRkEsQ0FBQTtBQUFBLFFBR0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQUEsQ0FIQSxDQUFBO0FBQUEsUUFJQSxJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBQSxDQUpBLENBQUE7ZUFLQSxJQUFDLENBQUEsT0FBRCxHQUFXLE1BTmI7T0FBQSxNQUFBO0FBUUUsUUFBQSxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQVAsQ0FBQSxDQUFBLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxrQkFBRCxDQUFBLENBREEsQ0FBQTtBQUFBLFFBRUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQUEsQ0FGQSxDQUFBO0FBQUEsUUFHQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBQSxDQUhBLENBQUE7QUFBQSxRQUlBLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFBLENBSkEsQ0FBQTtBQUFBLFFBS0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxHQUFQLENBQVcsUUFBWCxFQUFxQixFQUFyQixDQUxBLENBQUE7QUFBQSxRQU1BLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFOWCxDQUFBO0FBT0EsUUFBQSxJQUF5QixjQUFBLEtBQWtCLElBQTNDO2lCQUFBLGNBQUEsR0FBaUIsS0FBakI7U0FmRjtPQURhO0lBQUEsQ0FoZWYsQ0FBQTs7QUFBQSxxQ0FrZkEsUUFBQSxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxVQUFVLENBQUMsT0FBWixDQUFBLENBQUEsSUFBeUIsMEJBRGpCO0lBQUEsQ0FsZlYsQ0FBQTs7QUFBQSxxQ0FxZkEsV0FBQSxHQUFhLFNBQUEsR0FBQTthQUNYLFdBRFc7SUFBQSxDQXJmYixDQUFBOztBQUFBLHFDQXdmQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1IsYUFBTyxJQUFJLENBQUMsUUFBTCxDQUFjLElBQUMsQ0FBQSxLQUFmLENBQVAsQ0FEUTtJQUFBLENBeGZWLENBQUE7O0FBQUEscUNBMmZBLFlBQUEsR0FBYyxTQUFBLEdBQUE7QUFDWixhQUFPLElBQUMsQ0FBQSxLQUFSLENBRFk7SUFBQSxDQTNmZCxDQUFBOztBQUFBLHFDQThmQSxJQUFBLEdBQU0sU0FBQyxLQUFELEVBQVEsSUFBUixHQUFBO2FBQ0osSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsS0FBZCxFQUFxQixJQUFyQixFQURJO0lBQUEsQ0E5Zk4sQ0FBQTs7QUFBQSxxQ0FpZ0JBLGdCQUFBLEdBQWtCLFNBQUMsUUFBRCxHQUFBO2FBQ2hCLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLGtCQUFaLEVBQWdDLFFBQWhDLEVBRGdCO0lBQUEsQ0FqZ0JsQixDQUFBOztBQUFBLHFDQW9nQkEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLGFBQU8sSUFBQyxDQUFBLGdCQUFELENBQUEsQ0FBUCxDQURPO0lBQUEsQ0FwZ0JULENBQUE7O0FBQUEscUNBdWdCQSxnQkFBQSxHQUFrQixTQUFBLEdBQUE7QUFDaEIsYUFBTyxJQUFDLENBQUEsS0FBRCxJQUFVLElBQUMsQ0FBQSxPQUFsQixDQURnQjtJQUFBLENBdmdCbEIsQ0FBQTs7QUFBQSxxQ0EwZ0JBLFdBQUEsR0FBYSxTQUFBLEdBQUE7QUFDWCxhQUFPLElBQUMsQ0FBQSxRQUFSLENBRFc7SUFBQSxDQTFnQmIsQ0FBQTs7QUFBQSxxQ0E2Z0JBLFdBQUEsR0FBYSxTQUFBLEdBQUE7QUFDWCxhQUFPLElBQUMsQ0FBQSxTQUFSLENBRFc7SUFBQSxDQTdnQmIsQ0FBQTs7a0NBQUE7O0tBRG1DLEtBZHJDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/kyan/.atom/packages/platformio-ide-terminal/lib/view.coffee
