import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Building2, Check, ChevronDown, MapPin, Search, X } from "lucide-react";
import {
  CLINIC_COMMUNE_OPTIONS,
  filterClinicCommuneOptions,
  OTHER_CLINIC_OPTION,
  type ClinicCommuneOption,
} from "@/lib/quote";

export interface ClinicCommuneSelectProps {
  value: string;
  onChange: (nextValue: string) => void;
  name?: string | undefined;
  placeholder?: string | undefined;
}

export function ClinicCommuneSelect({
  value,
  onChange,
  name = "clinic_commune",
  placeholder = "Selecciona o busca tu clínica / comuna...",
}: ClinicCommuneSelectProps) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isPresetValue = useMemo(
    () => value === "" || CLINIC_COMMUNE_OPTIONS.some((opt) => opt.label === value),
    [value],
  );

  const isOtherMode = value === OTHER_CLINIC_OPTION || (value !== "" && !isPresetValue);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [customOtherText, setCustomOtherText] = useState(() =>
    value !== "" && !isPresetValue && value !== OTHER_CLINIC_OPTION
      ? value.replace(/^Otra comuna \/ clínica:\s*/i, "")
      : "",
  );

  const filteredOptions = useMemo(() => filterClinicCommuneOptions(query), [query]);

  const groupedOptions = useMemo(() => {
    const groups = new Map<string, ClinicCommuneOption[]>();
    for (const item of filteredOptions) {
      const list = groups.get(item.commune);
      if (list) {
        list.push(item);
      } else {
        groups.set(item.commune, [item]);
      }
    }
    return Array.from(groups.entries());
  }, [filteredOptions]);

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 15);

    function handleOutsideClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function handleSelectOption(optionLabel: string) {
    setCustomOtherText("");
    onChange(optionLabel);
    setOpen(false);
    setQuery("");
  }

  function handleSelectOther() {
    onChange(
      customOtherText.trim()
        ? `${OTHER_CLINIC_OPTION} (${customOtherText.trim()})`
        : OTHER_CLINIC_OPTION,
    );
    setOpen(false);
    setQuery("");
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    setCustomOtherText("");
    onChange("");
    setQuery("");
  }

  const displayLabel = isOtherMode ? OTHER_CLINIC_OPTION : value || "";

  return (
    <div ref={containerRef} className="relative w-full font-normal">
      <input type="hidden" name={name} value={value} />

      <div className="relative">
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-haspopup="listbox"
          onClick={() => setOpen((prev) => !prev)}
          className="field w-full flex items-center justify-between gap-2 text-left cursor-pointer pr-9"
        >
          <span className="flex items-center gap-2 min-w-0 flex-1">
            <Building2
              size={15}
              className={displayLabel ? "text-[#E91E8C] shrink-0" : "text-[#12056E]/50 shrink-0"}
            />
            <span
              className={`truncate text-xs sm:text-sm ${
                displayLabel ? "text-[#0A033C] font-semibold" : "text-[#0A033C]/50 font-normal"
              }`}
            >
              {displayLabel || placeholder}
            </span>
          </span>
        </button>

        {value ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Limpiar clínica seleccionada"
            className="absolute right-7 top-1/2 -translate-y-1/2 p-1 text-[#0A033C]/45 hover:text-[#E91E8C] transition-colors cursor-pointer"
          >
            <X size={13} />
          </button>
        ) : null}

        <ChevronDown
          size={16}
          onClick={() => setOpen((prev) => !prev)}
          className={`absolute right-2.5 top-1/2 -translate-y-1/2 text-[#12056E] transition-transform cursor-pointer ${
            open ? "rotate-180 text-[#E91E8C]" : ""
          }`}
        />
      </div>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Clínicas y comunas disponibles"
          className="absolute left-0 right-0 z-50 mt-1.5 rounded-2xl border-2 border-[#12056E]/20 bg-white shadow-2xl overflow-hidden"
        >
          <div className="p-2.5 bg-[#F6F5FF] border-b border-[#12056E]/10">
            <div className="relative flex items-center">
              <Search size={14} className="absolute left-3 text-[#12056E]/60 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar comuna o clínica (ej: Copiapó, Las Condes, Indisa, Antofagasta)..."
                aria-label="Buscar por comuna o nombre de clínica"
                className="w-full rounded-xl border border-[#12056E]/20 bg-white pl-8 pr-8 py-2 text-xs text-[#0A033C] placeholder:text-[#0A033C]/45 focus:outline-none focus:border-[#E91E8C]"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Borrar búsqueda"
                  className="absolute right-2.5 text-[#0A033C]/45 hover:text-[#E91E8C] cursor-pointer"
                >
                  <X size={13} />
                </button>
              )}
            </div>
            <div className="mt-1.5 flex items-center justify-between px-1 text-[10px] font-semibold text-[#12056E]/75">
              <span>{filteredOptions.length} clínicas disponibles en Chile</span>
              <span>Filtra por ciudad o clínica</span>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-[#12056E]/10">
            {groupedOptions.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#0A033C]/70">
                No encontramos coincidencias para <strong>“{query}”</strong>. Puedes elegir{" "}
                <strong>“{OTHER_CLINIC_OPTION}”</strong> más abajo.
              </div>
            ) : (
              groupedOptions.map(([commune, options]) => (
                <div key={commune} className="py-1">
                  <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#12056E] bg-[#F6F5FF]/70 flex items-center gap-1.5">
                    <MapPin size={11} className="text-[#E91E8C]" />
                    {commune}
                  </div>
                  {options.map((opt) => {
                    const selected = value === opt.label;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() => handleSelectOption(opt.label)}
                        className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                          selected
                            ? "bg-[#12056E] text-white font-bold"
                            : "text-[#0A033C] hover:bg-[#F6F5FF]"
                        }`}
                      >
                        <span className="truncate">
                          <strong className={selected ? "text-[#F01E8E]" : "text-[#12056E]"}>
                            {opt.commune}
                          </strong>{" "}
                          — {opt.clinic}
                        </span>
                        {selected && <Check size={14} className="text-[#F01E8E] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              ))
            )}

            {/* Opción final para otra comuna o clínica no listada */}
            <div className="p-1.5 bg-[#FAF9FF]">
              <button
                type="button"
                role="option"
                aria-selected={isOtherMode}
                onClick={handleSelectOther}
                className={`w-full rounded-xl px-3 py-2 text-left text-xs font-bold flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                  isOtherMode
                    ? "bg-[#E91E8C] text-white"
                    : "text-[#12056E] hover:bg-[#F6F5FF] border border-dashed border-[#E91E8C]/50"
                }`}
              >
                <span>+ {OTHER_CLINIC_OPTION}</span>
                {isOtherMode && <Check size={14} className="text-white shrink-0" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {isOtherMode && (
        <input
          type="text"
          maxLength={120}
          value={customOtherText}
          onChange={(e) => {
            const nextText = e.target.value;
            setCustomOtherText(nextText);
            onChange(
              nextText.trim() ? `${OTHER_CLINIC_OPTION} (${nextText.trim()})` : OTHER_CLINIC_OPTION,
            );
          }}
          placeholder="Escribe tu comuna o clínica de preferencia..."
          className="field mt-2 w-full text-xs"
        />
      )}
    </div>
  );
}
