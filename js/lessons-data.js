/* Lesson content, separated from UI for easy editing.
   step: { title, text, board?: FEN (rendered statically), quiz?: { question, options[], answer (index) } }
   level: 'pemula' | 'menengah' */
(function () {
    'use strict';
    window.LESSON_DATA = [
        {
            id: 'board-basics', title: 'Kenali Papan Catur', level: 'pemula',
            description: 'Susunan papan, koordinat, dan posisi awal.',
            goal: 'Membaca koordinat kotak dan mengenal posisi awal.',
            steps: [
                { title: 'Papan 8x8', text: 'Papan catur terdiri dari 64 kotak, 8 baris (rank 1-8) dan 8 kolom (file a-h). Kotak a1 selalu berada di sudut kiri bawah dari sisi putih, dan selalu berwarna gelap.' },
                { title: 'Posisi Awal', text: 'Baris 1 dan 2 diisi bidak putih, baris 7 dan 8 bidak hitam. Di tengah baris belakang: Ratu di kotak warnanya sendiri (d1 putih, d8 hitam), Raja di sampingnya.', board: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' },
                { title: 'Koordinat', text: 'Setiap kotak punya nama seperti e4 atau g7. File ditulis huruf (a-h), rank angka (1-8). Notasi ini dipakai di seluruh dunia untuk mencatat langkah.', quiz: { question: 'Kotak mana yang berada di kanan-atas dari sudut pandang putih?', options: ['a8', 'h1', 'h8', 'a1'], answer: 2 } }
            ]
        },
        {
            id: 'piece-movement', title: 'Cara Gerak Setiap Bidak', level: 'pemula',
            description: 'Benteng, Kuda, Gajah, Menteri, Raja, dan Pion.',
            goal: 'Mengetahui gerakan dan penangkapan setiap bidak.',
            steps: [
                { title: 'Benteng (R)', text: 'Bergerak lurus horizontal atau vertikal sejauh mungkin, tidak bisa melewati bidak lain. Simbol: R.', board: '8/8/8/8/4R3/8/8/4K2k w - - 0 1' },
                { title: 'Kuda (N)', text: 'Bergerak membentuk huruf L: dua kotak lurus lalu satu kotak menyamping. Satu-satunya bidak yang bisa melompati bidak lain.', board: '7k/8/8/8/4N3/8/8/K7 w - - 0 1' },
                { title: 'Gajah (B)', text: 'Bergerak diagonal sejauh mungkin. Gajah putih-sentak (c1, f1) tidak akan pernah bertemu gajah gelap-sentak lawan.', board: '6k1/8/8/8/3B4/8/8/K7 w - - 0 1' },
                { title: 'Menteri (Q)', text: 'Kombinasi benteng dan gajah: lurus dan diagonal. Bidak terkuat di papan.', board: '6k1/8/8/8/3Q4/8/8/K7 w - - 0 1' },
                { title: 'Raja (K)', text: 'Bergerak satu kotak ke segala arah. Raja tidak boleh bergerak ke kotak yang diserang (skak).', board: '8/8/8/8/3K4/8/8/6k1 w - - 0 1' },
                { title: 'Pion (P)', text: 'Maju satu kotak ke depan, menangkap diagonal satu kotak. Dari posisi awal boleh maju dua kotak.', board: '6k1/8/8/3Pp3/8/8/8/K7 w - - 0 1' },
                { title: 'Kuis Gerakan', text: 'Pilih bidak yang bisa melompati bidak lain.', quiz: { question: 'Bidak apa yang bisa melompati bidak lain?', options: ['Benteng', 'Kuda', 'Gajah', 'Menteri'], answer: 1 } }
            ]
        },
        {
            id: 'piece-values', title: 'Nilai Relatif Bidak', level: 'pemula',
            description: 'Berapa nilai setiap bidak.',
            goal: 'Menilai pertukaran bidak secara kasar.',
            steps: [
                { title: 'Tabel Nilai', text: 'Pion = 1, Kuda = 3, Gajah = 3, Benteng = 5, Menteri = 9. Raja tidak bernilai — raja adalah permainannya.', board: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' },
                { title: 'Pertukaran Seimbang', text: 'Menteri (9) untuk dua benteng (10) hampir seimbang. Kuda untuk tiga pion sering seimbang. Gajah sedikit lebih kuat dari kuda dalam jangka panjang karena jangkauannya.' },
                { title: 'Kuis Nilai', text: 'Hitung nilai materi sebelum bertukar.', quiz: { question: 'Pertukaran apa yang paling merugikan?', options: ['Menteri untuk dua kuda + pion (10)', 'Benteng untuk gajah + pion (4)', 'Kuda untuk tiga pion (3)', 'Menteri untuk benteng + kuda + pion (9)'], answer: 1 } }
            ]
        },
        {
            id: 'check-checkmate', title: 'Skak dan Skakmat', level: 'pemula',
            description: 'Memahami ancaman, skak, dan skakmat.',
            goal: 'Mengenali kapan raja terancam dan kapan permainan berakhir.',
            steps: [
                { title: 'Skak', text: 'Raja diserang = skak. Wajib menyingkirkan ancaman: pindahkan raja, tangkap bidak penyerang, atau blokir jalurnya (tidak berlaku untuk serangan kuda atau pion).' },
                { title: 'Skakmat', text: 'Skak dan tidak ada cara menyelamatkan raja = skakmat, permainan selesai.', board: '6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1' },
                { title: 'Contoh Skakmat', text: 'Pada papan contoh, putih mematikan dengan Re8# — raja hitam terkurung oleh pionnya sendiri di baris belakang.' },
                { title: 'Kuis', text: 'Perhatikan papan contoh di langkah sebelumnya.', quiz: { question: 'Mengapa raja hitam tidak bisa ke f7 setelah Re8#?', options: ['Karena f7 terserang benteng', 'Karena f7 terserang raja putih', 'Karena pion hitam menghalangi', 'Karena f7 di luar papan'], answer: 1 } }
            ]
        },
        {
            id: 'castling', title: 'Castling (Rokade)', level: 'pemula',
            description: 'Langkah khusus untuk keamanan raja.',
            goal: 'Mengetahui syarat dan cara rokade.',
            steps: [
                { title: 'Apa itu Rokade', text: 'Raja bergerak dua kotak ke arah benteng, lalu benteng melompat ke sisi raja. Rokade pendek: O-O (raja ke g1/g8). Rokade panjang: O-O-O (raja ke c1/c8).' },
                { title: 'Syarat Rokade', text: '1) Raja dan benteng belum pernah bergerak. 2) Tidak ada bidak di antara keduanya. 3) Raja tidak sedang skak. 4) Raja tidak melewati atau berakhir di kotak yang diserang.', board: 'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1' },
                { title: 'Kapan Rokade', text: 'Hampir selalu lakukan rokade di pembukaan — raja aman, benteng aktif ke tengah.', quiz: { question: 'Manakah yang MEMUNGKINKAN rokade?', options: ['Raja sudah pernah bergerak lalu kembali', 'Ada bidak di antara raja dan benteng', 'Raja tidak dalam skak dan jalurnya aman', 'Benteng sedang diserang'], answer: 2 } }
            ]
        },
        {
            id: 'en-passant', title: 'En Passant', level: 'pemula',
            description: 'Tangkapan khusus pion.',
            goal: 'Mengenali dan memakai en passant.',
            steps: [
                { title: 'Aturannya', text: 'Jika pion lawan maju dua kotak dari posisi awal dan mendarat di samping pionmu, kamu boleh menangkapnya seolah hanya maju satu kotak. Hanya bisa dilakukan LANGSUNG setelah langkah itu.', board: 'rnbqkbnr/ppp1p1pp/8/3pPp2/8/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 3' },
                { title: 'Contoh', text: 'Pada papan: pion putih e5, hitam baru memainkan ...f5. Putih dapat exf6 e.p. — pion hitam f5 tertangkap dan pion putih berakhir di f6.' },
                { title: 'Kuis', text: 'En passant hanya legal kapan?', quiz: { question: 'Kapan tangkapan en passat boleh dilakukan?', options: ['Kapan saja selama pion bersebelahan', 'Hanya langsung setelah pion lawan maju dua kotak', 'Hanya di pembukaan', 'Hanya jika membawa skak'], answer: 1 } }
            ]
        },
        {
            id: 'promotion', title: 'Promosi Pion', level: 'pemula',
            description: 'Pion yang sampai ke baris terakhir.',
            goal: 'Memahami pilihan promosi.',
            steps: [
                { title: 'Aturan', text: 'Pion yang mencapai baris terakhir (rank 8 untuk putih, rank 1 untuk hitam) wajib dipromosikan menjadi Menteri, Benteng, Gajah, atau Kuda — bidak yang sama warnanya.' },
                { title: 'Promosi Umum vs. Bawah', text: 'Hampir selalu pilih Menteri (terkuat). Promosi "bawah" (kuda/gajah/benteng) kadang lebih baik, misalnya kuda promosi yang langsung memberi skak (fork) tak terduga.' },
                { title: 'Kuis', text: '', quiz: { question: 'Promosi apa yang hampir selalu terbaik?', options: ['Kuda', 'Gajah', 'Menteri', 'Benteng'], answer: 2 } }
            ]
        },
        {
            id: 'opening-principles', title: 'Prinsip Pembukaan', level: 'menengah',
            description: 'Tiga prinsip emas pembukaan.',
            goal: 'Memulai permainan dengan benar.',
            steps: [
                { title: 'Prinsip 1: Kuasai Pusat', text: 'Gerakkan pion ke e4/d4 (atau c4). Bidak di pusat mengontrol lebih banyak kotak dan memberi ruang gerak.', board: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1' },
                { title: 'Prinsip 2: Kembangkan Perwira', text: 'Keluarkan kuda dan gajah, jangan memindahkan bidak yang sama berkali-kali, dan jangan keluarkan menteri terlalu dulu karena akan dikejar bidak lawan.' },
                { title: 'Prinsip 3: Rokade Cepat', text: 'Amankan raja sebelum melakukan rencana lain. Rokade menghubungkan benteng dan menjauhkan raja dari pusat yang akan dibuka.' },
                { title: 'Kuis', text: 'Ingat tiga prinsip: pusat, perkembangan, keamanan raja.', quiz: { question: 'Langkah pembukaan putih mana yang paling principled?', options: ['a4 lalu Ra3', 'e4 lalu Nf3', 'h4 lalu Rh3', 'Na3 lalu Nc4'], answer: 1 } }
            ]
        },
        {
            id: 'center-control', title: 'Kontrol Pusat', level: 'menengah',
            description: 'Mengapa e4, d4, e5, d5 begitu penting.',
            goal: 'Menilai kontrol pusat dari sebuah posisi.',
            steps: [
                { title: 'Kotak Pusat', text: 'e4, d4, e5, d5 adalah pusat. Pion di pusat menyerang kuat dan membuka jalur bagi perwira.', board: 'rnbqkbnr/ppp1pppp/8/3p4/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2' },
                { title: 'Kontrol vs. Okupasi', text: 'Kamu bisa mengontrol pusat tanpa pion di sana: bidak yang menyerang kotak pusat sudah cukup (contoh: permainan hipermodern dengan g3, Bg2).' },
                { title: 'Kuis', text: '', quiz: { question: 'Berapa kotak "pusat" dalam catur?', options: ['2', '4', '8', '16'], answer: 1 } }
            ]
        },
        {
            id: 'development', title: 'Pengembangan Bidak', level: 'menengah',
            description: 'Tempat terbaik untuk kuda dan gajah.',
            goal: 'Mengembangkan perwira dengan efisien.',
            steps: [
                { title: 'Kuda dulu, biasanya', text: 'Kuda f3/c3 (putih) menyerang pusat dan melindungi e4/d4. Hindari kuda di tepi — "kuda di tepi membuat permainan terpinggirkan".' },
                { title: 'Gajah Aktif', text: 'Gajah keluar ke c4, g5, atau f4 sebelum memutuskan struktur pion, karena pionmu menentukan gajahmu baik atau buruk (gajah buruk = terblokir pion sendiri).' },
                { title: 'Jangan Serbu Dini', text: 'Keluar menteri terlalu awal membuang tempo. Contoh klasik: 1.e4 e5 2.Qh5?! (tersedia di mode Puzzle sebagai Scholar\'s Mate — pelajari mengapa hitam bisa menghukumnya).' },
                { title: 'Kuis', text: '', quiz: { question: 'Kenapa kuda di tepi (a3/h3) lemah?', options: ['Warnanya salah', 'Hanya mengontrol sedikit kotak', 'Tidak bisa menangkap', 'Bergerak lebih lambat'], answer: 1 } }
            ]
        },
        {
            id: 'king-safety', title: 'Keamanan Raja', level: 'menengah',
            description: 'Raja yang terbuka adalah raja yang mati.',
            goal: 'Mengenali raja tidak aman dan cara mengamankannya.',
            steps: [
                { title: 'Tanda Bahaya', text: 'Raja di tengah, tidak bisa rokade, pion di depan raja terbuka, atau lawan punya menteri/benteng yang mengarah ke raja — semua itu sinyal serangan.', board: 'r1bq1b1r/pppk1ppp/8/4N3/8/8/PPPP1PPP/RNBQKB1R b KQkq - 0 1' },
                { title: 'Cara Mengamankan', text: 'Rokade, jaga pion di depan raja (f2/g2/h2 jangan digerakkan sembarangan), dan tukar perwira penyerang lawan.' },
                { title: 'Kuis', text: '', quiz: { question: 'Posisi raja mana yang paling aman?', options: ['Di tengah setelah pion e dan f digerakkan', 'Rokade pendek dengan pion f/g/h utuh', 'Di tengah dengan rokade hilang', 'Di pojok tanpa perlindungan'], answer: 1 } }
            ]
        },
        {
            id: 'tactics-1', title: 'Taktik Dasar: Fork, Pin, Skewer', level: 'menengah',
            description: 'Tiga pola serangan ganda paling penting.',
            goal: 'Mengenali fork, pin, dan skewer di posisi nyata.',
            steps: [
                { title: 'Fork (Serangan Ganda)', text: 'Satu bidak menyerang dua bidak sekaligus. Kuda adalah spesialis fork. Contoh terkenal: kuda yang menyerang raja dan menteri sekaligus.', board: '3q1rk1/ppp2ppp/8/3N4/8/8/PPP2PPP/R2Q1RK1 w - - 0 1' },
                { title: 'Pin (Jepit)', text: 'Bidak tidak bisa bergerak tanpa membahayakan bidak bernilai lebih di belakangnya. Pin absolut: bidak sama sekali tidak bisa bergerak (biasanya ke raja).', board: '4r1k1/8/8/8/8/4R3/8/4K3 w - - 0 1' },
                { title: 'Skewer (Tusuk)', text: 'Seperti pin terbalik: bidak bernilai tinggi dipaksa mundur, bidak di belakangnya jatuh. Umum dengan menteri/benteng di baris terbuka.' },
                { title: 'Kuis', text: 'Perhatikan papan fork pada langkah pertama.', quiz: { question: 'Pada papan contoh, langkah apa yang memenangkan menteri hitam?', options: ['Nf6+', 'Ne7+', 'Nxc7', 'Nb6'], answer: 1 } }
            ]
        },
        {
            id: 'tactics-2', title: 'Taktik Lanjutan', level: 'menengah',
            description: 'Discovered attack, double attack, removal of defender, back-rank.',
            goal: 'Memperluas repertoar pola taktis.',
            steps: [
                { title: 'Discovered Attack', text: 'Bidak bergerak membuka jalur serangan bidak di belakangnya. Sangat kuat karena lawan menghadapi dua ancaman sekaligus.' },
                { title: 'Double Attack & Removal of Defender', text: 'Satu langkah menciptakan dua ancaman yang tak bisa keduanya dijawab. Removal of defender: menyingkirkan bidak yang menjaga bidak lain, lalu menangkap yang tak terlindungi.' },
                { title: 'Back-Rank Mate', text: 'Raja terkurung pionnya sendiri di baris belakang, dibedil benteng/menteri. Kuncinya: memaksa atau meniadakan perlindungan.', board: '6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'Back-rank mate paling sering terjadi karena apa?', options: ['Raja di pojok tanpa benteng', 'Pion f7/g7/h7 menghalangi raja', 'Menteri terlalu dekat', 'Benteng lawan hilang'], answer: 1 } }
            ]
        },
        {
            id: 'endgame-basics', title: 'Endgame Dasar', level: 'menengah',
            description: 'Teknik mat dasar dan oposisi.',
            goal: 'Menutup permainan yang menang dan menyelamatkan yang remis.',
            steps: [
                { title: 'K+M vs K', text: 'Gunakan menteri dan raja bersama-sama: kurungi raja lawan dengan menteri (jaga jarak satu kotak), raja mendekat, lalu matikan di tepi.', board: '7k/8/5K2/8/8/8/8/3Q4 w - - 0 1' },
                { title: 'K+R vs K', text: 'Benteng memotong raja lawan per baris, raja sendiri mengiring. Contoh: 1.Kf6 Kf8 2.Ra8# ada di mode Puzzle (Two Rooks Mate).', board: '6k1/8/6K1/8/8/8/8/R6R w - - 0 1' },
                { title: 'Oposisi', text: 'Raja berhadapan dengan satu kotak di antaranya. Oposisi adalah senjata kunci untuk memaksa kemajuan pion di endgame raja vs raja.' },
                { title: 'Promosi Pion di Endgame', text: 'Pion lepas (tidak bisa dihadang raja lawan) biasanya menang. Hitung kotak: raja lawan harus berada dalam "kotak" pion untuk menangkapnya.' },
                { title: 'Kuis', text: '', quiz: { question: 'Mengapa K+Q vs K lebih mudah dari K+R vs K?', options: ['Menteri bergerak lebih pelan', 'Menteri bisa mengontrol baris dan diagonal sekaligus', 'Benteng bisa matikan sendiri', 'Tidak ada bedanya'], answer: 1 } }
            ]
        },
        {
            id: 'beginner-mistakes', title: 'Kesalahan Umum Pemula', level: 'pemula',
            description: 'Hindari jebakan paling umum.',
            goal: 'Mengurangi blunder sistematis.',
            steps: [
                { title: 'Blunder Materi', text: 'Sebelum setiap langkah, cek: "apakah bidak yang saya tinggalkan/gerakkan bisa ditangkap?" dan "apakah langkah lawan terakhir mengancam sesuatu?"', board: 'rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 3' },
                { title: 'Lupa Skakmat Baris Belakang', text: 'Jangan biarkan raja di tengah dengan pion f/g/h utuh tapi tanpa pelarian — cek selalu jalur e-file dan baris 8.' },
                { title: 'Terlalu Banyak Langkah Pion', text: 'Setiap langkah pion adalah komitmen permanen. Pion lemah di belakang menjadi target seumur hidup.' },
                { title: 'Kuis', text: '', quiz: { question: 'Kebiasaan apa yang paling mengurangi blunder?', options: ['Bergerak cepat', 'Selalu memeriksa ancaman sebelum langkah', 'Memainkan langkah yang sama', 'Mengabaikan langkah lawan'], answer: 1 } }
            ]
        }
    ];
})();
