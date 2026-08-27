import { LANG_ORDER, LOCALES, useI18n } from '../i18n';
import type { LangCode } from '../i18n';

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();

  return (
    <label className="lang">
      <span className="sr-only">{t.meta.label}</span>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as LangCode)}
        aria-label="Language"
      >
        {LANG_ORDER.map((code) => (
          <option key={code} value={code}>
            {LOCALES[code].meta.label}
          </option>
        ))}
      </select>
    </label>
  );
}
