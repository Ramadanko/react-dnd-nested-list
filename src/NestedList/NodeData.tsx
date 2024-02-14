import { FC, useRef, CSSProperties } from 'react';
import { INode } from './types';

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

const getStyles = ({ isExpanded = false }): CSSProperties => {
  return {
    marginTop: '-1px',
    boxSizing: 'border-box',
    padding: isExpanded ? 0 : '15px',
    border: isExpanded ? 'none' : '1px dashed #ccc',
  };
};

interface INodeData {
  node: INode;
  dragRef: any;
  opacity: number;
  isLastItem: boolean;
  isExpanded: boolean;
  toggleChildNodes: Function;
}

const NodeData: FC<INodeData> = (props) => {
  const { dragRef, node, opacity = 1, isLastItem = false, isExpanded = false, toggleChildNodes = () => {} } = props;
  const defaultDragRef = dragRef ?? useRef(null);
  const hasChildren = Boolean(node?.children?.length);
  const styles = getStyles({ isExpanded });
  const expandText = !isExpanded ? 'Expand' : 'Collapse';
  const toggleChildren = () => toggleChildNodes();

  return (
    <div className="node-data" style={styles}>
      <div className="row-data" style={stackStyle}>
        <span style={handleStyle} ref={defaultDragRef} />
        <div>{node?.name}</div>
        {hasChildren && <button onClick={toggleChildren}>{expandText}</button>}
      </div>
    </div>
  );
};

export default NodeData;
