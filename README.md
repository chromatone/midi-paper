# MIDI Paper
Interactive Chromatone colour music theory visualisation

2D MIDI visualisation web-app. 1-8 midi channels correspond to 8 main components, that react to notes played. There is no motion – only fading - to impose the feeling of ever renewing paper on which you draw with music. 

![](https://raw.githubusercontent.com/DeFUCC/midi-paper/master/Screenshot-2019-12-05-at-21.43.34-768x769.png)

Developed with teenage enginnerin op-z in mind, but may be used with any midi instrument as well..

## Stack
No build process – runs straight it your browser. 

- [vue 2](https://vuejs.org/)
- [webmidi.js](https://github.com/djipco/webmidi)
- [paper.js](http://paperjs.org/)

## Extend it!

You can easily add your own layers and presets. Just duplicate a component, modify it as you want and then add it to the `presets.js` file. 