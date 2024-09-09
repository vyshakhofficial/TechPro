import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import './App.css';

function App() {
  const [data, setData] = useState({ avatars: {}, familyTree: {} });

  useEffect(() => {
    fetch('/familydata.json')
      .then(response => response.json())
      .then(jsonData => setData(jsonData))
      .catch(error => console.error('Error fetching the JSON data:', error));
  }, []);

  useEffect(() => {
    if (data.avatars && data.familyTree) {
      renderTree(data.avatars, data.familyTree);
    }
  }, [data]);

  const renderTree = (avatars, familyTree) => {
    d3.select('#tree').selectAll('*').remove();
  
    const svg = d3.select('#tree')
      .attr('width', 800)
      .attr('height', 600);
  
    const g = svg.append('g').attr('transform', 'translate(50,50)');
  
    const treeLayout = d3.tree().size([600, 400]);
    const root = d3.hierarchy(familyTree);
    treeLayout(root);
  
    g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkVertical()
        .x(d => d.x)
        .y(d => d.y))
      .attr('fill', 'none')
      .attr('stroke', 'gray')
      .attr('stroke-width', 2);
  
    const nodes = g.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`);
  
    nodes.append('clipPath')
      .attr('id', d => `clip-${d.data.name}`)
      .append('circle')
      .attr('r', 25);
  

    nodes.append('circle')
      .attr('r', 25)
      .attr('fill', '#fff')
      .attr('stroke', '#69b3a2')
      .attr('stroke-width', 2);
  

    nodes.append('image')
      .attr('xlink:href', d => avatars[d.data.name])
      .attr('width', 50)
      .attr('height', 50)
      .attr('clip-path', d => `url(#clip-${d.data.name})`)
      .attr('x', -25)
      .attr('y', -25);
  
    nodes.append('rect')
      .attr('x', -40)  
      .attr('y', 35)   
      .attr('width', 80)  
      .attr('height', 20) 
      .attr('fill', '#f8f9fa')  
      .attr('stroke', '#ccc')   
      .attr('rx', 5)            
      .attr('ry', 5);           

    nodes.append('text')
      .attr('dy', 50) 
      .attr('x', 0)
      .style('text-anchor', 'middle')
      .text(d => d.data.name)
      .attr('font-size', '12px')
      .attr('fill', '#333');
  };
  
  

  return (
    <div className="App">
      <div className="mainsection" style={{ background:'black' , color:'white' }}>
        <h1>FAMILY TREE</h1>
        <svg id="tree"></svg>
      </div>
    </div>
  );
}

export default App;
