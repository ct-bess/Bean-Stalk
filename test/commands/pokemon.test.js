import Pokemon from "../../src/commands/pokemon.js";

describe( "pokemon selectors populates properly", () => {

  it( "biome selector is generated", () => {
    const response = Pokemon.spawn();
    expect( response ).toBeTruthy();
  });

});
