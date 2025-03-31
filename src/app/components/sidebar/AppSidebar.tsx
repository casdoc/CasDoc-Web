import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
} from "@/components/ui/sidebar";
import ProjectGroup from "./group/ProjectGroup";

const AppSidebar = () => (
    <Sidebar className="duration-500 ease-in-out">
        <SidebarHeader></SidebarHeader>
        <SidebarContent>
            <ProjectGroup />
        </SidebarContent>
        <SidebarFooter></SidebarFooter>
    </Sidebar>
);

export default AppSidebar;
