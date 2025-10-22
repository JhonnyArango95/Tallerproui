export function BrandLogos() {
  return (
    <div className="grid grid-cols-4 gap-8 items-center">
      {/* Nissan */}
      <div className="flex flex-col items-center gap-2">
        <svg viewBox="0 0 120 120" className="w-16 h-16">
          <circle cx="60" cy="60" r="55" fill="none" stroke="#000" strokeWidth="2" />
          <text x="60" y="75" textAnchor="middle" fontSize="20" fontFamily="Arial, sans-serif" fontWeight="bold">NISSAN</text>
        </svg>
      </div>

      {/* Honda */}
      <div className="flex flex-col items-center gap-2">
        <svg viewBox="0 0 120 50" className="w-20 h-12">
          <path d="M10,40 L10,10 L20,10 L20,20 L35,20 L35,10 L45,10 L45,40 L35,40 L35,30 L20,30 L20,40 Z" fill="#E40521" />
          <rect x="50" y="10" width="10" height="30" rx="5" fill="#E40521" />
          <path d="M65,10 L75,10 L90,25 L90,10 L100,10 L100,40 L90,40 L75,25 L75,40 L65,40 Z" fill="#E40521" />
          <path d="M105,10 L125,10 Q130,10 130,15 L130,35 Q130,40 125,40 L105,40 Q100,40 100,35 L100,15 Q100,10 105,10" fill="#E40521" />
        </svg>
        <span className="text-[#E40521] tracking-wider">HONDA</span>
      </div>

      {/* Chevrolet */}
      <div className="flex flex-col items-center gap-2">
        <svg viewBox="0 0 100 80" className="w-20 h-16">
          <path d="M50,10 L70,30 L50,50 L30,30 Z" fill="#FDB913" stroke="#000" strokeWidth="2" />
          <path d="M10,30 L30,30 L50,50 L30,50 Z" fill="#FDB913" stroke="#000" strokeWidth="2" />
          <path d="M70,30 L90,30 L70,50 L50,50 Z" fill="#FDB913" stroke="#000" strokeWidth="2" />
        </svg>
        <span className="text-[#FDB913] tracking-wider">CHEVROLET</span>
      </div>

      {/* Subaru */}
      <div className="flex flex-col items-center gap-2">
        <svg viewBox="0 0 120 60" className="w-20 h-12">
          <ellipse cx="60" cy="30" rx="55" ry="25" fill="#003C7F" />
          <circle cx="35" cy="30" r="5" fill="white" />
          <circle cx="50" cy="20" r="5" fill="white" />
          <circle cx="50" cy="40" r="5" fill="white" />
          <circle cx="70" cy="20" r="5" fill="white" />
          <circle cx="70" cy="40" r="5" fill="white" />
          <circle cx="85" cy="30" r="5" fill="white" />
        </svg>
        <span className="text-[#003C7F] tracking-wider">SUBARU</span>
      </div>

      {/* Toyota */}
      <div className="flex flex-col items-center gap-2">
        <svg viewBox="0 0 100 60" className="w-20 h-12">
          <ellipse cx="50" cy="30" rx="30" ry="20" fill="none" stroke="#EB0A1E" strokeWidth="3" />
          <ellipse cx="50" cy="30" rx="45" ry="25" fill="none" stroke="#EB0A1E" strokeWidth="3" />
          <ellipse cx="50" cy="30" rx="20" ry="28" fill="none" stroke="#EB0A1E" strokeWidth="3" />
        </svg>
        <span className="text-[#EB0A1E] tracking-wider">TOYOTA</span>
      </div>

      {/* Hyundai */}
      <div className="flex flex-col items-center gap-2">
        <svg viewBox="0 0 100 60" className="w-20 h-12">
          <ellipse cx="50" cy="30" rx="40" ry="25" fill="none" stroke="#002C5F" strokeWidth="3" />
          <path d="M25,30 Q25,20 35,15 Q45,10 50,10 Q55,10 65,15 Q75,20 75,30" fill="none" stroke="#002C5F" strokeWidth="3" />
          <path d="M25,30 Q25,40 35,45 Q45,50 50,50 Q55,50 65,45 Q75,40 75,30" fill="none" stroke="#002C5F" strokeWidth="3" />
        </svg>
        <span className="text-[#002C5F] tracking-wider">HYUNDAI</span>
      </div>

      {/* Renault */}
      <div className="flex flex-col items-center gap-2">
        <svg viewBox="0 0 100 100" className="w-16 h-16">
          <path d="M50,10 L85,50 L50,90 L15,50 Z" fill="none" stroke="#FFCC33" strokeWidth="3" />
          <path d="M50,30 L70,50 L50,70 L50,30" fill="#FFCC33" />
        </svg>
        <span className="text-gray-700 tracking-wider">RENAULT</span>
      </div>

      {/* KIA */}
      <div className="flex flex-col items-center gap-2">
        <svg viewBox="0 0 120 50" className="w-20 h-10">
          <ellipse cx="60" cy="25" rx="55" ry="20" fill="none" stroke="#BB162B" strokeWidth="2" />
          <text x="60" y="32" textAnchor="middle" fontSize="24" fontFamily="Arial, sans-serif" fontWeight="bold" fill="#BB162B">KIA</text>
        </svg>
      </div>
    </div>
  );
}
