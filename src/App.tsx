import { ManageBuildings } from './buildings/manage-buildings.tsx';
import { KeyboardEvents } from './events/keyboard-events.tsx';
import { MouseEvents } from './events/mouse-events.tsx';
import { WindowEvents } from './events/window-events.tsx';
import { Game } from './game.tsx';
import { ManageMap } from './map/manage-map.tsx';
import { ManageTrees } from './map/manage-trees.tsx';
import { ManageResources } from './resources/manage-resources.tsx';
import { useGameStore } from './store/index.tsx';
import { ManageTroops } from './troops/manage-troops.tsx';
import { TILE_SIZE } from './util/const.ts';

export function App() {
  const cameraPosition = useGameStore((state) => state.cameraPosition);

  return (
    <div
      className="absolute transition-all"
      style={{
        left: cameraPosition.x * TILE_SIZE,
        top: cameraPosition.y * TILE_SIZE,
      }}
    >
      <ManageMap />
      <ManageTrees />
      <ManageResources />
      <ManageBuildings />
      <ManageTroops />
      <Game />

      <MouseEvents />
      <KeyboardEvents />
      <WindowEvents />
    </div>
  );
}
//
