import * as d3 from 'd3';
import albumData from './data';

const graph = () => {
  let node = null,
  nodesG = null,
  linksG = null,
  nodeSelection = null,
  visualization = null,
  simulation = null,
  currentGraphData = {
    nodes: [],
    links: []
  };

  const width = 800,
  height = 800,
  defaultRadius = 5;

  const initGraph = () => {
    initializeSVG();
    initializeSimulation();
    updateSimulation({nodes: [albumData]});
  }

  function initializeSimulation() {
    simulation = d3.forceSimulation()
      .force("charge_force", d3.forceManyBody())
      .force("center_force", d3.forceCenter(width / 2, height / 2))
      .on("tick", tickActions);
  }

  function initializeSVG() {
    visualization = d3.select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
    nodesG = visualization.append("g")
      .attr("id", "nodes");
    linksG = visualization.append("g")
      .attr("id", "links");
  }

  function updateSimulation(updateData) {
    simulation.stop();
    if(updateData.nodes) {
      updateNodes(updateData.nodes);
    }
    if(updateData.links) {
      updateLinks(updateData.links);
    }
    simulation.restart();
  }

  function tickActions() {
    if(nodesG) {
      nodesG.selectAll("circle")
        .attr("cx", d => d.x )
        .attr("cy", d => d.y );
    }
    if(linksG) {
      linksG.selectAll("line.link")
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
    }
  }

  function handleNodeClick(d) {
    if(d.type === 'album') {
      expandAlbum(d);
    } else if(d.type === 'song') {
      expandSong(d);
    }
  }

  function expandAlbum(album) {
    let expandedNodeData = [
      {
        id: album.id,
        name: album.name,
        type: album.type
      }
    ];
    let expandLinkData = [];

    album.songs.forEach(song => {
      expandedNodeData.push(song);
      expandLinkData.push({"source": album.id, "target": song.id});
    })

    updateSimulation({nodes: expandedNodeData, links: expandLinkData});
  }

  function expandSong(song) {
    let expandedNodeData = currentGraphData.nodes,
    expandedLinkData = currentGraphData.links;

    song.references.forEach(r => {
      expandedNodeData.push(r);
      expandedLinkData.push({"source": song.id, "target": r.id});
    });

    updateSimulation({nodes: expandedNodeData, links: expandedLinkData});
  }

  function updateNodes(updatedNodeData) {
    currentGraphData.nodes = updatedNodeData;
    let update = nodesG.selectAll("circle")
      .data(updatedNodeData, d => d.id);
    update.exit().remove();
    update = update.enter().append("circle")
        .attr("class", "node")
        .attr("r", defaultRadius)
        .style("fill", d => d.type === "album" ? "red" : "black")
        .style("cursor", "pointer")
        .on("click", d => {
          handleNodeClick(d)
        })
        .merge(update);
    simulation.nodes(updatedNodeData);
  }

  function updateLinks(updatedLinkData) {
    currentGraphData.links = updatedLinkData;
    simulation
      .force("link", d3.forceLink(updatedLinkData)
      .id(d => d.id).distance(100).strength(1));
    let update = linksG.selectAll("line.link")
      .data(updatedLinkData, d => d.id);
    update.exit().remove();
    update = update.enter()
      .append("line")
      .attr("class", "link")
      .attr("stroke", "blue")
      .attr("stroke-opacity", .2)
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
  }

  return initGraph;
}

const tribeNetwork = graph();

tribeNetwork();
