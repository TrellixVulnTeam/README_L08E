Что бы использовать переменыне окружения в файле .env в корневом каталоге проекта
нужно установить пакет dotEnv. 
Подключить в главном файле require('dotenv').config({key: value}) или вроде как предпочтительней запустить через консоль
Есть 2й способ подключения .env файла через файл launch.json 
Указав "envFile": "${workspaceFolder}/.env" и использовать файл. Конечно можно и в "env": {}
минус если есть числа они будут строкой в json нам этого не надо


Как я пониаю dotenv следит за изменениями переменных



Через консоль можно присваивать значение переменной и запустить файл
ИМЯ_ПЕРЕМЕННОЙ=значение node имя-файла.js