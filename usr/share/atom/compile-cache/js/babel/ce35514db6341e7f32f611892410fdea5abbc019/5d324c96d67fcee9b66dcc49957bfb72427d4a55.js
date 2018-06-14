Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = reducer;
'use babel';

var initialState = {
  refactorInProgress: false
};

function reducer(state, action) {
  if (state === undefined) state = initialState;

  switch (action.type) {
    case 'refactor-start':
      return _extends({}, state, {
        refactorInProgress: true
      });
    case 'refactor-end':
      return _extends({}, state, {
        refactorInProgress: false
      });
    default:
      return state;
  }
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9saWJyYXJ5L0VtYmVyIHNhdGVsbGl0ZSBwcm9qZWN0cy93cmVhdGhlLWJhc2UvdXNyL3NoYXJlL2F0b20vcGFja2FnZXMvamF2YXNjcmlwdC1yZWZhY3Rvci9saWIvcmVkdWNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7cUJBU3dCLE9BQU87QUFUL0IsV0FBVyxDQUFDOztBQUtaLElBQU0sWUFBWSxHQUFHO0FBQ25CLG9CQUFrQixFQUFFLEtBQUs7Q0FDMUIsQ0FBQzs7QUFFYSxTQUFTLE9BQU8sQ0FBQyxLQUFhLEVBQWlCLE1BQWMsRUFBRTtNQUE5QyxLQUFhLGdCQUFiLEtBQWEsR0FBRyxZQUFZOztBQUMxRCxVQUFRLE1BQU0sQ0FBQyxJQUFJO0FBQ2pCLFNBQUssZ0JBQWdCO0FBQ25CLDBCQUNLLEtBQUs7QUFDUiwwQkFBa0IsRUFBRSxJQUFJO1NBQ3hCO0FBQUEsQUFDSixTQUFLLGNBQWM7QUFDakIsMEJBQ0ssS0FBSztBQUNSLDBCQUFrQixFQUFFLEtBQUs7U0FDekI7QUFBQSxBQUNKO0FBQ0UsYUFBTyxLQUFLLENBQUM7QUFBQSxHQUNoQjtDQUNGIiwiZmlsZSI6Ii9saWJyYXJ5L0VtYmVyIHNhdGVsbGl0ZSBwcm9qZWN0cy93cmVhdGhlLWJhc2UvdXNyL3NoYXJlL2F0b20vcGFja2FnZXMvamF2YXNjcmlwdC1yZWZhY3Rvci9saWIvcmVkdWNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG4vLyBAZmxvd1xuaW1wb3J0IHR5cGUgeyBTdGF0ZSwgQWN0aW9uIH0gZnJvbSAnLi90eXBlcyc7XG5cbmNvbnN0IGluaXRpYWxTdGF0ZSA9IHtcbiAgcmVmYWN0b3JJblByb2dyZXNzOiBmYWxzZSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlZHVjZXIoc3RhdGU/OiBTdGF0ZSA9IGluaXRpYWxTdGF0ZSwgYWN0aW9uOiBBY3Rpb24pIHtcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgJ3JlZmFjdG9yLXN0YXJ0JzpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICByZWZhY3RvckluUHJvZ3Jlc3M6IHRydWUsXG4gICAgICB9O1xuICAgIGNhc2UgJ3JlZmFjdG9yLWVuZCc6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgcmVmYWN0b3JJblByb2dyZXNzOiBmYWxzZSxcbiAgICAgIH07XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuIl19