export const selectUpgrades = ( object ) => {

  const upgrades = [];
  let shorthand = "";

  for( const [ key, value ] of Object.entries( object ) ) {

    const rng = Math.floor( Math.random() * value.length )
    const sel = value[ rng ];
    shorthand += ( rng + 1 );

    if( typeof( sel ) !== "string" ) {
      upgrades.push( `${sel.name} (${sel.type})` );
    }
    else {
      upgrades.push( sel );
    }

  }

  return({ upgrades, shorthand });

};
