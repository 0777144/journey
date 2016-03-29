window.log=function(){try{return console.log.apply(console,arguments)}catch(_error){}};
window.dir=function(){try{return console.dir.apply(console,arguments)}catch(_error){}};
window.info=function(){try{return console.info.apply(console,arguments)}catch(_error){}};

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

getJson('data/cardsABC.json')
    .then(cards => {
        log(cards); // cards before
        let newCards = Journey.route(cards); // cards after sorting
        //log(newCards);
        let instructions = Journey.getInstructions(newCards); // cards after sorting
        log(instructions);

        Journey.simplePrint('#instructions',newCards);

    });

Journey.addTicketType("bus", function(card){
    let ticket = {
        number: card.ticket.number == "" ? "" : `${card.ticket.number} `,
        spec: card.ticket.spec == "" ? "" : `the ${card.ticket.spec} `,
        seat: card.ticket.seat == "" ? "No seat assignment." : `Seat ${card.ticket.seat}.`
    };
    return `Take ${ticket.spec}bus ${ticket.number}from ${card.from} to ${card.to}. ${ticket.seat}`;
});
