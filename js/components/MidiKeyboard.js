import { LitElement, html, css } from 'lit';
import "./NumberBox.js"
import "./Toggle.js"

const whiteNotes = [0, 2, 4, 5, 7, 9, 11];
const keyboardToNote = {
  "q": 0,
  "z": 1,
  "s": 2,
  "e": 3,
  "d": 4,
  "f": 5, 
  "t": 6,
  "g": 7,
  "y": 8,
  "h": 9,
  "u": 10,
  "j": 11, 
  "k": 12, 
}

/*
  A minimalist monophonic MIDI keyboard.
  Number boxes can be used to change number of octave displayed, first octave 
  displayed and to (un)toggle fixed velocity.

  Reacts to keyboard input (french layout) : second line for white keys 
  and first line for black keys
*/

class MidiKeyboard extends LitElement {
  constructor() {
    super();

    this._width = 600;
    this._height = 150;
    this.device = null;

    this.nOctave = 2;
    this.firstOctave = 3;
    this.fixedVelocity = false;
    this.velocity = 100;

    // height of displayed black key compared to white key
    this.blackToWhiteKeyRatio = 0.66;

    // need these so that "this" refers to this element in these callback function
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);

    // react to keyboard input 
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
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

    .text {
      font-weight: bold;
    }

    .key {
      display: inline-block;
      position: absolute;
      top: 0;
      border: solid 1px black;
    }

    .key.active {
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
      margin: 5px 0px;
      display: flex;
      align-items: center;
      gap: 10px
    }

    .text {
      width: 150px;
    }

  `;

  render() {
    const whiteKeys = [];
    const blackKeys = [];

    const heightBlackKey = this.blackToWhiteKeyRatio * this._height; 
    const widthWhiteKey = this._width/(this.nOctave*7)
    const widthBlackKey = this.blackToWhiteKeyRatio * widthWhiteKey; 
    let keyPosition = 0; 
    
    // populate arrays with white and black key html elements
    for (let i = 0; i < this.nOctave*12; i++) {
      const isWhite = whiteNotes.includes(i%12);
      if (isWhite) {
        whiteKeys.push(html`
          <div
            id="keyboard-key-${i}"
            class="key white"
            style="
              left: ${keyPosition * widthWhiteKey}px;
              width: ${widthWhiteKey}px;
              height: ${this._height}px;
            "
            .value=${i}
            @mousedown="${this._onMouseDown}"
            @mouseup="${this._onMouseUp}"
            @mouseout="${this._onMouseUp}"
          ></div>
        `)
      } else {
        //add 0.15 to position for centering black key
        blackKeys.push(html`
          <div
            id="keyboard-key-${i}"
            class="key black"
            style="
              left: ${(keyPosition + 0.15) * widthWhiteKey}px; 
              width: ${widthBlackKey}px;
              height: ${heightBlackKey}px;
            "
            .value=${i}
            @mousedown="${this._onMouseDown}"
            @mouseup="${this._onMouseUp}"
            @mouseout="${this._onMouseUp}"
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
        <div class="text">number of octaves</div>
        <number-box
          value="${this.nOctave}"
          min="0"
          max="8"
          integer="true"
          @change="${e => this.nOctave = e.detail.value}"
        ></number-box>
      </div>
      <div class="params">  
        <div class="text">first octave</div>
        <number-box
          value="${this.firstOctave}"
          min="0"
          max="8"
          integer="true"
          @change="${e => this.firstOctave = e.detail.value}"
        ></number-box>
      </div>
      <div class="params">
        <div class="text">fixed velocity</div>
        <toggle-box
          .active="${this.fixedVelocity}"
          @change="${e => this.fixedVelocity = e.detail.value}"
        ></toggle-box>
        <number-box
          value="${this.velocity}"
          min="0"
          max="8"
          integer="true"
          @change="${e => this.velocity = e.detail.value}"
        ></number-box>
      </div>
    `
  }

  // We only send midi information up to the layout which is in charge of
  // actually communicating with rnbo
  playNote(midiNote, velocity) {
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
  }

  releaseNote(midiNote, velocity) {
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
  }

  _onMouseDown(e) {
    // compute midi note number and velocity based on height of the click like in max/msp
    const midiNote = 24 + (this.firstOctave - 1) * 12 + e.target.value;
    const isWhiteKey = whiteNotes.includes(e.target.value % 12);
    let velocity;
    if (this.fixedVelocity) {
      velocity = this.velocity;
    } else {
      if (isWhiteKey) {
        velocity = 127 - 127 / (this._height + 2) * e.layerY;
      } else {
        velocity = 127 - 127 / (this.blackToWhiteKeyRatio * this._height + 2) * e.layerY;
      }
    }

    //add active class to change color of active key
    e.target.classList.add("active");
    
    this.playNote(midiNote, velocity);
  }

  _onMouseUp(e) {
    const midiNote = 24 + (this.firstOctave - 1) * 12 + e.target.value;
    const velocity = 0;

    e.target.classList.remove("active");

    this.releaseNote(midiNote, velocity);
  }

  _onKeyDown(e) {
    if (e.repeat) {return}
    if (Object.hasOwn(keyboardToNote, e.key)) {
      const midiNote = 24 + (this.firstOctave - 1) * 12 + keyboardToNote[e.key];

      const $keyRect = this.renderRoot.getElementById(`keyboard-key-${keyboardToNote[e.key]}`);
      $keyRect.classList.add("active");

      this.playNote(midiNote, 100);
    }
  }

  _onKeyUp(e) {
    if (Object.hasOwn(keyboardToNote, e.key)) {
      const midiNote = 24 + (this.firstOctave - 1) * 12 + keyboardToNote[e.key];

      const $keyRect = this.renderRoot.getElementById(`keyboard-key-${keyboardToNote[e.key]}`);
      $keyRect.classList.remove("active");

      this.releaseNote(midiNote, 0);
    }
  }
}

customElements.define('midi-keyboard', MidiKeyboard);