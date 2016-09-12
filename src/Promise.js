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

    function isType( type ) {

        return function ( item ) {
            return ({}).toString.call( item ).toLowerCase() === '[object ' + type.toLowerCase() + ']'
        }
    }

    var Promise = function ( executor ) {
            return new Promise.fn.init( executor );
        },
        isPromise = function ( obj ) {
            return obj instanceof Promise;
        },
        isFunction = isType( 'Function' ),
        isArray = isType( 'Array' ),
        isObject = isType( 'Object' );

    Promise.fn = Promise.prototype = {

        constructor: Promise,

        then: function (onFullfilled, onRejected) {

            var _this = this,
                Promise = this.constructor,
                args = arguments;

            return Promise(function (resolve, reject) {

                var fnMap = [ '__onFullfilled', '__onRejected' ],
                    i = 0,
                    l = 2;

                for ( ; i < l; i++ ) {

                    _this[ fnMap[ i ] ] = (function ( fn ) {

                        return function ( val ) {
                            var isFun = isFunction( fn ),
                                ret = isFun ? fn( val ) : val;

                            if ( isPromise( ret ) ) {

                                ret.then(
                                    function ( val ) {

                                        if ( !isFun ) {
                                            reject( ret );
                                        } else {
                                            // TODO 是否存在 PromiseStatus 为 resolved 且 PromiseValue 为 Promise 实例的情况?
                                        }

                                    }, function ( val ) {

                                        reject( !isFun ? ret : val );

                                    }
                                );

                            } else {
                                ( isFun || _this.PromiseStatus === RESOLVED ? resolve : reject )( ret );
                            }

                        };

                    })( args[ i ] || undefined );

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
        done: function (onFullfilled, onRejected) {
            this
                .then(onFullfilled, onRejected)
                .catch(function ( e ) {
                    setTimeout(function () {
                        throw e;
                    }, 0);
                });
        },
        finally: function ( callback ) {
            var P = this.constructor;

            return this.then(
                function ( value ) {
                    return P.resolve( callback() ).then(function () {
                        return value;
                    });
                },
                function ( reason ) {
                    return P.resolve( callback() ).then(function () {
                        throw reason;
                    });
                }
            );
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

    Promise.all = function ( iterator ) {

        var Promise = this;

        return Promise(function (resolve, reject) {

            if ( !isArray( iterator ) ) {
                reject( 'TypeError: (var)[Symbol.iterator] is not a iterator.' );
            } else {

                var i = 0,
                    l = iterator.length,
                    count = 0,
                    rejected = false,
                    result = [];

                for ( ; i < l; i++ ) {

                    if ( rejected ) {
                        break;
                    }

                    (function ( i, p ) {

                        Promise.resolve( p ).then(
                            function ( val ) {

                                result[ i ] = val;

                                if( ++count >= l ) {
                                    resolve( result );
                                    count = null;
                                }

                            }, function ( val ) {

                                if ( rejected ) {
                                    return false;
                                }

                                reject( val );

                                rejected = true;
                                count = null;

                            }
                        );

                    } ( i, iterator[i] ));

                }

            }

        });

    };

    Promise.resolve = function ( x ) {

        if ( isPromise( x ) ) { // Promise 实例
            return x;
        } else {
            return this(
                    x && isFunction( x.then ) ?
                        x.then :
                        function ( resolve ) {
                            resolve( x );
                        }
                );
        }

    };

    Promise.reject = function ( r ) {

        if ( isPromise( r ) ) { // Promise 实例
            return r;
        } else {
            return this(
                r && isFunction( r.then ) ?
                    r.then :
                    function ( resolve, reject ) {
                        reject( x );
                    }
            );
        }

    };

    var init = Promise.fn.init = function ( executor ) {

        if ( typeof executor !== 'function' ) {
            throw new Error( 'Promise resolver is not a function' );
        }

        var _this = this;

        this.PromiseStatus = PENDING;
        this.PromiseValue = undefined;

        // 回调
        try {
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
        } catch ( error ) {
            _this.__reject( error );
        }

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