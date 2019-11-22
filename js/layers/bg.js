export default {
  template: '<div></div>',
  props: [],
  data() {
    return {
      layer: new paper.Layer({
        name:'bg'
      }),
      rect: new paper.Shape.Rectangle({
        point:[0,0],
        size:paper.view.bounds,
        fillColor:'#aaa'
      }),
      events: [
        ['noteinon14', this.changeBg],
        ['14cc2',(cc) => {this.rect.fillColor.hue=(cc/127)*360}],
        ['14cc3',(cc) => {this.rect.fillColor.lightness=cc/127}],
        ['14cc4',(cc) => {this.rect.fillColor.saturation=(cc/127)}]
      ]
    }
  },
  watch: {

  },
  methods: {
    changeBg (note) {
      this.rect.tween({
        'fillColor.hue': ((note.number+3)%12)*30
      },{duration:1000, easing:'easeInOutQuad'})
    },
    ccHue (cc) {
      this.rect.tween({
        'fillColor.hue': (cc/127)*360
      },{duration:300, easing:'easeInOutQuad'})
    },
    ccLightness (cc) {this.rect.fillColor.lightness=(cc/127);}
  },

  created() {
    for (event of this.events) {
      this.$midiBus.$on(event[0],event[1])
    }
  },
  beforeDestroy() {
    for (event of this.events) {
      this.$midiBus.$off(event[0])
    }
  },
  mounted() {

  //  this.$midiBus.$on('controlchange'+this.chNum, this.changeColor)
    window.addEventListener('resize', () => {
      this.rect.bounds.size=paper.view.bounds.size;
    })
  }
}
