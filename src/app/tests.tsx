import { render, screen } from '@testing-library/react';

test('renders hello world', () => {
  render(<div>Hello World</div>);
  expect(screen.getByText('Hello World')).toBeInTheDocument();
});