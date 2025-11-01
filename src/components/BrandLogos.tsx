export function BrandLogos() {
  const brands = [
    { name: 'Nissan', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Nissan_logo.svg' },
    { name: 'Honda', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Honda_Logo.svg' },
    { name: 'Chevrolet', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Chevrolet-logo.svg' },
    { name: 'Subaru', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Subaru_logo.svg' },
    { name: 'Toyota', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Toyota.svg' },
    { name: 'Hyundai', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Hyundai_Motor_Company_logo.svg' },
    { name: 'Renault', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Renault_2021.svg' },
    { name: 'KIA', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/KIA_logo.svg' },
  ];

  return (
    <div className="grid grid-cols-4 gap-6 items-center">
      {brands.map((brand) => (
        <div
          key={brand.name}
          className="flex items-center justify-center p-3 grayscale hover:grayscale-0 transition-all"
        >
          <img
            src={brand.logo}
            alt={brand.name}
            className="max-h-12 w-auto object-contain"
          />
        </div>
      ))}
    </div>
  );
}
