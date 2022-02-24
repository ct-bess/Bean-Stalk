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

describe( "pokemon selectors populates properly", () => {

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
