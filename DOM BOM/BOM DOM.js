
	BOM //Browser Object Model - объектную модель браузера за которую отвечает объект window
	DOM //Document Object Modal - объектную модель документа, отвечает объект document


/*-----------------------------------------------------------------------------------------------------------------------------
"############------------<{ Объект Window }> ------------############
	
	1. Каждая вкладка это созданный объект window 
	2. При обращении к свойствам и методам window, то сам window можно опустить
*/


	navigator: {
		mediaDevices: enumerateDevices()//асинхронна
	
	} /* – информ. объект из которого можно получить данные, содержащиеся в браузере:
		данные в виде строки (User Agent), внутреннее "кодовое" и официальное имя браузера, версию и язык
		информацию о сетевом соединении и местоположении устройства пользователя,
		информацию об операционной системе и многое другое. */
	history /*объект, история переходов пользователя по ссылкам в пределах одной (вкладки) браузера */ 
	location /* отвечает за адресную строку браузера */
	screen /* информацию об экране пользователя: разрешение экрана, максимальную ширину и высоту, которую может иметь окно браузера, глубина цвета */, 
	document /*HTML документ */


	close()//закрытие вкладки
	alert //вывод информации
	confirm //для вывода окна, в котором пользователю необходимо подтвердить или отменить действия
	prompt //получение данных от пользователя

	atob('')//раскодирует Base64 в строку
	btoa('')//кодирует буквы от A-Z в Base64
	encodeURIComponent('')/*Принимает строку или Unicode символы и отображает только это: [A-Z a-z 0-9 - _ . ! ~ * ' ( )] остальное будет закодировано
													Пробел например кодируется - "%20",  > - "%3E",   русская Ф - "%D0%A4" Всё это служит для безопасности */
	encodeURI('')/*Уже больше символов отображает и меньше кодирует. Отображает список: [A-Z a-z 0-9 ; , / ? : @ & = + $ - _ . ! ~ * ' ( ) #] остальное кодирует */
	decodeURIComponent(),decodeURI()//принимают строку с закодированными символами и раскодируют
	
	getComputedStyle(Element)//Возвращает объект с информацией о присвоенных стилей к элементу
	parseFloat(getComputedStyle(sliderWrapper).width)//можно обрезать px и получить число


"############------<{ Свойства размеров окна объекта window }> ---------############"
/*
	все размеры начинаются от левого верхнего угла. Свойства доступны только для Чтения
  Свойства объекта window В в document не ищи их
	Разные свойства с одинаковыми значениями, для разных браузеров 
*/
	screenLeft, screenTop || screenX, screenY// зазор от края и верхней части монитора до края и верха наружней части браузера.
	outerWidth, outerHeight // размер всего браузера (в данный момент) с вкладками и скроллом.  за пределами браузера свойство screen
	innerWidth, innerHeight // размер зоны в которой отображается HTML. Скрол и вкладки не входят в данный размер. 

	//прокрутка. (Смещение страницы по X Y)
	pageXOffset, pageYOffset || scrollX, scrollY // положение прокрутки относительного левого верхнего угла окна

	window.scrollBy(200,200)//прокручивает скрол на 200px. чёт багует не прокручивает а скачет



/*-----------------------------------------------------------------------------------------------------------------------------
"############------------<{ DOM }> ------------############

	Браузер, запрашивает страницу и получает в ответе от сервера HTML-код
	на основании этого HTML-кода браузер создаёт в памяти компьютера DOM-дерева 
	на котором и строит документ. 
	Зачем нам нужен DOM? чтобы с помощью JavaScript изменять страницу на «лету»  делать её динамической и интерактивной.
	Из чего состоит HTML-код страницы? - из тегов, атрибутов, комментариев и текста. Теги есть парные и одиночные
*/

"#####------<{ Свойства размеров окна объекта document }> ---------#####"
	//СКРОЛЛ НЕ УЧИТЫВАЕТСЯ (ТО ЧТО НАДО)(за её вычетом).documentElement - это html объект

	documentElement - это_html_тег

	document.documentElement.offsetWidth //Относительно html тега. Полный размер блока
	document.documentElement.clientLeft //Относительно html тега. Размер border
	document.documentElement.clientWidth //Относительно html тега. Внутренний размер блока
	/* И тут прикол. Установив html border разницы между  offsetWidth и clientWidth именно на html нету, на всех остальных 
		блоках всё нормально */

/*
  странная хуйня. 
  1. браузер можно растянуть чуть больше размера монитора 
  2. Скролл на самом деле выщитывается относительно (window.innerWidth - document.documentElement.clientWidth),
     но относительно window.outerWidth и window.innerWidth так же присутствует зазор в 16px
  3. Если браузер развернуть на full screen, то outerWidth и innerWidth получают по 1920px хотя скролл ни куда не делся.
     Если не растягивать есть какой-то зазор хотя border не видно
*/
//сравнение
	window.outerWidth//1940 без fullScreen (есть какая-то граница)  1920 - fullScreen
	window.innerWidth//1924 без fullScreen  1920 - fullScreen
	document.documentElement.clientWidth//1907  1903 - fullScreen  относительно html
	document.body.clientWidth// относительно body. У каждого тега есть clientWidth / Height  

"#####------<{ Свойства размеров Element }> ---------#####"
	el.offsetParent, parentElement//родительская нода.
	el.offsetLeft / Top/* работает относительно offsetParent. По умолчанию все блоки ссылаются на body. 
																				через position absolute и relative меняем отношение блоков*/
	el.offsetWidth / Height// полная ширина и высота элемента (с border) 
	el.clientLeft / Top //отступ от внутренней части блока до внешней, то есть это и есть размер border, но скролл входит в размеры.
	el.clientWidth / Height// внутренний размер блока

	el.offsetWidth//полный размер
	el.clientLeft//border
	el.clientWidth//- border *  2. на padding не реагирует
/* 
   Существует несколько ситуаций, когда offsetParent равно null:
   1. Для скрытых элементов (с CSS-свойством display:none или когда его нет в документе).
   2. Для элементов <body> и <html>.
   3. Для элементов с position:fixed.
*/

/*
	1. Вместо offsetLeft/Top использовать getBoundingClientRect
	2. Вместо html.||body.scrollTop/Left использовать window.pageXOffset/pageYOffset - кросс-браузерные
*/
	document.body.getBoundingClientRect().left

 "#####-------------------------------------------------------------------------------#####"