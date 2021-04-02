export const column = {
  template: '<div></div>',
  props: ['channel'],
  data() {
    return {
      layer: new paper.Layer({
        name: 'column',
      }),
      stroke: 20,
      fade: new paper.Point(paper.view.bounds.width / 2, 100),
      circles: [],
      events: [
        ['noteinon' + this.channel.num, this.playNote],
        [this.channel.num + 'cc4', this.controls],
      ],
    }
  },
  watch: {},
  methods: {
    calcRadius(number) {
      return Number(Math.pow(2, (127 - number) / 12) + 10)
    },
    calcWidth(number) {
      return (paper.view.bounds.width * number) / 127
    },
    calcHeight(number) {
      return paper.view.bounds.height * (1 - number / 127)
    },
    controls(value) {
      console.log(value)
    },
    playNote(note) {
      let bounds = paper.view.bounds
      this.circles[length] = new paper.Shape.Circle({
        nameOct: note.nameOct,
        center: [this.calcWidth(note.number), this.calcHeight(note.number)],
        radius: this.calcRadius(note.number),
        layer: this.layer,
        strokeWidth: this.stroke,
        strokeColor: {
          hue: note.digit * 30,
          lightness: note.velocity,
          saturation: 0.9,
        },
      })
      this.circles[length]
        .tween(
          {
            opacity: 0,
            //    'position.y':this.fade.y,
            //    'position.x':this.fade.x
          },
          {
            duration: 1000,
            easing: 'easeInOutQuad',
          },
        )
        .then((t) => {})
      if (this.circles.length > 100) {
        this.circles.shift()
      }
    },
  },
  mounted() {},
  created() {
    for (let event of this.events) {
      this.$midiBus.$on(event[0], event[1])
    }
  },
  beforeDestroy() {
    for (let event of this.events) {
      this.$midiBus.$off(event[0])
    }
  },
}
