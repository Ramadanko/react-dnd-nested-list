import { useContext } from 'react';
import { TreeContext } from './TreeProvider';
import { INode } from './types';
import DraggableDroppableNode from './DraggableDroppableNode';

const Tree = () => {
  const { rootNode } = useContext(TreeContext);

  return (
    <>
      {rootNode?.children?.map((node: INode, index: number) => (
        <DraggableDroppableNode node={node} key={node.id} index={index} />
      ))}
    </>
  );
};

export default Tree;
