import { describe, it, expect, beforeEach, vi } from 'vitest';
import { detectLang } from './index';

/**
 * Régression : la langue retenue vient de `localStorage`, une valeur que la
 * page ne contrôle pas. Un test d'appartenance avec `in` remonterait la chaîne
 * de prototypes, `LOCALES['constructor']` rendrait une fonction au lieu d'un
 * dictionnaire, et la page resterait blanche à chaque visite.
 */

const store: Record<string, string> = {};
vi.stubGlobal('localStorage', {
  getItem: (k: string) => (k in store ? store[k] : null),
  setItem: (k: string, v: string) => {
    store[k] = v;
  },
});
vi.stubGlobal('navigator', { languages: ['fr-FR'] });

describe('detectLang', () => {
  beforeEach(() => {
    for (const k of Object.keys(store)) delete store[k];
  });

  it('ignore les clés de prototype stockées', () => {
    for (const junk of ['constructor', 'toString', 'valueOf', '__proto__', 'hasOwnProperty']) {
      store['understand-cidr.lang'] = junk;
      expect(detectLang()).toBe('fr'); // retombe sur navigator.languages
    }
  });

  it('ignore une langue inconnue', () => {
    store['understand-cidr.lang'] = 'kl';
    expect(detectLang()).toBe('fr');
  });

  it('retient une langue valide', () => {
    store['understand-cidr.lang'] = 'zh';
    expect(detectLang()).toBe('zh');
  });

  it('suit le navigateur en l absence de choix stocké', () => {
    expect(detectLang()).toBe('fr');
  });
});
