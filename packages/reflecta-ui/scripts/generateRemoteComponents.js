const fs = require('fs/promises');
const path = require('path');

const COMPONENT_REMOTE_NAME = 'reflecta-components-module-federation';
const COMPONENT_DECLARATIONS_DIRECTORY = path.resolve(__dirname, '../../reflecta-components/declarations/src/components');
const REMOTE_COMPONENTS_DIRECTORY = path.resolve(__dirname, '../src/components/remotes');

const createRemoteComponent = async (componentName) => {
    const componentDirectory = path.join(REMOTE_COMPONENTS_DIRECTORY, componentName);
    const componentDeclaration = `import React from 'react';
import {
    I${componentName}
} from 'reflecta-components/declarations/src/components/${componentName}/types';

export default React.memo(React.lazy(() => import('${COMPONENT_REMOTE_NAME}/${componentName}'))) as React.FC<I${componentName}>;
`;

    await fs.mkdir(componentDirectory, {
        recursive: true
    });

    await fs.writeFile(path.join(componentDirectory, 'index.tsx'), componentDeclaration);
};

const generateRemoteComponents = async () => {
    const results = await fs.readdir(COMPONENT_DECLARATIONS_DIRECTORY, {
        withFileTypes: true
    });

    await fs.rm(REMOTE_COMPONENTS_DIRECTORY, {
        force: true,
        recursive: true
    });

    await fs.mkdir(REMOTE_COMPONENTS_DIRECTORY, {
        recursive: true
    });

    const componentCreationPromiseList = results.filter((result) => result.isDirectory() && result.name !== '_internal').map((result) => createRemoteComponent(result.name));

    await Promise.all(componentCreationPromiseList);
};

if (require.main === module) {
    generateRemoteComponents().catch((error) => {
        console.error(error);
        process.exit(1);
    });
}

module.exports = generateRemoteComponents;
