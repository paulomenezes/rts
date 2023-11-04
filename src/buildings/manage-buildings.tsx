import { memo } from 'react';
import { useGameStore } from '../store/index.tsx';
import { Building } from './building.tsx';

export const ManageBuildings = memo(function ManageBuildings() {
  const buildings = useGameStore((state) => state.buildings);

  return (
    <>
      {buildings.map((building) => (
        <Building key={building.id} building={building} />
      ))}
    </>
  );
});
