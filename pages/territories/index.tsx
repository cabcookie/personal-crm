import useTerritories from "@/api/useTerritories";
import MainLayout from "@/components/layouts/MainLayout";
import TerritoryList from "@/components/territories/TerritoryList";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AccordionItem } from "@radix-ui/react-accordion";
import { useRouter } from "next/router";

const TerritoryListPage = () => {
  const { territories, createTerritory } = useTerritories();
  const router = useRouter();

  const createAndOpenTerritory = async () => {
    const territory = await createTerritory("New Territory");
    if (!territory) return;
    router.replace(`/territories/${territory}`);
  };

  return (
    <MainLayout
      title="Territories"
      sectionName="Territories"
      addButton={{ label: "New", onClick: createAndOpenTerritory }}
    >
      {!territories ? (
        "Loading territories…"
      ) : (
        <div>
          <Accordion type="single" collapsible>
            <TerritoryList territories={territories} showCurrentOnly />
          </Accordion>
          <div className="mt-8" />
          <Accordion type="single" collapsible>
            <AccordionItem value="invalid-territories">
              <AccordionTrigger>
                Show territories with no current responsibility
              </AccordionTrigger>
              <AccordionContent>
                <Accordion type="single" collapsible>
                  <TerritoryList territories={territories} showInvalidOnly />
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </MainLayout>
  );
};

export default TerritoryListPage;
