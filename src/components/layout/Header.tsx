import logo from '@/assets/logo.png';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-6">
      <div className="flex items-center gap-1">
        <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
        <span className="font-eudoxus-medium text-white text-xl tracking-wide">
          Pilotcrew.ai
        </span>
      </div>
    </header>
  );
} 