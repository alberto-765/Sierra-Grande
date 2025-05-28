(function () {
	("use strict");

	/**
	 *  global variables
	 */
	var navbarMenuHTML = document.querySelector(".navbar-menu").innerHTML;
	var horizontalMenuSplit = 5; // after this number all horizontal menus will be moved in More menu options
	var default_lang = "en"; // set Default Language
	var language = localStorage.getItem("language");

	function initLanguage () {
		// Set new language
		(language === null) ? setLanguage(default_lang) : setLanguage(language);
		var languages = document.getElementsByClassName("language");
		languages && Array.from(languages).forEach(function (dropdown) {
			dropdown.addEventListener("click", function (event) {
				setLanguage(dropdown.getAttribute("data-lang"));
			});
		});
	}

	function setLanguage (lang) {
		if (document.getElementById("header-lang-img")) {
			if (lang == "en") {
				document.getElementById("header-lang-img").src = "../static/img/flags/us.svg";
				document.getElementById("lang-name").innerHTML = "English";
			} else if (lang == "sp") {
				document.getElementById("header-lang-img").src = "../static/img/flags/spain.svg";
				document.getElementById("lang-name").innerHTML = "Española";
			} else if (lang == "gr") {
				document.getElementById("header-lang-img").src = "../static/img/flags/germany.svg";
				document.getElementById("lang-name").innerHTML = "Deutsche";
			} else if (lang == "it") {
				document.getElementById("header-lang-img").src = "../static/img/flags/italy.svg";
				document.getElementById("lang-name").innerHTML = "Italiana";
			} else if (lang == "ru") {
				document.getElementById("header-lang-img").src = "../static/img/flags/russia.svg";
				document.getElementById("lang-name").innerHTML = "русский";
			} else if (lang == "ch") {
				document.getElementById("header-lang-img").src = "../static/img/flags/china.svg";
				document.getElementById("lang-name").innerHTML = "中国人";
			} else if (lang == "fr") {
				document.getElementById("header-lang-img").src = "../static/img/flags/french.svg";
				document.getElementById("lang-name").innerHTML = "français";
			} else if (lang == "sa") {
				document.getElementById("header-lang-img").src = "../static/img/flags/sa.svg";
				document.getElementById("lang-name").innerHTML = "عربى";
			}
			localStorage.setItem("language", lang);
			language = localStorage.getItem("language");
			getLanguage();
		}
	}

	// Multi language setting
	function getLanguage () {
		language == null ? setLanguage(default_lang) : false;
		var request = new XMLHttpRequest();
		// Instantiating the request object
		request.open("GET", "../assets/lang/" + language + ".json");
		// Defining event listener for readystatechange event
		request.onreadystatechange = function () {
			// Check if the request is compete and was successful
			if (this.readyState === 4 && this.status === 200) {
				var data = JSON.parse(this.responseText);
				Object.keys(data).forEach(function (key) {
					var elements = document.querySelectorAll("[data-key='" + key + "']");
					Array.from(elements).forEach(function (elem) {
						elem.textContent = data[key];
					});
				});
			}
		};
		// Sending the request to the server
		request.send();
	}

	function pluginData () {
		/**
		 * Common plugins
		 */
		/**
		 * Toast UI Notification
		 */
		var toastExamples = document.querySelectorAll("[data-toast]");
		Array.from(toastExamples).forEach(function (element) {
			element.addEventListener("click", function () {
				var toastData = {};
				var isToastVal = element.attributes;
				if (isToastVal["data-toast-text"]) {
					toastData.text = isToastVal["data-toast-text"].value.toString();
				}
				if (isToastVal["data-toast-gravity"]) {
					toastData.gravity = isToastVal["data-toast-gravity"].value.toString();
				}
				if (isToastVal["data-toast-position"]) {
					toastData.position = isToastVal["data-toast-position"].value.toString();
				}
				if (isToastVal["data-toast-className"]) {
					toastData.className = isToastVal["data-toast-className"].value.toString();
				}
				if (isToastVal["data-toast-duration"]) {
					toastData.duration = isToastVal["data-toast-duration"].value.toString();
				}
				if (isToastVal["data-toast-close"]) {
					toastData.close = isToastVal["data-toast-close"].value.toString();
				}
				if (isToastVal["data-toast-style"]) {
					toastData.style = isToastVal["data-toast-style"].value.toString();
				}
				if (isToastVal["data-toast-offset"]) {
					toastData.offset = isToastVal["data-toast-offset"];
				}
				Toastify({
					newWindow: true,
					text: toastData.text,
					gravity: toastData.gravity,
					position: toastData.position,
					className: "bg-" + toastData.className,
					stopOnFocus: true,
					offset: {
						x: toastData.offset ? 50 : 0, // horizontal axis - can be a number or a string indicating unity. eg: '2em'
						y: toastData.offset ? 10 : 0, // vertical axis - can be a number or a string indicating unity. eg: '2em'
					},
					duration: toastData.duration,
					close: toastData.close == "close" ? true : false,
					style: toastData.style == "style" ? {
						background: "linear-gradient(to right, #0AB39C, #405189)"
					} : "",
				}).showToast();
			});
		});

		/**
		 * Choices Select plugin
		 */
		var choicesExamples = document.querySelectorAll("[data-choices]");
		Array.from(choicesExamples).forEach(function (item) {
			var choiceData = {};
			var isChoicesVal = item.attributes;
			if (isChoicesVal["data-choices-groups"]) {
				choiceData.placeholderValue = "This is a placeholder set in the config";
			}
			if (isChoicesVal["data-choices-search-false"]) {
				choiceData.searchEnabled = false;
			}
			if (isChoicesVal["data-choices-search-true"]) {
				choiceData.searchEnabled = true;
			}
			if (isChoicesVal["data-choices-removeItem"]) {
				choiceData.removeItemButton = true;
			}
			if (isChoicesVal["data-choices-sorting-false"]) {
				choiceData.shouldSort = false;
			}
			if (isChoicesVal["data-choices-sorting-true"]) {
				choiceData.shouldSort = true;
			}
			if (isChoicesVal["data-choices-multiple-remove"]) {
				choiceData.removeItemButton = true;
			}
			if (isChoicesVal["data-choices-limit"]) {
				choiceData.maxItemCount = isChoicesVal["data-choices-limit"].value.toString();
			}
			if (isChoicesVal["data-choices-limit"]) {
				choiceData.maxItemCount = isChoicesVal["data-choices-limit"].value.toString();
			}
			if (isChoicesVal["data-choices-editItem-true"]) {
				choiceData.maxItemCount = true;
			}
			if (isChoicesVal["data-choices-editItem-false"]) {
				choiceData.maxItemCount = false;
			}
			if (isChoicesVal["data-choices-text-unique-true"]) {
				choiceData.duplicateItemsAllowed = false;
			}
			if (isChoicesVal["data-choices-text-disabled-true"]) {
				choiceData.addItems = false;
			}
			isChoicesVal["data-choices-text-disabled-true"] ? new Choices(item, choiceData).disable() : new Choices(item, choiceData);
		});

		/**
		 * flatpickr
		 */
		var flatpickrExamples = document.querySelectorAll("[data-provider]");
		Array.from(flatpickrExamples).forEach(function (item) {
			if (item.getAttribute("data-provider") == "flatpickr") {
				var dateData = {};
				var isFlatpickerVal = item.attributes;
				if (isFlatpickerVal["data-date-format"])
					dateData.dateFormat = isFlatpickerVal["data-date-format"].value.toString();
				if (isFlatpickerVal["data-enable-time"]) {
					(dateData.enableTime = true),
						(dateData.dateFormat = isFlatpickerVal["data-date-format"].value.toString() + " H:i");
				}
				if (isFlatpickerVal["data-altFormat"]) {
					(dateData.altInput = true),
						(dateData.altFormat = isFlatpickerVal["data-altFormat"].value.toString());
				}
				if (isFlatpickerVal["data-minDate"]) {
					dateData.minDate = isFlatpickerVal["data-minDate"].value.toString();
					dateData.dateFormat = isFlatpickerVal["data-date-format"].value.toString();
				}
				if (isFlatpickerVal["data-maxDate"]) {
					dateData.maxDate = isFlatpickerVal["data-maxDate"].value.toString();
					dateData.dateFormat = isFlatpickerVal["data-date-format"].value.toString();
				}
				if (isFlatpickerVal["data-deafult-date"]) {
					dateData.defaultDate = isFlatpickerVal["data-deafult-date"].value.toString();
					dateData.dateFormat = isFlatpickerVal["data-date-format"].value.toString();
				}
				if (isFlatpickerVal["data-multiple-date"]) {
					dateData.mode = "multiple";
					dateData.dateFormat = isFlatpickerVal["data-date-format"].value.toString();
				}
				if (isFlatpickerVal["data-range-date"]) {
					dateData.mode = "range";
					dateData.dateFormat = isFlatpickerVal["data-date-format"].value.toString();
				}
				if (isFlatpickerVal["data-inline-date"]) {
					(dateData.inline = true),
						(dateData.defaultDate = isFlatpickerVal["data-deafult-date"].value.toString());
					dateData.dateFormat = isFlatpickerVal["data-date-format"].value.toString();
				}
				if (isFlatpickerVal["data-disable-date"]) {
					var dates = [];
					dates.push(isFlatpickerVal["data-disable-date"].value);
					dateData.disable = dates.toString().split(",");
				}
				if (isFlatpickerVal["data-week-number"]) {
					var dates = [];
					dates.push(isFlatpickerVal["data-week-number"].value);
					dateData.weekNumbers = true;
				}
				flatpickr(item, dateData);
			} else if (item.getAttribute("data-provider") == "timepickr") {
				var timeData = {};
				var isTimepickerVal = item.attributes;
				if (isTimepickerVal["data-time-basic"]) {
					(timeData.enableTime = true),
						(timeData.noCalendar = true),
						(timeData.dateFormat = "H:i");
				}
				if (isTimepickerVal["data-time-hrs"]) {
					(timeData.enableTime = true),
						(timeData.noCalendar = true),
						(timeData.dateFormat = "H:i"),
						(timeData.time_24hr = true);
				}
				if (isTimepickerVal["data-min-time"]) {
					(timeData.enableTime = true),
						(timeData.noCalendar = true),
						(timeData.dateFormat = "H:i"),
						(timeData.minTime = isTimepickerVal["data-min-time"].value.toString());
				}
				if (isTimepickerVal["data-max-time"]) {
					(timeData.enableTime = true),
						(timeData.noCalendar = true),
						(timeData.dateFormat = "H:i"),
						(timeData.minTime = isTimepickerVal["data-max-time"].value.toString());
				}
				if (isTimepickerVal["data-default-time"]) {
					(timeData.enableTime = true),
						(timeData.noCalendar = true),
						(timeData.dateFormat = "H:i"),
						(timeData.defaultDate = isTimepickerVal["data-default-time"].value.toString());
				}
				if (isTimepickerVal["data-time-inline"]) {
					(timeData.enableTime = true),
						(timeData.noCalendar = true),
						(timeData.defaultDate = isTimepickerVal["data-time-inline"].value.toString());
					timeData.inline = true;
				}
				flatpickr(item, timeData);
			}
		});

		// Dropdown
		Array.from(document.querySelectorAll('.dropdown-menu a[data-bs-toggle="tab"]')).forEach(function (element) {
			element.addEventListener("click", function (e) {
				e.stopPropagation();
				bootstrap.Tab.getInstance(e.target).show();
			});
		});
	}

	// on click collapse menu
	function isCollapseMenu () {
		/**
		 * Sidebar menu collapse
		 */
		if (document.querySelectorAll(".navbar-nav .collapse")) {
			var collapses = document.querySelectorAll(".navbar-nav .collapse");
			Array.from(collapses).forEach(function (collapse) {
				// Init collapses
				var collapseInstance = new bootstrap.Collapse(collapse, {
					toggle: false,
				});
				// Hide sibling collapses on `show.bs.collapse`
				collapse.addEventListener("show.bs.collapse", function (e) {
					e.stopPropagation();
					var closestCollapse = collapse.parentElement.closest(".collapse");
					if (closestCollapse) {
						var siblingCollapses = closestCollapse.querySelectorAll(".collapse");
						Array.from(siblingCollapses).forEach(function (siblingCollapse) {
							var siblingCollapseInstance = bootstrap.Collapse.getInstance(siblingCollapse);
							if (siblingCollapseInstance === collapseInstance) {
								return;
							}
							siblingCollapseInstance.hide();
						});
					} else {
						var getSiblings = function (elem) {
							// Setup siblings array and get the first sibling
							var siblings = [];
							var sibling = elem.parentNode.firstChild;
							// Loop through each sibling and push to the array
							while (sibling) {
								if (sibling.nodeType === 1 && sibling !== elem) {
									siblings.push(sibling);
								}
								sibling = sibling.nextSibling;
							}
							return siblings;
						};
						var siblings = getSiblings(collapse.parentElement);
						Array.from(siblings).forEach(function (item) {
							if (item.childNodes.length > 2)
								item.firstElementChild.setAttribute("aria-expanded", "false");
							var ids = item.querySelectorAll("*[id]");
							Array.from(ids).forEach(function (item1) {
								item1.classList.remove("show");
								if (item1.childNodes.length > 2) {
									var val = item1.querySelectorAll("ul li a");
									Array.from(val).forEach(function (subitem) {
										if (subitem.hasAttribute("aria-expanded"))
											subitem.setAttribute("aria-expanded", "false");
									});
								}
							});
						});
					}
				});

				// Hide nested collapses on `hide.bs.collapse`
				collapse.addEventListener("hide.bs.collapse", function (e) {
					e.stopPropagation();
					var childCollapses = collapse.querySelectorAll(".collapse");
					Array.from(childCollapses).forEach(function (childCollapse) {
						childCollapseInstance = bootstrap.Collapse.getInstance(childCollapse);
						childCollapseInstance.hide();
					});
				});
			});
		}
	}


	//  Search menu dropdown on Topbar
	function isCustomDropdown () {
		//Search bar
		var searchOptions = document.getElementById("search-close-options");
		var dropdown = document.getElementById("search-dropdown");
		var searchInput = document.getElementById("search-options");
		if (searchInput) {
			searchInput.addEventListener("focus", function () {
				var inputLength = searchInput.value.length;
				if (inputLength > 0) {
					dropdown.classList.add("show");
					searchOptions.classList.remove("d-none");
				} else {
					dropdown.classList.remove("show");
					searchOptions.classList.add("d-none");
				}
			});

			searchInput.addEventListener("keyup", function (event) {
				var inputLength = searchInput.value.length;
				if (inputLength > 0) {
					dropdown.classList.add("show");
					searchOptions.classList.remove("d-none");

					var inputVal = searchInput.value.toLowerCase();
					var notifyItem = document.getElementsByClassName("notify-item");

					Array.from(notifyItem).forEach(function (element) {
						var notifiTxt = '';
						if (element.querySelector("h6")) {
							var spantext = element.getElementsByTagName("span")[0].innerText.toLowerCase();
							var name = element.querySelector("h6").innerText.toLowerCase();
							if (name.includes(inputVal)) {
								notifiTxt = name;
							} else {
								notifiTxt = spantext;
							}
						} else if (element.getElementsByTagName("span")) {
							notifiTxt = element.getElementsByTagName("span")[0].innerText.toLowerCase();
						}

						if (notifiTxt) {
							if (notifiTxt.includes(inputVal)) {
								element.classList.add("d-block");
								element.classList.remove("d-none");
							} else {
								element.classList.remove("d-block");
								element.classList.add("d-none");
							}
						}

						Array.from(document.getElementsByClassName("notification-group-list")).forEach(function (element) {
							if (element.querySelectorAll(".notify-item.d-block").length == 0) {
								element.querySelector(".notification-title").style.display = 'none';
							} else {
								element.querySelector(".notification-title").style.display = 'block';
							}
						});
					});
				} else {
					dropdown.classList.remove("show");
					searchOptions.classList.add("d-none");
				}
			});

			searchOptions.addEventListener("click", function () {
				searchInput.value = "";
				dropdown.classList.remove("show");
				searchOptions.classList.add("d-none");
			});

			document.body.addEventListener("click", function (e) {
				if (e.target.getAttribute("id") !== "search-options") {
					dropdown.classList.remove("show");
					searchOptions.classList.add("d-none");
				}
			});
		}
	}
	//  search menu dropdown on topbar
	function isCustomDropdownResponsive () {
		//Search bar
		var searchOptions = document.getElementById("search-close-options");
		var dropdownReponsive = document.getElementById("search-dropdown-reponsive");
		var searchInputReponsive = document.getElementById("search-options-reponsive");

		if (searchOptions && dropdownReponsive && searchInputReponsive) {
			searchInputReponsive.addEventListener("focus", function () {
				var inputLength = searchInputReponsive.value.length;
				if (inputLength > 0) {
					dropdownReponsive.classList.add("show");
					searchOptions.classList.remove("d-none");
				} else {
					dropdownReponsive.classList.remove("show");
					searchOptions.classList.add("d-none");
				}
			});

			searchInputReponsive.addEventListener("keyup", function () {
				var inputLength = searchInputReponsive.value.length;
				if (inputLength > 0) {
					dropdownReponsive.classList.add("show");
					searchOptions.classList.remove("d-none");
				} else {
					dropdownReponsive.classList.remove("show");
					searchOptions.classList.add("d-none");
				}
			});

			searchOptions.addEventListener("click", function () {
				searchInputReponsive.value = "";
				dropdownReponsive.classList.remove("show");
				searchOptions.classList.add("d-none");
			});

			document.body.addEventListener("click", function (e) {
				if (e.target.getAttribute("id") !== "search-options") {
					dropdownReponsive.classList.remove("show");
					searchOptions.classList.add("d-none");
				}
			});
		}
	}

	function elementInViewport (el) {
		if (el) {
			var top = el.offsetTop;
			var left = el.offsetLeft;
			var width = el.offsetWidth;
			var height = el.offsetHeight;

			if (el.offsetParent) {
				while (el.offsetParent) {
					el = el.offsetParent;
					top += el.offsetTop;
					left += el.offsetLeft;
				}
			}
			return (
				top >= window.pageYOffset &&
				left >= window.pageXOffset &&
				top + height <= window.pageYOffset + window.innerHeight &&
				left + width <= window.pageXOffset + window.innerWidth
			);
		}
	}

	function initLeftMenuCollapse () {
		/**
		 * Vertical layout menu scroll add
		 */
		if (document.documentElement.getAttribute("data-layout") == "vertical") {
			document.getElementById("two-column-menu").innerHTML = "";
			if (document.querySelector(".navbar-menu")) {
				document.querySelector(".navbar-menu").innerHTML = navbarMenuHTML;
			}
			document.getElementById("scrollbar").setAttribute("data-simplebar", "");
			document.getElementById("navbar-nav").setAttribute("data-simplebar", "");
			document.getElementById("scrollbar").classList.add("h-100");
		}

		/**
		 * Horizontal layout menu
		 */
		if (document.documentElement.getAttribute("data-layout") == "horizontal") {
			updateHorizontalMenus();
		}
	}

	function isLoadBodyElement () {
		var verticalOverlay = document.getElementsByClassName("vertical-overlay");
		if (verticalOverlay) {
			Array.from(verticalOverlay).forEach(function (element) {
				element.addEventListener("click", function () {
					document.body.classList.remove("vertical-sidebar-enable");
					document.documentElement.setAttribute("data-sidebar-size", sessionStorage.getItem("data-sidebar-size"));
				});
			});
		}
	}

	function windowResizeHover () {
		var windowSize = document.documentElement.clientWidth;
		if (windowSize < 1025 && windowSize > 767) {
			if (sessionStorage.getItem("data-layout") == "vertical") {
				document.documentElement.setAttribute("data-sidebar-size", "sm");
			}
			if (document.querySelector(".hamburger-icon")) {
				document.querySelector(".hamburger-icon").classList.add("open");
			}
		} else if (windowSize >= 1025) {
			if (sessionStorage.getItem("data-layout") == "vertical") {
				document.documentElement.setAttribute(
					"data-sidebar-size",
					sessionStorage.getItem("data-sidebar-size")
				);
			}
			if (document.querySelector(".hamburger-icon")) {
				document.querySelector(".hamburger-icon").classList.remove("open");
			}
		} else if (windowSize <= 767) {
			document.body.classList.remove("vertical-sidebar-enable");
			if (sessionStorage.getItem("data-layout") != "horizontal") {
				document.documentElement.setAttribute("data-sidebar-size", "lg");
			}
			if (document.querySelector(".hamburger-icon")) {
				document.querySelector(".hamburger-icon").classList.add("open");
			}
		}

		var isElement = document.querySelectorAll("#navbar-nav > li.nav-item");
		Array.from(isElement).forEach(function (item) {
			item.addEventListener("click", menuItem.bind(this), false);
			item.addEventListener("mouseover", menuItem.bind(this), false);
		});
	}

	function menuItem (e) {
		if (e.target && e.target.matches("a.nav-link span")) {
			if (elementInViewport(e.target.parentElement.nextElementSibling) == false) {
				e.target.parentElement.nextElementSibling.classList.add("dropdown-custom-right");
				e.target.parentElement.parentElement.parentElement.parentElement.classList.add("dropdown-custom-right");
				var eleChild = e.target.parentElement.nextElementSibling;
				Array.from(eleChild.querySelectorAll(".menu-dropdown")).forEach(function (item) {
					item.classList.add("dropdown-custom-right");
				});
			} else if (elementInViewport(e.target.parentElement.nextElementSibling) == true) {
				if (window.innerWidth >= 1848) {
					var elements = document.getElementsByClassName("dropdown-custom-right");
					while (elements.length > 0) {
						elements[0].classList.remove("dropdown-custom-right");
					}
				}
			}
		}

		if (e.target && e.target.matches("a.nav-link")) {
			if (elementInViewport(e.target.nextElementSibling) == false) {
				e.target.nextElementSibling.classList.add("dropdown-custom-right");
				e.target.parentElement.parentElement.parentElement.classList.add("dropdown-custom-right");
				var eleChild = e.target.nextElementSibling;
				Array.from(eleChild.querySelectorAll(".menu-dropdown")).forEach(function (item) {
					item.classList.add("dropdown-custom-right");
				});
			} else if (elementInViewport(e.target.nextElementSibling) == true) {
				if (window.innerWidth >= 1848) {
					var elements = document.getElementsByClassName("dropdown-custom-right");
					while (elements.length > 0) {
						elements[0].classList.remove("dropdown-custom-right");
					}
				}
			}
		}
	}

	function toggleHamburgerMenu () {
		var windowSize = document.documentElement.clientWidth;

		if (windowSize > 767)
			document.querySelector(".hamburger-icon").classList.toggle("open");

		//For collapse horizontal menu
		if (document.documentElement.getAttribute("data-layout") === "horizontal") {
			document.body.classList.contains("menu") ? document.body.classList.remove("menu") : document.body.classList.add("menu");
		}

		//For collapse vertical menu
		if (document.documentElement.getAttribute("data-layout") === "vertical") {
			if (windowSize < 1025 && windowSize > 767) {
				document.body.classList.remove("vertical-sidebar-enable");
				document.documentElement.getAttribute("data-sidebar-size") == "sm" ?
					document.documentElement.setAttribute("data-sidebar-size", "") :
					document.documentElement.setAttribute("data-sidebar-size", "sm");
			} else if (windowSize > 1025) {
				document.body.classList.remove("vertical-sidebar-enable");
				document.documentElement.getAttribute("data-sidebar-size") == "lg" ?
					document.documentElement.setAttribute("data-sidebar-size", "sm") :
					document.documentElement.setAttribute("data-sidebar-size", "lg");
			} else if (windowSize <= 767) {
				document.body.classList.add("vertical-sidebar-enable");
				document.documentElement.setAttribute("data-sidebar-size", "lg");
			}
		}
	}

	function windowLoadContent () {
		window.addEventListener("resize", windowResizeHover);
		windowResizeHover();

		document.addEventListener("scroll", function () {
			windowScroll();
		});

		window.addEventListener("load", function () {
			initActiveMenu();
			isLoadBodyElement();
			addEventListenerOnSmHoverMenu();
		});
		if (document.getElementById("topnav-hamburger-icon")) {
			document.getElementById("topnav-hamburger-icon").addEventListener("click", toggleHamburgerMenu);
		}
	}

	// page topbar class added
	function windowScroll () {
		var pageTopbar = document.getElementById("page-topbar");
		if (pageTopbar) {
			document.body.scrollTop >= 50 || document.documentElement.scrollTop >= 50 ? pageTopbar.classList.add("topbar-shadow") : pageTopbar.classList.remove("topbar-shadow");
		}
	}


	// two-column sidebar active js
	function initActiveMenu () {
		var currentPath = location.pathname == "/" ? "index.html" : location.pathname.substring(1);
		currentPath = currentPath.substring(currentPath.lastIndexOf("/") + 1);
		if (currentPath) {
			// navbar-nav
			var a = document.getElementById("navbar-nav").querySelector('[href="' + currentPath + '"]');
			if (a) {
				a.classList.add("active");
				var parentCollapseDiv = a.closest(".collapse.menu-dropdown");
				if (parentCollapseDiv) {
					parentCollapseDiv.classList.add("show");
					parentCollapseDiv.parentElement.children[0].classList.add("active");
					parentCollapseDiv.parentElement.children[0].setAttribute("aria-expanded", "true");
					if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
						parentCollapseDiv.parentElement.closest(".collapse").classList.add("show");
						if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling)
							parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.classList.add("active");

						if (parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.closest(".collapse.menu-dropdown")) {
							parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.closest(".collapse").classList.add("show");
							if (parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.closest(".collapse").previousElementSibling) {

								parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.closest(".collapse").previousElementSibling.classList.add("active");
								if ((document.documentElement.getAttribute("data-layout") == "horizontal") && parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.closest(".collapse")) {
									parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.closest(".collapse").previousElementSibling.classList.add("active");
								}
							}
						}
					}
				}
			}
		}
	}

	function elementInViewport (el) {
		if (el) {
			var top = el.offsetTop;
			var left = el.offsetLeft;
			var width = el.offsetWidth;
			var height = el.offsetHeight;

			if (el.offsetParent) {
				while (el.offsetParent) {
					el = el.offsetParent;
					top += el.offsetTop;
					left += el.offsetLeft;
				}
			}
			return (
				top >= window.pageYOffset &&
				left >= window.pageXOffset &&
				top + height <= window.pageYOffset + window.innerHeight &&
				left + width <= window.pageXOffset + window.innerWidth
			);
		}
	}

	// notification cart dropdown
	function initTopbarComponents () {
		if (document.getElementsByClassName("dropdown-item-cart")) {
			var dropdownItemCart = document.querySelectorAll(".dropdown-item-cart").length;
			Array.from(document.querySelectorAll("#page-topbar .dropdown-menu-cart .remove-item-btn")).forEach(function (item) {
				item.addEventListener("click", function (e) {
					dropdownItemCart--;
					this.closest(".dropdown-item-cart").remove();
					Array.from(document.getElementsByClassName("cartitem-badge")).forEach(function (e) {
						e.innerHTML = dropdownItemCart;
					});
					updateCartPrice();
					if (document.getElementById("empty-cart")) {
						document.getElementById("empty-cart").style.display = dropdownItemCart == 0 ? "block" : "none";
					}
					if (document.getElementById("checkout-elem")) {
						document.getElementById("checkout-elem").style.display = dropdownItemCart == 0 ? "none" : "block";
					}
				});
			});
			Array.from(document.getElementsByClassName("cartitem-badge")).forEach(function (e) {
				e.innerHTML = dropdownItemCart;
			});
			if (document.getElementById("empty-cart")) {
				document.getElementById("empty-cart").style.display = "none";
			}
			if (document.getElementById("checkout-elem")) {
				document.getElementById("checkout-elem").style.display = "block";
			}
			function updateCartPrice () {
				var currencySign = "$";
				var subtotal = 0;
				Array.from(document.getElementsByClassName("cart-item-price")).forEach(function (e) {
					subtotal += parseFloat(e.innerHTML);
				});
				if (document.getElementById("cart-item-total")) {
					document.getElementById("cart-item-total").innerHTML = currencySign + subtotal.toFixed(2);
				}
			}
			updateCartPrice();
		}

		// notification messages
		if (document.getElementsByClassName("notification-check")) {
			function emptyNotification () {
				if (document.querySelectorAll(".notification-item").length > 0) {
					document.querySelectorAll(".notification-title").forEach(function (item) {
						item.style.display = "block";
					});
				} else {
					document.querySelectorAll(".notification-title").forEach(function (item) {
						item.style.display = "none";
					});

					var emptyNotificationElem = document.querySelector("#notificationItemsTabContent .empty-notification-elem");
					if (!emptyNotificationElem) {
						document.getElementById("notificationItemsTabContent").innerHTML += '<div class="empty-notification-elem text-center px-4">\
						<div class="mt-3 avatar-md mx-auto">\
							<div class="avatar-title bg-info-subtle text-info fs-24 rounded-circle">\
							<i class="bi bi-bell "></i>\
							</div>\
						</div>\
						<div class="pb-3 mt-2">\
							<h6 class="fs-16 fw-semibold lh-base">Hey! You have no any notifications </h6>\
						</div>\
					</div>';
					}
				}
			}
			emptyNotification();
			Array.from(document.querySelectorAll(".notification-check input")).forEach(function (element) {
				element.addEventListener("change", function (el) {
					el.target.closest(".notification-item").classList.toggle("active");

					var checkedCount = document.querySelectorAll('.notification-check input:checked').length;

					if (el.target.closest(".notification-item").classList.contains("active")) {
						(checkedCount > 0) ? document.getElementById("notification-actions").style.display = 'block' : document.getElementById("notification-actions").style.display = 'none';
					} else {
						(checkedCount > 0) ? document.getElementById("notification-actions").style.display = 'block' : document.getElementById("notification-actions").style.display = 'none';
					}
					document.getElementById("select-content").innerHTML = checkedCount;
				});

				var notificationDropdown = document.getElementById('notificationDropdown');
				if (notificationDropdown) {
					notificationDropdown.addEventListener('hide.bs.dropdown', function (event) {
						element.checked = false;
						document.querySelectorAll('.notification-item').forEach(function (item) {
							item.classList.remove("active");
						});
						emptyNotification();
						document.getElementById('notification-actions').style.display = '';
					});
				}

			});


			var removeItem = document.getElementById('removeNotificationModal');
			if (removeItem) {
				removeItem.addEventListener('show.bs.modal', function (event) {
					document.getElementById("delete-notification").addEventListener("click", function () {
						Array.from(document.querySelectorAll(".notification-item")).forEach(function (element) {
							if (element.classList.contains("active")) {
								element.remove();
							}
							Array.from(document.querySelectorAll(".notification-badge")).forEach(function (item) {
								item.innerHTML = document.querySelectorAll('.notification-check input').length;
							});
							Array.from(document.querySelectorAll(".notification-unread")).forEach(function (item) {
								item.innerHTML = document.querySelectorAll('.notification-item.unread-message').length;
							});
						});
						emptyNotification();
						document.getElementById("NotificationModalbtn-close").click();
					});
				});
			}
		}
	}

	function initComponents () {
		// tooltip
		var tooltipTriggerList = [].slice.call(
			document.querySelectorAll('[data-bs-toggle="tooltip"]')
		);
		tooltipTriggerList.map(function (tooltipTriggerEl) {
			return new bootstrap.Tooltip(tooltipTriggerEl);
		});

		// popover
		var popoverTriggerList = [].slice.call(
			document.querySelectorAll('[data-bs-toggle="popover"]')
		);
		popoverTriggerList.map(function (popoverTriggerEl) {
			return new bootstrap.Popover(popoverTriggerEl);
		});
	}

	// Counter Number
	function counter () {
		var counter = document.querySelectorAll(".counter-value");
		var speed = 250; // The lower the slower
		counter &&
			Array.from(counter).forEach(function (counter_value) {
				function updateCount () {
					var target = +counter_value.getAttribute("data-target");
					var count = +counter_value.innerText;
					var inc = target / speed;
					if (inc < 1) {
						inc = 1;
					}
					// Check if target is reached
					if (count < target) {
						// Add inc to count and output in counter_value
						counter_value.innerText = (count + inc).toFixed(0);
						// Call function every ms
						setTimeout(updateCount, 1);
					} else {
						counter_value.innerText = numberWithCommas(target);
					}
					numberWithCommas(counter_value.innerText);
				}
				updateCount();
			});

		function numberWithCommas (x) {
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
	}

	function updateHorizontalMenus () {
		document.getElementById("two-column-menu").innerHTML = "";
		if (document.querySelector(".navbar-menu")) {
			document.querySelector(".navbar-menu").innerHTML = navbarMenuHTML;
		}
		document.getElementById("scrollbar").removeAttribute("data-simplebar");
		document.getElementById("navbar-nav").removeAttribute("data-simplebar");
		document.getElementById("scrollbar").classList.remove("h-100");

		var splitMenu = horizontalMenuSplit;
		var extraMenuName = "More";
		var menuData = document.querySelectorAll("ul.navbar-nav > li.nav-item");
		var newMenus = "";
		var splitItem = "";

		Array.from(menuData).forEach(function (item, index) {
			if (index + 1 === splitMenu) {
				splitItem = item;
			}
			if (index + 1 > splitMenu) {
				newMenus += item.outerHTML;
				item.remove();
			}

			if (index + 1 === menuData.length) {
				if (splitItem.insertAdjacentHTML) {
					splitItem.insertAdjacentHTML(
						"afterend",
						'<li class="nav-item">\
						<a class="nav-link" href="#sidebarMore" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="sidebarMore">\
							<i class="ri-briefcase-2-line"></i> <span data-key="t-more">' + extraMenuName + '</span>\
						</a>\
						<div class="collapse menu-dropdown" id="sidebarMore"><ul class="nav nav-sm flex-column">' + newMenus + "</ul></div>\
					</li>");
				}
			}
		});
	}

	function hideShowLayoutOptions (dataLayout) {
		if (dataLayout == "vertical") {
			document.getElementById("two-column-menu").innerHTML = "";
			if (document.querySelector(".navbar-menu")) {
				document.querySelector(".navbar-menu").innerHTML = navbarMenuHTML;
			}
			if (document.getElementById("theme-settings-offcanvas")) {
				document.getElementById("sidebar-size").style.display = "block";
				document.getElementById("sidebar-view").style.display = "block";
				document.getElementById("sidebar-color").style.display = "block";
				if (document.getElementById("sidebar-img")) {
					document.getElementById("sidebar-img").style.display = "block";
				}
				document.getElementById("layout-position").style.display = "block";
				document.getElementById("layout-width").style.display = "block";
			}
			initLeftMenuCollapse();
			initActiveMenu();
			addEventListenerOnSmHoverMenu();
			initMenuItemScroll();
		} else if (dataLayout == "horizontal") {
			updateHorizontalMenus();
			if (document.getElementById("theme-settings-offcanvas")) {
				document.getElementById("sidebar-size").style.display = "none";
				document.getElementById("sidebar-view").style.display = "none";
				document.getElementById("sidebar-color").style.display = "none";
				if (document.getElementById("sidebar-img")) {
					document.getElementById("sidebar-img").style.display = "none";
				}
				document.getElementById("layout-position").style.display = "block";
				document.getElementById("layout-width").style.display = "block";
			}
			initActiveMenu();
		}
	}

	// add listener Sidebar Hover icon on change layout from setting
	function addEventListenerOnSmHoverMenu () {
		document.getElementById("vertical-hover").addEventListener("click", function () {
			if (document.documentElement.getAttribute("data-sidebar-size") === "sm-hover") {
				document.documentElement.setAttribute("data-sidebar-size", "sm-hover-active");
			} else if (document.documentElement.getAttribute("data-sidebar-size") === "sm-hover-active") {
				document.documentElement.setAttribute("data-sidebar-size", "sm-hover");
			} else {
				document.documentElement.setAttribute("data-sidebar-size", "sm-hover");
			}
		});
	}

	function initMenuItemScroll () {
		setTimeout(function () {
			var sidebarMenu = document.getElementById("navbar-nav");
			if (sidebarMenu) {
				var activeMenu = sidebarMenu.querySelector(".nav-item .active");
				var offset = activeMenu ? activeMenu.offsetTop : 0;
				if (offset > 300) {
					var verticalMenu = document.getElementsByClassName("app-menu") ? document.getElementsByClassName("app-menu")[0] : "";
					if (verticalMenu && verticalMenu.querySelector(".simplebar-content-wrapper")) {
						setTimeout(function () {
							offset == 330 ?
								(verticalMenu.querySelector(".simplebar-content-wrapper").scrollTop = offset + 85) :
								(verticalMenu.querySelector(".simplebar-content-wrapper").scrollTop = offset);
						}, 0);
					}
				}
			}
		}, 250);
	}

	// add change event listener on right layout setting
	function getElementUsingTagname (ele, val) {
		Array.from(document.querySelectorAll("input[name=" + ele + "]")).forEach(function (x) {
			val == x.value ? (x.checked = true) : (x.checked = false);

			x.addEventListener("change", function () {
				document.documentElement.setAttribute(ele, x.value);
				sessionStorage.setItem(ele, x.value);
				initLanguage();

				if (ele == "data-layout-width" && x.value == "boxed") {
					document.documentElement.setAttribute("data-sidebar-size", "sm-hover");
					sessionStorage.setItem("data-sidebar-size", "sm-hover");
					document.getElementById("sidebar-size-small-hover").checked = true;
				} else if (ele == "data-layout-width" && x.value == "fluid") {
					document.documentElement.setAttribute("data-sidebar-size", "lg");
					sessionStorage.setItem("data-sidebar-size", "lg");
					document.getElementById("sidebar-size-default").checked = true;
				}

				if (ele == "data-layout") {
					if (x.value == "vertical") {
						hideShowLayoutOptions("vertical");
						isCollapseMenu();
					} else if (x.value == "horizontal") {
						if (document.getElementById("sidebarimg-none")) {
							document.getElementById("sidebarimg-none").click();
						}
						hideShowLayoutOptions("horizontal");
					}
				}

				if (ele == "data-bs-theme" && x.value == "light") {
					document.getElementById("topbar-color-light").click();
					document.getElementById("sidebar-color-light").click();
				} else if (ele == "data-bs-theme" && x.value == "dark") {
					document.getElementById("topbar-color-dark").click();
					document.getElementById("sidebar-color-dark").click();
				}

				if (ele == "data-preloader" && x.value == "enable") {
					document.documentElement.setAttribute("data-preloader", "enable");
					var preloader = document.getElementById("preloader");
					if (preloader) {
						setTimeout(function () {
							preloader.style.opacity = "0";
							preloader.style.visibility = "hidden";
						}, 1000);
					}
					document.getElementById("customizerclose-btn").click();
				} else if (ele == "data-preloader" && x.value == "disable") {
					document.documentElement.setAttribute("data-preloader", "disable");
					document.getElementById("customizerclose-btn").click();
				}
			});
		});

		if (document.getElementById('collapseBgGradient')) {
			Array.from(document.querySelectorAll("#collapseBgGradient .form-check input")).forEach(function (subElem) {
				var myCollapse = document.getElementById('collapseBgGradient');
				if ((subElem.checked == true)) {
					var bsCollapse = new bootstrap.Collapse(myCollapse, {
						toggle: false,
					});
					bsCollapse.show();
				}

				if (document.querySelector("[data-bs-target='#collapseBgGradient']")) {
					document.querySelector("[data-bs-target='#collapseBgGradient']").addEventListener('click', function (elem) {
						document.getElementById("sidebar-color-gradient").click();
					});

				}
			});

			Array.from(document.querySelectorAll('[data-bs-target="#collapseBgGradient.show"]')).forEach(function (subElem) {
				subElem.addEventListener("click", function () {
					var myCollapse = document.getElementById('collapseBgGradient');
					var bsCollapse = new bootstrap.Collapse(myCollapse, {
						toggle: false,
					});
					bsCollapse.hide();
				});
			});
		}

		Array.from(document.querySelectorAll("[name='data-sidebar']")).forEach(function (elem) {
			if (document.querySelector("[data-bs-target='#collapseBgGradient']")) {
				if (document.querySelector("#collapseBgGradient .form-check input:checked")) {
					document.querySelector("[data-bs-target='#collapseBgGradient']").classList.add("active");
				} else {
					document.querySelector("[data-bs-target='#collapseBgGradient']").classList.remove("active");
				}

				elem.addEventListener("change", function () {
					if (document.querySelector("#collapseBgGradient .form-check input:checked")) {
						document.querySelector("[data-bs-target='#collapseBgGradient']").classList.add("active");
					} else {
						document.querySelector("[data-bs-target='#collapseBgGradient']").classList.remove("active");
					}
				});
			}
		});

		// collapseLayoutWidth
		if (document.getElementById('collapseLayoutWidth')) {
			Array.from(document.querySelectorAll('[name="data-body-image"]')).forEach(function (subElem) {
				var myCollapse = document.getElementById('collapseLayoutWidth');
				if (subElem.checked == true && document.getElementById("data-body-image-none").checked == false) {
					var bsCollapse = new bootstrap.Collapse(myCollapse, {
						toggle: false,
					});
					bsCollapse.show();
				}

				if (document.querySelector("[data-bs-target='#collapseLayoutWidth']")) {
					document.querySelector("[data-bs-target='#collapseLayoutWidth']").addEventListener('click', function (elem) {
						document.getElementById("data-body-image-2").click();
					});
				}
			});

			Array.from(document.querySelectorAll('[data-bs-target="#collapseLayoutWidth.show"]')).forEach(function (subElem) {
				subElem.addEventListener("click", function () {
					var myCollapse = document.getElementById('collapseLayoutWidth');
					var bsCollapse = new bootstrap.Collapse(myCollapse, {
						toggle: false,
					});
					bsCollapse.hide();

					document.getElementById("data-body-image-none").click();
				});
			});
		}

		Array.from(document.querySelectorAll("[name='data-layout-width']")).forEach(function (elem) {
			if (document.querySelector("[data-bs-target='#collapseLayoutWidth']")) {
				if (document.querySelector("#collapseLayoutWidth .form-check input:checked")) {
					document.querySelector("[data-bs-target='#collapseLayoutWidth']").classList.add("active");
				} else {
					document.querySelector("[data-bs-target='#collapseLayoutWidth']").classList.remove("active");
				}

				elem.addEventListener("change", function () {
					if (document.querySelector("#collapseLayoutWidth .form-check input:checked")) {
						document.querySelector("[data-bs-target='#collapseLayoutWidth']").classList.add("active");
					} else {
						document.querySelector("[data-bs-target='#collapseLayoutWidth']").classList.remove("active");
					}
				});
			}
		});
	}

	function initFullScreen () {
		var fullscreenBtn = document.querySelector('[data-toggle="fullscreen"]');
		fullscreenBtn &&
			fullscreenBtn.addEventListener("click", function (e) {
				e.preventDefault();
				document.body.classList.toggle("fullscreen-enable");
				if (!document.fullscreenElement &&
					/* alternative standard method */
					!document.mozFullScreenElement &&
					!document.webkitFullscreenElement
				) {
					// current working methods
					if (document.documentElement.requestFullscreen) {
						document.documentElement.requestFullscreen();
					} else if (document.documentElement.mozRequestFullScreen) {
						document.documentElement.mozRequestFullScreen();
					} else if (document.documentElement.webkitRequestFullscreen) {
						document.documentElement.webkitRequestFullscreen(
							Element.ALLOW_KEYBOARD_INPUT
						);
					}
				} else {
					if (document.cancelFullScreen) {
						document.cancelFullScreen();
					} else if (document.mozCancelFullScreen) {
						document.mozCancelFullScreen();
					} else if (document.webkitCancelFullScreen) {
						document.webkitCancelFullScreen();
					}
				}
			});

		document.addEventListener("fullscreenchange", exitHandler);
		document.addEventListener("webkitfullscreenchange", exitHandler);
		document.addEventListener("mozfullscreenchange", exitHandler);

		function exitHandler () {
			if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
				document.body.classList.remove("fullscreen-enable");
			}
		}
	}

	function resetLayout () {
		if (document.getElementById("reset-layout")) {
			document.getElementById("reset-layout").addEventListener("click", function () {
				sessionStorage.clear();
				window.location.reload();
			});
		}
	}


	function init () {
		isCustomDropdown();
		isCustomDropdownResponsive();
		initFullScreen();
		windowLoadContent();
		counter();
		initLeftMenuCollapse();
		initTopbarComponents();
		initComponents();
		resetLayout();
		pluginData();
		initLanguage();
		isCollapseMenu();
		initMenuItemScroll();
	}
	init();

	var timeOutFunctionId;

	function setResize () {
		var currentLayout = document.documentElement.getAttribute("data-layout");
		if (currentLayout !== "horizontal") {
			if (document.getElementById("navbar-nav")) {
				var simpleBar = new SimpleBar(document.getElementById("navbar-nav"));
				if (simpleBar) simpleBar.getContentElement();
			}

			clearTimeout(timeOutFunctionId);
		}
	}

	window.addEventListener("resize", function () {
		if (timeOutFunctionId) clearTimeout(timeOutFunctionId);
		timeOutFunctionId = setTimeout(setResize, 2000);
	});
})();


//
/********************* scroll top js ************************/
//

var mybutton = document.getElementById("back-to-top");

if (mybutton) {
	// When the user scrolls down 20px from the top of the document, show the button
	window.onscroll = function () {
		scrollFunction();
	};

	function scrollFunction () {
		if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
			mybutton.style.display = "block";
		} else {
			mybutton.style.display = "none";
		}
	}

	// When the user clicks on the button, scroll to the top of the document
	function topFunction () {
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;
	}
}

//chat bot
function chatBot () {
	var chatbot = document.getElementById("chatBot");
	if (chatbot) {
		chatbot.classList.remove("show");
	}
}

// top-tagbar current time
setInterval(() => {
	// date
	var d = new Date();
	var dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
	var date = d.toLocaleDateString(undefined, dateOptions);
	// time
	var hours = d.getHours();
	var ampm = hours >= 12 ? ' PM' : ' AM';
	var hours = hours % 12;
	var time = ("0" + hours).slice(-2) + ':' + ("0" + d.getMinutes()).slice(-2) + ampm;

	document.getElementById("current-time").innerHTML = date + " | " + time;
}, 1000);


// Scroll to Bottom
function scrollToBottom (id) {
	setTimeout(function () {
		var simpleBar = (document.getElementById(id).querySelector("#chat-conversation .simplebar-content-wrapper")) ?
			document.getElementById(id).querySelector("#chat-conversation .simplebar-content-wrapper") : '';

		var offsetHeight = document.getElementsByClassName("chat-conversation-list")[0] ?
			document.getElementById(id).getElementsByClassName("chat-conversation-list")[0].scrollHeight - window.innerHeight + 800 : 0;

		if (offsetHeight)
			simpleBar.scrollTo({
				top: offsetHeight,
				behavior: "smooth"
			});
	}, 100);
}


const chatCollapsible = document.getElementById('chatBot');
chatCollapsible.addEventListener('shown.bs.collapse', event => {
	// chat
	var currentChatId = "users-chat-widget";
	scrollToBottom(currentChatId);
});
