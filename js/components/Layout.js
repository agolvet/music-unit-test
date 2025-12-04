import { LitElement, html, css } from 'lit';
import "./MidiKeyboard.js"
import "./NumberBox.js"
import "./Slider.js"

class Layout extends LitElement {
  constructor() {
    super();

    this.device = null;
    this.params = null;
  }

  render() {
    return html`
      <p>hello</p>
      <midi-keyboard id="midi-keyboard"></midi-keyboard>
      <my-slider 
          min="0"
          max="1"
          value="0.2"
      ></my-slider>
    `
  }

}

customElements.define('my-layout', Layout);