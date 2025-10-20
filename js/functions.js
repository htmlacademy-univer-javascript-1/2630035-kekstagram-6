function lengthString(string, maxLen) {
  return string.length <= maxLen;
}


console.log(lengthString('qwerty', 10));


function isPalindron(string) {
  const stringTogether = string.replaceAll(' ', '').toLowerCase();
  let newString = '';
  for (let i = stringTogether.length - 1; i >= 0; i--) {
    newString += stringTogether[i];
  }
  console.log(stringTogether, newString);
  return stringTogether === newString;

}


console.log(isPalindron('qwerewqss'));
