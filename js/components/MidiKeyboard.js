import { LitElement, html, css } from 'lit';
import "./NumberBox.js"

const whiteNotes = [0, 2, 4, 5, 7, 9, 11];


class MidiKeyboard extends LitElement {
  constructor() {
    super();

    this._width = 600;
    this._height = 150;
    this.device = null;

    this.nOctave = 2;
    this.firstOctave = 3;

    this.playNote = this.playNote.bind(this);
    this.releaseNote = this.releaseNote.bind(this);
  }

  static properties = {
    nOctave: {
      type: Number,
    },
  }

  static styles = css`
    :host {
      display: inline-block;
      position: relative;
    }

    .key {
      display: inline-block;
      position: absolute;
      top: 0;
      border: solid 1px black;
    }

    .key:active {
      background-color: #ED6447;
    }

    .white {
      background-color: white;
    }

    .black {
      background-color: black;
    }

    #keyboard {
      width: 600px;
      height: 150px;
      position: relative;
    }

    .params {
      margin: 2px 0px;
      display: flex;
      align-items: center;
    }

    .params > number-box 
    {
      margin-right: 5px;
    }

  `;

  render() {
    const whiteKeys = [];
    const blackKeys = [];

    const heightBlackKey = 0.66*this._height; 
    const widthWhiteKey = this._width/(this.nOctave*7)
    const widthBlackKey = 0.66 * widthWhiteKey; 
    let keyPosition = 0; 
    
    // populate arrays with white and black key html elements
    for (let i = 0; i < this.nOctave*12; i++) {
      const isWhite = whiteNotes.includes(i%12);
      if (isWhite) {
        whiteKeys.push(html`
          <div
            class="key white"
            style="
              left: ${keyPosition * widthWhiteKey}px;
              width: ${widthWhiteKey}px;
              height: ${this._height}px;
            "
            .value=${i}
            @mousedown="${this.playNote}"
            @mouseup="${this.releaseNote}"
            @mouseout="${this.releaseNote}"
          ></div>
        `)
      } else {
        //add 0.15 to position for centering black key
        blackKeys.push(html`
          <div
            class="key black"
            style="
              left: ${(keyPosition + 0.15) * widthWhiteKey }px; 
              width: ${widthBlackKey}px;
              height: ${heightBlackKey}px;
            "
            .value=${i}
            @mousedown="${this.playNote}"
            @mouseup="${this.releaseNote}"
            @mouseout="${this.releaseNote}"
          ></div>
        `)
      }

      if (i%12 == 4 || i%12 == 11) { //no black key following E or B
        keyPosition += 1;
      } else {
        keyPosition += 0.5;
      }
    }

    // return for rendering
    return html`
      <div id="keyboard">
        ${whiteKeys}
        ${blackKeys}
      </div>
      <div class="params">
        <number-box
          value="${this.nOctave}"
          min="0"
          max="8"
          integer="true"
          @change="${e => this.nOctave = e.detail.value}"
        ></number-box>
        <div>number of octaves</div>
      </div>
      <div class="params">
        <number-box
          value="${this.firstOctave}"
          min="0"
          max="8"
          integer="true"
          @change="${e => this.firstOctave = e.detail.value}"
        ></number-box>
        <div>first octave</div>
      </div>
      
      
    `
  }

  playNote(e) {
    // compute midi note number and velocity based on height of the click like in max/msp
    const midiNote = 24 + (this.firstOctave - 1)*12 + e.target.value; 
    const velocity = 127 - 127/(this._height + 2) * e.layerY;

    const event = new CustomEvent('input', {
      bubbles: true,
      composed: true,
      detail: { value: {
        type: "noteOn",
        midiNote,
        velocity
      }},
    });

    this.dispatchEvent(event);

    // const noteOnMessage = [
    //   144, // Code for a note on: 10010000 & midi channel (0-15)
    //   midiNote, // MIDI Note
    //   velocity // MIDI Velocity
    // ];

    // const noteOnEvent = new RNBO.MIDIEvent(this.device.context.currentTime * 1000, midiPort, noteOnMessage);
    
    // this.device.scheduleEvent(noteOnEvent);
  }

  releaseNote(e) {
    const midiNote = 24 + (this.firstOctave - 1) * 12 + e.target.value;
    const velocity = 0;

    const event = new CustomEvent('input', {
      bubbles: true,
      composed: true,
      detail: {
        value: {
          type: "noteOff",
          midiNote,
          velocity
        }
      },
    });

    this.dispatchEvent(event);

    // let noteOffMessage = [
    //   128, // Code for a note off: 10000000 & midi channel (0-15)
    //   midiNote, // MIDI Note
    //   0 // MIDI Velocity
    // ];

    // const noteOffEvent = new RNBO.MIDIEvent(this.device.context.currentTime * 1000, midiPort, noteOffMessage);

    // this.device.scheduleEvent(noteOffEvent);
  }
}

customElements.define('midi-keyboard', MidiKeyboard);