(function() {
  var Emitter, ModuleManager, isFunction, packages, satisfies,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  satisfies = require('semver').satisfies;

  Emitter = require('atom').Emitter;

  packages = atom.packages;

  isFunction = function(func) {
    return (typeof func) === 'function';
  };

  module.exports = ModuleManager = (function() {
    function ModuleManager() {
      this.update = bind(this.update, this);
      this.version = require('../package.json').version;
      this.modules = {};
      this.emitter = new Emitter;
      this.update();
    }

    ModuleManager.prototype.dispose = function() {
      this.modules = null;
      return this.emitter.dispose();
    };

    ModuleManager.prototype.onActivated = function(callback) {
      return this.emitter.on('activated', callback);
    };

    ModuleManager.prototype.update = function() {
      var engines, i, len, metaData, name, ref, requiredVersion, results;
      this.modules = {};
      ref = packages.getAvailablePackageMetadata();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        metaData = ref[i];
        name = metaData.name, engines = metaData.engines;
        if (!(!packages.isPackageDisabled(name) && ((requiredVersion = engines != null ? engines.refactor : void 0) != null) && satisfies(this.version, requiredVersion))) {
          continue;
        }
        results.push(this.activate(name));
      }
      return results;
    };

    ModuleManager.prototype.activate = function(name) {
      return packages.activatePackage(name).then((function(_this) {
        return function(pkg) {
          var Ripper, i, len, module, ref, scopeName;
          Ripper = (module = pkg.mainModule).Ripper;
          if (!((Ripper != null) && Array.isArray(Ripper.scopeNames) && isFunction(Ripper.prototype.parse) && isFunction(Ripper.prototype.find))) {
            console.error("'" + name + "' should implement Ripper.scopeNames, Ripper.parse() and Ripper.find()");
            return;
          }
          ref = Ripper.scopeNames;
          for (i = 0, len = ref.length; i < len; i++) {
            scopeName = ref[i];
            _this.modules[scopeName] = module;
          }
          return _this.emitter.emit('activated', name);
        };
      })(this));
    };

    ModuleManager.prototype.getModule = function(sourceName) {
      return this.modules[sourceName];
    };

    return ModuleManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2xpYnJhcnkvRW1iZXIgc2F0ZWxsaXRlIHByb2plY3RzL3dyZWF0aGUtYmFzZS91c3Ivc2hhcmUvYXRvbS9wYWNrYWdlcy9yZWZhY3Rvci9saWIvbW9kdWxlX21hbmFnZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSx1REFBQTtJQUFBOztFQUFFLFlBQWMsT0FBQSxDQUFRLFFBQVI7O0VBQ2QsVUFBWSxPQUFBLENBQVEsTUFBUjs7RUFDWixXQUFhOztFQUVmLFVBQUEsR0FBYSxTQUFDLElBQUQ7V0FBVSxDQUFDLE9BQU8sSUFBUixDQUFBLEtBQWlCO0VBQTNCOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFFUyx1QkFBQTs7TUFDVCxJQUFDLENBQUEsVUFBWSxPQUFBLENBQVEsaUJBQVIsRUFBWjtNQUNILElBQUMsQ0FBQSxPQUFELEdBQVc7TUFDWCxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUk7TUFFZixJQUFDLENBQUEsTUFBRCxDQUFBO0lBTFc7OzRCQU9iLE9BQUEsR0FBUyxTQUFBO01BQ1AsSUFBQyxDQUFBLE9BQUQsR0FBVzthQUNYLElBQUMsQ0FBQSxPQUFPLENBQUMsT0FBVCxDQUFBO0lBRk87OzRCQUlULFdBQUEsR0FBYSxTQUFDLFFBQUQ7YUFDWCxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxXQUFaLEVBQXlCLFFBQXpCO0lBRFc7OzRCQUdiLE1BQUEsR0FBUSxTQUFBO0FBQ04sVUFBQTtNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVc7QUFFWDtBQUFBO1dBQUEscUNBQUE7O1FBRUksb0JBQUYsRUFBUTtRQUNSLElBQUEsQ0FBQSxDQUFnQixDQUFDLFFBQVEsQ0FBQyxpQkFBVCxDQUEyQixJQUEzQixDQUFELElBQ0EseUVBREEsSUFFQSxTQUFBLENBQVUsSUFBQyxDQUFBLE9BQVgsRUFBb0IsZUFBcEIsQ0FGaEIsQ0FBQTtBQUFBLG1CQUFBOztxQkFHQSxJQUFDLENBQUEsUUFBRCxDQUFVLElBQVY7QUFORjs7SUFITTs7NEJBV1IsUUFBQSxHQUFVLFNBQUMsSUFBRDthQUNSLFFBQ0EsQ0FBQyxlQURELENBQ2lCLElBRGpCLENBRUEsQ0FBQyxJQUZELENBRU0sQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEdBQUQ7QUFFSixjQUFBO1VBQUUsU0FBVyxDQUFBLE1BQUEsR0FBUyxHQUFHLENBQUMsVUFBYjtVQUNiLElBQUEsQ0FBQSxDQUFPLGdCQUFBLElBQ0EsS0FBSyxDQUFDLE9BQU4sQ0FBYyxNQUFNLENBQUMsVUFBckIsQ0FEQSxJQUVBLFVBQUEsQ0FBVyxNQUFNLENBQUEsU0FBRSxDQUFBLEtBQW5CLENBRkEsSUFHQSxVQUFBLENBQVcsTUFBTSxDQUFBLFNBQUUsQ0FBQSxJQUFuQixDQUhQLENBQUE7WUFJRSxPQUFPLENBQUMsS0FBUixDQUFjLEdBQUEsR0FBSSxJQUFKLEdBQVMsd0VBQXZCO0FBQ0EsbUJBTEY7O0FBT0E7QUFBQSxlQUFBLHFDQUFBOztZQUNFLEtBQUMsQ0FBQSxPQUFRLENBQUEsU0FBQSxDQUFULEdBQXNCO0FBRHhCO2lCQUdBLEtBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLFdBQWQsRUFBMkIsSUFBM0I7UUFiSTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FGTjtJQURROzs0QkFrQlYsU0FBQSxHQUFXLFNBQUMsVUFBRDthQUNULElBQUMsQ0FBQSxPQUFRLENBQUEsVUFBQTtJQURBOzs7OztBQXBEYiIsInNvdXJjZXNDb250ZW50IjpbInsgc2F0aXNmaWVzIH0gPSByZXF1aXJlICdzZW12ZXInXG57IEVtaXR0ZXIgfSA9IHJlcXVpcmUgJ2F0b20nXG57IHBhY2thZ2VzIH0gPSBhdG9tXG5cbmlzRnVuY3Rpb24gPSAoZnVuYykgLT4gKHR5cGVvZiBmdW5jKSBpcyAnZnVuY3Rpb24nXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIE1vZHVsZU1hbmFnZXJcblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICB7IEB2ZXJzaW9uIH0gPSByZXF1aXJlICcuLi9wYWNrYWdlLmpzb24nXG4gICAgQG1vZHVsZXMgPSB7fVxuICAgIEBlbWl0dGVyID0gbmV3IEVtaXR0ZXJcbiAgICAjVE9ETyB1cGRhdGUgd2hlbiBwYWNrYWdlIGlzIGVuYWJsZWRcbiAgICBAdXBkYXRlKClcblxuICBkaXNwb3NlOiAtPlxuICAgIEBtb2R1bGVzID0gbnVsbFxuICAgIEBlbWl0dGVyLmRpc3Bvc2UoKVxuXG4gIG9uQWN0aXZhdGVkOiAoY2FsbGJhY2spIC0+XG4gICAgQGVtaXR0ZXIub24gJ2FjdGl2YXRlZCcsIGNhbGxiYWNrXG5cbiAgdXBkYXRlOiA9PlxuICAgIEBtb2R1bGVzID0ge31cbiAgICAjIFNlYXJjaCBwYWNrYWdlcyByZWxhdGVkIHRvIHJlZmFjdG9yIHBhY2thZ2UuXG4gICAgZm9yIG1ldGFEYXRhIGluIHBhY2thZ2VzLmdldEF2YWlsYWJsZVBhY2thZ2VNZXRhZGF0YSgpXG4gICAgICAjIFZlcmlmeSBlbmFibGVkLCBkZWZpbmVkIGluIGVuZ2luZXMsIGFuZCBzYXRpc2ZpZWQgdmVyc2lvbi5cbiAgICAgIHsgbmFtZSwgZW5naW5lcyB9ID0gbWV0YURhdGFcbiAgICAgIGNvbnRpbnVlIHVubGVzcyAhcGFja2FnZXMuaXNQYWNrYWdlRGlzYWJsZWQobmFtZSkgYW5kXG4gICAgICAgICAgICAgICAgICAgICAgKHJlcXVpcmVkVmVyc2lvbiA9IGVuZ2luZXM/LnJlZmFjdG9yKT8gYW5kXG4gICAgICAgICAgICAgICAgICAgICAgc2F0aXNmaWVzIEB2ZXJzaW9uLCByZXF1aXJlZFZlcnNpb25cbiAgICAgIEBhY3RpdmF0ZSBuYW1lXG5cbiAgYWN0aXZhdGU6IChuYW1lKSAtPlxuICAgIHBhY2thZ2VzXG4gICAgLmFjdGl2YXRlUGFja2FnZSBuYW1lXG4gICAgLnRoZW4gKHBrZykgPT5cbiAgICAgICMgVmVyaWZ5IG1vZHVsZSBpbnRlcmZhY2UuXG4gICAgICB7IFJpcHBlciB9ID0gbW9kdWxlID0gcGtnLm1haW5Nb2R1bGVcbiAgICAgIHVubGVzcyBSaXBwZXI/IGFuZFxuICAgICAgICAgICAgIEFycmF5LmlzQXJyYXkoUmlwcGVyLnNjb3BlTmFtZXMpIGFuZFxuICAgICAgICAgICAgIGlzRnVuY3Rpb24oUmlwcGVyOjpwYXJzZSkgYW5kXG4gICAgICAgICAgICAgaXNGdW5jdGlvbihSaXBwZXI6OmZpbmQpXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgXCInI3tuYW1lfScgc2hvdWxkIGltcGxlbWVudCBSaXBwZXIuc2NvcGVOYW1lcywgUmlwcGVyLnBhcnNlKCkgYW5kIFJpcHBlci5maW5kKClcIlxuICAgICAgICByZXR1cm5cblxuICAgICAgZm9yIHNjb3BlTmFtZSBpbiBSaXBwZXIuc2NvcGVOYW1lc1xuICAgICAgICBAbW9kdWxlc1tzY29wZU5hbWVdID0gbW9kdWxlXG5cbiAgICAgIEBlbWl0dGVyLmVtaXQgJ2FjdGl2YXRlZCcsIG5hbWVcblxuICBnZXRNb2R1bGU6IChzb3VyY2VOYW1lKSAtPlxuICAgIEBtb2R1bGVzW3NvdXJjZU5hbWVdXG4iXX0=
