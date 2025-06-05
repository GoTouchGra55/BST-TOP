class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

export class Tree {
  constructor(array) {
    // Remove duplicates, sort, then build balanced tree
    this.root = this.buildTree([...new Set(array)].sort((a, b) => a - b));
  }

  buildTree(array) {
    if (!array.length) return null;
    let mid = Math.floor(array.length / 2);
    let root = new Node(array[mid]);
    root.left = this.buildTree(array.slice(0, mid));
    root.right = this.buildTree(array.slice(mid + 1));
    return root;
  }

  prettyPrint(node = this.root, prefix = '', isLeft = true) {
    if (node === null) return;
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? '│   ' : '    '}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
    }
  }

  insert(value) {
    if (!this.root) {
      this.root = new Node(value);
      return;
    }
    let current = this.root;
    while (current) {
      if (value < current.data) {
        if (!current.left) {
          current.left = new Node(value);
          return;
        }
        current = current.left;
      } else if (value > current.data) {
        if (!current.right) {
          current.right = new Node(value);
          return;
        }
        current = current.right;
      } else {
        // Value already in tree, do nothing
        return;
      }
    }
  }

  deleteItem(node, value) {
    if (!node) return null;
    if (value < node.data) {
      node.left = this.deleteItem(node.left, value);
    } else if (value > node.data) {
      node.right = this.deleteItem(node.right, value);
    } else {
      // Node to delete found
      if (!node.left && !node.right) return null;
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      // Node has two children: find successor (smallest in right subtree)
      let successor = this.findMin(node.right);
      node.data = successor.data;
      node.right = this.deleteItem(node.right, successor.data);
    }
    return node;
  }

  findMin(node) {
    while (node.left) {
      node = node.left;
    }
    return node;
  }

  find(node, value) {
    if (!node) return false;
    if (node.data === value) return true;
    if (value < node.data) {
      return this.find(node.left, value);
    } else {
      return this.find(node.right, value);
    }
  }

  levelOrder(callback) {
    if (!callback) throw new Error('Callback function required!');
    const queue = [this.root];
    while (queue.length > 0) {
      let current = queue.shift();
      callback(current);
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
  }

  preOrder(callback, node = this.root) {
    if (!callback) throw new Error('Callback function required!');
    if (!node) return;
    callback(node);
    this.preOrder(callback, node.left);
    this.preOrder(callback, node.right);
  }

  inOrder(callback, node = this.root) {
    if (!callback) throw new Error('Callback function required!');
    if (!node) return;
    this.inOrder(callback, node.left);
    callback(node);
    this.inOrder(callback, node.right);
  }

  postOrder(callback, node = this.root) {
    if (!callback) throw new Error('Callback function required!');
    if (!node) return;
    this.postOrder(callback, node.left);
    this.postOrder(callback, node.right);
    callback(node);
  }

  // Find node with value, then calculate height from that node
  height(value) {
    function find(node) {
      if (!node) return null;
      if (node.data === value) return node;
      return find(node.left) || find(node.right);
    }

    function calculateHeight(node) {
      if (!node) return -1;
      return (
        1 + Math.max(calculateHeight(node.left), calculateHeight(node.right))
      );
    }

    const node = find(this.root);
    if (!node) return null;
    return calculateHeight(node);
  }

  // Calculate height of any node (helper for isBalanced)
  heightNode(node) {
    if (!node) return -1;
    return (
      1 + Math.max(this.heightNode(node.left), this.heightNode(node.right))
    );
  }

  // Depth: number of edges from root to node with given value
  depth(value, node = this.root, currentDepth = 0) {
    if (!node) return null;
    if (node.data === value) return currentDepth;
    if (value < node.data) {
      return this.depth(value, node.left, currentDepth + 1);
    } else {
      return this.depth(value, node.right, currentDepth + 1);
    }
  }

  // Check if tree is balanced at every node
  isBalanced(node = this.root) {
    if (!node) return true;
    const leftHeight = this.heightNode(node.left);
    const rightHeight = this.heightNode(node.right);
    if (Math.abs(leftHeight - rightHeight) > 1) return false;
    return this.isBalanced(node.left) && this.isBalanced(node.right);
  }

  // Rebuild balanced tree from current tree nodes
  rebalance() {
    const sortedArray = [];

    const inOrderCollect = (node) => {
      if (!node) return;
      inOrderCollect(node.left);
      sortedArray.push(node.data);
      inOrderCollect(node.right);
    };

    inOrderCollect(this.root);
    this.root = this.buildTree(sortedArray);
  }
}
