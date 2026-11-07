interface WelcomeHeroProps {
  name?: string;
}

export function WelcomeHero({ name }: WelcomeHeroProps) {
  return (
    <div className="text-center py-4 md:py-6 px-4 flex-shrink-0">
      <h1 className="text-xl md:text-2xl font-bold text-ink mb-1">
        {name ? `Halo, ${name}!` : 'Halo! Apa yang ingin kamu lakukan hari ini?'}
      </h1>
      <p className="text-ink-soft text-base">
        {name
          ? 'Kak Ambis siap melanjutkan sesi belajarmu hari ini.'
          : 'Pilih fitur atau langsung ketik pesan di bawah'}
      </p>
    </div>
  );
}
