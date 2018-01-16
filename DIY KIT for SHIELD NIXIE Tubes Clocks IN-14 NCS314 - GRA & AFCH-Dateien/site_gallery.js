
(function ($) {
    "use strict";

    var body = $('body'),
            _window = $(window);

    var calculateGrid = function ($container) {
        var columns = parseInt($container.data('columns'));
        var gutterWidth = $container.data('gutterWidth');
        var containerWidth = $container.width();

        if (isNaN(gutterWidth)) {
            gutterWidth = 5;
        } else if (gutterWidth > 30 || gutterWidth < 0) {
            gutterWidth = 5;
        }
        
        if(parseInt(columns) < 2) columns = 2;
        gutterWidth = parseInt(gutterWidth);

        var allGutters = gutterWidth * (columns - 1);
        var contentWidth = containerWidth - allGutters;

        var columnWidth = Math.floor(contentWidth / columns);

        return {columnWidth: columnWidth, gutterWidth: gutterWidth, columns: columns};
    }

    var runMasonry = function (duration, $container) {
        var $postBox = $container.children('.wpmf-gallery-item');
        var o = calculateGrid($container);
        $postBox.css({'width': o.columnWidth - o.gutterWidth + 'px', 'margin-bottom': o.gutterWidth + 'px'});

        $container.masonry({
            itemSelector: '.wpmf-gallery-item',
            columnWidth: o.columnWidth - o.gutterWidth,
            gutter: o.gutterWidth,
            transitionDuration: duration,
            isFitWidth: true
        });

        if ($($container).hasClass('gallery-portfolio')) {
            var w = $($container).find('.attachment-thumbnail').width();
            $($container).find('.wpmf-caption-text.wpmf-gallery-caption , .gallery-icon').css('max-width', w + 'px');
        }
        $($container).css({'width': o.columns * o.columnWidth - o.gutterWidth + 'px', 'margin': '0px auto'});
    }

    var initGallery = function () {
        $('.gallery-masonry').each(function () {
            var $container = $(this);

            if ($container.is(':hidden')) {
                return;
            }

            if ($container.hasClass('masonry')) {
                return;
            }
            imagesLoaded($container, function () {
                runMasonry(0, $container);
                $container.css('visibility', 'visible');
            });
        });

        if (typeof wpmfggr != "undefined" && typeof wpmfggr.wpmf_lightbox_gallery != "undefined" && wpmfggr.wpmf_lightbox_gallery == 1) {
            if (jQuery().magnificPopup) {
                $('.gallery').each(function () {
                    var $this = $(this);
                    if ($this.hasClass('magnificpopup-is-active') || !$this.hasClass('gallery-link-file')) {
                        return;
                    }

                    if ($this.hasClass('gallery-portfolio')) {
                        $('.hover_img').on('click', function () {
                            if ($('.gallery-portfolio .gallery-icon a').hasClass('wpmf-lightbox')) {
                                $('.gallery-portfolio .gallery-icon a').removeClass('wpmf-lightbox');
                            }
                            if (!$('.hover_img').hasClass('wpmf-lightbox')) {
                                $('.hover_img').addClass('wpmf-lightbox');
                            }
                        });

                        $('.portfolio_lightbox').on('click', function () {
                            if ($('.gallery-portfolio .gallery-icon a').hasClass('wpmf-lightbox')) {
                                $('.gallery-portfolio .gallery-icon a').removeClass('wpmf-lightbox');
                            }
                            if (!$('.portfolio_lightbox').hasClass('wpmf-lightbox')) {
                                $('.portfolio_lightbox').addClass('wpmf-lightbox');
                            }
                        });

                        $this.magnificPopup({
                            delegate: '.gallery-icon > a.wpmf-lightbox[data-lightbox="1"]',
                            gallery: {
                                enabled: true,
                                tCounter: '<span class="wpmf_mfp-counter">%curr% / %total%</span>',
                                arrowMarkup: '<button title="%title%" type="button" class="zmdi zmdi-chevron-%dir%"></button>', // markup of an arrow button
                            },
                            type: 'image',
                            showCloseBtn: false,
                            image: {
                                titleSrc: 'title'
                            },
                        });
                    } else {
                        $this.magnificPopup({
                            delegate: '.gallery-icon > a[data-lightbox="1"]',
                            gallery: {
                                enabled: true,
                                tCounter: '<span class="wpmf_mfp-counter">%curr% / %total%</span>',
                                arrowMarkup: '<button title="%title%" type="button" class="zmdi zmdi-chevron-%dir%"></button>', // markup of an arrow button
                            },
                            type: 'image',
                            showCloseBtn: false,
                            image: {
                                titleSrc: 'title'
                            },
                            zoom: {
                                enabled: true,
                                duration: 300,
                                easing: 'ease-in-out'
                            }
                        });
                    }

                    $this.addClass('magnificpopup-is-active');
                });
            }
        }

        $(window).load(function () {
            $('.flex-viewport').each(function () {
                var first_image_height = $(this).find('ul.slides li:first-child img').css('height');
                $(this).css('height', '10px !important');
            })
        });

        if (jQuery().flexslider) {

            $('.icon-chevron-right').on('click', function () {
                $(this).parent().find('.flex-next').click();
            });

            $('.icon-chevron-left').on('click', function () {
                $(this).parent().find('.flex-prev').click();
            });

            $('.flexslider').each(function () {
                var $this = $(this);
                var id = $(this).data('id');
                if ($this.is(':hidden')) {
                    return;
                }

                if ($this.hasClass('flexslider-is-active')) {
                    return;
                }
                var columns = parseInt($this.data('columns'));
                var columns_width = ($this.width() - ((columns - 1) * 5)) / columns;
                var columns_height = $('#' + id + ' li.wpmf-gallery-item').height();

                if (wpmfggr.slider_animation == 'slide') {
                    $this.addClass('wpmfslide');
                    if (columns > 1) {
                        $('#' + id + ' .wpmf-gallery-item .gallery-icon img').each(function () {
                            var w = $(this).width();
                            var h = columns_width / $(this).data('ratio');
                            $(this).css({'position': 'absolute', 'left': '-' + (w - columns_width) / 2 + 'px', 'top': '-' + (h - columns_height) / 2 + 'px', 'min-width': columns_width + 'px'});
                        });
                    }
                } else {
                    $this.addClass('wpmffade');
                }

                $this.addClass('flexslider-is-active');
                if (columns > 1) {
                    $('#' + id + '').flexslider({
                        animation: wpmfggr.slider_animation,
                        animationLoop: true,
                        smoothHeight: (wpmfggr.slider_animation == 'fade') ? true : false,
                        itemWidth: (wpmfggr.slider_animation == 'fade') ? 0 : columns_width,
                        itemMargin: 5,
                        pauseOnHover: true,
                        slideshowSpeed: 5000,
                        prevText: "",
                        nextText: "",
                        start: function (slider) {
                            $('.entry-content').removeClass('loading');
                        }
                    });
                } else {
                    $('#' + id + '').flexslider({
                        animation: wpmfggr.slider_animation,
                        animationLoop: true,
                        smoothHeight: true,
                        itemMargin: 5,
                        pauseOnHover: true,
                        slideshowSpeed: 5000,
                        prevText: "",
                        nextText: "",
                        start: function (slider) {
                            $('.entry-content').removeClass('loading');
                        }
                    });
                }
            });
        }
    };

    $(document).ready(function () {
        if (wpmfggr.wpmf_current_theme == 'Gleam') {
            setTimeout(function () {
                initGallery();
            }, 1000);
        } else {
            initGallery();
        }
    });

    $(document.body).on('post-load', function () {
        initGallery();
    });

    $(document.body).on('wpmfs-toggled', function () {
        initGallery();
    });

})(jQuery);
