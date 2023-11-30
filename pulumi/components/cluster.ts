import * as pulumi from "@pulumi/pulumi";
import * as az from "@pulumi/azure";
import cluster from "cluster";

export interface ClusterComponentArgs {
    location: string,
    resourceGroupName: string,
    clusterName: string
    nodepools?: {
        name: string,
        size: number
    }[]
}

export class AksClusterComponent extends pulumi.ComponentResource {

    public kubeconfig: pulumi.Output<string>

    constructor(name: string, args: ClusterComponentArgs, opts?: pulumi.ComponentResourceOptions) {
        super("pkg:index:MyComponent", name, {}, opts);

        const resourceGroup = new az.core.ResourceGroup("resourceGroup", {
            name: args.resourceGroupName,
            location: args.location
        });

        const managedCluster = new az.containerservice.KubernetesCluster("managedCluster", {
            name: args.clusterName,
            location: resourceGroup.location,
            resourceGroupName: resourceGroup.name,
            dnsPrefix: "testdnsprefix",
            defaultNodePool: {
                name: "default",
                nodeCount: 1,
                vmSize: "Standard_D2_v2",
            },
            identity: {
            type:  "SystemAssigned"
            }
        });

        this.kubeconfig = managedCluster.kubeConfigRaw

        for (const npConf of args.nodepools || []) {
            const nodepool = new az.containerservice.KubernetesClusterNodePool(`nodepool${npConf.name}`, {
                name: `nodepool${npConf.name}`,
                kubernetesClusterId: managedCluster.id,
                vmSize: "Standard_DS2_v2",
                nodeCount: npConf.size,
            })
        }
    }
}