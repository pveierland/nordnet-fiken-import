import { describe, expect, it } from 'bun:test';
import { getKonti } from '@/lib/fiken/accounts';
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
  transaksjonstekst: 'Test',
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

describe('getKonti', () => {
  it('should route UTBYTTE as cash into the portfolio account', () => {
    const line = makeNordnetLine({ transaksjonstype: NordnetType.UTBYTTE, beløp: 50000n });

    expect(getKonti(line)).toEqual({ fraKonto: null, tilKonto: 'Konto A' });
  });

  it('should keep SPLITT UTTAK VP within the portfolio account', () => {
    const line = makeNordnetLine({ transaksjonstype: NordnetType.SPLITT_UTTAK_VP });

    expect(getKonti(line)).toEqual({ fraKonto: 'Konto A', tilKonto: 'Konto A' });
  });

  it('should keep SPLITT INNLEGG VP within the portfolio account', () => {
    const line = makeNordnetLine({ transaksjonstype: NordnetType.SPLITT_INNLEGG_VP });

    expect(getKonti(line)).toEqual({ fraKonto: 'Konto A', tilKonto: 'Konto A' });
  });
});
