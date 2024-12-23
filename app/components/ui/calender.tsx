'use client';

import * as React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'; // Ensure correct icon imports
import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from './button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays} // Show days outside the current month
      className={cn('p-3', className)} // Combine custom class with default padding
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }), // Apply custom button variant styles
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        nav_button_previous: 'absolute left-1', // Position the previous button
        nav_button_next: 'absolute right-1', // Position the next button
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell: 'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
            : '[&:has([aria-selected])]:rounded-md',
          'flex items-center justify-center' // Add flexbox properties to center content
        ),
        
        day: cn(
          buttonVariants({ variant: 'ghost' }), // Apply ghost button styles
          'h-8 w-8 p-0 font-normal aria-selected:opacity-100'
        ),
        day_range_start: 'day-range-start',
        day_range_end: 'day-range-end',
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
        day_outside: 'text-muted-foreground opacity-50',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames, // Spread additional custom classNames into the component
      }}
      components={{
        PreviousMonthButton: ({ ...props }) => (
          <button className="h-7 w-7 opacity-50 hover:opacity-100" {...props}>
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
        ),
        NextMonthButton: ({ ...props }) => (
          <button className="h-7 w-7 opacity-50 hover:opacity-100" {...props}>
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        ),
      }}
      {...props} // Spread other props to the DayPicker component
    />
  );
}

Calendar.displayName = 'Calendar';

export { Calendar };