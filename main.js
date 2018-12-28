const graph = () => {
  const display = document.getElementById("display"),
    width = 500,
    height = 500,
    nodeRadius = 10,
    widthWithBoundary = width - 100,
    heightWithBoundary = height - 100,
    force = d3.layout.force(),
    layout = 'force',
    nodesMap = d3.map();
  let nodeAttributes = [],
    allData = [],
    currentNodesData = [],
    formattedNodes = [],
    nodesGRoot = null,
    node = null,
    visualization = null;

  function network(selection, data) {
    initializeVisualization(selection);

    initializeData(data);

    createNodeRoot();

    initializeForceGraph();

    updateVisualization();
  }

  function initializeVisualization(selection) {
    visualization = d3.select(selection)
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  }

  function initializeData(data) {
    allData = setupData(data);
  }

  function createNodeRoot() {
    nodesGRoot = visualization.append("g").attr("id", "nodes");
  }

  function initializeForceGraph() {
    force
      .size([width, height])
      .on("tick", forceTick)
      .charge(-500)
      .linkDistance(200);
  }


  function setupData(data) {
    formattedNodes = assignAttributesToNodes(data.nodes);

    generateD3Map(formattedNodes);

    formattedNodes = [];

    return data;
  };

  function forceTick() {
    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  };

  function pauseForceForAction(action) {
    force.stop();
    action();
    force.start();
  }

  function updateVisualization() {
    pauseForceForAction(() => {
      currentNodesData = allData.nodes;

      force.nodes(currentNodesData);

      updateNodesWithNewData();
    })
  };

  function updateNodesWithNewData() {
    node = nodesGRoot.selectAll("circle")
      .data(currentNodesData);

    node.enter().append("circle")
        .attr("class", "node")
        .attr("x", d => d.x)
        .attr("y", d => d.y)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", d => d.radius)
        .style("fill", "red");

    node.exit().remove();
  };

  document.body.onclick = function () {
    generateNewNode();
  }


  function generateNewNode() {
      nodeAttributes = createAttributesForNodes();

      currentNodesData.push({
        "id": `new_node${currentNodesData.length}`,
        "name": `New Node ${currentNodesData.length}`,
        "x": nodeAttributes[0],
        "y": nodeAttributes[1],
        "radius": nodeAttributes[2]
      });

      generateD3Map(currentNodesData);

      updateVisualization();

      nodeAttributes = [];
  }

  function createAttributesForNodes() {
    const randomCords = generateRandomCordinatesWithinBoundary();
    return [randomCords[0], randomCords[1], nodeRadius];
  }

  function assignAttributesToNodes(nodes) {
    nodes.forEach(n => {
      nodeAttributes = createAttributesForNodes();
      n.x = nodeAttributes[0];
      n.y = nodeAttributes[1];
      n.radius = nodeAttributes[2];
      nodeAttributes = [];
    });
    return nodes;
  }

  function generateRandomCordinatesWithinBoundary() {
    let randomXValueWithinBoundary = Math.floor(Math.random()*widthWithBoundary);
    let randomYValueWithinBoundary = Math.floor(Math.random()*heightWithBoundary);
    return [randomXValueWithinBoundary, randomYValueWithinBoundary];
  };

  function generateD3Map(nodes) {
    nodes.forEach(n =>
      nodesMap.set(n.id, n)
    );
  };

  return network;
}

const tribeData = {
  "nodes": [
    {
      "name": "Buggin' Out",
      "id": "buggin_out"
    }
  ]
};

const tribeNetwork = graph();

tribeNetwork("#vis", tribeData);
