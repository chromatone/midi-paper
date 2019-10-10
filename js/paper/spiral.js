const spiral = Vue.component('spiral',{
  template: '<div></div>',
  props: ['channel'],
  data() {
    return {
      layer: new paper.Layer({
        name:'spiral'
      }),
      fade:new paper.Point(paper.view.bounds.width/2, paper.view.bounds.height/2),
      spiral:[],
      events: [
        ['noteinon'+this.channel.num, this.playNote],
        ['noteinoff'+this.channel.num, this.stopNote],
        [this.channel.num+'cc4',this.controls]
      ]
    }
  },
  watch: {

  },
  methods: {
    calcRadius(number) {
      return Number(Math.pow(2, (127-number) / 12)/1.5);
    },

    controls(value) {
      console.log(value)
    },

    spiralCoords(i) {
      return [
        paper.view.center.x + Math.cos((i/12)*2*Math.PI)*paper.view.bounds.width*0.6*Math.sqrt((108-i)/108),
        paper.view.center.y + Math.sin((i/12)*2*Math.PI)*paper.view.bounds.height*0.6*Math.sqrt((108-i)/108)
      ]
    },
    createSpiral() {
      for (let i=0;i<108;i++) {
        this.spiral[i]=new paper.Shape.Circle({
          center:this.spiralCoords(i),
          radius:(108-i)*2+2,
          opacity:0,
          fillColor:{
            hue:((i+3)%12)*30,
            lightness:0.6,
            saturation:0.0
          }
        })
      }
    },
    updateSpiral() {
      for (i=0;i<108;i++) {
        this.spiral[i].position = this.spiralCoords(i)
      }
    },
    playNote (note) {
      if (this.spiral[note.number].t) {
        this.spiral[note.number].t.stop();
      }
      this.spiral[note.number].tween({
        'fillColor.saturation':1,
        'fillColor.lightness':0.6,
        position:this.spiralCoords(note.number),
        opacity:1
      },{
        duration:30,
        easing:'easeOutQuad'
      })
    },
    stopNote(note) {
      this.spiral[note.number].t = this.spiral[note.number].tween({
        opacity:0,
        'fillColor.saturation':0.5,
        'fillColor.lightness':0.9
      },{
        duration:3000,
        easing:'easeOutQuad'
      })
    }
  },
  mounted() {
    paper.view.onMouseDown = (event) => {
      this.fade=event.point;
    }
    this.createSpiral();

    window.addEventListener('resize', () => {
      this.updateSpiral()
    })
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
  }
})
