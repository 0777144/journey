


var journey = new Journey(cards);

var journey = new Journey({
    bus(card){
        let ticket = {
            number: card.ticket.number == "" ? "" : `${card.ticket.number} `,
            spec: card.ticket.spec == "" ? "" : `the ${card.ticket.spec} `,
            seat: card.ticket.seat == "" ? "No seat assignment." : `Seat ${card.ticket.seat}.`
        };
        return `Take ${ticket.spec}bus ${ticket.number}from ${card.from} to ${card.to}. ${ticket.seat}`;
    }
},cards);

journey.printInstructions("#instructions");

journey
    .addType("bus", function(card){
        let ticket = {
            number: card.ticket.number == "" ? "" : `${card.ticket.number} `,
            spec: card.ticket.spec == "" ? "" : `the ${card.ticket.spec} `,
            seat: card.ticket.seat == "" ? "No seat assignment." : `Seat ${card.ticket.seat}.`
        };
        return `Take ${ticket.spec}bus ${ticket.number}from ${card.from} to ${card.to}. ${ticket.seat}`;
    })
    .getInsructions();

// --- ----- -------- ----- -------- ----- -----

var journey = new Journey();

journey
    .loadCards(cards)
    .printInstructions("#instructions");

journey
    .addType("bus", function(card){
        let ticket = {
            number: card.ticket.number == "" ? "" : `${card.ticket.number} `,
            spec: card.ticket.spec == "" ? "" : `the ${card.ticket.spec} `,
            seat: card.ticket.seat == "" ? "No seat assignment." : `Seat ${card.ticket.seat}.`
        };
        return `Take ${ticket.spec}bus ${ticket.number}from ${card.from} to ${card.to}. ${ticket.seat}`;
    })
    .getInsructions();


// --- ----- -------- ----- -------- ----- -----

Journey.fn.types.extend({
    bus(card){
        let ticket = {
            number: card.ticket.number == "" ? "" : `${card.ticket.number} `,
            spec: card.ticket.spec == "" ? "" : `the ${card.ticket.spec} `,
            seat: card.ticket.seat == "" ? "No seat assignment." : `Seat ${card.ticket.seat}.`
        };
        return `Take ${ticket.spec}bus ${ticket.number}from ${card.from} to ${card.to}. ${ticket.seat}`;
    },
    boat(card){
        let ticket = card.getTiket({
            number: number => number == "" ? "" : `${number} `,
            spec: spec == "" ? "" : `the ${card.ticket.spec} `
        });

        return ``;
    }
})











var journey = new Journey({
    option: "value"
},cards);

// --- ----- -------- ----- -------- ----- -----







////


Cards.sort();
// получаем отсортированный массив карточек

Cards.showWay();

Api
    //.loadCards('url')
    .sort()
    .getWay();

//var card = {
//    from: "",
//    to: "",
//    ticket: {
//        type: "airplane",
//        number: ""
//    }
//};

var tickets = [
    {
        type: "airplane"

    },
    {
        type: "train",
        number: "78A",
        seat: "45B"

    },
    {
        type: "bus",
        seat: ""

    }
];

var Journey = {};

var myWay = new Journey(cards);

ymaps.ready(function () {
    var myMap = new ymaps.Map('map', {
            center: [55.751574, 37.573856],
            zoom: 9
        }, {
            searchControlProvider: 'yandex#search'
        }),
        myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
            hintContent: 'Собственный значок метки',
            balloonContent: 'Это красивая метка'
        }, {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'default#image',
            // Своё изображение иконки метки.
            iconImageHref: 'images/myIcon.gif',
            // Размеры метки.
            iconImageSize: [30, 42],
            // Смещение левого верхнего угла иконки относительно
            // её "ножки" (точки привязки).
            iconImageOffset: [-3, -42]
        });

    myMap.geoObjects.add(myPlacemark);
});


//Api.loadCards([])
//    .sortCards()
//    .getWay() // return Array with steps ['go from A to B ...', 'go from B to C ...']
//Api.loadCards('url').then(cards => {Api.sort(cards)});