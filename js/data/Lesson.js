export const LESSONS = [
  {
    id: 'board-basics',
    title: 'Dasar-dasar Papan Catur',
    level: 'beginner',
    description: 'Mengenal papan, baris, kolom, dan notasi.',
    content: [
      { html: '<p>Papan catur memiliki 64 kotak: 8 baris (rank 1–8) dan 8 kolom (file a–h). Papan selalu diletakkan dengan kotak putih di sudut kanan bawah.</p>' },
      { html: '<p>Notasi setiap kotak adalah kombinasi file + rank, misalnya <strong>e4</strong>, <strong>d5</strong>.</p>', fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' },
    ],
  },
  {
    id: 'piece-movement',
    title: 'Cara Gerak Bidak',
    level: 'beginner',
    description: 'Bidak, kuda, menteri, benteng, ratu, dan raja.',
    content: [
      { html: '<p><strong>Pion</strong> maju satu kotak (dua kotak dari posisi awal), menangkap diagonal.</p>' },
      { html: '<p><strong>Kuda</strong> bergerak pola L: dua kotak satu arah, satu kotak tegak lurus.</p>', fen: '8/8/8/3N4/8/8/8/8 w - - 0 1' },
      { html: '<p><strong>Menteri</strong> bergerak diagonal tanpa batas.</p>', fen: '8/8/8/3B4/8/8/8/8 w - - 0 1' },
      { html: '<p><strong>Benteng</strong> bergerak horizontal/vertikal tanpa batas.</p>', fen: '8/8/8/3R4/8/8/8/8 w - - 0 1' },
      { html: '<p><strong>Ratu</strong> menggabungkan gerakan benteng dan menteri.</p>', fen: '8/8/8/3Q4/8/8/8/8 w - - 0 1' },
      { html: '<p><strong>Raja</strong> bergerak satu kotak ke segala arah.</p>', fen: '8/8/8/3K4/8/8/8/8 w - - 0 1' },
    ],
  },
  {
    id: 'check-checkmate',
    title: 'Check dan Checkmate',
    level: 'beginner',
    description: 'Raja dalam bahaya dan cara mengakhirinya.',
    content: [
      { html: '<p><strong>Check</strong> terjadi ketika raja diserang. Raja harus diselamatkan: bergerak, memblokir, atau menangkap penyerang.</p>' },
      { html: '<p><strong>Checkmate</strong> terjadi ketika raja tidak punya langkah legal untuk keluar dari check.</p>', fen: '6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1' },
    ],
  },
  {
    id: 'tactics-fork',
    title: 'Taktik: Fork',
    level: 'intermediate',
    description: 'Menyerang dua bidak sekaligus dengan satu langkah.',
    content: [
      { html: '<p><strong>Fork</strong> adalah serangan yang mengancam dua atau lebih bidak lawan sekaligus. Kuda adalah bidak fork terbaik.</p>' },
      { html: '<p>Contoh: kuda di <strong>e5</strong> memfork raja di <strong>g6</strong> dan ratu di <strong>d7</strong>.</p>', fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4' },
    ],
  },
  {
    id: 'endgame-kq-vs-k',
    title: 'Endgame: Raja + Ratu vs Raja',
    level: 'intermediate',
    description: 'Teknik dasar mengskakmat dengan ratu.',
    content: [
      { html: '<p>Dengan raja dan ratu, Anda bisa memaksa raja lawan ke tepi papan. Gunakan ratu untuk membatasi gerak, lalu dekatkan raja Anda.</p>', fen: '8/8/8/4k3/8/8/8/4K2Q w - - 0 1' },
    ],
  },
];
