import { useEffect, useState } from 'react';
import RedirectForm from '../components/RedirectForm';
import UrlTextareas from '../components/UrlTextareas';
import ResultTable from '../components/ResultTable';
import LocalizationModal from '../components/LocalizationModal';
import NextSteps from '../components/NextSteps';
import { useRedirects } from '../hooks/useRedirects';
import { generateLocVersions } from '../utils/urlFormatter';
import { downloadFile } from '../utils/downloadFile';
import { sitesData } from '../config/data';

export default function RedirectsPage() {
  const {
    formData,
    setFormData,
    fromUrls,
    setFromUrls,
    toUrls,
    setToUrls,
    redirect,
    isReadyToGenerate,
    filesGenerated,
    processRedirects,
    updateRedirectType,
    updateRedirectQuery,
    generate,
    clearAll,
  } = useRedirects();

  const [isLocModalOpen, setIsLocModalOpen] = useState(false);
  const [locTarget, setLocTarget] = useState('from');
  const [locText, setLocText] = useState('');
  const [hasLanguages, setHasLanguages] = useState(false);

  useEffect(() => {
    processRedirects();
  }, [formData, fromUrls, toUrls, processRedirects]);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpenLocModal = (target) => {
    const sourceText = target === 'from' ? fromUrls : toUrls;
    const result = generateLocVersions(sourceText, formData.domain, sitesData);

    setLocTarget(target);
    setLocText(result.text);
    setHasLanguages(result.hasLanguages);
    setIsLocModalOpen(true);
  };

  const handleConfirmLocModal = (text) => {
    if (locTarget === 'from') {
      setFromUrls(text);
    } else {
      setToUrls(text);
    }

    setIsLocModalOpen(false);
  };

  const handleDismissLocModal = () => {
    setIsLocModalOpen(false);
  };

  const handleGenerate = () => {
    const result = generate();
    if (!result) return;

    const { files } = result;
    if (!Array.isArray(files) || files.length === 0) return;
    files.forEach(({ policyName, content }) => {
      downloadFile(policyName + '.csv', content);
    });
  };

  const buttonClass =
    'bg-teal hover:bg-teal-hover text-white font-bold px-6 py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div className="space-y-6">
      <header className="border-b-2 border-teal pb-3">
        <h1 className="text-3xl font-bold text-white">Redirects</h1>
      </header>

      <section className="bg-dark-bg border border-gray-700 rounded-lg p-4 md:p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-dark-surface border border-gray-700 rounded-lg p-4">
            <RedirectForm formData={formData} onChange={handleFormChange} />
          </div>
          <div className="bg-dark-surface border border-gray-700 rounded-lg p-4">
            <UrlTextareas
              fromUrls={fromUrls}
              toUrls={toUrls}
              domain={formData.domain}
              onFromChange={setFromUrls}
              onToChange={setToUrls}
              onOpenLocModal={handleOpenLocModal}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className={buttonClass} onClick={processRedirects}>
            Process
          </button>
          <button
            type="button"
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-6 py-3 rounded transition-colors"
            onClick={clearAll}
          >
            Clear
          </button>
        </div>
      </section>

      {redirect && redirect.info.length > 0 && (
        <section className="bg-dark-bg border border-gray-700 rounded-lg p-4 md:p-6 space-y-4">
          <ResultTable
            redirectInfo={redirect.info}
            onUpdateType={updateRedirectType}
            onUpdateQuery={updateRedirectQuery}
          />

          <div>
            <button
              type="button"
              className={buttonClass}
              onClick={handleGenerate}
              disabled={!isReadyToGenerate}
            >
              Generate
            </button>
          </div>
        </section>
      )}

      <NextSteps isVisible={filesGenerated} />

      <LocalizationModal
        isOpen={isLocModalOpen}
        locText={locText}
        hasLanguages={hasLanguages}
        onConfirm={handleConfirmLocModal}
        onDismiss={handleDismissLocModal}
      />
    </div>
  );
}
