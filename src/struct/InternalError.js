/**
 * for big brain errors
 */
class InternalError extends Error {

  name = "InternalError";

  constructor( message, options, fileName, lineNumber ) {
    super( message, options, fileName, lineNumber );
  }

}

export default InternalError;
