import { describe, expect, it } from 'bun:test';
import { getForklarendeTekst } from '@/lib/fiken/text';
import type { NordnetLine } from '@/lib/nordnet/types';
import { NordnetType } from '@/lib/nordnet/types';

const makeNordnetLine = (overrides: Partial<NordnetLine> & Pick<NordnetLine, 'transaksjonstype'>): NordnetLine => ({
  id: '1',
  bokførtDato: new Date('2024-03-15'),
  handelsDato: new Date('2024-03-15'),
  oppgjørsDato: new Date('2024-03-15'),
  portefølje: 'Konto A',
  beløp: 0n,
  saldo: 0n,
  transaksjonstekst: 'Original tekst',
  verdipapir: null,
  ISIN: null,
  month: 3,
  year: 2024,
  source: { fileName: 'test.csv', rowNumber: 0 },
  generated: false,
  unexpectedSaldo: false,
  unknownType: false,
  ...overrides,
});

describe('getForklarendeTekst', () => {
  it('should describe UTBYTTE with security name and ISIN', () => {
    const line = makeNordnetLine({
      transaksjonstype: NordnetType.UTBYTTE,
      verdipapir: 'Apple Inc.',
      ISIN: 'US0378331005',
    });

    expect(getForklarendeTekst(line, null, 'Konto A')).toBe('Utbytte Apple Inc. (US0378331005)');
  });

  it('should describe UTBYTTE without a security as a plain dividend', () => {
    const line = makeNordnetLine({ transaksjonstype: NordnetType.UTBYTTE, verdipapir: null });

    expect(getForklarendeTekst(line, null, 'Konto A')).toBe('Utbytte');
  });

  it('should use the raw transaction text for SPLITT UTTAK VP', () => {
    const line = makeNordnetLine({
      transaksjonstype: NordnetType.SPLITT_UTTAK_VP,
      transaksjonstekst: 'Splitt uttak Novo Nordisk',
    });

    expect(getForklarendeTekst(line, 'Konto A', 'Konto A')).toBe('Splitt uttak Novo Nordisk');
  });

  it('should use the raw transaction text for SPLITT INNLEGG VP', () => {
    const line = makeNordnetLine({
      transaksjonstype: NordnetType.SPLITT_INNLEGG_VP,
      transaksjonstekst: 'Splitt innlegg Novo Nordisk',
    });

    expect(getForklarendeTekst(line, 'Konto A', 'Konto A')).toBe('Splitt innlegg Novo Nordisk');
  });
});
