import { Accordion } from "@radix-ui/react-accordion";
import DefaultAccordionItem from "../../ui-elements/accordion/DefaultAccordionItem";
import InstructionsUploadMrr from "./instructions-upload-mrr";
import InstructionsUploadSrrp from "./instructions-upload-srrp";

const InstructionsUpload = () => (
  <DefaultAccordionItem value="docs" triggerTitle="Intructions (Data Upload)">
    <Accordion type="single" collapsible>
      <InstructionsUploadMrr />
      <InstructionsUploadSrrp />
    </Accordion>
  </DefaultAccordionItem>
);

export default InstructionsUpload;
