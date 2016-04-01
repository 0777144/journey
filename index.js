(function () {
    
    var cards = [
  {
    "from": "A",
    "to": "B",
    "ticket": {
      "type": "bus",
      "number": "848F",
      "spec": "",
      "seat": "98J"
    }
  },
  {
    "from": "D",
    "to": "B",
    "ticket": {
      "type": "airplane",
      "number": "FZ83",
      "spec": "",
      "seat": "30C",
      "gate": 35,
      "baggage": "auto"
    }
  },
  {
    "from": "B",
    "to": "E",
    "ticket": {
      "type": "airplane",
      "number": "YN11",
      "spec": "",
      "seat": "81D",
      "gate": 0,
      "baggage": "auto"
    }
  },
  {
    "from": "C",
    "to": "D",
    "ticket": {
      "type": "bus",
      "number": "701C",
      "spec": "",
      "seat": "36R"
    }
  },
  {
    "from": "B",
    "to": "C",
    "ticket": {
      "type": "airplane",
      "number": "UF22",
      "spec": "",
      "seat": "16R",
      "gate": 5,
      "baggage": "auto"
    }
  }
];
    Journey.fn.addTicketType("bus", function(card){
        let ticket = {
            number: card.ticket.number == "" ? "" : `${card.ticket.number} `,
            spec: card.ticket.spec == "" ? "" : `the ${card.ticket.spec} `,
            seat: card.ticket.seat == "" ? "No seat assignment." : `Seat ${card.ticket.seat}.`
        };
        return `Take ${ticket.spec}bus ${ticket.number}from ${card.from} to ${card.to}. ${ticket.seat}`;
    });


   var journey = new Journey(cards);
    journey.printInstructions("#instructions");
    journey.printSimple("#simple");
})();
