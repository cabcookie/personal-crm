import InteractionPeersOrCustomersFilterBtnGrp from "@/components/interactions/peers-customers-filter-btn-grp";
import InteractionTimeFilterBtnGrp from "@/components/interactions/timeframe-filter-btn-grp";
import {
  useInteractionFilter,
  withInteractionFilter,
} from "@/components/interactions/useInteractionFilter";
import MainLayout from "@/components/layouts/MainLayout";

const InteractionsPage = () => {
  const { interactions } = useInteractionFilter();

  return (
    <MainLayout sectionName="Interactions" title="Interactions">
      <div className="space-y-6">
        <InteractionTimeFilterBtnGrp className="bg-bgTransparent sticky top-[6.75rem] md:top-[8.25rem] z-[35] pb-1" />

        <InteractionPeersOrCustomersFilterBtnGrp className="bg-bgTransparent sticky top-[11rem] md:top-[12.5rem] z-[35] pb-2 md:pb-4" />

        <div>Anzahl: {interactions?.length ?? 0}</div>

        <div className="space-y-2">
          {interactions?.map(({ personId, name, positions, meetings }) => (
            <div key={personId}>
              <span className="font-bold">{name}</span> ({positions}) -{" "}
              <span className="font-semibold text-blue-600">{meetings}</span>{" "}
              Interactions
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default withInteractionFilter(InteractionsPage);
