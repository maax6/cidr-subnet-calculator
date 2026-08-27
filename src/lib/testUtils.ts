import type { ErrorCode } from './errors';
import { isAddressError } from './errors';

/** Code de l'erreur levée par `fn` : on asserte sur le code, jamais sur un texte traduit. */
export function codeOf(fn: () => unknown): ErrorCode {
  try {
    fn();
  } catch (err) {
    if (isAddressError(err)) return err.code;
    throw err;
  }
  throw new Error('aucune erreur levée');
}
