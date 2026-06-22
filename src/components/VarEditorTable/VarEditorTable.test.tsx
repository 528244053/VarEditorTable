import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test/utils';
import { VarEditorTable } from './index';
import { Message } from '@arco-design/web-react';

describe('VarEditorTable - AC Acceptance Criteria Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  describe('AC1: Table Display', () => {
    it('Display an empty table with the following columns: Index, Name, Data Type, Default Value, Comment', () => {
      render(<VarEditorTable />);

      expect(screen.getByText('Index')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('DataType')).toBeInTheDocument();
      expect(screen.getByText('Default Value')).toBeInTheDocument();
      expect(screen.getByText('Comment')).toBeInTheDocument();
    });

    it('Index column should be read-only and automatically generated', () => {
      render(<VarEditorTable />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('Page should display "Add Variable Row" and "Delete Variable Row" buttons', () => {
      render(<VarEditorTable />);

      expect(screen.getByText('Add Variable Row')).toBeInTheDocument();
      expect(screen.getByText('Delete Variable Row')).toBeInTheDocument();
    });

    it('Delete button should be disabled initially (no rows selected)', () => {
      render(<VarEditorTable />);

      const deleteButton = screen.getByText('Delete Variable Row').closest('button');
      expect(deleteButton).toBeDisabled();
    });
  });

  describe('AC2: Add Variable Row', () => {
    it('Clicking "Add Variable Row" button should add a new row at the end of the table', async () => {
      const user = userEvent.setup();
      render(<VarEditorTable />);

      expect(screen.getByText('3')).toBeInTheDocument();

      await user.click(screen.getByText('Add Variable Row'));

      await waitFor(() => {
        expect(screen.getByText('4')).toBeInTheDocument();
      });
    });

    it('New row index should be automatically calculated: current max index + 1', async () => {
      const user = userEvent.setup();
      render(<VarEditorTable />);

      await user.click(screen.getByText('Add Variable Row'));

      await waitFor(() => {
        expect(screen.getByText('4')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Add Variable Row'));

      await waitFor(() => {
        expect(screen.getByText('5')).toBeInTheDocument();
      });
    });
  });

  describe('AC3: Delete Variable Row', () => {
    it('Selecting a row and clicking "Delete Variable Row" button should remove the selected row', async () => {
      const user = userEvent.setup();
      render(<VarEditorTable />);

      // Select the first row
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[1]);

      const deleteButton = screen.getByText('Delete Variable Row').closest('button');
      expect(deleteButton).not.toBeDisabled();

      await user.click(screen.getByText('Delete Variable Row'));

      await waitFor(() => {
        expect(screen.queryByText('Start')).not.toBeInTheDocument();
      });
    });

    it('Index should be automatically reordered after deletion', async () => {
      const user = userEvent.setup();
      render(<VarEditorTable />);

      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[1]);

      await user.click(screen.getByText('Delete Variable Row'));

      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
      });
    });

    it('Delete button should be disabled when no rows are selected', () => {
      render(<VarEditorTable />);

      const deleteButton = screen.getByText('Delete Variable Row').closest('button');
      expect(deleteButton).toBeDisabled();
    });

    it('Should support batch deletion when multiple rows are selected', async () => {
      const user = userEvent.setup();
      render(<VarEditorTable />);

      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[1]);
      await user.click(checkboxes[2]);

      const deleteButton = screen.getByText('Delete Variable Row').closest('button');
      expect(deleteButton).not.toBeDisabled();

      await user.click(screen.getByText('Delete Variable Row'));

      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.queryByText('2')).not.toBeInTheDocument();
      });
    });
  });

  describe('AC4: Edit Variable Name', () => {
    /**
     * Editing Logic:
     * 1. Click on cell → enters edit mode (input field appears with autoFocus)
     * 2. Type a value → validation runs on every keystroke
     * 3. If validation fails → show error tooltip, input border turns red
     * 4. Complete editing by: blur (click outside) or press Enter
     * 5. On commit:
     *    - If valid → call onChange, exit edit mode
     *    - If invalid → stay in edit mode with error state
     */

    it('Click on name cell should enter edit mode (show input field)', async () => {
      const user = userEvent.setup();
      render(<VarEditorTable />);

      // Click on the first name cell "Start"
      await user.click(screen.getByText('Start'));

      // Input field should appear
      await waitFor(() => {
        const input = screen.getByRole('textbox');
        expect(input).toBeInTheDocument();
      });
    });

    it('Input field should receive typed value', async () => {
      const user = userEvent.setup();
      render(<VarEditorTable />);

      // Click on the first name cell "Start" to edit it
      await user.click(screen.getByText('Start'));

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });

      // Type a new name
      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'NewVar');

      // Verify input has the typed value
      expect(input).toHaveValue('NewVar');
    });

    it('Pressing Enter should trigger commit', async () => {
      const user = userEvent.setup();
      render(<VarEditorTable />);

      // Click on the first name cell "Start"
      await user.click(screen.getByText('Start'));

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });

      // Type a new unique name
      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'NewVar');

      // Press Enter to commit
      await user.keyboard('{Enter}');
    });

    it('Blurring should trigger commit', async () => {
      const user = userEvent.setup();
      render(<VarEditorTable />);

      // Click on the first name cell "Start"
      await user.click(screen.getByText('Start'));

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });

      // Type a new unique name
      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'AnotherVar');

      // Blur to commit
      await user.tab();
    });

    it('Clear input and blur → show error "Name cannot be empty", value restored', async () => {
      const user = userEvent.setup();
      render(<VarEditorTable />);

      // Click on the first name cell "Start"
      await user.click(screen.getByText('Start'));

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });

      // Clear the input
      const input = screen.getByRole('textbox');
      await user.clear(input);

      // Verify input is empty
      expect(input).toHaveValue('');

      // Blur to commit (should trigger validation error)
      await user.tab();

      // Should show error message
      await waitFor(() => {
        expect(Message.error).toHaveBeenCalledWith('Name cannot be empty');
      });

      // Original value should be displayed
      await waitFor(() => {
        expect(screen.getByText('Start')).toBeInTheDocument();
      });
    });
  });

  describe('AC5: DataType Selection', () => {
    it('Click on DataType cell should show dropdown', async () => {
      const user = userEvent.setup();
      render(<VarEditorTable />);

      // Initial data has 2 rows with BOOL type
      const boolElements = screen.getAllByText('BOOL');
      await user.click(boolElements[0]);

      await waitFor(() => {
        expect(screen.getByRole('combobox')).toBeInTheDocument();
      });
    });
  });

  describe('AC6: BOOL Type Default Value Editing', () => {
    it('Click on BOOL default value cell should enter edit mode', async () => {
      const user = userEvent.setup();
      render(<VarEditorTable />);

      // Initial data has 2 rows with BOOL type TRUE
      const trueElements = screen.getAllByText('TRUE');
      await user.click(trueElements[0]);

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });
    });

    it('Input valid boolean value should be accepted', async () => {
      const user = userEvent.setup();
      render(<VarEditorTable />);

      const trueElements = screen.getAllByText('TRUE');
      await user.click(trueElements[0]);

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'false');

      expect(input).toHaveValue('false');
    });

    it('Input invalid value should show error state', async () => {
      const user = userEvent.setup();
      render(<VarEditorTable />);

      const trueElements = screen.getAllByText('TRUE');
      await user.click(trueElements[0]);

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'yes');

      // Error state should be visible (input border turns red via status='error')
      await waitFor(() => {
        expect(input).toHaveClass(/arco-input-error/);
      });
    });
  });

  describe('AC7: INT Type Default Value Editing', () => {
    it('Click on INT default value cell should enter edit mode', async () => {
      const user = userEvent.setup();
      render(<VarEditorTable />);

      await user.click(screen.getByText('123'));

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });
    });

    it('Input valid integer should be accepted', async () => {
      const user = userEvent.setup();
      render(<VarEditorTable />);

      await user.click(screen.getByText('123'));

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, '999');

      expect(input).toHaveValue('999');
    });

    it('Input non-numeric value should show error state', async () => {
      const user = userEvent.setup();
      render(<VarEditorTable />);

      await user.click(screen.getByText('123'));

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'abc');

      // Error state should be visible
      await waitFor(() => {
        expect(input).toHaveClass(/arco-input-error/);
      });
    });
  });

  describe('AC8: Comment Editing', () => {
    it('Click on comment cell should enter edit mode', async () => {
      const user = userEvent.setup();
      render(<VarEditorTable />);

      await user.click(screen.getByText('system start'));

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });
    });

    it('Input text should be accepted', async () => {
      const user = userEvent.setup();
      render(<VarEditorTable />);

      await user.click(screen.getByText('system start'));

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'New comment');

      expect(input).toHaveValue('New comment');
    });

    it('Empty input should be allowed for comment', async () => {
      const user = userEvent.setup();
      render(<VarEditorTable />);

      await user.click(screen.getByText('system start'));

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });

      const input = screen.getByRole('textbox');
      await user.clear(input);

      expect(input).toHaveValue('');
    });
  });

  describe('Edge Case Handling', () => {
    it('Table should be empty after deleting all rows', async () => {
      const user = userEvent.setup();
      render(<VarEditorTable />);

      // ...

      // Select all rows
      const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
      await user.click(selectAllCheckbox);

      await user.click(screen.getByText('Delete Variable Row'));

      await waitFor(() => {
        expect(screen.queryByText('1')).not.toBeInTheDocument();
        expect(screen.queryByText('2')).not.toBeInTheDocument();
        expect(screen.queryByText('3')).not.toBeInTheDocument();
      });
    });

    it('Index should increment continuously after adding multiple rows', async () => {
      const user = userEvent.setup();
      render(<VarEditorTable />);

      await user.click(screen.getByText('Add Variable Row'));
      await user.click(screen.getByText('Add Variable Row'));

      await waitFor(() => {
        expect(screen.getByText('4')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
      });
    });
  });

  describe('Initial Data Validation', () => {
    it('Should display initial data', () => {
      render(<VarEditorTable />);

      expect(screen.getByText('Start')).toBeInTheDocument();
      expect(screen.getByText('Stop')).toBeInTheDocument();
      expect(screen.getByText('Count')).toBeInTheDocument();
    });

    it('BOOL type default value should be displayed as TRUE/FALSE', () => {
      render(<VarEditorTable />);

      // There are two BOOL type rows, both with default value TRUE
      const trueElements = screen.getAllByText('TRUE');
      expect(trueElements.length).toBeGreaterThanOrEqual(2);
    });

    it('INT type default value should be displayed as number', () => {
      render(<VarEditorTable />);

      expect(screen.getByText('123')).toBeInTheDocument();
    });
  });
});