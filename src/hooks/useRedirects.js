import { useState, useRef, useCallback } from 'react';
import Redirect from '../models/Redirect';
import { sitesData } from '../config/data';

export function useRedirects() {
  const [formData, setFormData] = useState({
    description: '',
    domain: sitesData[0].site,
    statusCode: 301,
    queryString: '1',
    langValidation: true,
  });
  const [fromUrls, setFromUrls] = useState('');
  const [toUrls, setToUrls] = useState('');
  const [filesGenerated, setFilesGenerated] = useState(false);
  const [, setRenderTrigger] = useState(0);
  const redirectRef = useRef(null);

  const processRedirects = useCallback(() => {
    const { description, domain, statusCode, queryString, langValidation } = formData;
    if (!description.trim()) {
      redirectRef.current = null;
      setRenderTrigger(c => c + 1);
      return;
    }

    const fromLines = fromUrls.trim() ? fromUrls.trim().split('\n') : [];
    const toLines = toUrls.trim() ? toUrls.trim().split('\n') : [];

    if (fromLines.length === 0) {
      redirectRef.current = null;
      setRenderTrigger(c => c + 1);
      return;
    }

    const ticket = description.trim().split(' ')[0];
    const redirect = new Redirect(ticket, description.trim(), domain, langValidation);

    fromLines.forEach((fromUrl, i) => {
      const toUrl = toLines[i] && toLines[i] !== '' ? toLines[i] : '/';
      redirect.addRedirect(
        `redirect-${i + 1}`,
        fromUrl,
        toUrl,
        queryString,
        null, // schemeAndHost is calculated internally
        null, // useRelative is calculated internally
        statusCode,
        langValidation
      );
    });

    redirectRef.current = redirect;
    setRenderTrigger(c => c + 1);
  }, [formData, fromUrls, toUrls]);

  const updateRedirectType = useCallback((id, code) => {
    if (!redirectRef.current) return;
    redirectRef.current.updateRedirect(id, code);
    setRenderTrigger(c => c + 1);
  }, []);

  const updateRedirectQuery = useCallback((id, checked) => {
    if (!redirectRef.current) return;
    redirectRef.current.updateRedirectQuery(id, checked ? 1 : '');
    setRenderTrigger(c => c + 1);
  }, []);

  const isReadyToGenerate = redirectRef.current ? redirectRef.current.readyToGenerate() : false;

  const generate = useCallback(() => {
    if (!redirectRef.current) return null;
    const files = redirectRef.current.generateContent();
    setFilesGenerated(true);
    return { files, redirect: redirectRef.current };
  }, []);

  const clearAll = useCallback(() => {
    setFormData({
      description: '',
      domain: sitesData[0].site,
      statusCode: 301,
      queryString: '1',
      langValidation: true,
    });
    setFromUrls('');
    setToUrls('');
    setFilesGenerated(false);
    redirectRef.current = null;
    setRenderTrigger(c => c + 1);
  }, []);

  return {
    formData,
    setFormData,
    fromUrls,
    setFromUrls,
    toUrls,
    setToUrls,
    redirect: redirectRef.current,
    isReadyToGenerate,
    filesGenerated,
    processRedirects,
    updateRedirectType,
    updateRedirectQuery,
    generate,
    clearAll,
  };
}
