import { LitElement, html, css } from 'lit';
import "./MidiKeyboard.js"
import "./NumberBox.js"
import "./Slider.js"
import "./Presets.js"

const midiPort = 0;

class Layout extends LitElement {
  constructor() {
    super();

    this._device = null;
    this._paramSliders = {};
  }

  static properties = {
    device: {
      type: Object,
    },
  }

  set device(d) {
    this._device = d;

    d.parameterChangeEvent.subscribe(param => {
      const $paramSlider = this.renderRoot.getElementById(`rnbo-param-${param.id}`);
      $paramSlider.value = param.value; 
    });


  }

  get device() {
    return this._device;
  }

  renderParams() {
    if (this._device) {
      return this._device.parameters.map(param => {
        return html`
        <p>${param.name}</p>
        <my-slider
          id="rnbo-param-${param.id}"
          min="${param.min}"
          max="${param.max}"
          value="${param.initialValue}"
          @input="${e => param.value = e.detail.value}"
        ></my-slider>
      `
      });
    }
  }

  render() {
    return html`
      <p>hello</p>
      <my-presets
        @input="${e => this.loadPreset(e.detail.value)}"
      ></my-presets>
      <midi-keyboard 
        id="midi-keyboard"
        @input="${e => this.onMidiEvent(e.detail.value)}"
      ></midi-keyboard>
      <my-slider 
          min="0"
          max="1"
          value="0.2"
      ></my-slider>
      ${this.renderParams()}
    `
  }

  paramChange(val, param) {
    if (this._device) {
    }

  }

  onMidiEvent(e) {
    if (this._device) {
      if (e.type === "noteOn") {
        this.playNote(e);
      } else if (e.type === "noteOff") {
        this.releaseNote(e);
      }
    }
  }

  playNote(e) {
    const noteOnMessage = [
      144, // Code for a note on: 10010000 & midi channel (0-15)
      e.midiNote, // MIDI Note
      e.velocity // MIDI Velocity
    ];

    const noteOnEvent = new RNBO.MIDIEvent(this._device.context.currentTime * 1000, midiPort, noteOnMessage);

    this._device.scheduleEvent(noteOnEvent);
  }

  releaseNote(e) {
    let noteOffMessage = [
      128, // Code for a note off: 10000000 & midi channel (0-15)
      e.midiNote, // MIDI Note
      e.velocity // MIDI Velocity
    ];

    const noteOffEvent = new RNBO.MIDIEvent(this._device.context.currentTime * 1000, midiPort, noteOffMessage);

    this._device.scheduleEvent(noteOffEvent);
  }

  savePreset(preset) {
    
  }

  loadPreset(preset) {
    Object.keys(preset).forEach(paramId => {
      const rnboParam = this.device.parameters.find(p => p.id === paramId);
      rnboParam.value = preset[paramId];
      const $paramSlider = this.renderRoot.getElementById(`rnbo-param-${paramId}`);
      $paramSlider.value = preset[paramId]; 
    });
  }

}

customElements.define('my-layout', Layout);