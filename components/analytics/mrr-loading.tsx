import { flow, identity, map, times } from "lodash/fp";
import LoadingAccordionItem from "../ui-elements/accordion/LoadingAccordionItem";

const MrrLoading = () =>
  flow(
    identity<number>,
    times(identity),
    map((id) => (
      <LoadingAccordionItem
        key={id}
        value={`loading-${id}`}
        sizeTitle="lg"
        sizeSubtitle="xl"
      />
    ))
  )(10);

export default MrrLoading;
