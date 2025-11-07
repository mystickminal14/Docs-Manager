import { FaChevronDown, FaFolderOpen, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { useEffect, useState, useContext } from "react";
import appLogo from "../../assets/logo.png";
import { AppContext } from "../../context/ContextApp";
import { useLocation, useNavigate } from "react-router-dom";
import { useLogout } from "../../admin/hooks/useLogout"; // 👈 import useLogout

interface MenuItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: string;
  subMenus?: { id: string; label: string }[];
}

interface SideBarProps {
  collapsed: boolean;
  onCollapse?: () => void;
}

const menuItems: MenuItem[] = [
  { id: "manage-files", icon: FaFolderOpen, label: "Manage Files", badge: "New" },
  { id: "admin", icon: FaUsers, label: "Users", badge: "New" },
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
}

const SideBar: React.FC<SideBarProps> = ({ collapsed, onCollapse }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [activeMobileItem, setActiveMobileItem] = useState<MenuItem | null>(null);
  const isMobile = useIsMobile();
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("AppContext not found");

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const logoutMutation = useLogout(); // 👈 initialize logout hook

  const toggleSubmenu = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) newExpanded.delete(itemId);
    else newExpanded.add(itemId);
    setExpandedItems(newExpanded);
  };

  const handleMenuClick = (item: MenuItem, subMenuId?: string) => {
    if (subMenuId) {
      navigate(`/app/${item.id}/${subMenuId}`);
    } else if (item.subMenus) {
      if (isMobile) {
        setActiveMobileItem(item);
        setSubmenuOpen(true);
      } else {
        toggleSubmenu(item.id);
        if (!expandedItems.has(item.id) && item.subMenus.length > 0) {
          navigate(`/app/${item.id}/${item.subMenus[0].id}`);
        }
      }
    } else {
      setExpandedItems(new Set());
      navigate(`/app/${item.id}`);
    }

    if (isMobile && !collapsed) onCollapse?.();
  };

  const isMenuItemActive = (item: MenuItem): boolean =>
    item.subMenus
      ? pathname.startsWith(`/app/${item.id}`)
      : pathname === `/app/${item.id}`;

  const isSubMenuActive = (item: MenuItem, subMenuId: string) =>
    pathname === `/app/${item.id}/${subMenuId}`;

  return (
    <div
      className={`font-poppins flex flex-col relative z-10 transition-all duration-300 ease-in-out border-r
        ${collapsed ? "w-20" : "w-65"} bg-white border-slate-200`}
    >
      {/* Logo */}
      <div className="p-3 border-b border-slate-200/50 flex justify-center">
        {collapsed ? (
          <img
            src={appLogo}
            alt="Collapsed Logo"
            className="w-12 h-12 object-cover rounded-xl shadow-lg"
          />
        ) : (
          <img
            src={appLogo}
            alt="Expanded Logo"
            className="w-30 h-auto object-contain rounded-xl"
          />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = isMenuItemActive(item);
          const isExpanded = expandedItems.has(item.id);

          return (
            <div key={item.id}>
              <button
                className={`w-full flex cursor-pointer items-center justify-between p-3 rounded-xl transition-all duration-200 ${isActive
                  ? "bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                  : "text-slate-700 hover:bg-slate-100"
                  }`}
                onClick={() => handleMenuClick(item)}
              >
                <div className="flex items-center space-x-3">
                  <item.icon
                    className={`w-6 h-6 ${isActive ? "text-white" : "text-slate-700"
                      }`}
                  />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </div>
                {!collapsed && item.subMenus && (
                  <FaChevronDown
                    className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""
                      } ${isActive ? "text-white" : "text-slate-700"}`}
                  />
                )}
              </button>

              {!isMobile && item.subMenus && isExpanded && (
                <div className="ml-8 mt-2 space-y-1">
                  {item.subMenus.map((menu) => (
                    <button
                      key={menu.id}
                      className={`w-full text-left p-2 text-sm rounded-lg transition-all ${isSubMenuActive(item, menu.id)
                        ? "text-blue-600 bg-blue-50 font-medium"
                        : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                        }`}
                      onClick={() => handleMenuClick(item, menu.id)}
                    >
                      {menu.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-slate-200 p-4">
        <button
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className={`w-full flex items-center justify-center gap-3 py-2 rounded-xl transition-all font-medium ${logoutMutation.isPending
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/30"
            }`}
        >
          <FaSignOutAlt size={18} />
          {!collapsed && (
            <span>{logoutMutation.isPending ? "Logging out..." : "Logout"}</span>
          )}
        </button>
      </div>

      {/* Mobile submenu overlay */}
      {isMobile && activeMobileItem && submenuOpen && (
        <>
          <div
            onClick={() => setSubmenuOpen(false)}
            className="fixed inset-0 bg-black/40 z-40"
          />
          <div
            className={`fixed inset-y-0 right-0 w-64 shadow-xl transform transition-transform duration-300 ease-in-out z-50
              bg-white text-slate-800
              ${submenuOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                {activeMobileItem.label}
              </h2>
              <button
                onClick={() => setSubmenuOpen(false)}
                className="text-lg font-bold text-slate-500 hover:text-slate-800"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-2">
              {activeMobileItem.subMenus?.map((menu) => (
                <button
                  key={menu.id}
                  className={`block w-full text-left p-2 rounded-lg transition-all ${isSubMenuActive(activeMobileItem, menu.id)
                    ? "text-blue-600 bg-blue-50 font-medium"
                    : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                    }`}
                  onClick={() => {
                    handleMenuClick(activeMobileItem, menu.id);
                    setSubmenuOpen(false);
                  }}
                >
                  {menu.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SideBar;
