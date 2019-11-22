export default {
  template: '<div></div>',
  props: ['channel'],
  data() {
    return {
      layer: new paper.Layer({
        name:'snares'
      }),
      snares:[],
      maxCount:10
    }
  },
  watch: {
    'channel.notes'(notes) {

    }
  },
  methods: {
    getSegments(num,w,h) {
      let segments=[];
      for (let i=0;i<num;i++) {
        segments[i]= [Math.random()*w, Math.random()*h]
      }
      return segments
    },
    randomSnare(note) {
      let bounds = paper.view.bounds

      this.snares[length] = new paper.Path({
        segments:this.getSegments(3,bounds.width,bounds.height),
        layer:this.layer,
      //  blendMode:'difference',
        strokeColor:"#333",
        strokeJoin:'miter',
        opacity:0.7,
        strokeWidth:20,
        fillColor: null
      })
      this.snares[length].tween({
        opacity:0
      },{
        duration:2000,
        easing:'easeInOutQuad'
      })
      if (this.snares.length>this.maxCount) {
        this.snares.shift()
      }
    }
  },
  mounted() {
    console.log(this.channel)
    this.$midiBus.$on('noteinon'+this.channel.num, this.randomSnare)
  },
  beforeDestroy() {

      this.$midiBus.$off('noteinon'+this.channel.num)

  }
}
