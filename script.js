'use strict';

// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const createUserNames = (accs) => {
    accs.forEach((acc) => {
        acc.userName = acc.owner
            .toLowerCase()
            .split(' ')
            .map((initName) => initName[0])
            .join('');
    });
};
createUserNames(accounts);

const updateUI = (acc) => {
    // display account balacne
    calcDispalyBalance(acc);

    // display movments
    displayMovement(acc);

    // deposits, widthrawals and interest
    calcDiplaySummary(acc);
};

const displayMovement = (acc) => {
    containerMovements.innerHTML = '';

    acc.movements.forEach((mov, i) => {
        const movementType = mov > 0 ? 'deposit' : 'withdrawal';
        const html = `
            <div class="movements__row">
                <div class="movements__type movements__type--${movementType}"> ${
            i + 1
        } ${movementType}</div>
                <div class="movements__date">24/01/2037</div>
                <div class="movements__value">${mov}€</div>
            </div>
        `;
        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
};

const calcDispalyBalance = (acc) => {
    const balance = acc.movements.reduce((acc, curr) => acc + curr);
    labelBalance.textContent = `${balance}€`;
    acc.balance = balance;
};

const calcDiplaySummary = (acc) => {
    // display deposits
    const totalDeposits = acc.movements
        .filter((mov) => mov > 0)
        .reduce((acc, mov) => acc + mov);
    labelSumIn.textContent = `${totalDeposits}€`;

    // display withdrawals
    const totalWithdrawals = acc.movements
        .filter((mov) => mov < 0)
        .reduce((acc, mov) => acc + mov);
    labelSumOut.textContent = `${totalWithdrawals}€`;

    // display interest rates
    const totalInterest = acc.movements
        .filter((deposit) => deposit > 0)
        .map((deposit) => (deposit * acc.interestRate) / 100)
        .filter((deposit) => deposit > 1)
        .reduce((acc, curr) => acc + curr);
    labelSumInterest.textContent = `${totalInterest}€`;
};

let currentAccount;
const loginFunctionality = (e) => {
    e.preventDefault();

    const enteredUsername = inputLoginUsername.value.trim();
    const entredPin = Number(inputLoginPin.value.trim());

    currentAccount = accounts.find((acc) => acc.userName === enteredUsername);

    // check the password
    if (currentAccount?.pin === entredPin) {
        // wlc message
        labelWelcome.textContent = `Welcom Back, ${
            currentAccount.owner.split(' ')[0]
        }`;

        // Display the main application UI
        containerApp.style.opacity = 1;
    } else {
        labelWelcome.textContent = 'Incorrect Login Info!';
    }

    updateUI(currentAccount);

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
};

const moneyTransferFunctionality = (e) => {
    e.preventDefault();

    // Get the transfer user and amount
    const enteredTransferToAccount = accounts.find(
        (acc) => acc.userName === inputTransferTo.value.trim()
    );
    const enteredTranserAmount = Number(inputTransferAmount.value.trim());

    // transfer input validation
    if (enteredTranserAmount == '' || enteredTransferToAccount == '')
        return (labelWelcome.textContent =
            'Please enter valid username and account');

    // check for sender and receiver
    if (
        currentAccount?.balance >= enteredTranserAmount &&
        enteredTransferToAccount?.userName !== currentAccount.userName
    ) {
        // transfer operation
        currentAccount.movements.push(-enteredTranserAmount);
        enteredTransferToAccount.movements.push(enteredTranserAmount);
    } else {
        labelWelcome.textContent = "Your Balance Isn't Enough ";
    }
    // update the UI
    updateUI(currentAccount);
    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferAmount.blur();
};

// eventlisteners
btnLogin.addEventListener('click', loginFunctionality);
btnTransfer.addEventListener('click', moneyTransferFunctionality);

const currencies = new Map([
    ['USD', 'United States dollar'],
    ['EUR', 'Euro'],
    ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
