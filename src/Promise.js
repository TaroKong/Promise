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

            var _this = this;

            return Promise(function (resolve, reject) {

                _this.__onFullfilled = function ( val ) {
                    var ret = typeof onFullfilled === 'function' ?
                                onFullfilled( val ) :
                                val;

                    if ( isPromise( ret ) ) {
                        ret.then(function ( val ) {
                            ( ret.PromiseStatus === RESOLVED ? resolve : reject )( val.PromiseValue );
                        });
                    } else {
                        resolve( ret );
                    }

                    onFullfilled = null;

                    return ret;
                };

                _this.__onRejected = function ( val ) {
                    var ret = typeof onRejected === 'function' ?
                                onRejected( val ) :
                                val;

                    if ( isPromise( ret ) ) {
                        ret.then(function ( val ) {
                            ( ret.PromiseStatus === RESOLVED ? resolve : reject )( val.PromiseValue );
                        });
                    } else {
                        typeof onFullfilled === 'function' &&
                        typeof onRejected === 'function' ?
                            resolve( ret ) :
                            reject( ret );
                    }

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
            return this.then(null, onRejected );
        },
        // 私有方法
        __resolve: function ( val ) {

            if ( this.PromiseStatus === PENDING ) {
                this.PromiseStatus = RESOLVED;
                this.PromiseValue = val; // 私有属性,缓存 resolve 的值

                if ( typeof this.__onFullfilled === 'function' ) {
                    this.PromiseValue = this.__onFullfilled( val );
                }
            }

        },
        // 私有方法
        __reject: function ( val ) {

            if ( this.PromiseStatus === PENDING ) {
                this.PromiseStatus = REJECTED;
                this.PromiseValue = val; // 私有属性,缓存 reject 的值

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
        var _this = this;

        if ( typeof executor !== 'function' ) {
            throw new Error( 'Promise resolver is not a function' );
        }

        this.PromiseStatus = PENDING;
        this.PromiseValue = undefined;

        // 回调
        executor(
            function /*resolve*/( val ) {
                if ( isPromise( val ) ) {
                    _this[ val.PromiseStatus === RESOLVED ? '__resolve' : '__reject' ]( val );
                } else {
                    _this.__resolve( val );
                }
            },
            function /*reject*/( val ) {
                if ( isPromise( val ) ) {
                    _this[ val.PromiseStatus === RESOLVED ? '__resolve' : '__reject' ]( val );
                } else {
                    _this.__reject( val );
                }
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