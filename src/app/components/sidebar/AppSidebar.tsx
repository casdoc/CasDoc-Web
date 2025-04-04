import {
    Sidebar,
    // SidebarHeader,
    SidebarContent,
    // SidebarFooter,
} from "@/components/ui/sidebar";
import ProjectGroup from "./group/ProjectGroup";
import DocEditDialog from "./dialog/DocEditDialog";

const AppSidebar = () => (
    <Sidebar>
        {/* <SidebarHeader /> */}
        <SidebarContent className="bg-neutral-50">
            <ProjectGroup />
            <DocEditDialog />
        </SidebarContent>
        {/* <SidebarFooter /> */}
    </Sidebar>
);

export default AppSidebar;
