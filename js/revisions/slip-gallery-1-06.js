(function($){

    var defaults = {
        mainChildSelector: '>*',
        thumbsContainerSelector: '',
        thumbsContainerWidth:'auto', //need to be able to specify container width. if 'auto' then use its current width.
        thumbsContainerHeight:'auto',
        thumbsChildSelector: '>*',
        thumbsWidth:'auto', //need to be able to specify thumb width. if 'auto' then use its current/calculated width.
        thumbsHeight:'auto',
        thumbsSpace:0, //need to be able to specify spacing size.
        thumbsShown:5, //need to use this to calculate, must be set to a positive integer
        thumbsOrientation:'horizontal',
        mainRatio:'auto',
        thumbsRatio:'auto',
        prevSelector:'',
        nextSelector:'',
        fx:'none',
        fxSpeed:400,
        autoLoop:true,
        delay:3000,
        preload:true //true/false or integer for number of images
    };

    $.fn.SlipGallery = function(options)
    {
        //"this" should be the main _sliders
        var settings = $.extend({},defaults,options);
        process(this,settings);
    };

    function outerHTML(obj)
    {
        return $('<div />').append($(obj).eq(0).clone()).html();
    }

    function getAttr(obj,attr)
    {
        var attrval = obj.attr(attr);
        if (typeof attrval === 'undefined' || attrval === false || attrval === '') attrval = '';
        return attrval;
    }

    function setAttr(obj,attr,val)
    {
        obj.attr(attr,val);
    }

    function roundDimension(d)
    {
        d = d || 0;
        return Math.floor(d*2)/2;
    }

    function load(controllers,settings)
    {
        if (controllers._load_sliderChildren && controllers._load_sliderChildren.length && (settings.preload === true || settings.preload > 0))
        {
            var _load_sliderChildren = controllers._load_sliderChildren;
            var _load_thumbsChildren = controllers._load_thumbsChildren;

            if (settings.preload !== true && settings.preload > 0)
            {
                _load_sliderChildren.slice(0,settings.preload);
            }

            var images = _load_sliderChildren.find('img');

            _load_sliderChildren.each(function(){
                var _child = $(this);
                if (getAttr(_child,'src'))
                {
                    images.add(_child);
                }
                else
                {
                    images.add(_child.find('img'));
                }
            });

            if (controllers._load_thumbsChildren && controllers._load_thumbsChildren.length)
            {
                if (settings.preload !== true && settings.preload > 0)
                {
                    _load_thumbsChildren.slice(0,settings.preload);
                }

                _load_thumbsChildren.each(function(){
                    var _child = $(this);
                    if (getAttr(_child,'src'))
                    {
                        images.add(_child);
                    }
                    else
                    {
                        images.add(_child.find('img'));
                    }
                });
            }

            var built = false;
            var imagesloaded = 0;

            if (images.length)
            {
                images.each(function(){
                    if (!built)
                    {
                        var _img = $(this);
                        var nimg = new Image();
                        var src = getAttr(_img,'src');
                        if (src)
                        {
                            nimg.src = src;
                            setTimeout(function(){
                                if (nimg.complete)
                                {
                                    imagesloaded++;
                                    if (imagesloaded == images.length)
                                    {
                                        build(controllers,settings);
                                        built = true;
                                    }
                                }
                                else
                                {
                                    nimg.onload = function()
                                    {
                                        imagesloaded++;
                                        if (imagesloaded == images.length)
                                        {
                                            build(controllers,settings);
                                            built = true;
                                        }
                                    };
                                }
                            },1);
                        }
                    }
                });
            }
            else
            {
                build(controllers,settings);
                built = true;
            }
        }
    }

    function dataOverride(_sliders,settings)
    {
        for (var i in defaults)
        {
            if (defaults.hasOwnProperty(i))
            {
                var attr = getAttr(_sliders,'data-'+i);
                if (attr)
                {
                    settings[i] = attr;
                }
            }
        }
    }

    function build(controllers,settings)
    {
        if (controllers._sliderContainer && controllers._sliderContainer.length)
        {
            var _sliderContainer = controllers._sliderContainer;
            var _sliderChildren = _sliderContainer.find(settings.mainChildSelector);
            var _thumbsContainer = controllers._thumbsContainer;
            var _thumbsWrap = false;
            var _thumbsChildren = false;
            var _prevBtn = false;
            var _nextBtn = false;
            var thumbsReady = false;

            _sliderContainer.addClass('slip-gallery-container');

            if (_sliderChildren.length > 0)
            {
                if (_thumbsContainer && _thumbsContainer.length > 0)
                {
                    _thumbsContainer.addClass('slip-gallery-thumbs-container');

                    _thumbsContainer.wrapInner('<div class="slip-gallery-thumbs-wrap"></div>');
                    _thumbsWrap = _thumbsContainer.find('.slip-gallery-thumbs-wrap');

                    if (_thumbsWrap.length > 0)
                    {
                        _thumbsChildren = _thumbsWrap.find(settings.thumbsChildSelector);

                        if (_thumbsChildren.length > 0)
                        {
                            _thumbsChildren.addClass('slip-gallery-thumbs-slide');
                            thumbsReady = true;
                        }
                    }
                }

                // _thumbsContainer, _thumbsWrap, _thumbsChildren
                if (thumbsReady)
                {
                    //APPLY CSS
                    _thumbsContainer.css({
                        'display':'block',
                        'position':'relative',
                        'overflow':'hidden'
                    });
                    _thumbsWrap.css({
                        'display':'block',
                        'position':'absolute',
                        'top':'0px',
                        'left':'0px',
                        'width':'9999px'
                    });
                    _thumbsChildren.css({
                        'float':'left',
                        'cursor':'pointer',
                        'display':'block'
                    });

                    _thumbsChildren.eq(0).addClass('slip-gallery-thumbs-slide-active');
                }

                //start sliding and apply listeners
                // _sliderContainer, _sliderChildren, _thumbsContainer, _thumbsWrap, _thumbsChildren

                if (thumbsReady == false || (_sliderChildren.length == _thumbsChildren.length))
                {

                    _sliderContainer.css({
                        'position':'relative',
                        'display':'block',
                        'overflow':'hidden'
                    });

                    var _firstSlide = false;

                    _sliderChildren.each(function(i){

                        var _sliderChild = $(this);

                        _sliderChild.css({
                            'left':'0px',
                            'top':'0px',
                            'width':'100%',
                            'height':'100%',
                            'display':'block',
                            'position':'absolute'
                        });

                        if (i == 0)
                        {
                            _firstSlide = _sliderChild;
                            _sliderChild.show().css({
                                'z-index':'2'
                            }).addClass('slip-gallery-slide-active');
                        }
                        else
                        {
                            _sliderChild.hide().css({
                                'z-index':'1'
                            });
                        }

                        _sliderChild.addClass('slip-gallery-slide');
                    });

                    var _sentinelSlide = $(outerHTML(_firstSlide));
                    _sliderContainer.prepend(_sentinelSlide);

                    _sentinelSlide.css({
                        'visibility':'hidden',
                        'display':'block',
                        'position':'static',
                        'z-index':'0',
                        'left':'',
                        'top':'',
                        'height':'auto'
                    }).removeClass('slip-gallery-slide slip-gallery-slide-active').addClass('slip-gallery-sentinel');

                    if (settings.prevSelector)
                    {
                        _prevBtn = $(settings.prevSelector);
                        _prevBtn.css({
                            'cursor':'pointer'
                        });
                    }
                    if (settings.nextSelector)
                    {
                        _nextBtn = $(settings.nextSelector);
                        _nextBtn.css({
                            'cursor':'pointer'
                        });
                    }

                    controllers._sliderChildren = _sliderChildren;
                    controllers._thumbsWrap = _thumbsWrap;
                    controllers._thumbsChildren = _thumbsChildren;
                    controllers._sentinelSlide = _sentinelSlide;
                    controllers._prevBtn = _prevBtn;
                    controllers._nextBtn = _nextBtn;

                    initScale(controllers,settings);
                    scrollThumbsTo(controllers,settings);
                    addListeners(controllers,settings);
                    autoLoop(controllers,settings);

                }
            }
        }
    }

    function process(_sliders,settings)
    {
        if (settings && _sliders && _sliders.length > 0)
        {
            dataOverride(_sliders,settings);

            _sliders.each(function(i){

                var controllers = {
                    _sliderContainer: $(this),
                    _sliderChildren: false,
                    _load_sliderChildren:false,
                    _thumbsContainer: false,
                    _thumbsWrap: false,
                    _thumbsChildren: false,
                    _load_thumbsChildren: false,
                    _sentinelSlide: false,
                    _prevBtn: false,
                    _nextBtn: false,
                    newSlideIndex: false,
                    curSlideIndex: false,
                    timer:false
                };

                var _load_sliderChildren = false;
                var _thumbsContainer = false;
                var _load_thumbsChildren = false;

                if (settings.mainChildSelector)
                {
                    _load_sliderChildren = controllers._sliderContainer.find(settings.mainChildSelector);

                    if (_load_sliderChildren.length > 0)
                    {
                        //thumbnails - thumbsContainerSelector, thumbsChildSelector are required
                        if (settings.thumbsContainerSelector && settings.thumbsChildSelector)
                        {
                            //BUILD STRUCTURE
                            _thumbsContainer = $(settings.thumbsContainerSelector);

                            if (_thumbsContainer.length)
                            {
                                _load_thumbsChildren = _thumbsContainer.find(settings.thumbsChildSelector);

                                if (_load_thumbsChildren.length != _load_sliderChildren.length)
                                {
                                    _thumbsContainer = false;
                                    _load_thumbsChildren = false;
                                }
                            }
                        }
                    }
                }

                controllers._load_sliderChildren = _load_sliderChildren;
                controllers._thumbsContainer = _thumbsContainer;
                controllers._load_thumbsChildren = _load_thumbsChildren;

                load(controllers,settings);
            });
        }
    }

    function initScale(controllers,settings)
    {
        scaleContainers(controllers,settings);
        scaleSlides(controllers,settings);
        scaleThumbs(controllers,settings);
        scaleContainers(controllers,settings);
    }

    function getRatio(str)
    {
        str = str || false;

        if (typeof str == "string" && str.match(/^[0-9]+x[0-9]+$/))
        {
            var a = str.split('x',2);

            return {
                width: parseFloat(a[0]),
                height: parseFloat(a[1])
            };
        }
        return false;
    }

    function scaleContainers(controllers,settings)
    {
        var mainRatio = getRatio(settings.mainRatio);
        if (mainRatio)
        {
            var newContainerHeight = controllers._sliderContainer.width()*(mainRatio.height/mainRatio.width);
            controllers._sliderContainer.height(newContainerHeight);
        }

        if (controllers._thumbsContainer && controllers._thumbsChildren)
        {
            var thumbsOrientation = (controllers.thumbsOrientation == 'vertical') ? 'vertical' : 'horizontal';

            controllers._thumbsContainer.css({'width':'','height':''});

            var newWrapWidth = 0;
            var newWrapHeight = 0;
            var newTContainerWidth = controllers._thumbsContainer.width();
            var newTContainerHeight = controllers._thumbsContainer.height();

            if (thumbsOrientation == 'vertical')
            {
                controllers._thumbsChildren.each(function(){
                    var $this = $(this);
                    var thisWidth = $this.outerWidth(true);
                    newWrapHeight += $this.outerHeight(true);
                    if (thisWidth > newWrapWidth) newWrapWidth = thisWidth;
                    newTContainerWidth = newWrapWidth;
                });
            }
            else
            {
                controllers._thumbsChildren.each(function(){
                    var $this = $(this);
                    var thisHeight = $this.outerHeight(true);
                    newWrapWidth += $this.outerWidth(true);
                    if (thisHeight > newWrapHeight) newWrapHeight = thisHeight;
                    newTContainerHeight = newWrapHeight;
                });
            }

            if (settings.thumbsContainerWidth > 0) controllers._thumbsContainer.width(settings.thumbsContainerWidth);
            else controllers._thumbsContainer.width(newTContainerWidth);

            if (settings.thumbsContainerHeight > 0) controllers._thumbsContainer.height(settings.thumbsContainerHeight);
            else controllers._thumbsContainer.height(newTContainerHeight);

            controllers._thumbsWrap.width(newWrapWidth+5);
            controllers._thumbsWrap.height(newWrapHeight+5);
            controllers._thumbsWrap.css('position','relative');
        }
    }

    function scaleSlides(controllers,settings)
    {
        var mainRatio = getRatio(settings.mainRatio);

        var newwidth = controllers._sliderContainer.width();
        var newheight = controllers._sliderContainer.height();

        if (mainRatio)
        {
            var widthdiff = mainRatio.width/newwidth;
            var heightdiff = mainRatio.height/newheight;

            if (widthdiff >= heightdiff)
            {
                newwidth = controllers._sliderContainer.height()*(mainRatio.width/mainRatio.height);
            }
            else
            {
                newheight = controllers._sliderContainer.width() * (mainRatio.height / mainRatio.width);
            }
        }

        controllers._sliderChildren.width(newwidth);
        controllers._sliderChildren.height(newheight);
    }

    function scaleThumbs(controllers,settings)
    {
        if (controllers._thumbsChildren && settings.thumbsShown >= 1)
        {
            var dimension = (controllers.thumbsOrientation == 'vertical') ? 'Height' : 'Width';
            var p = {
                thumbsContainerWidth:(settings.thumbsContainerWidth > 0) ? settings.thumbsContainerWidth : controllers._thumbsContainer.width(),
                thumbsContainerHeight:(settings.thumbsContainerHeight > 0) ? settings.thumbsContainerHeight : controllers._thumbsContainer.height(),
                thumbsWidth:0,
                thumbsHeight:0,
                thumbsSpace:0
            };
            var thumbsRatio = getRatio(settings.thumbsRatio);

            if (typeof settings.thumbsSpace == 'string' || settings.thumbsSpace instanceof String)
            {
                if (settings.thumbsSpace.match(/^[0-9]{1,3}(\.[0-9]+)?%$/))
                {
                    p.thumbsSpace = p['thumbsContainer'+dimension]*(parseFloat(settings.thumbsSpace)/100);
                }
                else if (settings.thumbsSpace.match(/^[0-9]+(\.[0-9]+)?px$/))
                {
                    p.thumbsSpace = parseFloat(settings.thumbsSpace);
                }
            }
            else if ((typeof settings.thumbsSpace == 'number' || settings.thumbsSpace instanceof Number) && settings.thumbsSpace > 0)
            {
                p.thumbsSpace = settings.thumbsSpace;
            }
            else if (typeof settings['thumbs'+dimension] == 'string' || settings['thumbs'+dimension] instanceof String)
            {
                if (settings['thumbs'+dimension].match(/^[0-9]{1,3}(\.[0-9]+)?%$/))
                {
                    p['thumbs'+dimension] = p['thumbsContainer'+dimension]*(parseFloat(settings['thumbs'+dimension])/100);
                }
                else if (settings['thumbs'+dimension].match(/^[0-9]+(\.[0-9]+)?px$/))
                {
                    p['thumbs'+dimension] = parseFloat(settings['thumbs'+dimension]);
                }
            }
            else if ((typeof settings['thumbs'+dimension] == 'number' || settings['thumbs'+dimension] instanceof Number) && settings['thumbs'+dimension] > 0)
            {
                p['thumbs'+dimension] = settings['thumbs'+dimension];
            }

            if (settings.thumbsShown > 1)
            {
                if (p.thumbsSpace > 0) p['thumbs'+dimension] = (p['thumbsContainer'+dimension]-(p.thumbsSpace*(settings.thumbsShown-1)))/settings.thumbsShown;
                else if (p['thumbs'+dimension] > 0) p.thumbsSpace = (p['thumbsContainer'+dimension]-(p['thumbs'+dimension]*settings.thumbsShown))/(settings.thumbsShown-1);
            }

            if (p['thumbs'+dimension] == 0)
            {
                p['thumbs'+dimension] = p['thumbsContainer'+dimension] / settings.thumbsShown;
            }

            if (controllers.thumbsOrientation == 'vertical')
            {
                controllers._thumbsChildren.each(function(){
                    var $this = $(this);
                    var pad = $this.outerHeight(false)-$this.height();
                    $this.height(p.thumbsHeight-pad).css('margin-bottom', p.thumbsSpace+'px');
                });
            }
            else
            {
                controllers._thumbsChildren.each(function(){
                    var $this = $(this);
                    var pad = $this.outerWidth(false)-$this.width();
                    $this.width(p.thumbsWidth-pad).css('margin-right', p.thumbsSpace+'px');
                    if (thumbsRatio) $this.height((p.thumbsWidth-pad)*(thumbsRatio.height/thumbsRatio.width));
                });
            }
        }
    }

    function resetSlides(controllers,settings)
    {
        if (controllers._sliderChildren)
        {
            //remove active class
            controllers._sliderChildren
                .stop(true,true)
                .removeClass('slip-gallery-slide-active')
                .css('z-index','1');

            //add active class to 0
            controllers._sliderChildren.eq(0)
                .stop(true,true)
                .addClass('slip-gallery-slide-active')
                .css('z-index','2');

            controllers._sliderChildren.hide();
            controllers._sliderChildren.eq(0).show();

            if (controllers._thumbsContainer && controllers._thumbsWrap && controllers._thumbsChildren)
            {
                controllers._thumbsWrap
                    .stop(true,true)
                    .css('left','0px');

                controllers._thumbsChildren
                    .removeClass('slip-gallery-thumbs-slide-active');

                controllers._thumbsChildren.eq(0)
                    .addClass('slip-gallery-thumbs-slide-active');

            }
        }
        resetTimer(controllers,settings);
    }

    function addListeners(controllers,settings)
    {
        controllers = controllers || {};
        settings = settings || {};

        if (controllers._thumbsChildren)
        {
            controllers._thumbsChildren.each(function(i){
                $(this).click(function(e){
                    e.preventDefault();
                    controllers.newSlideIndex = i;
                    changeSlide(controllers,settings);
                });
            });
        }

        if (controllers._prevBtn)
        {
            controllers._prevBtn.click(function(e){
                e.preventDefault();
                prevSlide(controllers,settings);
            });
        }
        if (controllers._nextBtn)
        {
            controllers._nextBtn.click(function(e){
                e.preventDefault();
                nextSlide(controllers,settings);
            });
        }

        controllers.resizeCheck = false;
        $(window).resize(function(){
            if (controllers.resizeCheck == false)
            {
                controllers.resizeCheck = true;
                setTimeout(function(){
                    scaleContainers(controllers,settings);
                    scaleSlides(controllers,settings);
                    scaleThumbs(controllers,settings);
                    scaleContainers(controllers,settings);

                    resetSlides(controllers,settings);
                    controllers.resizeCheck = false;
                },100);
            }
        });
    }

    function getCurrentSlideIndex(controllers,settings)
    {
        controllers = controllers || {};
        settings = settings || {};

        var f = 0;

        if (controllers._sliderChildren)
        {
            controllers._sliderChildren.each(function(i){
                var _sliderChild = $(this);
                if (_sliderChild.hasClass('slip-gallery-slide-active'))
                {
                    f = i;
                }
            });
        }

        return f;
    }

    function scrollThumbsTo(controllers,settings)
    {
        controllers = controllers || {};
        settings = settings || {};

        if (controllers.newSlideIndex >= 0 && controllers.curSlideIndex >= 0 && controllers._thumbsContainer && controllers._thumbsWrap && controllers._thumbsChildren)
        {
            controllers._thumbsChildren.eq(controllers.curSlideIndex).removeClass('slip-gallery-thumbs-slide-active');
            controllers._thumbsChildren.eq(controllers.newSlideIndex).addClass('slip-gallery-thumbs-slide-active');

            var thumbsChildrenWidth = controllers._thumbsChildren.eq(0).outerWidth(false);
            var thumbsContainerTWidth = controllers._thumbsContainer.width();
            var thumbsShown = (settings.thumbsShown >= 1) ? settings.thumbsShown : Math.ceil(thumbsContainerTWidth / thumbsChildrenWidth);

            if (controllers._thumbsChildren.length > thumbsShown)
            {
                if (controllers._thumbsChildren.length - thumbsShown > 0)
                {
                    var _newThumb = controllers._thumbsChildren.eq(controllers.newSlideIndex);
                    var _lastThumb = controllers._thumbsChildren.eq(controllers._thumbsChildren.length-1);

                    var curLeft = Math.abs(controllers._thumbsWrap.position().left);
                    var newLeft = _newThumb.position().left-((thumbsContainerTWidth/2)-(_newThumb.outerWidth(false)/2));
                    var maxLeft = (_lastThumb.position().left+_lastThumb.outerWidth(false))-(thumbsContainerTWidth);

                    var last_x_i =  controllers._thumbsChildren.length-thumbsShown;
                    if (last_x_i >= 0)
                    {
                        var last_x_pos = controllers._thumbsChildren.eq(last_x_i).position().left;
                        if (maxLeft > last_x_pos-1 && maxLeft < last_x_pos+1)
                        {
                            maxLeft = last_x_pos;
                        }
                    }

                    var first_x_i =  controllers.newSlideIndex-Math.floor(thumbsShown/2);
                    if (first_x_i >= 0)
                    {
                        var first_x_pos = controllers._thumbsChildren.eq(first_x_i).position().left;
                        if (newLeft > first_x_pos-1 && newLeft < first_x_pos+1)
                        {
                            newLeft = first_x_pos;
                        }
                    }

                    if (newLeft < 1) newLeft = 0;
                    if (newLeft > maxLeft-1) newLeft = maxLeft;

                    var leftVal = '';

                    if (curLeft != newLeft)
                    {
                        leftVal = (-1*newLeft)+'px';
                    }

                    if (leftVal)
                    {
                        controllers._thumbsWrap.stop(true,false).animate({
                            'left':leftVal
                        },500);
                    }
                }
            }
        }
    }

    function changeSlide(controllers,settings)
    {
        controllers = controllers || {};
        settings = settings || {};

        controllers.curSlideIndex = getCurrentSlideIndex(controllers,settings);

        if (controllers.newSlideIndex >= 0 && controllers.curSlideIndex >= 0 && controllers._sliderChildren)
        {
            if (controllers.newSlideIndex >= controllers._sliderChildren.length || controllers.newSlideIndex < 0 || controllers.newSlideIndex == controllers.curSlideIndex) return;

            var _newSlide = controllers._sliderChildren.eq(controllers.newSlideIndex);
            var _curSlide = controllers._sliderChildren.eq(controllers.curSlideIndex);
            var _lastSlide = controllers._sliderChildren.eq(controllers._sliderChildren.length-1);

            _newSlide.css({
                'z-index':'2'
            }).stop(true,true);
            _curSlide.css({
                'z-index':'1'
            }).stop(true,true);

            switch (settings.fx)
            {
                case 'fade':
                    _curSlide.show().fadeOut(settings.fxSpeed);
                    _newSlide.hide().fadeIn(settings.fxSpeed);
                    break;
                case 'hrzSlide':

                    break;
                case 'vrtSlide':

                    break;
                default:
                    _newSlide.show();
                    _curSlide.hide();
                    break;
            }

            _newSlide.addClass('slip-gallery-slide-active');
            _curSlide.removeClass('slip-gallery-slide-active');

            if (controllers._thumbsContainer && controllers._thumbsChildren && controllers._thumbsWrap)
            {
                scrollThumbsTo(controllers,settings);
            }
        }

        controllers.newSlideIndex = false;
        controllers.curSlideIndex = false;
        resetTimer(controllers,settings);
    }

    function nextSlide(controllers,settings)
    {
        controllers = controllers || {};
        settings = settings || {};

        if (controllers._sliderChildren)
        {
            var curSlideIndex = getCurrentSlideIndex(controllers,settings);
            var newSlideIndex = curSlideIndex+1;

            if (newSlideIndex >= controllers._sliderChildren.length)
            {
                newSlideIndex = 0;
            }

            controllers.curSlideIndex = curSlideIndex;
            controllers.newSlideIndex = newSlideIndex;
            changeSlide(controllers,settings);
        }
    }

    function prevSlide(controllers,settings)
    {
        controllers = controllers || {};
        settings = settings || {};

        if (controllers._sliderChildren)
        {
            var curSlideIndex = getCurrentSlideIndex(controllers,settings);
            var newSlideIndex = curSlideIndex-1;

            if (newSlideIndex < 0)
            {
                newSlideIndex = controllers._sliderChildren.length-1;
            }

            controllers.curSlideIndex = curSlideIndex;
            controllers.newSlideIndex = newSlideIndex;
            changeSlide(controllers,settings);
        }
    }

    function setTimer(controllers,settings)
    {
        controllers = controllers || {};
        settings = settings || {};

        if (settings.autoLoop)
        {
            controllers.timer = setTimeout(function(){nextSlide(controllers,settings);},settings.delay);
        }
    }

    function resetTimer(controllers,settings)
    {
        controllers = controllers || {};
        settings = settings || {};

        if (settings.autoLoop)
        {
            if (controllers.timer)
            {
                clearTimeout(controllers.timer);
            }
            setTimer(controllers,settings);
        }
    }

    function autoLoop(controllers,settings)
    {
        controllers = controllers || {};
        settings = settings || {};

        setTimer(controllers,settings);
    }

    function autoSelect(_sliders)
    {
        var settings = $.extend({},defaults);
        process(_sliders,settings);
    }

    autoSelect($('.slip-gallery'));

})(jQuery);