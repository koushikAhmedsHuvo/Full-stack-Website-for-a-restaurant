import React from 'react';
import privacyPolicyData from '../../data1.json'; // Adjust the path as needed

const Privacy2 = () => {
  const { title, introText, sections } = privacyPolicyData.privacyPolicy;

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto p-8 rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>
        <p className="text-lg text-gray-700 mb-8">{introText}</p>
        {sections.map((section, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {section.title}
            </h2>
            {section.items ? (
              <ul className="list-disc pl-5 text-gray-700">
                {section.items.map((item, idx) => (
                  <li key={idx} className="mb-2">
                    {item.subtitle && <strong>{item.subtitle}</strong>}{' '}
                    {item.description}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700">{section.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Privacy2;
