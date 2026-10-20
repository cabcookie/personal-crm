/**
 * Strips unpaired UTF-16 surrogates from streamed text.
 *
 * Nova Sonic's `onTranscript` text arrives in chunks over the bidirectional
 * stream; a chunk boundary can occasionally land in the middle of a
 * multi-byte/surrogate-pair character (common with non-ASCII text — umlauts,
 * etc. — in mixed-language transcripts). A lone surrogate half is valid as a
 * JS string but produces ill-formed JSON text when later serialized for a
 * GraphQL request, which AppSync rejects outright as "Variable 'X' has an
 * invalid value" — a generic request-parsing failure, not a validation error
 * tied to any particular field content.
 *
 * Replaces each unpaired surrogate with U+FFFD (replacement character) so
 * the string is always well-formed before it's ever stored in state or sent
 * to the backend.
 */
export const sanitizeSonicText = (text: string): string =>
  text.replace(
    /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g,
    "\uFFFD"
  );
