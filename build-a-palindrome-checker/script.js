const checkBtn = document.querySelector('#check-btn');
const inputText = document.querySelector('#text-input');
const resultInputText = document.querySelector('#result');
const spanResult = document.querySelector('#resultSpan');

function isPalindrome(str) {
  const cleaned = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return cleaned === cleaned.split('').reverse().join('');
}

function update(result) {
  resultInputText.style.visibility = "visible";
  spanResult.innerText = result;
}

checkBtn.addEventListener('click', function () {
  const inputValue = inputText.value.trim();
  if (inputValue === '') {
    alert('Please input a value');
    inputText.focus();
    return false;
  }

  if (isPalindrome(inputValue)) {
    update(`${inputValue} is a palindrome.`);
  } else {
    update(`${inputValue} is not a palindrome.`);
  }
});
