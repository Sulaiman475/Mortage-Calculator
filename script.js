import svg from './svg.js';

const form = document.querySelector('.calculator-form');
const resultParentElement = document.querySelector('.result');
const clearBtn = document.querySelector('.calculator-button-clear');


form.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = {};

    formData.forEach((value, key) => {
        formObj[key] = value;
    });

    const data = {
      option: formObj.option,
      amount: Number(formObj.amount),
      rate: Number(formObj.rate),
      term: Number(formObj.term),
    }

    form.reset();

    resultParentElement.scrollIntoView({behavior: 'smooth'});

    if(data.option === 'repayment') {

      const {monthlyPayment, totalRepayments} = calculateMortgage(data.amount, data.rate, data.term);
      const markup = generateResultMarkup(monthlyPayment, totalRepayments);
      
      resultParentElement.innerHTML = '';
      resultParentElement.insertAdjacentHTML('afterbegin', markup);

    } else if(data.option === 'interestOnly') {

      const {monthlyInterestPayment, totalRepayments} = calculateInterestOnlyMortgage(data.amount, data.rate, data.term);
      const markup = generateResultMarkup(monthlyInterestPayment, totalRepayments);
      
      resultParentElement.innerHTML = '';
      resultParentElement.insertAdjacentHTML('afterbegin', markup);

    } else {
        return;
    }

});

clearBtn.addEventListener('click', function() {
    form.reset();
    const markup = generateResetMarkup();
    resultParentElement.innerHTML = markup;
})


/**
 * Calculates the monthly and total repayments for a mortgage based on the principal amount, annual interest rate, and loan term.
 *
 * @param {number} principal - The principal amount of the mortgage.
 * @param {number} annualInterestRate - The annual interest rate for the mortgage as a decimal.
 * @param {number} years - The number of years the mortgage is taken out for.
 * @return {Object} An object containing the monthly payment and total repayment amounts, both formatted to two decimal places.
 */
function calculateMortgage(principal, annualInterestRate, years) {
    // Convert annual interest rate to monthly and decimal
    let monthlyInterestRate = annualInterestRate / 100 / 12;
    // Total number of payments (months)
    let numberOfPayments = years * 12;

    // Calculate monthly payment using the formula
    let monthlyPayment = principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    let totalRepayments = monthlyPayment * numberOfPayments;

    return {
        monthlyPayment: monthlyPayment.toFixed(2),
        totalRepayments: totalRepayments.toFixed(2)
    };
}


/**
 * Calculates the monthly and total repayments for an interest-only mortgage based on the principal amount, annual interest rate, and loan term.
 *
 * @param {number} principal - The principal amount of the mortgage.
 * @param {number} annualInterestRate - The annual interest rate for the mortgage as a percentage.
 * @param {number} loanTermYears - The number of years the mortgage is taken out for.
 * @return {Object} An object containing the monthly interest payment and total repayment amounts, both formatted to two decimal places.
 */
function calculateInterestOnlyMortgage(principal, annualInterestRate, loanTermYears) {
    // Convert annual interest rate to monthly and percentage
    const monthlyInterestRate = (annualInterestRate / 100) / 12;
    
    // Calculate monthly interest payment
    const monthlyInterestPayment = principal * monthlyInterestRate;
    
    // Total number of payments (months)
    let numberOfPayments = loanTermYears * 12;
    let totalRepayments = monthlyInterestPayment * numberOfPayments;

    return {
        monthlyInterestPayment: monthlyInterestPayment.toFixed(2),
        totalRepayments: totalRepayments.toFixed(2)
    };

}

/**
 * Generates the markup for displaying the results of a mortgage repayment calculation.
 *
 * @param {number} monthlyRepayment - The monthly repayment amount.
 * @param {number} totalRepayments - The total amount to be repaid over the term.
 * @return {string} The HTML markup for displaying the results.
 */
function generateResultMarkup(monthlyRepayment, totalRepayments) {
    return `
      <div class="result-header">
        <h2 class="result-heading">Your Results</h2>
        <p class="result-para">
          Your results are shown below based on the information you provided. 
          To adjust the results, edit the form and click “calculate repayments” again.
        </p>
      </div>
      
      <div class="result-figures-box">
        <div class="monthly-figures">
          <p class="figures-type result-para">Your monthly repayments</p>
          <span class="monthly-amount">£${monthlyRepayment}</span>
        </div>
        <div class="total-figures">
          <p class="figures-type result-para">Total you'll repay over the term</p>
          <span class="total-amount">£${totalRepayments}</span>
        </div>

      </div>
    `;
}


/**
 * Generates the markup for displaying a reset message for mortgage repayment calculations.
 *
 * @return {string} The HTML markup for displaying the reset message.
 */
function generateResetMarkup() {
    return `
      <div class="result-empty">
        
        ${svg}
        <div class="result-header">
          <h2 class="result-heading">Results shown here</h2>
          <p class="result-para">
            Complete the form and click “calculate repayments” to see 
            what your monthly repayments would be.
          </p>
        </div>
      </div>
    `
}
