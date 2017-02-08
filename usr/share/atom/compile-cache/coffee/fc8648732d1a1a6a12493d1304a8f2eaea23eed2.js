(function() {
  var Git, getPath;

  Git = require('promised-git');

  getPath = function() {
    var _ref;
    if ((_ref = atom.project) != null ? _ref.getRepositories()[0] : void 0) {
      return atom.project.getRepositories()[0].getWorkingDirectory();
    } else if (atom.project) {
      return atom.project.getPath();
    } else {
      return __dirname;
    }
  };

  module.exports = new Git(getPath());

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUva3lhbi8uYXRvbS9wYWNrYWdlcy9hdG9tYXRpZ2l0L2xpYi9naXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFlBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGNBQVIsQ0FBTixDQUFBOztBQUFBLEVBRUEsT0FBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLFFBQUEsSUFBQTtBQUFBLElBQUEsd0NBQWUsQ0FBRSxlQUFkLENBQUEsQ0FBZ0MsQ0FBQSxDQUFBLFVBQW5DO2FBQ0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFiLENBQUEsQ0FBK0IsQ0FBQSxDQUFBLENBQUUsQ0FBQyxtQkFBbEMsQ0FBQSxFQURGO0tBQUEsTUFFSyxJQUFHLElBQUksQ0FBQyxPQUFSO2FBQ0gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFiLENBQUEsRUFERztLQUFBLE1BQUE7YUFHSCxVQUhHO0tBSEc7RUFBQSxDQUZWLENBQUE7O0FBQUEsRUFVQSxNQUFNLENBQUMsT0FBUCxHQUFxQixJQUFBLEdBQUEsQ0FBSSxPQUFBLENBQUEsQ0FBSixDQVZyQixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/kyan/.atom/packages/atomatigit/lib/git.coffee
