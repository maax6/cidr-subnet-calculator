import { useMemo, useState } from 'react';
import {
  parseCidr6,
  parseIPv6,
  parsePrefix6,
  describeSubnet6,
  analyzeRange6,
  splitSubnet6,
  compressIPv6,
  formatBigCount,
  type Ipv6SubnetInfo,
  type RangeResult6,
} from '../lib/ipv6';
import { isAddressError } from '../lib/errors';
import { subnet6ToRows, toJson6, toCsv, subnets6ToCsv, download } from '../lib/export';
import BinaryView, { bitsOf } from '../components/BinaryView';
import DataTable, { type Column } from '../components/DataTable';
import ResultGrid, { type Cell } from '../components/ResultGrid';
import Field from '../components/Field';
import Term from '../components/Term';
import { format, useI18n } from '../i18n';
import type { I18n, TermId } from '../i18n';

type Mode = 'cidr' | 'range' | 'prefix';

/** Au-delà de 12 bits empruntés, la liste des découpages devient inutilisable. */
const MAX_SPLIT_DEPTH = 12;

function columns(locale: string): Array<Column<Ipv6SubnetInfo>> {
  return [
    { term: 'cidr', strong: true, render: (s) => s.cidr },
    { term: 'network', render: (s) => compressIPv6(s.network) },
    { term: 'firstUsable6', render: (s) => compressIPv6(s.firstUsable) },
    { term: 'lastAddress6', render: (s) => compressIPv6(s.lastAddress) },
    {
      term: 'totalAddresses6',
      numeric: true,
      render: (s) => formatBigCount(s.totalAddresses, locale),
    },
  ];
}

type Outcome =
  | { kind: 'subnet'; info: Ipv6SubnetInfo }
  | { kind: 'range'; range: RangeResult6 }
  | { kind: 'error'; message: string }
  | null;

export default function Ipv6Panel() {
  const i18n = useI18n();
  const { t, locale } = i18n;
  const [mode, setMode] = useState<Mode>('cidr');
  const [cidr, setCidr] = useState('2001:db8:1:2:0210:5aff:fe0a:a9c6/64');
  const [rangeStart, setRangeStart] = useState('2001:db8::5');
  const [rangeEnd, setRangeEnd] = useState('2001:db8::82');
  const [address, setAddress] = useState('2001:db8:1:2:0210:5aff:fe0a:a9c6');
  const [prefix, setPrefix] = useState('64');
  const [splitPrefix, setSplitPrefix] = useState<number | null>(null);

  const MODES: Array<{ id: Mode; label: string }> = [
    { id: 'cidr', label: t.ui.mode6Cidr },
    { id: 'range', label: t.ui.mode6Range },
    { id: 'prefix', label: t.ui.mode6Prefix },
  ];

  const outcome: Outcome = useMemo(() => {
    try {
      switch (mode) {
        case 'cidr':
          return { kind: 'subnet', info: parseCidr6(cidr) };
        case 'prefix':
          return {
            kind: 'subnet',
            info: describeSubnet6(parseIPv6(address), parsePrefix6(prefix)),
          };
        case 'range':
          return {
            kind: 'range',
            range: analyzeRange6(parseIPv6(rangeStart), parseIPv6(rangeEnd)),
          };
      }
    } catch (err) {
      if (isAddressError(err)) return { kind: 'error', message: i18n.error(err.code, err.params) };
      return { kind: 'error', message: (err as Error).message };
    }
  }, [mode, cidr, address, prefix, rangeStart, rangeEnd, i18n]);

  const info = outcome?.kind === 'subnet' ? outcome.info : null;

  const split = useMemo(() => {
    if (!info || splitPrefix === null || splitPrefix <= info.prefix) return null;
    try {
      return splitSubnet6(info.network, info.prefix, splitPrefix, 256);
    } catch {
      return null;
    }
  }, [info, splitPrefix]);

  return (
    <>
      <div className="tabs" role="tablist" aria-label={t.ui.modeLabel6}>
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
            hint={t.ui.fieldCidr6Hint}
            value={cidr}
            onChange={setCidr}
            placeholder="2001:db8:1:2::/64"
          />
        )}

        {mode === 'range' && (
          <div className="field-row">
            <Field label={t.ui.fieldRangeStart} value={rangeStart} onChange={setRangeStart} placeholder="2001:db8::5" />
            <Field label={t.ui.fieldRangeEnd} value={rangeEnd} onChange={setRangeEnd} placeholder="2001:db8::82" />
          </div>
        )}

        {mode === 'prefix' && (
          <div className="field-row">
            <Field label={t.ui.fieldAddress} value={address} onChange={setAddress} placeholder="2001:db8:1:2::1" />
            <Field
              label={t.ui.fieldPrefix}
              hint={t.ui.fieldPrefixHint}
              value={prefix}
              onChange={setPrefix}
              placeholder="64"
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
          <Subnet6Result info={info} i18n={i18n} />

          <section className="section">
            <h2>
              <Term id="binary" />
            </h2>
            <BinaryView
              prefix={info.prefix}
              groupSize={16}
              networkLabel={t.ui.prefixBits}
              hostLabel={t.ui.interfaceBits}
              rows={[
                { term: 'addressInput', label: t.ui.binaryRowAddress, bits: bitsOf(info.address, 128), text: info.compressed },
                { term: 'prefix6', label: t.ui.binaryRowMask, bits: bitsOf(info.mask, 128), text: `/${info.prefix}` },
                { term: 'network', label: t.ui.binaryRowNetwork, bits: bitsOf(info.network, 128), text: compressIPv6(info.network) },
                { term: 'lastAddress6', label: t.ui.binaryRowLast, bits: bitsOf(info.lastAddress, 128), text: compressIPv6(info.lastAddress) },
              ]}
            />
          </section>

          <section className="section">
            <h2>
              <Term id="split6" />
            </h2>
            <label className="inline-field">
              {t.ui.newPrefix}
              <select
                value={splitPrefix ?? ''}
                onChange={(e) => setSplitPrefix(e.target.value === '' ? null : Number(e.target.value))}
              >
                <option value="">{t.ui.noSplit}</option>
                {Array.from(
                  { length: Math.min(MAX_SPLIT_DEPTH, 128 - info.prefix) },
                  (_, i) => info.prefix + i + 1,
                ).map((p) => (
                  <option key={p} value={p}>
                    {format(t.ui.splitOption6, {
                      prefix: p,
                      count: formatBigCount(1n << BigInt(p - info.prefix), locale),
                      size: formatBigCount(1n << BigInt(128 - p), locale),
                    })}
                  </option>
                ))}
              </select>
            </label>
            {128 - info.prefix > MAX_SPLIT_DEPTH && (
              <p className="muted">
                {format(t.ui.splitCapped, { prefix: info.prefix + MAX_SPLIT_DEPTH })}
              </p>
            )}

            {split && (
              <>
                <DataTable columns={columns(locale)} rows={split.subnets} rowKey={(s) => s.cidr} />
                {split.truncated && (
                  <p className="muted">
                    {format(t.ui.splitTruncated, {
                      total: formatBigCount(split.total, locale),
                      shown: split.subnets.length,
                    })}
                  </p>
                )}
                <div className="actions">
                  <button
                    type="button"
                    onClick={() =>
                      download(
                        `subnets-ipv6-${splitPrefix}.csv`,
                        subnets6ToCsv(split.subnets, t, locale),
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
            <button
              type="button"
              onClick={() => download(`ipv6-${info.prefix}.json`, toJson6(info, t), 'application/json')}
            >
              {t.ui.exportJson}
            </button>
            <button
              type="button"
              onClick={() =>
                download(`ipv6-${info.prefix}.csv`, toCsv(subnet6ToRows(info, t, locale), t), 'text/csv')
              }
            >
              {t.ui.exportCsv}
            </button>
            <button type="button" onClick={() => navigator.clipboard?.writeText(toJson6(info, t))}>
              {t.ui.copyJson}
            </button>
          </div>
        </>
      )}

      {outcome?.kind === 'range' && <Range6ResultView range={outcome.range} i18n={i18n} />}
    </>
  );
}

function Subnet6Result({ info, i18n }: { info: Ipv6SubnetInfo; i18n: I18n }) {
  const { t, locale } = i18n;
  const cells: Cell[] = [
    { term: 'cidr', value: info.cidr },
    { term: 'compressed', value: info.compressed },
    { term: 'expanded', value: info.expanded },
    { term: 'network', value: compressIPv6(info.network) },
    { term: 'lastAddress6', value: compressIPv6(info.lastAddress) },
    { term: 'prefix6', value: `/${info.prefix}` },
    { term: 'prefixIidBits', value: `${info.prefix} / ${info.hostBits}` },
    { term: 'firstUsable6', value: compressIPv6(info.firstUsable) },
    { term: 'lastUsable6', value: compressIPv6(info.lastUsable) },
    { term: 'totalAddresses6', value: formatBigCount(info.totalAddresses, locale) },
    { term: 'usableAddresses6', value: formatBigCount(info.usableAddresses, locale) },
    { term: 'interfaceId', value: '0x' + info.interfaceId.toString(16) },
    { term: 'hex6', value: info.hex },
    { term: 'solicitedNode', value: compressIPv6(info.solicitedNode) },
  ];

  if (info.subnetRouterAnycast !== null) {
    cells.push({ term: 'subnetRouterAnycast', value: compressIPv6(info.subnetRouterAnycast) });
  }
  if (info.scope) {
    cells.push({
      term: 'multicastScope',
      value: `${t.scopes[info.scope.key]} (0x${info.scope.value.toString(16)})`,
    });
  }
  if (info.embeddedMac) {
    cells.push({ term: 'embeddedMac', value: info.embeddedMac });
  }

  const typeTerm: TermId =
    info.type?.cidr === 'fc00::/7'
      ? 'ula'
      : info.type?.cidr === 'fe80::/10'
        ? 'linkLocal'
        : info.type?.cidr === 'ff00::/8'
          ? 'multicastScope'
          : 'ipv6Type';

  return (
    <section className="section">
      <h2>{t.ui.result}</h2>
      <p className="hint-line">{t.ui.hoverHint}</p>

      <div className="badges">
        <span className={'badge ' + (info.type?.routable ? 'badge-public' : 'badge-private')}>
          <Term id={typeTerm}>
            {info.type ? t.ipv6Types[info.type.labelKey] : t.ui.badgeUnassigned6}
          </Term>
        </span>
        {info.type && (
          <span className="badge badge-neutral">
            <Term id="ipv6Type">
              {info.type.cidr} · {info.type.rfc}
            </Term>
          </span>
        )}
        {!info.addressIsNetwork && (
          <span className="badge badge-neutral">
            <Term id="hostInBlock">
              {format(t.ui.badgeInterfaceInBlock, { address: info.compressed, cidr: info.cidr })}
            </Term>
          </span>
        )}
      </div>

      <ResultGrid cells={cells} />

      {info.noteKey && <p className="note">{t.notes[info.noteKey]}</p>}
    </section>
  );
}

function Range6ResultView({ range, i18n }: { range: RangeResult6; i18n: I18n }) {
  const { t, locale } = i18n;

  return (
    <section className="section">
      <h2>{t.ui.result}</h2>
      <p className="hint-line">{t.ui.hoverHint}</p>

      <div className="badges">
        <span className="badge badge-neutral">
          <Term id="rangeCount">
            {format(t.ui.badgeAddressCount, { count: formatBigCount(range.count, locale) })}
          </Term>
        </span>
        <span className="badge badge-neutral">
          <Term id="cidrBlocks">{format(t.ui.badgeBlockCount, { count: range.cidrs.length })}</Term>
        </span>
        <span className={'badge ' + (range.exact ? 'badge-private' : 'badge-warn')}>
          <Term id="exactBlock">{range.exact ? t.ui.badgeExact : t.ui.badgeNotExact}</Term>
        </span>
      </div>

      <ResultGrid
        cells={[
          { term: 'rangeStart', value: compressIPv6(range.start) },
          { term: 'rangeEnd', value: compressIPv6(range.end) },
          { term: 'enclosing', value: range.enclosing.cidr },
          {
            term: 'overflow',
            value: format(t.ui.overflowValue, {
              count: formatBigCount(range.enclosing.totalAddresses - range.count, locale),
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
          onClick={() => download('plage-ipv6.csv', subnets6ToCsv(range.cidrs, t, locale), 'text/csv')}
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
