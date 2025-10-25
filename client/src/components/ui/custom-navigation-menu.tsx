import * as React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavigationMenuProps {
  className?: string;
  children: React.ReactNode;
}

interface NavigationMenuListProps {
  className?: string;
  children: React.ReactNode;
}

interface NavigationMenuItemProps {
  className?: string;
  children: React.ReactNode;
}

interface NavigationMenuLinkProps {
  to: string;
  className?: string;
  children: React.ReactNode;
  isActive?: boolean;
}

export function NavigationMenu({ className, children }: NavigationMenuProps) {
  return (
    <nav className={cn('flex items-center space-x-4', className)}>
      {children}
    </nav>
  );
}

export function NavigationMenuList({
  className,
  children,
}: NavigationMenuListProps) {
  return (
    <ul className={cn('flex items-center space-x-4', className)}>{children}</ul>
  );
}

export function NavigationMenuItem({
  className,
  children,
}: NavigationMenuItemProps) {
  return <li className={cn('relative', className)}>{children}</li>;
}

export function NavigationMenuLink({
  to,
  className,
  children,
  isActive,
}: NavigationMenuLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        'group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
        'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
        'focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px] focus-visible:outline-1',
        isActive && 'bg-accent text-accent-foreground',
        className,
      )}
    >
      {children}
    </Link>
  );
}
