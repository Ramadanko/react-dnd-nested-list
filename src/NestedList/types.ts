export type IProduct = {
  id: string;
  positionNr: number;
  code: string;
  name: string;
  description: string;
  quantity: number;
  parentId: string;
  nodeType: string;
};

export type IParagraph = {
  id: string;
  positionNr: number;
  name: string;
  description: string;
  children?: INode[];
  parentId: string;
  renderIndex?: string;
  nodeType: string;
};

export type INode = {
  id: string;
  name: string;
  parentId: string;
  renderIndex?: string;
  children?: INode[];
  nodeType?: string;
};

export type INodeType = 'product' | 'paragraph' | 'root';
