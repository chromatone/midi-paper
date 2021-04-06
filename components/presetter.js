export const presetter = {
  template: /*html*/ `
    <div class="presets">
      <div 
        class="preset" 
        v-for="preset in presets" :key="preset.title"
        @click="$emit('set', preset)"
        :class="{active:current==preset}"
        >
        {{ preset.title }}
      </div>
    </div>
  `,
  data() {
    return {}
  },
  props: ['current', 'presets'],
  mounted() {},
}
