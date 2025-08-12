# Button Component

A versatile button component that provides consistent styling and behavior across the application.

### Purpose

The Button component is the primary interactive element for user actions throughout the application. It provides:
- Consistent visual design and behavior
- Accessibility features built-in
- Multiple variants for different use cases
- Loading and disabled states
- Icon support

**When to use:**
- Primary actions (submit forms, confirm dialogs)
- Secondary actions (cancel, navigate)
- Call-to-action elements

**When NOT to use:**
- For navigation between pages (use Link component instead)
- For toggling states (use Toggle component instead)
- For selecting from options (use Radio/Checkbox instead)

### Props/Parameters

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| children | `React.ReactNode` | Yes | - | Button content (text, icons, etc.) |
| variant | `'primary' \| 'secondary' \| 'danger' \| 'ghost'` | No | `'primary'` | Visual style variant |
| size | `'sm' \| 'md' \| 'lg'` | No | `'md'` | Button size |
| disabled | `boolean` | No | `false` | Whether button is disabled |
| loading | `boolean` | No | `false` | Shows loading spinner and disables interaction |
| icon | `React.ReactNode` | No | - | Icon to display before text |
| iconPosition | `'left' \| 'right'` | No | `'left'` | Position of icon relative to text |
| fullWidth | `boolean` | No | `false` | Whether button takes full width of container |
| type | `'button' \| 'submit' \| 'reset'` | No | `'button'` | HTML button type |
| onClick | `(event: MouseEvent) => void` | No | - | Click event handler |
| className | `string` | No | - | Additional CSS classes |

#### Prop Details

**variant**
- `primary`: Main action button with solid background
- `secondary`: Secondary action with outline style
- `danger`: Destructive actions (delete, remove)
- `ghost`: Minimal styling for subtle actions

**size**
- `sm`: 32px height, compact padding
- `md`: 40px height, standard padding
- `lg`: 48px height, generous padding

### Usage Examples

#### Basic Usage
```tsx
import { Button } from '../components/Button';

<Button onClick={handleClick}>
  Click Me
</Button>
```

#### With Variants
```tsx
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="danger">Delete Item</Button>
<Button variant="ghost">Subtle Action</Button>
```

#### With Icons
```tsx
import { Plus, Save, Trash2 } from 'lucide-react';

<Button icon={<Plus />}>
  Add New
</Button>

<Button icon={<Save />} iconPosition="right">
  Save Changes
</Button>

<Button variant="danger" icon={<Trash2 />}>
  Delete
</Button>
```

#### Loading State
```tsx
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  setIsLoading(true);
  try {
    await submitForm();
  } finally {
    setIsLoading(false);
  }
};

<Button 
  loading={isLoading} 
  onClick={handleSubmit}
>
  {isLoading ? 'Saving...' : 'Save'}
</Button>
```

#### Form Integration
```tsx
<form onSubmit={handleSubmit}>
  <Button type="submit" variant="primary">
    Submit Form
  </Button>
  <Button type="button" variant="secondary" onClick={handleCancel}>
    Cancel
  </Button>
</form>
```

### Styling & Customization

#### CSS Classes
- `.btn-base` - Base button styles
- `.btn-primary` - Primary variant styles
- `.btn-secondary` - Secondary variant styles
- `.btn-danger` - Danger variant styles
- `.btn-ghost` - Ghost variant styles
- `.btn-sm`, `.btn-md`, `.btn-lg` - Size variants
- `.btn-loading` - Loading state styles
- `.btn-disabled` - Disabled state styles

#### Tailwind Classes
```tsx
// Primary button
<Button className="bg-blue-600 hover:bg-blue-700 text-white" />

// Custom styling
<Button className="rounded-full shadow-lg transform hover:scale-105" />

// Full width
<Button fullWidth className="w-full" />
```

### Accessibility Considerations

#### ARIA Attributes
- `aria-disabled="true"` when disabled or loading
- `aria-label` for icon-only buttons
- `aria-describedby` for additional context when needed

#### Keyboard Navigation
- Focusable with Tab key
- Activated with Space or Enter keys
- Focus visible indicator provided
- Disabled buttons are not focusable

#### Screen Reader Support
- Button text is announced clearly
- Loading state announced as "busy"
- Disabled state announced appropriately
- Icon-only buttons require aria-label

#### Color Contrast
- All variants meet WCAG AA contrast requirements (4.5:1)
- Focus indicators have sufficient contrast
- Disabled state maintains readability

### States & Variants

#### Visual States
- **Default**: Normal interactive state
- **Hover**: Subtle color change and elevation
- **Focus**: Clear focus ring for keyboard navigation
- **Active**: Pressed state with slight scale/color change
- **Disabled**: Reduced opacity, no interaction
- **Loading**: Spinner animation, disabled interaction

#### Variants
- **Primary**: `bg-blue-600 hover:bg-blue-700 text-white`
- **Secondary**: `border-gray-300 hover:bg-gray-50 text-gray-700`
- **Danger**: `bg-red-600 hover:bg-red-700 text-white`
- **Ghost**: `hover:bg-gray-100 text-gray-700`

### Edge Cases & Error Handling

#### Common Edge Cases
1. **Very long text**: Text wraps appropriately, button maintains minimum height
2. **Icon without text**: Requires aria-label for accessibility
3. **Rapid clicking**: onClick debounced to prevent double-submission
4. **Loading state**: All interactions disabled, clear visual feedback
5. **Form submission**: Prevents multiple submissions during loading

#### Error Handling
- Invalid props logged to console in development
- Graceful fallback for missing icons
- Default variant applied if invalid variant provided

### Performance Considerations

#### Optimization Techniques
- Component memoized with React.memo
- Icon components lazy-loaded when needed
- CSS-in-JS avoided for better performance

#### Re-render Triggers
- Props changes (variant, size, disabled, loading, children)
- Parent re-renders (unless memoized)

### Testing

#### Unit Tests
```tsx
// Test basic rendering
test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Click me');
});

// Test click handler
test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});

// Test disabled state
test('does not call onClick when disabled', () => {
  const handleClick = jest.fn();
  render(<Button disabled onClick={handleClick}>Click me</Button>);
  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).not.toHaveBeenCalled();
});
```

#### Integration Tests
- Form submission workflows
- Loading state management
- Navigation flows

#### Accessibility Tests
```tsx
// Test keyboard navigation
test('button is focusable and activatable with keyboard', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  const button = screen.getByRole('button');
  button.focus();
  expect(button).toHaveFocus();
  
  fireEvent.keyDown(button, { key: 'Enter' });
  expect(handleClick).toHaveBeenCalled();
});
```

### Browser Support

#### Supported Browsers
- Chrome: 90+
- Firefox: 88+
- Safari: 14+
- Edge: 90+

#### Known Issues
- None currently identified

### Dependencies

#### Internal Dependencies
- None (base component)

#### External Dependencies
- `lucide-react` for icons (optional)
- `clsx` for conditional classes

### Related Components

- **Link**: For navigation actions
- **IconButton**: For icon-only actions
- **Toggle**: For on/off states
- **Dropdown**: For multiple action options

### Changelog

#### Version 1.2.0 (2024-01-15)
- Added `iconPosition` prop
- Improved loading state animation
- Better TypeScript types

#### Version 1.1.0 (2024-01-01)
- Added `ghost` variant
- Improved accessibility
- Added `fullWidth` prop

#### Version 1.0.0 (2023-12-01)
- Initial release
- Basic variants and sizes
- Loading and disabled states

---

## Maintenance Notes

- Last reviewed: 2024-01-15
- Next review due: 2024-04-15
- Maintainer: UI Team
- Status: Stable