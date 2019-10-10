const column = Vue.component('column',{
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
    paper.view.onMouseDown = (event) => {
      this.fade=event.point;
    }
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
