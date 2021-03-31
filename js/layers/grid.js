export const grid = {
  template: '<div></div>',
  props: ['channel'],
  data() {
    return {
      layer: new paper.Layer({
        name: 'grid',
      }),
      stroke: 20,
      startRadius: paper.view.bounds.width / 26,
      maxRadius: paper.view.bounds.width / 13,
      grid: [],
      events: [
        ['noteinon' + this.channel.num, this.playNote],
        ['noteinoff' + this.channel.num, this.stopNote],
        [this.channel.num + 'cc4', this.controls],
      ],
    }
  },
  watch: {},
  methods: {
    calcRadius(number) {
      return Number(Math.pow(2, (127 - number) / 12) / 1.5)
    },
    controls(value) {
      console.log(value)
    },
    createGrid() {
      for (let oct = 0; oct < 9; oct++) {
        this.grid[oct] = []
        for (let note = 0; note < 12; note++) {
          this.grid[oct][note] = new paper.Shape.Circle({
            radius: this.startRadius,
            opacity: 0,
            strokeWidth: this.stroke,
            strokeColor: {
              hue: (note % 12) * 30,
              lightness: 0.5,
              saturation: 1.0,
            },
          })
        }
      }
      this.positionGrid()
    },

    positionGrid() {
      let minDimension =
        paper.view.bounds.width < paper.view.bounds.height
          ? paper.view.bounds.width
          : paper.view.bounds.height
      for (let oct = 0; oct < 9; oct++) {
        for (let note = 0; note < 12; note++) {
          this.grid[oct][note].position = [
            ((oct + 1) * paper.view.bounds.width) / 10,
            paper.view.bounds.height -
              +(note + 1) * (paper.view.bounds.height / 13),
          ]

          this.grid[oct][note].radius = minDimension / 26
        }
      }
    },

    playNote(note) {
      if (this.grid[note.octave][note.digit].t) {
        this.grid[note.octave][note.digit].t.stop()
      }
      this.grid[note.octave][note.digit].bringToFront()
      this.grid[note.octave][note.digit].tween(
        {
          opacity: 1,
          radius: this.maxRadius,
        },
        {
          duration: 200,
          easing: 'easeOutQuad',
        },
      )
    },
    stopNote(note) {
      this.grid[note.octave][note.digit].t = this.grid[note.octave][
        note.digit
      ].tween(
        {
          opacity: 0,
          radius: this.startRadius,
        },
        {
          duration: 1500,
          easing: 'easeInOutQuad',
        },
      )
    },
  },
  mounted() {
    this.createGrid()

    window.addEventListener('resize', () => {
      this.positionGrid()
    })
  },
  created() {
    for (event of this.events) {
      this.$midiBus.$on(event[0], event[1])
    }
  },
  beforeDestroy() {
    for (event of this.events) {
      this.$midiBus.$off(event[0])
    }
    this.grid = undefined
  },
}
