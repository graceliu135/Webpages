//
// Variables
//

var baseState = function () {
	return [null, null, null, null, null, null, null, null, null];
};
var historyState = [];
var currentState, turn;


//
// Methods
//

/**
 * Check if there's a winner
 */
var isWinner = function () {

	// Possible winning combinations
	var wins = [
		[0,1,2],
		[3,4,5],
		[6,7,8],
		[0,3,6],
		[1,4,7],
		[2,5,8],
		[0,4,8],
		[2,4,6]
	];

	// Check if there's a winning combo
	var isWinner = wins.filter(function (win) {
		return (currentState[win[0]] && currentState[win[0]] === currentState[win[1]] && currentState[win[0]] === currentState[win[2]]);
	});

	// Return the winner, or false if there isn't one
	return (isWinner.length > 0 ? currentState[isWinner[0][0]] : false);

};

/**
 * Check if the square is first in the row
 * @param  {Integer}  id The ID for the square
 * @return {Boolean}     Returns true if first in the row
 */
var isFirstInRow = function (id) {
	return (id + 1) % 3 === 1;
};

/**
 * Check if the square is last in the row
 * @param  {Integer}  id The ID for the square
 * @return {Boolean}     Returns true if last in the row
 */
var isLastInRow = function (id) {
	return (id + 1) % 3 === 0;
};

/**
 * Build each square of the game board
 * @param  {Array}   state  The board state
 * @param  {Boolean} winner If true, someone won the game
 * @return {String}         The markup
 */
var buildSquares = function (state, winner) {

	// Setup rows
	var rows = '';

	// Loop through each square in the state
	state.forEach(function (square, id) {

		// Variables
		var value = square ? square : '';
		var selected = square ? ' aria-pressed="true"' : '';
		var disabled = square || winner ? ' disabled' : '';

		// Check if it's a new row
		if (isFirstInRow(id)) {
			rows += '<tr>';
		}
		rows += '<td><button class="game-square" data-id="' + id + '"' + selected + disabled + '>' + value + '</button></td>';

		// Check if it's the last column in a row
		if (isLastInRow(id)) {
			rows += '</tr>';
		}

	});

	return rows;

};

/**
 * Build the history state buttons markup
 * @return {String} The markup
 */
var buildHistory = function () {

	// Setup history markup
	var history = '';

	// If there's a history state, loop through each state and build a button
	if (historyState.length > 0) {
		history += '<h2>Game History</h2><ol>';
		historyState.forEach(function (move, index) {
			history += '<li><button data-history="' + move.toString() + '">Go to move # ' + (index + 1) + '</button></li>';
		});
		history += '</ol>';
	}

	return history;

};

/**
 * Build the game board
 * @param  {Array} state The state to build from
 * @return {String}      The markup based on the state
 */
var buildBoard = function (state) {

	// Check if there's a winner
	var winner = isWinner();

	// Setup the board
	var rows = winner ? '<p><strong>' + winner + ' is the winner!</string></p>' : '';
	rows += '<table><tbody>';

	// Create each square
	rows += buildSquares(state, winner);
	rows += '</tbody></table><p><button id="play-again">Play Again</button></p>';

	// Create game history
	rows += buildHistory();

	return rows;
};

/**
 * Update the board based on a state
 * @param  {Array} state The state to update from (optional, defaults to currentState)
 */
var updateBoard = function (state) {
	var board = document.querySelector('#game-board')
	if (!board) return;
	board.innerHTML = buildBoard(state || currentState);
};

/**
 * Render the board again based on the current user's turn
 * @param  {Node} square The square that was selected
 */
var renderTurn = function (square) {

	// Get selected value
	var selected = square.getAttribute('data-id');
	if (!selected) return;

	// Update state
	currentState[selected] = turn;

	// Add a historical state
	historyState.push(currentState.slice());

	// Render with new state
	updateBoard();

	// Update turn
	turn = turn === 'X' ? 'O' : 'X';

};

/**
 * Reset the board to it's base state
 */
var resetBoard = function () {
	currentState = baseState();
	historyState = [];
	turn = 'X';
	updateBoard();
};


//
// Inits & Event Listeners
//

// Setup the board
resetBoard();

// Listen for selections
document.addEventListener('click', function (event) {

	// If a .game-square was clicked
	if (event.target.matches('.game-square') && !event.target.hasAttribute('disabled')) {
		renderTurn(event.target);
	}

	// If #play-again was clicked
	if (event.target.matches('#play-again')) {
		resetBoard();
	}

	// If a historical button was clicked
	if (event.target.matches('[data-history]')) {
		updateBoard(event.target.getAttribute('data-history').split(','));
	}

}, false);