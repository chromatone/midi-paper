export const box = {
  template: '<div ></div>',
  props: ['channel'],
  data() {
    return {
      layer: new paper.Layer({
        name:'box'
      }),
      box: new paper.Shape.Rectangle({
        center:[paper.view.bounds.width/2, paper.view.bounds.height/2],
        size:[paper.view.bounds.width/4, paper.view.bounds.width/4],
        layer:this.layer,
        fillColor:'#fff',
        opacity:0,
      })
    }
  },
  watch: {
    'channel.notes'(notes) {

    }
  },
  methods: {
    positionBox() {
      this.box.position = [
        paper.view.bounds.width/2,
        paper.view.bounds.height/2
      ]
    },
    boom(note) {
      let bounds = paper.view.bounds;
      this.box.tween({
        opacity:1
      },30).then((t) => {
        t.tween({
          opacity:0
        },{
          duration:800,
          easing:'easeOutQuad'
        })
      })
    }
  },
  mounted() {
    this.$midiBus.$on('noteinon'+this.channel.num, this.boom);
    window.addEventListener('resize', () => {
      this.positionBox();
    })
  },
  beforeDestroy() {
    this.box.remove();
    this.box=undefined;
    this.$midiBus.$off('noteinon'+this.channel.num)
  }
}
