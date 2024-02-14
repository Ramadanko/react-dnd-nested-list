import { useContext } from 'react';
import { TreeContext } from './TreeProvider';
import { INode } from './types';
import DraggableDroppableNode from './DraggableDroppableNode';
import ExpandCollapseAllNodesButton from './ExpandCollapseAllNodesButton';

const Tree = () => {
  const { rootNode } = useContext(TreeContext);
  return (
    <>
      <ExpandCollapseAllNodesButton />
      {rootNode?.children?.map((node: INode, index: number) => (
        <DraggableDroppableNode node={node} key={node.id} index={index} />
      ))}
    </>
  );
};

export default Tree;
