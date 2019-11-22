export default {
  template: '<div></div>',
  props: ['channel'],
  data() {
    return {
      layer: new paper.Layer({
        name:'chain'
      }),
      points: 25,
      length:35,
      path: new paper.Path({
        strokeColor:'#e4141b',
        strokeWidth:20,
        strokeCap:'round'
      }),
      start:paper.view.center,
      pointer: new paper.Shape.Circle({
        center:this.point,
        radius:10,
        fillColor:'#333'
      })
    }
  },
  watch: {
    'pointer.position'() {

    }
  },
  methods: {
  },
  mounted() {
    for (var i = 0; i < this.points; i++) {
      	this.path.add(this.start.add(new paper.Point(i * this.length, 0)));
    }

    paper.view.onMouseMove = (event) => {

    }
    paper.view.onFrame = (ev) => {

    }

  }
}
