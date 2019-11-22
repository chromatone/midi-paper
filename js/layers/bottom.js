export default {
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
}
