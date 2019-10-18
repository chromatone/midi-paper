const paperLayers = {};

paperLayers.bg = Vue.component('bg',{
  template: '<div></div>',
  props: [],
  data() {
    return {
      layer: new paper.Layer({
        name:'bg'
      }),
      rect: new paper.Shape.Rectangle({
        point:[0,0],
        size:paper.view.bounds,
        fillColor:'#aaa'
      }),
      events: [
        ['noteinon14', this.changeBg],
        ['14cc2',(cc) => {this.rect.fillColor.hue=(cc/127)*360}],
        ['14cc3',(cc) => {this.rect.fillColor.lightness=cc/127}],
        ['14cc4',(cc) => {this.rect.fillColor.saturation=(cc/127)}]
      ]
    }
  },
  watch: {

  },
  methods: {
    changeBg (note) {
      this.rect.tween({
        'fillColor.hue': ((note.number+3)%12)*30
      },{duration:1000, easing:'easeInOutQuad'})
    },
    ccHue (cc) {
      this.rect.tween({
        'fillColor.hue': (cc/127)*360
      },{duration:300, easing:'easeInOutQuad'})
    },
    ccLightness (cc) {this.rect.fillColor.lightness=(cc/127);}
  },

  created() {
    for (event of this.events) {
      this.$midiBus.$on(event[0],event[1])
    }
  },
  beforeDestroy() {
    for (event of this.events) {
      this.$midiBus.$off(event[0])
    }
  },
  mounted() {

  //  this.$midiBus.$on('controlchange'+this.chNum, this.changeColor)
    window.addEventListener('resize', () => {
      this.rect.bounds.size=paper.view.bounds.size;
    })
  }
})

paperLayers.bottom = Vue.component('bottom',{
  template: '<div></div>',
  props: ['channel'],
  data() {
    return {
      layer: new paper.Layer({
        name:'bottom'
      }),
      circles:[]
    }
  },
  watch: {

  },
  methods: {
    createBottom() {
      for (let i=0;i<12;i++) {
        this.circles[i] = new paper.Shape.Circle({
          center:[((i)/12)*paper.view.bounds.width, paper.view.bounds.height],
          radius:150-i*4,
          opacity:0,
          fillColor:{
            hue:i*30,
            lightness:0.5,
            saturation:0.8
          }
        })
      }
      this.positionBottom();
    },
    positionBottom() {
      for(let i=0;i<12;i++) {
        this.circles[i].position = [((i)/12)*paper.view.bounds.width, paper.view.bounds.height]
      }
    },
    playNote(note) {
      if (this.circles[note.digit].t) {
        this.circles[note.digit].t.stop();
      }
      this.circles[note.digit].bringToFront();
      this.circles[note.digit].tween({
        opacity:1,
        radius:paper.view.bounds.height*0.4
      }, {
        duration:300,
        easing:'easeOutQuad'
      })
    },
    stopNote(note) {
       this.circles[note.digit].t = this.circles[note.digit].tween({
        opacity:0.2,
        radius:0
      }, {
        duration:4200,
        easing:'easeInOutQuad'
      })
    }
  },
  mounted() {
    console.log(this.channel)
    this.$midiBus.$on('noteinon'+this.channel.num, this.playNote)
    this.$midiBus.$on('noteinoff'+this.channel.num, this.stopNote)
    this.createBottom()
    window.addEventListener('resize', () => {
      this.positionBottom();
    })
  },
  beforeDestroy() {

      this.$midiBus.$off('noteinon'+this.channel.num)
      this.$midiBus.$off('noteinoff'+this.channel.num)

  }
})

paperLayers.box = Vue.component('box',{
  template: '<div></div>',
  props: ['channel'],
  data() {
    return {
      layer: new paper.Layer({
        name:'box'
      }),
      squares:[],
      copies:[]
    }
  },
  watch: {
    'channel.notes'(notes) {

    }
  },
  methods: {
    boom(note) {
      let bounds = paper.view.bounds
      let length = this.squares.length;
      this.squares[length] = new paper.Shape.Rectangle({
        nameOct:note.nameOct,
        center:[bounds.width/2, bounds.height/2],
        size:[bounds.width/6, bounds.width/6],
        layer:this.layer,
        strokeColor: '#fff',
        fillColor:null,
        strokeWidth:1
      })
      for (let i=0;i<3;i++) {
        this.copies[i]=this.squares[length].clone();
        this.copies[i].scale(1+0.25*i);
        this.copies[i].opacity=1-i*0.3
        this.copies[i].tween({
          size:[bounds.width*i,bounds.width*i]
        },2000)
      }
      this.squares[length].tween({
        opacity:0,
        size:[bounds.width/3,bounds.width/3]
      },{
        duration:800,
        easing:'easeInOutQuad'
      })
       if (this.squares[length]>10) {
         this.squares.shift()
       }
    }
  },
  mounted() {
    console.log(this.channel)
    this.$midiBus.$on('noteinon'+this.channel.num, this.boom)
  },
  beforeDestroy() {

      this.$midiBus.$off('noteinon'+this.channel.num)

  }
})

paperLayers.column = Vue.component('column',{
  template: '<div></div>',
  props: ['channel'],
  data() {
    return {
      layer: new paper.Layer({
        name:'column'
      }),
      fade:new paper.Point(paper.view.bounds.width/2, 100),
      circles:[],
      events: [
        ['noteinon'+this.channel.num, this.playNote],
        [this.channel.num+'cc4',this.controls]
      ]
    }
  },
  watch: {

  },
  methods: {
    calcRadius(number) {
      return Number(Math.pow(2, (127-number) / 12));
    },
    calcHeight(number) {
      return paper.view.bounds.height*(127-number)/127
    },
    controls(value) {
      console.log(value)
    },
    playNote (note) {
      let bounds = paper.view.bounds
      this.circles[length] = new paper.Shape.Circle({
        nameOct:note.nameOct,
        center:[bounds.width/2, this.calcHeight(note.number)],
        radius:this.calcRadius(note.number),
        layer:this.layer,
        fillColor:{
          hue:note.digit*30,
          lightness:note.velocity,
          saturation:0.9
        }
      })
      this.circles[length].tween({
        opacity:0,
        'position.y':this.fade.y,
        'position.x':this.fade.x
      },{
        duration:1000,
        easing:'easeInOutQuad'
      }).then((t)=>{
      })
      if (this.circles.length>100) {
        this.circles.shift()
      }
    }
  },
  mounted() {

  },
  created() {
    for (event of this.events) {
      this.$midiBus.$on(event[0],event[1])
    }
  },
  beforeDestroy() {
    for (event of this.events) {
      this.$midiBus.$off(event[0])
    }
  }
})

paperLayers.pointer = Vue.component('pointer',{
  template: '<div></div>',
  props: ['channel'],
  data() {
    return {
      layer: new paper.Layer({
        name:'pointer'
      }),
      point: Ola([0,0],1000),
      pointer: new paper.Shape.Circle({
        center:this.point,
        radius:10,
        fillColor:'#333'
      })
    }
  },
  watch: {
    'pointer.position'() {
      paper.view.draw()
    }
  },
  methods: {
  },
  mounted() {
    paper.view.onMouseMove = (event) => {
      this.point.set([event.point.x,event.point.y]);
    }
    paper.view.onFrame = () => {
      this.pointer.position=this.point
    }

  }
})

paperLayers.random = Vue.component('random',{
  template: '<div></div>',
  props: ['channel'],
  data() {
    return {
      layer: new paper.Layer({
        name:'random'
      })
    }
  },
  watch: {
    'channel.notes'(notes) {

    }
  },
  methods: {
    randomCircle(note) {
      let bounds = paper.view.bounds
      let circle = new paper.Shape.Circle({
        nameOct:note.nameOct,
        center:[Math.random()*bounds.width, Math.random()*bounds.height*0.8+bounds.height*0.2],
        radius:Math.abs(210 - note.number*2),
        layer:this.layer,
        fillColor:{
          hue:note.digit*30,
          lightness:note.velocity,
          saturation:0.75
        }
      })
      circle.tween({
        opacity:0,
        'position.y':circle.position.y+Math.random()*300-150,
        'position.x':circle.position.x - Math.random()*paper.view.bounds.width
      },{
        duration:2000,
        easing:'easeOutQuad'
      }).then((t)=>{

      })
    }
  },
  mounted() {
    console.log(this.channel)
    this.$midiBus.$on('noteinon'+this.channel.num, this.randomCircle)
  },
  beforeDestroy() {

      this.$midiBus.$off('noteinon'+this.channel.num)

  }
})

paperLayers.spiral = Vue.component('spiral',{
  template: '<div></div>',
  props: ['channel'],
  data() {
    return {
      layer: new paper.Layer({
        name:'spiral'
      }),
      fade:new paper.Point(paper.view.bounds.width/2, paper.view.bounds.height/2),
      spiral:[],
      events: [
        ['noteinon'+this.channel.num, this.playNote],
        ['noteinoff'+this.channel.num, this.stopNote],
        [this.channel.num+'cc4',this.controls]
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

    spiralCoords(i) {
      return [
        paper.view.center.x + Math.cos((i/12)*2*Math.PI)*paper.view.bounds.width*0.6*Math.sqrt((108-i)/108),
        paper.view.center.y + Math.sin((i/12)*2*Math.PI)*paper.view.bounds.height*0.6*Math.sqrt((108-i)/108)
      ]
    },
    createSpiral() {
      for (let i=0;i<108;i++) {
        this.spiral[i]=new paper.Shape.Circle({
          center:this.spiralCoords(i),
          radius:(108-i)*2+2,
          opacity:0,
          fillColor:{
            hue:((i+3)%12)*30,
            lightness:0.6,
            saturation:0.0
          }
        })
      }
    },
    updateSpiral() {
      for (i=0;i<108;i++) {
        this.spiral[i].position = this.spiralCoords(i)
      }
    },
    playNote (note) {
      if (this.spiral[note.number].t) {
        this.spiral[note.number].t.stop();
      }
      this.spiral[note.number].tween({
        'fillColor.saturation':1,
        'fillColor.lightness':0.6,
        position:this.spiralCoords(note.number),
        opacity:1
      },{
        duration:30,
        easing:'easeOutQuad'
      })
    },
    stopNote(note) {
      this.spiral[note.number].t = this.spiral[note.number].tween({
        opacity:0,
        'fillColor.saturation':0.5,
        'fillColor.lightness':0.9
      },{
        duration:3000,
        easing:'easeOutQuad'
      })
    }
  },
  mounted() {

    this.createSpiral();

    window.addEventListener('resize', () => {
      this.updateSpiral()
    })
  },
  created() {
    for (event of this.events) {
      this.$midiBus.$on(event[0],event[1])
    }
  },
  beforeDestroy() {
    for (event of this.events) {
      this.$midiBus.$off(event[0])
    }
  }
})

paperLayers.grid = Vue.component('grid',{
  template: '<div></div>',
  props: ['channel'],
  data() {
    return {
      layer: new paper.Layer({
        name:'grid'
      }),
      grid:[],
      events: [
        ['noteinon'+this.channel.num, this.playNote],
        ['noteinoff'+this.channel.num, this.stopNote],
        [this.channel.num+'cc4',this.controls]
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
    createGrid() {
      for (let oct=0;oct<9;oct++) {
        this.grid[oct]=[];
        for(let note=0;note<12;note++) {
          this.grid[oct][note] = new paper.Shape.Circle({
            radius:paper.view.bounds.width/26,
            opacity:0,
            fillColor:{
              hue:((note)%12)*30,
              lightness:0.5,
              saturation:1.0
            }
          })
        }
      }
      this.positionGrid()
    },

    positionGrid() {
      let minDimension = paper.view.bounds.width<paper.view.bounds.height ? paper.view.bounds.width : paper.view.bounds.height
      for (let oct=0;oct<9;oct++) {
        for(let note=0;note<12;note++) {
          this.grid[oct][note].position = [(oct+1)*paper.view.bounds.width/10,
            paper.view.bounds.height -+(note+1)*(paper.view.bounds.height/13)
          ]

          this.grid[oct][note].radius = minDimension/26

        }
      }
    },

    playNote(note) {
      if (this.grid[note.octave][note.digit].t) {
        this.grid[note.octave][note.digit].t.stop();
      }
      this.grid[note.octave][note.digit].bringToFront();
      this.grid[note.octave][note.digit].tween({
        opacity:1,
        radius:100
      }, {
        duration:200,
        easing:'easeOutQuad'
      })
    },
    stopNote(note) {
       this.grid[note.octave][note.digit].t = this.grid[note.octave][note.digit].tween({
        opacity:0,
        radius:20
      }, {
        duration:1500,
        easing:'easeInOutQuad'
      })
    }
  },
  mounted() {

    this.createGrid();

    window.addEventListener('resize', () => {
      this.positionGrid();
    })
  },
  created() {
    for (event of this.events) {
      this.$midiBus.$on(event[0],event[1])
    }
  },
  beforeDestroy() {
    for (event of this.events) {
      this.$midiBus.$off(event[0])
    }
  }
})

paperLayers.hats = Vue.component('hats',{
  template: '<div></div>',
  props: ['channel'],
  data() {
    return {
      layer: new paper.Layer({
        name:'hats'
      }),
      hats:[],
      maxCount:20,
      prevPoint:[0,0],
      nextPoint:[100,100]
    }
  },
  watch: {
    'channel.notes'(notes) {

    }
  },
  methods: {
    randomPos() {
      let bounds = paper.view.bounds;
      return [Math.random()*bounds.width, Math.random()*bounds.height]
    },
    randomHat(note) {

      this.nextPoint = this.randomPos();
      this.hats[length] = new paper.Path({
        segments:[this.prevPoint,this.nextPoint],
        layer:this.layer,
        strokeColor:"#fff",
        strokeJoin:'bevel',
        strokeWidth:1,
        fillColor:{
          hue:0,
          lightness:note.velocity,
          saturation:0
        }
      });
      this.prevPoint=this.nextPoint;
      this.hats[length].tween({
        opacity:0
      },{
        duration:3000,
        easing:'easeInOutQuad'
      })
      if (this.hats.length>this.maxCount) {
        this.hats.shift()
      }
    }
  },
  mounted() {
    console.log(this.channel)
    this.$midiBus.$on('noteinon'+this.channel.num, this.randomHat)
  },
  beforeDestroy() {

      this.$midiBus.$off('noteinon'+this.channel.num)

  }
})

paperLayers.snares = Vue.component('snares',{
  template: '<div></div>',
  props: ['channel'],
  data() {
    return {
      layer: new paper.Layer({
        name:'snares'
      }),
      snares:[],
      maxCount:10
    }
  },
  watch: {
    'channel.notes'(notes) {

    }
  },
  methods: {
    getSegments(num,w,h) {
      let segments=[];
      for (let i=0;i<num;i++) {
        segments[i]= [Math.random()*w, Math.random()*h]
      }
      return segments
    },
    randomSnare(note) {
      let bounds = paper.view.bounds

      this.snares[length] = new paper.Path({
        segments:this.getSegments(3,bounds.width,bounds.height),
        layer:this.layer,
      //  blendMode:'difference',
        strokeColor:"#333",
        strokeJoin:'miter',
        opacity:0.7,
        strokeWidth:20,
        fillColor: null
      })
      this.snares[length].tween({
        opacity:0
      },{
        duration:2000,
        easing:'easeInOutQuad'
      })
      if (this.snares.length>this.maxCount) {
        this.snares.shift()
      }
    }
  },
  mounted() {
    console.log(this.channel)
    this.$midiBus.$on('noteinon'+this.channel.num, this.randomSnare)
  },
  beforeDestroy() {

      this.$midiBus.$off('noteinon'+this.channel.num)

  }
})
