import React from 'react';

interface TreeNode {
    path: string;
    type: 'file' | 'tree';
    sha?: string;
    children?: TreeNode[];
}

interface TreeProps {
    node: TreeNode;
}

const TreeNodeComponent: React.FC<TreeProps> = ({ node }) => {
    return (
        <div style={{ marginLeft: '20px' }}>
            <div>
                {node.type === 'tree' ? (
                    // folder
                    <strong>{node.path}</strong>
                ) : (
                    // file
                    <span>{node.path}</span>
                )}
            </div>
            {node.children && node.children.length > 0 && (
                <div>
                    {node.children.map((childNode, index) => (
                        <TreeNodeComponent key={index} node={childNode} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TreeNodeComponent;
