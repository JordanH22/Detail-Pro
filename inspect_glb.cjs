const fs = require('fs');

try {
    const buffer = fs.readFileSync('public/scirocco.glb');

    // GLB Header: magic (4), version (4), length (4)
    // Chunk 0: length (4), type (4), data...

    const magic = buffer.readUInt32LE(0);
    if (magic !== 0x46546C67) { // 'glTF'
        console.error('Not a valid GLB file');
        process.exit(1);
    }

    const chunkLength = buffer.readUInt32LE(12);
    const chunkType = buffer.readUInt32LE(16);

    if (chunkType !== 0x4E4F534A) { // 'JSON'
        console.error('First chunk is not JSON');
        process.exit(1);
    }

    const jsonBuf = buffer.slice(20, 20 + chunkLength);
    const json = JSON.parse(jsonBuf.toString('utf8'));

    console.log('--- GLTF Nodes ---');
    if (json.nodes) {
        json.nodes.forEach((node, index) => {
            // We only care about nodes that have a name, as those are likely what we need to target
            // Also check if they have a mesh index
            const isMesh = node.mesh !== undefined;
            console.log(`Node ${index}: "${node.name}" ${isMesh ? '(Mesh)' : ''}`);
        });
    } else {
        console.log('No nodes found in JSON');
    }

    console.log('--- GLTF Meshes ---');
    if (json.meshes) {
        json.meshes.forEach((mesh, index) => {
            console.log(`Mesh ${index}: "${mesh.name}"`);
        });
    }

} catch (e) {
    console.error('Error reading GLB:', e);
}
