//import React, { FC } from 'react';
/*
  1. Для того что бы работать с TS требуется установить пакет: npm i typescript, он компилирует в js.
*/
/*##############-------------<{ Типы }>-------------##############
  Типы указываются после названия переменной с двоеточиями. Так же можно создавать свои типы которые 
  по нашему мнению лучше своим названием описывают. 
  Если присваивать неверный тип, выпадает ошибка. Можно указывать несколько вариантов типов.

  После компиляции ничего лишнего в JS не будет. 
*/

const isFetching: boolean = true;
const int: number = 41;//4.2 3e10 
const msg: string = 'строка';
const numberArray1: number[] = [1,2,3,4,5];//новая запись. string[] и т.д
const numberArray2: Array<number> = [1,2,3,4,5];//старая
const numberArray3: [string, number] = ['Вася', 23];//мешаный вариант
const variable: any = 'строка';//всё что угодно. Можно переназначать.

function method1(name: string): void { }//void означает то что функция не будет ничего возвращать
function method2(msg: string): never { //указываем never если метод точно выкинет ошибку. Или мы свою выкидываем или система сработает.(Например цикл будет бесконечный) 
  throw new Error(msg);
}

//Что бы не писать так у каждой переменной которая требует варианты данных типов
let isCordova: number | string | object = 's'; 
//можно создать шаблон типов
type ID = string | number;//Создали свой шаблонный тип

const id1: ID = '3123';
const id2: ID = 1234;

/*
  Обычно заготавливается type на котором в дальнейшем строиться какой-то объект.
  Например для React т.к. в state может не быть изначально значений, указываем одно из вариантов состояния null(в объекте undefined так же пойдёт)
*/

type InitialState = {
  name: string | null,
  age: number | null,
  method?: Function
}

let ob: InitialState = {
  name: undefined,
  age: 29
} 

/*
  Но можно создать type на основе готового объекта и экспортировать type для использования где-либо.
  Т.к. изначально присвоенное значение к какой либо переменной привязывается к данному типу это поведение можно изменить.
  К примеру экспортированный type может идеально не подойти к какому либо объекту, к примеру year где-то указывается как string
 
*/
let ob1 = {
  model: 'BMW',
  year: 2004 as number | string,
  money: 1200000
}
// в ts typeof умеет не просто определять тип, он передаёт ссылку этой переменной с её данными
export type Model = typeof ob1;
//где-то в другом файле
let ob2: Model = {
  model: 'Opel',
  year: '2009',
  money: 1300000
} 


// В reducer описываются константы 
const GET_USERS = 'app/GET_USERS';
type InitAction = {
  type: typeof GET_USERS,//мало того что сказали string, так ещё строка должна соответствовать
  id: number,
}

let action: InitAction = {
  type: GET_USERS,
  id: 12
}

/* Пример 2. ------------------------------------------------------*/
type InitialStateApp = {
  users: Array<string>,
  pages: {
    actionPage: string
  }
}

let stateApp: InitialStateApp = {
  users: [],
  pages: {
    actionPage: 'home'
  },
}
let reducerApp = (state = stateApp, ac: any): InitialStateApp => {
  return {
    users: ['Вася'],
    pages: {
      actionPage: ''
    }

  }
}


/*---------------------------------------------------------------------------------------------------------------------
##############-------------<{ Интерфейсы }>-------------##############
  Интерфейс похож на определение класса, но создаёт по сути шаблон для свойств с ограничениями по типам.
  ? - не обязательное указание данного свойства
  readonly свойство после заполнения нельзя будет переназначить
*/

interface React {
  readonly id: string,
  color?: string,
  size?: {
    width: number,
    height: number
  }
}
interface IReact2 extends React{ //Есть наследование. Часто вначале ставят I указывая что это интерфейс
  method2?: () => number //новая запись. С function как записывать не знаю.
}

const react1: React = {
  id: '1234',
  size: {
    width: 4,
    height: 6
  }
}
// react1.id = 465// нельзя переназначить

const react3 = {} as React; //привязать тип. Новая запись
// const react4 = <React>{}; //старая


class MyClass implements IReact2{//привязываемся к нужному интерфейсу т.к. хотим заполнять те же свойства
  id: '151'
}


/*
  Представим ситуацию что объект длиннющий и хз сколько там свойств. Пришлось бы долго описывать интерфейс. 
  Для этого можно указать короткую запись.
*/
interface Style {
  [key: string]: string
}

const css: Style = {
  border: '1px solid red',
  marginTop: '10px'
}

/* 
  enum это просто названный список содержащий чего либо и названый элемент находиться на своей позиции индекса.
  На нормальный русский это типа массив записанный в другой форме. 
  let Membership = ['One', 'Two', 'Three'], но с одной фишкой
 */
enum Membership {
  One, 
  Two,
  Three,
}

const props1 = Membership[2];//Three. Результат как в обычном массиве
const props2 = Membership.One;//0 - обратившись по имени получаем индекс.В обычном массиве пришлось бы использовать findIndex()

enum SocialMedia {
  VK = 'VK', 
  FACEBOOK = 'FACEBOOK',
  INSTAGRAM = 'INSTAGRAM',
}
//если в enum свойствам присвоены значения, то при обращении через них будем получать не индекс а значения 
const props3 = SocialMedia.VK;//


/*---------------------------------------------------------------------------------------------------------------------
##############-------------<{ Объединение Интерфейсов }>-------------##############

  Можно задавать одно и то же имя интерфейсам, тогда они будет объединяться. Объединение происходит в обратном порядке.
*/
interface Animal{}
interface Sheep{}
interface Animal{}
interface Cat{}


interface Dog {
  clone(animal: Animal): Animal;
}
interface Cloner {
  clone(animal: Sheep): Sheep;
}
interface Cloner {//порядок не меняется
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
}
//Всё это будет объединено компилятором в таком порядке так:

interface Cloner {
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
  clone(animal: Sheep): Sheep;
  clone(animal: Animal): Animal;
}

//но порядок измениться если тип будет указан в строковом литерале. 
interface Document {
  createElement(tagName: any): Element;
}
interface Document {
  createElement(tagName: "div"): HTMLDivElement;
  createElement(tagName: "span"): HTMLSpanElement;
}
interface Document {
  createElement(tagName: string): HTMLElement;
  createElement(tagName: "canvas"): HTMLCanvasElement;
}
//собирается так же с конца, но сначала строки
interface Document {
  createElement(tagName: "canvas"): HTMLCanvasElement;
  createElement(tagName: "div"): HTMLDivElement;
  createElement(tagName: "span"): HTMLSpanElement;
  createElement(tagName: string): HTMLElement;
  createElement(tagName: any): Element;
}


/*---------------------------------------------------------------------------------------------------------------------
##############-------------<{ Объединение namespace }>-------------##############
  namespace - требуется для того что бы не было конфликта с одинаковыми именами переменных, классов, функций встречающихся в разных файлах,
  Без использования namespace, конфликт может возникнуть при компиляции или при использовании import. 
  В JS нет этого и обычно файл оборачивают само-вызывающейся функцией, что бы данные имена были локальными, но в некоторых языках используется namespace.
  Есть некоторая особенность объединения namespace. Объединение в namespace происходит только того тех конструкций которые имеют export.
  К примеру мы можем предполагать что в предыдущем  Animal должно быть значение haveMuscles, и мы надеемся что оно имеет export, а значит 
  предполагаем что раз будет объединение, то это значение можем использовать в описанном ниже пространстве в конкретной функции. Это будет
  работать если будет export и не будет работать если его не будет.
*/

namespace Animal {
  let haveMuscles = true;
  export function animalsHaveMuscles() {
    return haveMuscles;
  }
}
namespace Animal {
  export function doAnimalsHaveMuscles() {
    //return haveMuscles; // забыли экспортировать в предыдущем пространстве, будет ошибка.
  }
}


/*---------------------------------------------------------------------------------------------------------------------
  ###########---------<{ Примеры на React TypeScript }>---------###########
  Когда привязываем interface получаем подсказки при инициализации компонента и при вызове
*/
import React, { FC, useRef, useState } from '../../React-cordova/med-call-typescript/node_modules/@types/react';
import { useParams } from '../../React-cordova/med-call-typescript/node_modules/@types/react-router';

enum EVariantColor {
  primary = '#123456',
  gold = '#F4CA16',
  crimson = 'crimson'
}

interface ICardProps {
  width?: string, //не обязательный
  height: string, //обязательный для передачи (но не факт что он будет использоваться)
  method?: (num: number) => void, 
  variant?: EVariantColor,
  children?: React.ReactChild | React.ReactNode,
}

//Вариант 1. 
const Card = ({variant}:ICardProps) => {
  return (<div style={{background: variant}}></div>)
}
/* 
  при использовании в interface конструкции enum без всяких "ИЛИ" использовать в дальнейшем данный props можем только 
  через его самого. Придётся экспортировать данный enum. Хотя подсказка так же подсказывает имя цвета:
  variant={'#F4CA16'} - но так не работает
*/
<Card height="100" variant={EVariantColor.primary}></Card>



/*------------------------------------------------------------------------------------------------------*/
//Немного изменённый вариант + как заставить подсказывать пропс в переданной функции в children 
interface CardChildrenFunction {
  prop: string,
  test: string
}
interface ICardProps1 {
  height: string,
  onClick: (event: React.MouseEvent) => void,//можно указать object, но тогда подсказок не будет
  children?: FC<CardChildrenFunction>//показываю что есть короткая запись от FunctionComponent
}
//Вариант 2. Немного по другому определим компонент и interface. 
const Card1:React.FunctionComponent<ICardProps1> = ({onClick}) => {
  return (<div onClick={onClick}></div>)
}

<Card1 height="100" onClick={(event) => {  }}>
  {//тут подсказывает 
    ({}) => <div></div>
  }
</Card1>


/*------------------------------------------------------------------------------------------------------*/
//Существует вариант когда мы не знает что должно придти. Например массив разных типов

interface ListProps{
  items: any[]
}
const Card2:FC<ListProps> = ({items}) => {
  return (
    <div></div>
  )
}
/*
  ещё один вариант. Честно говоря не особо понял зачем такой геморойный подход.
  T - это любой тип, но указывать её тогда нужно везде и к тому же она не работает со стрелочной функцией 
*/

interface ListProps1<T>{
  items: T[]
}
function Card3<T> ({items}: ListProps1<T>) {
  return (
    <div></div>
  )
}

/*------------------------------------------------------------------------------------------------------*/
//Переиспользование 
interface IAddress {
  strict: string,
  city: string
}

interface IUsers {
  name: string;
  age: number;
  address: IAddress;
}

const Users: FC<IUsers> = ({}) => {
  return (<div></div>)
}



/* Итого для компонентов: Можно передавать interface объекту props или указывать через компоненту с 
  const Users = ({}:IUsers) =>{} 
  const Users:FC<IUsers> = ({}) =>{} 
*/


/*#########---------<{ Примеры }>---------##########*/
interface IUsersArr {
  name: string;
  age: number;
}

//Пример 1. Привязываем interface что бы отгородить себя от ошибок + будет подсказки
let arr:IUsersArr[] = [{name: '', age: 45}];
// let arr:IUsersArr[] = [{name: '', age: '45'}];//будет ошибка
let arr1 = [{name: 'Вася', age: 45},{name: 'Петя', age: 45}, {name: 'Жора', age: 68}];
let user = {name: 'Вася', age: 45};
function App() {
  let [users, setUsers] = useState(arr1);
  //Можно отгородить себя на уровне функции. будет ошибка если что-то не так.
  //let [users1, setUsers1] = useState<IUsersArr[] | null>(arr1);
  let ref = useRef<HTMLDivElement>(null);//говорим что будет в ref 

  console.dir(ref.current?.textContent);
  /* 
    В некоторых случаях доставать данных требуется через "?", т.к. данные в какой-то момент времени отсутствуют, то есть равны null
    и через null обращаться нельзя и в typescript предусмотрен такой вариант.  Так же если на функции указывается null, 
    то компилятор МОЖЕТ потребует указывать "?"(Но такое встречал на объекте) 
  */

  let [users1, setUsers1] = useState<IUsersArr | null>(user);
  
  return (
    <div >
      <div>{users1.name}</div>
      {
        users.map((item, inx) => {
          return (
            <div key={inx}>
              <h2>{item.name}</h2>
              <div>{item.age}</div>
            </div>
          )
        })
      }
    </div>
  );
}


/*#########---------<{ Где же проявляет себя type в отличие от interface }>--------########## 
  Как такой вариант реализовать через interface я не придумал, т.к. у interface вложенность а обращаться не выходит
*/
type MouseEvent = (e: React.MouseEvent) => void//Кстате обращаем внимание к MouseEvent мы привязали функцию значит и указываем на переменной к которой привяжется функция  

function App1() {
  let handleClick:MouseEvent = (e) => {//можно указать тут e: React.MouseEvent, но зачем по 100 раз
  
    console.dir(e.currentTarget);
  }
  return (
    <div onClick={handleClick}></div>
  );
}


/*
    имеем теперь подсказки по Event, это хорошо, плохо тем что только по 1й вложенности но не полноценно по следующим т.к. дальше Event не знает 
    на какой элемент при присваиваем данное событие. Тут если изначально у нас был план сделать type универсальным, то
    если хотим углублённые подсказки круг универсальности сужается.
    Таких подсказок куча в React
     React.DragEvent<HTMLDivElement>
     ...
*/
type MouseEvent2 = (e: React.MouseEvent<HTMLDivElement>) => void
function App2() {
  let handleClick:MouseEvent2 = (e) => {
    console.dir(e.currentTarget);//подсказок больше
  }
  return (
    <div onClick={handleClick}></div>
  );
}

/*##########-----------<{ Подготовка данных с сервера }>---------##########
  можно описать какие данные с сервера приходят
*/
interface Users {
  name: string,
  age: number
}

fetch('url')
.then((data) => data.json() )
.then((users:Users[]) => users[0] )

async function fetchUser() {
  // let res = await axios.get<IUsers>('url')

}

interface IParams {
  id: string
}
//снова же привязали interface для подсказок, но чтоб действительно в id что-то было нужно это получить в данном случае через get строку
let params = useParams<IParams>()
console.dir(params);