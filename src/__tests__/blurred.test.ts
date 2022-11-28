import { useBlurredBottomScroll } from '../useBlurredBottomScroll';
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-test-renderer';

test('Rendered', () => {
  const { result } = renderHook(() => useBlurredBottomScroll());
  const { blurredElement } = result.current;

  expect(blurredElement).toBeTruthy();
});
