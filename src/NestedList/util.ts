import { INode } from './types';
import { CSSProperties } from 'react';

export const INITIAL_POSITION = 'top';
export type IndicatorValues = 'top' | 'middle' | 'bottom' | 'none';

export const isContainerNode = (node: INode) => {
  return Boolean(node.children);
};

export const isSiblingNode = (draggedItem: INode, dropItem: INode) => {
  // we can rely on parentId for each node if it exists
  let lastIndexOfBracket = draggedItem.accessPath.lastIndexOf('[');
  const dragItemContainerPath = draggedItem.accessPath.slice(0, lastIndexOfBracket);
  lastIndexOfBracket = dropItem.accessPath.lastIndexOf('[');
  const dropItemContainerPath = dropItem.accessPath.slice(0, lastIndexOfBracket);
  return dragItemContainerPath === dropItemContainerPath;
};

export const extractIndexes = (draggedItem: INode, dropItem: INode) => {
  let lastIndexOfBracket = draggedItem.accessPath.lastIndexOf('[');
  const dragIndex = parseInt(draggedItem.accessPath.slice(lastIndexOfBracket + 1).replace(']', ''));
  lastIndexOfBracket = dropItem.accessPath.lastIndexOf('[');
  const dropIndex = parseInt(dropItem.accessPath.slice(lastIndexOfBracket + 1).replace(']', ''));
  return { dragIndex, dropIndex };
};

export const isPrevNode = (draggedItem: INode, dropItem: INode) => {
  const { dragIndex, dropIndex } = extractIndexes(draggedItem, dropItem);
  return dragIndex - dropIndex === 1;
};

export const isNextNode = (draggedItem: INode, dropItem: INode) => {
  const { dragIndex, dropIndex } = extractIndexes(draggedItem, dropItem);
  return dropIndex - dragIndex === 1;
};

export const isParentNode = (draggedItem: INode, dropItem: INode) => {
  const dragItemParentPath = draggedItem.accessPath.split('.');
  dragItemParentPath.pop();
  const dragItemParentPathString = dragItemParentPath.join('.');
  return dragItemParentPathString === dropItem.accessPath;
};

export const getDraggableDroppableStyles = ({ isDragging = false, isNodeExpanded = false }: any): CSSProperties => {
  return {
    position: 'relative',
    margin: '15px 0',
    opacity: isDragging ? 0.5 : 1,
    padding: isNodeExpanded ? '15px' : 0,
    border: isNodeExpanded ? '1px solid #ccc' : 'none',
  };
};
