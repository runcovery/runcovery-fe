import { useMemo } from "react";
import { BodyPartId } from "./body-part-data";

export function useBodySelection(
  selectedParts: readonly BodyPartId[],
  onChange: (parts: BodyPartId[]) => void,
) {
  const selectedPartSet = useMemo(
    () => new Set<BodyPartId>(selectedParts),
    [selectedParts],
  );

  const togglePart = (part: BodyPartId) => {
    const next = new Set(selectedPartSet);
    if (next.has(part)) next.delete(part);
    else next.add(part);
    onChange([...next]);
  };

  const clearSelection = () => onChange([]);

  return { selectedPartSet, togglePart, clearSelection };
}
