import { memo } from 'react';
import { useGameStore } from '../store/index.tsx';
import { Resource } from './resource.tsx';

export const ManageResources = memo(function ManageResources() {
  const resources = useGameStore((state) => state.resources);

  return (
    <>
      {resources.map((resource) => (
        <Resource key={resource.id} resource={resource} />
      ))}
    </>
  );
});
