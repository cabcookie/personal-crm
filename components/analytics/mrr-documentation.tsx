import imgDownload from "@/public/images/analytics/mrr-download.png";
import imgFilter from "@/public/images/analytics/mrr-filters.png";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";

const TABLEAU_URL =
  "https://awstableau.corp.amazon.com/t/WWSalesInsights/views/MonthlyRevenueDeep/DeepMonthlyRevenue?%3Aembed=yes&%3Alinktarget=_blank&%3Aoriginal_view=yes#1" as const;

const MrrDocumentation = () => (
  <DefaultAccordionItem value="docs" triggerTitle="Tips & Tricks">
    <div className="space-y-6">
      <div>DESCRIBE TIPS & TRICKS HERE (WIP)</div>
      <div>
        <Link
          href={TABLEAU_URL}
          target="_blank"
          className="text-muted-foreground hover:text-blue-600"
        >
          Open Tableau{" "}
          <ExternalLink className="w-4 h-4 inline-block -translate-y-0.5" />
        </Link>
      </div>
      <div>
        <Image src={imgFilter} alt="Tableau Filter" width={1200} height={600} />
      </div>
      <div>
        <Image
          src={imgDownload}
          alt="Tableau Download"
          width={500}
          height={400}
        />
      </div>
    </div>
  </DefaultAccordionItem>
);

export default MrrDocumentation;
