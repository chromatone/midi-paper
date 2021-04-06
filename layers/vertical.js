export default {
  template: '<div></div>',
  name: 'vertical',
  props: ['channel'],
  data() {
    return {
      layer: new paper.Layer({
        name: 'column',
      }),
      stroke: 3,
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
    controls(value) {
      console.log(value)
    },
    playNote(note) {
      let bounds = paper.view.bounds
      this.circles[length] = new paper.Shape.Circle({
        nameOct: note.nameOct,
        center: [bounds.width / 2, note.number * 10],
        radius: (Math.random() * bounds.width) / 3,
        layer: this.layer,
        blendMode: 'lighten',
        strokeWidth: this.stroke,
        fillColor: {
          hue: note.digit * 30,
          lightness: 0.6,
          saturation: 0.8,
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
            duration: 2000,
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
