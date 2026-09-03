/*
	Template Name: SaasRiver - SaaS & StartUp HTML Template
	Author: https://themexriver.com/
	Version: 1.0
*/

(function ($) {
"use strict";

/*
	no-scroll-restore — a reload half-way down the page would otherwise put the
	browser back at that offset after the scroll-driven triggers were measured,
	leaving every start/end point off by the restored amount
*/
if ("scrollRestoration" in history) {
	history.scrollRestoration = "manual";
}

/*
	windows-load-function
*/

window.addEventListener('load', function(){

	// drop any scroll position gsap/the browser remembered, then measure the
	// triggers from a clean top-of-page state
	ScrollTrigger.clearScrollMemory("manual");
	window.scrollTo(0, 0);
	ScrollTrigger.refresh();

	if (document.querySelectorAll(".ot-preloader-1").length) {
		const loader = document.querySelector(".ot-preloader-1");
		
		setTimeout(() => {
			loader.classList.add("loaded");
		});

		// hold the intro back until the curtain has finished lifting
		// (matches the .55s fade in scss/components/_preloader.scss)
		setTimeout(function () {
			afterPreloader();
		}, 550);
		setTimeout(function () {
			loader.remove();
		}, 1500);

	} else {
		afterPreloader();
	}

	afterPageLoad();

})

/* 
	after-preloader-start
*/
function afterPreloader() {

	// the hero opens only now, so its reveal is not spent behind the curtain
	ot_hero1_intro();

	/*
		only-LTR-direction
	*/
	if (getComputedStyle(document.body).direction !== "rtl") {

		// section-title-1 — lines slide up from behind their own mask
		if($(".wa_title_ani_1").length) {
			gsap.registerPlugin(SplitText);

			$(".wa_title_ani_1").each(function (index, el) {

				// double split: the second pass wraps each line in a mask
				var wa_title_line = new SplitText(el, {
					type: "lines",
					linesClass: "wa-split-line"
				});
				new SplitText(el, {
					type: "lines",
					linesClass: "wa-split-mask"
				});

				var wa_title_delay = parseFloat($(el).attr('data-split-delay')) || 0;

				gsap.set(wa_title_line.lines, {
					yPercent: 110,
					opacity: 0
				});

				gsap.to(wa_title_line.lines, {
					scrollTrigger: {
						trigger: el,
						start: "top 86%",
					},
					yPercent: 0,
					opacity: 1,
					duration: .9,
					ease: "power3.out",
					stagger: .1,
					delay: wa_title_delay
				});

			});
		}

	}

/*
	after-preloader-end
*/
}

/* 
	after-page-load-start
*/
function afterPageLoad() {

	/* 
		add-active-class
	*/
	const waAddClass = gsap.utils.toArray('.wa_add_class');
	waAddClass.forEach(waAddClassItem => {
		gsap.to(waAddClassItem, {
			scrollTrigger: {
				trigger: waAddClassItem,
				start: "top 90%",
				end: "bottom bottom",
				toggleActions: "play none none reverse",
				toggleClass: "active",
				once: true,
				markers: false,
			}
		});
	});

	/* 
		wow-activation
	*/
	if($('.wow').length){
		var wow = new WOW({
			boxClass:     'wow',
			animateClass: 'animated',
			offset:       100,
			mobile:       true,
			live:         true
		});
		wow.init();
	};

		

/* 
	after-page-load-start
*/
}

// clip animation
const waClipAnimation = {

	// wrappers marked data-clip-manual are played by their own script
	// (sliders, tabs, popups …) through waClipAnimation.play(wrapper)
	init: function () {
		const self = this;

		$(".wa_clip_animation").not("[data-clip-manual]").each(function () {
			if (self.createMasks(this)) {
				self.reveal(this, true);
			}
		});
	},

	initialClipPaths: [
		"polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)",
		"polygon(33.33% 0%, 33.33% 0%, 33.33% 0%, 33.33% 0%)",
		"polygon(65.66% 0%, 66.66% 0%, 66.66% 0%, 66.66% 0%)",
		"polygon(0% 33.33%, 0% 33.33%, 0% 33.33%, 0% 33.33%)",
		"polygon(33.33% 33.33%, 33.33% 33.33%, 33.33% 33.33%, 33.33% 33.33%)",
		"polygon(65.66% 33.33%, 66.66% 33.33%, 66.66% 33.33%, 66.66% 33.33%)",
		"polygon(0% 66.66%, 0% 66.66%, 0% 66.66%, 0% 66.66%)",
		"polygon(33.33% 66.66%, 33.33% 66.66%, 33.33% 66.66%, 33.33% 66.66%)",
		"polygon(65.66% 66.66%, 66.66% 66.66%, 66.66% 66.66%, 66.66% 66.66%)"
	],

	finalClipPaths: [
		"polygon(0% 0%, 34.33% 0%, 34.33% 34.33%, 0% 34.33%)",
		"polygon(32.33% 0%, 66.66% 0%, 66.66% 33.33%, 33.33% 34.33%)",
		"polygon(65.66% 0%, 100% 0%, 100% 33.33%, 65.66% 34.33%)",
		"polygon(0% 33.33%, 33.33% 33.33%, 33.33% 66.66%, 0% 66.66%)",
		"polygon(30.33% 33.33%, 66.66% 33.33%, 66.66% 66.66%, 33.33% 66.66%)",
		"polygon(65.66% 33.33%, 100% 32.33%, 100% 66.66%, 65.66% 66.66%)",
		"polygon(0% 65.66%, 33.33% 66.66%, 33.33% 100%, 0% 100%)",
		"polygon(30.33% 66.66%, 66.66% 65.66%, 66.66% 100%, 33.33% 100%)",
		"polygon(65.66% 66.66%, 100% 65.66%, 100% 100%, 65.66% 100%)"
	],

	// the nine tiles that make up the reveal — rebuilt on every play
	createMasks: function (wrapper) {
		const $wrapper = $(wrapper);
		const $img = $wrapper.find(".wa_clip_animation_img[data-animate='true']");

		if (!$img.length) return false;

		const url = $img.attr("src");

		$wrapper.find(".wa_mask").remove();

		for (let i = 0; i < 9; i++) {
			$("<div>", {
				class: `wa_mask wa_mask_${i + 1}`,
				css: {
					backgroundImage: `url(${url})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					position: "absolute",
					inset: 0
				}
			}).appendTo($wrapper);
		}

		return true;
	},

	// diagonal open — scroll triggered by default, instant when scroll is false
	reveal: function (wrapper, scroll) {
		const self = this;
		const $masks = $(wrapper).find(".wa_mask");

		if (!$masks.length) return;

		gsap.set($masks.toArray(), {
			clipPath: function (i) {
				return self.initialClipPaths[i];
			}
		});

		const order = [
			[".wa_mask_1"],
			[".wa_mask_2", ".wa_mask_4"],
			[".wa_mask_3", ".wa_mask_5", ".wa_mask_7"],
			[".wa_mask_6", ".wa_mask_8"],
			[".wa_mask_9"]
		];

		const tl = gsap.timeline(scroll ? {
			scrollTrigger: {
				trigger: wrapper,
				start: "top 75%"
			}
		} : {});

		order.forEach((targets, i) => {
			const elements = targets
				.map(sel => wrapper.querySelector(sel))
				.filter(Boolean);

			if (!elements.length) return;

			tl.to(elements, {
				clipPath: (j, el) =>
					self.finalClipPaths[$masks.toArray().indexOf(el)],
				duration: 1,
				ease: "power4.out",
				stagger: 0.1
			}, i * 0.125);
		});
	},

	// rebuild + replay right away, for anything that swaps images in place
	play: function (wrapper) {
		if (wrapper && this.createMasks(wrapper)) {
			this.reveal(wrapper, false);
		}
	}
};

waClipAnimation.init();

// hero-1-slider
var ot_hero1_imgs = [];

$('.ot_hero1_slider .swiper-slide .bg-img img').each(function () {
	ot_hero1_imgs.push($(this).attr('src'));
});

// the two buttons preview the slide they will bring in
function ot_hero1_preview(swiper) {
	var total = ot_hero1_imgs.length;
	if (!total) return;

	$('.ot_hero1_prev_img img').attr('src', ot_hero1_imgs[(swiper.realIndex - 1 + total) % total]);
	$('.ot_hero1_next_img img').attr('src', ot_hero1_imgs[(swiper.realIndex + 1) % total]);
}

// plays the first slide in, called after the preloader lifts
function ot_hero1_intro() {
	if (typeof ot_hero1_slider === "undefined") return;

	ot_hero1_clip(ot_hero1_slider);
	ot_hero1_content(ot_hero1_slider, true);
}

// the incoming slide replays the clip reveal on its background image
function ot_hero1_clip(swiper) {
	var slide = swiper.slides[swiper.activeIndex];
	if (!slide) return;

	waClipAnimation.play(slide.querySelector(".wa_clip_animation"));
}

// the active slide's copy — parked out of sight on init, played once the
// preloader has lifted and again on every slide change
function ot_hero1_content(swiper, play) {
	var slide = swiper.slides[swiper.activeIndex];
	if (!slide) return;

	var content = slide.querySelector('.ot-hero-1-slider-item-content');
	if (!content) return;

	var ot_hero1_author = content.querySelector('.ot-hero-1-slider-item-author');
	var ot_hero1_title = content.querySelector('.ot-hero-1-slider-item-title');
	var ot_hero1_disc = content.querySelector('.ot-hero-1-slider-item-disc');
	var ot_hero1_btns = Array.prototype.slice.call(content.querySelectorAll('.ot-hero-1-slider-item-content .btn-elm'));

	// a quick slide change can leave the previous run half way through
	var ot_hero1_targets = [ot_hero1_author, ot_hero1_title, ot_hero1_disc].concat(ot_hero1_btns).filter(Boolean);

	gsap.killTweensOf(ot_hero1_targets);
	gsap.set(ot_hero1_targets, { y: 40, opacity: 0 });

	if (!play) return;

	gsap.timeline({ defaults: { duration: 1.2, ease: "power3.out" } })
		.to(ot_hero1_author, {
			y: 0,
			opacity: 1,
		})
		.to(ot_hero1_title, {
			y: 0,
			opacity: 1,
		}, "-=1")
		.to(ot_hero1_disc, {
			y: 0,
			opacity: 1,
		}, "-=1")
		.to(ot_hero1_btns, {
			y: 0,
			opacity: 1,
			stagger: .14,
		}, "-=1");
}
var ot_hero1_slider = new Swiper(".ot_hero1_slider", {
	loop: true,
	speed: 1000,
	slidesPerView: 1,
    autoplay: {
		delay: 4000,
	},
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
	
	navigation: {
		nextEl: '.ot_hero1_slider_next',
		prevEl: '.ot_hero1_slider_prev',
	},

	on: {
		afterInit: function () {
			ot_hero1_preview(this);

			// park the copy out of sight straight away, so nothing flashes
			// while the preloader fades; ot_hero1_intro() plays it after
			ot_hero1_content(this, false);
		},
		slideChange: function () {
			ot_hero1_preview(this);
		},
		slideChangeTransitionStart: function () {
			ot_hero1_clip(this);
			ot_hero1_content(this, true);
		},
	},
});

// services-1-slider
var ot_services1_slider = new Swiper(".ot_services1_slider", {
	loop: true,
	speed: 800,
	spaceBetween: 28,
	slidesPerView: "auto",
	autoplay: {
		delay: 4000,
	},
});

// price-1-toggle — swaps every card between the monthly and the annual rate
$("#ot-price-1-toggle").on("change", function () {
	var ot_price1_yearly = $(this).is(":checked");

	$(".ot-price-1-card .price").each(function () {
		var $amount = $(this).find(".amount");

		$amount.text($amount.data(ot_price1_yearly ? "yearly" : "monthly"));
		$(this).find(".duration").text(ot_price1_yearly ? "/per yearly" : "/per monthly");
	});
});

// project-1-slider — the slide in focus grows, so re-measure once it settles
var ot_project1_slider = new Swiper(".ot_project1_slider", {
	loop: true,
	speed: 800,
	spaceBetween: 20,
	slidesPerView: "auto",

	navigation: {
		nextEl: ".ot_project1_next",
		prevEl: ".ot_project1_prev",
	},

	pagination: {
		el: ".ot_project1_pagination",
		type: "fraction",
		formatFractionCurrent: function (number) {
			return number < 10 ? "0" + number : number;
		},
		renderFraction: function (currentClass, totalClass) {
			return "<span class=\"" + currentClass + "\"></span>" +
				"<span class=\"divider\">/<span class=\"" + totalClass + "\"></span></span>";
		},
	},

	on: {
		slideChangeTransitionEnd: function () {
			this.update();
		},
	},
});

// process-1-cards — the steps rise into the middle of the row one by one,
// then the finished stack fans back out to its own columns, all on scroll
if ($(".ot-process-1-wrap-height").length) {
	gsap.matchMedia().add("(min-width: 1400px)", function () {
		var ot_process1_cards = gsap.utils.toArray(".ot-process-1-card");
		var ot_process1_wrap = document.querySelector(".ot-process-1-wrap");

		// how far a card has to travel to sit in the middle of the row
		function ot_process1_center(card) {
			return (ot_process1_wrap.offsetWidth / 2) - (card.offsetLeft + card.offsetWidth / 2);
		}

		gsap.set(ot_process1_cards, {
			x: function (index, card) {
				return ot_process1_center(card);
			},
			yPercent: 200,
			zIndex: function (index) {
				return index + 1;
			},
		});

		var ot_process1_tl = gsap.timeline({
			scrollTrigger: {
				trigger: ".ot-process-1-wrap-height",
				start: "top 30%",
				end: "bottom bottom",
				scrub: 1,
				invalidateOnRefresh: true,
			}
		});

		// one card after another into the middle
		ot_process1_cards.forEach(function (card, index) {
			ot_process1_tl.to(card, {
				yPercent: 0,
				opacity: 1,
				duration: 1,
				ease: "none",
			}, index);
		});

		// once all four are stacked, they spread to left and right
		ot_process1_tl.to(ot_process1_cards, {
			x: 0,
			duration: 1.5,
			ease: "power2.inOut",
			stagger: 0.1,
		}, ot_process1_cards.length + 0.2);

		return function () {
			gsap.set(ot_process1_cards, { clearProps: "all" });
		};
	});
}

// dot-shape — the dotted bands wipe in as they scroll into view: the ones
// pinned to a section top open downwards, the bottom one opens upwards
if ($(".ot-dot-shape, .bg-dot-shape-1, .bg-dot-shape-2").length) {
	gsap.utils.toArray(".ot-dot-shape, .bg-dot-shape-1, .bg-dot-shape-2").forEach(function (ot_dot_shape) {
		var ot_dot_up = ot_dot_shape.classList.contains("bg-dot-shape-2");

		gsap.fromTo(ot_dot_shape, {
			clipPath: ot_dot_up ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
			opacity: 0,
		}, {
			clipPath: "inset(0% 0% 0% 0%)",
			opacity: 1,
			duration: 1.4,
			ease: "power3.out",
			scrollTrigger: {
				trigger: ot_dot_shape,
				start: "top 90%",
				once: true,
			}
		});
	});
}
// about-1-images — the two photos rise in, then the badges land on top
if ($(".ot-about-1-img").length) {
	gsap.utils.toArray(".ot-about-1-img").forEach(function (ot_about1_img) {
		var ot_about1_tl = gsap.timeline({
			scrollTrigger: {
				trigger: ot_about1_img,
				start: "top 80%",
				once: true,
			}
		});

		ot_about1_tl
			.from(ot_about1_img.querySelectorAll(".img-single"), {
				y: 70,
				opacity: 0,
				duration: 1.2,
				stagger: .18,
				ease: "power3.out",
			})
			.from(ot_about1_img.querySelectorAll(".ot-about-1-exp"), {
				scale: .8,
				opacity: 0,
				duration: .9,
				ease: "back.out(1.6)",
				transformOrigin: "left top",
			}, "-=.7")
			.from(ot_about1_img.querySelectorAll(".ot-about-1-ceo"), {
				x: 40,
				opacity: 0,
				duration: .9,
				ease: "power3.out",
			}, "-=.6");
	});
}

// industry-1-tabs — the panel image wipes down and settles out of a slow
// zoom every time another tab is picked
if ($(".ot-industry-1-tabs").length) {
	$('.ot-industry-1-tabs [data-bs-toggle="tab"]').on("shown.bs.tab", function (event) {
		var ot_industry1_pane = document.querySelector(event.target.getAttribute("data-bs-target"));
		if (!ot_industry1_pane) return;

		var ot_industry1_img = ot_industry1_pane.querySelector(".img-elm");
		if (!ot_industry1_img) return;

		gsap.fromTo(ot_industry1_img, {
			clipPath: "inset(0% 0% 100% 0%)",
		}, {
			clipPath: "inset(0% 0% 0% 0%)",
			duration: .9,
			ease: "power3.out",
		});

		gsap.fromTo(ot_industry1_img.querySelector("img"), {
			scale: 1.12,
		}, {
			scale: 1,
			duration: 1.4,
			ease: "power3.out",
		});
	});
}


// team-2-x-member — the oversized headline lifts in as the section arrives,
// then the card row slides across it while the sticky box holds
if ($(".ot-team-2-area").length) {
	// only where the four-up row has room — under 1400 the scss drops the
	// 200vh runway and the sticky pin with it
	gsap.matchMedia().add("(min-width: 1400px)", function () {

		// measured off the headline itself — the section top clears 80% of the
		// viewport while the centred headline is still a screen away
		gsap.from(".ot-team-2-title-big-elm", {
			scrollTrigger: {
				trigger: ".ot-team-2-title-big-elm",
				start: "top 85%",
				once: true,
			},
			y: 80,
			opacity: 0,
			duration: 1.2,
			ease: "power3.out",
		});

		// the row travels its own width, scrubbed across the whole 200vh runway
		gsap.fromTo(".ot-team-2-list", {
			xPercent: 100,
		}, {
			xPercent: 0,
			ease: "none",
			scrollTrigger: {
				trigger: ".ot-team-2-area",
				start: "top top",
				end: "bottom bottom",
				scrub: 1,
				invalidateOnRefresh: true,
			},
		});

		return function () {
			gsap.set(".ot-team-2-list, .ot-team-2-title-big-elm", { clearProps: "all" });
		};
	});
}

// choose-2-skills — each bar runs out to the width the markup carries, the
// reading and its end tick travelling with the fill
if ($(".ot-choose-2-skill-list").length) {
	gsap.utils.toArray(".ot-choose-2-skill-list").forEach(function (ot_choose2_list) {
		gsap.from(ot_choose2_list.querySelectorAll(".bar-fill"), {
			scrollTrigger: {
				trigger: ot_choose2_list,
				start: "top 85%",
				once: true,
			},
			width: 0,
			duration: 1.4,
			stagger: .15,
			ease: "power3.out",
		});
	});
}

})(jQuery);
