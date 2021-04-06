export const lines = {
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
    'channel.notes'(notes) {},
  },
  methods: {
    randomLine(note) {
      let bounds = paper.view.bounds

      this.lines[length] = new paper.Path.Line({
        from: [Math.random() * bounds.width, -10],
        to: [Math.random() * bounds.width, 10 + bounds.height],
        layer: this.layer,
        //  blendMode:'difference',
        strokeColor: '#333',
        strokeJoin: 'round',
        opacity: 0.7,
        strokeWidth: 6,
        fillColor: null,
        rotation: Math.random() * 180,
      })
      this.lines[length].tween(
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
    this.$midiBus.$on('noteinon' + this.channel.num, this.randomLine)
  },
  beforeDestroy() {
    this.$midiBus.$off('noteinon' + this.channel.num)
    this.lines = []
  },
}
