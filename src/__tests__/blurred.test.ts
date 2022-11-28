import { useBlurredBottomScroll } from '../useBlurredBottomScroll';
import { renderHook } from '@testing-library/react-hooks';

test('Rendered', () => {
  const { result } = renderHook(() => useBlurredBottomScroll());

  expect(result.current).toBeTruthy();
});
