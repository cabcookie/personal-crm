const generatePassword = () => {
  // Define the character sets
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const specialChars = "!,+-";
  const length = 12;
  const numChars = Math.floor(length / 4);
  const rest = 12 - numChars * 4;

  let password = "";
  for (let i = 0; i < numChars; i++) {
    // Choose a random character from each character set
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += specialChars.charAt(
      Math.floor(Math.random() * specialChars.length)
    );
  }
  for (let i = 0; i < rest; i++) {
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  }
  return password;
};
module.exports = {
  generatePassword,
};
