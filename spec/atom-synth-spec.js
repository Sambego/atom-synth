'use babel';

import AtomSynth from '../lib/atom-synth';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('AtomSynth', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('atom-synth');
  });

  describe('when the atom-synth:toggle event is triggered', () => {
    it('hides and shows the modal panel', () => {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.atom-synth')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'atom-synth:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        expect(workspaceElement.querySelector('.atom-synth')).toExist();

        let atomSynthElement = workspaceElement.querySelector('.atom-synth');
        expect(atomSynthElement).toExist();

        let atomSynthPanel = atom.workspace.panelForItem(atomSynthElement);
        expect(atomSynthPanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'atom-synth:toggle');
        expect(atomSynthPanel.isVisible()).toBe(false);
      });
    });

    it('hides and shows the view', () => {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.atom-synth')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'atom-synth:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        // Now we can test for view visibility
        let atomSynthElement = workspaceElement.querySelector('.atom-synth');
        expect(atomSynthElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'atom-synth:toggle');
        expect(atomSynthElement).not.toBeVisible();
      });
    });
  });
});
