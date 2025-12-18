'use client';

import { useState, useEffect } from 'react';

export default function TestShiprocket() {
  const [status, setStatus] = useState('Checking...');
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    const testShiprocketIntegration = async () => {
      try {
        setStatus('Testing Shiprocket integration...');
        
        // Test 1: Check if tables exist
        const tableCheck = await fetch('/api/check-db-tables');
        const tableData = await tableCheck.json();
        
        // Test 2: Try to get pickup locations
        const pickupCheck = await fetch('/api/shiprocket/pickup-locations');
        const pickupData = await pickupCheck.json();
        
        // Test 3: Try to get couriers
        const courierCheck = await fetch('/api/shiprocket/couriers');
        const courierData = await courierCheck.json();
        
        setResults({
          tables: tableData,
          pickup: pickupData,
          couriers: courierData
        });
        
        setStatus('All tests completed successfully!');
      } catch (error) {
        console.error('Test failed:', error);
        setStatus(`Test failed: ${error.message}`);
      }
    };
    
    testShiprocketIntegration();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Shiprocket Integration Test</h1>
      <p className="mb-4">Status: {status}</p>
      
      {results && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Database Tables</h2>
            <pre className="bg-gray-100 p-4 rounded">
              {JSON.stringify(results.tables, null, 2)}
            </pre>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold">Pickup Locations</h2>
            <pre className="bg-gray-100 p-4 rounded">
              {JSON.stringify(results.pickup, null, 2)}
            </pre>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold">Couriers</h2>
            <pre className="bg-gray-100 p-4 rounded">
              {JSON.stringify(results.couriers, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}