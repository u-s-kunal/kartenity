"use client";

import Link from "next/link";
import { useState } from "react";
import {useSelector} from "react-redux"
import { Menu, X } from "lucide-react";
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
const cartQuantity = useSelector((state) => state.cart.quantity);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-gray-700 text-white shadow-md   p-0 md:py-4 ">
      <div className="   mx-auto flex justify-between  ">
        <div className="md:hidden flex items-center w-full ml-2 justify-between px-2   shadow sticky top-0 z-50">
          <Link
            href="/"
            className="flex items-center text-xl font-extrabold text-white"
          >
            <span>KartEnity</span> <ShoppingCart size={18} />
          </Link>

          <button
            aria-label="Toggle Menu"
            className="outline-none"
            onClick={toggleMenu}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        <ul className="hidden md:flex space-x-8 items-center  ">
          <Link
            href="/"
            className="gap-x-1 text-xl flex font-bold  px-3 py-1 rounded-2xl "
          >
            <span>KartEnity</span> <ShoppingCart size={18} />
          </Link>
          <li>
            <Link href="/">Home</Link>
          </li>

          <li>
            <Link href="/pages/cart">Cart</Link> <span>{cartQuantity}</span>
          </li>
          <li>
            <Link href="/pages/contact" onClick={closeMenu}>
              Contact us
            </Link>
          </li>
          <li>
            <Link href="/pages/productForm" onClick={closeMenu}>
              Add Products
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile Dropdown */}

      {isOpen && (
        <ul className="md:hidden flex flex-col space-y-2 mt-3 ml-1">
          <li>
            {" "}
            <form className=" ">
              <input
                type="text"
                placeholder="Search products..."
                className=" rounded-l-md text-black bg-amber-50 "
              />
              <button
                type="submit"
                className="bg-gray-800  rounded-r-md hover:bg-gray-400 border-none"
              >
                Search
              </button>
            </form>
          </li>

          <li className="p-3 hover:bg-gray-400">
            <Link href="/" onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li className="p-3 hover:bg-gray-400">
            <Link href="/pages/cart" onClick={closeMenu}>
              Cart
            </Link>
          </li>
          <li className="p-3 hover:bg-gray-400">
            <Link href="/pages/contact" onClick={closeMenu}>
              Contact us
            </Link>
          </li>
          <li className="p-3 hover:bg-gray-400">
            <Link href="/pages/productForm" onClick={closeMenu}>
              Add Products
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
