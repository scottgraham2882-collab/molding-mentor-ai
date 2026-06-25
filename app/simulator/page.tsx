import { SimulationRunner } from "../../components/SimulationRunner";
import { flashAfterMoldChangeSimulation } from "../../lib/flash-after-mold-change-simulation";

export default function SimulatorPage() {
  return <SimulationRunner scenario={flashAfterMoldChangeSimulation} />;
}
