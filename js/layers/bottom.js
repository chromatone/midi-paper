export const bottom = {
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
          center:[0,0],
          radius:paper.view.bounds.height*0.4,
          opacity:0,
          strokeWidth:80,
          strokeColor:{
            hue:i*30,
            lightness:0.5,
            saturation:0.8
          }
        })
      }
      this.positionCircle();
    },
    positionCircle() {
      var width = paper.view.bounds.width,
        height = paper.view.bounds.height,
        angle,
        x,
        y,
        i;

      for (i = 0; i < 12; i++) {
        angle = ((i-3) / (12 / 2)) * Math.PI; // Calculate the angle at which the element will be placed.
        // For a semicircle, we would use (i / numNodes) * Math.PI.
        x = ((width/3) * Math.cos(angle)) + (width / 2); // Calculate the x position of the element.
        y = ((width/3) * Math.sin(angle)) + (width / 2); // Calculate the y position of the element.
        this.circles[i].position=[x,y]
      }
    },
    playNote(note) {
      if (this.circles[note.digit].t) {
        this.circles[note.digit].t.stop();
      }
      this.circles[note.digit].bringToFront();
      this.circles[note.digit].tween({
        opacity:1,
      }, {
        duration:100,
        easing:'easeOutQuad'
      })
    },
    stopNote(note) {
       this.circles[note.digit].t = this.circles[note.digit].tween({
        opacity:0,
    //    radius:0
      }, {
        duration:3000,
        easing:'easeInOutQuad'
      })
    }
  },
  mounted() {
    this.$midiBus.$on('noteinon'+this.channel.num, this.playNote)
    this.$midiBus.$on('noteinoff'+this.channel.num, this.stopNote)
    this.createBottom()
    window.addEventListener('resize', () => {
      this.positionCircle();
    })
  },
  beforeDestroy() {
      this.$midiBus.$off('noteinon'+this.channel.num)
      this.$midiBus.$off('noteinoff'+this.channel.num)
      this.circles=undefined;
  }
}
