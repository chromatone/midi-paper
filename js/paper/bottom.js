const bottom = Vue.component('bottom',{
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
    playNote(note) {
      if (this.circles[note.digit].t) {
        this.circles[note.digit].t.stop();
      }
      this.circles[note.digit].bringToFront();
      this.circles[note.digit].tween({
        opacity:1,
        radius:300
      }, {
        duration:300,
        easing:'easeOutQuad'
      }).then((t)=>{

      })
    },
    stopNote(note) {
       this.circles[note.digit].t = this.circles[note.digit].tween({
        opacity:0.2,
        radius:0
      }, {
        duration:4200,
        easing:'easeOutQuad'
      }).then((t)=>{

      })
    },
  },
  mounted() {
    console.log(this.channel)
    this.$midiBus.$on('noteinon'+this.channel.num, this.playNote)
    this.$midiBus.$on('noteinoff'+this.channel.num, this.stopNote)

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
  },
  beforeDestroy() {

      this.$midiBus.$off('noteinon'+this.channel.num)

  }
})
