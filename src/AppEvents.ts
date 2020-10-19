import { registerSoftKeyboardCallback } from '@bigin/ns-soft-keyboard';
import { BehaviorSubject } from 'rxjs';
import { isIOS } from '@nativescript/core';

/**
 * I like to use a static class to handle events and forward them to subscribers using RX.
 *
 * I've found that dropping the registerSoftKeyboardCallback into an ngOnInit seems to not pick up keyboard size changes.
 * It picks up if i drop it into main.ts, and this file is init()ed in main.ts (before bootstrap)
 */
export class AppEvents {
    static keyboardHeight = new BehaviorSubject<number>(0);

    static init() {
        console.log('Initializing App Event Listeners');
        this.listenToKeyboardSizeChanges();
    }

    private static listenToKeyboardSizeChanges() {
        if (isIOS) return; // Use nativescript-iqkeyboardmanager

        console.log('Registering soft keyboard callback');
        registerSoftKeyboardCallback((height) => {
            if (this.keyboardHeight.value !== height) {
                console.log('Keyboard size changed', height);
                this.keyboardHeight.next(height);
            }
        });
    }
}
