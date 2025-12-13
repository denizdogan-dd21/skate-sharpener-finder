"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/[...nextauth]/route";
exports.ids = ["app/api/auth/[...nextauth]/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2FUsers%2Fdenizdogan%2FWorkspace%2FSharpeningApp%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fdenizdogan%2FWorkspace%2FSharpeningApp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2FUsers%2Fdenizdogan%2FWorkspace%2FSharpeningApp%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fdenizdogan%2FWorkspace%2FSharpeningApp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   headerHooks: () => (/* binding */ headerHooks),\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage),\n/* harmony export */   staticGenerationBailout: () => (/* binding */ staticGenerationBailout)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_denizdogan_Workspace_SharpeningApp_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/auth/[...nextauth]/route.ts */ \"(rsc)/./app/api/auth/[...nextauth]/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/[...nextauth]/route\",\n        pathname: \"/api/auth/[...nextauth]\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/[...nextauth]/route\"\n    },\n    resolvedPagePath: \"/Users/denizdogan/Workspace/SharpeningApp/app/api/auth/[...nextauth]/route.ts\",\n    nextConfigOutput,\n    userland: _Users_denizdogan_Workspace_SharpeningApp_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks, headerHooks, staticGenerationBailout } = routeModule;\nconst originalPathname = \"/api/auth/[...nextauth]/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGJTVCLi4ubmV4dGF1dGglNUQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmRlbml6ZG9nYW4lMkZXb3Jrc3BhY2UlMkZTaGFycGVuaW5nQXBwJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZVc2VycyUyRmRlbml6ZG9nYW4lMkZXb3Jrc3BhY2UlMkZTaGFycGVuaW5nQXBwJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUNjO0FBQzZCO0FBQzFHO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnSEFBbUI7QUFDM0M7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsdUdBQXVHO0FBQy9HO0FBQ0E7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDNko7O0FBRTdKIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2thdGUtc2hhcnBlbmVyLWZpbmRlci8/OTJmOCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvVXNlcnMvZGVuaXpkb2dhbi9Xb3Jrc3BhY2UvU2hhcnBlbmluZ0FwcC9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvZGVuaXpkb2dhbi9Xb3Jrc3BhY2UvU2hhcnBlbmluZ0FwcC9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBoZWFkZXJIb29rcywgc3RhdGljR2VuZXJhdGlvbkJhaWxvdXQgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGVcIjtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgc2VydmVySG9va3MsXG4gICAgICAgIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgaGVhZGVySG9va3MsIHN0YXRpY0dlbmVyYXRpb25CYWlsb3V0LCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2FUsers%2Fdenizdogan%2FWorkspace%2FSharpeningApp%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fdenizdogan%2FWorkspace%2FSharpeningApp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/auth/[...nextauth]/route.ts":
/*!*********************************************!*\
  !*** ./app/api/auth/[...nextauth]/route.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ handler),\n/* harmony export */   POST: () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _lib_authOptions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/authOptions */ \"(rsc)/./lib/authOptions.ts\");\n\n\nconst handler = next_auth__WEBPACK_IMPORTED_MODULE_0___default()(_lib_authOptions__WEBPACK_IMPORTED_MODULE_1__.authOptions);\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFnQztBQUNlO0FBRS9DLE1BQU1FLFVBQVVGLGdEQUFRQSxDQUFDQyx5REFBV0E7QUFFTSIsInNvdXJjZXMiOlsid2VicGFjazovL3NrYXRlLXNoYXJwZW5lci1maW5kZXIvLi9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50cz9jOGE0Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBOZXh0QXV0aCBmcm9tICduZXh0LWF1dGgnXG5pbXBvcnQgeyBhdXRoT3B0aW9ucyB9IGZyb20gJ0AvbGliL2F1dGhPcHRpb25zJ1xuXG5jb25zdCBoYW5kbGVyID0gTmV4dEF1dGgoYXV0aE9wdGlvbnMpXG5cbmV4cG9ydCB7IGhhbmRsZXIgYXMgR0VULCBoYW5kbGVyIGFzIFBPU1QgfVxuIl0sIm5hbWVzIjpbIk5leHRBdXRoIiwiYXV0aE9wdGlvbnMiLCJoYW5kbGVyIiwiR0VUIiwiUE9TVCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/[...nextauth]/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth.ts":
/*!*********************!*\
  !*** ./lib/auth.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   hashPassword: () => (/* binding */ hashPassword),\n/* harmony export */   validateEmail: () => (/* binding */ validateEmail),\n/* harmony export */   validatePassword: () => (/* binding */ validatePassword),\n/* harmony export */   validatePhone: () => (/* binding */ validatePhone),\n/* harmony export */   verifyPassword: () => (/* binding */ verifyPassword)\n/* harmony export */ });\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_0__);\n\nconst SALT_ROUNDS = 12;\nasync function hashPassword(password) {\n    return await bcryptjs__WEBPACK_IMPORTED_MODULE_0___default().hash(password, SALT_ROUNDS);\n}\nasync function verifyPassword(password, hashedPassword) {\n    return await bcryptjs__WEBPACK_IMPORTED_MODULE_0___default().compare(password, hashedPassword);\n}\nfunction validateEmail(email) {\n    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n    return emailRegex.test(email);\n}\nfunction validatePassword(password) {\n    if (password.length < 8) {\n        return {\n            valid: false,\n            message: \"Password must be at least 8 characters long\"\n        };\n    }\n    if (!/[A-Z]/.test(password)) {\n        return {\n            valid: false,\n            message: \"Password must contain at least one uppercase letter\"\n        };\n    }\n    if (!/[a-z]/.test(password)) {\n        return {\n            valid: false,\n            message: \"Password must contain at least one lowercase letter\"\n        };\n    }\n    if (!/[0-9]/.test(password)) {\n        return {\n            valid: false,\n            message: \"Password must contain at least one number\"\n        };\n    }\n    return {\n        valid: true\n    };\n}\nfunction validatePhone(phone) {\n    const phoneRegex = /^\\+?[\\d\\s\\-\\(\\)]+$/;\n    return phoneRegex.test(phone) && phone.replace(/\\D/g, \"\").length >= 10;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYXV0aC50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQTZCO0FBRTdCLE1BQU1DLGNBQWM7QUFFYixlQUFlQyxhQUFhQyxRQUFnQjtJQUNqRCxPQUFPLE1BQU1ILG9EQUFXLENBQUNHLFVBQVVGO0FBQ3JDO0FBRU8sZUFBZUksZUFBZUYsUUFBZ0IsRUFBRUcsY0FBc0I7SUFDM0UsT0FBTyxNQUFNTix1REFBYyxDQUFDRyxVQUFVRztBQUN4QztBQUVPLFNBQVNFLGNBQWNDLEtBQWE7SUFDekMsTUFBTUMsYUFBYTtJQUNuQixPQUFPQSxXQUFXQyxJQUFJLENBQUNGO0FBQ3pCO0FBRU8sU0FBU0csaUJBQWlCVCxRQUFnQjtJQUMvQyxJQUFJQSxTQUFTVSxNQUFNLEdBQUcsR0FBRztRQUN2QixPQUFPO1lBQUVDLE9BQU87WUFBT0MsU0FBUztRQUE4QztJQUNoRjtJQUNBLElBQUksQ0FBQyxRQUFRSixJQUFJLENBQUNSLFdBQVc7UUFDM0IsT0FBTztZQUFFVyxPQUFPO1lBQU9DLFNBQVM7UUFBc0Q7SUFDeEY7SUFDQSxJQUFJLENBQUMsUUFBUUosSUFBSSxDQUFDUixXQUFXO1FBQzNCLE9BQU87WUFBRVcsT0FBTztZQUFPQyxTQUFTO1FBQXNEO0lBQ3hGO0lBQ0EsSUFBSSxDQUFDLFFBQVFKLElBQUksQ0FBQ1IsV0FBVztRQUMzQixPQUFPO1lBQUVXLE9BQU87WUFBT0MsU0FBUztRQUE0QztJQUM5RTtJQUNBLE9BQU87UUFBRUQsT0FBTztJQUFLO0FBQ3ZCO0FBRU8sU0FBU0UsY0FBY0MsS0FBYTtJQUN6QyxNQUFNQyxhQUFhO0lBQ25CLE9BQU9BLFdBQVdQLElBQUksQ0FBQ00sVUFBVUEsTUFBTUUsT0FBTyxDQUFDLE9BQU8sSUFBSU4sTUFBTSxJQUFJO0FBQ3RFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2thdGUtc2hhcnBlbmVyLWZpbmRlci8uL2xpYi9hdXRoLnRzP2JmN2UiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJjcnlwdCBmcm9tICdiY3J5cHRqcydcblxuY29uc3QgU0FMVF9ST1VORFMgPSAxMlxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFzaFBhc3N3b3JkKHBhc3N3b3JkOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICByZXR1cm4gYXdhaXQgYmNyeXB0Lmhhc2gocGFzc3dvcmQsIFNBTFRfUk9VTkRTKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdmVyaWZ5UGFzc3dvcmQocGFzc3dvcmQ6IHN0cmluZywgaGFzaGVkUGFzc3dvcmQ6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICByZXR1cm4gYXdhaXQgYmNyeXB0LmNvbXBhcmUocGFzc3dvcmQsIGhhc2hlZFBhc3N3b3JkKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVFbWFpbChlbWFpbDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IGVtYWlsUmVnZXggPSAvXlteXFxzQF0rQFteXFxzQF0rXFwuW15cXHNAXSskL1xuICByZXR1cm4gZW1haWxSZWdleC50ZXN0KGVtYWlsKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVQYXNzd29yZChwYXNzd29yZDogc3RyaW5nKTogeyB2YWxpZDogYm9vbGVhbjsgbWVzc2FnZT86IHN0cmluZyB9IHtcbiAgaWYgKHBhc3N3b3JkLmxlbmd0aCA8IDgpIHtcbiAgICByZXR1cm4geyB2YWxpZDogZmFsc2UsIG1lc3NhZ2U6ICdQYXNzd29yZCBtdXN0IGJlIGF0IGxlYXN0IDggY2hhcmFjdGVycyBsb25nJyB9XG4gIH1cbiAgaWYgKCEvW0EtWl0vLnRlc3QocGFzc3dvcmQpKSB7XG4gICAgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlLCBtZXNzYWdlOiAnUGFzc3dvcmQgbXVzdCBjb250YWluIGF0IGxlYXN0IG9uZSB1cHBlcmNhc2UgbGV0dGVyJyB9XG4gIH1cbiAgaWYgKCEvW2Etel0vLnRlc3QocGFzc3dvcmQpKSB7XG4gICAgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlLCBtZXNzYWdlOiAnUGFzc3dvcmQgbXVzdCBjb250YWluIGF0IGxlYXN0IG9uZSBsb3dlcmNhc2UgbGV0dGVyJyB9XG4gIH1cbiAgaWYgKCEvWzAtOV0vLnRlc3QocGFzc3dvcmQpKSB7XG4gICAgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlLCBtZXNzYWdlOiAnUGFzc3dvcmQgbXVzdCBjb250YWluIGF0IGxlYXN0IG9uZSBudW1iZXInIH1cbiAgfVxuICByZXR1cm4geyB2YWxpZDogdHJ1ZSB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVBob25lKHBob25lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgcGhvbmVSZWdleCA9IC9eXFwrP1tcXGRcXHNcXC1cXChcXCldKyQvXG4gIHJldHVybiBwaG9uZVJlZ2V4LnRlc3QocGhvbmUpICYmIHBob25lLnJlcGxhY2UoL1xcRC9nLCAnJykubGVuZ3RoID49IDEwXG59XG4iXSwibmFtZXMiOlsiYmNyeXB0IiwiU0FMVF9ST1VORFMiLCJoYXNoUGFzc3dvcmQiLCJwYXNzd29yZCIsImhhc2giLCJ2ZXJpZnlQYXNzd29yZCIsImhhc2hlZFBhc3N3b3JkIiwiY29tcGFyZSIsInZhbGlkYXRlRW1haWwiLCJlbWFpbCIsImVtYWlsUmVnZXgiLCJ0ZXN0IiwidmFsaWRhdGVQYXNzd29yZCIsImxlbmd0aCIsInZhbGlkIiwibWVzc2FnZSIsInZhbGlkYXRlUGhvbmUiLCJwaG9uZSIsInBob25lUmVnZXgiLCJyZXBsYWNlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./lib/authOptions.ts":
/*!****************************!*\
  !*** ./lib/authOptions.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions)\n/* harmony export */ });\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.ts\");\n\n\n\nconst authOptions = {\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            id: \"credentials\",\n            name: \"Credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"email\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                },\n                accountType: {\n                    label: \"Account Type\",\n                    type: \"text\"\n                }\n            },\n            async authorize (credentials) {\n                if (!credentials?.email || !credentials?.password || !credentials?.accountType) {\n                    throw new Error(\"Missing credentials\");\n                }\n                if (!(0,_lib_auth__WEBPACK_IMPORTED_MODULE_2__.validateEmail)(credentials.email)) {\n                    throw new Error(\"Invalid email format\");\n                }\n                if (credentials.accountType !== \"user\" && credentials.accountType !== \"sharpener\") {\n                    throw new Error(\"Invalid account type\");\n                }\n                try {\n                    if (credentials.accountType === \"user\") {\n                        const user = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.user.findUnique({\n                            where: {\n                                email: credentials.email\n                            }\n                        });\n                        if (!user) {\n                            throw new Error(\"Invalid credentials\");\n                        }\n                        const isPasswordValid = await (0,_lib_auth__WEBPACK_IMPORTED_MODULE_2__.verifyPassword)(credentials.password, user.password);\n                        if (!isPasswordValid) {\n                            throw new Error(\"Invalid credentials\");\n                        }\n                        // Check if email is verified\n                        if (!user.isEmailVerified) {\n                            throw new Error(\"Please verify your email before logging in. Check your inbox for the verification link.\");\n                        }\n                        return {\n                            id: user.userId,\n                            email: user.email,\n                            firstName: user.firstName,\n                            lastName: user.lastName,\n                            phone: user.phone,\n                            accountType: \"user\"\n                        };\n                    } else {\n                        const sharpener = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.sharpener.findUnique({\n                            where: {\n                                email: credentials.email\n                            }\n                        });\n                        if (!sharpener) {\n                            throw new Error(\"Invalid credentials\");\n                        }\n                        const isPasswordValid = await (0,_lib_auth__WEBPACK_IMPORTED_MODULE_2__.verifyPassword)(credentials.password, sharpener.password);\n                        if (!isPasswordValid) {\n                            throw new Error(\"Invalid credentials\");\n                        }\n                        // Check if email is verified\n                        if (!sharpener.isEmailVerified) {\n                            throw new Error(\"Please verify your email before logging in. Check your inbox for the verification link.\");\n                        }\n                        return {\n                            id: sharpener.sharpenerId,\n                            email: sharpener.email,\n                            firstName: sharpener.firstName,\n                            lastName: sharpener.lastName,\n                            phone: sharpener.phone,\n                            accountType: \"sharpener\"\n                        };\n                    }\n                } catch (error) {\n                    console.error(\"Authorization error:\", error);\n                    throw error;\n                }\n            }\n        })\n    ],\n    callbacks: {\n        async jwt ({ token, user }) {\n            if (user) {\n                token.id = user.id;\n                token.accountType = user.accountType;\n                token.firstName = user.firstName;\n                token.lastName = user.lastName;\n                token.phone = user.phone;\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            if (token) {\n                session.user = {\n                    id: token.id,\n                    email: token.email,\n                    firstName: token.firstName,\n                    lastName: token.lastName,\n                    phone: token.phone,\n                    accountType: token.accountType\n                };\n            }\n            return session;\n        }\n    },\n    pages: {\n        signIn: \"/auth/login\",\n        error: \"/auth/login\"\n    },\n    session: {\n        strategy: \"jwt\",\n        maxAge: 30 * 24 * 60 * 60\n    },\n    secret: process.env.NEXTAUTH_SECRET\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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ZixJQUFJLEVBQUU7WUFDdkIsSUFBSUEsTUFBTTtnQkFDUmUsTUFBTXpCLEVBQUUsR0FBR1UsS0FBS1YsRUFBRTtnQkFDbEJ5QixNQUFNbEIsV0FBVyxHQUFHRyxLQUFLSCxXQUFXO2dCQUNwQ2tCLE1BQU1ULFNBQVMsR0FBR04sS0FBS00sU0FBUztnQkFDaENTLE1BQU1SLFFBQVEsR0FBR1AsS0FBS08sUUFBUTtnQkFDOUJRLE1BQU1QLEtBQUssR0FBR1IsS0FBS1EsS0FBSztZQUMxQjtZQUNBLE9BQU9PO1FBQ1Q7UUFDQSxNQUFNQyxTQUFRLEVBQUVBLE9BQU8sRUFBRUQsS0FBSyxFQUFFO1lBQzlCLElBQUlBLE9BQU87Z0JBQ1RDLFFBQVFoQixJQUFJLEdBQUc7b0JBQ2JWLElBQUl5QixNQUFNekIsRUFBRTtvQkFDWkcsT0FBT3NCLE1BQU10QixLQUFLO29CQUNsQmEsV0FBV1MsTUFBTVQsU0FBUztvQkFDMUJDLFVBQVVRLE1BQU1SLFFBQVE7b0JBQ3hCQyxPQUFPTyxNQUFNUCxLQUFLO29CQUNsQlgsYUFBYWtCLE1BQU1sQixXQUFXO2dCQUNoQztZQUNGO1lBQ0EsT0FBT21CO1FBQ1Q7SUFDRjtJQUNBQyxPQUFPO1FBQ0xDLFFBQVE7UUFDUlAsT0FBTztJQUNUO0lBQ0FLLFNBQVM7UUFDUEcsVUFBVTtRQUNWQyxRQUFRLEtBQUssS0FBSyxLQUFLO0lBQ3pCO0lBQ0FDLFFBQVFDLFFBQVFDLEdBQUcsQ0FBQ0MsZUFBZTtBQUNyQyxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2thdGUtc2hhcnBlbmVyLWZpbmRlci8uL2xpYi9hdXRoT3B0aW9ucy50cz85MTExIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRBdXRoT3B0aW9ucyB9IGZyb20gJ25leHQtYXV0aCdcbmltcG9ydCBDcmVkZW50aWFsc1Byb3ZpZGVyIGZyb20gJ25leHQtYXV0aC9wcm92aWRlcnMvY3JlZGVudGlhbHMnXG5pbXBvcnQgeyBwcmlzbWEgfSBmcm9tICdAL2xpYi9wcmlzbWEnXG5pbXBvcnQgeyB2ZXJpZnlQYXNzd29yZCwgdmFsaWRhdGVFbWFpbCB9IGZyb20gJ0AvbGliL2F1dGgnXG5pbXBvcnQgdHlwZSB7IFVzZXIsIFNoYXJwZW5lciB9IGZyb20gJ0AvdHlwZXMnXG5cbmRlY2xhcmUgbW9kdWxlICduZXh0LWF1dGgnIHtcbiAgaW50ZXJmYWNlIFNlc3Npb24ge1xuICAgIHVzZXI6IHtcbiAgICAgIGlkOiBudW1iZXJcbiAgICAgIGVtYWlsOiBzdHJpbmdcbiAgICAgIGZpcnN0TmFtZTogc3RyaW5nXG4gICAgICBsYXN0TmFtZTogc3RyaW5nXG4gICAgICBwaG9uZTogc3RyaW5nXG4gICAgICBhY2NvdW50VHlwZTogJ3VzZXInIHwgJ3NoYXJwZW5lcidcbiAgICB9XG4gIH1cblxuICBpbnRlcmZhY2UgVXNlciB7XG4gICAgaWQ6IG51bWJlclxuICAgIGVtYWlsOiBzdHJpbmdcbiAgICBmaXJzdE5hbWU6IHN0cmluZ1xuICAgIGxhc3ROYW1lOiBzdHJpbmdcbiAgICBwaG9uZTogc3RyaW5nXG4gICAgYWNjb3VudFR5cGU6ICd1c2VyJyB8ICdzaGFycGVuZXInXG4gIH1cbn1cblxuZGVjbGFyZSBtb2R1bGUgJ25leHQtYXV0aC9qd3QnIHtcbiAgaW50ZXJmYWNlIEpXVCB7XG4gICAgaWQ6IG51bWJlclxuICAgIGFjY291bnRUeXBlOiAndXNlcicgfCAnc2hhcnBlbmVyJ1xuICAgIGZpcnN0TmFtZTogc3RyaW5nXG4gICAgbGFzdE5hbWU6IHN0cmluZ1xuICAgIHBob25lOiBzdHJpbmdcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgYXV0aE9wdGlvbnM6IE5leHRBdXRoT3B0aW9ucyA9IHtcbiAgcHJvdmlkZXJzOiBbXG4gICAgQ3JlZGVudGlhbHNQcm92aWRlcih7XG4gICAgICBpZDogJ2NyZWRlbnRpYWxzJyxcbiAgICAgIG5hbWU6ICdDcmVkZW50aWFscycsXG4gICAgICBjcmVkZW50aWFsczoge1xuICAgICAgICBlbWFpbDogeyBsYWJlbDogJ0VtYWlsJywgdHlwZTogJ2VtYWlsJyB9LFxuICAgICAgICBwYXNzd29yZDogeyBsYWJlbDogJ1Bhc3N3b3JkJywgdHlwZTogJ3Bhc3N3b3JkJyB9LFxuICAgICAgICBhY2NvdW50VHlwZTogeyBsYWJlbDogJ0FjY291bnQgVHlwZScsIHR5cGU6ICd0ZXh0JyB9LFxuICAgICAgfSxcbiAgICAgIGFzeW5jIGF1dGhvcml6ZShjcmVkZW50aWFscykge1xuICAgICAgICBpZiAoIWNyZWRlbnRpYWxzPy5lbWFpbCB8fCAhY3JlZGVudGlhbHM/LnBhc3N3b3JkIHx8ICFjcmVkZW50aWFscz8uYWNjb3VudFR5cGUpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgY3JlZGVudGlhbHMnKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF2YWxpZGF0ZUVtYWlsKGNyZWRlbnRpYWxzLmVtYWlsKSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBlbWFpbCBmb3JtYXQnKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNyZWRlbnRpYWxzLmFjY291bnRUeXBlICE9PSAndXNlcicgJiYgY3JlZGVudGlhbHMuYWNjb3VudFR5cGUgIT09ICdzaGFycGVuZXInKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGFjY291bnQgdHlwZScpXG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChjcmVkZW50aWFscy5hY2NvdW50VHlwZSA9PT0gJ3VzZXInKSB7XG4gICAgICAgICAgICBjb25zdCB1c2VyID0gYXdhaXQgcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7XG4gICAgICAgICAgICAgIHdoZXJlOiB7IGVtYWlsOiBjcmVkZW50aWFscy5lbWFpbCB9LFxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjcmVkZW50aWFscycpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGlzUGFzc3dvcmRWYWxpZCA9IGF3YWl0IHZlcmlmeVBhc3N3b3JkKGNyZWRlbnRpYWxzLnBhc3N3b3JkLCB1c2VyLnBhc3N3b3JkKVxuICAgICAgICAgICAgaWYgKCFpc1Bhc3N3b3JkVmFsaWQpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNyZWRlbnRpYWxzJylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgZW1haWwgaXMgdmVyaWZpZWRcbiAgICAgICAgICAgIGlmICghdXNlci5pc0VtYWlsVmVyaWZpZWQpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2UgdmVyaWZ5IHlvdXIgZW1haWwgYmVmb3JlIGxvZ2dpbmcgaW4uIENoZWNrIHlvdXIgaW5ib3ggZm9yIHRoZSB2ZXJpZmljYXRpb24gbGluay4nKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBpZDogdXNlci51c2VySWQsXG4gICAgICAgICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgICAgICAgICBmaXJzdE5hbWU6IHVzZXIuZmlyc3ROYW1lLFxuICAgICAgICAgICAgICBsYXN0TmFtZTogdXNlci5sYXN0TmFtZSxcbiAgICAgICAgICAgICAgcGhvbmU6IHVzZXIucGhvbmUsXG4gICAgICAgICAgICAgIGFjY291bnRUeXBlOiAndXNlcicgYXMgY29uc3QsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHNoYXJwZW5lciA9IGF3YWl0IHByaXNtYS5zaGFycGVuZXIuZmluZFVuaXF1ZSh7XG4gICAgICAgICAgICAgIHdoZXJlOiB7IGVtYWlsOiBjcmVkZW50aWFscy5lbWFpbCB9LFxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgaWYgKCFzaGFycGVuZXIpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNyZWRlbnRpYWxzJylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgaXNQYXNzd29yZFZhbGlkID0gYXdhaXQgdmVyaWZ5UGFzc3dvcmQoY3JlZGVudGlhbHMucGFzc3dvcmQsIHNoYXJwZW5lci5wYXNzd29yZClcbiAgICAgICAgICAgIGlmICghaXNQYXNzd29yZFZhbGlkKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjcmVkZW50aWFscycpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGlmIGVtYWlsIGlzIHZlcmlmaWVkXG4gICAgICAgICAgICBpZiAoIXNoYXJwZW5lci5pc0VtYWlsVmVyaWZpZWQpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2UgdmVyaWZ5IHlvdXIgZW1haWwgYmVmb3JlIGxvZ2dpbmcgaW4uIENoZWNrIHlvdXIgaW5ib3ggZm9yIHRoZSB2ZXJpZmljYXRpb24gbGluay4nKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBpZDogc2hhcnBlbmVyLnNoYXJwZW5lcklkLFxuICAgICAgICAgICAgICBlbWFpbDogc2hhcnBlbmVyLmVtYWlsLFxuICAgICAgICAgICAgICBmaXJzdE5hbWU6IHNoYXJwZW5lci5maXJzdE5hbWUsXG4gICAgICAgICAgICAgIGxhc3ROYW1lOiBzaGFycGVuZXIubGFzdE5hbWUsXG4gICAgICAgICAgICAgIHBob25lOiBzaGFycGVuZXIucGhvbmUsXG4gICAgICAgICAgICAgIGFjY291bnRUeXBlOiAnc2hhcnBlbmVyJyBhcyBjb25zdCxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignQXV0aG9yaXphdGlvbiBlcnJvcjonLCBlcnJvcilcbiAgICAgICAgICB0aHJvdyBlcnJvclxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pLFxuICBdLFxuICBjYWxsYmFja3M6IHtcbiAgICBhc3luYyBqd3QoeyB0b2tlbiwgdXNlciB9KSB7XG4gICAgICBpZiAodXNlcikge1xuICAgICAgICB0b2tlbi5pZCA9IHVzZXIuaWQgYXMgbnVtYmVyXG4gICAgICAgIHRva2VuLmFjY291bnRUeXBlID0gdXNlci5hY2NvdW50VHlwZVxuICAgICAgICB0b2tlbi5maXJzdE5hbWUgPSB1c2VyLmZpcnN0TmFtZVxuICAgICAgICB0b2tlbi5sYXN0TmFtZSA9IHVzZXIubGFzdE5hbWVcbiAgICAgICAgdG9rZW4ucGhvbmUgPSB1c2VyLnBob25lXG4gICAgICB9XG4gICAgICByZXR1cm4gdG9rZW5cbiAgICB9LFxuICAgIGFzeW5jIHNlc3Npb24oeyBzZXNzaW9uLCB0b2tlbiB9KSB7XG4gICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgc2Vzc2lvbi51c2VyID0ge1xuICAgICAgICAgIGlkOiB0b2tlbi5pZCxcbiAgICAgICAgICBlbWFpbDogdG9rZW4uZW1haWwgYXMgc3RyaW5nLFxuICAgICAgICAgIGZpcnN0TmFtZTogdG9rZW4uZmlyc3ROYW1lLFxuICAgICAgICAgIGxhc3ROYW1lOiB0b2tlbi5sYXN0TmFtZSxcbiAgICAgICAgICBwaG9uZTogdG9rZW4ucGhvbmUsXG4gICAgICAgICAgYWNjb3VudFR5cGU6IHRva2VuLmFjY291bnRUeXBlLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gc2Vzc2lvblxuICAgIH0sXG4gIH0sXG4gIHBhZ2VzOiB7XG4gICAgc2lnbkluOiAnL2F1dGgvbG9naW4nLFxuICAgIGVycm9yOiAnL2F1dGgvbG9naW4nLFxuICB9LFxuICBzZXNzaW9uOiB7XG4gICAgc3RyYXRlZ3k6ICdqd3QnLFxuICAgIG1heEFnZTogMzAgKiAyNCAqIDYwICogNjAsIC8vIDMwIGRheXNcbiAgfSxcbiAgc2VjcmV0OiBwcm9jZXNzLmVudi5ORVhUQVVUSF9TRUNSRVQsXG59XG4iXSwibmFtZXMiOlsiQ3JlZGVudGlhbHNQcm92aWRlciIsInByaXNtYSIsInZlcmlmeVBhc3N3b3JkIiwidmFsaWRhdGVFbWFpbCIsImF1dGhPcHRpb25zIiwicHJvdmlkZXJzIiwiaWQiLCJuYW1lIiwiY3JlZGVudGlhbHMiLCJlbWFpbCIsImxhYmVsIiwidHlwZSIsInBhc3N3b3JkIiwiYWNjb3VudFR5cGUiLCJhdXRob3JpemUiLCJFcnJvciIsInVzZXIiLCJmaW5kVW5pcXVlIiwid2hlcmUiLCJpc1Bhc3N3b3JkVmFsaWQiLCJpc0VtYWlsVmVyaWZpZWQiLCJ1c2VySWQiLCJmaXJzdE5hbWUiLCJsYXN0TmFtZSIsInBob25lIiwic2hhcnBlbmVyIiwic2hhcnBlbmVySWQiLCJlcnJvciIsImNvbnNvbGUiLCJjYWxsYmFja3MiLCJqd3QiLCJ0b2tlbiIsInNlc3Npb24iLCJwYWdlcyIsInNpZ25JbiIsInN0cmF0ZWd5IiwibWF4QWdlIiwic2VjcmV0IiwicHJvY2VzcyIsImVudiIsIk5FWFRBVVRIX1NFQ1JFVCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/authOptions.ts\n");

/***/ }),

/***/ "(rsc)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nif (true) globalForPrisma.prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcHJpc21hLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE2QztBQUU3QyxNQUFNQyxrQkFBa0JDO0FBSWpCLE1BQU1DLFNBQVNGLGdCQUFnQkUsTUFBTSxJQUFJLElBQUlILHdEQUFZQSxHQUFFO0FBRWxFLElBQUlJLElBQXlCLEVBQWNILGdCQUFnQkUsTUFBTSxHQUFHQSIsInNvdXJjZXMiOlsid2VicGFjazovL3NrYXRlLXNoYXJwZW5lci1maW5kZXIvLi9saWIvcHJpc21hLnRzPzk4MjIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSAnQHByaXNtYS9jbGllbnQnXG5cbmNvbnN0IGdsb2JhbEZvclByaXNtYSA9IGdsb2JhbFRoaXMgYXMgdW5rbm93biBhcyB7XG4gIHByaXNtYTogUHJpc21hQ2xpZW50IHwgdW5kZWZpbmVkXG59XG5cbmV4cG9ydCBjb25zdCBwcmlzbWEgPSBnbG9iYWxGb3JQcmlzbWEucHJpc21hID8/IG5ldyBQcmlzbWFDbGllbnQoKVxuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgZ2xvYmFsRm9yUHJpc21hLnByaXNtYSA9IHByaXNtYVxuIl0sIm5hbWVzIjpbIlByaXNtYUNsaWVudCIsImdsb2JhbEZvclByaXNtYSIsImdsb2JhbFRoaXMiLCJwcmlzbWEiLCJwcm9jZXNzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/uuid","vendor-chunks/oauth","vendor-chunks/@panva","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/bcryptjs","vendor-chunks/preact","vendor-chunks/oidc-token-hash","vendor-chunks/lru-cache","vendor-chunks/cookie"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2FUsers%2Fdenizdogan%2FWorkspace%2FSharpeningApp%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fdenizdogan%2FWorkspace%2FSharpeningApp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();