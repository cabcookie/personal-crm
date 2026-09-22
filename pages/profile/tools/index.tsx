import useCurrentUser from "@/api/useUser";
import SettingsLayout from "@/components/layouts/SettingsLayout";
import UserPromptEditor from "@/components/profile/UserPromptEditor";
import { Separator } from "@/components/ui/separator";

/**
 * Profile → Tools. First tool: the AI user prompt (who you are + per-context
 * activity and goals) that grounds the meeting assistant. More tools (agents
 * to toggle) will live here later.
 */
const ProfileToolsPage = () => {
  const { user, savePromptField } = useCurrentUser();

  return (
    <SettingsLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Tools</h3>
          <p className="text-sm text-muted-foreground">
            Konfiguriere deinen KI-Assistenten. Später kannst du hier auch
            Agenten aktivieren.
          </p>
        </div>
        <Separator />

        <div>
          <h4 className="font-medium">Dein KI-Prompt</h4>
          <p className="text-sm text-muted-foreground">
            Dieser Kontext hilft dem Meeting-Assistenten, dich und deine Ziele
            zu verstehen. Der allgemeine Teil gilt immer; pro Kontext (Arbeit,
            Familie, Hobby) beschreibst du Tätigkeit und Ziele.
          </p>
        </div>

        <UserPromptEditor value={user?.prompts} onSaveField={savePromptField} />
      </div>
    </SettingsLayout>
  );
};

export default ProfileToolsPage;
