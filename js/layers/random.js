export default {
  template: '<div></div>',
  props: ['channel'],
  data() {
    return {
      layer: new paper.Layer({
        name:'random'
      }),
      circles:[],
    }
  },
  watch: {
    'channel.notes'(notes) {

    }
  },
  methods: {
    randomCircle(note) {
      let bounds = paper.view.bounds
      let num = this.circles.push(
        new paper.Path.Star({
          center:[Math.random()*bounds.width, Math.random()*bounds.height*0.8+bounds.height*0.2],
          radius1:Math.abs(210 - note.number*2)/4,
          radius2:Math.abs(note.number*2)/6,
          points:note.number%12+1,
          layer:this.layer,
          strokeColor:'#fff',
          strokeWidth:20,
          rotaion:0
        })
      )

      this.circles[num-1].tween({
        opacity:0,
//      'position.y':this.circles[num-1].position.y+Math.random()*300-150,
//         'position.x':this.circles[num-1].position.x + Math.random()*300-150
      },{
        duration:2000,
        easing:'easeOutQuad'
      }).then((t)=>{
          this.circles.shift()
      })
    }
  },
  mounted() {
    this.$midiBus.$on('noteinon'+this.channel.num, this.randomCircle)
  },
  beforeDestroy() {

      this.$midiBus.$off('noteinon'+this.channel.num)

  }
}
