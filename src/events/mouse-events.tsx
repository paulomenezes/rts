import { memo, useEffect, useState } from 'react';
import { useGameStore } from '../store/index.tsx';
import { TILE_SIZE, Z_INDEX } from '../util/const.ts';
import { Position } from '../util/types.ts';

export const MouseEvents = memo(function MouseEvents() {
  const cameraPosition = useGameStore((state) => state.cameraPosition);
  const moveSelectedTroops = useGameStore((state) => state.moveSelectedTroops);
  const selectAllTroopsWithSameType = useGameStore(
    (state) => state.selectAllTroopsWithSameType,
  );
  const selectTroopsByArea = useGameStore((state) => state.selectTroopsByArea);
  const selectTroops = useGameStore((state) => state.selectTroops);

  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState<Position | undefined>(undefined);
  const [startPos, setStartPos] = useState<Position | undefined>(undefined);
  const [firstClickTime, setFirstClickTime] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    function contextMenuEvent(event: MouseEvent) {
      event.preventDefault();

      moveSelectedTroops({
        x: event.clientX - cameraPosition.x * TILE_SIZE,
        y: event.clientY - cameraPosition.y * TILE_SIZE,
      });
    }

    function mouseDown(event: MouseEvent) {
      event.preventDefault();

      setStartPos({
        x: event.clientX - cameraPosition.x * TILE_SIZE,
        y: event.clientY - cameraPosition.y * TILE_SIZE,
      });
      setDragging(true);
    }

    function mouseMove(event: MouseEvent) {
      event.preventDefault();

      setPosition({
        x: event.clientX - cameraPosition.x * TILE_SIZE,
        y: event.clientY - cameraPosition.y * TILE_SIZE,
      });
    }

    function mouseDblClick(event: MouseEvent) {
      event.preventDefault();

      selectAllTroopsWithSameType({
        x: event.clientX - cameraPosition.x * TILE_SIZE,
        y: event.clientY - cameraPosition.y * TILE_SIZE,
      });
    }

    function mouseUp(event: MouseEvent) {
      event.preventDefault();

      setFirstClickTime(Date.now());

      setDragging(false);

      if (startPos) {
        const delta = 5;
        const diffX = Math.abs(
          event.clientX - cameraPosition.x * TILE_SIZE - startPos?.x,
        );
        const diffY = Math.abs(
          event.clientY - cameraPosition.y * TILE_SIZE - startPos?.y,
        );

        if (diffX < delta && diffY < delta) {
          if (firstClickTime && Date.now() - firstClickTime < 300) {
            selectAllTroopsWithSameType({
              x: event.clientX - cameraPosition.x * TILE_SIZE,
              y: event.clientY - cameraPosition.y * TILE_SIZE,
            });
          } else {
            selectTroops({
              x: event.clientX - cameraPosition.x * TILE_SIZE,
              y: event.clientY - cameraPosition.y * TILE_SIZE,
            });
          }
        } else {
          selectTroopsByArea(startPos, {
            x: event.clientX - cameraPosition.x * TILE_SIZE,
            y: event.clientY - cameraPosition.y * TILE_SIZE,
          });
        }
      } else {
        selectTroops({
          x: event.clientX - cameraPosition.x * TILE_SIZE,
          y: event.clientY - cameraPosition.y * TILE_SIZE,
        });
      }
    }

    document.addEventListener('dblclick', mouseDblClick);
    document.addEventListener('contextmenu', contextMenuEvent);
    document.addEventListener('mousedown', mouseDown);
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);

    return () => {
      document.removeEventListener('dblclick', mouseDblClick);
      document.removeEventListener('contextmenu', contextMenuEvent);
      document.removeEventListener('mousedown', mouseDown);
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseup', mouseUp);
    };
  }, [startPos, firstClickTime, cameraPosition]);

  return (
    <>
      {startPos && position && dragging && (
        <div
          className="absolute border-2 border-white bg-white/20"
          style={{
            zIndex: Z_INDEX.MOUSE,
            left: Math.min(startPos.x, position.x),
            top: Math.min(startPos.y, position.y),
            width: Math.abs(startPos.x - position.x),
            height: Math.abs(startPos.y - position.y),
          }}
        />
      )}
    </>
  );
});
