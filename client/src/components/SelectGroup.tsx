import { pillStyle } from "../theme/tokens";

export default function SelectGroup({ items, selected, onSelect, color }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {items.map((item) => {
        const id = item.id ?? item;
        const label = item.label ?? item.name ?? item;
        const icon = item.icon ?? null;
        const itemColor = item.color ?? color ?? "#00ff88";
        const isActive =
          typeof selected === "object" ? selected?.id === id : selected === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(item)}
            style={pillStyle(isActive, itemColor)}
          >
            {icon ? `${icon} ` : ""}
            {label}
          </button>
        );
      })}
    </div>
  );
}
