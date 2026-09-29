import { useNavigate } from 'react-router-dom';
import { Sheet } from '../../components/Sheet';
import { StationPanel } from '../../components/StationPanel';
import { useStationPanel } from '../../app/data';
import { stationById } from '../../data/metro';

/** Station sheet shared by Home and the metro map. Medium detent first; drag up for the exits. */
export const StationSheet = ({ stationId, onClose }: { stationId: string | null; onClose: () => void }) => {
  const panel = useStationPanel();
  const navigate = useNavigate();
  const data = stationId ? panel(stationId) : null;
  const exits = stationId ? (stationById(stationId).exits ?? []) : [];
  return (
    <Sheet open={!!stationId} title={data?.title ?? ''} onClose={onClose} detents={['medium', 'large']}>
      {data && (
        <StationPanel
          {...data.props}
          onRouteFrom={() => navigate(`/routes?from=${stationId}`)}
          onRouteTo={() => navigate(`/routes?to=${stationId}`)}
          onExit={(i) => navigate(`/stop/${exits[i]}`)}
        />
      )}
    </Sheet>
  );
};
