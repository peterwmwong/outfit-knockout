System.register(["base/build/svengali"], function($__export) {
  "use strict";
  var State;
  return {
    setters: [function(m) {
      State = m.State;
    }],
    execute: function() {
      xdescribe('State', (function() {
        describe('new State(parent, stateChart, definition:Object)', (function() {
          describe('definition.concurrent [Boolean] Is a concurrent state if true, default is false', (function() {
            it('should default `concurrent` to `false`, when not specified', function() {
              var s = new State(null, null, {});
              expect(s.concurrent).toBe(false);
            });
            it('should set `concurrent` to `true`, when `true`', function() {
              var s = new State(null, null, {concurrent: true});
              expect(s.concurrent).toBe(true);
            });
          }));
          describe('definition.history [Boolean] Is a history state if true, default is false', (function() {
            it('should default `history` to `false`, when not specified', (function() {
              var s = new State(null, null, {});
              expect(s.history).toBe(false);
            }));
            it('should set `concurrent` to `true`, when `true`', (function() {
              var s = new State(null, null, {history: true});
              expect(s.history).toBe(true);
            }));
            it('should throw an exception if `concurrent` and `history` are set', function() {
              expect(function() {
                new State(null, null, {
                  concurrent: true,
                  history: true
                });
              }).toThrow('State: history states are not allowed on concurrent states');
            });
          }));
        }));
      }));
    }
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkB0cmFjZXVyL2dlbmVyYXRlZC9UZW1wbGF0ZVBhcnNlci8xIiwiQHRyYWNldXIvZ2VuZXJhdGVkL1RlbXBsYXRlUGFyc2VyLzAiLCJAdHJhY2V1ci9nZW5lcmF0ZWQvVGVtcGxhdGVQYXJzZXIvMyIsIkB0cmFjZXVyL2dlbmVyYXRlZC9UZW1wbGF0ZVBhcnNlci8yIiwiU3RhdGVfc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxLQUFLLFNBQVMsQUFBQyx5QkFBb0IsVUFBUyxTQUFROzs7QUNBcEQsT0FBTztBQUNELFVBQU0sR0NEWixTQUFTLENBQUEsQ0FBRztBQ0FaLFlBQW9CLEVBQUEsTUFBa0IsQ0FBQztJREUvQixDRER1QjtBQUN6QixVQUFNO0FHQVosY0FBUSxBQUFDLENBQUMsT0FBTSxHQUFHLFNBQUEsQUFBQztBQUNsQixlQUFPLEFBQUMsQ0FBQyxrREFBaUQsR0FBRyxTQUFBLEFBQUM7QUFDNUQsaUJBQU8sQUFBQyxDQUFDLGlGQUFnRixHQUFHLFNBQUEsQUFBQyxDQUFHO0FBQzlGLGFBQUMsQUFBQyxDQUFDLDREQUEyRCxDQUFHLFVBQVEsQUFBQyxDQUFFO0FBQzFFLEFBQUksZ0JBQUEsQ0FBQSxDQUFBLEVBQUksSUFBSSxNQUFJLEFBQUMsQ0FBQyxJQUFHLENBQUcsS0FBRyxDQUFHLEdBQUMsQ0FBQyxDQUFDO0FBQ2pDLG1CQUFLLEFBQUMsQ0FBQyxDQUFBLFdBQVcsQ0FBQyxLQUFLLEFBQUMsQ0FBQyxLQUFJLENBQUMsQ0FBQztZQUNsQyxDQUFDLENBQUM7QUFFRixhQUFDLEFBQUMsQ0FBQyxnREFBK0MsQ0FBRyxVQUFRLEFBQUMsQ0FBRTtBQUM5RCxBQUFJLGdCQUFBLENBQUEsQ0FBQSxFQUFJLElBQUksTUFBSSxBQUFDLENBQUMsSUFBRyxDQUFHLEtBQUcsQ0FBRyxFQUFDLFVBQVMsQ0FBRyxLQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2pELG1CQUFLLEFBQUMsQ0FBQyxDQUFBLFdBQVcsQ0FBQyxLQUFLLEFBQUMsQ0FBQyxJQUFHLENBQUMsQ0FBQztZQUNqQyxDQUFDLENBQUM7VUFDSixFQUFDLENBQUM7QUFFRixpQkFBTyxBQUFDLENBQUMsMkVBQTBFLEdBQUcsU0FBQSxBQUFDO0FBQ3JGLGFBQUMsQUFBQyxDQUFDLHlEQUF3RCxHQUFHLFNBQUEsQUFBQyxDQUFHO0FBQ2hFLEFBQUksZ0JBQUEsQ0FBQSxDQUFBLEVBQUksSUFBSSxNQUFJLEFBQUMsQ0FBQyxJQUFHLENBQUcsS0FBRyxDQUFHLEdBQUMsQ0FBQyxDQUFDO0FBQ2pDLG1CQUFLLEFBQUMsQ0FBQyxDQUFBLFFBQVEsQ0FBQyxLQUFLLEFBQUMsQ0FBQyxLQUFJLENBQUMsQ0FBQztZQUMvQixFQUFDLENBQUM7QUFFRixhQUFDLEFBQUMsQ0FBQyxnREFBK0MsR0FBRyxTQUFBLEFBQUMsQ0FBRztBQUN2RCxBQUFJLGdCQUFBLENBQUEsQ0FBQSxFQUFJLElBQUksTUFBSSxBQUFDLENBQUMsSUFBRyxDQUFHLEtBQUcsQ0FBRyxFQUFDLE9BQU0sQ0FBRyxLQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzlDLG1CQUFLLEFBQUMsQ0FBQyxDQUFBLFFBQVEsQ0FBQyxLQUFLLEFBQUMsQ0FBQyxJQUFHLENBQUMsQ0FBQztZQUM5QixFQUFDLENBQUM7QUFFRixhQUFDLEFBQUMsQ0FBQyxpRUFBZ0UsQ0FBRyxVQUFRLEFBQUMsQ0FBRTtBQUMvRSxtQkFBSyxBQUFDLENBQUMsU0FBUSxBQUFDLENBQUU7QUFDaEIsa0JBQUksTUFBSSxBQUFDLENBQUMsSUFBRyxDQUFHLEtBQUcsQ0FBRztBQUFDLDJCQUFTLENBQUcsS0FBRztBQUFHLHdCQUFNLENBQUcsS0FBRztBQUFBLGdCQUFDLENBQUMsQ0FBQztjQUMxRCxDQUFDLFFBQVEsQUFBQyxDQUFDLDREQUEyRCxDQUFDLENBQUM7WUFDMUUsQ0FBQyxDQUFDO1VBQ0osRUFBQyxDQUFDO1FBQ0osRUFBQyxDQUFDO01BQ0osRUFBQyxDQUFBO0lIaEM4QjtFQUMzQixDQUFBO0FEREksQ0FBQyxDQUFDO0FJaUNWIiwiZmlsZSI6IlN0YXRlX3NwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJTeXN0ZW0ucmVnaXN0ZXIoJF9fcGxhY2Vob2xkZXJfXzAsIGZ1bmN0aW9uKCRfX2V4cG9ydCkge1xuICAgICAgICAgICRfX3BsYWNlaG9sZGVyX18xXG4gICAgICAgIH0pOyIsInJldHVybiB7XG4gICAgICBzZXR0ZXJzOiAkX19wbGFjZWhvbGRlcl9fMCxcbiAgICAgIGV4ZWN1dGU6ICRfX3BsYWNlaG9sZGVyX18xXG4gICAgfSIsImZ1bmN0aW9uKG0pIHtcbiAgICAgICAgICAkX19wbGFjZWhvbGRlcl9fMFxuICAgICAgICB9IiwiJF9fcGxhY2Vob2xkZXJfXzAgPSBtLiRfX3BsYWNlaG9sZGVyX18xOyIsImltcG9ydCB7U3RhdGV9IGZyb20gJ2Jhc2UvYnVpbGQvc3ZlbmdhbGknO1xuXG54ZGVzY3JpYmUoJ1N0YXRlJywgKCk9PntcbiAgZGVzY3JpYmUoJ25ldyBTdGF0ZShwYXJlbnQsIHN0YXRlQ2hhcnQsIGRlZmluaXRpb246T2JqZWN0KScsICgpPT57XG4gICAgZGVzY3JpYmUoJ2RlZmluaXRpb24uY29uY3VycmVudCBbQm9vbGVhbl0gSXMgYSBjb25jdXJyZW50IHN0YXRlIGlmIHRydWUsIGRlZmF1bHQgaXMgZmFsc2UnLCAoKT0+e1xuICAgICAgaXQoJ3Nob3VsZCBkZWZhdWx0IGBjb25jdXJyZW50YCB0byBgZmFsc2VgLCB3aGVuIG5vdCBzcGVjaWZpZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHMgPSBuZXcgU3RhdGUobnVsbCwgbnVsbCwge30pO1xuICAgICAgICBleHBlY3Qocy5jb25jdXJyZW50KS50b0JlKGZhbHNlKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIHNldCBgY29uY3VycmVudGAgdG8gYHRydWVgLCB3aGVuIGB0cnVlYCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcyA9IG5ldyBTdGF0ZShudWxsLCBudWxsLCB7Y29uY3VycmVudDogdHJ1ZX0pO1xuICAgICAgICBleHBlY3Qocy5jb25jdXJyZW50KS50b0JlKHRydWUpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZGVmaW5pdGlvbi5oaXN0b3J5IFtCb29sZWFuXSBJcyBhIGhpc3Rvcnkgc3RhdGUgaWYgdHJ1ZSwgZGVmYXVsdCBpcyBmYWxzZScsICgpPT57XG4gICAgICBpdCgnc2hvdWxkIGRlZmF1bHQgYGhpc3RvcnlgIHRvIGBmYWxzZWAsIHdoZW4gbm90IHNwZWNpZmllZCcsICgpPT57XG4gICAgICAgIHZhciBzID0gbmV3IFN0YXRlKG51bGwsIG51bGwsIHt9KTtcbiAgICAgICAgZXhwZWN0KHMuaGlzdG9yeSkudG9CZShmYWxzZSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBzZXQgYGNvbmN1cnJlbnRgIHRvIGB0cnVlYCwgd2hlbiBgdHJ1ZWAnLCAoKT0+e1xuICAgICAgICB2YXIgcyA9IG5ldyBTdGF0ZShudWxsLCBudWxsLCB7aGlzdG9yeTogdHJ1ZX0pO1xuICAgICAgICBleHBlY3Qocy5oaXN0b3J5KS50b0JlKHRydWUpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGBjb25jdXJyZW50YCBhbmQgYGhpc3RvcnlgIGFyZSBzZXQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIG5ldyBTdGF0ZShudWxsLCBudWxsLCB7Y29uY3VycmVudDogdHJ1ZSwgaGlzdG9yeTogdHJ1ZX0pO1xuICAgICAgICB9KS50b1Rocm93KCdTdGF0ZTogaGlzdG9yeSBzdGF0ZXMgYXJlIG5vdCBhbGxvd2VkIG9uIGNvbmN1cnJlbnQgc3RhdGVzJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9