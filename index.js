(function () {
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

    Journey.fn.addTicketType("bus", function(card){
        let ticket = {
            number: card.ticket.number == "" ? "" : `${card.ticket.number} `,
            spec: card.ticket.spec == "" ? "" : `the ${card.ticket.spec} `,
            seat: card.ticket.seat == "" ? "No seat assignment." : `Seat ${card.ticket.seat}.`
        };
        return `Take ${ticket.spec}bus ${ticket.number}from ${card.from} to ${card.to}. ${ticket.seat}`;
    });


    getJson('data/cards.json')
        .then(cards => {
            var journey = new Journey(cards);
            //var types = journey.getTypes(); // ["airplane", "train", "bus"]
            //var instructions = journey.getInstructions(); // ["Take bus 848F from A to B. Seat 98J.",
                                                            //  "From B, take flight UF22 to C. Gate 5. Seat undefi… be automatically transferred from your last leg.",
                                                            //  "Take bus 701C from C to D. Seat 36R.",
                                                            //  "From D, take flight FZ83 to B. Gate 35. Seat undef… be automatically transferred from your last leg.",
                                                            //  "From B, take flight YN11 to E. Gate 0. Seat undefi… be automatically transferred from your last leg."]

            //var simpleInstruction = journey.getSimple(); // ["From A to  B", "From B to  C", "From C to  D", "From D to  B", "From B to  E"]

            journey.printInstructions("#instructions");
            journey.printSimple("#simple");
        });
})();
