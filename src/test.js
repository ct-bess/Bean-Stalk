function winCheck( board ) {
  const firstSplit = board.split('\n');
  //console.info( firstSplit );

  const playerMarker = ":blue:";
  let playerMap = [];

  for( i in firstSplit ) {
    const secondSplit = firstSplit[i].split(' '); 
    if( secondSplit[secondSplit.length-1] === '' ) secondSplit.pop();
    //console.info( secondSplit );
    let chunk = [];
    for( j in secondSplit ) {
      if( secondSplit[j] === playerMarker ) chunk.push( parseInt( j ) + 1 );
      else chunk.push( 0 )
    }
    playerMap.push( chunk );
  }

  // Vert win = 4 of the same index evenly spaced out or maybe anywhere
  // Horiz win = 4 consecutive increasing indicies by 1
  // Forward Diag win / = 4 decreasing indicies

  let win = false;

  rowLoop: for( let i = 0; i < playerMap.length; ++i ) {
    console.info( "row:", i, typeof(i) );
    markerLoop: for( let j = 0; j < playerMap[i].length; ++j ) {
      if( typeof(i) !== "number" || typeof(j) !== "number" ) { 
        console.error( "typeof i j bad",typeof(i),typeof(j) );
      }
      const marker = playerMap[i][j];
      console.info( "For marker:", marker, "at:", j );
      if( marker !== 0 ) {
        const vertCheck = (playerMap[i+1][j]===marker)&&(playerMap[i+2][j]===marker)&&(playerMap[i+3][j]===marker);
        const horizCheck = (playerMap[i][j+1]>0)&&(playerMap[i][j+2]>0)&&(playerMap[i][j+3]>0);
        const fDiagCheck = (playerMap[i+1][j+1]>0)&&(playerMap[i+2][j+2]>0)&&(playerMap[i+3][j+3]>0);
        const bDiagCheck = (playerMap[i+1][j-1]>0)&&(playerMap[i+2][j-2]>0)&&(playerMap[i+3][j-3]>0);
        console.info({ vert: vertCheck, horiz: horizCheck, fDiag: fDiagCheck, bDiag: bDiagCheck });
        if( vertCheck || horizCheck || fDiagCheck || bDiagCheck === true ) {
          win = true;
          break rowLoop;
        }
      }
    }
  }

  console.info( "playerMap:", playerMap );
  console.info( "win?:", win );

}

try {

  const vertBoard =":empty: :empty: :empty: :blue: :empty: :empty: :empty: \n:empty: :empty: :empty: :blue: :empty: :empty: :empty: \n:empty: :empty: :empty: :blue: :empty: :empty: :empty: \n:empty: :empty: :empty: :blue: :empty: :empty: :empty: \n:empty: :empty: :empty: :empty: :empty: :empty: :empty: \n:empty: :empty: :empty: :empty: :empty: :empty: :empty: "
  const horizBoard =":blue: :blue: :blue: :blue: :empty: :empty: :empty: \n:empty: :empty: :empty: :empty: :empty: :empty: :empty: \n:empty: :empty: :empty: :empty: :empty: :empty: :empty: \n:empty: :empty: :empty: :empty: :empty: :empty: :empty: \n:empty: :empty: :empty: :empty: :empty: :empty: :empty: \n:empty: :empty: :empty: :empty: :empty: :empty: :empty: "
  const forwardDiagBoard =":blue: :empty: :empty: :empty: :empty: :empty: :empty: \n:empty: :blue: :empty: :empty: :empty: :empty: :empty: \n:empty: :empty: :blue: :empty: :empty: :empty: :empty: \n:empty: :empty: :empty: :blue: :empty: :empty: :empty: \n:empty: :empty: :empty: :empty: :empty: :empty: :empty: \n:empty: :empty: :empty: :empty: :empty: :empty: :empty: "
  const backwardDiagBoard =":empty: :empty: :empty: :empty: :empty: :empty: :blue: \n:empty: :empty: :empty: :empty: :empty: :blue: :empty: \n:empty: :empty: :empty: :empty: :blue: :empty: :empty: \n:empty: :empty: :empty: :blue: :empty: :empty: :empty: \n:empty: :empty: :empty: :empty: :empty: :empty: :empty: \n:empty: :empty: :empty: :empty: :empty: :empty: :empty: "

  console.info( "VERTICAL" );
  winCheck( vertBoard );

  console.info( "HORIZONTAL" );
  winCheck( horizBoard );

  console.info( "FORWARD DIAGONAL" );
  winCheck( forwardDiagBoard );
  console.info( "BACKWARD DIAGONAL" );
  winCheck( backwardDiagBoard );


} catch( error ) {
  console.log( "LMAO!" );
  console.error( error );
}
