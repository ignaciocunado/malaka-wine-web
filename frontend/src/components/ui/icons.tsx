import type { SVGProps } from "react";

// Simple line icons in the spirit of SF Symbols (SF Symbols themselves may only be used in apps on Apple platforms).
type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      width="1em"
      height="1em"
      {...props}
    >
      {children}
    </svg>
  );
}

export const CheckIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Icon>
);

export const ChevronRightIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M9.5 5.5L16 12l-6.5 6.5" />
  </Icon>
);

export const ChevronLeftIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M14.5 5.5L8 12l6.5 6.5" />
  </Icon>
);

export const WineGlassIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M7.5 3h9l-.4 5.2A4.6 4.6 0 0 1 12 12.5a4.6 4.6 0 0 1-4.1-4.3L7.5 3z" />
    <path d="M7.8 7h8.4M12 12.5V20M8.5 20.5h7" />
  </Icon>
);

export const BoxIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3.5 7.5L12 3.5l8.5 4v9L12 20.5l-8.5-4v-9z" />
    <path d="M3.5 7.5L12 11.5l8.5-4M12 11.5v9" />
  </Icon>
);

export const SparklesIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M10 3.5l1.6 4.4L16 9.5l-4.4 1.6L10 15.5l-1.6-4.4L4 9.5l4.4-1.6L10 3.5z" />
    <path d="M17.5 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z" />
  </Icon>
);

export const CalendarIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </Icon>
);

export const HandshakeIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 6.5l-2-1.6a3 3 0 0 0-3.6-.1L3 7.5v7l3 1.2" />
    <path d="M21 14.5v-7l-3.6-2.6a3 3 0 0 0-3.4 0L9 8.5a1.6 1.6 0 0 0 2 2.5l2.2-1.5 5.3 5" />
    <path d="M6 15.7l3.3 3a1.5 1.5 0 0 0 2-.1l.2-.2m0 0l1 .9a1.5 1.5 0 0 0 2-2.2m-3-1.3l1.4 1.3m1.6-1.6l1 .9a1.5 1.5 0 0 0 2-2.1" />
  </Icon>
);

export const PersonIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 20.5c.8-3.7 3.8-6 7.5-6s6.7 2.3 7.5 6" />
  </Icon>
);

export const ExclamationIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5M12 16.5v.01" />
  </Icon>
);

export const PlusIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const MinusIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M5 12h14" />
  </Icon>
);
