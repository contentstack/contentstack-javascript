/**
 * Centralized error and informational messages for Contentstack JavaScript SDK
 * @module messages
 */

const MESSAGES = {
  // Cache Provider Messages
  CACHE_PROVIDER_MISSING: 'Missing cache provider. Provide a valid provider and try again.',
  CACHE_POLICY_INVALID: 'Invalid cache policy. Provide a valid policy value and try again.',

  // Stack Initialization Messages
  STACK_INVALID_PARAMS_OBJECT: 'Invalid parameters. The specified API Key, Delivery Token, or Environment Name is invalid.',
  STACK_INVALID_PARAMS_STRING: 'Invalid string parameters. Provide valid API Key, Delivery Token, and Environment Name.',
  STACK_INVALID_PARAMS_GENERIC: 'Invalid parameters. Provide valid parameters to initialize the Contentstack javascript-SDK Stack.',
  STACK_OBSOLETE_FUNCTION: "WARNING! Obsolete function called. Function 'Contentstack.Stack(api_key, delivery_token, environment)' has been deprecated, please use 'Contentstack.Stack({api_key, delivery_token, environment, region, branch, fetchOptions})' function instead!",

  // Entry Messages
  ENTRY_UID_REQUIRED: "Entry UID required. Provide an entry UID. e.g. .Entry('entry_uid')",
  ENTRY_INCLUDE_OWNER_DEPRECATED: 'The includeOwner function is deprecated. This functionality is no longer supported. Please remove this method from your code.',
  ENTRY_INVALID_ARGUMENT: 'Invalid argument. Argument should be a String or an Array.',
  ENTRY_LANGUAGE_INVALID: 'Invalid language code. Argument should be a String.',
  ENTRY_ADD_QUERY_INVALID: 'Invalid query parameters. First argument should be a String.',
  ENTRY_ADD_PARAM_INVALID: 'Invalid parameters. Both key and value should be strings.',

  // Query/Transform Messages (only/except)
  TRANSFORM_INVALID_SINGLE_PARAM: 'Invalid parameters. Expected a string or an array of field names.',
  TRANSFORM_INVALID_DOUBLE_PARAM: 'Invalid parameters. Expected first parameter as a string (reference field UID) and second parameter as a string or an array of field names.',
  TRANSFORM_INVALID_PARAM_COUNT: 'Invalid parameters. Provide either one parameter (field name or array) or two parameters (reference field UID and field name or array).',

  // Request/Error Messages
  REQUEST_ERROR_OCCURRED: (error) => `An error occurred: ${error}`
};

export default MESSAGES;
