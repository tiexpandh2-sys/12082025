# Modal Component

A flexible modal dialog component for displaying content in an overlay that requires user interaction.

### Purpose

The Modal component provides a way to display content in a layer above the main application, typically for:
- Confirmations and alerts
- Forms and data entry
- Detailed information display
- Image galleries or media viewers

**When to use:**
- Critical information that requires immediate attention
- Forms that shouldn't navigate away from current context
- Confirmation dialogs for destructive actions
- Detailed views that don't warrant a new page

**When NOT to use:**
- Simple notifications (use Toast instead)
- Navigation menus (use Dropdown instead)
- Non-critical information that can be inline
- Mobile-first designs where full-screen is better

### Props/Parameters

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| isOpen | `boolean` | Yes | - | Controls modal visibility |
| onClose | `() => void` | Yes | - | Callback when modal should close |
| title | `string` | No | - | Modal title displayed in header |
| children | `React.ReactNode` | Yes | - | Modal content |
| size | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | No | `'md'` | Modal size |
| closeOnOverlayClick | `boolean` | No | `true` | Whether clicking overlay closes modal |
| closeOnEscape | `boolean` | No | `true` | Whether Escape key closes modal |
| showCloseButton | `boolean` | No | `true` | Whether to show X close button |
| preventScroll | `boolean` | No | `true` | Whether to prevent body scroll when open |
| className | `string` | No | - | Additional CSS classes for modal content |
| overlayClassName | `string` | No | - | Additional CSS classes for overlay |

#### Prop Details

**size**
- `sm`: 400px max width
- `md`: 500px max width  
- `lg`: 700px max width
- `xl`: 900px max width
- `full`: Full screen modal

### Usage Examples

#### Basic Modal
```tsx
import { Modal } from '../components/Modal';
import { useState } from 'react';

const [isOpen, setIsOpen] = useState(false);

<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
>
  <p>Are you sure you want to delete this item?</p>
  <div className="flex justify-end space-x-2 mt-4">
    <Button variant="secondary" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button variant="danger" onClick={handleDelete}>
      Delete
    </Button>
  </div>
</Modal>
```

#### Form Modal
```tsx
<Modal 
  isOpen={showForm} 
  onClose={() => setShowForm(false)}
  title="Add New User"
  size="lg"
>
  <form onSubmit={handleSubmit}>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input 
          type="text" 
          className="w-full border rounded-md px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input 
          type="email" 
          className="w-full border rounded-md px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
    </div>
    <div className="flex justify-end space-x-2 mt-6">
      <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
        Cancel
      </Button>
      <Button type="submit" variant="primary">
        Save User
      </Button>
    </div>
  </form>
</Modal>
```

#### Custom Styling
```tsx
<Modal 
  isOpen={isOpen}
  onClose={onClose}
  className="bg-gradient-to-br from-blue-50 to-indigo-100"
  overlayClassName="bg-black/70"
  closeOnOverlayClick={false}
>
  <div className="text-center p-6">
    <h2 className="text-2xl font-bold mb-4">Custom Modal</h2>
    <p>This modal has custom styling and behavior.</p>
  </div>
</Modal>
```

### Styling & Customization

#### CSS Classes
- `.modal-overlay` - Backdrop overlay
- `.modal-container` - Modal positioning container
- `.modal-content` - Main modal content area
- `.modal-header` - Header section with title and close button
- `.modal-body` - Main content area
- `.modal-close` - Close button styles

#### Size Classes
- `.modal-sm` - Small modal (400px)
- `.modal-md` - Medium modal (500px)
- `.modal-lg` - Large modal (700px)
- `.modal-xl` - Extra large modal (900px)
- `.modal-full` - Full screen modal

#### Animation Classes
- `.modal-enter` - Entry animation
- `.modal-exit` - Exit animation

### Accessibility Considerations

#### ARIA Attributes
- `role="dialog"` on modal content
- `aria-modal="true"` to indicate modal state
- `aria-labelledby` pointing to title element
- `aria-describedby` for additional context if needed

#### Keyboard Navigation
- **Escape**: Closes modal (if `closeOnEscape` is true)
- **Tab**: Cycles through focusable elements within modal
- **Shift+Tab**: Reverse tab order
- Focus trapped within modal while open

#### Screen Reader Support
- Modal title announced when opened
- Focus moved to modal when opened
- Focus returned to trigger element when closed
- Background content marked as inert

#### Focus Management
```tsx
// Focus management example
useEffect(() => {
  if (isOpen) {
    // Focus first focusable element
    const firstFocusable = modalRef.current?.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();
  }
}, [isOpen]);
```

### States & Variants

#### Visual States
- **Closed**: Not visible, no DOM presence
- **Opening**: Fade-in animation with backdrop
- **Open**: Fully visible and interactive
- **Closing**: Fade-out animation

#### Behavioral Variants
- **Dismissible**: Can be closed by user actions
- **Persistent**: Requires explicit action to close
- **Blocking**: Prevents interaction with background

### Edge Cases & Error Handling

#### Common Edge Cases
1. **Rapid open/close**: Debounced to prevent animation conflicts
2. **Long content**: Scrollable content area with fixed header
3. **Mobile viewport**: Responsive sizing and positioning
4. **Multiple modals**: Z-index management and focus handling
5. **Form validation**: Prevents closing with unsaved changes

#### Error Handling
- Graceful fallback if animation library fails
- Console warnings for accessibility violations
- Default close behavior if onClose not provided

### Performance Considerations

#### Optimization Techniques
- Portal rendering to avoid z-index issues
- Lazy mounting - only renders when open
- Event listener cleanup on unmount
- Body scroll lock management

#### Re-render Triggers
- `isOpen` prop changes
- Content changes
- Size prop changes

### Testing

#### Unit Tests
```tsx
// Test modal opening
test('opens modal when isOpen is true', () => {
  render(
    <Modal isOpen={true} onClose={jest.fn()} title="Test Modal">
      <p>Modal content</p>
    </Modal>
  );
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByText('Test Modal')).toBeInTheDocument();
});

// Test close functionality
test('calls onClose when close button clicked', () => {
  const onClose = jest.fn();
  render(
    <Modal isOpen={true} onClose={onClose} title="Test Modal">
      <p>Modal content</p>
    </Modal>
  );
  fireEvent.click(screen.getByLabelText('Close modal'));
  expect(onClose).toHaveBeenCalled();
});

// Test escape key
test('closes modal when escape key pressed', () => {
  const onClose = jest.fn();
  render(
    <Modal isOpen={true} onClose={onClose} title="Test Modal">
      <p>Modal content</p>
    </Modal>
  );
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(onClose).toHaveBeenCalled();
});
```

#### Integration Tests
- Form submission within modals
- Navigation after modal actions
- Multiple modal scenarios

### Browser Support

#### Supported Browsers
- Chrome: 90+
- Firefox: 88+
- Safari: 14+
- Edge: 90+

#### Known Issues
- iOS Safari: Viewport height issues with keyboard
- Firefox: Focus outline customization limitations

### Dependencies

#### Internal Dependencies
- Portal component for rendering
- FocusTrap utility for accessibility

#### External Dependencies
- `react-dom` for portal functionality
- `focus-trap-react` for focus management

### Related Components

- **Dialog**: For simple confirmation dialogs
- **Drawer**: For side-panel content
- **Toast**: For non-blocking notifications
- **Popover**: For contextual information

### Changelog

#### Version 2.1.0 (2024-01-15)
- Added `preventScroll` prop
- Improved mobile responsiveness
- Better focus management

#### Version 2.0.0 (2024-01-01)
- **Breaking**: Changed size prop values
- Added full-screen variant
- Improved accessibility
- Better TypeScript support

#### Version 1.0.0 (2023-12-01)
- Initial release
- Basic modal functionality
- Accessibility features

---

## Maintenance Notes

- Last reviewed: 2024-01-15
- Next review due: 2024-04-15
- Maintainer: UI Team
- Status: Stable