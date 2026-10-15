/* Lesson content — English. Separated from UI for easy editing. */
(function () {
    'use strict';
    window.LESSON_DATA = [
        /* ─────────────────────────────────────────────
           BEGINNER
           ───────────────────────────────────────────── */
        {
            id: 'board-basics', title: 'Meet the Chessboard', level: 'beginner',
            description: 'The 8×8 grid, coordinates, and the starting position.',
            goal: 'Read square coordinates and recognize the starting setup.',
            steps: [
                { title: 'The 8×8 Grid', text: 'The board has 64 squares: 8 ranks (rows 1–8) and 8 files (columns a–h). Square a1 is always at the bottom-left from White\'s view, and it is always dark.' },
                { title: 'Starting Position', text: 'Ranks 1 and 2 hold White\'s pieces; ranks 7 and 8 hold Black\'s. On the back rank, the queen sits on her own color (d1 for White, d8 for Black) and the king stands beside her.', board: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' },
                { title: 'Coordinates', text: 'Every square has a name like e4 or g7. Files use letters (a–h) and ranks use numbers (1–8). This notation is used worldwide to record moves.', quiz: { question: 'Which square is top-right from White\'s point of view?', options: ['a8', 'h1', 'h8', 'a1'], answer: 2 } }
            ]
        },
        {
            id: 'files-ranks-diagonals', title: 'Files, Ranks, and Diagonals', level: 'beginner',
            description: 'How pieces travel along the lines of the board.',
            goal: 'Identify lines and use them to describe piece movement.',
            steps: [
                { title: 'Files', text: 'A file runs vertically from White\'s side to Black\'s. Files are labeled a through h from left to right (from White\'s view).' },
                { title: 'Ranks', text: 'A rank runs horizontally across the board. Ranks are numbered 1 (White\'s back rank) through 8 (Black\'s back rank).' },
                { title: 'Diagonals', text: 'A diagonal runs at a 45° angle and always stays on one color. Each square lies on exactly two diagonals — one light, one dark.', board: '8/8/8/3B4/8/8/8/8 w - - 0 1' }
            ]
        },
        {
            id: 'chess-notation', title: 'Chess Notation', level: 'beginner',
            description: 'Read and write moves using algebraic notation.',
            goal: 'Follow a game score and record your own moves.',
            steps: [
                { title: 'Naming Moves', text: 'A move is written as piece + destination. Example: Nf3 means a knight moves to f3. Pawn moves omit the letter: e4, d5, exd5 for captures.' },
                { title: 'Special Symbols', text: 'x = capture, + = check, # = checkmate, O-O = kingside castling, O-O-O = queenside castling, e.p. = en passant, =Q = promotion to queen.' },
                { title: 'Kuis', text: 'Notation is the universal language of chess.', quiz: { question: 'What does "exd5" mean?', options: ['A pawn from e4 captures on d5', 'A bishop moves to d5', 'A king moves to d5', 'Castling kingside'], answer: 0 } }
            ]
        },
        {
            id: 'pawn-movement', title: 'The Pawn', level: 'beginner',
            description: 'The soul of chess — slow, brave, and full of surprises.',
            goal: 'Move and capture with pawns correctly.',
            steps: [
                { title: 'Forward Only', text: 'A pawn moves one square straight ahead. From its starting rank it may advance two squares. Pawns never move backward.' },
                { title: 'Diagonal Captures', text: 'A pawn captures one square diagonally forward. It cannot capture straight ahead — a blocked pawn stays blocked until it can capture.', board: '8/8/8/3Pp3/8/8/8/8 w - - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'How does a pawn capture?', options: ['Straight ahead', 'Diagonally forward', 'Backward', 'Like a knight'], answer: 1 } }
            ]
        },
        {
            id: 'knight-movement', title: 'The Knight', level: 'beginner',
            description: 'The only piece that can jump over others.',
            goal: 'Recognize knight moves and the L-shape.',
            steps: [
                { title: 'The L-Shape', text: 'The knight moves two squares in one direction, then one square perpendicular. It always lands on a square of the opposite color.' },
                { title: 'Jumping', text: 'The knight is the only piece that can leap over other pieces — friendly or enemy. This makes it deadly in crowded positions.', board: '8/8/8/3N4/8/8/8/8 w - - 0 1' },
                { title: 'Kuis', text: '"A knight on the rim is dim."', quiz: { question: 'How many squares does a centralized knight attack?', options: ['2', '4', '6', '8'], answer: 3 } }
            ]
        },
        {
            id: 'bishop-movement', title: 'The Bishop', level: 'beginner',
            description: 'A long-range sniper bound to one color.',
            goal: 'Move and value bishops correctly.',
            steps: [
                { title: 'Diagonal Slider', text: 'The bishop moves any number of squares diagonally and cannot jump over pieces.' },
                { title: 'Bound to Color', text: 'Each bishop stays forever on its starting color. That is why a bishop pair (one light, one dark) is a powerful long-term asset.', board: '8/8/8/3B4/8/8/8/8 w - - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'Can a light-squared bishop ever attack a dark square?', options: ['Yes, once per game', 'Yes, with castling', 'No, never', 'Only after promotion'], answer: 2 } }
            ]
        },
        {
            id: 'rook-movement', title: 'The Rook', level: 'beginner',
            description: 'Straight lines, heavy power.',
            goal: 'Use rooks on files and ranks effectively.',
            steps: [
                { title: 'Straight Slider', text: 'The rook moves any number of squares horizontally or vertically and cannot jump. Worth about five pawns.' },
                { title: 'Open Files', text: 'Rooks love open files — files with no pawns. Place rooks on open files and double them up for maximum pressure.', board: '8/8/8/3R4/8/8/8/8 w - - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'Where is a rook most effective?', options: ['On an open file', 'In the corner', 'Behind its own pawns', 'On a1 forever'], answer: 0 } }
            ]
        },
        {
            id: 'queen-movement', title: 'The Queen', level: 'beginner',
            description: 'The most powerful piece on the board.',
            goal: 'Understand the queen\'s reach and value.',
            steps: [
                { title: 'Rook + Bishop', text: 'The queen combines the moves of the rook and the bishop: any number of squares in any straight line.' },
                { title: 'Value & Caution', text: 'Worth around nine pawns. Never trade her for less, and avoid bringing her out too early — she becomes a target.', board: '8/8/8/3Q4/8/8/8/8 w - - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'The queen combines which two pieces?', options: ['Rook + knight', 'Bishop + knight', 'Rook + bishop', 'King + pawn'], answer: 2 } }
            ]
        },
        {
            id: 'king-movement', title: 'The King', level: 'beginner',
            description: 'Slow, precious, and surprisingly dangerous in the endgame.',
            goal: 'Move the king safely and use it in endgames.',
            steps: [
                { title: 'One Square Only', text: 'The king moves exactly one square in any direction. He may never move into check.' },
                { title: 'Fighting King', text: 'In the opening and middlegame the king must be kept safe. In the endgame he becomes a strong attacker — activate him!', board: '8/8/8/3K4/8/8/8/8 w - - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'When is the king strongest?', options: ['In the opening', 'In the middlegame', 'In the endgame', 'Never'], answer: 2 } }
            ]
        },
        {
            id: 'capturing-pieces', title: 'Capturing Pieces', level: 'beginner',
            description: 'Removing enemy pieces from the board.',
            goal: 'Capture safely and evaluate trades.',
            steps: [
                { title: 'How to Capture', text: 'Move one of your pieces onto the square occupied by an enemy piece and remove that piece from the board.' },
                { title: 'Think Before You Take', text: 'Always ask: "Is this capture safe?" A free pawn may cost you a knight. Count values before every exchange.', board: '8/8/8/3q4/4N3/8/8/8 w - - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'What should you check before capturing?', options: ['The clock', 'Whether the capture is safe', 'The opponent\'s shoe size', 'If it looks cool'], answer: 1 } }
            ]
        },
        {
            id: 'castling', title: 'Castling', level: 'beginner',
            description: 'The only move that moves two pieces at once.',
            goal: 'Know when castling is allowed and why it matters.',
            steps: [
                { title: 'What Castling Is', text: 'The king moves two squares toward a rook, and the rook jumps to the square the king crossed. Kingside: O-O (king to g1/g8). Queenside: O-O-O (king to c1/c8).' },
                { title: 'Legal Conditions', text: 'You may NOT castle if: the king or that rook has already moved, pieces stand between them, the king is in check, or the king passes through / lands on an attacked square.', board: 'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'Which condition prevents castling?', options: ['Your rook is attacked', 'Your queen has moved', 'Your king is in check', 'You have a bishop on c4'], answer: 2 } }
            ]
        },
        {
            id: 'en-passant', title: 'En Passant', level: 'beginner',
            description: 'A special pawn capture that surprises beginners.',
            goal: 'Recognize and execute en passant.',
            steps: [
                { title: 'The Rule', text: 'If an enemy pawn advances two squares from its starting rank and lands beside your pawn, you may capture it as if it had only moved one square. This must be done immediately, on the very next move.', board: 'rnbqkbnr/ppp1p1pp/8/3pPp2/8/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 3' },
                { title: 'Example', text: 'In the diagram: White has a pawn on e5, Black just played ...f5. White may play exf6 e.p. — the black pawn on f5 is captured and White\'s pawn lands on f6.' },
                { title: 'Kuis', text: '', quiz: { question: 'When may en passant be played?', options: ['Any time pawns are adjacent', 'Immediately after the enemy pawn moves two squares', 'Only in the opening', 'Only with check'], answer: 1 } }
            ]
        },
        {
            id: 'promotion', title: 'Pawn Promotion', level: 'beginner',
            description: 'A pawn that reaches the last rank becomes a new piece.',
            goal: 'Choose the best promotion piece.',
            steps: [
                { title: 'The Rule', text: 'A pawn reaching the 8th rank (or 1st for Black) must promote to a queen, rook, bishop, or knight of the same color.' },
                { title: 'Usually a Queen', text: 'Promoting to a queen is almost always best. Under-promotion to a knight can be strong when it delivers an immediate check or fork (for example, promoting to a knight with check against king and queen).' },
                { title: 'Kuis', text: '', quiz: { question: 'Which promotion is almost always strongest?', options: ['Knight', 'Bishop', 'Queen', 'Rook'], answer: 2 } }
            ]
        },
        {
            id: 'check', title: 'Check', level: 'beginner',
            description: 'When the king is under attack.',
            goal: 'Respond correctly to any check.',
            steps: [
                { title: 'What Check Is', text: 'Check means your king is attacked. You must respond immediately. You are never allowed to leave your own king in check.' },
                { title: 'Three Responses', text: 'You can (1) move the king to a safe square, (2) block the attack with another piece, or (3) capture the attacking piece. Blocking is impossible against a knight or pawn check.', board: '4k3/8/8/8/8/8/8/4R1K1 w - - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'Which response is IMPOSSIBLE when a knight gives check?', options: ['Move the king', 'Capture the knight', 'Block with a piece', 'All are possible'], answer: 2 } }
            ]
        },
        {
            id: 'checkmate', title: 'Checkmate', level: 'beginner',
            description: 'The goal of every chess game.',
            goal: 'Recognize a checkmate position instantly.',
            steps: [
                { title: 'Definition', text: 'Checkmate is a check from which the king cannot escape. The game ends immediately — the side whose king is mated loses.' },
                { title: 'Back-Rank Mate', text: 'The most common mate in practice: a king trapped on the back rank by his own pawns, mated by a rook or queen.', board: '6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1' },
                { title: 'Kuis', text: 'Look at the diagram above.', quiz: { question: 'Why is Re8# mate?', options: ['The king can move to f7', 'The pawns on f7/g7/h7 block escape', 'The rook is undefended', 'The king is out of moves on the 8th rank but pawns block escape'], answer: 3 } }
            ]
        },
        {
            id: 'stalemate', title: 'Stalemate', level: 'beginner',
            description: 'A sneaky way for a losing side to draw.',
            goal: 'Recognize and avoid stalemate.',
            steps: [
                { title: 'Definition', text: 'Stalemate happens when the player to move has no legal moves AND is not in check. The game is a draw.' },
                { title: 'Danger in Winning Positions', text: 'Many winning positions are ruined by stalemate. When up a queen, keep giving the enemy king a legal move until you are ready to mate.', board: '7k/5Q2/6K1/8/8/8/8/8 b - - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'What is the result of a stalemate?', options: ['Win for White', 'Win for Black', 'Draw', 'Rematch'], answer: 2 } }
            ]
        },
        {
            id: 'draw-rules', title: 'Rules for a Draw', level: 'beginner',
            description: 'Not every game ends with a winner.',
            goal: 'Know every way a game can be drawn.',
            steps: [
                { title: 'Draws by Rule', text: 'A draw occurs by stalemate, insufficient material, threefold repetition, the fifty-move rule, or agreement between players.' },
                { title: 'Why It Matters', text: 'Knowing these rules saves lost games and forces you to convert won positions quickly. If you are winning, avoid repetition — if you are losing, aim for it.' },
                { title: 'Kuis', text: '', quiz: { question: 'Which is NOT a draw?', options: ['Stalemate', 'Threefold repetition', 'Insufficient material', 'Checkmate on move 5'], answer: 3 } }
            ]
        },
        {
            id: 'piece-values', title: 'Piece Values', level: 'beginner',
            description: 'A simple way to judge material.',
            goal: 'Evaluate trades using rough point values.',
            steps: [
                { title: 'Standard Values', text: 'Pawn = 1, Knight = 3, Bishop = 3, Rook = 5, Queen = 9. The king has no value — losing him ends the game.', board: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' },
                { title: 'Rough Trades', text: 'Queen (9) for two rooks (10) is nearly even. A knight (3) for three pawns (3) is often even. A bishop is usually slightly better than a knight in open positions.' },
                { title: 'Kuis', text: '', quiz: { question: 'Which trade is clearly bad for you?', options: ['Queen for two rooks + pawn', 'Rook for bishop + pawn', 'Knight for three pawns', 'Bishop for a knight'], answer: 1 } }
            ]
        },
        {
            id: 'opening-principles', title: 'Opening Principles', level: 'beginner',
            description: 'Three golden rules for the first moves.',
            goal: 'Start every game with a sound plan.',
            steps: [
                { title: 'Principle 1: Control the Center', text: 'Push a central pawn (e4 or d4 for White). Pieces on the center attack more squares and give your army room to develop.', board: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1' },
                { title: 'Principle 2: Develop Pieces', text: 'Bring out knights and bishops. Do not move the same piece twice without reason. Do not bring your queen out early — she will be chased away and you will lose time.' },
                { title: 'Principle 3: Castle Early', text: 'Get the king to safety before starting your own plans. Castling also connects your rooks, readying them for the middlegame.' },
                { title: 'Kuis', text: '', quiz: { question: 'Which opening plan is most principled?', options: ['a4 then Ra3', 'e4 then Nf3', 'h4 then Rh3', 'Na3 then Nc4'], answer: 1 } }
            ]
        },
        {
            id: 'center-control', title: 'Controlling the Center', level: 'beginner',
            description: 'Why e4, d4, e5, d5 matter so much.',
            goal: 'Judge central control in any position.',
            steps: [
                { title: 'The Central Squares', text: 'e4, d4, e5, d5 form the center. Pawns here attack strongly and open lines for your pieces.', board: 'rnbqkbnr/ppp1pppp/8/3p4/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2' },
                { title: 'Occupation vs. Control', text: 'You do not need a pawn on a central square to control it. Pieces that attack central squares control them just as effectively (as in hypermodern openings like 1.Nf3 or 1.g3).' },
                { title: 'Kuis', text: '', quiz: { question: 'How many "central" squares are there in chess?', options: ['2', '4', '8', '16'], answer: 1 } }
            ]
        },

        /* ─────────────────────────────────────────────
           INTERMEDIATE
           ───────────────────────────────────────────── */
        {
            id: 'development', title: 'Piece Development', level: 'intermediate',
            description: 'Getting your army into the fight efficiently.',
            goal: 'Develop pieces on the best squares in the first ten moves.',
            steps: [
                { title: 'Knights First, Usually', text: 'Nf3 / Nc3 (for White) attacks the center and defends e4/d4. Avoid rim knights — "a knight on the rim is dim."' },
                { title: 'Active Bishops', text: 'Develop bishops to c4, g5, or f4 before deciding your pawn structure. Your pawns determine whether your bishop is good or bad (a "bad bishop" is blocked by your own pawns).' },
                { title: 'Do Not Rush the Queen', text: 'Bringing the queen out early wastes time — the opponent develops while attacking her. Classic example: 1.e4 e5 2.Qh5?! lets Black play ...Nc6 and ...g6 with tempo.' },
                { title: 'Kuis', text: '', quiz: { question: 'Why is a knight on a3 or h3 weak?', options: ['Wrong color square', 'It attacks very few squares', 'It cannot capture', 'It moves slower'], answer: 1 } }
            ]
        },
        {
            id: 'king-safety', title: 'King Safety', level: 'intermediate',
            description: 'An exposed king is a dead king.',
            goal: 'Spot unsafe kings and know how to protect them.',
            steps: [
                { title: 'Warning Signs', text: 'A king stuck in the center, castling rights lost, broken pawn shield in front of the king, or an enemy queen/rook pointed at him — all are dangerous signals.', board: 'r1bq1b1r/pppk1ppp/8/4N3/8/8/PPPP1PPP/RNBQKB1R b KQkq - 0 1' },
                { title: 'How to Protect the King', text: 'Castle early. Keep the pawns in front of your king (f2/g2/h2) undisturbed. Trade off the opponent\'s attacking pieces — a well-defended king is hard to mate.' },
                { title: 'Kuis', text: '', quiz: { question: 'Which king is safest?', options: ['In the center after moving e and f pawns', 'Castled with the f/g/h pawns intact', 'In the center with no castling rights', 'In the corner with no defenders'], answer: 1 } }
            ]
        },
        {
            id: 'tactic-fork', title: 'Tactic: Fork', level: 'intermediate',
            description: 'Attack two pieces at once with a single move.',
            goal: 'Spot and execute forks, especially with knights.',
            steps: [
                { title: 'The Idea', text: 'A fork attacks two or more enemy pieces simultaneously. The knight is the classic forking piece because of its awkward L-shaped jump.' },
                { title: 'Best Targets', text: 'Look for forks that hit the king and another piece — the king must move, and you win the second piece for free.', board: '3q1rk1/ppp2ppp/8/3N4/8/8/PPP2PPP/R2Q1RK1 w - - 0 1' },
                { title: 'Kuis', text: 'Look at the diagram above.', quiz: { question: 'Which move wins Black\'s queen by fork?', options: ['Nf6+', 'Ne7+', 'Nxc7', 'Nb6'], answer: 1 } }
            ]
        },
        {
            id: 'tactic-pin', title: 'Tactic: Pin', level: 'intermediate',
            description: 'Freeze a piece against a more valuable target.',
            goal: 'Recognize absolute and relative pins.',
            steps: [
                { title: 'What a Pin Is', text: 'A pin restricts a piece because moving it would expose a more valuable piece behind it. The pinned piece is effectively frozen.' },
                { title: 'Absolute vs. Relative', text: 'An absolute pin is against the king — the pinned piece cannot legally move at all. A relative pin leaves the piece legally moveable, but at a material cost.', board: '4r1k1/8/8/8/8/4R3/8/4K3 w - - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'What makes a pin "absolute"?', options: ['It wins material immediately', 'It is against the king', 'It uses a knight', 'It happens in the endgame'], answer: 1 } }
            ]
        },
        {
            id: 'tactic-skewer', title: 'Tactic: Skewer', level: 'intermediate',
            description: 'The pin in reverse.',
            goal: 'Spot skewers along open lines.',
            steps: [
                { title: 'The Idea', text: 'A skewer attacks a valuable piece; when it moves, you capture the less valuable piece behind it. It is essentially a pin turned around.' },
                { title: 'Devastating on Open Lines', text: 'Skewers work best against a king on an open file or diagonal with a piece hiding behind it.', board: '4k3/8/8/8/8/8/8/4R1K1 w - - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'How does a skewer differ from a pin?', options: ['A skewer uses a knight', 'The valuable piece is in front', 'A skewer always wins the queen', 'There is no difference'], answer: 1 } }
            ]
        },
        {
            id: 'tactic-discovered', title: 'Tactic: Discovered Attack', level: 'intermediate',
            description: 'Move one piece, reveal an attack from another.',
            goal: 'Create and recognize discovered attacks and checks.',
            steps: [
                { title: 'The Idea', text: 'When a piece moves and opens the line of a friendly bishop, rook, or queen behind it, the result is a discovered attack. The moving piece itself can also create a threat.' },
                { title: 'Discovered Check', text: 'A discovered check is especially deadly — the moving piece is free to capture or threaten while the opponent must respond to the check.', board: '4k3/8/8/8/8/8/3N4/3R2K1 w - - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'What makes a discovered check powerful?', options: ['It uses a rook', 'It forces the opponent to answer only the check while the moving piece does damage', 'It ends the game', 'It wins a pawn'], answer: 1 } }
            ]
        },
        {
            id: 'tactic-double-attack', title: 'Tactic: Double Attack', level: 'intermediate',
            description: 'Threaten two things — they can only stop one.',
            goal: 'Use double attacks to win material.',
            steps: [
                { title: 'The Idea', text: 'A double attack creates two separate threats with one move. The opponent can usually answer only one of them.' },
                { title: 'Best Piece', text: 'The queen is the queen of double attacks — she can create threats on distant squares at once. Knights are close behind.', board: '8/8/8/8/3Q4/8/8/4k1K1 w - - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'Why is a double attack strong?', options: ['It is rare', 'The opponent cannot defend both threats at once', 'It always wins a queen', 'It uses a knight'], answer: 1 } }
            ]
        },
        {
            id: 'tactic-removing-defender', title: 'Tactic: Removing the Defender', level: 'intermediate',
            description: 'Eliminate the piece guarding a key square.',
            goal: 'Spot and exploit undefended or overloaded defenders.',
            steps: [
                { title: 'The Idea', text: 'If a piece defends a crucial square or piece, capturing or chasing away that defender often wins material — the thing it protected is now free.' },
                { title: 'Overload', text: 'An overloaded piece defends two things at once. Attack both; it can save only one.', board: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'What is an overloaded piece?', options: ['A piece on the edge', 'A piece that defends two things and cannot do both', 'A promoted pawn', 'A piece without support'], answer: 1 } }
            ]
        },
        {
            id: 'tactic-deflection', title: 'Tactic: Deflection', level: 'intermediate',
            description: 'Force a defender away from its duty.',
            goal: 'Use deflection to win material or mate.',
            steps: [
                { title: 'The Idea', text: 'Deflection lures a defending piece away from the square or piece it must guard. Often a sacrifice is used to make the deflector move.' },
                { title: 'Example Pattern', text: 'If a queen defends a mate square on g7, sacrificing a rook on that square forces her to capture — and she is no longer defending.', board: '6k1/5ppp/8/8/1Q6/8/5PPP/6K1 w - - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'What is the key idea of deflection?', options: ['Fork the king and queen', 'Force a defender away from what it protects', 'Promote a pawn', 'Trade rooks'], answer: 1 } }
            ]
        },
        {
            id: 'tactic-decoy', title: 'Tactic: Decoy', level: 'intermediate',
            description: 'Sacrifice to lure a piece to a bad square.',
            goal: 'Use decoys in mating combinations.',
            steps: [
                { title: 'The Idea', text: 'A decoy sacrifice draws an enemy piece onto a square where it can be forked, pinned, or mated. It is a close relative of deflection but focuses on squares rather than pieces.' },
                { title: 'Mating Decoys', text: 'Common in mates like the smothered mate: sacrifice your queen so the enemy king is forced to capture, then deliver mate with a knight.', board: '6k1/6pp/8/8/8/8/5PPP/4Q1K1 w - - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'How is a decoy used?', options: ['To save a pawn', 'To lure a piece to a bad square via sacrifice', 'To trade queens', 'To castle late'], answer: 1 } }
            ]
        },
        {
            id: 'tactic-overloaded-piece', title: 'Tactic: Overloaded Piece', level: 'intermediate',
            description: 'Exploit a defender doing too much.',
            goal: 'Attack two defended things at once.',
            steps: [
                { title: 'The Idea', text: 'If one piece defends two things at once, it is overloaded. Attack both — it can save only one.' },
                { title: 'Practical Use', text: 'Combine with deflection or a fork to make the overloaded piece choose — and whatever he chooses, you win the other.', board: '6k1/5ppp/8/8/8/8/5PPP/1R4K1 w - - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'How do you exploit an overloaded piece?', options: ['Trade it', 'Attack both of its responsibilities', 'Pin it', 'Ignore it'], answer: 1 } }
            ]
        },
        {
            id: 'tactic-zwischenzug', title: 'Tactic: Zwischenzug', level: 'intermediate',
            description: 'The in-between move that changes everything.',
            goal: 'Insert a check or threat before recapturing.',
            steps: [
                { title: 'The Idea', text: 'A zwischenzug (in-between move) is an unexpected check or threat played before the obvious recapture. It forces the opponent to respond first.' },
                { title: 'Why It Wins', text: 'Often a player assumes a quiet recapture is coming, only to be forced to answer a check — during which you gain a tempo or material.', board: '4k3/8/8/8/8/8/4R3/6K1 w - - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'What is a zwischenzug?', options: ['A repetition draw', 'An unexpected in-between move like a check', 'A type of pin', 'Castling long'], answer: 1 } }
            ]
        },
        {
            id: 'back-rank-mate', title: 'Back-Rank Mate', level: 'intermediate',
            description: 'The most common mate in club chess.',
            goal: 'Deliver and defend against back-rank mates.',
            steps: [
                { title: 'The Pattern', text: 'The king is trapped on the back rank by his own pawns, and a rook or queen delivers mate on that rank.' },
                { title: 'Play It', text: 'Force the enemy king to the back rank, remove or deflect his defenders, then slide a rook or queen to the last rank — mate.', board: '6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1' },
                { title: 'Defend It', text: 'Leave "luft" — a pawn move like h3 or g3 — so your king has an escape square. And watch for enemy rooks on open files.', quiz: { question: 'Why does back-rank mate happen so often?', options: ['Kings are lazy', 'Pawns f7/g7/h7 block the king\'s escape', 'Rooks are the strongest piece', 'It is the only legal mate'], answer: 1 } }
            ]
        },
        {
            id: 'smothered-mate', title: 'Smothered Mate', level: 'intermediate',
            description: 'A knight mate against a buried king.',
            goal: 'Recognize and deliver a smothered mate.',
            steps: [
                { title: 'The Idea', text: 'In a smothered mate, the enemy king is completely surrounded by his own pieces, and a knight delivers checkmate. The king cannot move; the knight cannot be blocked.' },
                { title: 'Typical Setup', text: 'A queen sacrifice on g8 forces the rook to capture, then Nf7 delivers mate. This pattern appears constantly in tactics puzzles.', board: '6rk/6pp/8/6N1/8/8/8/6K1 w - - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'Which piece delivers the smothered mate?', options: ['Queen', 'Rook', 'Knight', 'Bishop'], answer: 2 } }
            ]
        },
        {
            id: 'italian-game', title: 'Opening: The Italian Game', level: 'intermediate',
            description: 'A classical opening built on rapid development.',
            goal: 'Play the Italian Game confidently as White.',
            steps: [
                { title: 'Main Line', text: '1.e4 e5 2.Nf3 Nc6 3.Bc4 — White develops quickly and aims the bishop at f7, the weakest point in Black\'s camp.' },
                { title: 'Ideas for Both Sides', text: 'White often follows with d3, c3, and a slow buildup (Giuoco Pianissimo). Sharp players go for the Fried Liver Attack with 4.Ng5 in the Two Knights Defense.', board: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'What square does the Italian bishop target?', options: ['e5', 'f7', 'h7', 'd5'], answer: 1 } }
            ]
        },
        {
            id: 'sicilian-defense', title: 'Opening: The Sicilian Defense', level: 'intermediate',
            description: 'Black\'s most popular reply to 1.e4.',
            goal: 'Understand the Sicilian\'s fighting spirit.',
            steps: [
                { title: 'Main Line', text: '1.e4 c5 — Black fights for the center asymmetrically, accepting a slightly cramped position in exchange for dynamic counterplay on the queenside.' },
                { title: 'Key Variations', text: 'The Najdorf, Dragon, Sveshnikov, and Classical are the main branches. Each is a complete world of theory — pick one and master it.', board: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'What is Black\'s main idea in the Sicilian?', options: ['Symmetrical defense', 'Asymmetrical counterplay on the queenside', 'Immediate mate', 'Giving up the center forever'], answer: 1 } }
            ]
        },
        {
            id: 'french-defense', title: 'Opening: The French Defense', level: 'intermediate',
            description: 'A solid, strategic reply to 1.e4.',
            goal: 'Play the French Defense as Black.',
            steps: [
                { title: 'Main Line', text: '1.e4 e6 — Black prepares ...d5 to challenge White\'s center. The result is a slightly cramped but very solid position with rich strategic play.' },
                { title: 'Typical Play', text: 'White often gains space, but Black attacks the pawn chain with ...c5 and ...f6. The Winawer and Classical are the main branches.', board: 'rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'What is Black\'s main pawn break in the French?', options: ['...c5', '...h5', '...a6', '...e5'], answer: 0 } }
            ]
        },
        {
            id: 'queens-gambit', title: "Opening: The Queen's Gambit", level: 'intermediate',
            description: 'A timeless classical opening for White.',
            goal: 'Play 1.d4 d5 2.c4 with understanding.',
            steps: [
                { title: 'Main Line', text: '1.d4 d5 2.c4 — White offers a pawn to dominate the center. Black can accept (Queen\'s Gambit Accepted) or decline (Queen\'s Gambit Declined).' },
                { title: 'Real Idea', text: 'The pawn is not really meant to be won. If Black grabs it, White gets the center. If Black declines, White gets a space advantage and easier development.', board: 'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'Is the c4 pawn really being sacrificed in the Queen\'s Gambit?', options: ['Yes, unconditionally', 'No — if captured, White gets a strong center', 'Yes, always', 'Only in the endgame'], answer: 1 } }
            ]
        },
        {
            id: 'pawn-structures', title: 'Pawn Structures', level: 'intermediate',
            description: 'The skeleton that defines the whole game.',
            goal: 'Recognize and play around key pawn formations.',
            steps: [
                { title: 'Why Pawns Matter', text: 'Pawns cannot move backward, so their structure sets the long-term character of the position. Pieces come and go; pawns stay.' },
                { title: 'Key Types', text: 'Isolated pawn (no friendly pawns on adjacent files), doubled pawns (two on the same file), backward pawn (behind the rest and hard to advance), passed pawn (no enemy pawns blocking or guarding its advance).' },
                { title: 'Practical Rule', text: 'Play against your opponent\'s pawn weaknesses and around your own. Fix targets, then attack them with rooks and knights.', board: '8/8/8/3p4/3P4/8/8/8 w - - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'What is a passed pawn?', options: ['A pawn that has moved', 'A pawn with no enemy pawns ahead or on adjacent files', 'A doubled pawn', 'A pawn about to promote'], answer: 1 } }
            ]
        },
        {
            id: 'beginner-mistakes', title: 'Common Beginner Mistakes', level: 'intermediate',
            description: 'Avoid the traps that cost most games.',
            goal: 'Reduce blunders by building better habits.',
            steps: [
                { title: 'Blind Material Loss', text: 'Before every move ask: "Can my piece be captured?" and "What did my opponent\'s last move threaten?" Half of lost games are decided by simple oversights.', board: 'rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 3' },
                { title: 'Forgetting the Back Rank', text: 'Do not leave your king trapped on the 8th rank. Push h3 or g3 to give him air — a small pawn move that prevents disaster.' },
                { title: 'Too Many Pawn Moves', text: 'Every pawn move is permanent. Loose pawns become lifetime targets. Move only the pawns you must.' },
                { title: 'Kuis', text: '', quiz: { question: 'What habit reduces blunders the most?', options: ['Playing faster', 'Checking threats before every move', 'Repeating the same plan', 'Ignoring the opponent'], answer: 1 } }
            ]
        },

        /* ─────────────────────────────────────────────
           ADVANCED
           ───────────────────────────────────────────── */
        {
            id: 'endgame-kq-vs-k', title: 'Endgame: K+Q vs K', level: 'advanced',
            description: 'The first mate every player must master.',
            goal: 'Mate with king and queen efficiently and safely.',
            steps: [
                { title: 'Drive to the Edge', text: 'Use the queen to cut off ranks or files and push the enemy king toward the edge. Keep the queen a knight\'s-move away to avoid stalemate.' },
                { title: 'Bring the King', text: 'Once the enemy king is cornered, walk your own king closer. Mate when the queen is protected by your king (or delivers check next to the enemy king).', board: '7k/8/5K2/8/8/8/8/3Q4 w - - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'What is the biggest risk when mating with K+Q?', options: ['Losing the queen', 'Stalemate', 'Running out of moves', 'Time trouble'], answer: 1 } }
            ]
        },
        {
            id: 'endgame-kr-vs-k', title: 'Endgame: K+R vs K', level: 'advanced',
            description: 'The classic rook ladder mate.',
            goal: 'Force mate with king and rook in under 15 moves.',
            steps: [
                { title: 'Cut and Push', text: 'Use the rook to cut off the enemy king along a rank or file. Advance your own king toward the corner. The enemy king has nowhere to go.' },
                { title: 'The Ladder', text: 'When the king reaches the edge, slide the rook up one rank at a time — this is the ladder mate. Mate is delivered with the king defending the rook.', board: '6k1/8/6K1/8/8/8/8/R6R w - - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'What is the safest mating method with K+R?', options: ['Push the rook straight up', 'Cut, then bring the king to support the rook', 'Chase the king with the rook alone', 'Promote another pawn'], answer: 1 } }
            ]
        },
        {
            id: 'endgame-kp-vs-k', title: 'Endgame: K+P vs K', level: 'advanced',
            description: 'Master key squares and pawn promotion.',
            goal: 'Know when a K+P endgame is won or drawn.',
            steps: [
                { title: 'Key Squares', text: 'The attacker wins if his king reaches a key square in front of the pawn. For a pawn on e2, the key squares are d4, e4, f4 — reach one with your king to move and the pawn promotes by force.' },
                { title: 'Rook Pawns', text: 'A rook pawn (a-file or h-file) with a defending king in the corner is always drawn. Central and knight pawns are usually won when the attacking king leads.', board: '8/8/8/8/8/8/4P3/4K1k1 w - - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'Which pawn endgame is generally drawn?', options: ['Central pawn on the 4th rank', 'Knight pawn', 'Rook pawn with the defender in the corner', 'Bishop pawn on the 5th'], answer: 2 } }
            ]
        },
        {
            id: 'endgame-opposition', title: 'Endgame: The Opposition', level: 'advanced',
            description: 'Kings face to face — who wins the race?',
            goal: 'Use the opposition to force pawn promotion.',
            steps: [
                { title: 'Definition', text: 'When two kings stand on the same file or rank with one empty square between them, the side NOT to move has the opposition. The opponent must give way.' },
                { title: 'Direct Opposition', text: 'The most common form is on a single file. With the opposition, the attacker\'s king can step around and win the defender\'s pawn, or his own pawn promotes.', board: '8/8/8/4k3/8/8/8/4K3 w - - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'Who has the opposition?', options: ['The side to move', 'The side NOT to move', 'Both sides', 'Neither'], answer: 1 } }
            ]
        },
        {
            id: 'lucena-position', title: 'Endgame: The Lucena Position', level: 'advanced',
            description: 'The winning rook endgame every player must memorize.',
            goal: 'Convert a K+R+P vs K+R endgame.',
            steps: [
                { title: 'The Setup', text: 'King on the promotion square, pawn on the 7th rank, enemy rook cutting off the king along a file. This is winning for the side with the pawn — if you know the technique.' },
                { title: 'Build the Bridge', text: '1.Rf4! Then bring the king out to e7, and finally 3.Rf1–f4 with the rook shielding the king from checks. The pawn promotes.', board: '3K4/3P1k2/8/8/8/8/1r6/4R3 w - - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'What is the key idea in the Lucena position?', options: ['Push the pawn immediately', 'Build a bridge with the rook to shield the king', 'Trade rooks', 'Sacrifice the pawn'], answer: 1 } }
            ]
        },
        {
            id: 'philidor-position', title: 'Endgame: The Philidor Position', level: 'advanced',
            description: 'How to draw a rook endgame down a pawn.',
            goal: 'Save lost-looking rook endgames with the Philidor defense.',
            steps: [
                { title: 'The Setup', text: 'Defender\'s rook on the third rank stops the enemy king from advancing. The pawn cannot promote on its own.' },
                { title: 'Swing Behind', text: 'The moment the pawn advances past the third rank, swing the rook behind the pawn to deliver endless checks from the side. This draws by repetition.', board: '8/8/8/3k4/3p4/3R4/3K4/8 b - - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'Where does the defending rook belong in the Philidor?', options: ['Behind the pawn from the start', 'On the third rank, then behind the pawn', 'On the eighth rank', 'Next to its own king'], answer: 1 } }
            ]
        },
        {
            id: 'positional-sacrifice', title: 'Positional Sacrifice', level: 'advanced',
            description: 'Give material for long-term compensation.',
            goal: 'Judge when material can be traded for structure or initiative.',
            steps: [
                { title: 'The Exchange Sacrifice', text: 'Trading a rook for a knight or bishop (about 2 points down) can be worth it when it shatters the opponent\'s structure, fixes a weak square, or activates all your pieces.' },
                { title: 'Trust the Position', text: 'Positional sacrifices are not calculated to the end — they are felt. Consider development, king safety, and pawn structure instead of pure material count.', board: 'r4rk1/1pp2ppp/p1np4/4p3/2B1P3/2P2N2/PP3PPP/R3R1K1 w - - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'What is an exchange sacrifice?', options: ['Rook for a pawn', 'Rook for a knight or bishop', 'Queen for two rooks', 'Bishop for a knight'], answer: 1 } }
            ]
        },
        {
            id: 'prophylaxis', title: 'Prophylaxis', level: 'advanced',
            description: "Nimzowitsch's art of prevention.",
            goal: 'Stop opponent plans before they begin.',
            steps: [
                { title: 'The Idea', text: 'Prophylaxis means preventing the opponent\'s idea before it starts. Sometimes the best move is a quiet one that steals the enemy\'s plan.' },
                { title: 'Ask the Question', text: 'Every move, ask: "What does my opponent want to do?" Then, if you cannot improve your own position, stop him.', board: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'What is the key question of prophylaxis?', options: ['Can I capture something?', 'What does my opponent want to do?', 'Is my king safe?', 'What is my material count?'], answer: 1 } }
            ]
        },
        {
            id: 'piece-activity', title: 'Piece Activity', level: 'advanced',
            description: 'The best piece on the worst square still loses.',
            goal: 'Value activity over rigid material equality.',
            steps: [
                { title: 'Activity Wins Games', text: 'A passive rook on a1 can be worth less than an active bishop dominating the center. Activity is the currency of advanced chess.' },
                { title: 'Trade Bad, Keep Good', text: 'Trade your bad pieces for your opponent\'s good ones. Keep your active pieces on the board — they will decide the game.', board: 'r2q1rk1/pp2ppbp/2np1np1/8/2PP4/1PN1B3/P3BPPP/R2Q1RK1 w - - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'When should you trade pieces?', options: ['Always', 'To fix bad pieces and open lines for good ones', 'Never', 'Only when ahead'], answer: 1 } }
            ]
        },
        {
            id: 'greek-gift', title: 'The Greek Gift Sacrifice', level: 'advanced',
            description: 'Bxh7+ and the mating attack that follows.',
            goal: 'Execute and defend against the classical Greek Gift.',
            steps: [
                { title: 'The Pattern', text: 'Bxh7+ Kxh7, Ng5+ Kg8 (or Kg6), Qh5 — the queen and knight storm the weakened kingside. The bishop sacrifice opens the h-file and drags the king into the open.' },
                { title: 'When It Works', text: 'The Greek Gift works best when: (1) Black has castled kingside, (2) the h7 pawn is only defended by the king, (3) White has a knight able to reach g5, and (4) Black has few defenders near his king.', board: 'r1bq1rk1/ppp1bppp/2n2n2/3p4/3P4/2N1PN2/PPQ1BPPP/R1B2RK1 w - - 0 1' },
                { title: 'Kuis', text: '', quiz: { question: 'Which move begins the Greek Gift?', options: ['Qh5', 'Bxh7+', 'Ng5+', 'Rf3'], answer: 1 } }
            ]
        }
    ];
})();