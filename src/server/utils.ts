export function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

export function duplicateElements(array) {
    const length = array.length;
    for (let i = 0; i < length; i++) {
      array.push(array[i]);
    }
    return array;
  }