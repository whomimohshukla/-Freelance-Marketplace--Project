import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import DocSidebar from './documentation/DocSidebar';
import { DocContent } from './documentation/DocContent';
import { documentationSections } from './documentation/data';
import BackgroundPattern from './help/BackgroundPattern';

const Documentation = () => {
  const { docId = 'introduction' } = useParams();
  
  // Find the current doc content
  let currentDoc = null;
  for (const section of documentationSections) {
    const doc = section.items.find(item => item.path === `/documentation/${docId}`);
    if (doc) {
      currentDoc = doc;
      break;
    }
  }

  // If no matching doc is found, redirect to introduction
  if (!currentDoc) {
    return <Navigate to="/documentation/introduction" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-[72px]">
      <BackgroundPattern />
      
      <div className="relative h-[calc(100vh-72px)] flex">
        {/* Sidebar */}
        <DocSidebar sections={documentationSections} />

        {/* Main Content */}
        <DocContent
          // title={currentDoc.title}
          content={currentDoc.content}
        />
      </div>
    </div>
  );
};

export default Documentation;
