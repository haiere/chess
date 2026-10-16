// lessons.js
// A complete chess curriculum: 50 lessons from beginner to advanced.

export const LESSONS = [
  // ─────────────────────────────────────────────
  // BEGINNER
  // ─────────────────────────────────────────────
  {
    id: 'board-basics',
    title: 'Board Basics',
    level: 'beginner',
    description: 'Discover the board, ranks, files, and orientation.',
    content: [
      { html: '<p>The chessboard has <strong>64 squares</strong>: 8 rows (ranks) and 8 columns (files). Always place the board so a <strong>light square</strong> sits in the bottom-right corner.</p>' },
      { html: '<p>Each square has a name: file letter + rank number — for example <strong>e4</strong>, <strong>d5</strong>, <strong>h1</strong>.</p>', fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' },
    ],
  },
  {
    id: 'files-ranks-diagonals',
    title: 'Files, Ranks, and Diagonals',
    level: 'beginner',
    description: 'Learn how pieces travel along lines of the board.',
    content: [
      { html: '<p>A <strong>file</strong> runs vertically (a–h), a <strong>rank</strong> runs horizontally (1–8), and a <strong>diagonal</strong> runs at a 45° angle.</p>' },
      { html: '<p>Every square lies on exactly one file, one rank, and two diagonals.</p>', fen: '8/8/8/8/8/8/8/8 w - - 0 1' },
    ],
  },
  {
    id: 'chess-notation',
    title: 'Chess Notation',
    level: 'beginner',
    description: 'Read and write moves using algebraic notation.',
    content: [
      { html: '<p>Each move is written as <em>piece + destination</em>. Example: <strong>Nf3</strong> means a knight moves to f3. Pawn moves omit the letter: <strong>e4</strong>.</p>' },
      { html: '<p>Special symbols: <strong>x</strong> (capture), <strong>+</strong> (check), <strong>#</strong> (checkmate), <strong>O-O</strong> (kingside castling), <strong>O-O-O</strong> (queenside castling).</p>' },
    ],
  },
  {
    id: 'pawn-movement',
    title: 'The Pawn',
    level: 'beginner',
    description: 'The soul of chess moves forward only.',
    content: [
      { html: '<p>Pawns move <strong>one square forward</strong>, or two squares from their starting rank. They capture <strong>diagonally</strong>, never straight ahead.</p>' },
      { html: '<p>Pawns cannot move backward. A blocked pawn is stuck until it can capture.</p>', fen: '8/8/8/8/3P4/8/8/8 w - - 0 1' },
    ],
  },
  {
    id: 'knight-movement',
    title: 'The Knight',
    level: 'beginner',
    description: 'The only piece that can jump over others.',
    content: [
      { html: '<p>The knight moves in an <strong>L-shape</strong>: two squares in one direction, then one square perpendicular. It always lands on the opposite color square.</p>' },
      { html: '<p>Centralized knights are powerful; rim knights are weak.</p>', fen: '8/8/8/3N4/8/8/8/8 w - - 0 1' },
    ],
  },
  {
    id: 'bishop-movement',
    title: 'The Bishop',
    level: 'beginner',
    description: 'A long-range piece bound to one color.',
    content: [
      { html: '<p>The bishop slides any number of squares <strong>diagonally</strong>. Each bishop stays forever on its own color square.</p>' },
      { html: '<p>A bishop pair is a strong long-term asset.</p>', fen: '8/8/8/3B4/8/8/8/8 w - - 0 1' },
    ],
  },
  {
    id: 'rook-movement',
    title: 'The Rook',
    level: 'beginner',
    description: 'Straight lines, heavy power.',
    content: [
      { html: '<p>The rook moves any number of squares <strong>horizontally or vertically</strong>. It is worth about 5 pawns.</p>' },
      { html: '<p>Rooks love <strong>open files</strong> — files with no pawns.</p>', fen: '8/8/8/3R4/8/8/8/8 w - - 0 1' },
    ],
  },
  {
    id: 'queen-movement',
    title: 'The Queen',
    level: 'beginner',
    description: 'The most powerful piece on the board.',
    content: [
      { html: '<p>The queen combines the moves of the <strong>rook</strong> and <strong>bishop</strong>: any number of squares in any straight line.</p>' },
      { html: '<p>Worth around 9 pawns — never trade her cheaply.</p>', fen: '8/8/8/3Q4/8/8/8/8 w - - 0 1' },
    ],
  },
  {
    id: 'king-movement',
    title: 'The King',
    level: 'beginner',
    description: 'Slow, but the most important piece.',
    content: [
      { html: '<p>The king moves exactly <strong>one square</strong> in any direction. It can never move into check.</p>' },
      { html: '<p>In the endgame the king becomes a strong fighting piece.</p>', fen: '8/8/8/3K4/8/8/8/8 w - - 0 1' },
    ],
  },
  {
    id: 'capturing-pieces',
    title: 'Capturing Pieces',
    level: 'beginner',
    description: 'How to remove enemy pieces from the board.',
    content: [
      { html: '<p>To capture, move a piece onto the square occupied by an enemy piece and remove it from the board.</p>' },
      { html: '<p>Always ask: <em>Is this capture safe?</em> A free capture might cost you a bigger piece.</p>', fen: '8/8/8/3q4/4N3/8/8/8 w - - 0 1' },
    ],
  },
  {
    id: 'castling',
    title: 'Castling',
    level: 'beginner',
    description: 'The only move that moves two pieces at once.',
    content: [
      { html: '<p>Castling moves your king two squares toward a rook, and the rook jumps to the square the king crossed.</p>' },
      { html: '<p>You may not castle if the king or rook has moved, if the king is in check, or if it passes through attacked squares.</p>', fen: 'r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1' },
    ],
  },
  {
    id: 'en-passant',
    title: 'En Passant',
    level: 'beginner',
    description: 'A special pawn capture.',
    content: [
      { html: '<p>When a pawn advances two squares and lands beside an enemy pawn, that pawn may capture it <strong>as if it had only moved one square</strong>.</p>' },
      { html: '<p>This option must be taken <strong>immediately</strong>, on the very next move.</p>', fen: '8/8/8/3pP3/8/8/8/8 w - d6 0 1' },
    ],
  },
  {
    id: 'pawn-promotion',
    title: 'Pawn Promotion',
    level: 'beginner',
    description: 'Turning a pawn into a queen.',
    content: [
      { html: '<p>When a pawn reaches the <strong>8th rank</strong> (or 1st for Black), it must become a queen, rook, bishop, or knight.</p>' },
      { html: '<p>Promoting to a queen is almost always best.</p>', fen: '8/4P3/8/8/8/8/8/8 w - - 0 1' },
    ],
  },
  {
    id: 'check',
    title: 'Check',
    level: 'beginner',
    description: 'When the king is under attack.',
    content: [
      { html: '<p><strong>Check</strong> means the king is attacked. You must respond immediately: <em>move</em> the king, <em>block</em> the attack, or <em>capture</em> the attacker.</p>' },
      { html: '<p>You may never leave your own king in check.</p>', fen: '4k3/8/8/8/8/8/8/4R1K1 w - - 0 1' },
    ],
  },
  {
    id: 'checkmate',
    title: 'Checkmate',
    level: 'beginner',
    description: 'The goal of every chess game.',
    content: [
      { html: '<p><strong>Checkmate</strong> is a check the king cannot escape. The game ends immediately — the checked side loses.</p>' },
      { html: '<p>Back-rank mates are the most common checkmates in practice.</p>', fen: '6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1' },
    ],
  },
  {
    id: 'stalemate',
    title: 'Stalemate',
    level: 'beginner',
    description: 'A sneaky way to draw.',
    content: [
      { html: '<p><strong>Stalemate</strong> happens when the side to move has no legal moves and is <em>not</em> in check. The game is a draw.</p>' },
      { html: '<p>Watch out — a winning position can turn into a stalemate in one careless move!</p>', fen: '7k/5Q2/6K1/8/8/8/8/8 b - - 0 1' },
    ],
  },
  {
    id: 'draw-rules',
    title: 'Rules for a Draw',
    level: 'beginner',
    description: 'Not every game has a winner.',
    content: [
      { html: '<p>A game is drawn by <strong>stalemate</strong>, <strong>insufficient material</strong>, <strong>threefold repetition</strong>, the <strong>50-move rule</strong>, or by agreement.</p>' },
      { html: '<p>Knowing draw rules can save a lost game — or force a win when the opponent slips.</p>' },
    ],
  },
  {
    id: 'piece-values',
    title: 'Piece Values',
    level: 'beginner',
    description: 'A simple way to judge material.',
    content: [
      { html: '<p>Common values: <strong>Pawn = 1</strong>, <strong>Knight = 3</strong>, <strong>Bishop = 3</strong>, <strong>Rook = 5</strong>, <strong>Queen = 9</strong>. The king is priceless.</p>' },
      { html: '<p>These values are guides, not laws — a well-placed knight can outshine a rook.</p>' },
    ],
  },
  {
    id: 'opening-principles',
    title: 'Opening Principles',
    level: 'beginner',
    description: 'The rules of the first ten moves.',
    content: [
      { html: '<p>1. Control the center. 2. Develop your minor pieces. 3. Castle early. 4. Connect your rooks. 5. Do not move the same piece twice without reason.</p>' },
      { html: '<p>Following these principles gives you a solid start in every game.</p>', fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' },
    ],
  },
  {
    id: 'center-control',
    title: 'Controlling the Center',
    level: 'beginner',
    description: 'Why e4, d4, e5, d5 matter.',
    content: [
      { html: '<p>Pieces placed in the center control more squares. A knight on e4 attacks 8 squares; the same knight on a1 attacks only 2.</p>' },
      { html: '<p>Fight for the central squares from move one.</p>', fen: '8/8/8/3P4/3P4/8/8/8 w - - 0 1' },
    ],
  },

  // ─────────────────────────────────────────────
  // INTERMEDIATE — TACTICS
  // ─────────────────────────────────────────────
  {
    id: 'tactic-fork',
    title: 'Tactic: Fork',
    level: 'intermediate',
    description: 'Attack two pieces at once with a single move.',
    content: [
      { html: '<p>A <strong>fork</strong> attacks two or more enemy pieces simultaneously. The knight is the classic forking piece because of its L-shaped jump.</p>' },
      { html: '<p>Look for forks against the king and queen — they win material for free.</p>', fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4' },
    ],
  },
  {
    id: 'tactic-pin',
    title: 'Tactic: Pin',
    level: 'intermediate',
    description: 'Freeze a piece against a more valuable target.',
    content: [
      { html: '<p>A <strong>pin</strong> restricts a piece because moving it would expose a more valuable piece behind it.</p>' },
      { html: '<p>An <em>absolute pin</em> is against the king — the pinned piece cannot legally move.</p>', fen: '4k3/8/8/8/8/4n3/8/4R1K1 w - - 0 1' },
    ],
  },
  {
    id: 'tactic-skewer',
    title: 'Tactic: Skewer',
    level: 'intermediate',
    description: 'The pin in reverse.',
    content: [
      { html: '<p>A <strong>skewer</strong> attacks a valuable piece; when it moves, you capture the less valuable piece behind it.</p>' },
      { html: '<p>Especially deadly against a king on an open line with a rook or queen behind it.</p>', fen: '4k3/8/8/8/8/8/8/4R1K1 w - - 0 1' },
    ],
  },
  {
    id: 'tactic-discovered-attack',
    title: 'Tactic: Discovered Attack',
    level: 'intermediate',
    description: 'Move one piece and reveal an attack from another.',
    content: [
      { html: '<p>When a piece moves and opens the line of a friendly bishop, rook, or queen behind it, the result is a <strong>discovered attack</strong>.</p>' },
      { html: '<p>The moving piece itself can also create a threat — a <em>discovered check</em> is devastating.</p>', fen: '4k3/8/8/8/8/8/3N4/3R2K1 w - - 0 1' },
    ],
  },
  {
    id: 'tactic-double-attack',
    title: 'Tactic: Double Attack',
    level: 'intermediate',
    description: 'Threaten two things — they can only stop one.',
    content: [
      { html: '<p>A <strong>double attack</strong> creates two separate threats with one move. The opponent can usually answer only one.</p>' },
      { html: '<p>Queens and knights are excellent at double attacks.</p>', fen: '8/8/8/8/3Q4/8/8/4k1K1 w - - 0 1' },
    ],
  },
  {
    id: 'tactic-removing-defender',
    title: 'Tactic: Removing the Defender',
    level: 'intermediate',
    description: 'Eliminate the piece guarding a key square.',
    content: [
      { html: '<p>If a piece defends a crucial square or piece, capturing or chasing it away often wins material.</p>' },
      { html: '<p>Look for defenders that are <em>overloaded</em> or <em>undefended</em>.</p>', fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1' },
    ],
  },
  {
    id: 'tactic-deflection',
    title: 'Tactic: Deflection',
    level: 'intermediate',
    description: 'Force a defender away from its duty.',
    content: [
      { html: '<p><strong>Deflection</strong> lures a defending piece away from the square or piece it must guard.</p>' },
      { html: '<p>Sacrifices often precede a deflection.</p>', fen: '6k1/5ppp/8/8/1Q6/8/5PPP/6K1 w - - 0 1' },
    ],
  },
  {
    id: 'tactic-decoy',
    title: 'Tactic: Decoy',
    level: 'intermediate',
    description: 'Sacrifice to lure a piece to a bad square.',
    content: [
      { html: '<p>A <strong>decoy</strong> sacrifice draws an enemy piece onto a square where it can be forked, pinned, or mated.</p>' },
      { html: '<p>Common in mating combinations.</p>', fen: '6k1/6pp/8/8/8/8/5PPP/4Q1K1 w - - 0 1' },
    ],
  },
  {
    id: 'tactic-overloaded-piece',
    title: 'Tactic: Overloaded Piece',
    level: 'intermediate',
    description: 'Exploit a defender doing too much.',
    content: [
      { html: '<p>If one piece defends two things at once, it is <strong>overloaded</strong>. Attack both — it can save only one.</p>' },
      { html: '<p>Combine with deflection to make the tactic work.</p>', fen: '6k1/5ppp/8/8/8/8/5PPP/1R4K1 w - - 0 1' },
    ],
  },
  {
    id: 'tactic-zwischenzug',
    title: 'Tactic: Zwischenzug',
    level: 'intermediate',
    description: 'The in-between move that changes everything.',
    content: [
      { html: '<p>A <strong>zwischenzug</strong> (in-between move) is an unexpected check or threat played before the obvious recapture.</p>' },
      { html: '<p>It often wins material by forcing the opponent to respond first.</p>', fen: '4k3/8/8/8/8/8/4R3/6K1 w - - 0 1' },
    ],
  },
  {
    id: 'mate-in-one-patterns',
    title: 'Mate in One Patterns',
    level: 'intermediate',
    description: 'Recognize the classic mating nets.',
    content: [
      { html: '<p>Learn to see the most common mate-in-one shapes: back-rank, queen-and-king, smothered, and support mate.</p>' },
      { html: '<p>Pattern recognition turns calculation into intuition.</p>', fen: '6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1' },
    ],
  },
  {
    id: 'back-rank-mate',
    title: 'Back-Rank Mate',
    level: 'intermediate',
    description: 'The most common mate in club chess.',
    content: [
      { html: '<p>When the king is trapped on the last rank by its own pawns, a rook or queen delivers mate along the back rank.</p>' },
      { html: '<p>Always leave <em>luft</em> (breathing room) for your own king.</p>', fen: '6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1' },
    ],
  },
  {
    id: 'smothered-mate',
    title: 'Smothered Mate',
    level: 'intermediate',
    description: 'A knight mate against a buried king.',
    content: [
      { html: '<p>In a <strong>smothered mate</strong>, the enemy king is surrounded by its own pieces and a knight delivers checkmate.</p>' },
      { html: '<p>Often reached via a queen sacrifice.</p>', fen: '6rk/6pp/8/6N1/8/8/8/6K1 w - - 0 1' },
    ],
  },
  {
    id: 'anastasia-mate',
    title: "Anastasia's Mate",
    level: 'intermediate',
    description: 'Knight and rook team up on the h-file.',
    content: [
      { html: '<p>Typical pattern: a knight on e7 controls g8 and g6, while a rook checks on the h-file. The king is trapped.</p>' },
      { html: '<p>Great pattern to know for attacking players.</p>', fen: '5rk1/4Nppp/8/8/8/8/8/6KR w - - 0 1' },
    ],
  },
  {
    id: 'arabian-mate',
    title: 'Arabian Mate',
    level: 'intermediate',
    description: 'Rook and knight corner the king.',
    content: [
      { html: '<p>The <strong>Arabian mate</strong> uses a rook on the edge and a knight guarding the escape squares.</p>' },
      { html: '<p>Classic in the corner of the board.</p>', fen: '7k/8/8/8/8/5N2/8/6RK w - - 0 1' },
    ],
  },
  {
    id: 'greek-gift',
    title: 'The Greek Gift Sacrifice',
    level: 'intermediate',
    description: 'Bxh7+ and the mating attack that follows.',
    content: [
      { html: '<p>The <strong>Greek Gift</strong> is a bishop sacrifice on h7 followed by Ng5+ and Qh5, opening the h-file toward the king.</p>' },
      { html: '<p>Works best when the defender has few pieces near the kingside.</p>', fen: 'r1bq1rk1/ppp1bppp/2n2n2/3p4/3P4/2N1PN2/PPQ1BPPP/R1B2RK1 w - - 0 1' },
    ],
  },
  {
    id: 'italian-game',
    title: 'Opening: Italian Game',
    level: 'intermediate',
    description: 'A classical opening built on rapid development.',
    content: [
      { html: '<p>1.e4 e5 2.Nf3 Nc6 3.Bc4 — White aims at f7 and develops quickly.</p>' },
      { html: '<p>Rich in tactical ideas like the Fried Liver Attack.</p>', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 1' },
    ],
  },
  {
    id: 'sicilian-defense',
    title: 'Opening: Sicilian Defense',
    level: 'intermediate',
    description: "Black's most popular reply to 1.e4.",
    content: [
      { html: '<p>1.e4 c5 — Black fights for the center asymmetrically and creates sharp, unbalanced positions.</p>' },
      { html: '<p>Variations: Najdorf, Dragon, Sveshnikov, and more.</p>', fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1' },
    ],
  },
  {
    id: 'french-defense',
    title: 'Opening: French Defense',
    level: 'intermediate',
    description: 'A solid, strategic reply to 1.e4.',
    content: [
      { html: '<p>1.e4 e6 — Black prepares d5 and accepts a slightly cramped but resilient position.</p>' },
      { html: '<p>Known for the Winawer and Classical variations.</p>', fen: 'rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1' },
    ],
  },
  {
    id: 'queens-gambit',
    title: "Opening: Queen's Gambit",
    level: 'intermediate',
    description: 'A timeless classical opening for White.',
    content: [
      { html: '<p>1.d4 d5 2.c4 — White offers a pawn to gain central control. Black can accept (QGA) or decline (QGD).</p>' },
      { html: '<p>A staple of world championship play.</p>', fen: 'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 1' },
    ],
  },

  // ─────────────────────────────────────────────
  // ADVANCED — STRATEGY & ENDGAMES
  // ─────────────────────────────────────────────
  {
    id: 'endgame-kq-vs-k',
    title: 'Endgame: King + Queen vs King',
    level: 'advanced',
    description: 'The first mate every player should master.',
    content: [
      { html: '<p>Use the queen to drive the enemy king to the edge while your own king approaches. Deliver mate with the queen protected by your king.</p>' },
      { html: '<p>Beware of stalemate — leave the defender a legal move until you are ready.</p>', fen: '8/8/8/4k3/8/8/8/4K2Q w - - 0 1' },
    ],
  },
  {
    id: 'endgame-kr-vs-k',
    title: 'Endgame: King + Rook vs King',
    level: 'advanced',
    description: 'The classic rook ladder mate.',
    content: [
      { html: '<p>Push the enemy king to the edge with your rook, then bring your king close for the mate.</p>' },
      { html: '<p>Use the <em>knight-move</em> pattern for efficient king placement.</p>', fen: '8/8/8/4k3/8/8/8/4K2R w - - 0 1' },
    ],
  },
  {
    id: 'endgame-kp-vs-k',
    title: 'Endgame: King + Pawn vs King',
    level: 'advanced',
    description: 'Master key squares and pawn promotion.',
    content: [
      { html: '<p>The attacker wins only if the king reaches a <strong>key square</strong> ahead of the pawn.</p>' },
      { html: '<p>Rook pawns are usually drawn; central pawns are usually won.</p>', fen: '8/8/8/8/8/8/4P3/4K1k1 w - - 0 1' },
    ],
  },
  {
    id: 'endgame-opposition',
    title: 'Endgame: The Opposition',
    level: 'advanced',
    description: 'Kings on the same file — who wins?',
    content: [
      { html: '<p>When the two kings face each other with one square between them, the side <em>not</em> to move has the opposition and can force progress.</p>' },
      { html: '<p>A fundamental concept in every pawn endgame.</p>', fen: '8/8/8/4k3/8/8/8/4K3 w - - 0 1' },
    ],
  },
  {
    id: 'lucena-position',
    title: 'Endgame: The Lucena Position',
    level: 'advanced',
    description: 'The winning rook endgame pattern.',
    content: [
      { html: '<p>A rook and pawn vs rook position that is winning for the side with the pawn. The key is building a <strong>bridge</strong> with the rook to shield the king from checks.</p>' },
      { html: '<p>Memorize this — it wins games.</p>', fen: '3K4/3P1k2/8/8/8/8/1r6/4R3 w - - 0 1' },
    ],
  },
  {
    id: 'philidor-position',
    title: 'Endgame: The Philidor Position',
    level: 'advanced',
    description: 'How to draw a rook endgame down a pawn.',
    content: [
      { html: '<p>Rook on the third rank blocks the enemy king; when the pawn advances, the rook swings behind to give checks.</p>' },
      { html: '<p>The most important drawing technique in rook endgames.</p>', fen: '8/8/8/3k4/3p4/3R4/3K4/8 b - - 0 1' },
    ],
  },
  {
    id: 'pawn-structures',
    title: 'Pawn Structures',
    level: 'advanced',
    description: 'The skeleton of every position.',
    content: [
      { html: '<p>Pawns cannot move backward, so their structure defines the long-term character of the game.</p>' },
      { html: '<p>Know the key types: <strong>isolated</strong>, <strong>doubled</strong>, <strong>backward</strong>, and <strong>passed</strong> pawns.</p>' },
    ],
  },
  {
    id: 'piece-activity',
    title: 'Piece Activity',
    level: 'advanced',
    description: 'The best piece on the worst square loses.',
    content: [
      { html: '<p>Active pieces win games. A passive rook on a1 is often worth less than a bishop dominating the center.</p>' },
      { html: '<p>Trade your bad pieces, keep your good ones.</p>' },
    ],
  },
  {
    id: 'prophylaxis',
    title: 'Prophylaxis',
    level: 'advanced',
    description: "Nimzowitsch's art of preventing ideas.",
    content: [
      { html: '<p><strong>Prophylaxis</strong> means stopping the opponent\u2019s plan before it starts. Sometimes the best move is a quiet one.</p>' },
      { html: '<p>Ask: <em>What does my opponent want to do?</em> — then stop it.</p>' },
    ],
  },
  {
    id: 'positional-sacrifice',
    title: 'Positional Sacrifice',
    level: 'advanced',
    description: 'Give material for long-term compensation.',
    content: [
      { html: '<p>An <strong>exchange sacrifice</strong> (rook for a knight or bishop) can shatter a defense or fix a weak structure.</p>' },
      { html: '<p>Trust your judgment — the computer may not always agree, but the position speaks.</p>', fen: 'r4rk1/1pp2ppp/p1np4/4p3/2B1P3/2P2N2/PP3PPP/R3R1K1 w - - 0 1' },
    ],
  },
];