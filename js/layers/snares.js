export const snares = {
  template: '<div></div>',
  props: ['channel'],
  data() {
    return {
      layer: new paper.Layer({
        name:'snares'
      }),
      snares:[],
      maxCount:10,
      turn:true
    }
  },
  watch: {
    'channel.notes'(notes) {

    }
  },
  methods: {
    getSegments(num,w,h) {
      let randomX = Math.random()*w;
      let randomLen = Math.random()*w-w/2;
      let randomHeight= Math.random()*h-h/2;
      let randomY = Math.random()*h;
      let segments=[
        [randomX, randomY],
        [randomX+randomLen*0.6, randomY],
        [randomX+randomLen*0.6, randomY+randomHeight*0.6],
      ];

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
        fillColor: null,
        rotation:Math.random()*180
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
    this.$midiBus.$on('noteinon'+this.channel.num, this.randomSnare)
  },
  beforeDestroy() {

      this.$midiBus.$off('noteinon'+this.channel.num)

  }
}
