import { useTerritory } from "@/api/useTerritories";
import MainLayout from "@/components/layouts/MainLayout";
import TerritoryDetails from "@/components/territories/TerritoryDetails";
import { useRouter } from "next/router";
import { useState } from "react";

const TerritoryDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const territoryId = Array.isArray(id) ? id[0] : id;
  const { territory } = useTerritory(territoryId);
  const [formOpen, setFormOpen] = useState(false);

  const handleBackBtnClick = () => {
    router.replace("/territories");
  };

  return (
    <MainLayout
      title={territory?.name}
      recordName={territory?.name}
      sectionName="Territories"
      onBackBtnClick={handleBackBtnClick}
      addButton={{ label: "Edit", onClick: () => setFormOpen(true) }}
    >
      {!territory ? (
        "Loading territory…"
      ) : (
        <TerritoryDetails
          territoryId={territory.id}
          updateFormControl={{ open: formOpen, setOpen: setFormOpen }}
        />
      )}
    </MainLayout>
  );
};

export default TerritoryDetailPage;
