export default {
  template: '<div></div>',
  name: 'clock',
  props: ['channel'],
  data() {
    return {
      layer: new paper.Layer({
        name: 'clock',
      }),
      lines: [],
      maxCount: 60,
      turn: true,
      radius: 300,
      count: 0,
    }
  },
  watch: {
    'channel.notes'(notes) {},
  },
  methods: {
    randomLine(note) {
      let bounds = paper.view.bounds

      this.lines[this.lines.length] = new paper.Path.Line({
        from: [bounds.width / 2, bounds.height / 2 - bounds.height / 3],
        to: [bounds.width / 2, bounds.height / 2],
        pivot: [bounds.width / 2, bounds.height / 2],
        layer: this.layer,
        strokeColor: '#fff',
        strokeJoin: 'round',
        opacity: 0.8,
        strokeWidth: 8,
        strokeCap: 'round',
        blendMode: 'difference',
        fillColor: null,
        applyMatrix: false,
        rotation: this.count * 5,
      })
      this.count++
      this.lines[this.lines.length - 1].tween(
        {
          opacity: 0,
          //rotation: (this.count - 2) * 5,
        },
        {
          duration: 2000,
          easing: 'easeInQuad',
        },
      )
      if (this.lines.length > this.maxCount) {
        this.lines.shift()
      }
    },
  },
  mounted() {
    this.$midiBus.$on('noteinon' + this.channel.num, this.randomLine)
  },
  beforeDestroy() {
    this.$midiBus.$off('noteinon' + this.channel.num)
    this.lines = []
  },
}
