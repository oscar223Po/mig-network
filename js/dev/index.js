(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const video = document.querySelector(".video__inner");
const videoButton = document.querySelector(".video__button");
if (video && videoButton) {
  videoButton.addEventListener("click", function() {
    if (video.paused) {
      video.play();
      video.classList.add("video-pointer");
      videoButton.classList.add("play-btn-disable");
    }
  });
  video.addEventListener("click", function() {
    if (!video.paused) {
      video.pause();
      video.classList.remove("video-pointer");
      videoButton.classList.remove("play-btn-disable");
    }
  });
  document.addEventListener("popupClosed", function() {
    if (!video.paused) {
      video.pause();
      video.classList.remove("video-pointer");
      videoButton.classList.remove("play-btn-disable");
    }
  });
}
let slideUp = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("--slide")) {
    target.classList.add("--slide");
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty("height") : null;
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      !showmore ? target.style.removeProperty("overflow") : null;
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("--slide");
      document.dispatchEvent(new CustomEvent("slideUpDone", {
        detail: {
          target
        }
      }));
    }, duration);
  }
};
let slideDown = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("--slide")) {
    target.classList.add("--slide");
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty("height") : null;
    let height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout(() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("--slide");
      document.dispatchEvent(new CustomEvent("slideDownDone", {
        detail: {
          target
        }
      }));
    }, duration);
  }
};
let slideToggle = (target, duration = 500) => {
  if (target.hidden) {
    return slideDown(target, duration);
  } else {
    return slideUp(target, duration);
  }
};
let bodyLockStatus = true;
let bodyLockToggle = (delay = 500) => {
  if (document.documentElement.hasAttribute("data-fls-scrolllock")) {
    bodyUnlock(delay);
  } else {
    bodyLock(delay);
  }
};
let bodyUnlock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-fls-lp]");
    setTimeout(() => {
      lockPaddingElements.forEach((lockPaddingElement) => {
        lockPaddingElement.style.paddingRight = "";
      });
      document.body.style.paddingRight = "";
      document.documentElement.removeAttribute("data-fls-scrolllock");
    }, delay);
    bodyLockStatus = false;
    setTimeout(function() {
      bodyLockStatus = true;
    }, delay);
  }
};
let bodyLock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-fls-lp]");
    const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
    lockPaddingElements.forEach((lockPaddingElement) => {
      lockPaddingElement.style.paddingRight = lockPaddingValue;
    });
    document.body.style.paddingRight = lockPaddingValue;
    document.documentElement.setAttribute("data-fls-scrolllock", "");
    bodyLockStatus = false;
    setTimeout(function() {
      bodyLockStatus = true;
    }, delay);
  }
};
function dataMediaQueries(array, dataSetValue) {
  const media = Array.from(array).filter((item) => item.dataset[dataSetValue]).map((item) => {
    const [value, type = "max"] = item.dataset[dataSetValue].split(",");
    return { value, type, item };
  });
  if (media.length === 0) return [];
  const breakpointsArray = media.map(({ value, type }) => `(${type}-width: ${value}px),${value},${type}`);
  const uniqueQueries = [...new Set(breakpointsArray)];
  return uniqueQueries.map((query) => {
    const [mediaQuery, mediaBreakpoint, mediaType] = query.split(",");
    const matchMedia = window.matchMedia(mediaQuery);
    const itemsArray = media.filter((item) => item.value === mediaBreakpoint && item.type === mediaType);
    return { itemsArray, matchMedia };
  });
}
function spollers() {
  const spollersArray = document.querySelectorAll("[data-fls-spollers]");
  if (spollersArray.length > 0) {
    let initSpollers2 = function(spollersArray2, matchMedia = false) {
      spollersArray2.forEach((spollersBlock) => {
        spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
        if (matchMedia.matches || !matchMedia) {
          spollersBlock.classList.add("--spoller-init");
          initSpollerBody2(spollersBlock);
        } else {
          spollersBlock.classList.remove("--spoller-init");
          initSpollerBody2(spollersBlock, false);
        }
      });
    }, initSpollerBody2 = function(spollersBlock, hideSpollerBody = true) {
      let spollerItems = spollersBlock.querySelectorAll("details");
      if (spollerItems.length) {
        spollerItems.forEach((spollerItem) => {
          let spollerTitle = spollerItem.querySelector("summary");
          if (hideSpollerBody) {
            spollerTitle.removeAttribute("tabindex");
            if (!spollerItem.hasAttribute("data-fls-spollers-open")) {
              spollerItem.open = false;
              spollerTitle.nextElementSibling.hidden = true;
            } else {
              spollerTitle.classList.add("--spoller-active");
              spollerItem.open = true;
            }
          } else {
            spollerTitle.setAttribute("tabindex", "-1");
            spollerTitle.classList.remove("--spoller-active");
            spollerItem.open = true;
            spollerTitle.nextElementSibling.hidden = false;
          }
        });
      }
    }, setSpollerAction2 = function(e) {
      const el = e.target;
      if (el.closest("summary") && el.closest("[data-fls-spollers]")) {
        e.preventDefault();
        if (el.closest("[data-fls-spollers]").classList.contains("--spoller-init")) {
          const spollerTitle = el.closest("summary");
          const spollerBlock = spollerTitle.closest("details");
          const spollersBlock = spollerTitle.closest("[data-fls-spollers]");
          const oneSpoller = spollersBlock.hasAttribute("data-fls-spollers-one");
          const scrollSpoller = spollerBlock.hasAttribute("data-fls-spollers-scroll");
          const spollerSpeed = spollersBlock.dataset.flsSpollersSpeed ? parseInt(spollersBlock.dataset.flsSpollersSpeed) : 500;
          if (!spollersBlock.querySelectorAll(".--slide").length) {
            if (oneSpoller && !spollerBlock.open) {
              hideSpollersBody2(spollersBlock);
            }
            !spollerBlock.open ? spollerBlock.open = true : setTimeout(() => {
              spollerBlock.open = false;
            }, spollerSpeed);
            spollerTitle.classList.toggle("--spoller-active");
            slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
            if (scrollSpoller && spollerTitle.classList.contains("--spoller-active")) {
              const scrollSpollerValue = spollerBlock.dataset.flsSpollersScroll;
              const scrollSpollerOffset = +scrollSpollerValue ? +scrollSpollerValue : 0;
              const scrollSpollerNoHeader = spollerBlock.hasAttribute("data-fls-spollers-scroll-noheader") ? document.querySelector(".header").offsetHeight : 0;
              window.scrollTo(
                {
                  top: spollerBlock.offsetTop - (scrollSpollerOffset + scrollSpollerNoHeader),
                  behavior: "smooth"
                }
              );
            }
          }
        }
      }
      if (!el.closest("[data-fls-spollers]")) {
        const spollersClose = document.querySelectorAll("[data-fls-spollers-close]");
        if (spollersClose.length) {
          spollersClose.forEach((spollerClose) => {
            const spollersBlock = spollerClose.closest("[data-fls-spollers]");
            const spollerCloseBlock = spollerClose.parentNode;
            if (spollersBlock.classList.contains("--spoller-init")) {
              const spollerSpeed = spollersBlock.dataset.flsSpollersSpeed ? parseInt(spollersBlock.dataset.flsSpollersSpeed) : 500;
              spollerClose.classList.remove("--spoller-active");
              slideUp(spollerClose.nextElementSibling, spollerSpeed);
              setTimeout(() => {
                spollerCloseBlock.open = false;
              }, spollerSpeed);
            }
          });
        }
      }
    }, hideSpollersBody2 = function(spollersBlock) {
      const spollerActiveBlock = spollersBlock.querySelector("details[open]");
      if (spollerActiveBlock && !spollersBlock.querySelectorAll(".--slide").length) {
        const spollerActiveTitle = spollerActiveBlock.querySelector("summary");
        const spollerSpeed = spollersBlock.dataset.flsSpollersSpeed ? parseInt(spollersBlock.dataset.flsSpollersSpeed) : 500;
        spollerActiveTitle.classList.remove("--spoller-active");
        slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
        setTimeout(() => {
          spollerActiveBlock.open = false;
        }, spollerSpeed);
      }
    };
    var initSpollers = initSpollers2, initSpollerBody = initSpollerBody2, setSpollerAction = setSpollerAction2, hideSpollersBody = hideSpollersBody2;
    document.addEventListener("click", setSpollerAction2);
    const spollersRegular = Array.from(spollersArray).filter(function(item, index, self) {
      return !item.dataset.flsSpollers.split(",")[0];
    });
    if (spollersRegular.length) {
      initSpollers2(spollersRegular);
    }
    let mdQueriesArray = dataMediaQueries(spollersArray, "flsSpollers");
    if (mdQueriesArray && mdQueriesArray.length) {
      mdQueriesArray.forEach((mdQueriesItem) => {
        mdQueriesItem.matchMedia.addEventListener("change", function() {
          initSpollers2(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
        initSpollers2(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    }
  }
}
window.addEventListener("load", spollers);
function menuInit() {
  document.addEventListener("click", function(e) {
    if (bodyLockStatus && e.target.closest("[data-fls-menu]")) {
      bodyLockToggle();
      document.documentElement.toggleAttribute("data-fls-menu-open");
    }
  });
}
document.querySelector("[data-fls-menu]") ? window.addEventListener("load", menuInit) : null;
function headerScroll() {
  const header = document.querySelector("[data-fls-header-scroll]");
  const headerShow = header.hasAttribute("data-fls-header-scroll-show");
  const headerShowTimer = header.dataset.flsHeaderScrollShow ? header.dataset.flsHeaderScrollShow : 500;
  const startPoint = header.dataset.flsHeaderScroll ? header.dataset.flsHeaderScroll : 1;
  let scrollDirection = 0;
  let timer;
  document.addEventListener("scroll", function(e) {
    const scrollTop = window.scrollY;
    clearTimeout(timer);
    if (scrollTop >= startPoint) {
      !header.classList.contains("--header-scroll") ? header.classList.add("--header-scroll") : null;
      if (headerShow) {
        if (scrollTop > scrollDirection) {
          header.classList.contains("--header-show") ? header.classList.remove("--header-show") : null;
        } else {
          !header.classList.contains("--header-show") ? header.classList.add("--header-show") : null;
        }
        timer = setTimeout(() => {
          !header.classList.contains("--header-show") ? header.classList.add("--header-show") : null;
        }, headerShowTimer);
      }
    } else {
      header.classList.contains("--header-scroll") ? header.classList.remove("--header-scroll") : null;
      if (headerShow) {
        header.classList.contains("--header-show") ? header.classList.remove("--header-show") : null;
      }
    }
    scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
  });
}
document.querySelector("[data-fls-header-scroll]") ? window.addEventListener("load", headerScroll) : null;
class DynamicAdapt {
  constructor() {
    this.type = "max";
    this.init();
  }
  init() {
    this.objects = [];
    this.daClassname = "--dynamic";
    this.nodes = [...document.querySelectorAll("[data-fls-dynamic]")];
    this.nodes.forEach((node) => {
      const data = node.dataset.flsDynamic.trim();
      const dataArray = data.split(`,`);
      const object = {};
      object.element = node;
      object.parent = node.parentNode;
      object.destinationParent = dataArray[3] ? node.closest(dataArray[3].trim()) || document : document;
      dataArray[3] ? dataArray[3].trim() : null;
      const objectSelector = dataArray[0] ? dataArray[0].trim() : null;
      if (objectSelector) {
        const foundDestination = object.destinationParent.querySelector(objectSelector);
        if (foundDestination) {
          object.destination = foundDestination;
        }
      }
      object.breakpoint = dataArray[1] ? dataArray[1].trim() : `767.98`;
      object.place = dataArray[2] ? dataArray[2].trim() : `last`;
      object.index = this.indexInParent(object.parent, object.element);
      this.objects.push(object);
    });
    this.arraySort(this.objects);
    this.mediaQueries = this.objects.map(({ breakpoint }) => `(${this.type}-width: ${breakpoint / 16}em),${breakpoint}`).filter((item, index, self) => self.indexOf(item) === index);
    this.mediaQueries.forEach((media) => {
      const mediaSplit = media.split(",");
      const matchMedia = window.matchMedia(mediaSplit[0]);
      const mediaBreakpoint = mediaSplit[1];
      const objectsFilter = this.objects.filter(({ breakpoint }) => breakpoint === mediaBreakpoint);
      matchMedia.addEventListener("change", () => {
        this.mediaHandler(matchMedia, objectsFilter);
      });
      this.mediaHandler(matchMedia, objectsFilter);
    });
  }
  mediaHandler(matchMedia, objects) {
    if (matchMedia.matches) {
      objects.forEach((object) => {
        if (object.destination) {
          this.moveTo(object.place, object.element, object.destination);
        }
      });
    } else {
      objects.forEach(({ parent, element, index }) => {
        if (element.classList.contains(this.daClassname)) {
          this.moveBack(parent, element, index);
        }
      });
    }
  }
  moveTo(place, element, destination) {
    element.classList.add(this.daClassname);
    const index = place === "last" || place === "first" ? place : parseInt(place, 10);
    if (index === "last" || index >= destination.children.length) {
      destination.append(element);
    } else if (index === "first") {
      destination.prepend(element);
    } else {
      destination.children[index].before(element);
    }
  }
  moveBack(parent, element, index) {
    element.classList.remove(this.daClassname);
    if (parent.children[index] !== void 0) {
      parent.children[index].before(element);
    } else {
      parent.append(element);
    }
  }
  indexInParent(parent, element) {
    return [...parent.children].indexOf(element);
  }
  arraySort(arr) {
    if (this.type === "min") {
      arr.sort((a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }
          if (a.place === "first" || b.place === "last") {
            return -1;
          }
          if (a.place === "last" || b.place === "first") {
            return 1;
          }
          return 0;
        }
        return a.breakpoint - b.breakpoint;
      });
    } else {
      arr.sort((a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }
          if (a.place === "first" || b.place === "last") {
            return 1;
          }
          if (a.place === "last" || b.place === "first") {
            return -1;
          }
          return 0;
        }
        return b.breakpoint - a.breakpoint;
      });
      return;
    }
  }
}
if (document.querySelector("[data-fls-dynamic]")) {
  window.addEventListener("load", () => new DynamicAdapt());
}
