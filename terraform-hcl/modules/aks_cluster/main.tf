resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_kubernetes_cluster" "cluster" {
  name                = "example-aks"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = "exampleaks"

  default_node_pool {
    name       = "default"
    node_count = var.default_nodegroup_size
    vm_size    = "Standard_D2_v2"
  }

  identity {
    type = "SystemAssigned"
  }

  tags = {
    Environment = "Dev"
  }
}

resource "azurerm_kubernetes_cluster_node_pool" "additional_nodegroup" {
  for_each = var.additional_nodegroups

  name                  = "nodegroup${each.key}"
  kubernetes_cluster_id = azurerm_kubernetes_cluster.cluster.id

  min_count            = each.value.min_count
  max_count            = each.value.max_count
  
  os_disk_size_gb      = 30
  os_disk_type         = "Managed"
  vm_size              = "Standard_D2_v2"

  depends_on = [
    azurerm_kubernetes_cluster.cluster
  ]
}
# Good luck to get consistent output values from for_each resource 

output "kube_config" {
  value = azurerm_kubernetes_cluster.cluster.kube_config_raw
  sensitive = true
}