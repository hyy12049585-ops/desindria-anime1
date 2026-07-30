// src/components/Filter/PopularAnime.tsx

const POPULAR = [
  { title: 'Attack on Titan', image: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg', slug: 'attack-on-titan' },
  { title: 'Demon Slayer', image: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg', slug: 'demon-slayer' },
  { title: 'Jujutsu Kaisen', image: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg', slug: 'jujutsu-kaisen' },
  { title: 'One Piece', image: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg', slug: 'one-piece' },
  { title: 'Naruto', image: 'https://cdn.myanimelist.net/images/anime/13/17405.jpg', slug: 'naruto' },
  { title: 'Chainsaw Man', image: 'https://cdn.myanimelist.net/images/anime/1806/126216.jpg', slug: 'chainsaw-man' },
];

export function PopularAnime() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {POPULAR.map(anime => (
        <button
          key={anime.slug}
          className="group relative aspect-[3/4] rounded-lg overflow-hidden border border-[#2a2a35] hover:border-purple-500/40 transition-all duration-200 hover:scale-105"
          onClick={() => {
            // TODO: navigate to anime page
            console.log('Navigate to:', anime.slug);
          }}
        >
          <img
            src={anime.image}
            alt={anime.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <span className="absolute bottom-1.5 inset-x-1.5 text-[9px] font-semibold text-white/90 text-center leading-tight line-clamp-2">
            {anime.title}
          </span>
        </button>
      ))}
    </div>
  );
}
