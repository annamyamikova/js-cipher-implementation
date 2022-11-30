let charPolynomial = [8, 3, 2];
let asciiLength = 127;
let plainText = "Hello, World!";
let startNumber = 35;

function LFSR(numb, charPolynomial){
  let a_m = null;
  let generatorState = null;
  for (let i = 0; i < charPolynomial.length; i++) {
    if((numb & Math.pow(2, (charPolynomial[i] - 1))) == 0){
      if (a_m == null) {a_m = 0}
      else a_m ^= 0;
    } else {
      if (a_m == null) {a_m = 1}
      else a_m ^= 1;
    }
  }

  if (a_m == 1) {
    numb |= 0b100000000;
  }

  generatorState = numb % 2;
  numb = Math.floor(numb / 2);

  return {numb, generatorState}
}

function getGammaKey(text, startNumber, charPolynomial){
  let key = [];
  let numb = LFSR(startNumber, charPolynomial).numb;
  for (let i = 0; i < text.length; i++) {
    numb = LFSR(numb, charPolynomial).numb;
    key[i] = numb;
  }

  return key;
}

let key = getGammaKey(plainText, startNumber, charPolynomial);

function gammaCodeEncryption(plainText, module, key) {
  let result = [];
  let charCodeOfPlainText = [...plainText].map((a) => a.charCodeAt());
  for (let i = 0; i < key.length; i++) {
    result[i] = (charCodeOfPlainText[i] + key[i]) % module;
  }

  return result.map((a) => String.fromCharCode(a)).join('');
}

function gammaCodeDecryption(chiproText, module, key){
  let result = [];
  let charCodeOfCiproText = [...chiproText].map((a) => a.charCodeAt());
  for (let i = 0; i < key.length; i++) {
    result[i] = (charCodeOfCiproText[i] + module - key[i]) % module;
    while (result[i] < 0) result[i] = module + result[i];
  }

  return result.map((a) => String.fromCharCode(a)).join('');
}

let chiproText = gammaCodeEncryption(plainText, asciiLength, key);