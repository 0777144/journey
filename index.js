window.log=function(){try{return console.log.apply(console,arguments)}catch(_error){}};
window.dir=function(){try{return console.dir.apply(console,arguments)}catch(_error){}};
window.info=function(){try{return console.info.apply(console,arguments)}catch(_error){}};
window.dump=function(obj){console.log(JSON.stringify(obj, null, 2)); };
window.dmp=function(obj){console.log(JSON.stringify(obj, null)); };

function getJson(url){
    return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                var data = JSON.parse(request.responseText);
                resolve(data);
            } else {
                reject();
            }
        };

        request.onerror = function() {
            reject();
        };

        request.send();
    });
}

getJson('data/cardsABE.json')
    .then(cards => {


        Journey.init(cards);

        //log(cards); // cards before
        //let newCards = Journey.route(cards); // cards after sorting
        //log(newCards);
        //let instructions = Journey.getInstructions(newCards); // cards after sorting
        //log(instructions);

        //Journey.simplePrint('#instructions',newCards);

        //log(cards);
        //log(Journey.getPoints(cards));
        //Journey.test(cards);

    });

Journey.addTicketType("bus", function(card){
    let ticket = {
        number: card.ticket.number == "" ? "" : `${card.ticket.number} `,
        spec: card.ticket.spec == "" ? "" : `the ${card.ticket.spec} `,
        seat: card.ticket.seat == "" ? "No seat assignment." : `Seat ${card.ticket.seat}.`
    };
    return `Take ${ticket.spec}bus ${ticket.number}from ${card.from} to ${card.to}. ${ticket.seat}`;
});


//var a1 = [1,2,3,4,5];
//var a2 = [21,22];
//
////log([2, 0].concat(a2))
//a1.splice.apply(a1, [3, 0].concat(a2));
//
//
//log(a1); // [1, 2, 21, 22, 3, 4, 5];
//
//var a1 = [1,2,3,4,5];
//var a2 = [21,22];
//
//var result = a1.slice( 0, 2 ).concat( a2 ).concat( a1.slice( 2 ) );
//log(a1.slice( 0, 2 ));
//log(a1.slice( 0, 2 ).concat( a2 ));
//log(result);