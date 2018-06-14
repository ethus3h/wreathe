(function() {
  var WordcountView,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  module.exports = WordcountView = (function() {
    WordcountView.prototype.CSS_SELECTED_CLASS = 'wordcount-select';

    function WordcountView() {
      this.getTexts = bind(this.getTexts, this);
      this.element = document.createElement('div');
      this.element.classList.add('word-count');
      this.element.classList.add('inline-block');
      this.divWords = document.createElement('div');
      this.element.appendChild(this.divWords);
      this.wordregex = require('word-regex')();
    }

    WordcountView.prototype.charactersToHMS = function(c) {
      var minutes, seconds, temp;
      temp = c * 60;
      seconds = temp / atom.config.get('wordcount.charactersPerSeconds');
      seconds = seconds % 3600;
      minutes = parseInt(seconds / 60);
      seconds = Math.round(seconds % 60);
      minutes = ('0' + minutes).slice(-2);
      seconds = ('0' + seconds).slice(-2);
      return minutes + ':' + seconds;
    };

    WordcountView.prototype.update_count = function(editor) {
      var charCount, chars, color, colorBg, goal, green, height, i, len, percent, priceResult, ref, scope, str, text, texts, wordCount, words;
      texts = this.getTexts(editor);
      scope = editor.getGrammar().scopeName;
      wordCount = charCount = 0;
      for (i = 0, len = texts.length; i < len; i++) {
        text = texts[i];
        text = this.stripText(text, editor);
        ref = this.count(text), words = ref[0], chars = ref[1];
        wordCount += words;
        charCount += chars;
      }
      str = '';
      if (atom.config.get('wordcount.showwords')) {
        str += "<span class='wordcount-words'>" + (wordCount || 0) + " W</span>";
      }
      if (atom.config.get('wordcount.showchars')) {
        str += "<span class='wordcount-chars'>" + (charCount || 0) + " C</span>";
      }
      if (atom.config.get('wordcount.showtime')) {
        str += "<span class='wordcount-time'>" + (this.charactersToHMS(charCount || 0)) + "</span>";
      }
      priceResult = wordCount * atom.config.get('wordcount.wordprice');
      if (atom.config.get('wordcount.showprice')) {
        str += ("<span class='wordcount-price'>" + (priceResult.toFixed(2) || 0) + " </span>") + atom.config.get('wordcount.currencysymbol');
      }
      this.divWords.innerHTML = str;
      if (goal = atom.config.get('wordcount.goal')) {
        if (!this.divGoal) {
          this.divGoal = document.createElement('div');
          this.divGoal.style.width = '100%';
          this.element.appendChild(this.divGoal);
        }
        green = Math.round(wordCount / goal * 100);
        if (green > 100) {
          green = 100;
        }
        color = atom.config.get('wordcount.goalColor');
        colorBg = atom.config.get('wordcount.goalBgColor');
        this.divGoal.style.background = '-webkit-linear-gradient(left, ' + color + ' ' + green + '%, ' + colorBg + ' 0%)';
        percent = parseFloat(atom.config.get('wordcount.goalLineHeight')) / 100;
        height = this.element.clientHeight * percent;
        this.divGoal.style.height = height + 'px';
        return this.divGoal.style.marginTop = -height + 'px';
      }
    };

    WordcountView.prototype.getTexts = function(editor) {
      var emptySelections, i, len, range, selectionRanges, text, texts;
      texts = [];
      selectionRanges = editor.getSelectedBufferRanges();
      emptySelections = true;
      for (i = 0, len = selectionRanges.length; i < len; i++) {
        range = selectionRanges[i];
        text = editor.getTextInBufferRange(range);
        if (text) {
          texts.push(text);
          emptySelections = false;
        }
      }
      if (emptySelections) {
        texts.push(editor.getText());
        this.element.classList.remove(this.CSS_SELECTED_CLASS);
      } else {
        this.element.classList.add(this.CSS_SELECTED_CLASS);
      }
      return texts;
    };

    WordcountView.prototype.stripText = function(text, editor) {
      var blockquotePatterns, codePatterns, commentPatterns, grammar, i, j, k, len, len1, len2, pattern, stripgrammars;
      grammar = editor.getGrammar().scopeName;
      stripgrammars = atom.config.get('wordcount.stripgrammars');
      if (indexOf.call(stripgrammars, grammar) >= 0) {
        if (atom.config.get('wordcount.ignorecode')) {
          codePatterns = [/`{3}(.|\s)*?(`{3}|$)/g, /[ ]{4}.*?$/gm];
          for (i = 0, len = codePatterns.length; i < len; i++) {
            pattern = codePatterns[i];
            text = text != null ? text.replace(pattern, '') : void 0;
          }
        }
        if (atom.config.get('wordcount.ignorecomments')) {
          commentPatterns = [/(<!--(\n?(?:(?!-->).)*)+(-->|$))/g, /({>>(\n?(?:(?!<<}).)*)+(<<}|$))/g];
          for (j = 0, len1 = commentPatterns.length; j < len1; j++) {
            pattern = commentPatterns[j];
            text = text != null ? text.replace(pattern, '') : void 0;
          }
        }
        if (atom.config.get('wordcount.ignoreblockquotes')) {
          blockquotePatterns = [/^\s{0,3}>(.*\S.*\n)+/gm];
          for (k = 0, len2 = blockquotePatterns.length; k < len2; k++) {
            pattern = blockquotePatterns[k];
            text = text != null ? text.replace(pattern, '') : void 0;
          }
        }
        text = text != null ? text.replace(/(?:__|[*#])|\[(.*?)\]\(.*?\)/gm, '$1') : void 0;
      }
      return text;
    };

    WordcountView.prototype.count = function(text) {
      var chars, ref, words;
      words = text != null ? (ref = text.match(this.wordregex)) != null ? ref.length : void 0 : void 0;
      text = text != null ? text.replace('\n', '') : void 0;
      text = text != null ? text.replace('\r', '') : void 0;
      chars = text != null ? text.length : void 0;
      return [words, chars];
    };

    return WordcountView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2xpYnJhcnkvRW1iZXIgc2F0ZWxsaXRlIHByb2plY3RzL3dyZWF0aGUtYmFzZS91c3Ivc2hhcmUvYXRvbS9wYWNrYWdlcy93b3JkY291bnQvbGliL3dvcmRjb3VudC12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUEsYUFBQTtJQUFBOzs7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNOzRCQUNKLGtCQUFBLEdBQW9COztJQUVQLHVCQUFBOztNQUNYLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkI7TUFDWCxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QixZQUF2QjtNQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLGNBQXZCO01BRUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QjtNQUVaLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxDQUFxQixJQUFDLENBQUEsUUFBdEI7TUFFQSxJQUFDLENBQUEsU0FBRCxHQUFhLE9BQUEsQ0FBUSxZQUFSLENBQUEsQ0FBQTtJQVRGOzs0QkFXYixlQUFBLEdBQWlCLFNBQUMsQ0FBRDtBQUVmLFVBQUE7TUFBQSxJQUFBLEdBQU8sQ0FBQSxHQUFJO01BQ1gsT0FBQSxHQUFVLElBQUEsR0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0NBQWhCO01BR2pCLE9BQUEsR0FBVSxPQUFBLEdBQVU7TUFHcEIsT0FBQSxHQUFVLFFBQUEsQ0FBUyxPQUFBLEdBQVUsRUFBbkI7TUFHVixPQUFBLEdBQVUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxPQUFBLEdBQVUsRUFBckI7TUFDVixPQUFBLEdBQVUsQ0FBQyxHQUFBLEdBQU0sT0FBUCxDQUFlLENBQUMsS0FBaEIsQ0FBc0IsQ0FBQyxDQUF2QjtNQUNWLE9BQUEsR0FBVSxDQUFDLEdBQUEsR0FBTSxPQUFQLENBQWUsQ0FBQyxLQUFoQixDQUFzQixDQUFDLENBQXZCO2FBQ1YsT0FBQSxHQUFVLEdBQVYsR0FBZ0I7SUFmRDs7NEJBaUJqQixZQUFBLEdBQWMsU0FBQyxNQUFEO0FBQ1osVUFBQTtNQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsUUFBRCxDQUFVLE1BQVY7TUFDUixLQUFBLEdBQVEsTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFtQixDQUFDO01BQzVCLFNBQUEsR0FBWSxTQUFBLEdBQVk7QUFDeEIsV0FBQSx1Q0FBQTs7UUFDRSxJQUFBLEdBQU8sSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFYLEVBQWlCLE1BQWpCO1FBQ1AsTUFBaUIsSUFBQyxDQUFBLEtBQUQsQ0FBTyxJQUFQLENBQWpCLEVBQUMsY0FBRCxFQUFRO1FBQ1IsU0FBQSxJQUFhO1FBQ2IsU0FBQSxJQUFhO0FBSmY7TUFLQSxHQUFBLEdBQU07TUFDTixJQUFxRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IscUJBQWhCLENBQXJFO1FBQUEsR0FBQSxJQUFPLGdDQUFBLEdBQWdDLENBQUMsU0FBQSxJQUFhLENBQWQsQ0FBaEMsR0FBZ0QsWUFBdkQ7O01BQ0EsSUFBdUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHFCQUFoQixDQUF2RTtRQUFBLEdBQUEsSUFBUSxnQ0FBQSxHQUFnQyxDQUFDLFNBQUEsSUFBYSxDQUFkLENBQWhDLEdBQWdELFlBQXhEOztNQUNBLElBQXNGLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixvQkFBaEIsQ0FBdEY7UUFBQSxHQUFBLElBQVEsK0JBQUEsR0FBK0IsQ0FBRSxJQUFDLENBQUEsZUFBRCxDQUFpQixTQUFBLElBQWEsQ0FBOUIsQ0FBRixDQUEvQixHQUFpRSxVQUF6RTs7TUFDQSxXQUFBLEdBQWMsU0FBQSxHQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixxQkFBaEI7TUFDeEIsSUFBZ0ksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHFCQUFoQixDQUFoSTtRQUFBLEdBQUEsSUFBUSxDQUFBLGdDQUFBLEdBQWdDLENBQUMsV0FBVyxDQUFDLE9BQVosQ0FBb0IsQ0FBcEIsQ0FBQSxJQUEwQixDQUEzQixDQUFoQyxHQUE2RCxVQUE3RCxDQUFELEdBQTJFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQkFBaEIsRUFBbEY7O01BQ0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxTQUFWLEdBQXNCO01BQ3RCLElBQUcsSUFBQSxHQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQkFBaEIsQ0FBVjtRQUNFLElBQUcsQ0FBSSxJQUFDLENBQUEsT0FBUjtVQUNFLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkI7VUFDWCxJQUFDLENBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFmLEdBQXVCO1VBQ3ZCLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxDQUFxQixJQUFDLENBQUEsT0FBdEIsRUFIRjs7UUFJQSxLQUFBLEdBQVEsSUFBSSxDQUFDLEtBQUwsQ0FBVyxTQUFBLEdBQVksSUFBWixHQUFtQixHQUE5QjtRQUNSLElBQWUsS0FBQSxHQUFRLEdBQXZCO1VBQUEsS0FBQSxHQUFRLElBQVI7O1FBQ0EsS0FBQSxHQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixxQkFBaEI7UUFDUixPQUFBLEdBQVUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVCQUFoQjtRQUNWLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBSyxDQUFDLFVBQWYsR0FBNEIsZ0NBQUEsR0FBbUMsS0FBbkMsR0FBMkMsR0FBM0MsR0FBaUQsS0FBakQsR0FBeUQsS0FBekQsR0FBaUUsT0FBakUsR0FBMkU7UUFDdkcsT0FBQSxHQUFVLFVBQUEsQ0FBVyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMEJBQWhCLENBQVgsQ0FBQSxHQUF5RDtRQUNuRSxNQUFBLEdBQVMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxZQUFULEdBQXdCO1FBQ2pDLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQWYsR0FBd0IsTUFBQSxHQUFTO2VBQ2pDLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQWYsR0FBMkIsQ0FBQyxNQUFELEdBQVUsS0FidkM7O0lBaEJZOzs0QkErQmQsUUFBQSxHQUFVLFNBQUMsTUFBRDtBQUVSLFVBQUE7TUFBQSxLQUFBLEdBQVE7TUFDUixlQUFBLEdBQWtCLE1BQU0sQ0FBQyx1QkFBUCxDQUFBO01BQ2xCLGVBQUEsR0FBa0I7QUFDbEIsV0FBQSxpREFBQTs7UUFDRSxJQUFBLEdBQU8sTUFBTSxDQUFDLG9CQUFQLENBQTRCLEtBQTVCO1FBR1AsSUFBRyxJQUFIO1VBQ0UsS0FBSyxDQUFDLElBQU4sQ0FBVyxJQUFYO1VBQ0EsZUFBQSxHQUFrQixNQUZwQjs7QUFKRjtNQVNBLElBQUcsZUFBSDtRQUNFLEtBQUssQ0FBQyxJQUFOLENBQVcsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFYO1FBQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBbkIsQ0FBMEIsSUFBQyxDQUFBLGtCQUEzQixFQUZGO09BQUEsTUFBQTtRQUlFLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLElBQUMsQ0FBQSxrQkFBeEIsRUFKRjs7YUFNQTtJQXBCUTs7NEJBc0JWLFNBQUEsR0FBVyxTQUFDLElBQUQsRUFBTyxNQUFQO0FBQ1QsVUFBQTtNQUFBLE9BQUEsR0FBVSxNQUFNLENBQUMsVUFBUCxDQUFBLENBQW1CLENBQUM7TUFDOUIsYUFBQSxHQUFnQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IseUJBQWhCO01BRWhCLElBQUcsYUFBVyxhQUFYLEVBQUEsT0FBQSxNQUFIO1FBRUUsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLENBQUg7VUFDRSxZQUFBLEdBQWUsQ0FBQyx1QkFBRCxFQUEwQixjQUExQjtBQUNmLGVBQUEsOENBQUE7O1lBQ0UsSUFBQSxrQkFBTyxJQUFJLENBQUUsT0FBTixDQUFjLE9BQWQsRUFBdUIsRUFBdkI7QUFEVCxXQUZGOztRQUtBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDBCQUFoQixDQUFIO1VBQ0UsZUFBQSxHQUFrQixDQUFDLG1DQUFELEVBQXNDLGtDQUF0QztBQUNsQixlQUFBLG1EQUFBOztZQUNFLElBQUEsa0JBQU8sSUFBSSxDQUFFLE9BQU4sQ0FBYyxPQUFkLEVBQXVCLEVBQXZCO0FBRFQsV0FGRjs7UUFLQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw2QkFBaEIsQ0FBSDtVQUNFLGtCQUFBLEdBQXFCLENBQUMsd0JBQUQ7QUFDckIsZUFBQSxzREFBQTs7WUFDRSxJQUFBLGtCQUFPLElBQUksQ0FBRSxPQUFOLENBQWMsT0FBZCxFQUF1QixFQUF2QjtBQURULFdBRkY7O1FBTUEsSUFBQSxrQkFBTyxJQUFJLENBQUUsT0FBTixDQUFjLGdDQUFkLEVBQWdELElBQWhELFdBbEJUOzthQW9CQTtJQXhCUzs7NEJBMEJYLEtBQUEsR0FBTyxTQUFDLElBQUQ7QUFDTCxVQUFBO01BQUEsS0FBQSxrRUFBK0IsQ0FBRTtNQUNqQyxJQUFBLGtCQUFPLElBQUksQ0FBRSxPQUFOLENBQWMsSUFBZCxFQUFvQixFQUFwQjtNQUNQLElBQUEsa0JBQU8sSUFBSSxDQUFFLE9BQU4sQ0FBYyxJQUFkLEVBQW9CLEVBQXBCO01BQ1AsS0FBQSxrQkFBUSxJQUFJLENBQUU7YUFDZCxDQUFDLEtBQUQsRUFBUSxLQUFSO0lBTEs7Ozs7O0FBL0dUIiwic291cmNlc0NvbnRlbnQiOlsiXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBXb3JkY291bnRWaWV3XG4gIENTU19TRUxFQ1RFRF9DTEFTUzogJ3dvcmRjb3VudC1zZWxlY3QnXG5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50ICdkaXYnXG4gICAgQGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnd29yZC1jb3VudCcpXG4gICAgQGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaW5saW5lLWJsb2NrJylcblxuICAgIEBkaXZXb3JkcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ2RpdidcblxuICAgIEBlbGVtZW50LmFwcGVuZENoaWxkKEBkaXZXb3JkcylcblxuICAgIEB3b3JkcmVnZXggPSByZXF1aXJlKCd3b3JkLXJlZ2V4JykoKVxuXG4gIGNoYXJhY3RlcnNUb0hNUzogKGMpIC0+XG4gICAgIyAxLSBDb252ZXJ0IHRvIHNlY29uZHM6XG4gICAgdGVtcCA9IGMgKiA2MFxuICAgIHNlY29uZHMgPSB0ZW1wIC8gYXRvbS5jb25maWcuZ2V0KCd3b3JkY291bnQuY2hhcmFjdGVyc1BlclNlY29uZHMnKVxuICAgICMgMi0gRXh0cmFjdCBob3VyczpcbiAgICAjdmFyIGhvdXJzID0gcGFyc2VJbnQoIHNlY29uZHMgLyAzNjAwICk7IC8vIDMsNjAwIHNlY29uZHMgaW4gMSBob3VyXG4gICAgc2Vjb25kcyA9IHNlY29uZHMgJSAzNjAwXG4gICAgIyBzZWNvbmRzIHJlbWFpbmluZyBhZnRlciBleHRyYWN0aW5nIGhvdXJzXG4gICAgIyAzLSBFeHRyYWN0IG1pbnV0ZXM6XG4gICAgbWludXRlcyA9IHBhcnNlSW50KHNlY29uZHMgLyA2MClcbiAgICAjIDYwIHNlY29uZHMgaW4gMSBtaW51dGVcbiAgICAjIDQtIEtlZXAgb25seSBzZWNvbmRzIG5vdCBleHRyYWN0ZWQgdG8gbWludXRlczpcbiAgICBzZWNvbmRzID0gTWF0aC5yb3VuZChzZWNvbmRzICUgNjApXG4gICAgbWludXRlcyA9ICgnMCcgKyBtaW51dGVzKS5zbGljZSgtMilcbiAgICBzZWNvbmRzID0gKCcwJyArIHNlY29uZHMpLnNsaWNlKC0yKVxuICAgIG1pbnV0ZXMgKyAnOicgKyBzZWNvbmRzXG5cbiAgdXBkYXRlX2NvdW50OiAoZWRpdG9yKSAtPlxuICAgIHRleHRzID0gQGdldFRleHRzIGVkaXRvclxuICAgIHNjb3BlID0gZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWVcbiAgICB3b3JkQ291bnQgPSBjaGFyQ291bnQgPSAwXG4gICAgZm9yIHRleHQgaW4gdGV4dHNcbiAgICAgIHRleHQgPSBAc3RyaXBUZXh0IHRleHQsIGVkaXRvclxuICAgICAgW3dvcmRzLCBjaGFyc10gPSBAY291bnQgdGV4dFxuICAgICAgd29yZENvdW50ICs9IHdvcmRzXG4gICAgICBjaGFyQ291bnQgKz0gY2hhcnNcbiAgICBzdHIgPSAnJ1xuICAgIHN0ciArPSBcIjxzcGFuIGNsYXNzPSd3b3JkY291bnQtd29yZHMnPiN7d29yZENvdW50IHx8IDB9IFc8L3NwYW4+XCIgaWYgYXRvbS5jb25maWcuZ2V0ICd3b3JkY291bnQuc2hvd3dvcmRzJ1xuICAgIHN0ciArPSAoXCI8c3BhbiBjbGFzcz0nd29yZGNvdW50LWNoYXJzJz4je2NoYXJDb3VudCB8fCAwfSBDPC9zcGFuPlwiKSBpZiBhdG9tLmNvbmZpZy5nZXQgJ3dvcmRjb3VudC5zaG93Y2hhcnMnXG4gICAgc3RyICs9IChcIjxzcGFuIGNsYXNzPSd3b3JkY291bnQtdGltZSc+I3sgQGNoYXJhY3RlcnNUb0hNUyBjaGFyQ291bnQgfHwgMH08L3NwYW4+XCIpIGlmIGF0b20uY29uZmlnLmdldCAnd29yZGNvdW50LnNob3d0aW1lJ1xuICAgIHByaWNlUmVzdWx0ID0gd29yZENvdW50KmF0b20uY29uZmlnLmdldCAnd29yZGNvdW50LndvcmRwcmljZSdcbiAgICBzdHIgKz0gKFwiPHNwYW4gY2xhc3M9J3dvcmRjb3VudC1wcmljZSc+I3twcmljZVJlc3VsdC50b0ZpeGVkKDIpIHx8IDB9IDwvc3Bhbj5cIikgKyBhdG9tLmNvbmZpZy5nZXQgJ3dvcmRjb3VudC5jdXJyZW5jeXN5bWJvbCcgaWYgYXRvbS5jb25maWcuZ2V0ICd3b3JkY291bnQuc2hvd3ByaWNlJ1xuICAgIEBkaXZXb3Jkcy5pbm5lckhUTUwgPSBzdHJcbiAgICBpZiBnb2FsID0gYXRvbS5jb25maWcuZ2V0ICd3b3JkY291bnQuZ29hbCdcbiAgICAgIGlmIG5vdCBAZGl2R29hbFxuICAgICAgICBAZGl2R29hbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ2RpdidcbiAgICAgICAgQGRpdkdvYWwuc3R5bGUud2lkdGggPSAnMTAwJSdcbiAgICAgICAgQGVsZW1lbnQuYXBwZW5kQ2hpbGQgQGRpdkdvYWxcbiAgICAgIGdyZWVuID0gTWF0aC5yb3VuZCh3b3JkQ291bnQgLyBnb2FsICogMTAwKVxuICAgICAgZ3JlZW4gPSAxMDAgaWYgZ3JlZW4gPiAxMDBcbiAgICAgIGNvbG9yID0gYXRvbS5jb25maWcuZ2V0ICd3b3JkY291bnQuZ29hbENvbG9yJ1xuICAgICAgY29sb3JCZyA9IGF0b20uY29uZmlnLmdldCAnd29yZGNvdW50LmdvYWxCZ0NvbG9yJ1xuICAgICAgQGRpdkdvYWwuc3R5bGUuYmFja2dyb3VuZCA9ICctd2Via2l0LWxpbmVhci1ncmFkaWVudChsZWZ0LCAnICsgY29sb3IgKyAnICcgKyBncmVlbiArICclLCAnICsgY29sb3JCZyArICcgMCUpJ1xuICAgICAgcGVyY2VudCA9IHBhcnNlRmxvYXQoYXRvbS5jb25maWcuZ2V0ICd3b3JkY291bnQuZ29hbExpbmVIZWlnaHQnKSAvIDEwMFxuICAgICAgaGVpZ2h0ID0gQGVsZW1lbnQuY2xpZW50SGVpZ2h0ICogcGVyY2VudFxuICAgICAgQGRpdkdvYWwuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4J1xuICAgICAgQGRpdkdvYWwuc3R5bGUubWFyZ2luVG9wID0gLWhlaWdodCArICdweCdcblxuICBnZXRUZXh0czogKGVkaXRvcikgPT5cbiAgICAjIE5PVEU6IEEgY3Vyc29yIGlzIGNvbnNpZGVyZWQgYW4gZW1wdHkgc2VsZWN0aW9uIHRvIHRoZSBlZGl0b3JcbiAgICB0ZXh0cyA9IFtdXG4gICAgc2VsZWN0aW9uUmFuZ2VzID0gZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKClcbiAgICBlbXB0eVNlbGVjdGlvbnMgPSB0cnVlXG4gICAgZm9yIHJhbmdlIGluIHNlbGVjdGlvblJhbmdlc1xuICAgICAgdGV4dCA9IGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSlcblxuICAgICAgIyBUZXh0IGZyb20gYnVmZmVyIG1pZ2h0IGJlIGVtcHR5IChubyBzZWxlY3Rpb24gYnV0IGEgY3Vyc29yKVxuICAgICAgaWYgdGV4dFxuICAgICAgICB0ZXh0cy5wdXNoKHRleHQpXG4gICAgICAgIGVtcHR5U2VsZWN0aW9ucyA9IGZhbHNlXG5cbiAgICAjIE5vIG9yIG9ubHkgZW1wdHkgc2VsZWN0aW9ucyB3aWxsIGNhdXNlIHRoZSBlbnRpcmUgZWRpdG9yIHRleHQgdG8gYmUgcmV0dXJuZWQgaW5zdGVhZFxuICAgIGlmIGVtcHR5U2VsZWN0aW9uc1xuICAgICAgdGV4dHMucHVzaChlZGl0b3IuZ2V0VGV4dCgpKVxuICAgICAgQGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSBAQ1NTX1NFTEVDVEVEX0NMQVNTXG4gICAgZWxzZVxuICAgICAgQGVsZW1lbnQuY2xhc3NMaXN0LmFkZCBAQ1NTX1NFTEVDVEVEX0NMQVNTXG5cbiAgICB0ZXh0c1xuXG4gIHN0cmlwVGV4dDogKHRleHQsIGVkaXRvcikgLT5cbiAgICBncmFtbWFyID0gZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWVcbiAgICBzdHJpcGdyYW1tYXJzID0gYXRvbS5jb25maWcuZ2V0KCd3b3JkY291bnQuc3RyaXBncmFtbWFycycpXG5cbiAgICBpZiBncmFtbWFyIGluIHN0cmlwZ3JhbW1hcnNcblxuICAgICAgaWYgYXRvbS5jb25maWcuZ2V0KCd3b3JkY291bnQuaWdub3JlY29kZScpXG4gICAgICAgIGNvZGVQYXR0ZXJucyA9IFsvYHszfSgufFxccykqPyhgezN9fCQpL2csIC9bIF17NH0uKj8kL2dtXVxuICAgICAgICBmb3IgcGF0dGVybiBpbiBjb2RlUGF0dGVybnNcbiAgICAgICAgICB0ZXh0ID0gdGV4dD8ucmVwbGFjZSBwYXR0ZXJuLCAnJ1xuXG4gICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ3dvcmRjb3VudC5pZ25vcmVjb21tZW50cycpXG4gICAgICAgIGNvbW1lbnRQYXR0ZXJucyA9IFsvKDwhLS0oXFxuPyg/Oig/IS0tPikuKSopKygtLT58JCkpL2csIC8oez4+KFxcbj8oPzooPyE8PH0pLikqKSsoPDx9fCQpKS9nXVxuICAgICAgICBmb3IgcGF0dGVybiBpbiBjb21tZW50UGF0dGVybnNcbiAgICAgICAgICB0ZXh0ID0gdGV4dD8ucmVwbGFjZSBwYXR0ZXJuLCAnJ1xuXG4gICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ3dvcmRjb3VudC5pZ25vcmVibG9ja3F1b3RlcycpXG4gICAgICAgIGJsb2NrcXVvdGVQYXR0ZXJucyA9IFsvXlxcc3swLDN9PiguKlxcUy4qXFxuKSsvZ21dXG4gICAgICAgIGZvciBwYXR0ZXJuIGluIGJsb2NrcXVvdGVQYXR0ZXJuc1xuICAgICAgICAgIHRleHQgPSB0ZXh0Py5yZXBsYWNlIHBhdHRlcm4sICcnXG5cbiAgICAgICMgUmVkdWNlIGxpbmtzIHRvIHRleHRcbiAgICAgIHRleHQgPSB0ZXh0Py5yZXBsYWNlIC8oPzpfX3xbKiNdKXxcXFsoLio/KVxcXVxcKC4qP1xcKS9nbSwgJyQxJ1xuXG4gICAgdGV4dFxuXG4gIGNvdW50OiAodGV4dCkgLT5cbiAgICB3b3JkcyA9IHRleHQ/Lm1hdGNoKEB3b3JkcmVnZXgpPy5sZW5ndGhcbiAgICB0ZXh0ID0gdGV4dD8ucmVwbGFjZSAnXFxuJywgJydcbiAgICB0ZXh0ID0gdGV4dD8ucmVwbGFjZSAnXFxyJywgJydcbiAgICBjaGFycyA9IHRleHQ/Lmxlbmd0aFxuICAgIFt3b3JkcywgY2hhcnNdXG4iXX0=
