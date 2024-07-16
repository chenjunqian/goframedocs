# Structured Programming Design

## Overview

Structured programming, in simple terms, involves using the definition of structures to pass and return parameters.

We recommend using structured definitions to manage inputs/outputs, especially the in the `controller` and `service` layers.

## Paint Point

### 1. Controller

- Hard to confirm the `input`/`output` data structures, hard code the `input`/`output` data structures may cause typo

- Parameters usually only define a pointer to an `HttpRequest`/`HttpContext` object, with the execution results directly written into the object, making it difficult to determine whether the interface has succeeded or failed.

- Receiving, validating, and converting parameters is boring and complicated.

- Generating and maintaining interface documentation is extremely difficult.

```go
func (a *contentApi) DoUpdate(r *ghttp.Request) {
    input := define.ContentUpdateInput{
        Id: r.GetInt("id"),
        ContentCreateUpdateBase: define.ContentCreateUpdateBase{
            Type: r.GetString("type"),
            Catergory: r.GetString("catergory"),
            Title: r.GetString("title"),
            Content: r.GetString("content"),
            Brief: r.GetString("brief"),
            Thumb: r.GetString("thumb"),
            Referer: r.GetString("referer"),
        }
    }

    if err := service.Content.Update(r.Context(), input); err != nil {
        response.JsonExit(r, 1, err.Error())
    } else {
        response.JsonExit(r, 0, "ok")
    }
}
```

### 2. Service

- When there are many method parameters, the definition is ugly and the usage is awkward.

- When the number and types of method parameters are uncertain, any change in parameters is incompatible.

- Method parameter documentation are not convenient, most business projects lacking method parameter documentation.

```go
func (s *NetworkService) UnbindRoute(ctx context.Context, appId int64, vip string, uniqVpcId string, instancId string, vPort int, flow flowdriver.IFlowOperator) err {
    vpcLgc := NewVpcLogic(ctx)
    vpcId, subnetId, err := vpcLgc.GetVpcAndSubnetId()
    if err != nil {
        return flowdriver.PauseError(err)
    }
    flow.TFill("vpcId", vpcId)
    flow.TFill("subnetId", subnetId)
    flow.TFill("uniqVpcId", uniqVpcId)
    if !FlagDo("delTcpRouter", flow) {
        err := RetryFunc(5, 2, func() error {
            return vpcLgc.DeleteRoute(vpcId, vpi, vPort)
        })

        if err != nil {
            return flowdriver.PauseError(err)
        }

        FlagDone("delTcpRouter", "done", flow)
    }
    ......
}
```

## Structure Improvements

### 1. Controller Structure Improvements

**Structured Advantages**:

- By managing interface `inputs`/`outputs` through structured data, there is no need to hard-code parameter names, reducing maintenance costs and avoiding errors associated with hard-coded names.

- Automated parameter reception, conversion, and validation.

- Makes interface management as convenient as regular function management, using the returned `error` to determine the outcome of interface processing, and allows for standardized and unified error handling mechanisms.

- Automated generation of interface documentation possible and ensures that the interface structure definition and documentation are maintained in sync.

**Structured Example**

Structure Definition:

```go
type ContentUpdateReq struct {
    g.Meta      `path:"/content/{id}" method:"put" tags:"Content" summary:"Update content"`
    Id          int `json:"id" v:"required" dc:"content id"`
    Type        string `json:"type" v:"required" dc:"content type"`
    Catergory   string `json:"catergory" v:"required" dc:"content catergory"`
    Title       string `json:"title" v:"required" dc:"content title"`
    Content     string `json:"content" v:"required" dc:"content content"`
    Brief       string `json:"brief" v:"required" dc:"content brief"`
    Thumb       string `json:"thumb" v:"required" dc:"content thumb"`
    Referer     string `json:"referer" v:"required" dc:"content referer"`
}

type ContentUpdateRes struct {}
```

Usage:

```go
func (a *contentApi) DoUpdate(ctx context.Context, req *ContentUpdateReq) (res *ContentUpdateRes, err error) {
    err = service.Content.Update(ctx, model.ContentUpdateInput{
        Id: req.Id,
        ContentCreateUpdateBase: model.ContentCreateUpdateBase{
            Type: req.Type,
            Catergory: req.Catergory,
            Title: req.Title,
            Content: req.Content,
            Brief: req.Brief,
            Thumb: req.Thumb,
            Referer: req.Referer,
        },
    })
    return
}
```

### 2. Service Structure Improvements

**Structured Advantages**:

- When there are many method parameters, using a structure to manage them elegantly.

- When the number and types of method parameters are uncertain, adding parameters is compatible with method calls.

- Structure properties documentation is more convenient, improving code maintenance quality.

**Structured Example**:

```go
type UnbindRouteInput struct {
    AppId       int64 `json:"appId"`
    Vip         string `json:"vip"`
    UniqVpcId   string `json:"uniqVpcId"`
    InstancId   string `json:"instancId"`
    VPort       int `json:"vPort"`
    Flow        flowdriver.IFlowOperator
}

func (s *NetworkService) UnbindRoute(ctx context.Context, in UnbindRouteInput) (err error) {
    vpcLgc := NewVpcLogic(ctx)
    vpcId, subnetId, err := vpcLgc.GetVpcAndSubnetId(in.AppId, in.UniqVpcId, in.InstancId)
    if err != nil {
        return flowdriver.PauseError(err)
    }
    in.Flow.TFill("vpcId", vpcId)
    in.Flow.TFill("subnetId", subnetId)
    in.Flow.TFill("instancId", in.UniqVpcId)
    if !FlagDo("delTcpRouter", in.Flow) {
        err := RetryFunc(5, 2, func() error {
            return vpcLgc.DeleteRoute(vpcId, in.Vip, in.VPort)
        })
        if err != nil {
            return flowdriver.PauseError(err)
        }
        FlagDone("delTcpRouter", "done", in.Flow)
    }
    ......
    return
}

```
