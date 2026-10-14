import { useNavigate, useSearch } from "@tanstack/react-router";
import { isTabId, TAB_IDS, type TabId } from "./types";

const TAB_LABELS: Record<TabId, string> = {
  dashboard: "Dashboard",
  expenses: "Expenses",
  income: "Income",
  investments: "Investments",
  fire: "FIRE",
};

export function useActiveTab(): TabId {
  const raw = useSearch({ from: "/budget" }).tab ?? null;
  return isTabId(raw) ? raw : "dashboard";
}

export default function Tabs(): React.JSX.Element {
  const navigate = useNavigate();
  const active = useActiveTab();

  const onSelect = (id: TabId) => {
    void navigate({
      to: "/budget",
      search: (prev) => ({ ...prev, tab: id === "dashboard" ? undefined : id }),
      replace: true,
    });
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex w-full border-b border-gray-200 dark:border-gray-700">
        {TAB_IDS.map((id) => {
          const isActive = id === active;
          // The bar is rendered full-bleed, so w-full above is the whole screen
          // and flex-1 spreads the tabs across it. The buttons never shrink
          // below their label, so a narrow viewport scrolls instead.
          const base =
            "flex-1 whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors duration-200 border-b-2 -mb-px";
          const cls = isActive
            ? `${base} border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400`
            : `${base} border-transparent text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400`;
          return (
            <button
              type="button"
              key={id}
              className={cls}
              onClick={() => onSelect(id)}
              aria-current={isActive ? "page" : undefined}
            >
              {TAB_LABELS[id]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
