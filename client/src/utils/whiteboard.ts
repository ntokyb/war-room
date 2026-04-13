/** Screening question types that simulate whiteboard / verbal design (no IDE). */
export function isWhiteboardScreeningType(typeId: string | undefined): boolean {
  if (!typeId) return false;
  return (
    typeId === "whiteboard_system" ||
    typeId === "whiteboard_devops" ||
    typeId === "whiteboard_lead" ||
    typeId.startsWith("whiteboard_")
  );
}
