
if (window.Buefy) {  Vue.use(Buefy.default); }

Vue.prototype.$midiBus = new Vue(); // Global event bus

const ct = new Vue({
  el:"#midi-paper",
  data: {
    channels:{}
  },
  methods: {

  },
  mounted: function() {

    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      StartAudioContext(Tone.context, "button").then(function() {});
    }

  }

})
