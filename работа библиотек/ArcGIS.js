/* eslint-disable no-alert, no-console */
/*  Обычный способ подключения */
import Map from '@arcgis/core/Map';
import argConfig from '@arcgis/core/config';
import Graphic from '@arcgis/core/Graphic';
import MapView from '@arcgis/core/views/MapView';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
/*или установить пакет esri-loader это обёртка над @arcgis. Подключение пакетов выглядит иначе и имеет приписку esri.*/

import { loadModules, loadCss } from 'esri-loader'; 
 // подключение происходит асинхронно.
 /*
  loadCss нужен если требуется определённую версию скачать css или с сервера
  loadCss('3.37')
  loadCss('http://server/path/to/esri/css/main.css'); Обычно хватает указать параметра в loadModules
 */
  loadModules(
    [
    "esri/Map",
    "esri/config",
    
    "esri/views/MapView",
    "esri/views/SceneView",
 
    //Если хотим виджеты
    "esri/widgets/BasemapToggle",
    "esri/widgets/BasemapGallery",
      //создание пользовательских вариантов
    "esri/Basemap",
    "esri/layers/VectorTileLayer",
    "esri/layers/TileLayer",
    //Создание фигур на карте
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/layers/WebTileLayer",
    ], {css: true})
    .then(() => 
    ([
      eMap, eCfg,
      eMapView, eSceneView,
      eBasemapToggle, eBasemapGallery,
      eBasemap, eVectorTileLayer, eTileLayer,
      eGraphic, eGraphicsLayer,
      eWebTileLayer 
    ])=> {

      eCfg.apiKey = 'токен';//для использования пакета выдают токен в личном кабинете arcgis
      /* СЛОИ ЭТО ЭТО ОБЕЩАНИЯ.
        1. Все слои добавляются на карту, а карта отрисовывается в желаемом формате используя 2d(класс MapView) или 3d(SceneView).
        2. К опциям классов есть взможность обращаться через экземпляр. 
        3. Есть как минимум 5 стандартный способов добавить как слои на карту так и в слои графику.
          (Ни кто не мешает выходить на данные свойства и методы через другие экземпляры и под тем же соусом взаимодействовать с ними. ) 
              Классы слоёв: FeatureLayers || WebTileLayers || GraphicsLayers

               a) let instansMap = new Map({layers: экземпляр_слоя})    
               b) instansMap.add(экземпляр_слоя)//для динамического добавления слоёв
               с) instansMap.addMany([экземпляр_слоя])//для динамического добавления слоёв
                  
               d) map.layers = [экземпляр_слоя1, экземпляр_сло2] //заглянув в map.layers мы увидим не массив а объект с items, даже после такого добавления
               e) map.layers.push(экземпляр_слоя1, экземпляр_сло2)
        Для график всё тоже самое только обращение к свойству graphic let instansGraphic = new GraphicsLayers({graphic: экземпляр_graphic})    

          Экземпляр view наследует экземпляр map: view.map.layers = [экземпляр_слоя1, экземпляр_сло2]

          ВАЖНО:
            Казалось бы заманчивая идея исключить GraphicsLayers и кидать графику сразу же в view.graphic = [graphic1, graphic2], 
            но загвоздка в том что мы не сможем воспользоваться возможностью предлагаемых опций от new GraphicsLayers({}), я пробовал.
            Зная о том что мы обычно GraphicsLayers добавляем в Map, то добравшись туда, действительно видим что переданная графика через
            view.graphic автоматически обернулась GraphicsLayers в Map, но как только мы туда обращаемся видим undefined т.к. это асинхронная операция.
            




        4. Не смотря на на что напихиваем например в один GraphicLayer много new Graphic для Map это один слой
            это нужно учитывать если мы хотим менять zIndex слоёв через map.reorder, возможно нам менять zIndex надо на одном слое? 
        5. Нельзя один и тот же слой пихать на разные карты:
              let layer = new GraphicsLayer();
                map1.layers.add(layer); - Слой принадлежит карте 1 
                map2.layers.add(layer); - Слой теперь принадлежит карте 2 и будет автоматически удалён из карты 1 map1.layers.remove(layer) 
      */
      const map = new eMap({//иногда используют WebMap
        basemap: 'dark-gray',/*Заготовленный шаблон(профиль) карты. В документации есть кучу Basemaps шаблонов 
                             для тех у кого токен, и без него. Можно самому создать шаблон или использовать готовый*/                              
        ground: "world-elevation", /*параметр для (3d)SceneView земли. Не должно быть null или undefined, должен иметь или заготовленый
                                    профиль от Ground или сам экземпляр  new Ground({}).
                                    В MapView может использоваться если используем виджет с классами ElevationProfileLineGround, new ElevationLayers({}) new ElevationProfile({}) 
                "world-elevation" - 3d земля, работает через Terrain3D Service
                "world-topobathymetry" - 3d грунт, сервис TopoBathy3D
                 */
        //порядок слоёв важен
        layers: [FeatureLayers, WebTileLayers, GraphicsLayers],// 2d слои. один или массив перечисленных слоёв. 
        //layers: [VectorTileLayer, WebTileLayer, WMTSLayer],// или 3d слои,
        //layers: [MapImageLayer , ImageryLayer , WMSLayer ],// какие-то динамические слои,
      })
      




      /* Экземпляр map из полезного содержит: 
          только чтение:  */
        initialized: bool //проинициализирована ли карта
        destroyed: bool//вызыван ли destroy
        declaredClass: "esri.Map"//указывает что за класс используем. 
        allLayers: {// allTables, editableLayers - содержать те же свойства и методы
        /*Странно то что  allLayers объект, но носледует он (кастомные) методы Array и на нём их можем использовать 
        не смотря на то что это объект и эти методы возвращают специфичный объект*/

            getChildrenFunction()
            getCollections()
            itemFilterFunction()
            items: Array(3)
            length: 3
            
            filter((item, inx, )=>{}),//перебирает items, но только наши подклёчённые слои. В items могут быть ещё слои если подлючён готовый basemap
            flatten(()=>{}), map(()=>{})//даже если ничего не возвращать всё равно вернёт объект, просто не изменёный
            getItemAt(1);//вернуть слой по найденный по inx
            on()//change, after-add, after-changes, after-remove и для before 
            /* Пример 
                  map.allLayers.on("change", function(event) {
                    console.log("Layer added: ", event.added);
                    console.log("Layer removed: ", event.removed);
                    console.log("Layer moved: ", event.moved);
                  });
            */
        }
        allTables: {}//что бы работать с этим объектом мы должны использовать вместо графики new Featurelayer 
        editableLayers: {}//какие-то редактируемые слои
        /*
          несмотря на то что можем присваивать к данным свойствам массив layers = [], мы всё равно можем обратиться
          layers.items, что очень странно. Видим объект, layers но можем обращаться как к массиву вызвав любой метод массива 
        */ 
        layers: {
          items: []//массив 
        }
        tables: {}

        //методы
       
        add(layer), addMany([layer]) //добавить на карту слой или пачку слоёв или map.layers.push(layer, layer2);
        remove(layer), removeMany([layer]), removeAll(), //удаление слоёв
        destroy(),//Вырубает карту
        findLayerById(id)//найти слой по id
        findTableById(id)
        reorder(layer, inx);// перемещает слой в массиве изменяя его zIndex относительно других слоёв
        


     
/*------------------------------------------------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------------------------------------------
#######-------<{ Раздел View }>---------###########



      /*
        Карты, сцены, слои являются основой для всех приложений визуального картографирования.
        MapView - для создания 2D-приложений, SceneView - для создания 3D-приложений. 
        2D и 3D варианты используют слои.
      */

    
      const view = new eMapView({//настройки показа 2d карты
        map,
        container: "viewDiv", // div элемент
        //координаты можно узнать в личном кабинете. об этом позже
        center: [-118.847, 34.027], // смещение по x(долгота) y(широта). 0 0 это где-то в индийском океане
        zoom: 13, // уровень увеличения
      	
        allLayerViews,
        animation,
        background,
        basemapView,
        breakpoints,
        constraints: {
          minScale: 150000,//до какого предела увеличивается карта
        },
        extent,
        fatalError,
        floors,
        graphics,
        heightBreakpoint,
        highlightOptions,
        layerViews,
        navigation,
        padding,
        resizeAlign,
        popup,
        rotation,
        scale,
        spatialReference,
        timeExtent,
        ui,
        viewpoint,
        widthBreakpoint
			
			  
      });

    //настройки показа 3d карты
      const view = new eSceneView({//на карте появятся доп. значки управления картой 
        map,
        container: "viewDiv", 
        camera: {
          position: {
            x: -118.808,
            y: 33.961, 
            z: 2000 //высота до карты вместо zoom
          },
          tilt: 90//угол наклона камеры на высоте z
        },
       
      });






/*#######-------<{ События  View }>---------########### */
//Отрабатывает всякий  раз когда создаётся слой
 view.on("layerview-create", (event) => {
  if (event.layer.id === "ny-housing") {
    console.log( event.layerView);
  }
});

















/*------------------------------------------------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------------------------------------------
#######-------<{ Добавление фигур на карту }>---------###########
  В отличие от виджетов, фигуры на карте присваиваются слоем(GraphicsLayer) самой карте,  а не на её
  поверхность отображения. Так что сначала создаём карту, закладываем в неё фигуры и отображаем в 2d||3d режиме
  
  Как сказано было ранее есть 5 способов добавить графику на слой. 
   
  Отличие GraphicsLayer от FeatureLayer и MapImageLayer, GraphicsLayer содержит несколько типов: "point", "polygon", "line".
  Для начала нужно накидать фигур на слой после чего его подключить на карту.
*/


      let pointGraphic = new eGraphic({
        geometry: { 
          type: "point",//"point",  "polyline", "polygon", "multipoint","extent", "mesh"
          longitude: -118.80657463861,//долгота
          latitude: 34.0005930608889//широта
        },
        symbol: {//как будет выглядеть
          type: "simple-marker", /*"simple-marker", "text", "simple-line", "simple-fill", "picture-fill", "shield-label-symbol",
                                   "picture-marker", "point-3d","line-3d", "polygon-3d", "web-style", "mesh-3d", "label-3d", "cim", */
          color: [226, 119, 40], 
          outline: {
              color: [255, 255, 255], 
              width: 1
          }
        },
        // не обязательные. об этом далее
        attributes: {},
        popupTemplate: {
          title: "Заголовок",
          content: `<p style="height: 200px;">Тестовое описание</p>`
        },
        layer: {},
        visible: true //видимость фигуры

      })

  

      let polyline = new eGraphic({
        geometry: {
          type: "polyline",
          paths: [
              [-118.821527826096, 34.0139576938577],
              [-118.814893761649, 34.0080602407843],
              [-118.808878330345, 34.0016642996246] 
          ]
        },
        symbol: {
          type: "simple-line",
          color: [226, 119, 40], 
          width: 2
        }
      })

/*ВАЖНО: тут указывается [долгота, широта]. На яндекс карте можем получить данные как отдельной точки,
         так и нарисовать фигуру, но там [широта, долгота] поменяны местами. Можно использовать метод .reverse() или переворачивать в ручную */
      const polygon = new eGraphic({
        geometry: {
          type: "polygon",
          rings: [
              [-118.818984489994, 34.0137559967283], 
              [-118.806796597377, 34.0215816298725], 
              [-118.791432890735, 34.0163883241613], 
              [-118.79596686535, 34.008564864635],   
              [-118.808558110679, 34.0035027131376]  
          ]
        },
     
        symbol: {
          type: "simple-fill",
          color: [227, 139, 79, 0.8],  // Orange, opacity 80%
          outline: {
              color: [255, 255, 255],
              width: 1
          }
        },
        //атрибуты придумываем самостоятельно
        attributes: {
          Name: 'Какое-то имя',
          Description: 'описание'
        },
        popupTemplate: {
          title: "{Name}",//string | Function | Promise
          content: "{Description}"//string | ({graphic}) => {} | Promise<any>;// например можно при клике получить данные с сервака
        }
    
      });


      
//Методы экземпляра Graphic 
let clonePoint = pointGraphic.clone(); //создаёт глубокою копию. Зачем нужна с теми же координатами хз.
pointGraphic.setAttribute('Description', 'ddddddddddddd')
pointGraphic.getAttribute('Description');
pointGraphic.getObjectId()//должна вернуть id но возвращает null пока не ясно как этим пользоваться
pointGraphic.getEffectivePopupTemplate()//возвращает экземпляр PopupTemplate данной фигуры




  //5 способов добавления фигуры в слой:
      let layer = new GraphicsLayer({
        graphics: [graphicA],
      });

   
      layer.graphics.add(graphicB);
      layer.addMany([graphicD, graphicE]);
      layer.graphics.push(graphicA, graphicB);
      layer.graphics = [graphicA, graphicB]; //Вместо layer.add = graphicA

 

      map.add(layer);

      const view = new eMapView({
        map,//добавляем экземпляр map на 2d view
        center: [-118.80500,34.02700], //Longitude, latitude
        zoom: 13,
        container: "viewDiv",
      });

    
 
      /*
        На самом деле можно добавлять через экземпляр view. Разницы я не заметил и при этом не нужен модуль GraphicsLayer
        Есть ещё пометка в доках:
          Каждая графика может иметь свой собственный символ, указанный, если родительский слой является GraphicsLayer.
          Такое добавление view.graphics.add(pointGraphic); как то ограничивает ли сами фигуры? 
      */



















//Возможные опции в GraphicsLayer
  const districtGraphicsLayer = new GraphicsLayer({
    //возможные опции
    id: "layer1",
    title,
    blendMode: "soft-light",
    effect: "brightness(5) hue-rotate(270deg) contrast(200%)", //функции от css filter:
    elevationInfo: {}, //только для SceneView. Настройка оси z в 3d пространстве
    opacity: 0.5,
    screenSizePerspectiveEnabled: true, // значки размещённые на карте при увеличении и уменьшении правильно располагаются относительно карты
    graphics: [graphicA],
  
    elevationInfo,
    fullExtent,
    listMode,
    maxScale,
    minScale,
    visible,
  });
  

  
  //чтение
  districtGraphicsLayer.loaded; //bool. указывает загружен ли слой
  

    
})


//Отрабатывает при загрузке слоя
districtGraphicsLayer.on("layerview-create", (ev) => {
  console.dir(1);
});


//пока не совсем понял. when ждёт когда слой загрузиться и отрабатывает, но пока от этого пользы не вижу
graphicsLayer.when((layer) => {  });

/*-----------------------------------------------------------------------------------------------------------------------------
##########-------------<{ Слой текста на полигонах }>-----------#############

*/

let textSymbol = {
  type: "text", // autocasts as new TextSymbol()
  text: "You are here",
  angle: 10, //поворот текста
  color: "white",
  backgroundColor: "#000000",
  borderLineColor: "#000000",
  borderLineSize: 2,
  kerning: false, //нужен ли интервал между символами
  lineHight: 5, //высота между строк
  lineWidth: 10, //ширина строки
  rotated: false,
  verticalAlignment: "",
  haloSize: "1px", //размер обводки у текста
  haloColor: "black", //цвет обводки у текста

  xoffset: 3, //смещение по оси
  yoffset: 3, //смещение по оси
  font: {
    // autocasts as new Font()
    family: "Josefin Slab",
    size: 12,
    style: "italic",
    weight: "bold",
  },
};






/*-------------------------------------------------------------------------------------------------------------
#######-------<{ Класс FeatureLayer }>---------###########
  Это тот случай когда нужно взять информацию из какой-т фигуры и вместо того что бы её отображать по нажатию открывая popup
  можно отображать сразу на карте без popup и как виджет
*/
  let gl = new FeatureLayer();

  	 
  let feature = new Feature({
    graphic: pointGraphic3,
    map,
    
   });
   
   view.ui.add(feature, "top-left");

/*-------------------------------------------------------------------------------------------------------------
#######-------<{ Методы Map + Примеры }>---------###########
*/

map.reorder(graphicsLayer1, 0);


//Изменение zIndex Слоёв на карте
let graphicsLayer = new GraphicsLayer({id: 'test1'});
let graphicsLayer1 = new GraphicsLayer({id: 'test2'});
graphicsLayer.add(pointGraphic);
graphicsLayer1.add(pointGraphic2)
const map = new Map({
  basemap: "streets-vector",
  // ground: "world-elevation",
  layers: [graphicsLayer,graphicsLayer1]

})

const view = new MapView({
  map,
  center: [-118.747, 34.007],
  zoom: 13,
  container: "viewDiv",
});

map.reorder(graphicsLayer1, 0)


/*-------------------------------------------------------------------------------------------------------------
###########---------<{ Настройка popup }>---------###########
    
  Не загружая модуль "esri/widgets/Popup", можно воспользоваться некоторыми предустановленными настройками.
  Половину свойств не работает хоть и написано что можно что либо передавать. 


  Есть модуль Popup - с более расширенным функционалом, и PopupTemplate - скромней функционал
*/


/*
  По ум. popup настроен таким образом при достижении < 544px popup прилипает к низу и это поведение не изменить.
  Можно указать breakpoint для смещения этого поведения и даже указывать position, но в любом случаем < 544 он прилипнет к низу
*/
view.popup.dockOptions = {
  breakpoint: { width: 544, height: 544 }, /*@media max-width: 544. Всё что ниже поведение popup заточено под мобилу
                                            View size < breakpoint  то растягивается на 100% в ширину*/
  buttonEnabled: true, //показать или скрыть кнопку открепляющую popup от границ view
}




//только чтение
view.popup.dockEnabled = true; //по ум. false. закреплён ли popup к границам просмотра

//не чтение
view.popup.autoOpenEnabled = false; /*При указании в Graphic свойства popupTemplate будет включен стандартный popup при клике по элементам. Если хотим менять на свой нужно его выключить*/
view.popup.collapseEnabled = false; /*Возможность сворачивать popup.(Сверху popup полоска)  */
view.popup.alignment =
  "bottom-right"; /*Если popup не привязан к какой либо стороне путём внесением изменения данных в position, то
                                        можно отрегулировать его положение относительно элемента на котором вызываем popup.
                                        Можно задать функцию*/

view.popup.dockOptions = {
  buttonEnabled: true, //показать или скрыть кнопку позволяющую пользователю прикрепить popup к одной из сторон границ карты
  breakpoint: {
    width: 544,
    height: 544,
  } /*@media max-width: 544. Всё что ниже поведение popup заточено под мобилу
                                            View size < breakpoint  то растягивается на 100% в ширину*/,
  /*
  По ум. popup настроен таким образом при достижении < 544px popup прилипает к низу и это поведение не изменить.
  Можно указать breakpoint для смещения этого поведения и даже указывать position, но в любом случаем < 544 он прилипнет к низу
*/
};

view.popup.actions = {}; //объект для добавления действий на popup панель

//Методы
view.popup.open({
  //Можно открывать popup в событиях
  title: "Reverse geocode",
  location: event.mapPoint,
  content: "This is a point of interest",
});


/*-----------------------------------------------------------------------------------------------------------------------------
##########-------------<{  Добавление кнопок в popup }>-----------#############
*/

view.popup.actions.push({title: 'Кнопки1', id: 'test-id', className: 'my-popup'});//описываем объект на который будем ориентироваться 

view.popup.on("trigger-action", function(event){//отрабатывает на любые кнопки на popup
 
  if(event.action.id === "test-id"){
    test();
  }
});



/*-----------------------------------------------------------------------------------------------------------------------------
##########-------------<{ Раздел popupTemplate }>-----------#############
*/



/*
  В content: string | [{},{}] | promise | function
  string - Пишем любую строку даже строку с html элементами
  [{},{}] -   Массив объектов, каждый из которых содержит как минимум описывающий данные type.
    type: "fields" - поля которые будут отображаться как строки в таблице
    fieldInfos = [{},{}] - сопутствующий данному типу массив принимающий описание числовых полей

    type: "media" - будет создан слайдер 
    mediaInfos




    Не знаю зачем но в док. указано много классов, без которых и так можно взаимодействовать с кодом.
    Например:

    let textElement = new TextContent();
    textElement.text = "There are {Point_Count} trees within census block {BLOCKCE10}";

    let template = new PopupTemplate({
      title: "Заголовок",
      outFields: ["*"],
      content: [textElement]
      //если можно так 
       content: [
        {
          type: 'text',
          text: "<div class='test1'>Текст</div>"//или new TextContent().text
        }
      ]
    });

*/

popupTemplate: {
  title: "Какой-то заголовок";
  content: [
    {
      type: "text",
      text: "<div class='test1'>Текст</div>", //или new TextContent().text
    },

    {
      type: "fields", // Будет создана в popup типа таблица строки которой будет отличаться друг от друга
      fieldInfos: [
        {
          fieldName: "Числовые поля",
          label: "sda", //label приоритетней чем fieldName

          format: {
            //форматирование для числовых полей
            places: 0,
            digitSeparator: false, //ни на что не влияет хотя указана в доках
          },
        },
        {
          fieldName: "expression/per-asian",
        },
      ],
    },
    {
      type: "media", //text, media, fields, attachments, custom
      mediaInfos: [
        {
          title: "<b>Mexican Fan Palm</b>",
          type: "image", // указание типа данного медиа поля
          caption: "tree species",

          value: {
            sourceURL:
              "https://www.sunset.com/wp-content/uploads/96006df453533f4c982212b8cc7882f5-800x0-c-default.jpg",
            fields: ["relationships/0/Point_Count_COMMON"],
            normalizeField: null,
            tooltipField: "relationships/0/COMMON",
          },
        },
      ],
    },
  ];
}































/*------------------------------------------------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------------------------------------------
#######-------<{ Добавление виджетов на карту }>---------###########

  Например переключение на гибрид.
  Виджеты добавляются на поверхность отображённой карты. 
  (далее будут фигуры на карте, они закладываются предварительно в карту, и карта закидывается в 2d-3d отображение) 
  
*/

const basemapToggle = new eBasemapToggle({//мини виджет миникарт: гибрид, топография
  view: view, //добавляем карту 2d или 3d карту
  nextBasemap: "arcgis-imagery"
});

view.ui.add(basemapToggle, 'bottom-right')//указываем, какой виджет добавить и куда


const BasemapGallery = new eBasemapGallery({//виджет со скролом вариантов карт
  view: view, 
  source: {
    query: {
      title: '"World Basemaps for Developers" AND owner:esri',//это типа какой-то запрос вариантов отображаемых в виджете
    }
  }
});

view.ui.add(BasemapGallery, 'top-right')//указываем, какой виджет добавить и куда

/*------------------------------------------------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------------------------------------------
#######-------<{ Создание собственных шаблонов для карты }>---------###########

Есть 2 типа: "векторный слой"(VectorTileLayer) и слой "мозайка"(TileLayer) 
Создание этих карт происходит в ArcGISOnline, но как пока не понятно.
После того как карта создана можно получить id и загрузить её
*/
  //1й слой основной слой дорог
  const vectorTileLayer = new eVectorTileLayer({
    portalItem: {
      id: "6976148c11bd497d8624206f9ee03e30" 
    },
    opacity: .75
  });
  //2й слой рельефа 
  const imageTileLayer = new eTileLayer({
    portalItem: {
      id: "1b243539f4514b6ba35e7d995890db1d" 
    }
  });
  //складываем слои на слой рельефа наложен будет слой дорог
  const basemap = new eBasemap({
    baseLayers: [ imageTileLayer, vectorTileLayer ]//порядок имеет значение
  });
  //инициализируем наш профиль в карте
  const map = new Map({
    basemap,
  });
  //выводим в 2d карте и настраиваем
  const view = new eMapView({
    container: "viewDiv",
    map: map,
    center: [-100,40],
    zoom: 3
  });
