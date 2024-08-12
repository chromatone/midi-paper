import midiBus from "../components/bus.js"

export default {
  template: '<div></div>',
  name: 'lines',
  props: ['channel'],
  data() {
    return {
      layer: new paper.Layer({
        name: 'lines',
      }),
      lines: [],
      maxCount: 10,
      turn: true,
    }
  },
  watch: {
    'channel.notes'(notes) { },
  },
  methods: {
    randomLine(note) {
      let bounds = paper.view.bounds

      this.lines[this.lines.length] = new paper.Path.Line({
        from: [Math.random() * bounds.width, -10],
        to: [Math.random() * bounds.width, 10 + bounds.height],
        layer: this.layer,
        strokeColor: '#333',
        strokeJoin: 'round',
        opacity: 0.8,
        strokeWidth: 2,
        blendMode: 'multiply',
        fillColor: null,
      })
      this.lines[this.lines.length - 1].tween(
        {
          opacity: 0,
        },
        {
          duration: 2000,
          easing: 'easeInOutQuad',
        },
      )
      if (this.lines.length > this.maxCount) {
        this.lines.shift()
      }
    },
  },
  mounted() {
    midiBus.$on('noteinon' + this.channel.num, this.randomLine)
  },
  beforeDestroy() {
    midiBus.$off('noteinon' + this.channel.num)
    this.lines = []
  },
}
