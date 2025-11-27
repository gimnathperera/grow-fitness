import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { useAuth } from '@/auth/useAuth';
import { getDefaultRouteForUser } from '@/auth/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState(0);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuItemsRefs = useRef<
    (HTMLAnchorElement | HTMLButtonElement | null)[]
  >([]);

  const destination = useMemo(
    () => getDefaultRouteForUser(auth.user),
    [auth.user]
  );

  const userInitial = useMemo(() => {
    const nameInitial = auth.user?.name?.charAt(0)?.toUpperCase();
    if (nameInitial) return nameInitial;
    return auth.user?.email?.charAt(0)?.toUpperCase() ?? '?';
  }, [auth.user]);

  const isActive = (path: string) => location.pathname === path;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  const focusMenuItem = useCallback((index: number) => {
    const node = menuItemsRefs.current[index];
    if (node) {
      node.focus();
      setActiveMenuItem(index);
    }
  }, []);

  const handleToggleMenu = useCallback(() => {
    setIsMenuOpen(prev => {
      const next = !prev;
      if (next) {
        requestAnimationFrame(() => focusMenuItem(0));
      }
      return next;
    });
  }, [focusMenuItem]);

  const handleMenuKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleToggleMenu();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setIsMenuOpen(true);
        requestAnimationFrame(() => focusMenuItem(0));
      }
    },
    [focusMenuItem, handleToggleMenu]
  );

  const handleMenuItemKeyDown = useCallback(
    (
      event: React.KeyboardEvent<HTMLAnchorElement | HTMLButtonElement>,
      index: number
    ) => {
      const itemCount = menuItemsRefs.current.filter(Boolean).length;
      if (itemCount === 0) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          focusMenuItem((index + 1) % itemCount);
          break;
        case 'ArrowUp':
          event.preventDefault();
          focusMenuItem((index - 1 + itemCount) % itemCount);
          break;
        case 'Home':
          event.preventDefault();
          focusMenuItem(0);
          break;
        case 'End':
          event.preventDefault();
          focusMenuItem(itemCount - 1);
          break;
        case 'Escape':
          event.preventDefault();
          closeMenu();
          requestAnimationFrame(() => menuButtonRef.current?.focus());
          break;
      }
    },
    [closeMenu, focusMenuItem]
  );

  const handleProfileSelect = useCallback(() => {
    closeMenu();
    navigate('/profile');
  }, [closeMenu, navigate]);

  const handleDashboardSelect = useCallback(() => {
    closeMenu();
    navigate(destination);
  }, [closeMenu, destination, navigate]);

  const handleLogout = useCallback(async () => {
    await auth.logout();
    closeMenu();
    navigate('/sign-in');
  }, [auth, closeMenu, navigate]);

  const dashboardLabel = useMemo(() => {
    const role = auth.user?.role;
    if (role === 'coach') return 'Coach Dashboard';
    if (role === 'client') return 'Client Dashboard';
    if (role === 'team') return 'Team Dashboard';
    if (role === 'admin') return 'Admin Dashboard';
    return 'Dashboard';
  }, [auth.user?.role]);

  const primaryMenuItems = useMemo(
    () => [
      {
        key: 'dashboard',
        label: dashboardLabel,
        onSelect: handleDashboardSelect,
      },
      {
        key: 'profile',
        label: 'Profile',
        onSelect: handleProfileSelect,
      },
    ],
    [dashboardLabel, handleDashboardSelect, handleProfileSelect]
  );

  const allMenuItems = useMemo(
    () => [
      ...primaryMenuItems,
      { key: 'logout', label: 'Log Out', onSelect: handleLogout },
    ],
    [handleLogout, primaryMenuItems]
  );

  useEffect(() => {
    if (!isMenuOpen) {
      menuItemsRefs.current = [];
      setActiveMenuItem(0);
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    const handleFocusOut = (event: FocusEvent) => {
      const relatedTarget = event.relatedTarget as Node | null;
      if (
        relatedTarget &&
        (dropdownRef.current?.contains(relatedTarget) ||
          menuButtonRef.current?.contains(relatedTarget))
      ) {
        return;
      }
      closeMenu();
    };

    const dropdownElement = dropdownRef.current;

    document.addEventListener('pointerdown', handlePointerDown);
    dropdownElement?.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      dropdownElement?.removeEventListener('focusout', handleFocusOut);
    };
  }, [closeMenu, isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      requestAnimationFrame(() => focusMenuItem(activeMenuItem));
    }
  }, [activeMenuItem, focusMenuItem, isMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] w-screen border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16 max-w-7xl mx-auto">
          <Link
            to="/"
            className="flex items-center gap-3 text-4xl font-bold text-primary hover:text-primary/80 transition-colors font-insanibc"
            onClick={closeMobileMenu}
          >
            <img
              src="/svg/Grow Logo Versions-01.svg"
              alt="Grow Fitness Logo"
              className="w-20 h-20"
            />
            <h2 className="hidden md:inline font-semibold text-primary">
              Grow Fitness
            </h2>
          </Link>

          <div>
            <NavigationMenu>
              <NavigationMenuList>
                {auth.isAuthenticated ? (
                  <NavigationMenuItem className="relative">
                    <button
                      ref={menuButtonRef}
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={isMenuOpen}
                      aria-controls="user-menu-dropdown"
                      aria-label={`Open account menu for ${auth.user?.name ?? auth.user?.email ?? 'user'}`}
                      title={auth.user?.name ?? auth.user?.email ?? 'User menu'}
                      onClick={handleToggleMenu}
                      onKeyDown={handleMenuKeyDown}
                      className={cn(
                        'flex size-10 items-center justify-center rounded-full transition-colors'
                      )}
                    >
                      <Avatar className="size-10">
                        <AvatarImage
                          alt={auth.user?.name ?? auth.user?.email ?? 'User'}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                          {userInitial}
                        </AvatarFallback>
                      </Avatar>
                    </button>

                    {isMenuOpen && (
                      <div
                        ref={dropdownRef}
                        id="user-menu-dropdown"
                        role="menu"
                        aria-label="User menu"
                        className="absolute right-0 mt-3 min-w-[14rem] origin-top-right rounded-lg border border-border bg-popover text-popover-foreground shadow-lg focus:outline-none"
                      >
                        <div className="px-4 py-3 text-xs font-medium text-muted-foreground">
                          Signed in as{' '}
                          <span className="block truncate text-foreground">
                            {auth.user?.email ?? 'member@growfitness.com'}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 px-2 pb-3">
                          {allMenuItems.map((item, index) => (
                            <button
                              key={item.key}
                              type="button"
                              role="menuitem"
                              tabIndex={-1}
                              ref={node => {
                                menuItemsRefs.current[index] = node;
                              }}
                              onClick={item.onSelect}
                              onKeyDown={event =>
                                handleMenuItemKeyDown(event, index)
                              }
                              className="flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none"
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuLink
                    className={cn(
                      'px-3 py-2 text-xs md:px-8 md:py-3 md:text-lg rounded-full font-[Insaniburger_with_Cheese] font-extrabold shadow-lg inline-flex items-center justify-center transition-transform duration-300 hover:scale-105 bg-white text-primary hover:bg-gray-100',
                      isActive('/sign-in') && 'bg-gray-100'
                    )}
                  >
                    <Link to="/sign-in">
                      <h6 className="leading-none whitespace-nowrap">
                        Sign In
                      </h6>
                    </Link>
                  </NavigationMenuLink>
                )}
                {!auth.isAuthenticated && (
                  <NavigationMenuLink
                    className={cn(
                      'w-full md:w-auto px-3 py-2 text-xs md:px-8 md:py-3 md:text-lg rounded-full font-[Insaniburger_with_Cheese] font-extrabold shadow-lg inline-flex items-center justify-center transition-transform duration-300 hover:scale-105 bg-primary hover:bg-[#1e9c70] !text-white',
                      isActive('/add-kids-details') && 'text-accent-foreground'
                    )}
                  >
                    <Link to="/collect-info" className="!text-white">
                      <h6 className="leading-none whitespace-nowrap">
                        Book a free session
                      </h6>
                    </Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </nav>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/40">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background/95">
              {!auth.isAuthenticated && (
                <Link
                  to="/sign-in"
                  onClick={closeMobileMenu}
                  className={cn(
                    'block px-3 py-2 rounded-md text-base font-medium transition-colors',
                    isActive('/sign-in')
                      ? 'bg-accent text-accent-foreground'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  Sign In
                </Link>
              )}
              {auth.isAuthenticated && (
                <Link
                  to={destination}
                  onClick={closeMobileMenu}
                  className={cn(
                    'block px-3 py-2 rounded-md text-base font-medium transition-colors',
                    isActive(destination)
                      ? 'bg-accent text-accent-foreground'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  {auth.user?.name ?? auth.user?.email ?? 'Dashboard'}
                </Link>
              )}
              {!auth.isAuthenticated && (
                <Link
                  to="/add-kids-details"
                  onClick={closeMobileMenu}
                  className={cn(
                    'block px-3 py-2 rounded-md text-base font-medium transition-colors',
                    isActive('/add-kids-details')
                      ? 'bg-accent text-accent-foreground'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  Book a free session
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
