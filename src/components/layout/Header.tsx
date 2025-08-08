import logo from '@/assets/logo.png';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="flex items-center justify-between px-8 py-6">
      <div 
        className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleLogoClick}
      >
        <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
        <span className="font-eudoxus-medium text-white text-xl tracking-wide">
          Pilotcrew.ai
        </span>
      </div>
    </header>
  );
} 