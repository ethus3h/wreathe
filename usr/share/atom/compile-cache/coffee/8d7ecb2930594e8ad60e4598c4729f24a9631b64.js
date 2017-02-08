(function() {
  var CompositeDisposable, ErrorView, Repo, RepoView;

  CompositeDisposable = require('atom').CompositeDisposable;

  Repo = RepoView = ErrorView = null;

  module.exports = {
    config: {
      debug: {
        title: 'Debug',
        description: 'Toggle debugging tools',
        type: 'boolean',
        "default": false,
        order: 1
      },
      pre_commit_hook: {
        title: 'Pre Commit Hook',
        description: 'Command to run for the pre commit hook',
        type: 'string',
        "default": '',
        order: 2
      },
      show_on_startup: {
        title: 'Show on Startup',
        description: 'Check this if you want atomatigit to show up when Atom is loaded',
        type: 'boolean',
        "default": false,
        order: 3
      },
      display_commit_comparisons: {
        title: 'Display Commit Comparisons',
        description: 'Display how many commits ahead/behind your branches are',
        type: 'boolean',
        "default": true,
        order: 4
      }
    },
    repo: null,
    repoView: null,
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.insertCommands();
      this.installPackageDependencies();
      if (atom.config.get('atomatigit.show_on_startup')) {
        return this.toggle();
      }
    },
    toggle: function() {
      if (!atom.project.getRepositories()[0]) {
        return this.errorNoGitRepo();
      }
      if (!(Repo && RepoView)) {
        this.loadClasses();
      }
      if (this.repo == null) {
        this.repo = new Repo();
      }
      if (this.repoView == null) {
        this.repoView = new RepoView(this.repo);
        return this.repoView.InitPromise.then((function(_this) {
          return function() {
            return _this.repoView.toggle();
          };
        })(this));
      } else {
        return this.repoView.toggle();
      }
    },
    deactivate: function() {
      var _ref, _ref1;
      if ((_ref = this.repo) != null) {
        _ref.destroy();
      }
      if ((_ref1 = this.repoView) != null) {
        _ref1.destroy();
      }
      return this.subscriptions.dispose();
    },
    errorNoGitRepo: function() {
      return atom.notifications.addError('Project is no git repository!');
    },
    insertCommands: function() {
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'atomatigit:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      }));
    },
    loadClasses: function() {
      Repo = require('./models/repo');
      return RepoView = require('./views/repo-view');
    },
    installPackageDependencies: function() {
      if (atom.packages.getLoadedPackage('language-diff')) {
        return;
      }
      return require('atom-package-dependencies').install(function() {
        atom.notifications.addSuccess('Atomatigit: Dependencies installed correctly.', {
          dismissable: true
        });
        return atom.packages.activatePackage('language-diff');
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9hdG9tYXRpZ2l0L2xpYi9hdG9tYXRpZ2l0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4Q0FBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLFFBQUEsR0FBVyxTQUFBLEdBQVksSUFEOUIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sT0FBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLHdCQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLEtBSFQ7QUFBQSxRQUlBLEtBQUEsRUFBTyxDQUpQO09BREY7QUFBQSxNQU1BLGVBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLGlCQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsd0NBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsRUFIVDtBQUFBLFFBSUEsS0FBQSxFQUFPLENBSlA7T0FQRjtBQUFBLE1BWUEsZUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8saUJBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSxrRUFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxLQUhUO0FBQUEsUUFJQSxLQUFBLEVBQU8sQ0FKUDtPQWJGO0FBQUEsTUFrQkEsMEJBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLDRCQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEseURBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEs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

//# sourceURL=/home/kyan/.atom/packages/atomatigit/lib/atomatigit.coffee
