import { FC, ReactNode } from "react";
import SidebarNav from "../navigation-menu/SidebarNav";
import MainLayout from "./MainLayout";

type SettingsLayoutProps = {
  children: ReactNode;
};

const SettingsLayout: FC<SettingsLayoutProps> = ({ children }) => {
  return (
    <MainLayout title="Profile & Settings" sectionName="Profile & Settings">
      <div className="space-y-6 p-10 pb-16">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsLayout;
