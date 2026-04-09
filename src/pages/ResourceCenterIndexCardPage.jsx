import { useState } from 'react';
import ReadOnlyFieldWithCopy from '../components/ReadOnlyFieldWithCopy';
import CategoryGroup from '../components/CategoryGroup';
import {
  ASSET_TYPE_OPTIONS,
  RESOURCE_TYPE_STANDARD,
  RESOURCE_TYPE_VIDEO,
  CATEGORY_GROUPS,
  INDUSTRIES,
  SOLUTIONS,
  DEFAULT_TARGETING_URL,
} from '../config/resourceCenterData';

const selectClass =
  'bg-dark-surface text-white border border-gray-600 rounded px-3 py-2 w-full focus:border-teal focus:outline-none';

export default function ResourceCenterIndexCardPage() {
  const [selectedAssetType, setSelectedAssetType] = useState('');
  const [selectedResourceType, setSelectedResourceType] = useState('');
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

    // Asset Type
    if (matchedResult) {
      results.push({ section: 'Text for URL', values: [matchedResult] });
    }

    // Resource Type
    if (selectedResourceType) {
      const isVideo = RESOURCE_TYPE_VIDEO.includes(selectedResourceType);
      const resourceValue = isVideo ? 'Video\\' + selectedResourceType : selectedResourceType;
      results.push({
        section: 'Resource Type',
        param: 'resourceType',
        values: [resourceValue],
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
      results.push({ section: 'Category/product', param: 'product', values: categoryResults });
    }

    // Industries
    const industryResults = INDUSTRIES.filter((opt) => checkedIndustries.has(opt)).map(
      (opt) => 'Industries\\' + opt
    );
    if (industryResults.length > 0) {
      results.push({ section: 'Industries', param: 'industries', values: industryResults });
    }

    // Solutions
    const solutionResults = SOLUTIONS.filter((opt) => checkedSolutions.has(opt)).map(
      (opt) => 'Solutions\\' + opt
    );
    if (solutionResults.length > 0) {
      results.push({ section: 'Solutions', param: 'solutions', values: solutionResults });
    }

    setGeneratedResults(results);
  };

  const handleClear = () => {
    setSelectedAssetType('');
    setSelectedResourceType('');
    setCheckedCategories({});
    setCheckedIndustries(new Set());
    setCheckedSolutions(new Set());
    setGeneratedResults(null);
  };

  const hasSelections =
    selectedAssetType ||
    selectedResourceType ||
    Object.values(checkedCategories).some((s) => s.size > 0) ||
    checkedIndustries.size > 0 ||
    checkedSolutions.size > 0;

  return (
    <div className="space-y-6">
      <header className="border-b-2 border-teal pb-3">
        <h1 className="text-3xl font-bold text-white">Builder</h1>
      </header>

      {/* Section A + B: Targeting URL & Asset Type side by side */}
      <section className="bg-dark-bg border border-gray-700 rounded-lg p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Targeting URL</h2>
            <ReadOnlyFieldWithCopy label="Targeting URL" value={DEFAULT_TARGETING_URL} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Asset Type</h2>
            <label className="text-sm font-medium text-gray-300 mb-1 block">Asset Type</label>
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

            {matchedResult ? (
              <div className="mt-4">
                <ReadOnlyFieldWithCopy label="Text for URL" value={matchedResult} />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Section C: Categorization */}
      <section className="bg-dark-bg border border-gray-700 rounded-lg p-4 md:p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Categorization</h2>

        <div className="space-y-6">
          {/* Resource Type */}
          <div className="bg-dark-surface border border-gray-700 rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold text-white mb-3">Resource Type</h3>
            <ReadOnlyFieldWithCopy label="Parameter Name" value="resourceType" />
            <ReadOnlyFieldWithCopy label="Name" value="Resource type" />

            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">Resource Type</label>
              <select
                className={selectClass}
                value={selectedResourceType}
                onChange={(event) => setSelectedResourceType(event.target.value)}
              >
                <option value="">Select a resource type...</option>
                <optgroup label="Standard">
                  {RESOURCE_TYPE_STANDARD.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </optgroup>
                <optgroup label="Video">
                  {RESOURCE_TYPE_VIDEO.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Category */}
          <div className="bg-dark-surface border border-gray-700 rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold text-white mb-3">Category</h3>
            <ReadOnlyFieldWithCopy label="Parameter Name" value="product" />
            <ReadOnlyFieldWithCopy label="Name" value="Category/product" />

            <div className="space-y-4">
              {CATEGORY_GROUPS.map((group) => (
                <div
                  key={group.subtitle}
                  className="border border-gray-600 rounded-lg p-3"
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

          {/* Industries & Solutions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-dark-surface border border-gray-700 rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3">Industries</h3>
              <ReadOnlyFieldWithCopy label="Parameter Name" value="industries" />
              <ReadOnlyFieldWithCopy label="Name" value="Industries" />

              <CategoryGroup
                options={INDUSTRIES}
                checkedValues={checkedIndustries}
                onToggle={toggleInSet(setCheckedIndustries)}
                onSetAll={setAllInSet(setCheckedIndustries)}
              />
            </div>

            <div className="bg-dark-surface border border-gray-700 rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3">Solutions</h3>
              <ReadOnlyFieldWithCopy label="Parameter Name" value="solutions" />
              <ReadOnlyFieldWithCopy label="Name" value="Solutions" />

              <CategoryGroup
                options={SOLUTIONS}
                checkedValues={checkedSolutions}
                onToggle={toggleInSet(setCheckedSolutions)}
                onSetAll={setAllInSet(setCheckedSolutions)}
              />
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

          <div className="space-y-6">
            {generatedResults.map((group) => (
              <div key={group.section} className="bg-dark-surface border border-gray-700 rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-semibold text-gray-200">
                  {group.section}
                  {group.param ? (
                    <span className="ml-2 text-xs font-normal text-gray-400">({group.param})</span>
                  ) : null}
                </h3>
                {group.values.map((val) => (
                  <ReadOnlyFieldWithCopy key={val} value={val} />
                ))}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
