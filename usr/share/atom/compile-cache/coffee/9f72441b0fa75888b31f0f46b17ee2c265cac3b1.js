(function() {
  var child, filteredEnvironment, fs, path, pty, systemLanguage, _;

  pty = require('pty.js');

  path = require('path');

  fs = require('fs');

  _ = require('underscore');

  child = require('child_process');

  systemLanguage = (function() {
    var command, language;
    language = "en_US.UTF-8";
    if (process.platform === 'darwin') {
      try {
        command = 'plutil -convert json -o - ~/Library/Preferences/.GlobalPreferences.plist';
        language = "" + (JSON.parse(child.execSync(command).toString()).AppleLocale) + ".UTF-8";
      } catch (_error) {}
    }
    return language;
  })();

  filteredEnvironment = (function() {
    var env;
    env = _.omit(process.env, 'ATOM_HOME', 'ATOM_SHELL_INTERNAL_RUN_AS_NODE', 'GOOGLE_API_KEY', 'NODE_ENV', 'NODE_PATH', 'userAgent', 'taskPath');
    if (env.LANG == null) {
      env.LANG = systemLanguage;
    }
    env.TERM_PROGRAM = 'platformio-ide-terminal';
    return env;
  })();

  module.exports = function(pwd, shell, args, options) {
    var callback, emitTitle, ptyProcess, title;
    if (options == null) {
      options = {};
    }
    callback = this.async();
    if (/zsh|bash/.test(shell) && args.indexOf('--login') === -1) {
      args.unshift('--login');
    }
    ptyProcess = pty.fork(shell, args, {
      cwd: pwd,
      env: filteredEnvironment,
      name: 'xterm-256color'
    });
    title = shell = path.basename(shell);
    emitTitle = _.throttle(function() {
      return emit('platformio-ide-terminal:title', ptyProcess.process);
    }, 500, true);
    ptyProcess.on('data', function(data) {
      emit('platformio-ide-terminal:data', data);
      return emitTitle();
    });
    ptyProcess.on('exit', function() {
      emit('platformio-ide-terminal:exit');
      return callback();
    });
    return process.on('message', function(_arg) {
      var cols, event, rows, text, _ref;
      _ref = _arg != null ? _arg : {}, event = _ref.event, cols = _ref.cols, rows = _ref.rows, text = _ref.text;
      switch (event) {
        case 'resize':
          return ptyProcess.resize(cols, rows);
        case 'input':
          return ptyProcess.write(text);
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9wbGF0Zm9ybWlvLWlkZS10ZXJtaW5hbC9saWIvcHJvY2Vzcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNERBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUZMLENBQUE7O0FBQUEsRUFHQSxDQUFBLEdBQUksT0FBQSxDQUFRLFlBQVIsQ0FISixDQUFBOztBQUFBLEVBSUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxlQUFSLENBSlIsQ0FBQTs7QUFBQSxFQU1BLGNBQUEsR0FBb0IsQ0FBQSxTQUFBLEdBQUE7QUFDbEIsUUFBQSxpQkFBQTtBQUFBLElBQUEsUUFBQSxHQUFXLGFBQVgsQ0FBQTtBQUNBLElBQUEsSUFBRyxPQUFPLENBQUMsUUFBUixLQUFvQixRQUF2QjtBQUNFO0FBQ0UsUUFBQSxPQUFBLEdBQVUsMEVBQVYsQ0FBQTtBQUFBLFFBQ0EsUUFBQSxHQUFXLEVBQUEsR0FBRSxDQUFDLElBQUksQ0FBQyxLQUFMLENBQVcsS0FBSyxDQUFDLFFBQU4sQ0FBZSxPQUFmLENBQXVCLENBQUMsUUFBeEIsQ0FBQSxDQUFYLENBQThDLENBQUMsV0FBaEQsQ0FBRixHQUE4RCxRQUR6RSxDQURGO09BQUEsa0JBREY7S0FEQTtBQUtBLFdBQU8sUUFBUCxDQU5rQjtFQUFBLENBQUEsQ0FBSCxDQUFBLENBTmpCLENBQUE7O0FBQUEsRUFjQSxtQkFBQSxHQUF5QixDQUFBLFNBQUEsR0FBQTtBQUN2QixRQUFBLEdBQUE7QUFBQSxJQUFBLEdBQUEsR0FBTSxDQUFDLENBQUMsSUFBRixDQUFPLE9B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

//# sourceURL=/home/kyan/.atom/packages/platformio-ide-terminal/lib/process.coffee
