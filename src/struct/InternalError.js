/**
 * for incredible big brain errors
 */
class InternalError extends Error {

  name = "InternalError"

  constructor( params ) {

    if( params ) {
      super( ...params );
    }
    else {
      super();
    }

    if( Error.captureStackTrace ) {
      Error.captureStackTrace( this, InternalError );
    }

    this.name = "InternalError";

  }

}

export default InternalError;
