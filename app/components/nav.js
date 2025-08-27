import Link from "next/link";
import React from "react";

const Nav = () => {
  return (
    <nav className="sticky top-4 z-50 w-full flex justify-center">
      <div
        className="flex items-center gap-12 px-8 py-3 rounded-2xl shadow-lg 
                   bg-white/10 backdrop-blur-xl border border-white/20 
                   text-white font-semibold text-lg"
      >
        <Link href="/">
          <span className="cursor-pointer hover:text-cyan-400 transition-colors duration-200">
            🖼️ Image Section
          </span>
        </Link>

        <Link href="/textsection">
          <span className="cursor-pointer hover:text-pink-400 transition-colors duration-200">
            📝 Text Section
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
