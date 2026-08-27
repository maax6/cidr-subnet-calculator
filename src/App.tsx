import { useState } from 'react';
import Ipv4Panel from './views/Ipv4Panel';
import Ipv6Panel from './views/Ipv6Panel';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useI18n } from './i18n';

type Protocol = 'v4' | 'v6';

export default function App() {
  const { t } = useI18n();
  const [protocol, setProtocol] = useState<Protocol>('v4');

  return (
    <div className="page">
      <main className="card">
        <div className="header">
          <h1>{t.ui.title}</h1>
          <LanguageSwitcher />
        </div>

        <p>{t.ui.intro}</p>

        <ol className="steps">
          <li>{t.ui.step1}</li>
          <li>{t.ui.step2}</li>
          <li>{t.ui.step3}</li>
        </ol>

        <div className="switch" role="group" aria-label={t.ui.protocol}>
          <button
            type="button"
            className={'switch-option' + (protocol === 'v4' ? ' switch-active' : '')}
            aria-pressed={protocol === 'v4'}
            onClick={() => setProtocol('v4')}
          >
            IPv4
          </button>
          <button
            type="button"
            className={'switch-option' + (protocol === 'v6' ? ' switch-active' : '')}
            aria-pressed={protocol === 'v6'}
            onClick={() => setProtocol('v6')}
          >
            IPv6
          </button>
        </div>

        {protocol === 'v4' ? <Ipv4Panel /> : <Ipv6Panel />}

        <footer className="footer">{t.ui.footer}</footer>
      </main>
    </div>
  );
}
