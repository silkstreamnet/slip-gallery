slip-gallery.js

@@@@@@@@@@
How To Use
@@@@@@@@@@

### Options ###
    mainChildSelector: '>*'         // Define the jQuery selector for the your main gallery children elements/slides.
    thumbsContainerSelector: ''     // Define the jQuery selector for the your thumbs container.
    thumbsContainerWidth:'auto'     // Recommended to leave default. (untested/unfinished)
    thumbsContainerHeight:'auto'    // Recommended to leave default. (untested/unfinished)
    thumbsChildSelector: '>*'       // Define the jQuery selector for the your thumb children elements/slides.
    thumbsWidth:'auto'              // Set to 'auto' for flexibility. Set to an integer if you require each thumb to have a set width.
    thumbsHeight:'auto'             // Recommended to leave default. (untested/unfinished)
    thumbsChildSpaceSelector:''     // Recommended to leave default. (untested/unfinished)
    thumbsSpaceWidth:'auto'         // Recommended to leave default. (untested/unfinished)
    thumbsSpaceHeight:'auto'        // Recommended to leave default. (untested/unfinished)
    thumbsShown:5                   // This must be set to a positive integer.
    fixHeight:true                  // Recommended to leave default. (untested/unfinished)
    fixWidth:false                  // Recommended to leave default. (untested/unfinished)
    prevSelector:''                 // Define the jQuery selector for the your Previous Slide button.
    nextSelector:''                 // Define the jQuery selector for the your Next Slide button.
    fade:false                      // Set to true to enable fade effect otherwise false for immediate change (this may change to fx in the future)
    autoLoop:true                   // Set to true to loop through the slides automatically otherwise false to disable auto looping
    delay:3000                      // Set the delay for auto looping

View index.html for example code.


@@@@@@@@@@@@@
Things to Add
@@@@@@@@@@@@@

No image preload check in place yet (need to place one on the first image in the thumbs and first image in the gallery)
Add a "spacing" option which will accept % and px. e.g. ('5%','5px',5)


@@@@@@@@
Versions
@@@@@@@@

Stable:
- None

Unstable:
- 1-01
- 1-00