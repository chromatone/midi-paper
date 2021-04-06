export default {
  template: /*html*/ `
    <canvas class="paper" id="canvas" data-paper-resize="true">
      <div v-if="mounted">
        <component v-for="layer in preset.layers" :key="layer.comp.name" :is="layer.comp" v-if="layer.ch ? channels[layer.ch] : true" :channel="channels[layer.ch]" :options="layer?.options" />
      </div>
    </canvas>
  `,
  props: ['channels', 'preset'],
  data() {
    return {
      mounted: false,
      notes: {},
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
}
