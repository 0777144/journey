var Journey = (function (){
    "use strict";

    var incidenceMatrix = [], // матрица инцидентности
        adjacencyMatrix = [], // матрица смежности
        nodes = [], // вершины
        edges = [], // ребра
        nodeParityDegrees = [], //четность степени вершин
        nodeParityDegreesAssoc = {}, //четность степени вершин по имени
        nodesIndexes = {}, // объект для получения индекса вершины по имени
        startNode,
        endNode;

    var Journey = function (data) {
        init(data);
    };

    //window.Journey = Journey;

    const merge = (...sources) => Object.assign({}, ...sources);

    var init = function (data) {
        //edges = getEdges(data);
        nodes = getNodes(data); // ["A","B", "D", "E", "C"]
        nodesIndexes = getNodesIndexes(data); // {"A":0,"B":1,"D":2,"E":3,"C":4}
        adjacencyMatrix = makeAdjacencyMatrix(data); // [[0,1,0,0,0],
                                                     //  [0,0,0,1,1],
                                                     //  [0,1,0,0,0],
                                                     //  [0,0,0,0,0],
                                                     //  [0,0,1,0,0]]
        /*
        log( `${nodes[0]} ${nodeDegree(adjacencyMatrix,0)}` );
        log( `${nodes[1]} ${nodeDegree(adjacencyMatrix,1)}` );
        log( `${nodes[2]} ${nodeDegree(adjacencyMatrix,2)}` );
        log( `${nodes[3]} ${nodeDegree(adjacencyMatrix,3)}` );
        log( `${nodes[4]} ${nodeDegree(adjacencyMatrix,4)}` );
        */

        if(!checkForEulerPath(adjacencyMatrix))
            throw new Error('граф не является эйлеровым');
        findEulerPath(adjacencyMatrix);
        //checkForEulerPath();
        //dmp(adjacencyMatrix);
        //dir(nodes);
        //adjacencyMatrix = makeAdjacencyMatrix3(data);
        //nodeParityDegrees = getNodeParityDegrees(data);
        //adjacencyMatrix = makeAdjacencyMatrix(data);
        //dump(adjacencyMatrix);
        //checkForEulerPath();
        //findEulerPath();
    };

/*
    var makeAdjacencyMatrix0 = function (data) {
        // if !isArray throw new Error TODO
        //Создание пустой matrix
        //let vertices = nodes || getNodes(data),// nodes = nodes будет ошибка потому что он думает что это локальные nodes
        let vertices = getNodes(data),// nodes = nodes будет ошибка потому что он думает что это локальные nodes
            nodesAssoc = {},
            matrix = {};

        vertices.forEach(function(node, i){
            nodesAssoc[node] = 0;// { A:0, B:0, C:0...}
        });

        matrix = merge({},nodesAssoc);// что matrix не ссылалась на nodesAssoc
        for(let node in matrix){
            matrix[node] = merge({},nodesAssoc);
        }

        // Заполнение matrix значениями
        let from,
            to;
        for(let i=0;i<data.length;i++) {
            from = data[i].from;
            to = data[i].to;

            matrix[from][to] = 1;
        }
        return matrix;
    };

    var makeAdjacencyMatrix2 = function (data) {
        // if !isArray throw new Error TODO
        //Создание пустой matrix
        let nodesAssoc = nodes.length > 0 ? merge({},nodes) : getNodes2(data),//|| getNodes2(data),// nodes = nodes будет
        // ошибка потому что он думает что это локальные nodes
            matrix = {};

        delete nodesAssoc.length;// length нам больше не нужен и будет только создвать ошибки при переборе for...in
        //обнуляем все значения
        for(let node in nodesAssoc) { nodesAssoc[node] = 0; }

        matrix = merge({},nodesAssoc);// что matrix не ссылалась на nodesAssoc
        for(let node in matrix){
            matrix[node] = merge({},nodesAssoc);
        }

        // Заполнение matrix значениями
        let from,
            to;
        for(let i=0;i<data.length;i++) {
            from = data[i].from;
            to = data[i].to;

            matrix[from][to] = 1;
        }
        return matrix;
    };

    var printMatrix = function(elem,matrix){
        let rows = '',
            rowHeader = '<th></th>';

        for(let i in matrix){
            let cols = `<th>${i}</th>`;

            for(let j in matrix[i]){
                cols += `<td>${matrix[i][j]}</td>`;
            }

            rows += `<tr>${cols}</tr>`;
            rowHeader += `<th>${i}</th>`;
        }
        document.querySelector(elem).innerHTML += `<table>${rowHeader+rows}</table>`;
    };
*/


    var checkForEulerPath = function (matrix) {
        let oddVertex = 0,
            visited = [];

        for(let v = 0; v < matrix.length; v++) {
            if( nodeDegree(matrix,v) != 0)
                oddVertex++;
        }
        if(oddVertex > 2)
            return false

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
/*
    vector<bool> visited;                       //вектор для хранения информации о пройденных и не пройденных вершинах

    void dfs(int u)
    {
        visited[u] = true;                      //помечаем вершину как пройденную
        for (v таких, что (u, v) — ребро в G)   //проходим по смежным с u вершинам
        if (!visited[v])                    //проверяем, не находились ли мы ранее в выбранной вершине
            dfs(v);
    }
*/
    var dfsVisited = [];
    var dfs = function (matrix,u) {
        dfsVisited[u] = true;
        for(let v = 0; v < matrix[u].length; v++) {
            if(matrix[u][v] == 1 && !dfsVisited[v])
                dfs(matrix,v);
        }
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
        let n = nodes.length,
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
                info(nodes[w]);
            }
            //break;
        }
        //условно прежположительно знаем что начнем с первой вершины TODO
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

    var getNodesIndexes = function(data) {
        let vertices = nodes.length > 0 ? nodes : getNodes(data),
            indexes = {};

        for(let i = 0; i < vertices.length; i++) {
            let nodeName = vertices[i];
            indexes[nodeName] = i;
        }

        return indexes;
    };

    var getNodeParityDegrees = function (data) {
        let fromIndex,
            toIndex,
            nodes = [];

        for(let i=0;i<data.length;i++) {
            fromIndex = nodesIndexes[data[i].from];
            toIndex = nodesIndexes[data[i].to];

            nodes[fromIndex] = nodes[fromIndex] === undefined ? 1 : nodes[fromIndex] + 1;
            nodes[toIndex] = nodes[toIndex] === undefined ? -1 : nodes[toIndex] - 1;
        }
        return nodes;
    };

    var getNodeParityDegreesAssoc = function (data) {
        let from,
            to,
            nodes = {};

        for(let i=0;i<data.length;i++) {
            from = data[i].from;
            to = data[i].to;

            // easy detect start(1) and end(-1) and even of nodes
            // {A: 1, B: 0, D: 0, E: -1, C: 0}
            nodes[from] = nodes[from] === undefined ? 1 : nodes[from] + 1;
            nodes[to] = nodes[to] === undefined ? -1 : nodes[to] - 1;

            // this way return smt like {A: 6, B: 5, D: 5, E: 4, C: 5} it is not very clear
            // (but maybe faster, bcs || faster than ( ? : )
            //nodes[from] = nodes[from] + 1 || 1 + data.length;// nodes[from] + 1 || 1 but if nodes[from] = -1 than (-1+1=0 || 1)=1 instead 0
            //nodes[to] = nodes[to] - 1 || -1 + data.length;
        }
        nodes.length = data.length;
        return nodes;
    };

    /*
    var getNodeParityDegrees0 = function (data) {
        let fromIndex,
            toIndex,
            nodes = {};

        for(let i=0;i<data.length;i++) {
            fromIndex = data[i].from;
            toIndex = data[i].to;

            // easy detect start(1) and end(-1) and even of nodes
            // {A: 1, B: 0, D: 0, E: -1, C: 0}
            nodes[from] = nodes[from] === undefined ? 1 : nodes[from] + 1;
            nodes[to] = nodes[to] === undefined ? -1 : nodes[to] - 1;

            // this way return smt like {A: 6, B: 5, D: 5, E: 4, C: 5} it is not very clear
            // (but maybe faster, bcs || faster than ( ? : )
            //nodes[from] = nodes[from] + 1 || 1 + data.length;// nodes[from] + 1 || 1 but if nodes[from] = -1 than (-1+1=0 || 1)=1 instead 0
            //nodes[to] = nodes[to] - 1 || -1 + data.length;
        }
        nodes.length = data.length;
        return nodes;
    };
    */

    var getEdges = function (data) {
        let from,
            to,
            edges = [];

        for(let i=0;i<data.length;i++) {
            from = data[i].from;
            to = data[i].to;

            if(edges[from+to] === undefined)
                edges[from+to] = data[i];
        }
        return edges;
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
    }

    var sort = function(input){
        input = Array.from(input) || [];// передача по значнеию
        // валидация входных данных
        // и копирование их, а не изменение по ссылке
        var startFrom = input[0].from,
            endTo = input[0].to;

        var result = input.splice(0, 1);

        // input.length+1 чтобы не оставались куски по 1 элементу в случае зацикленного пути
        for (var j = 0; j < input.length + 1; j++){
            for (var i = 0; i < input.length; i++){
                if(input[i].from == endTo){
                    endTo = input[i].to;
                    var deleted_elem = input.splice(i,1)[0];
                    result.push(deleted_elem);
                } else if(input[i].to == startFrom){
                    startFrom = input[i].from;
                    var deleted_elem = input.splice(i,1)[0];
                    result.splice(0,0,deleted_elem);
                }
            }
        }

        if(input.length > 0) {
            var part = sort(input),
                partStartFrom = part[0].from,
                partEndTo = part[part.length-1].to;

            log('part');
            log(part);
            //if(partStartFrom != partEndTo){
            //    while(partStartFrom != partEndTo){
            //        //log(part);
            //        var first = part.slice(1);
            //        log('first');
            //        log(first);
            //        break;
            //    }
            //}
            log(result);
            for(var i = 0; i < result.length-1; i++){
                if(result[i].from == partEndTo && result[i+1].to == partStartFrom){
                    //alert(1);
                    //log(i)
                    result.splice.apply(result, [0, 0].concat(part));
                    log(result);
                    //result = result.slice( 0, i ).concat( part ).concat( result.slice( i ) );
                    break;

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
        init(data){
            init(data);
        },
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
        },
        getPoints(cards){
            return getNodes(cards);
        },
        test(cards){
            let matrix = makeAdjacencyMatrix(cards);
            printMatrix('#matrix',matrix);
        }
    }
})();