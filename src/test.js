import { c4start, c4place } from "./commands/connect4.js";

console.log( "Use describe you stupid beast" );

let board = c4start();
console.log( "c4start()" );
console.log( board );

board = c4place( 1, "X", board );
console.log( "c4place( 1 )" );
console.log( board );

board = c4place( 3, "X", board );
console.log( "c4place( 3 )" );
console.log( board );

board = c4place( 5, "X", board );
console.log( "c4place( 5 )" );
console.log( board );

board = c4place( 5, "X", board );
console.log( "c4place( 5 )" );
console.log( board );