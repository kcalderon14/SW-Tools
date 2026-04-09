import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ReadOnlyFieldWithCopy from '../components/ReadOnlyFieldWithCopy';
import CategoryGroup from '../components/CategoryGroup';
import ResourceCenterIndexCardPage from '../pages/ResourceCenterIndexCardPage';
import {
  ASSET_TYPE_OPTIONS,
  RESOURCE_TYPE_STANDARD,
  RESOURCE_TYPE_VIDEO,
  CATEGORY_GROUPS,
  INDUSTRIES,
  SOLUTIONS,
  DEFAULT_TARGETING_URL,
} from '../config/resourceCenterData';

// --- Config data integrity ---
describe('resourceCenterData config', () => {
  it('has all 13 asset type options with label and result', () => {
    expect(ASSET_TYPE_OPTIONS).toHaveLength(13);
    ASSET_TYPE_OPTIONS.forEach((opt) => {
      expect(opt).toHaveProperty('label');
      expect(opt).toHaveProperty('result');
      expect(opt.label).toBeTruthy();
      expect(opt.result).toBeTruthy();
    });
  });

  it('has 12 standard resource types', () => {
    expect(RESOURCE_TYPE_STANDARD).toHaveLength(12);
  });

  it('has 9 video resource types', () => {
    expect(RESOURCE_TYPE_VIDEO).toHaveLength(9);
  });

  it('has category groups with subtitle and options', () => {
    expect(CATEGORY_GROUPS.length).toBeGreaterThan(0);
    CATEGORY_GROUPS.forEach((g) => {
      expect(g).toHaveProperty('subtitle');
      expect(g).toHaveProperty('options');
      expect(g.options.length).toBeGreaterThan(0);
    });
  });

  it('has industries and solutions arrays', () => {
    expect(INDUSTRIES.length).toBeGreaterThan(0);
    expect(SOLUTIONS.length).toBeGreaterThan(0);
  });

  it('has default targeting URL', () => {
    expect(DEFAULT_TARGETING_URL).toBe('/resources');
  });
});

// --- ReadOnlyFieldWithCopy ---
describe('ReadOnlyFieldWithCopy', () => {
  it('renders value in read-only input', () => {
    render(<ReadOnlyFieldWithCopy value="test value" />);
    const input = screen.getByDisplayValue('test value');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('readOnly');
  });

  it('renders label when provided', () => {
    render(<ReadOnlyFieldWithCopy label="My Label" value="val" />);
    expect(screen.getByText('My Label')).toBeInTheDocument();
  });

  it('hides copy button when value is empty', () => {
    render(<ReadOnlyFieldWithCopy value="" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows copy button when value has content', () => {
    render(<ReadOnlyFieldWithCopy value="something" />);
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
  });
});

// --- CategoryGroup ---
describe('CategoryGroup', () => {
  const options = ['Option A', 'Option B', 'Option C'];

  it('renders all options as checkboxes', () => {
    render(
      <CategoryGroup options={options} checkedValues={new Set()} onToggle={() => {}} />
    );
    options.forEach((opt) => {
      expect(screen.getByText(opt)).toBeInTheDocument();
    });
    expect(screen.getAllByRole('checkbox')).toHaveLength(3);
  });

  it('renders subtitle when provided', () => {
    render(
      <CategoryGroup subtitle="My Group" options={options} checkedValues={new Set()} onToggle={() => {}} />
    );
    expect(screen.getByText('My Group')).toBeInTheDocument();
  });

  it('calls onToggle when checkbox is clicked', () => {
    const onToggle = vi.fn();
    render(
      <CategoryGroup options={options} checkedValues={new Set()} onToggle={onToggle} />
    );
    fireEvent.click(screen.getByText('Option B'));
    expect(onToggle).toHaveBeenCalledWith('Option B');
  });

  it('shows Select All button when onSetAll is provided', () => {
    render(
      <CategoryGroup options={options} checkedValues={new Set()} onToggle={() => {}} onSetAll={() => {}} />
    );
    expect(screen.getByText('Select All')).toBeInTheDocument();
  });

  it('calls onSetAll with all options when Select All is clicked', () => {
    const onSetAll = vi.fn();
    render(
      <CategoryGroup options={options} checkedValues={new Set()} onToggle={() => {}} onSetAll={onSetAll} />
    );
    fireEvent.click(screen.getByText('Select All'));
    expect(onSetAll).toHaveBeenCalledWith(options);
  });

  it('calls onSetAll with empty array when Deselect All is clicked', () => {
    const onSetAll = vi.fn();
    render(
      <CategoryGroup options={options} checkedValues={new Set(options)} onToggle={() => {}} onSetAll={onSetAll} />
    );
    expect(screen.getByText('Deselect All')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Deselect All'));
    expect(onSetAll).toHaveBeenCalledWith([]);
  });

  it('does not show Select All button when onSetAll is not provided', () => {
    render(
      <CategoryGroup options={options} checkedValues={new Set()} onToggle={() => {}} />
    );
    expect(screen.queryByText('Select All')).not.toBeInTheDocument();
  });
});

// --- ResourceCenterIndexCardPage integration ---
describe('ResourceCenterIndexCardPage', () => {
  const renderPage = () =>
    render(
      <MemoryRouter initialEntries={['/builder/resource-center-index-card']}>
        <ResourceCenterIndexCardPage />
      </MemoryRouter>
    );

  it('renders the page header', () => {
    renderPage();
    expect(screen.getByText('Builder')).toBeInTheDocument();
  });

  it('shows targeting URL with default value', () => {
    renderPage();
    expect(screen.getByDisplayValue('/resources')).toBeInTheDocument();
  });

  it('renders asset type dropdown', () => {
    renderPage();
    expect(screen.getByText('Select an asset type...')).toBeInTheDocument();
  });

  it('shows Text for URL when asset type is selected', () => {
    renderPage();
    // Find the asset type select (first select on the page)
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'Brochure' } });
    expect(screen.getByDisplayValue('Read Brochure')).toBeInTheDocument();
  });

  it('renders resource type dropdown with optgroups', () => {
    renderPage();
    expect(screen.getByText('Select a resource type...')).toBeInTheDocument();
  });

  it('renders categorization sections', () => {
    renderPage();
    expect(screen.getAllByText('Resource Type').length).toBeGreaterThan(0);
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Industries')).toBeInTheDocument();
    expect(screen.getByText('Solutions')).toBeInTheDocument();
  });

  it('renders Generate and Clear buttons', () => {
    renderPage();
    expect(screen.getByText('Generate')).toBeInTheDocument();
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('Generate button is disabled when nothing is selected', () => {
    renderPage();
    expect(screen.getByText('Generate')).toBeDisabled();
  });

  it('Generate button enables when asset type is selected', () => {
    renderPage();
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'Video' } });
    expect(screen.getByText('Generate')).not.toBeDisabled();
  });

  it('generates results when Generate is clicked', () => {
    renderPage();
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'Datasheet' } });
    fireEvent.click(screen.getByText('Generate'));
    expect(screen.getByText('Results')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('View Datasheet').length).toBeGreaterThan(0);
  });

  it('Clear resets all selections and results', () => {
    renderPage();
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'Report' } });
    fireEvent.click(screen.getByText('Generate'));
    expect(screen.getByText('Results')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Clear'));
    expect(screen.queryByText('Results')).not.toBeInTheDocument();
    expect(screen.getByText('Generate')).toBeDisabled();
  });

  it('generates resource type result for standard selection', () => {
    renderPage();
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[1], { target: { value: 'Brochure' } });
    fireEvent.click(screen.getByText('Generate'));

    const resultsHeading = screen.getByRole('heading', { name: 'Results' });
    const resultsSection = resultsHeading.closest('section');
    expect(resultsSection).not.toBeNull();
    expect(within(resultsSection).getByDisplayValue('Brochure')).toBeInTheDocument();
  });

  it('generates resource type result with Video prefix for video selection', () => {
    renderPage();
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[1], { target: { value: 'Product Walkthrough' } });
    fireEvent.click(screen.getByText('Generate'));
    expect(screen.getByDisplayValue('Video\\Product Walkthrough')).toBeInTheDocument();
  });

  it('generates industry results for checked industries', () => {
    renderPage();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Education' }));
    fireEvent.click(screen.getByText('Generate'));
    expect(screen.getByDisplayValue('Industries\\Education')).toBeInTheDocument();
  });

  it('generates solution results for checked solutions', () => {
    renderPage();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Observability' }));
    fireEvent.click(screen.getByText('Generate'));
    expect(screen.getByDisplayValue('Solutions\\Observability')).toBeInTheDocument();
  });
});
