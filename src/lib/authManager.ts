import supabase from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";

class AuthManager {
    private session: Session | null = null;

    constructor() {
        this.init();
    }

    private async init() {
        const { data } = await supabase.auth.getSession();
        this.session = data.session;

        supabase.auth.onAuthStateChange((_event, session) => {
            this.session = session;
        });
    }

    public getAccessToken(): string | null {
        return this.session?.access_token ?? null;
    }

    public getUser(): User | null {
        return this.session?.user ?? null;
    }

    public getSession(): Session | null {
        return this.session;
    }
}

const authManager = new AuthManager();
export default authManager;
