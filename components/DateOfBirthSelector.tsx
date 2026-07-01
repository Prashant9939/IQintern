"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDown } from "lucide-react";

interface YearComboboxProps {
  value: string;
  onChange: (val: string) => void;
  years: number[];
  placeholder: string;
}

function YearCombobox({ value, onChange, years, placeholder }: YearComboboxProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Sync initial and external changes to value
  useEffect(() => {
    setSearchTerm(value || "");
  }, [value]);

  const filteredYears = useMemo(() => {
    if (!searchTerm || searchTerm === value) return years;
    return years.filter((y) => y.toString().includes(searchTerm));
  }, [searchTerm, years, value]);

  // Handle keyboard navigation inside the combobox
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        setActiveIndex((prev) => (prev < filteredYears.length - 1 ? prev + 1 : 0));
        e.preventDefault();
        break;
      case "ArrowUp":
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : filteredYears.length - 1));
        e.preventDefault();
        break;
      case "Enter":
        if (activeIndex >= 0 && activeIndex < filteredYears.length) {
          const selected = filteredYears[activeIndex].toString();
          onChange(selected);
          setSearchTerm(selected);
          setIsOpen(false);
        } else if (filteredYears.length > 0) {
          const firstMatch = filteredYears[0].toString();
          onChange(firstMatch);
          setSearchTerm(firstMatch);
          setIsOpen(false);
        }
        e.preventDefault();
        break;
      case "Escape":
        setIsOpen(false);
        setSearchTerm(value || "");
        e.preventDefault();
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
  };

  // Adjust container scroll position when keyboard navigating
  useEffect(() => {
    if (isOpen && activeIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[activeIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex, isOpen]);

  // Click outside to close combobox
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchTerm(value || "");
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [value]);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 h-[56px] text-sm bg-zinc-50 border border-zinc-300 focus:border-[#7C3AED] focus:ring-[4px] focus:ring-[#7C3AED]/15 rounded-[14px] outline-none text-zinc-800 transition-all duration-200 font-semibold placeholder:text-zinc-400 focus:bg-white"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="year-listbox"
          aria-label="Select Year of Birth"
        />
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 pointer-events-none" />
      </div>

      {isOpen && (
        <ul
          id="year-listbox"
          ref={listRef}
          className="absolute z-50 w-full mt-1.5 max-h-[200px] overflow-y-auto bg-white border border-zinc-200 rounded-[14px] shadow-lg py-1.5 focus:outline-none"
          role="listbox"
        >
          {filteredYears.length === 0 ? (
            <li className="px-4 py-3 text-xs text-zinc-400 font-medium">No years found</li>
          ) : (
            filteredYears.map((year, idx) => {
              const isSelected = value === year.toString();
              const isActive = idx === activeIndex;
              return (
                <li
                  key={year}
                  onClick={() => {
                    onChange(year.toString());
                    setSearchTerm(year.toString());
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2.5 text-sm font-semibold cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-[#7C3AED] text-white"
                      : isActive
                      ? "bg-[#7C3AED]/10 text-[#7C3AED]"
                      : "text-zinc-700 hover:bg-slate-50"
                  }`}
                  role="option"
                  aria-selected={isSelected}
                  id={`year-option-${idx}`}
                >
                  {year}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}

interface DateOfBirthSelectorProps {
  value: string;
  onChange: (val: string) => void;
}

export default function DateOfBirthSelector({ value, onChange }: DateOfBirthSelectorProps) {
  // Parse the initial value formatted as YYYY-MM-DD
  const initialParts = useMemo(() => {
    if (!value) return { day: "", month: "", year: "" };
    const parts = value.split("-");
    if (parts.length === 3) {
      return { year: parts[0], month: parts[1], day: parts[2] };
    }
    return { day: "", month: "", year: "" };
  }, [value]);

  const [day, setDay] = useState(initialParts.day);
  const [month, setMonth] = useState(initialParts.month);
  const [year, setYear] = useState(initialParts.year);

  // Sync local states if the parent component sets value externally
  useEffect(() => {
    setDay(initialParts.day);
    setMonth(initialParts.month);
    setYear(initialParts.year);
  }, [initialParts]);

  // Programmatically generate year range (Current year down to 1950)
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const list = [];
    for (let y = currentYear; y >= 1950; y--) {
      list.push(y);
    }
    return list;
  }, []);

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  // Dynamic days calculations (february check + leap years + 30/31 days limits)
  const maxDays = useMemo(() => {
    if (!month) return 31;

    if (month === "02") {
      if (year) {
        const y = parseInt(year);
        const isLeap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
        return isLeap ? 29 : 28;
      }
      return 29; // default to leap year max to allow day selections before year is set
    }

    if (["04", "06", "09", "11"].includes(month)) {
      return 30;
    }

    return 31;
  }, [month, year]);

  // Auto-rollback invalid day values if month/year boundary changes
  useEffect(() => {
    if (day && parseInt(day) > maxDays) {
      setDay(maxDays.toString().padStart(2, "0"));
    }
  }, [maxDays, day]);

  // Send updates back to the parent form when selection changes
  useEffect(() => {
    if (day && month && year) {
      onChange(`${year}-${month}-${day}`);
    } else {
      onChange("");
    }
  }, [day, month, year]);

  const daysList = useMemo(() => {
    const list = [];
    for (let d = 1; d <= maxDays; d++) {
      list.push(d.toString().padStart(2, "0"));
    }
    return list;
  }, [maxDays]);

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full">
      {/* Day dropdown */}
      <div className="relative">
        <select
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="w-full pl-3 pr-8 h-[56px] text-sm bg-zinc-50 border border-zinc-300 focus:border-[#7C3AED] focus:ring-[4px] focus:ring-[#7C3AED]/15 rounded-[14px] outline-none text-zinc-800 transition-all duration-200 font-semibold cursor-pointer appearance-none focus:bg-white"
          aria-label="Select Day of Birth"
        >
          <option value="">Day</option>
          {daysList.map((d) => (
            <option key={d} value={d}>
              {parseInt(d)}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
      </div>

      {/* Month dropdown */}
      <div className="relative">
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full pl-3 pr-8 h-[56px] text-sm bg-zinc-50 border border-zinc-300 focus:border-[#7C3AED] focus:ring-[4px] focus:ring-[#7C3AED]/15 rounded-[14px] outline-none text-zinc-800 transition-all duration-200 font-semibold cursor-pointer appearance-none focus:bg-white"
          aria-label="Select Month of Birth"
        >
          <option value="">Month</option>
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
      </div>

      {/* Year combobox */}
      <YearCombobox
        value={year}
        onChange={setYear}
        years={years}
        placeholder="Year"
      />
    </div>
  );
}
