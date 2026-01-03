// src/components/Header.jsx
export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50">
      <div className="h-full bg-gradient-to-r from-pink-500 via-orange-400 to-red-500 shadow-lg flex items-center justify-between px-6">
        {/* Brand */}
        <h1 className="text-xl font-extrabold text-white tracking-wide">
          Cravio
        </h1>

        {/* Tagline */}
        <span className="text-sm text-white/90 font-medium">
          Delivering Happiness 🍔
        </span>
      </div>
    </header>
  );
}
