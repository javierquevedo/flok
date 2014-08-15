'use strict';
/**
 * Task Class tests
 */
/*global suite, setup, test, teardown, assert */
/*global Task */
suite('Task Class', function() {
    // before each
    setup(function() {
        // TODO
    });

    suite('Task()', function() {
        test('No params creates empty task', function() {
            var task = new Task();
            // Check that default values are correct
            assert.equal(task.isComplete(), false, 'task is not complete by default');
            assert.equal(task.isActive(), true, 'task starts active by default');
            assert.equal(task.totalManualChange, 0, 'task has no manual change by default');
            assert.equal(task.name, '', 'ticket name is empty by default');
        });

        test('Constructor parameters work', function() {
            var name = 'Work on flok';
            var task = new Task(
                name,
                60000, // 1 minute in ms
                new Date(946684799000),
                new Date(946684801000),
                30000,
                true
            );
            // Check that default values are correct
            assert.equal(task.name, name);
            assert.equal(task.isComplete(), true);
            assert.equal(task.isActive(), false);
            assert.equal(task.totalManualChange, 30000);
            assert.equal(task.totalDuration, 92000);
        });
    });


    suite('createFromJSON()', function() {
        test('Empty args creates default', function() {
            var task = Task.createFromJSON();
            // Check that default values are correct
            assert.equal(task.isComplete(), false);
            assert.equal(task.isActive(), true);
            assert.equal(task.totalManualChange, 0);
            assert.equal(task.totalDuration, 0);
            assert.equal(task.name, '');
        });

        test('Non Empty parameters correctly loaded', function() {
            var name = 'Random';
            var jsonTask = {
                name: name,
                pastDuration: 123,
                totalManualChange: 123456,
                startTime: '',
                endTime: '',
                completed: true
            };
            var task = Task.createFromJSON(jsonTask);
            // Check that default values are correct
            assert.equal(task.isComplete(), true);
            assert.equal(task.isActive(), true);
            assert.equal(task.totalManualChange, 123456);
            assert.equal(task.totalDuration, 123579);
            assert.equal(task.name, name);
        });
    });

    /**
     * TODO
     * continue
     * reset
     * stop
     * updateDuration
     */

        // TODO Please to test more:
//    suite('someFunction()', function () {
//        test('some expectations', function () {
//            // Disapointement
//        });
//    });

        //after each
    teardown(function() {
        // Can and should restore any classes that were mocked here
    });
});
