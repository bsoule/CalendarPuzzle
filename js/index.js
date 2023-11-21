window.showTutorial = function () {
    swal({
        title: "Tutorial"
      , html: true
      , confirmButtonText: "Got it!"
      , text: "<ul>" +
             "    <li><strong>Left click</strong>: rotate left</li>" +
             "    <li><strong>Right click</strong>: rotate right</li>" +
             "    <li><strong>CTRL + left click</strong>: flip</li>" +
             "    <li><strong>Drag</strong>: move</li>" +
             "</ul>"
    })
};

// Set up a click event listener on the button
window.colorChangeButton = function() {
  // Get all the SVG polygons
  const polygons = document.querySelectorAll('.graph #elements g polygon');
  // Loop through the polygons and change their color
  polygons.forEach(function(polygon) {
      polygon.style.fill = getRandomColor();
  });
}

function drawGrid1(svg, boxSize, numCols, numRows, ltc) {
  const gridGroup = svg.group().id('grid');
  gridGroup.addClass('grid-lines');
  const labels = [
    ["JAN","FEB","MAR","APR","MAY","JUNE",""],
    ["JUL","AUG","SEP","OCT","NOV","DEC",""],
    ["1","2","3","4","5","6","7"],
    ["8","9","10","11","12","13","14"],
    ["15","16","17","18","19","20","21"],
    ["22","23","24","25","26","27","28"],
    ["29","30","31","","CALENDAR PUZZLE","",""]
  ]
  
  // translate x, y values by ltc to place grid in right part of page
  const trX = (n) => n + ltc.x;
  const trY = (n) => n + ltc.y;
  
  labels.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      const centerX = trX((colIndex * boxSize) + (boxSize / 2));
      const centerY = trY((rowIndex * boxSize) + (boxSize / 2));
      const label = gridGroup.text(labels[rowIndex][colIndex])
        .x(centerX)
        .y(centerY)
        .font({
          family: 'Arial',
          size: (boxSize / 4), // Adjust font size based on the box size
          anchor: 'middle' // Ensures that the text is centered
        })
    })
  });
  
  // We make vertical lines (columns)
  for (let i = 0; i <= numCols; i++) {
    let x = i * boxSize;
    let line = gridGroup.line(trX(x), trY(0), trX(x), trY(numRows * boxSize)).stroke({ width: 1, color: '#ccc' });
  }

  // Then make horizontal lines (rows)
  for (let i = 0; i <= numRows; i++) {
    let y = i * boxSize;
    let line = gridGroup.line(trX(0), trY(y), trX(numCols * boxSize), trY(y)).stroke({ width: 1, color: '#ccc' });
  }
  return gridGroup;
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

window.addEventListener("load", function () { 
  const polygen = (tuples,x) => {
    return tuples.map(([a,b])=> [x*a, x*b].join(',')).join(' ');
  }
  var t = new SVG(document.querySelector(".graph")).size("100%", "100%"), 
    winSize = {
      w: window.innerWidth, 
      h: window.innerHeight
    },
    size = winSize.w / 2.5, 
    unit = size / 8, 
    leftTopCorner = {
      x: winSize.w / 2 - size / 2, 
      y: winSize.h / 2 - size / 2
    },
    grid = drawGrid1(t,unit,7,7, leftTopCorner),
    elements = t.group().id("elements"), 
    shapes = [
      elements.group(), 
      elements.group(),
      elements.group(),
      elements.group(),
      elements.group(),
      elements.group(), 
      elements.group(), 
      elements.group(),
    ] 
    ;

    //var grid = drawGrid1(t, u, 7, 7, leftTopCorner)
  
    // 1. Corner shape
    shapes[0].polygon(
      polygen([[0,0],[0,3],[3,3],[3,2],[1,2],[1,0]],unit)
    ).fill("#e74c3c").opacity('0.8');

    // 2. Stair step
    shapes[1].polygon(
      polygen([[0,0],[0,2],[1,2],[1,4],[2,4],[2,1],[1,1],[1,0]],unit)
    ).fill("#e67e22").opacity('0.8');

    // 3. Z shape
    shapes[2].polygon(
      polygen([[0,1],[0,3],[1,3],[1,2],[3,2],[3,0],[2,0],[2,1]],unit)
    ).fill("#f1c40f").opacity('0.8');

    // 4. rectangle
    shapes[3].polygon(
      polygen([[0,0],[2,0],[2,3],[0,3]],unit)
    ).fill("#2ecc71").opacity('0.8');

    // 5. C shape
    shapes[4].polygon(
      polygen([[0,0],[2,0],[2,3],[0,3],[0,2],[1,2],[1,1],[0,1]],unit)
    ).fill("#3498db").opacity('0.8');

    // 6. chair
    // is there value in closing up the shape, like this one? 
    shapes[5].polygon(
      polygen([[1,0],[2,0],[2,3],[0,3],[0,1],[1,1],[1,0]], unit)
    ).fill("#9966cc").opacity('0.8');

    // 7. stilt
    shapes[6].polygon(
      polygen([[0,0],[1,0],[1,1],[2,1],[2,2],[1,2],[1,4],[0,4]],unit)
    ).fill("#34495e").opacity('0.8');

    // 8. L-shape
    shapes[7].polygon(
      polygen([[0,0],[0,1],[3,1],[3,2],[4,2],[4,0]],unit)
      //`0,0 0,${u} ${3*u},${u} ${3*u},${2*u} ${4*u},${2*u} ${4*u},0`
    ).fill('#6f00ff').opacity('0.8');
  
    Crossy("polygon", "transformOrigin", "center");
    Crossy("polygon", "transformBox", "fill-box");
    Crossy("polygon", "transition", "all 500 ease");


    function createCorner(corner,n) {
      let count = 0
      return () => {
        let radius = 4*unit
        let angle = (count++/8) * Math.PI * 2
        console.log("count", count, "angle", angle)
        var dx = radius * Math.cos(angle)
        var dy = radius * Math.sin(angle)
        
        return [corner.x+dx+size/4, corner.y+dy+size/4]
      }
    }
    var cornerRadius = (corner) => {
      // Generate a random angle in radians
      var radius = 3*unit
      var angle = Math.random() * Math.PI * 2; // Random angle from 0 to 360 degrees (in radians)

      // Generate a random distance from the center (randomize radius to spread shapes within the circle)
      var randomRadius = Math.random() * radius;

      // Convert polar coordinates (angle, randomRadius) to Cartesian coordinates (dx, dy)
      var dx = randomRadius * Math.cos(angle);
      var dy = randomRadius * Math.sin(angle);
      return [(corner.x+size/4)+dx,(corner.y+size/4)+dy]
    }

    const cornerErr = createCorner(leftTopCorner);
    shapes.forEach(function (c) {
        var moved = false;
        var angle = 0;
        var cPol = c.children()[0];
        //c.translate(...cornerRadius(leftTopCorner));
        c.translate(...cornerErr())
        c.draggy();
        c.on("dragmove", function () {
            moved = true;
        });

        cPol.on("mousedown", function () {
            moved = false;
        });

        cPol.on("contextmenu", function (e) {
            e.preventDefault();
        });

        cPol.on("mouseup", function (e) {
            if (!moved) {
                var t = this.node.style.transform;

                if (e.ctrlKey) {
                    this.node._scale = (this.node._scale || 1) === 1 ? -1 : 1;
                } else {
                    angle += (e.button === 2 ? 1 : -1) * 90;
                }

                Crossy(this.node, "transform", "rotate(" + angle + "deg) scaleX(" + (this.node._scale || 1) + ")");
            }
            moved = false;
            e.preventDefault();
        });
    });
  
});
