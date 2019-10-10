const bg = Vue.component('bg',{
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
        fillColor:'#060'
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
    changeBg (ev) { this.rect.fillColor.hue++ },
    ccHue (cc) {this.rect.fillColor.hue=(cc/127)*360},
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
    console.log(this.layer)


  //  this.$midiBus.$on('controlchange'+this.chNum, this.changeColor)
    window.addEventListener('resize', () => {
      this.rect.bounds.size=paper.view.bounds.size;
    })
  }
})
