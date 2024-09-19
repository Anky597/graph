from flask import Flask, render_template, jsonify, request
import networkx as nx
import json

app = Flask(__name__)

# Serve index.html from templates
@app.route('/')
def index():
    return render_template('index.html')

# Graph traversal route
@app.route('/traverse', methods=['POST'])
def traverse_graph():
    data = request.json
    graph_input = data.get('graph', '{}')
    start_node = data.get('start_node', '1')
    algorithm = data.get('algorithm', 'bfs')

    try:
        graph_dict = json.loads(graph_input)
        G = nx.Graph()

        # Build the graph from input
        for node, edges in graph_dict.items():
            for edge, weight in edges:
                G.add_edge(node, edge, weight=weight)

        if algorithm == 'bfs':
            traversal = list(nx.bfs_edges(G, start_node))
        elif algorithm == 'dfs':
            traversal = list(nx.dfs_edges(G, start_node))
        elif algorithm == 'dijkstra':
            path_lengths = nx.single_source_dijkstra_path_length(G, start_node)
            traversal = sorted(path_lengths.items(), key=lambda x: x[1])
        else:
            return jsonify({'status': 'error', 'message': 'Unknown algorithm'})

        traversal_nodes = [start_node] + [edge[1] for edge in traversal]

        return jsonify({
            'status': 'success',
            'traversal': traversal_nodes,
            'edges': list(G.edges(data=True))  # Send edges with weights
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
