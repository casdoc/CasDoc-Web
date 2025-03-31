import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
} from "@/components/ui/sidebar";
import ProjectGroup from "./group/ProjectGroup";

const AppSidebar = () => (
    <Sidebar>
        <SidebarHeader />
        <SidebarContent>
            <ProjectGroup />
        </SidebarContent>
        <SidebarFooter />
    </Sidebar>
);

export default AppSidebar;
