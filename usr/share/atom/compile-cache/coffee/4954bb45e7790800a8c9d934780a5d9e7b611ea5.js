(function() {
  var $, CompositeDisposable, PlatformIOTerminalView, StatusBar, StatusIcon, View, os, path, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  PlatformIOTerminalView = require('./view');

  StatusIcon = require('./status-icon');

  os = require('os');

  path = require('path');

  module.exports = StatusBar = (function(_super) {
    __extends(StatusBar, _super);

    function StatusBar() {
      this.moveTerminalView = __bind(this.moveTerminalView, this);
      this.onDropTabBar = __bind(this.onDropTabBar, this);
      this.onDrop = __bind(this.onDrop, this);
      this.onDragOver = __bind(this.onDragOver, this);
      this.onDragEnd = __bind(this.onDragEnd, this);
      this.onDragLeave = __bind(this.onDragLeave, this);
      this.onDragStart = __bind(this.onDragStart, this);
      this.closeAll = __bind(this.closeAll, this);
      return StatusBar.__super__.constructor.apply(this, arguments);
    }

    StatusBar.prototype.terminalViews = [];

    StatusBar.prototype.activeTerminal = null;

    StatusBar.prototype.returnFocus = null;

    StatusBar.content = function() {
      return this.div({
        "class": 'platformio-ide-terminal status-bar',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.i({
            "class": "icon icon-plus",
            click: 'newTerminalView',
            outlet: 'plusBtn'
          });
          _this.ul({
            "class": "list-inline status-container",
            tabindex: '-1',
            outlet: 'statusContainer',
            is: 'space-pen-ul'
          });
          return _this.i({
            "class": "icon icon-x",
            click: 'closeAll',
            outlet: 'closeBtn'
          });
        };
      })(this));
    };

    StatusBar.prototype.initialize = function(statusBarProvider) {
      var handleBlur, handleFocus;
      this.statusBarProvider = statusBarProvider;
      this.subscriptions = new CompositeDisposable();
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'platformio-ide-terminal:new': (function(_this) {
          return function() {
            return _this.newTerminalView();
          };
        })(this),
        'platformio-ide-terminal:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'platformio-ide-terminal:next': (function(_this) {
          return function() {
            if (!_this.activeTerminal) {
              return;
            }
            if (_this.activeTerminal.isAnimating()) {
              return;
            }
            if (_this.activeNextTerminalView()) {
              return _this.activeTerminal.open();
            }
          };
        })(this),
        'platformio-ide-terminal:prev': (function(_this) {
          return function() {
            if (!_this.activeTerminal) {
              return;
            }
            if (_this.activeTerminal.isAnimating()) {
              return;
            }
            if (_this.activePrevTerminalView()) {
              return _this.activeTerminal.open();
            }
          };
        })(this),
        'platformio-ide-terminal:close': (function(_this) {
          return function() {
            return _this.destroyActiveTerm();
          };
        })(this),
        'platformio-ide-terminal:close-all': (function(_this) {
          return function() {
            return _this.closeAll();
          };
        })(this),
        'platformio-ide-terminal:rename': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.rename();
            });
          };
        })(this),
        'platformio-ide-terminal:insert-selected-text': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.insertSelection();
            });
          };
        })(this),
        'platformio-ide-terminal:insert-text': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.inputDialog();
            });
          };
        })(this),
        'platformio-ide-terminal:insert-custom-text-1': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.insertCustom(atom.config.get('platformio-ide-terminal.customTexts.customText1'));
            });
          };
        })(this),
        'platformio-ide-terminal:insert-custom-text-2': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.insertCustom(atom.config.get('platformio-ide-terminal.customTexts.customText2'));
            });
          };
        })(this),
        'platformio-ide-terminal:insert-custom-text-3': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.insertCustom(atom.config.get('platformio-ide-terminal.customTexts.customText3'));
            });
          };
        })(this),
        'platformio-ide-terminal:insert-custom-text-4': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.insertCustom(atom.config.get('platformio-ide-terminal.customTexts.customText4'));
            });
          };
        })(this),
        'platformio-ide-terminal:insert-custom-text-5': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.insertCustom(atom.config.get('platformio-ide-terminal.customTexts.customText5'));
            });
          };
        })(this),
        'platformio-ide-terminal:insert-custom-text-6': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.insertCustom(atom.config.get('platformio-ide-terminal.customTexts.customText6'));
            });
          };
        })(this),
        'platformio-ide-terminal:insert-custom-text-7': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.insertCustom(atom.config.get('platformio-ide-terminal.customTexts.customText7'));
            });
          };
        })(this),
        'platformio-ide-terminal:insert-custom-text-8': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.insertCustom(atom.config.get('platformio-ide-terminal.customTexts.customText8'));
            });
          };
        })(this),
        'platformio-ide-terminal:fullscreen': (function(_this) {
          return function() {
            return _this.activeTerminal.maximize();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('.xterm', {
        'platformio-ide-terminal:paste': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.paste();
            });
          };
        })(this),
        'platformio-ide-terminal:copy': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.copy();
            });
          };
        })(this)
      }));
      this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(item) {
          var mapping, nextTerminal, prevTerminal;
          if (item == null) {
            return;
          }
          if (item.constructor.name === "PlatformIOTerminalView") {
            return setTimeout(item.focus, 100);
          } else if (item.constructor.name === "TextEditor") {
            mapping = atom.config.get('platformio-ide-terminal.core.mapTerminalsTo');
            if (mapping === 'None') {
              return;
            }
            switch (mapping) {
              case 'File':
                nextTerminal = _this.getTerminalById(item.getPath(), function(view) {
                  return view.getId().filePath;
                });
                break;
              case 'Folder':
                nextTerminal = _this.getTerminalById(path.dirname(item.getPath()), function(view) {
                  return view.getId().folderPath;
                });
            }
            prevTerminal = _this.getActiveTerminalView();
            if (prevTerminal !== nextTerminal) {
              if (nextTerminal == null) {
                if (item.getTitle() !== 'untitled') {
                  if (atom.config.get('platformio-ide-terminal.core.mapTerminalsToAutoOpen')) {
                    return nextTerminal = _this.createTerminalView();
                  }
                }
              } else {
                _this.setActiveTerminalView(nextTerminal);
                if (prevTerminal != null ? prevTerminal.panel.isVisible() : void 0) {
                  return nextTerminal.toggle();
                }
              }
            }
          }
        };
      })(this)));
      this.registerContextMenu();
      this.subscriptions.add(atom.tooltips.add(this.plusBtn, {
        title: 'New Terminal'
      }));
      this.subscriptions.add(atom.tooltips.add(this.closeBtn, {
        title: 'Close All'
      }));
      this.statusContainer.on('dblclick', (function(_this) {
        return function(event) {
          if (event.target === event.delegateTarget) {
            return _this.newTerminalView();
          }
        };
      })(this));
      this.statusContainer.on('dragstart', '.pio-terminal-status-icon', this.onDragStart);
      this.statusContainer.on('dragend', '.pio-terminal-status-icon', this.onDragEnd);
      this.statusContainer.on('dragleave', this.onDragLeave);
      this.statusContainer.on('dragover', this.onDragOver);
      this.statusContainer.on('drop', this.onDrop);
      handleBlur = (function(_this) {
        return function() {
          var terminal;
          if (terminal = PlatformIOTerminalView.getFocusedTerminal()) {
            _this.returnFocus = _this.terminalViewForTerminal(terminal);
            return terminal.blur();
          }
        };
      })(this);
      handleFocus = (function(_this) {
        return function() {
          if (_this.returnFocus) {
            return setTimeout(function() {
              _this.returnFocus.focus();
              return _this.returnFocus = null;
            }, 100);
          }
        };
      })(this);
      window.addEventListener('blur', handleBlur);
      this.subscriptions.add({
        dispose: function() {
          return window.removeEventListener('blur', handleBlur);
        }
      });
      window.addEventListener('focus', handleFocus);
      this.subscriptions.add({
        dispose: function() {
          return window.removeEventListener('focus', handleFocus);
        }
      });
      return this.attach();
    };

    StatusBar.prototype.registerContextMenu = function() {
      return this.subscriptions.add(atom.commands.add('.platformio-ide-terminal.status-bar', {
        'platformio-ide-terminal:status-red': this.setStatusColor,
        'platformio-ide-terminal:status-orange': this.setStatusColor,
        'platformio-ide-terminal:status-yellow': this.setStatusColor,
        'platformio-ide-terminal:status-green': this.setStatusColor,
        'platformio-ide-terminal:status-blue': this.setStatusColor,
        'platformio-ide-terminal:status-purple': this.setStatusColor,
        'platformio-ide-terminal:status-pink': this.setStatusColor,
        'platformio-ide-terminal:status-cyan': this.setStatusColor,
        'platformio-ide-terminal:status-magenta': this.setStatusColor,
        'platformio-ide-terminal:status-default': this.clearStatusColor,
        'platformio-ide-terminal:context-close': function(event) {
          return $(event.target).closest('.pio-terminal-status-icon')[0].terminalView.destroy();
        },
        'platformio-ide-terminal:context-hide': function(event) {
          var statusIcon;
          statusIcon = $(event.target).closest('.pio-terminal-status-icon')[0];
          if (statusIcon.isActive()) {
            return statusIcon.terminalView.hide();
          }
        },
        'platformio-ide-terminal:context-rename': function(event) {
          return $(event.target).closest('.pio-terminal-status-icon')[0].rename();
        }
      }));
    };

    StatusBar.prototype.registerPaneSubscription = function() {
      return this.subscriptions.add(this.paneSubscription = atom.workspace.observePanes((function(_this) {
        return function(pane) {
          var paneElement, tabBar;
          paneElement = $(atom.views.getView(pane));
          tabBar = paneElement.find('ul');
          tabBar.on('drop', function(event) {
            return _this.onDropTabBar(event, pane);
          });
          tabBar.on('dragstart', function(event) {
            var _ref1;
            if (((_ref1 = event.target.item) != null ? _ref1.constructor.name : void 0) !== 'PlatformIOTerminalView') {
              return;
            }
            return event.originalEvent.dataTransfer.setData('platformio-ide-terminal-tab', 'true');
          });
          return pane.onDidDestroy(function() {
            return tabBar.off('drop', this.onDropTabBar);
          });
        };
      })(this)));
    };

    StatusBar.prototype.createTerminalView = function(autoRun) {
      var args, directory, editorFolder, editorPath, home, id, platformIOTerminalView, projectFolder, pwd, shell, shellArguments, statusIcon, _i, _len, _ref1, _ref2;
      if (this.paneSubscription == null) {
        this.registerPaneSubscription();
      }
      projectFolder = atom.project.getPaths()[0];
      editorPath = (_ref1 = atom.workspace.getActiveTextEditor()) != null ? _ref1.getPath() : void 0;
      if (editorPath != null) {
        editorFolder = path.dirname(editorPath);
        _ref2 = atom.project.getPaths();
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          directory = _ref2[_i];
          if (editorPath.indexOf(directory) >= 0) {
            projectFolder = directory;
          }
        }
      }
      if ((projectFolder != null ? projectFolder.indexOf('atom://') : void 0) >= 0) {
        projectFolder = void 0;
      }
      home = process.platform === 'win32' ? process.env.HOMEPATH : process.env.HOME;
      switch (atom.config.get('platformio-ide-terminal.core.workingDirectory')) {
        case 'Project':
          pwd = projectFolder || editorFolder || home;
          break;
        case 'Active File':
          pwd = editorFolder || projectFolder || home;
          break;
        default:
          pwd = home;
      }
      id = editorPath || projectFolder || home;
      id = {
        filePath: id,
        folderPath: path.dirname(id)
      };
      shell = atom.config.get('platformio-ide-terminal.core.shell');
      shellArguments = atom.config.get('platformio-ide-terminal.core.shellArguments');
      args = shellArguments.split(/\s+/g).filter(function(arg) {
        return arg;
      });
      statusIcon = new StatusIcon();
      platformIOTerminalView = new PlatformIOTerminalView(id, pwd, statusIcon, this, shell, args, autoRun);
      statusIcon.initialize(platformIOTerminalView);
      platformIOTerminalView.attach();
      this.terminalViews.push(platformIOTerminalView);
      this.statusContainer.append(statusIcon);
      return platformIOTerminalView;
    };

    StatusBar.prototype.activeNextTerminalView = function() {
      var index;
      index = this.indexOf(this.activeTerminal);
      if (index < 0) {
        return false;
      }
      return this.activeTerminalView(index + 1);
    };

    StatusBar.prototype.activePrevTerminalView = function() {
      var index;
      index = this.indexOf(this.activeTerminal);
      if (index < 0) {
        return false;
      }
      return this.activeTerminalView(index - 1);
    };

    StatusBar.prototype.indexOf = function(view) {
      return this.terminalViews.indexOf(view);
    };

    StatusBar.prototype.activeTerminalView = function(index) {
      if (this.terminalViews.length < 2) {
        return false;
      }
      if (index >= this.terminalViews.length) {
        index = 0;
      }
      if (index < 0) {
        index = this.terminalViews.length - 1;
      }
      this.activeTerminal = this.terminalViews[index];
      return true;
    };

    StatusBar.prototype.getActiveTerminalView = function() {
      return this.activeTerminal;
    };

    StatusBar.prototype.getTerminalById = function(target, selector) {
      var index, terminal, _i, _ref1;
      if (selector == null) {
        selector = function(terminal) {
          return terminal.id;
        };
      }
      for (index = _i = 0, _ref1 = this.terminalViews.length; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; index = 0 <= _ref1 ? ++_i : --_i) {
        terminal = this.terminalViews[index];
        if (terminal != null) {
          if (selector(terminal) === target) {
            return terminal;
          }
        }
      }
      return null;
    };

    StatusBar.prototype.terminalViewForTerminal = function(terminal) {
      var index, terminalView, _i, _ref1;
      for (index = _i = 0, _ref1 = this.terminalViews.length; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; index = 0 <= _ref1 ? ++_i : --_i) {
        terminalView = this.terminalViews[index];
        if (terminalView != null) {
          if (terminalView.getTerminal() === terminal) {
            return terminalView;
          }
        }
      }
      return null;
    };

    StatusBar.prototype.runInActiveView = function(callback) {
      var view;
      view = this.getActiveTerminalView();
      if (view != null) {
        return callback(view);
      }
      return null;
    };

    StatusBar.prototype.runCommandInNewTerminal = function(commands) {
      this.activeTerminal = this.createTerminalView(commands);
      return this.activeTerminal.toggle();
    };

    StatusBar.prototype.runInOpenView = function(callback) {
      var view;
      view = this.getActiveTerminalView();
      if ((view != null) && view.panel.isVisible()) {
        return callback(view);
      }
      return null;
    };

    StatusBar.prototype.setActiveTerminalView = function(view) {
      return this.activeTerminal = view;
    };

    StatusBar.prototype.removeTerminalView = function(view) {
      var index;
      index = this.indexOf(view);
      if (index < 0) {
        return;
      }
      this.terminalViews.splice(index, 1);
      return this.activateAdjacentTerminal(index);
    };

    StatusBar.prototype.activateAdjacentTerminal = function(index) {
      if (index == null) {
        index = 0;
      }
      if (!(this.terminalViews.length > 0)) {
        return false;
      }
      index = Math.max(0, index - 1);
      this.activeTerminal = this.terminalViews[index];
      return true;
    };

    StatusBar.prototype.newTerminalView = function() {
      var _ref1;
      if ((_ref1 = this.activeTerminal) != null ? _ref1.animating : void 0) {
        return;
      }
      this.activeTerminal = this.createTerminalView();
      return this.activeTerminal.toggle();
    };

    StatusBar.prototype.attach = function() {
      return this.statusBarProvider.addLeftTile({
        item: this,
        priority: -93
      });
    };

    StatusBar.prototype.destroyActiveTerm = function() {
      var index;
      if (this.activeTerminal == null) {
        return;
      }
      index = this.indexOf(this.activeTerminal);
      this.activeTerminal.destroy();
      this.activeTerminal = null;
      return this.activateAdjacentTerminal(index);
    };

    StatusBar.prototype.closeAll = function() {
      var index, view, _i, _ref1;
      for (index = _i = _ref1 = this.terminalViews.length; _ref1 <= 0 ? _i <= 0 : _i >= 0; index = _ref1 <= 0 ? ++_i : --_i) {
        view = this.terminalViews[index];
        if (view != null) {
          view.destroy();
        }
      }
      return this.activeTerminal = null;
    };

    StatusBar.prototype.destroy = function() {
      var view, _i, _len, _ref1;
      this.subscriptions.dispose();
      _ref1 = this.terminalViews;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        view = _ref1[_i];
        view.ptyProcess.terminate();
        view.terminal.destroy();
      }
      return this.detach();
    };

    StatusBar.prototype.toggle = function() {
      if (this.terminalViews.length === 0) {
        this.activeTerminal = this.createTerminalView();
      } else if (this.activeTerminal === null) {
        this.activeTerminal = this.terminalViews[0];
      }
      return this.activeTerminal.toggle();
    };

    StatusBar.prototype.setStatusColor = function(event) {
      var color;
      color = event.type.match(/\w+$/)[0];
      color = atom.config.get("platformio-ide-terminal.iconColors." + color).toRGBAString();
      return $(event.target).closest('.pio-terminal-status-icon').css('color', color);
    };

    StatusBar.prototype.clearStatusColor = function(event) {
      return $(event.target).closest('.pio-terminal-status-icon').css('color', '');
    };

    StatusBar.prototype.onDragStart = function(event) {
      var element;
      event.originalEvent.dataTransfer.setData('platformio-ide-terminal-panel', 'true');
      element = $(event.target).closest('.pio-terminal-status-icon');
      element.addClass('is-dragging');
      return event.originalEvent.dataTransfer.setData('from-index', element.index());
    };

    StatusBar.prototype.onDragLeave = function(event) {
      return this.removePlaceholder();
    };

    StatusBar.prototype.onDragEnd = function(event) {
      return this.clearDropTarget();
    };

    StatusBar.prototype.onDragOver = function(event) {
      var element, newDropTargetIndex, statusIcons;
      event.preventDefault();
      event.stopPropagation();
      if (event.originalEvent.dataTransfer.getData('platformio-ide-terminal') !== 'true') {
        return;
      }
      newDropTargetIndex = this.getDropTargetIndex(event);
      if (newDropTargetIndex == null) {
        return;
      }
      this.removeDropTargetClasses();
      statusIcons = this.statusContainer.children('.pio-terminal-status-icon');
      if (newDropTargetIndex < statusIcons.length) {
        element = statusIcons.eq(newDropTargetIndex).addClass('is-drop-target');
        return this.getPlaceholder().insertBefore(element);
      } else {
        element = statusIcons.eq(newDropTargetIndex - 1).addClass('drop-target-is-after');
        return this.getPlaceholder().insertAfter(element);
      }
    };

    StatusBar.prototype.onDrop = function(event) {
      var dataTransfer, fromIndex, pane, paneIndex, panelEvent, tabEvent, toIndex, view;
      dataTransfer = event.originalEvent.dataTransfer;
      panelEvent = dataTransfer.getData('platformio-ide-terminal-panel') === 'true';
      tabEvent = dataTransfer.getData('platformio-ide-terminal-tab') === 'true';
      if (!(panelEvent || tabEvent)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      toIndex = this.getDropTargetIndex(event);
      this.clearDropTarget();
      if (tabEvent) {
        fromIndex = parseInt(dataTransfer.getData('sortable-index'));
        paneIndex = parseInt(dataTransfer.getData('from-pane-index'));
        pane = atom.workspace.getPanes()[paneIndex];
        view = pane.itemAtIndex(fromIndex);
        pane.removeItem(view, false);
        view.show();
        view.toggleTabView();
        this.terminalViews.push(view);
        if (view.statusIcon.isActive()) {
          view.open();
        }
        this.statusContainer.append(view.statusIcon);
        fromIndex = this.terminalViews.length - 1;
      } else {
        fromIndex = parseInt(dataTransfer.getData('from-index'));
      }
      return this.updateOrder(fromIndex, toIndex);
    };

    StatusBar.prototype.onDropTabBar = function(event, pane) {
      var dataTransfer, fromIndex, tabBar, view;
      dataTransfer = event.originalEvent.dataTransfer;
      if (dataTransfer.getData('platformio-ide-terminal-panel') !== 'true') {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      this.clearDropTarget();
      fromIndex = parseInt(dataTransfer.getData('from-index'));
      view = this.terminalViews[fromIndex];
      view.css("height", "");
      view.terminal.element.style.height = "";
      tabBar = $(event.target).closest('.tab-bar');
      view.toggleTabView();
      this.removeTerminalView(view);
      this.statusContainer.children().eq(fromIndex).detach();
      view.statusIcon.removeTooltip();
      pane.addItem(view, pane.getItems().length);
      pane.activateItem(view);
      return view.focus();
    };

    StatusBar.prototype.clearDropTarget = function() {
      var element;
      element = this.find('.is-dragging');
      element.removeClass('is-dragging');
      this.removeDropTargetClasses();
      return this.removePlaceholder();
    };

    StatusBar.prototype.removeDropTargetClasses = function() {
      this.statusContainer.find('.is-drop-target').removeClass('is-drop-target');
      return this.statusContainer.find('.drop-target-is-after').removeClass('drop-target-is-after');
    };

    StatusBar.prototype.getDropTargetIndex = function(event) {
      var element, elementCenter, statusIcons, target;
      target = $(event.target);
      if (this.isPlaceholder(target)) {
        return;
      }
      statusIcons = this.statusContainer.children('.pio-terminal-status-icon');
      element = target.closest('.pio-terminal-status-icon');
      if (element.length === 0) {
        element = statusIcons.last();
      }
      if (!element.length) {
        return 0;
      }
      elementCenter = element.offset().left + element.width() / 2;
      if (event.originalEvent.pageX < elementCenter) {
        return statusIcons.index(element);
      } else if (element.next('.pio-terminal-status-icon').length > 0) {
        return statusIcons.index(element.next('.pio-terminal-status-icon'));
      } else {
        return statusIcons.index(element) + 1;
      }
    };

    StatusBar.prototype.getPlaceholder = function() {
      return this.placeholderEl != null ? this.placeholderEl : this.placeholderEl = $('<li class="placeholder"></li>');
    };

    StatusBar.prototype.removePlaceholder = function() {
      var _ref1;
      if ((_ref1 = this.placeholderEl) != null) {
        _ref1.remove();
      }
      return this.placeholderEl = null;
    };

    StatusBar.prototype.isPlaceholder = function(element) {
      return element.is('.placeholder');
    };

    StatusBar.prototype.iconAtIndex = function(index) {
      return this.getStatusIcons().eq(index);
    };

    StatusBar.prototype.getStatusIcons = function() {
      return this.statusContainer.children('.pio-terminal-status-icon');
    };

    StatusBar.prototype.moveIconToIndex = function(icon, toIndex) {
      var container, followingIcon;
      followingIcon = this.getStatusIcons()[toIndex];
      container = this.statusContainer[0];
      if (followingIcon != null) {
        return container.insertBefore(icon, followingIcon);
      } else {
        return container.appendChild(icon);
      }
    };

    StatusBar.prototype.moveTerminalView = function(fromIndex, toIndex) {
      var activeTerminal, view;
      activeTerminal = this.getActiveTerminalView();
      view = this.terminalViews.splice(fromIndex, 1)[0];
      this.terminalViews.splice(toIndex, 0, view);
      return this.setActiveTerminalView(activeTerminal);
    };

    StatusBar.prototype.updateOrder = function(fromIndex, toIndex) {
      var icon;
      if (fromIndex === toIndex) {
        return;
      }
      if (fromIndex < toIndex) {
        toIndex--;
      }
      icon = this.getStatusIcons().eq(fromIndex).detach();
      this.moveIconToIndex(icon.get(0), toIndex);
      this.moveTerminalView(fromIndex, toIndex);
      icon.addClass('inserted');
      return icon.one('webkitAnimationEnd', function() {
        return icon.removeClass('inserted');
      });
    };

    return StatusBar;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9wbGF0Zm9ybWlvLWlkZS10ZXJtaW5hbC9saWIvc3RhdHVzLWJhci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMkZBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQVksT0FBQSxDQUFRLHNCQUFSLENBQVosRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBREosQ0FBQTs7QUFBQSxFQUdBLHNCQUFBLEdBQXlCLE9BQUEsQ0FBUSxRQUFSLENBSHpCLENBQUE7O0FBQUEsRUFJQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FKYixDQUFBOztBQUFBLEVBTUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBTkwsQ0FBQTs7QUFBQSxFQU9BLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQVBQLENBQUE7O0FBQUEsRUFTQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osZ0NBQUEsQ0FBQTs7Ozs7Ozs7Ozs7O0tBQUE7O0FBQUEsd0JBQUEsYUFBQSxHQUFlLEVBQWYsQ0FBQTs7QUFBQSx3QkFDQSxjQUFBLEdBQWdCLElBRGhCLENBQUE7O0FBQUEsd0JBRUEsV0FBQSxHQUFhLElBRmIsQ0FBQTs7QUFBQSxJQUlBLFNBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLG9DQUFQO0FBQUEsUUFBNkMsUUFBQSxFQUFVLENBQUEsQ0FBdkQ7T0FBTCxFQUFnRSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQzlELFVBQUEsS0FBQyxDQUFBLENBQUQsQ0FBRztBQUFBLFlBQUEsT0FBQSxFQUFPLGdCQUFQO0FBQUEsWUFBeUIsS0FBQSxFQUFPLGlCQUFoQztBQUFBLFlBQW1ELE1BQUEsRUFBUSxTQUEzRDtXQUFILENBQUEsQ0FBQTtBQUFBLFVBQ0EsS0FBQyxDQUFBLEVBQUQsQ0FBSTtBQUFBLFlBQUEsT0FBQSxFQUFPLDhCQUFQO0FBQUEsWUFBdUMsUUFBQSxFQUFVLElBQWpEO0FBQUEsWUFBdUQsTUFBQSxFQUFRLGlCQUEvRDtBQUFBLFlBQWtGLEVBQUEsRUFBSSxjQUF0RjtXQUFKLENBREEsQ0FBQTtpQkFFQSxLQUFDLENBQUEsQ0FBRCxDQUFHO0FBQUEsWUFBQSxPQUFBLEVBQU8sYUFBUDtBQUFBLFlBQXNCLEtBQUEsRUFBTyxVQUE3QjtBQUFBLFlBQXlDLE1BQUEsRUFBUSxVQUFqRDtXQUFILEVBSDhEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEUsRUFEUTtJQUFBLENBSlYsQ0FBQTs7QUFBQSx3QkFVQSxVQUFBLEdBQVksU0FBRSxpQkFBRixHQUFBO0FBQ1YsVUFBQSx1QkFBQTtBQUFBLE1BRFcsSUFBQyxDQUFBLG9CQUFBLGlCQUNaLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxhQUFELEdBQXFCLElBQUEsbUJBQUEsQ0FBQSxDQUFyQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNqQjtBQUFBLFFBQUEsNkJBQUEsRUFBK0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLGVBQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBL0I7QUFBQSxRQUNBLGdDQUFBLEVBQWtDLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxNQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRGxDO0FBQUEsUUFFQSw4QkFBQSxFQUFnQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUM5QixZQUFBLElBQUEsQ0FBQSxLQUFlLENBQUEsY0FBZjtBQUFBLG9CQUFBLENBQUE7YUFBQTtBQUNBLFlBQUEsSUFBVSxLQUFDLENBQUEsY0FBYyxDQUFDLFdBQWhCLENBQUEsQ0FBVjtBQUFBLG9CQUFBLENBQUE7YUFEQTtBQUVBLFlBQUEsSUFBMEIsS0FBQyxDQUFBLHNCQUFELENBQUEsQ0FBMUI7cUJBQUEsS0FBQyxDQUFBLGNBQWMsQ0FBQyxJQUFoQixDQUFBLEVBQUE7YUFIOEI7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUZoQztBQUFBLFFBTUEsOEJBQUEsRUFBZ0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFDOUIsWUFBQSxJQUFBLENBQUEsS0FBZSxDQUFBLGNBQWY7QUFBQSxvQkFBQSxDQUFBO2FBQUE7QUFDQSxZQUFBLElBQVUsS0FBQyxDQUFBLGNBQWMsQ0FBQyxXQUFoQixDQUFBLENBQVY7QUFBQSxvQkFBQSxDQUFBO2FBREE7QUFFQSxZQUFBLElBQTBCLEtBQUMsQ0FBQSxzQkFBRCxDQUFBLENBQTFCO3FCQUFBLEtBQUMsQ0FBQSxjQUFjLENBQUMsSUFBaEIsQ0FBQSxFQUFBO2FBSDhCO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FOaEM7QUFBQSxRQVVBLCtCQUFBLEVBQWlDLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxpQkFBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVZqQztBQUFBLFFBV0EsbUNBQUEsRUFBcUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLFFBQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FYckM7QUFBQSxRQVlBLGdDQUFBLEVBQWtDLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxlQUFELENBQWlCLFNBQUMsQ0FBRCxHQUFBO3FCQUFPLENBQUMsQ0FBQyxNQUFGLENBQUEsRUFBUDtZQUFBLENBQWpCLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVpsQztBQUFBLFFBYUEsOENBQUEsRUFBZ0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLGVBQUQsQ0FBaUIsU0FBQyxDQUFELEdBQUE7cUJBQU8sQ0FBQyxDQUFDLGVBQUYsQ0FBQSxFQUFQO1lBQUEsQ0FBakIsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBYmhEO0FBQUEsUUFjQSxxQ0FBQSxFQUF1QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsZUFBRCxDQUFpQixTQUFDLENBQUQsR0FBQTtxQkFBTyxDQUFDLENBQUMsV0FBRixDQUFBLEVBQVA7WUFBQSxDQUFqQixFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FkdkM7QUFBQSxRQWVBLDhDQUFBLEVBQWdELENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxlQUFELENBQWlCLFNBQUMsQ0FBRCxHQUFBO3FCQUFPLENBQUMsQ0FBQyxZQUFGLENBQWUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlEQUFoQixDQUFmLEVBQVA7WUFBQSxDQUFqQixFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FmaEQ7QUFBQSxRQWdCQSw4Q0FBQSxFQUFnRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsZUFBRCxDQUFpQixTQUFDLENBQUQsR0FBQTtxQkFBTyxDQUFDLENBQUMsWUFBRixDQUFlLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixpREFBaEIsQ0FBZixFQUFQO1lBQUEsQ0FBakIsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBaEJoRDtBQUFBLFFBaUJBLDhDQUFBLEVBQWdELENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxlQUFELENBQWlCLFNBQUMsQ0FBRCxHQUFBO3FCQUFPLENBQUMsQ0FBQyxZQUFGLENBQWUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlEQUFoQixDQUFmLEVBQVA7WUFBQSxDQUFqQixFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FqQmhEO0FBQUEsUUFrQkEsOENBQUEsRUFBZ0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLGVBQUQsQ0FBaUIsU0FBQyxDQUFELEdBQUE7cUJBQU8sQ0FBQyxDQUFDLFlBQUYsQ0FBZSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsaURBQWhCLENBQWYsRUFBUDtZQUFBLENBQWpCLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQWxCaEQ7QUFBQSxRQW1CQSw4Q0FBQSxFQUFnRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsZUFBRCxDQUFpQixTQUFDLENBQUQsR0FBQTtxQkFBTyxDQUFDLENBQUMsWUFBRixDQUFlLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixpREFBaEIsQ0FBZixFQUFQO1lBQUEsQ0FBakIsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBbkJoRDtBQUFBLFFBb0JBLDhDQUFBLEVBQWdELENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxlQUFELENBQWlCLFNBQUMsQ0FBRCxHQUFBO3FCQUFPLENBQUMsQ0FBQyxZQUFGLENBQWUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlEQUFoQixDQUFmLEVBQVA7WUFBQSxDQUFqQixFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FwQmhEO0FBQUEsUUFxQkEsOENBQUEsRUFBZ0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLGVBQUQsQ0FBaUIsU0FBQyxDQUFELEdBQUE7cUJBQU8sQ0FBQyxDQUFDLFlBQUYsQ0FBZSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsaURBQWhCLENBQWYsRUFBUDtZQUFBLENBQWpCLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQXJCaEQ7QUFBQSxRQXNCQSw4Q0FBQSxFQUFnRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsZUFBRCxDQUFpQixTQUFDLENBQUQsR0FBQTtxQkFBTyxDQUFDLENBQUMsWUFBRixDQUFlLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixpREFBaEIsQ0FBZixFQUFQO1lBQUEsQ0FBakIsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBdEJoRDtBQUFBLFFBdUJBLG9DQUFBLEVBQXNDLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxjQUFjLENBQUMsUUFBaEIsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0F2QnRDO09BRGlCLENBQW5CLENBRkEsQ0FBQTtBQUFBLE1BNEJBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsUUFBbEIsRUFDakI7QUFBQSxRQUFBLCtCQUFBLEVBQWlDLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxlQUFELENBQWlCLFNBQUMsQ0FBRCxHQUFBO3FCQUFPLENBQUMsQ0FBQyxLQUFGLENBQUEsRUFBUDtZQUFBLENBQWpCLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQztBQUFBLFFBQ0EsOEJBQUEsRUFBZ0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLGVBQUQsQ0FBaUIsU0FBQyxDQUFELEdBQUE7cUJBQU8sQ0FBQyxDQUFDLElBQUYsQ0FBQSxFQUFQO1lBQUEsQ0FBakIsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRGhDO09BRGlCLENBQW5CLENBNUJBLENBQUE7QUFBQSxNQWdDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyx5QkFBZixDQUF5QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEdBQUE7QUFDMUQsY0FBQSxtQ0FBQTtBQUFBLFVBQUEsSUFBYyxZQUFkO0FBQUEsa0JBQUEsQ0FBQTtXQUFBO0FBRUEsVUFBQSxJQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBakIsS0FBeUIsd0JBQTVCO21CQUNFLFVBQUEsQ0FBVyxJQUFJLENBQUMsS0FBaEIsRUFBdUIsR0FBdkIsRUFERjtXQUFBLE1BRUssSUFBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQWpCLEtBQXlCLFlBQTVCO0FBQ0gsWUFBQSxPQUFBLEdBQVUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZDQUFoQixDQUFWLENBQUE7QUFDQSxZQUFBLElBQVUsT0FBQSxLQUFXLE1BQXJCO0FBQUEsb0JBQUEsQ0FBQTthQURBO0FBR0Esb0JBQU8sT0FBUDtBQUFBLG1CQUNPLE1BRFA7QUFFSSxnQkFBQSxZQUFBLEdBQWUsS0FBQyxDQUFBLGVBQUQsQ0FBaUIsSUFBSSxDQUFDLE9BQUwsQ0FBQSxDQUFqQixFQUFpQyxTQUFDLElBQUQsR0FBQTt5QkFBVSxJQUFJLENBQUMsS0FBTCxDQUFBLENBQVksQ0FBQyxTQUF2QjtnQkFBQSxDQUFqQyxDQUFmLENBRko7QUFDTztBQURQLG1CQUdPLFFBSFA7QUFJSSxnQkFBQSxZQUFBLEdBQWUsS0FBQyxDQUFBLGVBQUQsQ0FBaUIsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFJLENBQUMsT0FBTCxDQUFBLENBQWIsQ0FBakIsRUFBK0MsU0FBQyxJQUFELEdBQUE7eUJBQVUsSUFBSSxDQUFDLEtBQUwsQ0FBQSxDQUFZLENBQUMsV0FBdkI7Z0JBQUEsQ0FBL0MsQ0FBZixDQUpKO0FBQUEsYUFIQTtBQUFBLFlBU0EsWUFBQSxHQUFlLEtBQUMsQ0FBQSxxQkFBRCxDQUFBLENBVGYsQ0FBQTtBQVVBLFlBQUEsSUFBRyxZQUFBLEtBQWdCLFlBQW5CO0FBQ0UsY0FBQSxJQUFPLG9CQUFQO0FBQ0UsZ0JBQUEsSUFBRyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQUEsS0FBcUIsVUFBeEI7QUFDRSxrQkFBQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixxREFBaEIsQ0FBSDsyQkFDRSxZQUFBLEdBQWUsS0FBQyxDQUFBLGtCQUFELENBQUEsRUFEakI7bUJBREY7aUJBREY7ZUFBQSxNQUFBO0FBS0UsZ0JBQUEsS0FBQyxDQUFBLHFCQUFELENBQXVCLFlBQXZCLENBQUEsQ0FBQTtBQUNBLGdCQUFBLDJCQUF5QixZQUFZLENBQUUsS0FBSyxDQUFDLFNBQXBCLENBQUEsVUFBekI7eUJBQUEsWUFBWSxDQUFDLE1BQWIsQ0FBQSxFQUFBO2lCQU5GO2VBREY7YUFYRztXQUxxRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpDLENBQW5CLENBaENBLENBQUE7QUFBQSxNQXlEQSxJQUFDLENBQUEsbUJBQUQsQ0FBQSxDQXpEQSxDQUFBO0FBQUEsTUEyREEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFDLENBQUEsT0FBbkIsRUFBNEI7QUFBQSxRQUFBLEtBQUEsRUFBTyxjQUFQO09BQTVCLENBQW5CLENBM0RBLENBQUE7QUFBQSxNQTREQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQUMsQ0FBQSxRQUFuQixFQUE2QjtBQUFBLFFBQUEsS0FBQSxFQUFPLFdBQVA7T0FBN0IsQ0FBbkIsQ0E1REEsQ0FBQTtBQUFBLE1BOERBLElBQUMsQ0FBQSxlQUFlLENBQUMsRUFBakIsQ0FBb0IsVUFBcEIsRUFBZ0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxHQUFBO0FBQzlCLFVBQUEsSUFBMEIsS0FBSyxDQUFDLE1BQU4sS0FBZ0IsS0FBSyxDQUFDLGNBQWhEO21CQUFBLEtBQUMsQ0FBQSxlQUFELENBQUEsRUFBQTtXQUQ4QjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhDLENBOURBLENBQUE7QUFBQSxNQWlFQSxJQUFDLENBQUEsZUFBZSxDQUFDLEVBQWpCLENBQW9CLFdBQXBCLEVBQWlDLDJCQUFqQyxFQUE4RCxJQUFDLENBQUEsV0FBL0QsQ0FqRUEsQ0FBQTtBQUFBLE1Ba0VBLElBQUMsQ0FBQSxlQUFlLENBQUMsRUFBakIsQ0FBb0IsU0FBcEIsRUFBK0IsMkJBQS9CLEVBQTRELElBQUMsQ0FBQSxTQUE3RCxDQWxFQSxDQUFBO0FBQUEsTUFtRUEsSUFBQyxDQUFBLGVBQWUsQ0FBQyxFQUFqQixDQUFvQixXQUFwQixFQUFpQyxJQUFDLENBQUEsV0FBbEMsQ0FuRUEsQ0FBQTtBQUFBLE1Bb0VBLElBQUMsQ0FBQSxlQUFlLENBQUMsRUFBakIsQ0FBb0IsVUFBcEIsRUFBZ0MsSUFBQyxDQUFBLFVBQWpDLENBcEVBLENBQUE7QUFBQSxNQXFFQSxJQUFDLENBQUEsZUFBZSxDQUFDLEVBQWpCLENBQW9CLE1BQXBCLEVBQTRCLElBQUMsQ0FBQSxNQUE3QixDQXJFQSxDQUFBO0FBQUEsTUF1RUEsVUFBQSxHQUFhLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDWCxjQUFBLFFBQUE7QUFBQSxVQUFBLElBQUcsUUFBQSxHQUFXLHNCQUFzQixDQUFDLGtCQUF2QixDQUFBLENBQWQ7QUFDRSxZQUFBLEtBQUMsQ0FBQSxXQUFELEdBQWUsS0FBQyxDQUFBLHVCQUFELENBQXlCLFFBQXpCLENBQWYsQ0FBQTttQkFDQSxRQUFRLENBQUMsSUFBVCxDQUFBLEVBRkY7V0FEVztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBdkViLENBQUE7QUFBQSxNQTRFQSxXQUFBLEdBQWMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNaLFVBQUEsSUFBRyxLQUFDLENBQUEsV0FBSjttQkFDRSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsY0FBQSxLQUFDLENBQUEsV0FBVyxDQUFDLEtBQWIsQ0FBQSxDQUFBLENBQUE7cUJBQ0EsS0FBQyxDQUFBLFdBQUQsR0FBZSxLQUZOO1lBQUEsQ0FBWCxFQUdFLEdBSEYsRUFERjtXQURZO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0E1RWQsQ0FBQTtBQUFBLE1BbUZBLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxVQUFoQyxDQW5GQSxDQUFBO0FBQUEsTUFvRkEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CO0FBQUEsUUFBQSxPQUFBLEVBQVMsU0FBQSxHQUFBO2lCQUMxQixNQUFNLENBQUMsbUJBQVAsQ0FBMkIsTUFBM0IsRUFBbUMsVUFBbkMsRUFEMEI7UUFBQSxDQUFUO09BQW5CLENBcEZBLENBQUE7QUFBQSxNQXVGQSxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUMsV0FBakMsQ0F2RkEsQ0FBQTtBQUFBLE1Bd0ZBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQjtBQUFBLFFBQUEsT0FBQSxFQUFTLFNBQUEsR0FBQTtpQkFDMUIsTUFBTSxDQUFDLG1CQUFQLENBQTJCLE9BQTNCLEVBQW9DLFdBQXBDLEVBRDBCO1FBQUEsQ0FBVDtPQUFuQixDQXhGQSxDQUFBO2FBMkZBLElBQUMsQ0FBQSxNQUFELENBQUEsRUE1RlU7SUFBQSxDQVZaLENBQUE7O0FBQUEsd0JBd0dBLG1CQUFBLEdBQXFCLFNBQUEsR0FBQTthQUNuQixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLHFDQUFsQixFQUNqQjtBQUFBLFFBQUEsb0NBQUEsRUFBc0MsSUFBQyxDQUFBLGNBQXZDO0FBQUEsUUFDQSx1Q0FBQSxFQUF5QyxJQUFDLENBQUEsY0FEMUM7QUFBQSxRQUVBLHVDQUFBLEVBQXlDLElBQUMsQ0FBQSxjQUYxQztBQUFBLFFBR0Esc0NBQUEsRUFBd0MsSUFBQyxDQUFBLGNBSHpDO0FBQUEsUUFJQSxxQ0FBQSxFQUF1QyxJQUFDLENBQUEsY0FKeEM7QUFBQSxRQUtBLHVDQUFBLEVBQXlDLElBQUMsQ0FBQSxjQUwxQztBQUFBLFFBTUEscUNBQUEsRUFBdUMsSUFBQyxDQUFBLGNBTnhDO0FBQUEsUUFPQSxxQ0FBQSxFQUF1QyxJQUFDLENBQUEsY0FQeEM7QUFBQSxRQVFBLHdDQUFBLEVBQTBDLElBQUMsQ0FBQSxjQVIzQztBQUFBLFFBU0Esd0NBQUEsRUFBMEMsSUFBQyxDQUFBLGdCQVQzQztBQUFBLFFBVUEsdUNBQUEsRUFBeUMsU0FBQyxLQUFELEdBQUE7aUJBQ3ZDLENBQUEsQ0FBRSxLQUFLLENBQUMsTUFBUixDQUFlLENBQUMsT0FBaEIsQ0FBd0IsMkJBQXhCLENBQXFELENBQUEsQ0FBQSxDQUFFLENBQUMsWUFBWSxDQUFDLE9BQXJFLENBQUEsRUFEdUM7UUFBQSxDQVZ6QztBQUFBLFFBWUEsc0NBQUEsRUFBd0MsU0FBQyxLQUFELEdBQUE7QUFDdEMsY0FBQSxVQUFBO0FBQUEsVUFBQSxVQUFBLEdBQWEsQ0FBQSxDQUFFLEtBQUssQ0FBQyxNQUFSLENBQWUsQ0FBQyxPQUFoQixDQUF3QiwyQkFBeEIsQ0FBcUQsQ0FBQSxDQUFBLENBQWxFLENBQUE7QUFDQSxVQUFBLElBQWtDLFVBQVUsQ0FBQyxRQUFYLENBQUEsQ0FBbEM7bUJBQUEsVUFBVSxDQUFDLFlBQVksQ0FBQyxJQUF4QixDQUFBLEVBQUE7V0FGc0M7UUFBQSxDQVp4QztBQUFBLFFBZUEsd0NBQUEsRUFBMEMsU0FBQyxLQUFELEdBQUE7aUJBQ3hDLENBQUEsQ0FBRSxLQUFLLENBQUMsTUFBUixDQUFlLENBQUMsT0FBaEIsQ0FBd0IsMkJBQXhCLENBQXFELENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBeEQsQ0FBQSxFQUR3QztRQUFBLENBZjFDO09BRGlCLENBQW5CLEVBRG1CO0lBQUEsQ0F4R3JCLENBQUE7O0FBQUEsd0JBNEhBLHdCQUFBLEdBQTBCLFNBQUEsR0FBQTthQUN4QixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLGdCQUFELEdBQW9CLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBZixDQUE0QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEdBQUE7QUFDakUsY0FBQSxtQkFBQTtBQUFBLFVBQUEsV0FBQSxHQUFjLENBQUEsQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBbkIsQ0FBRixDQUFkLENBQUE7QUFBQSxVQUNBLE1BQUEsR0FBUyxXQUFXLENBQUMsSUFBWixDQUFpQixJQUFqQixDQURULENBQUE7QUFBQSxVQUdBLE1BQU0sQ0FBQyxFQUFQLENBQVUsTUFBVixFQUFrQixTQUFDLEtBQUQsR0FBQTttQkFBVyxLQUFDLENBQUEsWUFBRCxDQUFjLEtBQWQsRUFBcUIsSUFBckIsRUFBWDtVQUFBLENBQWxCLENBSEEsQ0FBQTtBQUFBLFVBSUEsTUFBTSxDQUFDLEVBQVAsQ0FBVSxXQUFWLEVBQXVCLFNBQUMsS0FBRCxHQUFBO0FBQ3JCLGdCQUFBLEtBQUE7QUFBQSxZQUFBLGdEQUErQixDQUFFLFdBQVcsQ0FBQyxjQUEvQixLQUF1Qyx3QkFBckQ7QUFBQSxvQkFBQSxDQUFBO2FBQUE7bUJBQ0EsS0FBSyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsT0FBakMsQ0FBeUMsNkJBQXpDLEVBQXdFLE1BQXhFLEVBRnFCO1VBQUEsQ0FBdkIsQ0FKQSxDQUFBO2lCQU9BLElBQUksQ0FBQyxZQUFMLENBQWtCLFNBQUEsR0FBQTttQkFBRyxNQUFNLENBQUMsR0FBUCxDQUFXLE1BQVgsRUFBbUIsSUFBQyxDQUFBLFlBQXBCLEVBQUg7VUFBQSxDQUFsQixFQVJpRTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTVCLENBQXZDLEVBRHdCO0lBQUEsQ0E1SDFCLENBQUE7O0FBQUEsd0JBdUlBLGtCQUFBLEdBQW9CLFNBQUMsT0FBRCxHQUFBO0FBQ2xCLFVBQUEsMEpBQUE7QUFBQSxNQUFBLElBQW1DLDZCQUFuQztBQUFBLFFBQUEsSUFBQyxDQUFBLHdCQUFELENBQUEsQ0FBQSxDQUFBO09BQUE7QUFBQSxNQUVBLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBRnhDLENBQUE7QUFBQSxNQUdBLFVBQUEsaUVBQWlELENBQUUsT0FBdEMsQ0FBQSxVQUhiLENBQUE7QUFLQSxNQUFBLElBQUcsa0JBQUg7QUFDRSxRQUFBLFlBQUEsR0FBZSxJQUFJLENBQUMsT0FBTCxDQUFhLFVBQWIsQ0FBZixDQUFBO0FBQ0E7QUFBQSxhQUFBLDRDQUFBO2dDQUFBO0FBQ0UsVUFBQSxJQUFHLFVBQVUsQ0FBQyxPQUFYLENBQW1CLFNBQW5CLENBQUEsSUFBaUMsQ0FBcEM7QUFDRSxZQUFBLGFBQUEsR0FBZ0IsU0FBaEIsQ0FERjtXQURGO0FBQUEsU0FGRjtPQUxBO0FBV0EsTUFBQSw2QkFBNkIsYUFBYSxDQUFFLE9BQWYsQ0FBdUIsU0FBdkIsV0FBQSxJQUFxQyxDQUFsRTtBQUFBLFFBQUEsYUFBQSxHQUFnQixNQUFoQixDQUFBO09BWEE7QUFBQSxNQWFBLElBQUEsR0FBVSxPQUFPLENBQUMsUUFBUixLQUFvQixPQUF2QixHQUFvQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQWhELEdBQThELE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFiakYsQ0FBQTtBQWVBLGNBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLCtDQUFoQixDQUFQO0FBQUEsYUFDTyxTQURQO0FBQ3NCLFVBQUEsR0FBQSxHQUFNLGFBQUEsSUFBaUIsWUFBakIsSUFBaUMsSUFBdkMsQ0FEdEI7QUFDTztBQURQLGFBRU8sYUFGUDtBQUUwQixVQUFBLEdBQUEsR0FBTSxZQUFBLElBQWdCLGFBQWhCLElBQWlDLElBQXZDLENBRjFCO0FBRU87QUFGUDtBQUdPLFVBQUEsR0FBQSxHQUFNLElBQU4sQ0FIUDtBQUFBLE9BZkE7QUFBQSxNQW9CQSxFQUFBLEdBQUssVUFBQSxJQUFjLGFBQWQsSUFBK0IsSUFwQnBDLENBQUE7QUFBQSxNQXFCQSxFQUFBLEdBQUs7QUFBQSxRQUFBLFFBQUEsRUFBVSxFQUFWO0FBQUEsUUFBYyxVQUFBLEVBQVksSUFBSSxDQUFDLE9BQUwsQ0FBYSxFQUFiLENBQTFCO09BckJMLENBQUE7QUFBQSxNQXVCQSxLQUFBLEdBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG9DQUFoQixDQXZCUixDQUFBO0FBQUEsTUF3QkEsY0FBQSxHQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNkNBQWhCLENBeEJqQixDQUFBO0FBQUEsTUF5QkEsSUFBQSxHQUFPLGNBQWMsQ0FBQyxLQUFmLENBQXFCLE1BQXJCLENBQTRCLENBQUMsTUFBN0IsQ0FBb0MsU0FBQyxHQUFELEdBQUE7ZUFBUyxJQUFUO01BQUEsQ0FBcEMsQ0F6QlAsQ0FBQTtBQUFBLE1BMkJBLFVBQUEsR0FBaUIsSUFBQSxVQUFBLENBQUEsQ0EzQmpCLENBQUE7QUFBQSxNQTRCQSxzQkFBQSxHQUE2QixJQUFBLHNCQUFBLENBQXVCLEVBQXZCLEVBQTJCLEdBQTNCLEVBQWdDLFVBQWhDLEVBQTRDLElBQTVDLEVBQWtELEtBQWxELEVBQXlELElBQXpELEVBQStELE9BQS9ELENBNUI3QixDQUFBO0FBQUEsTUE2QkEsVUFBVSxDQUFDLFVBQVgsQ0FBc0Isc0JBQXRCLENBN0JBLENBQUE7QUFBQSxNQStCQSxzQkFBc0IsQ0FBQyxNQUF2QixDQUFBLENBL0JBLENBQUE7QUFBQSxNQWlDQSxJQUFDLENBQUEsYUFBYSxDQUFDLElBQWYsQ0FBb0Isc0JBQXBCLENBakNBLENBQUE7QUFBQSxNQWtDQSxJQUFDLENBQUEsZUFBZSxDQUFDLE1BQWpCLENBQXdCLFVBQXhCLENBbENBLENBQUE7QUFtQ0EsYUFBTyxzQkFBUCxDQXBDa0I7SUFBQSxDQXZJcEIsQ0FBQTs7QUFBQSx3QkE2S0Esc0JBQUEsR0FBd0IsU0FBQSxHQUFBO0FBQ3RCLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLElBQUMsQ0FBQSxPQUFELENBQVMsSUFBQyxDQUFBLGNBQVYsQ0FBUixDQUFBO0FBQ0EsTUFBQSxJQUFnQixLQUFBLEdBQVEsQ0FBeEI7QUFBQSxlQUFPLEtBQVAsQ0FBQTtPQURBO2FBRUEsSUFBQyxDQUFBLGtCQUFELENBQW9CLEtBQUEsR0FBUSxDQUE1QixFQUhzQjtJQUFBLENBN0t4QixDQUFBOztBQUFBLHdCQWtMQSxzQkFBQSxHQUF3QixTQUFBLEdBQUE7QUFDdEIsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxJQUFDLENBQUEsY0FBVixDQUFSLENBQUE7QUFDQSxNQUFBLElBQWdCLEtBQUEsR0FBUSxDQUF4QjtBQUFBLGVBQU8sS0FBUCxDQUFBO09BREE7YUFFQSxJQUFDLENBQUEsa0JBQUQsQ0FBb0IsS0FBQSxHQUFRLENBQTVCLEVBSHNCO0lBQUEsQ0FsTHhCLENBQUE7O0FBQUEsd0JBdUxBLE9BQUEsR0FBUyxTQUFDLElBQUQsR0FBQTthQUNQLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUF1QixJQUF2QixFQURPO0lBQUEsQ0F2TFQsQ0FBQTs7QUFBQSx3QkEwTEEsa0JBQUEsR0FBb0IsU0FBQyxLQUFELEdBQUE7QUFDbEIsTUFBQSxJQUFnQixJQUFDLENBQUEsYUFBYSxDQUFDLE1BQWYsR0FBd0IsQ0FBeEM7QUFBQSxlQUFPLEtBQVAsQ0FBQTtPQUFBO0FBRUEsTUFBQSxJQUFHLEtBQUEsSUFBUyxJQUFDLENBQUEsYUFBYSxDQUFDLE1BQTNCO0FBQ0UsUUFBQSxLQUFBLEdBQVEsQ0FBUixDQURGO09BRkE7QUFJQSxNQUFBLElBQUcsS0FBQSxHQUFRLENBQVg7QUFDRSxRQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsYUFBYSxDQUFDLE1BQWYsR0FBd0IsQ0FBaEMsQ0FERjtPQUpBO0FBQUEsTUFPQSxJQUFDLENBQUEsY0FBRCxHQUFrQixJQUFDLENBQUEsYUFBYyxDQUFBLEtBQUEsQ0FQakMsQ0FBQTtBQVFBLGFBQU8sSUFBUCxDQVRrQjtJQUFBLENBMUxwQixDQUFBOztBQUFBLHdCQXFNQSxxQkFBQSxHQUF1QixTQUFBLEdBQUE7QUFDckIsYUFBTyxJQUFDLENBQUEsY0FBUixDQURxQjtJQUFBLENBck12QixDQUFBOztBQUFBLHdCQXdNQSxlQUFBLEdBQWlCLFNBQUMsTUFBRCxFQUFTLFFBQVQsR0FBQTtBQUNmLFVBQUEsMEJBQUE7O1FBQUEsV0FBWSxTQUFDLFFBQUQsR0FBQTtpQkFBYyxRQUFRLENBQUMsR0FBdkI7UUFBQTtPQUFaO0FBRUEsV0FBYSwySEFBYixHQUFBO0FBQ0UsUUFBQSxRQUFBLEdBQVcsSUFBQyxDQUFBLGFBQWMsQ0FBQSxLQUFBLENBQTFCLENBQUE7QUFDQSxRQUFBLElBQUcsZ0JBQUg7QUFDRSxVQUFBLElBQW1CLFFBQUEsQ0FBUyxRQUFULENBQUEsS0FBc0IsTUFBekM7QUFBQSxtQkFBTyxRQUFQLENBQUE7V0FERjtTQUZGO0FBQUEsT0FGQTtBQU9BLGFBQU8sSUFBUCxDQVJlO0lBQUEsQ0F4TWpCLENBQUE7O0FBQUEsd0JBa05BLHVCQUFBLEdBQXlCLFNBQUMsUUFBRCxHQUFBO0FBQ3ZCLFVBQUEsOEJBQUE7QUFBQSxXQUFhLDJIQUFiLEdBQUE7QUFDRSxRQUFBLFlBQUEsR0FBZSxJQUFDLENBQUEsYUFBYyxDQUFBLEtBQUEsQ0FBOUIsQ0FBQTtBQUNBLFFBQUEsSUFBRyxvQkFBSDtBQUNFLFVBQUEsSUFBdUIsWUFBWSxDQUFDLFdBQWIsQ0FBQSxDQUFBLEtBQThCLFFBQXJEO0FBQUEsbUJBQU8sWUFBUCxDQUFBO1dBREY7U0FGRjtBQUFBLE9BQUE7QUFLQSxhQUFPLElBQVAsQ0FOdUI7SUFBQSxDQWxOekIsQ0FBQTs7QUFBQSx3QkEwTkEsZUFBQSxHQUFpQixTQUFDLFFBQUQsR0FBQTtBQUNmLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLElBQUMsQ0FBQSxxQkFBRCxDQUFBLENBQVAsQ0FBQTtBQUNBLE1BQUEsSUFBRyxZQUFIO0FBQ0UsZUFBTyxRQUFBLENBQVMsSUFBVCxDQUFQLENBREY7T0FEQTtBQUdBLGFBQU8sSUFBUCxDQUplO0lBQUEsQ0ExTmpCLENBQUE7O0FBQUEsd0JBZ09BLHVCQUFBLEdBQXlCLFNBQUMsUUFBRCxHQUFBO0FBQ3ZCLE1BQUEsSUFBQyxDQUFBLGNBQUQsR0FBa0IsSUFBQyxDQUFBLGtCQUFELENBQW9CLFFBQXBCLENBQWxCLENBQUE7YUFDQSxJQUFDLENBQUEsY0FBYyxDQUFDLE1BQWhCLENBQUEsRUFGdUI7SUFBQSxDQWhPekIsQ0FBQTs7QUFBQSx3QkFvT0EsYUFBQSxHQUFlLFNBQUMsUUFBRCxHQUFBO0FBQ2IsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sSUFBQyxDQUFBLHFCQUFELENBQUEsQ0FBUCxDQUFBO0FBQ0EsTUFBQSxJQUFHLGNBQUEsSUFBVSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVgsQ0FBQSxDQUFiO0FBQ0UsZUFBTyxRQUFBLENBQVMsSUFBVCxDQUFQLENBREY7T0FEQTtBQUdBLGFBQU8sSUFBUCxDQUphO0lBQUEsQ0FwT2YsQ0FBQTs7QUFBQSx3QkEwT0EscUJBQUEsR0FBdUIsU0FBQyxJQUFELEdBQUE7YUFDckIsSUFBQyxDQUFBLGNBQUQsR0FBa0IsS0FERztJQUFBLENBMU92QixDQUFBOztBQUFBLHdCQTZPQSxrQkFBQSxHQUFvQixTQUFDLElBQUQsR0FBQTtBQUNsQixVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsT0FBRCxDQUFTLElBQVQsQ0FBUixDQUFBO0FBQ0EsTUFBQSxJQUFVLEtBQUEsR0FBUSxDQUFsQjtBQUFBLGNBQUEsQ0FBQTtPQURBO0FBQUEsTUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLE1BQWYsQ0FBc0IsS0FBdEIsRUFBNkIsQ0FBN0IsQ0FGQSxDQUFBO2FBSUEsSUFBQyxDQUFBLHdCQUFELENBQTBCLEtBQTFCLEVBTGtCO0lBQUEsQ0E3T3BCLENBQUE7O0FBQUEsd0JBb1BBLHdCQUFBLEdBQTBCLFNBQUMsS0FBRCxHQUFBOztRQUFDLFFBQU07T0FDL0I7QUFBQSxNQUFBLElBQUEsQ0FBQSxDQUFvQixJQUFDLENBQUEsYUFBYSxDQUFDLE1BQWYsR0FBd0IsQ0FBNUMsQ0FBQTtBQUFBLGVBQU8sS0FBUCxDQUFBO09BQUE7QUFBQSxNQUVBLEtBQUEsR0FBUSxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxLQUFBLEdBQVEsQ0FBcEIsQ0FGUixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsY0FBRCxHQUFrQixJQUFDLENBQUEsYUFBYyxDQUFBLEtBQUEsQ0FIakMsQ0FBQTtBQUtBLGFBQU8sSUFBUCxDQU53QjtJQUFBLENBcFAxQixDQUFBOztBQUFBLHdCQTRQQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTtBQUNmLFVBQUEsS0FBQTtBQUFBLE1BQUEsaURBQXlCLENBQUUsa0JBQTNCO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxjQUFELEdBQWtCLElBQUMsQ0FBQSxrQkFBRCxDQUFBLENBRmxCLENBQUE7YUFHQSxJQUFDLENBQUEsY0FBYyxDQUFDLE1BQWhCLENBQUEsRUFKZTtJQUFBLENBNVBqQixDQUFBOztBQUFBLHdCQWtRQSxNQUFBLEdBQVEsU0FBQSxHQUFBO2FBQ04sSUFBQyxDQUFBLGlCQUFpQixDQUFDLFdBQW5CLENBQStCO0FBQUEsUUFBQSxJQUFBLEVBQU0sSUFBTjtBQUFBLFFBQVksUUFBQSxFQUFVLENBQUEsRUFBdEI7T0FBL0IsRUFETTtJQUFBLENBbFFSLENBQUE7O0FBQUEsd0JBcVFBLGlCQUFBLEdBQW1CLFNBQUEsR0FBQTtBQUNqQixVQUFBLEtBQUE7QUFBQSxNQUFBLElBQWMsMkJBQWQ7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BRUEsS0FBQSxHQUFRLElBQUMsQ0FBQSxPQUFELENBQVMsSUFBQyxDQUFBLGNBQVYsQ0FGUixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsY0FBYyxDQUFDLE9BQWhCLENBQUEsQ0FIQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsY0FBRCxHQUFrQixJQUpsQixDQUFBO2FBTUEsSUFBQyxDQUFBLHdCQUFELENBQTBCLEtBQTFCLEVBUGlCO0lBQUEsQ0FyUW5CLENBQUE7O0FBQUEsd0JBOFFBLFFBQUEsR0FBVSxTQUFBLEdBQUE7QUFDUixVQUFBLHNCQUFBO0FBQUEsV0FBYSxnSEFBYixHQUFBO0FBQ0UsUUFBQSxJQUFBLEdBQU8sSUFBQyxDQUFBLGFBQWMsQ0FBQSxLQUFBLENBQXRCLENBQUE7QUFDQSxRQUFBLElBQUcsWUFBSDtBQUNFLFVBQUEsSUFBSSxDQUFDLE9BQUwsQ0FBQSxDQUFBLENBREY7U0FGRjtBQUFBLE9BQUE7YUFJQSxJQUFDLENBQUEsY0FBRCxHQUFrQixLQUxWO0lBQUEsQ0E5UVYsQ0FBQTs7QUFBQSx3QkFxUkEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLFVBQUEscUJBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBLENBQUEsQ0FBQTtBQUNBO0FBQUEsV0FBQSw0Q0FBQTt5QkFBQTtBQUNFLFFBQUEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFoQixDQUFBLENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFkLENBQUEsQ0FEQSxDQURGO0FBQUEsT0FEQTthQUlBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFMTztJQUFBLENBclJULENBQUE7O0FBQUEsd0JBNFJBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixNQUFBLElBQUcsSUFBQyxDQUFBLGFBQWEsQ0FBQyxNQUFmLEtBQXlCLENBQTVCO0FBQ0UsUUFBQSxJQUFDLENBQUEsY0FBRCxHQUFrQixJQUFDLENBQUEsa0JBQUQsQ0FBQSxDQUFsQixDQURGO09BQUEsTUFFSyxJQUFHLElBQUMsQ0FBQSxjQUFELEtBQW1CLElBQXRCO0FBQ0gsUUFBQSxJQUFDLENBQUEsY0FBRCxHQUFrQixJQUFDLENBQUEsYUFBYyxDQUFBLENBQUEsQ0FBakMsQ0FERztPQUZMO2FBSUEsSUFBQyxDQUFBLGNBQWMsQ0FBQyxNQUFoQixDQUFBLEVBTE07SUFBQSxDQTVSUixDQUFBOztBQUFBLHdCQW1TQSxjQUFBLEdBQWdCLFNBQUMsS0FBRCxHQUFBO0FBQ2QsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFYLENBQWlCLE1BQWpCLENBQXlCLENBQUEsQ0FBQSxDQUFqQyxDQUFBO0FBQUEsTUFDQSxLQUFBLEdBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWlCLHFDQUFBLEdBQXFDLEtBQXRELENBQThELENBQUMsWUFBL0QsQ0FBQSxDQURSLENBQUE7YUFFQSxDQUFBLENBQUUsS0FBSyxDQUFDLE1BQVIsQ0FBZSxDQUFDLE9BQWhCLENBQXdCLDJCQUF4QixDQUFvRCxDQUFDLEdBQXJELENBQXlELE9BQXpELEVBQWtFLEtBQWxFLEVBSGM7SUFBQSxDQW5TaEIsQ0FBQTs7QUFBQSx3QkF3U0EsZ0JBQUEsR0FBa0IsU0FBQyxLQUFELEdBQUE7YUFDaEIsQ0FBQSxDQUFFLEtBQUssQ0FBQyxNQUFSLENBQWUsQ0FBQyxPQUFoQixDQUF3QiwyQkFBeEIsQ0FBb0QsQ0FBQyxHQUFyRCxDQUF5RCxPQUF6RCxFQUFrRSxFQUFsRSxFQURnQjtJQUFBLENBeFNsQixDQUFBOztBQUFBLHdCQTJTQSxXQUFBLEdBQWEsU0FBQyxLQUFELEdBQUE7QUFDWCxVQUFBLE9BQUE7QUFBQSxNQUFBLEtBQUssQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLE9BQWpDLENBQXlDLCtCQUF6QyxFQUEwRSxNQUExRSxDQUFBLENBQUE7QUFBQSxNQUVBLE9BQUEsR0FBVSxDQUFBLENBQUUsS0FBSyxDQUFDLE1BQVIsQ0FBZSxDQUFDLE9BQWhCLENBQXdCLDJCQUF4QixDQUZWLENBQUE7QUFBQSxNQUdBLE9BQU8sQ0FBQyxRQUFSLENBQWlCLGFBQWpCLENBSEEsQ0FBQTthQUlBLEtBQUssQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLE9BQWpDLENBQXlDLFlBQXpDLEVBQXVELE9BQU8sQ0FBQyxLQUFSLENBQUEsQ0FBdkQsRUFMVztJQUFBLENBM1NiLENBQUE7O0FBQUEsd0JBa1RBLFdBQUEsR0FBYSxTQUFDLEtBQUQsR0FBQTthQUNYLElBQUMsQ0FBQSxpQkFBRCxDQUFBLEVBRFc7SUFBQSxDQWxUYixDQUFBOztBQUFBLHdCQXFUQSxTQUFBLEdBQVcsU0FBQyxLQUFELEdBQUE7YUFDVCxJQUFDLENBQUEsZUFBRCxDQUFBLEVBRFM7SUFBQSxDQXJUWCxDQUFBOztBQUFBLHdCQXdUQSxVQUFBLEdBQVksU0FBQyxLQUFELEdBQUE7QUFDVixVQUFBLHdDQUFBO0FBQUEsTUFBQSxLQUFLLENBQUMsY0FBTixDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsS0FBSyxDQUFDLGVBQU4sQ0FBQSxDQURBLENBQUE7QUFFQSxNQUFBLElBQU8sS0FBSyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsT0FBakMsQ0FBeUMseUJBQXpDLENBQUEsS0FBdUUsTUFBOUU7QUFDRSxjQUFBLENBREY7T0FGQTtBQUFBLE1BS0Esa0JBQUEsR0FBcUIsSUFBQyxDQUFBLGtCQUFELENBQW9CLEtBQXBCLENBTHJCLENBQUE7QUFNQSxNQUFBLElBQWMsMEJBQWQ7QUFBQSxjQUFBLENBQUE7T0FOQTtBQUFBLE1BT0EsSUFBQyxDQUFBLHVCQUFELENBQUEsQ0FQQSxDQUFBO0FBQUEsTUFRQSxXQUFBLEdBQWMsSUFBQyxDQUFBLGVBQWUsQ0FBQyxRQUFqQixDQUEwQiwyQkFBMUIsQ0FSZCxDQUFBO0FBVUEsTUFBQSxJQUFHLGtCQUFBLEdBQXFCLFdBQVcsQ0FBQyxNQUFwQztBQUNFLFFBQUEsT0FBQSxHQUFVLFdBQVcsQ0FBQyxFQUFaLENBQWUsa0JBQWYsQ0FBa0MsQ0FBQyxRQUFuQyxDQUE0QyxnQkFBNUMsQ0FBVixDQUFBO2VBQ0EsSUFBQyxDQUFBLGNBQUQsQ0FBQSxDQUFpQixDQUFDLFlBQWxCLENBQStCLE9BQS9CLEVBRkY7T0FBQSxNQUFBO0FBSUUsUUFBQSxPQUFBLEdBQVUsV0FBVyxDQUFDLEVBQVosQ0FBZSxrQkFBQSxHQUFxQixDQUFwQyxDQUFzQyxDQUFDLFFBQXZDLENBQWdELHNCQUFoRCxDQUFWLENBQUE7ZUFDQSxJQUFDLENBQUEsY0FBRCxDQUFBLENBQWlCLENBQUMsV0FBbEIsQ0FBOEIsT0FBOUIsRUFMRjtPQVhVO0lBQUEsQ0F4VFosQ0FBQTs7QUFBQSx3QkEwVUEsTUFBQSxHQUFRLFNBQUMsS0FBRCxHQUFBO0FBQ04sVUFBQSw2RUFBQTtBQUFBLE1BQUMsZUFBZ0IsS0FBSyxDQUFDLGNBQXRCLFlBQUQsQ0FBQTtBQUFBLE1BQ0EsVUFBQSxHQUFhLFlBQVksQ0FBQyxPQUFiLENBQXFCLCtCQUFyQixDQUFBLEtBQXlELE1BRHRFLENBQUE7QUFBQSxNQUVBLFFBQUEsR0FBVyxZQUFZLENBQUMsT0FBYixDQUFxQiw2QkFBckIsQ0FBQSxLQUF1RCxNQUZsRSxDQUFBO0FBR0EsTUFBQSxJQUFBLENBQUEsQ0FBYyxVQUFBLElBQWMsUUFBNUIsQ0FBQTtBQUFBLGNBQUEsQ0FBQTtPQUhBO0FBQUEsTUFLQSxLQUFLLENBQUMsY0FBTixDQUFBLENBTEEsQ0FBQTtBQUFBLE1BTUEsS0FBSyxDQUFDLGVBQU4sQ0FBQSxDQU5BLENBQUE7QUFBQSxNQVFBLE9BQUEsR0FBVSxJQUFDLENBQUEsa0JBQUQsQ0FBb0IsS0FBcEIsQ0FSVixDQUFBO0FBQUEsTUFTQSxJQUFDLENBQUEsZUFBRCxDQUFBLENBVEEsQ0FBQTtBQVdBLE1BQUEsSUFBRyxRQUFIO0FBQ0UsUUFBQSxTQUFBLEdBQVksUUFBQSxDQUFTLFlBQVksQ0FBQyxPQUFiLENBQXFCLGdCQUFyQixDQUFULENBQVosQ0FBQTtBQUFBLFFBQ0EsU0FBQSxHQUFZLFFBQUEsQ0FBUyxZQUFZLENBQUMsT0FBYixDQUFxQixpQkFBckIsQ0FBVCxDQURaLENBQUE7QUFBQSxRQUVBLElBQUEsR0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQWYsQ0FBQSxDQUEwQixDQUFBLFNBQUEsQ0FGakMsQ0FBQTtBQUFBLFFBR0EsSUFBQSxHQUFPLElBQUksQ0FBQyxXQUFMLENBQWlCLFNBQWpCLENBSFAsQ0FBQTtBQUFBLFFBSUEsSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsSUFBaEIsRUFBc0IsS0FBdEIsQ0FKQSxDQUFBO0FBQUEsUUFLQSxJQUFJLENBQUMsSUFBTCxDQUFBLENBTEEsQ0FBQTtBQUFBLFFBT0EsSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQVBBLENBQUE7QUFBQSxRQVFBLElBQUMsQ0FBQSxhQUFhLENBQUMsSUFBZixDQUFvQixJQUFwQixDQVJBLENBQUE7QUFTQSxRQUFBLElBQWUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFoQixDQUFBLENBQWY7QUFBQSxVQUFBLElBQUksQ0FBQyxJQUFMLENBQUEsQ0FBQSxDQUFBO1NBVEE7QUFBQSxRQVVBLElBQUMsQ0FBQSxlQUFlLENBQUMsTUFBakIsQ0FBd0IsSUFBSSxDQUFDLFVBQTdCLENBVkEsQ0FBQTtBQUFBLFFBV0EsU0FBQSxHQUFZLElBQUMsQ0FBQSxhQUFhLENBQUMsTUFBZixHQUF3QixDQVhwQyxDQURGO09BQUEsTUFBQTtBQWNFLFFBQUEsU0FBQSxHQUFZLFFBQUEsQ0FBUyxZQUFZLENBQUMsT0FBYixDQUFxQixZQUFyQixDQUFULENBQVosQ0FkRjtPQVhBO2FBMEJBLElBQUMsQ0FBQSxXQUFELENBQWEsU0FBYixFQUF3QixPQUF4QixFQTNCTTtJQUFBLENBMVVSLENBQUE7O0FBQUEsd0JBdVdBLFlBQUEsR0FBYyxTQUFDLEtBQUQsRUFBUSxJQUFSLEdBQUE7QUFDWixVQUFBLHFDQUFBO0FBQUEsTUFBQyxlQUFnQixLQUFLLENBQUMsY0FBdEIsWUFBRCxDQUFBO0FBQ0EsTUFBQSxJQUFjLFlBQVksQ0FBQyxPQUFiLENBQXFCLCtCQUFyQixDQUFBLEtBQXlELE1BQXZFO0FBQUEsY0FBQSxDQUFBO09BREE7QUFBQSxNQUdBLEtBQUssQ0FBQyxjQUFOLENBQUEsQ0FIQSxDQUFBO0FBQUEsTUFJQSxLQUFLLENBQUMsZUFBTixDQUFBLENBSkEsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLGVBQUQsQ0FBQSxDQUxBLENBQUE7QUFBQSxNQU9BLFNBQUEsR0FBWSxRQUFBLENBQVMsWUFBWSxDQUFDLE9BQWIsQ0FBcUIsWUFBckIsQ0FBVCxDQVBaLENBQUE7QUFBQSxNQVFBLElBQUEsR0FBTyxJQUFDLENBQUEsYUFBYyxDQUFBLFNBQUEsQ0FSdEIsQ0FBQTtBQUFBLE1BU0EsSUFBSSxDQUFDLEdBQUwsQ0FBUyxRQUFULEVBQW1CLEVBQW5CLENBVEEsQ0FBQTtBQUFBLE1BVUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQTVCLEdBQXFDLEVBVnJDLENBQUE7QUFBQSxNQVdBLE1BQUEsR0FBUyxDQUFBLENBQUUsS0FBSyxDQUFDLE1BQVIsQ0FBZSxDQUFDLE9BQWhCLENBQXdCLFVBQXhCLENBWFQsQ0FBQTtBQUFBLE1BYUEsSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQWJBLENBQUE7QUFBQSxNQWNBLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixJQUFwQixDQWRBLENBQUE7QUFBQSxNQWVBLElBQUMsQ0FBQSxlQUFlLENBQUMsUUFBakIsQ0FBQSxDQUEyQixDQUFDLEVBQTVCLENBQStCLFNBQS9CLENBQXlDLENBQUMsTUFBMUMsQ0FBQSxDQWZBLENBQUE7QUFBQSxNQWdCQSxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWhCLENBQUEsQ0FoQkEsQ0FBQTtBQUFBLE1Ba0JBLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBYixFQUFtQixJQUFJLENBQUMsUUFBTCxDQUFBLENBQWUsQ0FBQyxNQUFuQyxDQWxCQSxDQUFBO0FBQUEsTUFtQkEsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsSUFBbEIsQ0FuQkEsQ0FBQTthQXFCQSxJQUFJLENBQUMsS0FBTCxDQUFBLEVBdEJZO0lBQUEsQ0F2V2QsQ0FBQTs7QUFBQSx3QkErWEEsZUFBQSxHQUFpQixTQUFBLEdBQUE7QUFDZixVQUFBLE9BQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxJQUFDLENBQUEsSUFBRCxDQUFNLGNBQU4sQ0FBVixDQUFBO0FBQUEsTUFDQSxPQUFPLENBQUMsV0FBUixDQUFvQixhQUFwQixDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSx1QkFBRCxDQUFBLENBRkEsQ0FBQTthQUdBLElBQUMsQ0FBQSxpQkFBRCxDQUFBLEVBSmU7SUFBQSxDQS9YakIsQ0FBQTs7QUFBQSx3QkFxWUEsdUJBQUEsR0FBeUIsU0FBQSxHQUFBO0FBQ3ZCLE1BQUEsSUFBQyxDQUFBLGVBQWUsQ0FBQyxJQUFqQixDQUFzQixpQkFBdEIsQ0FBd0MsQ0FBQyxXQUF6QyxDQUFxRCxnQkFBckQsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLGVBQWUsQ0FBQyxJQUFqQixDQUFzQix1QkFBdEIsQ0FBOEMsQ0FBQyxXQUEvQyxDQUEyRCxzQkFBM0QsRUFGdUI7SUFBQSxDQXJZekIsQ0FBQTs7QUFBQSx3QkF5WUEsa0JBQUEsR0FBb0IsU0FBQyxLQUFELEdBQUE7QUFDbEIsVUFBQSwyQ0FBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLENBQUEsQ0FBRSxLQUFLLENBQUMsTUFBUixDQUFULENBQUE7QUFDQSxNQUFBLElBQVUsSUFBQyxDQUFBLGFBQUQsQ0FBZSxNQUFmLENBQVY7QUFBQSxjQUFBLENBQUE7T0FEQTtBQUFBLE1BR0EsV0FBQSxHQUFjLElBQUMsQ0FBQSxlQUFlLENBQUMsUUFBakIsQ0FBMEIsMkJBQTFCLENBSGQsQ0FBQTtBQUFBLE1BSUEsT0FBQSxHQUFVLE1BQU0sQ0FBQyxPQUFQLENBQWUsMkJBQWYsQ0FKVixDQUFBO0FBS0EsTUFBQSxJQUFnQyxPQUFPLENBQUMsTUFBUixLQUFrQixDQUFsRDtBQUFBLFFBQUEsT0FBQSxHQUFVLFdBQVcsQ0FBQyxJQUFaLENBQUEsQ0FBVixDQUFBO09BTEE7QUFPQSxNQUFBLElBQUEsQ0FBQSxPQUF1QixDQUFDLE1BQXhCO0FBQUEsZUFBTyxDQUFQLENBQUE7T0FQQTtBQUFBLE1BU0EsYUFBQSxHQUFnQixPQUFPLENBQUMsTUFBUixDQUFBLENBQWdCLENBQUMsSUFBakIsR0FBd0IsT0FBTyxDQUFDLEtBQVIsQ0FBQSxDQUFBLEdBQWtCLENBVDFELENBQUE7QUFXQSxNQUFBLElBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUFwQixHQUE0QixhQUEvQjtlQUNFLFdBQVcsQ0FBQyxLQUFaLENBQWtCLE9BQWxCLEVBREY7T0FBQSxNQUVLLElBQUcsT0FBTyxDQUFDLElBQVIsQ0FBYSwyQkFBYixDQUF5QyxDQUFDLE1BQTFDLEdBQW1ELENBQXREO2VBQ0gsV0FBVyxDQUFDLEtBQVosQ0FBa0IsT0FBTyxDQUFDLElBQVIsQ0FBYSwyQkFBYixDQUFsQixFQURHO09BQUEsTUFBQTtlQUdILFdBQVcsQ0FBQyxLQUFaLENBQWtCLE9BQWxCLENBQUEsR0FBNkIsRUFIMUI7T0FkYTtJQUFBLENBellwQixDQUFBOztBQUFBLHdCQTRaQSxjQUFBLEdBQWdCLFNBQUEsR0FBQTswQ0FDZCxJQUFDLENBQUEsZ0JBQUQsSUFBQyxDQUFBLGdCQUFpQixDQUFBLENBQUUsK0JBQUYsRUFESjtJQUFBLENBNVpoQixDQUFBOztBQUFBLHdCQStaQSxpQkFBQSxHQUFtQixTQUFBLEdBQUE7QUFDakIsVUFBQSxLQUFBOzthQUFjLENBQUUsTUFBaEIsQ0FBQTtPQUFBO2FBQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsS0FGQTtJQUFBLENBL1puQixDQUFBOztBQUFBLHdCQW1hQSxhQUFBLEdBQWUsU0FBQyxPQUFELEdBQUE7YUFDYixPQUFPLENBQUMsRUFBUixDQUFXLGNBQVgsRUFEYTtJQUFBLENBbmFmLENBQUE7O0FBQUEsd0JBc2FBLFdBQUEsR0FBYSxTQUFDLEtBQUQsR0FBQTthQUNYLElBQUMsQ0FBQSxjQUFELENBQUEsQ0FBaUIsQ0FBQyxFQUFsQixDQUFxQixLQUFyQixFQURXO0lBQUEsQ0F0YWIsQ0FBQTs7QUFBQSx3QkF5YUEsY0FBQSxHQUFnQixTQUFBLEdBQUE7YUFDZCxJQUFDLENBQUEsZUFBZSxDQUFDLFFBQWpCLENBQTBCLDJCQUExQixFQURjO0lBQUEsQ0F6YWhCLENBQUE7O0FBQUEsd0JBNGFBLGVBQUEsR0FBaUIsU0FBQyxJQUFELEVBQU8sT0FBUCxHQUFBO0FBQ2YsVUFBQSx3QkFBQTtBQUFBLE1BQUEsYUFBQSxHQUFnQixJQUFDLENBQUEsY0FBRCxDQUFBLENBQWtCLENBQUEsT0FBQSxDQUFsQyxDQUFBO0FBQUEsTUFDQSxTQUFBLEdBQVksSUFBQyxDQUFBLGVBQWdCLENBQUEsQ0FBQSxDQUQ3QixDQUFBO0FBRUEsTUFBQSxJQUFHLHFCQUFIO2VBQ0UsU0FBUyxDQUFDLFlBQVYsQ0FBdUIsSUFBdkIsRUFBNkIsYUFBN0IsRUFERjtPQUFBLE1BQUE7ZUFHRSxTQUFTLENBQUMsV0FBVixDQUFzQixJQUF0QixFQUhGO09BSGU7SUFBQSxDQTVhakIsQ0FBQTs7QUFBQSx3QkFvYkEsZ0JBQUEsR0FBa0IsU0FBQyxTQUFELEVBQVksT0FBWixHQUFBO0FBQ2hCLFVBQUEsb0JBQUE7QUFBQSxNQUFBLGNBQUEsR0FBaUIsSUFBQyxDQUFBLHFCQUFELENBQUEsQ0FBakIsQ0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUFPLElBQUMsQ0FBQSxhQUFhLENBQUMsTUFBZixDQUFzQixTQUF0QixFQUFpQyxDQUFqQyxDQUFvQyxDQUFBLENBQUEsQ0FEM0MsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxNQUFmLENBQXNCLE9BQXRCLEVBQStCLENBQS9CLEVBQWtDLElBQWxDLENBRkEsQ0FBQTthQUdBLElBQUMsQ0FBQSxxQkFBRCxDQUF1QixjQUF2QixFQUpnQjtJQUFBLENBcGJsQixDQUFBOztBQUFBLHdCQTBiQSxXQUFBLEdBQWEsU0FBQyxTQUFELEVBQVksT0FBWixHQUFBO0FBQ1gsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFVLFNBQUEsS0FBYSxPQUF2QjtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQ0EsTUFBQSxJQUFhLFNBQUEsR0FBWSxPQUF6QjtBQUFBLFFBQUEsT0FBQSxFQUFBLENBQUE7T0FEQTtBQUFBLE1BR0EsSUFBQSxHQUFPLElBQUMsQ0FBQSxjQUFELENBQUEsQ0FBaUIsQ0FBQyxFQUFsQixDQUFxQixTQUFyQixDQUErQixDQUFDLE1BQWhDLENBQUEsQ0FIUCxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsZUFBRCxDQUFpQixJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsQ0FBakIsRUFBOEIsT0FBOUIsQ0FKQSxDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsU0FBbEIsRUFBNkIsT0FBN0IsQ0FMQSxDQUFBO0FBQUEsTUFNQSxJQUFJLENBQUMsUUFBTCxDQUFjLFVBQWQsQ0FOQSxDQUFBO2FBT0EsSUFBSSxDQUFDLEdBQUwsQ0FBUyxvQkFBVCxFQUErQixTQUFBLEdBQUE7ZUFBRyxJQUFJLENBQUMsV0FBTCxDQUFpQixVQUFqQixFQUFIO01BQUEsQ0FBL0IsRUFSVztJQUFBLENBMWJiLENBQUE7O3FCQUFBOztLQURzQixLQVZ4QixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/kyan/.atom/packages/platformio-ide-terminal/lib/status-bar.coffee
