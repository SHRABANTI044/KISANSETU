import { Settings } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";

/**
 * /dashboard/settings — dashboard preferences module.
 * Currently a placeholder shell; preferences UI can be built on top later.
 */
export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-center py-20 text-center">
        <span className="grid h-[72px] w-[72px] place-items-center rounded-[22px] bg-[#EAF6EA] text-[#2E7D32]">
          <Settings className="h-[30px] w-[30px]" strokeWidth={1.9} />
        </span>
        <h1 className="mt-6 font-display text-[22px] font-bold text-[#111111]">Settings</h1>
        <p className="mt-2 max-w-sm text-[13.5px] leading-relaxed text-[#666666]">
          Profile, notifications, language and account preferences will be managed here. This
          module is ready to be connected to the farmer settings API.
        </p>
      </div>
    </DashboardLayout>
  );
}
