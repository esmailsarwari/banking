'use strict';

// Data
const account1 = {
    userName: 'js',
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
    type: 'premium',
    movementsDate: [
        '2025-05-01T02:32:57.286Z',
        '2025-05-01T02:32:57.286Z',
        '2025-05-01T02:32:57.286Z',
        '2025-05-01T02:32:57.286Z',
        '2025-05-01T02:32:57.286Z',
        '2025-05-01T02:32:57.286Z',
        '2025-05-01T02:32:57.286Z',
        '2025-05-01T02:32:57.286Z',
    ],
    locale: 'en-US',
    currency: 'USD',
};

const account2 = {
    userName: 'jd',
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
    type: 'standard',
    movementsDate: [
        '2025-05-01T02:32:57.286Z',
        '2025-05-01T02:32:57.286Z',
        '2025-05-01T02:32:57.286Z',
        '2025-05-01T02:32:57.286Z',
        '2025-05-01T02:32:57.286Z',
        '2025-05-01T02:32:57.286Z',
        '2025-05-01T02:32:57.286Z',
        '2025-05-01T02:32:57.286Z',
    ],
    locale: 'en-UK',
    currency: 'GBP',
};

const account3 = {
    userName: 'stw',
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
    type: 'premium',
    movementsDate: [
        '2025-05-01T02:32:57.286Z',
        '2025-05-01T02:32:57.286Z',
        '2025-05-01T02:32:57.286Z',
        '2025-05-01T02:32:57.286Z',
        '2025-05-01T02:32:57.286Z',
        '2025-05-01T02:32:57.286Z',
        '2025-05-01T02:32:57.286Z',
        '2025-05-01T02:32:57.286Z',
    ],
    locale: 'en-gb',
    currency: 'GBP',
};

const account4 = {
    userName: 'ss',
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
    type: 'basic',
    movementsDate: [
        '2025-05-01T02:32:57.286Z',
        '2025-05-01T02:32:57.286Z',
        '2025-05-01T02:32:57.286Z',
        '2025-05-01T02:32:57.286Z',
        '2025-05-01T02:32:57.286Z',
        '2025-05-01T02:32:57.286Z',
        '2025-05-01T02:32:57.286Z',
        '2025-05-01T02:32:57.286Z',
    ],
    locale: 'sv-SV',
    currency: 'SEK',
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

const formateMovementsDate = (movDate) => {
    const calcDaysPassed = (date1, date2) =>
        Math.round(Math.abs((+date1 - +date2) / (24 * 60 * 60 * 1000)));
    const daysPassed = calcDaysPassed(new Date(), movDate);

    if (daysPassed === 0) return { fullDate: 'today' };
    if (daysPassed === 1) return { fullDate: 'Yesterday' };
    if (daysPassed <= 7) return `fullDate: ${daysPassed} days ago`;
    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'medium',
    }).format(movDate);
};

const formateCurreny = (value, locale, currency) => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(value);
};

const setLogoutTimer = () => {
    let timeOutDuration = 5000;

    // this function trigers the countdown
    const tick = () => {
        const timeOutMinute = String(Math.trunc(timeOutDuration / 60)).padStart(
            2,
            0
        );
        const timeOutSeconds = String(
            Math.trunc(timeOutDuration % 60)
        ).padStart(2, 0);

        labelTimer.textContent = `${timeOutMinute}:${timeOutSeconds}`;

        if (timeOutDuration === 0) {
            clearInterval(loginTimerCountDown);
            containerApp.style.opacity = 0;
            labelWelcome.textContent = 'Log in to get started';
        }

        timeOutDuration--;
    };

    // call tick function to start the countdown immediately after login
    tick();
    // then it gets called after every second
    const loginTimerCountDown = setInterval(tick, 1000);
    // return loggedin user timer to prevent overriding of multiple logged in user
    return loginTimerCountDown;
};

const createUserNames = (accs) => {
    accs.forEach((acc) => {
        acc.userName = acc.owner
            .toLowerCase()
            .split(' ')
            .map((initName) => initName[0])
            .join('');
    });
};

function updateUI(acc) {
    // display account balacne
    calcDispalyBalance(acc);

    // display movments
    displayMovement(acc);

    // deposits, widthrawals and interest
    calcDiplaySummary(acc);
}

const displayMovement = (acc, sort = false) => {
    containerMovements.innerHTML = '';

    // retrive account movements with its corresponding dates
    const movementsWithDates = acc.movements.map((mov, i) => ({
        movements: mov,
        movementsDate: acc.movementsDate.at(i),
    }));

    // Sort Movements
    if (sort) movementsWithDates.sort((a, b) => a.movements - b.movements);

    movementsWithDates.forEach((obj, i) => {
        // get the formated time and date
        const movDate = new Date(obj.movementsDate);
        const fullDateAndtime = formateMovementsDate(movDate);

        // localize the currency
        const localizedMovements = formateCurreny(
            obj.movements,
            acc.locale,
            acc.currency
        );

        // list the movements on the UI
        const movementType = obj.movements > 0 ? 'deposit' : 'withdrawal';
        const movementsHtmlElement = `
            <div class="movements__row">
                <div class="movements__type movements__type--${movementType}"> ${i + 1} ${movementType} </div>
                <div class="movements__date">${fullDateAndtime}</div>
                <div class="movements__value">${localizedMovements}</div>
            </div>
        `;
        containerMovements.insertAdjacentHTML('afterbegin',movementsHtmlElement);
    });
};

const calcDispalyBalance = (acc) => {
    // Get the users balance, using reduce method as it returns an accumulated number out of the transactions
    const balance = acc.movements.reduce((acc, curr) => acc + curr);
    // Assign Balance to user object
    acc.balance = balance;
    labelBalance.textContent = formateCurreny(
        acc.balance,
        acc.locale,
        acc.currency
    );
};

const calcDiplaySummary = (acc) => {
    // display deposits
    const totalDeposits = acc.movements
        .filter((mov) => mov > 0)
        .reduce((acc, mov) => acc + mov);
    labelSumIn.textContent = formateCurreny(
        totalDeposits,
        acc.locale,
        acc.currency
    );

    // display withdrawals
    const totalWithdrawals = acc.movements
        .filter((mov) => mov < 0)
        .reduce((acc, mov) => acc + mov);
    labelSumOut.textContent = formateCurreny(
        totalWithdrawals,
        acc.locale,
        acc.currency
    );

    // display interest rates
    const totalInterest = acc.movements
        .filter((deposit) => deposit > 0)
        .map((deposit) => (deposit * acc.interestRate) / 100)
        .filter((deposit) => deposit > 1)
        .reduce((acc, curr) => acc + curr);
    labelSumInterest.textContent = formateCurreny(
        totalInterest,
        acc.locale,
        acc.currency
    );
};

let currentAccount, loginTimerCountDown;
const loginFunctionality = (e) => {
    e.preventDefault();

    // Get the username and password
    const enteredUsername = inputLoginUsername.value.trim();
    const entredPin = Number(inputLoginPin.value.trim());

    // Retrieve the logged in user
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

    // Set local time and lanague for the logged in user
    const now = new Date();
    const userLocaleLanaguage = navigator.language;
    const options = {
        dateStyle: 'full',
        timeStyle: 'short',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
        [userLocaleLanaguage, 'en-US'],
        options
    ).format(now);

    // check if a user is logged in and clear their timeout
    if(loginTimerCountDown) clearInterval(loginTimerCountDown);
    // And then set timer for the newly logged in user
    loginTimerCountDown = setLogoutTimer();

    updateUI(currentAccount);

    // clear the input
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

        // Transfer date
        currentAccount.movementsDate.push(new Date().toISOString());
        enteredTransferToAccount.movementsDate.push(new Date().toISOString());
    } else {
        labelWelcome.textContent = "Your Balance Isn't Enough ";
    }
    // update the UI
    updateUI(currentAccount);
    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferAmount.blur();

    // Reset login timer for activity
    clearInterval(loginTimerCountDown);
    loginTimerCountDown = setLogoutTimer();
};

const requestLoanFunctionality = (e) => {
    e.preventDefault();

    // Get the Request requested loan amount
    const loanAmount = Math.round(Number(inputLoanAmount.value.trim()));

    // 
    if (
        loanAmount > 0 &&
        currentAccount.balance > 0 &&
        currentAccount.movements.some((mov) => mov > loanAmount * 0.1)
    ) {
        setTimeout(() => {
            currentAccount.movements.push(loanAmount);
            currentAccount.movementsDate.push(new Date() );
            updateUI(currentAccount);
            labelWelcome.textContent = 'Congrats, Your Loan Request Approved';
            inputLoanAmount.value = '';
        }, 3000);
    } else {
        labelWelcome.textContent = 'Insufficient Balance or History';
    }

    // reset login timer for activity
    clearInterval(loginTimerCountDown);
    loginTimerCountDown = setLogoutTimer();
};

const closeAccountFunctionality = (e) => {
    e.preventDefault();

    const enteredToCloseAccount = inputCloseUsername.value.trim().toLowerCase();
    const enteredToCloseAccountPin = Number(inputClosePin.value.trim());

    if (
        currentAccount.userName === enteredToCloseAccount &&
        currentAccount.pin === enteredToCloseAccountPin
    ) {
        // find the index of the current account to close
        const currentAccountIndex = accounts.findIndex(
            (acc) => acc.userName === currentAccount.userName
        );

        // Account closing opetation
        accounts.splice(currentAccountIndex, 1);

        labelWelcome.textContent = 'Account Closed Successfully!';
        containerApp.style.opacity = 0;
    }
};

let sorted = false;
const sortMovsFunctionality = (e) => {
    e.preventDefault();

    displayMovement(currentAccount, !sorted);
    sorted = !sorted;
};

// eventlisteners
btnLogin.addEventListener('click', loginFunctionality);
btnTransfer.addEventListener('click', moneyTransferFunctionality);
btnLoan.addEventListener('click', requestLoanFunctionality);
btnClose.addEventListener('click', closeAccountFunctionality);
btnSort.addEventListener('click', sortMovsFunctionality);

const currencies = new Map([
    ['USD', 'United States dollar'],
    ['EUR', 'Euro'],
    ['GBP', 'Pound sterling'],
]);

/////////////////////////////////////////////////
