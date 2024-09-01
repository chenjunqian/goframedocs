# ORM - Model Association

## Dynamic Model Associations

Unlike other ORMs that commonly use `BelongsTo`, `HasOne`, `HasMany`, and `ManyToMany` for model associations, `GoFrame`'s `ORM` does not follow this design. Such associations can be cumbersome due to foreign key constraints, additional tag comments, and can add cognitive load for developers. GoFrame, therefore, avoids injecting complex tag content, association properties, or methods into the model structure, aiming to simplify the design and make model associations as easy to understand and use as possible.

## Static Model Association

Usability and maintainability have always been core focuses of Goframe. These aspects differentiate Goframe significantly from other frameworks and components. Unlike other ORMs that use associations like `BelongsTo`, `HasOne`, `HasMany`, and `ManyToMany`, which involve complex maintenance such as foreign key constraints and additional tag annotations, Goframe simplifies the design to reduce developer overhead. The framework avoids injecting complex tags, associations, or methods into model structs, aiming instead for a more understandable and user-friendly model association and query process.

Previously, we introduced the `ScanList` solution. It is recommended to understand the model association - dynamic association - `ScanList` before diving into the `With` feature.

Through project practice, we found that while `ScanList` maintained model associations from a runtime business logic perspective, it didn't simplify maintenance as much as hoped. Therefore, we introduced the `With` feature to provide a simpler way to manage model associations while enhancing overall framework usability and maintainability. The `With` feature can be seen as an improved combination of `ScanList` and model association maintenance.
