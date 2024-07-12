import { FC, ReactNode } from "react";
import MainLayout from "./MainLayout";
import SidebarNav, { ISidebarNavItems } from "../navigation-menu/SidebarNav";

type SettingsLayoutProps = {
  title: string;
  children: ReactNode;
  sidebarNavItems: ISidebarNavItems[];
};

const SettingsLayout: FC<SettingsLayoutProps> = ({
  title,
  children,
  sidebarNavItems,
}) => {
  return (
    <MainLayout title={title} sectionName={title}>
      <div className="space-y-6 p-10 pb-16">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsLayout;
