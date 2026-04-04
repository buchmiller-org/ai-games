document.addEventListener('DOMContentLoaded', () => {
  const boardEl = document.getElementById('board');
  const statusEl = document.getElementById('status');
  const resetBtn = document.getElementById('reset-btn');
  
  let game = new Chess();
  let selectedSquare = null;
  let possibleMoves = [];
  
  // Portals
  let portals = { A: null, B: null };

  const PIECE_SYMBOLS = {
    'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚',
    'P': '♙', 'N': '♘', 'B': '♗', 'R': '♖', 'Q': '♕', 'K': '♔'
  };

  function initGame() {
    game = new Chess();
    selectedSquare = null;
    possibleMoves = [];
    
    // Pick 2 random valid portal locations on ranks 3-6 (to avoid immediate spawn overlaps)
    const files = ['a','b','c','d','e','f','g','h'];
    const ranks = ['3','4','5','6'];
    let allSquares = [];
    for(let f of files) {
      for(let r of ranks) {
        allSquares.push(f+r);
      }
    }
    
    // Shuffle and pick 2
    for (let i = allSquares.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allSquares[i], allSquares[j]] = [allSquares[j], allSquares[i]];
    }
    
    portals.A = allSquares[0];
    portals.B = allSquares[1];

    updateStatus();
    renderBoard();
  }

  function getSquareColor(fileIndex, rankIndex) {
    return (fileIndex + rankIndex) % 2 === 0 ? 'light' : 'dark';
  }
  
  function getSquareId(fileIndex, rankIndex) {
    const files = 'abcdefgh';
    return `${files[fileIndex]}${8 - rankIndex}`;
  }

  function renderBoard() {
    boardEl.innerHTML = '';
    const board = game.board();

    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const sqId = getSquareId(f, r);
        const sqEl = document.createElement('div');
        sqEl.className = `square ${getSquareColor(f, r)}`;
        sqEl.dataset.square = sqId;

        // Render portal
        if (sqId === portals.A) {
          const pEl = document.createElement('div');
          pEl.className = 'portal portal-a';
          sqEl.appendChild(pEl);
        } else if (sqId === portals.B) {
          const pEl = document.createElement('div');
          pEl.className = 'portal portal-b';
          sqEl.appendChild(pEl);
        }

        // Highlight selected
        if (selectedSquare === sqId) {
          sqEl.classList.add('selected');
        }

        // Highlight possible moves
        if (possibleMoves.some(m => m.to === sqId)) {
          sqEl.classList.add('highlight');
        }

        // Render piece
        const piece = board[r][f];
        if (piece) {
          const pieceEl = document.createElement('div');
          pieceEl.className = `piece ${piece.color === 'w' ? 'white' : 'black'}`;
          pieceEl.textContent = PIECE_SYMBOLS[piece.color === 'w' ? piece.type.toUpperCase() : piece.type];
          sqEl.appendChild(pieceEl);
        }

        sqEl.addEventListener('click', () => onSquareClick(sqId));
        boardEl.appendChild(sqEl);
      }
    }
  }

  function onSquareClick(sqId) {
    if (game.game_over()) return;

    // If clicking a possible move destination
    const move = possibleMoves.find(m => m.to === sqId);
    if (selectedSquare && move) {
      makeMove(move);
    } else {
      // Select piece
      const piece = game.get(sqId);
      if (piece && piece.color === game.turn()) {
        selectedSquare = sqId;
        possibleMoves = game.moves({ square: sqId, verbose: true });
        renderBoard();
      } else {
        // Deselect
        selectedSquare = null;
        possibleMoves = [];
        renderBoard();
      }
    }
  }

  function makeMove(move) {
    game.move(move);
    selectedSquare = null;
    possibleMoves = [];
    
    // Re-render to show piece at destination before teleport
    renderBoard();
    updateStatus();

    // Check teleport
    const destSq = move.to;
    let targetPortal = null;
    let originPortal = null;

    if (destSq === portals.A) {
      originPortal = portals.A;
      targetPortal = portals.B;
    } else if (destSq === portals.B) {
      originPortal = portals.B;
      targetPortal = portals.A;
    }

    if (targetPortal) {
      handleTeleport(originPortal, targetPortal, destSq);
    } else {
      checkGameEnd();
    }
  }

  function handleTeleport(originSq, targetSq, pieceSq) {
    const piece = game.get(pieceSq); // The piece that just landed
    const existingTargetPiece = game.get(targetSq);

    // If target has own piece, teleport fails (too crowded)
    if (existingTargetPiece && existingTargetPiece.color === piece.color) {
       // Teleport fizzles
       checkGameEnd();
       return;
    }

    // Play some animation class
    const originUiSq = document.querySelector(`[data-square="${originSq}"]`);
    const pieceEl = originUiSq.querySelector('.piece');
    if (pieceEl) {
      pieceEl.classList.add('teleporting');
      
      setTimeout(() => {
         // Perform manual chess.js teleport
         game.remove(originSq);
         if (existingTargetPiece) {
            // Telefrag!
            game.remove(targetSq);
         }
         game.put({ type: piece.type, color: piece.color }, targetSq);
         
         // Fix turn missing if we alter state manually? 
         // Actually game.put doesn't change turns, but game.move already changed the turn! 
         // So standard turn flow is preserved.

         // We must manually check for Check/Mate since we shifted a piece post-move.
         updateStatus();
         renderBoard();
         checkGameEnd();
      }, 600); // match animation duration
    }
  }

  function updateStatus() {
    let turnText = game.turn() === 'w' ? 'White' : 'Black';
    let statusText = `${turnText} to move`;
    
    statusEl.className = 'status-msg';

    if (game.in_checkmate()) {
      statusText = `Game Over - ${turnText === 'White' ? 'Black' : 'White'} wins!`;
      statusEl.classList.add('mate');
    } else if (game.in_draw()) {
      statusText = 'Game Over - Draw';
    } else if (game.in_check()) {
      statusText = `${turnText} is in Check!`;
      statusEl.classList.add('check');
    }

    statusEl.textContent = statusText;
  }

  function checkGameEnd() {
    // Fired after teleport to ensure state is finalized
    if (game.game_over()) {
      selectedSquare = null;
      possibleMoves = [];
      updateStatus();
    }
  }

  resetBtn.addEventListener('click', initGame);

  // Start
  initGame();
});
