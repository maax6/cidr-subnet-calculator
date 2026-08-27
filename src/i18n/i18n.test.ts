import { describe, it, expect } from 'vitest';
import { LANG_ORDER, LOCALES } from './index';
import { format } from './types';
import fr from './fr';

/**
 * TypeScript garantit déjà qu'aucune clé ne manque : `Translation` ferme chaque
 * dictionnaire sur une union. Restent deux fautes qu'il ne voit pas — une chaîne
 * vide, et un `{jeton}` perdu à la traduction, qui laisserait un trou dans la
 * phrase rendue.
 */

const TOKEN = /\{(\w+)\}/g;

function tokensOf(s: string): string[] {
  return [...s.matchAll(TOKEN)].map((m) => m[1]).sort();
}

/** Toutes les chaînes d'un dictionnaire, avec leur chemin. */
function walk(value: unknown, path: string[] = []): Array<[string, string]> {
  if (typeof value === 'string') return [[path.join('.'), value]];
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => walk(v, [...path, k]));
  }
  return [];
}

describe.each(LANG_ORDER)('locale %s', (lang) => {
  const t = LOCALES[lang];

  it('ne contient aucune chaîne vide', () => {
    const empty = walk(t).filter(([, v]) => v.trim() === '');
    expect(empty).toEqual([]);
  });

  it('déclare une étiquette BCP 47 utilisable par Intl', () => {
    expect(() => new Intl.NumberFormat(t.meta.locale)).not.toThrow();
    expect(Intl.NumberFormat.supportedLocalesOf(t.meta.locale)).toHaveLength(1);
  });

  it('conserve les jetons d\'interpolation du français', () => {
    const reference = new Map(walk(fr).map(([k, v]) => [k, tokensOf(v)]));
    const mismatched = walk(t)
      .filter(([key, value]) => {
        const expected = reference.get(key);
        return expected !== undefined && String(expected) !== String(tokensOf(value));
      })
      .map(([key]) => key);
    expect(mismatched).toEqual([]);
  });

  it('remplit chaque jeton au rendu', () => {
    const rendered = format(t.ui.splitOption4, { prefix: 26, count: '4', size: '62' });
    expect(rendered).not.toMatch(TOKEN);
    expect(rendered).toContain('26');
    expect(rendered).toContain('62');
  });

  it('garde les adresses des exemples identiques au français', () => {
    // Une adresse « traduite » serait une coquille invisible à la relecture.
    const addresses = (s: string) =>
      (s.match(/\b(?:\d{1,3}\.){3}\d{1,3}(?:\/\d{1,2})?\b|\b[0-9a-f]{1,4}(?::[0-9a-f:]+)+\b/gi) ?? [])
        .sort();
    const reference = new Map(walk(fr).map(([k, v]) => [k, addresses(v)]));
    const drifted = walk(t)
      .filter(([key, value]) => {
        const expected = reference.get(key);
        return expected !== undefined && String(expected) !== String(addresses(value));
      })
      .map(([key]) => key);
    expect(drifted).toEqual([]);
  });
});

describe('registre des langues', () => {
  it('expose les six langues dans un ordre stable', () => {
    expect(LANG_ORDER).toEqual(['fr', 'en', 'es', 'de', 'pt', 'zh']);
    expect(Object.keys(LOCALES).sort()).toEqual([...LANG_ORDER].sort());
  });

  it('nomme chaque langue dans sa propre langue', () => {
    expect(LANG_ORDER.map((l) => LOCALES[l].meta.label)).toEqual([
      'Français',
      'English',
      'Español',
      'Deutsch',
      'Português',
      '简体中文',
    ]);
  });
});
