import { Tree } from './binarytree.js';

function getRandomArray(size) {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * 100));
  }
  return arr;
}
const arr = getRandomArray(100);
const tree = new Tree(arr);

console.log(tree.isBalanced());
// tree.levelOrder(console.log);
tree.prettyPrint(tree.root);
