window.addEventListener("load", function () {
  var headerHeight = document.querySelector(".page-header").clientHeight;
  var stickyNavbarElement = document.querySelector(".navbar-sticky");
  var courseInfoWrapper = document.querySelector(".course-info-wrapper");
  var checkoutWrapper = document.querySelector(".checkout-wrapper");
  var offset = 300;

  toggleStickyNavbar();

  window.addEventListener("scroll", function () {
    toggleStickyNavbar();
    toggleCheckoutPosition();
  });

  window.addEventListener("resize", function () {
    toggleCheckoutPosition();
  });
  toggleCheckoutPosition();

  function toggleStickyNavbar() {
    if (window.scrollY > headerHeight - offset) {
      return stickyNavbarElement.classList.add("visible");
    }
    stickyNavbarElement.classList.remove("visible");
  }

  function toggleCheckoutPosition() {
    if (window.innerHeight < checkoutWrapper.clientHeight + 100) {
      resetCheckoutWrapperPosition();
      return;
    }
    if (window.innerWidth > 991) {
      var maxScrollPos =
        courseInfoWrapper.offsetTop +
        courseInfoWrapper.clientHeight -
        checkoutWrapper.clientHeight -
        200;
      if (
        window.scrollY > courseInfoWrapper.offsetTop &&
        window.scrollY < maxScrollPos
      ) {
        checkoutWrapper.style.position = "fixed";
        checkoutWrapper.style.top = "100px";
        checkoutWrapper.style.marginLeft = "18px";
        return;
      } else if (window.scrollY >= maxScrollPos) {
        var padding = 200;
        checkoutWrapper.style.position = "absolute";
        checkoutWrapper.style.marginLeft = "18px";
        checkoutWrapper.style.top =
          courseInfoWrapper.offsetHeight -
          checkoutWrapper.offsetHeight -
          padding +
          "px";
        return;
      }
      resetCheckoutWrapperPosition();
    } else {
      resetCheckoutWrapperPosition();
    }
  }

  function resetCheckoutWrapperPosition() {
    checkoutWrapper.style.marginLeft = "0px";
    checkoutWrapper.style.position = "static";
  }

  registerNavigation();

  function registerNavigation() {
    var elements = document.querySelectorAll(".anchor");
    elements.forEach(function (el) {
      const href = el.getAttribute("href") || "";
      const isAnchor = href[0] === "#";
      if (!isAnchor) {
        return;
      }
      el.addEventListener("click", function (event) {
        if (!el.scrollIntoView) {
          return;
        }
        event.preventDefault();

        var targetElement = document.querySelector(el.getAttribute("href"));
        if (targetElement) {
          targetElement.scrollIntoView({ block: "start", behavior: "smooth" });
        }
      });
    });
  }

  const newsletterAddButton = document.querySelector(".newsletter-form button");
  const newsletterEmailInput = document.querySelector("#newsletter-email");
  const formRef = document.querySelector(".newsletter-form form");
  if (newsletterAddButton && newsletterEmailInput) {
    formRef.addEventListener("submit", function (e) {
      e.preventDefault();

      newsletterAddButton.setAttribute("disabled", "disabled");
      newsletterEmailInput.setAttribute("disabled", "disabled");

      const value = newsletterEmailInput.value;
      const xhr = new XMLHttpRequest();
      const url =
        "https://z93f42xq2l.execute-api.us-east-2.amazonaws.com/Stage/newsletter?token=db1f899025b5a59a76b6b34b2a013893";
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = function () {
        newsletterAddButton.classList.add("btn-success");
      };
      const data = JSON.stringify({ email: value });
      xhr.send(data);
    });
  }

  document.querySelectorAll(".category-heading").forEach(function (headingRef) {
    headingRef.addEventListener("click", function (el) {
      if (this.parentElement.classList.contains("opened")) {
        this.parentElement.classList.remove("opened");
        if (this.parentNode && this.parentNode.previousElementSibling) {
          this.parentNode.previousElementSibling.classList.remove(
            "opened-below"
          );
        }
        toggleCheckoutPosition();
      } else {
        this.parentElement.classList.add("opened");
        if (this.parentNode && this.parentNode.previousElementSibling) {
          this.parentNode.previousElementSibling.classList.add("opened-below");
        }
      }
    });
  });

  const videoModalContainerRef = document.querySelector(
    ".video-modal-container"
  );
  const videoModalRef = document.querySelector(".video-modal");

  document.querySelectorAll(".btn-watch").forEach(function (buttonRef) {
    buttonRef.addEventListener("click", function (btnClickEvent) {
      const videoId = btnClickEvent.target.getAttribute("data-video-id");
      if (!videoId) {
        return;
      }
      const vimeoIframe = getVimeoIframe(videoId);

      videoModalContainerRef.classList.add("opened");
      videoModalRef.innerHTML = vimeoIframe;

      const handler = function (event) {
        if (btnClickEvent === event) {
          return;
        }
        const vimeoIframeRef = document.querySelector(".video-modal iframe");

        const isClickInside = vimeoIframeRef.contains(event.target);
        if (
          !isClickInside &&
          videoModalContainerRef.classList.contains("opened")
        ) {
          videoModalContainerRef.classList.remove("opened");
          videoModalRef.textContent = "";

          document.removeEventListener("click", handler);
        }
      };
      document.addEventListener("click", handler);
    });
  });
});

function getVimeoIframe(videoId) {
  return `<iframe
  src="https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0&sidedock=0"
  width="1170"
  height="675"
  frameborder="0"
  class="featured-lesson"
  allow="autoplay; fullscreen"
  allowfullscreen
></iframe>`;
}
