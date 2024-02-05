import { HTML5Backend } from 'react-dnd-html5-backend';
import NestedList from './NestedList/NestedList';
import { DndProvider } from 'react-dnd';

const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <NestedList />
    </DndProvider>
  );
};

export default App;
