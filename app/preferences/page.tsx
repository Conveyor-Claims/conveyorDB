import { StaffChrome } from "../staff-chrome";

export const metadata = {
  title: "Preferences · ConveyorDB",
  description: "Account preferences stub.",
};

export default function PreferencesPage() {
  return (
    <StaffChrome title="Preferences">
      <p className="max-w-xl text-sm leading-6 text-muted">
        Preferences stub. Nothing is stored yet.
      </p>
    </StaffChrome>
  );
}
