import {
    Sidebar,
    // SidebarHeader,
    SidebarContent,
    SidebarFooter,
} from "@/components/ui/sidebar";
import ProjectGroup from "./group/ProjectGroup";
import ProjectDialog from "./dialog/ProjectDialog";
import DocDialog from "./dialog/DocDialog";
import UserConsole from "./footer/UserConsole";

const AppSidebar = () => (
    <Sidebar className="bg-neutral-50">
        {/* <SidebarHeader /> */}
        <SidebarContent>
            <ProjectGroup />
            <ProjectDialog />
            <DocDialog />
        </SidebarContent>
        <SidebarFooter>
            <UserConsole />
        </SidebarFooter>
    </Sidebar>
);

export default AppSidebar;
