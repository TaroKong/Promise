/**
 * Created by TaroKong on 16/9/10.
 */

if ( typeof module === 'object' && typeof require === 'function' ) {
    var Promise = require( '../src/Promise' );
}

function p( name, isResolved, timeout ) {
    isResolved = isResolved || false;
    timeout = timeout || 3000;

    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            isResolved ? resolve( name ) : reject( name );
        }, timeout);

    });
}

// Promise.prototype.done = function ( onFullfilled, onRejected ) {
//     return this.then(onFullfilled, onRejected)
//         .catch(function ( e ) {
//             setTimeout(function (){throw e}, 0);
//         });
// };

var p1 = Promise.all([{then:function(resolve,reject){
    reject(23234);
}},p('p2', false, 1000)]).then(function (val) {
    console.log( 'fullfilled' );
    console.log( val );
}).done(null,null);

var p2 = p('p2', true);
var p3 = p(p2, true);

setTimeout(() => {console.log(p3)}, 5000);