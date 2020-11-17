/* Сборщик всех файлов js в 1 файл bundle.
  Зачем это надо? Потому что браузер не понимает модульность. При попытке к нему подключить файл js
  который что-то в себя импортирует, будь то библиотеки или другие же файлы, браузер будет ругать.
  Можно пробовать пойти другим путём подключать в html один за другим js файл, но нам придётся соблюдать порядок
  подключения. Предположим мы ходим обратиться к переменной которая у нас инициализирована в другом файле,
  тот файл должен быть раньше подключён в html чем файл в котором запрашиваем иначе фиаско. И вот у нас куча файлов.
  неудобство 1. Это всё соблюсти, 2. это на каждый файл будет запрос к серверу. 10 файлов 10 запросов на скачку.
  Так что задача всё занести в 1 файл и ужать.


Собрать в bundle:     browserify js/test1.js -o js/bundle.js -d
  test1.js это основной файл к которому могут импортироваться зависимости 
   option cli
  -o  = --outfile //выходной файл
  -d  = --debug. Включить исходные карты, то есть кусок кода Source Map. Это значит что 
                 DevTools -> в Sources мы можем видеть не только сжатый файл, но и понятный человеком код. Он больше
                 нужен для разработчика, что бы можно было в случае обслуживания приложения заглянуть через панель разработчика и понять
                 что нужно править.
              browserify js/test1 -o js/bulid.js -d
              Сам по себе browserify не может собрать файл типа es6. Про import и export так же 
              export default он ничего не знает. Он работает с es5
  -t  = --transform

  Вот мы решили писать js модулями, что нам каждый раз вводить эту команду и смотреть результат?
  Или на первых парах действительно подключать кучу скриптов определённым порядком, а потом собрать и надеяться что
  всё заработает?

  Нам желательно использовать импорт, экспорт и подключить 1 файл и видеть результат. Есть несколько способов решить задачу.
  Есть библиотека watchify которая при каждом изменении модулей собирает сама bundle. 
  Есть babelify 


  #######--------<{ Как работать с browserify через API а не консоль }>--------#########

  let browserify = require('browserify');
  let b = browserify([files, CustomOptions]);//Можно погрузить файлы в files (строка или массив) или через 
    option.transform предварительно можно указать правила сжатия файла, но browserify и без этого сжимает так как надо. Для React придётся настроить
  b.add('./browser/main.js', fileOptions);//сюда тоже можно засунуть на.уя столько способов натыкали не понятно

  b.transform((file)=>{}, option)// как я понял получаем лишь путь вернуть нужно readStream иначе bundle не отработает



  CustomOptions{
    basedir: string, // это каталог, из которого browserify начинает объединение для имен файлов, начинающихся с ..
    entries: '' || [], // имена файлов, на которые смотреть
    noParse: [], // принимает массив имён вроде как библиотек, который пропустит все require (). Используйте это для гигантских библиотек, таких как jquery или threejs.
                 По умолчанию browserify в таких случаях учитывает только файлы  .json
    commondir: bool ,// устанавливает алгоритм, используемый для анализа общих путей. И
                    спользуйте, false чтобы выключить это, в противном случае он использует модуль commonDir .
    debug: true; //Включит исходные карты(Source Maps). При дэбаге да или в файлах указать будем указывать console.dir будем видеть не bundle.js а там где установили 
    ...
  }
  
  fileOptions{
    transform: [], // это массив функций преобразования или имен модулей, которые преобразуют исходный код перед синтаксическим анализом.
    ignoreTransform: [],// массив преобразований, которые не будут выполняться, даже если они указаны в другом месте.
    plugin: [], //  массив используемых функций плагина или имен модулей. См. Подробности в разделе плагинов ниже.
    extensions: [], // это массив необязательных дополнительных расширений, которые может использовать механизм поиска модулей, когда расширение не указано. 
       
  }
    
  */
/*
  Т.к. чаще всего использую browserify в browser-sync то что бы сервер не падал нужно обрабатывать
  ошибки. bundle даёт такую возможность
*/
 browserify({basedir: 'src/js/dev', entries: ['del.js','main.js']})
 .bundle((err, buf) =>{
   if(err){
     console.dir(err);
   }else{
     fs.createWriteStream('src/js/bundle.js').write(buf)
   }
 })