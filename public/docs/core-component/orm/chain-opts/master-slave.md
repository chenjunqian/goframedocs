# ORM Chain Operation - Master/Slave

As introduced earlier, `gdb` supports application-layer master-slave configuration and read-write separation. All these features can be easily implemented through simple configuration, and `gdb` will automatically switch between `master` and `slave` nodes for SQL requests. Below is a simple master-slave configuration with one `master` and one `slave`:

```yaml
database:
  default:
  - type: "mysql"
    link: "root:12345678@tcp(192.168.1.1:3306)/test"
    role: "master"
  - type: "mysql"
    link: "root:12345678@tcp(192.168.1.2:3306)/test"
    role: "slave"
```

In most scenarios, our write requests are directed to the `master` node, while read requests are directed to the `slave` nodes. This approach helps distribute the load of database requests and improves database availability. However, in certain scenarios, we want read operations to be executed on the `master` node, especially in cases that require high immediacy (as there is a delay in data synchronization between `master` and `slave` nodes).

Developers can use the `Master` and `Slave` methods to decide on which node the current chain operation should be executed.

Here is a simple example. We have an order system with high daily traffic, resulting in a delay of about 1-500ms during the master-slave synchronization. According to the business requirements, the order list page should be displayed immediately after creating an order. If this page reads data from the slave node by default, it is likely that the user will not see the newly created order on the list page (due to the master-slave synchronization delay). This issue can be resolved by configuring the order list page to read data from the master node.

When creating an order, it is unnecessary to specify the operating node, as write operations are executed on the master node by default. To simplify the example, here is the key code snippet:

```go
g.Model("order").Data(g.Map{
    "uid"   : 1000,
    "price" : 99.99,
    // ...
}).Insert()
```

When querying on the order list page, we need to use the `Master` method to specify that the query operation should be performed on the master node to avoid read delays.

```go
g.Model("order").Master().Where("uid", 1000).All()
```
