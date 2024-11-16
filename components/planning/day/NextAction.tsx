import { FC } from "react";

type NextActionProps = {
  action: string;
};

const NextAction: FC<NextActionProps> = ({ action }) => (
  <div className="px-2 md:px-4 my-8 font-semibold text-sm text-muted-foreground md:text-center bg-bgTransparent sticky top-[6.75rem] md:top-[8.25rem] z-[35] pb-2 md:pb-4">
    {action}
  </div>
);

export default NextAction;
