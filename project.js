// 1) Deposit money
// 2) Choose number o flines to bet on
// 3) Collect Bet amount
// 4) Spin
// 5) Check if user won
// 6) Give winning amount if they won
// 7) Play again?

const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    "A" : 3,
    "B" : 5,
    "C" : 7,
    "D" : 9
}

const SYMBOL_VALUES = {
    "A" : 5,
    "B" : 4,
    "C" : 3,
    "D" : 2
}

const deposit = () => {
    while(true){
        const depositAmount = prompt("Enter a deposit amount: ");
        const number_depositAmount = parseFloat(depositAmount);

        if(isNaN(number_depositAmount) || number_depositAmount <= 0){
            console.log("Invalid deposit amount, try again.");
        }
        else{
            return number_depositAmount;
        }
    }
}

const getNumofLines = () => {
    while(true){
        const NumofLines = prompt("Enter number of lines: ");
        const number_lines = parseFloat(NumofLines);

        if(isNaN(number_lines) || number_lines <= 0 || number_lines > 3){
            console.log("Invalid number of lines, try again.");
        }
        else{
            return number_lines;
        }
    }
}

const getBet = (balance, lines) => {
    while(true){
        const bet = prompt("Enter bet amount: ");
        const number_bet = parseFloat(bet);

        if(isNaN(number_bet) || number_bet <= 0 || number_bet > (balance/lines)){
            console.log("Invalid bet amount, try again.");
        }
        else{
            return number_bet;
        }
    }
}

const spin = () => {
    const symbols = [];

    for(const [symbol, count] of Object.entries(SYMBOLS_COUNT)){
        for(let i = 0; i < count; i++){
            symbols.push(symbol);
        }
    }

    const reels = [];
    for(let i = 0; i < COLS; i++){
        reels.push([]);
        const reel_symbols = [...symbols];
        for(let j = 0; j < ROWS; j++){
            const randomIndex = Math.floor(Math.random() * reel_symbols.length);
            const selected_symbol = reel_symbols[randomIndex];
            reels[i].push(selected_symbol);
            reel_symbols.splice(randomIndex, 1);
        }
    }

    return reels;
}

const transpose = (reels) => {
    const rows = [];

    for(let i = 0; i < ROWS; i++){
        rows.push([]);
        for(let j = 0; j < COLS; j++){
            rows[i].push(reels[j][i]);
        }
    }

    return rows;
}

const printRows = (rows) => {
    for(const row of rows){
        let rowString = "";
        for(const[i, symbol] of row.entries()){
            rowString += symbol;
            if(i != row.length -1){
                rowString += " | ";
            } 
        }
        console.log(rowString);
    }
}

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for(let row = 0; row < lines; row++){
        const symbols = rows[row];
        let allSame = true;

        for(const symbol of symbols){
            if(symbol != symbols[0]){
                allSame = false;
                break;
            }
        }

        if(allSame){
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }

    return winnings;
}

const game = () => {
    let balance = deposit();

    while(true){
        console.log("You have $" + balance);
        const numberOfLines = getNumofLines();
        const betAmount = getBet(balance, numberOfLines);
        balance -= betAmount * numberOfLines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, betAmount, numberOfLines);
        balance += winnings;
        console.log("You won, $" + winnings.toString());

        if(balance <= 0){
            console.log("You ran out of money.")
            break
        }

        const playAgain = prompt("Do you want to play again (y/n): ")
        const depositA = prompt("Do you want to deposit more money (y/n): ")
        if(playAgain != "y"){
            break;
        }
        if(depositA == "y"){
            balance += deposit();
        }
    }

    const playAgain = prompt("Do you want to play again (y/n): ")
    if(playAgain == "y"){
        game()
    }
}

game();



