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

    //jQuery for page scrolling feature - requires jQuery Easing plugin
    $(document).on('click', '.page-scroll a', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1000, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.site-header',
        offset: 10
    });

	/* Skills: projects bar + years */
    // number of project blocks shown per skill = highest project count in the section
    var MAX_PROJECTS = 0;
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