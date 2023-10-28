import { memo } from 'react';
import { useGameStore } from '../store/index.tsx';
import { Tree } from './tree.tsx';

export const ManageTrees = memo(function ManageTrees() {
  const trees = useGameStore((state) => state.trees);
  const cameraPosition = useGameStore((state) => state.cameraPosition);
  const tilesOnScreen = useGameStore((state) => state.tilesOnScreen);

  return (
    <>
      {trees.map((tree) => {
        if (
          tree.position.x >= cameraPosition.x * -1 - 2 &&
          tree.position.x <= cameraPosition.x * -1 + tilesOnScreen.x &&
          tree.position.y >= cameraPosition.y * -1 - 2 &&
          tree.position.y <= cameraPosition.y * -1 + tilesOnScreen.y
        ) {
          return <Tree key={tree.id} tree={tree} />;
        }

        return null;
      })}
    </>
  );
});
