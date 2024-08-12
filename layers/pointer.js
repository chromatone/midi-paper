import Ola from '../assets/ola.min.js'

export default {
  template: '<div ></div>',
  name: 'pointer',
  props: ['channel'],
  data() {
    return {
      layer: new paper.Layer({
        name: 'pointer',
      }),
      point: [0, 0],
      pointer: new paper.Shape.Circle({
        center: this.point,
        radius: 420,
        opacity: 0.05,
        fillColor: '#eee',
      }),
    }
  },
  watch: {
    'pointer.position'() { },
  },
  methods: {},
  mounted() {
    paper.view.onMouseMove = (event) => {
      this.point[0] = event.point.x;
      this.point[1] = event.point.y;
    }
    paper.view.on('frame', (ev) => {
      this.pointer.position = this.point
    })
  },
}
