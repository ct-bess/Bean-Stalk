import Dice from "../../src/commands/dice.js";

const createDiceInteraction = ( size, count ) => {
  return({
    user: {
      username: "awesome"
    },
    options: {
      getString: function( string ) {
        if( string === "size" ) return size+"";
        if( string === "count" ) return count+"";
      }
    }
  });
}

describe( "dice roll yeilds a result", () => {
  it( "rolls default properly", () => {
    const response = Dice.roll( createDiceInteraction() );
    expect( response ).toBeTruthy();
  });
  it( "rolls with custom size, default count", () => {
    const response = Dice.roll( createDiceInteraction( 50 ) );
    expect( response ).toBeTruthy();
  });
  it( "rolls with custom size and count", () => {
    const response = Dice.roll( createDiceInteraction( 50, 5 ) );
    expect( response ).toBeTruthy();
  });
  it( "rolls with negative size and count", () => {
    const response = Dice.roll( createDiceInteraction( -50, -5 ) );
    expect( response ).toBeTruthy();
  });
  it( "rolls with hex values", () => {
    const response = Dice.roll( createDiceInteraction( "0x5f", "0x2" ) );
    expect( response ).toBeTruthy();
  });
  it( "doesn't break on invalid size", () => {
    const response = Dice.roll( createDiceInteraction( "not a number" ) );
    expect( response ).toBeTruthy();
  });
  it( "doesn't break on invalid count", () => {
    const response = Dice.roll( createDiceInteraction( "5", "not a number" ) );
    expect( response ).toBeTruthy();
  });
  it( "aborts a count that's too high", () => {
    const response = Dice.roll( createDiceInteraction( "5", Number.MAX_SAFE_INTEGER ) );
    expect( response ).toBeTruthy();
  });
  it( "displays the history", () => {
    const response = Dice.get_history();
    console.log( response );
    expect( response ).toBeTruthy();
  });
});
