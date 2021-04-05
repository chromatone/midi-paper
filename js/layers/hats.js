export const hats = {
  template: '<div></div>',
  name: 'hats',
  props: ['channel'],
  data() {
    return {
      layer: new paper.Layer({
        name: 'hats',
      }),
      hats: [],
      maxCount: 20,
      prevPoint: [0, 0],
      nextPoint: [100, 100],
      circle: new paper.Shape.Circle({
        center: [100, 100],
        radius: 5,
        fillColor: '#fff',
      }),
    }
  },
  watch: {
    'channel.notes'(notes) {},
  },
  methods: {
    randomPos() {
      let bounds = paper.view.bounds
      return [Math.random() * bounds.width, Math.random() * bounds.height]
    },
    randomHat(note) {
      this.nextPoint = this.randomPos()
      this.circle.position = this.nextPoint
      this.hats[length] = new paper.Path({
        segments: [this.prevPoint, this.nextPoint],
        layer: this.layer,
        strokeColor: '#fff',
        strokeJoin: 'bevel',
        strokeWidth: 3,
        fillColor: {
          hue: 0,
          lightness: note.velocity,
          saturation: 0,
        },
      })
      this.prevPoint = this.nextPoint
      this.hats[length].tween(
        {
          opacity: 0,
        },
        {
          duration: 3000,
          easing: 'easeInOutQuad',
        },
      )
      if (this.hats.length > this.maxCount) {
        this.hats.shift()
      }
    },
  },
  mounted() {
    this.$midiBus.$on('noteinon' + this.channel.num, this.randomHat)
  },
  beforeDestroy() {
    this.circle.remove()
    this.circle = undefined
    this.$midiBus.$off('noteinon' + this.channel.num)
  },
}
