import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronDown, Leaf, MapPin, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LOCATION_OPTIONS, PRODUCE_OPTIONS } from "../data/site";
import { cn } from "../utils/cn";

/* ------------------------- Accessible field dropdown ------------------------ */

interface FieldDropdownProps {
  id: string;
  icon: LucideIcon;
  placeholder: string;
  options: string[];
  value: string | null;
  onChange: (value: string) => void;
}

function FieldDropdown({ id, icon: Icon, placeholder, options, value, onChange }: FieldDropdownProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const choose = (option: string) => {
    onChange(option);
    setOpen(false);
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(options.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (open && active >= 0) choose(options[active]!);
      else {
        setActive(value ? options.indexOf(value) : -1);
        setOpen((o) => !o);
      }
    } else if (e.key === "Escape" || e.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={placeholder}
        onClick={() => {
          setActive(value ? options.indexOf(value) : -1);
          setOpen((o) => !o);
        }}
        onKeyDown={onKeyDown}
        className={cn(
          "flex h-[58px] w-full items-center gap-3 rounded-[18px] border border-ks-border bg-ks-bg px-4 text-left transition-all duration-200 hover:border-ks-green/50",
          open && "border-ks-green bg-white ring-4 ring-ks-green/10"
        )}
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ks-light text-ks-green">
          <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
        </span>
        <span
          className={cn(
            "flex-1 truncate text-[15px] font-medium",
            value ? "text-ks-text" : "text-ks-muted/75"
          )}
        >
          {value ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-[18px] w-[18px] shrink-0 text-ks-muted transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-labelledby={id}
          className="animate-pop-in absolute inset-x-0 top-[calc(100%+8px)] z-40 max-h-[264px] overflow-y-auto rounded-2xl border border-ks-border bg-white p-1.5 shadow-panel"
        >
          {options.map((option, i) => (
            <li key={option} role="option" aria-selected={value === option}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(option)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-[10px] px-3.5 py-2.5 text-left text-[14px] font-medium transition-colors",
                  i === active ? "bg-ks-light text-ks-dark" : "text-ks-text hover:bg-ks-bg",
                  value === option && "text-ks-green"
                )}
              >
                {option}
                {value === option && <Check className="h-4 w-4" strokeWidth={2.6} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* --------------------------------- Panel ---------------------------------- */

/**
 * White rounded search panel that overlaps the bottom of the hero.
 * Navigates to /market-prices with crop & location as query params.
 */
export default function PriceSearch() {
  const navigate = useNavigate();
  const [produce, setProduce] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (produce) params.set("crop", produce.toLowerCase());
    if (location) params.set("location", location.toLowerCase());
    const query = params.toString();
    navigate(`/market-prices${query ? `?${query}` : ""}`);
  };

  return (
    <div
      role="search"
      aria-label="Search market prices"
      className="rounded-[24px] border border-ks-border/70 bg-white p-2.5 shadow-panel sm:rounded-[28px]"
    >
      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-[1.1fr_1.1fr_auto]">
        <FieldDropdown
          id="produce-select"
          icon={Leaf}
          placeholder="Select Produce"
          options={PRODUCE_OPTIONS}
          value={produce}
          onChange={setProduce}
        />
        <FieldDropdown
          id="location-select"
          icon={MapPin}
          placeholder="Select Location"
          options={LOCATION_OPTIONS}
          value={location}
          onChange={setLocation}
        />
        <button
          type="button"
          onClick={handleSearch}
          className="group inline-flex h-[58px] items-center justify-center gap-2.5 rounded-[18px] bg-ks-green px-9 text-[15.5px] font-semibold whitespace-nowrap text-white transition-all duration-200 hover:bg-ks-dark active:scale-[0.99]"
        >
          <Search className="h-[19px] w-[19px] transition-transform duration-200 group-hover:scale-110" strokeWidth={2.4} />
          Search Prices
        </button>
      </div>
    </div>
  );
}
