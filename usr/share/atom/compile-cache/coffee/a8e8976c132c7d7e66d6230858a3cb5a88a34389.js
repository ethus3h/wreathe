(function() {
  var langdef, langmap;

  langdef = {
    All: [
      {
        re: /#nav-mark:(.*)/i,
        id: '%1',
        kind: 'Markers'
      }, {
        re: /(#|\/\/)[ \t]*todos:(.*)/i,
        id: '%2',
        kind: 'Todo'
      }
    ],
    CoffeeScript: [
      {
        re: /^[ \t]*class[ \t]*([a-zA-Z$_\.0-9]+)(?:[ \t]|$)/,
        id: '%1',
        kind: 'Class'
      }, {
        re: /^[ \t]*(@?[a-zA-Z$_\.0-9]+)[ \t]*(?:=|\:)[ \t]*(\(.*\))?[ \t]*(?:-|=)>/,
        id: '%1',
        kind: 'Function'
      }, {
        re: /^[ \t]*([a-zA-Z$_0-9]+\:\:[a-zA-Z$_\.0-9]+)[ \t]*(=|\:)[ \t]*(\(.*\))?[ \t]*(-|=)>/,
        id: '%1',
        kind: 'Function'
      }, {
        re: /^[ \t]*(@?[a-zA-Z$_\.0-9]+)[ \t]*[:=][^>]*$/,
        id: '%1',
        kind: 'Variable'
      }
    ],
    Ruby: [
      {
        re: /^[\t ]*([A-Z][-_A-Za-z0-9]*::)*([A-Z][-_A-Za-z0-9]*)[\t ]*=/,
        id: '%2',
        kind: 'Constant'
      }, {
        re: /^[ \t]*([A-Z_][A-Z0-9_]*)[ \t]*=/,
        id: '%1',
        kind: 'Constant'
      }, {
        re: /^[ \t]*describe (.*) do/,
        id: '%1',
        kind: 'Rspec describe'
      }, {
        re: /^[ \t]*context ['"](.*)['"] do/,
        id: '%1',
        kind: 'Rspec context'
      }, {
        re: /^[ \t]*def[ \t]([_a-zA-Z]*)/i,
        id: '%1',
        kind: 'Functions'
      }
    ],
    php: [
      {
        re: /^[ \t]*const[ \t]*([a-zA-Z]+[^=]*=.*);/i,
        id: '%1',
        kind: 'Class'
      }, {
        re: /^[ \t]*((var|protected|private|public|static).*);/i,
        id: '%1',
        kind: 'Properties'
      }, {
        re: /^([_a-zA-Z \t]*)function (.*)/i,
        id: '%2',
        kind: 'Functions'
      }, {
        re: /^([_a-zA-Z \t]*)protected.+function (.*)/i,
        id: '%2',
        kind: 'Protected Methods'
      }, {
        re: /^([_a-zA-Z \t]*)private.+function (.*)/i,
        id: '%2',
        kind: 'Private Methods'
      }, {
        re: /^([_a-zA-Z \t]*)public.+function (.*)/i,
        id: '%2',
        kind: 'Public Methods'
      }
    ],
    Css: [
      {
        re: /^[ \t]*(.+)[ \t]*\{/,
        id: '%1',
        kind: 'Selector'
      }, {
        re: /^[ \t]*(.+)[ \t]*,[ \t]*$/,
        id: '%1',
        kind: 'Selector'
      }, {
        re: /^[ \t]*[@$]([a-zA-Z$_][-a-zA-Z$_0-9]*)[ \t]*:/,
        id: '%1',
        kind: 'Selector'
      }
    ],
    Sass: [
      {
        re: /^[ \t]*([#.]*[a-zA-Z_0-9]+)[ \t]*$/,
        id: '%1',
        kind: 'Function'
      }
    ],
    Yaml: [
      {
        re: /^[ \t]*([a-zA-Z_0-9 ]+)[ \t]*\:[ \t]*/,
        id: '%1',
        kind: 'Function'
      }
    ],
    Html: [
      {
        re: /^[ \t]*<([a-zA-Z]+)[ \t]*.*>/,
        id: '%1',
        kind: 'Function'
      }
    ],
    Markdown: [
      {
        re: /^#+[ \t]*([^#]+)/,
        id: '%1',
        kind: 'Function'
      }
    ],
    Json: [
      {
        re: /^[ \t]*"([^"]+)"[ \t]*\:/,
        id: '%1',
        kind: 'Field'
      }
    ],
    Cson: [
      {
        re: /^[ \t]*'([^']+)'[ \t]*\:/,
        id: '%1',
        kind: 'Field'
      }, {
        re: /^[ \t]*"([^"]+)"[ \t]*\:/,
        id: '%1',
        kind: 'Field'
      }, {
        re: /^[ \t]*([^'"#]+)[ \t]*\:/,
        id: '%1',
        kind: 'Field'
      }
    ],
    Go: [
      {
        re: /func([ \t]+\([^)]+\))?[ \t]+([a-zA-Z0-9_]+)/,
        id: '%2',
        kind: 'Func'
      }, {
        re: /var[ \t]+([a-zA-Z_][a-zA-Z0-9_]*)/,
        id: '%1',
        kind: 'Var'
      }, {
        re: /type[ \t]+([a-zA-Z_][a-zA-Z0-9_]*)/,
        id: '%1',
        kind: 'Type'
      }
    ],
    Capnp: [
      {
        re: /struct[ \t]+([A-Za-z]+)/,
        id: '%1',
        kind: 'Struct'
      }, {
        re: /enum[ \t]+([A-Za-z]+)/,
        id: '%1',
        kind: 'Enum'
      }, {
        re: /using[ \t]+([A-Za-z]+)[ \t]+=[ \t]+import/,
        id: '%1',
        kind: 'Using'
      }, {
        re: /const[ \t]+([A-Za-z]+)/,
        id: '%1',
        kind: 'Const'
      }
    ],
    perl: [
      {
        re: /with[ \t]+([^;]+)[ \t]*?;/,
        id: '%1',
        kind: 'Role'
      }, {
        re: /extends[ \t]+['"]([^'"]+)['"][ \t]*?;/,
        id: '%1',
        kind: 'Extends'
      }, {
        re: /use[ \t]+base[ \t]+['"]([^'"]+)['"][ \t]*?;/,
        id: '%1',
        kind: 'Extends'
      }, {
        re: /use[ \t]+parent[ \t]+['"]([^'"]+)['"][ \t]*?;/,
        id: '%1',
        kind: 'Extends'
      }, {
        re: /Mojo::Base[ \t]+['"]([^'"]+)['"][ \t]*?;/,
        id: '%1',
        kind: 'Extends'
      }, {
        re: /^[ \t]*?use[ \t]+([^;]+)[ \t]*?;/,
        id: '%1',
        kind: 'Use'
      }, {
        re: /^[ \t]*?require[ \t]+((\w|\:)+)/,
        id: '%1',
        kind: 'Require'
      }, {
        re: /^[ \t]*?has[ \t]+['"]?(\w+)['"]?/,
        id: '%1',
        kind: 'Attribute'
      }, {
        re: /^[ \t]*?\*(\w+)[ \t]*?=/,
        id: '%1',
        kind: 'Alias'
      }, {
        re: /->helper\([ \t]?['"]?(\w+)['"]?/,
        id: '%1',
        kind: 'Helper'
      }, {
        re: /^[ \t]*?our[ \t]*?[\$@%](\w+)/,
        id: '%1',
        kind: 'Our'
      }, {
        re: /^\=head1[ \t]+(.+)/,
        id: '%1',
        kind: 'Plain Old Doc'
      }, {
        re: /^\=head2[ \t]+(.+)/,
        id: '-- %1',
        kind: 'Plain Old Doc'
      }, {
        re: /^\=head[3-5][ \t]+(.+)/,
        id: '---- %1',
        kind: 'Plain Old Doc'
      }
    ],
    JavaScript: [
      {
        re: /(,|(;|^)[ \t]*(var|let|([A-Za-z_$][A-Za-z0-9_$.]*\.)*))[ \t]*([A-Za-z0-9_$]+)[ \t]*=[ \t]*function[ \t]*\(/,
        id: '%5',
        kind: 'Function'
      }, {
        re: /function[ \t]+([A-Za-z0-9_$]+)[ \t]*\([^)]*\)/,
        id: '%1',
        kind: 'Function'
      }, {
        re: /(,|^|\*\/)[ \t]*([A-Za-z_$][A-Za-z0-9_$]+)[ \t]*:[ \t]*function[ \t]*\(/,
        id: '%2',
        kind: 'Function'
      }, {
        re: /(,|^|\*\/)[ \t]*get[ \t]+([A-Za-z_$][A-Za-z0-9_$]+)[ \t]*\([ \t]*\)[ \t]*\{/,
        id: 'get %2',
        kind: 'Function'
      }, {
        re: /(,|^|\*\/)[ \t]*set[ \t]+([A-Za-z_$][A-Za-z0-9_$]+)[ \t]*\([ \t]*([A-Za-z_$][A-Za-z0-9_$]+)?[ \t]*\)[ \t]*\{/,
        id: 'set %2',
        kind: 'Function'
      }
    ],
    haxe: [
      {
        re: /^package[ \t]+([A-Za-z0-9_.]+)/,
        id: '%1',
        kind: 'Package'
      }, {
        re: /^[ \t]*[(@:macro|private|public|static|override|inline|dynamic)( \t)]*function[ \t]+([A-Za-z0-9_]+)/,
        id: '%1',
        kind: 'Function'
      }, {
        re: /^[ \t]*([private|public|static|protected|inline][ \t]*)+var[ \t]+([A-Za-z0-9_]+)/,
        id: '%2',
        kind: 'Variable'
      }, {
        re: /^[ \t]*package[ \t]*([A-Za-z0-9_]+)/,
        id: '%1',
        kind: 'Package'
      }, {
        re: /^[ \t]*(extern[ \t]*|@:native\([^)]*\)[ \t]*)*class[ \t]+([A-Za-z0-9_]+)[ \t]*[^\{]*/,
        id: '%2',
        kind: 'Class'
      }, {
        re: /^[ \t]*(extern[ \t]+)?interface[ \t]+([A-Za-z0-9_]+)/,
        id: '%2',
        kind: 'Interface'
      }, {
        re: /^[ \t]*typedef[ \t]+([A-Za-z0-9_]+)/,
        id: '%1',
        kind: 'Typedef'
      }, {
        re: /^[ \t]*enum[ \t]+([A-Za-z0-9_]+)/,
        id: '%1',
        kind: 'Typedef'
      }
    ],
    Elixir: [
      {
        re: /^[ \t]*def(p?)[ \t]+([a-z_][a-zA-Z0-9_?!]*)/,
        id: '%2',
        kind: 'Functions (def ...)'
      }, {
        re: /^[ \t]*defcallback[ \t]+([a-z_][a-zA-Z0-9_?!]*)/,
        id: '%1',
        kind: 'Callbacks (defcallback ...)'
      }, {
        re: /^[ \t]*defdelegate[ \t]+([a-z_][a-zA-Z0-9_?!]*)/,
        id: '%1',
        kind: 'Delegates (defdelegate ...)'
      }, {
        re: /^[ \t]*defexception[ \t]+([A-Z][a-zA-Z0-9_]*\.)*([A-Z][a-zA-Z0-9_?!]*)/,
        id: '%2',
        kind: 'Exceptions (defexception ...)'
      }, {
        re: /^[ \t]*defimpl[ \t]+([A-Z][a-zA-Z0-9_]*\.)*([A-Z][a-zA-Z0-9_?!]*)/,
        id: '%2',
        kind: 'Implementations (defimpl ...)'
      }, {
        re: /^[ \t]*defmacro(p?)[ \t]+([a-z_][a-zA-Z0-9_?!]*)\(/,
        id: '%2',
        kind: 'Macros (defmacro ...)'
      }, {
        re: /^[ \t]*defmacro(p?)[ \t]+([a-zA-Z0-9_?!]+)?[ \t]+([^ \tA-Za-z0-9_]+)[ \t]*[a-zA-Z0-9_!?!]/,
        id: '%3',
        kind: 'Operators (e.g. "defmacro a <<< b")'
      }, {
        re: /^[ \t]*defmodule[ \t]+([A-Z][a-zA-Z0-9_]*\.)*([A-Z][a-zA-Z0-9_?!]*)/,
        id: '%2',
        kind: 'Modules (defmodule ...)'
      }, {
        re: /^[ \t]*defprotocol[ \t]+([A-Z][a-zA-Z0-9_]*\.)*([A-Z][a-zA-Z0-9_?!]*)/,
        id: '%2',
        kind: 'Protocols (defprotocol...)'
      }, {
        re: /^[ \t]*Record\.defrecord[ \t]+:([a-zA-Z0-9_]+)/,
        id: '%1',
        kind: 'Records (defrecord...)'
      }
    ],
    Nim: [
      {
        re: /^[\t\s]*proc\s+([_A-Za-z0-9]+)\**(\[\w+(\:\s+\w+)?\])?\s*\(/,
        id: '%1',
        kind: 'Function'
      }, {
        re: /^[\t\s]*iterator\s+([_A-Za-z0-9]+)\**(\[\w+(\:\s+\w+)?\])?\s*\(/,
        id: '%1',
        kind: 'Iterator'
      }, {
        re: /^[\t\s]*macro\s+([_A-Za-z0-9]+)\**(\[\w+(\:\s+\w+)?\])?\s*\(/,
        id: '%1',
        kind: 'Macro'
      }, {
        re: /^[\t\s]*method\s+([_A-Za-z0-9]+)\**(\[\w+(\:\s+\w+)?\])?\s*\(/,
        id: '%1',
        kind: 'Method'
      }, {
        re: /^[\t\s]*template\s+([_A-Za-z0-9]+)\**(\[\w+(\:\s+\w+)?\])?\s*\(/,
        id: '%1',
        kind: 'Generics'
      }, {
        re: /^[\t\s]*converter\s+([_A-Za-z0-9]+)\**(\[\w+(\:\s+\w+)?\])?\s*\(/,
        id: '%1',
        kind: 'Converter'
      }
    ],
    Fountain: [
      {
        re: /^(([iI][nN][tT]|[eE][xX][tT]|[^\w][eE][sS][tT]|\.|[iI]\.?\/[eE]\.?)([^\n]+))/,
        id: '%1',
        kind: 'Function'
      }
    ],
    Julia: [
      {
        re: /^[ \t]*(function|macro|abstract|type|typealias|immutable)[ \t]+([^ \t({[]+).*$/,
        id: '%2',
        kind: 'Function'
      }, {
        re: /^[ \t]*(([^@#$ \t({[]+)|\(([^@#$ \t({[]+)\)|\((\$)\))[ \t]*(\{.*\})?[ \t]*\([^#]*\)[ \t]*=([^=].*$|$)/,
        id: '%2%3%4',
        kind: 'Function'
      }
    ]
  };

  langmap = {
    '.coffee': langdef.CoffeeScript,
    '.litcoffee': langdef.CoffeeScript,
    '.rb': langdef.Ruby,
    'Rakefile': langdef.Ruby,
    '.php': langdef.php,
    '.css': langdef.Css,
    '.less': langdef.Css,
    '.scss': langdef.Css,
    '.sass': langdef.Sass,
    '.yaml': langdef.Yaml,
    '.yml': langdef.Yaml,
    '.md': langdef.Markdown,
    '.markdown': langdef.Markdown,
    '.mdown': langdef.Markdown,
    '.mkd': langdef.Markdown,
    '.mkdown': langdef.Markdown,
    '.ron': langdef.Markdown,
    '.json': langdef.Json,
    '.cson': langdef.Cson,
    '.gyp': langdef.Cson,
    '.go': langdef.Go,
    '.capnp': langdef.Capnp,
    '.pod': langdef.perl,
    '.js': langdef.JavaScript,
    '.hx': langdef.haxe,
    '.ex.exs': langdef.Elixir,
    '.nim': langdef.Nim,
    '.fountain': langdef.Fountain,
    '.ftn': langdef.Fountain,
    '.jl': langdef.Julia
  };

  module.exports = {
    langdef: langdef,
    langmap: langmap
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2xpYnJhcnkvRW1iZXIgc2F0ZWxsaXRlIHByb2plY3RzL3dyZWF0aGUtYmFzZS91c3Ivc2hhcmUvYXRvbS9wYWNrYWdlcy9uYXYtcGFuZWwtcGx1cy9saWIvY3RhZ3MuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0FBQUEsTUFBQTs7RUFBQSxPQUFBLEdBQ0U7SUFBQSxHQUFBLEVBQUs7TUFDSDtRQUFDLEVBQUEsRUFBSSxpQkFBTDtRQUF3QixFQUFBLEVBQUksSUFBNUI7UUFBa0MsSUFBQSxFQUFNLFNBQXhDO09BREcsRUFFSDtRQUFDLEVBQUEsRUFBSSwyQkFBTDtRQUFrQyxFQUFBLEVBQUksSUFBdEM7UUFBNEMsSUFBQSxFQUFNLE1BQWxEO09BRkc7S0FBTDtJQUlBLFlBQUEsRUFBYztNQUNaO1FBQUMsRUFBQSxFQUFJLGlEQUFMO1FBQXdELEVBQUEsRUFBSSxJQUE1RDtRQUFrRSxJQUFBLEVBQU0sT0FBeEU7T0FEWSxFQUVaO1FBQUMsRUFBQSxFQUFJLHdFQUFMO1FBQStFLEVBQUEsRUFBSSxJQUFuRjtRQUF5RixJQUFBLEVBQU0sVUFBL0Y7T0FGWSxFQUdaO1FBQUMsRUFBQSxFQUFJLG9GQUFMO1FBQTJGLEVBQUEsRUFBSSxJQUEvRjtRQUFxRyxJQUFBLEVBQU0sVUFBM0c7T0FIWSxFQUlaO1FBQUMsRUFBQSxFQUFJLDZDQUFMO1FBQW9ELEVBQUEsRUFBSSxJQUF4RDtRQUE4RCxJQUFBLEVBQU0sVUFBcEU7T0FKWTtLQUpkO0lBVUEsSUFBQSxFQUFNO01BQ0o7UUFBQyxFQUFBLEVBQUksNkRBQUw7UUFBb0UsRUFBQSxFQUFJLElBQXhFO1FBQThFLElBQUEsRUFBTSxVQUFwRjtPQURJLEVBRUo7UUFBQyxFQUFBLEVBQUksa0NBQUw7UUFBeUMsRUFBQSxFQUFJLElBQTdDO1FBQW1ELElBQUEsRUFBTSxVQUF6RDtPQUZJLEVBR0o7UUFBQyxFQUFBLEVBQUkseUJBQUw7UUFBZ0MsRUFB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QU8sQ0FBQyxRQWRoQjtJQWVBLFNBQUEsRUFBVyxPQUFPLENBQUMsUUFmbkI7SUFnQkEsTUFBQSxFQUFRLE9BQU8sQ0FBQyxRQWhCaEI7SUFpQkEsT0FBQSxFQUFTLE9BQU8sQ0FBQyxJQWpCakI7SUFrQkEsT0FBQSxFQUFTLE9BQU8sQ0FBQyxJQWxCakI7SUFtQkEsTUFBQSxFQUFRLE9BQU8sQ0FBQyxJQW5CaEI7SUFvQkEsS0FBQSxFQUFPLE9BQU8sQ0FBQyxFQXBCZjtJQXFCQSxRQUFBLEVBQVUsT0FBTyxDQUFDLEtBckJsQjtJQXNCQSxNQUFBLEVBQVEsT0FBTyxDQUFDLElBdEJoQjtJQXVCQSxLQUFBLEVBQU8sT0FBTyxDQUFDLFVBdkJmO0lBd0JBLEtBQUEsRUFBTyxPQUFPLENBQUMsSUF4QmY7SUF5QkEsU0FBQSxFQUFXLE9BQU8sQ0FBQyxNQXpCbkI7SUEwQkEsTUFBQSxFQUFRLE9BQU8sQ0FBQyxHQTFCaEI7SUEyQkEsV0FBQSxFQUFhLE9BQU8sQ0FBQyxRQTNCckI7SUE0QkEsTUFBQSxFQUFRLE9BQU8sQ0FBQyxRQTVCaEI7SUE2QkEsS0FBQSxFQUFPLE9BQU8sQ0FBQyxLQTdCZjs7O0VBOEJGLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBQUMsT0FBQSxFQUFTLE9BQVY7SUFBbUIsT0FBQSxFQUFTLE9BQTVCOztBQXpKakIiLCJzb3VyY2VzQ29udGVudCI6WyIjIENyZWF0ZWQgYnkgY3RhZ3MyY29mZmVlLmNvZmZlZSBieSBwcm9jZXNzaW5nIC5jdGFnc1xubGFuZ2RlZiA9IFxuICBBbGw6IFtcbiAgICB7cmU6IC8jbmF2LW1hcms6KC4qKS9pLCBpZDogJyUxJywga2luZDogJ01hcmtlcnMnfVxuICAgIHtyZTogLygjfFxcL1xcLylbIFxcdF0qdG9kb3M6KC4qKS9pLCBpZDogJyUyJywga2luZDogJ1RvZG8nfVxuICBdXG4gIENvZmZlZVNjcmlwdDogW1xuICAgIHtyZTogL15bIFxcdF0qY2xhc3NbIFxcdF0qKFthLXpBLVokX1xcLjAtOV0rKSg/OlsgXFx0XXwkKS8sIGlkOiAnJTEnLCBraW5kOiAnQ2xhc3MnfVxuICAgIHtyZTogL15bIFxcdF0qKEA/W2EtekEtWiRfXFwuMC05XSspWyBcXHRdKig/Oj18XFw6KVsgXFx0XSooXFwoLipcXCkpP1sgXFx0XSooPzotfD0pPi8sIGlkOiAnJTEnLCBraW5kOiAnRnVuY3Rpb24nfVxuICAgIHtyZTogL15bIFxcdF0qKFthLXpBLVokXzAtOV0rXFw6XFw6W2EtekEtWiRfXFwuMC05XSspWyBcXHRdKig9fFxcOilbIFxcdF0qKFxcKC4qXFwpKT9bIFxcdF0qKC18PSk+LywgaWQ6ICclMScsIGtpbmQ6ICdGdW5jdGlvbid9XG4gICAge3JlOiAvXlsgXFx0XSooQD9bYS16QS1aJF9cXC4wLTldKylbIFxcdF0qWzo9XVtePl0qJC8sIGlkOiAnJTEnLCBraW5kOiAnVmFyaWFibGUnfVxuICBdXG4gIFJ1Ynk6IFtcbiAgICB7cmU6IC9eW1xcdCBdKihbQS1aXVstX0EtWmEtejAtOV0qOjopKihbQS1aXVstX0EtWmEtejAtOV0qKVtcXHQgXSo9LywgaWQ6ICclMicsIGtpbmQ6ICdDb25zdGFudCd9XG4gICAge3JlOiAvXlsgXFx0XSooW0EtWl9dW0EtWjAtOV9dKilbIFxcdF0qPS8sIGlkOiAnJTEnLCBraW5kOiAnQ29uc3RhbnQnfVxuICAgIHtyZTogL15bIFxcdF0qZGVzY3JpYmUgKC4qKSBkby8sIGlkOiAnJTEnLCBraW5kOiAnUnNwZWMgZGVzY3JpYmUnfVxuICAgIHtyZTogL15bIFxcdF0qY29udGV4dCBbJ1wiXSguKilbJ1wiXSBkby8sIGlkOiAnJTEnLCBraW5kOiAnUnNwZWMgY29udGV4dCd9XG4gICAge3JlOiAvXlsgXFx0XSpkZWZbIFxcdF0oW19hLXpBLVpdKikvaSwgaWQ6ICclMScsIGtpbmQ6ICdGdW5jdGlvbnMnfVxuICBdXG4gIHBocDogW1xuICAgIHtyZTogL15bIFxcdF0qY29uc3RbIFxcdF0qKFthLXpBLVpdK1tePV0qPS4qKTsvaSwgaWQ6ICclMScsIGtpbmQ6ICdDbGFzcyd9XG4gICAge3JlOiAvXlsgXFx0XSooKHZhcnxwcm90ZWN0ZWR8cHJpdmF0ZXxwdWJsaWN8c3RhdGljKS4qKTsvaSwgaWQ6ICclMScsIGtpbmQ6ICdQcm9wZXJ0aWVzJ31cbiAgICB7cmU6IC9eKFtfYS16QS1aIFxcdF0qKWZ1bmN0aW9uICguKikvaSwgaWQ6ICclMicsIGtpbmQ6ICdGdW5jdGlvbnMnfVxuICAgIHtyZTogL14oW19hLXpBLVogXFx0XSopcHJvdGVjdGVkLitmdW5jdGlvbiAoLiopL2ksIGlkOiAnJTInLCBraW5kOiAnUHJvdGVjdGVkIE1ldGhvZHMnfVxuICAgIHtyZTogL14oW19hLXpBLVogXFx0XSopcHJpdmF0ZS4rZnVuY3Rpb24gKC4qKS9pLCBpZDogJyUyJywga2luZDogJ1ByaXZhdGUgTWV0aG9kcyd9XG4gICAge3JlOiAvXihbX2EtekEtWiBcXHRdKilwdWJsaWMuK2Z1bmN0aW9uICguKikvaSwgaWQ6ICclMicsIGtpbmQ6ICdQdWJsaWMgTWV0aG9kcyd9XG4gIF1cbiAgQ3NzOiBbXG4gICAge3JlOiAvXlsgXFx0XSooLispWyBcXHRdKlxcey8sIGlkOiAnJTEnLCBraW5kOiAnU2VsZWN0b3InfVxuICAgIHtyZTogL15bIFxcdF0qKC4rKVsgXFx0XSosWyBcXHRdKiQvLCBpZDogJyUxJywga2luZDogJ1NlbGVjdG9yJ31cbiAgICB7cmU6IC9eWyBcXHRdKltAJF0oW2EtekEtWiRfXVstYS16QS1aJF8wLTldKilbIFxcdF0qOi8sIGlkOiAnJTEnLCBraW5kOiAnU2VsZWN0b3InfVxuICBdXG4gIFNhc3M6IFtcbiAgICB7cmU6IC9eWyBcXHRdKihbIy5dKlthLXpBLVpfMC05XSspWyBcXHRdKiQvLCBpZDogJyUxJywga2luZDogJ0Z1bmN0aW9uJ31cbiAgXVxuICBZYW1sOiBbXG4gICAge3JlOiAvXlsgXFx0XSooW2EtekEtWl8wLTkgXSspWyBcXHRdKlxcOlsgXFx0XSovLCBpZDogJyUxJywga2luZDogJ0Z1bmN0aW9uJ31cbiAgXVxuICBIdG1sOiBbXG4gICAge3JlOiAvXlsgXFx0XSo8KFthLXpBLVpdKylbIFxcdF0qLio+LywgaWQ6ICclMScsIGtpbmQ6ICdGdW5jdGlvbid9XG4gIF1cbiAgTWFya2Rvd246IFtcbiAgICB7cmU6IC9eIytbIFxcdF0qKFteI10rKS8sIGlkOiAnJTEnLCBraW5kOiAnRnVuY3Rpb24nfVxuICBdXG4gIEpzb246IFtcbiAgICB7cmU6IC9eWyBcXHRdKlwiKFteXCJdKylcIlsgXFx0XSpcXDovLCBpZDogJyUxJywga2luZDogJ0ZpZWxkJ31cbiAgXVxuICBDc29uOiBbXG4gICAge3JlOiAvXlsgXFx0XSonKFteJ10rKSdbIFxcdF0qXFw6LywgaWQ6ICclMScsIGtpbmQ6ICdGaWVsZCd9XG4gICAge3JlOiAvXlsgXFx0XSpcIihbXlwiXSspXCJbIFxcdF0qXFw6LywgaWQ6ICclMScsIGtpbmQ6ICdGaWVsZCd9XG4gICAge3JlOiAvXlsgXFx0XSooW14nXCIjXSspWyBcXHRdKlxcOi8sIGlkOiAnJTEnLCBraW5kOiAnRmllbGQnfVxuICBdXG4gIEdvOiBbXG4gICAge3JlOiAvZnVuYyhbIFxcdF0rXFwoW14pXStcXCkpP1sgXFx0XSsoW2EtekEtWjAtOV9dKykvLCBpZDogJyUyJywga2luZDogJ0Z1bmMnfVxuICAgIHtyZTogL3ZhclsgXFx0XSsoW2EtekEtWl9dW2EtekEtWjAtOV9dKikvLCBpZDogJyUxJywga2luZDogJ1Zhcid9XG4gICAge3JlOiAvdHlwZVsgXFx0XSsoW2EtekEtWl9dW2EtekEtWjAtOV9dKikvLCBpZDogJyUxJywga2luZDogJ1R5cGUnfVxuICBdXG4gIENhcG5wOiBbXG4gICAge3JlOiAvc3RydWN0WyBcXHRdKyhbQS1aYS16XSspLywgaWQ6ICclMScsIGtpbmQ6ICdTdHJ1Y3QnfVxuICAgIHtyZTogL2VudW1bIFxcdF0rKFtBLVphLXpdKykvLCBpZDogJyUxJywga2luZDogJ0VudW0nfVxuICAgIHtyZTogL3VzaW5nWyBcXHRdKyhbQS1aYS16XSspWyBcXHRdKz1bIFxcdF0raW1wb3J0LywgaWQ6ICclMScsIGtpbmQ6ICdVc2luZyd9XG4gICAge3JlOiAvY29uc3RbIFxcdF0rKFtBLVphLXpdKykvLCBpZDogJyUxJywga2luZDogJ0NvbnN0J31cbiAgXVxuICBwZXJsOiBbXG4gICAge3JlOiAvd2l0aFsgXFx0XSsoW147XSspWyBcXHRdKj87LywgaWQ6ICclMScsIGtpbmQ6ICdSb2xlJ31cbiAgICB7cmU6IC9leHRlbmRzWyBcXHRdK1snXCJdKFteJ1wiXSspWydcIl1bIFxcdF0qPzsvLCBpZDogJyUxJywga2luZDogJ0V4dGVuZHMnfVxuICAgIHtyZTogL3VzZVsgXFx0XStiYXNlWyBcXHRdK1snXCJdKFteJ1wiXSspWydcIl1bIFxcdF0qPzsvLCBpZDogJyUxJywga2luZDogJ0V4dGVuZHMnfVxuICAgIHtyZTogL3VzZVsgXFx0XStwYXJlbnRbIFxcdF0rWydcIl0oW14nXCJdKylbJ1wiXVsgXFx0XSo/Oy8sIGlkOiAnJTEnLCBraW5kOiAnRXh0ZW5kcyd9XG4gICAge3JlOiAvTW9qbzo6QmFzZVsgXFx0XStbJ1wiXShbXidcIl0rKVsnXCJdWyBcXHRdKj87LywgaWQ6ICclMScsIGtpbmQ6ICdFeHRlbmRzJ31cbiAgICB7cmU6IC9eWyBcXHRdKj91c2VbIFxcdF0rKFteO10rKVsgXFx0XSo/Oy8sIGlkOiAnJTEnLCBraW5kOiAnVXNlJ31cbiAgICB7cmU6IC9eWyBcXHRdKj9yZXF1aXJlWyBcXHRdKygoXFx3fFxcOikrKS8sIGlkOiAnJTEnLCBraW5kOiAnUmVxdWlyZSd9XG4gICAge3JlOiAvXlsgXFx0XSo/aGFzWyBcXHRdK1snXCJdPyhcXHcrKVsnXCJdPy8sIGlkOiAnJTEnLCBraW5kOiAnQXR0cmlidXRlJ31cbiAgICB7cmU6IC9eWyBcXHRdKj9cXCooXFx3KylbIFxcdF0qPz0vLCBpZDogJyUxJywga2luZDogJ0FsaWFzJ31cbiAgICB7cmU6IC8tPmhlbHBlclxcKFsgXFx0XT9bJ1wiXT8oXFx3KylbJ1wiXT8vLCBpZDogJyUxJywga2luZDogJ0hlbHBlcid9XG4gICAge3JlOiAvXlsgXFx0XSo/b3VyWyBcXHRdKj9bXFwkQCVdKFxcdyspLywgaWQ6ICclMScsIGtpbmQ6ICdPdXInfVxuICAgIHtyZTogL15cXD1oZWFkMVsgXFx0XSsoLispLywgaWQ6ICclMScsIGtpbmQ6ICdQbGFpbiBPbGQgRG9jJ31cbiAgICB7cmU6IC9eXFw9aGVhZDJbIFxcdF0rKC4rKS8sIGlkOiAnLS0gJTEnLCBraW5kOiAnUGxhaW4gT2xkIERvYyd9XG4gICAge3JlOiAvXlxcPWhlYWRbMy01XVsgXFx0XSsoLispLywgaWQ6ICctLS0tICUxJywga2luZDogJ1BsYWluIE9sZCBEb2MnfVxuICBdXG4gIEphdmFTY3JpcHQ6IFtcbiAgICB7cmU6IC8oLHwoO3xeKVsgXFx0XSoodmFyfGxldHwoW0EtWmEtel8kXVtBLVphLXowLTlfJC5dKlxcLikqKSlbIFxcdF0qKFtBLVphLXowLTlfJF0rKVsgXFx0XSo9WyBcXHRdKmZ1bmN0aW9uWyBcXHRdKlxcKC8sIGlkOiAnJTUnLCBraW5kOiAnRnVuY3Rpb24nfVxuICAgIHtyZTogL2Z1bmN0aW9uWyBcXHRdKyhbQS1aYS16MC05XyRdKylbIFxcdF0qXFwoW14pXSpcXCkvLCBpZDogJyUxJywga2luZDogJ0Z1bmN0aW9uJ31cbiAgICB7cmU6IC8oLHxefFxcKlxcLylbIFxcdF0qKFtBLVphLXpfJF1bQS1aYS16MC05XyRdKylbIFxcdF0qOlsgXFx0XSpmdW5jdGlvblsgXFx0XSpcXCgvLCBpZDogJyUyJywga2luZDogJ0Z1bmN0aW9uJ31cbiAgICB7cmU6IC8oLHxefFxcKlxcLylbIFxcdF0qZ2V0WyBcXHRdKyhbQS1aYS16XyRdW0EtWmEtejAtOV8kXSspWyBcXHRdKlxcKFsgXFx0XSpcXClbIFxcdF0qXFx7LywgaWQ6ICdnZXQgJTInLCBraW5kOiAnRnVuY3Rpb24nfVxuICAgIHtyZTogLygsfF58XFwqXFwvKVsgXFx0XSpzZXRbIFxcdF0rKFtBLVphLXpfJF1bQS1aYS16MC05XyRdKylbIFxcdF0qXFwoWyBcXHRdKihbQS1aYS16XyRdW0EtWmEtejAtOV8kXSspP1sgXFx0XSpcXClbIFxcdF0qXFx7LywgaWQ6ICdzZXQgJTInLCBraW5kOiAnRnVuY3Rpb24nfVxuICBdXG4gIGhheGU6IFtcbiAgICB7cmU6IC9ecGFja2FnZVsgXFx0XSsoW0EtWmEtejAtOV8uXSspLywgaWQ6ICclMScsIGtpbmQ6ICdQYWNrYWdlJ31cbiAgICB7cmU6IC9eWyBcXHRdKlsoQDptYWNyb3xwcml2YXRlfHB1YmxpY3xzdGF0aWN8b3ZlcnJpZGV8aW5saW5lfGR5bmFtaWMpKCBcXHQpXSpmdW5jdGlvblsgXFx0XSsoW0EtWmEtejAtOV9dKykvLCBpZDogJyUxJywga2luZDogJ0Z1bmN0aW9uJ31cbiAgICB7cmU6IC9eWyBcXHRdKihbcHJpdmF0ZXxwdWJsaWN8c3RhdGljfHByb3RlY3RlZHxpbmxpbmVdWyBcXHRdKikrdmFyWyBcXHRdKyhbQS1aYS16MC05X10rKS8sIGlkOiAnJTInLCBraW5kOiAnVmFyaWFibGUnfVxuICAgIHtyZTogL15bIFxcdF0qcGFja2FnZVsgXFx0XSooW0EtWmEtejAtOV9dKykvLCBpZDogJyUxJywga2luZDogJ1BhY2thZ2UnfVxuICAgIHtyZTogL15bIFxcdF0qKGV4dGVyblsgXFx0XSp8QDpuYXRpdmVcXChbXildKlxcKVsgXFx0XSopKmNsYXNzWyBcXHRdKyhbQS1aYS16MC05X10rKVsgXFx0XSpbXlxce10qLywgaWQ6ICclMicsIGtpbmQ6ICdDbGFzcyd9XG4gICAge3JlOiAvXlsgXFx0XSooZXh0ZXJuWyBcXHRdKyk/aW50ZXJmYWNlWyBcXHRdKyhbQS1aYS16MC05X10rKS8sIGlkOiAnJTInLCBraW5kOiAnSW50ZXJmYWNlJ31cbiAgICB7cmU6IC9eWyBcXHRdKnR5cGVkZWZbIFxcdF0rKFtBLVphLXowLTlfXSspLywgaWQ6ICclMScsIGtpbmQ6ICdUeXBlZGVmJ31cbiAgICB7cmU6IC9eWyBcXHRdKmVudW1bIFxcdF0rKFtBLVphLXowLTlfXSspLywgaWQ6ICclMScsIGtpbmQ6ICdUeXBlZGVmJ31cbiAgXVxuICBFbGl4aXI6IFtcbiAgICB7cmU6IC9eWyBcXHRdKmRlZihwPylbIFxcdF0rKFthLXpfXVthLXpBLVowLTlfPyFdKikvLCBpZDogJyUyJywga2luZDogJ0Z1bmN0aW9ucyAoZGVmIC4uLiknfVxuICAgIHtyZTogL15bIFxcdF0qZGVmY2FsbGJhY2tbIFxcdF0rKFthLXpfXVthLXpBLVowLTlfPyFdKikvLCBpZDogJyUxJywga2luZDogJ0NhbGxiYWNrcyAoZGVmY2FsbGJhY2sgLi4uKSd9XG4gICAge3JlOiAvXlsgXFx0XSpkZWZkZWxlZ2F0ZVsgXFx0XSsoW2Etel9dW2EtekEtWjAtOV8/IV0qKS8sIGlkOiAnJTEnLCBraW5kOiAnRGVsZWdhdGVzIChkZWZkZWxlZ2F0ZSAuLi4pJ31cbiAgICB7cmU6IC9eWyBcXHRdKmRlZmV4Y2VwdGlvblsgXFx0XSsoW0EtWl1bYS16QS1aMC05X10qXFwuKSooW0EtWl1bYS16QS1aMC05Xz8hXSopLywgaWQ6ICclMicsIGtpbmQ6ICdFeGNlcHRpb25zIChkZWZleGNlcHRpb24gLi4uKSd9XG4gICAge3JlOiAvXlsgXFx0XSpkZWZpbXBsWyBcXHRdKyhbQS1aXVthLXpBLVowLTlfXSpcXC4pKihbQS1aXVthLXpBLVowLTlfPyFdKikvLCBpZDogJyUyJywga2luZDogJ0ltcGxlbWVudGF0aW9ucyAoZGVmaW1wbCAuLi4pJ31cbiAgICB7cmU6IC9eWyBcXHRdKmRlZm1hY3JvKHA/KVsgXFx0XSsoW2Etel9dW2EtekEtWjAtOV8/IV0qKVxcKC8sIGlkOiAnJTInLCBraW5kOiAnTWFjcm9zIChkZWZtYWNybyAuLi4pJ31cbiAgICB7cmU6IC9eWyBcXHRdKmRlZm1hY3JvKHA/KVsgXFx0XSsoW2EtekEtWjAtOV8/IV0rKT9bIFxcdF0rKFteIFxcdEEtWmEtejAtOV9dKylbIFxcdF0qW2EtekEtWjAtOV8hPyFdLywgaWQ6ICclMycsIGtpbmQ6ICdPcGVyYXRvcnMgKGUuZy4gXCJkZWZtYWNybyBhIDw8PCBiXCIpJ31cbiAgICB7cmU6IC9eWyBcXHRdKmRlZm1vZHVsZVsgXFx0XSsoW0EtWl1bYS16QS1aMC05X10qXFwuKSooW0EtWl1bYS16QS1aMC05Xz8hXSopLywgaWQ6ICclMicsIGtpbmQ6ICdNb2R1bGVzIChkZWZtb2R1bGUgLi4uKSd9XG4gICAge3JlOiAvXlsgXFx0XSpkZWZwcm90b2NvbFsgXFx0XSsoW0EtWl1bYS16QS1aMC05X10qXFwuKSooW0EtWl1bYS16QS1aMC05Xz8hXSopLywgaWQ6ICclMicsIGtpbmQ6ICdQcm90b2NvbHMgKGRlZnByb3RvY29sLi4uKSd9XG4gICAge3JlOiAvXlsgXFx0XSpSZWNvcmRcXC5kZWZyZWNvcmRbIFxcdF0rOihbYS16QS1aMC05X10rKS8sIGlkOiAnJTEnLCBraW5kOiAnUmVjb3JkcyAoZGVmcmVjb3JkLi4uKSd9XG4gIF1cbiAgTmltOiBbXG4gICAge3JlOiAvXltcXHRcXHNdKnByb2NcXHMrKFtfQS1aYS16MC05XSspXFwqKihcXFtcXHcrKFxcOlxccytcXHcrKT9cXF0pP1xccypcXCgvLCBpZDogJyUxJywga2luZDogJ0Z1bmN0aW9uJ31cbiAgICB7cmU6IC9eW1xcdFxcc10qaXRlcmF0b3JcXHMrKFtfQS1aYS16MC05XSspXFwqKihcXFtcXHcrKFxcOlxccytcXHcrKT9cXF0pP1xccypcXCgvLCBpZDogJyUxJywga2luZDogJ0l0ZXJhdG9yJ31cbiAgICB7cmU6IC9eW1xcdFxcc10qbWFjcm9cXHMrKFtfQS1aYS16MC05XSspXFwqKihcXFtcXHcrKFxcOlxccytcXHcrKT9cXF0pP1xccypcXCgvLCBpZDogJyUxJywga2luZDogJ01hY3JvJ31cbiAgICB7cmU6IC9eW1xcdFxcc10qbWV0aG9kXFxzKyhbX0EtWmEtejAtOV0rKVxcKiooXFxbXFx3KyhcXDpcXHMrXFx3Kyk/XFxdKT9cXHMqXFwoLywgaWQ6ICclMScsIGtpbmQ6ICdNZXRob2QnfVxuICAgIHtyZTogL15bXFx0XFxzXSp0ZW1wbGF0ZVxccysoW19BLVphLXowLTldKylcXCoqKFxcW1xcdysoXFw6XFxzK1xcdyspP1xcXSk/XFxzKlxcKC8sIGlkOiAnJTEnLCBraW5kOiAnR2VuZXJpY3MnfVxuICAgIHtyZTogL15bXFx0XFxzXSpjb252ZXJ0ZXJcXHMrKFtfQS1aYS16MC05XSspXFwqKihcXFtcXHcrKFxcOlxccytcXHcrKT9cXF0pP1xccypcXCgvLCBpZDogJyUxJywga2luZDogJ0NvbnZlcnRlcid9XG4gIF1cbiAgRm91bnRhaW46IFtcbiAgICB7cmU6IC9eKChbaUldW25OXVt0VF18W2VFXVt4WF1bdFRdfFteXFx3XVtlRV1bc1NdW3RUXXxcXC58W2lJXVxcLj9cXC9bZUVdXFwuPykoW15cXG5dKykpLywgaWQ6ICclMScsIGtpbmQ6ICdGdW5jdGlvbid9XG4gIF1cbiAgSnVsaWE6IFtcbiAgICB7cmU6IC9eWyBcXHRdKihmdW5jdGlvbnxtYWNyb3xhYnN0cmFjdHx0eXBlfHR5cGVhbGlhc3xpbW11dGFibGUpWyBcXHRdKyhbXiBcXHQoe1tdKykuKiQvLCBpZDogJyUyJywga2luZDogJ0Z1bmN0aW9uJ31cbiAgICB7cmU6IC9eWyBcXHRdKigoW15AIyQgXFx0KHtbXSspfFxcKChbXkAjJCBcXHQoe1tdKylcXCl8XFwoKFxcJClcXCkpWyBcXHRdKihcXHsuKlxcfSk/WyBcXHRdKlxcKFteI10qXFwpWyBcXHRdKj0oW149XS4qJHwkKS8sIGlkOiAnJTIlMyU0Jywga2luZDogJ0Z1bmN0aW9uJ31cbiAgXVxubGFuZ21hcCA9IFxuICAnLmNvZmZlZSc6IGxhbmdkZWYuQ29mZmVlU2NyaXB0XG4gICcubGl0Y29mZmVlJzogbGFuZ2RlZi5Db2ZmZWVTY3JpcHRcbiAgJy5yYic6IGxhbmdkZWYuUnVieVxuICAnUmFrZWZpbGUnOiBsYW5nZGVmLlJ1YnlcbiAgJy5waHAnOiBsYW5nZGVmLnBocFxuICAnLmNzcyc6IGxhbmdkZWYuQ3NzXG4gICcubGVzcyc6IGxhbmdkZWYuQ3NzXG4gICcuc2Nzcyc6IGxhbmdkZWYuQ3NzXG4gICcuc2Fzcyc6IGxhbmdkZWYuU2Fzc1xuICAnLnlhbWwnOiBsYW5nZGVmLllhbWxcbiAgJy55bWwnOiBsYW5nZGVmLllhbWxcbiAgJy5tZCc6IGxhbmdkZWYuTWFya2Rvd25cbiAgJy5tYXJrZG93bic6IGxhbmdkZWYuTWFya2Rvd25cbiAgJy5tZG93bic6IGxhbmdkZWYuTWFya2Rvd25cbiAgJy5ta2QnOiBsYW5nZGVmLk1hcmtkb3duXG4gICcubWtkb3duJzogbGFuZ2RlZi5NYXJrZG93blxuICAnLnJvbic6IGxhbmdkZWYuTWFya2Rvd25cbiAgJy5qc29uJzogbGFuZ2RlZi5Kc29uXG4gICcuY3Nvbic6IGxhbmdkZWYuQ3NvblxuICAnLmd5cCc6IGxhbmdkZWYuQ3NvblxuICAnLmdvJzogbGFuZ2RlZi5Hb1xuICAnLmNhcG5wJzogbGFuZ2RlZi5DYXBucFxuICAnLnBvZCc6IGxhbmdkZWYucGVybFxuICAnLmpzJzogbGFuZ2RlZi5KYXZhU2NyaXB0XG4gICcuaHgnOiBsYW5nZGVmLmhheGVcbiAgJy5leC5leHMnOiBsYW5nZGVmLkVsaXhpclxuICAnLm5pbSc6IGxhbmdkZWYuTmltXG4gICcuZm91bnRhaW4nOiBsYW5nZGVmLkZvdW50YWluXG4gICcuZnRuJzogbGFuZ2RlZi5Gb3VudGFpblxuICAnLmpsJzogbGFuZ2RlZi5KdWxpYVxubW9kdWxlLmV4cG9ydHMgPSB7bGFuZ2RlZjogbGFuZ2RlZiwgbGFuZ21hcDogbGFuZ21hcH1cbiJdfQ==
