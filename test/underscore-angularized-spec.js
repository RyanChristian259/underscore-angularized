/*global angular, beforeEach, afterEach, describe, expect, it, spyOn, xdescribe, xit, module, inject */

(function () {
    'use strict';
    /**
     * Ensure Angular and our Underscore factory load properly...
     */
    describe('Underscore-Angularized Test Suite', function () {
        var _;

        /**
         * Load the underscore-angularized module and various Angular services.
         */
        beforeEach(function () {
            angular.mock.module('underscore-angularized');

            angular.mock.inject(function (underscore) {
                _ = underscore;
            });

        });

        describe('Angular/Underscore Initialization', function () {
            /**
             * Make sure Angular is loaded...
             */
            it('AngularJS is loaded onto the window object', function () {
                expect(window.angular).toBeDefined();
            });


            /**
             * Make sure the underscore factory is defined.
             */
            it('Underscore is defined', function () {
                expect(_).toBeDefined();
            });


            /**
             * We need to make sure Underscore doesn't leak onto the Window object.
             */
            it('Underscore is not on the window object', function () {
                expect(window._).toBeUndefined();
                expect(window.underscore).toBeUndefined();
            });


        });


        describe('Underscore Functionality', function () {

            /**
             * Can it pull out the first element of an array
             */
            it('first', function () {
                expect(_.first([1, 2, 3])).toEqual(1);
                expect(_([1, 2, 3]).first()).toEqual(1);
                expect(_.first([1, 2, 3], 0)).toEqual([]);
                expect(_.first([1, 2, 3], 2)).toEqual([1,2]);
                expect(_.first([1, 2, 3], 5)).toEqual([1,2,3]);

                var result = (function(){ return _.first(arguments); }(4, 3, 2, 1));
                expect(result).toEqual(4);

                result = _.map([[1, 2, 3], [1, 2, 3]], _.first);
                expect(result).toEqual([1, 1]);

                result = (function() { return _.first([1, 2, 3], 2); }());
                expect(result).toEqual([1,2]);

                expect(_.first(null)).toEqual(undefined);
                
                expect(_.first([1, 2, 3], -1).length).toEqual(0);
            });



            it('head', function() {
                expect(_.first).toEqual(_.head); 
            });


            it('take', function() {
                expect(_.first).toEqual(_.take);
            });

            it('rest', function() {
                var numbers = [1, 2, 3, 4];
                expect(_.rest(numbers)).toEqual([2, 3, 4]); //
                expect(_.rest(numbers, 0)).toEqual([1, 2, 3, 4]);
                expect(_.rest(numbers, 2)).toEqual([3,4]);
                var result = (function(){ return _(arguments).rest(); }(1, 2, 3, 4));
                expect(result).toEqual([2, 3, 4]);
                result = _.map([[1, 2, 3], [1, 2, 3]], _.rest);
                expect(_.flatten(result)).toEqual([2, 3, 2, 3]);
                result = (function(){ return _(arguments).rest(); }(1, 2, 3, 4));
                expect(result).toEqual([2, 3, 4]);
            });

            it('tail', function() {
                expect(_.rest).toEqual(_.tail);
            });

            it('drop', function() {
                expect(_.rest).toEqual(_.drop);
            });

            it('initial', function() {
                expect(_.initial([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4]);
                expect(_.initial([1, 2, 3, 4], 2)).toEqual([1,2]);
                expect(_.initial([1, 2, 3, 4], 6)).toEqual([]);
                var result = (function(){ return _(arguments).initial(); }(1, 2, 3, 4));
                expect(result).toEqual([1, 2, 3]);
                result = _.map([[1, 2, 3], [1, 2, 3]], _.initial);
                expect(_.flatten(result)).toEqual([1, 2, 1, 2]);
            });


            it('last', function() {
                expect(_.last([1, 2, 3])).toEqual(3);
                expect(_.last([1, 2, 3], 0)).toEqual([]);
                expect(_.last([1, 2, 3], 2)).toEqual([2,3]);
                expect(_.last([1, 2, 3], 5)).toEqual([1, 2, 3]);
                var result = (function(){ return _(arguments).last(); }(1, 2, 3, 4));
                expect(result).toEqual(4);
                result = _.map([[1, 2, 3], [1, 2, 3]], _.last);
                expect(result).toEqual([3,3]);

                expect(_.last(null)).toEqual(undefined);
                expect(_.last([1, 2, 3], -1).length).toEqual(0);
            });
            
            
            /**
             * Test the maps functionality
             */
            it('maps', function () {
                expect(_.map([1, 2, 3], function (num) {
                    return num * 3;
                })).toEqual([3, 6, 9]);
            });


            /**
             * Test the keys functionality...
             */
            it('keys', function () {
                expect(_.keys({one: 1, two: 2})).toEqual(['one', 'two']);
            });

            /**
             * Test the values functionality...
             */
            it('values', function () {
                expect(_.values({one: 1, two: 2})).toEqual([1, 2]);
            });

            /**
            * Test the pairs function
            */
            it('pairs', function () {
                //console.log(_.pairs({one: 1, two: 2}));
                expect(_.pairs({one: 1, two: 2})).toEqual([['one', 1], ['two', 2]]);
            });

            /**
            *   Test the invert function
            **/
            it('invert', function (){
               expect(_.invert({one: 1, two: 2})).toEqual({1: 'one', 2: 'two'});

               var obj = {length: 3};
               expect(_.invert(obj)[3]).toEqual('length');
            });


            /**
            * Test the pick function
            */
            it('pick', function () {
                var obj = {one: 1, two: 2, three: 3};
                expect(_.pick(obj, 'one', 'three')).toEqual({one: 1, three: 3});
                //can restrict based on an array not a string
                expect(_.pick(obj, ['one', 'two'])).toEqual({one: 1, two: 2});
                expect(_.pick(obj, ['two'], 'three')).toEqual({two: 2, three: 3});
 
                // test the function context
                var Obj = function(){};
                Obj.prototype = {one: 1, two: 2, three: 3};
                var instance = new Obj();
                expect(_.pick(obj, function (val, key) {
                    return this[key] === 3 && this === instance;
                }, instance)).toEqual({three: 3});
            });

            /**
            * Test the omit function
            * Follows a similiar pattern to the pick test
            */
            it('omit', function (){
                var obj = {one: 1, two: 2, three: 3};
                expect(_.omit(obj, 'one')).toEqual({two: 2, three: 3});
                expect(_.omit(obj, ['one', 'three'])).toEqual({two: 2});
                expect(_.omit(obj, ['one'], 'three')).toEqual({two: 2});
                
                // test the function context
                var Obj = function(){};
                Obj.prototype = {one: 1, two: 2, three: 3};
                var instance = new Obj();
                expect(_.omit(obj, function (val, key) {
                    return this[key] === 3 && this === instance;
                }, instance)).toEqual({one: 1, two: 2});

            });

            /**
            * Test the defaults function
            */
            it('defaults', function (){
                var defs = {one: 1, two: 2, three: 3, four: null};
                
                _.defaults(defs, {fize: 5});
                expect(defs.four).toEqual(null);
                expect(defs.fize).toEqual(5);
                // Test a string
                expect(_.defaults("awesome")).toEqual("awesome");

            });

            /**
             * Test the throttle functionality...
             */
            it('Throttle', function () {

                /**
                 *  We are going to call a throttled function A LOT. Let's create our data structures to keep track of
                 *    the number of times we call a function vs the times it re-computes a value.
                 */
                var computed = [];
                var called = 0;

                /**
                 *
                 * Let's create a dummy function that we need to call a lot. For the sake of this test, it just
                 *   generates a random number and returns it. This function also keeps track of all of the unique
                 *   values generated.
                 *
                 * @returns {number}
                 */
                function rand() {
                    var value = Math.random();
                    if (_.last(computed) !== value) {
                        computed.push(value);
                    }
                    return value;
                }

                /**
                 * This is the throttled function we are creating based on the above rand() function. This will get called
                 *   A LOT but it won't re-execute on every call.
                 */
                var randThrottled = _.throttle(rand, 3);


                /**
                 *  Now let's call our throttled function 500,000 times.
                 */
                for (var i = 0; i < 500000; i++) {
                    randThrottled();
                    called++;
                }

                console.log("Times Computed: " + computed.length);
                console.log("Times Called: " + called);


                /**
                 *  If our throttle worked properly, it was called 500,000 times but only actually computes a value a
                 *    few times. (This value will vary on your runtime environment)
                 */
                expect(computed.length).toBeLessThan(called);

            });

            /**
             * TODO: Write more unit tests... These are a few to ensure the library works.
             */

        });

    });


})();