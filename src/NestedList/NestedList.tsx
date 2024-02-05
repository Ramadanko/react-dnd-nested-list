import TreeProvider from './TreeProvider';
import Tree from './Tree';

const NestedList = () => {
  return (
    <TreeProvider>
      <Tree />
    </TreeProvider>
  );
};

export default NestedList;
