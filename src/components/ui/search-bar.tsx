import { Search, ChevronDown } from "@/components/SimpleIcons";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import React from "react";

interface FieldOption {
  value: string;
  label: string;
}

interface SearchBarProps {
  onSubmit: (field: string, query: string) => void;
  placeholder?: string;
  disabled?: boolean;
  fields?: FieldOption[];
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSubmit,
  placeholder = "Search...",
  disabled = false,
  fields = [
    { value: "title", label: "Title" },
    { value: "description", label: "Description" },
    { value: "requirements", label: "Requirements" },
    { value: "company", label: "Company" },
    { value: "location", label: "Location" },
  ],
}) => {
  // Default to 'requirements'
  const defaultField = fields.find(f => f.value === "requirements") || fields[0];
  const [selectedField, setSelectedField] = React.useState<FieldOption>(defaultField);
  const [query, setQuery] = React.useState("");
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [dropdownIndex, setDropdownIndex] = React.useState(0);
  const searchBarRef = React.useRef<HTMLDivElement>(null);
  const [searchBarWidth, setSearchBarWidth] = React.useState<number | undefined>(undefined);
  const [debouncedQuery, setDebouncedQuery] = React.useState("");

  React.useEffect(() => {
    if (searchBarRef.current) {
      setSearchBarWidth(searchBarRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (searchBarRef.current) {
        setSearchBarWidth(searchBarRef.current.offsetWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Debounce query input
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  // Fire search only when debounced query changes (not when field changes)
  React.useEffect(() => {
    onSubmit(selectedField.value, debouncedQuery.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  // Keyboard navigation for dropdown
  const handleQueryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (dropdownOpen && fields.length > 0) {
      if (e.key === "ArrowDown") {
        setDropdownIndex(i => (i + 1) % fields.length);
        e.preventDefault();
        return;
      } else if (e.key === "ArrowUp") {
        setDropdownIndex(i => (i - 1 + fields.length) % fields.length);
        e.preventDefault();
        return;
      } else if (e.key === "Enter") {
        setSelectedField(fields[dropdownIndex]);
        setDropdownOpen(false);
        setTimeout(() => {
          (document.getElementById("search-query-input") as HTMLInputElement)?.focus();
        }, 0);
        e.preventDefault();
        return;
      }
    }
  };

  // Handle submit
  const handleSubmit = () => {
    onSubmit(selectedField.value, query.trim());
  };

  // Handle clear
  const handleClear = () => {
    setQuery("");
    onSubmit(selectedField.value, "");
  };

  // Dropdown open/close logic
  const handleDropdownToggle = () => {
    setDropdownOpen(v => !v);
    setDropdownIndex(0);
  };
  const handleDropdownSelect = (field: FieldOption) => {
    setSelectedField(field);
    setDropdownOpen(false);
    setTimeout(() => {
      (document.getElementById("search-query-input") as HTMLInputElement)?.focus();
    }, 0);
  };

  // Close dropdown on outside click
  React.useEffect(() => {
    function handle(e: MouseEvent) {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="flex items-center space-x-2 w-full">
      <div ref={searchBarRef} className="flex-1 max-w-1/2 flex items-center relative border rounded px-2 py-1 bg-background focus-within:ring-2 focus-within:ring-primary">
        {/* Field dropdown */}
        <div className="relative">
          <button
            type="button"
            className="flex items-center gap-1 px-2 py-1 bg-muted rounded-l border-r border-border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={handleDropdownToggle}
            disabled={disabled}
            tabIndex={0}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
          >
            {selectedField.label}
            <ChevronDown className="h-3 w-3 ml-1" />
          </button>
          {dropdownOpen && (
            <div
              className="absolute left-0 top-full mt-1 bg-popover border border-border rounded shadow-lg z-20"
              role="listbox"
              tabIndex={-1}
              style={{ width: searchBarWidth || undefined }}
            >
              {fields.map((field, idx) => (
                <button
                  key={field.value}
                  className={`w-full text-left px-3 py-2 hover:bg-muted ${idx === dropdownIndex ? 'bg-muted font-semibold' : ''}`}
                  onClick={() => handleDropdownSelect(field)}
                  type="button"
                  role="option"
                  aria-selected={idx === dropdownIndex}
                >
                  {field.label}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Search input */}
        <div className="flex-1 flex items-center relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            id="search-query-input"
            type="text"
            className="flex-1 min-w-[80px] bg-transparent outline-none border-none focus:ring-0 px-7 py-1 text-sm"
            placeholder={placeholder}
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleQueryKeyDown}
            disabled={disabled}
            autoComplete="off"
            style={{ minWidth: 80 }}
          />
          {query && (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive focus:outline-none"
              onClick={handleClear}
              tabIndex={0}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <Button
        onClick={handleSubmit}
        disabled={disabled || !query.trim()}
        size="sm"
      >
        Search
      </Button>
    </div>
  );
}; 