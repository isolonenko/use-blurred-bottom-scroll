# use-blurred-bottom-scroll

# Get started

```
npm i use-blurred-bottom-scroll

```

# Usage exmaple

```typescript

export const SomeListComponent = props => {
  const { handleScrollNode, blurredElement } = useBlurredBottomScroll();

  return (
    <div>
      <div ref={handleScrollNode}>
        {props.listItems.map(item => (
          <p>{item.image}</p>
        ))}
      </div>
      {blurredElement}
    </div>
  );
};
  
```
