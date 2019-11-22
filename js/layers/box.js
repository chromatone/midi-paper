export default {
  template: '<div></div>',
  props: ['channel'],
  data() {
    return {
      layer: new paper.Layer({
        name:'box'
      }),
      squares:[],
      copies:[]
    }
  },
  watch: {
    'channel.notes'(notes) {

    }
  },
  methods: {
    boom(note) {
      let bounds = paper.view.bounds
      let length = this.squares.length;
      this.squares[length] = new paper.Shape.Rectangle({
        nameOct:note.nameOct,
        center:[bounds.width/2, bounds.height/2],
        size:[bounds.width/6, bounds.width/6],
        layer:this.layer,
        strokeColor: '#fff',
        fillColor:null,
        strokeWidth:1
      })


      this.squares[length].tween({
        opacity:0,
        size:[bounds.width/3,bounds.width/3]
      },{
        duration:800,
        easing:'easeInOutQuad'
      })
       if (this.squares[length]>4) {
         this.squares.shift()
       }
    }
  },
  mounted() {
    console.log(this.channel)
    this.$midiBus.$on('noteinon'+this.channel.num, this.boom)
  },
  beforeDestroy() {

      this.$midiBus.$off('noteinon'+this.channel.num)

  }
}
