import { CSSProperties, useContext, useRef, useState } from 'react';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { INode } from './types';
import { TreeContext } from './TreeProvider';
import NodeData from './NodeData';
import DropIndicator from './DropIndicator';

type IProps = {
  index: number;
  node: INode;
  parentIndex?: number | string;
  isLastItem?: boolean;
};

const containerStyles: CSSProperties = {
  margin: '16px',
  position: 'relative',
};

const INITIAL_POSITION = 'top';
export type indicatorValue = 'top' | 'middle' | 'bottom';

const showBeforeFunction = (monitor: DropTargetMonitor, node: any, ref: any) => {
  const item: any = monitor.getItem();
  if (!item) return INITIAL_POSITION;
  if (item.renderIndex === node.renderIndex) return INITIAL_POSITION;

  const hoverBoundingRect = ref.current?.getBoundingClientRect();
  const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
  const hoverTop = Math.floor(hoverBoundingRect.height / 3);
  const hoverMiddle = Math.floor((hoverBoundingRect.height / 3) * 2);
  const clientOffset = monitor.getClientOffset();
  if (!clientOffset) return INITIAL_POSITION;
  const hoverClientY = clientOffset.y - hoverBoundingRect.top;

  if (Array.isArray(node?.children) && !node.children.length) {
    if (hoverClientY < hoverTop) return INITIAL_POSITION;
    if (hoverClientY > hoverTop && hoverClientY < hoverMiddle) return 'middle';
    return 'bottom';
  }

  return hoverClientY < hoverMiddleY ? 'top' : 'bottom';
};

const DraggableDroppableNode = (props: IProps) => {
  const ref = useRef(null);
  const { updateTree, expandedNodes, expandNode, collapseNode } = useContext(TreeContext);
  const { node, index = 0, parentIndex, isLastItem = false } = props;
  const isNodeExpanded = Boolean(expandedNodes[node.id]);
  const [showPreviewBefore, setShowPreviewBefore] = useState<indicatorValue>('top');

  node.renderIndex = parentIndex !== undefined ? `${parentIndex}${index}` : (index + 1).toString();

  const [{ handlerId, draggedItem, isOverCurrent }, drop] = useDrop({
    accept: 'any',
    canDrop: (item: INode) => {
      return item.renderIndex !== node.renderIndex && item.renderIndex.slice(0, -1) !== node.renderIndex;
    },
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        // not hovering on itself
        isOverCurrent: monitor.isOver({ shallow: true }) && monitor.getItem().renderIndex !== node.renderIndex,
        canDrop: monitor.canDrop(),
        draggedItem: monitor.getItem(),
      };
    },
    drop(item: INode) {
      if (!ref.current || !isOverCurrent) return;
      // if not hovering on itself
      if (item.renderIndex === node.renderIndex) return;
      // if not hovering on parent
      if (item.renderIndex.slice(0, -1) === node.renderIndex) return;
      // this is to test if we're dropping on the next sibling
      updateTree(item.renderIndex, node.renderIndex, showPreviewBefore);
    },
    hover(item, monitor) {
      if (!ref.current || !isOverCurrent) return;
      // if not hovering on itself
      if (item.renderIndex === node.renderIndex) return;
      // if not hovering on parent
      if (item.renderIndex.slice(0, -1) === node.renderIndex) return;
      // this is to test if we're dropping on the next sibling
      if (parseInt(node.renderIndex) - parseInt(item.renderIndex as string) === 1) {
        return setShowPreviewBefore(() => 'bottom');
      }
      const isBefore = showBeforeFunction(monitor, node, ref) ?? 'top';
      if (isBefore !== showPreviewBefore) {
        setShowPreviewBefore(() => isBefore);
      }
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'any',
    item: node,
    collect: (monitor) => {
      const draggingItem = monitor.getItem();
      return {
        isDragging: monitor.isDragging() && node.renderIndex === draggingItem.renderIndex,
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
  const showNewDropPosition =
    isOverCurrent && draggedItem?.id !== node.id && draggedItem.renderIndex.slice(0, -1) !== node.renderIndex;

  // we're telling React-dnd that this ref var/object/element is going to be used as droppable source
  // and in the same time it's going to be a preview source
  drop(preview(ref));

  return (
    <div ref={ref} className="node-item" style={rowItemStyles} data-handler-id={handlerId}>
      {showNewDropPosition ? <DropIndicator topPosition={showPreviewBefore} /> : null}
      <NodeData
        node={node}
        dragRef={drag}
        opacity={opacity}
        isLastItem={isLastItem}
        expandNode={expandNode}
        collapseNode={collapseNode}
        isExpanded={isNodeExpanded}
        renderIndex={node.renderIndex}
      />
      {isNodeExpanded &&
        node?.children?.map((child: any, index) => {
          const isLastItem = node.children.length - 1 === index;
          return (
            <DraggableDroppableNode
              node={child}
              key={child.id}
              index={index + 1}
              isLastItem={isLastItem}
              parentIndex={node.renderIndex}
            />
          );
        })}
    </div>
  );
};

export default DraggableDroppableNode;
