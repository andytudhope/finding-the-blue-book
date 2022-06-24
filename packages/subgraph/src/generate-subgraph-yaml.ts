import networkMapping from '../config/deployments.json';
import fs from 'fs';
import Mustache from 'mustache';

fs.readFile('./subgraph.yaml.mustache', async function(err, data) {

    const chainIds = Object.keys(networkMapping);

    for (const chainId of chainIds) {
        const networkMappingForChain = networkMapping[chainId as keyof typeof networkMapping];
        const networkName = networkMappingForChain[0]['name'];
        const guardianNFTMapping = networkMappingForChain[0]['contracts']['GUARD'];

        const out = Mustache.render(data.toString(), {
            network: networkName,
            guardianNFTAddress: guardianNFTMapping.address,
        });

        fs.writeFileSync(
            `./subgraph.${networkName}.yaml`,
            out
        )  
    }

});