export type INode = {
  id: string;
  name: string;
  parentId: string;
  renderIndex?: string;
  children?: INode[];
  nodeType?: string;
  accessPath?: string;
};

export interface ITreeContext {
  rootNode: INode;
  updateTree: Function;
  toggleExpandedNodes: Function;
}
