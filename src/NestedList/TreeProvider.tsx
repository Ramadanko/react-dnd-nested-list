import { createContext, useState, FC, useRef, useEffect } from 'react';
import { getRootNode, rootNode } from './RootNode';
import { get } from 'lodash-es';
import { extractIndexes, IndicatorValues, isSiblingNode } from './util';
import { INode, ITreeContext } from './types';
import { SET_ARE_ALL_NODES_EXPANDED } from './CustomEvents';

export const TreeContext = createContext<ITreeContext>({
  rootNode,
  updateTree: () => {},
  toggleExpandedNodes: () => {},
});

export const getContainerPath = (node: INode) => {
  let lastIndexOfBracket = node.accessPath.lastIndexOf('[');
  return node.accessPath.slice(0, lastIndexOfBracket);
};

const extractItem = (path: string, object: any) => {
  const pathString = path[0] === '.' ? path.slice(1) : path;
  return get(object, pathString);
};

const expandAllNodes = (rootNode: INode, expandedNodes = {}) => {
  rootNode?.children?.forEach((node) => {
    expandedNodes[node.id] = node.id;
    if (node.children && Array.isArray(node.children)) {
      expandAllNodes(node, expandedNodes);
    }
  });
  return expandedNodes;
};

const TreeProvider: FC<any> = ({ children }) => {
  const containerNodes = useRef({});
  const expandedContainerNodes = useRef({});
  const [rootNode, setAllNodes] = useState(getRootNode());

  const updateTree = (draggedNode: INode, hoveredNode: INode, position: IndicatorValues) => {
    const clonedNodes = structuredClone(rootNode);
    const areItemsInTheSameArray = isSiblingNode(draggedNode, hoveredNode);
    const { dragIndex, dropIndex } = extractIndexes(draggedNode, hoveredNode);

    const draggedItemParentContainer = extractItem(getContainerPath(draggedNode), clonedNodes);
    const draggedItem = extractItem(draggedNode.accessPath, clonedNodes);

    const hoveredItemParentContainer = extractItem(getContainerPath(hoveredNode), clonedNodes);
    const hoveredItem = extractItem(hoveredNode.accessPath, clonedNodes);

    // remove draggedItem from array
    draggedItemParentContainer.splice(dragIndex, 1);

    let newPosition: number;

    if (position !== 'middle') {
      if (areItemsInTheSameArray) {
        hoveredItemParentContainer.forEach((item: INode, index: number) => {
          if (item.id === hoveredItem.id) {
            newPosition = position === 'top' ? index : index + 1;
          }
        });
      } else {
        newPosition = position === 'top' ? dropIndex : dropIndex + 1;
      }
      hoveredItemParentContainer.splice(newPosition, 0, draggedItem);
    } else {
      // adding to empty list
      hoveredItem.children.push(draggedItem);
    }
    setAllNodes(() => structuredClone(clonedNodes));
  };

  const logContainerNodes = (node: INode) => {
    if (Array.isArray(node.children)) {
      if (node.nodeType !== 'root') {
        containerNodes.current[node.id] = node.id;
      }
      node.children.forEach((node) => logContainerNodes(node));
    }
  };

  const toggleExpandedNodes = (id: string) => {
    if (expandedContainerNodes.current[id]) {
      delete expandedContainerNodes.current[id];
    } else {
      expandedContainerNodes.current[id] = id;
    }
    const areAllExpanded =
      Object.keys(expandedContainerNodes.current).length === Object.keys(containerNodes.current).length;
    window.dispatchEvent(new CustomEvent(SET_ARE_ALL_NODES_EXPANDED, { detail: areAllExpanded }));
  };

  useEffect(() => logContainerNodes(rootNode), [rootNode]);

  return (
    <TreeContext.Provider
      value={{
        rootNode,
        updateTree,
        toggleExpandedNodes,
      }}>
      {children}
    </TreeContext.Provider>
  );
};
export default TreeProvider;
