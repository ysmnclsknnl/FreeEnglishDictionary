/**
 * Find all child elements that have an `id` attribute.
 * @param {HTMLElement} root The root element to search.
 * @returns An object with key/value pairs of child elements that have an `id`
 * attribute. The `id` name is the key, and the value is the element.
 */

function findElementsWithIds(root) {
  const elements = root.querySelectorAll("[id]");
  return Array.from(elements).reduce((obj, element) => {
    obj[element.id] = element;
    return obj;
  }, {});
}

export default findElementsWithIds;
