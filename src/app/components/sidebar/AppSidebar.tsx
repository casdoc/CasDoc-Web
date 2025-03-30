import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
} from "@/components/ui/sidebar";
import ProjectGroup from "./group/ProjectGroup";

const AppSidebar = () => (
    <Sidebar>
        <SidebarHeader></SidebarHeader>
        <SidebarContent>
            <ProjectGroup />
        </SidebarContent>
        <SidebarFooter></SidebarFooter>
    </Sidebar>
);

export default AppSidebar;
