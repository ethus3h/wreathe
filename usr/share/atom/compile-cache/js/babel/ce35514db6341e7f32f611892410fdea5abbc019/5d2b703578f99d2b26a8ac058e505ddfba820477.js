'use babel';

var _bind = Function.prototype.bind;

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

var _get = function get(_x6, _x7, _x8) {
  var _again = true;_function: while (_again) {
    var object = _x6,
        property = _x7,
        receiver = _x8;_again = false;if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);if (parent === null) {
        return undefined;
      } else {
        _x6 = parent;_x7 = property;_x8 = receiver;_again = true;desc = parent = undefined;continue _function;
      }
    } else if ('value' in desc) {
      return desc.value;
    } else {
      var getter = desc.get;if (getter === undefined) {
        return undefined;
      }return getter.call(receiver);
    }
  }
};

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
  } else {
    return Array.from(arr);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {
      var callNext = step.bind(null, 'next');var callThrow = step.bind(null, 'throw');function step(key, arg) {
        try {
          var info = gen[key](arg);var value = info.value;
        } catch (error) {
          reject(error);return;
        }if (info.done) {
          resolve(value);
        } else {
          Promise.resolve(value).then(callNext, callThrow);
        }
      }callNext();
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var _ = require('underscore-plus');
var url = require('url');
var path = require('path');

var _require = require('event-kit');

var Emitter = _require.Emitter;
var Disposable = _require.Disposable;
var CompositeDisposable = _require.CompositeDisposable;

var fs = require('fs-plus');

var _require2 = require('pathwatcher');

var Directory = _require2.Directory;

var Grim = require('grim');
var DefaultDirectorySearcher = require('./default-directory-searcher');
var Dock = require('./dock');
var Model = require('./model');
var StateStore = require('./state-store');
var TextEditor = require('./text-editor');
var Panel = require('./panel');
var PanelContainer = require('./panel-container');
var Task = require('./task');
var WorkspaceCenter = require('./workspace-center');
var WorkspaceElement = require('./workspace-element');

var STOPPED_CHANGING_ACTIVE_PANE_ITEM_DELAY = 100;
var ALL_LOCATIONS = ['center', 'left', 'right', 'bottom'];

// Essential: Represents the state of the user interface for the entire window.
// An instance of this class is available via the `atom.workspace` global.
//
// Interact with this object to open files, be notified of current and future
// editors, and manipulate panes. To add panels, use {Workspace::addTopPanel}
// and friends.
//
// ## Workspace Items
//
// The term "item" refers to anything that can be displayed
// in a pane within the workspace, either in the {WorkspaceCenter} or in one
// of the three {Dock}s. The workspace expects items to conform to the
// following interface:
//
// ### Required Methods
//
// #### `getTitle()`
//
// Returns a {String} containing the title of the item to display on its
// associated tab.
//
// ### Optional Methods
//
// #### `getElement()`
//
// If your item already *is* a DOM element, you do not need to implement this
// method. Otherwise it should return the element you want to display to
// represent this item.
//
// #### `destroy()`
//
// Destroys the item. This will be called when the item is removed from its
// parent pane.
//
// #### `onDidDestroy(callback)`
//
// Called by the workspace so it can be notified when the item is destroyed.
// Must return a {Disposable}.
//
// #### `serialize()`
//
// Serialize the state of the item. Must return an object that can be passed to
// `JSON.stringify`. The state should include a field called `deserializer`,
// which names a deserializer declared in your `package.json`. This method is
// invoked on items when serializing the workspace so they can be restored to
// the same location later.
//
// #### `getURI()`
//
// Returns the URI associated with the item.
//
// #### `getLongTitle()`
//
// Returns a {String} containing a longer version of the title to display in
// places like the window title or on tabs their short titles are ambiguous.
//
// #### `onDidChangeTitle`
//
// Called by the workspace so it can be notified when the item's title changes.
// Must return a {Disposable}.
//
// #### `getIconName()`
//
// Return a {String} with the name of an icon. If this method is defined and
// returns a string, the item's tab element will be rendered with the `icon` and
// `icon-${iconName}` CSS classes.
//
// ### `onDidChangeIcon(callback)`
//
// Called by the workspace so it can be notified when the item's icon changes.
// Must return a {Disposable}.
//
// #### `getDefaultLocation()`
//
// Tells the workspace where your item should be opened in absence of a user
// override. Items can appear in the center or in a dock on the left, right, or
// bottom of the workspace.
//
// Returns a {String} with one of the following values: `'center'`, `'left'`,
// `'right'`, `'bottom'`. If this method is not defined, `'center'` is the
// default.
//
// #### `getAllowedLocations()`
//
// Tells the workspace where this item can be moved. Returns an {Array} of one
// or more of the following values: `'center'`, `'left'`, `'right'`, or
// `'bottom'`.
//
// #### `isPermanentDockItem()`
//
// Tells the workspace whether or not this item can be closed by the user by
// clicking an `x` on its tab. Use of this feature is discouraged unless there's
// a very good reason not to allow users to close your item. Items can be made
// permanent *only* when they are contained in docks. Center pane items can
// always be removed. Note that it is currently still possible to close dock
// items via the `Close Pane` option in the context menu and via Atom APIs, so
// you should still be prepared to handle your dock items being destroyed by the
// user even if you implement this method.
//
// #### `save()`
//
// Saves the item.
//
// #### `saveAs(path)`
//
// Saves the item to the specified path.
//
// #### `getPath()`
//
// Returns the local path associated with this item. This is only used to set
// the initial location of the "save as" dialog.
//
// #### `isModified()`
//
// Returns whether or not the item is modified to reflect modification in the
// UI.
//
// #### `onDidChangeModified()`
//
// Called by the workspace so it can be notified when item's modified status
// changes. Must return a {Disposable}.
//
// #### `copy()`
//
// Create a copy of the item. If defined, the workspace will call this method to
// duplicate the item when splitting panes via certain split commands.
//
// #### `getPreferredHeight()`
//
// If this item is displayed in the bottom {Dock}, called by the workspace when
// initially displaying the dock to set its height. Once the dock has been
// resized by the user, their height will override this value.
//
// Returns a {Number}.
//
// #### `getPreferredWidth()`
//
// If this item is displayed in the left or right {Dock}, called by the
// workspace when initially displaying the dock to set its width. Once the dock
// has been resized by the user, their width will override this value.
//
// Returns a {Number}.
//
// #### `onDidTerminatePendingState(callback)`
//
// If the workspace is configured to use *pending pane items*, the workspace
// will subscribe to this method to terminate the pending state of the item.
// Must return a {Disposable}.
//
// #### `shouldPromptToSave()`
//
// This method indicates whether Atom should prompt the user to save this item
// when the user closes or reloads the window. Returns a boolean.
module.exports = (function (_Model) {
  _inherits(Workspace, _Model);

  function Workspace(params) {
    _classCallCheck(this, Workspace);

    _get(Object.getPrototypeOf(Workspace.prototype), 'constructor', this).apply(this, arguments);

    this.updateWindowTitle = this.updateWindowTitle.bind(this);
    this.updateDocumentEdited = this.updateDocumentEdited.bind(this);
    this.didDestroyPaneItem = this.didDestroyPaneItem.bind(this);
    this.didChangeActivePaneOnPaneContainer = this.didChangeActivePaneOnPaneContainer.bind(this);
    this.didChangeActivePaneItemOnPaneContainer = this.didChangeActivePaneItemOnPaneContainer.bind(this);
    this.didActivatePaneContainer = this.didActivatePaneContainer.bind(this);

    this.enablePersistence = params.enablePersistence;
    this.packageManager = params.packageManager;
    this.config = params.config;
    this.project = params.project;
    this.notificationManager = params.notificationManager;
    this.viewRegistry = params.viewRegistry;
    this.grammarRegistry = params.grammarRegistry;
    this.applicationDelegate = params.applicationDelegate;
    this.assert = params.assert;
    this.deserializerManager = params.deserializerManager;
    this.textEditorRegistry = params.textEditorRegistry;
    this.styleManager = params.styleManager;
    this.draggingItem = false;
    this.itemLocationStore = new StateStore('AtomPreviousItemLocations', 1);

    this.emitter = new Emitter();
    this.openers = [];
    this.destroyedItemURIs = [];
    this.stoppedChangingActivePaneItemTimeout = null;

    this.defaultDirectorySearcher = new DefaultDirectorySearcher();
    this.consumeServices(this.packageManager);

    this.paneContainers = {
      center: this.createCenter(),
      left: this.createDock('left'),
      right: this.createDock('right'),
      bottom: this.createDock('bottom')
    };
    this.activePaneContainer = this.paneContainers.center;
    this.hasActiveTextEditor = false;

    this.panelContainers = {
      top: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'top' }),
      left: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'left', dock: this.paneContainers.left }),
      right: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'right', dock: this.paneContainers.right }),
      bottom: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'bottom', dock: this.paneContainers.bottom }),
      header: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'header' }),
      footer: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'footer' }),
      modal: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'modal' })
    };

    this.subscribeToEvents();
  }

  _createClass(Workspace, [{
    key: 'getElement',
    value: function getElement() {
      if (!this.element) {
        this.element = new WorkspaceElement().initialize(this, {
          config: this.config,
          project: this.project,
          viewRegistry: this.viewRegistry,
          styleManager: this.styleManager
        });
      }
      return this.element;
    }
  }, {
    key: 'createCenter',
    value: function createCenter() {
      return new WorkspaceCenter({
        config: this.config,
        applicationDelegate: this.applicationDelegate,
        notificationManager: this.notificationManager,
        deserializerManager: this.deserializerManager,
        viewRegistry: this.viewRegistry,
        didActivate: this.didActivatePaneContainer,
        didChangeActivePane: this.didChangeActivePaneOnPaneContainer,
        didChangeActivePaneItem: this.didChangeActivePaneItemOnPaneContainer,
        didDestroyPaneItem: this.didDestroyPaneItem
      });
    }
  }, {
    key: 'createDock',
    value: function createDock(location) {
      return new Dock({
        location: location,
        config: this.config,
        applicationDelegate: this.applicationDelegate,
        deserializerManager: this.deserializerManager,
        notificationManager: this.notificationManager,
        viewRegistry: this.viewRegistry,
        didActivate: this.didActivatePaneContainer,
        didChangeActivePane: this.didChangeActivePaneOnPaneContainer,
        didChangeActivePaneItem: this.didChangeActivePaneItemOnPaneContainer,
        didDestroyPaneItem: this.didDestroyPaneItem
      });
    }
  }, {
    key: 'reset',
    value: function reset(packageManager) {
      this.packageManager = packageManager;
      this.emitter.dispose();
      this.emitter = new Emitter();

      this.paneContainers.center.destroy();
      this.paneContainers.left.destroy();
      this.paneContainers.right.destroy();
      this.paneContainers.bottom.destroy();

      _.values(this.panelContainers).forEach(function (panelContainer) {
        panelContainer.destroy();
      });

      this.paneContainers = {
        center: this.createCenter(),
        left: this.createDock('left'),
        right: this.createDock('right'),
        bottom: this.createDock('bottom')
      };
      this.activePaneContainer = this.paneContainers.center;
      this.hasActiveTextEditor = false;

      this.panelContainers = {
        top: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'top' }),
        left: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'left', dock: this.paneContainers.left }),
        right: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'right', dock: this.paneContainers.right }),
        bottom: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'bottom', dock: this.paneContainers.bottom }),
        header: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'header' }),
        footer: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'footer' }),
        modal: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'modal' })
      };

      this.originalFontSize = null;
      this.openers = [];
      this.destroyedItemURIs = [];
      this.element = null;
      this.consumeServices(this.packageManager);
    }
  }, {
    key: 'subscribeToEvents',
    value: function subscribeToEvents() {
      this.project.onDidChangePaths(this.updateWindowTitle);
      this.subscribeToFontSize();
      this.subscribeToAddedItems();
      this.subscribeToMovedItems();
      this.subscribeToDockToggling();
    }
  }, {
    key: 'consumeServices',
    value: function consumeServices(_ref) {
      var _this = this;

      var serviceHub = _ref.serviceHub;

      this.directorySearchers = [];
      serviceHub.consume('atom.directory-searcher', '^0.1.0', function (provider) {
        return _this.directorySearchers.unshift(provider);
      });
    }

    // Called by the Serializable mixin during serialization.
  }, {
    key: 'serialize',
    value: function serialize() {
      return {
        deserializer: 'Workspace',
        packagesWithActiveGrammars: this.getPackageNamesWithActiveGrammars(),
        destroyedItemURIs: this.destroyedItemURIs.slice(),
        // Ensure deserializing 1.17 state with pre 1.17 Atom does not error
        // TODO: Remove after 1.17 has been on stable for a while
        paneContainer: { version: 2 },
        paneContainers: {
          center: this.paneContainers.center.serialize(),
          left: this.paneContainers.left.serialize(),
          right: this.paneContainers.right.serialize(),
          bottom: this.paneContainers.bottom.serialize()
        }
      };
    }
  }, {
    key: 'deserialize',
    value: function deserialize(state, deserializerManager) {
      var packagesWithActiveGrammars = state.packagesWithActiveGrammars != null ? state.packagesWithActiveGrammars : [];
      for (var packageName of packagesWithActiveGrammars) {
        var pkg = this.packageManager.getLoadedPackage(packageName);
        if (pkg != null) {
          pkg.loadGrammarsSync();
        }
      }
      if (state.destroyedItemURIs != null) {
        this.destroyedItemURIs = state.destroyedItemURIs;
      }

      if (state.paneContainers) {
        this.paneContainers.center.deserialize(state.paneContainers.center, deserializerManager);
        this.paneContainers.left.deserialize(state.paneContainers.left, deserializerManager);
        this.paneContainers.right.deserialize(state.paneContainers.right, deserializerManager);
        this.paneContainers.bottom.deserialize(state.paneContainers.bottom, deserializerManager);
      } else if (state.paneContainer) {
        // TODO: Remove this fallback once a lot of time has passed since 1.17 was released
        this.paneContainers.center.deserialize(state.paneContainer, deserializerManager);
      }

      this.hasActiveTextEditor = this.getActiveTextEditor() != null;

      this.updateWindowTitle();
    }
  }, {
    key: 'getPackageNamesWithActiveGrammars',
    value: function getPackageNamesWithActiveGrammars() {
      var _this2 = this;

      var packageNames = [];
      var addGrammar = function addGrammar() {
        var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var includedGrammarScopes = _ref2.includedGrammarScopes;
        var packageName = _ref2.packageName;

        if (!packageName) {
          return;
        }
        // Prevent cycles
        if (packageNames.indexOf(packageName) !== -1) {
          return;
        }

        packageNames.push(packageName);
        for (var scopeName of includedGrammarScopes != null ? includedGrammarScopes : []) {
          addGrammar(_this2.grammarRegistry.grammarForScopeName(scopeName));
        }
      };

      var editors = this.getTextEditors();
      for (var editor of editors) {
        addGrammar(editor.getGrammar());
      }

      if (editors.length > 0) {
        for (var grammar of this.grammarRegistry.getGrammars()) {
          if (grammar.injectionSelector) {
            addGrammar(grammar);
          }
        }
      }

      return _.uniq(packageNames);
    }
  }, {
    key: 'didActivatePaneContainer',
    value: function didActivatePaneContainer(paneContainer) {
      if (paneContainer !== this.getActivePaneContainer()) {
        this.activePaneContainer = paneContainer;
        this.didChangeActivePaneItem(this.activePaneContainer.getActivePaneItem());
        this.emitter.emit('did-change-active-pane-container', this.activePaneContainer);
        this.emitter.emit('did-change-active-pane', this.activePaneContainer.getActivePane());
        this.emitter.emit('did-change-active-pane-item', this.activePaneContainer.getActivePaneItem());
      }
    }
  }, {
    key: 'didChangeActivePaneOnPaneContainer',
    value: function didChangeActivePaneOnPaneContainer(paneContainer, pane) {
      if (paneContainer === this.getActivePaneContainer()) {
        this.emitter.emit('did-change-active-pane', pane);
      }
    }
  }, {
    key: 'didChangeActivePaneItemOnPaneContainer',
    value: function didChangeActivePaneItemOnPaneContainer(paneContainer, item) {
      if (paneContainer === this.getActivePaneContainer()) {
        this.didChangeActivePaneItem(item);
        this.emitter.emit('did-change-active-pane-item', item);
      }

      if (paneContainer === this.getCenter()) {
        var hadActiveTextEditor = this.hasActiveTextEditor;
        this.hasActiveTextEditor = item instanceof TextEditor;

        if (this.hasActiveTextEditor || hadActiveTextEditor) {
          var itemValue = this.hasActiveTextEditor ? item : undefined;
          this.emitter.emit('did-change-active-text-editor', itemValue);
        }
      }
    }
  }, {
    key: 'didChangeActivePaneItem',
    value: function didChangeActivePaneItem(item) {
      var _this3 = this;

      this.updateWindowTitle();
      this.updateDocumentEdited();
      if (this.activeItemSubscriptions) this.activeItemSubscriptions.dispose();
      this.activeItemSubscriptions = new CompositeDisposable();

      var modifiedSubscription = undefined,
          titleSubscription = undefined;

      if (item != null && typeof item.onDidChangeTitle === 'function') {
        titleSubscription = item.onDidChangeTitle(this.updateWindowTitle);
      } else if (item != null && typeof item.on === 'function') {
        titleSubscription = item.on('title-changed', this.updateWindowTitle);
        if (titleSubscription == null || typeof titleSubscription.dispose !== 'function') {
          titleSubscription = new Disposable(function () {
            item.off('title-changed', _this3.updateWindowTitle);
          });
        }
      }

      if (item != null && typeof item.onDidChangeModified === 'function') {
        modifiedSubscription = item.onDidChangeModified(this.updateDocumentEdited);
      } else if (item != null && typeof item.on === 'function') {
        modifiedSubscription = item.on('modified-status-changed', this.updateDocumentEdited);
        if (modifiedSubscription == null || typeof modifiedSubscription.dispose !== 'function') {
          modifiedSubscription = new Disposable(function () {
            item.off('modified-status-changed', _this3.updateDocumentEdited);
          });
        }
      }

      if (titleSubscription != null) {
        this.activeItemSubscriptions.add(titleSubscription);
      }
      if (modifiedSubscription != null) {
        this.activeItemSubscriptions.add(modifiedSubscription);
      }

      this.cancelStoppedChangingActivePaneItemTimeout();
      this.stoppedChangingActivePaneItemTimeout = setTimeout(function () {
        _this3.stoppedChangingActivePaneItemTimeout = null;
        _this3.emitter.emit('did-stop-changing-active-pane-item', item);
      }, STOPPED_CHANGING_ACTIVE_PANE_ITEM_DELAY);
    }
  }, {
    key: 'cancelStoppedChangingActivePaneItemTimeout',
    value: function cancelStoppedChangingActivePaneItemTimeout() {
      if (this.stoppedChangingActivePaneItemTimeout != null) {
        clearTimeout(this.stoppedChangingActivePaneItemTimeout);
      }
    }
  }, {
    key: 'setDraggingItem',
    value: function setDraggingItem(draggingItem) {
      _.values(this.paneContainers).forEach(function (dock) {
        dock.setDraggingItem(draggingItem);
      });
    }
  }, {
    key: 'subscribeToAddedItems',
    value: function subscribeToAddedItems() {
      var _this4 = this;

      this.onDidAddPaneItem(function (_ref3) {
        var item = _ref3.item;
        var pane = _ref3.pane;
        var index = _ref3.index;

        if (item instanceof TextEditor) {
          (function () {
            var subscriptions = new CompositeDisposable(_this4.textEditorRegistry.add(item), _this4.textEditorRegistry.maintainGrammar(item), _this4.textEditorRegistry.maintainConfig(item), item.observeGrammar(_this4.handleGrammarUsed.bind(_this4)));
            item.onDidDestroy(function () {
              subscriptions.dispose();
            });
            _this4.emitter.emit('did-add-text-editor', { textEditor: item, pane: pane, index: index });
          })();
        }
      });
    }
  }, {
    key: 'subscribeToDockToggling',
    value: function subscribeToDockToggling() {
      var _this5 = this;

      var docks = [this.getLeftDock(), this.getRightDock(), this.getBottomDock()];
      docks.forEach(function (dock) {
        dock.onDidChangeVisible(function (visible) {
          if (visible) return;
          var activeElement = document.activeElement;

          var dockElement = dock.getElement();
          if (dockElement === activeElement || dockElement.contains(activeElement)) {
            _this5.getCenter().activate();
          }
        });
      });
    }
  }, {
    key: 'subscribeToMovedItems',
    value: function subscribeToMovedItems() {
      var _this6 = this;

      var _loop = function _loop(paneContainer) {
        paneContainer.observePanes(function (pane) {
          pane.onDidAddItem(function (_ref4) {
            var item = _ref4.item;

            if (typeof item.getURI === 'function' && _this6.enablePersistence) {
              var uri = item.getURI();
              if (uri) {
                var _location = paneContainer.getLocation();
                var defaultLocation = undefined;
                if (typeof item.getDefaultLocation === 'function') {
                  defaultLocation = item.getDefaultLocation();
                }
                defaultLocation = defaultLocation || 'center';
                if (_location === defaultLocation) {
                  _this6.itemLocationStore['delete'](item.getURI());
                } else {
                  _this6.itemLocationStore.save(item.getURI(), _location);
                }
              }
            }
          });
        });
      };

      for (var paneContainer of this.getPaneContainers()) {
        _loop(paneContainer);
      }
    }

    // Updates the application's title and proxy icon based on whichever file is
    // open.
  }, {
    key: 'updateWindowTitle',
    value: function updateWindowTitle() {
      var itemPath = undefined,
          itemTitle = undefined,
          projectPath = undefined,
          representedPath = undefined;
      var appName = 'Atom';
      var left = this.project.getPaths();
      var projectPaths = left != null ? left : [];
      var item = this.getActivePaneItem();
      if (item) {
        itemPath = typeof item.getPath === 'function' ? item.getPath() : undefined;
        var longTitle = typeof item.getLongTitle === 'function' ? item.getLongTitle() : undefined;
        itemTitle = longTitle == null ? typeof item.getTitle === 'function' ? item.getTitle() : undefined : longTitle;
        projectPath = _.find(projectPaths, function (projectPath) {
          return itemPath === projectPath || (itemPath != null ? itemPath.startsWith(projectPath + path.sep) : undefined);
        });
      }
      if (itemTitle == null) {
        itemTitle = 'untitled';
      }
      if (projectPath == null) {
        projectPath = itemPath ? path.dirname(itemPath) : projectPaths[0];
      }
      if (projectPath != null) {
        projectPath = fs.tildify(projectPath);
      }

      var titleParts = [];
      if (item != null && projectPath != null) {
        titleParts.push(itemTitle, projectPath);
        representedPath = itemPath != null ? itemPath : projectPath;
      } else if (projectPath != null) {
        titleParts.push(projectPath);
        representedPath = projectPath;
      } else {
        titleParts.push(itemTitle);
        representedPath = '';
      }

      if (process.platform !== 'darwin') {
        titleParts.push(appName);
      }

      document.title = titleParts.join(' — ');
      this.applicationDelegate.setRepresentedFilename(representedPath);
      this.emitter.emit('did-change-window-title');
    }

    // On macOS, fades the application window's proxy icon when the current file
    // has been modified.
  }, {
    key: 'updateDocumentEdited',
    value: function updateDocumentEdited() {
      var activePaneItem = this.getActivePaneItem();
      var modified = activePaneItem != null && typeof activePaneItem.isModified === 'function' ? activePaneItem.isModified() || false : false;
      this.applicationDelegate.setWindowDocumentEdited(modified);
    }

    /*
    Section: Event Subscription
    */

  }, {
    key: 'onDidChangeActivePaneContainer',
    value: function onDidChangeActivePaneContainer(callback) {
      return this.emitter.on('did-change-active-pane-container', callback);
    }

    // Essential: Invoke the given callback with all current and future text
    // editors in the workspace.
    //
    // * `callback` {Function} to be called with current and future text editors.
    //   * `editor` A {TextEditor} that is present in {::getTextEditors} at the time
    //     of subscription or that is added at some later time.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'observeTextEditors',
    value: function observeTextEditors(callback) {
      for (var textEditor of this.getTextEditors()) {
        callback(textEditor);
      }
      return this.onDidAddTextEditor(function (_ref5) {
        var textEditor = _ref5.textEditor;
        return callback(textEditor);
      });
    }

    // Essential: Invoke the given callback with all current and future panes items
    // in the workspace.
    //
    // * `callback` {Function} to be called with current and future pane items.
    //   * `item` An item that is present in {::getPaneItems} at the time of
    //      subscription or that is added at some later time.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'observePaneItems',
    value: function observePaneItems(callback) {
      return new (_bind.apply(CompositeDisposable, [null].concat(_toConsumableArray(this.getPaneContainers().map(function (container) {
        return container.observePaneItems(callback);
      })))))();
    }

    // Essential: Invoke the given callback when the active pane item changes.
    //
    // Because observers are invoked synchronously, it's important not to perform
    // any expensive operations via this method. Consider
    // {::onDidStopChangingActivePaneItem} to delay operations until after changes
    // stop occurring.
    //
    // * `callback` {Function} to be called when the active pane item changes.
    //   * `item` The active pane item.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'onDidChangeActivePaneItem',
    value: function onDidChangeActivePaneItem(callback) {
      return this.emitter.on('did-change-active-pane-item', callback);
    }

    // Essential: Invoke the given callback when the active pane item stops
    // changing.
    //
    // Observers are called asynchronously 100ms after the last active pane item
    // change. Handling changes here rather than in the synchronous
    // {::onDidChangeActivePaneItem} prevents unneeded work if the user is quickly
    // changing or closing tabs and ensures critical UI feedback, like changing the
    // highlighted tab, gets priority over work that can be done asynchronously.
    //
    // * `callback` {Function} to be called when the active pane item stops
    //   changing.
    //   * `item` The active pane item.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'onDidStopChangingActivePaneItem',
    value: function onDidStopChangingActivePaneItem(callback) {
      return this.emitter.on('did-stop-changing-active-pane-item', callback);
    }

    // Essential: Invoke the given callback when a text editor becomes the active
    // text editor and when there is no longer an active text editor.
    //
    // * `callback` {Function} to be called when the active text editor changes.
    //   * `editor` The active {TextEditor} or undefined if there is no longer an
    //      active text editor.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'onDidChangeActiveTextEditor',
    value: function onDidChangeActiveTextEditor(callback) {
      return this.emitter.on('did-change-active-text-editor', callback);
    }

    // Essential: Invoke the given callback with the current active pane item and
    // with all future active pane items in the workspace.
    //
    // * `callback` {Function} to be called when the active pane item changes.
    //   * `item` The current active pane item.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'observeActivePaneItem',
    value: function observeActivePaneItem(callback) {
      callback(this.getActivePaneItem());
      return this.onDidChangeActivePaneItem(callback);
    }

    // Essential: Invoke the given callback with the current active text editor
    // (if any), with all future active text editors, and when there is no longer
    // an active text editor.
    //
    // * `callback` {Function} to be called when the active text editor changes.
    //   * `editor` The active {TextEditor} or undefined if there is not an
    //      active text editor.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'observeActiveTextEditor',
    value: function observeActiveTextEditor(callback) {
      callback(this.getActiveTextEditor());

      return this.onDidChangeActiveTextEditor(callback);
    }

    // Essential: Invoke the given callback whenever an item is opened. Unlike
    // {::onDidAddPaneItem}, observers will be notified for items that are already
    // present in the workspace when they are reopened.
    //
    // * `callback` {Function} to be called whenever an item is opened.
    //   * `event` {Object} with the following keys:
    //     * `uri` {String} representing the opened URI. Could be `undefined`.
    //     * `item` The opened item.
    //     * `pane` The pane in which the item was opened.
    //     * `index` The index of the opened item on its pane.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'onDidOpen',
    value: function onDidOpen(callback) {
      return this.emitter.on('did-open', callback);
    }

    // Extended: Invoke the given callback when a pane is added to the workspace.
    //
    // * `callback` {Function} to be called panes are added.
    //   * `event` {Object} with the following keys:
    //     * `pane` The added pane.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'onDidAddPane',
    value: function onDidAddPane(callback) {
      return new (_bind.apply(CompositeDisposable, [null].concat(_toConsumableArray(this.getPaneContainers().map(function (container) {
        return container.onDidAddPane(callback);
      })))))();
    }

    // Extended: Invoke the given callback before a pane is destroyed in the
    // workspace.
    //
    // * `callback` {Function} to be called before panes are destroyed.
    //   * `event` {Object} with the following keys:
    //     * `pane` The pane to be destroyed.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'onWillDestroyPane',
    value: function onWillDestroyPane(callback) {
      return new (_bind.apply(CompositeDisposable, [null].concat(_toConsumableArray(this.getPaneContainers().map(function (container) {
        return container.onWillDestroyPane(callback);
      })))))();
    }

    // Extended: Invoke the given callback when a pane is destroyed in the
    // workspace.
    //
    // * `callback` {Function} to be called panes are destroyed.
    //   * `event` {Object} with the following keys:
    //     * `pane` The destroyed pane.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'onDidDestroyPane',
    value: function onDidDestroyPane(callback) {
      return new (_bind.apply(CompositeDisposable, [null].concat(_toConsumableArray(this.getPaneContainers().map(function (container) {
        return container.onDidDestroyPane(callback);
      })))))();
    }

    // Extended: Invoke the given callback with all current and future panes in the
    // workspace.
    //
    // * `callback` {Function} to be called with current and future panes.
    //   * `pane` A {Pane} that is present in {::getPanes} at the time of
    //      subscription or that is added at some later time.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'observePanes',
    value: function observePanes(callback) {
      return new (_bind.apply(CompositeDisposable, [null].concat(_toConsumableArray(this.getPaneContainers().map(function (container) {
        return container.observePanes(callback);
      })))))();
    }

    // Extended: Invoke the given callback when the active pane changes.
    //
    // * `callback` {Function} to be called when the active pane changes.
    //   * `pane` A {Pane} that is the current return value of {::getActivePane}.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'onDidChangeActivePane',
    value: function onDidChangeActivePane(callback) {
      return this.emitter.on('did-change-active-pane', callback);
    }

    // Extended: Invoke the given callback with the current active pane and when
    // the active pane changes.
    //
    // * `callback` {Function} to be called with the current and future active#
    //   panes.
    //   * `pane` A {Pane} that is the current return value of {::getActivePane}.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'observeActivePane',
    value: function observeActivePane(callback) {
      callback(this.getActivePane());
      return this.onDidChangeActivePane(callback);
    }

    // Extended: Invoke the given callback when a pane item is added to the
    // workspace.
    //
    // * `callback` {Function} to be called when pane items are added.
    //   * `event` {Object} with the following keys:
    //     * `item` The added pane item.
    //     * `pane` {Pane} containing the added item.
    //     * `index` {Number} indicating the index of the added item in its pane.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'onDidAddPaneItem',
    value: function onDidAddPaneItem(callback) {
      return new (_bind.apply(CompositeDisposable, [null].concat(_toConsumableArray(this.getPaneContainers().map(function (container) {
        return container.onDidAddPaneItem(callback);
      })))))();
    }

    // Extended: Invoke the given callback when a pane item is about to be
    // destroyed, before the user is prompted to save it.
    //
    // * `callback` {Function} to be called before pane items are destroyed. If this function returns
    //   a {Promise}, then the item will not be destroyed until the promise resolves.
    //   * `event` {Object} with the following keys:
    //     * `item` The item to be destroyed.
    //     * `pane` {Pane} containing the item to be destroyed.
    //     * `index` {Number} indicating the index of the item to be destroyed in
    //       its pane.
    //
    // Returns a {Disposable} on which `.dispose` can be called to unsubscribe.
  }, {
    key: 'onWillDestroyPaneItem',
    value: function onWillDestroyPaneItem(callback) {
      return new (_bind.apply(CompositeDisposable, [null].concat(_toConsumableArray(this.getPaneContainers().map(function (container) {
        return container.onWillDestroyPaneItem(callback);
      })))))();
    }

    // Extended: Invoke the given callback when a pane item is destroyed.
    //
    // * `callback` {Function} to be called when pane items are destroyed.
    //   * `event` {Object} with the following keys:
    //     * `item` The destroyed item.
    //     * `pane` {Pane} containing the destroyed item.
    //     * `index` {Number} indicating the index of the destroyed item in its
    //       pane.
    //
    // Returns a {Disposable} on which `.dispose` can be called to unsubscribe.
  }, {
    key: 'onDidDestroyPaneItem',
    value: function onDidDestroyPaneItem(callback) {
      return new (_bind.apply(CompositeDisposable, [null].concat(_toConsumableArray(this.getPaneContainers().map(function (container) {
        return container.onDidDestroyPaneItem(callback);
      })))))();
    }

    // Extended: Invoke the given callback when a text editor is added to the
    // workspace.
    //
    // * `callback` {Function} to be called panes are added.
    //   * `event` {Object} with the following keys:
    //     * `textEditor` {TextEditor} that was added.
    //     * `pane` {Pane} containing the added text editor.
    //     * `index` {Number} indicating the index of the added text editor in its
    //        pane.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'onDidAddTextEditor',
    value: function onDidAddTextEditor(callback) {
      return this.emitter.on('did-add-text-editor', callback);
    }
  }, {
    key: 'onDidChangeWindowTitle',
    value: function onDidChangeWindowTitle(callback) {
      return this.emitter.on('did-change-window-title', callback);
    }

    /*
    Section: Opening
    */

    // Essential: Opens the given URI in Atom asynchronously.
    // If the URI is already open, the existing item for that URI will be
    // activated. If no URI is given, or no registered opener can open
    // the URI, a new empty {TextEditor} will be created.
    //
    // * `uri` (optional) A {String} containing a URI.
    // * `options` (optional) {Object}
    //   * `initialLine` A {Number} indicating which row to move the cursor to
    //     initially. Defaults to `0`.
    //   * `initialColumn` A {Number} indicating which column to move the cursor to
    //     initially. Defaults to `0`.
    //   * `split` Either 'left', 'right', 'up' or 'down'.
    //     If 'left', the item will be opened in leftmost pane of the current active pane's row.
    //     If 'right', the item will be opened in the rightmost pane of the current active pane's row. If only one pane exists in the row, a new pane will be created.
    //     If 'up', the item will be opened in topmost pane of the current active pane's column.
    //     If 'down', the item will be opened in the bottommost pane of the current active pane's column. If only one pane exists in the column, a new pane will be created.
    //   * `activatePane` A {Boolean} indicating whether to call {Pane::activate} on
    //     containing pane. Defaults to `true`.
    //   * `activateItem` A {Boolean} indicating whether to call {Pane::activateItem}
    //     on containing pane. Defaults to `true`.
    //   * `pending` A {Boolean} indicating whether or not the item should be opened
    //     in a pending state. Existing pending items in a pane are replaced with
    //     new pending items when they are opened.
    //   * `searchAllPanes` A {Boolean}. If `true`, the workspace will attempt to
    //     activate an existing item for the given URI on any pane.
    //     If `false`, only the active pane will be searched for
    //     an existing item for the same URI. Defaults to `false`.
    //   * `location` (optional) A {String} containing the name of the location
    //     in which this item should be opened (one of "left", "right", "bottom",
    //     or "center"). If omitted, Atom will fall back to the last location in
    //     which a user has placed an item with the same URI or, if this is a new
    //     URI, the default location specified by the item. NOTE: This option
    //     should almost always be omitted to honor user preference.
    //
    // Returns a {Promise} that resolves to the {TextEditor} for the file URI.
  }, {
    key: 'open',
    value: _asyncToGenerator(function* (itemOrURI) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var uri = undefined,
          item = undefined;
      if (typeof itemOrURI === 'string') {
        uri = this.project.resolvePath(itemOrURI);
      } else if (itemOrURI) {
        item = itemOrURI;
        if (typeof item.getURI === 'function') uri = item.getURI();
      }

      if (!atom.config.get('core.allowPendingPaneItems')) {
        options.pending = false;
      }

      // Avoid adding URLs as recent documents to work-around this Spotlight crash:
      // https://github.com/atom/atom/issues/10071
      if (uri && (!url.parse(uri).protocol || process.platform === 'win32')) {
        this.applicationDelegate.addRecentDocument(uri);
      }

      var pane = undefined,
          itemExistsInWorkspace = undefined;

      // Try to find an existing item in the workspace.
      if (item || uri) {
        if (options.pane) {
          pane = options.pane;
        } else if (options.searchAllPanes) {
          pane = item ? this.paneForItem(item) : this.paneForURI(uri);
        } else {
          // If an item with the given URI is already in the workspace, assume
          // that item's pane container is the preferred location for that URI.
          var container = undefined;
          if (uri) container = this.paneContainerForURI(uri);
          if (!container) container = this.getActivePaneContainer();

          // The `split` option affects where we search for the item.
          pane = container.getActivePane();
          switch (options.split) {
            case 'left':
              pane = pane.findLeftmostSibling();
              break;
            case 'right':
              pane = pane.findRightmostSibling();
              break;
            case 'up':
              pane = pane.findTopmostSibling();
              break;
            case 'down':
              pane = pane.findBottommostSibling();
              break;
          }
        }

        if (pane) {
          if (item) {
            itemExistsInWorkspace = pane.getItems().includes(item);
          } else {
            item = pane.itemForURI(uri);
            itemExistsInWorkspace = item != null;
          }
        }
      }

      // If we already have an item at this stage, we won't need to do an async
      // lookup of the URI, so we yield the event loop to ensure this method
      // is consistently asynchronous.
      if (item) yield Promise.resolve();

      if (!itemExistsInWorkspace) {
        item = item || (yield this.createItemForURI(uri, options));
        if (!item) return;

        if (options.pane) {
          pane = options.pane;
        } else {
          var _location2 = options.location;
          if (!_location2 && !options.split && uri && this.enablePersistence) {
            _location2 = yield this.itemLocationStore.load(uri);
          }
          if (!_location2 && typeof item.getDefaultLocation === 'function') {
            _location2 = item.getDefaultLocation();
          }

          var allowedLocations = typeof item.getAllowedLocations === 'function' ? item.getAllowedLocations() : ALL_LOCATIONS;
          _location2 = allowedLocations.includes(_location2) ? _location2 : allowedLocations[0];

          var container = this.paneContainers[_location2] || this.getCenter();
          pane = container.getActivePane();
          switch (options.split) {
            case 'left':
              pane = pane.findLeftmostSibling();
              break;
            case 'right':
              pane = pane.findOrCreateRightmostSibling();
              break;
            case 'up':
              pane = pane.findTopmostSibling();
              break;
            case 'down':
              pane = pane.findOrCreateBottommostSibling();
              break;
          }
        }
      }

      if (!options.pending && pane.getPendingItem() === item) {
        pane.clearPendingItem();
      }

      this.itemOpened(item);

      if (options.activateItem === false) {
        pane.addItem(item, { pending: options.pending });
      } else {
        pane.activateItem(item, { pending: options.pending });
      }

      if (options.activatePane !== false) {
        pane.activate();
      }

      var initialColumn = 0;
      var initialLine = 0;
      if (!Number.isNaN(options.initialLine)) {
        initialLine = options.initialLine;
      }
      if (!Number.isNaN(options.initialColumn)) {
        initialColumn = options.initialColumn;
      }
      if (initialLine >= 0 || initialColumn >= 0) {
        if (typeof item.setCursorBufferPosition === 'function') {
          item.setCursorBufferPosition([initialLine, initialColumn]);
        }
      }

      var index = pane.getActiveItemIndex();
      this.emitter.emit('did-open', { uri: uri, pane: pane, item: item, index: index });
      return item;
    })

    // Essential: Search the workspace for items matching the given URI and hide them.
    //
    // * `itemOrURI` The item to hide or a {String} containing the URI
    //   of the item to hide.
    //
    // Returns a {Boolean} indicating whether any items were found (and hidden).
  }, {
    key: 'hide',
    value: function hide(itemOrURI) {
      var foundItems = false;

      // If any visible item has the given URI, hide it
      for (var container of this.getPaneContainers()) {
        var isCenter = container === this.getCenter();
        if (isCenter || container.isVisible()) {
          for (var pane of container.getPanes()) {
            var activeItem = pane.getActiveItem();
            var foundItem = activeItem != null && (activeItem === itemOrURI || typeof activeItem.getURI === 'function' && activeItem.getURI() === itemOrURI);
            if (foundItem) {
              foundItems = true;
              // We can't really hide the center so we just destroy the item.
              if (isCenter) {
                pane.destroyItem(activeItem);
              } else {
                container.hide();
              }
            }
          }
        }
      }

      return foundItems;
    }

    // Essential: Search the workspace for items matching the given URI. If any are found, hide them.
    // Otherwise, open the URL.
    //
    // * `itemOrURI` (optional) The item to toggle or a {String} containing the URI
    //   of the item to toggle.
    //
    // Returns a Promise that resolves when the item is shown or hidden.
  }, {
    key: 'toggle',
    value: function toggle(itemOrURI) {
      if (this.hide(itemOrURI)) {
        return Promise.resolve();
      } else {
        return this.open(itemOrURI, { searchAllPanes: true });
      }
    }

    // Open Atom's license in the active pane.
  }, {
    key: 'openLicense',
    value: function openLicense() {
      return this.open(path.join(process.resourcesPath, 'LICENSE.md'));
    }

    // Synchronously open the given URI in the active pane. **Only use this method
    // in specs. Calling this in production code will block the UI thread and
    // everyone will be mad at you.**
    //
    // * `uri` A {String} containing a URI.
    // * `options` An optional options {Object}
    //   * `initialLine` A {Number} indicating which row to move the cursor to
    //     initially. Defaults to `0`.
    //   * `initialColumn` A {Number} indicating which column to move the cursor to
    //     initially. Defaults to `0`.
    //   * `activatePane` A {Boolean} indicating whether to call {Pane::activate} on
    //     the containing pane. Defaults to `true`.
    //   * `activateItem` A {Boolean} indicating whether to call {Pane::activateItem}
    //     on containing pane. Defaults to `true`.
  }, {
    key: 'openSync',
    value: function openSync() {
      var uri_ = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var initialLine = options.initialLine;
      var initialColumn = options.initialColumn;

      var activatePane = options.activatePane != null ? options.activatePane : true;
      var activateItem = options.activateItem != null ? options.activateItem : true;

      var uri = this.project.resolvePath(uri_);
      var item = this.getActivePane().itemForURI(uri);
      if (uri && item == null) {
        for (var _opener of this.getOpeners()) {
          item = _opener(uri, options);
          if (item) break;
        }
      }
      if (item == null) {
        item = this.project.openSync(uri, { initialLine: initialLine, initialColumn: initialColumn });
      }

      if (activateItem) {
        this.getActivePane().activateItem(item);
      }
      this.itemOpened(item);
      if (activatePane) {
        this.getActivePane().activate();
      }
      return item;
    }
  }, {
    key: 'openURIInPane',
    value: function openURIInPane(uri, pane) {
      return this.open(uri, { pane: pane });
    }

    // Public: Creates a new item that corresponds to the provided URI.
    //
    // If no URI is given, or no registered opener can open the URI, a new empty
    // {TextEditor} will be created.
    //
    // * `uri` A {String} containing a URI.
    //
    // Returns a {Promise} that resolves to the {TextEditor} (or other item) for the given URI.
  }, {
    key: 'createItemForURI',
    value: function createItemForURI(uri, options) {
      if (uri != null) {
        for (var _opener2 of this.getOpeners()) {
          var item = _opener2(uri, options);
          if (item != null) return Promise.resolve(item);
        }
      }

      try {
        return this.openTextFile(uri, options);
      } catch (error) {
        switch (error.code) {
          case 'CANCELLED':
            return Promise.resolve();
          case 'EACCES':
            this.notificationManager.addWarning('Permission denied \'' + error.path + '\'');
            return Promise.resolve();
          case 'EPERM':
          case 'EBUSY':
          case 'ENXIO':
          case 'EIO':
          case 'ENOTCONN':
          case 'UNKNOWN':
          case 'ECONNRESET':
          case 'EINVAL':
          case 'EMFILE':
          case 'ENOTDIR':
          case 'EAGAIN':
            this.notificationManager.addWarning('Unable to open \'' + (error.path != null ? error.path : uri) + '\'', { detail: error.message });
            return Promise.resolve();
          default:
            throw error;
        }
      }
    }
  }, {
    key: 'openTextFile',
    value: function openTextFile(uri, options) {
      var _this7 = this;

      var filePath = this.project.resolvePath(uri);

      if (filePath != null) {
        try {
          fs.closeSync(fs.openSync(filePath, 'r'));
        } catch (error) {
          // allow ENOENT errors to create an editor for paths that dont exist
          if (error.code !== 'ENOENT') {
            throw error;
          }
        }
      }

      var fileSize = fs.getSizeSync(filePath);

      var largeFileMode = fileSize >= 2 * 1048576; // 2MB
      if (fileSize >= this.config.get('core.warnOnLargeFileLimit') * 1048576) {
        // 20MB by default
        var choice = this.applicationDelegate.confirm({
          message: 'Atom will be unresponsive during the loading of very large files.',
          detailedMessage: 'Do you still want to load this file?',
          buttons: ['Proceed', 'Cancel']
        });
        if (choice === 1) {
          var error = new Error();
          error.code = 'CANCELLED';
          throw error;
        }
      }

      return this.project.bufferForPath(filePath, options).then(function (buffer) {
        return _this7.textEditorRegistry.build(Object.assign({ buffer: buffer, largeFileMode: largeFileMode, autoHeight: false }, options));
      });
    }
  }, {
    key: 'handleGrammarUsed',
    value: function handleGrammarUsed(grammar) {
      if (grammar == null) {
        return;
      }
      return this.packageManager.triggerActivationHook(grammar.packageName + ':grammar-used');
    }

    // Public: Returns a {Boolean} that is `true` if `object` is a `TextEditor`.
    //
    // * `object` An {Object} you want to perform the check against.
  }, {
    key: 'isTextEditor',
    value: function isTextEditor(object) {
      return object instanceof TextEditor;
    }

    // Extended: Create a new text editor.
    //
    // Returns a {TextEditor}.
  }, {
    key: 'buildTextEditor',
    value: function buildTextEditor(params) {
      var editor = this.textEditorRegistry.build(params);
      var subscriptions = new CompositeDisposable(this.textEditorRegistry.maintainGrammar(editor), this.textEditorRegistry.maintainConfig(editor));
      editor.onDidDestroy(function () {
        subscriptions.dispose();
      });
      return editor;
    }

    // Public: Asynchronously reopens the last-closed item's URI if it hasn't already been
    // reopened.
    //
    // Returns a {Promise} that is resolved when the item is opened
  }, {
    key: 'reopenItem',
    value: function reopenItem() {
      var uri = this.destroyedItemURIs.pop();
      if (uri) {
        return this.open(uri);
      } else {
        return Promise.resolve();
      }
    }

    // Public: Register an opener for a uri.
    //
    // When a URI is opened via {Workspace::open}, Atom loops through its registered
    // opener functions until one returns a value for the given uri.
    // Openers are expected to return an object that inherits from HTMLElement or
    // a model which has an associated view in the {ViewRegistry}.
    // A {TextEditor} will be used if no opener returns a value.
    //
    // ## Examples
    //
    // ```coffee
    // atom.workspace.addOpener (uri) ->
    //   if path.extname(uri) is '.toml'
    //     return new TomlEditor(uri)
    // ```
    //
    // * `opener` A {Function} to be called when a path is being opened.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to remove the
    // opener.
    //
    // Note that the opener will be called if and only if the URI is not already open
    // in the current pane. The searchAllPanes flag expands the search from the
    // current pane to all panes. If you wish to open a view of a different type for
    // a file that is already open, consider changing the protocol of the URI. For
    // example, perhaps you wish to preview a rendered version of the file `/foo/bar/baz.quux`
    // that is already open in a text editor view. You could signal this by calling
    // {Workspace::open} on the URI `quux-preview://foo/bar/baz.quux`. Then your opener
    // can check the protocol for quux-preview and only handle those URIs that match.
  }, {
    key: 'addOpener',
    value: function addOpener(opener) {
      var _this8 = this;

      this.openers.push(opener);
      return new Disposable(function () {
        _.remove(_this8.openers, opener);
      });
    }
  }, {
    key: 'getOpeners',
    value: function getOpeners() {
      return this.openers;
    }

    /*
    Section: Pane Items
    */

    // Essential: Get all pane items in the workspace.
    //
    // Returns an {Array} of items.
  }, {
    key: 'getPaneItems',
    value: function getPaneItems() {
      return _.flatten(this.getPaneContainers().map(function (container) {
        return container.getPaneItems();
      }));
    }

    // Essential: Get the active {Pane}'s active item.
    //
    // Returns an pane item {Object}.
  }, {
    key: 'getActivePaneItem',
    value: function getActivePaneItem() {
      return this.getActivePaneContainer().getActivePaneItem();
    }

    // Essential: Get all text editors in the workspace.
    //
    // Returns an {Array} of {TextEditor}s.
  }, {
    key: 'getTextEditors',
    value: function getTextEditors() {
      return this.getPaneItems().filter(function (item) {
        return item instanceof TextEditor;
      });
    }

    // Essential: Get the workspace center's active item if it is a {TextEditor}.
    //
    // Returns a {TextEditor} or `undefined` if the workspace center's current
    // active item is not a {TextEditor}.
  }, {
    key: 'getActiveTextEditor',
    value: function getActiveTextEditor() {
      var activeItem = this.getCenter().getActivePaneItem();
      if (activeItem instanceof TextEditor) {
        return activeItem;
      }
    }

    // Save all pane items.
  }, {
    key: 'saveAll',
    value: function saveAll() {
      this.getPaneContainers().forEach(function (container) {
        container.saveAll();
      });
    }
  }, {
    key: 'confirmClose',
    value: function confirmClose(options) {
      return Promise.all(this.getPaneContainers().map(function (container) {
        return container.confirmClose(options);
      })).then(function (results) {
        return !results.includes(false);
      });
    }

    // Save the active pane item.
    //
    // If the active pane item currently has a URI according to the item's
    // `.getURI` method, calls `.save` on the item. Otherwise
    // {::saveActivePaneItemAs} # will be called instead. This method does nothing
    // if the active item does not implement a `.save` method.
  }, {
    key: 'saveActivePaneItem',
    value: function saveActivePaneItem() {
      return this.getCenter().getActivePane().saveActiveItem();
    }

    // Prompt the user for a path and save the active pane item to it.
    //
    // Opens a native dialog where the user selects a path on disk, then calls
    // `.saveAs` on the item with the selected path. This method does nothing if
    // the active item does not implement a `.saveAs` method.
  }, {
    key: 'saveActivePaneItemAs',
    value: function saveActivePaneItemAs() {
      this.getCenter().getActivePane().saveActiveItemAs();
    }

    // Destroy (close) the active pane item.
    //
    // Removes the active pane item and calls the `.destroy` method on it if one is
    // defined.
  }, {
    key: 'destroyActivePaneItem',
    value: function destroyActivePaneItem() {
      return this.getActivePane().destroyActiveItem();
    }

    /*
    Section: Panes
    */

    // Extended: Get the most recently focused pane container.
    //
    // Returns a {Dock} or the {WorkspaceCenter}.
  }, {
    key: 'getActivePaneContainer',
    value: function getActivePaneContainer() {
      return this.activePaneContainer;
    }

    // Extended: Get all panes in the workspace.
    //
    // Returns an {Array} of {Pane}s.
  }, {
    key: 'getPanes',
    value: function getPanes() {
      return _.flatten(this.getPaneContainers().map(function (container) {
        return container.getPanes();
      }));
    }
  }, {
    key: 'getVisiblePanes',
    value: function getVisiblePanes() {
      return _.flatten(this.getVisiblePaneContainers().map(function (container) {
        return container.getPanes();
      }));
    }

    // Extended: Get the active {Pane}.
    //
    // Returns a {Pane}.
  }, {
    key: 'getActivePane',
    value: function getActivePane() {
      return this.getActivePaneContainer().getActivePane();
    }

    // Extended: Make the next pane active.
  }, {
    key: 'activateNextPane',
    value: function activateNextPane() {
      return this.getActivePaneContainer().activateNextPane();
    }

    // Extended: Make the previous pane active.
  }, {
    key: 'activatePreviousPane',
    value: function activatePreviousPane() {
      return this.getActivePaneContainer().activatePreviousPane();
    }

    // Extended: Get the first pane container that contains an item with the given
    // URI.
    //
    // * `uri` {String} uri
    //
    // Returns a {Dock}, the {WorkspaceCenter}, or `undefined` if no item exists
    // with the given URI.
  }, {
    key: 'paneContainerForURI',
    value: function paneContainerForURI(uri) {
      return this.getPaneContainers().find(function (container) {
        return container.paneForURI(uri);
      });
    }

    // Extended: Get the first pane container that contains the given item.
    //
    // * `item` the Item that the returned pane container must contain.
    //
    // Returns a {Dock}, the {WorkspaceCenter}, or `undefined` if no item exists
    // with the given URI.
  }, {
    key: 'paneContainerForItem',
    value: function paneContainerForItem(uri) {
      return this.getPaneContainers().find(function (container) {
        return container.paneForItem(uri);
      });
    }

    // Extended: Get the first {Pane} that contains an item with the given URI.
    //
    // * `uri` {String} uri
    //
    // Returns a {Pane} or `undefined` if no item exists with the given URI.
  }, {
    key: 'paneForURI',
    value: function paneForURI(uri) {
      for (var _location3 of this.getPaneContainers()) {
        var pane = _location3.paneForURI(uri);
        if (pane != null) {
          return pane;
        }
      }
    }

    // Extended: Get the {Pane} containing the given item.
    //
    // * `item` the Item that the returned pane must contain.
    //
    // Returns a {Pane} or `undefined` if no pane exists for the given item.
  }, {
    key: 'paneForItem',
    value: function paneForItem(item) {
      for (var _location4 of this.getPaneContainers()) {
        var pane = _location4.paneForItem(item);
        if (pane != null) {
          return pane;
        }
      }
    }

    // Destroy (close) the active pane.
  }, {
    key: 'destroyActivePane',
    value: function destroyActivePane() {
      var activePane = this.getActivePane();
      if (activePane != null) {
        activePane.destroy();
      }
    }

    // Close the active center pane item, or the active center pane if it is
    // empty, or the current window if there is only the empty root pane.
  }, {
    key: 'closeActivePaneItemOrEmptyPaneOrWindow',
    value: function closeActivePaneItemOrEmptyPaneOrWindow() {
      if (this.getCenter().getActivePaneItem() != null) {
        this.getCenter().getActivePane().destroyActiveItem();
      } else if (this.getCenter().getPanes().length > 1) {
        this.getCenter().destroyActivePane();
      } else if (this.config.get('core.closeEmptyWindows')) {
        atom.close();
      }
    }

    // Increase the editor font size by 1px.
  }, {
    key: 'increaseFontSize',
    value: function increaseFontSize() {
      this.config.set('editor.fontSize', this.config.get('editor.fontSize') + 1);
    }

    // Decrease the editor font size by 1px.
  }, {
    key: 'decreaseFontSize',
    value: function decreaseFontSize() {
      var fontSize = this.config.get('editor.fontSize');
      if (fontSize > 1) {
        this.config.set('editor.fontSize', fontSize - 1);
      }
    }

    // Restore to the window's original editor font size.
  }, {
    key: 'resetFontSize',
    value: function resetFontSize() {
      if (this.originalFontSize) {
        this.config.set('editor.fontSize', this.originalFontSize);
      }
    }
  }, {
    key: 'subscribeToFontSize',
    value: function subscribeToFontSize() {
      var _this9 = this;

      return this.config.onDidChange('editor.fontSize', function (_ref6) {
        var oldValue = _ref6.oldValue;

        if (_this9.originalFontSize == null) {
          _this9.originalFontSize = oldValue;
        }
      });
    }

    // Removes the item's uri from the list of potential items to reopen.
  }, {
    key: 'itemOpened',
    value: function itemOpened(item) {
      var uri = undefined;
      if (typeof item.getURI === 'function') {
        uri = item.getURI();
      } else if (typeof item.getUri === 'function') {
        uri = item.getUri();
      }

      if (uri != null) {
        _.remove(this.destroyedItemURIs, uri);
      }
    }

    // Adds the destroyed item's uri to the list of items to reopen.
  }, {
    key: 'didDestroyPaneItem',
    value: function didDestroyPaneItem(_ref7) {
      var item = _ref7.item;

      var uri = undefined;
      if (typeof item.getURI === 'function') {
        uri = item.getURI();
      } else if (typeof item.getUri === 'function') {
        uri = item.getUri();
      }

      if (uri != null) {
        this.destroyedItemURIs.push(uri);
      }
    }

    // Called by Model superclass when destroyed
  }, {
    key: 'destroyed',
    value: function destroyed() {
      this.paneContainers.center.destroy();
      this.paneContainers.left.destroy();
      this.paneContainers.right.destroy();
      this.paneContainers.bottom.destroy();
      this.cancelStoppedChangingActivePaneItemTimeout();
      if (this.activeItemSubscriptions != null) {
        this.activeItemSubscriptions.dispose();
      }
    }

    /*
    Section: Pane Locations
    */

    // Essential: Get the {WorkspaceCenter} at the center of the editor window.
  }, {
    key: 'getCenter',
    value: function getCenter() {
      return this.paneContainers.center;
    }

    // Essential: Get the {Dock} to the left of the editor window.
  }, {
    key: 'getLeftDock',
    value: function getLeftDock() {
      return this.paneContainers.left;
    }

    // Essential: Get the {Dock} to the right of the editor window.
  }, {
    key: 'getRightDock',
    value: function getRightDock() {
      return this.paneContainers.right;
    }

    // Essential: Get the {Dock} below the editor window.
  }, {
    key: 'getBottomDock',
    value: function getBottomDock() {
      return this.paneContainers.bottom;
    }
  }, {
    key: 'getPaneContainers',
    value: function getPaneContainers() {
      return [this.paneContainers.center, this.paneContainers.left, this.paneContainers.right, this.paneContainers.bottom];
    }
  }, {
    key: 'getVisiblePaneContainers',
    value: function getVisiblePaneContainers() {
      var center = this.getCenter();
      return atom.workspace.getPaneContainers().filter(function (container) {
        return container === center || container.isVisible();
      });
    }

    /*
    Section: Panels
     Panels are used to display UI related to an editor window. They are placed at one of the four
    edges of the window: left, right, top or bottom. If there are multiple panels on the same window
    edge they are stacked in order of priority: higher priority is closer to the center, lower
    priority towards the edge.
     *Note:* If your panel changes its size throughout its lifetime, consider giving it a higher
    priority, allowing fixed size panels to be closer to the edge. This allows control targets to
    remain more static for easier targeting by users that employ mice or trackpads. (See
    [atom/atom#4834](https://github.com/atom/atom/issues/4834) for discussion.)
    */

    // Essential: Get an {Array} of all the panel items at the bottom of the editor window.
  }, {
    key: 'getBottomPanels',
    value: function getBottomPanels() {
      return this.getPanels('bottom');
    }

    // Essential: Adds a panel item to the bottom of the editor window.
    //
    // * `options` {Object}
    //   * `item` Your panel content. It can be DOM element, a jQuery element, or
    //     a model with a view registered via {ViewRegistry::addViewProvider}. We recommend the
    //     latter. See {ViewRegistry::addViewProvider} for more information.
    //   * `visible` (optional) {Boolean} false if you want the panel to initially be hidden
    //     (default: true)
    //   * `priority` (optional) {Number} Determines stacking order. Lower priority items are
    //     forced closer to the edges of the window. (default: 100)
    //
    // Returns a {Panel}
  }, {
    key: 'addBottomPanel',
    value: function addBottomPanel(options) {
      return this.addPanel('bottom', options);
    }

    // Essential: Get an {Array} of all the panel items to the left of the editor window.
  }, {
    key: 'getLeftPanels',
    value: function getLeftPanels() {
      return this.getPanels('left');
    }

    // Essential: Adds a panel item to the left of the editor window.
    //
    // * `options` {Object}
    //   * `item` Your panel content. It can be DOM element, a jQuery element, or
    //     a model with a view registered via {ViewRegistry::addViewProvider}. We recommend the
    //     latter. See {ViewRegistry::addViewProvider} for more information.
    //   * `visible` (optional) {Boolean} false if you want the panel to initially be hidden
    //     (default: true)
    //   * `priority` (optional) {Number} Determines stacking order. Lower priority items are
    //     forced closer to the edges of the window. (default: 100)
    //
    // Returns a {Panel}
  }, {
    key: 'addLeftPanel',
    value: function addLeftPanel(options) {
      return this.addPanel('left', options);
    }

    // Essential: Get an {Array} of all the panel items to the right of the editor window.
  }, {
    key: 'getRightPanels',
    value: function getRightPanels() {
      return this.getPanels('right');
    }

    // Essential: Adds a panel item to the right of the editor window.
    //
    // * `options` {Object}
    //   * `item` Your panel content. It can be DOM element, a jQuery element, or
    //     a model with a view registered via {ViewRegistry::addViewProvider}. We recommend the
    //     latter. See {ViewRegistry::addViewProvider} for more information.
    //   * `visible` (optional) {Boolean} false if you want the panel to initially be hidden
    //     (default: true)
    //   * `priority` (optional) {Number} Determines stacking order. Lower priority items are
    //     forced closer to the edges of the window. (default: 100)
    //
    // Returns a {Panel}
  }, {
    key: 'addRightPanel',
    value: function addRightPanel(options) {
      return this.addPanel('right', options);
    }

    // Essential: Get an {Array} of all the panel items at the top of the editor window.
  }, {
    key: 'getTopPanels',
    value: function getTopPanels() {
      return this.getPanels('top');
    }

    // Essential: Adds a panel item to the top of the editor window above the tabs.
    //
    // * `options` {Object}
    //   * `item` Your panel content. It can be DOM element, a jQuery element, or
    //     a model with a view registered via {ViewRegistry::addViewProvider}. We recommend the
    //     latter. See {ViewRegistry::addViewProvider} for more information.
    //   * `visible` (optional) {Boolean} false if you want the panel to initially be hidden
    //     (default: true)
    //   * `priority` (optional) {Number} Determines stacking order. Lower priority items are
    //     forced closer to the edges of the window. (default: 100)
    //
    // Returns a {Panel}
  }, {
    key: 'addTopPanel',
    value: function addTopPanel(options) {
      return this.addPanel('top', options);
    }

    // Essential: Get an {Array} of all the panel items in the header.
  }, {
    key: 'getHeaderPanels',
    value: function getHeaderPanels() {
      return this.getPanels('header');
    }

    // Essential: Adds a panel item to the header.
    //
    // * `options` {Object}
    //   * `item` Your panel content. It can be DOM element, a jQuery element, or
    //     a model with a view registered via {ViewRegistry::addViewProvider}. We recommend the
    //     latter. See {ViewRegistry::addViewProvider} for more information.
    //   * `visible` (optional) {Boolean} false if you want the panel to initially be hidden
    //     (default: true)
    //   * `priority` (optional) {Number} Determines stacking order. Lower priority items are
    //     forced closer to the edges of the window. (default: 100)
    //
    // Returns a {Panel}
  }, {
    key: 'addHeaderPanel',
    value: function addHeaderPanel(options) {
      return this.addPanel('header', options);
    }

    // Essential: Get an {Array} of all the panel items in the footer.
  }, {
    key: 'getFooterPanels',
    value: function getFooterPanels() {
      return this.getPanels('footer');
    }

    // Essential: Adds a panel item to the footer.
    //
    // * `options` {Object}
    //   * `item` Your panel content. It can be DOM element, a jQuery element, or
    //     a model with a view registered via {ViewRegistry::addViewProvider}. We recommend the
    //     latter. See {ViewRegistry::addViewProvider} for more information.
    //   * `visible` (optional) {Boolean} false if you want the panel to initially be hidden
    //     (default: true)
    //   * `priority` (optional) {Number} Determines stacking order. Lower priority items are
    //     forced closer to the edges of the window. (default: 100)
    //
    // Returns a {Panel}
  }, {
    key: 'addFooterPanel',
    value: function addFooterPanel(options) {
      return this.addPanel('footer', options);
    }

    // Essential: Get an {Array} of all the modal panel items
  }, {
    key: 'getModalPanels',
    value: function getModalPanels() {
      return this.getPanels('modal');
    }

    // Essential: Adds a panel item as a modal dialog.
    //
    // * `options` {Object}
    //   * `item` Your panel content. It can be a DOM element, a jQuery element, or
    //     a model with a view registered via {ViewRegistry::addViewProvider}. We recommend the
    //     model option. See {ViewRegistry::addViewProvider} for more information.
    //   * `visible` (optional) {Boolean} false if you want the panel to initially be hidden
    //     (default: true)
    //   * `priority` (optional) {Number} Determines stacking order. Lower priority items are
    //     forced closer to the edges of the window. (default: 100)
    //   * `autoFocus` (optional) {Boolean} true if you want modal focus managed for you by Atom.
    //     Atom will automatically focus your modal panel's first tabbable element when the modal
    //     opens and will restore the previously selected element when the modal closes. Atom will
    //     also automatically restrict user tab focus within your modal while it is open.
    //     (default: false)
    //
    // Returns a {Panel}
  }, {
    key: 'addModalPanel',
    value: function addModalPanel() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return this.addPanel('modal', options);
    }

    // Essential: Returns the {Panel} associated with the given item. Returns
    // `null` when the item has no panel.
    //
    // * `item` Item the panel contains
  }, {
    key: 'panelForItem',
    value: function panelForItem(item) {
      for (var _location5 in this.panelContainers) {
        var container = this.panelContainers[_location5];
        var panel = container.panelForItem(item);
        if (panel != null) {
          return panel;
        }
      }
      return null;
    }
  }, {
    key: 'getPanels',
    value: function getPanels(location) {
      return this.panelContainers[location].getPanels();
    }
  }, {
    key: 'addPanel',
    value: function addPanel(location, options) {
      if (options == null) {
        options = {};
      }
      return this.panelContainers[location].addPanel(new Panel(options, this.viewRegistry));
    }

    /*
    Section: Searching and Replacing
    */

    // Public: Performs a search across all files in the workspace.
    //
    // * `regex` {RegExp} to search with.
    // * `options` (optional) {Object}
    //   * `paths` An {Array} of glob patterns to search within.
    //   * `onPathsSearched` (optional) {Function} to be periodically called
    //     with number of paths searched.
    //   * `leadingContextLineCount` {Number} default `0`; The number of lines
    //      before the matched line to include in the results object.
    //   * `trailingContextLineCount` {Number} default `0`; The number of lines
    //      after the matched line to include in the results object.
    // * `iterator` {Function} callback on each file found.
    //
    // Returns a {Promise} with a `cancel()` method that will cancel all
    // of the underlying searches that were started as part of this scan.
  }, {
    key: 'scan',
    value: function scan(regex, options, iterator) {
      var _this10 = this;

      if (options === undefined) options = {};

      if (_.isFunction(options)) {
        iterator = options;
        options = {};
      }

      // Find a searcher for every Directory in the project. Each searcher that is matched
      // will be associated with an Array of Directory objects in the Map.
      var directoriesForSearcher = new Map();
      for (var directory of this.project.getDirectories()) {
        var searcher = this.defaultDirectorySearcher;
        for (var directorySearcher of this.directorySearchers) {
          if (directorySearcher.canSearchDirectory(directory)) {
            searcher = directorySearcher;
            break;
          }
        }
        var directories = directoriesForSearcher.get(searcher);
        if (!directories) {
          directories = [];
          directoriesForSearcher.set(searcher, directories);
        }
        directories.push(directory);
      }

      // Define the onPathsSearched callback.
      var onPathsSearched = undefined;
      if (_.isFunction(options.onPathsSearched)) {
        (function () {
          // Maintain a map of directories to the number of search results. When notified of a new count,
          // replace the entry in the map and update the total.
          var onPathsSearchedOption = options.onPathsSearched;
          var totalNumberOfPathsSearched = 0;
          var numberOfPathsSearchedForSearcher = new Map();
          onPathsSearched = function (searcher, numberOfPathsSearched) {
            var oldValue = numberOfPathsSearchedForSearcher.get(searcher);
            if (oldValue) {
              totalNumberOfPathsSearched -= oldValue;
            }
            numberOfPathsSearchedForSearcher.set(searcher, numberOfPathsSearched);
            totalNumberOfPathsSearched += numberOfPathsSearched;
            return onPathsSearchedOption(totalNumberOfPathsSearched);
          };
        })();
      } else {
        onPathsSearched = function () {};
      }

      // Kick off all of the searches and unify them into one Promise.
      var allSearches = [];
      directoriesForSearcher.forEach(function (directories, searcher) {
        var searchOptions = {
          inclusions: options.paths || [],
          includeHidden: true,
          excludeVcsIgnores: _this10.config.get('core.excludeVcsIgnoredPaths'),
          exclusions: _this10.config.get('core.ignoredNames'),
          follow: _this10.config.get('core.followSymlinks'),
          leadingContextLineCount: options.leadingContextLineCount || 0,
          trailingContextLineCount: options.trailingContextLineCount || 0,
          didMatch: function didMatch(result) {
            if (!_this10.project.isPathModified(result.filePath)) {
              return iterator(result);
            }
          },
          didError: function didError(error) {
            return iterator(null, error);
          },
          didSearchPaths: function didSearchPaths(count) {
            return onPathsSearched(searcher, count);
          }
        };
        var directorySearcher = searcher.search(directories, regex, searchOptions);
        allSearches.push(directorySearcher);
      });
      var searchPromise = Promise.all(allSearches);

      for (var buffer of this.project.getBuffers()) {
        if (buffer.isModified()) {
          var filePath = buffer.getPath();
          if (!this.project.contains(filePath)) {
            continue;
          }
          var matches = [];
          buffer.scan(regex, function (match) {
            return matches.push(match);
          });
          if (matches.length > 0) {
            iterator({ filePath: filePath, matches: matches });
          }
        }
      }

      // Make sure the Promise that is returned to the client is cancelable. To be consistent
      // with the existing behavior, instead of cancel() rejecting the promise, it should
      // resolve it with the special value 'cancelled'. At least the built-in find-and-replace
      // package relies on this behavior.
      var isCancelled = false;
      var cancellablePromise = new Promise(function (resolve, reject) {
        var onSuccess = function onSuccess() {
          if (isCancelled) {
            resolve('cancelled');
          } else {
            resolve(null);
          }
        };

        var onFailure = function onFailure() {
          for (var promise of allSearches) {
            promise.cancel();
          }
          reject();
        };

        searchPromise.then(onSuccess, onFailure);
      });
      cancellablePromise.cancel = function () {
        isCancelled = true;
        // Note that cancelling all of the members of allSearches will cause all of the searches
        // to resolve, which causes searchPromise to resolve, which is ultimately what causes
        // cancellablePromise to resolve.
        allSearches.map(function (promise) {
          return promise.cancel();
        });
      };

      // Although this method claims to return a `Promise`, the `ResultsPaneView.onSearch()`
      // method in the find-and-replace package expects the object returned by this method to have a
      // `done()` method. Include a done() method until find-and-replace can be updated.
      cancellablePromise.done = function (onSuccessOrFailure) {
        cancellablePromise.then(onSuccessOrFailure, onSuccessOrFailure);
      };
      return cancellablePromise;
    }

    // Public: Performs a replace across all the specified files in the project.
    //
    // * `regex` A {RegExp} to search with.
    // * `replacementText` {String} to replace all matches of regex with.
    // * `filePaths` An {Array} of file path strings to run the replace on.
    // * `iterator` A {Function} callback on each file with replacements:
    //   * `options` {Object} with keys `filePath` and `replacements`.
    //
    // Returns a {Promise}.
  }, {
    key: 'replace',
    value: function replace(regex, replacementText, filePaths, iterator) {
      var _this11 = this;

      return new Promise(function (resolve, reject) {
        var buffer = undefined;
        var openPaths = _this11.project.getBuffers().map(function (buffer) {
          return buffer.getPath();
        });
        var outOfProcessPaths = _.difference(filePaths, openPaths);

        var inProcessFinished = !openPaths.length;
        var outOfProcessFinished = !outOfProcessPaths.length;
        var checkFinished = function checkFinished() {
          if (outOfProcessFinished && inProcessFinished) {
            resolve();
          }
        };

        if (!outOfProcessFinished.length) {
          var flags = 'g';
          if (regex.multiline) {
            flags += 'm';
          }
          if (regex.ignoreCase) {
            flags += 'i';
          }

          var task = Task.once(require.resolve('./replace-handler'), outOfProcessPaths, regex.source, flags, replacementText, function () {
            outOfProcessFinished = true;
            checkFinished();
          });

          task.on('replace:path-replaced', iterator);
          task.on('replace:file-error', function (error) {
            iterator(null, error);
          });
        }

        for (buffer of _this11.project.getBuffers()) {
          if (!filePaths.includes(buffer.getPath())) {
            continue;
          }
          var replacements = buffer.replace(regex, replacementText, iterator);
          if (replacements) {
            iterator({ filePath: buffer.getPath(), replacements: replacements });
          }
        }

        inProcessFinished = true;
        checkFinished();
      });
    }
  }, {
    key: 'checkoutHeadRevision',
    value: function checkoutHeadRevision(editor) {
      var _this12 = this;

      if (editor.getPath()) {
        var checkoutHead = function checkoutHead() {
          return _this12.project.repositoryForDirectory(new Directory(editor.getDirectoryPath())).then(function (repository) {
            return repository && repository.checkoutHeadForEditor(editor);
          });
        };

        if (this.config.get('editor.confirmCheckoutHeadRevision')) {
          this.applicationDelegate.confirm({
            message: 'Confirm Checkout HEAD Revision',
            detailedMessage: 'Are you sure you want to discard all changes to "' + editor.getFileName() + '" since the last Git commit?',
            buttons: {
              OK: checkoutHead,
              Cancel: null
            }
          });
        } else {
          return checkoutHead();
        }
      } else {
        return Promise.resolve(false);
      }
    }
  }, {
    key: 'paneContainer',
    get: function get() {
      Grim.deprecate('`atom.workspace.paneContainer` has always been private, but it is now gone. Please use `atom.workspace.getCenter()` instead and consult the workspace API docs for public methods.');
      return this.paneContainers.center.paneContainer;
    }
  }]);

  return Workspace;
})(Model);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RyYXZpcy9idWlsZC9hdG9tL2F0b20vb3V0L2FwcC9zcmMvd29ya3NwYWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7QUFFWCxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQzs7QUFFcEMsSUFBSSxZQUFZLEdBQUcsQ0FBQyxZQUFZO0FBQUUsV0FBUyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFO0FBQUUsU0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFBRSxVQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQUFBQyxVQUFVLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDLEFBQUMsVUFBVSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsQUFBQyxJQUFJLE9BQU8sSUFBSSxVQUFVLEVBQUUsVUFBVSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsQUFBQyxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0tBQUU7R0FBRSxBQUFDLE9BQU8sVUFBVSxXQUFXLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRTtBQUFFLFFBQUksVUFBVSxFQUFFLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUMsQUFBQyxJQUFJLFdBQVcsRUFBRSxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUMsQUFBQyxPQUFPLFdBQVcsQ0FBQztHQUFFLENBQUM7Q0FBRSxDQUFBLEVBQUcsQ0FBQzs7QUFFdGpCLElBQUksSUFBSSxHQUFHLFNBQVMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFO0FBQUUsTUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEFBQUMsU0FBUyxFQUFFLE9BQU8sTUFBTSxFQUFFO0FBQUUsUUFBSSxNQUFNLEdBQUcsR0FBRztRQUFFLFFBQVEsR0FBRyxHQUFHO1FBQUUsUUFBUSxHQUFHLEdBQUcsQ0FBQyxBQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsQUFBQyxJQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUUsTUFBTSxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsQUFBQyxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsd0JBQXdCLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEFBQUMsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO0FBQUUsVUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxBQUFDLElBQUksTUFBTSxLQUFLLElBQUksRUFBRTtBQUFFLGVBQU8sU0FBUyxDQUFDO09BQUUsTUFBTTtBQUFFLFdBQUcsR0FBRyxNQUFNLENBQUMsQUFBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLEFBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxBQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsQUFBQyxJQUFJLEdBQUcsTUFBTSxHQUFHLFNBQVMsQ0FBQyxBQUFDLFNBQVMsU0FBUyxDQUFDO09BQUU7S0FBRSxNQUFNLElBQUksT0FBTyxJQUFJLElBQUksRUFBRTtBQUFFLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztLQUFFLE1BQU07QUFBRSxVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEFBQUMsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFO0FBQUUsZUFBTyxTQUFTLENBQUM7T0FBRSxBQUFDLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUFFO0dBQUU7Q0FBRSxDQUFDOztBQUVycEIsU0FBUyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUU7QUFBRSxNQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFBRSxTQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEFBQUMsT0FBTyxJQUFJLENBQUM7R0FBRSxNQUFNO0FBQUUsV0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQUU7Q0FBRTs7QUFFL0wsU0FBUyxpQkFBaUIsQ0FBQyxFQUFFLEVBQUU7QUFBRSxTQUFPLFlBQVk7QUFBRSxRQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxBQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQUUsVUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsQUFBQyxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxBQUFDLFNBQVMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUU7QUFBRSxZQUFJO0FBQUUsY0FBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEFBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztTQUFFLENBQUMsT0FBTyxLQUFLLEVBQUU7QUFBRSxnQkFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEFBQUMsT0FBTztTQUFFLEFBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQUUsaUJBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUFFLE1BQU07QUFBRSxpQkFBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFNBQVMs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QkEvU2tCLFVBQVUsSUFBSSxVQUFVLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUE7V0FBQSxDQUFDLENBQUE7U0FDOUUsQ0FBQTs7QUFFRCxZQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxDQUFDLEVBQUU7QUFDekQsY0FBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQztBQUMvQixtQkFBTyxFQUFFLGdDQUFnQztBQUN6QywyQkFBZSxFQUFBLG1EQUFBLEdBQXNELE1BQU0sQ0FBQyxXQUFXLEVBQUUsR0FBQSw4QkFBOEI7QUFDdkgsbUJBQU8sRUFBRTtBQUNQLGdCQUFFLEVBQUUsWUFBWTtBQUNoQixvQkFBTSxFQUFFLElBQUk7YUFDYjtXQUNGLENBQUMsQ0FBQTtTQUNILE1BQU07QUFDTCxpQkFBTyxZQUFZLEVBQUUsQ0FBQTtTQUN0QjtPQUNGLE1BQU07QUFDTCxlQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7T0FDOUI7S0FDRjtHQWlUQSxFQUFFO0FBQ0QsT0FBRyxFQUFFLGVBQWU7QUFDcEIsT0FBRyxFQXZpRWEsU0FBQSxHQUFBLEdBQUc7QUFDbkIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxvTEFBb0wsQ0FBQyxDQUFBO0FBQ3BNLGFBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFBO0tBQ2hEO0dBd2lFQSxDQUFDLENBQUMsQ0FBQzs7QUFFSixTQXJtRXFCLFNBQVMsQ0FBQTtDQXNtRS9CLENBQUEsQ0F0bUV3QyxLQUFLLENBNnlEN0MsQ0FBQSIsImZpbGUiOiIvaG9tZS90cmF2aXMvYnVpbGQvYXRvbS9hdG9tL291dC9hcHAvc3JjL3dvcmtzcGFjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmNvbnN0IF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlLXBsdXMnKVxuY29uc3QgdXJsID0gcmVxdWlyZSgndXJsJylcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbmNvbnN0IHtFbWl0dGVyLCBEaXNwb3NhYmxlLCBDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUoJ2V2ZW50LWtpdCcpXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzLXBsdXMnKVxuY29uc3Qge0RpcmVjdG9yeX0gPSByZXF1aXJlKCdwYXRod2F0Y2hlcicpXG5jb25zdCBHcmltID0gcmVxdWlyZSgnZ3JpbScpXG5jb25zdCBEZWZhdWx0RGlyZWN0b3J5U2VhcmNoZXIgPSByZXF1aXJlKCcuL2RlZmF1bHQtZGlyZWN0b3J5LXNlYXJjaGVyJylcbmNvbnN0IERvY2sgPSByZXF1aXJlKCcuL2RvY2snKVxuY29uc3QgTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJylcbmNvbnN0IFN0YXRlU3RvcmUgPSByZXF1aXJlKCcuL3N0YXRlLXN0b3JlJylcbmNvbnN0IFRleHRFZGl0b3IgPSByZXF1aXJlKCcuL3RleHQtZWRpdG9yJylcbmNvbnN0IFBhbmVsID0gcmVxdWlyZSgnLi9wYW5lbCcpXG5jb25zdCBQYW5lbENvbnRhaW5lciA9IHJlcXVpcmUoJy4vcGFuZWwtY29udGFpbmVyJylcbmNvbnN0IFRhc2sgPSByZXF1aXJlKCcuL3Rhc2snKVxuY29uc3QgV29ya3NwYWNlQ2VudGVyID0gcmVxdWlyZSgnLi93b3Jrc3BhY2UtY2VudGVyJylcbmNvbnN0IFdvcmtzcGFjZUVsZW1lbnQgPSByZXF1aXJlKCcuL3dvcmtzcGFjZS1lbGVtZW50JylcblxuY29uc3QgU1RPUFBFRF9DSEFOR0lOR19BQ1RJVkVfUEFORV9JVEVNX0RFTEFZID0gMTAwXG5jb25zdCBBTExfTE9DQVRJT05TID0gWydjZW50ZXInLCAnbGVmdCcsICdyaWdodCcsICdib3R0b20nXVxuXG4vLyBFc3NlbnRpYWw6IFJlcHJlc2VudHMgdGhlIHN0YXRlIG9mIHRoZSB1c2VyIGludGVyZmFjZSBmb3IgdGhlIGVudGlyZSB3aW5kb3cuXG4vLyBBbiBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGlzIGF2YWlsYWJsZSB2aWEgdGhlIGBhdG9tLndvcmtzcGFjZWAgZ2xvYmFsLlxuLy9cbi8vIEludGVyYWN0IHdpdGggdGhpcyBvYmplY3QgdG8gb3BlbiBmaWxlcywgYmUgbm90aWZpZWQgb2YgY3VycmVudCBhbmQgZnV0dXJlXG4vLyBlZGl0b3JzLCBhbmQgbWFuaXB1bGF0ZSBwYW5lcy4gVG8gYWRkIHBhbmVscywgdXNlIHtXb3Jrc3BhY2U6OmFkZFRvcFBhbmVsfVxuLy8gYW5kIGZyaWVuZHMuXG4vL1xuLy8gIyMgV29ya3NwYWNlIEl0ZW1zXG4vL1xuLy8gVGhlIHRlcm0gXCJpdGVtXCIgcmVmZXJzIHRvIGFueXRoaW5nIHRoYXQgY2FuIGJlIGRpc3BsYXllZFxuLy8gaW4gYSBwYW5lIHdpdGhpbiB0aGUgd29ya3NwYWNlLCBlaXRoZXIgaW4gdGhlIHtXb3Jrc3BhY2VDZW50ZXJ9IG9yIGluIG9uZVxuLy8gb2YgdGhlIHRocmVlIHtEb2NrfXMuIFRoZSB3b3Jrc3BhY2UgZXhwZWN0cyBpdGVtcyB0byBjb25mb3JtIHRvIHRoZVxuLy8gZm9sbG93aW5nIGludGVyZmFjZTpcbi8vXG4vLyAjIyMgUmVxdWlyZWQgTWV0aG9kc1xuLy9cbi8vICMjIyMgYGdldFRpdGxlKClgXG4vL1xuLy8gUmV0dXJucyBhIHtTdHJpbmd9IGNvbnRhaW5pbmcgdGhlIHRpdGxlIG9mIHRoZSBpdGVtIHRvIGRpc3BsYXkgb24gaXRzXG4vLyBhc3NvY2lhdGVkIHRhYi5cbi8vXG4vLyAjIyMgT3B0aW9uYWwgTWV0aG9kc1xuLy9cbi8vICMjIyMgYGdldEVsZW1lbnQoKWBcbi8vXG4vLyBJZiB5b3VyIGl0ZW0gYWxyZWFkeSAqaXMqIGEgRE9NIGVsZW1lbnQsIHlvdSBkbyBub3QgbmVlZCB0byBpbXBsZW1lbnQgdGhpc1xuLy8gbWV0aG9kLiBPdGhlcndpc2UgaXQgc2hvdWxkIHJldHVybiB0aGUgZWxlbWVudCB5b3Ugd2FudCB0byBkaXNwbGF5IHRvXG4vLyByZXByZXNlbnQgdGhpcyBpdGVtLlxuLy9cbi8vICMjIyMgYGRlc3Ryb3koKWBcbi8vXG4vLyBEZXN0cm95cyB0aGUgaXRlbS4gVGhpcyB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSBpdGVtIGlzIHJlbW92ZWQgZnJvbSBpdHNcbi8vIHBhcmVudCBwYW5lLlxuLy9cbi8vICMjIyMgYG9uRGlkRGVzdHJveShjYWxsYmFjaylgXG4vL1xuLy8gQ2FsbGVkIGJ5IHRoZSB3b3Jrc3BhY2Ugc28gaXQgY2FuIGJlIG5vdGlmaWVkIHdoZW4gdGhlIGl0ZW0gaXMgZGVzdHJveWVkLlxuLy8gTXVzdCByZXR1cm4gYSB7RGlzcG9zYWJsZX0uXG4vL1xuLy8gIyMjIyBgc2VyaWFsaXplKClgXG4vL1xuLy8gU2VyaWFsaXplIHRoZSBzdGF0ZSBvZiB0aGUgaXRlbS4gTXVzdCByZXR1cm4gYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHBhc3NlZCB0b1xuLy8gYEpTT04uc3RyaW5naWZ5YC4gVGhlIHN0YXRlIHNob3VsZCBpbmNsdWRlIGEgZmllbGQgY2FsbGVkIGBkZXNlcmlhbGl6ZXJgLFxuLy8gd2hpY2ggbmFtZXMgYSBkZXNlcmlhbGl6ZXIgZGVjbGFyZWQgaW4geW91ciBgcGFja2FnZS5qc29uYC4gVGhpcyBtZXRob2QgaXNcbi8vIGludm9rZWQgb24gaXRlbXMgd2hlbiBzZXJpYWxpemluZyB0aGUgd29ya3NwYWNlIHNvIHRoZXkgY2FuIGJlIHJlc3RvcmVkIHRvXG4vLyB0aGUgc2FtZSBsb2NhdGlvbiBsYXRlci5cbi8vXG4vLyAjIyMjIGBnZXRVUkkoKWBcbi8vXG4vLyBSZXR1cm5zIHRoZSBVUkkgYXNzb2NpYXRlZCB3aXRoIHRoZSBpdGVtLlxuLy9cbi8vICMjIyMgYGdldExvbmdUaXRsZSgpYFxuLy9cbi8vIFJldHVybnMgYSB7U3RyaW5nfSBjb250YWluaW5nIGEgbG9uZ2VyIHZlcnNpb24gb2YgdGhlIHRpdGxlIHRvIGRpc3BsYXkgaW5cbi8vIHBsYWNlcyBsaWtlIHRoZSB3aW5kb3cgdGl0bGUgb3Igb24gdGFicyB0aGVpciBzaG9ydCB0aXRsZXMgYXJlIGFtYmlndW91cy5cbi8vXG4vLyAjIyMjIGBvbkRpZENoYW5nZVRpdGxlYFxuLy9cbi8vIENhbGxlZCBieSB0aGUgd29ya3NwYWNlIHNvIGl0IGNhbiBiZSBub3RpZmllZCB3aGVuIHRoZSBpdGVtJ3MgdGl0bGUgY2hhbmdlcy5cbi8vIE11c3QgcmV0dXJuIGEge0Rpc3Bvc2FibGV9LlxuLy9cbi8vICMjIyMgYGdldEljb25OYW1lKClgXG4vL1xuLy8gUmV0dXJuIGEge1N0cmluZ30gd2l0aCB0aGUgbmFtZSBvZiBhbiBpY29uLiBJZiB0aGlzIG1ldGhvZCBpcyBkZWZpbmVkIGFuZFxuLy8gcmV0dXJucyBhIHN0cmluZywgdGhlIGl0ZW0ncyB0YWIgZWxlbWVudCB3aWxsIGJlIHJlbmRlcmVkIHdpdGggdGhlIGBpY29uYCBhbmRcbi8vIGBpY29uLSR7aWNvbk5hbWV9YCBDU1MgY2xhc3Nlcy5cbi8vXG4vLyAjIyMgYG9uRGlkQ2hhbmdlSWNvbihjYWxsYmFjaylgXG4vL1xuLy8gQ2FsbGVkIGJ5IHRoZSB3b3Jrc3BhY2Ugc28gaXQgY2FuIGJlIG5vdGlmaWVkIHdoZW4gdGhlIGl0ZW0ncyBpY29uIGNoYW5nZXMuXG4vLyBNdXN0IHJldHVybiBhIHtEaXNwb3NhYmxlfS5cbi8vXG4vLyAjIyMjIGBnZXREZWZhdWx0TG9jYXRpb24oKWBcbi8vXG4vLyBUZWxscyB0aGUgd29ya3NwYWNlIHdoZXJlIHlvdXIgaXRlbSBzaG91bGQgYmUgb3BlbmVkIGluIGFic2VuY2Ugb2YgYSB1c2VyXG4vLyBvdmVycmlkZS4gSXRlbXMgY2FuIGFwcGVhciBpbiB0aGUgY2VudGVyIG9yIGluIGEgZG9jayBvbiB0aGUgbGVmdCwgcmlnaHQsIG9yXG4vLyBib3R0b20gb2YgdGhlIHdvcmtzcGFjZS5cbi8vXG4vLyBSZXR1cm5zIGEge1N0cmluZ30gd2l0aCBvbmUgb2YgdGhlIGZvbGxvd2luZyB2YWx1ZXM6IGAnY2VudGVyJ2AsIGAnbGVmdCdgLFxuLy8gYCdyaWdodCdgLCBgJ2JvdHRvbSdgLiBJZiB0aGlzIG1ldGhvZCBpcyBub3QgZGVmaW5lZCwgYCdjZW50ZXInYCBpcyB0aGVcbi8vIGRlZmF1bHQuXG4vL1xuLy8gIyMjIyBgZ2V0QWxsb3dlZExvY2F0aW9ucygpYFxuLy9cbi8vIFRlbGxzIHRoZSB3b3Jrc3BhY2Ugd2hlcmUgdGhpcyBpdGVtIGNhbiBiZSBtb3ZlZC4gUmV0dXJucyBhbiB7QXJyYXl9IG9mIG9uZVxuLy8gb3IgbW9yZSBvZiB0aGUgZm9sbG93aW5nIHZhbHVlczogYCdjZW50ZXInYCwgYCdsZWZ0J2AsIGAncmlnaHQnYCwgb3Jcbi8vIGAnYm90dG9tJ2AuXG4vL1xuLy8gIyMjIyBgaXNQZXJtYW5lbnREb2NrSXRlbSgpYFxuLy9cbi8vIFRlbGxzIHRoZSB3b3Jrc3BhY2Ugd2hldGhlciBvciBub3QgdGhpcyBpdGVtIGNhbiBiZSBjbG9zZWQgYnkgdGhlIHVzZXIgYnlcbi8vIGNsaWNraW5nIGFuIGB4YCBvbiBpdHMgdGFiLiBVc2Ugb2YgdGhpcyBmZWF0dXJlIGlzIGRpc2NvdXJhZ2VkIHVubGVzcyB0aGVyZSdzXG4vLyBhIHZlcnkgZ29vZCByZWFzb24gbm90IHRvIGFsbG93IHVzZXJzIHRvIGNsb3NlIHlvdXIgaXRlbS4gSXRlbXMgY2FuIGJlIG1hZGVcbi8vIHBlcm1hbmVudCAqb25seSogd2hlbiB0aGV5IGFyZSBjb250YWluZWQgaW4gZG9ja3MuIENlbnRlciBwYW5lIGl0ZW1zIGNhblxuLy8gYWx3YXlzIGJlIHJlbW92ZWQuIE5vdGUgdGhhdCBpdCBpcyBjdXJyZW50bHkgc3RpbGwgcG9zc2libGUgdG8gY2xvc2UgZG9ja1xuLy8gaXRlbXMgdmlhIHRoZSBgQ2xvc2UgUGFuZWAgb3B0aW9uIGluIHRoZSBjb250ZXh0IG1lbnUgYW5kIHZpYSBBdG9tIEFQSXMsIHNvXG4vLyB5b3Ugc2hvdWxkIHN0aWxsIGJlIHByZXBhcmVkIHRvIGhhbmRsZSB5b3VyIGRvY2sgaXRlbXMgYmVpbmcgZGVzdHJveWVkIGJ5IHRoZVxuLy8gdXNlciBldmVuIGlmIHlvdSBpbXBsZW1lbnQgdGhpcyBtZXRob2QuXG4vL1xuLy8gIyMjIyBgc2F2ZSgpYFxuLy9cbi8vIFNhdmVzIHRoZSBpdGVtLlxuLy9cbi8vICMjIyMgYHNhdmVBcyhwYXRoKWBcbi8vXG4vLyBTYXZlcyB0aGUgaXRlbSB0byB0aGUgc3BlY2lmaWVkIHBhdGguXG4vL1xuLy8gIyMjIyBgZ2V0UGF0aCgpYFxuLy9cbi8vIFJldHVybnMgdGhlIGxvY2FsIHBhdGggYXNzb2NpYXRlZCB3aXRoIHRoaXMgaXRlbS4gVGhpcyBpcyBvbmx5IHVzZWQgdG8gc2V0XG4vLyB0aGUgaW5pdGlhbCBsb2NhdGlvbiBvZiB0aGUgXCJzYXZlIGFzXCIgZGlhbG9nLlxuLy9cbi8vICMjIyMgYGlzTW9kaWZpZWQoKWBcbi8vXG4vLyBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBpdGVtIGlzIG1vZGlmaWVkIHRvIHJlZmxlY3QgbW9kaWZpY2F0aW9uIGluIHRoZVxuLy8gVUkuXG4vL1xuLy8gIyMjIyBgb25EaWRDaGFuZ2VNb2RpZmllZCgpYFxuLy9cbi8vIENhbGxlZCBieSB0aGUgd29ya3NwYWNlIHNvIGl0IGNhbiBiZSBub3RpZmllZCB3aGVuIGl0ZW0ncyBtb2RpZmllZCBzdGF0dXNcbi8vIGNoYW5nZXMuIE11c3QgcmV0dXJuIGEge0Rpc3Bvc2FibGV9LlxuLy9cbi8vICMjIyMgYGNvcHkoKWBcbi8vXG4vLyBDcmVhdGUgYSBjb3B5IG9mIHRoZSBpdGVtLiBJZiBkZWZpbmVkLCB0aGUgd29ya3NwYWNlIHdpbGwgY2FsbCB0aGlzIG1ldGhvZCB0b1xuLy8gZHVwbGljYXRlIHRoZSBpdGVtIHdoZW4gc3BsaXR0aW5nIHBhbmVzIHZpYSBjZXJ0YWluIHNwbGl0IGNvbW1hbmRzLlxuLy9cbi8vICMjIyMgYGdldFByZWZlcnJlZEhlaWdodCgpYFxuLy9cbi8vIElmIHRoaXMgaXRlbSBpcyBkaXNwbGF5ZWQgaW4gdGhlIGJvdHRvbSB7RG9ja30sIGNhbGxlZCBieSB0aGUgd29ya3NwYWNlIHdoZW5cbi8vIGluaXRpYWxseSBkaXNwbGF5aW5nIHRoZSBkb2NrIHRvIHNldCBpdHMgaGVpZ2h0LiBPbmNlIHRoZSBkb2NrIGhhcyBiZWVuXG4vLyByZXNpemVkIGJ5IHRoZSB1c2VyLCB0aGVpciBoZWlnaHQgd2lsbCBvdmVycmlkZSB0aGlzIHZhbHVlLlxuLy9cbi8vIFJldHVybnMgYSB7TnVtYmVyfS5cbi8vXG4vLyAjIyMjIGBnZXRQcmVmZXJyZWRXaWR0aCgpYFxuLy9cbi8vIElmIHRoaXMgaXRlbSBpcyBkaXNwbGF5ZWQgaW4gdGhlIGxlZnQgb3IgcmlnaHQge0RvY2t9LCBjYWxsZWQgYnkgdGhlXG4vLyB3b3Jrc3BhY2Ugd2hlbiBpbml0aWFsbHkgZGlzcGxheWluZyB0aGUgZG9jayB0byBzZXQgaXRzIHdpZHRoLiBPbmNlIHRoZSBkb2NrXG4vLyBoYXMgYmVlbiByZXNpemVkIGJ5IHRoZSB1c2VyLCB0aGVpciB3aWR0aCB3aWxsIG92ZXJyaWRlIHRoaXMgdmFsdWUuXG4vL1xuLy8gUmV0dXJucyBhIHtOdW1iZXJ9LlxuLy9cbi8vICMjIyMgYG9uRGlkVGVybWluYXRlUGVuZGluZ1N0YXRlKGNhbGxiYWNrKWBcbi8vXG4vLyBJZiB0aGUgd29ya3NwYWNlIGlzIGNvbmZpZ3VyZWQgdG8gdXNlICpwZW5kaW5nIHBhbmUgaXRlbXMqLCB0aGUgd29ya3NwYWNlXG4vLyB3aWxsIHN1YnNjcmliZSB0byB0aGlzIG1ldGhvZCB0byB0ZXJtaW5hdGUgdGhlIHBlbmRpbmcgc3RhdGUgb2YgdGhlIGl0ZW0uXG4vLyBNdXN0IHJldHVybiBhIHtEaXNwb3NhYmxlfS5cbi8vXG4vLyAjIyMjIGBzaG91bGRQcm9tcHRUb1NhdmUoKWBcbi8vXG4vLyBUaGlzIG1ldGhvZCBpbmRpY2F0ZXMgd2hldGhlciBBdG9tIHNob3VsZCBwcm9tcHQgdGhlIHVzZXIgdG8gc2F2ZSB0aGlzIGl0ZW1cbi8vIHdoZW4gdGhlIHVzZXIgY2xvc2VzIG9yIHJlbG9hZHMgdGhlIHdpbmRvdy4gUmV0dXJucyBhIGJvb2xlYW4uXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFdvcmtzcGFjZSBleHRlbmRzIE1vZGVsIHtcbiAgY29uc3RydWN0b3IgKHBhcmFtcykge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcblxuICAgIHRoaXMudXBkYXRlV2luZG93VGl0bGUgPSB0aGlzLnVwZGF0ZVdpbmRvd1RpdGxlLmJpbmQodGhpcylcbiAgICB0aGlzLnVwZGF0ZURvY3VtZW50RWRpdGVkID0gdGhpcy51cGRhdGVEb2N1bWVudEVkaXRlZC5iaW5kKHRoaXMpXG4gICAgdGhpcy5kaWREZXN0cm95UGFuZUl0ZW0gPSB0aGlzLmRpZERlc3Ryb3lQYW5lSXRlbS5iaW5kKHRoaXMpXG4gICAgdGhpcy5kaWRDaGFuZ2VBY3RpdmVQYW5lT25QYW5lQ29udGFpbmVyID0gdGhpcy5kaWRDaGFuZ2VBY3RpdmVQYW5lT25QYW5lQ29udGFpbmVyLmJpbmQodGhpcylcbiAgICB0aGlzLmRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtT25QYW5lQ29udGFpbmVyID0gdGhpcy5kaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbU9uUGFuZUNvbnRhaW5lci5iaW5kKHRoaXMpXG4gICAgdGhpcy5kaWRBY3RpdmF0ZVBhbmVDb250YWluZXIgPSB0aGlzLmRpZEFjdGl2YXRlUGFuZUNvbnRhaW5lci5iaW5kKHRoaXMpXG5cbiAgICB0aGlzLmVuYWJsZVBlcnNpc3RlbmNlID0gcGFyYW1zLmVuYWJsZVBlcnNpc3RlbmNlXG4gICAgdGhpcy5wYWNrYWdlTWFuYWdlciA9IHBhcmFtcy5wYWNrYWdlTWFuYWdlclxuICAgIHRoaXMuY29uZmlnID0gcGFyYW1zLmNvbmZpZ1xuICAgIHRoaXMucHJvamVjdCA9IHBhcmFtcy5wcm9qZWN0XG4gICAgdGhpcy5ub3RpZmljYXRpb25NYW5hZ2VyID0gcGFyYW1zLm5vdGlmaWNhdGlvbk1hbmFnZXJcbiAgICB0aGlzLnZpZXdSZWdpc3RyeSA9IHBhcmFtcy52aWV3UmVnaXN0cnlcbiAgICB0aGlzLmdyYW1tYXJSZWdpc3RyeSA9IHBhcmFtcy5ncmFtbWFyUmVnaXN0cnlcbiAgICB0aGlzLmFwcGxpY2F0aW9uRGVsZWdhdGUgPSBwYXJhbXMuYXBwbGljYXRpb25EZWxlZ2F0ZVxuICAgIHRoaXMuYXNzZXJ0ID0gcGFyYW1zLmFzc2VydFxuICAgIHRoaXMuZGVzZXJpYWxpemVyTWFuYWdlciA9IHBhcmFtcy5kZXNlcmlhbGl6ZXJNYW5hZ2VyXG4gICAgdGhpcy50ZXh0RWRpdG9yUmVnaXN0cnkgPSBwYXJhbXMudGV4dEVkaXRvclJlZ2lzdHJ5XG4gICAgdGhpcy5zdHlsZU1hbmFnZXIgPSBwYXJhbXMuc3R5bGVNYW5hZ2VyXG4gICAgdGhpcy5kcmFnZ2luZ0l0ZW0gPSBmYWxzZVxuICAgIHRoaXMuaXRlbUxvY2F0aW9uU3RvcmUgPSBuZXcgU3RhdGVTdG9yZSgnQXRvbVByZXZpb3VzSXRlbUxvY2F0aW9ucycsIDEpXG5cbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5vcGVuZXJzID0gW11cbiAgICB0aGlzLmRlc3Ryb3llZEl0ZW1VUklzID0gW11cbiAgICB0aGlzLnN0b3BwZWRDaGFuZ2luZ0FjdGl2ZVBhbmVJdGVtVGltZW91dCA9IG51bGxcblxuICAgIHRoaXMuZGVmYXVsdERpcmVjdG9yeVNlYXJjaGVyID0gbmV3IERlZmF1bHREaXJlY3RvcnlTZWFyY2hlcigpXG4gICAgdGhpcy5jb25zdW1lU2VydmljZXModGhpcy5wYWNrYWdlTWFuYWdlcilcblxuICAgIHRoaXMucGFuZUNvbnRhaW5lcnMgPSB7XG4gICAgICBjZW50ZXI6IHRoaXMuY3JlYXRlQ2VudGVyKCksXG4gICAgICBsZWZ0OiB0aGlzLmNyZWF0ZURvY2soJ2xlZnQnKSxcbiAgICAgIHJpZ2h0OiB0aGlzLmNyZWF0ZURvY2soJ3JpZ2h0JyksXG4gICAgICBib3R0b206IHRoaXMuY3JlYXRlRG9jaygnYm90dG9tJylcbiAgICB9XG4gICAgdGhpcy5hY3RpdmVQYW5lQ29udGFpbmVyID0gdGhpcy5wYW5lQ29udGFpbmVycy5jZW50ZXJcbiAgICB0aGlzLmhhc0FjdGl2ZVRleHRFZGl0b3IgPSBmYWxzZVxuXG4gICAgdGhpcy5wYW5lbENvbnRhaW5lcnMgPSB7XG4gICAgICB0b3A6IG5ldyBQYW5lbENvbnRhaW5lcih7dmlld1JlZ2lzdHJ5OiB0aGlzLnZpZXdSZWdpc3RyeSwgbG9jYXRpb246ICd0b3AnfSksXG4gICAgICBsZWZ0OiBuZXcgUGFuZWxDb250YWluZXIoe3ZpZXdSZWdpc3RyeTogdGhpcy52aWV3UmVnaXN0cnksIGxvY2F0aW9uOiAnbGVmdCcsIGRvY2s6IHRoaXMucGFuZUNvbnRhaW5lcnMubGVmdH0pLFxuICAgICAgcmlnaHQ6IG5ldyBQYW5lbENvbnRhaW5lcih7dmlld1JlZ2lzdHJ5OiB0aGlzLnZpZXdSZWdpc3RyeSwgbG9jYXRpb246ICdyaWdodCcsIGRvY2s6IHRoaXMucGFuZUNvbnRhaW5lcnMucmlnaHR9KSxcbiAgICAgIGJvdHRvbTogbmV3IFBhbmVsQ29udGFpbmVyKHt2aWV3UmVnaXN0cnk6IHRoaXMudmlld1JlZ2lzdHJ5LCBsb2NhdGlvbjogJ2JvdHRvbScsIGRvY2s6IHRoaXMucGFuZUNvbnRhaW5lcnMuYm90dG9tfSksXG4gICAgICBoZWFkZXI6IG5ldyBQYW5lbENvbnRhaW5lcih7dmlld1JlZ2lzdHJ5OiB0aGlzLnZpZXdSZWdpc3RyeSwgbG9jYXRpb246ICdoZWFkZXInfSksXG4gICAgICBmb290ZXI6IG5ldyBQYW5lbENvbnRhaW5lcih7dmlld1JlZ2lzdHJ5OiB0aGlzLnZpZXdSZWdpc3RyeSwgbG9jYXRpb246ICdmb290ZXInfSksXG4gICAgICBtb2RhbDogbmV3IFBhbmVsQ29udGFpbmVyKHt2aWV3UmVnaXN0cnk6IHRoaXMudmlld1JlZ2lzdHJ5LCBsb2NhdGlvbjogJ21vZGFsJ30pXG4gICAgfVxuXG4gICAgdGhpcy5zdWJzY3JpYmVUb0V2ZW50cygpXG4gIH1cblxuICBnZXQgcGFuZUNvbnRhaW5lciAoKSB7XG4gICAgR3JpbS5kZXByZWNhdGUoJ2BhdG9tLndvcmtzcGFjZS5wYW5lQ29udGFpbmVyYCBoYXMgYWx3YXlzIGJlZW4gcHJpdmF0ZSwgYnV0IGl0IGlzIG5vdyBnb25lLiBQbGVhc2UgdXNlIGBhdG9tLndvcmtzcGFjZS5nZXRDZW50ZXIoKWAgaW5zdGVhZCBhbmQgY29uc3VsdCB0aGUgd29ya3NwYWNlIEFQSSBkb2NzIGZvciBwdWJsaWMgbWV0aG9kcy4nKVxuICAgIHJldHVybiB0aGlzLnBhbmVDb250YWluZXJzLmNlbnRlci5wYW5lQ29udGFpbmVyXG4gIH1cblxuICBnZXRFbGVtZW50ICgpIHtcbiAgICBpZiAoIXRoaXMuZWxlbWVudCkge1xuICAgICAgdGhpcy5lbGVtZW50ID0gbmV3IFdvcmtzcGFjZUVsZW1lbnQoKS5pbml0aWFsaXplKHRoaXMsIHtcbiAgICAgICAgY29uZmlnOiB0aGlzLmNvbmZpZyxcbiAgICAgICAgcHJvamVjdDogdGhpcy5wcm9qZWN0LFxuICAgICAgICB2aWV3UmVnaXN0cnk6IHRoaXMudmlld1JlZ2lzdHJ5LFxuICAgICAgICBzdHlsZU1hbmFnZXI6IHRoaXMuc3R5bGVNYW5hZ2VyXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5lbGVtZW50XG4gIH1cblxuICBjcmVhdGVDZW50ZXIgKCkge1xuICAgIHJldHVybiBuZXcgV29ya3NwYWNlQ2VudGVyKHtcbiAgICAgIGNvbmZpZzogdGhpcy5jb25maWcsXG4gICAgICBhcHBsaWNhdGlvbkRlbGVnYXRlOiB0aGlzLmFwcGxpY2F0aW9uRGVsZWdhdGUsXG4gICAgICBub3RpZmljYXRpb25NYW5hZ2VyOiB0aGlzLm5vdGlmaWNhdGlvbk1hbmFnZXIsXG4gICAgICBkZXNlcmlhbGl6ZXJNYW5hZ2VyOiB0aGlzLmRlc2VyaWFsaXplck1hbmFnZXIsXG4gICAgICB2aWV3UmVnaXN0cnk6IHRoaXMudmlld1JlZ2lzdHJ5LFxuICAgICAgZGlkQWN0aXZhdGU6IHRoaXMuZGlkQWN0aXZhdGVQYW5lQ29udGFpbmVyLFxuICAgICAgZGlkQ2hhbmdlQWN0aXZlUGFuZTogdGhpcy5kaWRDaGFuZ2VBY3RpdmVQYW5lT25QYW5lQ29udGFpbmVyLFxuICAgICAgZGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW06IHRoaXMuZGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW1PblBhbmVDb250YWluZXIsXG4gICAgICBkaWREZXN0cm95UGFuZUl0ZW06IHRoaXMuZGlkRGVzdHJveVBhbmVJdGVtXG4gICAgfSlcbiAgfVxuXG4gIGNyZWF0ZURvY2sgKGxvY2F0aW9uKSB7XG4gICAgcmV0dXJuIG5ldyBEb2NrKHtcbiAgICAgIGxvY2F0aW9uLFxuICAgICAgY29uZmlnOiB0aGlzLmNvbmZpZyxcbiAgICAgIGFwcGxpY2F0aW9uRGVsZWdhdGU6IHRoaXMuYXBwbGljYXRpb25EZWxlZ2F0ZSxcbiAgICAgIGRlc2VyaWFsaXplck1hbmFnZXI6IHRoaXMuZGVzZXJpYWxpemVyTWFuYWdlcixcbiAgICAgIG5vdGlmaWNhdGlvbk1hbmFnZXI6IHRoaXMubm90aWZpY2F0aW9uTWFuYWdlcixcbiAgICAgIHZpZXdSZWdpc3RyeTogdGhpcy52aWV3UmVnaXN0cnksXG4gICAgICBkaWRBY3RpdmF0ZTogdGhpcy5kaWRBY3RpdmF0ZVBhbmVDb250YWluZXIsXG4gICAgICBkaWRDaGFuZ2VBY3RpdmVQYW5lOiB0aGlzLmRpZENoYW5nZUFjdGl2ZVBhbmVPblBhbmVDb250YWluZXIsXG4gICAgICBkaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbTogdGhpcy5kaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbU9uUGFuZUNvbnRhaW5lcixcbiAgICAgIGRpZERlc3Ryb3lQYW5lSXRlbTogdGhpcy5kaWREZXN0cm95UGFuZUl0ZW1cbiAgICB9KVxuICB9XG5cbiAgcmVzZXQgKHBhY2thZ2VNYW5hZ2VyKSB7XG4gICAgdGhpcy5wYWNrYWdlTWFuYWdlciA9IHBhY2thZ2VNYW5hZ2VyXG4gICAgdGhpcy5lbWl0dGVyLmRpc3Bvc2UoKVxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcblxuICAgIHRoaXMucGFuZUNvbnRhaW5lcnMuY2VudGVyLmRlc3Ryb3koKVxuICAgIHRoaXMucGFuZUNvbnRhaW5lcnMubGVmdC5kZXN0cm95KClcbiAgICB0aGlzLnBhbmVDb250YWluZXJzLnJpZ2h0LmRlc3Ryb3koKVxuICAgIHRoaXMucGFuZUNvbnRhaW5lcnMuYm90dG9tLmRlc3Ryb3koKVxuXG4gICAgXy52YWx1ZXModGhpcy5wYW5lbENvbnRhaW5lcnMpLmZvckVhY2gocGFuZWxDb250YWluZXIgPT4geyBwYW5lbENvbnRhaW5lci5kZXN0cm95KCkgfSlcblxuICAgIHRoaXMucGFuZUNvbnRhaW5lcnMgPSB7XG4gICAgICBjZW50ZXI6IHRoaXMuY3JlYXRlQ2VudGVyKCksXG4gICAgICBsZWZ0OiB0aGlzLmNyZWF0ZURvY2soJ2xlZnQnKSxcbiAgICAgIHJpZ2h0OiB0aGlzLmNyZWF0ZURvY2soJ3JpZ2h0JyksXG4gICAgICBib3R0b206IHRoaXMuY3JlYXRlRG9jaygnYm90dG9tJylcbiAgICB9XG4gICAgdGhpcy5hY3RpdmVQYW5lQ29udGFpbmVyID0gdGhpcy5wYW5lQ29udGFpbmVycy5jZW50ZXJcbiAgICB0aGlzLmhhc0FjdGl2ZVRleHRFZGl0b3IgPSBmYWxzZVxuXG4gICAgdGhpcy5wYW5lbENvbnRhaW5lcnMgPSB7XG4gICAgICB0b3A6IG5ldyBQYW5lbENvbnRhaW5lcih7dmlld1JlZ2lzdHJ5OiB0aGlzLnZpZXdSZWdpc3RyeSwgbG9jYXRpb246ICd0b3AnfSksXG4gICAgICBsZWZ0OiBuZXcgUGFuZWxDb250YWluZXIoe3ZpZXdSZWdpc3RyeTogdGhpcy52aWV3UmVnaXN0cnksIGxvY2F0aW9uOiAnbGVmdCcsIGRvY2s6IHRoaXMucGFuZUNvbnRhaW5lcnMubGVmdH0pLFxuICAgICAgcmlnaHQ6IG5ldyBQYW5lbENvbnRhaW5lcih7dmlld1JlZ2lzdHJ5OiB0aGlzLnZpZXdSZWdpc3RyeSwgbG9jYXRpb246ICdyaWdodCcsIGRvY2s6IHRoaXMucGFuZUNvbnRhaW5lcnMucmlnaHR9KSxcbiAgICAgIGJvdHRvbTogbmV3IFBhbmVsQ29udGFpbmVyKHt2aWV3UmVnaXN0cnk6IHRoaXMudmlld1JlZ2lzdHJ5LCBsb2NhdGlvbjogJ2JvdHRvbScsIGRvY2s6IHRoaXMucGFuZUNvbnRhaW5lcnMuYm90dG9tfSksXG4gICAgICBoZWFkZXI6IG5ldyBQYW5lbENvbnRhaW5lcih7dmlld1JlZ2lzdHJ5OiB0aGlzLnZpZXdSZWdpc3RyeSwgbG9jYXRpb246ICdoZWFkZXInfSksXG4gICAgICBmb290ZXI6IG5ldyBQYW5lbENvbnRhaW5lcih7dmlld1JlZ2lzdHJ5OiB0aGlzLnZpZXdSZWdpc3RyeSwgbG9jYXRpb246ICdmb290ZXInfSksXG4gICAgICBtb2RhbDogbmV3IFBhbmVsQ29udGFpbmVyKHt2aWV3UmVnaXN0cnk6IHRoaXMudmlld1JlZ2lzdHJ5LCBsb2NhdGlvbjogJ21vZGFsJ30pXG4gICAgfVxuXG4gICAgdGhpcy5vcmlnaW5hbEZvbnRTaXplID0gbnVsbFxuICAgIHRoaXMub3BlbmVycyA9IFtdXG4gICAgdGhpcy5kZXN0cm95ZWRJdGVtVVJJcyA9IFtdXG4gICAgdGhpcy5lbGVtZW50ID0gbnVsbFxuICAgIHRoaXMuY29uc3VtZVNlcnZpY2VzKHRoaXMucGFja2FnZU1hbmFnZXIpXG4gIH1cblxuICBzdWJzY3JpYmVUb0V2ZW50cyAoKSB7XG4gICAgdGhpcy5wcm9qZWN0Lm9uRGlkQ2hhbmdlUGF0aHModGhpcy51cGRhdGVXaW5kb3dUaXRsZSlcbiAgICB0aGlzLnN1YnNjcmliZVRvRm9udFNpemUoKVxuICAgIHRoaXMuc3Vic2NyaWJlVG9BZGRlZEl0ZW1zKClcbiAgICB0aGlzLnN1YnNjcmliZVRvTW92ZWRJdGVtcygpXG4gICAgdGhpcy5zdWJzY3JpYmVUb0RvY2tUb2dnbGluZygpXG4gIH1cblxuICBjb25zdW1lU2VydmljZXMgKHtzZXJ2aWNlSHVifSkge1xuICAgIHRoaXMuZGlyZWN0b3J5U2VhcmNoZXJzID0gW11cbiAgICBzZXJ2aWNlSHViLmNvbnN1bWUoXG4gICAgICAnYXRvbS5kaXJlY3Rvcnktc2VhcmNoZXInLFxuICAgICAgJ14wLjEuMCcsXG4gICAgICBwcm92aWRlciA9PiB0aGlzLmRpcmVjdG9yeVNlYXJjaGVycy51bnNoaWZ0KHByb3ZpZGVyKVxuICAgIClcbiAgfVxuXG4gIC8vIENhbGxlZCBieSB0aGUgU2VyaWFsaXphYmxlIG1peGluIGR1cmluZyBzZXJpYWxpemF0aW9uLlxuICBzZXJpYWxpemUgKCkge1xuICAgIHJldHVybiB7XG4gICAgICBkZXNlcmlhbGl6ZXI6ICdXb3Jrc3BhY2UnLFxuICAgICAgcGFja2FnZXNXaXRoQWN0aXZlR3JhbW1hcnM6IHRoaXMuZ2V0UGFja2FnZU5hbWVzV2l0aEFjdGl2ZUdyYW1tYXJzKCksXG4gICAgICBkZXN0cm95ZWRJdGVtVVJJczogdGhpcy5kZXN0cm95ZWRJdGVtVVJJcy5zbGljZSgpLFxuICAgICAgLy8gRW5zdXJlIGRlc2VyaWFsaXppbmcgMS4xNyBzdGF0ZSB3aXRoIHByZSAxLjE3IEF0b20gZG9lcyBub3QgZXJyb3JcbiAgICAgIC8vIFRPRE86IFJlbW92ZSBhZnRlciAxLjE3IGhhcyBiZWVuIG9uIHN0YWJsZSBmb3IgYSB3aGlsZVxuICAgICAgcGFuZUNvbnRhaW5lcjoge3ZlcnNpb246IDJ9LFxuICAgICAgcGFuZUNvbnRhaW5lcnM6IHtcbiAgICAgICAgY2VudGVyOiB0aGlzLnBhbmVDb250YWluZXJzLmNlbnRlci5zZXJpYWxpemUoKSxcbiAgICAgICAgbGVmdDogdGhpcy5wYW5lQ29udGFpbmVycy5sZWZ0LnNlcmlhbGl6ZSgpLFxuICAgICAgICByaWdodDogdGhpcy5wYW5lQ29udGFpbmVycy5yaWdodC5zZXJpYWxpemUoKSxcbiAgICAgICAgYm90dG9tOiB0aGlzLnBhbmVDb250YWluZXJzLmJvdHRvbS5zZXJpYWxpemUoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRlc2VyaWFsaXplIChzdGF0ZSwgZGVzZXJpYWxpemVyTWFuYWdlcikge1xuICAgIGNvbnN0IHBhY2thZ2VzV2l0aEFjdGl2ZUdyYW1tYXJzID1cbiAgICAgIHN0YXRlLnBhY2thZ2VzV2l0aEFjdGl2ZUdyYW1tYXJzICE9IG51bGwgPyBzdGF0ZS5wYWNrYWdlc1dpdGhBY3RpdmVHcmFtbWFycyA6IFtdXG4gICAgZm9yIChsZXQgcGFja2FnZU5hbWUgb2YgcGFja2FnZXNXaXRoQWN0aXZlR3JhbW1hcnMpIHtcbiAgICAgIGNvbnN0IHBrZyA9IHRoaXMucGFja2FnZU1hbmFnZXIuZ2V0TG9hZGVkUGFja2FnZShwYWNrYWdlTmFtZSlcbiAgICAgIGlmIChwa2cgIT0gbnVsbCkge1xuICAgICAgICBwa2cubG9hZEdyYW1tYXJzU3luYygpXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzdGF0ZS5kZXN0cm95ZWRJdGVtVVJJcyAhPSBudWxsKSB7XG4gICAgICB0aGlzLmRlc3Ryb3llZEl0ZW1VUklzID0gc3RhdGUuZGVzdHJveWVkSXRlbVVSSXNcbiAgICB9XG5cbiAgICBpZiAoc3RhdGUucGFuZUNvbnRhaW5lcnMpIHtcbiAgICAgIHRoaXMucGFuZUNvbnRhaW5lcnMuY2VudGVyLmRlc2VyaWFsaXplKHN0YXRlLnBhbmVDb250YWluZXJzLmNlbnRlciwgZGVzZXJpYWxpemVyTWFuYWdlcilcbiAgICAgIHRoaXMucGFuZUNvbnRhaW5lcnMubGVmdC5kZXNlcmlhbGl6ZShzdGF0ZS5wYW5lQ29udGFpbmVycy5sZWZ0LCBkZXNlcmlhbGl6ZXJNYW5hZ2VyKVxuICAgICAgdGhpcy5wYW5lQ29udGFpbmVycy5yaWdodC5kZXNlcmlhbGl6ZShzdGF0ZS5wYW5lQ29udGFpbmVycy5yaWdodCwgZGVzZXJpYWxpemVyTWFuYWdlcilcbiAgICAgIHRoaXMucGFuZUNvbnRhaW5lcnMuYm90dG9tLmRlc2VyaWFsaXplKHN0YXRlLnBhbmVDb250YWluZXJzLmJvdHRvbSwgZGVzZXJpYWxpemVyTWFuYWdlcilcbiAgICB9IGVsc2UgaWYgKHN0YXRlLnBhbmVDb250YWluZXIpIHtcbiAgICAgIC8vIFRPRE86IFJlbW92ZSB0aGlzIGZhbGxiYWNrIG9uY2UgYSBsb3Qgb2YgdGltZSBoYXMgcGFzc2VkIHNpbmNlIDEuMTcgd2FzIHJlbGVhc2VkXG4gICAgICB0aGlzLnBhbmVDb250YWluZXJzLmNlbnRlci5kZXNlcmlhbGl6ZShzdGF0ZS5wYW5lQ29udGFpbmVyLCBkZXNlcmlhbGl6ZXJNYW5hZ2VyKVxuICAgIH1cblxuICAgIHRoaXMuaGFzQWN0aXZlVGV4dEVkaXRvciA9IHRoaXMuZ2V0QWN0aXZlVGV4dEVkaXRvcigpICE9IG51bGxcblxuICAgIHRoaXMudXBkYXRlV2luZG93VGl0bGUoKVxuICB9XG5cbiAgZ2V0UGFja2FnZU5hbWVzV2l0aEFjdGl2ZUdyYW1tYXJzICgpIHtcbiAgICBjb25zdCBwYWNrYWdlTmFtZXMgPSBbXVxuICAgIGNvbnN0IGFkZEdyYW1tYXIgPSAoe2luY2x1ZGVkR3JhbW1hclNjb3BlcywgcGFja2FnZU5hbWV9ID0ge30pID0+IHtcbiAgICAgIGlmICghcGFja2FnZU5hbWUpIHsgcmV0dXJuIH1cbiAgICAgIC8vIFByZXZlbnQgY3ljbGVzXG4gICAgICBpZiAocGFja2FnZU5hbWVzLmluZGV4T2YocGFja2FnZU5hbWUpICE9PSAtMSkgeyByZXR1cm4gfVxuXG4gICAgICBwYWNrYWdlTmFtZXMucHVzaChwYWNrYWdlTmFtZSlcbiAgICAgIGZvciAobGV0IHNjb3BlTmFtZSBvZiBpbmNsdWRlZEdyYW1tYXJTY29wZXMgIT0gbnVsbCA/IGluY2x1ZGVkR3JhbW1hclNjb3BlcyA6IFtdKSB7XG4gICAgICAgIGFkZEdyYW1tYXIodGhpcy5ncmFtbWFyUmVnaXN0cnkuZ3JhbW1hckZvclNjb3BlTmFtZShzY29wZU5hbWUpKVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGVkaXRvcnMgPSB0aGlzLmdldFRleHRFZGl0b3JzKClcbiAgICBmb3IgKGxldCBlZGl0b3Igb2YgZWRpdG9ycykgeyBhZGRHcmFtbWFyKGVkaXRvci5nZXRHcmFtbWFyKCkpIH1cblxuICAgIGlmIChlZGl0b3JzLmxlbmd0aCA+IDApIHtcbiAgICAgIGZvciAobGV0IGdyYW1tYXIgb2YgdGhpcy5ncmFtbWFyUmVnaXN0cnkuZ2V0R3JhbW1hcnMoKSkge1xuICAgICAgICBpZiAoZ3JhbW1hci5pbmplY3Rpb25TZWxlY3Rvcikge1xuICAgICAgICAgIGFkZEdyYW1tYXIoZ3JhbW1hcilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBfLnVuaXEocGFja2FnZU5hbWVzKVxuICB9XG5cbiAgZGlkQWN0aXZhdGVQYW5lQ29udGFpbmVyIChwYW5lQ29udGFpbmVyKSB7XG4gICAgaWYgKHBhbmVDb250YWluZXIgIT09IHRoaXMuZ2V0QWN0aXZlUGFuZUNvbnRhaW5lcigpKSB7XG4gICAgICB0aGlzLmFjdGl2ZVBhbmVDb250YWluZXIgPSBwYW5lQ29udGFpbmVyXG4gICAgICB0aGlzLmRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtKHRoaXMuYWN0aXZlUGFuZUNvbnRhaW5lci5nZXRBY3RpdmVQYW5lSXRlbSgpKVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtYWN0aXZlLXBhbmUtY29udGFpbmVyJywgdGhpcy5hY3RpdmVQYW5lQ29udGFpbmVyKVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtYWN0aXZlLXBhbmUnLCB0aGlzLmFjdGl2ZVBhbmVDb250YWluZXIuZ2V0QWN0aXZlUGFuZSgpKVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtYWN0aXZlLXBhbmUtaXRlbScsIHRoaXMuYWN0aXZlUGFuZUNvbnRhaW5lci5nZXRBY3RpdmVQYW5lSXRlbSgpKVxuICAgIH1cbiAgfVxuXG4gIGRpZENoYW5nZUFjdGl2ZVBhbmVPblBhbmVDb250YWluZXIgKHBhbmVDb250YWluZXIsIHBhbmUpIHtcbiAgICBpZiAocGFuZUNvbnRhaW5lciA9PT0gdGhpcy5nZXRBY3RpdmVQYW5lQ29udGFpbmVyKCkpIHtcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWFjdGl2ZS1wYW5lJywgcGFuZSlcbiAgICB9XG4gIH1cblxuICBkaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbU9uUGFuZUNvbnRhaW5lciAocGFuZUNvbnRhaW5lciwgaXRlbSkge1xuICAgIGlmIChwYW5lQ29udGFpbmVyID09PSB0aGlzLmdldEFjdGl2ZVBhbmVDb250YWluZXIoKSkge1xuICAgICAgdGhpcy5kaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbShpdGVtKVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtYWN0aXZlLXBhbmUtaXRlbScsIGl0ZW0pXG4gICAgfVxuXG4gICAgaWYgKHBhbmVDb250YWluZXIgPT09IHRoaXMuZ2V0Q2VudGVyKCkpIHtcbiAgICAgIGNvbnN0IGhhZEFjdGl2ZVRleHRFZGl0b3IgPSB0aGlzLmhhc0FjdGl2ZVRleHRFZGl0b3JcbiAgICAgIHRoaXMuaGFzQWN0aXZlVGV4dEVkaXRvciA9IGl0ZW0gaW5zdGFuY2VvZiBUZXh0RWRpdG9yXG5cbiAgICAgIGlmICh0aGlzLmhhc0FjdGl2ZVRleHRFZGl0b3IgfHwgaGFkQWN0aXZlVGV4dEVkaXRvcikge1xuICAgICAgICBjb25zdCBpdGVtVmFsdWUgPSB0aGlzLmhhc0FjdGl2ZVRleHRFZGl0b3IgPyBpdGVtIDogdW5kZWZpbmVkXG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWFjdGl2ZS10ZXh0LWVkaXRvcicsIGl0ZW1WYWx1ZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSAoaXRlbSkge1xuICAgIHRoaXMudXBkYXRlV2luZG93VGl0bGUoKVxuICAgIHRoaXMudXBkYXRlRG9jdW1lbnRFZGl0ZWQoKVxuICAgIGlmICh0aGlzLmFjdGl2ZUl0ZW1TdWJzY3JpcHRpb25zKSB0aGlzLmFjdGl2ZUl0ZW1TdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIHRoaXMuYWN0aXZlSXRlbVN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICBsZXQgbW9kaWZpZWRTdWJzY3JpcHRpb24sIHRpdGxlU3Vic2NyaXB0aW9uXG5cbiAgICBpZiAoaXRlbSAhPSBudWxsICYmIHR5cGVvZiBpdGVtLm9uRGlkQ2hhbmdlVGl0bGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRpdGxlU3Vic2NyaXB0aW9uID0gaXRlbS5vbkRpZENoYW5nZVRpdGxlKHRoaXMudXBkYXRlV2luZG93VGl0bGUpXG4gICAgfSBlbHNlIGlmIChpdGVtICE9IG51bGwgJiYgdHlwZW9mIGl0ZW0ub24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRpdGxlU3Vic2NyaXB0aW9uID0gaXRlbS5vbigndGl0bGUtY2hhbmdlZCcsIHRoaXMudXBkYXRlV2luZG93VGl0bGUpXG4gICAgICBpZiAodGl0bGVTdWJzY3JpcHRpb24gPT0gbnVsbCB8fCB0eXBlb2YgdGl0bGVTdWJzY3JpcHRpb24uZGlzcG9zZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aXRsZVN1YnNjcmlwdGlvbiA9IG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgICAgICBpdGVtLm9mZigndGl0bGUtY2hhbmdlZCcsIHRoaXMudXBkYXRlV2luZG93VGl0bGUpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGl0ZW0gIT0gbnVsbCAmJiB0eXBlb2YgaXRlbS5vbkRpZENoYW5nZU1vZGlmaWVkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBtb2RpZmllZFN1YnNjcmlwdGlvbiA9IGl0ZW0ub25EaWRDaGFuZ2VNb2RpZmllZCh0aGlzLnVwZGF0ZURvY3VtZW50RWRpdGVkKVxuICAgIH0gZWxzZSBpZiAoaXRlbSAhPSBudWxsICYmIHR5cGVvZiBpdGVtLm9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBtb2RpZmllZFN1YnNjcmlwdGlvbiA9IGl0ZW0ub24oJ21vZGlmaWVkLXN0YXR1cy1jaGFuZ2VkJywgdGhpcy51cGRhdGVEb2N1bWVudEVkaXRlZClcbiAgICAgIGlmIChtb2RpZmllZFN1YnNjcmlwdGlvbiA9PSBudWxsIHx8IHR5cGVvZiBtb2RpZmllZFN1YnNjcmlwdGlvbi5kaXNwb3NlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIG1vZGlmaWVkU3Vic2NyaXB0aW9uID0gbmV3IERpc3Bvc2FibGUoKCkgPT4ge1xuICAgICAgICAgIGl0ZW0ub2ZmKCdtb2RpZmllZC1zdGF0dXMtY2hhbmdlZCcsIHRoaXMudXBkYXRlRG9jdW1lbnRFZGl0ZWQpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRpdGxlU3Vic2NyaXB0aW9uICE9IG51bGwpIHsgdGhpcy5hY3RpdmVJdGVtU3Vic2NyaXB0aW9ucy5hZGQodGl0bGVTdWJzY3JpcHRpb24pIH1cbiAgICBpZiAobW9kaWZpZWRTdWJzY3JpcHRpb24gIT0gbnVsbCkgeyB0aGlzLmFjdGl2ZUl0ZW1TdWJzY3JpcHRpb25zLmFkZChtb2RpZmllZFN1YnNjcmlwdGlvbikgfVxuXG4gICAgdGhpcy5jYW5jZWxTdG9wcGVkQ2hhbmdpbmdBY3RpdmVQYW5lSXRlbVRpbWVvdXQoKVxuICAgIHRoaXMuc3RvcHBlZENoYW5naW5nQWN0aXZlUGFuZUl0ZW1UaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnN0b3BwZWRDaGFuZ2luZ0FjdGl2ZVBhbmVJdGVtVGltZW91dCA9IG51bGxcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtc3RvcC1jaGFuZ2luZy1hY3RpdmUtcGFuZS1pdGVtJywgaXRlbSlcbiAgICB9LCBTVE9QUEVEX0NIQU5HSU5HX0FDVElWRV9QQU5FX0lURU1fREVMQVkpXG4gIH1cblxuICBjYW5jZWxTdG9wcGVkQ2hhbmdpbmdBY3RpdmVQYW5lSXRlbVRpbWVvdXQgKCkge1xuICAgIGlmICh0aGlzLnN0b3BwZWRDaGFuZ2luZ0FjdGl2ZVBhbmVJdGVtVGltZW91dCAhPSBudWxsKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5zdG9wcGVkQ2hhbmdpbmdBY3RpdmVQYW5lSXRlbVRpbWVvdXQpXG4gICAgfVxuICB9XG5cbiAgc2V0RHJhZ2dpbmdJdGVtIChkcmFnZ2luZ0l0ZW0pIHtcbiAgICBfLnZhbHVlcyh0aGlzLnBhbmVDb250YWluZXJzKS5mb3JFYWNoKGRvY2sgPT4ge1xuICAgICAgZG9jay5zZXREcmFnZ2luZ0l0ZW0oZHJhZ2dpbmdJdGVtKVxuICAgIH0pXG4gIH1cblxuICBzdWJzY3JpYmVUb0FkZGVkSXRlbXMgKCkge1xuICAgIHRoaXMub25EaWRBZGRQYW5lSXRlbSgoe2l0ZW0sIHBhbmUsIGluZGV4fSkgPT4ge1xuICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBUZXh0RWRpdG9yKSB7XG4gICAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgICAgICB0aGlzLnRleHRFZGl0b3JSZWdpc3RyeS5hZGQoaXRlbSksXG4gICAgICAgICAgdGhpcy50ZXh0RWRpdG9yUmVnaXN0cnkubWFpbnRhaW5HcmFtbWFyKGl0ZW0pLFxuICAgICAgICAgIHRoaXMudGV4dEVkaXRvclJlZ2lzdHJ5Lm1haW50YWluQ29uZmlnKGl0ZW0pLFxuICAgICAgICAgIGl0ZW0ub2JzZXJ2ZUdyYW1tYXIodGhpcy5oYW5kbGVHcmFtbWFyVXNlZC5iaW5kKHRoaXMpKVxuICAgICAgICApXG4gICAgICAgIGl0ZW0ub25EaWREZXN0cm95KCgpID0+IHsgc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCkgfSlcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1hZGQtdGV4dC1lZGl0b3InLCB7dGV4dEVkaXRvcjogaXRlbSwgcGFuZSwgaW5kZXh9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBzdWJzY3JpYmVUb0RvY2tUb2dnbGluZyAoKSB7XG4gICAgY29uc3QgZG9ja3MgPSBbdGhpcy5nZXRMZWZ0RG9jaygpLCB0aGlzLmdldFJpZ2h0RG9jaygpLCB0aGlzLmdldEJvdHRvbURvY2soKV1cbiAgICBkb2Nrcy5mb3JFYWNoKGRvY2sgPT4ge1xuICAgICAgZG9jay5vbkRpZENoYW5nZVZpc2libGUodmlzaWJsZSA9PiB7XG4gICAgICAgIGlmICh2aXNpYmxlKSByZXR1cm5cbiAgICAgICAgY29uc3Qge2FjdGl2ZUVsZW1lbnR9ID0gZG9jdW1lbnRcbiAgICAgICAgY29uc3QgZG9ja0VsZW1lbnQgPSBkb2NrLmdldEVsZW1lbnQoKVxuICAgICAgICBpZiAoZG9ja0VsZW1lbnQgPT09IGFjdGl2ZUVsZW1lbnQgfHwgZG9ja0VsZW1lbnQuY29udGFpbnMoYWN0aXZlRWxlbWVudCkpIHtcbiAgICAgICAgICB0aGlzLmdldENlbnRlcigpLmFjdGl2YXRlKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgc3Vic2NyaWJlVG9Nb3ZlZEl0ZW1zICgpIHtcbiAgICBmb3IgKGNvbnN0IHBhbmVDb250YWluZXIgb2YgdGhpcy5nZXRQYW5lQ29udGFpbmVycygpKSB7XG4gICAgICBwYW5lQ29udGFpbmVyLm9ic2VydmVQYW5lcyhwYW5lID0+IHtcbiAgICAgICAgcGFuZS5vbkRpZEFkZEl0ZW0oKHtpdGVtfSkgPT4ge1xuICAgICAgICAgIGlmICh0eXBlb2YgaXRlbS5nZXRVUkkgPT09ICdmdW5jdGlvbicgJiYgdGhpcy5lbmFibGVQZXJzaXN0ZW5jZSkge1xuICAgICAgICAgICAgY29uc3QgdXJpID0gaXRlbS5nZXRVUkkoKVxuICAgICAgICAgICAgaWYgKHVyaSkge1xuICAgICAgICAgICAgICBjb25zdCBsb2NhdGlvbiA9IHBhbmVDb250YWluZXIuZ2V0TG9jYXRpb24oKVxuICAgICAgICAgICAgICBsZXQgZGVmYXVsdExvY2F0aW9uXG4gICAgICAgICAgICAgIGlmICh0eXBlb2YgaXRlbS5nZXREZWZhdWx0TG9jYXRpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0TG9jYXRpb24gPSBpdGVtLmdldERlZmF1bHRMb2NhdGlvbigpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZGVmYXVsdExvY2F0aW9uID0gZGVmYXVsdExvY2F0aW9uIHx8ICdjZW50ZXInXG4gICAgICAgICAgICAgIGlmIChsb2NhdGlvbiA9PT0gZGVmYXVsdExvY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pdGVtTG9jYXRpb25TdG9yZS5kZWxldGUoaXRlbS5nZXRVUkkoKSlcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW1Mb2NhdGlvblN0b3JlLnNhdmUoaXRlbS5nZXRVUkkoKSwgbG9jYXRpb24pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIC8vIFVwZGF0ZXMgdGhlIGFwcGxpY2F0aW9uJ3MgdGl0bGUgYW5kIHByb3h5IGljb24gYmFzZWQgb24gd2hpY2hldmVyIGZpbGUgaXNcbiAgLy8gb3Blbi5cbiAgdXBkYXRlV2luZG93VGl0bGUgKCkge1xuICAgIGxldCBpdGVtUGF0aCwgaXRlbVRpdGxlLCBwcm9qZWN0UGF0aCwgcmVwcmVzZW50ZWRQYXRoXG4gICAgY29uc3QgYXBwTmFtZSA9ICdBdG9tJ1xuICAgIGNvbnN0IGxlZnQgPSB0aGlzLnByb2plY3QuZ2V0UGF0aHMoKVxuICAgIGNvbnN0IHByb2plY3RQYXRocyA9IGxlZnQgIT0gbnVsbCA/IGxlZnQgOiBbXVxuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmdldEFjdGl2ZVBhbmVJdGVtKClcbiAgICBpZiAoaXRlbSkge1xuICAgICAgaXRlbVBhdGggPSB0eXBlb2YgaXRlbS5nZXRQYXRoID09PSAnZnVuY3Rpb24nID8gaXRlbS5nZXRQYXRoKCkgOiB1bmRlZmluZWRcbiAgICAgIGNvbnN0IGxvbmdUaXRsZSA9IHR5cGVvZiBpdGVtLmdldExvbmdUaXRsZSA9PT0gJ2Z1bmN0aW9uJyA/IGl0ZW0uZ2V0TG9uZ1RpdGxlKCkgOiB1bmRlZmluZWRcbiAgICAgIGl0ZW1UaXRsZSA9IGxvbmdUaXRsZSA9PSBudWxsXG4gICAgICAgID8gKHR5cGVvZiBpdGVtLmdldFRpdGxlID09PSAnZnVuY3Rpb24nID8gaXRlbS5nZXRUaXRsZSgpIDogdW5kZWZpbmVkKVxuICAgICAgICA6IGxvbmdUaXRsZVxuICAgICAgcHJvamVjdFBhdGggPSBfLmZpbmQoXG4gICAgICAgIHByb2plY3RQYXRocyxcbiAgICAgICAgcHJvamVjdFBhdGggPT5cbiAgICAgICAgICAoaXRlbVBhdGggPT09IHByb2plY3RQYXRoKSB8fCAoaXRlbVBhdGggIT0gbnVsbCA/IGl0ZW1QYXRoLnN0YXJ0c1dpdGgocHJvamVjdFBhdGggKyBwYXRoLnNlcCkgOiB1bmRlZmluZWQpXG4gICAgICApXG4gICAgfVxuICAgIGlmIChpdGVtVGl0bGUgPT0gbnVsbCkgeyBpdGVtVGl0bGUgPSAndW50aXRsZWQnIH1cbiAgICBpZiAocHJvamVjdFBhdGggPT0gbnVsbCkgeyBwcm9qZWN0UGF0aCA9IGl0ZW1QYXRoID8gcGF0aC5kaXJuYW1lKGl0ZW1QYXRoKSA6IHByb2plY3RQYXRoc1swXSB9XG4gICAgaWYgKHByb2plY3RQYXRoICE9IG51bGwpIHtcbiAgICAgIHByb2plY3RQYXRoID0gZnMudGlsZGlmeShwcm9qZWN0UGF0aClcbiAgICB9XG5cbiAgICBjb25zdCB0aXRsZVBhcnRzID0gW11cbiAgICBpZiAoKGl0ZW0gIT0gbnVsbCkgJiYgKHByb2plY3RQYXRoICE9IG51bGwpKSB7XG4gICAgICB0aXRsZVBhcnRzLnB1c2goaXRlbVRpdGxlLCBwcm9qZWN0UGF0aClcbiAgICAgIHJlcHJlc2VudGVkUGF0aCA9IGl0ZW1QYXRoICE9IG51bGwgPyBpdGVtUGF0aCA6IHByb2plY3RQYXRoXG4gICAgfSBlbHNlIGlmIChwcm9qZWN0UGF0aCAhPSBudWxsKSB7XG4gICAgICB0aXRsZVBhcnRzLnB1c2gocHJvamVjdFBhdGgpXG4gICAgICByZXByZXNlbnRlZFBhdGggPSBwcm9qZWN0UGF0aFxuICAgIH0gZWxzZSB7XG4gICAgICB0aXRsZVBhcnRzLnB1c2goaXRlbVRpdGxlKVxuICAgICAgcmVwcmVzZW50ZWRQYXRoID0gJydcbiAgICB9XG5cbiAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSAhPT0gJ2RhcndpbicpIHtcbiAgICAgIHRpdGxlUGFydHMucHVzaChhcHBOYW1lKVxuICAgIH1cblxuICAgIGRvY3VtZW50LnRpdGxlID0gdGl0bGVQYXJ0cy5qb2luKCcgXFx1MjAxNCAnKVxuICAgIHRoaXMuYXBwbGljYXRpb25EZWxlZ2F0ZS5zZXRSZXByZXNlbnRlZEZpbGVuYW1lKHJlcHJlc2VudGVkUGF0aClcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS13aW5kb3ctdGl0bGUnKVxuICB9XG5cbiAgLy8gT24gbWFjT1MsIGZhZGVzIHRoZSBhcHBsaWNhdGlvbiB3aW5kb3cncyBwcm94eSBpY29uIHdoZW4gdGhlIGN1cnJlbnQgZmlsZVxuICAvLyBoYXMgYmVlbiBtb2RpZmllZC5cbiAgdXBkYXRlRG9jdW1lbnRFZGl0ZWQgKCkge1xuICAgIGNvbnN0IGFjdGl2ZVBhbmVJdGVtID0gdGhpcy5nZXRBY3RpdmVQYW5lSXRlbSgpXG4gICAgY29uc3QgbW9kaWZpZWQgPSBhY3RpdmVQYW5lSXRlbSAhPSBudWxsICYmIHR5cGVvZiBhY3RpdmVQYW5lSXRlbS5pc01vZGlmaWVkID09PSAnZnVuY3Rpb24nXG4gICAgICA/IGFjdGl2ZVBhbmVJdGVtLmlzTW9kaWZpZWQoKSB8fCBmYWxzZVxuICAgICAgOiBmYWxzZVxuICAgIHRoaXMuYXBwbGljYXRpb25EZWxlZ2F0ZS5zZXRXaW5kb3dEb2N1bWVudEVkaXRlZChtb2RpZmllZClcbiAgfVxuXG4gIC8qXG4gIFNlY3Rpb246IEV2ZW50IFN1YnNjcmlwdGlvblxuICAqL1xuXG4gIG9uRGlkQ2hhbmdlQWN0aXZlUGFuZUNvbnRhaW5lciAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLWFjdGl2ZS1wYW5lLWNvbnRhaW5lcicsIGNhbGxiYWNrKVxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBJbnZva2UgdGhlIGdpdmVuIGNhbGxiYWNrIHdpdGggYWxsIGN1cnJlbnQgYW5kIGZ1dHVyZSB0ZXh0XG4gIC8vIGVkaXRvcnMgaW4gdGhlIHdvcmtzcGFjZS5cbiAgLy9cbiAgLy8gKiBgY2FsbGJhY2tgIHtGdW5jdGlvbn0gdG8gYmUgY2FsbGVkIHdpdGggY3VycmVudCBhbmQgZnV0dXJlIHRleHQgZWRpdG9ycy5cbiAgLy8gICAqIGBlZGl0b3JgIEEge1RleHRFZGl0b3J9IHRoYXQgaXMgcHJlc2VudCBpbiB7OjpnZXRUZXh0RWRpdG9yc30gYXQgdGhlIHRpbWVcbiAgLy8gICAgIG9mIHN1YnNjcmlwdGlvbiBvciB0aGF0IGlzIGFkZGVkIGF0IHNvbWUgbGF0ZXIgdGltZS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEaXNwb3NhYmxlfSBvbiB3aGljaCBgLmRpc3Bvc2UoKWAgY2FuIGJlIGNhbGxlZCB0byB1bnN1YnNjcmliZS5cbiAgb2JzZXJ2ZVRleHRFZGl0b3JzIChjYWxsYmFjaykge1xuICAgIGZvciAobGV0IHRleHRFZGl0b3Igb2YgdGhpcy5nZXRUZXh0RWRpdG9ycygpKSB7IGNhbGxiYWNrKHRleHRFZGl0b3IpIH1cbiAgICByZXR1cm4gdGhpcy5vbkRpZEFkZFRleHRFZGl0b3IoKHt0ZXh0RWRpdG9yfSkgPT4gY2FsbGJhY2sodGV4dEVkaXRvcikpXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEludm9rZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgd2l0aCBhbGwgY3VycmVudCBhbmQgZnV0dXJlIHBhbmVzIGl0ZW1zXG4gIC8vIGluIHRoZSB3b3Jrc3BhY2UuXG4gIC8vXG4gIC8vICogYGNhbGxiYWNrYCB7RnVuY3Rpb259IHRvIGJlIGNhbGxlZCB3aXRoIGN1cnJlbnQgYW5kIGZ1dHVyZSBwYW5lIGl0ZW1zLlxuICAvLyAgICogYGl0ZW1gIEFuIGl0ZW0gdGhhdCBpcyBwcmVzZW50IGluIHs6OmdldFBhbmVJdGVtc30gYXQgdGhlIHRpbWUgb2ZcbiAgLy8gICAgICBzdWJzY3JpcHRpb24gb3IgdGhhdCBpcyBhZGRlZCBhdCBzb21lIGxhdGVyIHRpbWUuXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7RGlzcG9zYWJsZX0gb24gd2hpY2ggYC5kaXNwb3NlKClgIGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUuXG4gIG9ic2VydmVQYW5lSXRlbXMgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgLi4udGhpcy5nZXRQYW5lQ29udGFpbmVycygpLm1hcChjb250YWluZXIgPT4gY29udGFpbmVyLm9ic2VydmVQYW5lSXRlbXMoY2FsbGJhY2spKVxuICAgIClcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogSW52b2tlIHRoZSBnaXZlbiBjYWxsYmFjayB3aGVuIHRoZSBhY3RpdmUgcGFuZSBpdGVtIGNoYW5nZXMuXG4gIC8vXG4gIC8vIEJlY2F1c2Ugb2JzZXJ2ZXJzIGFyZSBpbnZva2VkIHN5bmNocm9ub3VzbHksIGl0J3MgaW1wb3J0YW50IG5vdCB0byBwZXJmb3JtXG4gIC8vIGFueSBleHBlbnNpdmUgb3BlcmF0aW9ucyB2aWEgdGhpcyBtZXRob2QuIENvbnNpZGVyXG4gIC8vIHs6Om9uRGlkU3RvcENoYW5naW5nQWN0aXZlUGFuZUl0ZW19IHRvIGRlbGF5IG9wZXJhdGlvbnMgdW50aWwgYWZ0ZXIgY2hhbmdlc1xuICAvLyBzdG9wIG9jY3VycmluZy5cbiAgLy9cbiAgLy8gKiBgY2FsbGJhY2tgIHtGdW5jdGlvbn0gdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGFjdGl2ZSBwYW5lIGl0ZW0gY2hhbmdlcy5cbiAgLy8gICAqIGBpdGVtYCBUaGUgYWN0aXZlIHBhbmUgaXRlbS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEaXNwb3NhYmxlfSBvbiB3aGljaCBgLmRpc3Bvc2UoKWAgY2FuIGJlIGNhbGxlZCB0byB1bnN1YnNjcmliZS5cbiAgb25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLWFjdGl2ZS1wYW5lLWl0ZW0nLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogSW52b2tlIHRoZSBnaXZlbiBjYWxsYmFjayB3aGVuIHRoZSBhY3RpdmUgcGFuZSBpdGVtIHN0b3BzXG4gIC8vIGNoYW5naW5nLlxuICAvL1xuICAvLyBPYnNlcnZlcnMgYXJlIGNhbGxlZCBhc3luY2hyb25vdXNseSAxMDBtcyBhZnRlciB0aGUgbGFzdCBhY3RpdmUgcGFuZSBpdGVtXG4gIC8vIGNoYW5nZS4gSGFuZGxpbmcgY2hhbmdlcyBoZXJlIHJhdGhlciB0aGFuIGluIHRoZSBzeW5jaHJvbm91c1xuICAvLyB7OjpvbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtfSBwcmV2ZW50cyB1bm5lZWRlZCB3b3JrIGlmIHRoZSB1c2VyIGlzIHF1aWNrbHlcbiAgLy8gY2hhbmdpbmcgb3IgY2xvc2luZyB0YWJzIGFuZCBlbnN1cmVzIGNyaXRpY2FsIFVJIGZlZWRiYWNrLCBsaWtlIGNoYW5naW5nIHRoZVxuICAvLyBoaWdobGlnaHRlZCB0YWIsIGdldHMgcHJpb3JpdHkgb3ZlciB3b3JrIHRoYXQgY2FuIGJlIGRvbmUgYXN5bmNocm9ub3VzbHkuXG4gIC8vXG4gIC8vICogYGNhbGxiYWNrYCB7RnVuY3Rpb259IHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBhY3RpdmUgcGFuZSBpdGVtIHN0b3BzXG4gIC8vICAgY2hhbmdpbmcuXG4gIC8vICAgKiBgaXRlbWAgVGhlIGFjdGl2ZSBwYW5lIGl0ZW0uXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7RGlzcG9zYWJsZX0gb24gd2hpY2ggYC5kaXNwb3NlKClgIGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUuXG4gIG9uRGlkU3RvcENoYW5naW5nQWN0aXZlUGFuZUl0ZW0gKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLXN0b3AtY2hhbmdpbmctYWN0aXZlLXBhbmUtaXRlbScsIGNhbGxiYWNrKVxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBJbnZva2UgdGhlIGdpdmVuIGNhbGxiYWNrIHdoZW4gYSB0ZXh0IGVkaXRvciBiZWNvbWVzIHRoZSBhY3RpdmVcbiAgLy8gdGV4dCBlZGl0b3IgYW5kIHdoZW4gdGhlcmUgaXMgbm8gbG9uZ2VyIGFuIGFjdGl2ZSB0ZXh0IGVkaXRvci5cbiAgLy9cbiAgLy8gKiBgY2FsbGJhY2tgIHtGdW5jdGlvbn0gdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGFjdGl2ZSB0ZXh0IGVkaXRvciBjaGFuZ2VzLlxuICAvLyAgICogYGVkaXRvcmAgVGhlIGFjdGl2ZSB7VGV4dEVkaXRvcn0gb3IgdW5kZWZpbmVkIGlmIHRoZXJlIGlzIG5vIGxvbmdlciBhblxuICAvLyAgICAgIGFjdGl2ZSB0ZXh0IGVkaXRvci5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEaXNwb3NhYmxlfSBvbiB3aGljaCBgLmRpc3Bvc2UoKWAgY2FuIGJlIGNhbGxlZCB0byB1bnN1YnNjcmliZS5cbiAgb25EaWRDaGFuZ2VBY3RpdmVUZXh0RWRpdG9yIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1jaGFuZ2UtYWN0aXZlLXRleHQtZWRpdG9yJywgY2FsbGJhY2spXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEludm9rZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgd2l0aCB0aGUgY3VycmVudCBhY3RpdmUgcGFuZSBpdGVtIGFuZFxuICAvLyB3aXRoIGFsbCBmdXR1cmUgYWN0aXZlIHBhbmUgaXRlbXMgaW4gdGhlIHdvcmtzcGFjZS5cbiAgLy9cbiAgLy8gKiBgY2FsbGJhY2tgIHtGdW5jdGlvbn0gdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGFjdGl2ZSBwYW5lIGl0ZW0gY2hhbmdlcy5cbiAgLy8gICAqIGBpdGVtYCBUaGUgY3VycmVudCBhY3RpdmUgcGFuZSBpdGVtLlxuICAvL1xuICAvLyBSZXR1cm5zIGEge0Rpc3Bvc2FibGV9IG9uIHdoaWNoIGAuZGlzcG9zZSgpYCBjYW4gYmUgY2FsbGVkIHRvIHVuc3Vic2NyaWJlLlxuICBvYnNlcnZlQWN0aXZlUGFuZUl0ZW0gKGNhbGxiYWNrKSB7XG4gICAgY2FsbGJhY2sodGhpcy5nZXRBY3RpdmVQYW5lSXRlbSgpKVxuICAgIHJldHVybiB0aGlzLm9uRGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0oY2FsbGJhY2spXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEludm9rZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgd2l0aCB0aGUgY3VycmVudCBhY3RpdmUgdGV4dCBlZGl0b3JcbiAgLy8gKGlmIGFueSksIHdpdGggYWxsIGZ1dHVyZSBhY3RpdmUgdGV4dCBlZGl0b3JzLCBhbmQgd2hlbiB0aGVyZSBpcyBubyBsb25nZXJcbiAgLy8gYW4gYWN0aXZlIHRleHQgZWRpdG9yLlxuICAvL1xuICAvLyAqIGBjYWxsYmFja2Age0Z1bmN0aW9ufSB0byBiZSBjYWxsZWQgd2hlbiB0aGUgYWN0aXZlIHRleHQgZWRpdG9yIGNoYW5nZXMuXG4gIC8vICAgKiBgZWRpdG9yYCBUaGUgYWN0aXZlIHtUZXh0RWRpdG9yfSBvciB1bmRlZmluZWQgaWYgdGhlcmUgaXMgbm90IGFuXG4gIC8vICAgICAgYWN0aXZlIHRleHQgZWRpdG9yLlxuICAvL1xuICAvLyBSZXR1cm5zIGEge0Rpc3Bvc2FibGV9IG9uIHdoaWNoIGAuZGlzcG9zZSgpYCBjYW4gYmUgY2FsbGVkIHRvIHVuc3Vic2NyaWJlLlxuICBvYnNlcnZlQWN0aXZlVGV4dEVkaXRvciAoY2FsbGJhY2spIHtcbiAgICBjYWxsYmFjayh0aGlzLmdldEFjdGl2ZVRleHRFZGl0b3IoKSlcblxuICAgIHJldHVybiB0aGlzLm9uRGlkQ2hhbmdlQWN0aXZlVGV4dEVkaXRvcihjYWxsYmFjaylcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogSW52b2tlIHRoZSBnaXZlbiBjYWxsYmFjayB3aGVuZXZlciBhbiBpdGVtIGlzIG9wZW5lZC4gVW5saWtlXG4gIC8vIHs6Om9uRGlkQWRkUGFuZUl0ZW19LCBvYnNlcnZlcnMgd2lsbCBiZSBub3RpZmllZCBmb3IgaXRlbXMgdGhhdCBhcmUgYWxyZWFkeVxuICAvLyBwcmVzZW50IGluIHRoZSB3b3Jrc3BhY2Ugd2hlbiB0aGV5IGFyZSByZW9wZW5lZC5cbiAgLy9cbiAgLy8gKiBgY2FsbGJhY2tgIHtGdW5jdGlvbn0gdG8gYmUgY2FsbGVkIHdoZW5ldmVyIGFuIGl0ZW0gaXMgb3BlbmVkLlxuICAvLyAgICogYGV2ZW50YCB7T2JqZWN0fSB3aXRoIHRoZSBmb2xsb3dpbmcga2V5czpcbiAgLy8gICAgICogYHVyaWAge1N0cmluZ30gcmVwcmVzZW50aW5nIHRoZSBvcGVuZWQgVVJJLiBDb3VsZCBiZSBgdW5kZWZpbmVkYC5cbiAgLy8gICAgICogYGl0ZW1gIFRoZSBvcGVuZWQgaXRlbS5cbiAgLy8gICAgICogYHBhbmVgIFRoZSBwYW5lIGluIHdoaWNoIHRoZSBpdGVtIHdhcyBvcGVuZWQuXG4gIC8vICAgICAqIGBpbmRleGAgVGhlIGluZGV4IG9mIHRoZSBvcGVuZWQgaXRlbSBvbiBpdHMgcGFuZS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEaXNwb3NhYmxlfSBvbiB3aGljaCBgLmRpc3Bvc2UoKWAgY2FuIGJlIGNhbGxlZCB0byB1bnN1YnNjcmliZS5cbiAgb25EaWRPcGVuIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1vcGVuJywgY2FsbGJhY2spXG4gIH1cblxuICAvLyBFeHRlbmRlZDogSW52b2tlIHRoZSBnaXZlbiBjYWxsYmFjayB3aGVuIGEgcGFuZSBpcyBhZGRlZCB0byB0aGUgd29ya3NwYWNlLlxuICAvL1xuICAvLyAqIGBjYWxsYmFja2Age0Z1bmN0aW9ufSB0byBiZSBjYWxsZWQgcGFuZXMgYXJlIGFkZGVkLlxuICAvLyAgICogYGV2ZW50YCB7T2JqZWN0fSB3aXRoIHRoZSBmb2xsb3dpbmcga2V5czpcbiAgLy8gICAgICogYHBhbmVgIFRoZSBhZGRlZCBwYW5lLlxuICAvL1xuICAvLyBSZXR1cm5zIGEge0Rpc3Bvc2FibGV9IG9uIHdoaWNoIGAuZGlzcG9zZSgpYCBjYW4gYmUgY2FsbGVkIHRvIHVuc3Vic2NyaWJlLlxuICBvbkRpZEFkZFBhbmUgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgLi4udGhpcy5nZXRQYW5lQ29udGFpbmVycygpLm1hcChjb250YWluZXIgPT4gY29udGFpbmVyLm9uRGlkQWRkUGFuZShjYWxsYmFjaykpXG4gICAgKVxuICB9XG5cbiAgLy8gRXh0ZW5kZWQ6IEludm9rZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgYmVmb3JlIGEgcGFuZSBpcyBkZXN0cm95ZWQgaW4gdGhlXG4gIC8vIHdvcmtzcGFjZS5cbiAgLy9cbiAgLy8gKiBgY2FsbGJhY2tgIHtGdW5jdGlvbn0gdG8gYmUgY2FsbGVkIGJlZm9yZSBwYW5lcyBhcmUgZGVzdHJveWVkLlxuICAvLyAgICogYGV2ZW50YCB7T2JqZWN0fSB3aXRoIHRoZSBmb2xsb3dpbmcga2V5czpcbiAgLy8gICAgICogYHBhbmVgIFRoZSBwYW5lIHRvIGJlIGRlc3Ryb3llZC5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEaXNwb3NhYmxlfSBvbiB3aGljaCBgLmRpc3Bvc2UoKWAgY2FuIGJlIGNhbGxlZCB0byB1bnN1YnNjcmliZS5cbiAgb25XaWxsRGVzdHJveVBhbmUgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgLi4udGhpcy5nZXRQYW5lQ29udGFpbmVycygpLm1hcChjb250YWluZXIgPT4gY29udGFpbmVyLm9uV2lsbERlc3Ryb3lQYW5lKGNhbGxiYWNrKSlcbiAgICApXG4gIH1cblxuICAvLyBFeHRlbmRlZDogSW52b2tlIHRoZSBnaXZlbiBjYWxsYmFjayB3aGVuIGEgcGFuZSBpcyBkZXN0cm95ZWQgaW4gdGhlXG4gIC8vIHdvcmtzcGFjZS5cbiAgLy9cbiAgLy8gKiBgY2FsbGJhY2tgIHtGdW5jdGlvbn0gdG8gYmUgY2FsbGVkIHBhbmVzIGFyZSBkZXN0cm95ZWQuXG4gIC8vICAgKiBgZXZlbnRgIHtPYmplY3R9IHdpdGggdGhlIGZvbGxvd2luZyBrZXlzOlxuICAvLyAgICAgKiBgcGFuZWAgVGhlIGRlc3Ryb3llZCBwYW5lLlxuICAvL1xuICAvLyBSZXR1cm5zIGEge0Rpc3Bvc2FibGV9IG9uIHdoaWNoIGAuZGlzcG9zZSgpYCBjYW4gYmUgY2FsbGVkIHRvIHVuc3Vic2NyaWJlLlxuICBvbkRpZERlc3Ryb3lQYW5lIChjYWxsYmFjaykge1xuICAgIHJldHVybiBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgIC4uLnRoaXMuZ2V0UGFuZUNvbnRhaW5lcnMoKS5tYXAoY29udGFpbmVyID0+IGNvbnRhaW5lci5vbkRpZERlc3Ryb3lQYW5lKGNhbGxiYWNrKSlcbiAgICApXG4gIH1cblxuICAvLyBFeHRlbmRlZDogSW52b2tlIHRoZSBnaXZlbiBjYWxsYmFjayB3aXRoIGFsbCBjdXJyZW50IGFuZCBmdXR1cmUgcGFuZXMgaW4gdGhlXG4gIC8vIHdvcmtzcGFjZS5cbiAgLy9cbiAgLy8gKiBgY2FsbGJhY2tgIHtGdW5jdGlvbn0gdG8gYmUgY2FsbGVkIHdpdGggY3VycmVudCBhbmQgZnV0dXJlIHBhbmVzLlxuICAvLyAgICogYHBhbmVgIEEge1BhbmV9IHRoYXQgaXMgcHJlc2VudCBpbiB7OjpnZXRQYW5lc30gYXQgdGhlIHRpbWUgb2ZcbiAgLy8gICAgICBzdWJzY3JpcHRpb24gb3IgdGhhdCBpcyBhZGRlZCBhdCBzb21lIGxhdGVyIHRpbWUuXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7RGlzcG9zYWJsZX0gb24gd2hpY2ggYC5kaXNwb3NlKClgIGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUuXG4gIG9ic2VydmVQYW5lcyAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoXG4gICAgICAuLi50aGlzLmdldFBhbmVDb250YWluZXJzKCkubWFwKGNvbnRhaW5lciA9PiBjb250YWluZXIub2JzZXJ2ZVBhbmVzKGNhbGxiYWNrKSlcbiAgICApXG4gIH1cblxuICAvLyBFeHRlbmRlZDogSW52b2tlIHRoZSBnaXZlbiBjYWxsYmFjayB3aGVuIHRoZSBhY3RpdmUgcGFuZSBjaGFuZ2VzLlxuICAvL1xuICAvLyAqIGBjYWxsYmFja2Age0Z1bmN0aW9ufSB0byBiZSBjYWxsZWQgd2hlbiB0aGUgYWN0aXZlIHBhbmUgY2hhbmdlcy5cbiAgLy8gICAqIGBwYW5lYCBBIHtQYW5lfSB0aGF0IGlzIHRoZSBjdXJyZW50IHJldHVybiB2YWx1ZSBvZiB7OjpnZXRBY3RpdmVQYW5lfS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEaXNwb3NhYmxlfSBvbiB3aGljaCBgLmRpc3Bvc2UoKWAgY2FuIGJlIGNhbGxlZCB0byB1bnN1YnNjcmliZS5cbiAgb25EaWRDaGFuZ2VBY3RpdmVQYW5lIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1jaGFuZ2UtYWN0aXZlLXBhbmUnLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8vIEV4dGVuZGVkOiBJbnZva2UgdGhlIGdpdmVuIGNhbGxiYWNrIHdpdGggdGhlIGN1cnJlbnQgYWN0aXZlIHBhbmUgYW5kIHdoZW5cbiAgLy8gdGhlIGFjdGl2ZSBwYW5lIGNoYW5nZXMuXG4gIC8vXG4gIC8vICogYGNhbGxiYWNrYCB7RnVuY3Rpb259IHRvIGJlIGNhbGxlZCB3aXRoIHRoZSBjdXJyZW50IGFuZCBmdXR1cmUgYWN0aXZlI1xuICAvLyAgIHBhbmVzLlxuICAvLyAgICogYHBhbmVgIEEge1BhbmV9IHRoYXQgaXMgdGhlIGN1cnJlbnQgcmV0dXJuIHZhbHVlIG9mIHs6OmdldEFjdGl2ZVBhbmV9LlxuICAvL1xuICAvLyBSZXR1cm5zIGEge0Rpc3Bvc2FibGV9IG9uIHdoaWNoIGAuZGlzcG9zZSgpYCBjYW4gYmUgY2FsbGVkIHRvIHVuc3Vic2NyaWJlLlxuICBvYnNlcnZlQWN0aXZlUGFuZSAoY2FsbGJhY2spIHtcbiAgICBjYWxsYmFjayh0aGlzLmdldEFjdGl2ZVBhbmUoKSlcbiAgICByZXR1cm4gdGhpcy5vbkRpZENoYW5nZUFjdGl2ZVBhbmUoY2FsbGJhY2spXG4gIH1cblxuICAvLyBFeHRlbmRlZDogSW52b2tlIHRoZSBnaXZlbiBjYWxsYmFjayB3aGVuIGEgcGFuZSBpdGVtIGlzIGFkZGVkIHRvIHRoZVxuICAvLyB3b3Jrc3BhY2UuXG4gIC8vXG4gIC8vICogYGNhbGxiYWNrYCB7RnVuY3Rpb259IHRvIGJlIGNhbGxlZCB3aGVuIHBhbmUgaXRlbXMgYXJlIGFkZGVkLlxuICAvLyAgICogYGV2ZW50YCB7T2JqZWN0fSB3aXRoIHRoZSBmb2xsb3dpbmcga2V5czpcbiAgLy8gICAgICogYGl0ZW1gIFRoZSBhZGRlZCBwYW5lIGl0ZW0uXG4gIC8vICAgICAqIGBwYW5lYCB7UGFuZX0gY29udGFpbmluZyB0aGUgYWRkZWQgaXRlbS5cbiAgLy8gICAgICogYGluZGV4YCB7TnVtYmVyfSBpbmRpY2F0aW5nIHRoZSBpbmRleCBvZiB0aGUgYWRkZWQgaXRlbSBpbiBpdHMgcGFuZS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEaXNwb3NhYmxlfSBvbiB3aGljaCBgLmRpc3Bvc2UoKWAgY2FuIGJlIGNhbGxlZCB0byB1bnN1YnNjcmliZS5cbiAgb25EaWRBZGRQYW5lSXRlbSAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoXG4gICAgICAuLi50aGlzLmdldFBhbmVDb250YWluZXJzKCkubWFwKGNvbnRhaW5lciA9PiBjb250YWluZXIub25EaWRBZGRQYW5lSXRlbShjYWxsYmFjaykpXG4gICAgKVxuICB9XG5cbiAgLy8gRXh0ZW5kZWQ6IEludm9rZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgd2hlbiBhIHBhbmUgaXRlbSBpcyBhYm91dCB0byBiZVxuICAvLyBkZXN0cm95ZWQsIGJlZm9yZSB0aGUgdXNlciBpcyBwcm9tcHRlZCB0byBzYXZlIGl0LlxuICAvL1xuICAvLyAqIGBjYWxsYmFja2Age0Z1bmN0aW9ufSB0byBiZSBjYWxsZWQgYmVmb3JlIHBhbmUgaXRlbXMgYXJlIGRlc3Ryb3llZC4gSWYgdGhpcyBmdW5jdGlvbiByZXR1cm5zXG4gIC8vICAgYSB7UHJvbWlzZX0sIHRoZW4gdGhlIGl0ZW0gd2lsbCBub3QgYmUgZGVzdHJveWVkIHVudGlsIHRoZSBwcm9taXNlIHJlc29sdmVzLlxuICAvLyAgICogYGV2ZW50YCB7T2JqZWN0fSB3aXRoIHRoZSBmb2xsb3dpbmcga2V5czpcbiAgLy8gICAgICogYGl0ZW1gIFRoZSBpdGVtIHRvIGJlIGRlc3Ryb3llZC5cbiAgLy8gICAgICogYHBhbmVgIHtQYW5lfSBjb250YWluaW5nIHRoZSBpdGVtIHRvIGJlIGRlc3Ryb3llZC5cbiAgLy8gICAgICogYGluZGV4YCB7TnVtYmVyfSBpbmRpY2F0aW5nIHRoZSBpbmRleCBvZiB0aGUgaXRlbSB0byBiZSBkZXN0cm95ZWQgaW5cbiAgLy8gICAgICAgaXRzIHBhbmUuXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7RGlzcG9zYWJsZX0gb24gd2hpY2ggYC5kaXNwb3NlYCBjYW4gYmUgY2FsbGVkIHRvIHVuc3Vic2NyaWJlLlxuICBvbldpbGxEZXN0cm95UGFuZUl0ZW0gKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgLi4udGhpcy5nZXRQYW5lQ29udGFpbmVycygpLm1hcChjb250YWluZXIgPT4gY29udGFpbmVyLm9uV2lsbERlc3Ryb3lQYW5lSXRlbShjYWxsYmFjaykpXG4gICAgKVxuICB9XG5cbiAgLy8gRXh0ZW5kZWQ6IEludm9rZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgd2hlbiBhIHBhbmUgaXRlbSBpcyBkZXN0cm95ZWQuXG4gIC8vXG4gIC8vICogYGNhbGxiYWNrYCB7RnVuY3Rpb259IHRvIGJlIGNhbGxlZCB3aGVuIHBhbmUgaXRlbXMgYXJlIGRlc3Ryb3llZC5cbiAgLy8gICAqIGBldmVudGAge09iamVjdH0gd2l0aCB0aGUgZm9sbG93aW5nIGtleXM6XG4gIC8vICAgICAqIGBpdGVtYCBUaGUgZGVzdHJveWVkIGl0ZW0uXG4gIC8vICAgICAqIGBwYW5lYCB7UGFuZX0gY29udGFpbmluZyB0aGUgZGVzdHJveWVkIGl0ZW0uXG4gIC8vICAgICAqIGBpbmRleGAge051bWJlcn0gaW5kaWNhdGluZyB0aGUgaW5kZXggb2YgdGhlIGRlc3Ryb3llZCBpdGVtIGluIGl0c1xuICAvLyAgICAgICBwYW5lLlxuICAvL1xuICAvLyBSZXR1cm5zIGEge0Rpc3Bvc2FibGV9IG9uIHdoaWNoIGAuZGlzcG9zZWAgY2FuIGJlIGNhbGxlZCB0byB1bnN1YnNjcmliZS5cbiAgb25EaWREZXN0cm95UGFuZUl0ZW0gKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgLi4udGhpcy5nZXRQYW5lQ29udGFpbmVycygpLm1hcChjb250YWluZXIgPT4gY29udGFpbmVyLm9uRGlkRGVzdHJveVBhbmVJdGVtKGNhbGxiYWNrKSlcbiAgICApXG4gIH1cblxuICAvLyBFeHRlbmRlZDogSW52b2tlIHRoZSBnaXZlbiBjYWxsYmFjayB3aGVuIGEgdGV4dCBlZGl0b3IgaXMgYWRkZWQgdG8gdGhlXG4gIC8vIHdvcmtzcGFjZS5cbiAgLy9cbiAgLy8gKiBgY2FsbGJhY2tgIHtGdW5jdGlvbn0gdG8gYmUgY2FsbGVkIHBhbmVzIGFyZSBhZGRlZC5cbiAgLy8gICAqIGBldmVudGAge09iamVjdH0gd2l0aCB0aGUgZm9sbG93aW5nIGtleXM6XG4gIC8vICAgICAqIGB0ZXh0RWRpdG9yYCB7VGV4dEVkaXRvcn0gdGhhdCB3YXMgYWRkZWQuXG4gIC8vICAgICAqIGBwYW5lYCB7UGFuZX0gY29udGFpbmluZyB0aGUgYWRkZWQgdGV4dCBlZGl0b3IuXG4gIC8vICAgICAqIGBpbmRleGAge051bWJlcn0gaW5kaWNhdGluZyB0aGUgaW5kZXggb2YgdGhlIGFkZGVkIHRleHQgZWRpdG9yIGluIGl0c1xuICAvLyAgICAgICAgcGFuZS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEaXNwb3NhYmxlfSBvbiB3aGljaCBgLmRpc3Bvc2UoKWAgY2FuIGJlIGNhbGxlZCB0byB1bnN1YnNjcmliZS5cbiAgb25EaWRBZGRUZXh0RWRpdG9yIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1hZGQtdGV4dC1lZGl0b3InLCBjYWxsYmFjaylcbiAgfVxuXG4gIG9uRGlkQ2hhbmdlV2luZG93VGl0bGUgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNoYW5nZS13aW5kb3ctdGl0bGUnLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8qXG4gIFNlY3Rpb246IE9wZW5pbmdcbiAgKi9cblxuICAvLyBFc3NlbnRpYWw6IE9wZW5zIHRoZSBnaXZlbiBVUkkgaW4gQXRvbSBhc3luY2hyb25vdXNseS5cbiAgLy8gSWYgdGhlIFVSSSBpcyBhbHJlYWR5IG9wZW4sIHRoZSBleGlzdGluZyBpdGVtIGZvciB0aGF0IFVSSSB3aWxsIGJlXG4gIC8vIGFjdGl2YXRlZC4gSWYgbm8gVVJJIGlzIGdpdmVuLCBvciBubyByZWdpc3RlcmVkIG9wZW5lciBjYW4gb3BlblxuICAvLyB0aGUgVVJJLCBhIG5ldyBlbXB0eSB7VGV4dEVkaXRvcn0gd2lsbCBiZSBjcmVhdGVkLlxuICAvL1xuICAvLyAqIGB1cmlgIChvcHRpb25hbCkgQSB7U3RyaW5nfSBjb250YWluaW5nIGEgVVJJLlxuICAvLyAqIGBvcHRpb25zYCAob3B0aW9uYWwpIHtPYmplY3R9XG4gIC8vICAgKiBgaW5pdGlhbExpbmVgIEEge051bWJlcn0gaW5kaWNhdGluZyB3aGljaCByb3cgdG8gbW92ZSB0aGUgY3Vyc29yIHRvXG4gIC8vICAgICBpbml0aWFsbHkuIERlZmF1bHRzIHRvIGAwYC5cbiAgLy8gICAqIGBpbml0aWFsQ29sdW1uYCBBIHtOdW1iZXJ9IGluZGljYXRpbmcgd2hpY2ggY29sdW1uIHRvIG1vdmUgdGhlIGN1cnNvciB0b1xuICAvLyAgICAgaW5pdGlhbGx5LiBEZWZhdWx0cyB0byBgMGAuXG4gIC8vICAgKiBgc3BsaXRgIEVpdGhlciAnbGVmdCcsICdyaWdodCcsICd1cCcgb3IgJ2Rvd24nLlxuICAvLyAgICAgSWYgJ2xlZnQnLCB0aGUgaXRlbSB3aWxsIGJlIG9wZW5lZCBpbiBsZWZ0bW9zdCBwYW5lIG9mIHRoZSBjdXJyZW50IGFjdGl2ZSBwYW5lJ3Mgcm93LlxuICAvLyAgICAgSWYgJ3JpZ2h0JywgdGhlIGl0ZW0gd2lsbCBiZSBvcGVuZWQgaW4gdGhlIHJpZ2h0bW9zdCBwYW5lIG9mIHRoZSBjdXJyZW50IGFjdGl2ZSBwYW5lJ3Mgcm93LiBJZiBvbmx5IG9uZSBwYW5lIGV4aXN0cyBpbiB0aGUgcm93LCBhIG5ldyBwYW5lIHdpbGwgYmUgY3JlYXRlZC5cbiAgLy8gICAgIElmICd1cCcsIHRoZSBpdGVtIHdpbGwgYmUgb3BlbmVkIGluIHRvcG1vc3QgcGFuZSBvZiB0aGUgY3VycmVudCBhY3RpdmUgcGFuZSdzIGNvbHVtbi5cbiAgLy8gICAgIElmICdkb3duJywgdGhlIGl0ZW0gd2lsbCBiZSBvcGVuZWQgaW4gdGhlIGJvdHRvbW1vc3QgcGFuZSBvZiB0aGUgY3VycmVudCBhY3RpdmUgcGFuZSdzIGNvbHVtbi4gSWYgb25seSBvbmUgcGFuZSBleGlzdHMgaW4gdGhlIGNvbHVtbiwgYSBuZXcgcGFuZSB3aWxsIGJlIGNyZWF0ZWQuXG4gIC8vICAgKiBgYWN0aXZhdGVQYW5lYCBBIHtCb29sZWFufSBpbmRpY2F0aW5nIHdoZXRoZXIgdG8gY2FsbCB7UGFuZTo6YWN0aXZhdGV9IG9uXG4gIC8vICAgICBjb250YWluaW5nIHBhbmUuIERlZmF1bHRzIHRvIGB0cnVlYC5cbiAgLy8gICAqIGBhY3RpdmF0ZUl0ZW1gIEEge0Jvb2xlYW59IGluZGljYXRpbmcgd2hldGhlciB0byBjYWxsIHtQYW5lOjphY3RpdmF0ZUl0ZW19XG4gIC8vICAgICBvbiBjb250YWluaW5nIHBhbmUuIERlZmF1bHRzIHRvIGB0cnVlYC5cbiAgLy8gICAqIGBwZW5kaW5nYCBBIHtCb29sZWFufSBpbmRpY2F0aW5nIHdoZXRoZXIgb3Igbm90IHRoZSBpdGVtIHNob3VsZCBiZSBvcGVuZWRcbiAgLy8gICAgIGluIGEgcGVuZGluZyBzdGF0ZS4gRXhpc3RpbmcgcGVuZGluZyBpdGVtcyBpbiBhIHBhbmUgYXJlIHJlcGxhY2VkIHdpdGhcbiAgLy8gICAgIG5ldyBwZW5kaW5nIGl0ZW1zIHdoZW4gdGhleSBhcmUgb3BlbmVkLlxuICAvLyAgICogYHNlYXJjaEFsbFBhbmVzYCBBIHtCb29sZWFufS4gSWYgYHRydWVgLCB0aGUgd29ya3NwYWNlIHdpbGwgYXR0ZW1wdCB0b1xuICAvLyAgICAgYWN0aXZhdGUgYW4gZXhpc3RpbmcgaXRlbSBmb3IgdGhlIGdpdmVuIFVSSSBvbiBhbnkgcGFuZS5cbiAgLy8gICAgIElmIGBmYWxzZWAsIG9ubHkgdGhlIGFjdGl2ZSBwYW5lIHdpbGwgYmUgc2VhcmNoZWQgZm9yXG4gIC8vICAgICBhbiBleGlzdGluZyBpdGVtIGZvciB0aGUgc2FtZSBVUkkuIERlZmF1bHRzIHRvIGBmYWxzZWAuXG4gIC8vICAgKiBgbG9jYXRpb25gIChvcHRpb25hbCkgQSB7U3RyaW5nfSBjb250YWluaW5nIHRoZSBuYW1lIG9mIHRoZSBsb2NhdGlvblxuICAvLyAgICAgaW4gd2hpY2ggdGhpcyBpdGVtIHNob3VsZCBiZSBvcGVuZWQgKG9uZSBvZiBcImxlZnRcIiwgXCJyaWdodFwiLCBcImJvdHRvbVwiLFxuICAvLyAgICAgb3IgXCJjZW50ZXJcIikuIElmIG9taXR0ZWQsIEF0b20gd2lsbCBmYWxsIGJhY2sgdG8gdGhlIGxhc3QgbG9jYXRpb24gaW5cbiAgLy8gICAgIHdoaWNoIGEgdXNlciBoYXMgcGxhY2VkIGFuIGl0ZW0gd2l0aCB0aGUgc2FtZSBVUkkgb3IsIGlmIHRoaXMgaXMgYSBuZXdcbiAgLy8gICAgIFVSSSwgdGhlIGRlZmF1bHQgbG9jYXRpb24gc3BlY2lmaWVkIGJ5IHRoZSBpdGVtLiBOT1RFOiBUaGlzIG9wdGlvblxuICAvLyAgICAgc2hvdWxkIGFsbW9zdCBhbHdheXMgYmUgb21pdHRlZCB0byBob25vciB1c2VyIHByZWZlcmVuY2UuXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7UHJvbWlzZX0gdGhhdCByZXNvbHZlcyB0byB0aGUge1RleHRFZGl0b3J9IGZvciB0aGUgZmlsZSBVUkkuXG4gIGFzeW5jIG9wZW4gKGl0ZW1PclVSSSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgbGV0IHVyaSwgaXRlbVxuICAgIGlmICh0eXBlb2YgaXRlbU9yVVJJID09PSAnc3RyaW5nJykge1xuICAgICAgdXJpID0gdGhpcy5wcm9qZWN0LnJlc29sdmVQYXRoKGl0ZW1PclVSSSlcbiAgICB9IGVsc2UgaWYgKGl0ZW1PclVSSSkge1xuICAgICAgaXRlbSA9IGl0ZW1PclVSSVxuICAgICAgaWYgKHR5cGVvZiBpdGVtLmdldFVSSSA9PT0gJ2Z1bmN0aW9uJykgdXJpID0gaXRlbS5nZXRVUkkoKVxuICAgIH1cblxuICAgIGlmICghYXRvbS5jb25maWcuZ2V0KCdjb3JlLmFsbG93UGVuZGluZ1BhbmVJdGVtcycpKSB7XG4gICAgICBvcHRpb25zLnBlbmRpbmcgPSBmYWxzZVxuICAgIH1cblxuICAgIC8vIEF2b2lkIGFkZGluZyBVUkxzIGFzIHJlY2VudCBkb2N1bWVudHMgdG8gd29yay1hcm91bmQgdGhpcyBTcG90bGlnaHQgY3Jhc2g6XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2F0b20vYXRvbS9pc3N1ZXMvMTAwNzFcbiAgICBpZiAodXJpICYmICghdXJsLnBhcnNlKHVyaSkucHJvdG9jb2wgfHwgcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJykpIHtcbiAgICAgIHRoaXMuYXBwbGljYXRpb25EZWxlZ2F0ZS5hZGRSZWNlbnREb2N1bWVudCh1cmkpXG4gICAgfVxuXG4gICAgbGV0IHBhbmUsIGl0ZW1FeGlzdHNJbldvcmtzcGFjZVxuXG4gICAgLy8gVHJ5IHRvIGZpbmQgYW4gZXhpc3RpbmcgaXRlbSBpbiB0aGUgd29ya3NwYWNlLlxuICAgIGlmIChpdGVtIHx8IHVyaSkge1xuICAgICAgaWYgKG9wdGlvbnMucGFuZSkge1xuICAgICAgICBwYW5lID0gb3B0aW9ucy5wYW5lXG4gICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuc2VhcmNoQWxsUGFuZXMpIHtcbiAgICAgICAgcGFuZSA9IGl0ZW0gPyB0aGlzLnBhbmVGb3JJdGVtKGl0ZW0pIDogdGhpcy5wYW5lRm9yVVJJKHVyaSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIElmIGFuIGl0ZW0gd2l0aCB0aGUgZ2l2ZW4gVVJJIGlzIGFscmVhZHkgaW4gdGhlIHdvcmtzcGFjZSwgYXNzdW1lXG4gICAgICAgIC8vIHRoYXQgaXRlbSdzIHBhbmUgY29udGFpbmVyIGlzIHRoZSBwcmVmZXJyZWQgbG9jYXRpb24gZm9yIHRoYXQgVVJJLlxuICAgICAgICBsZXQgY29udGFpbmVyXG4gICAgICAgIGlmICh1cmkpIGNvbnRhaW5lciA9IHRoaXMucGFuZUNvbnRhaW5lckZvclVSSSh1cmkpXG4gICAgICAgIGlmICghY29udGFpbmVyKSBjb250YWluZXIgPSB0aGlzLmdldEFjdGl2ZVBhbmVDb250YWluZXIoKVxuXG4gICAgICAgIC8vIFRoZSBgc3BsaXRgIG9wdGlvbiBhZmZlY3RzIHdoZXJlIHdlIHNlYXJjaCBmb3IgdGhlIGl0ZW0uXG4gICAgICAgIHBhbmUgPSBjb250YWluZXIuZ2V0QWN0aXZlUGFuZSgpXG4gICAgICAgIHN3aXRjaCAob3B0aW9ucy5zcGxpdCkge1xuICAgICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgICAgcGFuZSA9IHBhbmUuZmluZExlZnRtb3N0U2libGluZygpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICAgIHBhbmUgPSBwYW5lLmZpbmRSaWdodG1vc3RTaWJsaW5nKClcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgY2FzZSAndXAnOlxuICAgICAgICAgICAgcGFuZSA9IHBhbmUuZmluZFRvcG1vc3RTaWJsaW5nKClcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgY2FzZSAnZG93bic6XG4gICAgICAgICAgICBwYW5lID0gcGFuZS5maW5kQm90dG9tbW9zdFNpYmxpbmcoKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocGFuZSkge1xuICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgIGl0ZW1FeGlzdHNJbldvcmtzcGFjZSA9IHBhbmUuZ2V0SXRlbXMoKS5pbmNsdWRlcyhpdGVtKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW0gPSBwYW5lLml0ZW1Gb3JVUkkodXJpKVxuICAgICAgICAgIGl0ZW1FeGlzdHNJbldvcmtzcGFjZSA9IGl0ZW0gIT0gbnVsbFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgd2UgYWxyZWFkeSBoYXZlIGFuIGl0ZW0gYXQgdGhpcyBzdGFnZSwgd2Ugd29uJ3QgbmVlZCB0byBkbyBhbiBhc3luY1xuICAgIC8vIGxvb2t1cCBvZiB0aGUgVVJJLCBzbyB3ZSB5aWVsZCB0aGUgZXZlbnQgbG9vcCB0byBlbnN1cmUgdGhpcyBtZXRob2RcbiAgICAvLyBpcyBjb25zaXN0ZW50bHkgYXN5bmNocm9ub3VzLlxuICAgIGlmIChpdGVtKSBhd2FpdCBQcm9taXNlLnJlc29sdmUoKVxuXG4gICAgaWYgKCFpdGVtRXhpc3RzSW5Xb3Jrc3BhY2UpIHtcbiAgICAgIGl0ZW0gPSBpdGVtIHx8IGF3YWl0IHRoaXMuY3JlYXRlSXRlbUZvclVSSSh1cmksIG9wdGlvbnMpXG4gICAgICBpZiAoIWl0ZW0pIHJldHVyblxuXG4gICAgICBpZiAob3B0aW9ucy5wYW5lKSB7XG4gICAgICAgIHBhbmUgPSBvcHRpb25zLnBhbmVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBsb2NhdGlvbiA9IG9wdGlvbnMubG9jYXRpb25cbiAgICAgICAgaWYgKCFsb2NhdGlvbiAmJiAhb3B0aW9ucy5zcGxpdCAmJiB1cmkgJiYgdGhpcy5lbmFibGVQZXJzaXN0ZW5jZSkge1xuICAgICAgICAgIGxvY2F0aW9uID0gYXdhaXQgdGhpcy5pdGVtTG9jYXRpb25TdG9yZS5sb2FkKHVyaSlcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWxvY2F0aW9uICYmIHR5cGVvZiBpdGVtLmdldERlZmF1bHRMb2NhdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGxvY2F0aW9uID0gaXRlbS5nZXREZWZhdWx0TG9jYXRpb24oKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYWxsb3dlZExvY2F0aW9ucyA9IHR5cGVvZiBpdGVtLmdldEFsbG93ZWRMb2NhdGlvbnMgPT09ICdmdW5jdGlvbicgPyBpdGVtLmdldEFsbG93ZWRMb2NhdGlvbnMoKSA6IEFMTF9MT0NBVElPTlNcbiAgICAgICAgbG9jYXRpb24gPSBhbGxvd2VkTG9jYXRpb25zLmluY2x1ZGVzKGxvY2F0aW9uKSA/IGxvY2F0aW9uIDogYWxsb3dlZExvY2F0aW9uc1swXVxuXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMucGFuZUNvbnRhaW5lcnNbbG9jYXRpb25dIHx8IHRoaXMuZ2V0Q2VudGVyKClcbiAgICAgICAgcGFuZSA9IGNvbnRhaW5lci5nZXRBY3RpdmVQYW5lKClcbiAgICAgICAgc3dpdGNoIChvcHRpb25zLnNwbGl0KSB7XG4gICAgICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgICAgICBwYW5lID0gcGFuZS5maW5kTGVmdG1vc3RTaWJsaW5nKClcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgY2FzZSAncmlnaHQnOlxuICAgICAgICAgICAgcGFuZSA9IHBhbmUuZmluZE9yQ3JlYXRlUmlnaHRtb3N0U2libGluZygpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgJ3VwJzpcbiAgICAgICAgICAgIHBhbmUgPSBwYW5lLmZpbmRUb3Btb3N0U2libGluZygpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgJ2Rvd24nOlxuICAgICAgICAgICAgcGFuZSA9IHBhbmUuZmluZE9yQ3JlYXRlQm90dG9tbW9zdFNpYmxpbmcoKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy5wZW5kaW5nICYmIChwYW5lLmdldFBlbmRpbmdJdGVtKCkgPT09IGl0ZW0pKSB7XG4gICAgICBwYW5lLmNsZWFyUGVuZGluZ0l0ZW0oKVxuICAgIH1cblxuICAgIHRoaXMuaXRlbU9wZW5lZChpdGVtKVxuXG4gICAgaWYgKG9wdGlvbnMuYWN0aXZhdGVJdGVtID09PSBmYWxzZSkge1xuICAgICAgcGFuZS5hZGRJdGVtKGl0ZW0sIHtwZW5kaW5nOiBvcHRpb25zLnBlbmRpbmd9KVxuICAgIH0gZWxzZSB7XG4gICAgICBwYW5lLmFjdGl2YXRlSXRlbShpdGVtLCB7cGVuZGluZzogb3B0aW9ucy5wZW5kaW5nfSlcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5hY3RpdmF0ZVBhbmUgIT09IGZhbHNlKSB7XG4gICAgICBwYW5lLmFjdGl2YXRlKClcbiAgICB9XG5cbiAgICBsZXQgaW5pdGlhbENvbHVtbiA9IDBcbiAgICBsZXQgaW5pdGlhbExpbmUgPSAwXG4gICAgaWYgKCFOdW1iZXIuaXNOYU4ob3B0aW9ucy5pbml0aWFsTGluZSkpIHtcbiAgICAgIGluaXRpYWxMaW5lID0gb3B0aW9ucy5pbml0aWFsTGluZVxuICAgIH1cbiAgICBpZiAoIU51bWJlci5pc05hTihvcHRpb25zLmluaXRpYWxDb2x1bW4pKSB7XG4gICAgICBpbml0aWFsQ29sdW1uID0gb3B0aW9ucy5pbml0aWFsQ29sdW1uXG4gICAgfVxuICAgIGlmIChpbml0aWFsTGluZSA+PSAwIHx8IGluaXRpYWxDb2x1bW4gPj0gMCkge1xuICAgICAgaWYgKHR5cGVvZiBpdGVtLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGl0ZW0uc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oW2luaXRpYWxMaW5lLCBpbml0aWFsQ29sdW1uXSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBpbmRleCA9IHBhbmUuZ2V0QWN0aXZlSXRlbUluZGV4KClcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLW9wZW4nLCB7dXJpLCBwYW5lLCBpdGVtLCBpbmRleH0pXG4gICAgcmV0dXJuIGl0ZW1cbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogU2VhcmNoIHRoZSB3b3Jrc3BhY2UgZm9yIGl0ZW1zIG1hdGNoaW5nIHRoZSBnaXZlbiBVUkkgYW5kIGhpZGUgdGhlbS5cbiAgLy9cbiAgLy8gKiBgaXRlbU9yVVJJYCBUaGUgaXRlbSB0byBoaWRlIG9yIGEge1N0cmluZ30gY29udGFpbmluZyB0aGUgVVJJXG4gIC8vICAgb2YgdGhlIGl0ZW0gdG8gaGlkZS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtCb29sZWFufSBpbmRpY2F0aW5nIHdoZXRoZXIgYW55IGl0ZW1zIHdlcmUgZm91bmQgKGFuZCBoaWRkZW4pLlxuICBoaWRlIChpdGVtT3JVUkkpIHtcbiAgICBsZXQgZm91bmRJdGVtcyA9IGZhbHNlXG5cbiAgICAvLyBJZiBhbnkgdmlzaWJsZSBpdGVtIGhhcyB0aGUgZ2l2ZW4gVVJJLCBoaWRlIGl0XG4gICAgZm9yIChjb25zdCBjb250YWluZXIgb2YgdGhpcy5nZXRQYW5lQ29udGFpbmVycygpKSB7XG4gICAgICBjb25zdCBpc0NlbnRlciA9IGNvbnRhaW5lciA9PT0gdGhpcy5nZXRDZW50ZXIoKVxuICAgICAgaWYgKGlzQ2VudGVyIHx8IGNvbnRhaW5lci5pc1Zpc2libGUoKSkge1xuICAgICAgICBmb3IgKGNvbnN0IHBhbmUgb2YgY29udGFpbmVyLmdldFBhbmVzKCkpIHtcbiAgICAgICAgICBjb25zdCBhY3RpdmVJdGVtID0gcGFuZS5nZXRBY3RpdmVJdGVtKClcbiAgICAgICAgICBjb25zdCBmb3VuZEl0ZW0gPSAoXG4gICAgICAgICAgICBhY3RpdmVJdGVtICE9IG51bGwgJiYgKFxuICAgICAgICAgICAgICBhY3RpdmVJdGVtID09PSBpdGVtT3JVUkkgfHxcbiAgICAgICAgICAgICAgdHlwZW9mIGFjdGl2ZUl0ZW0uZ2V0VVJJID09PSAnZnVuY3Rpb24nICYmIGFjdGl2ZUl0ZW0uZ2V0VVJJKCkgPT09IGl0ZW1PclVSSVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgICBpZiAoZm91bmRJdGVtKSB7XG4gICAgICAgICAgICBmb3VuZEl0ZW1zID0gdHJ1ZVxuICAgICAgICAgICAgLy8gV2UgY2FuJ3QgcmVhbGx5IGhpZGUgdGhlIGNlbnRlciBzbyB3ZSBqdXN0IGRlc3Ryb3kgdGhlIGl0ZW0uXG4gICAgICAgICAgICBpZiAoaXNDZW50ZXIpIHtcbiAgICAgICAgICAgICAgcGFuZS5kZXN0cm95SXRlbShhY3RpdmVJdGVtKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29udGFpbmVyLmhpZGUoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmb3VuZEl0ZW1zXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IFNlYXJjaCB0aGUgd29ya3NwYWNlIGZvciBpdGVtcyBtYXRjaGluZyB0aGUgZ2l2ZW4gVVJJLiBJZiBhbnkgYXJlIGZvdW5kLCBoaWRlIHRoZW0uXG4gIC8vIE90aGVyd2lzZSwgb3BlbiB0aGUgVVJMLlxuICAvL1xuICAvLyAqIGBpdGVtT3JVUklgIChvcHRpb25hbCkgVGhlIGl0ZW0gdG8gdG9nZ2xlIG9yIGEge1N0cmluZ30gY29udGFpbmluZyB0aGUgVVJJXG4gIC8vICAgb2YgdGhlIGl0ZW0gdG8gdG9nZ2xlLlxuICAvL1xuICAvLyBSZXR1cm5zIGEgUHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIGl0ZW0gaXMgc2hvd24gb3IgaGlkZGVuLlxuICB0b2dnbGUgKGl0ZW1PclVSSSkge1xuICAgIGlmICh0aGlzLmhpZGUoaXRlbU9yVVJJKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLm9wZW4oaXRlbU9yVVJJLCB7c2VhcmNoQWxsUGFuZXM6IHRydWV9KVxuICAgIH1cbiAgfVxuXG4gIC8vIE9wZW4gQXRvbSdzIGxpY2Vuc2UgaW4gdGhlIGFjdGl2ZSBwYW5lLlxuICBvcGVuTGljZW5zZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMub3BlbihwYXRoLmpvaW4ocHJvY2Vzcy5yZXNvdXJjZXNQYXRoLCAnTElDRU5TRS5tZCcpKVxuICB9XG5cbiAgLy8gU3luY2hyb25vdXNseSBvcGVuIHRoZSBnaXZlbiBVUkkgaW4gdGhlIGFjdGl2ZSBwYW5lLiAqKk9ubHkgdXNlIHRoaXMgbWV0aG9kXG4gIC8vIGluIHNwZWNzLiBDYWxsaW5nIHRoaXMgaW4gcHJvZHVjdGlvbiBjb2RlIHdpbGwgYmxvY2sgdGhlIFVJIHRocmVhZCBhbmRcbiAgLy8gZXZlcnlvbmUgd2lsbCBiZSBtYWQgYXQgeW91LioqXG4gIC8vXG4gIC8vICogYHVyaWAgQSB7U3RyaW5nfSBjb250YWluaW5nIGEgVVJJLlxuICAvLyAqIGBvcHRpb25zYCBBbiBvcHRpb25hbCBvcHRpb25zIHtPYmplY3R9XG4gIC8vICAgKiBgaW5pdGlhbExpbmVgIEEge051bWJlcn0gaW5kaWNhdGluZyB3aGljaCByb3cgdG8gbW92ZSB0aGUgY3Vyc29yIHRvXG4gIC8vICAgICBpbml0aWFsbHkuIERlZmF1bHRzIHRvIGAwYC5cbiAgLy8gICAqIGBpbml0aWFsQ29sdW1uYCBBIHtOdW1iZXJ9IGluZGljYXRpbmcgd2hpY2ggY29sdW1uIHRvIG1vdmUgdGhlIGN1cnNvciB0b1xuICAvLyAgICAgaW5pdGlhbGx5LiBEZWZhdWx0cyB0byBgMGAuXG4gIC8vICAgKiBgYWN0aXZhdGVQYW5lYCBBIHtCb29sZWFufSBpbmRpY2F0aW5nIHdoZXRoZXIgdG8gY2FsbCB7UGFuZTo6YWN0aXZhdGV9IG9uXG4gIC8vICAgICB0aGUgY29udGFpbmluZyBwYW5lLiBEZWZhdWx0cyB0byBgdHJ1ZWAuXG4gIC8vICAgKiBgYWN0aXZhdGVJdGVtYCBBIHtCb29sZWFufSBpbmRpY2F0aW5nIHdoZXRoZXIgdG8gY2FsbCB7UGFuZTo6YWN0aXZhdGVJdGVtfVxuICAvLyAgICAgb24gY29udGFpbmluZyBwYW5lLiBEZWZhdWx0cyB0byBgdHJ1ZWAuXG4gIG9wZW5TeW5jICh1cmlfID0gJycsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHtpbml0aWFsTGluZSwgaW5pdGlhbENvbHVtbn0gPSBvcHRpb25zXG4gICAgY29uc3QgYWN0aXZhdGVQYW5lID0gb3B0aW9ucy5hY3RpdmF0ZVBhbmUgIT0gbnVsbCA/IG9wdGlvbnMuYWN0aXZhdGVQYW5lIDogdHJ1ZVxuICAgIGNvbnN0IGFjdGl2YXRlSXRlbSA9IG9wdGlvbnMuYWN0aXZhdGVJdGVtICE9IG51bGwgPyBvcHRpb25zLmFjdGl2YXRlSXRlbSA6IHRydWVcblxuICAgIGNvbnN0IHVyaSA9IHRoaXMucHJvamVjdC5yZXNvbHZlUGF0aCh1cmlfKVxuICAgIGxldCBpdGVtID0gdGhpcy5nZXRBY3RpdmVQYW5lKCkuaXRlbUZvclVSSSh1cmkpXG4gICAgaWYgKHVyaSAmJiAoaXRlbSA9PSBudWxsKSkge1xuICAgICAgZm9yIChjb25zdCBvcGVuZXIgb2YgdGhpcy5nZXRPcGVuZXJzKCkpIHtcbiAgICAgICAgaXRlbSA9IG9wZW5lcih1cmksIG9wdGlvbnMpXG4gICAgICAgIGlmIChpdGVtKSBicmVha1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXRlbSA9PSBudWxsKSB7XG4gICAgICBpdGVtID0gdGhpcy5wcm9qZWN0Lm9wZW5TeW5jKHVyaSwge2luaXRpYWxMaW5lLCBpbml0aWFsQ29sdW1ufSlcbiAgICB9XG5cbiAgICBpZiAoYWN0aXZhdGVJdGVtKSB7XG4gICAgICB0aGlzLmdldEFjdGl2ZVBhbmUoKS5hY3RpdmF0ZUl0ZW0oaXRlbSlcbiAgICB9XG4gICAgdGhpcy5pdGVtT3BlbmVkKGl0ZW0pXG4gICAgaWYgKGFjdGl2YXRlUGFuZSkge1xuICAgICAgdGhpcy5nZXRBY3RpdmVQYW5lKCkuYWN0aXZhdGUoKVxuICAgIH1cbiAgICByZXR1cm4gaXRlbVxuICB9XG5cbiAgb3BlblVSSUluUGFuZSAodXJpLCBwYW5lKSB7XG4gICAgcmV0dXJuIHRoaXMub3Blbih1cmksIHtwYW5lfSlcbiAgfVxuXG4gIC8vIFB1YmxpYzogQ3JlYXRlcyBhIG5ldyBpdGVtIHRoYXQgY29ycmVzcG9uZHMgdG8gdGhlIHByb3ZpZGVkIFVSSS5cbiAgLy9cbiAgLy8gSWYgbm8gVVJJIGlzIGdpdmVuLCBvciBubyByZWdpc3RlcmVkIG9wZW5lciBjYW4gb3BlbiB0aGUgVVJJLCBhIG5ldyBlbXB0eVxuICAvLyB7VGV4dEVkaXRvcn0gd2lsbCBiZSBjcmVhdGVkLlxuICAvL1xuICAvLyAqIGB1cmlgIEEge1N0cmluZ30gY29udGFpbmluZyBhIFVSSS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtQcm9taXNlfSB0aGF0IHJlc29sdmVzIHRvIHRoZSB7VGV4dEVkaXRvcn0gKG9yIG90aGVyIGl0ZW0pIGZvciB0aGUgZ2l2ZW4gVVJJLlxuICBjcmVhdGVJdGVtRm9yVVJJICh1cmksIG9wdGlvbnMpIHtcbiAgICBpZiAodXJpICE9IG51bGwpIHtcbiAgICAgIGZvciAobGV0IG9wZW5lciBvZiB0aGlzLmdldE9wZW5lcnMoKSkge1xuICAgICAgICBjb25zdCBpdGVtID0gb3BlbmVyKHVyaSwgb3B0aW9ucylcbiAgICAgICAgaWYgKGl0ZW0gIT0gbnVsbCkgcmV0dXJuIFByb21pc2UucmVzb2x2ZShpdGVtKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gdGhpcy5vcGVuVGV4dEZpbGUodXJpLCBvcHRpb25zKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzd2l0Y2ggKGVycm9yLmNvZGUpIHtcbiAgICAgICAgY2FzZSAnQ0FOQ0VMTEVEJzpcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgICAgY2FzZSAnRUFDQ0VTJzpcbiAgICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbk1hbmFnZXIuYWRkV2FybmluZyhgUGVybWlzc2lvbiBkZW5pZWQgJyR7ZXJyb3IucGF0aH0nYClcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgICAgY2FzZSAnRVBFUk0nOlxuICAgICAgICBjYXNlICdFQlVTWSc6XG4gICAgICAgIGNhc2UgJ0VOWElPJzpcbiAgICAgICAgY2FzZSAnRUlPJzpcbiAgICAgICAgY2FzZSAnRU5PVENPTk4nOlxuICAgICAgICBjYXNlICdVTktOT1dOJzpcbiAgICAgICAgY2FzZSAnRUNPTk5SRVNFVCc6XG4gICAgICAgIGNhc2UgJ0VJTlZBTCc6XG4gICAgICAgIGNhc2UgJ0VNRklMRSc6XG4gICAgICAgIGNhc2UgJ0VOT1RESVInOlxuICAgICAgICBjYXNlICdFQUdBSU4nOlxuICAgICAgICAgIHRoaXMubm90aWZpY2F0aW9uTWFuYWdlci5hZGRXYXJuaW5nKFxuICAgICAgICAgICAgYFVuYWJsZSB0byBvcGVuICcke2Vycm9yLnBhdGggIT0gbnVsbCA/IGVycm9yLnBhdGggOiB1cml9J2AsXG4gICAgICAgICAgICB7ZGV0YWlsOiBlcnJvci5tZXNzYWdlfVxuICAgICAgICAgIClcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBlcnJvclxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9wZW5UZXh0RmlsZSAodXJpLCBvcHRpb25zKSB7XG4gICAgY29uc3QgZmlsZVBhdGggPSB0aGlzLnByb2plY3QucmVzb2x2ZVBhdGgodXJpKVxuXG4gICAgaWYgKGZpbGVQYXRoICE9IG51bGwpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZzLmNsb3NlU3luYyhmcy5vcGVuU3luYyhmaWxlUGF0aCwgJ3InKSlcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIC8vIGFsbG93IEVOT0VOVCBlcnJvcnMgdG8gY3JlYXRlIGFuIGVkaXRvciBmb3IgcGF0aHMgdGhhdCBkb250IGV4aXN0XG4gICAgICAgIGlmIChlcnJvci5jb2RlICE9PSAnRU5PRU5UJykge1xuICAgICAgICAgIHRocm93IGVycm9yXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBmaWxlU2l6ZSA9IGZzLmdldFNpemVTeW5jKGZpbGVQYXRoKVxuXG4gICAgY29uc3QgbGFyZ2VGaWxlTW9kZSA9IGZpbGVTaXplID49ICgyICogMTA0ODU3NikgLy8gMk1CXG4gICAgaWYgKGZpbGVTaXplID49ICh0aGlzLmNvbmZpZy5nZXQoJ2NvcmUud2Fybk9uTGFyZ2VGaWxlTGltaXQnKSAqIDEwNDg1NzYpKSB7IC8vIDIwTUIgYnkgZGVmYXVsdFxuICAgICAgY29uc3QgY2hvaWNlID0gdGhpcy5hcHBsaWNhdGlvbkRlbGVnYXRlLmNvbmZpcm0oe1xuICAgICAgICBtZXNzYWdlOiAnQXRvbSB3aWxsIGJlIHVucmVzcG9uc2l2ZSBkdXJpbmcgdGhlIGxvYWRpbmcgb2YgdmVyeSBsYXJnZSBmaWxlcy4nLFxuICAgICAgICBkZXRhaWxlZE1lc3NhZ2U6ICdEbyB5b3Ugc3RpbGwgd2FudCB0byBsb2FkIHRoaXMgZmlsZT8nLFxuICAgICAgICBidXR0b25zOiBbJ1Byb2NlZWQnLCAnQ2FuY2VsJ11cbiAgICAgIH0pXG4gICAgICBpZiAoY2hvaWNlID09PSAxKSB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKClcbiAgICAgICAgZXJyb3IuY29kZSA9ICdDQU5DRUxMRUQnXG4gICAgICAgIHRocm93IGVycm9yXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucHJvamVjdC5idWZmZXJGb3JQYXRoKGZpbGVQYXRoLCBvcHRpb25zKVxuICAgICAgLnRoZW4oYnVmZmVyID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dEVkaXRvclJlZ2lzdHJ5LmJ1aWxkKE9iamVjdC5hc3NpZ24oe2J1ZmZlciwgbGFyZ2VGaWxlTW9kZSwgYXV0b0hlaWdodDogZmFsc2V9LCBvcHRpb25zKSlcbiAgICAgIH0pXG4gIH1cblxuICBoYW5kbGVHcmFtbWFyVXNlZCAoZ3JhbW1hcikge1xuICAgIGlmIChncmFtbWFyID09IG51bGwpIHsgcmV0dXJuIH1cbiAgICByZXR1cm4gdGhpcy5wYWNrYWdlTWFuYWdlci50cmlnZ2VyQWN0aXZhdGlvbkhvb2soYCR7Z3JhbW1hci5wYWNrYWdlTmFtZX06Z3JhbW1hci11c2VkYClcbiAgfVxuXG4gIC8vIFB1YmxpYzogUmV0dXJucyBhIHtCb29sZWFufSB0aGF0IGlzIGB0cnVlYCBpZiBgb2JqZWN0YCBpcyBhIGBUZXh0RWRpdG9yYC5cbiAgLy9cbiAgLy8gKiBgb2JqZWN0YCBBbiB7T2JqZWN0fSB5b3Ugd2FudCB0byBwZXJmb3JtIHRoZSBjaGVjayBhZ2FpbnN0LlxuICBpc1RleHRFZGl0b3IgKG9iamVjdCkge1xuICAgIHJldHVybiBvYmplY3QgaW5zdGFuY2VvZiBUZXh0RWRpdG9yXG4gIH1cblxuICAvLyBFeHRlbmRlZDogQ3JlYXRlIGEgbmV3IHRleHQgZWRpdG9yLlxuICAvL1xuICAvLyBSZXR1cm5zIGEge1RleHRFZGl0b3J9LlxuICBidWlsZFRleHRFZGl0b3IgKHBhcmFtcykge1xuICAgIGNvbnN0IGVkaXRvciA9IHRoaXMudGV4dEVkaXRvclJlZ2lzdHJ5LmJ1aWxkKHBhcmFtcylcbiAgICBjb25zdCBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoXG4gICAgICB0aGlzLnRleHRFZGl0b3JSZWdpc3RyeS5tYWludGFpbkdyYW1tYXIoZWRpdG9yKSxcbiAgICAgIHRoaXMudGV4dEVkaXRvclJlZ2lzdHJ5Lm1haW50YWluQ29uZmlnKGVkaXRvcilcbiAgICApXG4gICAgZWRpdG9yLm9uRGlkRGVzdHJveSgoKSA9PiB7IHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpIH0pXG4gICAgcmV0dXJuIGVkaXRvclxuICB9XG5cbiAgLy8gUHVibGljOiBBc3luY2hyb25vdXNseSByZW9wZW5zIHRoZSBsYXN0LWNsb3NlZCBpdGVtJ3MgVVJJIGlmIGl0IGhhc24ndCBhbHJlYWR5IGJlZW5cbiAgLy8gcmVvcGVuZWQuXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7UHJvbWlzZX0gdGhhdCBpcyByZXNvbHZlZCB3aGVuIHRoZSBpdGVtIGlzIG9wZW5lZFxuICByZW9wZW5JdGVtICgpIHtcbiAgICBjb25zdCB1cmkgPSB0aGlzLmRlc3Ryb3llZEl0ZW1VUklzLnBvcCgpXG4gICAgaWYgKHVyaSkge1xuICAgICAgcmV0dXJuIHRoaXMub3Blbih1cmkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH1cbiAgfVxuXG4gIC8vIFB1YmxpYzogUmVnaXN0ZXIgYW4gb3BlbmVyIGZvciBhIHVyaS5cbiAgLy9cbiAgLy8gV2hlbiBhIFVSSSBpcyBvcGVuZWQgdmlhIHtXb3Jrc3BhY2U6Om9wZW59LCBBdG9tIGxvb3BzIHRocm91Z2ggaXRzIHJlZ2lzdGVyZWRcbiAgLy8gb3BlbmVyIGZ1bmN0aW9ucyB1bnRpbCBvbmUgcmV0dXJucyBhIHZhbHVlIGZvciB0aGUgZ2l2ZW4gdXJpLlxuICAvLyBPcGVuZXJzIGFyZSBleHBlY3RlZCB0byByZXR1cm4gYW4gb2JqZWN0IHRoYXQgaW5oZXJpdHMgZnJvbSBIVE1MRWxlbWVudCBvclxuICAvLyBhIG1vZGVsIHdoaWNoIGhhcyBhbiBhc3NvY2lhdGVkIHZpZXcgaW4gdGhlIHtWaWV3UmVnaXN0cnl9LlxuICAvLyBBIHtUZXh0RWRpdG9yfSB3aWxsIGJlIHVzZWQgaWYgbm8gb3BlbmVyIHJldHVybnMgYSB2YWx1ZS5cbiAgLy9cbiAgLy8gIyMgRXhhbXBsZXNcbiAgLy9cbiAgLy8gYGBgY29mZmVlXG4gIC8vIGF0b20ud29ya3NwYWNlLmFkZE9wZW5lciAodXJpKSAtPlxuICAvLyAgIGlmIHBhdGguZXh0bmFtZSh1cmkpIGlzICcudG9tbCdcbiAgLy8gICAgIHJldHVybiBuZXcgVG9tbEVkaXRvcih1cmkpXG4gIC8vIGBgYFxuICAvL1xuICAvLyAqIGBvcGVuZXJgIEEge0Z1bmN0aW9ufSB0byBiZSBjYWxsZWQgd2hlbiBhIHBhdGggaXMgYmVpbmcgb3BlbmVkLlxuICAvL1xuICAvLyBSZXR1cm5zIGEge0Rpc3Bvc2FibGV9IG9uIHdoaWNoIGAuZGlzcG9zZSgpYCBjYW4gYmUgY2FsbGVkIHRvIHJlbW92ZSB0aGVcbiAgLy8gb3BlbmVyLlxuICAvL1xuICAvLyBOb3RlIHRoYXQgdGhlIG9wZW5lciB3aWxsIGJlIGNhbGxlZCBpZiBhbmQgb25seSBpZiB0aGUgVVJJIGlzIG5vdCBhbHJlYWR5IG9wZW5cbiAgLy8gaW4gdGhlIGN1cnJlbnQgcGFuZS4gVGhlIHNlYXJjaEFsbFBhbmVzIGZsYWcgZXhwYW5kcyB0aGUgc2VhcmNoIGZyb20gdGhlXG4gIC8vIGN1cnJlbnQgcGFuZSB0byBhbGwgcGFuZXMuIElmIHlvdSB3aXNoIHRvIG9wZW4gYSB2aWV3IG9mIGEgZGlmZmVyZW50IHR5cGUgZm9yXG4gIC8vIGEgZmlsZSB0aGF0IGlzIGFscmVhZHkgb3BlbiwgY29uc2lkZXIgY2hhbmdpbmcgdGhlIHByb3RvY29sIG9mIHRoZSBVUkkuIEZvclxuICAvLyBleGFtcGxlLCBwZXJoYXBzIHlvdSB3aXNoIHRvIHByZXZpZXcgYSByZW5kZXJlZCB2ZXJzaW9uIG9mIHRoZSBmaWxlIGAvZm9vL2Jhci9iYXoucXV1eGBcbiAgLy8gdGhhdCBpcyBhbHJlYWR5IG9wZW4gaW4gYSB0ZXh0IGVkaXRvciB2aWV3LiBZb3UgY291bGQgc2lnbmFsIHRoaXMgYnkgY2FsbGluZ1xuICAvLyB7V29ya3NwYWNlOjpvcGVufSBvbiB0aGUgVVJJIGBxdXV4LXByZXZpZXc6Ly9mb28vYmFyL2Jhei5xdXV4YC4gVGhlbiB5b3VyIG9wZW5lclxuICAvLyBjYW4gY2hlY2sgdGhlIHByb3RvY29sIGZvciBxdXV4LXByZXZpZXcgYW5kIG9ubHkgaGFuZGxlIHRob3NlIFVSSXMgdGhhdCBtYXRjaC5cbiAgYWRkT3BlbmVyIChvcGVuZXIpIHtcbiAgICB0aGlzLm9wZW5lcnMucHVzaChvcGVuZXIpXG4gICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKCgpID0+IHsgXy5yZW1vdmUodGhpcy5vcGVuZXJzLCBvcGVuZXIpIH0pXG4gIH1cblxuICBnZXRPcGVuZXJzICgpIHtcbiAgICByZXR1cm4gdGhpcy5vcGVuZXJzXG4gIH1cblxuICAvKlxuICBTZWN0aW9uOiBQYW5lIEl0ZW1zXG4gICovXG5cbiAgLy8gRXNzZW50aWFsOiBHZXQgYWxsIHBhbmUgaXRlbXMgaW4gdGhlIHdvcmtzcGFjZS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhbiB7QXJyYXl9IG9mIGl0ZW1zLlxuICBnZXRQYW5lSXRlbXMgKCkge1xuICAgIHJldHVybiBfLmZsYXR0ZW4odGhpcy5nZXRQYW5lQ29udGFpbmVycygpLm1hcChjb250YWluZXIgPT4gY29udGFpbmVyLmdldFBhbmVJdGVtcygpKSlcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogR2V0IHRoZSBhY3RpdmUge1BhbmV9J3MgYWN0aXZlIGl0ZW0uXG4gIC8vXG4gIC8vIFJldHVybnMgYW4gcGFuZSBpdGVtIHtPYmplY3R9LlxuICBnZXRBY3RpdmVQYW5lSXRlbSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QWN0aXZlUGFuZUNvbnRhaW5lcigpLmdldEFjdGl2ZVBhbmVJdGVtKClcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogR2V0IGFsbCB0ZXh0IGVkaXRvcnMgaW4gdGhlIHdvcmtzcGFjZS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhbiB7QXJyYXl9IG9mIHtUZXh0RWRpdG9yfXMuXG4gIGdldFRleHRFZGl0b3JzICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYW5lSXRlbXMoKS5maWx0ZXIoaXRlbSA9PiBpdGVtIGluc3RhbmNlb2YgVGV4dEVkaXRvcilcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogR2V0IHRoZSB3b3Jrc3BhY2UgY2VudGVyJ3MgYWN0aXZlIGl0ZW0gaWYgaXQgaXMgYSB7VGV4dEVkaXRvcn0uXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7VGV4dEVkaXRvcn0gb3IgYHVuZGVmaW5lZGAgaWYgdGhlIHdvcmtzcGFjZSBjZW50ZXIncyBjdXJyZW50XG4gIC8vIGFjdGl2ZSBpdGVtIGlzIG5vdCBhIHtUZXh0RWRpdG9yfS5cbiAgZ2V0QWN0aXZlVGV4dEVkaXRvciAoKSB7XG4gICAgY29uc3QgYWN0aXZlSXRlbSA9IHRoaXMuZ2V0Q2VudGVyKCkuZ2V0QWN0aXZlUGFuZUl0ZW0oKVxuICAgIGlmIChhY3RpdmVJdGVtIGluc3RhbmNlb2YgVGV4dEVkaXRvcikgeyByZXR1cm4gYWN0aXZlSXRlbSB9XG4gIH1cblxuICAvLyBTYXZlIGFsbCBwYW5lIGl0ZW1zLlxuICBzYXZlQWxsICgpIHtcbiAgICB0aGlzLmdldFBhbmVDb250YWluZXJzKCkuZm9yRWFjaChjb250YWluZXIgPT4ge1xuICAgICAgY29udGFpbmVyLnNhdmVBbGwoKVxuICAgIH0pXG4gIH1cblxuICBjb25maXJtQ2xvc2UgKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwodGhpcy5nZXRQYW5lQ29udGFpbmVycygpLm1hcChjb250YWluZXIgPT5cbiAgICAgIGNvbnRhaW5lci5jb25maXJtQ2xvc2Uob3B0aW9ucylcbiAgICApKS50aGVuKChyZXN1bHRzKSA9PiAhcmVzdWx0cy5pbmNsdWRlcyhmYWxzZSkpXG4gIH1cblxuICAvLyBTYXZlIHRoZSBhY3RpdmUgcGFuZSBpdGVtLlxuICAvL1xuICAvLyBJZiB0aGUgYWN0aXZlIHBhbmUgaXRlbSBjdXJyZW50bHkgaGFzIGEgVVJJIGFjY29yZGluZyB0byB0aGUgaXRlbSdzXG4gIC8vIGAuZ2V0VVJJYCBtZXRob2QsIGNhbGxzIGAuc2F2ZWAgb24gdGhlIGl0ZW0uIE90aGVyd2lzZVxuICAvLyB7OjpzYXZlQWN0aXZlUGFuZUl0ZW1Bc30gIyB3aWxsIGJlIGNhbGxlZCBpbnN0ZWFkLiBUaGlzIG1ldGhvZCBkb2VzIG5vdGhpbmdcbiAgLy8gaWYgdGhlIGFjdGl2ZSBpdGVtIGRvZXMgbm90IGltcGxlbWVudCBhIGAuc2F2ZWAgbWV0aG9kLlxuICBzYXZlQWN0aXZlUGFuZUl0ZW0gKCkge1xuICAgIHJldHVybiB0aGlzLmdldENlbnRlcigpLmdldEFjdGl2ZVBhbmUoKS5zYXZlQWN0aXZlSXRlbSgpXG4gIH1cblxuICAvLyBQcm9tcHQgdGhlIHVzZXIgZm9yIGEgcGF0aCBhbmQgc2F2ZSB0aGUgYWN0aXZlIHBhbmUgaXRlbSB0byBpdC5cbiAgLy9cbiAgLy8gT3BlbnMgYSBuYXRpdmUgZGlhbG9nIHdoZXJlIHRoZSB1c2VyIHNlbGVjdHMgYSBwYXRoIG9uIGRpc2ssIHRoZW4gY2FsbHNcbiAgLy8gYC5zYXZlQXNgIG9uIHRoZSBpdGVtIHdpdGggdGhlIHNlbGVjdGVkIHBhdGguIFRoaXMgbWV0aG9kIGRvZXMgbm90aGluZyBpZlxuICAvLyB0aGUgYWN0aXZlIGl0ZW0gZG9lcyBub3QgaW1wbGVtZW50IGEgYC5zYXZlQXNgIG1ldGhvZC5cbiAgc2F2ZUFjdGl2ZVBhbmVJdGVtQXMgKCkge1xuICAgIHRoaXMuZ2V0Q2VudGVyKCkuZ2V0QWN0aXZlUGFuZSgpLnNhdmVBY3RpdmVJdGVtQXMoKVxuICB9XG5cbiAgLy8gRGVzdHJveSAoY2xvc2UpIHRoZSBhY3RpdmUgcGFuZSBpdGVtLlxuICAvL1xuICAvLyBSZW1vdmVzIHRoZSBhY3RpdmUgcGFuZSBpdGVtIGFuZCBjYWxscyB0aGUgYC5kZXN0cm95YCBtZXRob2Qgb24gaXQgaWYgb25lIGlzXG4gIC8vIGRlZmluZWQuXG4gIGRlc3Ryb3lBY3RpdmVQYW5lSXRlbSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QWN0aXZlUGFuZSgpLmRlc3Ryb3lBY3RpdmVJdGVtKClcbiAgfVxuXG4gIC8qXG4gIFNlY3Rpb246IFBhbmVzXG4gICovXG5cbiAgLy8gRXh0ZW5kZWQ6IEdldCB0aGUgbW9zdCByZWNlbnRseSBmb2N1c2VkIHBhbmUgY29udGFpbmVyLlxuICAvL1xuICAvLyBSZXR1cm5zIGEge0RvY2t9IG9yIHRoZSB7V29ya3NwYWNlQ2VudGVyfS5cbiAgZ2V0QWN0aXZlUGFuZUNvbnRhaW5lciAoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlUGFuZUNvbnRhaW5lclxuICB9XG5cbiAgLy8gRXh0ZW5kZWQ6IEdldCBhbGwgcGFuZXMgaW4gdGhlIHdvcmtzcGFjZS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhbiB7QXJyYXl9IG9mIHtQYW5lfXMuXG4gIGdldFBhbmVzICgpIHtcbiAgICByZXR1cm4gXy5mbGF0dGVuKHRoaXMuZ2V0UGFuZUNvbnRhaW5lcnMoKS5tYXAoY29udGFpbmVyID0+IGNvbnRhaW5lci5nZXRQYW5lcygpKSlcbiAgfVxuXG4gIGdldFZpc2libGVQYW5lcyAoKSB7XG4gICAgcmV0dXJuIF8uZmxhdHRlbih0aGlzLmdldFZpc2libGVQYW5lQ29udGFpbmVycygpLm1hcChjb250YWluZXIgPT4gY29udGFpbmVyLmdldFBhbmVzKCkpKVxuICB9XG5cbiAgLy8gRXh0ZW5kZWQ6IEdldCB0aGUgYWN0aXZlIHtQYW5lfS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtQYW5lfS5cbiAgZ2V0QWN0aXZlUGFuZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QWN0aXZlUGFuZUNvbnRhaW5lcigpLmdldEFjdGl2ZVBhbmUoKVxuICB9XG5cbiAgLy8gRXh0ZW5kZWQ6IE1ha2UgdGhlIG5leHQgcGFuZSBhY3RpdmUuXG4gIGFjdGl2YXRlTmV4dFBhbmUgKCkge1xuICAgIHJldHVybiB0aGlzLmdldEFjdGl2ZVBhbmVDb250YWluZXIoKS5hY3RpdmF0ZU5leHRQYW5lKClcbiAgfVxuXG4gIC8vIEV4dGVuZGVkOiBNYWtlIHRoZSBwcmV2aW91cyBwYW5lIGFjdGl2ZS5cbiAgYWN0aXZhdGVQcmV2aW91c1BhbmUgKCkge1xuICAgIHJldHVybiB0aGlzLmdldEFjdGl2ZVBhbmVDb250YWluZXIoKS5hY3RpdmF0ZVByZXZpb3VzUGFuZSgpXG4gIH1cblxuICAvLyBFeHRlbmRlZDogR2V0IHRoZSBmaXJzdCBwYW5lIGNvbnRhaW5lciB0aGF0IGNvbnRhaW5zIGFuIGl0ZW0gd2l0aCB0aGUgZ2l2ZW5cbiAgLy8gVVJJLlxuICAvL1xuICAvLyAqIGB1cmlgIHtTdHJpbmd9IHVyaVxuICAvL1xuICAvLyBSZXR1cm5zIGEge0RvY2t9LCB0aGUge1dvcmtzcGFjZUNlbnRlcn0sIG9yIGB1bmRlZmluZWRgIGlmIG5vIGl0ZW0gZXhpc3RzXG4gIC8vIHdpdGggdGhlIGdpdmVuIFVSSS5cbiAgcGFuZUNvbnRhaW5lckZvclVSSSAodXJpKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGFuZUNvbnRhaW5lcnMoKS5maW5kKGNvbnRhaW5lciA9PiBjb250YWluZXIucGFuZUZvclVSSSh1cmkpKVxuICB9XG5cbiAgLy8gRXh0ZW5kZWQ6IEdldCB0aGUgZmlyc3QgcGFuZSBjb250YWluZXIgdGhhdCBjb250YWlucyB0aGUgZ2l2ZW4gaXRlbS5cbiAgLy9cbiAgLy8gKiBgaXRlbWAgdGhlIEl0ZW0gdGhhdCB0aGUgcmV0dXJuZWQgcGFuZSBjb250YWluZXIgbXVzdCBjb250YWluLlxuICAvL1xuICAvLyBSZXR1cm5zIGEge0RvY2t9LCB0aGUge1dvcmtzcGFjZUNlbnRlcn0sIG9yIGB1bmRlZmluZWRgIGlmIG5vIGl0ZW0gZXhpc3RzXG4gIC8vIHdpdGggdGhlIGdpdmVuIFVSSS5cbiAgcGFuZUNvbnRhaW5lckZvckl0ZW0gKHVyaSkge1xuICAgIHJldHVybiB0aGlzLmdldFBhbmVDb250YWluZXJzKCkuZmluZChjb250YWluZXIgPT4gY29udGFpbmVyLnBhbmVGb3JJdGVtKHVyaSkpXG4gIH1cblxuICAvLyBFeHRlbmRlZDogR2V0IHRoZSBmaXJzdCB7UGFuZX0gdGhhdCBjb250YWlucyBhbiBpdGVtIHdpdGggdGhlIGdpdmVuIFVSSS5cbiAgLy9cbiAgLy8gKiBgdXJpYCB7U3RyaW5nfSB1cmlcbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtQYW5lfSBvciBgdW5kZWZpbmVkYCBpZiBubyBpdGVtIGV4aXN0cyB3aXRoIHRoZSBnaXZlbiBVUkkuXG4gIHBhbmVGb3JVUkkgKHVyaSkge1xuICAgIGZvciAobGV0IGxvY2F0aW9uIG9mIHRoaXMuZ2V0UGFuZUNvbnRhaW5lcnMoKSkge1xuICAgICAgY29uc3QgcGFuZSA9IGxvY2F0aW9uLnBhbmVGb3JVUkkodXJpKVxuICAgICAgaWYgKHBhbmUgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gcGFuZVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIEV4dGVuZGVkOiBHZXQgdGhlIHtQYW5lfSBjb250YWluaW5nIHRoZSBnaXZlbiBpdGVtLlxuICAvL1xuICAvLyAqIGBpdGVtYCB0aGUgSXRlbSB0aGF0IHRoZSByZXR1cm5lZCBwYW5lIG11c3QgY29udGFpbi5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtQYW5lfSBvciBgdW5kZWZpbmVkYCBpZiBubyBwYW5lIGV4aXN0cyBmb3IgdGhlIGdpdmVuIGl0ZW0uXG4gIHBhbmVGb3JJdGVtIChpdGVtKSB7XG4gICAgZm9yIChsZXQgbG9jYXRpb24gb2YgdGhpcy5nZXRQYW5lQ29udGFpbmVycygpKSB7XG4gICAgICBjb25zdCBwYW5lID0gbG9jYXRpb24ucGFuZUZvckl0ZW0oaXRlbSlcbiAgICAgIGlmIChwYW5lICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHBhbmVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBEZXN0cm95IChjbG9zZSkgdGhlIGFjdGl2ZSBwYW5lLlxuICBkZXN0cm95QWN0aXZlUGFuZSAoKSB7XG4gICAgY29uc3QgYWN0aXZlUGFuZSA9IHRoaXMuZ2V0QWN0aXZlUGFuZSgpXG4gICAgaWYgKGFjdGl2ZVBhbmUgIT0gbnVsbCkge1xuICAgICAgYWN0aXZlUGFuZS5kZXN0cm95KClcbiAgICB9XG4gIH1cblxuICAvLyBDbG9zZSB0aGUgYWN0aXZlIGNlbnRlciBwYW5lIGl0ZW0sIG9yIHRoZSBhY3RpdmUgY2VudGVyIHBhbmUgaWYgaXQgaXNcbiAgLy8gZW1wdHksIG9yIHRoZSBjdXJyZW50IHdpbmRvdyBpZiB0aGVyZSBpcyBvbmx5IHRoZSBlbXB0eSByb290IHBhbmUuXG4gIGNsb3NlQWN0aXZlUGFuZUl0ZW1PckVtcHR5UGFuZU9yV2luZG93ICgpIHtcbiAgICBpZiAodGhpcy5nZXRDZW50ZXIoKS5nZXRBY3RpdmVQYW5lSXRlbSgpICE9IG51bGwpIHtcbiAgICAgIHRoaXMuZ2V0Q2VudGVyKCkuZ2V0QWN0aXZlUGFuZSgpLmRlc3Ryb3lBY3RpdmVJdGVtKClcbiAgICB9IGVsc2UgaWYgKHRoaXMuZ2V0Q2VudGVyKCkuZ2V0UGFuZXMoKS5sZW5ndGggPiAxKSB7XG4gICAgICB0aGlzLmdldENlbnRlcigpLmRlc3Ryb3lBY3RpdmVQYW5lKClcbiAgICB9IGVsc2UgaWYgKHRoaXMuY29uZmlnLmdldCgnY29yZS5jbG9zZUVtcHR5V2luZG93cycpKSB7XG4gICAgICBhdG9tLmNsb3NlKClcbiAgICB9XG4gIH1cblxuICAvLyBJbmNyZWFzZSB0aGUgZWRpdG9yIGZvbnQgc2l6ZSBieSAxcHguXG4gIGluY3JlYXNlRm9udFNpemUgKCkge1xuICAgIHRoaXMuY29uZmlnLnNldCgnZWRpdG9yLmZvbnRTaXplJywgdGhpcy5jb25maWcuZ2V0KCdlZGl0b3IuZm9udFNpemUnKSArIDEpXG4gIH1cblxuICAvLyBEZWNyZWFzZSB0aGUgZWRpdG9yIGZvbnQgc2l6ZSBieSAxcHguXG4gIGRlY3JlYXNlRm9udFNpemUgKCkge1xuICAgIGNvbnN0IGZvbnRTaXplID0gdGhpcy5jb25maWcuZ2V0KCdlZGl0b3IuZm9udFNpemUnKVxuICAgIGlmIChmb250U2l6ZSA+IDEpIHtcbiAgICAgIHRoaXMuY29uZmlnLnNldCgnZWRpdG9yLmZvbnRTaXplJywgZm9udFNpemUgLSAxKVxuICAgIH1cbiAgfVxuXG4gIC8vIFJlc3RvcmUgdG8gdGhlIHdpbmRvdydzIG9yaWdpbmFsIGVkaXRvciBmb250IHNpemUuXG4gIHJlc2V0Rm9udFNpemUgKCkge1xuICAgIGlmICh0aGlzLm9yaWdpbmFsRm9udFNpemUpIHtcbiAgICAgIHRoaXMuY29uZmlnLnNldCgnZWRpdG9yLmZvbnRTaXplJywgdGhpcy5vcmlnaW5hbEZvbnRTaXplKVxuICAgIH1cbiAgfVxuXG4gIHN1YnNjcmliZVRvRm9udFNpemUgKCkge1xuICAgIHJldHVybiB0aGlzLmNvbmZpZy5vbkRpZENoYW5nZSgnZWRpdG9yLmZvbnRTaXplJywgKHtvbGRWYWx1ZX0pID0+IHtcbiAgICAgIGlmICh0aGlzLm9yaWdpbmFsRm9udFNpemUgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLm9yaWdpbmFsRm9udFNpemUgPSBvbGRWYWx1ZVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvLyBSZW1vdmVzIHRoZSBpdGVtJ3MgdXJpIGZyb20gdGhlIGxpc3Qgb2YgcG90ZW50aWFsIGl0ZW1zIHRvIHJlb3Blbi5cbiAgaXRlbU9wZW5lZCAoaXRlbSkge1xuICAgIGxldCB1cmlcbiAgICBpZiAodHlwZW9mIGl0ZW0uZ2V0VVJJID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB1cmkgPSBpdGVtLmdldFVSSSgpXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgaXRlbS5nZXRVcmkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHVyaSA9IGl0ZW0uZ2V0VXJpKClcbiAgICB9XG5cbiAgICBpZiAodXJpICE9IG51bGwpIHtcbiAgICAgIF8ucmVtb3ZlKHRoaXMuZGVzdHJveWVkSXRlbVVSSXMsIHVyaSlcbiAgICB9XG4gIH1cblxuICAvLyBBZGRzIHRoZSBkZXN0cm95ZWQgaXRlbSdzIHVyaSB0byB0aGUgbGlzdCBvZiBpdGVtcyB0byByZW9wZW4uXG4gIGRpZERlc3Ryb3lQYW5lSXRlbSAoe2l0ZW19KSB7XG4gICAgbGV0IHVyaVxuICAgIGlmICh0eXBlb2YgaXRlbS5nZXRVUkkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHVyaSA9IGl0ZW0uZ2V0VVJJKClcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBpdGVtLmdldFVyaSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdXJpID0gaXRlbS5nZXRVcmkoKVxuICAgIH1cblxuICAgIGlmICh1cmkgIT0gbnVsbCkge1xuICAgICAgdGhpcy5kZXN0cm95ZWRJdGVtVVJJcy5wdXNoKHVyaSlcbiAgICB9XG4gIH1cblxuICAvLyBDYWxsZWQgYnkgTW9kZWwgc3VwZXJjbGFzcyB3aGVuIGRlc3Ryb3llZFxuICBkZXN0cm95ZWQgKCkge1xuICAgIHRoaXMucGFuZUNvbnRhaW5lcnMuY2VudGVyLmRlc3Ryb3koKVxuICAgIHRoaXMucGFuZUNvbnRhaW5lcnMubGVmdC5kZXN0cm95KClcbiAgICB0aGlzLnBhbmVDb250YWluZXJzLnJpZ2h0LmRlc3Ryb3koKVxuICAgIHRoaXMucGFuZUNvbnRhaW5lcnMuYm90dG9tLmRlc3Ryb3koKVxuICAgIHRoaXMuY2FuY2VsU3RvcHBlZENoYW5naW5nQWN0aXZlUGFuZUl0ZW1UaW1lb3V0KClcbiAgICBpZiAodGhpcy5hY3RpdmVJdGVtU3Vic2NyaXB0aW9ucyAhPSBudWxsKSB7XG4gICAgICB0aGlzLmFjdGl2ZUl0ZW1TdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIH1cbiAgfVxuXG4gIC8qXG4gIFNlY3Rpb246IFBhbmUgTG9jYXRpb25zXG4gICovXG5cbiAgLy8gRXNzZW50aWFsOiBHZXQgdGhlIHtXb3Jrc3BhY2VDZW50ZXJ9IGF0IHRoZSBjZW50ZXIgb2YgdGhlIGVkaXRvciB3aW5kb3cuXG4gIGdldENlbnRlciAoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFuZUNvbnRhaW5lcnMuY2VudGVyXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEdldCB0aGUge0RvY2t9IHRvIHRoZSBsZWZ0IG9mIHRoZSBlZGl0b3Igd2luZG93LlxuICBnZXRMZWZ0RG9jayAoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFuZUNvbnRhaW5lcnMubGVmdFxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBHZXQgdGhlIHtEb2NrfSB0byB0aGUgcmlnaHQgb2YgdGhlIGVkaXRvciB3aW5kb3cuXG4gIGdldFJpZ2h0RG9jayAoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFuZUNvbnRhaW5lcnMucmlnaHRcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogR2V0IHRoZSB7RG9ja30gYmVsb3cgdGhlIGVkaXRvciB3aW5kb3cuXG4gIGdldEJvdHRvbURvY2sgKCkge1xuICAgIHJldHVybiB0aGlzLnBhbmVDb250YWluZXJzLmJvdHRvbVxuICB9XG5cbiAgZ2V0UGFuZUNvbnRhaW5lcnMgKCkge1xuICAgIHJldHVybiBbXG4gICAgICB0aGlzLnBhbmVDb250YWluZXJzLmNlbnRlcixcbiAgICAgIHRoaXMucGFuZUNvbnRhaW5lcnMubGVmdCxcbiAgICAgIHRoaXMucGFuZUNvbnRhaW5lcnMucmlnaHQsXG4gICAgICB0aGlzLnBhbmVDb250YWluZXJzLmJvdHRvbVxuICAgIF1cbiAgfVxuXG4gIGdldFZpc2libGVQYW5lQ29udGFpbmVycyAoKSB7XG4gICAgY29uc3QgY2VudGVyID0gdGhpcy5nZXRDZW50ZXIoKVxuICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5nZXRQYW5lQ29udGFpbmVycygpXG4gICAgICAuZmlsdGVyKGNvbnRhaW5lciA9PiBjb250YWluZXIgPT09IGNlbnRlciB8fCBjb250YWluZXIuaXNWaXNpYmxlKCkpXG4gIH1cblxuICAvKlxuICBTZWN0aW9uOiBQYW5lbHNcblxuICBQYW5lbHMgYXJlIHVzZWQgdG8gZGlzcGxheSBVSSByZWxhdGVkIHRvIGFuIGVkaXRvciB3aW5kb3cuIFRoZXkgYXJlIHBsYWNlZCBhdCBvbmUgb2YgdGhlIGZvdXJcbiAgZWRnZXMgb2YgdGhlIHdpbmRvdzogbGVmdCwgcmlnaHQsIHRvcCBvciBib3R0b20uIElmIHRoZXJlIGFyZSBtdWx0aXBsZSBwYW5lbHMgb24gdGhlIHNhbWUgd2luZG93XG4gIGVkZ2UgdGhleSBhcmUgc3RhY2tlZCBpbiBvcmRlciBvZiBwcmlvcml0eTogaGlnaGVyIHByaW9yaXR5IGlzIGNsb3NlciB0byB0aGUgY2VudGVyLCBsb3dlclxuICBwcmlvcml0eSB0b3dhcmRzIHRoZSBlZGdlLlxuXG4gICpOb3RlOiogSWYgeW91ciBwYW5lbCBjaGFuZ2VzIGl0cyBzaXplIHRocm91Z2hvdXQgaXRzIGxpZmV0aW1lLCBjb25zaWRlciBnaXZpbmcgaXQgYSBoaWdoZXJcbiAgcHJpb3JpdHksIGFsbG93aW5nIGZpeGVkIHNpemUgcGFuZWxzIHRvIGJlIGNsb3NlciB0byB0aGUgZWRnZS4gVGhpcyBhbGxvd3MgY29udHJvbCB0YXJnZXRzIHRvXG4gIHJlbWFpbiBtb3JlIHN0YXRpYyBmb3IgZWFzaWVyIHRhcmdldGluZyBieSB1c2VycyB0aGF0IGVtcGxveSBtaWNlIG9yIHRyYWNrcGFkcy4gKFNlZVxuICBbYXRvbS9hdG9tIzQ4MzRdKGh0dHBzOi8vZ2l0aHViLmNvbS9hdG9tL2F0b20vaXNzdWVzLzQ4MzQpIGZvciBkaXNjdXNzaW9uLilcbiAgKi9cblxuICAvLyBFc3NlbnRpYWw6IEdldCBhbiB7QXJyYXl9IG9mIGFsbCB0aGUgcGFuZWwgaXRlbXMgYXQgdGhlIGJvdHRvbSBvZiB0aGUgZWRpdG9yIHdpbmRvdy5cbiAgZ2V0Qm90dG9tUGFuZWxzICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYW5lbHMoJ2JvdHRvbScpXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEFkZHMgYSBwYW5lbCBpdGVtIHRvIHRoZSBib3R0b20gb2YgdGhlIGVkaXRvciB3aW5kb3cuXG4gIC8vXG4gIC8vICogYG9wdGlvbnNgIHtPYmplY3R9XG4gIC8vICAgKiBgaXRlbWAgWW91ciBwYW5lbCBjb250ZW50LiBJdCBjYW4gYmUgRE9NIGVsZW1lbnQsIGEgalF1ZXJ5IGVsZW1lbnQsIG9yXG4gIC8vICAgICBhIG1vZGVsIHdpdGggYSB2aWV3IHJlZ2lzdGVyZWQgdmlhIHtWaWV3UmVnaXN0cnk6OmFkZFZpZXdQcm92aWRlcn0uIFdlIHJlY29tbWVuZCB0aGVcbiAgLy8gICAgIGxhdHRlci4gU2VlIHtWaWV3UmVnaXN0cnk6OmFkZFZpZXdQcm92aWRlcn0gZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gIC8vICAgKiBgdmlzaWJsZWAgKG9wdGlvbmFsKSB7Qm9vbGVhbn0gZmFsc2UgaWYgeW91IHdhbnQgdGhlIHBhbmVsIHRvIGluaXRpYWxseSBiZSBoaWRkZW5cbiAgLy8gICAgIChkZWZhdWx0OiB0cnVlKVxuICAvLyAgICogYHByaW9yaXR5YCAob3B0aW9uYWwpIHtOdW1iZXJ9IERldGVybWluZXMgc3RhY2tpbmcgb3JkZXIuIExvd2VyIHByaW9yaXR5IGl0ZW1zIGFyZVxuICAvLyAgICAgZm9yY2VkIGNsb3NlciB0byB0aGUgZWRnZXMgb2YgdGhlIHdpbmRvdy4gKGRlZmF1bHQ6IDEwMClcbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtQYW5lbH1cbiAgYWRkQm90dG9tUGFuZWwgKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5hZGRQYW5lbCgnYm90dG9tJywgb3B0aW9ucylcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogR2V0IGFuIHtBcnJheX0gb2YgYWxsIHRoZSBwYW5lbCBpdGVtcyB0byB0aGUgbGVmdCBvZiB0aGUgZWRpdG9yIHdpbmRvdy5cbiAgZ2V0TGVmdFBhbmVscyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGFuZWxzKCdsZWZ0JylcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogQWRkcyBhIHBhbmVsIGl0ZW0gdG8gdGhlIGxlZnQgb2YgdGhlIGVkaXRvciB3aW5kb3cuXG4gIC8vXG4gIC8vICogYG9wdGlvbnNgIHtPYmplY3R9XG4gIC8vICAgKiBgaXRlbWAgWW91ciBwYW5lbCBjb250ZW50LiBJdCBjYW4gYmUgRE9NIGVsZW1lbnQsIGEgalF1ZXJ5IGVsZW1lbnQsIG9yXG4gIC8vICAgICBhIG1vZGVsIHdpdGggYSB2aWV3IHJlZ2lzdGVyZWQgdmlhIHtWaWV3UmVnaXN0cnk6OmFkZFZpZXdQcm92aWRlcn0uIFdlIHJlY29tbWVuZCB0aGVcbiAgLy8gICAgIGxhdHRlci4gU2VlIHtWaWV3UmVnaXN0cnk6OmFkZFZpZXdQcm92aWRlcn0gZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gIC8vICAgKiBgdmlzaWJsZWAgKG9wdGlvbmFsKSB7Qm9vbGVhbn0gZmFsc2UgaWYgeW91IHdhbnQgdGhlIHBhbmVsIHRvIGluaXRpYWxseSBiZSBoaWRkZW5cbiAgLy8gICAgIChkZWZhdWx0OiB0cnVlKVxuICAvLyAgICogYHByaW9yaXR5YCAob3B0aW9uYWwpIHtOdW1iZXJ9IERldGVybWluZXMgc3RhY2tpbmcgb3JkZXIuIExvd2VyIHByaW9yaXR5IGl0ZW1zIGFyZVxuICAvLyAgICAgZm9yY2VkIGNsb3NlciB0byB0aGUgZWRnZXMgb2YgdGhlIHdpbmRvdy4gKGRlZmF1bHQ6IDEwMClcbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtQYW5lbH1cbiAgYWRkTGVmdFBhbmVsIChvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRkUGFuZWwoJ2xlZnQnLCBvcHRpb25zKVxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBHZXQgYW4ge0FycmF5fSBvZiBhbGwgdGhlIHBhbmVsIGl0ZW1zIHRvIHRoZSByaWdodCBvZiB0aGUgZWRpdG9yIHdpbmRvdy5cbiAgZ2V0UmlnaHRQYW5lbHMgKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBhbmVscygncmlnaHQnKVxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBBZGRzIGEgcGFuZWwgaXRlbSB0byB0aGUgcmlnaHQgb2YgdGhlIGVkaXRvciB3aW5kb3cuXG4gIC8vXG4gIC8vICogYG9wdGlvbnNgIHtPYmplY3R9XG4gIC8vICAgKiBgaXRlbWAgWW91ciBwYW5lbCBjb250ZW50LiBJdCBjYW4gYmUgRE9NIGVsZW1lbnQsIGEgalF1ZXJ5IGVsZW1lbnQsIG9yXG4gIC8vICAgICBhIG1vZGVsIHdpdGggYSB2aWV3IHJlZ2lzdGVyZWQgdmlhIHtWaWV3UmVnaXN0cnk6OmFkZFZpZXdQcm92aWRlcn0uIFdlIHJlY29tbWVuZCB0aGVcbiAgLy8gICAgIGxhdHRlci4gU2VlIHtWaWV3UmVnaXN0cnk6OmFkZFZpZXdQcm92aWRlcn0gZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gIC8vICAgKiBgdmlzaWJsZWAgKG9wdGlvbmFsKSB7Qm9vbGVhbn0gZmFsc2UgaWYgeW91IHdhbnQgdGhlIHBhbmVsIHRvIGluaXRpYWxseSBiZSBoaWRkZW5cbiAgLy8gICAgIChkZWZhdWx0OiB0cnVlKVxuICAvLyAgICogYHByaW9yaXR5YCAob3B0aW9uYWwpIHtOdW1iZXJ9IERldGVybWluZXMgc3RhY2tpbmcgb3JkZXIuIExvd2VyIHByaW9yaXR5IGl0ZW1zIGFyZVxuICAvLyAgICAgZm9yY2VkIGNsb3NlciB0byB0aGUgZWRnZXMgb2YgdGhlIHdpbmRvdy4gKGRlZmF1bHQ6IDEwMClcbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtQYW5lbH1cbiAgYWRkUmlnaHRQYW5lbCAob3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmFkZFBhbmVsKCdyaWdodCcsIG9wdGlvbnMpXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEdldCBhbiB7QXJyYXl9IG9mIGFsbCB0aGUgcGFuZWwgaXRlbXMgYXQgdGhlIHRvcCBvZiB0aGUgZWRpdG9yIHdpbmRvdy5cbiAgZ2V0VG9wUGFuZWxzICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYW5lbHMoJ3RvcCcpXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEFkZHMgYSBwYW5lbCBpdGVtIHRvIHRoZSB0b3Agb2YgdGhlIGVkaXRvciB3aW5kb3cgYWJvdmUgdGhlIHRhYnMuXG4gIC8vXG4gIC8vICogYG9wdGlvbnNgIHtPYmplY3R9XG4gIC8vICAgKiBgaXRlbWAgWW91ciBwYW5lbCBjb250ZW50LiBJdCBjYW4gYmUgRE9NIGVsZW1lbnQsIGEgalF1ZXJ5IGVsZW1lbnQsIG9yXG4gIC8vICAgICBhIG1vZGVsIHdpdGggYSB2aWV3IHJlZ2lzdGVyZWQgdmlhIHtWaWV3UmVnaXN0cnk6OmFkZFZpZXdQcm92aWRlcn0uIFdlIHJlY29tbWVuZCB0aGVcbiAgLy8gICAgIGxhdHRlci4gU2VlIHtWaWV3UmVnaXN0cnk6OmFkZFZpZXdQcm92aWRlcn0gZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gIC8vICAgKiBgdmlzaWJsZWAgKG9wdGlvbmFsKSB7Qm9vbGVhbn0gZmFsc2UgaWYgeW91IHdhbnQgdGhlIHBhbmVsIHRvIGluaXRpYWxseSBiZSBoaWRkZW5cbiAgLy8gICAgIChkZWZhdWx0OiB0cnVlKVxuICAvLyAgICogYHByaW9yaXR5YCAob3B0aW9uYWwpIHtOdW1iZXJ9IERldGVybWluZXMgc3RhY2tpbmcgb3JkZXIuIExvd2VyIHByaW9yaXR5IGl0ZW1zIGFyZVxuICAvLyAgICAgZm9yY2VkIGNsb3NlciB0byB0aGUgZWRnZXMgb2YgdGhlIHdpbmRvdy4gKGRlZmF1bHQ6IDEwMClcbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtQYW5lbH1cbiAgYWRkVG9wUGFuZWwgKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5hZGRQYW5lbCgndG9wJywgb3B0aW9ucylcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogR2V0IGFuIHtBcnJheX0gb2YgYWxsIHRoZSBwYW5lbCBpdGVtcyBpbiB0aGUgaGVhZGVyLlxuICBnZXRIZWFkZXJQYW5lbHMgKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBhbmVscygnaGVhZGVyJylcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogQWRkcyBhIHBhbmVsIGl0ZW0gdG8gdGhlIGhlYWRlci5cbiAgLy9cbiAgLy8gKiBgb3B0aW9uc2Age09iamVjdH1cbiAgLy8gICAqIGBpdGVtYCBZb3VyIHBhbmVsIGNvbnRlbnQuIEl0IGNhbiBiZSBET00gZWxlbWVudCwgYSBqUXVlcnkgZWxlbWVudCwgb3JcbiAgLy8gICAgIGEgbW9kZWwgd2l0aCBhIHZpZXcgcmVnaXN0ZXJlZCB2aWEge1ZpZXdSZWdpc3RyeTo6YWRkVmlld1Byb3ZpZGVyfS4gV2UgcmVjb21tZW5kIHRoZVxuICAvLyAgICAgbGF0dGVyLiBTZWUge1ZpZXdSZWdpc3RyeTo6YWRkVmlld1Byb3ZpZGVyfSBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAgLy8gICAqIGB2aXNpYmxlYCAob3B0aW9uYWwpIHtCb29sZWFufSBmYWxzZSBpZiB5b3Ugd2FudCB0aGUgcGFuZWwgdG8gaW5pdGlhbGx5IGJlIGhpZGRlblxuICAvLyAgICAgKGRlZmF1bHQ6IHRydWUpXG4gIC8vICAgKiBgcHJpb3JpdHlgIChvcHRpb25hbCkge051bWJlcn0gRGV0ZXJtaW5lcyBzdGFja2luZyBvcmRlci4gTG93ZXIgcHJpb3JpdHkgaXRlbXMgYXJlXG4gIC8vICAgICBmb3JjZWQgY2xvc2VyIHRvIHRoZSBlZGdlcyBvZiB0aGUgd2luZG93LiAoZGVmYXVsdDogMTAwKVxuICAvL1xuICAvLyBSZXR1cm5zIGEge1BhbmVsfVxuICBhZGRIZWFkZXJQYW5lbCAob3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmFkZFBhbmVsKCdoZWFkZXInLCBvcHRpb25zKVxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBHZXQgYW4ge0FycmF5fSBvZiBhbGwgdGhlIHBhbmVsIGl0ZW1zIGluIHRoZSBmb290ZXIuXG4gIGdldEZvb3RlclBhbmVscyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGFuZWxzKCdmb290ZXInKVxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBBZGRzIGEgcGFuZWwgaXRlbSB0byB0aGUgZm9vdGVyLlxuICAvL1xuICAvLyAqIGBvcHRpb25zYCB7T2JqZWN0fVxuICAvLyAgICogYGl0ZW1gIFlvdXIgcGFuZWwgY29udGVudC4gSXQgY2FuIGJlIERPTSBlbGVtZW50LCBhIGpRdWVyeSBlbGVtZW50LCBvclxuICAvLyAgICAgYSBtb2RlbCB3aXRoIGEgdmlldyByZWdpc3RlcmVkIHZpYSB7Vmlld1JlZ2lzdHJ5OjphZGRWaWV3UHJvdmlkZXJ9LiBXZSByZWNvbW1lbmQgdGhlXG4gIC8vICAgICBsYXR0ZXIuIFNlZSB7Vmlld1JlZ2lzdHJ5OjphZGRWaWV3UHJvdmlkZXJ9IGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICAvLyAgICogYHZpc2libGVgIChvcHRpb25hbCkge0Jvb2xlYW59IGZhbHNlIGlmIHlvdSB3YW50IHRoZSBwYW5lbCB0byBpbml0aWFsbHkgYmUgaGlkZGVuXG4gIC8vICAgICAoZGVmYXVsdDogdHJ1ZSlcbiAgLy8gICAqIGBwcmlvcml0eWAgKG9wdGlvbmFsKSB7TnVtYmVyfSBEZXRlcm1pbmVzIHN0YWNraW5nIG9yZGVyLiBMb3dlciBwcmlvcml0eSBpdGVtcyBhcmVcbiAgLy8gICAgIGZvcmNlZCBjbG9zZXIgdG8gdGhlIGVkZ2VzIG9mIHRoZSB3aW5kb3cuIChkZWZhdWx0OiAxMDApXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7UGFuZWx9XG4gIGFkZEZvb3RlclBhbmVsIChvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRkUGFuZWwoJ2Zvb3RlcicsIG9wdGlvbnMpXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEdldCBhbiB7QXJyYXl9IG9mIGFsbCB0aGUgbW9kYWwgcGFuZWwgaXRlbXNcbiAgZ2V0TW9kYWxQYW5lbHMgKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBhbmVscygnbW9kYWwnKVxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBBZGRzIGEgcGFuZWwgaXRlbSBhcyBhIG1vZGFsIGRpYWxvZy5cbiAgLy9cbiAgLy8gKiBgb3B0aW9uc2Age09iamVjdH1cbiAgLy8gICAqIGBpdGVtYCBZb3VyIHBhbmVsIGNvbnRlbnQuIEl0IGNhbiBiZSBhIERPTSBlbGVtZW50LCBhIGpRdWVyeSBlbGVtZW50LCBvclxuICAvLyAgICAgYSBtb2RlbCB3aXRoIGEgdmlldyByZWdpc3RlcmVkIHZpYSB7Vmlld1JlZ2lzdHJ5OjphZGRWaWV3UHJvdmlkZXJ9LiBXZSByZWNvbW1lbmQgdGhlXG4gIC8vICAgICBtb2RlbCBvcHRpb24uIFNlZSB7Vmlld1JlZ2lzdHJ5OjphZGRWaWV3UHJvdmlkZXJ9IGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICAvLyAgICogYHZpc2libGVgIChvcHRpb25hbCkge0Jvb2xlYW59IGZhbHNlIGlmIHlvdSB3YW50IHRoZSBwYW5lbCB0byBpbml0aWFsbHkgYmUgaGlkZGVuXG4gIC8vICAgICAoZGVmYXVsdDogdHJ1ZSlcbiAgLy8gICAqIGBwcmlvcml0eWAgKG9wdGlvbmFsKSB7TnVtYmVyfSBEZXRlcm1pbmVzIHN0YWNraW5nIG9yZGVyLiBMb3dlciBwcmlvcml0eSBpdGVtcyBhcmVcbiAgLy8gICAgIGZvcmNlZCBjbG9zZXIgdG8gdGhlIGVkZ2VzIG9mIHRoZSB3aW5kb3cuIChkZWZhdWx0OiAxMDApXG4gIC8vICAgKiBgYXV0b0ZvY3VzYCAob3B0aW9uYWwpIHtCb29sZWFufSB0cnVlIGlmIHlvdSB3YW50IG1vZGFsIGZvY3VzIG1hbmFnZWQgZm9yIHlvdSBieSBBdG9tLlxuICAvLyAgICAgQXRvbSB3aWxsIGF1dG9tYXRpY2FsbHkgZm9jdXMgeW91ciBtb2RhbCBwYW5lbCdzIGZpcnN0IHRhYmJhYmxlIGVsZW1lbnQgd2hlbiB0aGUgbW9kYWxcbiAgLy8gICAgIG9wZW5zIGFuZCB3aWxsIHJlc3RvcmUgdGhlIHByZXZpb3VzbHkgc2VsZWN0ZWQgZWxlbWVudCB3aGVuIHRoZSBtb2RhbCBjbG9zZXMuIEF0b20gd2lsbFxuICAvLyAgICAgYWxzbyBhdXRvbWF0aWNhbGx5IHJlc3RyaWN0IHVzZXIgdGFiIGZvY3VzIHdpdGhpbiB5b3VyIG1vZGFsIHdoaWxlIGl0IGlzIG9wZW4uXG4gIC8vICAgICAoZGVmYXVsdDogZmFsc2UpXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7UGFuZWx9XG4gIGFkZE1vZGFsUGFuZWwgKG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmFkZFBhbmVsKCdtb2RhbCcsIG9wdGlvbnMpXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IFJldHVybnMgdGhlIHtQYW5lbH0gYXNzb2NpYXRlZCB3aXRoIHRoZSBnaXZlbiBpdGVtLiBSZXR1cm5zXG4gIC8vIGBudWxsYCB3aGVuIHRoZSBpdGVtIGhhcyBubyBwYW5lbC5cbiAgLy9cbiAgLy8gKiBgaXRlbWAgSXRlbSB0aGUgcGFuZWwgY29udGFpbnNcbiAgcGFuZWxGb3JJdGVtIChpdGVtKSB7XG4gICAgZm9yIChsZXQgbG9jYXRpb24gaW4gdGhpcy5wYW5lbENvbnRhaW5lcnMpIHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMucGFuZWxDb250YWluZXJzW2xvY2F0aW9uXVxuICAgICAgY29uc3QgcGFuZWwgPSBjb250YWluZXIucGFuZWxGb3JJdGVtKGl0ZW0pXG4gICAgICBpZiAocGFuZWwgIT0gbnVsbCkgeyByZXR1cm4gcGFuZWwgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgZ2V0UGFuZWxzIChsb2NhdGlvbikge1xuICAgIHJldHVybiB0aGlzLnBhbmVsQ29udGFpbmVyc1tsb2NhdGlvbl0uZ2V0UGFuZWxzKClcbiAgfVxuXG4gIGFkZFBhbmVsIChsb2NhdGlvbiwgb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zID09IG51bGwpIHsgb3B0aW9ucyA9IHt9IH1cbiAgICByZXR1cm4gdGhpcy5wYW5lbENvbnRhaW5lcnNbbG9jYXRpb25dLmFkZFBhbmVsKG5ldyBQYW5lbChvcHRpb25zLCB0aGlzLnZpZXdSZWdpc3RyeSkpXG4gIH1cblxuICAvKlxuICBTZWN0aW9uOiBTZWFyY2hpbmcgYW5kIFJlcGxhY2luZ1xuICAqL1xuXG4gIC8vIFB1YmxpYzogUGVyZm9ybXMgYSBzZWFyY2ggYWNyb3NzIGFsbCBmaWxlcyBpbiB0aGUgd29ya3NwYWNlLlxuICAvL1xuICAvLyAqIGByZWdleGAge1JlZ0V4cH0gdG8gc2VhcmNoIHdpdGguXG4gIC8vICogYG9wdGlvbnNgIChvcHRpb25hbCkge09iamVjdH1cbiAgLy8gICAqIGBwYXRoc2AgQW4ge0FycmF5fSBvZiBnbG9iIHBhdHRlcm5zIHRvIHNlYXJjaCB3aXRoaW4uXG4gIC8vICAgKiBgb25QYXRoc1NlYXJjaGVkYCAob3B0aW9uYWwpIHtGdW5jdGlvbn0gdG8gYmUgcGVyaW9kaWNhbGx5IGNhbGxlZFxuICAvLyAgICAgd2l0aCBudW1iZXIgb2YgcGF0aHMgc2VhcmNoZWQuXG4gIC8vICAgKiBgbGVhZGluZ0NvbnRleHRMaW5lQ291bnRgIHtOdW1iZXJ9IGRlZmF1bHQgYDBgOyBUaGUgbnVtYmVyIG9mIGxpbmVzXG4gIC8vICAgICAgYmVmb3JlIHRoZSBtYXRjaGVkIGxpbmUgdG8gaW5jbHVkZSBpbiB0aGUgcmVzdWx0cyBvYmplY3QuXG4gIC8vICAgKiBgdHJhaWxpbmdDb250ZXh0TGluZUNvdW50YCB7TnVtYmVyfSBkZWZhdWx0IGAwYDsgVGhlIG51bWJlciBvZiBsaW5lc1xuICAvLyAgICAgIGFmdGVyIHRoZSBtYXRjaGVkIGxpbmUgdG8gaW5jbHVkZSBpbiB0aGUgcmVzdWx0cyBvYmplY3QuXG4gIC8vICogYGl0ZXJhdG9yYCB7RnVuY3Rpb259IGNhbGxiYWNrIG9uIGVhY2ggZmlsZSBmb3VuZC5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtQcm9taXNlfSB3aXRoIGEgYGNhbmNlbCgpYCBtZXRob2QgdGhhdCB3aWxsIGNhbmNlbCBhbGxcbiAgLy8gb2YgdGhlIHVuZGVybHlpbmcgc2VhcmNoZXMgdGhhdCB3ZXJlIHN0YXJ0ZWQgYXMgcGFydCBvZiB0aGlzIHNjYW4uXG4gIHNjYW4gKHJlZ2V4LCBvcHRpb25zID0ge30sIGl0ZXJhdG9yKSB7XG4gICAgaWYgKF8uaXNGdW5jdGlvbihvcHRpb25zKSkge1xuICAgICAgaXRlcmF0b3IgPSBvcHRpb25zXG4gICAgICBvcHRpb25zID0ge31cbiAgICB9XG5cbiAgICAvLyBGaW5kIGEgc2VhcmNoZXIgZm9yIGV2ZXJ5IERpcmVjdG9yeSBpbiB0aGUgcHJvamVjdC4gRWFjaCBzZWFyY2hlciB0aGF0IGlzIG1hdGNoZWRcbiAgICAvLyB3aWxsIGJlIGFzc29jaWF0ZWQgd2l0aCBhbiBBcnJheSBvZiBEaXJlY3Rvcnkgb2JqZWN0cyBpbiB0aGUgTWFwLlxuICAgIGNvbnN0IGRpcmVjdG9yaWVzRm9yU2VhcmNoZXIgPSBuZXcgTWFwKClcbiAgICBmb3IgKGNvbnN0IGRpcmVjdG9yeSBvZiB0aGlzLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKSkge1xuICAgICAgbGV0IHNlYXJjaGVyID0gdGhpcy5kZWZhdWx0RGlyZWN0b3J5U2VhcmNoZXJcbiAgICAgIGZvciAoY29uc3QgZGlyZWN0b3J5U2VhcmNoZXIgb2YgdGhpcy5kaXJlY3RvcnlTZWFyY2hlcnMpIHtcbiAgICAgICAgaWYgKGRpcmVjdG9yeVNlYXJjaGVyLmNhblNlYXJjaERpcmVjdG9yeShkaXJlY3RvcnkpKSB7XG4gICAgICAgICAgc2VhcmNoZXIgPSBkaXJlY3RvcnlTZWFyY2hlclxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCBkaXJlY3RvcmllcyA9IGRpcmVjdG9yaWVzRm9yU2VhcmNoZXIuZ2V0KHNlYXJjaGVyKVxuICAgICAgaWYgKCFkaXJlY3Rvcmllcykge1xuICAgICAgICBkaXJlY3RvcmllcyA9IFtdXG4gICAgICAgIGRpcmVjdG9yaWVzRm9yU2VhcmNoZXIuc2V0KHNlYXJjaGVyLCBkaXJlY3RvcmllcylcbiAgICAgIH1cbiAgICAgIGRpcmVjdG9yaWVzLnB1c2goZGlyZWN0b3J5KVxuICAgIH1cblxuICAgIC8vIERlZmluZSB0aGUgb25QYXRoc1NlYXJjaGVkIGNhbGxiYWNrLlxuICAgIGxldCBvblBhdGhzU2VhcmNoZWRcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKG9wdGlvbnMub25QYXRoc1NlYXJjaGVkKSkge1xuICAgICAgLy8gTWFpbnRhaW4gYSBtYXAgb2YgZGlyZWN0b3JpZXMgdG8gdGhlIG51bWJlciBvZiBzZWFyY2ggcmVzdWx0cy4gV2hlbiBub3RpZmllZCBvZiBhIG5ldyBjb3VudCxcbiAgICAgIC8vIHJlcGxhY2UgdGhlIGVudHJ5IGluIHRoZSBtYXAgYW5kIHVwZGF0ZSB0aGUgdG90YWwuXG4gICAgICBjb25zdCBvblBhdGhzU2VhcmNoZWRPcHRpb24gPSBvcHRpb25zLm9uUGF0aHNTZWFyY2hlZFxuICAgICAgbGV0IHRvdGFsTnVtYmVyT2ZQYXRoc1NlYXJjaGVkID0gMFxuICAgICAgY29uc3QgbnVtYmVyT2ZQYXRoc1NlYXJjaGVkRm9yU2VhcmNoZXIgPSBuZXcgTWFwKClcbiAgICAgIG9uUGF0aHNTZWFyY2hlZCA9IGZ1bmN0aW9uIChzZWFyY2hlciwgbnVtYmVyT2ZQYXRoc1NlYXJjaGVkKSB7XG4gICAgICAgIGNvbnN0IG9sZFZhbHVlID0gbnVtYmVyT2ZQYXRoc1NlYXJjaGVkRm9yU2VhcmNoZXIuZ2V0KHNlYXJjaGVyKVxuICAgICAgICBpZiAob2xkVmFsdWUpIHtcbiAgICAgICAgICB0b3RhbE51bWJlck9mUGF0aHNTZWFyY2hlZCAtPSBvbGRWYWx1ZVxuICAgICAgICB9XG4gICAgICAgIG51bWJlck9mUGF0aHNTZWFyY2hlZEZvclNlYXJjaGVyLnNldChzZWFyY2hlciwgbnVtYmVyT2ZQYXRoc1NlYXJjaGVkKVxuICAgICAgICB0b3RhbE51bWJlck9mUGF0aHNTZWFyY2hlZCArPSBudW1iZXJPZlBhdGhzU2VhcmNoZWRcbiAgICAgICAgcmV0dXJuIG9uUGF0aHNTZWFyY2hlZE9wdGlvbih0b3RhbE51bWJlck9mUGF0aHNTZWFyY2hlZClcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb25QYXRoc1NlYXJjaGVkID0gZnVuY3Rpb24gKCkge31cbiAgICB9XG5cbiAgICAvLyBLaWNrIG9mZiBhbGwgb2YgdGhlIHNlYXJjaGVzIGFuZCB1bmlmeSB0aGVtIGludG8gb25lIFByb21pc2UuXG4gICAgY29uc3QgYWxsU2VhcmNoZXMgPSBbXVxuICAgIGRpcmVjdG9yaWVzRm9yU2VhcmNoZXIuZm9yRWFjaCgoZGlyZWN0b3JpZXMsIHNlYXJjaGVyKSA9PiB7XG4gICAgICBjb25zdCBzZWFyY2hPcHRpb25zID0ge1xuICAgICAgICBpbmNsdXNpb25zOiBvcHRpb25zLnBhdGhzIHx8IFtdLFxuICAgICAgICBpbmNsdWRlSGlkZGVuOiB0cnVlLFxuICAgICAgICBleGNsdWRlVmNzSWdub3JlczogdGhpcy5jb25maWcuZ2V0KCdjb3JlLmV4Y2x1ZGVWY3NJZ25vcmVkUGF0aHMnKSxcbiAgICAgICAgZXhjbHVzaW9uczogdGhpcy5jb25maWcuZ2V0KCdjb3JlLmlnbm9yZWROYW1lcycpLFxuICAgICAgICBmb2xsb3c6IHRoaXMuY29uZmlnLmdldCgnY29yZS5mb2xsb3dTeW1saW5rcycpLFxuICAgICAgICBsZWFkaW5nQ29udGV4dExpbmVDb3VudDogb3B0aW9ucy5sZWFkaW5nQ29udGV4dExpbmVDb3VudCB8fCAwLFxuICAgICAgICB0cmFpbGluZ0NvbnRleHRMaW5lQ291bnQ6IG9wdGlvbnMudHJhaWxpbmdDb250ZXh0TGluZUNvdW50IHx8IDAsXG4gICAgICAgIGRpZE1hdGNoOiByZXN1bHQgPT4ge1xuICAgICAgICAgIGlmICghdGhpcy5wcm9qZWN0LmlzUGF0aE1vZGlmaWVkKHJlc3VsdC5maWxlUGF0aCkpIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVyYXRvcihyZXN1bHQpXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBkaWRFcnJvciAoZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gaXRlcmF0b3IobnVsbCwgZXJyb3IpXG4gICAgICAgIH0sXG4gICAgICAgIGRpZFNlYXJjaFBhdGhzIChjb3VudCkge1xuICAgICAgICAgIHJldHVybiBvblBhdGhzU2VhcmNoZWQoc2VhcmNoZXIsIGNvdW50KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCBkaXJlY3RvcnlTZWFyY2hlciA9IHNlYXJjaGVyLnNlYXJjaChkaXJlY3RvcmllcywgcmVnZXgsIHNlYXJjaE9wdGlvbnMpXG4gICAgICBhbGxTZWFyY2hlcy5wdXNoKGRpcmVjdG9yeVNlYXJjaGVyKVxuICAgIH0pXG4gICAgY29uc3Qgc2VhcmNoUHJvbWlzZSA9IFByb21pc2UuYWxsKGFsbFNlYXJjaGVzKVxuXG4gICAgZm9yIChsZXQgYnVmZmVyIG9mIHRoaXMucHJvamVjdC5nZXRCdWZmZXJzKCkpIHtcbiAgICAgIGlmIChidWZmZXIuaXNNb2RpZmllZCgpKSB7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gYnVmZmVyLmdldFBhdGgoKVxuICAgICAgICBpZiAoIXRoaXMucHJvamVjdC5jb250YWlucyhmaWxlUGF0aCkpIHtcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG4gICAgICAgIHZhciBtYXRjaGVzID0gW11cbiAgICAgICAgYnVmZmVyLnNjYW4ocmVnZXgsIG1hdGNoID0+IG1hdGNoZXMucHVzaChtYXRjaCkpXG4gICAgICAgIGlmIChtYXRjaGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBpdGVyYXRvcih7ZmlsZVBhdGgsIG1hdGNoZXN9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTWFrZSBzdXJlIHRoZSBQcm9taXNlIHRoYXQgaXMgcmV0dXJuZWQgdG8gdGhlIGNsaWVudCBpcyBjYW5jZWxhYmxlLiBUbyBiZSBjb25zaXN0ZW50XG4gICAgLy8gd2l0aCB0aGUgZXhpc3RpbmcgYmVoYXZpb3IsIGluc3RlYWQgb2YgY2FuY2VsKCkgcmVqZWN0aW5nIHRoZSBwcm9taXNlLCBpdCBzaG91bGRcbiAgICAvLyByZXNvbHZlIGl0IHdpdGggdGhlIHNwZWNpYWwgdmFsdWUgJ2NhbmNlbGxlZCcuIEF0IGxlYXN0IHRoZSBidWlsdC1pbiBmaW5kLWFuZC1yZXBsYWNlXG4gICAgLy8gcGFja2FnZSByZWxpZXMgb24gdGhpcyBiZWhhdmlvci5cbiAgICBsZXQgaXNDYW5jZWxsZWQgPSBmYWxzZVxuICAgIGNvbnN0IGNhbmNlbGxhYmxlUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IG9uU3VjY2VzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGlzQ2FuY2VsbGVkKSB7XG4gICAgICAgICAgcmVzb2x2ZSgnY2FuY2VsbGVkJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKG51bGwpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3Qgb25GYWlsdXJlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKGxldCBwcm9taXNlIG9mIGFsbFNlYXJjaGVzKSB7IHByb21pc2UuY2FuY2VsKCkgfVxuICAgICAgICByZWplY3QoKVxuICAgICAgfVxuXG4gICAgICBzZWFyY2hQcm9taXNlLnRoZW4ob25TdWNjZXNzLCBvbkZhaWx1cmUpXG4gICAgfSlcbiAgICBjYW5jZWxsYWJsZVByb21pc2UuY2FuY2VsID0gKCkgPT4ge1xuICAgICAgaXNDYW5jZWxsZWQgPSB0cnVlXG4gICAgICAvLyBOb3RlIHRoYXQgY2FuY2VsbGluZyBhbGwgb2YgdGhlIG1lbWJlcnMgb2YgYWxsU2VhcmNoZXMgd2lsbCBjYXVzZSBhbGwgb2YgdGhlIHNlYXJjaGVzXG4gICAgICAvLyB0byByZXNvbHZlLCB3aGljaCBjYXVzZXMgc2VhcmNoUHJvbWlzZSB0byByZXNvbHZlLCB3aGljaCBpcyB1bHRpbWF0ZWx5IHdoYXQgY2F1c2VzXG4gICAgICAvLyBjYW5jZWxsYWJsZVByb21pc2UgdG8gcmVzb2x2ZS5cbiAgICAgIGFsbFNlYXJjaGVzLm1hcCgocHJvbWlzZSkgPT4gcHJvbWlzZS5jYW5jZWwoKSlcbiAgICB9XG5cbiAgICAvLyBBbHRob3VnaCB0aGlzIG1ldGhvZCBjbGFpbXMgdG8gcmV0dXJuIGEgYFByb21pc2VgLCB0aGUgYFJlc3VsdHNQYW5lVmlldy5vblNlYXJjaCgpYFxuICAgIC8vIG1ldGhvZCBpbiB0aGUgZmluZC1hbmQtcmVwbGFjZSBwYWNrYWdlIGV4cGVjdHMgdGhlIG9iamVjdCByZXR1cm5lZCBieSB0aGlzIG1ldGhvZCB0byBoYXZlIGFcbiAgICAvLyBgZG9uZSgpYCBtZXRob2QuIEluY2x1ZGUgYSBkb25lKCkgbWV0aG9kIHVudGlsIGZpbmQtYW5kLXJlcGxhY2UgY2FuIGJlIHVwZGF0ZWQuXG4gICAgY2FuY2VsbGFibGVQcm9taXNlLmRvbmUgPSBvblN1Y2Nlc3NPckZhaWx1cmUgPT4ge1xuICAgICAgY2FuY2VsbGFibGVQcm9taXNlLnRoZW4ob25TdWNjZXNzT3JGYWlsdXJlLCBvblN1Y2Nlc3NPckZhaWx1cmUpXG4gICAgfVxuICAgIHJldHVybiBjYW5jZWxsYWJsZVByb21pc2VcbiAgfVxuXG4gIC8vIFB1YmxpYzogUGVyZm9ybXMgYSByZXBsYWNlIGFjcm9zcyBhbGwgdGhlIHNwZWNpZmllZCBmaWxlcyBpbiB0aGUgcHJvamVjdC5cbiAgLy9cbiAgLy8gKiBgcmVnZXhgIEEge1JlZ0V4cH0gdG8gc2VhcmNoIHdpdGguXG4gIC8vICogYHJlcGxhY2VtZW50VGV4dGAge1N0cmluZ30gdG8gcmVwbGFjZSBhbGwgbWF0Y2hlcyBvZiByZWdleCB3aXRoLlxuICAvLyAqIGBmaWxlUGF0aHNgIEFuIHtBcnJheX0gb2YgZmlsZSBwYXRoIHN0cmluZ3MgdG8gcnVuIHRoZSByZXBsYWNlIG9uLlxuICAvLyAqIGBpdGVyYXRvcmAgQSB7RnVuY3Rpb259IGNhbGxiYWNrIG9uIGVhY2ggZmlsZSB3aXRoIHJlcGxhY2VtZW50czpcbiAgLy8gICAqIGBvcHRpb25zYCB7T2JqZWN0fSB3aXRoIGtleXMgYGZpbGVQYXRoYCBhbmQgYHJlcGxhY2VtZW50c2AuXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7UHJvbWlzZX0uXG4gIHJlcGxhY2UgKHJlZ2V4LCByZXBsYWNlbWVudFRleHQsIGZpbGVQYXRocywgaXRlcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbGV0IGJ1ZmZlclxuICAgICAgY29uc3Qgb3BlblBhdGhzID0gdGhpcy5wcm9qZWN0LmdldEJ1ZmZlcnMoKS5tYXAoYnVmZmVyID0+IGJ1ZmZlci5nZXRQYXRoKCkpXG4gICAgICBjb25zdCBvdXRPZlByb2Nlc3NQYXRocyA9IF8uZGlmZmVyZW5jZShmaWxlUGF0aHMsIG9wZW5QYXRocylcblxuICAgICAgbGV0IGluUHJvY2Vzc0ZpbmlzaGVkID0gIW9wZW5QYXRocy5sZW5ndGhcbiAgICAgIGxldCBvdXRPZlByb2Nlc3NGaW5pc2hlZCA9ICFvdXRPZlByb2Nlc3NQYXRocy5sZW5ndGhcbiAgICAgIGNvbnN0IGNoZWNrRmluaXNoZWQgPSAoKSA9PiB7XG4gICAgICAgIGlmIChvdXRPZlByb2Nlc3NGaW5pc2hlZCAmJiBpblByb2Nlc3NGaW5pc2hlZCkge1xuICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghb3V0T2ZQcm9jZXNzRmluaXNoZWQubGVuZ3RoKSB7XG4gICAgICAgIGxldCBmbGFncyA9ICdnJ1xuICAgICAgICBpZiAocmVnZXgubXVsdGlsaW5lKSB7IGZsYWdzICs9ICdtJyB9XG4gICAgICAgIGlmIChyZWdleC5pZ25vcmVDYXNlKSB7IGZsYWdzICs9ICdpJyB9XG5cbiAgICAgICAgY29uc3QgdGFzayA9IFRhc2sub25jZShcbiAgICAgICAgICByZXF1aXJlLnJlc29sdmUoJy4vcmVwbGFjZS1oYW5kbGVyJyksXG4gICAgICAgICAgb3V0T2ZQcm9jZXNzUGF0aHMsXG4gICAgICAgICAgcmVnZXguc291cmNlLFxuICAgICAgICAgIGZsYWdzLFxuICAgICAgICAgIHJlcGxhY2VtZW50VGV4dCxcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICBvdXRPZlByb2Nlc3NGaW5pc2hlZCA9IHRydWVcbiAgICAgICAgICAgIGNoZWNrRmluaXNoZWQoKVxuICAgICAgICAgIH1cbiAgICAgICAgKVxuXG4gICAgICAgIHRhc2sub24oJ3JlcGxhY2U6cGF0aC1yZXBsYWNlZCcsIGl0ZXJhdG9yKVxuICAgICAgICB0YXNrLm9uKCdyZXBsYWNlOmZpbGUtZXJyb3InLCBlcnJvciA9PiB7IGl0ZXJhdG9yKG51bGwsIGVycm9yKSB9KVxuICAgICAgfVxuXG4gICAgICBmb3IgKGJ1ZmZlciBvZiB0aGlzLnByb2plY3QuZ2V0QnVmZmVycygpKSB7XG4gICAgICAgIGlmICghZmlsZVBhdGhzLmluY2x1ZGVzKGJ1ZmZlci5nZXRQYXRoKCkpKSB7IGNvbnRpbnVlIH1cbiAgICAgICAgY29uc3QgcmVwbGFjZW1lbnRzID0gYnVmZmVyLnJlcGxhY2UocmVnZXgsIHJlcGxhY2VtZW50VGV4dCwgaXRlcmF0b3IpXG4gICAgICAgIGlmIChyZXBsYWNlbWVudHMpIHtcbiAgICAgICAgICBpdGVyYXRvcih7ZmlsZVBhdGg6IGJ1ZmZlci5nZXRQYXRoKCksIHJlcGxhY2VtZW50c30pXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaW5Qcm9jZXNzRmluaXNoZWQgPSB0cnVlXG4gICAgICBjaGVja0ZpbmlzaGVkKClcbiAgICB9KVxuICB9XG5cbiAgY2hlY2tvdXRIZWFkUmV2aXNpb24gKGVkaXRvcikge1xuICAgIGlmIChlZGl0b3IuZ2V0UGF0aCgpKSB7XG4gICAgICBjb25zdCBjaGVja291dEhlYWQgPSAoKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb2plY3QucmVwb3NpdG9yeUZvckRpcmVjdG9yeShuZXcgRGlyZWN0b3J5KGVkaXRvci5nZXREaXJlY3RvcnlQYXRoKCkpKVxuICAgICAgICAgIC50aGVuKHJlcG9zaXRvcnkgPT4gcmVwb3NpdG9yeSAmJiByZXBvc2l0b3J5LmNoZWNrb3V0SGVhZEZvckVkaXRvcihlZGl0b3IpKVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jb25maWcuZ2V0KCdlZGl0b3IuY29uZmlybUNoZWNrb3V0SGVhZFJldmlzaW9uJykpIHtcbiAgICAgICAgdGhpcy5hcHBsaWNhdGlvbkRlbGVnYXRlLmNvbmZpcm0oe1xuICAgICAgICAgIG1lc3NhZ2U6ICdDb25maXJtIENoZWNrb3V0IEhFQUQgUmV2aXNpb24nLFxuICAgICAgICAgIGRldGFpbGVkTWVzc2FnZTogYEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkaXNjYXJkIGFsbCBjaGFuZ2VzIHRvIFwiJHtlZGl0b3IuZ2V0RmlsZU5hbWUoKX1cIiBzaW5jZSB0aGUgbGFzdCBHaXQgY29tbWl0P2AsXG4gICAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgICAgT0s6IGNoZWNrb3V0SGVhZCxcbiAgICAgICAgICAgIENhbmNlbDogbnVsbFxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjaGVja291dEhlYWQoKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKVxuICAgIH1cbiAgfVxufVxuIl19