import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import type { NewsFilter, NewsSortBy } from "../types/news.types";

interface NewsFiltersProps {
  activeFilter: NewsFilter;
  onFilterChange: (filter: NewsFilter) => void;
  sortBy: NewsSortBy;
  onSortChange: (sort: NewsSortBy) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const filters: NewsFilter[] = ["همه", "اخبار", "مقاله", "انیمه", "مانگا", "بازی"];
const sorts: NewsSortBy[] = ["جدیدترین", "پربازدیدترین", "محبوب‌ترین"];

const filterColors: Record<string, string> = {
  همه: "#6b7280",
  اخبار: "#3b82f6",
  مقاله: "#8b5cf6",
  انیمه: "#ef4444",
  مانگا: "#10b981",
  بازی: "#f59e0b",
};

const NewsFilters: React.FC<NewsFiltersProps> = ({
  activeFilter,
  onFilterChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div
        className="relative flex items-center rounded-xl overflow-hidden"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-primary)",
        }}
      >
        <Search
          className="w-5 h-5 absolute right-4"
          style={{ color: "var(--text-tertiary)" }}
        />
        <input
          type="text"
          placeholder="جستجو در اخبار..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full py-3 pr-12 pl-4 text-sm bg-transparent outline-none"
          style={{ color: "var(--text-primary)" }}
        />
      </div>

      {/* Filters & Sort Row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Category Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;
            const color = filterColors[filter];
            return (
              <button
                key={filter}
                onClick={() => onFilterChange(filter)}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300"
                style={{
                  background: isActive ? color : "var(--bg-tertiary)",
                  color: isActive ? "#fff" : "var(--text-secondary)",
                  border: isActive
                    ? `1px solid ${color}`
                    : "1px solid transparent",
                }}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            className="w-4 h-4"
            style={{ color: "var(--text-tertiary)" }}
          />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as NewsSortBy)}
            className="text-xs font-medium py-2 px-3 rounded-lg outline-none cursor-pointer"
            style={{
              background: "var(--bg-tertiary)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-primary)",
            }}
          >
            {sorts.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default NewsFilters;
