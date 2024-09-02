# ORM - Transaction

## Introduction

Using the GoFrame ORM component for transaction operations is straightforward and secure. Two methods can be used to handle transactions:

1. **Common Method**: You can start a transaction using the `Begin` method, which returns a transaction interface (`gdb.TX`). You can then use this interface for various operations, such as those described in previous sections (e.g., method operations and chain operations). However, this method carries the risk of accidentally forgetting to close the transaction, leading to potential transaction safety issues.

2. **Closure Method**: This method uses the `Transaction` function, which operates the transaction within a closure. All transaction logic is implemented inside the closure, and the transaction is automatically closed at the end of the closure, ensuring the safety of the transaction operation. Additionally, the closure method supports nested transactions conveniently, which are transparent and seamless in business operations.

**Recommendation:** It is recommended to use the `Transaction` closure method for all transaction operations.

### API Documentation

For detailed information, please refer to the [API Documentation](https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb#TX).
