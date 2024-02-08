import { CSSProperties, useContext, useRef, useState } from 'react';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { INode } from './types';
import { TreeContext } from './TreeProvider';
import NodeData from './NodeData';
import DropIndicator from './DropIndicator';
import {
  INITIAL_POSITION,
  IndicatorValues,
  isSiblingNode,
  isNextNode,
  isContainerNode,
  isPrevNode,
  isParentNode,
} from './util';

type IProps = {
  index: number;
  node: INode;
  parentIndex?: number | string;
  isLastItem?: boolean;
  parentPath?: string;
};

const containerStyles: CSSProperties = {
  margin: '16px',
  position: 'relative',
};

const getDropIndicatorPosition = (monitor: DropTargetMonitor, node: any, ref: any, isNodeExpanded = false) => {
  const item: any = monitor.getItem();
  if (!item) return INITIAL_POSITION;

  const hoverBoundingRect = ref.current?.getBoundingClientRect();
  const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
  const hoverTop = Math.floor(hoverBoundingRect.height / 3);
  const hoverMiddle = Math.floor((hoverBoundingRect.height / 3) * 2);
  const clientOffset = monitor.getClientOffset();
  if (!clientOffset) return INITIAL_POSITION;
  const hoverClientY = clientOffset.y - hoverBoundingRect.top;

  if (isParentNode(item, node)) {
    const parentTop = hoverBoundingRect.top + 15;
    const parentBottom = hoverBoundingRect.bottom - 15;
    if (clientOffset.y < parentTop) return INITIAL_POSITION;
    if (clientOffset.y > parentBottom) return 'bottom';
    return 'none';
  }

  if (isSiblingNode(item, node) && isNextNode(item, node) && !isContainerNode(node)) {
    return 'bottom';
  }

  if (isSiblingNode(item, node) && isPrevNode(item, node) && !isContainerNode(node)) {
    return 'top';
  }

  if (isSiblingNode(item, node) && isNextNode(item, node) && isContainerNode(node)) {
    if (hoverClientY < hoverMiddle && !isNodeExpanded) return 'middle';
    if (clientOffset.y > hoverBoundingRect.bottom - 15) return 'bottom';
    return 'none';
  }

  if (isSiblingNode(item, node) && isPrevNode(item, node) && isContainerNode(node)) {
    if (hoverClientY < hoverTop) return INITIAL_POSITION;
    if (!isNodeExpanded) return 'middle';
    return 'none';
  }

  if (isContainerNode(node)) {
    if (hoverClientY < hoverTop) return INITIAL_POSITION;
    if (hoverClientY > hoverTop && hoverClientY < hoverMiddle) return 'middle';
    return 'bottom';
  }

  return hoverClientY < hoverMiddleY ? 'top' : 'bottom';
};

const DraggableDroppableNode = (props: IProps) => {
  const ref = useRef(null);
  const { updateTree, expandedNodes, expandNode, collapseNode } = useContext(TreeContext);
  const { node, index = 0, isLastItem = false, parentPath = '' } = props;
  const isNodeExpanded = Boolean(expandedNodes[node.id]);
  const [dropPreviewPosition, setDropPreviewPosition] = useState<IndicatorValues>('top');
  node.accessPath = `${parentPath}.children[${index}]`;

  const [{ handlerId, draggedItem, isOverCurrent }, drop] = useDrop({
    accept: 'any',
    canDrop: (item: INode) => {
      return item.id !== node.id; // should not drop on itself
    },
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        // not hovering on itself
        isOverCurrent: monitor.isOver({ shallow: true }) && monitor.getItem().id !== node.id,
        canDrop: monitor.canDrop(),
        draggedItem: monitor.getItem(),
      };
    },
    drop(item: INode) {
      if (!ref.current || !isOverCurrent) return;
      // if not dropping on itself
      if (item.id === node.id) return;
      updateTree(item, node, dropPreviewPosition);
    },
    hover(item, monitor) {
      if (!ref.current || !isOverCurrent) return;
      // if not hovering on itself
      if (item.id === node.id) return;
      const isBefore = getDropIndicatorPosition(monitor, node, ref, isNodeExpanded) ?? 'top';
      if (isBefore !== dropPreviewPosition) {
        setDropPreviewPosition(() => isBefore);
      }
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'any',
    item: node,
    collect: (monitor) => {
      const draggingItem = monitor.getItem();
      return {
        isDragging: monitor.isDragging() && node.id === draggingItem.id,
      };
    },
  });

  const opacity = isDragging ? 0.5 : 1;
  const rowItemStyles = node.children
    ? {
        ...containerStyles,
        opacity,
        border: '1px solid black',
      }
    : { ...containerStyles, opacity };
  const showNewDropPosition = isOverCurrent && draggedItem?.id !== node.id;

  // we're telling React-dnd that this ref var/object/element is going to be used as droppable source
  // and in the same time it's going to be a preview source
  drop(preview(ref));

  return (
    <div ref={ref} className="node-item" style={rowItemStyles} data-handler-id={handlerId}>
      {showNewDropPosition && dropPreviewPosition !== 'none' ? (
        <DropIndicator topPosition={dropPreviewPosition} />
      ) : null}
      <NodeData
        node={node}
        dragRef={drag}
        opacity={opacity}
        isLastItem={isLastItem}
        expandNode={expandNode}
        collapseNode={collapseNode}
        isExpanded={isNodeExpanded}
      />
      {isNodeExpanded &&
        node?.children?.map((child: any, index) => {
          const isLastItem = node.children.length - 1 === index;
          return (
            <DraggableDroppableNode
              node={child}
              key={child.id}
              index={index}
              isLastItem={isLastItem}
              parentPath={node.accessPath}
            />
          );
        })}
    </div>
  );
};

export default DraggableDroppableNode;
