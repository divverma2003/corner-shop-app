import { UserButton } from "@clerk/clerk-react";
import { useLocation } from "react-router";

import {
  ClipboardListIcon,
  HomeIcon,
  PanelLeftIcon,
  ShoppingBagIcon,
  UsersIcon,
} from "lucide-react";

export const NAVIGATION = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <HomeIcon className="size-5" />,
  },
  {
    name: "Products",
    path: "/products",
    icon: <ShoppingBagIcon className="size-5" />,
  },

  {
    name: "Orders",
    path: "/orders",
    icon: <ClipboardListIcon className="size-5" />,
  },
  {
    name: "Customers",
    path: "/customers",
    icon: <UsersIcon className="size-5" />,
  },
];

const Navbar = () => {
  // to get the current path
  const location = useLocation();

  return (
    <div className="navbar w-full bg-base-300">
      {/* button to open sidebar on small screens */}
      <label
        htmlFor="my-drawer"
        className="btn btn-square btn-ghost"
        aria-label="open sidebar"
      >
        <PanelLeftIcon className="size-5" />
      </label>
      {/* dynamic title based on the current path */}
      <div className="flex-1 px-4">
        <h1 className="text-xl font-bold">
          {NAVIGATION.find((item) => item.path === location.pathname)?.name ||
            "Dashboard"}
        </h1>
      </div>
      {/* user button on the right side */}
      <div className="mr-5">
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
