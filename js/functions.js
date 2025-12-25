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
function isMeetingWithinWorkTime(startWork, endWork, startMeeting, duration) {
  const toMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const workStart = toMinutes(startWork);
  const workEnd = toMinutes(endWork);
  const meetingStart = toMinutes(startMeeting);
  const meetingEnd = meetingStart + duration;

  return meetingStart >= workStart && meetingEnd <= workEnd;
}

console.log(isMeetingWithinWorkTime('08:00', '17:30', '14:00', 90));
console.log(isMeetingWithinWorkTime('8:0', '10:0', '8:0', 120));
console.log(isMeetingWithinWorkTime('08:00', '14:30', '14:00', 90));
console.log(isMeetingWithinWorkTime('14:00', '17:30', '08:0', 90));
console.log(isMeetingWithinWorkTime('8:00', '17:30', '08:00', 900));
