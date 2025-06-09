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

const AppSidebar = () => {
    return (
        <Sidebar className="bg-sidebar text-foreground">
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
};

export default AppSidebar;
