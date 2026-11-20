import { params } from '../../core/js/utils.js';
import { defineModule } from '../../core/js/modules.js';

const CONFIG = {
	tocSelector: '.toc-sidebar',
};

function getVisibleBoundingClientRect(element) {
	const rect = element.getBoundingClientRect();
	const hasNoHeight = rect.top === rect.bottom;
	if (hasNoHeight && element.parentNode) {
		return getVisibleBoundingClientRect(element.parentNode);
	}
	return rect;
}

function getTocLinks() {
	const toc = document.querySelector(CONFIG.tocSelector);
	if (!toc) return [];
	return Array.from(toc.querySelectorAll('a[href^="#"]'));
}

function getAnchorsFromTOC() {
	const tocLinks = getTocLinks();
	const anchors = [];

	tocLinks.forEach((link) => {
		const href = link.getAttribute('href');
		if (!href || !href.includes('#')) return;
		const id = decodeURIComponent(href.substring(1));
		const element = document.getElementById(id);
		if (element) {
			anchors.push(element);
		}
	});

	return anchors;
}

function getActiveAnchor(anchors, navbarHeight) {
	const TOLERANCE = -5;
	const nextVisibleAnchor = anchors.find((anchor) => {
		const boundingRect = getVisibleBoundingClientRect(anchor);
		return boundingRect.top > navbarHeight + TOLERANCE;
	});

	if (nextVisibleAnchor) {
		const boundingRect = getVisibleBoundingClientRect(nextVisibleAnchor);

		if (boundingRect.top > navbarHeight + TOLERANCE && boundingRect.bottom < window.innerHeight / 2) {
			return nextVisibleAnchor;
		}

		const index = anchors.indexOf(nextVisibleAnchor);
		return anchors[index - 1] || null;
	}

	return anchors[anchors.length - 1] || null;
}

function getLinkAnchorValue(link) {
	const href = link.getAttribute('href');
	if (!href || !href.includes('#')) return '';
	return decodeURIComponent(href.substring(href.indexOf('#') + 1));
}

function getAnchorTopOffset() {
	if (params.headerLayout !== 'sticky') {
		return 0;
	}
	const navbar = document.querySelector('#site-header');
	return navbar ? navbar.clientHeight : 0;
}

function scrollTocLinkIntoView(link) {
	const toc = document.querySelector(CONFIG.tocSelector);
	if (!toc || !link) return;

	const tocRect = toc.getBoundingClientRect();
	const linkRect = link.getBoundingClientRect();

	const isAboveView = linkRect.top < tocRect.top;
	const isBelowView = linkRect.bottom > tocRect.bottom;

	if (!isAboveView && !isBelowView) return;

	const linkOffsetTop = link.offsetTop;
	const targetScrollTop = linkOffsetTop - toc.clientHeight / 2 + link.clientHeight / 2;

	toc.scrollTo({
		top: targetScrollTop,
		behavior: 'smooth',
	});
}

let lastActiveLink = null;

function updateActiveLink() {
	const tocLinks = getTocLinks();
	if (tocLinks.length === 0) return;

	const anchors = getAnchorsFromTOC();
	if (anchors.length === 0) return;

	const navbarHeight = getAnchorTopOffset();
	const activeAnchor = getActiveAnchor(anchors, navbarHeight);
	const activeLink = tocLinks.find((link) => activeAnchor && activeAnchor.id === getLinkAnchorValue(link));

	tocLinks.forEach((link) => {
		const isActive = link === activeLink;

		if (isActive) {
			if (lastActiveLink && lastActiveLink !== link) {
				lastActiveLink.removeAttribute('data-active');
			}

			link.setAttribute('data-active', '');

			if (lastActiveLink !== link) {
				scrollTocLinkIntoView(link);
			}

			lastActiveLink = link;
		} else {
			link.removeAttribute('data-active');
		}
	});
}

function handleTocKeydown(e) {
	const links = getTocLinks();
	const current = document.activeElement;
	const index = links.indexOf(current);
	if (index === -1) return;

	let target;

	switch (e.key) {
		case 'ArrowDown':
		case 'ArrowRight':
			target = links[Math.min(index + 1, links.length - 1)];
			break;
		case 'ArrowUp':
		case 'ArrowLeft':
			target = links[Math.max(index - 1, 0)];
			break;
		case 'Home':
			target = links[0];
			break;
		case 'End':
			target = links[links.length - 1];
			break;
		default:
			return;
	}

	e.preventDefault();
	target?.focus();
}

let ticking = false;

function scheduleUpdate() {
	if (ticking) return;
	ticking = true;

	requestAnimationFrame(() => {
		setTimeout(() => {
			ticking = false;
			updateActiveLink();
		});
	});
}

function initToc(toc, { signal }) {
	document.addEventListener('scroll', scheduleUpdate, { passive: true, signal });
	window.addEventListener('resize', scheduleUpdate, { passive: true, signal });
	toc.addEventListener('keydown', handleTocKeydown, { signal });

	lastActiveLink = null;
	scheduleUpdate();
}

defineModule('toc', initToc);
