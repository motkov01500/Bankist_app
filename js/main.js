"use strict";

//#region  BANKIST APP

/////////////////////////////////////////////////
// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};


const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    const html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${type}">${i + 1
      } ${type}</div>
      <div class="movements__date">${displayDate}</div>
            <div class="movements__value">${mov.toFixed(2)}€</div>
        </div>
        `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
displayMovements(account1);

const createUsernames = (account) => {
  account.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

const calcDisplayBalance = (acc) => {
  acc.balance = acc.movements.reduce((acc, mov) => {
    return acc + mov;
  }, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)} €`;
};

const caclDisplaySummary = (acc) => {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)} €`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc - mov, 0);
  labelSumOut.textContent = `${out.toFixed(2)} €`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)} €`;
};

caclDisplaySummary(account1);
createUsernames(accounts);

const updateUI = function (acc) {
  displayMovements(acc);

  calcDisplayBalance(acc);

  caclDisplaySummary(acc);
}

const startLogOutTimer = function(){
  const tick = function(){
    const min = String(Math.trunc(time/60)).padStart(2,0);
    const sec = String(time % 60).padStart(2,0); 
    labelTimer.textContent = `${min}:${sec}`;

    if(time === 0){
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    time--;
  };

    let time = 30;
    tick();
    const timer = setInterval(tick,1000);

    return timer;

} ;

let currentAccount,timer;

// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;



btnLogin.addEventListener('click', (e) => {
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back , ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth()}`.padStart(2, 0);
    const year = now.getFullYear();
    const hours = now.getHours();
    const min = now.getMinutes();

    labelDate.textContent = `${day}/${month}/${year},${hours}:${min}`;

    inputLoginPin.value = inputLoginUsername.value = '';

    inputLoginPin.blur();

    if(timer) clearInterval(timer);
    timer = startLogOutTimer();

    updateUI(currentAccount);
  }

});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function(){
    currentAccount.movements.push(amount);

    currentAccount.movementsDates.push(new Date());


    updateUI(currentAccount);

    clearInterval(timer);
    timer = startLogOutTimer(); 
  },2500);
}
  inputLoanAmount.value = '';
})


btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

  inputTransferTo.value = inputTransferAmount.value = '';
  if (amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username) {

    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    currentAccount.movementsDates.push(new Date());
    receiverAcc.movementsDates.push(new Date());
    updateUI(currentAccount);

    clearInterval(timer);
    timer = startLogOutTimer();
  }
});


btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);

    accounts.splice(index, 1);

    containerApp.style.opacity = 0;

    labelWelcome.textContent = `Login to get started`;
  }
  inputClosePin.value = inputCloseUsername.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});


//#endregion

//#region coding challenge 1

/*

const checkDogs = (dogsJulia,dogsKate) =>{
    var dogsJuliaCorrect = dogsJulia.slice();
    dogsJuliaCorrect.splice(0,1);
    dogsJuliaCorrect.splice(2);
    const allDogs = dogsJuliaCorrect.concat(dogsKate);

    allDogs.forEach((dog,count)=>{
        if(dog>=3){
            console.log(`Dog number ${count + 1} is an adult dog and is ${dog} years old`);
        }
        else{
            console.log(`Dog number ${count + 1} is still a puppy`);
        }
    })
}
checkDogs([3,5,2,12,7],[4,1,15,8,3]);

*/

//#endregion

//#region map

/*const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd = 1.1;

const movToUsd = movements.map((mov)=>{
    return mov*eurToUsd;
})

console.log(movToUsd);*/
//#endregion

//#region filter

/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposits = movements.filter((mov) => mov > 0);
console.log(deposits);

const withdrawals = movements.filter((mov) => mov < 0);
console.log(withdrawals);

*/


//#endregion

//#region coding challenge 2

/*
const dogAgesOne = [5, 2, 4, 1, 15, 8, 3];
const dogAgesTwo = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = function (arr) {
  const humanAges = arr.map((age) => {
    if (age <= 2) {
      return 2 * age;
    } else {
      return 16 + 4 * age;
    }
  });
  const adults = humanAges.filter((age) => age >= 18);
  const average =
    adults.reduce((acc, age) => {
      return acc + age;
    }, 0) / adults.length;
  console.log(humanAges);
  console.log(adults);
  console.log(average);
};
calcAverageHumanAge(dogAgesOne);

*/


//#endregion

//#region coding challenge 3

/*
const dogAgesOne = [5, 2, 4, 1, 15, 8, 3];
const dogAgesTwo = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = (arr) =>
  arr
    .map((age) => age <= 2 ? 2 * age : 16 + age * 4)
    .filter((age) =>  age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

    console.log(calcAverageHumanAge(dogAgesOne));

*/
//#endregion

//#region coding challenge 4

/*
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

//1
dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));

console.log(dogs);


//2

const sarahDog = dogs.find(dog => dog.owners.includes("Sarah"));

console.log(sarahDog);
console.log(`Sarah dog eat too ${sarahDog.curFood > sarahDog.recFood ? 'much' : 'little'}`);


//3

const ownersEatTooMuch = dogs.filter(dog => dog.curFood > dog.recFood)
                              .flatMap(dog => dog.owners);

const ownersEatTooLittle = dogs.filter(dog => dog.curFood < dog.recFood).flatMap(dog =>dog.owners);

console.log(ownersEatTooMuch);
console.log(ownersEatTooLittle);


//4

console.log(`${ownersEatTooMuch.join(' and ')} eat too much`);
console.log(`${ownersEatTooLittle.join(' and ')} eat too little`);

//5
console.log(`${dogs.some(dog => dog.curFood === dog.recFood)}`);


//6

//current > (recommended * 0.90) && current < (recommended * 1.10)

const checkEatingOkay = dog => dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;
console.log(checkEatingOkay);

//7
console.log(dogs.filter(checkEatingOkay));

//8

const dogSorted = dogs.slice().sort((a,b) => a.recFood - b.recFood);

console.log(dogSorted);

*/
//#endregion

/*setInterval(function () {
  const hours = new Date().getHours();
  const minutes = new Date().getMinutes();
  const seconds = new Date().getSeconds();
  console.log(`${hours}:${minutes}:${seconds<10 ? '0' + seconds :seconds }`);
},1000);*/ 
