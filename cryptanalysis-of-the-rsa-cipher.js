const primeFactorization = (number, result) => {
  let _result = (result || []);
  let root = Math.sqrt(number);
  let x = 2;

  if (number % x) {
    x = 3;

    while ((number % x) && ((x = (x + 2)) < root)) {}
  }

  x = (x <= root) ? x : number;

  _result.push(x);

  return (x === number) ? _result : primeFactorization((number / x), _result);
}

const getPrivateKey = (E, n) => {
  let D = extendedEeuclid(E, n)[1];
  while (D < 0) D += n;
  return D;
}

const decryptionFormula = (С, d, n) => {
  return Number((BigInt(С) ** BigInt(d)) % BigInt(n));
}

const encryptionFormula = (M, e, n) => {
  return Number((BigInt(M) ** BigInt(e)) % BigInt(n));
}

const extendedEeuclid = (a, b) => {
  a = +a;
  b = +b;
  if (a !== a || b !== b) {
    return [NaN, NaN, NaN];
  }

  if (a === Infinity || a === -Infinity || b === Infinity || b === -Infinity) {
    return [Infinity, Infinity, Infinity];
  }

  if ((a % 1 !== 0) || (b % 1 !== 0)) {
    return false;
  }
  const signX = (a < 0) ? -1 : 1,
    signY = (b < 0) ? -1 : 1;
    let x = 0,
    y = 1,
    u = 1,
    v = 0,
    q, r, m, n;
  a = Math.abs(a);
  b = Math.abs(b);

  while (a !== 0) {
    q = Math.floor(b / a);
    r = b % a;
    m = x - u * q;
    n = y - v * q;
    b = a;
    a = r;
    x = u;
    y = v;
    u = m;
    v = n;
  }
  return [b, signX * x, signY * y];
}

let C = 28498;
let e = 251;
let n = 35909;
let [p, q] = primeFactorization(n);
let eulerFunction = (p - 1)*(q - 1);
let d = getPrivateKey(e, eulerFunction);
let M = decryptionFormula(C, d, n);

//Проверка:
let C_verification = encryptionFormula(M, e, n);