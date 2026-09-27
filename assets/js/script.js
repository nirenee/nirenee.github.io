$(function() {

    $('.navbar-toggle').click(function() {
        $(this).toggleClass('act');
            if($(this).hasClass('act')) {
                $('.main-menu').addClass('act');
            }
            else {
                $('.main-menu').removeClass('act');
            }
    });

    var HEADER_OFFSET = 60; // height of the compact header, so sections aren't hidden under it

    //jQuery for page scrolling feature - requires jQuery Easing plugin
    $(document).on('click', '.page-scroll a', function(event) {
        var $target = $($(this).attr('href'));
        if (!$target.length) return;
        $('html, body').stop().animate({
            scrollTop: Math.max(0, $target.offset().top - HEADER_OFFSET)
        }, 1000, 'easeInOutExpo');
        event.preventDefault();

        // close the mobile overlay menu after choosing a section
        $('.navbar-toggle, .main-menu').removeClass('act');
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.site-header',
        offset: HEADER_OFFSET + 20
    });

    /* Header: compact on scroll, reading progress, sliding indicator */
    var $header = $('.site-header');
    var $nav = $header.find('.navbar-nav');
    var $progress = $header.find('.nav-progress');
    var $indicator = $('<li class="nav-indicator" aria-hidden="true"></li>').appendTo($nav);

    function moveIndicator($link) {
        if (!$link || !$link.length) {
            $indicator.css('opacity', 0);
            return;
        }
        $indicator.css({
            opacity: 1,
            width: $link.outerWidth(),
            // offsetLeft is relative to the <li>, so measure against the <ul> instead
            transform: 'translateX(' + ($link.offset().left - $nav.offset().left) + 'px)'
        });
    }

    function moveIndicatorToActive() {
        moveIndicator($nav.find('li.active > a'));
    }

    $nav.on('mouseenter', 'li > a', function() { moveIndicator($(this)); });
    $nav.on('mouseleave', moveIndicatorToActive);
    $nav.on('activate.bs.scrollspy', moveIndicatorToActive);

    function updateHeader() {
        var top = $(window).scrollTop();
        var max = $(document).height() - window.innerHeight;
        $header.toggleClass('scrolled', top > 40);
        $progress.css('transform', 'scaleX(' + (max > 0 ? Math.min(top / max, 1) : 0) + ')');
        // scrollspy doesn't fire an event when it clears the active item (back at the very top)
        if (!$nav.is(':hover')) moveIndicatorToActive();
    }

    $(window).on('scroll', updateHeader);
    $(window).on('resize load', function() {
        updateHeader();
        moveIndicatorToActive();
    });
    updateHeader();

	/* Skills: projects bar + years */
    // number of project blocks shown per skill = highest project count in the section
    var MAX_PROJECTS = 3;
    $('.section-skills .skill').each(function() {
        MAX_PROJECTS = Math.max(MAX_PROJECTS, parseInt($(this).data('projects'), 10) || 0);
    });

    $('.section-skills .skill').each(function() {
        var $skill = $(this);
        var years = parseInt($skill.data('years'), 10) || 0;
        var projects = parseInt($skill.data('projects'), 10) || 0;

        var blocks = '';
        for (var i = 0; i < MAX_PROJECTS; i++) {
            blocks += '<span class="skill-dot"></span>';
        }

        $skill.append(
            '<div class="skill-dots" title="' + projects + (projects === 1 ? ' project' : ' projects') + '">' + blocks + '</div>' +
            '<span class="skill-years-num"><span class="skill-count" data-to="' + years + '">0</span> ' + (years === 1 ? 'yr' : 'yrs') + '</span>' +
            '<span class="skill-projects" title="' + projects + (projects === 1 ? ' project' : ' projects') + '"><span class="skill-count" data-to="' + projects + '">0</span> proj</span>'
        );
    });

    function animateSkill($skill) {
        $skill.find('.skill-count').each(function() {
            var $num = $(this);
            $({ n: 0 }).animate({ n: $num.data('to') }, {
                duration: 1200,
                easing: 'swing',
                step: function(now) { $num.text(Math.round(now)); }
            });
        });
        var projects = parseInt($skill.data('projects'), 10) || 0;
        $skill.find('.skill-dot').slice(0, projects).each(function(i) {
            var $block = $(this);
            setTimeout(function() { $block.addClass('filled'); }, 200 + i * 80);
        });
    }

    function checkSkills() {
        var trigger = $(window).scrollTop() + window.innerHeight * 0.85;
        $('.skill-panel:not(.in-view)').each(function() {
            var $panel = $(this);
            if ($panel.offset().top < trigger) {
                $panel.addClass('in-view');
                $panel.find('.skill').each(function(i) {
                    var $skill = $(this);
                    setTimeout(function() { animateSkill($skill); }, 300 + i * 120);
                });
            }
        });
    }

    $(window).on('scroll resize', checkSkills);
    checkSkills();

    /* Experience timeline: reveal items and fill the line while scrolling */
    var $timeline = $('.timeline');
    var $timelineProgress = $timeline.find('.timeline-progress');

    function checkTimeline() {
        if (!$timeline.length) return;
        var trigger = $(window).scrollTop() + window.innerHeight * 0.8;

        $timeline.find('.timeline-item:not(.in-view)').each(function() {
            if ($(this).offset().top < trigger) $(this).addClass('in-view');
        });

        var filled = Math.min(Math.max(trigger - $timeline.offset().top, 0), $timeline.outerHeight());
        $timelineProgress.css('height', filled);
    }

    $(window).on('scroll resize load', checkTimeline);
    checkTimeline();

    /* Counters  */
    if ($(".section-counters .start").length>0) {
        $(".section-counters .start").each(function() {
            var stat_item = $(this),
            offset = stat_item.offset().top;
            $(window).scroll(function() {
                if($(window).scrollTop() > (offset - 1000) && !(stat_item.hasClass('counting'))) {
                    stat_item.addClass('counting');
                    stat_item.countTo();
                }
            });
        });
    };

	// another custom callback for counting to infinity
	$('#infinity').data('countToOptions', {
		onComplete: function (value) {
		  count.call(this, {
		    from: value,
		    to: value + 1
		  });
		}
	});

	$('#infinity').each(count);

	function count(options) {
        var $this = $(this);
        options = $.extend({}, options || {}, $this.data('countToOptions') || {});
        $this.countTo(options);
    }

    // Navigation overlay
    var s = skrollr.init({
            forceHeight: false,
            smoothScrolling: false,
            mobileDeceleration: 0.004,
            mobileCheck: function() {
                //hack - forces mobile version to be off
                return false;
            }
    });
    
});