/**
 * Created by TaroKong on 16/9/10.
 */

if ( typeof module === 'object' && typeof require === 'function' ) {
    //var Promise = require( '../src/Promise' );
}

function p( name, isResolved, timeout ) {
    isResolved = isResolved || false;
    timeout = typeof timeout === 'undefined' ? 3000 : timeout;

    return new Promise(function (resolve, reject) {
        //setTimeout(function () {
        console.log( 'start' );
            isResolved ? resolve( name ) : reject( name );
        console.log( 'end' );
        //}, timeout);
    });
}

// Promise.prototype.done = function ( onFullfilled, onRejected ) {
//     return this.then(onFullfilled, onRejected)
//         .catch(function ( e ) {
//             setTimeout(function (){throw e}, 0);
//         });
// };

/*
var p1 = Promise.all([{then:function(resolve,reject){
    reject(23234);
}},p('p2', false, 1000)]).then(function (val) {
    console.log( 'fullfilled' );
    console.log( val );
}).done(null,null);

var p2 = p('p2', true);
var p3 = p(p2, true);

setTimeout(function () {
    console.log( p3 );
}, 5000);*/

setTimeout(function () {
    console.log(6);
}, 0);

p(2, false).then(function ( val ) {
    console.log( val );
    return 3;
}).catch(function (val) {
    console.log( val );
    return 4;
}).then(function ( val ) {
    console.log( val );
    return 5;
});

console.log( 1 );