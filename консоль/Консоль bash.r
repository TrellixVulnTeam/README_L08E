-------------------------------------------------------------------------------------------------------------------
#######-------<{ Команды консоли }>--------########

Все команды обращения к bash из вне должды записываться в виде строки ""
Вот например обращение к bash из docker:
    docker run -d ubuntu bash -c "shuf -i 1-10000 -n 1 -o /data.txt && tail -f /dev/null"   
shuf      команда отвечающая за рандом
  flags:
    -i 1-10                         -i (--input-range) выведет в консоль 10 раз числа от 1-10
    -i 1-10 -n 1                    -n (--head-count) выводит не более указанного значения
    -i 1-10 -n 1 -o путь/файл.*     -o (--output = ФАЙЛ) записывает в файл

cat - просматривает файл целиком и выводит в консоль,
tail - Возможно не нужно целиком просматривать файл. Команда просматривает файл с конца. 
  flags:
      -c - выводить указанное количество байт с конца файла;
      -f - обновлять информацию по мере появления новых строк в файле;
      -n - выводить указанное количество строк из конца файла;
      --pid - используется с опцией -f, позволяет завершить работу утилиты, когда завершится указанный процесс;
      -q - не выводить имена файлов;
      --retry - повторять попытки открыть файл, если он недоступен;
      -v - выводить подробную информацию о файле;


  ls            файловая система  
  hostname      показывает имя компьютера, в docker контейнере будет id контейнера

  pwd      - переменная консоли которая отображает текущий путь. В docker через консоль bash указывается $(pwd), через 
             powerShell ${pwd} через CMD вроде `pwd`. pwd аналог в nodejs __dirname

             Get-ChildItem -Path Env:   проверить локальные переменные

  
