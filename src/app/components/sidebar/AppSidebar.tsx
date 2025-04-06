import {
    Sidebar,
    // SidebarHeader,
    SidebarContent,
    // SidebarFooter,
} from "@/components/ui/sidebar";
import ProjectGroup from "./group/ProjectGroup";
import ProjectDialog from "./dialog/ProjectDialog";
import DocDialog from "./dialog/DocDialog";

const AppSidebar = () => (
    <Sidebar>
        {/* <SidebarHeader /> */}
        <SidebarContent className="bg-neutral-50">
            <ProjectGroup />
            <ProjectDialog />
            <DocDialog />
        </SidebarContent>
        {/* <SidebarFooter /> */}
    </Sidebar>
);

export default AppSidebar;
