import { useEffect, useId, useRef, useState } from "react";
import "./dropdown.css";

const normalize = (opt) =>
  typeof opt === "string" ? { value: opt, label: opt } : opt;

const Dropdown = ({
  value,
  options,
  placeholder = "Select…",
  onChange,
  className = "",
  width = "100%",
}) => {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const listRef = useRef(null);
  const id = useId();

  const items = (options ?? []).map(normalize);
  const activeIndex = Math.max(
    0,
    items.findIndex((o) => o.value === value)
  );

  useEffect(() => {
    const onClick = (e) => {
      if (!btnRef.current) return;
      if (
        !btnRef.current.contains(e.target) &&
        !listRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const onKeyDown = (e) => {
    if (
      !open &&
      (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")
    ) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (open) {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
      if (e.key === "Tab") {
        setOpen(false);
      }
    }
  };

  const label = items.find((o) => o.value === value)?.label ?? (
    <span className="dropdown-placeholder">{placeholder}</span>
  );

  const selectAt = (idx) => {
    const opt = items[idx];
    if (!opt) return;
    onChange?.(opt.value);
    setOpen(false);
    btnRef.current?.focus();
  };

  return (
    <div className={`dropdown ${className}`} style={{ width }}>
      <button
        type="button"
        ref={btnRef}
        className={`dropdown-btn ${open ? "open" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`list-${id}`}
        onClick={() => {
          setOpen((o) => !o);
        }}
        onKeyDown={onKeyDown}
      >
        <span className="dropdown-label">{label}</span>
        <svg
          className="dropdown-caret"
          viewBox="0 0 16 16"
          width="16"
          height="16"
          aria-hidden
        >
          <path
            d="M4 6l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </button>

      {open && (
        <ul
          id={`list-${id}`}
          role="listbox"
          ref={listRef}
          className="dropdown-list"
          tabIndex={-1}
        >
          {items.map((opt, idx) => {
            const isActive = idx === activeIndex;
            const selected = opt.value === value;
            return (
              <li
                key={`${String(opt.value)}-${idx}`}
                role="option"
                aria-selected={selected}
                className={`dropdown-item ${selected ? "selected" : ""} ${
                  isActive ? "active" : ""
                }`}
                onClick={() => selectAt(idx)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") selectAt(idx);
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    const next = Math.min(items.length - 1, idx + 1);
                    listRef.current?.querySelectorAll(".dropdown-item")[next]?.focus();
                  }
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    const prev = Math.max(0, idx - 1);
                    listRef.current?.querySelectorAll(".dropdown-item")[prev]?.focus();
                  }
                }}
                tabIndex={0}
              >
                <span>{opt.label}</span>
                {selected && (
                  <span className="dropdown-check" aria-hidden>
                    ✓
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
