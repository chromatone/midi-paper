import Ola from '../../assets/ola.min.js'

export const pointer = {
  template: '<div ></div>',
  name: 'pointer',
  props: ['channel'],
  data() {
    return {
      layer: new paper.Layer({
        name: 'pointer',
      }),
      point: Ola([0, 0], 1000),
      pointer: new paper.Shape.Circle({
        center: this.point,
        radius: 420,
        opacity: 0.05,
        fillColor: '#eee',
      }),
    }
  },
  watch: {
    'pointer.position'() {},
  },
  methods: {},
  mounted() {
    paper.view.onMouseMove = (event) => {
      this.point.set([event.point.x, event.point.y])
    }
    paper.view.onFrame = (ev) => {
      this.pointer.position = this.point
    }
  },
}
