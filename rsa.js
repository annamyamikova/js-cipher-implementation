const alphabet = {
  "<": 0,
  ">": 1,
  "{": 2,
  "}": 3,
  "[": 4,
  "]": 5,
  "(": 6,
  ")": 7,
  "@": 8,
  "±": 9,
  "А": 10,
  "Б": 11,
  "В": 12,
  "Г": 13,
  "Д": 14,
  "Е": 15,
  "Ж": 16,
  "З": 17,
  "И": 18,
  "Й": 19,
  "К": 20,
  "Л": 21,
  "М": 22,
  "Н": 23,
  "О": 24,
  "П": 25,
  "Р": 26,
  "С": 27,
  "Т": 28,
  "У": 29,
  "Ф": 30,
  "Х": 31,
  "Ц": 32,
  "Ч": 33,
  "Ш": 34,
  "Щ": 35,
  "Ъ": 36,
  "Ы": 37,
  "Ь": 38,
  "Э": 39,
  "Ю": 40,
  "Я": 41,
  "а": 42,
  "б": 43,
  "в": 44,
  "г": 45,
  "д": 46,
  "е": 47,
  "ж": 48,
  "з": 49,
  "и": 50,
  "й": 51,
  "к": 52,
  "л": 53,
  "м": 54,
  "н": 55,
  "о": 56,
  "п": 57,
  "р": 58,
  "с": 59,
  "т": 60,
  "у": 61,
  "ф": 62,
  "х": 63,
  "ц": 64,
  "ч": 65,
  "ш": 66,
  "щ": 67,
  "ъ": 68,
  "ы": 69,
  "ь": 70,
  "э": 71,
  "ю": 72,
  "я": 73,
  "!": 74,
  "?": 75,
  ".": 76,
  ",": 77,
  ";": 78,
  "#": 79,
  "$": 80,
  "%": 81,
  "&": 82,
  "*": 83,
  "/": 84,
  "-": 85,
  ":": 86,
  "=": 87,
  "+": 88,
  "1": 89,
  "2": 90,
  "3": 91,
  "4": 92,
  "5": 93,
  "6": 94,
  "7": 95,
  "8": 96,
  "9": 97,
  "0": 98,
  " ": 99,
};

let zeroIndex = [];

function main() {
  const p = 113;
  const q = 257;
  const n = p * q;
  const eulerFunction = (p - 1)*(q - 1);

  let plainText = prompt('Введите открытый текст: ');

  const encryptedArray = textToArrayOfSymbols(plainText, alphabet);
  const encryptedBlocks = arrayOfSymbolsToEncBlocks(encryptedArray, n);
  const keys = getKey(eulerFunction);
  const E = keys[0];
  const D = keys[1];

  console.log("E = " + E + ", D = " + D);

  const C = encryptionFormula(encryptedBlocks, E, n);
  const cipherText = getRSAText(C);
  console.log("Шифротекст - " + cipherText);

  const decryptedArray = textToArrayOfSymbols(cipherText, alphabet);
  const decryptedBlocks = arrayOfSymbolsToBlocks(decryptedArray, n);
  const M = decryptionFormula(decryptedBlocks, D, n);

  plainText = getRSAText(M);

  console.log("Исходный текст - " + plainText);
}

const textToArrayOfSymbols = (text, alphabet) => {
  return text.split('').map((i) => {
    for (let key in alphabet) {
      if (i === key) {
        i = String(alphabet[key]).padStart(2, "0");

        return i;
      }
    }
  });
};

const arrayOfSymbolsToBlocks = (array, n) => {
  let blocks = [];
  let i = 0, substr = 0;
  let str = array.join('');

  while (str !== "") {
    while (Number(str.slice(0, substr + 1)) < n && substr < String(n).length + 1) {
      blocks[i] = str.slice(0, substr + 1);
      substr++;
    }

    str = str.replace(str.slice(0,substr), "");
    i += 1;
    substr = 0;
  }

  return blocks;
};

const encryptionFormula = (blocks, e, n) => {
  let C = "";

  for (let m = 0; m < blocks.length; m++){
    let str = blocks[m];

    if (str[0] === "0") {
      zeroIndex[m] = 1;
    } else {
      zeroIndex[m] = null;
    }

    C+= String(Number((BigInt(blocks[m]) ** BigInt(e)) % BigInt(n))).padStart(6, "0");
  }

  return C;
};

const decryptionFormula = (blocks, d, n) => {
  let M = "";

  for (let c = 0; c < blocks.length; c++) {
    if (zeroIndex[c]) {
      M+="0";
    }

    M+= String(Number((BigInt(blocks[c]) ** BigInt(d)) % BigInt(n)));
  }

  return M;
};

const getRSAText = (strOfNumbers) => {
  return strOfNumbers.match(/.{1,2}/g).map((i) => {
    for (let key in alphabet) {
      if (i === alphabet[key]) {
        i = key;

        return i;
      }
    }
  }).join('');
};

const getKey = (eulerFunction) => {
  let count = 0;

  while (count < 3 || !count) {
    count = prompt('Введите кол-во пар ключей, которые вы хотите получить на выбор(не менее 3-х): ');
  }

  let map = new Map();
  let E, D;

  console.log("----------------------------------");
  console.log("|  Номер пар. {E; n}, {D; n}     |");
  console.log("----------------------------------");

  for (let i = 1; i <= count; i++) {
    E = getRandomInt(eulerFunction);
    D = extendedEeuclid(E, eulerFunction)[1];

    while (D < 0) {
      D += eulerFunction;
    }

    map.set(i, [E, D]);
    console.log(i + ". {" + E + "; "+eulerFunction +"}, {" + D + "; " + eulerFunction + "}");
  }

  console.log("----------------------------------");

  let numberOfKey = -1;
  while (numberOfKey <= 0 || ! numberOfKey || numberOfKey > count) {
    numberOfKey = prompt('Введите номер пары ключей: ');
  }

  return map.get(+numberOfKey);
};

const getRandomInt = (eulerFunction) => {
  let E = Math.floor(Math.random() * Math.floor(eulerFunction*10));

  while (NOD(E, eulerFunction) !== 1 || !isPrime(E) || E < eulerFunction) {
    E = Math.floor(Math.random() * Math.floor(eulerFunction*10));
  }

  return E;
}

const NOD = (x, y) => {
  if (y > x) {
    return NOD(y, x);
  }

  if (!y) {
    return x;
  }

  return NOD(y, x % y);
}

const isPrime = (num) => {
  for(let i = 2, s = Math.sqrt(num); i <= s; i++) {
    if(num % i === 0) return false;
  }

  return num > 1;
};

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

  let signX = (a < 0) ? -1 : 1,
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