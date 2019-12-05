export default {
  template: '<div  class="blogs"></div>',
  props: ['channel'],
  data() {
    return {
      layer: new paper.Layer({
        name:'blobs'
      }),
      center:new paper.Point(paper.view.bounds.width/2, paper.view.bounds.height/2),
      blob:new paper.Path({
        closed:true
      }),
      blobs: [],
      segment:null,
      path:null,
      tool:new paper.Tool(),
      continue:true,
      movePath:false,
      strokeColor:'hsla(0,0%,100%,0.4)',
      values: {
      	blobs: 100,
      	minPoints: 3,
      	maxPoints: 5,
      	minRadius: 30,
      	maxRadius: 150
      },
      hitOptions: {
      	segments: true,
      	stroke: true,
      	fill: true,
      	tolerance: 10
      },
      events: [

      ]
    }
  },
  watch: {

  },
  methods: {
    calcRadius(number) {
      return Number(Math.pow(2, (127-number) / 12)/1.5);
    },
    controls(value) {
      console.log(value)
    },
    tween(blob,a) {
      blob.tween({
        'position.x': blob.position.x+Math.random()*200-100,
        'position.y': blob.position.y+Math.random()*200-100
      },{
        duration:Math.random()*7000+3000,
        easing:'easeInOutQuad'
      }).then(this.tween)
    },
    createBlobs() {
    	let radiusDelta = this.values.maxRadius - this.values.minRadius;
    	let pointsDelta = this.values.maxPoints - this.values.minPoints;
    	for (let i = 0; i < this.values.blobs; i++) {
    		let radius = this.values.minRadius + Math.random() * radiusDelta;
    		let points = this.values.minPoints + Math.floor(Math.random() * pointsDelta);
        let center = new paper.Point(
          paper.view.size.width*Math.random(),
          paper.view.size.height*Math.random()
        )
    		let blob = this.createBlob(center, radius, points);
    		let lightness = (Math.random() - 0.5) * 0.4 + 0.4;
    		let hue = (Math.random()*12 %12) * 360;
    		blob.fillColor = { hue: hue, saturation: 0.75, lightness: lightness };
    		blob.strokeColor = this.strokeColor;
      /*  blob.tween({
          'position.x': blob.position.x+Math.random()*200-100,
          'position.y': blob.position.y+Math.random()*200-100
        },{
          duration: Math.random()*7000+3000,
          easing: 'easeInOutQuad'
        }).then(this.tween)
      */
        this.blobs.push(blob);
    	};
    },
    createBlob(center, maxRadius, points) {
    	let path = this.blob.clone();
    	for (let i = 0; i < points; i++) {
    		let delta = new paper.Point({
    			length: (maxRadius * 0.5) + (Math.random() * maxRadius * 0.5),
    			angle: (360 / points) * i
    		});
        let point = center.add(delta);
    		path.add(point);
    	}
    	path.smooth();
    	return path;
    },
    fluctuate(time) {
      for (blob of this.blobs) {
          blob.position.x=blob.position.x+Math.random()-0.5;
       }
    },
    animate(time) {
    //  this.fluctuate(time);
      paper.view.draw();
      if(this.continue) {
        window.requestAnimationFrame(this.animate)
      }
    }
  },
  created() {

  },
  mounted() {
    this.createBlobs()
    this.animate();

    this.tool.onMouseDown = (event) => {
    	this.segment = this.path = null;
    	var hitResult = paper.project.hitTest(event.point, this.hitOptions);
    	if (!hitResult)
    		return;

    	if (event.modifiers.shift) {
    		if (hitResult.type == 'segment') {
    			hitResult.segment.remove();
    		};
    		return;
    	}

    	if (hitResult) {
    		this.path = hitResult.item;

    		if (hitResult.type == 'segment') {
    			this.segment = hitResult.segment;
    		} else if (hitResult.type == 'stroke') {
    			var location = hitResult.location;
    			this.segment = this.path.insert(location.index + 1, event.point);
    			this.path.smooth();
    		}
    	}
    	this.movePath = hitResult.type == 'fill';
    	if (this.movePath)
    		hitResult.item.bringToFront();
    }

    this.tool.onMouseMove = (event) => {
      this.layer.selected = false;
    	if (event.item) {
    		event.item.selected = true;
      }
      let hitResult = paper.project.hitTest(event.point, this.hitOptions);
      if (!hitResult) {return};
      if (hitResult.type=='segment') {
        hitResult.segment.selected=true
      }
    }

    this.tool.onMouseDrag = (event) => {
    	if (this.segment) {
        this.segment.point.x += event.delta.x;
        this.segment.point.y += event.delta.y;
    		this.path.smooth();
    	} else if (this.path) {
    		this.path.position.x += event.delta.x;
        this.path.position.y += event.delta.y;
    	}
    }
    window.addEventListener('resize', () => {

    })
  },
  beforeDestroy() {
    this.continue=false
  }
}
