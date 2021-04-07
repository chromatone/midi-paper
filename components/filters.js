export default {
  template: /*html*/ `    
  <svg style="position: absolute;" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="filter" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="linearRGB">
      <feTurbulence type="turbulence" :baseFrequency="frequency" :numOctaves="2" seed="2" stitchTiles="stitch" result="turbulence"/>
      <feDisplacementMap in="SourceGraphic" in2="turbulence" :scale="scale" xChannelSelector="G" yChannelSelector="A" result="displacementMap"/>
        <feMorphology operator="dilate" :radius="dilate" />
       <feGaussianBlur :stdDeviation="deviation"   edgeMode="wrap" />
       <feConvolveMatrix v-if="show.convolve" order="3 3" preserveAlpha="true" divisor="0.5" bias="0.05" kernelMatrix="-1,-1,-1 -1,9,-1 -1,-1,-1"/>
       <feComponentTransfer v-if="show.transfer"><feFuncR type="discrete" tableValues=" 0 0 0 0 0 0 0 0 0 1 1 1 1 1 1 1 1 1 1 1"/><feFuncG type="discrete" tableValues=" 0 0 0 0 0 0 0 0 0 1 1 1 1 1 1 1 1 1 1 1"/><feFuncB type="discrete" tableValues=" 0 0 0 0 0 0 0 0 0 1 1 1 1 1 1 1 1 1 1 1"/></feComponentTransfer>
       <feColorMatrix v-if="show.sepia" type="matrix" values="0.5  0.5 0.5  0 0 0.25 0.25 0.25  0 0 0.1 0.1 0.1  0 0  0 0 0 1 0" />
 
  </filter>
    </defs> 
  </svg>
  `,
  name: 'filters',
  props: [],
  data() {
    return {
      deviation: 0,
      dilate: 0,
      frequency: 0,
      scale: 1,
      follower: Ola(0, 200),
      show: {
        convolve: false,
        transfer: false,
        sepia: false,
      },
      events: [
        ['noteinon16', this.effect],
        [
          '16cc20',
          (cc) => {
            this.follower.set(cc / 2)
            paper.view.on('frame', (ev) => {
              this.deviation = this.follower.value
            })
          },
        ],
        [
          '16cc2',
          (cc) => {
            console.log(cc)
            this.dilate = cc
          },
        ],
        [
          '16cc3',
          (cc) => {
            this.frequency = (0.2 * cc) / 127
          },
        ],
        [
          '16cc4',
          (cc) => {
            this.scale = cc
          },
        ],
      ],
    }
  },
  watch: {},
  methods: {
    effect(event) {
      if (event.name == 'B') {
        this.show.convolve = !this.show.convolve
      }
      if (event.name == 'A') {
        this.show.transfer = !this.show.transfer
      }
      if (event.name == 'G') {
        this.show.sepia = !this.show.sepia
      }
    },
  },

  created() {
    for (let event of this.events) {
      this.$midiBus.$on(event[0], event[1])
    }
  },
  beforeDestroy() {
    for (let event of this.events) {
      this.$midiBus.$off(event[0])
    }
  },
  mounted() {
    //    this.$midiBus.$on('noteinon1', this.boom) //boom on kick
    //  this.$midiBus.$on('controlchange'+this.chNum, this.changeColor)
    window.addEventListener('resize', () => {
      console.log('resized')
    })
  },
}
