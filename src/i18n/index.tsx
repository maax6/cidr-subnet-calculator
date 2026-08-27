import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Translation } from './types';
import { format } from './types';
import fr from './fr';
import en from './en';
import es from './es';
import de from './de';
import pt from './pt';
import zh from './zh';

export type LangCode = 'fr' | 'en' | 'es' | 'de' | 'pt' | 'zh';

/**
 * Les six dictionnaires sont embarqués dans le bundle plutôt que chargés à la
 * demande : le glossaire *est* le produit, et un changement de langue qui
 * laisserait la page vide un instant coûterait plus que les quelques kilo-octets
 * gagnés.
 */
export const LOCALES: Record<LangCode, Translation> = { fr, en, es, de, pt, zh };

export const LANG_ORDER: LangCode[] = ['fr', 'en', 'es', 'de', 'pt', 'zh'];

const STORAGE_KEY = 'understand-cidr.lang';
const DEFAULT_LANG: LangCode = 'en';

/**
 * `value in LOCALES` remonterait la chaîne de prototypes : « constructor »,
 * « toString » ou « valueOf » passeraient le test, et `LOCALES[value]` rendrait
 * une fonction au lieu d'un dictionnaire. La valeur venant de `localStorage`,
 * la page resterait blanche à chaque visite jusqu'à effacement du stockage.
 */
function isLang(value: string | null): value is LangCode {
  return value !== null && (LANG_ORDER as readonly string[]).includes(value);
}

/** Langue retenue au dernier passage, sinon celle du navigateur, sinon l'anglais. */
export function detectLang(): LangCode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLang(stored)) return stored;
  } catch {
    // Navigation privée ou stockage refusé : la détection navigateur suffit.
  }
  const candidates = typeof navigator === 'undefined' ? [] : (navigator.languages ?? [navigator.language]);
  for (const tag of candidates) {
    const base = String(tag).toLowerCase().split('-')[0];
    if (isLang(base)) return base;
  }
  return DEFAULT_LANG;
}

export interface I18n {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  t: Translation;
  /** Étiquette BCP 47 à passer à `Intl` pour les nombres. */
  locale: string;
  /** Message d'erreur d'un moteur, dans la langue active. */
  error: (code: keyof Translation['errors'], params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18n | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(detectLang);

  const setLang = useCallback((next: LangCode) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Le choix vaut alors pour la session en cours seulement.
    }
  }, []);

  const t = LOCALES[lang];

  useEffect(() => {
    document.documentElement.lang = t.meta.locale;
  }, [t.meta.locale]);

  const value = useMemo<I18n>(
    () => ({
      lang,
      setLang,
      t,
      locale: t.meta.locale,
      error: (code, params) => format(t.errors[code], params),
    }),
    [lang, setLang, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n hors de I18nProvider');
  return ctx;
}

export { format };
export type { Translation, TermId, GlossaryEntry } from './types';
