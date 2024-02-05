import { CSSProperties, FC } from 'react';
import { indicatorValue } from './DraggableDroppableNode';

interface IDropIndicator {
  topPosition: indicatorValue;
}

const mapper = {
  top: '0',
  middle: '50%',
  bottom: '100%',
};

const DropIndicator: FC<IDropIndicator> = ({ topPosition }) => {
  const styles: CSSProperties = {
    left: 0,
    width: '100%',
    position: 'absolute',
    border: '1px dashed red',
    top: mapper[topPosition],
  };

  return <div style={styles} />;
};

export default DropIndicator;
