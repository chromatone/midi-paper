import midiBus from './midi-bus.js'

import * as layers from './layers/all.js'

const colorPaper = Vue.component('paper', {
  components: {
    ...layers,
  },
  template: /*html*/ `
    <canvas class="paper" id="canvas" data-paper-resize="true">
      <bg v-if="mounted"></bg>
      <component v-for="(layer,num) in layers" :key="num" :is="layer" v-if="channels[num]" :channel="channels[num]" />
      <blobs v-if="false"></blobs>
      <chain v-if="false"></chain>
      <pointer v-if="mounted"></pointer>
    </canvas>

  `,
  props: ['channels'],
  data() {
    return {
      mounted: false,
      notes: {},
      layers: {
        1: 'box',
        2: 'snares',
        3: 'hats',
        4: 'random',
        5: 'bottom',
        6: 'column',
        7: 'grid',
        8: 'spiral',
      },
    }
  },
  methods: {
    reset() {
      console.log('reset')
    },
  },
  created() {
    this.$midiBus.$on('reset', this.reset)
  },
  mounted() {
    paper.setup(this.$el)
    this.mounted = true
    paper.view.draw()
  },
})

const ct = new Vue({
  el: '#midi-paper',
  components: {
    midiBus,
  },
  data: {
    channels: {},
  },
})
