import imgDownload from "@/public/images/analytics/mrr-download.png";
import imgFilter from "@/public/images/analytics/mrr-filters.png";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import BulletList from "../ui-elements/list-items/bullet-list";
import ImportMrrData from "./import-data";
import { useMrrFilter } from "./useMrrFilter";

const mrrTableauLink =
  "https://awstableau.corp.amazon.com/t/WWSalesInsights/views/MonthlyRevenueDeep/DeepMonthlyRevenue?%3Aembed=yes&%3Alinktarget=_blank&%3Aoriginal_view=yes#1";

const InstructionsUploadMrr = () => {
  const { mrr, mutateMrr } = useMrrFilter();

  return (
    <DefaultAccordionItem value="revenue" triggerTitle="Monthly Revenue">
      <div className="space-y-6">
        <Link
          href={mrrTableauLink}
          target="_blank"
          className="text-muted-foreground hover:text-blue-400"
        >
          Open Monthly Revenue report from Tableau
          <ExternalLink className="ml-1 w-4 h-4 inline-block -translate-y-0.5" />
        </Link>

        <div>
          Set the filters as follows:
          <BulletList
            items={[
              <>
                First Dimension: <b>Customer Sfdc Name</b>
              </>,
              <>
                Second Dimension: <b>AWS Payer Id</b>
              </>,
              <>
                Third Dimension: <b>Reseller</b>
              </>,
              <>
                Metrics to just <b>Revenue</b>
              </>,
              <>
                Timeframe to <b>Last 3 Months</b>
              </>,
            ]}
          />
        </div>

        <Image src={imgFilter} alt="Tableau Filter" width={1200} height={600} />

        <div>
          Then click the download icon in the right down corner of the screen
          and select <b>Cross table (Kreuztabelle)</b>. In the dialog select{" "}
          <b>Month No Sort</b> as the source and select <b>CSV</b> as the
          format.
        </div>

        <Image
          src={imgDownload}
          alt="Tableau Download"
          width={500}
          height={400}
        />

        <div>Then upload the file here:</div>

        <ImportMrrData mrr={mrr} mutateMrr={mutateMrr} />
      </div>
    </DefaultAccordionItem>
  );
};

export default InstructionsUploadMrr;
