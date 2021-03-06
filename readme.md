# Demo for Nativescript Issue workaround

Original Issue: https://github.com/ProgressNS/nativescript-ui-feedback/issues/730

## Before
![Demo Before](./docs/demo-before-optimized.gif)
- Note that when the keyboard is open I am unable to scroll.

## After
![Demo After](./docs/demo-after-optimized.gif)

## Summary
The problem here appears to be that the native options are not ideal for the layouts used in nativescript given a particular layout. This usually leads to workarounds that are not ideal for every situation (changing to adjustResize/etc.).

In my situation I would like:
- The keyboard opening not to cause the screen to "jump"
- The full screen area to be accessible to the user when the keyboard is open.

If this is not the same as your situation you may find a more suitable workaround on the issue linked above.

## Idea
Similar to overlaying auto-hiding AppBars in web, when the screen content is overlaid, extend the content size by the size of the overlaying content so that the scroll space allows us to scroll the full body content of the page.

This should allow the Android keyboard to work similarly to the nativescript-iqkeyboardmanager plugin.

## Running the demo
```bash
npm i
ns platform add android && ns prepare android
ns run android --device "Your device or AVD ID"
```

## Implementation
I've left two stale branches open here:
- `demo/issue`: Just enough code to demo the issue
- `demo/fix`: Just enough code to demo the fix

Note, the only difference not shown between the two branches is that `@bigin/ns-soft-keyboard` needs to be added if it's not already.

## Caveats
1) The above premise works as-is but is based on page content that fits within the viewport height of the device.
  - If this were based on a long form that already causes scroll on the page I would modify the algorithm to first get the computed height of the body content, and use that instead of the screen height. The premise should still work with minor modifications.
2) nativescript-iqkeyboardmanager scrolls to the currently focussed field. I did not see this as important for my implementation so have not implemented it in any way yet. My assumption is we could use the ScrollView to manage scrolling to the position of the TextField if desired.
3) Implemented based on `@nativescript/template-drawer-navigation-ng`, I'm sure it could be adapted for other templates.
4) This demo assumes use of an actionbar, if not using an actionbar adjust to use `screenHeight` and don't remove the actionBar size from `scrollableAreaHeight`


