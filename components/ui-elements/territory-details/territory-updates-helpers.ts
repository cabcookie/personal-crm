import { debounce } from "lodash";

type UpdateTerritoryDetailsProps = {
  name?: string;
  updateTerritoryFn: (name: string | undefined) => Promise<string | undefined>;
  updateSavedState?: (state: boolean) => void;
};

export const debouncedUpdateTerritoryName = debounce(
  async ({
    updateTerritoryFn,
    updateSavedState,
    name,
  }: UpdateTerritoryDetailsProps) => {
    await updateTerritoryFn(name);
    updateSavedState && updateSavedState(true);
  },
  1500
);
