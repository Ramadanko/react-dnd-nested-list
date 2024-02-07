import { FC, useRef, CSSProperties } from 'react';
import { INode } from './types';

const borders: CSSProperties = {
  border: '1px dashed gray',
};
const rowDataStyle: CSSProperties = {
  boxSizing: 'border-box',
  marginTop: '-1px',
  padding: '12px',
};

const stackStyle = {
  display: 'flex',
  gap: 20,
};

const handleStyle = {
  backgroundColor: 'green',
  width: '1rem',
  height: '1rem',
  display: 'inline-block',
  cursor: 'grab',
};

interface INodeData {
  node: INode;
  renderIndex: string;
  dragRef: any;
  opacity: number;
  isLastItem: boolean;
  isExpanded: boolean;
  expandNode: Function;
  collapseNode: Function;
}

const NodeData: FC<INodeData> = (props) => {
  const {
    dragRef,
    node,
    renderIndex = '',
    opacity = 1,
    isLastItem = false,
    isExpanded = false,
    expandNode = () => {},
    collapseNode = () => {},
  } = props;
  const defaultDragRef = dragRef ?? useRef(null);
  const hasChildren = Boolean(node?.children?.length);
  const allBorders = hasChildren ? {} : borders;
  const expandText = !isExpanded ? 'Expand' : 'Collapse';
  if (isLastItem) {
    delete allBorders.borderBottom;
  }
  const toggleChildren = () => (isExpanded ? collapseNode(node) : expandNode(node));

  return (
    <div className="node-data" style={{ ...rowDataStyle, opacity, ...allBorders }}>
      <div className="row-data" style={stackStyle}>
        <span style={handleStyle} ref={defaultDragRef} />
        <div>{node?.name}</div>
        {hasChildren && <button onClick={toggleChildren}>{expandText}</button>}
      </div>
    </div>
  );
};

export default NodeData;
