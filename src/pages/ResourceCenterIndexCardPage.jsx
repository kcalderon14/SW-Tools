import { useState } from 'react';
import ReadOnlyFieldWithCopy from '../components/ReadOnlyFieldWithCopy';
import CategoryGroup from '../components/CategoryGroup';
import {
  ASSET_TYPE_OPTIONS,
  CATEGORY_GROUPS,
  INDUSTRIES,
  SOLUTIONS,
  DEFAULT_TARGETING_URL,
} from '../config/resourceCenterData';

const selectClass =
  'bg-dark-surface text-white border border-gray-600 rounded px-3 py-2 w-full focus:border-teal focus:outline-none';

export default function ResourceCenterIndexCardPage() {
  const [selectedAssetType, setSelectedAssetType] = useState('');
  const [checkedCategories, setCheckedCategories] = useState({});
  const [checkedIndustries, setCheckedIndustries] = useState(new Set());
  const [checkedSolutions, setCheckedSolutions] = useState(new Set());
  const [generatedResults, setGeneratedResults] = useState(null);

  const toggleInSet = (setter) => (option) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(option)) next.delete(option);
      else next.add(option);
      return next;
    });
  };

  const setAllInSet = (setter) => (options) => {
    setter(new Set(options));
  };

  const setCategoryAll = (subtitle, options) => {
    setCheckedCategories((prev) => ({
      ...prev,
      [subtitle]: new Set(options),
    }));
  };

  const toggleCategory = (subtitle, option) => {
    setCheckedCategories((prev) => {
      const group = new Set(prev[subtitle] || []);
      if (group.has(option)) group.delete(option);
      else group.add(option);
      return { ...prev, [subtitle]: group };
    });
  };

  const matchedAssetType = ASSET_TYPE_OPTIONS.find((opt) => opt.label === selectedAssetType);
  const matchedResult = matchedAssetType ? matchedAssetType.result : '';

  const handleGenerate = () => {
    const results = [];

    // Targeting URL
    results.push({ section: 'Targeting URL', values: [DEFAULT_TARGETING_URL] });

    // Resource Type (derived from Asset Type selection)
    if (selectedAssetType) {
      results.push({
        section: 'Resource Type',
        param: 'resourceType',
        name: 'Resource type',
        values: [selectedAssetType],
        extra: matchedResult ? [{ label: 'Text for URL', value: matchedResult }] : [],
      });
    }

    // Category
    const categoryResults = [];
    CATEGORY_GROUPS.forEach((group) => {
      const checked = checkedCategories[group.subtitle];
      if (checked && checked.size > 0) {
        group.options
          .filter((opt) => checked.has(opt))
          .forEach((opt) => categoryResults.push(group.subtitle + '\\' + opt));
      }
    });
    if (categoryResults.length > 0) {
      results.push({ section: 'Category/product', param: 'product', name: 'Category/product', values: categoryResults });
    }

    // Industries
    const industryResults = INDUSTRIES.filter((opt) => checkedIndustries.has(opt)).map(
      (opt) => 'Industries\\' + opt
    );
    if (industryResults.length > 0) {
      results.push({ section: 'Industries', param: 'industries', name: 'Industries', values: industryResults });
    }

    // Solutions
    const solutionResults = SOLUTIONS.filter((opt) => checkedSolutions.has(opt)).map(
      (opt) => 'Solutions\\' + opt
    );
    if (solutionResults.length > 0) {
      results.push({ section: 'Solutions', param: 'solutions', name: 'Solutions', values: solutionResults });
    }

    setGeneratedResults(results);
  };

  const handleClear = () => {
    setSelectedAssetType('');
    setCheckedCategories({});
    setCheckedIndustries(new Set());
    setCheckedSolutions(new Set());
    setGeneratedResults(null);
  };

  const hasSelections =
    selectedAssetType ||
    Object.values(checkedCategories).some((s) => s.size > 0) ||
    checkedIndustries.size > 0 ||
    checkedSolutions.size > 0;

  return (
    <div className="space-y-6">
      <header className="border-b-2 border-teal pb-3">
        <h1 className="text-3xl font-bold text-white">Builder</h1>
      </header>

      {/* Asset Type Selection */}
      <section className="bg-dark-bg border border-gray-700 rounded-lg p-4 md:p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Asset Type</h2>
        <label className="text-sm font-medium text-gray-300 mb-1 block">Select Asset Type</label>
        <select
          className={selectClass}
          value={selectedAssetType}
          onChange={(event) => setSelectedAssetType(event.target.value)}
        >
          <option value="">Select an asset type...</option>
          {ASSET_TYPE_OPTIONS.map((opt) => (
            <option key={opt.label} value={opt.label}>
              {opt.label}
            </option>
          ))}
        </select>
      </section>

      {/* Categorization */}
      <section className="bg-dark-bg border border-gray-700 rounded-lg p-4 md:p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Categorization</h2>

        <div className="space-y-6">
          {/* Industries & Solutions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-dark-surface border border-gray-700 rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3">Industries</h3>
              <CategoryGroup
                options={INDUSTRIES}
                checkedValues={checkedIndustries}
                onToggle={toggleInSet(setCheckedIndustries)}
                onSetAll={setAllInSet(setCheckedIndustries)}
              />
            </div>

            <div className="bg-dark-surface border border-gray-700 rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3">Solutions</h3>
              <CategoryGroup
                options={SOLUTIONS}
                checkedValues={checkedSolutions}
                onToggle={toggleInSet(setCheckedSolutions)}
                onSetAll={setAllInSet(setCheckedSolutions)}
              />
            </div>
          </div>

          {/* Category */}
          <div className="bg-dark-surface border border-gray-700 rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold text-white mb-3">Category</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {CATEGORY_GROUPS.map((group) => (
                <div
                  key={group.subtitle}
                  className="border border-gray-600 rounded-lg p-3 overflow-hidden"
                >
                  <CategoryGroup
                    subtitle={group.subtitle}
                    options={group.options}
                    checkedValues={checkedCategories[group.subtitle] || new Set()}
                    onToggle={(option) => toggleCategory(group.subtitle, option)}
                    onSetAll={(opts) => setCategoryAll(group.subtitle, opts)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="bg-teal hover:bg-teal-hover text-white font-bold px-6 py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleGenerate}
          disabled={!hasSelections}
        >
          Generate
        </button>
        <button
          type="button"
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-6 py-3 rounded transition-colors"
          onClick={handleClear}
        >
          Clear
        </button>
      </div>

      {/* Results Section */}
      {generatedResults && generatedResults.length > 0 ? (
        <section className="bg-dark-bg border border-gray-700 rounded-lg p-4 md:p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Results</h2>

          <div className="space-y-4">
            {/* Targeting URL */}
            {generatedResults
              .filter((g) => !g.param)
              .map((group) => (
                <div key={group.section} className="bg-dark-surface border border-gray-700 rounded-lg p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-gray-200">{group.section}</h3>
                  {group.values.map((val) => (
                    <ReadOnlyFieldWithCopy key={val} value={val} />
                  ))}
                </div>
              ))}

            {/* Categorization results in grid */}
            {generatedResults.some((g) => g.param) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {generatedResults
                  .filter((g) => g.param)
                  .map((group) => (
                    <div key={group.section} className="bg-dark-surface border border-gray-700 rounded-lg p-4 space-y-3">
                      <h3 className="text-sm font-semibold text-gray-200">
                        {group.section}
                        <span className="ml-2 text-xs font-normal text-gray-400">({group.param})</span>
                      </h3>
                      <ReadOnlyFieldWithCopy label="Parameter Name" value={group.param} />
                      <ReadOnlyFieldWithCopy label="Name" value={group.name} />
                      {group.values.map((val) => (
                        <ReadOnlyFieldWithCopy key={val} value={val} />
                      ))}
                      {group.extra
                        ? group.extra.map((e) => (
                            <ReadOnlyFieldWithCopy key={e.label} label={e.label} value={e.value} />
                          ))
                        : null}
                    </div>
                  ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
