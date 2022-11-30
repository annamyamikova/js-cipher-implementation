let numb = "0b00100100";
let charPolynomial = [8, 3, 2];

function LFSR(numb, charPolynomial){
  let generatingBit = null;
  let generatorState = null;
  for (var i = 0; i < charPolynomial.length; i++) {
    if((numb & Math.pow(2, (charPolynomial[i] - 1))) == 0){
      if (generatingBit == null) { generatingBit = 0}
      else generatingBit ^= 0;
    } else {
      if (generatingBit == null) { generatingBit = 1}
      else generatingBit ^= 1;
    }
  }

  if (generatingBit == 1) {
    numb |= 0b100000000;
  }

  generatorState = numb % 2;
  numb = Math.floor(numb / 2);

  return {numb, generatorState}
}

function getPeriodDec(numb, charPolynomial){
  let testNumber = null;
  testNumber = LFSR(numb,charPolynomial).numb;
  testNumber = LFSR(testNumber,charPolynomial).numb;
  let count = 1;
  numb = LFSR(numb,charPolynomial).numb;
  while(testNumber != numb){
    count++;
    testNumber = LFSR(testNumber,charPolynomial).numb;
  }
  return count;
}

function getPeriodBit(numb, charPolynomial){
  return getPeriodDec(numb, charPolynomial) * 8;
}

function getEvenAndOddNum(numb, charPolynomial) {
  let even = 0;
  let odd = 0;
  numb = LFSR(numb, charPolynomial).numb;
  for( let i = 0; i < getPeriodDec(numb, charPolynomial); i++ ){
    (numb % 2 == 0) ? even++ : odd++;
    numb = LFSR(numb, charPolynomial).numb;
  }
  return {even, odd}
}

function getZerosAndOnes(numb, charPolynomial){
  let zeros = 0;
  let ones = 0;
  numb = LFSR(numb, charPolynomial).numb;
  for( let i = 0; i < getPeriodDec(numb, charPolynomial); i++ ){
    ones += [...numb.toString(2)].reduce((acc, n) => acc + (n === '1'), 0);
    zeros += 8 - [...numb.toString(2)].reduce((acc, n) => acc + (n === '1'), 0);
    numb = LFSR(numb, charPolynomial).numb;
  }
  return {ones, zeros}
}

console.log("Результат: \n");
console.log("-----------------------------------------------------------------------------");
for( let i = 0; i < getPeriodDec(numb, charPolynomial) + 1; i++ ){
  if (i == 0) { generatingBit = null; }
  else generatingBit = LFSR(numb, charPolynomial).generatorState;
  numb = LFSR(numb, charPolynomial).numb;
  console.log("Шаг - ", i ,", состояние в 10ном виде - ", numb, ", состояние в 2ном виде - ", numb.toString(2), ", генерируемый бит - ", generatingBit);
}
console.log("-----------------------------------------------------------------------------");
console.log("Длина периода в 10ном виде - ", getPeriodDec(numb,charPolynomial), ", в битах - ", getPeriodBit(numb, charPolynomial));
console.log("Количество четных и нечетных чисел при однобайтовом представлении: четный - ", getEvenAndOddNum(numb, charPolynomial).even, ", нечетных - ", getEvenAndOddNum(numb, charPolynomial).odd);
console.log("Количество нулей и единиц при битовом представлении: нулей - ", getZerosAndOnes(numb, charPolynomial).zeros, ", единиц - ", getZerosAndOnes(numb, charPolynomial).ones);
console.log("-----------------------------------------------------------------------------");


