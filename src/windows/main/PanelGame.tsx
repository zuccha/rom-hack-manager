import Panel from "../../components/Panel";
import SectionGameSettings from "./SectionGameSettings";
import SectionHackDownload from "./SectionHackDownload";
import SectionHacks from "./SectionHacks";

type PanelGameProps = {
  gameId: string;
};

function PanelGameProps({ gameId }: PanelGameProps) {
  return (
    <Panel>
      <SectionGameSettings gameId={gameId} />
      <SectionHackDownload gameId={gameId} />
      <SectionHacks />
    </Panel>
  );
}

export default PanelGameProps;
