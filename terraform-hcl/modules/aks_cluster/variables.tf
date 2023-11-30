variable "resource_group_name" {
  default = "sauermann-integration"
}

variable "location" {
  default = "francecentral"
}

variable "cluster_name" {
  type = string
}

variable "default_nodegroup_size" {
  default = 1
}

variable additional_nodegroups {
  default = {}
  type = map(object({
    min_count = number
    max_count = number
  }))
}