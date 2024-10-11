# Pagination Management

Pagination management is implemented by the `gpage` module, which provides powerful dynamic and static pagination features and offers developers a high degree of flexibility for custom pagination styles.

> The `gpage` module is mainly used to generate pagination HTML code and is commonly used in MVC development scenarios.

***Usage***

```go
import "github.com/gogf/gf/v2/util/gpage"
```

***API Documentation***

[https://pkg.go.dev/github.com/gogf/gf/v2/util/gpage](https://pkg.go.dev/github.com/gogf/gf/v2/util/gpage)

***Pagination Object***

```go
// Page is the pagination implementer.
// All the attributes are public, you can change them when necessary.
type Page struct {
    TotalSize      int    // Total size.
    TotalPage      int    // Total page, which is automatically calculated.
    CurrentPage    int    // Current page number >= 1.
    UrlTemplate    string // Custom url template for page url producing.
    LinkStyle      string // CSS style name for HTML link tag <a>.
    SpanStyle      string // CSS style name for HTML span tag <span>, which is used for first, current and last page tag.
    SelectStyle    string // CSS style name for HTML select tag <select>.
    NextPageTag    string // Tag name for next p.
    PrevPageTag    string // Tag name for prev p.
    FirstPageTag   string // Tag name for first p.
    LastPageTag    string // Tag name for last p.
    PrevBarTag     string // Tag string for prev bar.
    NextBarTag     string // Tag string for next bar.
    PageBarNum     int    // Page bar number for displaying.
    AjaxActionName string // Ajax function name. Ajax is enabled if this attribute is not empty.
}
```

## Creating Pagination Objects

Since pagination objects are often used in `web` services, starting from framework `version v1.12`, we provide a more convenient way to create pagination objects. The pagination object is integrated into the `ghttp.Request` object and can be easily obtained through the `Request.GetPage` method. The method is defined as follows:

```go
func (r *Request) GetPage(totalSize, pageSize int) *gpage.Page
```

It can be seen that obtaining a pagination object only requires passing the total number and the number of pages. Of course, the pagination object can also be used independently. Due to space limitations, we only introduce the most common and simplest method of use here.

For specific usage examples, please refer to later sections.

## Predefined Pagination Styles

The `GetContent` method provides predefined common pagination styles for developers to use quickly. When the predefined styles do not meet the developers' needs, developers can use public methods to customize pagination styles (or method overloading to achieve customization), or they can use regular replacements to specify parts of the predefined pagination styles to achieve customization.

For specific usage examples, please refer to later sections.

## Using Ajax Pagination Features

The `AjaxActionName` property of the pagination object is used to give an Ajax method name for implementing Ajax pagination. However, it is important to note that the Ajax method name needs to be agreed upon by both the front and back ends, and the Ajax method should have only one URL parameter. The following is a client-side definition example of an Ajax method:

```javascript
function DoAjax(url) {
    // Here, read the content of the URL and display it according to business logic
}
```

For specific usage examples, please refer to later sections.
