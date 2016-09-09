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
        };

    Promise.fn = Promise.prototype = {

        constructor: Promise,

        then: function (onFullfilled, onRejected) {

            var _this = this.self;

            return Promise(function (resolve, reject) {

                _this.__onFullfilled = function ( val ) {
                    var ret = typeof onFullfilled === 'function' ?
                                onFullfilled( val ) :
                                val;

                    var callback = resolve;

                    if ( isPromise( ret ) ) {
                        if ( ret.PromiseStatus === REJECTED ) {
                            callback = reject;
                        }
                        ret = ret.PromiseValue;
                    }

                    callback( val );

                    onFullfilled = null;

                    return ret;
                };

                _this.__onRejected = function ( val ) {
                    var ret = typeof onRejected === 'function' ?
                                onRejected( val ) :
                                val;

                    reject( ret );

                    onRejected = null;

                    return ret;
                };

                if ( _this.PromiseStatus === RESOLVED ) {
                    _this.PromiseValue = _this.__onFullfilled( _this.PromiseValue );
                }

                if ( _this.PromiseStatus === REJECTED ) {
                    _this.PromiseValue = _this.__onRejected( _this.PromiseValue );
                }

            });

        },
        "catch": function ( onRejected ) {
            return this.self.then(null, onRejected );
        },
        // 私有方法
        __resolve: function ( val ) {

            if ( this.PromiseStatus === PENDING ) {
                this.PromiseStatus = RESOLVED;
                this.PromiseValue = val;

                if ( typeof this.__onFullfilled === 'function' ) {
                    this.PromiseValue = this.__onFullfilled( val );
                }
            }

        },
        // 私有方法
        __reject: function ( val ) {

            if ( this.PromiseStatus === PENDING ) {
                this.PromiseStatus = REJECTED;
                this.PromiseValue = val;

                if ( typeof this.__onRejected === 'function' ) {
                    this.PromiseValue = this.__onRejected( val );
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