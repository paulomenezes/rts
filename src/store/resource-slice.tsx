import { StateCreator } from 'zustand';
import { uuid } from '../util/functions.ts';
import { GameState, ResourceState } from './types.tsx';

export const createResourceSlice: StateCreator<
  GameState,
  [],
  [],
  ResourceState
> = (set) => ({
  resources: [],
  addResource: (troopId, position) =>
    set((state) => {
      return {
        resources: [
          ...state.resources,
          {
            id: uuid(),
            position,
            type: 'wood',
            willBeLoadedBy: troopId,
          },
        ],
      };
    }),
  updateResource: (id, newResource) =>
    set((state) => {
      return {
        resources: state.resources.map((resource) => {
          if (resource.id === id) {
            return {
              ...resource,
              ...newResource,
            };
          }

          return resource;
        }),
      };
    }),
  removeResources: (ids) =>
    set((state) => {
      return {
        resources: state.resources.filter(
          (resource) => !ids.includes(resource.id),
        ),
      };
    }),
});
