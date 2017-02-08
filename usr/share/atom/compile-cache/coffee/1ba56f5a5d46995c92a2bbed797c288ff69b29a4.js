(function() {
  var CompositeDisposable, getIndentationStats;

  CompositeDisposable = require('atom').CompositeDisposable;

  getIndentationStats = function(lines) {
    var frequency, greatestFrequency, lastStats, mostCommonTabLength, spaceCounts, spaceIndentCount, tabIndentCount, tabLength;
    tabIndentCount = 0;
    spaceIndentCount = 0;
    lastStats = {
      tabCount: 0,
      spaceCount: 0
    };
    spaceCounts = {};
    lines.forEach((function(_this) {
      return function(line) {
        var delta, stats, whitespace;
        whitespace = line.match(/^\s*/)[0];
        stats = {
          tabCount: whitespace.replace(/\ /g, '').length,
          spaceCount: whitespace.replace(/\t/g, '').length
        };
        if (stats.tabCount === 0 && lastStats.tabCount === 0) {
          spaceIndentCount += 1;
          delta = Math.abs(stats.spaceCount - lastStats.spaceCount);
          if (delta) {
            if (!spaceCounts[delta]) {
              spaceCounts[delta] = 1;
            } else {
              spaceCounts[delta] += 1;
            }
          }
        }
        if (stats.spaceCount === 0 && lastStats.spaceCount === 0) {
          tabIndentCount += 1;
        }
        return lastStats = stats;
      };
    })(this));
    mostCommonTabLength = 0;
    greatestFrequency = 0;
    for (tabLength in spaceCounts) {
      frequency = spaceCounts[tabLength];
      if (frequency > greatestFrequency) {
        mostCommonTabLength = tabLength;
        greatestFrequency = frequency;
      }
    }
    return {
      tabIndentCount: tabIndentCount,
      spaceIndentCount: spaceIndentCount,
      mostCommonTabLength: Number(mostCommonTabLength),
      frequency: greatestFrequency
    };
  };

  module.exports = {
    activate: function(state) {
      this.disposables = new CompositeDisposable;
      return this.disposables.add(atom.workspace.observeActivePaneItem((function(_this) {
        return function(item) {
          var defaultIsSoftTabs, defaultTabLength, editor, stats;
          editor = atom.workspace.getActiveTextEditor();
          if (editor) {
            defaultIsSoftTabs = atom.config.get("editor.softTabs", {
              scope: editor.getRootScopeDescriptor().scopes
            });
            defaultTabLength = atom.config.get("editor.tabLength", {
              scope: editor.getRootScopeDescriptor().scopes
            });
            stats = getIndentationStats(editor.buffer.getLines());
            if (stats.tabIndentCount >= stats.spaceIndentCount && stats.tabIndentCount >= 2) {
              editor.setSoftTabs(false);
              return editor.setTabLength(defaultTabLength);
            } else if (stats.tabIndentCount < stats.spaceIndentCount && stats.frequency >= 2) {
              editor.setSoftTabs(true);
              return editor.setTabLength(stats.mostCommonTabLength || defaultTabLength);
            } else {
              editor.setSoftTabs(defaultIsSoftTabs);
              return editor.setTabLength(defaultTabLength);
            }
          }
        };
      })(this)));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9ndWVzcy1pbmRlbnQvbGliL2d1ZXNzLWluZGVudC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0NBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUVBLG1CQUFBLEdBQXNCLFNBQUMsS0FBRCxHQUFBO0FBQ3BCLFFBQUEsc0hBQUE7QUFBQSxJQUFBLGNBQUEsR0FBaUIsQ0FBakIsQ0FBQTtBQUFBLElBQ0EsZ0JBQUEsR0FBbUIsQ0FEbkIsQ0FBQTtBQUFBLElBR0EsU0FBQSxHQUFZO0FBQUEsTUFDVixRQUFBLEVBQVUsQ0FEQTtBQUFBLE1BRVYsVUFBQSxFQUFZLENBRkY7S0FIWixDQUFBO0FBQUEsSUFRQSxXQUFBLEdBQWMsRUFSZCxDQUFBO0FBQUEsSUFVQSxLQUFLLENBQUMsT0FBTixDQUFjLENBQUEsU0FBQSxLQUFBLEdBQUE7YUFBQSxTQUFDLElBQUQsR0FBQTtBQUNaLFlBQUEsd0JBQUE7QUFBQSxRQUFBLFVBQUEsR0FBYSxJQUFJLENBQUMsS0FBTCxDQUFXLE1BQVgsQ0FBbUIsQ0FBQSxDQUFBLENBQWhDLENBQUE7QUFBQSxRQUNBLEtBQUEsR0FBUTtBQUFBLFVBQ04sUUFBQSxFQUFVLFVBQVUsQ0FBQyxPQUFYLENBQW1CLEtBQW5CLEVBQTBCLEVBQTFCLENBQTZCLENBQUMsTUFEbEM7QUFBQSxVQUVOLFVBQUEsRUFBWSxVQUFVLENBQUMsT0FBWCxDQUFtQixLQUFuQixFQUEwQixFQUExQixDQUE2QixDQUFDLE1BRnBDO1NBRFIsQ0FBQTtBQU1BLFFBQUEsSUFBRyxLQUFLLENBQUMsUUFBTixLQUFrQixDQUFsQixJQUF3QixTQUFTLENBQUMsUUFBVixLQUFzQixDQUFqRDtBQUNFLFVBQUEsZ0JB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

//# sourceURL=/home/kyan/.atom/packages/guess-indent/lib/guess-indent.coffee
