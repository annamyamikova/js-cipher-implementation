const main = () => {
  //signature generation
  let p = 113;
  let g = 5;
  let x = 7;
  let G_x = p.toString(2);
  let y = Math.pow(g, x) % p;
  let plainText = prompt("Введите сообщение, которое хотите подписать: ");
  let M = getM(plainText);
  let h = parseInt(findCRC(M, G_x), 2);
  let k = getRandomInt(p-1);
  let r = Number((BigInt(g) ** BigInt(k)) % BigInt(p));
  let u = (h-(x*r)) % (p-1);
  while(u<0) u = u + (p-1);
  let s = ((extendedEeuclid(k, p-1)[1]) * u) % (p-1);
  while(s<0) s += p-1;
  console.log("Подписанная тройка (M, r, s): (" + M + ", " + r + ", " + s + ")");

  //signature verification
  let leftSide = Number((BigInt(y) ** BigInt(r)) * (BigInt(r) ** BigInt(s)) % BigInt(p));
  console.log("(y^r)*(r^s) mod p = (" + y + "^" + r + ")*(" + r + "^" + s + ") mod " + p + " = " + leftSide);
  let rightSide = Number((BigInt(g) ** BigInt(h)) % BigInt(p));
  console.log("(g^h) mod p = (" + g + "^" + h + ") mod " + p + " = " + rightSide);
  if (leftSide === rightSide) console.log("Цифровая подпись прошла проверку");
  else console.log("Цифровая подпись не прошла проверку");
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
  var signX = (a < 0) ? -1 : 1,
    signY = (b < 0) ? -1 : 1,
    x = 0,
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

const NOD = (x, y) => {
  if (y > x) return NOD(y, x);
  if (!y) return x;
  return NOD(y, x % y);
}

const isPrime = num => {
  for(let i = 2, s = Math.sqrt(num); i <= s; i++)
    if(num % i === 0) return false;
  return num > 1;
}

const getRandomInt = max => {
  let randomNumber = -1;
  while (randomNumber<0 || NOD(randomNumber, max) !== 1 || !isPrime(randomNumber)){
    randomNumber = Math.floor(Math.random() * Math.floor(max));
  }
  return randomNumber;
}

const findCRC = (number, g_x) => {
  let size;
  let substr = "";
  let str = number.toString(2);
  str += '0'.repeat(g_x.length);

  while(str !== ""){
    do {
      size = g_x.length - substr.length;
      substr += str.slice(0, size);
      substr = parseInt(substr, 2).toString(2);
      str = str.replace(str.slice(0,size), "");
    } while (substr.length !== g_x.length && str !== "");
    if (substr.length === g_x.length) {
      substr = (parseInt(substr, 2) ^ parseInt(g_x, 2)).toString(2);
      if (str === "") return substr;
    } else return(substr);
  }
}

const getM = plainText => {
  return parseInt(plainText.split('').map((a) => {return a.charCodeAt(0).toString(2).padStart(8, "0")}).join(''), 2);
}