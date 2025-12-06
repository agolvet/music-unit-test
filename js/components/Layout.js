import { LitElement, html, css } from 'lit';
import "./MidiKeyboard.js"
import "./NumberBox.js"
import "./Slider.js"
import "./Presets.js"

const midiPort = 0;

/*
  General layout of the app.

  As for all lit elements, the HTML structure in written in the render function 
  and the CSS styling in the styles variable.

  We need to pass the RNBO device to this component in the app.js (cf. line 84)
  to automatically instantiate parameters sliders and define keyboard callbacks
*/ 

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

    // update rendering in case parameters are changed through the device (cf. presets)
    d.parameterChangeEvent.subscribe(param => {
      const $paramSlider = this.renderRoot.getElementById(`rnbo-param-${param.id}`);
      $paramSlider.value = param.value; 
    }); 
  }

  get device() {
    return this._device;
  }

  static styles = css`
    .text {
      font-weight: bold;
    }

    midi-keyboard {
      margin: 15px 0;
    }

    #audio-params {
      width: 600px;
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    #audio-params > p {
      font-weight: bold;
    }

    #resume-context {
      height: 100%;
      width: 100%;
      background-color: green;
    } 

  `
  // rendering parameter sliders automatically from rnbo export.
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
      <p>!! AudioContext in the browser can only be started after a user gesture. Click anywhere on the page before playing with the keyboard</p>
      </div>
      <div class="text">presets</div>
      <my-presets
        .device="${this.device}"
        @input="${e => this.loadPreset(e.detail.value)}"
      ></my-presets>
      <midi-keyboard 
        id="midi-keyboard"
        @input="${e => this.onMidiEvent(e.detail.value)}"
      ></midi-keyboard>
      <div id="audio-params">
        ${this.renderParams()}
      </div>
    `
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
}

customElements.define('my-layout', Layout);