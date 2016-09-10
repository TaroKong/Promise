/**
 * Created by TaroKong on 2016/9/8.
 */

( function ( global, factory ) {

    'use strict';

    if ( typeof module === 'object' && typeof module.exports === 'object' ) {
        module.exports = factory( global, true );
    } else {
        factory( global );
    }

} )( typeof window !== 'undefined' ? window : this, function ( window, noGlobal, undefined ) {

    var PENDING = 'pending', // 进行中
        RESOLVED = 'resolved', // 已完成
        REJECTED = 'rejected'; // 已失败

    var Promise = function ( executor ) {
            return new Promise.fn.init( executor );
        },
        isPromise = function ( obj ) {
            return obj instanceof Promise;
        },
        isFunction = function ( fn ) {
            return typeof fn === 'function';
        };

    Promise.fn = Promise.prototype = {

        constructor: Promise,

        then: function (onFullfilled, onRejected) {

            var _this = this,
                args = arguments;

            return Promise(function (resolve, reject) {

                var fnMap = [ '__onFullfilled', '__onRejected' ],
                    i = 0,
                    l = 2;

                for ( ; i < l; i++ ) {

                    _this[ fnMap[ i ] ] = (function ( i, fn ) {

                        return function ( val ) {
                            var isFun = isFunction( fn ),
                                ret = isFun ? fn( val ) : val,
                                executor = isFun || _this.PromiseStatus === RESOLVED ? resolve : reject;

                            if ( isPromise( ret ) ) {

                                ret.then(
                                    function ( val ) {

                                        if ( !isFun ) {
                                            reject( ret );
                                        } else {
                                            // TODO 是否存在 PromiseStatus 为 resolved 且 PromiseValue 为 Promise 实例的情况?
                                        }

                                    }, function ( val ) {

                                        if ( !isFun ) {
                                            reject( ret );
                                        } else {
                                            reject( val );
                                        }

                                    }
                                );

                            } else {
                                executor( ret );
                            }

                        };

                    })( i, args[ i ] || undefined );

                }

                if ( _this.PromiseStatus === RESOLVED ) {
                    _this.__onFullfilled( _this.PromiseValue );
                }

                if ( _this.PromiseStatus === REJECTED ) {
                    _this.__onRejected( _this.PromiseValue );
                }

                args = null;

            });

        },
        "catch": function ( onRejected ) {
            return this.then( null, onRejected );
        },
        // 私有方法
        __resolve: function ( val ) {

            if ( this.PromiseStatus === PENDING ) {
                this.PromiseStatus = RESOLVED;
                this.PromiseValue = val;

                if ( typeof this.__onFullfilled === 'function' ) {
                    this.__onFullfilled( val );
                }
            }

        },
        // 私有方法
        __reject: function ( val ) {

            if ( this.PromiseStatus === PENDING ) {
                this.PromiseStatus = REJECTED;
                this.PromiseValue = val;

                if ( typeof this.__onRejected === 'function' ) {
                    this.__onRejected( val );
                }
            }
        }
};

    Promise.all = function () {

    };

    Promise.resolve = function () {

    };

    Promise.reject = function () {

    };

    var init = Promise.fn.init = function ( executor ) {

        if ( typeof executor !== 'function' ) {
            throw new Error( 'Promise resolver is not a function' );
        }

        var _this = this;

        this.PromiseStatus = PENDING;
        this.PromiseValue = undefined;

        // 回调
        executor(
            function /*resolve*/( val ) {
                var fnName = '__resolve';

                if ( isPromise( val ) ) {
                    if ( val.PromiseStatus === REJECTED ) {
                        fnName = '__reject';
                    }
                    val = val.PromiseValue;
                }

                _this[ fnName ]( val );
            },
            function /*reject*/( val ) {
                _this.__reject( val );
            }
        );
    };

    init.prototype = Promise.fn;

    if ( typeof define === 'function' ) {
        define(function(require, exports, module) {
            module.exports = Promise;
        });
    }

    if ( !noGlobal ) {
        window.Promise = Promise;
    }

    return Promise;

} );