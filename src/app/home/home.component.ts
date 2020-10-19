import { Component, NgZone, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActionBar, alert, Application, isIOS, Page, Screen } from "@nativescript/core";
import { AppEvents } from '~/AppEvents';
import { Subscription } from 'rxjs';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

@Component({
    selector: "Home",
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit, OnDestroy {
    private keyboardHeightSubscription: Subscription;

    private _actionBar: ActionBar;

    @ViewChild('actionbar')
    set actionBar(er: any) {
        this._actionBar = er.element.nativeElement as ActionBar;
        this.updateActionBarHeight();
    }

    private actionBarHeight: any;
    screenHeight: number = null;
    screenHeightWithoutActionBarHeight: number = null;
    private keyboardHeight: number = 0;
    scrollableAreaHeight: number | string = 'auto';

    email: string = null;
    password: string = null;


    constructor(private zone: NgZone, private page: Page) {
        // page.actionBarHidden = true;
    }

    ngOnInit(): void {
        this.keyboardHeightSubscription = AppEvents.keyboardHeight.subscribe((height) => this.onKeyboardSizeChange(height));
    }

    ngOnDestroy() {
        if (this.keyboardHeightSubscription) this.keyboardHeightSubscription.unsubscribe();
    }

    onLogin() {
        alert('Cool, you logged in');
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>Application.getRootView();
        sideDrawer.showDrawer();
    }

    /**
     * We need to negate the action bar height from the content height
     * @private
     */
    private updateActionBarHeight() {
        // todo: the settimeout here isn't ideal, I don't use an action bar on any of my form pages at the moment so there's probably a better way around this.
        setTimeout(() => {
            const { height } = this._actionBar.getActualSize();

            this.actionBarHeight = height;
            // This is also just to kick things, it could be cleaner
            this.onKeyboardSizeChange(this.keyboardHeight);
        }, 1000);
    }

    /**
     * The event handler for keyboard height changes
     * @param height The height in DIPs of the keyboard.
     * @private
     */
    private onKeyboardSizeChange(height: number) {
        if (isIOS) return;

        // Important that this is in NgZone so that the view is updated
        this.zone.run(() => {
            this.screenHeight = Screen.mainScreen.heightDIPs;
            if (typeof this.actionBarHeight === 'number') {
                this.screenHeightWithoutActionBarHeight = this.screenHeight - this.actionBarHeight;
            } else {
                this.screenHeightWithoutActionBarHeight = this.screenHeight;
            }
            console.log(`Screen Height updated to ${this.screenHeight} DIPs`);
            console.log(`Screen without action bar updated to ${this.screenHeightWithoutActionBarHeight} DIPs`);

            if (height !== 0) {
                this.keyboardHeight = Math.ceil(height);
                console.log(`Keyboard Height updated to ${this.keyboardHeight} DIPs`);
            } else {
                this.keyboardHeight = 0;
            }

            if (typeof this.screenHeight !== 'number') return; // Don't try to add 100% and a number '100%0'

            this.scrollableAreaHeight = (this.screenHeightWithoutActionBarHeight as number) + this.keyboardHeight;
        });
    }
}
