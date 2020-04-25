
import midiBus from './midi-bus.js'

import * as layers from './layers/all.js'

const colorPaper = Vue.component('paper',{
  components: {
    ...layers
  },
  template: `
    <canvas class="paper" id="canvas" data-paper-resize="true">
      <bg v-if="mounted"></bg>
      <bottom v-if="channels[5]" :channel="channels[5]"></bottom>
      <random v-if="channels[4]" :channel="channels[4]"></random>
      <column v-if="channels[6]" :channel="channels[6]"></column>
      <spiral  v-if="channels[8]" :channel="channels[8]"></spiral>
      <grid  v-if="channels[7]" :channel="channels[7]"></grid>
      <box  v-if="channels[1]" :channel="channels[1]"></box>
      <hats  v-if="channels[3]" :channel="channels[3]"></hats>
      <snares  v-if="channels[2]" :channel="channels[2]"></snares>
      <blobs v-if="false"></blobs>
      <chain v-if="false"></chain>
      <pointer v-if="mounted"></pointer>
    </canvas>

  `,
  props: ['channels'],
  data() {
    return {
      mounted:false,
      layers:{},
      notes:{}
    }
  },
  methods: {
    reset() {
      this.layers={};
    }
  },
  created() {
    this.$midiBus.$on('reset',this.reset);
  },
  mounted() {
    paper.setup(this.$el);
    this.mounted=true;
    paper.view.draw();
  }
})


const ct = new Vue({
  el:"#midi-paper",
  components: {
    midiBus
  },
  data: {
    channels:{}
  },
});
