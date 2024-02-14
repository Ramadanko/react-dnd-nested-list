import { useState, useEffect } from 'react';
import { SET_ARE_ALL_NODES_EXPANDED, EXPAND_COLLAPSE_ALL_NODES } from './CustomEvents';

const ExpandCollapseAllNodesButton = () => {
  const [allNodesExpanded, setAllNodesExpanded] = useState(false);
  const text = allNodesExpanded ? 'Collapse all' : 'Expand all';

  const toggleExpandCollapse = () => {
    window.dispatchEvent(new CustomEvent(EXPAND_COLLAPSE_ALL_NODES, { detail: !allNodesExpanded }));
    setAllNodesExpanded(() => !allNodesExpanded);
  };

  const handler = (e: CustomEvent) => setAllNodesExpanded(() => e.detail);

  useEffect(() => {
    window.addEventListener(SET_ARE_ALL_NODES_EXPANDED, handler);
    return () => {
      window.removeEventListener(SET_ARE_ALL_NODES_EXPANDED, handler);
    };
  }, []);

  return <button onClick={toggleExpandCollapse}>{text}</button>;
};

export default ExpandCollapseAllNodesButton;
