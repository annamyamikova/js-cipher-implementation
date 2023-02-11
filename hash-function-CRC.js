const findCRC = (number, g_x) => {
  let size;
  let substr = "";
  let str = number.toString(2);
  str += '0'.repeat(g_x.length);

  while(str) {
    do {
      size = g_x.length - substr.length;
      substr += str.slice(0, size);
      substr = parseInt(substr, 2).toString(2);
      str = str.replace(str.slice(0,size), "");
    } while (substr.length !== g_x.length && str);
    if (substr.length === g_x.length) {
      substr = (parseInt(substr, 2) ^ parseInt(g_x, 2)).toString(2);
      if (!str) return substr;
    } else return(substr);
  }
}

const findAllCollisions = (g_x) => {
  let temp = "";
  let arr;
  let obj = {};

  for(let i = 1; i<=255; i++) {
    arr = []
    temp = findCRC(i, g_x);

    if (obj[temp]) {
      arr = obj[temp];
      arr.push(i);
      obj[temp] = arr;
    } else {
      arr.push(i);
      obj[temp] = arr;
    }
  }

  return obj;
}

const main = () => {
  let number = -1;

  while (number <= 0 || number > 255) {
    number = prompt('Введите число, размером 1 байт');
  }

  const g_x = "10101";
  const crc = findCRC(Number(number), g_x);

  alert('CRC для данного числа: ' + crc);

  // вторая часть
  console.log('Найденные коллизии хеш-функции для всех чисел размером 1 байт: ');
  console.log(findAllCollisions(g_x));
}