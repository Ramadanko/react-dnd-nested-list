import { createContext, useState, FC } from 'react';
import { getRootNode } from './RootNode';
import { get } from 'lodash-es';
import { indicatorValue } from './DraggableDroppableNode';
import { INode } from './types';

interface ITreeContext {
  allNodes: any;
  updateTree: Function;
  expandedNodes: {
    [key: string]: string;
  };
  expandNode: Function;
  collapseNode: Function;
  toggleAllNodes: () => void;
  areAllNodesExpanded: boolean;
}

export const TreeContext = createContext<ITreeContext>({
  allNodes: {},
  updateTree: () => {},
  expandedNodes: {},
  expandNode: () => {},
  collapseNode: () => {},
  toggleAllNodes: () => {},
  areAllNodesExpanded: false,
});

const getChildItems = (path: string, object: any) => {
  if (path === '') {
    return object.children;
  }
  const item = getItemWithIndex(path, object);
  return item.children;
};

const getItemWithIndex = (index: string, object: any) => {
  let itemPath = '';
  const draggedPathArray = index.split('');
  draggedPathArray.forEach((i, index) => {
    itemPath = itemPath + `${index > 0 ? '.' : ''}children[${parseInt(i) - 1}]`;
  });
  return get(object, itemPath);
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
  const [allNodes, setAllNodes] = useState(getRootNode());
  const [expandedNodes, setExpandedNodes] = useState({});
  const [areAllNodesExpanded, setAreAllNodesExpanded] = useState(false);

  const updateTree = (dragIndex: string, hoverIndex: string, position: indicatorValue) => {
    if (!dragIndex || !hoverIndex) return;
    const clonedNodes = structuredClone(allNodes);
    let areItemsInTheSameArray = dragIndex.slice(0, -1) === hoverIndex.slice(0, -1);

    const draggedItem = getItemWithIndex(dragIndex, clonedNodes);
    const draggedItemPositionInArray = parseInt(dragIndex[dragIndex.length - 1]) - 1;
    const draggedItemParentContainer: Array<any> = getChildItems(dragIndex.slice(0, -1), clonedNodes);

    const hoveredItem = getItemWithIndex(hoverIndex, clonedNodes);
    const hoveredItemPositionInArray = parseInt(hoverIndex[hoverIndex.length - 1]) - 1;
    const hoveredItemParentContainer: Array<any> = getChildItems(hoverIndex.slice(0, -1), clonedNodes);
    draggedItemParentContainer.splice(draggedItemPositionInArray, 1);
    let newPosition;

    if (position !== 'middle') {
      if (areItemsInTheSameArray) {
        hoveredItemParentContainer.forEach((item, index) => {
          if (item.id === hoveredItem.id) {
            newPosition = position === 'top' ? index : index + 1;
          }
        });
      } else {
        newPosition = position === 'top' ? hoveredItemPositionInArray : hoveredItemPositionInArray + 1;
      }
      hoveredItemParentContainer.splice(newPosition, 0, draggedItem);
    } else {
      hoveredItem.children.push(draggedItem);
    }

    setAllNodes(() => structuredClone(clonedNodes));
  };
  const expandNode = (node: INode) => {
    setExpandedNodes((prev) => ({ ...prev, [node.id]: node }));
  };

  const collapseNode = (node: INode) => {
    setExpandedNodes((prev) => {
      delete prev[node.id];
      return { ...prev };
    });
    setAreAllNodesExpanded(false);
  };

  const toggleAllNodes = () => {
    if (areAllNodesExpanded) {
      setAreAllNodesExpanded(false);
      setExpandedNodes({});
    } else {
      const expandedNodes = expandAllNodes(allNodes);
      setAreAllNodesExpanded(true);
      setExpandedNodes(() => expandedNodes);
    }
  };

  return (
    <TreeContext.Provider
      value={{
        allNodes,
        updateTree,
        expandedNodes,
        expandNode,
        collapseNode,
        areAllNodesExpanded,
        toggleAllNodes,
      }}>
      {children}
    </TreeContext.Provider>
  );
};
export default TreeProvider;
