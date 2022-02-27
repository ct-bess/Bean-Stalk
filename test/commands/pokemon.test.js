import Pokemon from "../../src/commands/pokemon.js";
import biomes from "../../kb/pokemon/biomes.json";
import habitats from "../../kb/pokemon/habitats.json";

const getInteraction = ( customId, selected ) => {
  return({
    customId,
    values: selected,
    isSelectMenu: function(){
      return true;
    }
  });
}

describe( "selector generation", () => {

  it( "biome selector is generated", () => {
    const response = Pokemon.spawn();
    console.log( response );
    expect( response ).toBeTruthy();
  });

  it( "biome selection returns habitat selector", () => {
    const response = Pokemon.pokemon( getInteraction( "pokemon-biomeSelector", [ "Ocean Biomes" ] ) );
    console.log( response );
    expect( response ).toBeTruthy();
  });

  it( "biome selection returns multiple habitat selectors for large biome (>25)", () => {
    const response = Pokemon.pokemon( getInteraction( "pokemon-biomeSelector", [ "Field Biomes" ] ) );
    console.log( response );
    expect( response.payload.components.length > 1 ).toBe( true );
  });

  it( "habitat selection returns random encounter", () => {
    const response = Pokemon.pokemon( getInteraction( "pokemon-habitatSelector", [ "Tide Pools" ] ) );
    console.log( response );
    expect( response ).toBeTruthy();
  });

  it( "habitat selection returns random encounter for large habitat", () => {
    const response = Pokemon.pokemon( getInteraction( "pokemon-habitatSelector", [ "Woodlands" ] ) );
    console.log( response );
    expect( response ).toBeTruthy();
  });

});

/** 
 * these will have to be tweaked if we add weights
 */
describe( "biome & habitat data", () => {

  it( "biome data does not contain duplicate entries", () => {

    let result = false;

    // disguesting
    for( const biome in biomes ) {
      let duplicated = [];
      const biomeArray = biomes[biome];
      for( const habitat of biomeArray ) {
        let firstOccurance = true;
        biomeArray.forEach( h => {
          if( h === habitat && firstOccurance ) { 
            firstOccurance = false;
          }
          else if( h === habitat && !firstOccurance ) {
            duplicated.push( h );
          }
        });
      }
      if( duplicated.length > 0 ) {
        console.warn( "Biome:", biome, "contains duplicates:", duplicated );
        result = false;
      }
      else {
        result = true;
      }
      expect( result ).toBe( true );
    }

  });

  it( "habitat data does not contain duplicate entries", () => {

    let result = false;

    // disguesting
    for( const habitat in habitats ) {
      let duplicated = [];
      const habitatArray = habitats[habitat];
      for( const pokemon of habitatArray ) {
        let firstOccurance = true;
        habitatArray.forEach( p => {
          if( p === pokemon && firstOccurance ) { 
            firstOccurance = false;
          }
          else if( p === pokemon && !firstOccurance ) {
            duplicated.push( p );
          }
        });
      }
      if( duplicated.length > 0 ) {
        console.warn( "Habitat:", habitat, "contains duplicates:", duplicated );
        result = false;
      }
      else {
        result = true;
      }
      expect( result ).toBe( true );
    }

  });

});
