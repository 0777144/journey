# Journey

Journey is simple lib to manage your travel cards and get instructions for trip.
To learn more, please visit the <a>project page</a>

# Input data format
```javascript
[
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
    }
]
```
# Example

```javascript
    var journey = new Journey(inputData); // creating your journey

    journey.printInstructions("#instructions"); // instructions will be append to #instructions element
    journey.printSimple("#simple"); // simple print without types, only point. From A to B.

    var instructions = journey.getInstructions(); // return array of instructions
    // ["Take bus 848F from A to B. Seat 98J.",
    //  "From B, take flight UF22 to C. Gate 5. Seat undefi… be automatically transferred from your last leg.",
    //  "Take bus 701C from C to D. Seat 36R.",
    //  "From D, take flight FZ83 to B. Gate 35. Seat undef… be automatically transferred from your last leg.",
    //  "From B, take flight YN11 to E. Gate 0. Seat undefi… be automatically transferred from your last leg."]

    var simpleInstruction = journey.getSimple(); // return array of simple instructions if you just want to know route
    // ["From A to  B", "From B to  C", "From C to  D", "From D to  B", "From B to  E"]

    var types = journey.getTypes();// return ["airplane", "train"] - it is default types

```

# Add custom type example
 ```javascript
    // add types before creating a Journey object
    Journey.fn.addTicketType("bus", function(card){
        let ticket = {
            number: card.ticket.number == "" ? "" : `${card.ticket.number} `,
            spec: card.ticket.spec == "" ? "" : `the ${card.ticket.spec} `,
            seat: card.ticket.seat == "" ? "No seat assignment." : `Seat ${card.ticket.seat}.`
        };
        return `Take ${ticket.spec}bus ${ticket.number}from ${card.from} to ${card.to}. ${ticket.seat}`;
    });

    var journey = new Journey(inputData);
    var types = journey.getTypes();// and now you can check that type was added, return ["airplane", "train", "bus"]

    // now you can print it
    journey.printInstructions("#instructions");
 ```
