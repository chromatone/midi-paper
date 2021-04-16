export default {
  template: '<div></div>',
  name: 'bottom',
  props: ['channel'],
  data() {
    return {
      layer: new paper.Layer({
        name: 'bottom',
      }),
      circles: [],
    }
  },
  watch: {},
  methods: {
    createBottom() {
      for (let i = 0; i < 12; i++) {
        this.circles[i] = new paper.Shape.Circle({
          center: [0, 0],
          radius: paper.view.bounds.height * 0.3,
          opacity: 0,

          blendMode: 'overlay',
          strokeWidth: 200,
          strokeColor: {
            hue: i * 30,
            lightness: 0.5,
            saturation: 0.8,
          },
        })
      }
      this.positionCircle()
    },
    positionCircle() {
      var width = paper.view.bounds.width,
        height = paper.view.bounds.height,
        angle,
        x,
        y,
        i

      for (i = 0; i < 12; i++) {
        let x = (width / 13) * (i + 1)
        let y = height / 2
        this.circles[i].position = [x, y]
      }
    },
    playNote(note) {
      if (this.circles[note.digit].t) {
        this.circles[note.digit].t.stop()
      }
      this.circles[note.digit].bringToFront()
      this.circles[note.digit].tween(
        {
          opacity: 1,
          //  strokeWidth: 200,
          // radius: paper.view.bounds.height * 0.4,
        },
        {
          duration: 200,
          easing: 'easeOutQuint',
        },
      )
    },
    stopNote(note) {
      this.circles[note.digit].t = this.circles[note.digit].tween(
        {
          opacity: 0,
          //  strokeWidth: 80,
          // radius: paper.view.bounds.height * 0.1,
        },
        {
          duration: 3000,
          easing: 'easeInOutQuad',
        },
      )
    },
  },
  mounted() {
    this.$midiBus.$on('noteinon' + this.channel.num, this.playNote)
    this.$midiBus.$on('noteinoff' + this.channel.num, this.stopNote)
    this.createBottom()
    window.addEventListener('resize', () => {
      this.positionCircle()
    })
  },
  beforeDestroy() {
    this.$midiBus.$off('noteinon' + this.channel.num)
    this.$midiBus.$off('noteinoff' + this.channel.num)
    this.circles = undefined
  },
}
