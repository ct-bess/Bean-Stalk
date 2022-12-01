import Connect4 from "../../src/commands/connect4/connect4";

/** mock interaction */
const getInteraction = ( params ) => {
  return({
    user: { id: params?.userId },
    customId: params?.customId,
    values: params?.selected,
    component: params?.component,
    isButton: function() {
      return true;
    },
    reply: function() {},
    options: {
      getString: function( string ) {
        switch( string ) {
          case "emoji":
            return params?.emoji;
          default:
            return null;
        }
      },
      getUser: function( string ) {
        switch( string ) {
          case "who":
            return({ id: params?.userId });
          default:
            return null;
        }
      },
      getBoolean: function( string ) {
        switch( string ) {
          case "override":
            return params?.override;
          default:
            return null;
        }
      }
    }
  });
}

Connect4.defaults.markers.blank = "_";

describe( "src/commands/connect4/connect4.js => new()", () => {

  it( "generates new board, and buttons click works", () => {
    const response = Connect4.new( getInteraction() );
    expect( response ).toBeTruthy();
  });

  it( "blocks a new board while the game's in progress without an override", () => {
    const response = Connect4.new( getInteraction() );
    expect( response.payload.ephemeral ).toBe( true );
  });

  it( "overrides the previous board", () => {
    const response = Connect4.new( getInteraction({ override: true }) );
    expect( !!response.payload.ephemeral ).toBe( false );
  });

});

describe( "src/commands/connect4/connect4.js => join()", () => {

  it( "2 players are able to join", () => {
    Connect4.join( getInteraction({ userId: "1" }) );
    Connect4.join( getInteraction({ userId: "2", emoji: ":custom_marker:" }) );
    expect( Connect4.state.players.size ).toBe( 2 );
  });

  it( "player 2 has a custom marker", () => {
    expect( Connect4.state.players.get( "2" ).marker ).toBe( ":custom_marker:" );
  });

  it( "players 1 has a default marker", () => {
    expect( Connect4.defaults.markers.players.includes( Connect4.state.players.get( "1" ).marker ) ).toBe( true );
  });

  it( "existing players cannot join twice", () => {
    Connect4.join( getInteraction({ userId: "2" }) );
    Connect4.join( getInteraction({ userId: "1" }) );
    expect( Connect4.state.players.size ).toBe( 2 );
  });

});

describe( "src/commands/connect4/connect4.js => connect4()", () => {

  it( "can place player 1's marker on column 1 and cannot go again", () => {
    let prevBoard = Connect4.state.board + "";
    expect( Connect4.state.players.get( "1" ).hasTurn ).toBe( true );
    Connect4.connect4( getInteraction({
      customId: `${Connect4.name}-place-1`,
      userId: "1",
      component: { label: "1" } // button 1
    }));
    expect( prevBoard !== Connect4.state.board ).toBe( true );
    expect( Connect4.state.players.get( "1" ).hasTurn ).toBe( false );
    expect( Connect4.state.board ).toContain( Connect4.state.players.get( "1" ).marker );
    prevBoard = Connect4.state.board + "";
    Connect4.connect4( getInteraction({
      customId: `${Connect4.name}-place-1`,
      userId: "1",
      component: { label: "1" } // button 1
    }));
    expect( prevBoard === Connect4.state.board ).toBe( true );
  });

  it( "player 1 wins vertically on column 1", () => {
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-2`, userId: "2", component: { label: "2" } }));
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-1`, userId: "1", component: { label: "1" } }));
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-2`, userId: "2", component: { label: "2" } }));
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-1`, userId: "1", component: { label: "1" } }));
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-2`, userId: "2", component: { label: "2" } }));
    expect( Connect4.state.inProgress ).toBe( true );
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-1`, userId: "1", component: { label: "1" } }));
    console.log( Connect4.state.board );
    expect( Connect4.state.inProgress ).toBe( false );
  });

  it( "player 1 wins horizontally on columns 1,2,3,4", () => {
    Connect4.new( getInteraction() );
    Connect4.join( getInteraction({ userId: "1", emoji: "1" }) );
    Connect4.join( getInteraction({ userId: "2", emoji: "2" }) );
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-1`, userId: "1", component: { label: "1" } }));
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-1`, userId: "2", component: { label: "1" } }));
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-2`, userId: "1", component: { label: "2" } }));
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-2`, userId: "2", component: { label: "2" } }));
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-3`, userId: "1", component: { label: "3" } }));
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-3`, userId: "2", component: { label: "3" } }));
    expect( Connect4.state.inProgress ).toBe( true );
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-4`, userId: "1", component: { label: "4" } }));
    console.log( Connect4.state.board );
    expect( Connect4.state.inProgress ).toBe( false );
  });

  it( "player 1 wins forward diagonally / on columns 1,2,3,4", () => {
    Connect4.new( getInteraction() );
    Connect4.join( getInteraction({ userId: "1", emoji: "1" }) );
    Connect4.join( getInteraction({ userId: "2", emoji: "2" }) );
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-4`, userId: "1", component: { label: "4" } }));
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-3`, userId: "2", component: { label: "3" } }));
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-2`, userId: "1", component: { label: "2" } }));
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-1`, userId: "2", component: { label: "1" } }));
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-3`, userId: "1", component: { label: "3" } }));
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-2`, userId: "2", component: { label: "2" } }));
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-2`, userId: "1", component: { label: "2" } }));
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-1`, userId: "2", component: { label: "1" } }));
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-1`, userId: "1", component: { label: "1" } }));
    const r = Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-4`, userId: "2", component: { label: "4" } }));
    expect( Connect4.state.inProgress ).toBe( true );
    console.log( r );
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-1`, userId: "1", component: { label: "1" } }));
    console.log( Connect4.state.board );
    expect( Connect4.state.inProgress ).toBe( false );
  });

  it( "player 1 wins backward diagonally \\ on columns 1,2,3,4", () => {
    Connect4.new( getInteraction() );
    Connect4.join( getInteraction({ userId: "1", emoji: "1" }) );
    Connect4.join( getInteraction({ userId: "2", emoji: "2" }) );
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-1`, userId: "1", component: { label: "1" } }));
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-2`, userId: "2", component: { label: "2" } }));
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-3`, userId: "1", component: { label: "3" } }));
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-4`, userId: "2", component: { label: "4" } }));
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-2`, userId: "1", component: { label: "2" } }));
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-3`, userId: "2", component: { label: "3" } }));
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-3`, userId: "1", component: { label: "3" } }));
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-4`, userId: "2", component: { label: "4" } }));
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-4`, userId: "1", component: { label: "4" } }));
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-1`, userId: "2", component: { label: "1" } }));
    expect( Connect4.state.inProgress ).toBe( true );
    Connect4.connect4( getInteraction({ customId: `${Connect4.name}-place-4`, userId: "1", component: { label: "4" } }));
    console.log( Connect4.state.board );
    expect( Connect4.state.inProgress ).toBe( false );
  });

});

describe( "src/commands/connect4/connect4.js => kick()", () => {

  it( "we can kick the player with the current turn, and it spills over to the next in line", () => {
    Connect4.new( getInteraction() );
    Connect4.join( getInteraction({ userId: "1" }) );
    Connect4.join( getInteraction({ userId: "2" }) );
    Connect4.join( getInteraction({ userId: "3" }) );
    Connect4.kick( getInteraction({ userId: "1" }) );
    expect( Connect4.state.players.size ).toBe( 2 );
    expect( Connect4.state.players.get( "2" ).hasTurn ).toBe( true );
  });

});
