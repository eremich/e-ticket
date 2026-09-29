import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { NavBar } from '../../components/NavBar';
import { MetroMap } from '../../components/MetroMap';
import { ZoomPan } from '../../components/ZoomPan';
import { useT } from '../../i18n';
import { StationSheet } from './StationSheet';

/** Schematic metro map; the M1 / M2 / M3 badges at the termini name the lines. Tap a station for its sheet. */
export const MetroScreen = () => {
  const t = useT();
  const navigate = useNavigate();
  const [q] = useSearchParams();
  const [selected, setSelected] = useState<string | null>(q.get('station'));

  return (
    <div className="flex flex-1 flex-col">
      <NavBar title={t('home.metro')} onBack={() => navigate(-1)} backLabel={t('common.back')} />
      <div className="relative min-h-0 flex-1">
        <ZoomPan initial={{ scale: 1, x: 0, y: 0 }} zoomInLabel={t('map.zoomIn')} zoomOutLabel={t('map.zoomOut')}>
          <MetroMap current="saltivska" selected={selected ?? undefined} onSelect={setSelected} />
        </ZoomPan>
      </div>
      <StationSheet stationId={selected} onClose={() => setSelected(null)} />
    </div>
  );
};
