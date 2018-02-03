(function() {
  var WordcountView,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  module.exports = WordcountView = (function() {
    WordcountView.prototype.CSS_SELECTED_CLASS = 'wordcount-select';

    function WordcountView() {
      this.getTexts = bind(this.getTexts, this);
      this.element = document.createElement('div');
      this.element.classList.add('word-count');
      this.element.classList.add('inline-block');
      this.divWords = document.createElement('div');
      this.element.appendChild(this.divWords);
    }

    WordcountView.prototype.update_count = function(editor) {
      var charCount, chars, color, goal, green, height, i, len, percent, priceResult, ref, text, texts, wordCount, words;
      texts = this.getTexts(editor);
      wordCount = charCount = 0;
      for (i = 0, len = texts.length; i < len; i++) {
        text = texts[i];
        ref = this.count(text), words = ref[0], chars = ref[1];
        wordCount += words;
        charCount += chars;
      }
      this.divWords.innerHTML = (wordCount || 0) + " W";
      if (!atom.config.get('wordcount.hidechars')) {
        this.divWords.innerHTML += " | " + (charCount || 0) + " C";
      }
      priceResult = wordCount * atom.config.get('wordcount.wordprice');
      if (atom.config.get('wordcount.showprice')) {
        this.divWords.innerHTML += (" | " + (priceResult.toFixed(2) || 0) + " ") + atom.config.get('wordcount.currencysymbol');
      }
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
        this.divGoal.style.background = '-webkit-linear-gradient(left, ' + color + ' ' + green + '%, transparent 0%)';
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

    WordcountView.prototype.count = function(text) {
      var chars, codePatterns, i, len, pattern, ref, words;
      if (atom.config.get('wordcount.ignorecode')) {
        codePatterns = [/`{3}(.|\s)*?(`{3}|$)/g, /[ ]{4}.*?$/gm];
        for (i = 0, len = codePatterns.length; i < len; i++) {
          pattern = codePatterns[i];
          text = text != null ? text.replace(pattern, '') : void 0;
        }
      }
      words = text != null ? (ref = text.match(/\S+/g)) != null ? ref.length : void 0 : void 0;
      text = text != null ? text.replace('\n', '') : void 0;
      text = text != null ? text.replace('\r', '') : void 0;
      chars = text != null ? text.length : void 0;
      return [words, chars];
    };

    return WordcountView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2xpYnJhcnkvRW1iZXIgc2F0ZWxsaXRlIHByb2plY3RzL3dyZWF0aGUtYmFzZS91c3Ivc2hhcmUvYXRvbS9wYWNrYWdlcy93b3JkY291bnQvbGliL3dvcmRjb3VudC12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUEsYUFBQTtJQUFBOztFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007NEJBQ0osa0JBQUEsR0FBb0I7O0lBRVAsdUJBQUE7O01BQ1gsSUFBQyxDQUFBLE9BQUQsR0FBVyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QjtNQUNYLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLFlBQXZCO01BQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsY0FBdkI7TUFFQSxJQUFDLENBQUEsUUFBRCxHQUFZLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCO01BRVosSUFBQyxDQUFBLE9BQU8sQ0FBQyxXQUFULENBQXFCLElBQUMsQ0FBQSxRQUF0QjtJQVBXOzs0QkFVYixZQUFBLEdBQWMsU0FBQyxNQUFEO0FBQ1osVUFBQTtNQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsUUFBRCxDQUFVLE1BQVY7TUFDUixTQUFBLEdBQVksU0FBQSxHQUFZO0FBQ3hCLFdBQUEsdUNBQUE7O1FBQ0UsTUFBaUIsSUFBQyxDQUFBLEtBQUQsQ0FBTyxJQUFQLENBQWpCLEVBQUMsY0FBRCxFQUFRO1FBQ1IsU0FBQSxJQUFhO1FBQ2IsU0FBQSxJQUFhO0FBSGY7TUFJQSxJQUFDLENBQUEsUUFBUSxDQUFDLFNBQVYsR0FBd0IsQ0FBQyxTQUFBLElBQWEsQ0FBZCxDQUFBLEdBQWdCO01BQ3hDLElBQUEsQ0FBeUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHFCQUFoQixDQUF6RDtRQUFBLElBQUMsQ0FBQSxRQUFRLENBQUMsU0FBVixJQUF3QixLQUFBLEdBQUssQ0FBQyxTQUFBLElBQWEsQ0FBZCxDQUFMLEdBQXFCLEtBQTdDOztNQUNBLFdBQUEsR0FBYyxTQUFBLEdBQVUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHFCQUFoQjtNQUN4QixJQUE2RyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IscUJBQWhCLENBQTdHO1FBQUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxTQUFWLElBQXdCLENBQUEsS0FBQSxHQUFLLENBQUMsV0FBVyxDQUFDLE9BQVosQ0FBb0IsQ0FBcEIsQ0FBQSxJQUEwQixDQUEzQixDQUFMLEdBQWtDLEdBQWxDLENBQUQsR0FBdUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDBCQUFoQixFQUE5RDs7TUFDQSxJQUFHLElBQUEsR0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0JBQWhCLENBQVY7UUFDRSxJQUFHLENBQUksSUFBQyxDQUFBLE9BQVI7VUFDRSxJQUFDLENBQUEsT0FBRCxHQUFXLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCO1VBQ1gsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBZixHQUF1QjtVQUN2QixJQUFDLENBQUEsT0FBTyxDQUFDLFdBQVQsQ0FBcUIsSUFBQyxDQUFBLE9BQXRCLEVBSEY7O1FBSUEsS0FBQSxHQUFRLElBQUksQ0FBQyxLQUFMLENBQVcsU0FBQSxHQUFZLElBQVosR0FBbUIsR0FBOUI7UUFDUixJQUFlLEtBQUEsR0FBUSxHQUF2QjtVQUFBLEtBQUEsR0FBUSxJQUFSOztRQUNBLEtBQUEsR0FBUSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IscUJBQWhCO1FBQ1IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBZixHQUE0QixnQ0FBQSxHQUFtQyxLQUFuQyxHQUEyQyxHQUEzQyxHQUFpRCxLQUFqRCxHQUF5RDtRQUNyRixPQUFBLEdBQVUsVUFBQSxDQUFXLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQkFBaEIsQ0FBWCxDQUFBLEdBQXlEO1FBQ25FLE1BQUEsR0FBUyxJQUFDLENBQUEsT0FBTyxDQUFDLFlBQVQsR0FBd0I7UUFDakMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBZixHQUF3QixNQUFBLEdBQVM7ZUFDakMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBZixHQUEyQixDQUFDLE1BQUQsR0FBVSxLQVp2Qzs7SUFYWTs7NEJBeUJkLFFBQUEsR0FBVSxTQUFDLE1BQUQ7QUFFUixVQUFBO01BQUEsS0FBQSxHQUFRO01BQ1IsZUFBQSxHQUFrQixNQUFNLENBQUMsdUJBQVAsQ0FBQTtNQUNsQixlQUFBLEdBQWtCO0FBQ2xCLFdBQUEsaURBQUE7O1FBQ0UsSUFBQSxHQUFPLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixLQUE1QjtRQUdQLElBQUcsSUFBSDtVQUNFLEtBQUssQ0FBQyxJQUFOLENBQVcsSUFBWDtVQUNBLGVBQUEsR0FBa0IsTUFGcEI7O0FBSkY7TUFTQSxJQUFHLGVBQUg7UUFDRSxLQUFLLENBQUMsSUFBTixDQUFXLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBWDtRQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQW5CLENBQTBCLElBQUMsQ0FBQSxrQkFBM0IsRUFGRjtPQUFBLE1BQUE7UUFJRSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QixJQUFDLENBQUEsa0JBQXhCLEVBSkY7O2FBTUE7SUFwQlE7OzRCQXNCVixLQUFBLEdBQU8sU0FBQyxJQUFEO0FBQ0wsVUFBQTtNQUFBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNCQUFoQixDQUFIO1FBQ0UsWUFBQSxHQUFlLENBQUMsdUJBQUQsRUFBMEIsY0FBMUI7QUFDZixhQUFBLDhDQUFBOztVQUNFLElBQUEsa0JBQU8sSUFBSSxDQUFFLE9BQU4sQ0FBYyxPQUFkLEVBQXVCLEVBQXZCO0FBRFQsU0FGRjs7TUFJQSxLQUFBLDBEQUEyQixDQUFFO01BQzdCLElBQUEsa0JBQU8sSUFBSSxDQUFFLE9BQU4sQ0FBYyxJQUFkLEVBQW9CLEVBQXBCO01BQ1AsSUFBQSxrQkFBTyxJQUFJLENBQUUsT0FBTixDQUFjLElBQWQsRUFBb0IsRUFBcEI7TUFDUCxLQUFBLGtCQUFRLElBQUksQ0FBRTthQUNkLENBQUMsS0FBRCxFQUFRLEtBQVI7SUFUSzs7Ozs7QUE3RFQiLCJzb3VyY2VzQ29udGVudCI6WyJcbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFdvcmRjb3VudFZpZXdcbiAgQ1NTX1NFTEVDVEVEX0NMQVNTOiAnd29yZGNvdW50LXNlbGVjdCdcblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ2RpdidcbiAgICBAZWxlbWVudC5jbGFzc0xpc3QuYWRkKCd3b3JkLWNvdW50JylcbiAgICBAZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdpbmxpbmUtYmxvY2snKVxuXG4gICAgQGRpdldvcmRzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnZGl2J1xuXG4gICAgQGVsZW1lbnQuYXBwZW5kQ2hpbGQoQGRpdldvcmRzKVxuXG5cbiAgdXBkYXRlX2NvdW50OiAoZWRpdG9yKSAtPlxuICAgIHRleHRzID0gQGdldFRleHRzIGVkaXRvclxuICAgIHdvcmRDb3VudCA9IGNoYXJDb3VudCA9IDBcbiAgICBmb3IgdGV4dCBpbiB0ZXh0c1xuICAgICAgW3dvcmRzLCBjaGFyc10gPSBAY291bnQgdGV4dFxuICAgICAgd29yZENvdW50ICs9IHdvcmRzXG4gICAgICBjaGFyQ291bnQgKz0gY2hhcnNcbiAgICBAZGl2V29yZHMuaW5uZXJIVE1MID0gXCIje3dvcmRDb3VudCB8fCAwfSBXXCJcbiAgICBAZGl2V29yZHMuaW5uZXJIVE1MICs9IChcIiB8ICN7Y2hhckNvdW50IHx8IDB9IENcIikgdW5sZXNzIGF0b20uY29uZmlnLmdldCgnd29yZGNvdW50LmhpZGVjaGFycycpXG4gICAgcHJpY2VSZXN1bHQgPSB3b3JkQ291bnQqYXRvbS5jb25maWcuZ2V0KCd3b3JkY291bnQud29yZHByaWNlJylcbiAgICBAZGl2V29yZHMuaW5uZXJIVE1MICs9IChcIiB8ICN7cHJpY2VSZXN1bHQudG9GaXhlZCgyKSB8fCAwfSBcIikrYXRvbS5jb25maWcuZ2V0KCd3b3JkY291bnQuY3VycmVuY3lzeW1ib2wnKSBpZiBhdG9tLmNvbmZpZy5nZXQoJ3dvcmRjb3VudC5zaG93cHJpY2UnKVxuICAgIGlmIGdvYWwgPSBhdG9tLmNvbmZpZy5nZXQgJ3dvcmRjb3VudC5nb2FsJ1xuICAgICAgaWYgbm90IEBkaXZHb2FsXG4gICAgICAgIEBkaXZHb2FsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnZGl2J1xuICAgICAgICBAZGl2R29hbC5zdHlsZS53aWR0aCA9ICcxMDAlJ1xuICAgICAgICBAZWxlbWVudC5hcHBlbmRDaGlsZCBAZGl2R29hbFxuICAgICAgZ3JlZW4gPSBNYXRoLnJvdW5kKHdvcmRDb3VudCAvIGdvYWwgKiAxMDApXG4gICAgICBncmVlbiA9IDEwMCBpZiBncmVlbiA+IDEwMFxuICAgICAgY29sb3IgPSBhdG9tLmNvbmZpZy5nZXQgJ3dvcmRjb3VudC5nb2FsQ29sb3InXG4gICAgICBAZGl2R29hbC5zdHlsZS5iYWNrZ3JvdW5kID0gJy13ZWJraXQtbGluZWFyLWdyYWRpZW50KGxlZnQsICcgKyBjb2xvciArICcgJyArIGdyZWVuICsgJyUsIHRyYW5zcGFyZW50IDAlKSdcbiAgICAgIHBlcmNlbnQgPSBwYXJzZUZsb2F0KGF0b20uY29uZmlnLmdldCAnd29yZGNvdW50LmdvYWxMaW5lSGVpZ2h0JykgLyAxMDBcbiAgICAgIGhlaWdodCA9IEBlbGVtZW50LmNsaWVudEhlaWdodCAqIHBlcmNlbnRcbiAgICAgIEBkaXZHb2FsLnN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCdcbiAgICAgIEBkaXZHb2FsLnN0eWxlLm1hcmdpblRvcCA9IC1oZWlnaHQgKyAncHgnXG5cbiAgZ2V0VGV4dHM6IChlZGl0b3IpID0+XG4gICAgIyBOT1RFOiBBIGN1cnNvciBpcyBjb25zaWRlcmVkIGFuIGVtcHR5IHNlbGVjdGlvbiB0byB0aGUgZWRpdG9yXG4gICAgdGV4dHMgPSBbXVxuICAgIHNlbGVjdGlvblJhbmdlcyA9IGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcygpXG4gICAgZW1wdHlTZWxlY3Rpb25zID0gdHJ1ZVxuICAgIGZvciByYW5nZSBpbiBzZWxlY3Rpb25SYW5nZXNcbiAgICAgIHRleHQgPSBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UocmFuZ2UpXG5cbiAgICAgICMgVGV4dCBmcm9tIGJ1ZmZlciBtaWdodCBiZSBlbXB0eSAobm8gc2VsZWN0aW9uIGJ1dCBhIGN1cnNvcilcbiAgICAgIGlmIHRleHRcbiAgICAgICAgdGV4dHMucHVzaCh0ZXh0KVxuICAgICAgICBlbXB0eVNlbGVjdGlvbnMgPSBmYWxzZVxuXG4gICAgIyBObyBvciBvbmx5IGVtcHR5IHNlbGVjdGlvbnMgd2lsbCBjYXVzZSB0aGUgZW50aXJlIGVkaXRvciB0ZXh0IHRvIGJlIHJldHVybmVkIGluc3RlYWRcbiAgICBpZiBlbXB0eVNlbGVjdGlvbnNcbiAgICAgIHRleHRzLnB1c2goZWRpdG9yLmdldFRleHQoKSlcbiAgICAgIEBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUgQENTU19TRUxFQ1RFRF9DTEFTU1xuICAgIGVsc2VcbiAgICAgIEBlbGVtZW50LmNsYXNzTGlzdC5hZGQgQENTU19TRUxFQ1RFRF9DTEFTU1xuXG4gICAgdGV4dHNcblxuICBjb3VudDogKHRleHQpIC0+XG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCd3b3JkY291bnQuaWdub3JlY29kZScpXG4gICAgICBjb2RlUGF0dGVybnMgPSBbL2B7M30oLnxcXHMpKj8oYHszfXwkKS9nLCAvWyBdezR9Lio/JC9nbV1cbiAgICAgIGZvciBwYXR0ZXJuIGluIGNvZGVQYXR0ZXJuc1xuICAgICAgICB0ZXh0ID0gdGV4dD8ucmVwbGFjZSBwYXR0ZXJuLCAnJ1xuICAgIHdvcmRzID0gdGV4dD8ubWF0Y2goL1xcUysvZyk/Lmxlbmd0aFxuICAgIHRleHQgPSB0ZXh0Py5yZXBsYWNlICdcXG4nLCAnJ1xuICAgIHRleHQgPSB0ZXh0Py5yZXBsYWNlICdcXHInLCAnJ1xuICAgIGNoYXJzID0gdGV4dD8ubGVuZ3RoXG4gICAgW3dvcmRzLCBjaGFyc11cbiJdfQ==
