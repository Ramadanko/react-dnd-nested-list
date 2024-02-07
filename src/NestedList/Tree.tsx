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
      {rootNode?.children?.map((node: INode, index: number) => {
        const key = index + 1;
        return (
          <DraggableDroppableNode
            node={{ ...node, renderIndex: (index + 1).toString() }}
            key={key.toString()}
            index={index}
          />
        );
      })}
    </>
  );
};

export default Tree;
