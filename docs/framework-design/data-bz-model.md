# Data Model - BZ Model

## Data Model

**Data Model**, also known as the **Entity Model**, the data structures of underlying persistent databases, such as `MySQL`, `Redis`, `MongoDB`, `Kafka`, and so on. These data structures are maintained by third-party systems and can be recognized by tools for their collection data structures, automatically generating corresponding program data model code. The code for these data models is located in the `/internal/model/entity` folder. Developers do not need to manually maintain data models in the code. In the `Goframe`, data models are maintained by CLI tools for unified maintenance, with code being automatically generated.

```go
// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
    "github.com/gogf/gf/v2/os/gtime"
)

// ChatHistory is the golang structure for table chat_history.
type ChatHistory struct {
    Id           string      `json:"id"           ` //
    FromUserId   string      `json:"fromUserId"   ` //
    FromUserName string      `json:"fromUserName" ` //
    SoulName     string      `json:"soulName"     ` //
    FromContetn  string      `json:"fromContetn"  ` //
    ToContent    string      `json:"toContent"    ` //
    CreateTime   *gtime.Time `json:"createTime"   ` //
}

```

## BZ(Business) Model

Business Model mainly includes two types: `Input`/`Output` Models and Business `Input`/`Output` Models.

### **API Input/Output Model**

The Input/Output Model is used for interaction between `systems`/`services`, defined in the `API` layer, available for all levels of the project to call, such as the `controller`, `logic`, and `model`, which can all call the `input`/`output` models of the `API` layer. However, the `API` layer is only used for interface interaction with external services, and this model should not call or reference internal models. In the GoFrame framework specification, these `input`/`output` models are named in the format of `XxxReq` and `XxxRes`.

```go
package apiv1

import "github.com/gogf/gf/v2/frame/g"

type RegisterReq struct {
    g.Meta          `path:"/register" method:"post" tags:"Register" summary:"Register"`
    Password        string `json:"password` `v:"required|length:6,16#please input password|password length should be 6 to 16"`
    PasswordVerify  string `json:"passwordVerify` `v:"required|same:password#password verification failed|password verification failed"`
    Nickanme        string `json:"nickname` `v:"required"`
    Account         string `json:"account` `v:"required|length:6,16#please input account|account length should be 6 to 16"`
}

type RegisterRes struct {
    g.Meta `mime:"application/json"` type:"string" example:"<html/>"
}

```

### **Business Input/Output Model**

The business `input`/`output` model is used for method call interactions within services, particularly between `controllers` -> `services` or `services` -> `services`. This model is defined within the model layer. In the `Goframe`, the naming conventions of these models like XxxInput and XxxOutput.

## DO Model

In `Goframe` there is a special model, `DO`. It is between the Business Model and the Data Model. Mainly used for the data access between `ORM` and `DAO`
