"use client";

import Link from "next/link";
import Image from "next/image";

import { useState } from "react";
import {
  BoxIcon,
  Contact,
  HeartPlusIcon,
  HeartIcon,
  HomeIcon,
  Menu,
  PlusIcon,
  ShoppingCart,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import Search from "./Search";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Read cart from Redux state
  const reduxCart = useSelector((state) => state.cart);

  // Compute total quantity from Redux cart items
  const cartQuantity = reduxCart.reduce((total, item) => total + item.quantity, 0);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-gray-800 text-white shadow-md ">
      <div className=" mx-auto flex justify-center items-center  ">
        {/* Mobile Header */}

        <div className="flex justify-between items-center w-full md:hidden  ">
          {pathname === "/" ? <Link href="/"><Image src="/logo.png" width={120} height={20} alt="KartEnity" className="invisible md:hidden "></Image> </Link> :  <Link href="/"><Image src="/logo.png" width={120} height={20} alt="KartEnity" className="visible mx-2"></Image> </Link>}

          <div className="flex gap-3 p-3 right-0 items-center">
            {/* WISHLIST ICON  */}
            <Link href="/pages/wishlist"><HeartIcon /></Link>
            {/* CART ICON */}
            <Link
              href="/pages/cart"
              className="flex bg-gray-600 px-2 py-2 rounded-full items-center text-md font-md gap-1 text-white">
              <ShoppingCart size={22} />
              {cartQuantity?    <p className=" rounded-full px-2">{cartQuantity}</p> : ""}
            </Link>
              
              <span onClick={toggleMenu} aria-label="Toggle Menu" className="p-1 mx-2  rounded border-none">
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </span>
            </div>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center p-4  ">

        <div className="links flex gap-6">
          <NavLink href="/" icon={<HomeIcon size={18} />} label="Home" />
          <NavLink
            href="/pages/cart"
            icon={<ShoppingCart size={20} />}
            label="Cart"
            badge={cartQuantity}
          />
          <NavLink href="/pages/contact" icon={<Contact size={18} />} label="Contact" />
          <NavLink href="/pages/orders" icon={<BoxIcon size={18} />} label="Orders" />
          <NavLink href="/pages/Dashboard" icon={<PlusIcon size={18} />} label="Dashboard" />
            <NavLink href="/pages/wishlist" icon={<HeartPlusIcon size={18} />} label="wishlist" />
            </div>
        </ul>

        {/* Desktop Search */}
        <div className="hidden md:flex mx-6">{pathname !== "/" && <Search />}</div>
      </div>

      {/* Mobile Dropdown */}
    

      {isOpen && (
        <div className="md:hidden mt-3 space-y-3 p-3">
          {pathname !== "/" && (
            <div className="px-3">
              <Search />
            </div>
          )}
          <MobileLink href="/" label="Home" onClick={closeMenu} />
          <MobileLink href="/pages/contact" label="Contact" onClick={closeMenu} />
          <MobileLink href="/pages/orders" label="Orders" onClick={closeMenu} />
          <MobileLink href="/pages/Dashboard" label="Dashboard" onClick={closeMenu} />
         
        </div>
      )}
    </nav>
  );
}

// === Reusable Desktop Nav Link ===
function NavLink({ href, icon, label, badge }) {
  return (
    <li className="relative">
      <Link
        href={href}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 transition"
      >
        {icon}
        <span className="text-sm font-medium">{label}</span>
        {badge > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </Link>
    </li>
  );
}

// === Reusable Mobile Nav Link ===
function MobileLink({ href, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-md text-white transition text-base"
    >
      {label}
    </Link>
  );
}
