import Drg from "../../src/commands/drg/drg";

/** mock interaction */
const getInteraction = ( params ) => {
  return({
    member: {
      nickname: ""
    },
    reply: function() {},
    options: {
      getString: function( string ) {
        switch( string ) {
          case "class":
            return params?.class;
          default:
            return null;
        }
      },
    }
  });
}

describe( "src/commands/drg/drg.js => build()", () => {

  it( "builds a random dwarf", () => {
    const response = Drg.build( getInteraction() );
    console.log( response );
    expect( response ).toBeTruthy();
  });

});
