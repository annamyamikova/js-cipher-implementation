let parametrs = {
  a: 37,
  c: 9,
  m: 213,
  x0: 7
}

function generatingPseudorandomSequence(a, c, m, x0){
  return function x(n) {
    if (n < 0) return null;
    if (n == 0) return x0;
    return (n == 1) ? (a*x0 + c) % m : (a*x(n-1) + c) % m;
  }
}

let _x = generatingPseudorandomSequence(parametrs.a, parametrs.c, parametrs.m, parametrs.x0);

function getLengthOfPeriodDec(){
  let n = 1;
  while(_x(n) != parametrs.x0) n++;
  return n;
}

function getLengthOfPeriodBit(){
  return getLengthOfPeriodDec() * 8;
}

function getCountOfEvenAndOddNum(n) {
  let even = 0;
  let odd = 0;
  while(n != 0){
    (_x(n) % 2 == 0) ? even++ : odd++;
    n--;
  }
  return {even, odd};
}

function getCountOfZeroAndOnes(n){
  let zeros = 0;
  let ones = 0;
  while(n != 0){
    ones += [..._x(n).toString(2)].reduce((acc, n) => acc + (n === '1'), 0);
    zeros += 8 - [..._x(n).toString(2)].reduce((acc, n) => acc + (n === '1'), 0);
    n--;
  }
  return {ones, zeros}
}

_n = getLengthOfPeriodDec();

console.log("Результат: \n");
console.log(`Длина периода генератора в битах равна ${getLengthOfPeriodBit()} бит\n`);
console.log(`Количество четных и нечетных чисел в одном периоде при однобайтовом
представлении выходной последовательности: четных - ${getCountOfEvenAndOddNum(_n).even} штук, нечетных - ${getCountOfEvenAndOddNum(_n).odd} штук`);
console.log(`Количество нулей и единиц в одном периоде при битовом представлении
выходной последовательности: единиц - ${getCountOfZeroAndOnes(_n).ones}, нулей - ${getCountOfZeroAndOnes(_n).zeros}`);


