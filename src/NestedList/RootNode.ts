import { INode } from './types';
import { v4 as uuidV4 } from 'uuid';

export const rootNode: INode = {
  id: '1',
  nodeType: 'root',
  name: 'Root',
  parentId: 'root',
  children: [
    {
      id: '2',
      name: 'Container one',
      parentId: '1',
      children: [
        {
          id: '3',
          name: 'Product 1',
          parentId: '2',
        },
        {
          id: '4',
          name: 'Product 2',
          parentId: '2',
        },
        {
          id: '5',
          name: 'Product 3',
          parentId: '2',
        },
      ],
    },
    {
      id: '6',
      name: 'Container Two',
      parentId: '1',
      children: [
        {
          id: '7',
          name: 'Product 4',
          parentId: '6',
        },
        {
          id: '8',
          name: 'Product 5',
          parentId: '6',
        },
        {
          id: '9',
          name: 'Product 6',
          parentId: '6',
        },
      ],
    },
    {
      id: '10',
      name: 'Container three',
      parentId: '1',
      children: [
        {
          id: '11',
          name: 'Product 7',
          parentId: '10',
        },
        {
          id: '12',
          name: 'Product 8',
          parentId: '10',
        },
        {
          id: '13',
          name: 'Product 9',
          parentId: '10',
        },
        {
          id: '14',
          name: 'Container four',
          parentId: '10',
          children: [
            {
              id: '15',
              name: 'Product 10',
              parentId: '14',
            },
            {
              id: '16',
              name: 'Product 11',
              parentId: '14',
            },
            {
              id: '17',
              name: 'Product 12',
              parentId: '14',
            },
          ],
        },
      ],
    },

    {
      id: '3',
      name: 'Product 1',
      parentId: '2',
    },
    {
      id: '3',
      name: 'Product 1',
      parentId: '2',
    },
    {
      id: '3',
      name: 'Product 1',
      parentId: '2',
    },
    {
      id: '3',
      name: 'Product 1',
      parentId: '2',
    },
    {
      id: '3',
      name: 'Product 1',
      parentId: '2',
    },
    {
      id: '3',
      name: 'Product 1',
      parentId: '2',
    },
    {
      id: '3',
      name: 'Product 1',
      parentId: '2',
    },
    {
      id: '3',
      name: 'Item 11',
      parentId: '2',
    },
  ],
};

const generateUniqueIds = (node: INode) => {
  node.children.forEach((item) => {
    item.id = uuidV4();
    if (item.children) {
      generateUniqueIds(item);
    }
  });
};

export const getRootNode = () => {
  const root = structuredClone(rootNode);
  generateUniqueIds(root);
  return root;
};
