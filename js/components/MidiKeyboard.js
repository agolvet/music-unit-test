import { LitElement, html, css } from 'lit';

const whiteNotes = [0, 2, 4, 5, 7, 9, 11];
const nOctave = 2;
const firstOctave = 3; //keyboard start from C3
const midiPort = 0;

class MidiKeyboard extends LitElement {
  constructor() {
    super();

    this._width = 600;
    this._height = 150;
    this.device = null;
  }

  static styles = css`
    :host {
      display: inline-block;
      width: 600px;
      height: 200px;
      position: relative;
    }

    .key {
      display: inline-block;
      position: absolute;
      top: 0;
      border: solid 1px black;
    }

    .white {
      background-color: white;
    }

    .white:active {
      background-color: darkgrey;
    }

    .black {
      background-color: black;
    }

    .black:active {
      background-color: grey;
    }
  `;

  render() {
    const whiteKeys = [];
    const blackKeys = [];

    const heightBlackKey = 0.66*this._height; 
    const widthWhiteKey = this._width/(nOctave*7)
    const widthBlackKey = 0.66 * widthWhiteKey; 
    let keyPosition = 0; 
    
    // populate arrays with white and black key html elements
    for (let i = 0; i < nOctave*12; i++) {
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
            @pointerdown=${this.playNote}
            @pointerup=${this.releaseNote}
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
            @pointerdown=${this.playNote}
            @pointerup=${this.releaseNote}
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
      ${whiteKeys}
      ${blackKeys}
    `
  }

  // callback function for playing a note when clicking on a note
  // this sends a midi event to rnbo
  playNote(e) {
    // compute midi note number and velocity based on height of the click like in max/msp
    const midiNote = 24 + (firstOctave - 1)*12 + e.target.value; 
    const velocity = 127 - 127/(this._height + 2) * e.layerY;

    const noteOnMessage = [
      144, // Code for a note on: 10010000 & midi channel (0-15)
      midiNote, // MIDI Note
      velocity // MIDI Velocity
    ];

    const noteOnEvent = new RNBO.MIDIEvent(this.device.context.currentTime * 1000, midiPort, noteOnMessage);
    
    this.device.scheduleEvent(noteOnEvent);
  }

  releaseNote(e) {
    const midiNote = 24 + (firstOctave - 1) * 12 + e.target.value;

    let noteOffMessage = [
      128, // Code for a note off: 10000000 & midi channel (0-15)
      midiNote, // MIDI Note
      0 // MIDI Velocity
    ];

    const noteOffEvent = new RNBO.MIDIEvent(this.device.context.currentTime * 1000, midiPort, noteOffMessage);

    this.device.scheduleEvent(noteOffEvent);
  }
}

customElements.define('midi-keyboard', MidiKeyboard);