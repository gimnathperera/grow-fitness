import type { User as UserType } from '@/types/dashboard';
import { FloatingDock } from '@/components/ui/floating-dock';
import { getTabsForUser } from '@/utils/getTabsForUser';

interface MobileTabNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: UserType;
  kidType?: 'group' | 'individual';
}

export function MobileTabNav({
  activeTab,
  onTabChange,
  user,
  kidType,
}: MobileTabNavProps) {
  const tabs = getTabsForUser(user.role, kidType);

  const dockItems = tabs.map((tab) => ({
    title: tab.label,
    icon: <tab.icon className="h-5 w-5" />,
    href: `#${tab.id}`,
    id: tab.id,
  }));

  const handleItemClick = (item: { title: string; href?: string; id?: string }) => {
    if (item.id) {
      onTabChange(item.id);
    }
  };

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <FloatingDock
        items={dockItems}
        mobileClassName=""
        desktopClassName=""
        onItemClick={handleItemClick}
        activeTab={activeTab}
      />
    </div>
  );
}
