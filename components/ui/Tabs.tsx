'use client';

import type { KeyboardEvent, ReactNode } from 'react';
import { createContext, useContext, useId, useRef } from 'react';
import { cn } from '@/lib/cn';

const TAB_BASE =
  'min-h-11 px-4 text-lg font-semibold border-b-[3px] focus-pop transition-colors';

const TAB_STATE = {
  active: 'border-accent text-ink',
  inactive: 'border-transparent text-ink-soft hover:text-ink',
} as const satisfies Record<string, string>;

interface TabsContextValue {
  idBase: string;
  value: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function safeId(value: string): string {
  return value.replace(/[^\w-]/g, '-');
}

export interface TabItem<T extends string> {
  value: T;
  label: string;
}

export type TabsProps<T extends string> = {
  label: string;
  value: T;
  onChange: (value: T) => void;
  items: TabItem<T>[];
  idBase?: string;
  trailing?: ReactNode;
  children?: ReactNode;
};

function nextIndex(key: string, index: number, count: number): number | null {
  if (key === 'ArrowRight') return (index + 1) % count;
  if (key === 'ArrowLeft') return (index - 1 + count) % count;
  if (key === 'Home') return 0;
  if (key === 'End') return count - 1;
  return null;
}

export function Tabs<T extends string>({
  label,
  value,
  onChange,
  items,
  idBase,
  trailing,
  children,
}: TabsProps<T>) {
  const generatedId = useId();
  const base = safeId(idBase ?? generatedId);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const target = nextIndex(event.key, index, items.length);
    if (target === null) return;
    event.preventDefault();
    onChange(items[target].value);
    buttons.current[target]?.focus();
  }

  return (
    <TabsContext.Provider value={{ idBase: base, value }}>
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="-mx-1 min-w-0 px-1 pt-1 pb-1.5 sm:overflow-x-auto">
            <div role="tablist" aria-label={label} className="flex flex-wrap gap-1 sm:flex-nowrap">
              {items.map((item, index) => {
                const selected = item.value === value;
                const key = safeId(item.value);
                return (
                  <button
                    key={item.value}
                    ref={(element) => {
                      buttons.current[index] = element;
                    }}
                    type="button"
                    role="tab"
                    id={`${base}-tab-${key}`}
                    aria-selected={selected}
                    aria-controls={`${base}-panel-${key}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => onChange(item.value)}
                    onKeyDown={(event) => handleKeyDown(event, index)}
                    className={cn(TAB_BASE, selected ? TAB_STATE.active : TAB_STATE.inactive)}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
          {trailing}
        </div>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export type TabPanelProps = {
  value: string;
  children: ReactNode;
};

export function TabPanel({ value, children }: TabPanelProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabPanel must be rendered inside Tabs');
  const key = safeId(value);
  return (
    <div
      role="tabpanel"
      id={`${context.idBase}-panel-${key}`}
      aria-labelledby={`${context.idBase}-tab-${key}`}
      hidden={context.value !== value}
      tabIndex={0}
      className="pt-4 text-lg text-ink"
    >
      {children}
    </div>
  );
}
