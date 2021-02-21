/**
 * 
 * @param {Object} obj object
 */
export function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}

/**
 * 
 * @param {Event} evt element which x & y coordinates relate to
 */
export function getMousePosition(evt) {
    const { left, top } = evt.target.getBoundingClientRect()
    const x = evt.clientX - left;
    const y = evt.clientY - top;
    return { x, y };
}