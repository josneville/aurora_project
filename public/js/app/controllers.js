var app = angular.module("aurora-controllers", []);

app.controller("main-controller", function($scope, $compile, socket){
  $scope.nodes = [];
  $scope.links = [];
  socket.on('data', function(data){
    $scope.nodes = data.nodes;
    $scope.links = data.links;
    $scope.renderGraph();
  });
  $scope.updateRelInfo = function (s, t, ty, a){
    $scope.from = "From: " + s;
    $scope.to = "To: " + t;
    $scope.amount = "Amount: " + a;
    $scope.type = "Type: " + ty.charAt(0).toUpperCase() + ty.slice(1).replace(/([a-z])([A-Z])/g, '$1 $2');
    $scope.worth = "";
    $scope.name = "";
    $scope.infoClass = ty;
  };
  $scope.updateNodeInfo = function (n, w, ty){
    $scope.from = "";
    $scope.to = "";
    $scope.amount = "";
    $scope.type = "Type: " + ty.charAt(0).toUpperCase() + ty.slice(1).replace(/([a-z])([A-Z])/g, '$1 $2');
    $scope.worth = "Worth: " + w;
    $scope.name = "Name: " + n;
    $scope.infoClass = ty;
  };
  $scope.renderGraph = function(){
    var links = $scope.links;
    var nodes = $scope.nodes;
    links.forEach(function(link) {
      link.source = nodes[link.source] || (nodes[link.source] = {name: link.source, agentType: link.sa, worth: link.sw});
      link.target = nodes[link.target] || (nodes[link.target] = {name: link.target, agentType: link.ta, worth: link.tw});
    });
    var width = window.innerWidth,
        height = window.innerHeight;

    var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([width, height])
        .linkDistance(60)
        .charge(-300)
        .on("tick", tick)
        .start();
    d3.select("svg").remove();
    var svg = d3.select("body")
        .append("svg")
        .attr("id", "mainSVG")
        .attr("width", width)
        .attr("height", height);

    // Per-type markers, as they don't inherit styles.
    svg.append("defs").selectAll("marker")
        .data(["purchase", "refund", "personalLoan", "personalLoanPayment", "businessLoan", "businessLoanPayment"])
        .enter().append("marker")
        .attr("id", function(d) { return d; })
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -1.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5");

    var path = svg.append("g").selectAll("path")
        .data(force.links())
        .enter().append("path")
        .attr("class", function(d) { return "link " + d.type; })
        .attr("ng-mouseover", function(d){ return "updateRelInfo('"+d.source.name+"', '"+d.target.name+"', '"+d.type+"', "+d.amount+")"})
        .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });

    var circle = svg.append("g").selectAll("circle")
        .data(force.nodes())
        .enter().append("circle")
        .attr("class", function(d) { return d.agentType; })
        .attr("ng-mouseover", function(d){ return "updateNodeInfo('"+d.name+"', "+d.worth+", '"+d.agentType+"')"})
        .attr("r", 8)
        .call(force.drag);

    var text = svg.append("g").selectAll("text")
        .data(force.nodes())
      .enter().append("text")
        .attr("x", 8)
        .attr("y", ".75em")
        .text(function(d) { return d.name; });

    $compile(angular.element("svg"))($scope);

    // Use elliptical arc path segments to doubly-encode directionality.
    function tick() {
      path.attr("d", linkArc);
      circle.attr("transform", transform);
      text.attr("transform", transform);
    }

    function linkArc(d) {
      var dx = d.target.x - d.source.x,
          dy = d.target.y - d.source.y,
          dr = Math.sqrt(dx * dx + dy * dy);
      return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
    }

    function transform(d) {
      return "translate(" + d.x + "," + d.y + ")";
    }
  }
})
