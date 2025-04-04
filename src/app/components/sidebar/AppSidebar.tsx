import {
    Sidebar,
    // SidebarHeader,
    SidebarContent,
    // SidebarFooter,
} from "@/components/ui/sidebar";
import ProjectGroup from "./group/ProjectGroup";
import EditDialog from "./dialog/DocEditDialog";

const AppSidebar = () => (
    <Sidebar>
        {/* <SidebarHeader /> */}
        <SidebarContent className="bg-neutral-50">
            <ProjectGroup />
            <EditDialog />
        </SidebarContent>
        {/* <SidebarFooter /> */}
    </Sidebar>
);

export default AppSidebar;
