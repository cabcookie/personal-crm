import { useTerritory } from "@/api/useTerritories";
import MainLayout from "@/components/layouts/MainLayout";
import TerritoryDetails from "@/components/territories/TerritoryDetails";
import SavedState from "@/components/ui-elements/project-notes-form/saved-state";
import { debouncedUpdateTerritoryName } from "@/components/ui-elements/territory-details/territory-updates-helpers";
import { useRouter } from "next/router";
import { useState } from "react";

const TerritoryDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const territoryId = Array.isArray(id) ? id[0] : id;
  const { territory, updateTerritoryName } = useTerritory(territoryId);
  const [territoryNameSaved, setTerritoryNameSaved] = useState(true);

  const handleBackBtnClick = () => {
    router.replace("/territories");
  };

  const handleUpdateName = (newName: string) => {
    if (!territory) return;
    if (newName.trim() === territory.name?.trim()) return;
    setTerritoryNameSaved(false);
    debouncedUpdateTerritoryName({
      name: newName,
      updateTerritoryFn: updateTerritoryName,
      updateSavedState: setTerritoryNameSaved,
    });
  };

  return (
    <MainLayout
      title={territory?.name}
      recordName={territory?.name}
      sectionName="Territories"
      onBackBtnClick={handleBackBtnClick}
      onTitleChange={() => setTerritoryNameSaved(false)}
      saveTitle={handleUpdateName}
    >
      {!territory ? (
        "Loading territory…"
      ) : (
        <div>
          <SavedState saved={territoryNameSaved} />
          <TerritoryDetails territoryId={territory.id} />
        </div>
      )}
    </MainLayout>
  );
};

export default TerritoryDetailPage;
