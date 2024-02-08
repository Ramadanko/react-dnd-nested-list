import { useContext } from 'react';
import { TreeContext } from './TreeProvider';
import { INode } from './types';
import DraggableDroppableNode from './DraggableDroppableNode';

const Tree = () => {
  const { rootNode, areAllNodesExpanded, toggleAllNodes = () => {} } = useContext(TreeContext);
  const expandText = areAllNodesExpanded ? 'Collapse all' : 'Expand all';

  return (
    <>
      <div>
        <button onClick={toggleAllNodes}>{expandText}</button>
      </div>
      {rootNode?.children?.map((node: INode, index: number) => (
        <DraggableDroppableNode node={node} key={node.id} index={index} />
      ))}
    </>
  );
};

export default Tree;
