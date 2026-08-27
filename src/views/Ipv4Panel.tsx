import { useMemo, useState } from 'react';
import {
  parseCidr,
  parseIPv4,
  parsePrefixOrMask,
  describeSubnet,
  prefixForHosts,
  analyzeRange,
  splitSubnet,
  ipToString,
  ipToHex,
  formatCount,
  type SubnetInfo,
  type RangeResult,
} from '../lib/ipv4';
import { isAddressError } from '../lib/errors';
import { subnetToRows, toJson, toCsv, subnetsToCsv, download } from '../lib/export';
import BinaryView, { bitsOf } from '../components/BinaryView';
import DataTable, { type Column } from '../components/DataTable';
import ResultGrid, { type Cell } from '../components/ResultGrid';
import Field from '../components/Field';
import Term from '../components/Term';
import { format, useI18n } from '../i18n';
import type { I18n } from '../i18n';

type Mode = 'cidr' | 'range' | 'netmask' | 'hosts';

type Outcome =
  | { kind: 'subnet'; info: SubnetInfo }
  | { kind: 'range'; range: RangeResult }
  | { kind: 'error'; message: string }
  | null;

function columns(locale: string): Array<Column<SubnetInfo>> {
  return [
    { term: 'cidr', strong: true, render: (s) => s.cidr },
    { term: 'network', render: (s) => ipToString(s.network) },
    { term: 'firstUsable', render: (s) => (s.firstUsable === null ? '—' : ipToString(s.firstUsable)) },
    { term: 'lastUsable', render: (s) => (s.lastUsable === null ? '—' : ipToString(s.lastUsable)) },
    { term: 'broadcast', render: (s) => ipToString(s.broadcast) },
    { term: 'usableHosts', numeric: true, render: (s) => formatCount(s.usableHosts, locale) },
  ];
}

export default function Ipv4Panel() {
  const i18n = useI18n();
  const { t, locale } = i18n;
  const [mode, setMode] = useState<Mode>('cidr');
  const [cidr, setCidr] = useState('10.0.0.0/24');
  const [rangeStart, setRangeStart] = useState('192.168.1.5');
  const [rangeEnd, setRangeEnd] = useState('192.168.1.130');
  const [address, setAddress] = useState('172.16.4.37');
  const [netmask, setNetmask] = useState('255.255.240.0');
  const [hostAddress, setHostAddress] = useState('10.20.0.0');
  const [hosts, setHosts] = useState('500');
  const [splitPrefix, setSplitPrefix] = useState<number | null>(null);

  const MODES: Array<{ id: Mode; label: string }> = [
    { id: 'cidr', label: t.ui.mode4Cidr },
    { id: 'range', label: t.ui.mode4Range },
    { id: 'netmask', label: t.ui.mode4Netmask },
    { id: 'hosts', label: t.ui.mode4Hosts },
  ];

  const outcome: Outcome = useMemo(() => {
    try {
      switch (mode) {
        case 'cidr':
          return { kind: 'subnet', info: parseCidr(cidr) };
        case 'netmask':
          return {
            kind: 'subnet',
            info: describeSubnet(parseIPv4(address), parsePrefixOrMask(netmask)),
          };
        case 'hosts': {
          const n = Number(String(hosts).trim().replace(/[\s_]/g, ''));
          return { kind: 'subnet', info: describeSubnet(parseIPv4(hostAddress), prefixForHosts(n)) };
        }
        case 'range':
          return { kind: 'range', range: analyzeRange(parseIPv4(rangeStart), parseIPv4(rangeEnd)) };
      }
    } catch (err) {
      if (isAddressError(err)) return { kind: 'error', message: i18n.error(err.code, err.params) };
      return { kind: 'error', message: (err as Error).message };
    }
  }, [mode, cidr, address, netmask, hostAddress, hosts, rangeStart, rangeEnd, i18n]);

  const info = outcome?.kind === 'subnet' ? outcome.info : null;

  const split = useMemo(() => {
    if (!info || splitPrefix === null || splitPrefix <= info.prefix) return null;
    try {
      return splitSubnet(info.network, info.prefix, splitPrefix, 512);
    } catch {
      return null;
    }
  }, [info, splitPrefix]);

  return (
    <>
      <div className="tabs" role="tablist" aria-label={t.ui.modeLabel4}>
        {MODES.map((m) => (
          <button
            key={m.id}
            role="tab"
            type="button"
            aria-selected={mode === m.id}
            className={'tab' + (mode === m.id ? ' tab-active' : '')}
            onClick={() => {
              setMode(m.id);
              setSplitPrefix(null);
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        {mode === 'cidr' && (
          <Field
            label="CIDR"
            hint={t.ui.fieldCidr4Hint}
            value={cidr}
            onChange={setCidr}
            placeholder="10.0.0.0/24"
          />
        )}

        {mode === 'range' && (
          <div className="field-row">
            <Field label={t.ui.fieldRangeStart} value={rangeStart} onChange={setRangeStart} placeholder="192.168.1.5" />
            <Field label={t.ui.fieldRangeEnd} value={rangeEnd} onChange={setRangeEnd} placeholder="192.168.1.130" />
          </div>
        )}

        {mode === 'netmask' && (
          <div className="field-row">
            <Field label={t.ui.fieldAddress} value={address} onChange={setAddress} placeholder="172.16.4.37" />
            <Field
              label={t.ui.fieldNetmask}
              hint={t.ui.fieldNetmaskHint}
              value={netmask}
              onChange={setNetmask}
              placeholder="255.255.240.0"
            />
          </div>
        )}

        {mode === 'hosts' && (
          <div className="field-row">
            <Field label={t.ui.fieldAddress} value={hostAddress} onChange={setHostAddress} placeholder="10.20.0.0" />
            <Field
              label={t.ui.fieldHosts}
              hint={t.ui.fieldHostsHint}
              value={hosts}
              onChange={setHosts}
              placeholder="500"
              inputMode="numeric"
            />
          </div>
        )}
      </form>

      {outcome?.kind === 'error' && (
        <p className="error" role="alert">
          {outcome.message}
        </p>
      )}

      {info && (
        <>
          <SubnetResult info={info} i18n={i18n} />

          <section className="section">
            <h2>
              <Term id="binary" />
            </h2>
            <BinaryView
              prefix={info.prefix}
              groupSize={8}
              networkLabel={t.ui.networkBits}
              hostLabel={t.ui.hostBits}
              rows={[
                { term: 'addressInput', label: t.ui.binaryRowAddress, bits: bitsOf(info.address, 32), text: ipToString(info.address) },
                { term: 'netmask', label: t.ui.binaryRowMask, bits: bitsOf(info.mask, 32), text: ipToString(info.mask) },
                { term: 'network', label: t.ui.binaryRowNetwork, bits: bitsOf(info.network, 32), text: ipToString(info.network) },
                {
                  term: info.prefix >= 31 ? 'blockLastAddress' : 'broadcast',
                  label: info.prefix >= 31 ? t.ui.binaryRowLast : t.ui.binaryRowBroadcast,
                  bits: bitsOf(info.broadcast, 32),
                  text: ipToString(info.broadcast),
                },
              ]}
            />
          </section>

          <section className="section">
            <h2>
              <Term id="split" />
            </h2>
            <label className="inline-field">
              {t.ui.newPrefix}
              <select
                value={splitPrefix ?? ''}
                onChange={(e) => setSplitPrefix(e.target.value === '' ? null : Number(e.target.value))}
              >
                <option value="">{t.ui.noSplit}</option>
                {Array.from({ length: 32 - info.prefix }, (_, i) => info.prefix + i + 1).map((p) => (
                  <option key={p} value={p}>
                    {format(t.ui.splitOption4, {
                      prefix: p,
                      count: formatCount(Math.pow(2, p - info.prefix), locale),
                      size: formatCount(p <= 30 ? Math.pow(2, 32 - p) - 2 : p === 31 ? 2 : 1, locale),
                    })}
                  </option>
                ))}
              </select>
            </label>

            {split && (
              <>
                <DataTable columns={columns(locale)} rows={split.subnets} rowKey={(s) => s.cidr} />
                {split.truncated && (
                  <p className="muted">
                    {format(t.ui.splitTruncated, {
                      total: formatCount(split.total, locale),
                      shown: formatCount(split.subnets.length, locale),
                    })}
                  </p>
                )}
                <div className="actions">
                  <button
                    type="button"
                    onClick={() =>
                      download(
                        `subnets-${ipToString(info.network)}-${splitPrefix}.csv`,
                        subnetsToCsv(split.subnets, t, locale),
                        'text/csv',
                      )
                    }
                  >
                    {t.ui.exportSubnetsCsv}
                  </button>
                </div>
              </>
            )}
          </section>

          <div className="actions">
            <button type="button" onClick={() => download(`cidr-${info.prefix}.json`, toJson(info, t), 'application/json')}>
              {t.ui.exportJson}
            </button>
            <button
              type="button"
              onClick={() =>
                download(`cidr-${info.prefix}.csv`, toCsv(subnetToRows(info, t, locale), t), 'text/csv')
              }
            >
              {t.ui.exportCsv}
            </button>
            <button type="button" onClick={() => navigator.clipboard?.writeText(toJson(info, t))}>
              {t.ui.copyJson}
            </button>
          </div>
        </>
      )}

      {outcome?.kind === 'range' && <RangeResultView range={outcome.range} i18n={i18n} />}
    </>
  );
}

function SubnetResult({ info, i18n }: { info: SubnetInfo; i18n: I18n }) {
  const { t, locale } = i18n;
  const lastIsBroadcast = info.prefix <= 30;
  const cells: Cell[] = [
    { term: 'cidr', value: info.cidr },
    { term: 'network', value: ipToString(info.network) },
    {
      term: lastIsBroadcast ? 'broadcast' : 'blockLastAddress',
      value: ipToString(info.broadcast),
    },
    { term: 'netmask', value: ipToString(info.mask) },
    { term: 'wildcard', value: ipToString(info.wildcard) },
    { term: 'firstUsable', value: info.firstUsable === null ? '—' : ipToString(info.firstUsable) },
    { term: 'lastUsable', value: info.lastUsable === null ? '—' : ipToString(info.lastUsable) },
    { term: 'usableHosts', value: formatCount(info.usableHosts, locale) },
    { term: 'totalAddresses', value: formatCount(info.totalAddresses, locale) },
    { term: 'prefixHostBits', value: `${info.prefix} / ${info.hostBits}` },
    { term: 'hex', value: ipToHex(info.network) },
    {
      term: 'ipClass',
      value: `${info.ipClass.letter} — ${t.classNotes[info.ipClass.noteKey]}`,
    },
  ];

  return (
    <section className="section">
      <h2>{t.ui.result}</h2>
      <p className="hint-line">{t.ui.hoverHint}</p>

      <div className="badges">
        <span className={'badge ' + (info.isPrivate ? 'badge-private' : 'badge-public')}>
          <Term id={info.isPrivate ? 'scopePrivate' : info.specialUse ? 'specialUse' : 'scopePublic'}>
            {info.isPrivate ? t.labels.scopePrivate : info.specialUse ? t.ui.badgeSpecialUse : t.ui.badgePublic}
          </Term>
        </span>
        {info.specialUse && (
          <span className="badge badge-neutral">
            <Term id="specialUse">
              {t.specialUse[info.specialUse.labelKey]} · {info.specialUse.cidr} · {info.specialUse.rfc}
            </Term>
          </span>
        )}
        {info.address !== info.network && !info.addressIsBroadcast && (
          <span className="badge badge-neutral">
            <Term id="hostInBlock">
              {format(t.ui.badgeHostInBlock, { address: ipToString(info.address), cidr: info.cidr })}
            </Term>
          </span>
        )}
        {info.addressIsBroadcast && (
          <span className="badge badge-warn">
            <Term id="addressIsBroadcast">{t.ui.badgeAddressIsBroadcast}</Term>
          </span>
        )}
      </div>

      <ResultGrid cells={cells} />

      {info.noteKey && <p className="note">{t.notes[info.noteKey]}</p>}
    </section>
  );
}

function RangeResultView({ range, i18n }: { range: RangeResult; i18n: I18n }) {
  const { t, locale } = i18n;

  return (
    <section className="section">
      <h2>{t.ui.result}</h2>
      <p className="hint-line">{t.ui.hoverHint}</p>

      <div className="badges">
        <span className="badge badge-neutral">
          <Term id="rangeCount">
            {format(t.ui.badgeAddressCount, { count: formatCount(range.count, locale) })}
          </Term>
        </span>
        <span className="badge badge-neutral">
          <Term id="cidrBlocks">
            {format(t.ui.badgeBlockCount, { count: range.cidrs.length })}
          </Term>
        </span>
        <span className={'badge ' + (range.exact ? 'badge-private' : 'badge-warn')}>
          <Term id="exactBlock">{range.exact ? t.ui.badgeExact : t.ui.badgeNotExact}</Term>
        </span>
      </div>

      <ResultGrid
        cells={[
          { term: 'rangeStart', value: ipToString(range.start) },
          { term: 'rangeEnd', value: ipToString(range.end) },
          { term: 'enclosing', value: range.enclosing.cidr },
          {
            term: 'overflow',
            value: format(t.ui.overflowValue, {
              count: formatCount(range.enclosing.totalAddresses - range.count, locale),
            }),
          },
        ]}
      />

      <h3>
        <Term id="minimalDecomposition" />
      </h3>
      <DataTable columns={columns(locale)} rows={range.cidrs} rowKey={(s) => s.cidr} />

      <div className="actions">
        <button
          type="button"
          onClick={() => download('plage-cidr.csv', subnetsToCsv(range.cidrs, t, locale), 'text/csv')}
        >
          {t.ui.exportBlocksCsv}
        </button>
        <button
          type="button"
          onClick={() => navigator.clipboard?.writeText(range.cidrs.map((c) => c.cidr).join('\n'))}
        >
          {t.ui.copyCidrList}
        </button>
      </div>
    </section>
  );
}
