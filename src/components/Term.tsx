import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useI18n } from '../i18n';
import type { TermId } from '../i18n';

/**
 * Intitulé survolable : ouvre une info-bulle décrivant le terme.
 *
 * L'info-bulle est rendue dans un portail sur `document.body` et positionnée en
 * `position: fixed`. Les conteneurs de résultat (`.grid`, `.data-table`,
 * `.table-scroll`) portent `overflow: hidden` ou `auto` et rogneraient un
 * élément positionné à l'intérieur.
 *
 * Ouverture au survol *et* au focus clavier, fermeture au départ du pointeur,
 * à la perte de focus, à Échap et au défilement.
 */

import { createPortal } from 'react-dom';

interface Coords {
  left: number;
  top: number;
  /** Bulle au-dessus du déclencheur quand la place manque en dessous. */
  above: boolean;
}

const GAP = 8;
const MARGIN = 8;

export default function Term({ id, children }: { id: TermId; children?: ReactNode }) {
  const { t } = useI18n();
  const entry = t.glossary[id];
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<Coords | null>(null);
  const tipId = useId();

  const close = useCallback(() => {
    setOpen(false);
    setCoords(null);
  }, []);

  // Mesure après le premier rendu de la bulle : la largeur réelle est
  // nécessaire pour la recentrer sans déborder de la fenêtre.
  useLayoutEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const tip = tipRef.current;
    if (!trigger || !tip) return;

    const anchor = trigger.getBoundingClientRect();
    const box = tip.getBoundingClientRect();
    const above =
      anchor.bottom + GAP + box.height > window.innerHeight && anchor.top > box.height + GAP;
    const left = Math.min(
      Math.max(anchor.left + anchor.width / 2 - box.width / 2, MARGIN),
      Math.max(window.innerWidth - box.width - MARGIN, MARGIN),
    );
    setCoords({ left, top: above ? anchor.top - box.height - GAP : anchor.bottom + GAP, above });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="term"
        aria-describedby={open ? tipId : undefined}
        aria-expanded={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={close}
        onFocus={() => setOpen(true)}
        onBlur={close}
        onClick={() => (open ? close() : setOpen(true))}
      >
        {children ?? t.labels[id]}
      </button>

      {open &&
        createPortal(
          <div
            ref={tipRef}
            id={tipId}
            role="tooltip"
            className={'tooltip' + (coords?.above ? ' tooltip-above' : '')}
            style={{
              left: coords ? `${coords.left}px` : '0px',
              top: coords ? `${coords.top}px` : '0px',
              visibility: coords ? 'visible' : 'hidden',
            }}
          >
            <p className="tooltip-title">{entry.terme}</p>
            <p className="tooltip-body">{entry.court}</p>
            {entry.detail && <p className="tooltip-detail">{entry.detail}</p>}
            {entry.rfc && <p className="tooltip-rfc">{entry.rfc}</p>}
          </div>,
          document.body,
        )}
    </>
  );
}
