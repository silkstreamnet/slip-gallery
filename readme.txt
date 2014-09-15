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
    thumbsWidth:'auto'              // Set to 'auto' for flexibility. Accepts an integer, percentage as a string, px as a string.
    thumbsHeight:'auto'             // Recommended to leave default. (untested/unfinished)
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

Short term:
- Need to add an option to set how many images should be preloaded. Would need to separate thumbs and slides to make sure both get preloaded by the total count. e.g. "3" would load 3 slides and 3 thumbs.
- Add a "thumbsSpace" option which will accept % and px. e.g. ('5%','5px',5) - go hand in hand with thumbsWidth

Long term:
- Add support for vertical thumbs


@@@@@@@@
Versions
@@@@@@@@

Stable:
- None

Unstable:
- 1-03
- 1-02
- 1-01
- 1-00