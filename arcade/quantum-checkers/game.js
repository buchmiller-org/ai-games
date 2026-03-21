    const ROWS = 8;
    const COLS = 8;
    // 0: empty, 1: p1 (blue), 2: p2 (magenta), 3: p1 king, 4: p2 king
    let boardState = [];
    let currentPlayer = 1;
    let selectedPos = null;
    let validMoves = []; // Array of {r, c, jumps: [{r, c}...]}

    let teleports = { 1: 2, 2: 2 };
    let teleportMode = false;

    const boardEl = document.getElementById('board');
    const panel1 = document.getElementById('panel-1');
    const panel2 = document.getElementById('panel-2');
    const btnTp1 = document.getElementById('tp-btn-1');
    const btnTp2 = document.getElementById('tp-btn-2');
    const gameOverEl = document.getElementById('game-over');
    const winnerText = document.getElementById('winner-text');

    function initGame() {
      boardState = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if ((r + c) % 2 === 1) {
            if (r < 3) boardState[r][c] = 2; // P2 top
            else if (r > 4) boardState[r][c] = 1; // P1 bottom
          }
        }
      }
      currentPlayer = 1;
      selectedPos = null;
      validMoves = [];
      teleports = { 1: 2, 2: 2 };
      teleportMode = false;
      gameOverEl.style.display = 'none';
      updateUI();
      renderBoard();
    }

    function renderBoard() {
      boardEl.innerHTML = '';
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const isDark = (r + c) % 2 === 1;
          const cell = document.createElement('div');
          cell.className = `cell ${isDark ? 'dark' : 'light'}`;
          cell.dataset.r = r;
          cell.dataset.c = c;

          if (isDark) {
            cell.addEventListener('click', () => handleCellClick(r, c));
          }

          // Check highlights
          const move = validMoves.find(m => m.r === r && m.c === c);
          if (move && !teleportMode) {
            cell.classList.add('highlight-move');
          } else if (teleportMode && isDark && boardState[r][c] === 0 && selectedPos) {
            cell.classList.add('highlight-teleport');
            cell.classList.add(currentPlayer === 1 ? 't-p1' : 't-p2');
          }

          const pieceVal = boardState[r][c];
          if (pieceVal > 0) {
            const piece = document.createElement('div');
            piece.className = 'piece';
            piece.classList.add(pieceVal === 1 || pieceVal === 3 ? 'p1' : 'p2');
            if (pieceVal > 2) piece.classList.add('king');

            if (selectedPos && selectedPos.r === r && selectedPos.c === c) {
              piece.classList.add('selected');
            }

            cell.appendChild(piece);
          }
          boardEl.appendChild(cell);
        }
      }
    }

    function updateUI() {
      panel1.classList.toggle('active', currentPlayer === 1);
      panel2.classList.toggle('active', currentPlayer === 2);

      btnTp1.innerText = `Teleports: ${teleports[1]}`;
      btnTp2.innerText = `Teleports: ${teleports[2]}`;

      btnTp1.disabled = (currentPlayer !== 1 || teleports[1] <= 0);
      btnTp2.disabled = (currentPlayer !== 2 || teleports[2] <= 0);

      btnTp1.classList.toggle('active-mode', teleportMode && currentPlayer === 1);
      btnTp2.classList.toggle('active-mode', teleportMode && currentPlayer === 2);
    }

    btnTp1.addEventListener('click', () => toggleTeleportMode(1));
    btnTp2.addEventListener('click', () => toggleTeleportMode(2));

    function toggleTeleportMode(player) {
      if (currentPlayer !== player || teleports[player] <= 0) return;
      teleportMode = !teleportMode;
      // If turning off teleport mode, clear selection to re-evaluate normal valid moves
      if (!teleportMode) selectedPos = null;
      validMoves = [];
      updateUI();
      renderBoard();
    }

    function handleCellClick(r, c) {
      const pVal = boardState[r][c];
      const isMyPiece = (currentPlayer === 1 && (pVal === 1 || pVal === 3)) ||
        (currentPlayer === 2 && (pVal === 2 || pVal === 4));

      if (isMyPiece) {
        selectedPos = { r, c };
        if (!teleportMode) {
          validMoves = getMovesFor(r, c, false);
          // If jump is mandatory, filter out non-jumps dynamically if we want standard rules.
          // For AI Arcade simplicity: a player MUST jump if any piece can jump.
          // We will enforce jump rules across the whole board to be strictly true to checkers.
          const allJumps = getAllJumpsFor(currentPlayer);
          if (allJumps.length > 0) {
            validMoves = validMoves.filter(m => m.jumps.length > 0);
            if (validMoves.length === 0) {
              // Can't select a piece that has no jumps if another piece has a jump.
              selectedPos = null;
            }
          }
        }
        renderBoard();
        return;
      }

      if (selectedPos && boardState[r][c] === 0) {
        if (teleportMode) {
          executeTeleport(r, c);
        } else {
          const move = validMoves.find(m => m.r === r && m.c === c);
          if (move) executeMove(move);
        }
      }
    }

    function executeTeleport(targetR, targetC) {
      teleports[currentPlayer]--;
      const pVal = boardState[selectedPos.r][selectedPos.c];
      boardState[selectedPos.r][selectedPos.c] = 0;
      boardState[targetR][targetC] = pVal;

      teleportMode = false;
      addTeleportFx(targetR, targetC);

      checkPromotion(targetR, targetC);
      endTurn();
    }

    function addTeleportFx(r, c) {
      const idx = r * 8 + c;
      const cell = boardEl.children[idx];
      const fx = document.createElement('div');
      fx.className = 'teleport-fx';
      cell.appendChild(fx);
      setTimeout(() => fx.remove(), 500);
    }

    function executeMove(move) {
      const pVal = boardState[selectedPos.r][selectedPos.c];
      boardState[selectedPos.r][selectedPos.c] = 0;
      boardState[move.r][move.c] = pVal;

      // remove jumped pieces
      for (const j of move.jumps) {
        boardState[j.r][j.c] = 0;
      }

      // king promotion ends turn immediately if just promoted (checkers rule)
      const promoted = checkPromotion(move.r, move.c);

      // multi-jump logic
      if (!promoted && move.jumps.length > 0) {
        const furtherJumps = getMovesFor(move.r, move.c, true);
        if (furtherJumps.length > 0) {
          selectedPos = { r: move.r, c: move.c };
          validMoves = furtherJumps;
          renderBoard();
          return;
        }
      }

      endTurn();
    }

    function checkPromotion(r, c) {
      const p = boardState[r][c];
      if (p === 1 && r === 0) { boardState[r][c] = 3; return true; }
      if (p === 2 && r === 7) { boardState[r][c] = 4; return true; }
      return false;
    }

    function endTurn() {
      selectedPos = null;
      validMoves = [];
      teleportMode = false;
      currentPlayer = currentPlayer === 1 ? 2 : 1;

      checkWin();

      updateUI();
      renderBoard();
    }

    function checkWin() {
      // Very basic win check: if opponent has no valid moves or pieces, current player wins
      let p1HasMoves = false;
      let p2HasMoves = false;
      let p1Count = 0;
      let p2Count = 0;

      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const v = boardState[r][c];
          if (v === 1 || v === 3) { p1Count++; if (getMovesFor(r, c, false).length > 0) p1HasMoves = true; }
          if (v === 2 || v === 4) { p2Count++; if (getMovesFor(r, c, false).length > 0) p2HasMoves = true; }
        }
      }

      if (p1Count === 0 || (!p1HasMoves && p2Count > 0)) showWin(2);
      else if (p2Count === 0 || (!p2HasMoves && p1Count > 0)) showWin(1);
    }

    function showWin(winner) {
      gameOverEl.style.display = 'flex';
      winnerText.innerText = `Player ${winner} (${winner === 1 ? 'Blue' : 'Magenta'}) Wins!`;
      winnerText.style.color = winner === 1 ? 'var(--color-accent-blue)' : '#d946ef';
    }

    function getAllJumpsFor(player) {
      let jumps = [];
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const v = boardState[r][c];
          if ((player === 1 && (v === 1 || v === 3)) || (player === 2 && (v === 2 || v === 4))) {
            const m = getMovesFor(r, c, true);
            if (m.length > 0) jumps.push(...m);
          }
        }
      }
      return jumps;
    }

    function getMovesFor(r, c, mustJumpOnly) {
      const piece = boardState[r][c];
      const isKing = piece === 3 || piece === 4;
      const dRow = piece === 1 ? -1 : 1; // 1 goes UP, 2 goes DOWN

      let moves = [];
      let jumps = [];

      const dirs = isKing ? [[-1, -1], [-1, 1], [1, -1], [1, 1]] : [[dRow, -1], [dRow, 1]];

      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (inBounds(nr, nc)) {
          // Empty space
          if (boardState[nr][nc] === 0 && !mustJumpOnly) {
            moves.push({ r: nr, c: nc, jumps: [] });
          }
          // Enemy piece
          else if (isEnemy(piece, boardState[nr][nc])) {
            const jr = nr + dr, jc = nc + dc;
            if (inBounds(jr, jc) && boardState[jr][jc] === 0) {
              jumps.push({ r: jr, c: jc, jumps: [{ r: nr, c: nc }] });
            }
          }
        }
      }
      return jumps.length > 0 ? jumps : moves;
    }

    function isEnemy(myPiece, otherPiece) {
      if (otherPiece === 0) return false;
      const myTeam = (myPiece === 1 || myPiece === 3) ? 1 : 2;
      const otherTeam = (otherPiece === 1 || otherPiece === 3) ? 1 : 2;
      return myTeam !== otherTeam;
    }

    function inBounds(r, c) {
      return r >= 0 && r < 8 && c >= 0 && c < 8;
    }

    // Start
    initGame();
