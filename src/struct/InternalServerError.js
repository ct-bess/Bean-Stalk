/**
 * for big brain errors
 */
class InternalServerError extends Error {

  name = "InternalServerError";

  constructor( message ) {
    super( message );
  }

}

export default InternalServerError;
