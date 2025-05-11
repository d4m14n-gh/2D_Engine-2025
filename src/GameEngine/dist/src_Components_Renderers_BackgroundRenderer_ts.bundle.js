/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ var __webpack_modules__ = ({

/***/ "./src/Components/Renderers/BackgroundRenderer.ts":
/*!********************************************************!*\
  !*** ./src/Components/Renderers/BackgroundRenderer.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nasync function drawHexGrid(context, gridSize, dotSize, lineColor, scale) {\n    const canvasWidth = context.canvas.width;\n    const canvasHeight = context.canvas.height;\n    const size = gridSize.x * Math.abs(scale.x) / 2;\n    const width = Math.sqrt(3) * size;\n    const height = 2 * size;\n    const vertSpacing = 0.75 * height;\n    context.strokeStyle = lineColor;\n    context.lineWidth = dotSize * scale.x;\n    function drawHexagon(cx, cy) {\n        context.beginPath();\n        for (let i = 0; i < 6; i++) {\n            const angle = Math.PI / 180 * (60 * i - 30); // pointy-top\n            const x = cx + size * Math.cos(angle);\n            const y = cy + size * Math.sin(angle);\n            if (i === 0)\n                context.moveTo(x, y);\n            else\n                context.lineTo(x, y);\n        }\n        context.closePath();\n        context.shadowColor = 'rgba(0, 0, 0, 0.75)';\n        context.shadowBlur = 55;\n        context.stroke();\n    }\n    for (let row = 0; row * vertSpacing < canvasHeight + height; row++) {\n        const y = (canvasHeight / 2) % (3 * size) + row * vertSpacing;\n        const offsetX = (row % 2) * (width / 2);\n        for (let col = 0; col * width + offsetX < canvasWidth + width; col++) {\n            const x = (canvasWidth / 2) % width + col * width + offsetX;\n            drawHexagon(x, y);\n            await new Promise(r => setTimeout(r, 0));\n        }\n    }\n    context.setTransform(1, 0, 0, 1, 0, 0);\n    context.shadowBlur = 0;\n}\nasync function drawGrid(context, gridSize, dotSize, lineColor, scale) {\n    const canvasWidth = context.canvas.width;\n    const canvasHeight = context.canvas.height;\n    gridSize.x *= Math.abs(scale.x);\n    gridSize.y *= Math.abs(scale.y);\n    context.strokeStyle = lineColor;\n    context.lineWidth = dotSize * scale.x;\n    context.beginPath();\n    for (let x = (canvasWidth / 2) % gridSize.x; x <= canvasWidth; x += gridSize.x) {\n        context.moveTo(x, 0);\n        context.lineTo(x, canvasHeight);\n        // await new Promise(r => setTimeout(r, 10));\n    }\n    for (let y = (canvasHeight / 2) % gridSize.y; y <= canvasHeight; y += gridSize.y) {\n        context.moveTo(0, y);\n        context.lineTo(canvasWidth, y);\n        // await new Promise(r => setTimeout(r, 10));\n    }\n    context.stroke();\n    context.setTransform(1, 0, 0, 1, 0, 0);\n    context.shadowBlur = 0;\n}\nasync function drawDotGrid(context, gridSize, dotSize, dotColor, scale) {\n    const canvasWidth = context.canvas.width;\n    const canvasHeight = context.canvas.height;\n    gridSize.x *= scale.x;\n    gridSize.y *= scale.y;\n    dotSize *= scale.x;\n    context.fillStyle = dotColor;\n    for (let y = (canvasHeight / 2) % gridSize.y; y <= canvasHeight; y += gridSize.y) {\n        for (let x = (canvasWidth / 2) % gridSize.x; x <= canvasWidth; x += gridSize.x) {\n            context.beginPath();\n            context.arc(x, y, dotSize / 2, 0, Math.PI * 2);\n            context.fill();\n            context.shadowColor = 'rgba(0, 0, 0, 0.75)';\n            context.shadowBlur = 35;\n            context.stroke();\n            await new Promise(r => setTimeout(r, 1));\n        }\n    }\n    context.setTransform(1, 0, 0, 1, 0, 0);\n    context.shadowBlur = 0;\n}\nonmessage = async (event) => {\n    const offscreenCanvas = event.data.canvas;\n    const ctx = offscreenCanvas.getContext(\"2d\");\n    if (!ctx)\n        return;\n    let args = event.data.args;\n    // await drawDotGrid(ctx, args[0], 0.1, args[2], args[3]);\n    await drawGrid(ctx, args[0], 0.075, args[2], args[3]);\n    // await drawHexGrid(ctx, args[0], 0.05, args[2], args[3]);\n};\n\n\n\n//# sourceURL=webpack://gameengine/./src/Components/Renderers/BackgroundRenderer.ts?");

/***/ })

/******/ });
/************************************************************************/
/******/ // The require scope
/******/ var __webpack_require__ = {};
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module can't be inlined because the eval devtool is used.
/******/ var __webpack_exports__ = {};
/******/ __webpack_modules__["./src/Components/Renderers/BackgroundRenderer.ts"](0, __webpack_exports__, __webpack_require__);
/******/ 
