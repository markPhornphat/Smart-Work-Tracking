import { cn } from '@/lib/utils';

type TagChipProps = {
  name: string;
  color: string;
  className?: string;
  onClick?: () => void;
};

/** High-contrast tag pill: colored left bar + readable ink text on ice background. */
export function TagChip({ name, color, className, onClick }: TagChipProps) {
  return (
    <span
      role={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'inline-flex max-w-full items-center gap-1 truncate rounded-md border border-[#89d6fb] bg-[#d4f0fc] px-2 py-0.5 text-xs font-semibold text-[#01303f]',
        onClick && 'cursor-pointer hover:bg-[#89d6fb]/40',
        className,
      )}
      style={{ boxShadow: `inset 3px 0 0 ${color}` }}
      title={name}
    >
      <span className="truncate">{name}</span>
    </span>
  );
}
