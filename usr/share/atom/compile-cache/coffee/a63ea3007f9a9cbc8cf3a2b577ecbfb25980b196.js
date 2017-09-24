(function() {
  var NavParser, argsRe, fs, i, indentSpaceRe, j, langdef, langmap, path, positionRe, ref;

  fs = require('fs');

  path = require('path');

  ref = require('./ctags'), langdef = ref.langdef, langmap = ref.langmap;

  argsRe = {
    '()': /(\([^)]+\))/,
    '[]': /(\[[^\]]+\])/
  };

  indentSpaceRe = /^(?: |\t)*/;

  positionRe = [];

  for (i = j = 0; j <= 9; i = ++j) {
    positionRe[i] = new RegExp('%' + i, 'g');
  }

  module.exports = NavParser = (function() {
    NavParser.prototype.pathObserver = null;

    NavParser.prototype.projectRules = {};

    function NavParser() {
      var pathObserver;
      this.getProjectRules(atom.project.getPaths());
      pathObserver = atom.project.onDidChangePaths((function(_this) {
        return function(paths) {
          return _this.getProjectRules(paths);
        };
      })(this));
    }

    NavParser.prototype.getProjectRules = function(paths) {
      var k, len, projectPath, results, ruleFile;
      for (projectPath in this.projectRules) {
        if (paths.indexOf(projectPath) === -1) {
          delete this.projectRules[projectPath];
        }
      }
      results = [];
      for (k = 0, len = paths.length; k < len; k++) {
        projectPath = paths[k];
        ruleFile = projectPath + path.sep + '.nav-marker-rules';
        if (!this.projectRules[projectPath]) {
          results.push((function(_this) {
            return function(projectPath) {
              return fs.readFile(ruleFile, function(err, data) {
                var base, l, len1, line, results1, rule, rulesText;
                if (!data) {
                  return;
                }
                rulesText = data.toString().split("\n");
                results1 = [];
                for (l = 0, len1 = rulesText.length; l < len1; l++) {
                  line = rulesText[l];
                  if (line.indexOf('#' + 'marker-rule:') >= 0) {
                    rule = _this.parseRule(line);
                    if (rule) {
                      (base = _this.projectRules)[projectPath] || (base[projectPath] = []);
                      results1.push(_this.projectRules[projectPath].push(rule));
                    } else {
                      results1.push(void 0);
                    }
                  } else {
                    results1.push(void 0);
                  }
                }
                return results1;
              });
            };
          })(this)(projectPath));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    NavParser.prototype.parse = function() {
      var activeRules, editor, editorFile, ext, indent, items, k, l, len, len1, len2, lineText, m, markerIndents, match, n, newRule, nextLineText, parentIndent, prevIndent, projectPath, projectRules, ref1, ref2, ref3, row, rule, updateRules;
      items = [];
      editor = atom.workspace.getActiveTextEditor();
      if (!editor) {
        return items;
      }
      editorFile = editor.getPath();
      if (!editorFile) {
        return;
      }
      activeRules = ((ref1 = langdef.All) != null ? ref1.slice() : void 0) || [];
      markerIndents = [];
      updateRules = function(newRule) {
        var disableGroup, ext, fileMatches, k, l, len, len1, len2, m, ref2, ref3, rule;
        if (newRule.ext) {
          fileMatches = false;
          ref2 = newRule.ext;
          for (k = 0, len = ref2.length; k < len; k++) {
            ext = ref2[k];
            if (editorFile.lastIndexOf(ext) + ext.length === editorFile.length) {
              fileMatches = true;
              break;
            }
          }
          if (!fileMatches) {
            return;
          }
        }
        if (newRule.startOver) {
          activeRules = [];
        }
        if (newRule.disableGroups) {
          ref3 = newRule.disableGroups;
          for (l = 0, len1 = ref3.length; l < len1; l++) {
            disableGroup = ref3[l];
            for (i = m = 0, len2 = activeRules.length; m < len2; i = ++m) {
              rule = activeRules[i];
              if (rule.kind === disableGroup) {
                activeRules.splice(i, 1);
              }
            }
          }
        }
        if (newRule.re) {
          return activeRules.push(newRule);
        }
      };
      prevIndent = 0;
      ref2 = Object.keys(langmap);
      for (k = 0, len = ref2.length; k < len; k++) {
        ext = ref2[k];
        if (editorFile.lastIndexOf(ext) + ext.length === editorFile.length) {
          activeRules = activeRules.concat(langmap[ext]);
          break;
        }
      }
      for (projectPath in this.projectRules) {
        if (editorFile.indexOf(projectPath) === 0) {
          projectRules = this.projectRules[projectPath];
          for (l = 0, len1 = projectRules.length; l < len1; l++) {
            rule = projectRules[l];
            updateRules(rule);
          }
        }
      }
      for (row = m = 0, ref3 = editor.getLineCount(); 0 <= ref3 ? m <= ref3 : m >= ref3; row = 0 <= ref3 ? ++m : --m) {
        lineText = editor.lineTextForBufferRow(row);
        if (lineText) {
          lineText = lineText.trim();
        }
        if (!lineText) {
          continue;
        }
        if (lineText.indexOf('#' + 'marker-rule:') >= 0) {
          newRule = this.parseRule(lineText);
          if (newRule) {
            updateRules(newRule);
            continue;
          }
        }
        indent = lineText.match(indentSpaceRe)[0].length;
        while (indent < prevIndent) {
          prevIndent = markerIndents.pop();
        }
        for (n = 0, len2 = activeRules.length; n < len2; n++) {
          rule = activeRules[n];
          if (rule.multiline === true && row < editor.getLineCount()) {
            nextLineText = editor.lineTextForBufferRow(row + 1);
            lineText = lineText + '\n' + nextLineText;
            match = lineText.match(rule.re);
          } else {
            match = lineText.match(rule.re);
          }
          if (match) {
            parentIndent = -1;
            if (indent > prevIndent) {
              markerIndents.push(indent);
            }
            if (markerIndents.length > 1) {
              parentIndent = markerIndents[markerIndents.length - 2];
            }
            items.push(this.makeItem(rule, match, lineText, row, indent, parentIndent));
          }
        }
      }
      return items;
    };

    NavParser.prototype.makeItem = function(rule, match, text, row, indent, parentIndent) {
      var argsMatch, icon, item, k, kind, label, len, str, tooltip;
      label = rule.id || '';
      tooltip = rule.tooltip || '';
      icon = rule.icon;
      if (label || tooltip) {
        for (i = k = 0, len = match.length; k < len; i = ++k) {
          str = match[i];
          if (label) {
            label = label.replace(positionRe[i], match[i]);
          }
          if (tooltip) {
            tooltip = tooltip.replace(positionRe[i], match[i]);
          }
        }
      }
      if (!label) {
        label = match[1] || match[0];
      }
      kind = rule.kind || 'Markers';
      if (rule.args) {
        argsMatch = argsRe[rule.args].exec(text);
        if (argsMatch) {
          tooltip += argsMatch[1];
        }
      }
      return item = {
        label: label,
        icon: icon,
        kind: kind,
        row: row,
        tooltip: tooltip,
        indent: indent,
        parentIndent: parentIndent
      };
    };

    NavParser.prototype.parseRule = function(line) {
      var flag, k, len, part, parts, reFields, reStr, rule, ruleStr;
      if (!line) {
        return;
      }
      ruleStr = line.split('#' + 'marker-rule:')[1].trim();
      if (!ruleStr) {
        return;
      }
      parts = ruleStr.split('||');
      reFields = parts[0].match(/[ \t]*\/(.+)\/(.*)/);
      if (!reFields && ruleStr.search(/(^|\|\|)(startOver|disable=)/) === -1) {
        console.log('Navigator Panel: No regular expression found in :', line);
        return;
      }
      rule = {};
      if (reFields) {
        reStr = reFields[1];
        if (reFields[2]) {
          flag = 'i';
        }
        rule = {
          re: new RegExp(reStr, flag)
        };
        if (/\\n/.test(reFields[1])) {
          rule.multiline = true;
        }
        parts.shift();
      }
      for (k = 0, len = parts.length; k < len; k++) {
        part = parts[k];
        if (part.indexOf('%') !== -1) {
          rule.id = part;
        } else if (part.indexOf('startOver') === 0) {
          rule.startOver = true;
        } else if (part.indexOf('disable=') === 0) {
          rule.disableGroups = part.substr('disable='.length).split(',');
        } else if (part.indexOf('ext=') === 0) {
          rule.ext = part.substr('ext='.length).split(',');
        } else {
          rule.kind = part;
        }
      }
      return rule;
    };

    NavParser.prototype.destroy = function() {
      if (typeof pathObserver !== "undefined" && pathObserver !== null) {
        return this.pathObserver.dispose();
      }
    };

    return NavParser;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2xpYnJhcnkvRW1iZXIgc2F0ZWxsaXRlIHByb2plY3RzL3dyZWF0aGUtYmFzZS91c3Ivc2hhcmUvYXRvbS9wYWNrYWdlcy9uYXYtcGFuZWwtcGx1cy9saWIvbmF2LXBhcnNlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsTUFBcUIsT0FBQSxDQUFRLFNBQVIsQ0FBckIsRUFBQyxxQkFBRCxFQUFVOztFQUdWLE1BQUEsR0FBUztJQUNQLElBQUEsRUFBTSxhQURDO0lBRVAsSUFBQSxFQUFNLGNBRkM7OztFQUlULGFBQUEsR0FBZ0I7O0VBQ2hCLFVBQUEsR0FBYTs7QUFDYixPQUFTLDBCQUFUO0lBQ0UsVUFBVyxDQUFBLENBQUEsQ0FBWCxHQUFvQixJQUFBLE1BQUEsQ0FBTyxHQUFBLEdBQU0sQ0FBYixFQUFnQixHQUFoQjtBQUR0Qjs7RUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO3dCQUNKLFlBQUEsR0FBYzs7d0JBQ2QsWUFBQSxHQUFlOztJQUdGLG1CQUFBO0FBQ1gsVUFBQTtNQUFBLElBQUMsQ0FBQSxlQUFELENBQWlCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQWpCO01BQ0EsWUFBQSxHQUFlLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWIsQ0FBOEIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEtBQUQ7aUJBQzNDLEtBQUMsQ0FBQSxlQUFELENBQWlCLEtBQWpCO1FBRDJDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE5QjtJQUZKOzt3QkFNYixlQUFBLEdBQWlCLFNBQUMsS0FBRDtBQUVmLFVBQUE7QUFBQSxXQUFBLGdDQUFBO1FBQ0UsSUFBRyxLQUFLLENBQUMsT0FBTixDQUFjLFdBQWQsQ0FBQSxLQUE4QixDQUFDLENB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LEtBQUssQ0FBQyxJQUFOLENBQVcsUUFBUyxDQUFBLENBQUEsQ0FBcEIsQ0FBSDtVQUNFLElBQUksQ0FBQyxTQUFMLEdBQWlCLEtBRG5COztRQUVBLEtBQUssQ0FBQyxLQUFOLENBQUEsRUFORjs7QUFRQSxXQUFBLHVDQUFBOztRQUNFLElBQUcsSUFBSSxDQUFDLE9BQUwsQ0FBYSxHQUFiLENBQUEsS0FBc0IsQ0FBQyxDQUExQjtVQUNFLElBQUksQ0FBQyxFQUFMLEdBQVUsS0FEWjtTQUFBLE1BRUssSUFBRyxJQUFJLENBQUMsT0FBTCxDQUFhLFdBQWIsQ0FBQSxLQUE2QixDQUFoQztVQUNILElBQUksQ0FBQyxTQUFMLEdBQWlCLEtBRGQ7U0FBQSxNQUVBLElBQUcsSUFBSSxDQUFDLE9BQUwsQ0FBYSxVQUFiLENBQUEsS0FBNEIsQ0FBL0I7VUFDSCxJQUFJLENBQUMsYUFBTCxHQUFxQixJQUFJLENBQUMsTUFBTCxDQUFZLFVBQVUsQ0FBQyxNQUF2QixDQUE4QixDQUFDLEtBQS9CLENBQXFDLEdBQXJDLEVBRGxCO1NBQUEsTUFFQSxJQUFHLElBQUksQ0FBQyxPQUFMLENBQWEsTUFBYixDQUFBLEtBQXdCLENBQTNCO1VBQ0gsSUFBSSxDQUFDLEdBQUwsR0FBVyxJQUFJLENBQUMsTUFBTCxDQUFZLE1BQU0sQ0FBQyxNQUFuQixDQUEwQixDQUFDLEtBQTNCLENBQWlDLEdBQWpDLEVBRFI7U0FBQSxNQUFBO1VBR0gsSUFBSSxDQUFDLElBQUwsR0FBWSxLQUhUOztBQVBQO0FBV0EsYUFBTztJQXJDRTs7d0JBd0NYLE9BQUEsR0FBUyxTQUFBO01BQ1AsSUFBMkIsNERBQTNCO2VBQUEsSUFBQyxDQUFBLFlBQVksQ0FBQyxPQUFkLENBQUEsRUFBQTs7SUFETzs7Ozs7QUE1TFgiLCJzb3VyY2VzQ29udGVudCI6WyJmcyA9IHJlcXVpcmUgJ2ZzJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG57bGFuZ2RlZiwgbGFuZ21hcH0gPSByZXF1aXJlICcuL2N0YWdzJ1xuXG4jIFJlZ0V4cCB0byBjYXB0dXJlIGFueSBhcmd1bWVudHMgd2l0aGluICgpIG9yIHdpdGhpbiBbXVxuYXJnc1JlID0ge1xuICAnKCknOiAvKFxcKFteKV0rXFwpKS9cbiAgJ1tdJzogLyhcXFtbXlxcXV0rXFxdKS9cbn1cbmluZGVudFNwYWNlUmUgPSAvXig/OiB8XFx0KSovXG5wb3NpdGlvblJlID0gW11cbmZvciBpIGluIFswLi45XVxuICBwb3NpdGlvblJlW2ldID0gbmV3IFJlZ0V4cCgnJScgKyBpLCAnZycpXG5cblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgTmF2UGFyc2VyXG4gIHBhdGhPYnNlcnZlcjogbnVsbFxuICBwcm9qZWN0UnVsZXMgOiB7fVxuXG5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQGdldFByb2plY3RSdWxlcyBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVxuICAgIHBhdGhPYnNlcnZlciA9IGF0b20ucHJvamVjdC5vbkRpZENoYW5nZVBhdGhzIChwYXRocyk9PlxuICAgICAgQGdldFByb2plY3RSdWxlcyBwYXRoc1xuXG5cbiAgZ2V0UHJvamVjdFJ1bGVzOiAocGF0aHMpLT5cbiAgICAjIEZpcnN0IHJlbW92ZSBhbnkgcHJvamVjdCB0aGF0J3MgYmVlbiBjbG9zZWRcbiAgICBmb3IgcHJvamVjdFBhdGggb2YgQHByb2plY3RSdWxlc1xuICAgICAgaWYgcGF0aHMuaW5kZXhPZihwcm9qZWN0UGF0aCkgPT0gLTFcbiAgICAgICAgZGVsZXRlIEBwcm9qZWN0UnVsZXNbcHJvamVjdFBhdGhdXG4gICAgIyBOb3cgYW55IG5ldyBwcm9qZWN0IG9wZW5lZC5cbiAgICBmb3IgcHJvamVjdFBhdGggaW4gcGF0aHNcbiAgICAgIHJ1bGVGaWxlID0gcHJvamVjdFBhdGggKyBwYXRoLnNlcCArICcubmF2LW1hcmtlci1ydWxlcydcbiAgICAgIGlmICFAcHJvamVjdFJ1bGVzW3Byb2plY3RQYXRoXVxuICAgICAgICBkbyAocHJvamVjdFBhdGgpPT5cbiAgICAgICAgICBmcy5yZWFkRmlsZSBydWxlRmlsZSwgKGVycixkYXRhKT0+XG4gICAgICAgICAgICByZXR1cm4gdW5sZXNzIGRhdGFcbiAgICAgICAgICAgIHJ1bGVzVGV4dCA9IGRhdGEudG9TdHJpbmcoKS5zcGxpdChcIlxcblwiKVxuICAgICAgICAgICAgZm9yIGxpbmUgaW4gcnVsZXNUZXh0XG4gICAgICAgICAgICAgIGlmIGxpbmUuaW5kZXhPZignIycgKyAnbWFya2VyLXJ1bGU6JykgPj0gMFxuICAgICAgICAgICAgICAgIHJ1bGUgPSBAcGFyc2VSdWxlKGxpbmUpXG4gICAgICAgICAgICAgICAgaWYgcnVsZVxuICAgICAgICAgICAgICAgICAgQHByb2plY3RSdWxlc1twcm9qZWN0UGF0aF0gfHw9IFtdXG4gICAgICAgICAgICAgICAgICBAcHJvamVjdFJ1bGVzW3Byb2plY3RQYXRoXS5wdXNoIHJ1bGVcblxuXG4gIHBhcnNlOiAtPlxuICAgICMgcGFyc2UgYWN0aXZlIGVkaXRvcidzIHRleHRcbiAgICBpdGVtcyA9IFtdXG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgcmV0dXJuIGl0ZW1zIHVubGVzcyBlZGl0b3JcbiAgICBlZGl0b3JGaWxlID0gZWRpdG9yLmdldFBhdGgoKVxuICAgIHJldHVybiB1bmxlc3MgZWRpdG9yRmlsZSAgIyBoYXBwZW5zIHdpdGggbmV3IGZpbGVcblxuICAgIGFjdGl2ZVJ1bGVzID0gbGFuZ2RlZi5BbGw/LnNsaWNlKCkgfHwgW10gICMgTVVTVCBvcGVyYXRlIG9uIGEgY29weS5cbiAgICAjIEFzc2lnbmluZyB3aXRob3V0IHNsaWNlKCkgaW4gdGhlIGxpbmUgYWJvdmUgY2F1c2VkIGFkZGl0aW9ucyB0b1xuICAgICMgYWN0aXZlUnVsZXMgKGJlbG93KSB0byBhbHNvIGJlIGFkZGl0aW9ucyB0byBsYW5nZGVmLkFsbCwgd2hpY2hcbiAgICAjIHdhcyBkZWZpbml0ZWx5IG5vdCBkZXNpcmVkLlxuICAgIG1hcmtlckluZGVudHMgPSBbXSAgICAjIGluZGVudCBjaGFycyB0byB0cmFjayBwYXJlbnQvY2hpbGRyZW5cblxuICAgIHVwZGF0ZVJ1bGVzID0gKG5ld1J1bGUpLT5cbiAgICAgIGlmIG5ld1J1bGUuZXh0XG4gICAgICAgIGZpbGVNYXRjaGVzID0gZmFsc2VcbiAgICAgICAgZm9yIGV4dCBpbiBuZXdSdWxlLmV4dFxuICAgICAgICAgIGlmIGVkaXRvckZpbGUubGFzdEluZGV4T2YoZXh0KSArIGV4dC5sZW5ndGggPT0gZWRpdG9yRmlsZS5sZW5ndGhcbiAgICAgICAgICAgIGZpbGVNYXRjaGVzID0gdHJ1ZVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgcmV0dXJuIHVubGVzcyBmaWxlTWF0Y2hlc1xuICAgICAgaWYgbmV3UnVsZS5zdGFydE92ZXJcbiAgICAgICAgYWN0aXZlUnVsZXMgPSBbXVxuICAgICAgaWYgbmV3UnVsZS5kaXNhYmxlR3JvdXBzXG4gICAgICAgIGZvciBkaXNhYmxlR3JvdXAgaW4gbmV3UnVsZS5kaXNhYmxlR3JvdXBzXG4gICAgICAgICAgZm9yIHJ1bGUsIGkgaW4gYWN0aXZlUnVsZXNcbiAgICAgICAgICAgIGlmIHJ1bGUua2luZCA9PSBkaXNhYmxlR3JvdXBcbiAgICAgICAgICAgICAgYWN0aXZlUnVsZXMuc3BsaWNlKGksIDEpXG4gICAgICBpZiBuZXdSdWxlLnJlXG4gICAgICAgIGFjdGl2ZVJ1bGVzLnB1c2ggbmV3UnVsZVxuXG4gICAgcHJldkluZGVudCA9IDBcbiAgICBmb3IgZXh0IGluIE9iamVjdC5rZXlzKGxhbmdtYXApXG4gICAgICBpZiBlZGl0b3JGaWxlLmxhc3RJbmRleE9mKGV4dCkgKyBleHQubGVuZ3RoID09IGVkaXRvckZpbGUubGVuZ3RoXG4gICAgICAgIGFjdGl2ZVJ1bGVzID0gYWN0aXZlUnVsZXMuY29uY2F0KGxhbmdtYXBbZXh0XSlcbiAgICAgICAgYnJlYWtcblxuICAgICMgaW5jb3Jwb3JhdGUgcHJvamVjdCBydWxlc1xuICAgIGZvciBwcm9qZWN0UGF0aCBvZiBAcHJvamVjdFJ1bGVzXG4gICAgICBpZiBlZGl0b3JGaWxlLmluZGV4T2YocHJvamVjdFBhdGgpID09IDBcbiAgICAgICAgcHJvamVjdFJ1bGVzID0gQHByb2plY3RSdWxlc1twcm9qZWN0UGF0aF1cbiAgICAgICAgZm9yIHJ1bGUgaW4gcHJvamVjdFJ1bGVzXG4gICAgICAgICAgdXBkYXRlUnVsZXMocnVsZSlcblxuICAgIGZvciByb3cgaW4gWzAuLmVkaXRvci5nZXRMaW5lQ291bnQoKSBdXG4gICAgICBsaW5lVGV4dCA9IGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhyb3cpXG4gICAgICBsaW5lVGV4dCA9IGxpbmVUZXh0LnRyaW0oKSBpZiBsaW5lVGV4dFxuICAgICAgY29udGludWUgaWYgIWxpbmVUZXh0XG4gICAgICBpZiBsaW5lVGV4dC5pbmRleE9mKCcjJyArICdtYXJrZXItcnVsZTonKSA+PSAwXG4gICAgICAgIG5ld1J1bGUgPSBAcGFyc2VSdWxlKGxpbmVUZXh0KVxuICAgICAgICBpZiBuZXdSdWxlXG4gICAgICAgICAgdXBkYXRlUnVsZXMobmV3UnVsZSlcbiAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAjIFRyYWNrIGluZGVudCBsZXZlbFxuICAgICAgaW5kZW50ID0gbGluZVRleHQubWF0Y2goaW5kZW50U3BhY2VSZSlbMF0ubGVuZ3RoXG4gICAgICB3aGlsZSBpbmRlbnQgPCBwcmV2SW5kZW50XG4gICAgICAgIHByZXZJbmRlbnQgPSBtYXJrZXJJbmRlbnRzLnBvcCgpXG5cbiAgICAgIGZvciBydWxlIGluIGFjdGl2ZVJ1bGVzXG4gICAgICAgIGlmIHJ1bGUubXVsdGlsaW5lID09IHRydWUgJiYgcm93IDwgZWRpdG9yLmdldExpbmVDb3VudCgpXG4gICAgICAgICAgbmV4dExpbmVUZXh0ID0gZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KHJvdyArIDEpIFxuICAgICAgICAgIGxpbmVUZXh0ID0gbGluZVRleHQgKyAnXFxuJyArIG5leHRMaW5lVGV4dFxuICAgICAgICAgIG1hdGNoID0gbGluZVRleHQubWF0Y2gocnVsZS5yZSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG1hdGNoID0gbGluZVRleHQubWF0Y2gocnVsZS5yZSlcbiAgICAgICAgaWYgbWF0Y2hcbiAgICAgICAgICBwYXJlbnRJbmRlbnQgPSAtMVxuICAgICAgICAgIG1hcmtlckluZGVudHMucHVzaChpbmRlbnQpIGlmIGluZGVudCA+IHByZXZJbmRlbnRcbiAgICAgICAgICBpZiBtYXJrZXJJbmRlbnRzLmxlbmd0aCA+IDFcbiAgICAgICAgICAgIHBhcmVudEluZGVudCA9IG1hcmtlckluZGVudHNbbWFya2VySW5kZW50cy5sZW5ndGgtMl1cbiAgICAgICAgICBpdGVtcy5wdXNoIEBtYWtlSXRlbShydWxlLCBtYXRjaCwgbGluZVRleHQsIHJvdywgaW5kZW50LCBwYXJlbnRJbmRlbnQpXG4gICAgcmV0dXJuIGl0ZW1zXG5cblxuICBtYWtlSXRlbTogKHJ1bGUsIG1hdGNoLCB0ZXh0LCByb3csIGluZGVudCwgcGFyZW50SW5kZW50KSAtPlxuICAgIGxhYmVsID0gcnVsZS5pZCB8fCAnJ1xuICAgIHRvb2x0aXAgPSBydWxlLnRvb2x0aXAgfHwgJydcbiAgICBpY29uID0gcnVsZS5pY29uICN8fCAncHJpbWl0aXZlLWRvdCdcbiAgICBpZiBsYWJlbCBvciB0b29sdGlwXG4gICAgICBmb3Igc3RyLCBpIGluIG1hdGNoXG4gICAgICAgIGlmIGxhYmVsXG4gICAgICAgICAgbGFiZWwgPSBsYWJlbC5yZXBsYWNlKHBvc2l0aW9uUmVbaV0sIG1hdGNoW2ldKVxuICAgICAgICBpZiB0b29sdGlwXG4gICAgICAgICAgdG9vbHRpcCA9IHRvb2x0aXAucmVwbGFjZShwb3NpdGlvblJlW2ldLCBtYXRjaFtpXSlcbiAgICBpZiAhIGxhYmVsXG4gICAgICBsYWJlbCA9IG1hdGNoWzFdIHx8IG1hdGNoWzBdXG5cbiAgICBraW5kID0gcnVsZS5raW5kIHx8ICdNYXJrZXJzJ1xuXG4gICAgaWYgcnVsZS5hcmdzXG4gICAgICBhcmdzTWF0Y2ggPSBhcmdzUmVbcnVsZS5hcmdzXS5leGVjKHRleHQpXG4gICAgICB0b29sdGlwICs9IGFyZ3NNYXRjaFsxXSBpZiBhcmdzTWF0Y2hcblxuICAgIGl0ZW0gPSB7bGFiZWw6IGxhYmVsLCBpY29uOiBpY29uLCBraW5kOiBraW5kLCByb3c6IHJvd1xuICAgICAgLCB0b29sdGlwOiB0b29sdGlwLCBpbmRlbnQ6IGluZGVudCwgcGFyZW50SW5kZW50OiBwYXJlbnRJbmRlbnR9XG5cblxuICAjIHBhcnNlUnVsZSA6IHRvIGRlY2lwaGVyIHJ1bGVzIGluIC5uYXYtbWFya2VyLXJ1bGVzIGZpbGUgb3Igd2l0aGluIHNvdXJjZVxuICBwYXJzZVJ1bGU6IChsaW5lKSAtPlxuICAgICMgU2hvdWxkIGJlOiAnI21hcmtlci1ydWxlJyBmb2xsb3dlZCBieSBjb2xvbiwgdGhlbiBieSByZWd1bGFyIGV4cHJlc3Npb25cbiAgICAjIGZvbGxvd2VkIGJ5IG9wdGlvbmFsIGZpZWxkcyBzZXBhcmF0ZWQgYnkgfHxcbiAgICAjIG9wdGlvbmFsIGZpZWxkcyBhcmVcbiAgICAjIGlkZW50aWZpZXIgKGxhYmVsKSB3aGljaCBtdXN0IGhhdmUgb25lIG9mICUxIHRocm91Z2ggJTkgaWYgcHJlc2VudFxuICAgICMga2luZCA6IGUuZy4gRnVuY3Rpb24uIERlZmF1bHQgaXMgJ01hcmtlcnMnXG4gICAgIyBzdGFydE92ZXIgOiBUaGUgbGl0ZXJhbCB0ZXh0ICdzdGFydE92ZXInLiBEaXNjYXJkcyBhbnkgcHJldmlvdXMgcnVsZXNcbiAgICAjIGRpc2FibGU9a2luZDEsa2luZDIgOiBEaXNhYmxlIHNwZWNpZmllZCBraW5kc1xuICAgICMgZXh0PS5jb2ZmZWUsLmpzXG4gICAgcmV0dXJuIHVubGVzcyBsaW5lXG4gICAgcnVsZVN0ciA9IGxpbmUuc3BsaXQoJyMnICsgJ21hcmtlci1ydWxlOicpWzFdLnRyaW0oKVxuICAgIHJldHVybiB1bmxlc3MgcnVsZVN0clxuICAgIHBhcnRzID0gcnVsZVN0ci5zcGxpdCgnfHwnKVxuICAgIHJlRmllbGRzID0gcGFydHNbMF0ubWF0Y2goL1sgXFx0XSpcXC8oLispXFwvKC4qKS8pXG4gICAgaWYgIXJlRmllbGRzICYmIHJ1bGVTdHIuc2VhcmNoKC8oXnxcXHxcXHwpKHN0YXJ0T3ZlcnxkaXNhYmxlPSkvKSA9PSAtMVxuICAgICAgY29uc29sZS5sb2cgJ05hdmlnYXRvciBQYW5lbDogTm8gcmVndWxhciBleHByZXNzaW9uIGZvdW5kIGluIDonLCBsaW5lXG4gICAgICByZXR1cm5cbiAgICBydWxlID0ge31cbiAgICBpZiByZUZpZWxkc1xuICAgICAgcmVTdHIgPSByZUZpZWxkc1sxXSAjLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJylcbiAgICAgIGZsYWcgPSAnaScgaWYgcmVGaWVsZHNbMl1cbiAgICAgIHJ1bGUgPSB7cmU6IG5ldyBSZWdFeHAocmVTdHIsIGZsYWcpfVxuICAgICAgaWYgL1xcXFxuLy50ZXN0KHJlRmllbGRzWzFdKVxuICAgICAgICBydWxlLm11bHRpbGluZSA9IHRydWVcbiAgICAgIHBhcnRzLnNoaWZ0KClcblxuICAgIGZvciBwYXJ0IGluIHBhcnRzXG4gICAgICBpZiBwYXJ0LmluZGV4T2YoJyUnKSAgIT0gLTFcbiAgICAgICAgcnVsZS5pZCA9IHBhcnRcbiAgICAgIGVsc2UgaWYgcGFydC5pbmRleE9mKCdzdGFydE92ZXInKSA9PSAwXG4gICAgICAgIHJ1bGUuc3RhcnRPdmVyID0gdHJ1ZVxuICAgICAgZWxzZSBpZiBwYXJ0LmluZGV4T2YoJ2Rpc2FibGU9JykgPT0gMFxuICAgICAgICBydWxlLmRpc2FibGVHcm91cHMgPSBwYXJ0LnN1YnN0cignZGlzYWJsZT0nLmxlbmd0aCkuc3BsaXQoJywnKVxuICAgICAgZWxzZSBpZiBwYXJ0LmluZGV4T2YoJ2V4dD0nKSA9PSAwXG4gICAgICAgIHJ1bGUuZXh0ID0gcGFydC5zdWJzdHIoJ2V4dD0nLmxlbmd0aCkuc3BsaXQoJywnKVxuICAgICAgZWxzZVxuICAgICAgICBydWxlLmtpbmQgPSBwYXJ0XG4gICAgcmV0dXJuIHJ1bGVcblxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQHBhdGhPYnNlcnZlci5kaXNwb3NlKCkgaWYgcGF0aE9ic2VydmVyP1xuIl19
