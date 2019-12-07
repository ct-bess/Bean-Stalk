import { c4start, c4place } from "./commands/connect4.js";

console.log( "Use describe you stupid beast" );

let board = c4start();
console.log( "c4start()" );
console.log( board );

const cmd1 = "place 1 1 W";
const result = cmd1.split( /\s/ );
console.log( result );

board = c4place( 1, 1, board, "X" );
console.log( "c4place( 1, 1 )" );
console.log( board );

board = c4place( 5, 5, board, "W" );
console.log( "c4place( 5, 5 )" );
console.log( board );

board = c4place( 5, 1, board, "P" );
console.log( "c4place( 5, 1 )" );
console.log( board );

board = c4place( 5, 6, board, "L" );
console.log( "c4place( 1, 5 )" );
console.log( board );