const dataContent = data.content;

if (!dataContent.includes('```') && !dataContent.includes('~~~')) return;
