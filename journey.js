var Journey = (function (){
    "use strict";

    var adjacencyMatrix = [], // матрица смежности
        nodes = [], // вершины
        edges = {}, // ребра
        nodesIndexes = {}, // объект для получения индекса вершины по имени
        nodesSequence = [],
        edgesSequence = [],
        instructions;

    var dfsVisited = [];
    var dfs = function (matrix,u) {
        dfsVisited[u] = true;
        for(let v = 0; v < matrix[u].length; v++) {
            if(matrix[u][v] == 1 && !dfsVisited[v])
                dfs(matrix,v);
        }
    };

    var Journey = function () {
        if( arguments.length == 2 ) {
            for( let type in arguments[1])
                ticketTypes[type] = arguments[1][type];
            init(arguments[0])
        } else if( arguments.length == 1 ) {
            init(arguments[0])
        } else {
            throw new Error('Too many arguments');
        }
    };

    //window.Journey = Journey;
    const merge = (...sources) => Object.assign({}, ...sources);

    var init = function (data) {
        edges = getEdges(data); // {"AB":{},"BC":{},"CD":{}}
        nodes = getNodes(data); // ["A","B", "D", "E", "C"]
        nodesIndexes = getNodesIndexes(data); // {"A":0,"B":1,"D":2,"E":3,"C":4}
        adjacencyMatrix = makeAdjacencyMatrix(data); // [[0,1,0,0,0],
                                                     //  [0,0,0,1,1],
                                                     //  [0,1,0,0,0],
                                                     //  [0,0,0,0,0],
                                                     //  [0,0,1,0,0]]

        if(!checkForEulerPath(adjacencyMatrix))
            throw new Error('граф не является эйлеровым');

        nodesSequence = findEulerPath(adjacencyMatrix);
        for( let i=0; i < nodesSequence.length-1; i++) {
            let from = nodesSequence[i],
                to = nodesSequence[i+1];

            edgesSequence.push(edges[from+to]);
        }
        instructions = getInstructions(edgesSequence);
    };

    var getInstructions = function (edgesSeq) {
        let card,
            instructions = [];

        for(let i = 0; i < edgesSeq.length; i++) {
            card = edgesSeq[i];
            instructions.push(outCard(card));
        }
        return instructions;
    };

    var checkForEulerPath = function (matrix) {
        let oddVertex = 0,
            visited = [];

        for(let v = 0; v < matrix.length; v++) {
            if( nodeDegree(matrix,v) != 0)
                oddVertex++;
        }
        if(oddVertex > 2)
            return false;

        for(let v = 0; v < matrix.length; v++) {
            visited[v] = false; // массив инициализируется значениями false
        }

        dfsVisited = visited;

        for(let v = 0; v < matrix.length; v++) {
            if( nodeDegree(matrix,v) == 1) { // начинаем с начала графа (вершина со степенью 1 является началом)
                dfs(matrix,v);
                break;
            }
        }

        for(let v = 0; v < matrix.length; v++) {
            if(nodeDegree(matrix,v) != 0 && !dfsVisited[v])
                return false;
        }
        return true;  // граф является эйлеровым
    };

    // степень вершины ориентированного графа = полустепень захода - полуспенень выхода
    // для корректной работы элйлерова обхода
    var nodeDegree = function (matrix, nodeIndex) {
        let degree = 0;
        for(let i = 0; i < matrix.length; i++) {
            if(matrix[nodeIndex][i] === 1)
                degree++;
            if(matrix[i][nodeIndex] === 1)
                degree--;
        }
        return degree;
    };

    var findEulerPath = function(matrix) {
        let resultNodes = [],
            n = nodes.length,
            stack = [];

        for(let v = 0; v < matrix.length; v++) {
            if( nodeDegree(matrix,v) == 1) { // т.к. графа является полуэйлеровым запускаем из вершины со степенью 1 (является началом)
                stack.push(v);
                break;
            }
        }

        while (stack.length > 0) {
            var w = stack[stack.length-1]; // stack.top()
            for(var u = 0; u < matrix[w].length; u++) {
                if(matrix[w][u] === 1) {
                    stack.push(u);
                    matrix[w][u] = 0; // E.remove(w, u)
                    break;
                }
            }
            if(w == stack[stack.length-1]) {
                stack.pop();
                resultNodes.unshift(nodes[w]);
            }
        }
        return resultNodes;
    };

    var makeAdjacencyMatrix = function (data) {
        // if !isArray throw new Error TODO
        let vertices = nodes.length > 0 ? nodes : getNodes(data),// nodes = nodes будет ошибка
        // потому что он думает что это локальные nodes
        //    nodesAssoc = {}, // объект для получения индекса вершины по имени
            node = [], // строка матрицы - отношения вершины к другим вершинам
            matrix = [];

        for(let i = 0; i < vertices.length; i++) {
            node[i] = 0;
            //nodesAssoc[vertices[i]] = i;
        }

        for(let i = 0; i < vertices.length; i++) {
            matrix[i] = node.slice(); // копируем пустой массив для каждой вершины
        }

        // Заполнение matrix значениями
        let fromIndex,
            toIndex;
        for(let i=0;i<data.length;i++) {
            fromIndex = nodesIndexes[data[i].from];
            toIndex = nodesIndexes[data[i].to];

            matrix[fromIndex][toIndex] = 1;
        }
        return matrix;
    };

    // получаем список вершин графа
    // data - список карточке формата {from: "A", to: "B"}
    // возвращает массив уникальных вершин(городов в которых побываем) [A,B,C...]
    var getNodes = function (data) {
        let from,
            to,
            nodes = [];

        for(let i=0;i<data.length;i++) {
            from = data[i].from;
            to = data[i].to;

            if(nodes.indexOf(from) === -1)
                nodes.push(from);

            if(nodes.indexOf(to) === -1)
                nodes.push(to);
        }
        return nodes;
    };

    var getEdges = function (data) {
        let from,
            to,
            edges = {};

        for(let i=0;i<data.length;i++) {
            from = data[i].from;
            to = data[i].to;

            if(edges[from+to] === undefined)
                edges[from+to] = data[i];
        }
        return edges;
    };

    var getNodesIndexes = function(data) {
        let vertices = nodes.length > 0 ? nodes : getNodes(data),
            indexes = {};

        for(let i = 0; i < vertices.length; i++) {
            let nodeName = vertices[i];
            indexes[nodeName] = i;
        }

        return indexes;
    };

    var ticketTypes = {
        airplane(card) {
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
    };

    var outCard = function(card){
        if(ticketTypes[card.ticket.type] != undefined)
            return ticketTypes[card.ticket.type](card);
        else throw new Error('Ticket type not found.');
    };

    Journey.fn = Journey.prototype = {
        getInstructions(){
            return instructions;
        },
        printInstructions(elem){
            let list = "";
            for(let i=0;i<instructions.length;i++)
                list += `<li>${instructions[i]}</li>`;

            document.querySelector(elem).innerHTML += `<ul>${list}</ul>`;
        },
        getSimple(){
            let simple = [];
            for(let i = 0; i < edgesSequence.length; i++)
                simple.push(`From ${edgesSequence[i].from} to  ${edgesSequence[i].to}`)
            return simple;
        },
        printSimple(elem){
            let list = "";
            for(let i=0;i<edgesSequence.length;i++)
                list += `<li>From ${edgesSequence[i].from} to  ${edgesSequence[i].to}</li>`;

            document.querySelector(elem).innerHTML += `<ul>${list}</ul>`;
        },
        addTicketType(type, callback){
            ticketTypes[type] = callback;
        },
        getTypes(){
            let types = [];
            for(let t in ticketTypes)
                types.push(t);
            return types;
        }
    };
    
    return Journey;
}());