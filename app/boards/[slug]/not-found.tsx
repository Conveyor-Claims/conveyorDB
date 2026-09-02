import { StaffMissingPage } from "../../staff-missing";

export default function DueDateBoardNotFound() {
  return (
    <StaffMissingPage
      title="Board not found"
      message="No due-date board at this URL."
    />
  );
}
