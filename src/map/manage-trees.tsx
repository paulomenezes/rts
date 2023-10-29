import { memo } from 'react';
import { useGameStore } from '../store/index.tsx';
import { CAMERA_MAP_OFFSET } from '../util/const.ts';
import { Tree } from './tree.tsx';

export const ManageTrees = memo(function ManageTrees() {
  const trees = useGameStore((state) => state.trees);
  const cameraPosition = useGameStore((state) => state.cameraPosition);
  const tilesOnScreen = useGameStore((state) => state.tilesOnScreen);

  return (
    <>
      {trees.map((tree) => {
        if (
          tree.position.x >= cameraPosition.x * -1 - CAMERA_MAP_OFFSET &&
          tree.position.x <=
            cameraPosition.x * -1 + tilesOnScreen.x + CAMERA_MAP_OFFSET &&
          tree.position.y >= cameraPosition.y * -1 - CAMERA_MAP_OFFSET &&
          tree.position.y <=
            cameraPosition.y * -1 + tilesOnScreen.y + CAMERA_MAP_OFFSET
        ) {
          return <Tree key={tree.id} tree={tree} />;
        }

        return null;
      })}
    </>
  );
});
