function runTraversal() {
    const algorithm = document.getElementById("algorithm").value;
    const startNode = document.getElementById("start_node").value;
    const graphInput = document.getElementById("graph_input").value;

    fetch('/traverse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            algorithm: algorithm,
            start_node: startNode,
            graph: graphInput
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            const traversal = data.traversal;
            const edges = data.edges;
            displayTraversal(traversal, edges);
        } else {
            document.getElementById('result').innerText = "Error: " + data.message;
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function displayTraversal(traversal, edges) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = "<strong>Traversal:</strong> " + traversal.join(", ");

    // Extract nodes and edges for visualization
    let allNodes = new Set();
    edges.forEach(edge => {
        allNodes.add(edge[0]);
        allNodes.add(edge[1]);
    });

    let nodeIds = Array.from(allNodes);
    let nodePositions = {};
    let edgeList = [];

    // Position nodes randomly for visualization
    nodeIds.forEach((node, index) => {
        nodePositions[node] = {
            x: Math.random() * 100,
            y: Math.random() * 100
        };
    });

    edges.forEach(edge => {
        edgeList.push({
            source: edge[0],
            target: edge[1],
            weight: edge[2]['weight']
        });
    });

    // Plotly visualization
    const traceNodes = {
        x: nodeIds.map(id => nodePositions[id].x),
        y: nodeIds.map(id => nodePositions[id].y),
        mode: 'markers+text',
        type: 'scatter',
        text: nodeIds,
        marker: { size: 10, color: 'blue' }
    };

    const traceEdges = {
        x: [],
        y: [],
        mode: 'lines',
        type: 'scatter',
        line: { color: 'black', width: 2 }
    };

    edgeList.forEach(edge => {
        traceEdges.x.push(nodePositions[edge.source].x, nodePositions[edge.target].x, null);
        traceEdges.y.push(nodePositions[edge.source].y, nodePositions[edge.target].y, null);
    });

    const data = [traceEdges, traceNodes];
    const layout = {
        title: 'Graph Traversal Visualization',
        xaxis: { title: 'X' },
        yaxis: { title: 'Y' }
    };

    Plotly.newPlot('graph', data, layout);
}
