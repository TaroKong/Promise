/**
 * Created by tarojiang on 2016/9/8.
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

    var Promise = function ( resolver ) {
            return new Promise.fn.init( resolver );
        };

    Promise.fn = Promise.prototype = {

        constructor: Promise,

        then: function (onResolve, onReject) {

            var _this = this;
            console.log( this );
            return Promise(function (resolve, reject) {

                _this.__onResolve = function ( val ) {
                    var ret = typeof onResolve === 'function' ? onResolve( val ) : undefined;
                    resolve( ret );
                    onResolve = null;

                    return ret;
                };

                _this.__onReject = function ( val ) {
                    var ret = typeof onReject === 'function' ? onReject( val ) : undefined;
                    resolve( ret );
                    onReject = null;

                    return ret;
                };

            });

        },
        "catch": function () {

        },
        // 私有方法
        __resolve: function ( val ) {
            //console.log( this );
            if ( this.PromiseStatus === PENDING ) {
                this.PromiseStatus = RESOLVED;
                this.PromiseValue = this.__onResolve( val );
            }

        },
        // 私有方法
        __reject: function ( val ) {

            if ( this.PromiseStatus === PENDING ) {
                this.PromiseStatus = REJECTED;
                this.PromiseValue = this.__onReject( val );
            }

        }
    };

    Promise.all = function () {

    };

    Promise.resolve = function () {

    };

    Promise.reject = function () {

    };

    var init = Promise.fn.init = function ( resolver ) {
        var _this = this;

        if ( typeof resolver !== 'function' ) {
            throw new Error( 'Promise resolver is not a function' );
        }

        this.PromiseStatus = PENDING;
        this.PromiseValue = undefined;

        // 回调
        resolver(
            function /*resolve*/( val ) {
                _this.__resolve( val );
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