import { useState, useRef, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, Tick01Icon } from "@hugeicons/core-free-icons";
import "./CustomSelect.scss";

export interface SelectOption<T = string | number> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

export interface CustomSelectProps<T = string | number> {
  id?: string;
  options: SelectOption<T>[];
  value: T | "";
  onChange: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export function CustomSelect<T extends string | number>({
  id,
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
  className = "",
  icon,
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((item) => item.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`custom-select-container ${className} ${disabled ? "disabled" : ""}`}
      ref={containerRef}
      id={id}
    >
      <button
        type="button"
        className={`custom-select-trigger ${isOpen ? "open" : ""}`}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        disabled={disabled}
        aria-expanded={isOpen}
      >
        <div className="trigger-content">
          {(selectedOption?.icon || icon) && (
            <span className="trigger-icon">
              {selectedOption?.icon || icon}
            </span>
          )}
          <span
            className={`trigger-label ${!selectedOption ? "placeholder" : ""}`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <div className="chevron-wrapper">
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={16}
            className={`chevron-icon ${isOpen ? "rotate" : ""}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="custom-select-dropdown">
          {options.length === 0 ? (
            <div className="dropdown-empty">No options available</div>
          ) : (
            options.map((item, index) => {
              const isSelected = item.value === value;
              return (
                <button
                  key={`${item.value}-${index}`}
                  type="button"
                  className={`dropdown-option ${isSelected ? "selected" : ""}`}
                  onClick={() => {
                    onChange(item.value);
                    setIsOpen(false);
                  }}
                >
                  <div className="option-content">
                    {item.icon && <span className="option-icon">{item.icon}</span>}
                    <span>{item.label}</span>
                  </div>
                  {isSelected && (
                    <HugeiconsIcon
                      icon={Tick01Icon}
                      size={16}
                      className="check-icon"
                    />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
