export const generateCode = async (dsaType, language, prompt) => {
  const backendPort = import.meta.env.VITE_BACKEND_PORT || '3000';
  const response = await fetch(`http://localhost:${backendPort}/dsa/generate-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      dsaType,
      language,
      prompt,
    }),
  });
  return response;
};
