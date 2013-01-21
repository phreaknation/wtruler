/*
 * Webtools Ruler Plugin
 * http://
 *
 * Copyright 2012, Joel Dies
 * Author: Joel Dies
 * Version 0.0.1
 */

 /**
  * @fileOverview Ruler Plugin for Webtools
  * @author Joel T. Dies
  * @version: 0.0.1
  */
(function (jQuery) {
    var base = this; // To avoid scope issues, use 'base' instead of 'this' to reference this class from internal events and functions.
    var mouseoffset;
    var mousemove = false;
    var currentruler = 0;
    var numofrulers = 0;
    var methods = {
        /**
         * Base initialization method
         *
         * @memberOf jQuery.ruler
         */
        init : function (el, options, modes) {

            var defaults = {};
            options = jQuery.extend(defaults, options);
            var keys = Array();
            jQueryel = jQuery(el); // Access to jQuery version of element
            el = el; // Access to DOM version of element

            jQueryel.data("ruler", base); // Add a reverse reference to the DOM object
            
            var rulerstart = false
            
            $(document).click(function(e) {
                if ($('.ruler').hasClass('toggled')) {
                    e.preventDefault();
                    $('body').addClass('dragging')
                    if ($('#ruler-container').length == 0) {
                        methods.BuildRuler(0, 0)
                    }
                    else {
                        if ($('#ruler-container').is(':visible')) {
                            $('#ruler-container').fadeOut()
                        }
                        else {
                            $('#ruler-container').fadeIn()
                        }
                    }
                    /*
                    parseInt(e.pageX? e.pageX : e.clientX) - parseInt(jQuery('body').offset().left),
                    parseInt(e.pageY? e.pageY : e.clientY) - parseInt(jQuery('body').offset().top)
                    */
                    $('.ruler').removeClass('toggled')
                }
            })
            
            mouseoffset = (0,0)
            jQuery("span.ruler").each(function() {
                jQuery(this).click(function() {
                    if (!jQuery('.ruler ').hasClass('disabled')) {
                        if (jQuery(this).hasClass("toggled")) {
                            jQuery("span.ruler").removeClass("toggled");
                            //jQuery("div#ruler-menu").animate({"height": "10px"}, "fast")
                        }
                        else {
                            jQuery("span.ruler").addClass("toggled");
                            //jQuery("div#ruler-menu").animate({"height": "236px"}, "fast")
                        }
                    }
                });
            }).addClass("left");

            if (jQuery('body').css("position") != 'relative')
                jQuery('body').css({ "position": "relative" });
            //jQuery("body").append('<div id="ruler-menu"></div>')
            jQuery("#ruler-menu").ruler()
            var timer;
            methods.buildGlobalOptions();
        },
    
        BuildRuler: function(x, y) {
            var conversion = {
                "px": "1",
                "in": "72"
            },
                divider = 'px',
                left    = roundNumber((parseInt($('#ruler-container').css('left')) + 15) / conversion[divider], 2)+divider,
                top     = roundNumber((parseInt($('#ruler-container').css('top')) + 15) / conversion[divider], 2)+divider,
                height  = roundNumber((parseInt($('#ruler-container').css('height')) - 15) / conversion[divider], 2)+divider,
                width   = roundNumber((parseInt($('#ruler-container').css('width')) - 15) / conversion[divider], 2)+divider;
            if ($('#ruler-container').length == 0) {
                
                jQuery('body').append('<div id="ruler-container"><div id="ruler-spacer" class="rulercolor yellow"></div><div id="ruler-x" class="rulercolor yellow"></div><div id="ruler-y" class="rulercolor yellow"></div><div id="ruler-coords" class="rulercolor gray">15px, 15px</div><div id="ruler-dimentions" class="rulercolor gray">135px, 252px</div></div>')
                first = true
            }
            jQuery('#ruler-container').draggable({
                drag: function() {
                    left    = roundNumber((parseInt($(this).css('left')) + 15) / conversion[divider], 2)+divider;
                    top     = roundNumber((parseInt($(this).css('top')) + 15) / conversion[divider], 2)+divider;
                    height  = roundNumber((parseInt($(this).css('height')) - 15) / conversion[divider], 2)+divider;
                    width   = roundNumber((parseInt($(this).css('width')) - 15) / conversion[divider], 2)+divider;
                    if (divider != $('#ruler-measurement option:selected').attr('val'))
                        divider = $('#ruler-measurement option:selected').attr('val');
                    $('#ruler-coords').text(left + ', ' + top);
                    $('#ruler-dimentions').text(height + ', ' + width);
                }
            }).resizable({
                minHeight: 100,
                minWidth: 150,
                resize: function() {
                    left    = roundNumber((parseInt($(this).css('left')) + 15) / conversion[divider], 2)+divider;
                    top     = roundNumber((parseInt($(this).css('top')) + 15) / conversion[divider], 2)+divider;
                    height  = roundNumber((parseInt($(this).css('height')) - 15) / conversion[divider], 2)+divider;
                    width   = roundNumber((parseInt($(this).css('width')) - 15) / conversion[divider], 2)+divider;
                    if (divider != $('#ruler-measurement option:selected').attr('val'))
                        divider = $('#ruler-measurement option:selected').attr('val');
                    $('#ruler-coords').text(left + ', ' + top);
                    $('#ruler-dimentions').text(height + ', ' + width);
                }
            })
            //aspectRatio: 16/9,
            if (first)
                jQuery('#ruler-container').css({"left": x, "top": y, "width": 267, "height": 150})
            first = false
        },
    
        buildGlobalOptions: function() {
            $('#webtools_options').append('<fieldset id="webtools-ruler-options"><legend>Ruler Options</legend>Test</fieldset>')
            $('#webtools-ruler-options')
                .append('<select id="ruler-measurement"></select>')
            
            $('#ruler-measurement')
                .append('<option val="px" selected="selected">Pixel</option')
                .append('<option val="in">Inch</option')
                .change(function() {
                    var conversion = {
                        "px": "1",
                        "in": "72"
                    },
                        divider = $('#ruler-measurement option:selected').attr('val'),
                        left    = roundNumber((parseInt($('#ruler-container').css('left')) + 15) / conversion[divider], 2)+divider,
                        top     = roundNumber((parseInt($('#ruler-container').css('top')) + 15) / conversion[divider], 2)+divider,
                        height  = roundNumber((parseInt($('#ruler-container').css('height')) - 15) / conversion[divider], 2)+divider,
                        width   = roundNumber((parseInt($('#ruler-container').css('width')) - 15) / conversion[divider], 2)+divider;
                    $('#ruler-coords').text(left + ', ' + top);
                    $('#ruler-dimentions').text(height + ', ' + width);
                    console.log(conversion[divider])
                })
        }
    }
    
    function roundNumber(num, dec) {
        var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
        return result;
    }

    /**
     * jQuery definition to anchor JsDoc comments.
     *
     * @see http://jQuery.com/
     * @name jQuery
     * @class jQuery Library
     */

    /**
     * Ruler Class
     *
     * @namespace Ruler
     * @memberOf jQuery
     * @param {object} el Element
     * @param {object} options Options
     * @param {object} modes Avalible modes
     * @return {jQuery} chainable jQuery class
     * @requires jQuery 1.7
     * @requires jScrollPane
     * @requires Mouse Wheel
     * @requires Mouse Wheel Intent
     */
    jQuery.ruler = function (el, options, modes) {
        options = jQuery.extend(jQuery.ruler.defaultOptions, options);
        $(document).ready(function() {
            jQuery('#webtools-toolbar')
                .append(jQuery(document.createElement('a'))
                    .attr({"id":"toolbar-ruler"})
                    .append(jQuery(document.createElement('span')).addClass("ruler smbtn")));
            methods.init(el, options, modes)
        });
    };

    /**
     * A jQuery Wrapper Function to append Ruler formatted text to a
     * DOM object converted to HTML.
     *
     * @namespace Ruler
     * @memberOf jQuery.fn
     * @param {method}
     * @return {jQuery} chainable jQuery class
     */
    $.fn.ruler = function(options) {
        return this.each(function () {
            (new $.ruler(this, options));
        });
    };

    /**
     * This Class breaks the chain, but returns the ruler if it has been
     * attached to the object.
     *
     * @namespace Get ruler
     * @memberOf jQuery.fn
     */
    jQuery.fn.getruler = function() {
        this.data("ruler");
    };
})(jQuery);
