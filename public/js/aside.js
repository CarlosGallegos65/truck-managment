/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/animateAside.js":
/*!********************************!*\
  !*** ./src/js/animateAside.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nconst btnMenu = document.querySelector('#btnMenu');\nconst menu = document.querySelector('#menu');\nconst asideLink = document.querySelector('.active');\nmenu.classList.remove('translate-x-full');\n\ndocument.addEventListener('DOMContentLoaded', () => {\n    btnMenu.addEventListener('click', translateAside);\n    \n    // Change aside links color\n    asideLinksColor(asideLink);\n});\n\nfunction translateAside(e) {\n    e.preventDefault();\n    menu.classList.toggle('translate-x-full');\n}\n\nfunction asideLinksColor(link) {\n    link.classList.add('bg-blue-700', 'rounded-full', 'py-1', 'px-3');\n}\n\n//# sourceURL=webpack://truck-managment/./src/js/animateAside.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/animateAside.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;