var Journey = (function(){
    "use strict";
    var ticketTypes = {
        airplane(card){
            let ticket = {
                number: card.ticket.number,
                gate: card.ticket.gate,
                spec: card.ticket.spec == "" ? "" : `the ${card.ticket.spec} `,
                baggage: card.ticket.baggage == "auto" ? "Baggage will be automatically transferred from your last leg."
                    : `Baggage drop at ticket counter ${card.ticket.baggage}.`
            };
            return `From ${card.from}, take ${ticket.spec}flight ${ticket.number} to ${card.to}. Gate ${ticket.gate}. Seat ${ticket.seat}. ${ticket.baggage}`;
        },
        train(card){
            return `Take train ${card.ticket.number} from ${card.from} to ${card.to}. Seat ${card.ticket.seat}.`;
        }
    }

    var sort = function(input){
        input = Array.from(input) || [];// передача по значнеию
        // валидация входных данных
        // и копирование их, а не изменение по ссылке
        var start_from = input[0].from,
            end_to = input[0].to;

        var result = input.splice(0, 1);

        while(input.length > 0){
            for (var i = 0; i < input.length; i++){
                if(input[i].from == end_to){
                    end_to = input[i].to;
                    var deleted_elem = input.splice(i,1)[0];
                    result.push(deleted_elem);
                } else if(input[i].to == start_from){
                    start_from = input[i].from;
                    var deleted_elem = input.splice(i,1)[0];
                    result.splice(0,0,deleted_elem);
                }
            }
        }

        return result;
    };

    var outCard = function(card){
        if(ticketTypes[card.ticket.type] != undefined)
            return ticketTypes[card.ticket.type](card);
        else throw new Error('Ticket type not found.');
    }


    return {
        route(value){
            return sort(value);
        },
        getInstructions(cards){
            let i;
            let result = [];
            for(i in cards){
                result.push(outCard(cards[i]));
            }
            return result;
        },
        addTicketType(type, callback){
            ticketTypes[type] = callback;
        },
        printWay(elem,instructions){
            let list = "";
            for(let i=0;i<instructions.length;i++)
                list += `<li>${instructions[i]}</li>`;

            document.querySelector(elem).innerHTML += `<ul>${list}</ul>`;
        },
        simplePrint(elem,cards){
            let list = "";
            for(let i=0;i<cards.length;i++)
                list += `<li>From ${cards[i].from} to  ${cards[i].to}</li>`;

            document.querySelector(elem).innerHTML += `<ul>${list}</ul>`;
        }
    }
})();