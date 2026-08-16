import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
  Calendar03Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import "./EventDateTimePicker.scss";

interface EventDateTimePickerLabels {
  close: string;
  dialog: string;
  done: string;
  hour: string;
  minute: string;
  nextMonth: string;
  placeholder: string;
  previousMonth: string;
  time: string;
}

interface EventDateTimePickerProps {
  labels: EventDateTimePickerLabels;
  locale: string;
  min: string;
  onChange: (value: string) => void;
  value: string;
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function toLocalDateValue(date: Date, time: string): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${time}`;
}

function parseDateTime(value: string): Date | null {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function EventDateTimePicker({
  labels,
  locale,
  min,
  onChange,
  value,
}: EventDateTimePickerProps) {
  const selectedDate = useMemo(() => parseDateTime(value), [value]);
  const minDate = useMemo(() => parseDateTime(min) ?? new Date(), [min]);
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const [viewMonth, setViewMonth] = useState(
    () => new Date((selectedDate ?? minDate).getFullYear(), (selectedDate ?? minDate).getMonth(), 1),
  );
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !pickerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);


  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }),
    [locale],
  );
  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }),
    [locale],
  );
  const dayFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: "narrow" }),
    [locale],
  );
  const accessibleDateFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: "full" }),
    [locale],
  );

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, index) => dayFormatter.format(new Date(2023, 0, 1 + index))),
    [dayFormatter],
  );
  const leadingEmptyDays = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1).getDay();
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
  const calendarDays = Array.from({ length: leadingEmptyDays + daysInMonth }, (_, index) => {
    if (index < leadingEmptyDays) {
      return null;
    }

    return new Date(viewMonth.getFullYear(), viewMonth.getMonth(), index - leadingEmptyDays + 1);
  });

  const currentTime = value ? value.slice(11, 16) : "09:00";
  const [hours, minutes] = currentTime.split(":");
  const selectedDateKey = selectedDate ? toLocalDateValue(selectedDate, "00:00").slice(0, 10) : "";
  const minDateKey = toLocalDateValue(minDate, "00:00").slice(0, 10);
  const displayValue = selectedDate ? dateFormatter.format(selectedDate) : labels.placeholder;

  const openPicker = () => {
    setViewMonth(new Date((selectedDate ?? minDate).getFullYear(), (selectedDate ?? minDate).getMonth(), 1));
    setIsOpen(true);
  };

  const updateValue = (date: Date, time = currentTime) => {
    onChange(toLocalDateValue(date, time));
  };

  const updateTime = (nextHours: string, nextMinutes: string) => {
    updateValue(selectedDate ?? minDate, `${nextHours}:${nextMinutes}`);
  };

  return (
    <div className="event-date-time-picker" ref={pickerRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={selectedDate ? "event-date-time-picker__trigger" : "event-date-time-picker__trigger event-date-time-picker__trigger--placeholder"}
        onClick={openPicker}
        type="button"
      >
        <span>{displayValue}</span>
        <HugeiconsIcon aria-hidden="true" icon={Calendar03Icon} size={18} strokeWidth={1.8} />
      </button>

      {isOpen ? (
        <div aria-label={labels.dialog} className="event-date-time-picker__popover" role="dialog">
          <div className="event-date-time-picker__header">
            <button aria-label={labels.previousMonth} onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))} type="button">
              <HugeiconsIcon aria-hidden="true" icon={ArrowLeft02Icon} size={17} strokeWidth={1.8} />
            </button>
            <strong>{monthFormatter.format(viewMonth)}</strong>
            <button aria-label={labels.nextMonth} onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))} type="button">
              <HugeiconsIcon aria-hidden="true" icon={ArrowRight02Icon} size={17} strokeWidth={1.8} />
            </button>
          </div>

          <div className="event-date-time-picker__weekdays" aria-hidden="true">
            {weekDays.map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
          </div>

          <div className="event-date-time-picker__calendar">
            {calendarDays.map((date, index) => {
              if (!date) {
                return <span aria-hidden="true" key={`empty-${index}`} />;
              }

              const dateKey = toLocalDateValue(date, "00:00").slice(0, 10);
              const isDisabled = dateKey < minDateKey;
              const isSelected = dateKey === selectedDateKey;
              const isToday = dateKey === minDateKey;

              return (
                <button
                  aria-label={accessibleDateFormatter.format(date)}
                  aria-pressed={isSelected}
                  className={[
                    "event-date-time-picker__day",
                    isSelected ? "event-date-time-picker__day--selected" : "",
                    isToday ? "event-date-time-picker__day--today" : "",
                  ].filter(Boolean).join(" ")}
                  disabled={isDisabled}
                  key={dateKey}
                  onClick={() => updateValue(date)}
                  type="button"
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="event-date-time-picker__time">
            <span>{labels.time}</span>
            <label>
              <span className="event-date-time-picker__sr-only">{labels.hour}</span>
              <select aria-label={labels.hour} onChange={(event) => updateTime(event.target.value, minutes)} value={hours}>
                {Array.from({ length: 24 }, (_, hour) => <option key={hour} value={pad(hour)}>{pad(hour)}</option>)}
              </select>
            </label>
            <b>:</b>
            <label>
              <span className="event-date-time-picker__sr-only">{labels.minute}</span>
              <select aria-label={labels.minute} onChange={(event) => updateTime(hours, event.target.value)} value={minutes}>
                {["00", "15", "30", "45"].map((minute) => <option key={minute} value={minute}>{minute}</option>)}
              </select>
            </label>
          </div>

          <div className="event-date-time-picker__footer">
            <button className="event-date-time-picker__close" onClick={() => setIsOpen(false)} type="button">
              <HugeiconsIcon aria-hidden="true" icon={Cancel01Icon} size={15} strokeWidth={1.8} />
              {labels.close}
            </button>
            <button className="event-date-time-picker__done" onClick={() => setIsOpen(false)} type="button">
              {labels.done}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
