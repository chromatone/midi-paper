import { bg } from './layers/bg.js'
import { bottom } from './layers/bottom.js'
import { box } from './layers/box.js'
import { pointer } from './layers/pointer.js'
import { random } from './layers/random.js'
import { spiral } from './layers/spiral.js'
import { grid } from './layers/grid.js'
import { hats } from './layers/hats.js'
import { snares } from './layers/snares.js'
import { blobs } from './layers/blobs.js'
import { chain } from './layers/chain.js'
import { column } from './layers/column.js'

export const presets = [
  {
    title: 'main',
    layers: [
      { comp: bg },
      { comp: pointer },
      { comp: box, ch: 1 },
      { comp: snares, ch: 2 },
      { comp: hats, ch: 3 },
      { comp: random, ch: 4 },
      { comp: bottom, ch: 5 },
      { comp: column, ch: 6 },
      { comp: grid, ch: 7 },
      { comp: spiral, ch: 8 },
    ],
  },
  {
    title: 'new',
    layers: [
      { comp: bg },
      { comp: pointer },
      { comp: box, ch: 1 },
      { comp: snares, ch: 2 },
      { comp: hats, ch: 3 },
      { comp: random, ch: 4 },
      { comp: bottom, ch: 5 },
      { comp: column, ch: 6 },
      { comp: grid, ch: 7 },
      { comp: spiral, ch: 8 },
    ],
  },
]

export const preseter = {
  template: /*html*/ `
    <div class="presets">
      <div 
        class="preset" 
        v-for="preset in presets" :key="preset.title" 
        >
        {{ preset.title }}
      </div>
    </div>
  `,
  data() {
    return {
      presets,
    }
  },
  mounted() {},
}
