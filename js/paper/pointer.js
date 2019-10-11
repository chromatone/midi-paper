const pointer = Vue.component('pointer',{
  template: '<div></div>',
  props: ['channel'],
  data() {
    return {
      layer: new paper.Layer({
        name:'pointer'
      }),
      point: Ola([0,0],1000),
      pointer: new paper.Shape.Circle({
        center:this.point,
        radius:10,
        fillColor:'#333'
      })
    }
  },
  watch: {
    'pointer.position'() {
      paper.view.draw()
    }
  },
  methods: {
  },
  mounted() {
    paper.view.onMouseDown = (event) => {
      this.point.set([event.point.x,event.point.y]);
    }
    paper.view.onFrame = () => {
      this.pointer.position=this.point
    }

  }
})
