export type INode = {
  id: string;
  name: string;
  parentId: string;
  renderIndex?: string;
  children?: INode[];
  nodeType?: string;
  accessPath?: string;
};
