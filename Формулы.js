/*eslint-disable*/
"####---<{ Найти середину }>---####"
//читается как: Середина = начало + половина длинны
let mid = start + (end - start) / 2;//массива


let min = (innerHeight - item.height) / 2;// середина экран - высота элемента / 2


let vertices = 100, lines = [];
for(let i = 0; i <= step; i++){
  let point = {
  
    x: Math.cos(i / step * Math.PI * 2),
    y: Math.sin(i / step * Math.PI * 2)
  }
  lines.push(point)
//мой вариант. Увидеть круг нужно нарисовать на canvas
  let point = {
    x: Math.cos((Math.PI * 2) / step * i) * radius + margin,
    y: Math.sin((Math.PI * 2) / step * i) * radius + margin
  }
  
  ctx.lineTo(point.x, point.y)
  ctx.stroke()
}

/*Гипотенуза. Теорема Пифагора: Квадрат гипотенузы = сумме квадратов катетов*/
с = Math.sqrt(a ** 2 + b ** 2);//c = корень из (a в квадрате + b в квадрате)
/* Смещение нулевой точки*/
с = Math.sqrt((a - a) ** 2 + (b - b) ** 2);//a - a"нулевой координаты"
/*Катет */
a = Math.sqrt(c ** 2 - b ** 2);//c = корень из (a в квадрате + b в квадрате)
/* Определить длину окружности */
Длина = 2*Math.PI * R // 2Пи * радиус = длина в px


window.requestIdleCallback() //противоположная функция requestAnimationFrame. vs не подсказывает её. 
//Она запрашивается тогда когда у браузера есть лишние ресурсы. В момент анимации можно через неё делать запросы

/* 
Интересные заметки.
* - Easing - это формула по которой происходит анимация
* - Анимировать больше 3х дивов плохая идея т.к. начинает тормозить анимация. 
      Поэтому анимируют или canvas или svg, но и они могут примерно до 1000 элементов, более менее нормально, дальше тормоза.
      Дальше переходим к библиотекам 5p.js three.js там в районе 15000 элементов можно анимировать.
      Что узнать потолок можно заглянуть в Performance. Браузер выделяет на 1 кадр ~16мс если кадр выходит за пределы появляются тормоза.
      Ну и если уж совсем разгуляться не смотря на то что эти библиотеки обёртки на WebGL, они не используют его на полную катушку.
      WebGL параллельно вычисляет каждый пиксель поэтому работает быстро, в то время как на js мы максимум можем производить цикл обдумывая каким цветом заполнять каждый пиксель
      Там нет такого понятия DOM это значит мы не можем строить логику как в JS через объекты: "Если этот элемент синий, то я буду красным". Так не работает.
* - Шейдеры в WebGL это маленькая программка которая работает на GPU и параллельно обрабатывает пиксели.
    На GPU потому что там много ядер и заточено под условия Шейдера, а CPU нет.


Отсылая что-либо ajax в момент анимации возможно она будет лагать

Все анимации это действие от статичного 0 положения конечному результату 1.
  Можно описать это как переключение от
  0 -> 1 - это стоит интерпретировать как 0 нет анимации 1 есть
   x - обычно это значение изменяется во времени

  Объединённые анимации это тоже анимация которая имеет начальные значения, промежуточные значения и значения конца анимации.
  Всё это может повторяться как сначала так в обратном направлении.
  Работая с одним значением меняем состояние только одного элемента
  x*3
  умножив значение перемещаем от 0 до произвольного числа
  x -> 3

  
  y = (1 - x)*a + x*a //линейная интерполяция, то есть линейное передвижении элементов.  
  изменяя одно значение меняется и другое
  a -> b 
  a и b это могут быть не только числа, но и массивы данных, как начальный результат и конечный

  y = 2*x - x*x //если x будет меняться от 0 до 1 то и y
*/

/*#######-------<{ Интерполяция }>--------######## */
/* Представим координатную плоскость. Мы можем расставить точки и если построить график то первое приходит на ум
  это соединить линиями. Получиться график с острыми углами, то есть ломаные линии. Как построить плавные линии.
  Интерполяция сводиться к тому что нужно узнать последовательность точек P(индекс1) P(индекс2) P(индекс3) ... P (индекс n - 1)
    Интерполяция - способ нахождения промежуточных значений величины по имеющемуся дискретному набору известных значений.
    a) 2, 4, 6, 8, ?
    b) 1, 3, ?, 7, 9
  Как соединить точки на графике?
  ----------------------------------------------------
  -----------------------о----------------------------
  ---------------------о------о-----------------------
  --------------------------------о-------------------
  --------------о-------------------------------------
  ----------------------------------------------------
  -------о--------------------------------------------
Существует много формул как соединить одну точку с другой и добиться можно не обязательно прямой линии.
Короче всё сложно.




*/

/*#######-------<{ Скорость }>--------######## */

/*
  Скорость - это сколько прошёл расстояние за какое-то время.
  Обычно указывают переменные
  Прошлое значение, настоящие
*/

let currents = 0;//текущее расстояние за (frame) кадр
let last = 0;//прошлое значение расстояния
let lastTime = 0;//предыдущее значение

let speed = (currents - last) / (event - lastTime);

lastTime = event//на каждой итерации присваивать текущее значение, что было прошлым для новой итерации