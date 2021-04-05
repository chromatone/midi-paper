import midiBus from './midi-bus.js'

import { presets, preseter } from './presets.js'

const colorPaper = Vue.component('paper', {
  template: /*html*/ `
    <canvas class="paper" id="canvas" data-paper-resize="true">
      <div v-if="mounted">
        <component v-for="layer in presets[0].layers" :key="layer.comp.name" :is="layer.comp" v-if="layer.ch ? channels[layer.ch] : true" :channel="channels[layer.ch]" :options="layer?.options" />
      </div>
    </canvas>
  `,
  props: ['channels'],
  data() {
    return {
      mounted: false,
      notes: {},
      presets,
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
    preseter,
  },
  data: {
    channels: {},
  },
})
