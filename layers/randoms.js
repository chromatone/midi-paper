export default {
  template: '<div></div>',
  name: 'randoms',
  props: ['channel'],
  data() {
    return {
      layer: new paper.Layer({
        name: 'random',
      }),
      circles: [],
    }
  },
  watch: {
    'channel.notes'(notes) {},
  },
  methods: {
    randomCircle(note) {
      let bounds = paper.view.bounds
      let num = this.circles.push(
        new paper.Path.Star({
          center: [
            Math.random() * bounds.width,
            Math.random() * bounds.height * 0.8 + bounds.height * 0.2,
          ],
          radius1: Math.random() * 100 + 10,
          radius2: Math.random() * 200 + 30,
          points: (note.number % 12) + 1,
          layer: this.layer,
          strokeColor: '#222',
          strokeWidth: 2,
          strokeJoin: 'round',
          blendMode: 'multiply',
          applyMatrix: false,
          rotation: Math.random() * 60 - 30,
        }),
      )

      this.circles[num - 1]
        .tween(
          {
            opacity: 0,
          },
          {
            duration: 2000,
            easing: 'easeOutQuad',
          },
        )
        .then((t) => {
          this.circles.shift()
        })
    },
  },
  mounted() {
    this.$midiBus.$on('noteinon' + this.channel.num, this.randomCircle)
  },
  beforeDestroy() {
    this.$midiBus.$off('noteinon' + this.channel.num)
    this.circles = []
  },
}
