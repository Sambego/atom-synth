'use babel';

import AtomSynthView from './atom-synth-view';
import { CompositeDisposable } from 'atom';
import FrequencyCalculator from 'frequency-calculator';

export default {

  atomSynthView: null,
  subscriptions: null,
  active: false,
  audioContext: null,
  gain: null,
  oscillator: null,

  activate(state) {
    this.atomSynthView = new AtomSynthView(state.atomSynthViewState);

    // Events subscribed to in atom's systeam can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-synth:toggle': () => this.toggle()
    }));

    this.audioContext = new AudioContext();

    this.gain = this.audioContext.createGain();
    this.gain.gain.value = 0;

    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.type = 'square';
    this.oscillator.frequency.value = 400;
    this.oscillator.start();

    this.oscillator.connect(this.gain);
  },

  deactivate() {
    this.stopWatchingKeyboard();
    this.subscriptions.dispose();
    this.atomSynthView.destroy();
  },

  playSound(event) {
    const now = this.audioContext.currentTime;

    this.oscillator.frequency.value = FrequencyCalculator.calculateFrequencyByStep((event.keyCode - 72));

    this.gain.gain.cancelScheduledValues(now);
    this.gain.gain.setValueAtTime(this.gain.gain.value, now);
    this.gain.gain.linearRampToValueAtTime(1 , now);
  },

  stopSound() {
    const now = this.audioContext.currentTime;

    this.gain.gain.cancelScheduledValues(now);
    this.gain.gain.setValueAtTime(this.gain.gain.value, now);
    this.gain.gain.linearRampToValueAtTime(0 , now);
  },

  startWatchingKeyboard() {
    this.active = true;

    this.gain.connect(this.audioContext.destination);

    atom.views.getView(atom.workspace).addEventListener('keydown', ::this.playSound);
    atom.views.getView(atom.workspace).addEventListener('keyup', ::this.stopSound);
  },

  stopWatchingKeyboard() {
    this.active = false;

    this.gain.disconnect(this.audioContext.destination);

    atom.views.getView(atom.workspace).removeEventListener('keydown', this.playSound);
    atom.views.getView(atom.workspace).removeEventListener('keyup', this.stopSound);
  },

  serialize() {
    return {
      atomSynthViewState: this.atomSynthView.serialize()
    };
  },

  toggle() {
    return (
      this.active ?
      this.stopWatchingKeyboard() :
      this.startWatchingKeyboard()
    );
  }
};
