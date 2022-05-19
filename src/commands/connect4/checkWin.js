/**
 * incredible non regular expression (im sorry) logic to check for a connect4 victory
 * @param {string} marker
 * @param {string} board - why yes the board is just a giant string,, how could you tell??
 * @param {string} delimiter
 * @returns {boolean} if the win happened or not
 */
export const checkWin = ( marker, board, delimiter ) => {

  const firstSplit = board.split('\n');
  let playerMap = [];
  let win = false;

  // build player's map
  for( const i in firstSplit ) {

    const secondSplit = firstSplit[i].split( delimiter );
    let chunk = [];

    if( secondSplit[secondSplit.length-1] === "" ) {
      secondSplit.pop();
    }

    for( const j in secondSplit ) {
      if( secondSplit[j] === marker ) {
        chunk.push( parseInt( j ) + 1 );
      }
      else {
        chunk.push( 0 )
      }
    }

    playerMap.push( chunk );

  }

  rowLoop: for( let i = 0; i < playerMap.length; ++i ) {

    markerLoop: for( let j = 0; j < playerMap[i].length; ++j ) {

      const marker = playerMap[i][j];

      if( marker !== 0 ) {
        // trust me
        const vertCheck = (playerMap[i+1][j]>0)&&(playerMap[i+2][j]>0)&&(playerMap[i+3][j]>0);
        const horizCheck = (playerMap[i][j+1]>0)&&(playerMap[i][j+2]>0)&&(playerMap[i][j+3]>0);
        const fDiagCheck = (playerMap[i+1][j+1]>0)&&(playerMap[i+2][j+2]>0)&&(playerMap[i+3][j+3]>0);
        const bDiagCheck = (playerMap[i+1][j-1]>0)&&(playerMap[i+2][j-2]>0)&&(playerMap[i+3][j-3]>0);

        if( vertCheck || horizCheck || fDiagCheck || bDiagCheck ) {
          win = true;
          break rowLoop;
        }

      }

    } // markerLoop
  } // rowLoop

  return( win );

}
