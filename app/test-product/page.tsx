'use client';

import { useState } from 'react';
import { addProduct } from '@/app/actions/admin';

export default function TestProductCreation() {
  const [status, setStatus] = useState('');
  const [result, setResult] = useState(null);

  const testData = {
    name: 'Test Product',
    slug: 'test-product',
    description: 'A test product for debugging',
    price: 99.99,
    compareAtPrice: 129.99,
    categoryId: 1,
    imageUrl: 'https://example.com/test-image.jpg',
    images: ['https://example.com/test-image.jpg'],
    metalPurity: '18K Gold',
    designNumber: 'TEST-001',
    isFeatured: false,
    isActive: true
  };

  const handleTest = async () => {
    try {
      setStatus('Creating product...');
      const response = await addProduct(testData);
      setResult(response);
      setStatus('Product creation completed');
      console.log('Product creation result:', response);
    } catch (error) {
      console.error('Product creation failed:', error);
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Product Creation</h1>
      <button 
        onClick={handleTest}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Create Test Product
      </button>
      <p className="mt-4">Status: {status}</p>
      {result && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}