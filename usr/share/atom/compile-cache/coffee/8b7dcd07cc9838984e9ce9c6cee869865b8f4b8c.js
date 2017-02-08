(function() {
  module.exports = {
    statusBar: null,
    activate: function() {},
    deactivate: function() {
      var _ref;
      if ((_ref = this.statusBarTile) != null) {
        _ref.destroy();
      }
      return this.statusBarTile = null;
    },
    provideRunInTerminal: function() {
      return {
        run: (function(_this) {
          return function(command) {
            return _this.statusBarTile.runCommandInNewTerminal(command);
          };
        })(this),
        getTerminalViews: (function(_this) {
          return function() {
            return _this.statusBarTile.terminalViews;
          };
        })(this)
      };
    },
    consumeStatusBar: function(statusBarProvider) {
      return this.statusBarTile = new (require('./status-bar'))(statusBarProvider);
    },
    config: {
      toggles: {
        type: 'object',
        order: 1,
        properties: {
          autoClose: {
            title: 'Close Terminal on Exit',
            description: 'Should the terminal close if the shell exits?',
            type: 'boolean',
            "default": false
          },
          cursorBlink: {
            title: 'Cursor Blink',
            description: 'Should the cursor blink when the terminal is active?',
            type: 'boolean',
            "default": true
          },
          runInsertedText: {
            title: 'Run Inserted Text',
            description: 'Run text inserted via `platformio-ide-terminal:insert-text` as a command? **This will append an end-of-line character to input.**',
            type: 'boolean',
            "default": true
          }
        }
      },
      core: {
        type: 'object',
        order: 2,
        properties: {
          autoRunCommand: {
            title: 'Auto Run Command',
            description: 'Command to run on terminal initialization.',
            type: 'string',
            "default": ''
          },
          mapTerminalsTo: {
            title: 'Map Terminals To',
            description: 'Map terminals to each file or folder. Default is no action or mapping at all. **Restart required.**',
            type: 'string',
            "default": 'None',
            "enum": ['None', 'File', 'Folder']
          },
          mapTerminalsToAutoOpen: {
            title: 'Auto Open a New Terminal (For Terminal Mapping)',
            description: 'Should a new terminal be opened for new items? **Note:** This works in conjunction with `Map Terminals To` above.',
            type: 'boolean',
            "default": false
          },
          scrollback: {
            title: 'Scroll Back',
            description: 'How many lines of history should be kept?',
            type: 'integer',
            "default": 1000
          },
          shell: {
            title: 'Shell Override',
            description: 'Override the default shell instance to launch.',
            type: 'string',
            "default": (function() {
              var path;
              if (process.platform === 'win32') {
                path = require('path');
                return path.resolve(process.env.SystemRoot, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe');
              } else {
                return process.env.SHELL;
              }
            })()
          },
          shellArguments: {
            title: 'Shell Arguments',
            description: 'Specify some arguments to use when launching the shell.',
            type: 'string',
            "default": ''
          },
          workingDirectory: {
            title: 'Working Directory',
            description: 'Which directory should be the present working directory when a new terminal is made?',
            type: 'string',
            "default": 'Project',
            "enum": ['Home', 'Project', 'Active File']
          }
        }
      },
      style: {
        type: 'object',
        order: 3,
        properties: {
          animationSpeed: {
            title: 'Animation Speed',
            description: 'How fast should the window animate?',
            type: 'number',
            "default": '1',
            minimum: '0',
            maximum: '100'
          },
          fontFamily: {
            title: 'Font Family',
            description: 'Override the terminal\'s default font family. **You must use a [monospaced font](https://en.wikipedia.org/wiki/List_of_typefaces#Monospace)!**',
            type: 'string',
            "default": ''
          },
          fontSize: {
            title: 'Font Size',
            description: 'Override the terminal\'s default font size.',
            type: 'string',
            "default": ''
          },
          defaultPanelHeight: {
            title: 'Default Panel Height',
            description: 'Default height of a terminal panel. **You may enter a value in px, em, or %.**',
            type: 'string',
            "default": '300px'
          },
          theme: {
            title: 'Theme',
            description: 'Select a theme for the terminal.',
            type: 'string',
            "default": 'standard',
            "enum": ['standard', 'inverse', 'linux', 'grass', 'homebrew', 'man-page', 'novel', 'ocean', 'pro', 'red', 'red-sands', 'silver-aerogel', 'solid-colors', 'dracula']
          }
        }
      },
      ansiColors: {
        type: 'object',
        order: 4,
        properties: {
          normal: {
            type: 'object',
            order: 1,
            properties: {
              black: {
                title: 'Black',
                description: 'Black color used for terminal ANSI color set.',
                type: 'color',
                "default": '#000000'
              },
              red: {
                title: 'Red',
                description: 'Red color used for terminal ANSI color set.',
                type: 'color',
                "default": '#CD0000'
              },
              green: {
                title: 'Green',
                description: 'Green color used for terminal ANSI color set.',
                type: 'color',
                "default": '#00CD00'
              },
              yellow: {
                title: 'Yellow',
                description: 'Yellow color used for terminal ANSI color set.',
                type: 'color',
                "default": '#CDCD00'
              },
              blue: {
                title: 'Blue',
                description: 'Blue color used for terminal ANSI color set.',
                type: 'color',
                "default": '#0000CD'
              },
              magenta: {
                title: 'Magenta',
                description: 'Magenta color used for terminal ANSI color set.',
                type: 'color',
                "default": '#CD00CD'
              },
              cyan: {
                title: 'Cyan',
                description: 'Cyan color used for terminal ANSI color set.',
                type: 'color',
                "default": '#00CDCD'
              },
              white: {
                title: 'White',
                description: 'White color used for terminal ANSI color set.',
                type: 'color',
                "default": '#E5E5E5'
              }
            }
          },
          zBright: {
            type: 'object',
            order: 2,
            properties: {
              brightBlack: {
                title: 'Bright Black',
                description: 'Bright black color used for terminal ANSI color set.',
                type: 'color',
                "default": '#7F7F7F'
              },
              brightRed: {
                title: 'Bright Red',
                description: 'Bright red color used for terminal ANSI color set.',
                type: 'color',
                "default": '#FF0000'
              },
              brightGreen: {
                title: 'Bright Green',
                description: 'Bright green color used for terminal ANSI color set.',
                type: 'color',
                "default": '#00FF00'
              },
              brightYellow: {
                title: 'Bright Yellow',
                description: 'Bright yellow color used for terminal ANSI color set.',
                type: 'color',
                "default": '#FFFF00'
              },
              brightBlue: {
                title: 'Bright Blue',
                description: 'Bright blue color used for terminal ANSI color set.',
                type: 'color',
                "default": '#0000FF'
              },
              brightMagenta: {
                title: 'Bright Magenta',
                description: 'Bright magenta color used for terminal ANSI color set.',
                type: 'color',
                "default": '#FF00FF'
              },
              brightCyan: {
                title: 'Bright Cyan',
                description: 'Bright cyan color used for terminal ANSI color set.',
                type: 'color',
                "default": '#00FFFF'
              },
              brightWhite: {
                title: 'Bright White',
                description: 'Bright white color used for terminal ANSI color set.',
                type: 'color',
                "default": '#FFFFFF'
              }
            }
          }
        }
      },
      iconColors: {
        type: 'object',
        order: 5,
        properties: {
          red: {
            title: 'Status Icon Red',
            description: 'Red color used for status icon.',
            type: 'color',
            "default": 'red'
          },
          orange: {
            title: 'Status Icon Orange',
            description: 'Orange color used for status icon.',
            type: 'color',
            "default": 'orange'
          },
          yellow: {
            title: 'Status Icon Yellow',
            description: 'Yellow color used for status icon.',
            type: 'color',
            "default": 'yellow'
          },
          green: {
            title: 'Status Icon Green',
            description: 'Green color used for status icon.',
            type: 'color',
            "default": 'green'
          },
          blue: {
            title: 'Status Icon Blue',
            description: 'Blue color used for status icon.',
            type: 'color',
            "default": 'blue'
          },
          purple: {
            title: 'Status Icon Purple',
            description: 'Purple color used for status icon.',
            type: 'color',
            "default": 'purple'
          },
          pink: {
            title: 'Status Icon Pink',
            description: 'Pink color used for status icon.',
            type: 'color',
            "default": 'hotpink'
          },
          cyan: {
            title: 'Status Icon Cyan',
            description: 'Cyan color used for status icon.',
            type: 'color',
            "default": 'cyan'
          },
          magenta: {
            title: 'Status Icon Magenta',
            description: 'Magenta color used for status icon.',
            type: 'color',
            "default": 'magenta'
          }
        }
      },
      customTexts: {
        type: 'object',
        order: 6,
        properties: {
          customText1: {
            title: 'Custom text 1',
            description: 'Text to paste when calling platformio-ide-terminal:insert-custom-text-1',
            type: 'string',
            "default": ''
          },
          customText2: {
            title: 'Custom text 2',
            description: 'Text to paste when calling platformio-ide-terminal:insert-custom-text-2',
            type: 'string',
            "default": ''
          },
          customText3: {
            title: 'Custom text 3',
            description: 'Text to paste when calling platformio-ide-terminal:insert-custom-text-3',
            type: 'string',
            "default": ''
          },
          customText4: {
            title: 'Custom text 4',
            description: 'Text to paste when calling platformio-ide-terminal:insert-custom-text-4',
            type: 'string',
            "default": ''
          },
          customText5: {
            title: 'Custom text 5',
            description: 'Text to paste when calling platformio-ide-terminal:insert-custom-text-5',
            type: 'string',
            "default": ''
          },
          customText6: {
            title: 'Custom text 6',
            description: 'Text to paste when calling platformio-ide-terminal:insert-custom-text-6',
            type: 'string',
            "default": ''
          },
          customText7: {
            title: 'Custom text 7',
            description: 'Text to paste when calling platformio-ide-terminal:insert-custom-text-7',
            type: 'string',
            "default": ''
          },
          customText8: {
            title: 'Custom text 8',
            description: 'Text to paste when calling platformio-ide-terminal:insert-custom-text-8',
            type: 'string',
            "default": ''
          }
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9wbGF0Zm9ybWlvLWlkZS10ZXJtaW5hbC9saWIvcGxhdGZvcm1pby1pZGUtdGVybWluYWwuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFNBQUEsRUFBVyxJQUFYO0FBQUEsSUFFQSxRQUFBLEVBQVUsU0FBQSxHQUFBLENBRlY7QUFBQSxJQUlBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixVQUFBLElBQUE7O1lBQWMsQ0FBRSxPQUFoQixDQUFBO09BQUE7YUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQixLQUZQO0lBQUEsQ0FKWjtBQUFBLElBUUEsb0JBQUEsRUFBc0IsU0FBQSxHQUFBO2FBQ3BCO0FBQUEsUUFBQSxHQUFBLEVBQUssQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLE9BQUQsR0FBQTttQkFDSCxLQUFDLENBQUEsYUFBYSxDQUFDLHVCQUFmLENBQXVDLE9BQXZDLEVBREc7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFMO0FBQUEsUUFFQSxnQkFBQSxFQUFrQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFDaEIsS0FBQyxDQUFBLGFBQWEsQ0FBQyxjQURDO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FGbEI7UUFEb0I7SUFBQSxDQVJ0QjtBQUFBLElBY0EsZ0JBQUEsRUFBa0IsU0FBQyxpQkFBRCxHQUFBO2FBQ2hCLElBQUMsQ0FBQSxhQUFELEdBQXFCLElBQUEsQ0FBQyxPQUFBLENBQVEsY0FBUixDQUFELENBQUEsQ0FBeUIsaUJBQXpCLEVBREw7SUFBQSxDQWRsQjtBQUFBLElBaUJBLE1BQUEsRUFDRTtBQUFBLE1BQUEsT0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsS0FBQSxFQUFPLENBRFA7QUFBQSxRQUVBLFVBQUEsRUFDRTtBQUFBLFVBQUEsU0FBQSxFQUNFO0FBQUEsWUFBQSxLQUFBLEVBQU8sd0JBQVA7QUFBQSxZQUNBLFdBQUEsRUFBYSwrQ0FEYjtBQUFBLFlBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxZQUdBLFNBQUEsRUFBUyxLQUhUO1dBREY7QUFBQSxVQUtBLFdBQUEsRUFDRTtBQUFBLFlBQUEsS0FBQSxFQUFPLGNBQVA7QUFBQSxZQUNBLFdBQUEsRUFBYSxzREFEYjtBQUFBLFlBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxZQUdBLFNBQUEsRUFBUyxJQUhUO1dBTkY7QUFBQSxVQVVBLGVBQUEsRUFDRTtBQUFBLFlBQUEsS0FBQSxFQUFPLG1CQUFQO0FBQUEsWUFDQSxXQUFBLEVBQWEsbUlBRGI7QUFBQSxZQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsWUFHQSxTQUFBLEVBQVMsSUFIVDtXQVhGO1NBSEY7T0FERjtBQUFBLE1BbUJBLElBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLEtBQUEsRUFBTyxDQURQO0FBQUEsUUFFQSxVQUFBLEVBQ0U7QUFBQSxVQUFBLGNBQUEsRUFDRTtBQUFBLFlBQUEsS0FBQSxFQUFPLGtCQUFQO0FBQUEsWUFDQSxXQUFBLEVBQWEsNENBRGI7QUFBQSxZQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsWUFHQSxTQUFBLEVBQVMsRUFIVDtXQURGO0FBQUEsVUFLQSxjQUFBLEVBQ0U7QUFBQSxZQUFBLEtBQUEsRUFBTyxrQkFBUDtBQUFBLFlBQ0EsV0FBQSxFQUFhLHFHQURiO0FBQUEsWUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFlBR0EsU0FBQSxFQUFTLE1BSFQ7QUFBQSxZQUlBLE1BQUEsRUFBTSxDQUFDLE1BQUQsRUFBUyxNQUFULEVBQWlCLFFBQWpCLENBSk47V0FORjtBQUFBLFVBV0Esc0JBQUEsRUFDRTtBQUFBLFlBQUEsS0FBQSxFQUFPLGlEQUFQO0FBQUEsWUFDQSxXQUFBLEVBQWEsbUhBRGI7QUFBQSxZQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsWUFHQSxTQUFBLEVBQVMsS0FIVDtXQVpGO0FBQUEsVUFnQkEsVUFBQSxFQUNFO0FBQUEsWUFBQSxLQUFBLEVBQU8sYUFBUDtBQUFBLFlBQ0EsV0FBQSxFQUFhLDJDQURiO0FBQUEsWUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFlBR0EsU0FBQSxFQUFTLElBSFQ7V0FqQkY7QUFBQSxVQXFCQSxLQUFBLEVBQ0U7QUFBQSxZQUFBLEtBQUEsRUFBTyxnQkFBUDtBQUFBLFlBQ0EsV0FBQSxFQUFhLGdEQURiO0FBQUEsWUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFlBR0EsU0FBQSxFQUFZLENBQUEsU0FBQSxHQUFBO0FBQ1Ysa0JBQUEsSUFBQTtBQUFBLGNBQUEsSUFBRyxPQUFPLENBQUMsUUFBUixLQUFvQixPQUF2QjtBQUNFLGdCQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7dUJBQ0EsSUFBSSxDQUFDLE9BQUwsQ0FBYSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQXpCLEVBQXFDLFVBQXJDLEVBQWlELG1CQUFqRCxFQUFzRSxNQUF0RSxFQUE4RSxnQkFBOUUsRUFGRjtlQUFBLE1BQUE7dUJBSUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUpkO2VBRFU7WUFBQSxDQUFBLENBQUgsQ0FBQSxDQUhUO1dBdEJGO0FBQUEsVUErQkEsY0FBQSxFQUNFO0FBQUEsWUFBQSxLQUFBLEVBQU8saUJBQVA7QUFBQSxZQUNBLFdBQUEsRUFBYSx5REFEYjtBQUFBLFlBRUEsSUFBQSxFQUFNLFFBRk47QUFBQSxZQUdBLFNBQUEsRUFBUyxFQUhUO1dBaENGO0FBQUEsVUFvQ0EsZ0JBQUEsRUFDRTtBQUFBLFlBQUEsS0FBQSxFQUFPLG1CQUFQO0FBQUEsWUFDQSxXQUFBLEVBQWEsc0ZBRGI7QUFBQSxZQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsWUFHQSxTQUFBLEVBQVMsU0FIVDtBQUFBLFlBSUEsTUFBQSxFQUFNLENBQUMsTUFBRCxFQUFTLFNBQVQsRUFBb0IsYUFBcEIsQ0FKTjtXQXJDRjtTQUhGO09BcEJGO0FBQUEsTUFpRUEsS0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsS0FBQSxFQUFPLENBRFA7QUFBQSxRQUVBLFVBQUEsRUFDRTtBQUFBLFVBQUEsY0FBQSxFQUNFO0FBQUEsWUFBQSxLQUFBLEVBQU8saUJBQVA7QUFBQSxZQUNBLFdBQUEsRUFBYSxxQ0FEYjtBQUFBLFlBRUEsSUFBQSxFQUFNLFFBRk47QUFBQSxZQUdBLFNBQUEsRUFBUyxHQUhUO0FBQUEsWUFJQSxPQUFBLEVBQVMsR0FKVDtBQUFBLFlBS0EsT0FBQSxFQUFTLEtBTFQ7V0FERjtBQUFBLFVBT0EsVUFBQSxFQUNFO0FBQUEsWUFBQSxLQUFBLEVBQU8sYUFBUDtBQUFBLFlBQ0EsV0FBQSxFQUFhLGdKQURiO0FBQUEsWUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFlBR0EsU0FBQSxFQUFTLEVBSFQ7V0FSRjtBQUFBLFVBWUEsUUFBQSxFQUNFO0FBQUEsWUFBQSxLQUFBLEVBQU8sV0FBUDtBQUFBLFlBQ0EsV0FBQSxFQUFhLDZDQURiO0FBQUEsWUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFlBR0EsU0FBQSxFQUFTLEVBSFQ7V0FiRjtBQUFBLFVBaUJBLGtCQUFBLEVBQ0U7QUFBQSxZQUFBLEtBQUEsRUFBTyxzQkFBUDtBQUFBLFlBQ0EsV0FBQSxFQUFhLGdGQURiO0FBQUEsWUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFlBR0EsU0FBQSxFQUFTLE9BSFQ7V0FsQkY7QUFBQSxVQXNCQSxLQUFBLEVBQ0U7QUFBQSxZQUFBLEtBQUEsRUFBTyxPQUFQO0FBQUEsWUFDQSxXQUFBLEVBQWEsa0NBRGI7QUFBQSxZQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsWUFHQSxTQUFBLEVBQVMsVUFIVDtBQUFBLFlBSUEsTUFBQSxFQUFNLENBQ0osVUFESSxFQUVKLFNBRkksRUFHSixPQUhJLEVBSUosT0FKSSxFQUtKLFVBTEksRUFNSixVQU5JLEVBT0osT0FQSSxFQVFKLE9BUkksRUFTSixLQVRJLEVBVUosS0FWSSxFQVdKLFdBWEksRUFZSixnQkFaSSxFQWFKLGNBYkksRUFjSixTQWRJLENBSk47V0F2QkY7U0FIRjtPQWxFRjtBQUFBLE1BZ0hBLFVBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLEtBQUEsRUFBTyxDQURQO0FBQUEsUUFFQSxVQUFBLEVBQ0U7QUFBQSxVQUFBLE1BQUEsRUFDRTtBQUFBLFlBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxZQUNBLEtBQUEsRUFBTyxDQURQO0FBQUEsWUFFQSxVQUFBLEVBQ0U7QUFBQSxjQUFBLEtBQUEsRUFDRTtBQUFBLGdCQUFBLEtBQUEsRUFBTyxPQUFQO0FBQUEsZ0JBQ0EsV0FBQSxFQUFhLCtDQURiO0FBQUEsZ0JBRUEsSUFBQSxFQUFNLE9BRk47QUFBQSxnQkFHQSxTQUFBLEVBQVMsU0FIVDtlQURGO0FBQUEsY0FLQSxHQUFBLEVBQ0U7QUFBQSxnQkFBQSxLQUFBLEVBQU8sS0FBUDtBQUFBLGdCQUNBLFdBQUEsRUFBYSw2Q0FEYjtBQUFBLGdCQUVBLElBQUEsRUFBTSxPQUZOO0FBQUEsZ0JBR0EsU0FBQSxFQUFTLFNBSFQ7ZUFORjtBQUFBLGNBVUEsS0FBQSxFQUNFO0FBQUEsZ0JBQUEsS0FBQSxFQUFPLE9BQVA7QUFBQSxnQkFDQSxXQUFBLEVBQWEsK0NBRGI7QUFBQSxnQkFFQSxJQUFBLEVBQU0sT0FGTjtBQUFBLGdCQUdBLFNBQUEsRUFBUyxTQUhUO2VBWEY7QUFBQSxjQWVBLE1BQUEsRUFDRTtBQUFBLGdCQUFBLEtBQUEsRUFBTyxRQUFQO0FBQUEsZ0JBQ0EsV0FBQSxFQUFhLGdEQURiO0FBQUEsZ0JBRUEsSUFBQSxFQUFNLE9BRk47QUFBQSxnQkFHQSxTQUFBLEVBQVMsU0FIVDtlQWhCRjtBQUFBLGNBb0JBLElBQUEsRUFDRTtBQUFBLGdCQUFBLEtBQUEsRUFBTyxNQUFQO0FBQUEsZ0JBQ0EsV0FBQSxFQUFhLDhDQURiO0FBQUEsZ0JBRUEsSUFBQSxFQUFNLE9BRk47QUFBQSxnQkFHQSxTQUFBLEVBQVMsU0FIVDtlQXJCRjtBQUFBLGNBeUJBLE9BQUEsRUFDRTtBQUFBLGdCQUFBLEtBQUEsRUFBTyxTQUFQO0FBQUEsZ0JBQ0EsV0FBQSxFQUFhLGlEQURiO0FBQUEsZ0JBRUEsSUFBQSxFQUFNLE9BRk47QUFBQSxnQkFHQSxTQUFBLEVBQVMsU0FIVDtlQTFCRjtBQUFBLGNBOEJBLElBQUEsRUFDRTtBQUFBLGdCQUFBLEtBQUEsRUFBTyxNQUFQO0FBQUEsZ0JBQ0EsV0FBQSxFQUFhLDhDQURiO0FBQUEsZ0JBRUEsSUFBQSxFQUFNLE9BRk47QUFBQSxnQkFHQSxTQUFBLEVBQVMsU0FIVDtlQS9CRjtBQUFBLGNBbUNBLEtBQUEsRUFDRTtBQUFBLGdCQUFBLEtBQUEsRUFBTyxPQUFQO0FBQUEsZ0JBQ0EsV0FBQSxFQUFhLCtDQURiO0FBQUEsZ0JBRUEsSUFBQSxFQUFNLE9BRk47QUFBQSxnQkFHQSxTQUFBLEVBQVMsU0FIVDtlQXBDRjthQUhGO1dBREY7QUFBQSxVQTRDQSxPQUFBLEVBQ0U7QUFBQSxZQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsWUFDQSxLQUFBLEVBQU8sQ0FEUDtBQUFBLFlBRUEsVUFBQSxFQUNFO0FBQUEsY0FBQSxXQUFBLEVBQ0U7QUFBQSxnQkFBQSxLQUFBLEVBQU8sY0FBUDtBQUFBLGdCQUNBLFdBQUEsRUFBYSxzREFEYjtBQUFBLGdCQUVBLElBQUEsRUFBTSxPQUZOO0FBQUEsZ0JBR0EsU0FBQSxFQUFTLFNBSFQ7ZUFERjtBQUFBLGNBS0EsU0FBQSxFQUNFO0FBQUEsZ0JBQUEsS0FBQSxFQUFPLFlBQVA7QUFBQSxnQkFDQSxXQUFBLEVBQWEsb0RBRGI7QUFBQSxnQkFFQSxJQUFBLEVBQU0sT0FGTjtBQUFBLGdCQUdBLFNBQUEsRUFBUyxTQUhUO2VBTkY7QUFBQSxjQVVBLFdBQUEsRUFDRTtBQUFBLGdCQUFBLEtBQUEsRUFBTyxjQUFQO0FBQUEsZ0JBQ0EsV0FBQSxFQUFhLHNEQURiO0FBQUEsZ0JBRUEsSUFBQSxFQUFNLE9BRk47QUFBQSxnQkFHQSxTQUFBLEVBQVMsU0FIVDtlQVhGO0FBQUEsY0FlQSxZQUFBLEVBQ0U7QUFBQSxnQkFBQSxLQUFBLEVBQU8sZUFBUDtBQUFBLGdCQUNBLFdBQUEsRUFBYSx1REFEYjtBQUFBLGdCQUVBLElBQUEsRUFBTSxPQUZOO0FBQUEsZ0JBR0EsU0FBQSxFQUFTLFNBSFQ7ZUFoQkY7QUFBQSxjQW9CQSxVQUFBLEVBQ0U7QUFBQSxnQkFBQSxLQUFBLEVBQU8sYUFBUDtBQUFBLGdCQUNBLFdBQUEsRUFBYSxxREFEYjtBQUFBLGdCQUVBLElBQUEsRUFBTSxPQUZOO0FBQUEsZ0JBR0EsU0FBQSxFQUFTLFNBSFQ7ZUFyQkY7QUFBQSxjQXlCQSxhQUFBLEVBQ0U7QUFBQSxnQkFBQSxLQUFBLEVBQU8sZ0JBQVA7QUFBQSxnQkFDQSxXQUFBLEVBQWEsd0RBRGI7QUFBQSxnQkFFQSxJQUFBLEVBQU0sT0FGTjtBQUFBLGdCQUdBLFNBQUEsRUFBUyxTQUhUO2VBMUJGO0FBQUEsY0E4QkEsVUFBQSxFQUNFO0FBQUEsZ0JBQUEsS0FBQSxFQUFPLGFBQVA7QUFBQSxnQkFDQSxXQUFBLEVBQWEscURBRGI7QUFBQSxnQkFFQSxJQUFBLEVBQU0sT0FGTjtBQUFBLGdCQUdBLFNBQUEsRUFBUyxTQUhUO2VBL0JGO0FBQUEsY0FtQ0EsV0FBQSxFQUNFO0FBQUEsZ0JBQUEsS0FBQSxFQUFPLGNBQVA7QUFBQSxnQkFDQSxXQUFBLEVBQWEsc0RBRGI7QUFBQSxnQkFFQSxJQUFBLEVBQU0sT0FGTjtBQUFBLGdCQUdBLFNBQUEsRUFBUyxTQUhUO2VBcENGO2FBSEY7V0E3Q0Y7U0FIRjtPQWpIRjtBQUFBLE1BNE1BLFVBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLEtBQUEsRUFBTyxDQURQO0FBQUEsUUFFQSxVQUFBLEVBQ0U7QUFBQSxVQUFBLEdBQUEsRUFDRTtBQUFBLFlBQUEsS0FBQSxFQUFPLGlCQUFQO0FBQUEsWUFDQSxXQUFBLEVBQWEsaUNBRGI7QUFBQSxZQUVBLElBQUEsRUFBTSxPQUZOO0FBQUEsWUFHQSxTQUFBLEVBQVMsS0FIVDtXQURGO0FBQUEsVUFLQSxNQUFBLEVBQ0U7QUFBQSxZQUFBLEtBQUEsRUFBTyxvQkFBUDtBQUFBLFlBQ0EsV0FBQSxFQUFhLG9DQURiO0FBQUEsWUFFQSxJQUFBLEVBQU0sT0FGTjtBQUFBLFlBR0EsU0FBQSxFQUFTLFFBSFQ7V0FORjtBQUFBLFVBVUEsTUFBQSxFQUNFO0FBQUEsWUFBQSxLQUFBLEVBQU8sb0JBQVA7QUFBQSxZQUNBLFdBQUEsRUFBYSxvQ0FEYjtBQUFBLFlBRUEsSUFBQSxFQUFNLE9BRk47QUFBQSxZQUdBLFNBQUEsRUFBUyxRQUhUO1dBWEY7QUFBQSxVQWVBLEtBQUEsRUFDRTtBQUFBLFlBQUEsS0FBQSxFQUFPLG1CQUFQO0FBQUEsWUFDQSxXQUFBLEVBQWEsbUNBRGI7QUFBQSxZQUVBLElBQUEsRUFBTSxPQUZOO0FBQUEsWUFHQSxTQUFBLEVBQVMsT0FIVDtXQWhCRjtBQUFBLFVBb0JBLElBQUEsRUFDRTtBQUFBLFlBQUEsS0FBQSxFQUFPLGtCQUFQO0FBQUEsWUFDQSxXQUFBLEVBQWEsa0NBRGI7QUFBQSxZQUVBLElBQUEsRUFBTSxPQUZOO0FBQUEsWUFHQSxTQUFBLEVBQVMsTUFIVDtXQXJCRjtBQUFBLFVBeUJBLE1BQUEsRUFDRTtBQUFBLFlBQUEsS0FBQSxFQUFPLG9CQUFQO0FBQUEsWUFDQSxXQUFBLEVBQWEsb0NBRGI7QUFBQSxZQUVBLElBQUEsRUFBTSxPQUZOO0FBQUEsWUFHQSxTQUFBLEVBQVMsUUFIVDtXQTFCRjtBQUFBLFVBOEJBLElBQUEsRUFDRTtBQUFBLFlBQUEsS0FBQSxFQUFPLGtCQUFQO0FBQUEsWUFDQSxXQUFBLEVBQWEsa0NBRGI7QUFBQSxZQUVBLElBQUEsRUFBTSxPQUZOO0FBQUEsWUFHQSxTQUFBLEVBQVMsU0FIVDtXQS9CRjtBQUFBLFVBbUNBLElBQUEsRUFDRTtBQUFBLFlBQUEsS0FBQSxFQUFPLGtCQUFQO0FBQUEsWUFDQSxXQUFBLEVBQWEsa0NBRGI7QUFBQSxZQUVBLElBQUEsRUFBTSxPQUZOO0FBQUEsWUFHQSxTQUFBLEVBQVMsTUFIVDtXQXBDRjtBQUFBLFVBd0NBLE9BQUEsRUFDRTtBQUFBLFlBQUEsS0FBQSxFQUFPLHFCQUFQO0FBQUEsWUFDQSxXQUFBLEVBQWEscUNBRGI7QUFBQSxZQUVBLElBQUEsRUFBTSxPQUZOO0FBQUEsWUFHQSxTQUFBLEVBQVMsU0FIVDtXQXpDRjtTQUhGO09BN01GO0FBQUEsTUE2UEEsV0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsS0FBQSxFQUFPLENBRFA7QUFBQSxRQUVBLFVBQUEsRUFDRTtBQUFBLFVBQUEsV0FBQSxFQUNFO0FBQUEsWUFBQSxLQUFBLEVBQU8sZUFBUDtBQUFBLFlBQ0EsV0FBQSxFQUFhLHlFQURiO0FBQUEsWUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFlBR0EsU0FBQSxFQUFTLEVBSFQ7V0FERjtBQUFBLFVBS0EsV0FBQSxFQUNFO0FBQUEsWUFBQSxLQUFBLEVBQU8sZUFBUDtBQUFBLFlBQ0EsV0FBQSxFQUFhLHlFQURiO0FBQUEsWUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFlBR0EsU0FBQSxFQUFTLEVBSFQ7V0FORjtBQUFBLFVBVUEsV0FBQSxFQUNFO0FBQUEsWUFBQSxLQUFBLEVBQU8sZUFBUDtBQUFBLFlBQ0EsV0FBQSxFQUFhLHlFQURiO0FBQUEsWUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFlBR0EsU0FBQSxFQUFTLEVBSFQ7V0FYRjtBQUFBLFVBZUEsV0FBQSxFQUNFO0FBQUEsWUFBQSxLQUFBLEVBQU8sZUFBUDtBQUFBLFlBQ0EsV0FBQSxFQUFhLHlFQURiO0FBQUEsWUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFlBR0EsU0FBQSxFQUFTLEVBSFQ7V0FoQkY7QUFBQSxVQW9CQSxXQUFBLEVBQ0U7QUFBQSxZQUFBLEtBQUEsRUFBTyxlQUFQO0FBQUEsWUFDQSxXQUFBLEVBQWEseUVBRGI7QUFBQSxZQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsWUFHQSxTQUFBLEVBQVMsRUFIVDtXQXJCRjtBQUFBLFVBeUJBLFdBQUEsRUFDRTtBQUFBLFlBQUEsS0FBQSxFQUFPLGVBQVA7QUFBQSxZQUNBLFdBQUEsRUFBYSx5RUFEYjtBQUFBLFlBRUEsSUFBQSxFQUFNLFFBRk47QUFBQSxZQUdBLFNBQUEsRUFBUyxFQUhUO1dBMUJGO0FBQUEsVUE4QkEsV0FBQSxFQUNFO0FBQUEsWUFBQSxLQUFBLEVBQU8sZUFBUDtBQUFBLFlBQ0EsV0FBQSxFQUFhLHlFQURiO0FBQUEsWUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFlBR0EsU0FBQSxFQUFTLEVBSFQ7V0EvQkY7QUFBQSxVQW1DQSxXQUFBLEVBQ0U7QUFBQSxZQUFBLEtBQUEsRUFBTyxlQUFQO0FBQUEsWUFDQSxXQUFBLEVBQWEseUVBRGI7QUFBQSxZQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsWUFHQSxTQUFBLEVBQVMsRUFIVDtXQXBDRjtTQUhGO09BOVBGO0tBbEJGO0dBREYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/kyan/.atom/packages/platformio-ide-terminal/lib/platformio-ide-terminal.coffee
